# API (`/api`, JSON)

The single-page site and the API share one domain. Members are authenticated with a **Sanctum SPA session cookie** (httpOnly). Every `POST`, `PATCH` or `DELETE` from the browser needs the CSRF cookie: call `GET /sanctum/csrf-cookie` first, then send the `X-XSRF-TOKEN` header. The client in `src/lib/api.js` does this automatically.

Rate limits are named per route (one counter per IP for each limiter).

## Public reads
| Method & path | Notes |
|---|---|
| GET /content | Settings, service times, ministries, upcoming events, public announcements, sermons, testimonies, giving methods, leaders (cached 60 s) |
| GET /gallery | Published albums (with `category`) |
| GET /testimonies, /prayer-requests | Approved items only. The prayer wall shows consented, non-private requests only |
| GET /ministries · /ministries/{slug} | Active ministries (`key` is used in registration) · public profile plus upcoming events |
| GET /jumuiya | Name, area and meeting time only |
| GET /live | `isLive` is true only while a live URL is set **and** `live_until` is in the future |
| GET /events?month=YYYY-MM \| past=1 \| tag= · /events/{slug} · /events/{slug}/calendar.ics | |
| GET /sermons?q=&preacher=&topic=&category=&series=&type=&page=&per_page= · /sermons/filters · /sermons/{slug} | Paginated |
| GET /announcements · /announcements/{slug} | Audience "all" only |
| GET /devotions/today · /devotions · /devotions/{YYYY-MM-DD} | Returns `null` when nothing is published. Never invented |
| GET /reading-plans · /reading-plans/{slug} | |
| GET /library?category=&type=&q= · /library/{slug} · /library/{slug}/download | Members-only files return 401 to guests (`downloads` limiter) |
| GET /projects · /projects/{slug} | `financials` is included only when leadership approved it |
| GET /verify/{token} | Card check: name, reference and year only (`verify` limiter 30/min) |

## Public forms
| Method & path | Limiter |
|---|---|
| POST /members (multipart; photo optional) | members 6/10 min |
| POST /prayer-requests `{kind, body, consent_public, name?, contact?, category?, location?}` | prayers 10/10 min |
| POST /testimonies (multipart) | testimonies 5/10 min |
| POST /submissions `{type: contact\|baptism\|join_team\|volunteer\|partner\|sermon_upload\|visitor, …}` | submissions 10/10 min |
| POST /events/{slug}/register `{name, phone, guests}` (fields optional when signed in) | submissions |
| POST /prayer-requests/{id}/pray | pray 20/min |

## Member accounts (`auth` limiter 10/10 min)
| Method & path | Notes |
|---|---|
| GET /auth/session | `{user}` or `{user: null}` |
| POST /auth/activate `{reference, phone, date_of_birth, password, password_confirmation}` | Approved members only, one account per member |
| POST /auth/login `{identifier (phone/email/reference), password, remember}` | |
| POST /auth/forgot `{identifier}` → POST /auth/reset `{identifier, code, password, password_confirmation}` | 6-digit code, 15 minutes, 5 attempts. The response is identical whether or not the account exists |
| POST /auth/logout | |

## Member portal (`auth:sanctum` + `member`; always the signed-in member, so there are no IDs in URLs)
`GET /me` · `PATCH /me` (permitted fields only) · `GET|POST /me/photo` · `POST /me/password` · `GET /me/announcements` (audience-filtered) · `GET /me/events` · `GET /me/notifications` · `POST /me/notifications/read` · `GET /me/giving` (403 unless the church enables it) · `GET /me/songs` (shared songs of the member's choirs) · `GET /me/reading-plans/{slug}` · `POST /me/reading-days/{id}` (toggle)

## Web routes (Laravel)
- `/sitemap.xml`
- `/ofisi/faili/{ushuhuda|maktaba|nyaraka|risiti}/{id}`: authenticated office downloads, checked against permissions
- SPA fallback with per-page `<title>`, Open Graph tags and JSON-LD injected server-side
