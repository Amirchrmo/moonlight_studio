# Deployment Instructions — Vite/React App on Docker + Nginx Proxy Manager + Cloudflare + Let's Encrypt

> **Reusable deployment prompt.** Copy everything below the line and paste it as a new task.
> Replace the placeholders before sending: `<PROJECT_NAME>`, `<DOMAIN>`, `<WWW_DOMAIN>` (usually `www.<DOMAIN>`), and `<APP_TYPE>`.

---

## TASK

Deploy the `<APP_TYPE>` application **`<PROJECT_NAME>`** onto my server and serve it over HTTPS at `<DOMAIN>` and `<WWW_DOMAIN>`.

Server credentials and connection details are stored in the **`.sshpw`** file in the project root. Read it and use it to connect. The server IP is **5.57.39.207**.

I will configure Cloudflare DNS myself, but you must tell me the **exact** records to create.

### Server architecture (already in place — do NOT change it)
- Ubuntu 24.04 host. Everything runs in **Docker**.
- **Nginx Proxy Manager (NPM)** container (`nginx-proxy-manager`, image `jc21/nginx-proxy-manager:latest`) is the front reverse proxy, bound to host ports **80, 81 (admin/API), 443**. It lives on the **`proxy-net`** Docker network.
- Each website = its own `nginx:1.27-alpine` container on the `proxy-net` network. NPM routes traffic to each container by `server_name`.
- Existing sites to NEVER break: **`comodeconcept.ir`**, **`bergeerd.ir`** (and any other site already on the server).
- Existing NPM proxy hosts: id 1 = comodeconcept.ir → `comode-nginx:80`; id 4 = bergeerd.ir → `bergeerd-nginx:80`. SSL on these uses custom Let's Encrypt certs (cert ids 27 and 29) with `ssl_forced`, `hsts_enabled`, `http2_support` all ON.

Follow the **exact same conventions** used by `bergeerd.ir` / `comodeconcept.ir`.

### Interaction model (mandatory — stop and wait at each checkpoint)
1. Deploy + configure the app and NPM proxy host (HTTP only). Then STOP and tell me the Cloudflare DNS records.
2. Wait for my confirmation ("DNS done") before doing anything with SSL.
3. Run Certbot DNS-01. Give me **STAGE 1** TXT record. STOP and wait for "STAGE 1 done".
4. After my confirmation, generate **STAGE 2** TXT record (for www). STOP and wait for "STAGE 2 done".
5. Only then issue the cert, import it into NPM, enable HTTPS + Force SSL, and fully verify.

Do NOT batch these steps. Each ⏸ is a hard stop where you must wait for my reply.

---

## STEP 0 — Connect & inspect (do this first, before any change)

1. Read `.sshpw` to get the password, SSH port (3939), and username (root).
2. Connect with `sshpass`:
   ```bash
   sshpass -p '<PASSWORD>' ssh -o StrictHostKeyChecking=no -o ConnectTimeout=20 -p 3939 root@5.57.39.207 '<command>'
   ```
3. Inspect and confirm the architecture:
   - `cat /etc/os-release | head -3`
   - `docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"`
   - `docker network ls`
   - Confirm `proxy-net` exists and NPM is running.
   - Inspect an existing site to mirror conventions:
     - `cat /opt/bergeerd/docker-compose.yml`
     - `cat /opt/bergeerd/nginx/default.conf`
     - `cat /opt/nginx-proxy-manager/data/nginx/proxy_host/4.conf` (bergeerd, to learn SSL shape)
