# KKKT Manzese: Implementation Report (Phases 1–5 and 7)

**Date:** 12 November 2026
**Scope:** everything in the master brief except §14 and Phase 6 (AI assistant), which were excluded on instruction.
**Companion documents:** [PHASE-0-AUDIT.md](PHASE-0-AUDIT.md) · [DATABASE.md](DATABASE.md) · [API.md](API.md) · [SECURITY.md](SECURITY.md) · [DEPLOYMENT.md](DEPLOYMENT.md) · [TESTING.md](TESTING.md) · [MWONGOZO-WA-ADMIN.md](MWONGOZO-WA-ADMIN.md)

## 1. Summary

The existing Laravel 12 + Filament 3 + React platform was **extended, not rebuilt**. Every existing URL, table, record, form and admin screen still works. All schema changes are additive migrations, and the one data migration is reversible.

| Phase | Status | Highlights |
|---|---|---|
| 1. Design and UX | ✅ Done | New navigation (the 10 requested categories, plus "Jiunge Nasi", "Tazama Ibada" and "Omba Maombi" calls to action), homepage sections (Watch Live, daily verse, welcome, latest sermons, ministries, prayer and visitor calls to action, map), dark theme, SW/EN toggle, per-page SEO, PWA |
| 2. Membership and organisation | ✅ Done | Member accounts and portal, digital card with revocable QR, ministries and choirs as managed records, Jumuiya with transfer history, leader dashboards scoped to their own group, attendance, explicit permissions, audit log |
| 3. Worship and communication | ✅ Done | Watch Live (honest live status that expires), searchable sermon library and detail pages, events with real dates, calendar, registration, capacity, attendance, .ics/Google Calendar/WhatsApp sharing, approval workflow for announcements with audience targeting, notification centre (in-account, SMS, email; respects preferences) |
| 4. Spiritual growth and pastoral care | ✅ Done | Pastoral Care centre (6 request types, assignment, encrypted follow-up notes, access log, retention rule), daily devotion, Bible reading plans with progress, library and Christian education |
| 5. Finance and projects | ✅ Recording and reporting | Contributions (receipts, PDF), expenses (approval), budgets, pledge fulfilment, reconciliation, reports, development projects. **Online payments are not switched on.** |
| 7. Production readiness | ✅ Done | 56 automated tests, security headers, backups (before every deploy and nightly), scheduler, documentation |
| 6. AI assistant | ⛔ Not done | Excluded on instruction |

## 2. What changed for each audience

**Visitors:** clearer navigation, a homepage with live-service status and today's verse, sermon search, an event calendar with registration, a visitor card (`/karibu`), private prayer and pastoral requests, the library, projects, a Jumuiya list, dark mode, English, and the option to install the site on a phone (PWA).

**Members:** the `/akaunti` portal. Members open their account using their registration number, phone and date of birth (only after the office has approved them). Inside it they get:
- their profile and photo, and can edit permitted fields;
- a membership card with a QR code;
- their Jumuiya and ministries;
- announcements meant for them;
- their event registrations;
- notifications and communication preferences;
- shared choir songs;
- reading-plan progress;
- their own pledge and contributions (only if the church switches this on).

**Office:** in `/admin`:
- **New sections:** Ministries and Choirs (members, meetings and attendance, songs, activities, reports, documents), Jumuiya, Pastoral Care, Devotions, Reading Plans, Library, Projects, Contributions, Expenses, Budgets, Finance Categories, Audit Log, Reports, Livestream, Send Notifications.
- **Dashboard:** widgets shown according to each user's permissions.

**Ministry and Jumuiya leaders:** see and manage only their own group: members, attendance, activities, reports, documents, announcements to their group, and events (which wait for editor approval).

## 3. Production data changes made by the deploy

The migration `2026_11_12_130000_backfill_platform_data` does the following:

1. Adds slugs to events, sermons and announcements, and sets announcement status from `is_published`.
2. Records wall consent for existing non-private prayer requests (the old form asked "private?" explicitly).
3. Gives every member a random card token.
4. Copies members' ministry and choir choices (JSON) into `department_member`. Choices with no matching ministry record get a new **hidden** ministry (`show_on_site = false`) for the office to review.
5. **Takes seeder sample content off the public site.** Only records that were **never edited** (`updated_at = created_at`) and match the sample text exactly are affected:

   | Sample content | Action |
   |---|---|
   | 6 testimonies | sent back to the approval queue |
   | Prayers with invented "prayed" counts | archived |
   | Sermons with no media and a placeholder preacher | unpublished |
   | 3 announcements and 3 events | unpublished |

   Nothing is deleted. Every change is written to `audit_logs` (action `unpublished_sample`), and rolling the migration back restores them.

## 4. Decisions that belong to church leadership (configurable, not hard-coded)

| Decision | Where | Current default |
|---|---|---|
| Can members see their own pledge and contributions? | Admin → Website Settings → Member accounts | **Off** |
| How long completed private pastoral records are kept | Settings → Pastoral care (pastor only) | **Never deleted** |
| Publishing project finances | Each project → "Show finances on the website" | **Off** |
| Online payments (M-Pesa, Tigo, Airtel, bank) | Not built. Needs merchant credentials and leadership approval | Off |
| The official Jumuiya list and leaders | Admin → Jumuiya | Empty |
| Ministry and Jumuiya leaders (office accounts) | Admin → Users (role "Leader") + Ministries/Jumuiya → Leader | None |
| Permissions per user | Admin → Users → Extra permissions | Role defaults (`config/permissions.php`) |
| Event categories | Settings → Event categories | The brief's list |
| Expense approval | `finance.approve`; the person who records an expense cannot approve it themselves | Mweka Hazina / admin |

## 5. Content the office must supply

The site never publishes invented information. The following must be entered in `/admin`:

- **Settings:** phone numbers, address, P.O. Box, year founded, history, vision, mission, Holy Communion schedule, livestream links, welcome message, Pastor's photo.
- **Giving Methods:** the real M-Pesa, Tigo and bank account numbers. Methods without a number are hidden.
- **Leaders:** names for the Parish Council positions.
- **Service Times:** remove the duplicate and fix the "18:30am" entry.
- **Departments and Ministries:** leader names. Also review the hidden ministries created by the migration.
- **Testimonies:** approve real testimonies only.
- **Devotions and Reading Plans:** Bible verse text must be copied word for word from the Bible the parish uses. The system never writes or generates verses.

## 6. Not done, or limited

- **AI assistant (Phase 6):** excluded on instruction.
- **Online payments:** recording only, by design.
- **Web push notifications:** not added. Notifications are in-account, SMS (Beem, set `SMS_DRIVER=beem` and keys) and email.
- **WhatsApp:** share links only. The WhatsApp Business API needs Meta approval.
- **English:** navigation, all new pages and the portal are bilingual. Older pages (About, Giving, Baptism and others) and admin-entered content stay in Swahili.
- **Dark theme:** applied through a central style layer. Older pages were spot-checked, not reviewed pixel by pixel.
- **Content-Security-Policy:** not set, because Filament/Livewire and video embeds would need dedicated testing.
- **Sermon transcription and summaries:** part of Phase 6 (AI), not done.
