# Nalvo growth: how to run the money side

## Feature a listing (after the owner pays by UPI)
SQL Editor:
    update listings set featured_until = now() + interval '30 days' where id = 'PASTE-LISTING-ID';
To extend: `set featured_until = featured_until + interval '30 days'`.
To remove: `set featured_until = null`.

## Verify a listing (after you visited the shop)
    update listings set verified = true where id = 'PASTE-LISTING-ID';

## Simple money tracking
Keep a sheet: date, shop, plan (featured or verified), amount, UPI reference, valid until. Review it weekly.

## See what is working
    select name, dist, views, calls, wa, dirs from listings where status = 'approved' order by calls + wa desc;
Use these numbers in your sales pitch: "Your shop had 40 views and 9 calls this month."

## Rules of thumb
- Do not charge before 30+ shops are listed and getting calls.
- Offer the first Featured month free to a few shops, then show them their numbers.
- Never promise a number of customers.
- Counts can be inflated by repeat clicks. Treat them as a guide, not proof.