4. Get NPM admin credentials if needed (DB):
   - Admin email is in the `user` table.
   - If the password isn't known, ASK me. Auth flow (note: use a payload file to avoid shell-escaping):
     ```bash
     cat > /tmp/npm_login.json <<JSON
     {"identity":"<NPM_EMAIL>","secret":"<NPM_PASSWORD>"}
     JSON
     TOKEN=$(docker run --rm --network proxy-net -v /tmp/npm_login.json:/p.json:ro curlimages/curl:8.10.1 \
       -sS -X POST http://nginx-proxy-manager:81/api/tokens -H "Content-Type: application/json" -d @/p.json \
       | grep -o '"token":"[^"]*"' | cut -d\" -f4)
     ```
   - sqlite access (NPM container has no sqlite binary; use a throwaway container):
     ```bash
     docker run --rm -v /opt/nginx-proxy-manager/data:/db:ro keinos/sqlite3:latest sqlite3 -header /db/database.sqlite \
       "SELECT id, domain_names, forward_host, forward_port, ssl_forced, certificate_id, is_deleted FROM proxy_host;"
     ```
5. Create a todo list and track every step.

## STEP 1 — Build & deploy (HTTP only)

1. **Build the app locally** in the project directory:
   ```bash
   npm ci --no-audit --no-fund   # or: npm install --no-audit --no-fund
   npm run build
   ```
   Confirm `dist/` exists and contains `index.html` + `assets/`.
2. **Create the server deployment structure** at `/opt/<PROJECT_NAME>/` (mirror `/opt/bergeerd/`):
   ```
   /opt/<PROJECT_NAME>/
   ├── docker-compose.yml
   ├── nginx/default.conf
   └── web/                # contents of dist/ (index.html at root, assets/, etc.)
   ```
3. **Upload files** with `scp` — IMPORTANT: scp uses **capital `-P`** for the port (lowercase `-p` is preserve-timestamps and silently falls back to port 22, which times out):
   ```bash
   sshpass -p '<PASSWORD>' scp -o StrictHostKeyChecking=no -P 3939 deploy/docker-compose.yml root@5.57.39.207:/opt/<PROJECT_NAME>/docker-compose.yml
   sshpass -p '<PASSWORD>' scp -o StrictHostKeyChecking=no -P 3939 deploy/nginx/default.conf root@5.57.39.207:/opt/<PROJECT_NAME>/nginx/default.conf
   sshpass -p '<PASSWORD>' scp -o StrictHostKeyChecking=no -P 3939 -r dist/assets dist/index.html root@5.57.39.207:/opt/<PROJECT_NAME>/web/
   ```
4. **`docker-compose.yml`** (static SPA; if the app has a backend API, copy the api+nginx pattern from bergeerd instead):
   ```yaml
   services:
     nginx:
       image: nginx:1.27-alpine
       container_name: <PROJECT_NAME>-nginx
       restart: unless-stopped
       expose:
         - "80"
       volumes:
         - ./web:/usr/share/nginx/html:ro
         - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
       networks:
         - proxy-net
         - <PROJECT_NAME>_internal

   networks:
     proxy-net:
       external: true
     <PROJECT_NAME>_internal:
       driver: bridge
   ```
