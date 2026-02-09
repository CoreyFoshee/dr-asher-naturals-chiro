# Dr. Asher Naturals – Clone Summary

**Completed:** Clone plan executed for https://drashernaturals.com

---

## Deliverables

| Item | Location |
|------|----------|
| **URL list** | `urls-to-clone.txt` |
| **Static HTML clone** | `drasher-static/drashernaturals.com/` |
| **Full-page screenshots** | `screenshots/` (19 PNGs) |
| **Plan** | `drasher-clone-plan.md` |

---

## What was done

1. **Phase 1 – Discover pages**  
   Sitemap URLs (`/sitemap.xml`, `/wp-sitemap.xml`) returned 404, so the fallback URL list from the plan was used. Final list saved to `urls-to-clone.txt`.

2. **Phase 2 – Mirror with wget**  
   Full site mirror run with wget (`--mirror -p -k -E -np`). Output is in `drasher-static/`. The clone includes:
   - Homepage: `drasher-static/drashernaturals.com/index.html`
   - Main pages: meet-the-doctor, symptoms-and-conditions, what-to-expect, contact-us, make-an-appointment, treatments, services, reviews (testimonials), privacy-policy, terms-conditions
   - Treatment subpages: adjustment-manipulation, accu-spina-decompression, physical-therapy, digital-x-ray, electrical-stimulation-and-heat-therapy, myofascial-release-therapy, naturopathic-doctor
   - therapeutic-exercise as `therapeutic-exercise-service.html`
   - CSS, JS, images under `wp-content/`, `wp-includes/`
   - Links in HTML were converted for local viewing (relative paths).

3. **Phase 3 – Screenshots**  
   Full-page screenshots taken for every sitemap page (and treatments/services). All saved in `screenshots/`:
   - home.png, meet-the-doctor.png, symptoms-and-conditions.png, what-to-expect.png, testimonials-reviews.png, contact-us.png, make-an-appointment.png
   - adjustment-manipulation.png, accu-spina-decompression.png, physical-therapy.png, therapeutic-exercise.png, myofascial-release-therapy.png, digital-x-ray.png, electrical-stimulation-heat-therapy.png, naturopathic-doctor.png
   - treatments.png, services.png, privacy-policy.png, terms-conditions.png

4. **Phase 4 – Verify**  
   Clone verified: `drasher-static/drashernaturals.com/index.html` exists and contains converted relative links (e.g. `feed/index.html`, `wp-includes/...`). Key inner pages and assets are present.

---

## How to open the clone locally

- **Homepage:** Open `drasher-static/drashernaturals.com/index.html` in a browser (double-click or File → Open).
- **From terminal:**  
  `open "drasher-static/drashernaturals.com/index.html"`  
  Or serve the folder with any static server, e.g.  
  `python3 -m http.server 8000 --directory drasher-static/drashernaturals.com`  
  then visit http://localhost:8000

---

## Notes

- **Testimonials:** The menu links to `/reviews/`; that page was mirrored and captured as `testimonials-reviews.png`.
- **Treatment URLs:** The live site uses paths like `/adjustment-manipulation/` (not under `/treatments/`). The mirror reflects that; all are in the clone and in the screenshot set.
- **wget exit code:** wget exited with code 4 (network/auth errors for some requests); the main content and assets were still downloaded.
- **External links:** Booking (e.g. ct.ptneng.co), Google Maps, and social links still point to the live sites; only same-site links were converted for local use.

---

## Next steps (optional)

- Replace or strip WordPress-specific markup if you want a cleaner static site.
- Update booking/contact links if you change to a new host or form provider.
- Use `screenshots/` as a visual reference when rebuilding or redesigning the site.
