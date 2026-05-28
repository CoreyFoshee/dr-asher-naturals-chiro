#!/usr/bin/env python3
"""Add formspree-config.js and formspree-forms.js to site HTML pages."""
from pathlib import Path

SITE = Path(__file__).resolve().parents[1] / "drasher-static" / "drashernaturals.com"


def main() -> None:
    updated = 0
    for path in SITE.rglob("*.html"):
        if "wp-content" in path.parts or "wp-includes" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if "formspree-config.js" in text:
            continue

        depth = len(path.relative_to(SITE).parts) - 1
        prefix = "../" * depth
        snippet = (
            f'\t\t<script src="{prefix}formspree-config.js"></script>\n'
            f'\t\t<script src="{prefix}formspree-forms.js"></script>\n'
        )
        anchor = f'<script src="{prefix}mobile-menu-fix.js"></script>'
        if anchor in text:
            text = text.replace(anchor, anchor + "\n" + snippet, 1)
        else:
            text = text.replace("</body>", snippet + "</body>", 1)

        # Sticky sidebar form → Formspree
        text = text.replace(
            '<form id="stickyelements-form" class="stickyelements-form" action="/" method="post"',
            '<form id="stickyelements-form" class="stickyelements-form" data-formspree="sidebar" action="#" method="POST"',
        )
        text = text.replace(
            '<form id="stickyelements-form" class="stickyelements-form" action="/contact-us/" method="post"',
            '<form id="stickyelements-form" class="stickyelements-form" data-formspree="sidebar" action="#" method="POST"',
        )
        text = text.replace(
            'placeholder="info@doctorasher.com"',
            'placeholder="Your email"',
        )

        path.write_text(text, encoding="utf-8")
        updated += 1
        print(f"updated: {path.relative_to(SITE)}")

    print(f"\nDone. Updated {updated} files.")


if __name__ == "__main__":
    main()
