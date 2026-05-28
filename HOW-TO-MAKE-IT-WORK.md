# How to Get Everything That Doesn’t Work to Work

The static clone has **no server or database**, so these pieces need to be reconnected or replaced.

---

## 1. Contact form (Contact Us page)

**Current state:** The form is static HTML. Submitting does nothing (or may try to post to the old WordPress URL and fail).

**Ways to make it work:**

| Option | Effort | Best for |
|--------|--------|----------|
| **Formspree** | Low | Quick fix. Create a free Formspree account, get a form endpoint URL, then change the Contact form’s `<form action="...">` to that URL. Formspree emails you submissions. [formspree.io](https://formspree.io) |
| **Netlify Forms** | Low | If you host this folder on Netlify: add `netlify` or `data-netlify="true"` to the form and a hidden input; Netlify will capture submissions and show them in the Netlify dashboard. |
| **mailto: link** | Easiest | Replace the form with a button or link: `<a href="mailto:info@doctorasher.com?subject=Contact%20from%20website">Email us</a>`. Opens the user’s email client. No server, but less polished. |
| **Your host’s form handler** | Varies | Many hosts (cPanel, etc.) have “FormMail” or a similar script. Point the form `action` to that script and set the recipient email. |

**Concrete Formspree steps:**  
Sign up at formspree.io → New form → get the POST URL (e.g. `https://formspree.io/f/xxxxx`) → in `contact-us/index.html` find the `<form` tag and set `action="https://formspree.io/f/xxxxx"` and `method="POST"`. Keep the existing `name` attributes on inputs so you get readable emails.

---

## 2. Search

**Current state:** There is no search backend; any search box is nonfunctional.

**Ways to make it work:**

| Option | Effort | Best for |
|--------|--------|----------|
| **Google Custom Search** | Low | Add a free Google Custom Search box that searches your **live** site (or a specific URL). Good if the static site is a backup and the real site is still online. |
| **Static/client-side search** | Medium | Use a small JS library (e.g. Fuse.js, Lunr.js) and a prebuilt index of page titles/URLs (or content). No server; search runs in the browser. Requires building a simple index and adding one script + search UI. |
| **Remove or hide search** | Easiest | If the site is small, remove the search box or replace it with a “Popular pages” or “Quick links” list. |

---

## 3. Booking (“Make an appointment” / “Book a consultation”)

**Current state:** These buttons already link to your booking URL (e.g. `ct.ptneng.co`). **They work as-is** — no change needed unless you switch to a different booking system. If you do switch, update those button `href` values in the HTML to the new booking page.

---

## 4. Hosting the static site

To have a live URL (and optional HTTPS):

- Upload the **entire** `drashernaturals.com` folder (the one that contains `index.html`) to your host via FTP/SFTP, or drag it into Netlify/Vercel/GitHub Pages.
- Point your domain (or a subdomain) to that host.
- No WordPress or PHP required; any host that serves static files is enough.

After you have a live URL, you can plug that into Formspree, Google Custom Search, or analytics as needed.

---

## Summary

- **Contact:** Use Formspree (or Netlify Forms / mailto) and point the form to it.
- **Search:** Use Google Custom Search or a client-side search library; or remove the search UI.
- **Booking:** Already works; only update links if you change booking providers.
- **Hosting:** Upload the clone folder to any static host and point the domain.

If you tell me which you want first (e.g. “Formspree contact form”), I can give exact HTML edits for the Contact Us page.
