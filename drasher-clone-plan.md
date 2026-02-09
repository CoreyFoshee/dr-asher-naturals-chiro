# Dr. Asher Naturals – WordPress to Static HTML Clone Plan

**Target site:** https://drashernaturals.com  
**Goal:** Produce a static HTML clone (no WordPress). No admin access; clone from public site only.

---

## Phase 1: Discover all pages (sitemap)

1. **Fetch sitemap(s)**  
   Try in order until one works:
   - `https://drashernaturals.com/sitemap.xml`
   - `https://drashernaturals.com/sitemap_index.xml`
   - `https://drashernaturals.com/sitemap-index.xml`
   - Check `https://drashernaturals.com/robots.txt` for a `Sitemap:` line.

2. **Parse sitemap XML**  
   Extract every `<loc>` URL. If the sitemap is an index, follow any child sitemap URLs and collect all page URLs.

3. **Fallback URL list** (if sitemap fails or is missing pages)  
   Use this list and normalize to the site’s actual URL structure (e.g. add trailing slashes, match observed paths):
   - `/` (home)
   - `/meet-the-doctor/`
   - `/symptoms-and-conditions/`
   - `/what-to-expect/`
   - `/testimonials/`
   - `/contact-us/`
   - `/make-an-appointment/`
   - `/treatments/adjustment-manipulation/` (or `adjustment-manipulation/`)
   - `/treatments/accu-spina-decompression/`
   - `/treatments/physical-therapy/`
   - `/treatments/therapeutic-exercise/`
   - `/treatments/myofascial-release-therapy/`
   - `/treatments/digital-x-ray/`
   - `/treatments/electrical-stimulation-and-heat-therapy/`
   - `/treatments/naturopathic-doctor/`
   - `/privacy-policy/`
   - `/terms-conditions/` or `/terms-and-conditions/`

4. **Output**  
   Save the final list of URLs to a file (e.g. `urls-to-clone.txt` or `sitemap-urls.txt`) for use in Phase 2 and 3.

---

## Phase 2: Mirror the site with a crawler

1. **Choose tool**  
   Prefer **wget** (usually available). If not, use **HTTrack** if installed.

2. **Run crawler**  
   - **wget:**  
     `wget --mirror -p -k -E -np -e robots=off --no-check-certificate -P ./drasher-static https://drashernaturals.com`  
     (Adjust `-P` path if needed; `-p` page requisites, `-k` convert links for local viewing, `-E` add .html extension where appropriate.)
   - **HTTrack:**  
     `httrack "https://drashernaturals.com" -O "./drasher-static" "+*drashernaturals.com*"`

3. **Result**  
   All discovered pages and assets (HTML, CSS, JS, images) should be under a single output directory (e.g. `drasher-static` or `drashernaturals.com/`).

---

## Phase 3: Screenshot every sitemap page (optional but recommended)

1. **Load URL list**  
   Use the list from Phase 1 (sitemap + fallback).

2. **For each URL:**  
   - Open the URL in the browser (e.g. via Playwright/browser MCP).
   - Take a full-page screenshot.
   - Save with a safe filename derived from the path (e.g. `home.png`, `meet-the-doctor.png`, `treatments-accu-spina.png`).

3. **Output**  
   Store screenshots in a folder (e.g. `screenshots/`) so we have a visual record of every sitemap page.

---

## Phase 4: Verify and document

1. **Verify clone**  
   - Confirm the output directory contains an `index.html` (or equivalent) for the homepage.
   - Spot-check a few inner pages and key assets (CSS, images).

2. **Document**  
   - Note where the static clone lives (e.g. `./drasher-static`).
   - Note where the URL list and screenshots are saved.
   - If any known menu pages are missing from the crawl, list them for manual follow-up.

---

## Deliverables

| Item | Location / description |
|------|------------------------|
| List of URLs to clone | `urls-to-clone.txt` (or similar) |
| Static HTML clone | `drasher-static/` (or path chosen in Phase 2) |
| Full-page screenshots | `screenshots/` (one per sitemap URL) |
| Short summary | What was cloned, any missing pages, how to open the clone locally |

---

## How to run this plan (agent instructions)

When executing this plan, the agent should:

1. **Phase 1:** Fetch and parse sitemap; if needed, use the fallback URL list; write the final URL list to a file.
2. **Phase 2:** Run wget (or HTTrack) to mirror the site into the chosen output directory.
3. **Phase 3:** For each URL in the list, open in browser and save a full-page screenshot under `screenshots/`.
4. **Phase 4:** Verify the clone and document locations and any missing pages.

Use this file as the single source of instructions for cloning https://drashernaturals.com to static HTML and capturing all sitemap pages.
