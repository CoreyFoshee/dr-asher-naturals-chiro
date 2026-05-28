#!/usr/bin/env python3
"""Pre-launch site cleanup: SEO, performance, search, booking, address, Instagram."""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1] / "drasher-static" / "drashernaturals.com"
BASE = "https://doctorasher.com"

SEO = {
    "index.html": {
        "path": "",
        "title": "Dr. Asher Natural Chiropractic | Terrytown, LA",
        "description": "Chiropractic care in Terrytown, LA. Natural treatment for neck pain, back pain, headaches, and wellness. Call (504) 336-2707.",
    },
    "meet-the-doctor/index.html": {
        "path": "meet-the-doctor/",
        "title": "Meet The Doctor | Dr. Asher Natural Chiropractic",
        "description": "Meet Dr. Don Asher Collins, chiropractor serving Terrytown and the Westbank. Family chiropractic care with diverse treatment methods.",
    },
    "symptoms-and-conditions/index.html": {
        "path": "symptoms-and-conditions/",
        "title": "Symptoms & Conditions | Dr. Asher Natural Chiropractic",
        "description": "Chiropractic care for headaches, neck pain, back pain, sciatica, and more. Dr. Asher Natural Chiropractic in Terrytown, LA.",
    },
    "treatments/index.html": {
        "path": "treatments/",
        "title": "Treatments | Dr. Asher Natural Chiropractic",
        "description": "Chiropractic adjustments, decompression, physical therapy, X-ray, and more. Comprehensive care in Terrytown, LA.",
    },
    "adjustment-manipulation/index.html": {
        "path": "adjustment-manipulation/",
        "title": "Adjustment & Manipulation | Dr. Asher Natural Chiropractic",
        "description": "Chiropractic adjustments and spinal manipulation in Terrytown, LA. Restore alignment and nervous system function.",
    },
    "accu-spina-decompression/index.html": {
        "path": "accu-spina-decompression/",
        "title": "ACCU-Spina Decompression | Dr. Asher Natural Chiropractic",
        "description": "FDA-approved spinal decompression therapy for disc bulges, herniations, and sciatica. Terrytown, LA.",
    },
    "physical-therapy/index.html": {
        "path": "physical-therapy/",
        "title": "Physical Therapy | Dr. Asher Natural Chiropractic",
        "description": "Therapeutic exercise and physical therapy support alongside chiropractic care in Terrytown, LA.",
    },
    "myofascial-release-therapy/index.html": {
        "path": "myofascial-release-therapy/",
        "title": "Myofascial Release Therapy | Dr. Asher Natural Chiropractic",
        "description": "Myofascial release therapy to relieve muscle tension and support chiropractic treatment in Terrytown, LA.",
    },
    "digital-x-ray/index.html": {
        "path": "digital-x-ray/",
        "title": "Digital X-Ray | Dr. Asher Natural Chiropractic",
        "description": "On-site digital X-ray for accurate diagnosis. Dr. Asher Natural Chiropractic, Terrytown, LA.",
    },
    "electrical-stimulation-and-heat-therapy/index.html": {
        "path": "electrical-stimulation-and-heat-therapy/",
        "title": "Electrical Stimulation & Heat Therapy | Dr. Asher",
        "description": "Electrical stimulation and heat therapy for pain management. Terrytown chiropractic clinic.",
    },
    "naturopathic-doctor/index.html": {
        "path": "naturopathic-doctor/",
        "title": "Naturopathic Doctor | Dr. Asher Natural Chiropractic",
        "description": "Holistic naturopathic support alongside chiropractic care. Dr. Asher Natural Chiropractic, Terrytown, LA.",
    },
    "what-to-expect/index.html": {
        "path": "what-to-expect/",
        "title": "What To Expect | Dr. Asher Natural Chiropractic",
        "description": "What to expect at your first chiropractic visit. Dr. Asher Natural Chiropractic, Terrytown, LA.",
    },
    "reviews/index.html": {
        "path": "reviews/",
        "title": "Patient Testimonials | Dr. Asher Natural Chiropractic",
        "description": "Read patient reviews and testimonials. Dr. Asher Natural Chiropractic, Terrytown, LA.",
    },
    "contact-us/index.html": {
        "path": "contact-us/",
        "title": "Contact Us | Dr. Asher Natural Chiropractic",
        "description": "Contact Dr. Asher Natural Chiropractic in Terrytown, LA. Call (504) 336-2707 or send a message online.",
    },
    "make-an-appointment/index.html": {
        "path": "make-an-appointment/",
        "title": "Make An Appointment | Dr. Asher Natural Chiropractic",
        "description": "Schedule your chiropractic appointment. Call (504) 336-2707. Office hours and location in Terrytown, LA.",
    },
    "services/index.html": {
        "path": "services/",
        "title": "Our Services | Dr. Asher Natural Chiropractic",
        "description": "Chiropractic services including adjustments, decompression, therapy, and wellness care in Terrytown, LA.",
    },
    "privacy-policy/index.html": {
        "path": "privacy-policy/",
        "title": "Privacy Policy | Dr. Asher Natural Chiropractic",
        "description": "Privacy policy for doctorasher.com and Dr. Asher Natural Chiropractic.",
    },
    "terms-conditions/index.html": {
        "path": "terms-conditions/",
        "title": "Terms & Conditions | Dr. Asher Natural Chiropractic",
        "description": "Terms and conditions for using doctorasher.com.",
    },
    "therapeutic-exercise-service.html": {
        "path": "therapeutic-exercise-service.html",
        "title": "Therapeutic Exercise | Dr. Asher Natural Chiropractic",
        "description": "Therapeutic exercise programs to support recovery and chiropractic care in Terrytown, LA.",
    },
}


