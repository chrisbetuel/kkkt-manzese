# Security and Data Protection

## Access control
- **Explicit permissions** (`kkkt-backend/config/permissions.php`). Each role has a listed set of permissions, and an admin can grant extra permissions to individual users. Every check runs on the server (Filament `canViewAny`/`canEdit` and query scoping), not just by hiding menus.

| Role | Can do |
|---|---|
| admin | Everything |
| pastor (Mchungaji) | Members, pledges, pastoral care, content publishing, reports, finance (view only) |
| registrar (Katibu) | Members (no pledges), ministries, Jumuiya, events, notifications |
| finance (Mweka Hazina) | Finance record, approve and reports; pledges; projects |
| editor | Content (needs approval before publishing) |
| media | Content plus livestream |
| leader | Only the ministry or Jumuiya they are appointed to |
| member | Website portal only. Cannot open `/admin` |

- **No IDOR on the portal.** Portal endpoints never take a record ID. The card QR uses a random 40-character token that can be revoked.
- **Pastoral records.** Private and pastoral requests are visible only with `pastoral.view`, or to the person they are assigned to. Notes are encrypted at rest, opening a record is logged (`viewed`), and the office notification email does not include the request text.
- **Finance.** Recorded transactions are immutable and corrected by reversal. The person who records an expense cannot approve it. Members see only their own giving, and only if the church enables it.

## Application hardening
- CSRF on every browser POST (Sanctum stateful API), session regeneration on login, password rules (members 8+ characters with letters and numbers; office 10+).
- Rate limiting with per-route counters on every public form and on authentication.
- Validation on every input. Upload limits: images are re-encoded (EXIF/GPS stripped) and kept on the private disk; testimony media stays private until approved; documents are private and downloaded through permission-checked routes.
- Rich text from editors (devotions, projects) is sanitised server-side (`App\Support\SafeHtml`: whitelisted tags, no attributes).
- Headers: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, and HSTS over HTTPS.
- The seeder no longer contains a hard-coded admin password.
- The service worker never caches `/api/me`, `/api/auth`, `/admin` or any response that sets a cookie.

## Audit and retention
- `audit_logs` records create, update and delete on all important records with old and new values; sensitive fields are masked as `[siri]`. It also records logins created, password resets, livestream start and stop, notifications sent, backups, and pastoral record views. Visible in Admin → Audit (`audit.view`).
- Backups: one before every deploy, then nightly at 02:30, kept 14 days in `storage/app/private/backups` (not web-accessible).
- Pastoral retention: off by default. The pastor sets a number of months in Settings.

## Open items to review with leadership
1. Confirm the production admin password is no longer `changeme123`.
2. Consider `SESSION_ENCRYPT=true`. Existing sessions would be logged out once.
3. Keep a copy of the backups off the server (for example download weekly, or rsync to another location).
4. Content-Security-Policy needs testing before it is enabled.
5. Data protection: the registration consent text is in place. Leadership should publish a privacy notice under the Tanzanian Personal Data Protection Act (2022) and register with the Personal Data Protection Commission if required.
