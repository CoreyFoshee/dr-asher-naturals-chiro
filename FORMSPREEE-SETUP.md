# Formspree setup (one-time, ~2 minutes)

The site is wired for Formspree. You only need to paste your form ID.

## Steps

1. Go to [https://formspree.io](https://formspree.io) and sign up (free tier is fine).
2. Click **+ New Form** and name it (e.g. `Doctor Asher Contact`).
3. Set notifications to **info@doctorasher.com**.
4. Open the form → **Integration** (or **Endpoint**) and copy the URL, e.g.  
   `https://formspree.io/f/abcxyzqw`
5. Edit this file in the repo:

   `drasher-static/drashernaturals.com/formspree-config.js`

   Replace `REPLACE_WITH_YOUR_FORM_ID` with your ID only (the part after `/f/`):

   ```javascript
   window.FORMSPREE_ENDPOINT = 'https://formspree.io/f/abcxyzqw';
   ```

6. Commit and push (or redeploy on Amplify).
7. Formspree may email you once to **confirm** the form—click that link.
8. Test:
   - [https://doctorasher.com/contact-us/](https://doctorasher.com/contact-us/)
   - Floating **Contact Us** tab on the left

Until step 5 is done, submit buttons open a `mailto:info@doctorasher.com` link instead.

## What was connected

- **Contact Us** page form (Contact Form 7 markup, now posts to Formspree)
- **Floating sidebar** contact form on every page

Both use the same endpoint from `formspree-config.js`.