def rel_prefix(path: Path) -> str:
    depth = len(path.relative_to(SITE).parts) - 1
    return "../" * depth


def strip_performance_bloat(text: str, is_contact: bool) -> str:
    # Booked plugin inline + assets
    text = re.sub(
        r"<style type=\"text/css\" media=\"screen\">#ui-datepicker-div\.booked.*?</style>\s*",
        "",
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r"<link rel='stylesheet' id='booked[^']*'[^>]*>\s*",
        "",
        text,
    )
    text = re.sub(
        r"<link rel='stylesheet' id='admin-bar-css'[^>]*>\s*",
        "",
        text,
    )
    text = re.sub(
        r"<style id='admin-bar-inline-css'[^>]*>.*?</style>\s*",
        "",
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r"<link rel='stylesheet' id='dashicons-css'[^>]*>\s*",
        "",
        text,
    )
    if not is_contact:
        text = re.sub(
            r"<link rel='stylesheet' id='contact-form-7-css'[^>]*>\s*",
            "",
            text,
        )
    text = re.sub(
        r"<script[^>]*src=\"[^\"]*booked[^\"]*\"[^>]*></script>\s*",
        "",
        text,
    )
    text = re.sub(
        r"<script type=\"text/javascript\" id=\"booked-functions-js-extra\">.*?</script>\s*",
        "",
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r"<script[^>]*src=\"[^\"]*jquery/ui/datepicker[^\"]*\"[^>]*></script>\s*",
        "",
        text,
    )
    text = re.sub(
        r"<script type=\"text/javascript\" id=\"jquery-ui-datepicker-js-after\">.*?</script>\s*",
        "",
        text,
        flags=re.DOTALL,
    )
    return text


def remove_search_block(text: str) -> str:
    return re.sub(
        r'<div id="search-outer" class="nectar">.*?</div><!--/search-outer-->\s*',
        "",
        text,
        flags=re.DOTALL,
    )


def remove_instagram(text: str) -> str:
    text = re.sub(
        r"<li id=\"mystickyelements-social-insagram\".*?</li>\s*",
        "",
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r"<li>\s*<a href=\"#\"><i class=\"fa fa-instagram\".*?</li>\s*",
        "",
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r"<a class=\"social-link-insagram\".*?</a>\s*",
        "",
        text,
        flags=re.DOTALL,
    )
    return text


def fix_address(text: str) -> str:
    text = text.replace("Gretna, LA 70056", "Terrytown, LA 70056")
    text = text.replace("Gretna,+LA+70056", "Terrytown,+LA+70056")
    text = text.replace("%233+Gretna", "%233+Terrytown")
    return text


