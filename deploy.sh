#!/usr/bin/env bash
# Deploy KKKT Manzese to the Hostinger server (same box as works.oweru).
#
#   Usage:  ./deploy.sh
#
# Requires SSH access to the server (key in ssh-agent or ~/.ssh/config).
set -euo pipefail

SSH_HOST="${KKKT_SSH_HOST:-31.97.176.48}"
SSH_USER="${KKKT_SSH_USER:-chriss}"
# Document root for kkkt.oweru.com. Override with KKKT_REMOTE_DIR if your
# panel puts it elsewhere (check where works.oweru.com lives).
REMOTE_DIR="${KKKT_REMOTE_DIR:-/home/chriss/domains/kkkt.oweru.com/public_html}"

echo "==> Building"
npm run build

echo "==> Uploading dist/ -> ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}"
ssh "${SSH_USER}@${SSH_HOST}" "mkdir -p '${REMOTE_DIR}'"

if command -v rsync >/dev/null 2>&1; then
  rsync -az --delete --exclude '.git' dist/ "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"
else
  # rsync not available on Windows git-bash by default — fall back to scp
  ssh "${SSH_USER}@${SSH_HOST}" "rm -rf '${REMOTE_DIR}'/* && mkdir -p '${REMOTE_DIR}'"
  scp -r dist/* "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"
fi

# SPA fallback for Apache (Hostinger default). Safe to re-upload each time.
ssh "${SSH_USER}@${SSH_HOST}" "cat > '${REMOTE_DIR}/.htaccess'" <<'HTACCESS'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
HTACCESS

echo "==> Done."
