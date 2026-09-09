#!/usr/bin/env bash
# Deploy KKKT Manzese to the Hostinger VPS (same box as works.oweru.com).
#
#   Usage:   bash deploy.sh
#
# You'll be asked for the server password ONCE (connection is reused).
set -euo pipefail

SSH_HOST="${KKKT_SSH_HOST:-31.97.176.48}"
SSH_USER="${KKKT_SSH_USER:-chriss}"
# Document root for kkkt.oweru.com. Override with KKKT_REMOTE_DIR if your
# panel puts it elsewhere (check where works.oweru.com's files live).
REMOTE_DIR="${KKKT_REMOTE_DIR:-/home/chriss/domains/kkkt.oweru.com/public_html}"
TARGET="${SSH_USER}@${SSH_HOST}"

CTL="$(mktemp -u)"
SSH_OPTS=(-o ControlMaster=auto -o "ControlPath=${CTL}" -o ControlPersist=120 -o StrictHostKeyChecking=accept-new)
cleanup() { ssh "${SSH_OPTS[@]}" -O exit "${TARGET}" 2>/dev/null || true; }
trap cleanup EXIT

echo "==> Building"
npm run build

echo "==> Connecting to ${TARGET} (enter password if prompted)"
ssh "${SSH_OPTS[@]}" "${TARGET}" "mkdir -p '${REMOTE_DIR}'"

echo "==> Uploading dist/ -> ${REMOTE_DIR}"
if command -v rsync >/dev/null 2>&1; then
  rsync -az --delete --exclude '.git' \
    -e "ssh ${SSH_OPTS[*]}" \
    dist/ "${TARGET}:${REMOTE_DIR}/"
else
  ssh "${SSH_OPTS[@]}" "${TARGET}" "find '${REMOTE_DIR}' -mindepth 1 -delete"
  scp "${SSH_OPTS[@]}" -r dist/* "${TARGET}:${REMOTE_DIR}/"
fi

echo "==> Writing SPA .htaccess (Apache)"
ssh "${SSH_OPTS[@]}" "${TARGET}" "cat > '${REMOTE_DIR}/.htaccess'" <<'HTACCESS'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
HTACCESS

echo "==> Done. Visit https://kkkt.oweru.com"