5. **`nginx/default.conf`** for a client-side-router SPA:
   ```nginx
   server {
       listen 80;
       server_name _;
       client_max_body_size 20m;

       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

       root /usr/share/nginx/html;
       index index.html;

       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
           try_files $uri =404;
       }

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
   (If it's NOT an SPA — e.g. plain static — drop the `/index.html` fallback to `try_files $uri $uri/ =404;`.)
6. **Start the container:**
   ```bash
   cd /opt/<PROJECT_NAME> && docker compose up -d
   ```
7. **Verify within `proxy-net`** (this is how NPM will reach it). The NPM container has no curl/wget, so use a throwaway curl container on `proxy-net`:
   ```bash
   docker run --rm --network proxy-net curlimages/curl:8.10.1 \
     -sS -o /dev/null -w "HTTP %{http_code} | size=%{size_download}\n" http://<PROJECT_NAME>-nginx:80/
   # SPA fallback:
   docker run --rm --network proxy-net curlimages/curl:8.10.1 -sS -o /dev/null -w "HTTP %{http_code}\n" http://<PROJECT_NAME>-nginx:80/<some-spa-route>
   # assets / images MIME:
   docker run --rm --network proxy-net curlimages/curl:8.10.1 -sS -o /dev/null -w "HTTP %{http_code} | %{content_type}\n" http://<PROJECT_NAME>-nginx:80/assets/<file>.js
   ```
   All must be HTTP 200.

## STEP 2 — Create NPM Proxy Host (HTTP, no SSL yet)

1. Authenticate (token flow above).
2. Create the proxy host via the NPM API. Use a payload file to avoid escaping. **Valid fields only** (extra fields cause HTTP 400 "additional properties"):
   ```bash
   cat > /tmp/npm_proxy.json <<JSON
   {
     "domain_names": ["<DOMAIN>", "<WWW_DOMAIN>"],
     "forward_scheme": "http",
     "forward_host": "<PROJECT_NAME>-nginx",
     "forward_port": 80,
     "allow_websocket_upgrade": true,
     "block_exploits": true,
     "caching_enabled": false,
     "ssl_forced": false,
     "hsts_enabled": false,
     "http2_support": false,
     "certificate_id": 0,
     "meta": { "letsencrypt_agree": false, "dns_challenge": false }
   }
   JSON
   docker run --rm --network proxy-net -v /tmp/npm_proxy.json:/p.json:ro curlimages/curl:8.10.1 \
     -sS -X POST http://nginx-proxy-manager:81/api/nginx/proxy-hosts \
     -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d @/p.json
   ```
   Record the returned proxy host **id** (e.g. `id:5`).
3. **Verify through the full NPM chain** on `localhost:80`:
   ```bash
   docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "HTTP %{http_code}\n" -H "Host: <DOMAIN>" http://127.0.0.1:80/
   docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "HTTP %{http_code}\n" -H "Host: <WWW_DOMAIN>" http://127.0.0.1:80/
   ```
   Both must be 200.
4. **Safety check — existing sites still respond** (their normal behavior; comode/bergeerd return HTTP 301 because they force SSL):
   ```bash
   docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "comode %{http_code}\n" -H "Host: comodeconcept.ir" http://127.0.0.1:80/
   docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "bergeerd %{http_code}\n" -H "Host: bergeerd.ir" http://127.0.0.1:80/
   ```
   If either is NOT its normal code (301), STOP and investigate before continuing.

⏸ **STOP HERE.** Tell me the Cloudflare DNS records below and wait for my confirmation.

**Cloudflare records to give me (DNS Only / grey cloud):**
| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `<DOMAIN>` (apex) | `5.57.39.207` | DNS Only |
| CNAME | `www` | `<DOMAIN>` | DNS Only |

Also tell me the domain's nameservers must already point to Cloudflare. Do NOT proceed to SSL until I reply "DNS done".

---

## STEP 3 — SSL via Certbot + Let's Encrypt (DNS-01 manual challenge)

Only begin after I confirm DNS is live. This uses the **same manual-hook technique** as the existing sites.

### 3a. Verify DNS propagation before starting
```bash
dig +short A <DOMAIN> @1.1.1.1     # must return 5.57.39.207
dig +short A <WWW_DOMAIN> @1.1.1.1 # must resolve to the apex IP
```

### 3b. Create per-project auth/cleanup hooks
The existing hook **overwrites** the file on each call, which loses values when 2 domains are requested. Create **append**-mode hooks specific to this project so both challenge values are captured:
```bash
# /root/<PROJECT_NAME>-auth-hook.sh  (APPENDS each challenge)
#!/bin/bash
DOMAIN="${CERTBOT_DOMAIN/\*./}"
echo "DOMAIN=${DOMAIN}" >> /root/<PROJECT_NAME>-challenge.txt
echo "TXT_NAME=_acme-challenge.${DOMAIN}" >> /root/<PROJECT_NAME>-challenge.txt
echo "TXT_VALUE=${CERTBOT_VALIDATION}" >> /root/<PROJECT_NAME>-challenge.txt
echo "----" >> /root/<PROJECT_NAME>-challenge.txt
echo "DNS challenge appended for ${DOMAIN}" >&2
echo "Waiting for /root/<PROJECT_NAME>-go signal file..." >&2
for i in $(seq 1 360); do
    if [ -f /root/<PROJECT_NAME>-go ]; then
        echo "Go signal received!" >&2
        rm -f /root/<PROJECT_NAME>-go
        sleep 5
        exit 0
    fi
    sleep 5
