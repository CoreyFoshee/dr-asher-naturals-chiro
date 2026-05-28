#!/usr/bin/env python3
"""Clean WordPress-style and index.html links in static site HTML."""
import re
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parents[1] / "drasher-static" / "drashernaturals.com"

# Known page slugs (folder names with index.html)
PAGE_SLUGS = {
    "meet-the-doctor",
    "symptoms-and-conditions",
    "treatments",
    "adjustment-manipulation",
    "accu-spina-decompression",
    "physical-therapy",
    "myofascial-release-therapy",
    "digital-x-ray",
    "electrical-stimulation-and-heat-therapy",
    "naturopathic-doctor",
    "what-to-expect",
    "reviews",
    "contact-us",
    "make-an-appointment",
    "services",
    "privacy-policy",
    "terms-conditions",
}


def web_path_for(file_path: Path) -> str:
    rel = file_path.relative_to(SITE_ROOT)
    if rel.name == "index.html" and rel.parent == Path("."):
        return "/"
    if rel.name == "index.html":
        return f"/{rel.parent.as_posix()}/"
    if rel.suffix == ".html" and rel.parent == Path("."):
        return f"/{rel.name}"
    return "/"


def clean_html(content: str, current_path: str) -> str:
    # WordPress ?p= home URLs (encoded and literal)
    content = re.sub(r"(?:\.\./)*index\.html%3Fp=\d+\.html", "/", content)
    content = re.sub(r"index\.html%3Fp=\d+\.html", "/", content)
    content = re.sub(r"(?:\.\./)*index\.html\?p=\d+\.html", "/", content)
    content = re.sub(r"index\.html\?p=\d+\.html", "/", content)

    # Internal pages: ../slug/index.html or slug/index.html -> /slug/
    for slug in sorted(PAGE_SLUGS, key=len, reverse=True):
        content = re.sub(
            rf"(?:\.\./)+{re.escape(slug)}/index\.html",
            f"/{slug}/",
            content,
        )
        content = re.sub(
            rf'(?<=["\'\s(]){re.escape(slug)}/index\.html',
            f"/{slug}/",
            content,
        )

    # Standalone HTML at site root
    content = re.sub(
        r"(?:\.\./)+therapeutic-exercise-service\.html",
        "/therapeutic-exercise-service.html",
        content,
    )
    content = re.sub(
        r'(?<=["\'\s(])therapeutic-exercise-service\.html',
        "/therapeutic-exercise-service.html",
        content,
    )

    # Home via ../index.html
    content = re.sub(r"(?:\.\./)+index\.html", "/", content)

    # Self/current index.html in attributes (not wp paths)
    content = re.sub(
        r'(href|action)=(["\'])index\.html(#?[^"\']*)?\2',
        lambda m: f'{m.group(1)}={m.group(2)}{current_path}{m.group(3) or ""}{m.group(2)}',
        content,
    )

    # Canonical
    content = re.sub(
        r'<link rel="canonical" href="[^"]*"',
        f'<link rel="canonical" href="{current_path}"',
        content,
        count=1,
    )

    # Remove WordPress shortlink
    content = re.sub(
        r"<link rel=['\"]shortlink['\"] href=['\"][^'\"]*['\"]\s*/>\s*",
        "",
        content,
    )

    # Fix accidental double slashes in paths (not in https://)
    content = re.sub(r'(?<!:)(?<=["\'(])/+', "/", content)
    content = re.sub(r'href="/(#)', r'href="\1', content)

    return content


def main() -> None:
    updated = 0
    for path in SITE_ROOT.rglob("*.html"):
        # Skip mistaken WordPress export duplicates at site root
        if path.name.startswith("index.html?"):
            continue
        if "wp-content" in path.parts or "wp-includes" in path.parts:
            # Still clean nav links in plugin asset HTML if present
            pass

        original = path.read_text(encoding="utf-8", errors="replace")
        cleaned = clean_html(original, web_path_for(path))
        if cleaned != original:
            path.write_text(cleaned, encoding="utf-8")
            updated += 1
            print(f"updated: {path.relative_to(SITE_ROOT)}")

    # Remove duplicate export files
    removed = 0
    for path in SITE_ROOT.glob("index.html?p=*.html"):
        path.unlink()
        removed += 1
        print(f"removed: {path.name}")

    print(f"\nDone. Updated {updated} files, removed {removed} duplicate exports.")


if __name__ == "__main__":
    main()
