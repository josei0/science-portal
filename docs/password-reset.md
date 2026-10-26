# Password recovery

- The public `/reset-password` page provides help only. It contains no form and cannot change a password.
- Students contact their teacher with their name and username. Signed-in teachers reset student passwords from the student management page.
- Teachers contact their school administrator, who verifies their identity and handles recovery through authorized Supabase administration. There is no public teacher reset endpoint.
- `TEACHER_ACCESS_CODE` is only for teacher registration. Built-in fallback codes are no longer accepted.
- `PASSWORD_RESET_ACCESS_CODE` is no longer used. Its old environment variable may be removed from local and Vercel settings; it does not enable any recovery endpoint.

## Configuration and deployment

1. Configure a valid server-only `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` for teacher-assisted student resets. Never prefix the service-role secret with `NEXT_PUBLIC_`.
2. Apply `src/lib/supabase/migrations/20261026_protect_profile_roles.sql` in the Supabase SQL Editor. The original policies allowed users to edit their own role, and the original signup trigger trusted user-editable metadata. Both permit escalation into the teacher reset flow without this migration. The migration preserves existing roles, so review existing teacher accounts separately.
3. Deploy the application with these environment variables and restart it. Teacher signup grants the role through the server admin client after access-code verification.

The repository's base schema also needs the migration for a new database. The current account emails use `@scienceportal.local`, so email recovery is not configured.

## Local verification

Run `node --test tests/password-reset.test.cjs`. These regression tests mock Supabase and never contact the live database or change real passwords. The SQL migration requires verification on a Supabase staging database before production rollout.
