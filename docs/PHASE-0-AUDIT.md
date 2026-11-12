# KKKT Manzese: Phase 0 System Audit

**Date:** 12 November 2026
**Scope:** `kkkt-manzese` (React frontend) and `kkkt-backend` (Laravel API and admin), plus the public production API at https://kkkt.oweru.com
**Method:** Read the code in both repos, ran both test suites and the build, and made read-only calls to the public production endpoints. No production data was changed.

---

## 1. Architecture as it exists today

| Layer | Technology | Notes |
|---|---|---|
| Public site | React 18 + Vite 8 (rolldown) + Tailwind 3 + React Router 7, SPA | 21 routes, Swahili-first. Content comes from `GET /api/content`, with static `src/data/site.js` as the fallback. |
| API | Laravel 12, PHP 8.2 | 8 public, unauthenticated endpoints (`routes/api.php`). Sanctum is installed but unused. |
| Admin | Filament 3 at `/admin` | 14 resources, a Pastor dashboard, member statistics, a settings page. Swahili UI. |
| Database | MySQL in production, SQLite in tests | 14 domain tables (see §6). |
| Hosting | CloudPanel VPS, nginx, Laravel serves the SPA build | `kkkt-backend/deploy.sh` pulls both repos, builds and migrates. Production is updated directly; there is no staging environment. |
| Notifications | Mail (office notifications), Beem SMS (`app/Services/Sms.php`, set to the `log` driver unless configured) | |
| Tests | PHPUnit | Before this audit: 16 tests passing. Now: 20 passing (122 assertions). The frontend has no tests. |

**Overall verdict:** a clean, sensible foundation that is worth extending rather than replacing. Filament fits the "church office updates content without a developer" goal well. The main gaps are member-facing accounts, organisational structure (ministries and Jumuiya as real entities), and production content hygiene.

---

## 2. Feature audit

Status key: ✅ working · 🟡 working but needs improvement · 🟠 partial · ❌ not implemented · 🔴 broken

### Public website
| Feature | Status | Evidence / notes |
|---|---|---|
| Homepage (hero slideshow, events, announcements) | 🟡 | `src/pages/Home.jsx`. Real church photos. Missing: Watch Live, daily verse, sermons strip, prayer and visitor calls to action. |
| Navigation | 🟡 | `src/data/nav.js`, 13 flat links plus a "Zaidi" dropdown. Does not follow the requested taxonomy (Ibada, Huduma, Jumuiya, Mafundisho, Maktaba). |
| About / Leadership / Schedule | 🟡 | Work, but the production content is incomplete (§4). |
| Departments (Idara) | 🟡 | Read-only list. No member association (see Ministries). |
| Events (Matukio) | 🟠 | Dates are free-text `date_label`, not real dates. No calendar, registration, attendance or reminders. |
| Sermons (Mahubiri) | 🟡 | Link-based (YouTube, audio, doc). No search, filter, topic or detail page. |
| Sermon upload page `/mahubiri/pakia` | 🟠 | Public form that only creates a `form_submission`. Not a real upload. |
| Gallery (albums, photos, videos) | ✅ | Recent work. Tested. |
| Testimonies | 🟡 | Moderated submission works. Media files are stored on the public disk. **Production shows invented sample testimonies** (§4). |
| Prayer wall (Maombi) | ✅ | Public and private requests, moderation, "I prayed" counter. |
| Contact, Baptism, Join team, Volunteer, Partner forms | ✅ | All post to `/api/submissions`. The office gets an email. |
| Giving page | 🟠 | Displays methods only. **Production shows `[JAZA namba]` as payment numbers.** No online payment (correct until merchant approval). |
| Floating WhatsApp / Register buttons | ✅ | |
| Live streaming / Watch Live | ❌ | |
| Daily devotion / Bible reading plans | ❌ | |
| Digital library / Christian education | ❌ | |
| Church projects | ❌ | |
| AI assistant | ❌ | |
| English language | 🟠 | Only the registration form has a SW/EN toggle. |
| Dark theme | ❌ | No `dark:` styles. Tailwind `darkMode` is not configured. |
| PWA (manifest, offline) | ❌ | No manifest or service worker. |
| SEO | 🟠 | One static `<title>` and description for all routes. `robots.txt` is the Laravel default. `/sitemap.xml` returns the SPA HTML with status 200 (a soft 404). No per-page Open Graph tags or structured data. |
| Mobile responsiveness | 🟡 | A responsive pass was done (commit `588b238`). Needs device testing per page. |

### Membership
| Feature | Status | Evidence / notes |
|---|---|---|
| Multi-step registration `/jisajili` | ✅ | 6 steps, SW/EN, private photo with EXIF stripped, duplicate detection, consent, SMS and email confirmation, office notification. Tested. |
| Admin review and approval | ✅ | `MemberResource` with approve action, filters, PDF and Excel export, Pastor "Pending members" widget. |
| Save registration progress | ❌ | Drafts are not persisted. |
| Mandatory fields | 🟡 | Photo, date of birth, occupation and address are required by the API. The brief asks for fewer mandatory fields. This is a church-office decision. |
| Membership number | 🟠 | Column exists. Removed from the public UI by choice (commit `0b58987`). `reference` doubles as the pledge number. |
| Member login / portal | ❌ | **No member accounts exist.** `users` holds office staff only. |
| Digital membership card + QR verification | ❌ | |
| Family links between member records | ❌ | Dependants are a JSON list on the member, not linked records. |
| Jumuiya assignment | ❌ | No Jumuiya concept anywhere in the schema. |

