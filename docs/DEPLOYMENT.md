# Deployment

Production: `https://kkkt.oweru.com` on the CloudPanel VPS. Laravel serves the API, `/admin` and the built React app.

## Normal deploy
The backend repository has no GitHub remote, so production is deployed from this machine with **`sync.sh`** (tar over SSH, using the `kkkt` host alias):
```bash
cd ../kkkt-backend && bash sync.sh
```
`deploy.sh` (git-pull based) is kept for when the backend gets a remote. Both scripts do the following, in this order:
1. **Back up the production database** (`storage/app/private/backups/pre-deploy-*.sql.gz`). The deploy stops if the backup fails or is empty.
2. Upload the code (`sync.sh`) or `git pull` both repositories (`deploy.sh`).
3. Builds the frontend with `VITE_API_URL=` (same origin) and copies `dist/` into `backend/public`.
4. `composer install`, `php artisan migrate --force`, and caches (route cache stays off because of Livewire).
5. Installs or refreshes the cron entry `* * * * * php artisan schedule:run`, which runs the notification queue, scheduled announcements, event reminders, the nightly backup and the pastoral retention rule.

## Environment (production `.env`)
| Key | Purpose |
|---|---|
| `QUEUE_CONNECTION=database` | Notifications are queued and processed by the scheduler |
| `SMS_DRIVER=beem`, `BEEM_API_KEY`, `BEEM_SECRET_KEY`, `SMS_SENDER_ID` | SMS. Without these, SMS is only logged |
| `MAIL_*` | Email notifications and password-reset codes |
| `APP_DISPLAY_TIMEZONE` (default `Africa/Dar_es_Salaam`) | Times shown in the admin and in SMS. The database stays in UTC |
| `SANCTUM_STATEFUL_DOMAINS` | Only needed for local development (for example `localhost:5173`) |
| `ADMIN_SEED_PASSWORD` | Only for a first-time `--seed` |

## Rollback
- **Code:** `git revert` the commit and run `deploy.sh` again.
- **Data:** `php artisan migrate:rollback --step=4` reverses the 12 Nov 2026 migrations. The backfill rollback restores the unpublished sample records. In the worst case, restore with `gunzip < pre-deploy-….sql.gz | mysql …`.

## Local development
```bash
# backend
cp .env.example .env && php artisan key:generate && php artisan migrate --seed && php artisan serve
# frontend (.env: VITE_API_URL=http://localhost:8000)
npm install --legacy-peer-deps && npm run dev
```
