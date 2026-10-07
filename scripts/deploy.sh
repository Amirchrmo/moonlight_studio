#!/usr/bin/env bash
# Moonlight Studio — build & deploy to production.
#
#   npm run deploy                 build + upload a new release + switch to it
#   bash scripts/deploy.sh rollback   switch back to the previous release
#   bash scripts/deploy.sh status     show releases on the server
#
# Server layout (/opt/moonlight):
#   releases/<id>/        one directory per deploy (contents of dist/)
#   releases/current  ->  active release (switched atomically; no restart)
#   nginx/default.conf    container nginx config   (from deploy/nginx/)
#   docker-compose.yml    container definition     (from deploy/)
#   acme/                 Let's Encrypt HTTP-01 webroot
#   backups/<ts>/         copy of the config files replaced by each deploy
#
# Connection uses your SSH key. Override with env vars if needed:
#   DEPLOY_HOST DEPLOY_PORT DEPLOY_USER DEPLOY_DIR KEEP_RELEASES SITE_URL
set -euo pipefail

HOST="${DEPLOY_HOST:-5.57.39.207}"
PORT="${DEPLOY_PORT:-3939}"
USER_="${DEPLOY_USER:-root}"
DIR="${DEPLOY_DIR:-/opt/moonlight}"
KEEP="${KEEP_RELEASES:-5}"
SITE_URL="${SITE_URL:-https://moonlightstudioo.ir}"
CONTAINER="moonlight-nginx"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SSH=(ssh -p "$PORT" -o ConnectTimeout=20 -o BatchMode=yes "$USER_@$HOST")
remote() { "${SSH[@]}" "$@"; }
step() { printf '\n\033[1;35m▸ %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31m✖ %s\033[0m\n' "$*" >&2; exit 1; }

# Point releases/current at a release id (atomic rename of a temp symlink).
switch_to() {
  remote "cd '$DIR/releases' && ln -sfn '$1' .current.tmp && mv -T .current.tmp current"
}

# Container-side check over the Docker network, the same path the proxy uses.
internal_check() {
  remote "docker run --rm --network proxy-net curlimages/curl:8.10.1 -fsS -o /dev/null -w '%{http_code}' http://$CONTAINER/" 2>/dev/null
}

case "${1:-deploy}" in
status)
  remote "cd '$DIR/releases' && ls -1 | grep -v '^current$' | sort; echo; echo -n 'current -> '; readlink current"
  exit 0
  ;;
rollback)
  step "Rolling back"
  prev="$(remote "cd '$DIR/releases' && cur=\$(readlink current); ls -1d 20*/ | tr -d / | sort | grep -B1 -x \"\$cur\" | head -1")"
  cur="$(remote "readlink '$DIR/releases/current'")"
  [[ -n "$prev" && "$prev" != "$cur" ]] || fail "No older release to roll back to (current: $cur)"
  switch_to "$prev"
  echo "current: $cur → $prev"
  bash scripts/check-prod.sh "$SITE_URL"
  exit 0
  ;;
deploy) ;;
*) fail "Unknown command '$1' (use: deploy | rollback | status)" ;;
esac

# ---------------------------------------------------------------------------
step "Pre-flight"
remote true || fail "Cannot SSH to $USER_@$HOST:$PORT (is your key loaded?)"
if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  echo "⚠  Working tree has uncommitted changes — deploying them anyway."
fi
REL="$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
echo "release: $REL → $USER_@$HOST:$DIR"

step "Build"
[[ -d node_modules ]] || npm ci --no-audit --no-fund
npm run build
[[ -f dist/index.html ]] || fail "dist/index.html missing after build"

step "Validate nginx config"
remote "mkdir -p /tmp/moonlight-deploy"
scp -q -P "$PORT" deploy/nginx/default.conf deploy/docker-compose.yml "$USER_@$HOST:/tmp/moonlight-deploy/"
remote "docker run --rm -v /tmp/moonlight-deploy/default.conf:/etc/nginx/conf.d/default.conf:ro nginx:1.27-alpine nginx -t -q" \
  || fail "nginx config test failed — nothing changed on the server"

step "Upload release"
remote "mkdir -p '$DIR/releases' '$DIR/acme' '$DIR/nginx' '$DIR/backups'"
# Hard-link unchanged files (e.g. hashed images) from the current release: fast + small.
LINK_DEST=()
if remote "test -e '$DIR/releases/current'"; then LINK_DEST=(--link-dest="$DIR/releases/current/"); fi
rsync -az --delete "${LINK_DEST[@]}" -e "ssh -p $PORT -o BatchMode=yes" dist/ "$USER_@$HOST:$DIR/releases/$REL/"
remote "test -f '$DIR/releases/$REL/index.html'" || fail "Upload incomplete"

step "Install config (previous copies → backups/)"
TS="$(date +%Y%m%d-%H%M%S)"
CONFIG_CHANGED="$(remote "
  set -e; cd '$DIR'; changed=0
  mkdir -p backups/$TS
  for f in docker-compose.yml nginx/default.conf; do
    src=/tmp/moonlight-deploy/\$(basename \$f)
    if ! cmp -s \"\$src\" \"\$f\"; then
      [ -f \"\$f\" ] && cp -a \"\$f\" backups/$TS/
      cp \"\$src\" \"\$f\"; changed=1
    fi
  done
  rmdir backups/$TS 2>/dev/null || true
  echo \$changed")"

PREV="$(remote "readlink '$DIR/releases/current' 2>/dev/null || true")"
switch_to "$REL"

if [[ "$CONFIG_CHANGED" == "1" ]]; then
  echo "config changed → recreating container"
  remote "cd '$DIR' && docker compose up -d --force-recreate --remove-orphans"
  sleep 2
else
  echo "config unchanged"
fi

step "Health check"
code="$(internal_check || true)"
if [[ "$code" != "200" ]]; then
  echo "internal check returned '$code'"
  if [[ -n "$PREV" ]]; then
    switch_to "$PREV"
    fail "Deploy failed health check — rolled back to $PREV (config backups in $DIR/backups/$TS)"
  fi
  fail "Deploy failed health check"
fi
echo "container: HTTP $code"

step "Prune old releases (keep $KEEP)"
remote "cd '$DIR/releases' && cur=\$(readlink current) && ls -1d 20*/ | tr -d / | sort | head -n -$KEEP | grep -vx \"\$cur\" | xargs -r rm -rf; ls -1d 20*/ | tr -d /"

step "Public checks"
bash scripts/check-prod.sh "$SITE_URL"

printf '\n\033[1;32m✔ Deployed %s\033[0m  (rollback: bash scripts/deploy.sh rollback)\n' "$REL"
