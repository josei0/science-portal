# Password recovery

- Signed-in teachers reset student passwords from the student management page.
- The public recovery page is operated with an administrator who verifies the account owner's identity first.
- The administrator enters `PASSWORD_RESET_ACCESS_CODE`; never distribute it to students or teachers as a signup code. It can reset any account of the selected type.
- `TEACHER_ACCESS_CODE` is only for teacher registration. Built-in fallback codes are no longer accepted.

## Configuration and deployment

1. Set `PASSWORD_RESET_ACCESS_CODE` to a cryptographically random secret of 32–256 characters, different from `TEACHER_ACCESS_CODE`. It is case-sensitive. Without this configuration, public recovery fails closed; teacher-assisted resets remain available.
2. Configure a valid server-only `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL`. Never prefix the recovery or service-role secrets with `NEXT_PUBLIC_`.
3. Apply `src/lib/supabase/migrations/20261026_protect_profile_roles.sql` in the Supabase SQL Editor. The original policies allowed users to edit their own role, and the original signup trigger trusted user-editable metadata. Both permit escalation into the teacher reset flow without this migration. The migration preserves existing roles, so review existing teacher accounts separately.
4. Deploy the application with these environment variables and restart it. Teacher signup now grants the role through the server admin client after access-code verification.

The repository's base schema also needs the migration for a new database. Keep the recovery secret private, rotate it if disclosed, and use a unique random value rather than a memorable shared code. The current account emails use `@scienceportal.local`, so email recovery is not configured.

## Local verification

Run `node --test tests/password-reset.test.cjs`. These regression tests mock Supabase and never contact the live database or change real passwords. The SQL migration requires verification on a Supabase staging database before production rollout.
