#!/usr/bin/env python3
"""Remove WordPress CF7 and broken wp-emoji loader from static HTML."""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1] / "drasher-static" / "drashernaturals.com"


def clean_html(text: str) -> str:
    # Contact Form 7 (no WordPress API on static host)
    text = re.sub(
        r'<script[^>]*src="[^"]*contact-form-7/includes/swv/js/index\.js[^"]*"[^>]*></script>\s*',
        "",
        text,
    )
    text = re.sub(
        r'<script type="text/javascript" id="contact-form-7-js-before">.*?</script>\s*',
        "",
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r'<script[^>]*src="[^"]*contact-form-7/includes/js/index\.js[^"]*"[^>]*></script>\s*',
        "",
        text,
    )

    # wp-emoji loader fetching dead drashernaturals.com URL
    text = re.sub(
        r'<script id="wp-emoji-settings" type="application/json">.*?</script>\s*'
        r'<script type="module">.*?wp-emoji-loader.*?</script>\s*',
        "",
        text,
        flags=re.DOTALL,
    )

    # Old domain → current site
    text = text.replace("https://drashernaturals.com", "https://doctorasher.com")
    text = text.replace("http://drashernaturals.com", "https://doctorasher.com")

    return text


def main() -> None:
    n = 0
    for path in SITE.rglob("*.html"):
        if "wp-content/plugins" in str(path) and "ninja-google" in str(path):
            pass  # still clean these
        original = path.read_text(encoding="utf-8", errors="replace")
        cleaned = clean_html(original)
        if cleaned != original:
            path.write_text(cleaned, encoding="utf-8")
            n += 1
            print(path.relative_to(SITE))
    print(f"\nCleaned {n} files.")


if __name__ == "__main__":
    main()
