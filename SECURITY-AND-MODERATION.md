# Nalvo: security checklist and moderation guide

No website is unhackable. This setup blocks the common attacks and limits the damage. Keep the checklist alive.

## What is built in
- Strict browser security headers (`site/_headers`): scripts only from your own site, no framing, HTTPS only.
- The Supabase library is hosted on your own site (no outside script that could be tampered with).
- All text shown on the page is escaped; links and photo addresses are checked.
- Database rules (row level security): the public reads only approved listings, owners change only their own, reports are private.
- A database guard that owners cannot bypass: new and edited listings always start as "pending", owners cannot self-verify, five new listings per day and 25 per account maximum.
- Risky words flag a listing for you; obvious banned words are also blocked in the form.
- Phone, category, link and size checks in the database, JPEG-only 1 MB photos.
- Public "Report" button; three different reporters hide a listing automatically until you review it.

## Do these once (account security)
1. Turn on two-step verification for GitHub, Supabase, Netlify and your email. This is the single biggest protection.
2. Use a different strong password for each, in a password manager.
3. Never put the Supabase `service_role` / secret key or database password in any file or chat.
4. Supabase > Authentication: set up custom SMTP (own email sender) and review the rate limits.
5. Later, add CAPTCHA to sign-in (Supabase > Authentication > Attack Protection). This needs a small code change, so ask for it first.
6. Back up: the free plan shows "no backups". Every week, Table Editor > listings > Export CSV, and save it somewhere safe.

## Daily and weekly moderation (Supabase dashboard)
**Approve new listings**
1. Table Editor > listings > filter `status` = `pending`. Look at `flagged` = true first.
2. Check the name, phone, photo, licence number and description. For regulated categories, check the licence number is real.
3. Set `status` to `approved`. To reject, use `rejected`. To hide something dangerous, use `hidden`.
4. If you visited the shop yourself, also tick `verified`.

**Review reports** (weekly, or when you get an email)
1. Table Editor > reports shows reason and note, with the listing id.
2. Open the listing, decide, and set `status` to `approved` (report false), or `rejected` / `hidden`.
3. For repeat offenders, Authentication > Users, find the email, and ban or delete the user.

**Useful SQL (SQL Editor)**
- Pending first: `select id,name,cat,dist,flagged,created_at from listings where status='pending' order by flagged desc, created_at;`
- Hide a listing: `update listings set status='hidden' where id='PASTE-ID';`
- Add a banned word: `insert into blocked_terms values ('word');`

## If something goes wrong
1. Hide the listing first, investigate second.
2. Keep a note of what happened and what you did.
3. If someone reports a security hole, thank them, fix it, and tell them.
4. If you think an account or key leaked: change passwords, rotate keys in Supabase (Project Settings > API), and redeploy.
5. For crime, call the police (112); for online financial fraud, 1930 or cybercrime.gov.in.

## Honest limits
- The "pending" review is manual. If many listings arrive, review time becomes the bottleneck.
- Keyword checks catch only obvious words. A person must still look.
- Three fake accounts could falsely report a good shop; reports hide it but you can restore it.
- Legal pages are a draft. Get a lawyer to read them before wide launch.
- Check the current free-tier rules of Supabase and Netlify; they can change.