def apply_seo(text: str, rel: str, meta: dict) -> str:
    url = BASE + "/" + meta["path"]
    title = meta["title"]
    desc = meta["description"]

    text = re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", text, count=1)

    meta_desc = f'<meta name="description" content="{desc}" />'
    if re.search(r'<meta name="description"', text):
        text = re.sub(r'<meta name="description"[^>]*>', meta_desc, text, count=1)
    else:
        text = re.sub(
            r"(<meta name=\"viewport\"[^>]*>)",
            r"\1\n\t" + meta_desc,
            text,
            count=1,
        )

    canonical = f'<link rel="canonical" href="{url}" />'
    if re.search(r'<link rel="canonical"', text):
        text = re.sub(r'<link rel="canonical"[^>]*>', canonical, text, count=1)
    else:
        text = re.sub(r"(</title>)", r"\1\n\t" + canonical, text, count=1)

    og = (
        f'<meta property="og:title" content="{title}" />\n\t'
        f'<meta property="og:description" content="{desc}" />\n\t'
        f'<meta property="og:url" content="{url}" />\n\t'
        f'<meta property="og:type" content="website" />'
    )
    if "og:title" not in text:
        text = re.sub(r"(<link rel=\"canonical\"[^>]*>)", r"\1\n\t" + og, text, count=1)

    return text


def ensure_site_launch_css(text: str, prefix: str) -> str:
    link = f'<link rel="stylesheet" href="{prefix}site-launch.css" />'
    if "site-launch.css" in text:
        return text
    if 'id="mobile-menu-fix.css"' in text or "mobile-menu-fix.css" in text:
        return re.sub(
            r'(<link rel="stylesheet" href="[^"]*mobile-menu-fix\.css"[^>]*>)',
            r"\1\n\t" + link,
            text,
            count=1,
        )
    return re.sub(r"(</head>)", f"\t{link}\n\\1", text, count=1)


def process_html(path: Path) -> bool:
    rel = path.relative_to(SITE).as_posix()
    if rel not in SEO:
        return False

    text = path.read_text(encoding="utf-8", errors="replace")
    original = text
    prefix = rel_prefix(path)
    is_contact = rel == "contact-us/index.html"

    text = fix_address(text)
    text = remove_search_block(text)
    text = remove_instagram(text)
    text = strip_performance_bloat(text, is_contact)
    text = apply_seo(text, prefix, SEO[rel])
    text = ensure_site_launch_css(text, prefix)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def create_404() -> None:
    content = f"""<!doctype html>
<html lang="en-US">
<head>
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1">
\t<title>Page Not Found | Dr. Asher Natural Chiropractic</title>
\t<meta name="description" content="The page you requested was not found. Visit Dr. Asher Natural Chiropractic in Terrytown, LA." />
\t<link rel="canonical" href="{BASE}/404.html" />
\t<link rel="stylesheet" href="wp-content/themes/salient/css/build/style.css%3Fver=14.0.css" />
\t<link rel="stylesheet" href="site-launch.css" />
\t<style>
\t\tbody {{ font-family: 'Open Sans', sans-serif; margin: 0; padding: 2rem; text-align: center; color: #333; }}
\t\t.wrap {{ max-width: 32rem; margin: 4rem auto; }}
\t\th1 {{ color: #34a853; font-size: 2rem; margin-bottom: 0.5rem; }}
\t\tp {{ line-height: 1.6; margin: 1rem 0; }}
\t\ta.btn {{ display: inline-block; margin: 0.5rem; padding: 0.75rem 1.5rem; background: #34a853; color: #fff; text-decoration: none; border-radius: 4px; }}
\t\ta.btn:hover {{ background: #2d8f47; }}
\t</style>
</head>
<body>
\t<div class="wrap">
\t\t<h1>Page not found</h1>
\t\t<p>Sorry, we couldn't find that page. It may have moved or the link is outdated.</p>
\t\t<p><a class="btn" href="/">Go to homepage</a> <a class="btn" href="/contact-us/">Contact us</a></p>
\t\t<p>Or call <a href="tel:+15043362707">(504) 336-2707</a></p>
\t</div>
</body>
</html>
"""
    (SITE / "404.html").write_text(content, encoding="utf-8")


def main() -> None:
    updated = 0
    for rel in SEO:
        if process_html(SITE / rel):
            updated += 1
            print(f"updated: {rel}")
    create_404()
    print(f"\nDone. Updated {updated} pages, created 404.html")


if __name__ == "__main__":
    main()