done
echo "ERROR: Timed out waiting for go signal" >&2
exit 1
```
```bash
# /root/<PROJECT_NAME>-cleanup-hook.sh
#!/bin/bash
DOMAIN="${CERTBOT_DOMAIN/\*./}"
echo "CLEANUP: delete TXT _acme-challenge.${DOMAIN}" >&2
exit 0
```
`chmod +x` both. Remove any stale challenge/go files: `rm -f /root/<PROJECT_NAME>-challenge.txt /root/<PROJECT_NAME>-go`.

### 3c. Launch certbot in the BACKGROUND
```bash
nohup certbot certonly --manual --preferred-challenges dns \
  --manual-auth-hook /root/<PROJECT_NAME>-auth-hook.sh \
  --manual-cleanup-hook /root/<PROJECT_NAME>-cleanup-hook.sh \
  -d <DOMAIN> -d <WWW_DOMAIN> \
  --agree-tos --no-eff-email --email <NPM_EMAIL> --non-interactive \
  > /root/<PROJECT_NAME>-certbot.log 2>&1 &
```
Wait ~8s, then read `/root/<PROJECT_NAME>-challenge.txt`. It will contain the **root-domain** challenge first.

⏸ **STOP.** Give me STAGE 1 TXT record:
| Type | Name | Content | Proxy |
|---|---|---|---|
| TXT | `_acme-challenge.<DOMAIN>` | `<the CERTBOT_VALIDATION value>` | DNS Only |
Wait for "STAGE 1 done".

### 3d. STAGE 1 → validate + reveal www challenge
After my confirmation:
1. Verify propagation: `dig +short TXT _acme-challenge.<DOMAIN> @1.1.1.1` must equal the value.
2. Send the go signal: `touch /root/<PROJECT_NAME>-go`
3. Wait ~12s, re-read the challenge file — it will now contain a SECOND block for `_acme-challenge.<WWW_DOMAIN>`.

⏸ **STOP.** Give me STAGE 2 TXT record (`_acme-challenge.<WWW_DOMAIN>` → its own NEW value). Wait for "STAGE 2 done".

**CRITICAL:** Each TXT value is freshly generated by Let's Encrypt per domain and **must NEVER be reused** or copied from another project. Always read the actual value certbot produced.

### 3e. STAGE 2 → issue certificate
After my confirmation:
1. Verify: `dig +short TXT _acme-challenge.<WWW_DOMAIN> @1.1.1.1` equals the value.
2. `touch /root/<PROJECT_NAME>-go`
3. Wait ~25s; confirm `Successfully received certificate` in the log.
4. Confirm files exist at `/etc/letsencrypt/live/<DOMAIN>/` (`fullchain.pem`, `privkey.pem`) and check expiry/SAN:
   ```bash
   openssl x509 -in /etc/letsencrypt/live/<DOMAIN>/fullchain.pem -noout -enddate -subject -ext subjectAltName
   ```

## STEP 4 — Import certificate into NPM

The NPM API multipart import is unreliable in this build (it stores empty meta). Use the **proven manual method** (how comode/bergeerd were done) — both on-disk files AND a DB row:

1. Find the next free cert id, then place files at `/opt/nginx-proxy-manager/data/custom_ssl/npm-<ID>/`:
   ```bash
   ID=<next free cert id>
   mkdir -p /opt/nginx-proxy-manager/data/custom_ssl/npm-$ID
   cp -L /etc/letsencrypt/live/<DOMAIN>/fullchain.pem /opt/nginx-proxy-manager/data/custom_ssl/npm-$ID/fullchain.pem
   cp -L /etc/letsencrypt/live/<DOMAIN>/privkey.pem   /opt/nginx-proxy-manager/data/custom_ssl/npm-$ID/privkey.pem
   chmod 644 /opt/nginx-proxy-manager/data/custom_ssl/npm-$ID/fullchain.pem
   chmod 600 /opt/nginx-proxy-manager/data/custom_ssl/npm-$ID/privkey.pem
   ```
2. Build the meta JSON and insert the DB row (meta MUST contain `certificate` + `certificate_key`):
   ```python
   # /tmp/build_meta.py
   import json
   cert = open("/etc/letsencrypt/live/<DOMAIN>/fullchain.pem").read()
   key  = open("/etc/letsencrypt/live/<DOMAIN>/privkey.pem").read()
   json.dump({"certificate": cert, "certificate_key": key}, open("/tmp/meta_value.json","w"))
   ```
   ```python
   # /tmp/insert_cert.py
   import sqlite3, json, time
   meta = open("/tmp/meta_value.json").read()
   db = "/opt/nginx-proxy-manager/data/database.sqlite"
   now = time.strftime("%Y-%m-%d %H:%M:%S")
   con = sqlite3.connect(db); cur = con.cursor()
   cur.execute("""INSERT INTO certificate
     (created_on, modified_on, owner_user_id, is_deleted, provider, nice_name, domain_names, expires_on, meta)
     VALUES (?,?,?,?,?,?,?,?,?)""",
     (now, now, 1, 0, "other", "<DOMAIN> LE Cert",
      json.dumps(["<DOMAIN>","<WWW_DOMAIN>"]), "<EXPIRY from openssl>", meta))
   con.commit()
   for r in cur.execute("SELECT id, provider, nice_name, domain_names, length(meta) FROM certificate WHERE is_deleted=0"): print(r)
   ```
   Run with `python3`. Record the returned **certificate id**.

## STEP 5 — Attach cert to the Proxy Host + enable HTTPS

1. PUT-update the proxy host to attach the cert and turn on SSL (mirror bergeerd/comode: `ssl_forced`, `hsts_enabled`, `http2_support` all ON):
   ```bash
   cat > /tmp/npm_update.json <<JSON
   {
     "domain_names": ["<DOMAIN>", "<WWW_DOMAIN>"],
     "forward_scheme": "http",
     "forward_host": "<PROJECT_NAME>-nginx",
     "forward_port": 80,
     "allow_websocket_upgrade": true,
     "block_exploits": true,
     "caching_enabled": false,
     "ssl_forced": true,
     "hsts_enabled": true,
     "hsts_subdomains": false,
     "http2_support": true,
     "certificate_id": <CERT_ID>
   }
   JSON
   docker run --rm --network proxy-net -v /tmp/npm_update.json:/p.json:ro curlimages/curl:8.10.1 \
     -sS -X PUT http://nginx-proxy-manager:81/api/nginx/proxy-hosts/<PROXY_HOST_ID> \
     -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d @/p.json
   ```
   Confirm the response shows `"nginx_online":true,"nginx_err":null`.
2. Verify the generated conf has the SSL block:
   ```bash
   grep -E "listen 443 ssl|ssl_certificate|server_name" /opt/nginx-proxy-manager/data/nginx/proxy_host/<PROXY_HOST_ID>.conf
   ```

## STEP 6 — Full HTTPS verification (use proper SNI, not a bare Host header)

Testing HTTPS against `127.0.0.1` with only a `Host:` header gives "TLS unrecognized name" (no SNI) even on healthy sites. **Always use `--resolve` so SNI is sent correctly:**
```bash
# root domain
docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null \
  -w "HTTPS <DOMAIN> -> %{http_code} ssl=%{ssl_verify_result}\n" \
  https://<DOMAIN>/ --resolve <DOMAIN>:443:127.0.0.1 -k --max-time 15
