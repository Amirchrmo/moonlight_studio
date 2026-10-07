#!/usr/bin/env bash
# Smoke-test the live site: HTTPS, redirects, certificate expiry, SPA routes,
# assets and images.   Usage: npm run check:prod  [-- https://other.domain]
set -uo pipefail

URL="${1:-https://moonlightstudioo.ir}"
DOMAIN="${URL#https://}"; DOMAIN="${DOMAIN%%/*}"
WARN_DAYS=14
failures=0

ok()   { printf '  \033[32m✔\033[0m %s\n' "$*"; }
bad()  { printf '  \033[31m✖\033[0m %s\n' "$*"; failures=$((failures + 1)); }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }

expect() { # expect <label> <wanted-code> <curl args...>
  local label="$1" want="$2"; shift 2
  local got
  got="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$@" 2>&1)"
  [[ "$got" == "$want" ]] && ok "$label → $got" || bad "$label → $got (expected $want)"
}

echo "Checking $URL"

# Certificate
end="$(echo | timeout 15 openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)"
if [[ -z "$end" ]]; then
  bad "TLS handshake failed for $DOMAIN"
else
  days=$(( ($(date -d "$end" +%s) - $(date +%s)) / 86400 ))
  if (( days < WARN_DAYS )); then warn "certificate expires in $days days ($end)"; else ok "certificate valid for $days days"; fi
fi

# HTTPS + redirects
expect "https://$DOMAIN/"            200 "https://$DOMAIN/"
expect "https://www.$DOMAIN/"        200 "https://www.$DOMAIN/"
expect "http://$DOMAIN/ (redirect)"  301 "http://$DOMAIN/"

# SPA routes (deep links must serve index.html)
for r in /portfolio /about /contact; do expect "route $r" 200 "$URL$r"; done

# Assets referenced by the live index.html
html="$(curl -sS --max-time 20 "$URL/")"
for a in $(grep -oE '/assets/[^"]+\.(js|css)' <<<"$html" | sort -u); do expect "asset $a" 200 "$URL$a"; done
grep -q 'fonts.googleapis.com\|picsum.photos' <<<"$html" && bad "index.html still references external fonts/images" || ok "no external font/image hosts in index.html"

# Images: one generated image + static files
js="$(grep -oE '/assets/index-[^"]+\.js' <<<"$html" | head -1)"
img="$(curl -sS --max-time 20 "$URL$js" | grep -oE '/img/[^"]+\.webp' | head -1)"
if [[ -n "$img" ]]; then
  expect "image $img" 200 "$URL$img"
  cc="$(curl -sSI --max-time 20 "$URL$img" | grep -i '^cache-control' | tr -d '\r')"
  [[ "$cc" == *immutable* ]] && ok "images cached immutably" || warn "image cache header: ${cc:-none}"
else
  bad "could not find an /img/ reference in the JS bundle"
fi
# Static files must be real files, not the SPA's index.html fallback.
for f in /logo.png /favicon.svg /og-image.jpg; do
  got="$(curl -sS -o /dev/null -w '%{http_code} %{content_type}' --max-time 20 "$URL$f")"
  [[ "$got" == 200\ image/* ]] && ok "file $f → $got" || bad "file $f → $got (expected 200 image/*)"
done

hsts="$(curl -sSI --max-time 20 "$URL/" | grep -i '^strict-transport-security' | tr -d '\r')"
[[ -n "$hsts" ]] && ok "HSTS: ${hsts#*: }" || warn "no HSTS header"

echo
if (( failures )); then echo "✖ $failures check(s) failed"; exit 1; fi
echo "✔ All checks passed"
