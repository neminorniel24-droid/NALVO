# Nalvo: from website to app, and online payments

## Phase 1: installable app (this package)
The website installs to the home screen, opens full screen with its own icon, and shows the last loaded page when offline.
- Android Chrome: an "Install app" button appears at the top. Or menu > Install app.
- iPhone Safari: Share > Add to Home Screen.
It only works on the https address, not on localhost.

## Phase 2: Android app for the Play Store (same code, wrapped with Capacitor)
You need: Node.js, Android Studio with its SDK, and a Google Play Developer account (one-time fee, check the current amount).
Rough steps, after Phase 1 works:
1. In the repo: `npm init -y`, `npm i @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init Nalvo in.nalvo.app --web-dir site` (use the folder holding index.html)
3. `npx cap add android`, then `npx cap sync`
4. `npx cap open android` and build a signed bundle (.aab) in Android Studio.
5. Upload in Play Console. Check current rules: new personal developer accounts may need a closed test with a number of testers for about two weeks before the public release.
Keep the signing key file and its password safe. Losing it means you cannot update the app.

## Phase 3: online payments (Razorpay)
Why not just add a Pay button: the payment must be checked on a server, never in the browser.
Plan:
1. Create a Razorpay account and complete its business verification (they ask for identity and bank details). Use TEST mode first; it costs nothing.
2. Two small Supabase Edge Functions:
   - create-order: the owner picks Featured or Verified, the function creates a Razorpay order with the price set on the server.
   - razorpay-webhook: Razorpay tells the server the payment succeeded; the function checks the signature, then sets featured_until or verified on that listing.
3. A payment history table, with owners able to see only their own payments.
4. Keys (Razorpay secret, webhook secret) are stored only as Supabase secrets, never in the repo or website.
5. Receipts, refund rules and a Refund Policy page before going live. Charging GST may apply once you earn above the threshold; ask an accountant.

## Store payment rules: read before charging inside the Play Store app
Google may require its own billing system for digital features sold inside an app. Selling Featured or Verified inside the Play Store app could fall under that. Check the current Play payments policy first. Many apps avoid the issue by taking payments on the website. Until you have checked, keep payments on the website or by UPI.