# www
docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "HTTPS www -> %{http_code}\n" \
  https://<WWW_DOMAIN>/ --resolve <WWW_DOMAIN>:443:127.0.0.1 -k --max-time 15
# SPA route
docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "SPA route -> %{http_code}\n" \
  https://<DOMAIN>/<route> --resolve <DOMAIN>:443:127.0.0.1 -k --max-time 15
# assets MIME (JS, CSS) and images
docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "asset -> %{http_code} %{content_type}\n" \
  https://<DOMAIN>/assets/<file>.js --resolve <DOMAIN>:443:127.0.0.1 -k --max-time 15
# HTTP -> HTTPS redirect
docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null \
  -w "HTTP -> %{http_code} redirect=%{redirect_url}\n" -H "Host: <DOMAIN>" http://127.0.0.1/ --max-time 15
# cert issuer/SAN
docker run --rm --network host curlimages/curl:8.10.1 -sS -v https://<DOMAIN>/ \
  --resolve <DOMAIN>:443:127.0.0.1 -k --max-time 15 2>&1 | grep -iE "subject:|issuer:|SSL connection"
```
All must be 200; redirect must be 301 → `https://<DOMAIN>/`; issuer must be Let's Encrypt; subject CN must be `<DOMAIN>`.

### Final safety check — existing sites unaffected
```bash
docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "comode %{http_code}\n" \
  https://comodeconcept.ir/ --resolve comodeconcept.ir:443:127.0.0.1 -k --max-time 15
docker run --rm --network host curlimages/curl:8.10.1 -sS -o /dev/null -w "bergeerd %{http_code}\n" \
  https://bergeerd.ir/ --resolve bergeerd.ir:443:127.0.0.1 -k --max-time 15
```
Both must remain 200. If anything regressed, ROLL BACK the new proxy host / cert before reporting.

