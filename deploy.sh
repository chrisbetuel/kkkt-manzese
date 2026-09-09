#!/usr/bin/env bash
# The frontend is served by the Laravel app (kkkt-backend), which builds and
# copies this project's dist/ into its public/ on deploy.
#
# To deploy the whole site (frontend + API + admin), run the backend's script:
#
#     cd ../kkkt-backend && bash deploy.sh
#
# Local dev only:
#     npm install --legacy-peer-deps
#     npm run dev          # http://localhost:5173  (VITE_API_URL in .env -> local API)
echo "Use ../kkkt-backend/deploy.sh to deploy. This project is built + served by Laravel."
exit 1
