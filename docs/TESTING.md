# Testing Report (12 Nov 2026)

## Automated (backend, PHPUnit): 56 tests, 337 assertions, all passing
Run with: `cd kkkt-backend && php artisan test`

| Brief scenario (§23) | Covered by |
|---|---|
| Visitor registers (photo and occupation optional); admin reviews; approved member signs in; member updates permitted fields only | `MemberPortalTest`, `MemberRegistrationTest` |
| Members cannot open the admin panel or see other members' finances; guests get 401 | `MemberPortalTest` |
| Card QR reveals the minimum and can be revoked; password reset by code | `MemberPortalTest` |
| Admin-created ministry accepted at registration; leader manages only their own ministry; unrelated users blocked | `OrganisationTest` |
| Member assigned to a Jumuiya; leader records attendance; transfer keeps history | `OrganisationTest` |
| Sermon published, searched and filtered; live status cannot be faked | `WorshipAndEventsTest` |
| Event registration with capacity and duplicates; .ics; leader events wait for approval | `WorshipAndEventsTest` |
| Announcement audiences segmented; notification queued for the group only; leaders cannot post publicly; editors need approval | `WorshipAndEventsTest` |
| Private-by-default prayer; counselling always private; only pastoral staff can open records; access logged; notes encrypted | `PastoralAndFinanceTest`, `SecurityHardeningTest` |
| Transactions immutable; reversal; expense approval final; **reports reconcile with transactions**; finance screens restricted | `PastoralAndFinanceTest` |
| Every admin page renders (about 40 URLs) | `AdminSmokeTest` |
| Rate limits; no seeded password; sitemap and SEO tags | `SecurityHardeningTest`, `WorshipAndEventsTest` |

The tests also caught and fixed real bugs:
- A cache listener stopped the remaining model-event listeners from running, so announcement notifications were never sent.
- Leader-added ministry memberships could be overwritten.
- Defaults were missing on new transactions, so reversing a contribution and approving an expense failed.
- A reversal could use an unsaved in-memory amount instead of the stored one.

## Manual checks (local server, production-style build)
- Session login with CSRF (a request without the token is rejected with 419). A member account is refused at `/admin` (403).
- The HTML sanitiser strips `<script>` and event attributes from devotion text.
- Server-rendered page titles and Open Graph tags, JSON-LD, `sitemap.xml`, security headers.
- Phone width (390 px) in light and dark: homepage, account, event registration, devotion. No horizontal overflow.
- Desktop navigation menus.

## Not yet tested
- Real devices (low-cost Android, iPhone Safari) and a slow 3G connection.
- Real SMS delivery (needs Beem credentials) and email delivery.
- Installing the PWA from Chrome on Android. The manifest and icons are in place.
- Load testing.
