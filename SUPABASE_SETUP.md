# Supabase setup

Here Am I now reads and writes everything through Supabase (project `ngbghvznktloqzvynlgh`).
The schema, RLS policies, triggers and RPCs live in `supabase/migrations/0001_init.sql`, already applied.

## Blockers (need you)

1. **Create the platform owner account.** In the dashboard, open Authentication → Users → Add user, enter your email and password, and tick "Auto confirm". Then run this in the SQL editor:

   ```sql
   insert into owners (user_id, name, email)
   select id, 'Your Name', email from auth.users where email = 'you@example.com';
   ```

2. **Auth URLs.** Go to Authentication → URL Configuration.
   - Site URL: your production domain.
   - Redirect URLs: add `http://localhost:3300/login` and `https://<your-domain>/login`.
   - Confirmation links from signup and join point here.
3. **Email confirmation.** Keep "Confirm email" on, under Authentication → Providers → Email.
   - Supabase's built-in mailer only sends a few emails per hour.
   - Before inviting a real church, add custom SMTP under Authentication → Emails, e.g. Resend or Postmark.
4. **First real test.** Smoke testing never signed in, because creating accounts was off-limits. Do this:
   1. Sign in as the owner and onboard a church.
   2. Add a member and give them a department and a unit.
   3. Register that member through `/join` in a private window.

## Env vars used

| Name | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser client (only the origin is used, so a trailing `/rest/v1/` is harmless) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser client |

- `SUPABASE_SERVICE_ROLE_KEY` is not used by the app. Never rename it to `NEXT_PUBLIC_`.
- The `DEMO_*` variables are no longer used.
- Add the same two public vars on the hosting platform for production.

## How people get in

- **Owner:** an `owners` row, as created in blocker 1. Opens `/owner`.
- **New church:** `/signup` creates the auth user. Once they confirm their email, a trigger creates the organization and makes them its primary admin.
- **Member:** an admin adds them under Members, with department → unit. The member opens `/join` with that same email, sets a password and confirms. Their profile is linked automatically.
  - Signing up at `/signup` with an invited email also joins the invited church. It does not create a new one.
- A suspended church's members are signed out with a message.

## Behaviour changes from the mock version

- Permissions are enforced in the database by RLS and triggers. A refused write shows "You don't have permission to do that".
- Check-in codes come from the `current_checkin_code` RPC and are checked by `check_in` on the server. Each code lasts 30 s. Distance from the church is computed on the server from the lat/lng sent.
- "Reset demo data" was removed from the owner page.
- When the owner uses "View as member", they see that member's screens but cannot check in for them. Check-in always uses the signed-in account.
- Member emails and phone numbers are visible to everyone in the same church.
- Logos are stored as data URLs in `organizations.logo`. Moving them to a Storage bucket is a later improvement.
- `src/constants/seed.ts` and `childSeed.ts` are no longer used, except `seedSettings`, which provides default settings. They can be deleted.

## Still to do later

- Real passkeys (WebAuthn) instead of the simulated prompt.
- TWA: set the Play signing SHA-256 fingerprint and the final domain in `public/.well-known/assetlinks.json`.
