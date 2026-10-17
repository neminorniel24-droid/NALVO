# Nalvo: go live in about 30 minutes (free)

## 1. Create the database (Supabase)
1. Sign up at supabase.com and create a new project. Choose the Mumbai region (ap-south-1) for speed in India.
2. Open **SQL Editor**, paste all of `supabase-setup.sql`, and click **Run**.
3. Open **Authentication > URL Configuration**. Set **Site URL** to your final website address (you can change it later) and add the same address under **Redirect URLs**.
4. Open **Project Settings > API**. Copy the **Project URL** and the **anon public** key.
   Never put the `service_role` key in the website.

## 2. Connect the website
In `index.html`, find this line near the bottom and paste your two values:
    const SB_URL="https://YOUR-PROJECT.supabase.co",SB_KEY="YOUR-ANON-PUBLIC-KEY";
Then run the sed command from the chat to re-enter your name in the copyright comment.

## 3. Publish (pick one)
- **Netlify Drop (easiest):** go to app.netlify.com/drop and drag in the folder containing `index.html`. You get a free https link at once.
- **Cloudflare Pages:** connect your private GitHub repo and deploy with no build command.
- Note: GitHub Pages is free only for public repositories.

Put the final https address into Supabase's Site URL and Redirect URLs (step 1.3).

## 4. Test before sharing
1. Open the site, click **List your business**, sign in with your email.
2. Add a listing with a photo and "Use my current location".
3. Open the site on another phone: the listing should appear, and "Near me" and "Directions" should work.

## 5. Before real shop owners use it
- Write a Terms of Use and Privacy Policy (you collect emails and phone numbers; read the current DPDP Act rules).
- Supabase's built-in email has very low sending limits. Add your own SMTP (a free tier from a mail service) under Authentication settings.
- Free Supabase projects can pause after a period of inactivity. Check current free-tier rules and visit the dashboard regularly.
- Moderation: to approve listings before they appear, change the `approved` default to false in the table and restrict the insert policy accordingly.
- Buy a domain (for example a .in name) and connect it in Netlify or Cloudflare.