### Organisation
| Feature | Status | Notes |
|---|---|---|
| Ministries (departments) | 🟠 | The `departments` table holds public display content only (leader is a free-text name). Member links live in `members.departments` as a JSON array of **hard-coded keys** (`Member::DEPARTMENTS`), not tied to the `departments` table. |
| Choirs | 🟠 | Same pattern: `members.choirs` JSON plus hard-coded `Member::CHOIRS`. No rehearsals, attendance or song library. |
| Ministry or Jumuiya leader dashboards | ❌ | |
| Attendance | ❌ | |

### Administration and security
| Feature | Status | Notes |
|---|---|---|
| Office login (Filament) | ✅ | Session auth with CSRF. |
| Roles | 🟡 | One `users.role` string: `admin`, `pastor`, `registrar`, `finance`, `editor`. Checks are role-name methods on `User`. No explicit permission table and no scoping to a ministry or Jumuiya. |
| Pledge confidentiality | ✅ | Hidden from registrar and editor. Tested. |
| Private prayer confidentiality | 🔴 → ✅ **fixed in this pass** | `PrayerRequestResource` had no access check, so an `editor` could read private pastoral requests. |
| Public form rate limiting | 🔴 → ✅ **fixed in this pass** | Testimonies (100 MB uploads), prayers and submissions were unthrottled. The existing `throttle:N,M` limits shared one counter per IP across routes. |
| Seeded admin password | 🔴 → ✅ **fixed in the seeder** | `DatabaseSeeder` created `admin@…` with the hard-coded password `changeme123`. **Production must be checked** (§5). |
| Audit log | ❌ | Only `members.verified_by` is recorded. |
| Finance (contributions, receipts, expenses) | ❌ | Only pledge fields on `members`. |
| Notification centre / segmentation | ❌ | Email to the office only. Beem SMS exists for registration confirmations. |

---

## 3. What can be reused

| Need in the brief | Reuse | Extend with |
|---|---|---|
| Member registry | `members` table, `MemberController`, `MemberResource`, exports | `user_id` (portal login), `jumuiya_id`, card token |
| Ministries | `departments` table and resource | `is_active`, leader `user_id`, plus a `department_member` pivot (backfilled from `members.departments` JSON, keeping the JSON until the switch is verified) |
| Choirs | Departments with a `kind=choir` flag, plus choir-specific tables later | |
| Events | `events` table | `starts_at`, `ends_at`, `department_id`, `requires_registration`, `capacity`. Keep `date_label` for backward compatibility. |
| Sermons | `sermons` table (already has preacher, scripture, series, link) | `topic`, `slug`, `transcript`, `category` |
| Announcements | `announcements` | `audience` (all, ministry or Jumuiya), `status` (draft, pending, published, archived) |
| Prayer and pastoral care | `prayer_requests` plus the Pastor dashboard | `kind` (prayer, counselling, visitation), `assigned_to`, follow-up notes (pastor-only), access log |
| Settings and CMS | `settings` table and `ManageSettings` | Livestream URL, daily verse source, homepage sections |
| SMS | `App\Services\Sms` | Bulk sending via the queue (the `jobs` table already exists) |

## 4. Production content problems (live `/api/content`, 12 Nov 2026)

1. **20 `[JAZA …]` placeholders were published**, including **three giving methods whose account numbers read `[JAZA namba]`**, 7 department leaders, 4 council members, 2 sermon preachers and 1 event time.
   *Mitigation in this pass:* the frontend now never renders a placeholder string. It hides the field, and drops giving methods that have no number. **The real fix is filling these in through `/admin`.**
2. **Invented testimonies are live.** "Mama Neema", "Mzee Lukas (Mzee wa Kanisa)", "Familia ya Mollel" and others come from `ContentSeeder` sample data, and are presented as real members' testimonies. Sample sermons and announcements from the same seeder are probably live too. These need unpublishing (not deleting) after the office confirms which records are real.
3. **Service times are duplicated and wrong:** "Jumapili 7:00am – 10:00am" appears twice, and "kila siku 18:30am" mixes 24-hour and am/pm notation.
4. **Leader names include junk:** a clergy entry named `-------` and a name with trailing whitespace.
5. **Static fallback:** if the API is unreachable, the SPA falls back to `src/data/site.js`, which contains sample events, sermons and testimonies. The fallback should carry only the church identity, with empty lists for dynamic content.

## 5. Security and performance findings

