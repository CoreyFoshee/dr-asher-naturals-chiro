# Formspree – configured

**Endpoint:** `https://formspree.io/f/xzdwogej`  
**Notifications:** info@doctorasher.com (set in Formspree dashboard)

## Integration used

Static HTML site on Amplify → **Vanilla JS (Ajax)** via `formspree-forms.js` (fetch + `Accept: application/json`), with **Basic HTML** fallback (`action` + `method="POST"` on each form).

Forms connected:
- `/contact-us/` – main contact form
- Floating **Contact Us** sidebar – all pages

## Config file

`drasher-static/drashernaturals.com/formspree-config.js`

## Test

1. Confirm the form in Formspree (check email if first submission).
2. Submit on [doctorasher.com/contact-us/](https://doctorasher.com/contact-us/)
3. Check Formspree dashboard → Submissions.
