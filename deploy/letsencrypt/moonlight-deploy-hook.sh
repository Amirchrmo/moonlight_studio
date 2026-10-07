#!/usr/bin/env bash
# Installed on the server as /etc/letsencrypt/renewal-hooks/deploy/moonlight-npm-sync.sh
#
# After certbot renews moonlightstudioo.ir, copy the new cert into Nginx Proxy
# Manager's custom cert slot (npm-31, used by proxy host #5) and reload NPM.
#
# Renewal itself is automatic via certbot.timer using HTTP-01:
#   authenticator = webroot, webroot_path = /opt/moonlight/acme
# The moonlight-nginx container serves /.well-known/acme-challenge/ from there
# (see deploy/nginx/default.conf), so no manual DNS step is needed.
set -euo pipefail

[ "${RENEWED_LINEAGE:-}" = "/etc/letsencrypt/live/moonlightstudioo.ir" ] || exit 0

DST=/opt/nginx-proxy-manager/data/custom_ssl/npm-31
mkdir -p "$DST"
cp -L "$RENEWED_LINEAGE/fullchain.pem" "$DST/fullchain.pem"
cp -L "$RENEWED_LINEAGE/privkey.pem" "$DST/privkey.pem"
chmod 600 "$DST/privkey.pem"

docker exec nginx-proxy-manager nginx -t && docker exec nginx-proxy-manager nginx -s reload
logger -t moonlight-cert "Renewed cert synced to NPM npm-31 and nginx reloaded"