## STEP 7 — Cleanup & summary
- Remove temp files: `/tmp/npm_*.json`, `/tmp/*_payload.json`, `/tmp/*.py`, `/tmp/*.pem`, and any orphan `npm-<deleted_id>` dirs in `custom_ssl/`.
- Tell me: cert id, proxy host id, expiry date, and the **renewal note** — because this is a manual DNS-01 cert, renewal is not fully automatic; ~30 days before expiry, repeat the certbot DNS-01 process and re-import the renewed cert. Mention a Cloudflare-API DNS plugin as the automation option.

---

## SAFETY RULES (always)
- Never edit the NPM container, the `proxy-net` network, or existing `/opt/comode`, `/opt/bergeerd` dirs.
- Never reuse TXT challenge values — Let's Encrypt generates fresh ones each run; read them from the certbot output/hook file.
- Never test HTTPS with a bare `Host:` header against 127.0.0.1 — use `--resolve` for correct SNI.
- scp port flag is **`-P`** (capital), ssh port flag is **`-p`** (lowercase).
- After every change, re-verify that comodeconcept.ir and bergeerd.ir still respond 200 over HTTPS.

## PLACEHOLDERS TO FILL IN
- `<PROJECT_NAME>` — e.g. moonlight (used for container/dir names: `<PROJECT_NAME>-nginx`, `/opt/<PROJECT_NAME>/`)
- `<DOMAIN>` — e.g. moonlightstudioo.ir
- `<WWW_DOMAIN>` — e.g. www.moonlightstudioo.ir
- `<APP_TYPE>` — e.g. Vite/React SPA | static site | SPA + Go API (if it has a backend, follow bergeerd's api+nginx pattern instead of the static one)
- `<NPM_EMAIL>` / `<NPM_PASSWORD>` — NPM admin credentials (ask me if unknown)
- `<PROXY_HOST_ID>`, `<CERT_ID>`, `<EXPIRY>` — discovered/created during the run