| # | Severity | Finding | Status |
|---|---|---|---|
| S1 | High | Private prayer requests were visible to every office role (including `editor`) in `/admin/prayer-requests`. | **Fixed.** Scoped query, only `admin` and `pastor` see private requests, the privacy flag is locked for others. 2 tests added. |
| S2 | High | `DatabaseSeeder` hard-coded the admin password `changeme123`, and `deploy.sh --setup` runs `--seed`. | **Seeder fixed** (uses `ADMIN_SEED_PASSWORD` or a random password). **Action needed:** confirm the production `admin@kkkt.oweru.com` password was changed. |
| S3 | Medium | Unthrottled public POSTs (`/testimonies` accepts 100 MB files). Existing throttles shared one counter per IP. | **Fixed.** Named per-route limiters. 1 test added. |
| S4 | Medium | Testimony audio and video uploads go to the **public** disk before moderation, so a pending upload is reachable by URL once its path is guessed or leaked. | Open. Move to the private disk and serve after approval (Phase 3). |
| S5 | Medium | No audit trail for admin actions (member edits, approvals, deletions). | Open (Phase 2). |
| S6 | Medium | Roles are name-based with no permission layer, and nothing can be scoped to one ministry or Jumuiya. | Open. Needed before ministry leader dashboards (Phase 2). |
| S7 | Low | No `Strict-Transport-Security` or `Content-Security-Policy` headers. `X-Frame-Options` and `nosniff` are present. | Open (nginx, Phase 7). |
| S8 | Low | Form submissions (baptism and contact data) are visible to `editor`. | Open. Governance decision. |
| S9 | Low | `SESSION_ENCRYPT=false` in `.env.example`. Confirm production. | Open. |
| P1 | Info | `/api/content` returns everything in one payload, cached for 60 seconds. Fine at the current size. Paginate sermons and events once the archive grows. | |
| P2 | Info | No staging environment. `deploy.sh` deploys `main` straight to production. | Open (Phase 7). |

## 6. Database map (existing)

`users` (office staff, `role`) · `members` (registry with pledge columns, `verified_by → users`) · `departments` · `events` · `announcements` · `sermons` · `testimonies` · `prayer_requests` · `form_submissions` · `gallery_albums` · `leaders` · `service_times` · `giving_methods` · `partner_ways` · `settings` (key → JSON) · plus the framework tables (`cache`, `jobs`, `sessions`, `personal_access_tokens`).

**Genuinely new tables needed later:** `jumuiyas`, `jumuiya_member` (with dates, so transfers keep history), `department_member` (pivot), `attendance_sessions` and `attendance_records`, `event_registrations`, `audit_logs`, `devotions`, `reading_plans` and progress, `library_items`, `projects` and milestones, `contributions` and `receipts` (Phase 5, only with leadership approval), `notifications` (Laravel built-in).

## 7. Prioritised plan

| Phase | Focus | Depends on |
|---|---|---|
| **0.5 (now)** | Clean production content (placeholders, sample testimonies, service times) through `/admin`; rotate the admin password; deploy this pass's fixes | Office provides the real data and authorises the deploy |
| **1** | Navigation restructure, homepage (Watch Live from a setting, daily verse, sermons strip, prayer and visitor calls to action), per-page titles and Open Graph, real sitemap, PWA manifest, safe static fallback, dark theme tokens | None |
| **2** | Member accounts and portal, digital card with signed QR, ministries as real records (pivot plus backfill), Jumuiya with transfer history, permission layer, audit log, attendance | **Decisions:** how members log in; the official Jumuiya list |
| **3** | Livestream page, sermon library with search, filters and detail pages, events with real dates, calendar, registration and ICS/WhatsApp share, segmented announcements, private testimony media | None |
| **4** | Pastoral care centre (request types, assignment, pastor-only notes, access log), devotions, reading plans, library | Pastor's sign-off on workflow and retention |
| **5** | Finance: contributions, receipts, expenses, projects | **Leadership approval required**, plus Mweka Hazina procedures |
| **6** | AI assistant grounded on approved content | Provider choice and budget, leadership approval |
| **7** | Staging, security headers, backups, permission tests, mobile QA | Server access |

## 8. Changes made during this audit (not yet committed or deployed)

**kkkt-backend**
- `app/Models/User.php`: `canViewPrivatePrayers()` (admin, pastor).
- `app/Filament/Resources/PrayerRequestResource.php`: scoped query and badge; privacy toggle locked for non-pastoral roles.
- `app/Providers/AppServiceProvider.php` and `routes/api.php`: named per-route rate limiters for all public POSTs.
- `database/seeders/DatabaseSeeder.php`: no hard-coded admin password.
- `tests/Feature/SecurityHardeningTest.php`: 4 tests. Full suite: 20 passed.

**kkkt-manzese**
- `src/content.jsx`: `[JAZA …]` placeholders are never rendered publicly (live and fallback data); giving methods without a number are hidden.
- `src/pages/Contact.jsx`, `About.jsx`, `Departments.jsx`, `src/components/Footer.jsx`: hide empty fields instead of rendering blank labels or broken `tel:` links.
- `docs/PHASE-0-AUDIT.md`: this report.
