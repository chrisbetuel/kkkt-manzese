#!/usr/bin/env bash
# Deploy KKKT Manzese to the Hostinger VPS (same box as works.oweru.com).
#
#   Usage:   bash deploy.sh
#
# Auth: SSH key ~/.ssh/id_ed25519_contractms as root (the key you added in
# hPanel -> SSH Access lands on root). Password auth is disabled on the VPS.
set -euo pipefail

SSH_HOST="${KKKT_SSH_HOST:-31.97.176.48}"
SSH_USER="${KKKT_SSH_USER:-root}"
SSH_KEY="${KKKT_SSH_KEY:-$HOME/.ssh/id_ed25519_contractms}"
DOMAIN="${KKKT_DOMAIN:-kkkt.oweru.com}"
# Document root. Override with KKKT_REMOTE_DIR if the panel uses another path.
REMOTE_DIR="${KKKT_REMOTE_DIR:-/home/chriss/domains/${DOMAIN}/public_html}"
TARGET="${SSH_USER}@${SSH_HOST}"

CTL="$(mktemp -u)"
SSH_OPTS=(-i "${SSH_KEY}" -o IdentitiesOnly=yes -o ControlMaster=auto \
  -o "ControlPath=${CTL}" -o ControlPersist=120 -o StrictHostKeyChecking=accept-new)
cleanup() { ssh "${SSH_OPTS[@]}" -O exit "${TARGET}" 2>/dev/null || true; }
trap cleanup EXIT
rsh() { ssh "${SSH_OPTS[@]}" "${TARGET}" "$@"; }

echo "==> Building"
npm run build

echo "==> Connecting to ${TARGET}"
rsh "true"   # fails fast if the key isn't authorised

echo "==> Preparing ${REMOTE_DIR}"
rsh "mkdir -p '${REMOTE_DIR}'"

echo "==> Uploading dist/"
if command -v rsync >/dev/null 2>&1; then
  rsync -az --delete --exclude '.git' -e "ssh ${SSH_OPTS[*]}" dist/ "${TARGET}:${REMOTE_DIR}/"
else
  rsh "find '${REMOTE_DIR}' -mindepth 1 -delete"
  scp "${SSH_OPTS[@]}" -r dist/* "${TARGET}:${REMOTE_DIR}/"
fi

echo "==> SPA .htaccess + permissions"
rsh "cat > '${REMOTE_DIR}/.htaccess'" <<'HTACCESS'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
HTACCESS
# match ownership of the parent dir, make world-readable
rsh "owner=\$(stat -c '%U:%G' \$(dirname '${REMOTE_DIR}') 2>/dev/null || echo ''); \
     [ -n \"\$owner\" ] && chown -R \"\$owner\" '${REMOTE_DIR}' || true; \
     chmod -R a+rX '${REMOTE_DIR}'"

echo "==> Done -> https://${DOMAIN}"
echo "    (If it shows another site, the vhost for ${DOMAIN} isn't set up -"
echo "     add the domain in your VPS panel with docroot ${REMOTE_DIR})"
