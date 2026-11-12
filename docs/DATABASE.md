# Database (MySQL in production, SQLite in tests)

All changes since 12 Nov 2026 live in four additive migrations in `kkkt-backend/database/migrations/2026_11_12_*`. No existing column was dropped or renamed. Two columns became nullable: `users.email`, because members sign in by phone, and `members.occupation`.

## Existing tables (preserved)
`users`, `members`, `departments`, `events`, `announcements`, `sermons`, `testimonies`, `prayer_requests`, `form_submissions`, `gallery_albums`, `leaders`, `service_times`, `giving_methods`, `partner_ways`, `settings`, plus the framework tables.

## Columns added to existing tables
| Table | New columns |
|---|---|
| users | `phone` (unique, normalised 255…), `permissions` (JSON of extra grants), `is_active`, `last_login_at` |
| members | `user_id` → users, `jumuiya_id` → jumuiyas, `ward`, `district`, `card_token` (unique, random 40 chars), `comm_prefs` (JSON), `spiritual_gifts` (JSON), `membership_date`, `pledge_purpose`, `pledge_period` |
| departments | `kind` (ministry or choir), `legacy_key`, `image_path`, `leader_user_id`, `assistant_user_id`, `is_active`, `show_on_site` |
| events | `slug`, `starts_at`, `ends_at`, `department_id`, `organizer`, `requires_registration`, `capacity` |
| sermons | `slug`, `topic`, `category`, `thumbnail_url`, `audio_url`, `transcript` |
| announcements | `slug`, `status` (draft, pending, published, archived), `audience_type` (all, members, department, jumuiya), `audience_id`, `publish_at`, `expires_at`, `notify`, `notified_at`, `created_by`, `approved_by` |
| prayer_requests | `kind`, `member_id`, `assigned_to`, `consent_public`, `scheduled_for`, `resolved_at`, `location` |
| testimonies | `member_id`, `media_disk` (`local` until approved) |
| gallery_albums | `category` |

## New tables
| Domain | Tables |
|---|---|
| Jumuiya | `jumuiyas`, `jumuiya_memberships` (started_on and ended_on, so transfers keep history) |
| Ministries | `department_member` (role, voice_part, joined_on, left_on), `choir_songs` |
| Group work (shared by ministries and Jumuiya, polymorphic `groupable`) | `group_meetings` + `attendance_records`, `group_activities`, `group_reports`, `group_documents` |
| Events | `event_registrations` (guests, attended_at, reminded_at) |
| Pastoral | `pastoral_notes` (body encrypted at rest) |
| Discipleship | `devotions`, `reading_plans`, `reading_plan_days`, `reading_progress`, `library_items` |
| Projects | `projects`, `project_milestones` |
| Finance | `finance_categories`, `contributions` (immutable; reversals via `reversal_of_id`), `expenses`, `budgets` |
| Accounts and notifications | `notifications` (Laravel), `member_otps` (hashed reset codes) |
| Audit | `audit_logs` (who, what, old and new values with sensitive fields masked, IP, time; append-only) |

## Integrity rules
- **Contributions:** cannot be updated or deleted at the model level. Only reconciliation fields can change. Corrections are made with a negative reversal entry linked to the original.
- **Expenses:** editable only while pending. Once approved or rejected they are final, and corrections use a reversal.
- **Jumuiya:** a Jumuiya with membership history cannot be deleted (`restrictOnDelete`).
- **Ministry sync:** ministry memberships created from registration choices are synced as a diff. Memberships added by leaders are never removed automatically.
- **Audit log masking:** sensitive fields appear in `audit_logs` as `[siri]`: prayer content and contacts, pledge amounts and notes, testimony contacts.
