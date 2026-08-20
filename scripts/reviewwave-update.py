#!/usr/bin/env python3
"""ReviewWave, team rename, nav schedule button, booking links."""
from pathlib import Path
import re

SITE = Path(__file__).resolve().parents[1] / "drasher-static" / "drashernaturals.com"

SCHEDULE_NAV = (
    '<li id="menu-item-schedule" class="menu-item menu-item-schedule nectar-regular-menu-item menu-item-schedule-nav">'
    '<a href="/schedule-appointment/"><span class="menu-title-text">Schedule Appointment</span></a></li>\n'
)

SCHEDULE_MOBILE = (
    '<li class="menu-item menu-item-schedule"><a href="/schedule-appointment/">Schedule Appointment</a></li>\n'
)

REVIEWWAVE_BADGE = """
<!-- ReviewWave review badge (homepage) -->
<script>/*<![CDATA[*/window._rwREEl=(window._rwREEl||[]).concat(JSON.parse('{"el_id":"dbf84fab-c551-4d2e-b105-e262da6c40be","mode":"badge","pos":"bottom-left","key":"11256-94a2-165a-98c8-3bee"}'))/*]]>*/</script>
<script src="https://rw-embed-data.s3.amazonaws.com/11256-94a2-165a-98c8-3bee.js"></script>
<script src="https://cdn.reviewwave.com/js/reviews_embed.js"></script>
"""

SMS_PRIVACY = """
<div class="toggle default" data-inner-wrap="true"><h3><a href="/privacy-policy/#sms-messaging"><i class="fa fa-plus-circle"></i>Text Messaging (SMS) &amp; Mobile Information:</a></h3><div><div class="inner-toggle-wrap">
<div class="wpb_text_column wpb_content_element " >
	<div class="wpb_wrapper">
		<p id="sms-messaging">Our SMS program provides appointment reminders, updates, notifications, and informative messages related to our chiropractic services. By subscribing to our SMS program or providing your mobile number through our online scheduler or contact forms, you consent to receive SMS messages at the phone number provided. Message frequency may vary based on your interaction with our services.</p>
		<p><strong>We do not share your mobile information with third parties or affiliates for marketing or promotional purposes.</strong> Text messaging originator opt-in data and consent will not be shared with any third parties under any circumstances. We may share your data with trusted service providers who assist us in operating our SMS program, provided they agree to keep your data confidential and use it solely to provide services on our behalf.</p>
		<p>You may opt out at any time by replying <strong>STOP</strong> to any SMS message from us, or by contacting us at <a href="tel:+15043362707">(504) 336-2707</a> or <a href="mailto:info@doctorasher.com">info@doctorasher.com</a>. Reply <strong>HELP</strong> for help. Message and data rates may apply.</p>
	</div>
</div>
</div></div></div>"""

SMS_TERMS = """
<div class="toggle default" data-inner-wrap="true"><h3><a href="/terms-conditions/#sms-messaging"><i class="fa fa-plus-circle"></i>8. Text Messaging (SMS) Terms:</a></h3><div><div class="inner-toggle-wrap">
<div class="wpb_text_column wpb_content_element " >
	<div class="wpb_wrapper">
		<p id="sms-messaging">By providing your phone number and opting in to receive text messages from Dr. Asher Natural Chiropractic, you consent to receive marketing, updates, appointment reminders, and informative SMS messages at the number provided. <strong>Consent is not a condition of purchase.</strong> Message and data rates may apply. Message frequency varies.</p>
		<p>You may unsubscribe at any time by replying <strong>STOP</strong> or reply <strong>HELP</strong> for help. See our <a href="/privacy-policy/">Privacy Policy</a> for how we handle mobile information. We do not share mobile opt-in data with third parties for marketing or promotional purposes.</p>
	</div>
</div>
</div></div></div>"""

CECI_CAROUSEL = """<div class="carousel-item"><div id="outteam-inr1" data-midnight="" data-column-margin="default" class="wpb_row vc_row-fluid vc_row inner_row vc_row-o-equal-height vc_row-flex vc_row-o-content-middle"  style=""><div class="row-bg-wrap"> <div class="row-bg" ></div> </div><div class="row_col_wrap_12_inner col span_12  left">
	<div  class="vc_col-sm-6 clm1 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone "   data-padding-pos="all" data-has-bg-color="false" data-bg-color="" data-bg-opacity="1" data-animation="" data-delay="0" >
		<div class="vc_column-inner" >
		<div class="wpb_wrapper">
			<div class="img-with-aniamtion-wrap  custom-size" data-max-width="100%" data-max-width-mobile="default" data-shadow="none" data-animation="fade-in" >
      <div class="inner">
        <div class="hover-wrap"> 
          <div class="hover-wrap-inner">
            <img decoding="async" class="img-with-animation skip-lazy " data-delay="0" height="500" width="500" data-animation="fade-in" src="wp-content/uploads/2026/08/cecilia-nettles-square.jpg" alt="Cecilia Nettles, Chiropractic Assistant" srcset="wp-content/uploads/2026/08/cecilia-nettles-square.jpg 737w" sizes="600*600" />
          </div>
        </div>
      </div>
    </div>
		</div> 
	</div>
	</div> 

	<div  class="vc_col-sm-6 clm1 clm2 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone "   data-padding-pos="all" data-has-bg-color="false" data-bg-color="" data-bg-opacity="1" data-animation="" data-delay="0" >
		<div class="vc_column-inner" >
		<div class="wpb_wrapper">
			
<div class="wpb_text_column wpb_content_element " >
	<div class="wpb_wrapper">
		<h3><span style="color: #4a993c;"><strong>Chiropractic Assistant Cecilia Nettles (Ceci)</strong></span></h3>
<p>Ceci joined Dr. Asher Natural Chiropractic in the summer of 2025 as our Chiropractic Assistant. She is often the first friendly face to welcome you through our doors. Her warm smile, positive attitude, and genuine care for others help patients feel comfortable from the moment they arrive.</p>
<p>After graduating from high school in 2022, Ceci chose to pursue her passion for working with people and building meaningful connections. Before joining our team full-time, she served as an Assistant Manager at PJ&#8217;s Coffee, where she developed her love for customer service—and, of course, great coffee! Today, she brings that same enthusiasm and positive energy to our office each day.</p>
<p>One of Ceci&#8217;s favorite parts of her job is getting to know our patients and watching their progress as they move from pain and discomfort toward healthier, happier lives. She especially enjoys interacting with the babies and children who visit our office, helping them feel comfortable and entertained while their parents receive care.</p>
<p>When she&#8217;s not at the office, you&#8217;ll likely find Ceci curled up with a good book and a cup of coffee, relaxing at the beach, or spending quality time with her friends and family.</p>
	</div>
</div>



<a class="nectar-button large regular accent-color  regular-button"  style="" href="/schedule-appointment/" data-color-override="false" data-hover-color-override="false" data-hover-text-color-override="#fff"><span>SCHEDULE APPOINTMENT</span></a>
		</div> 
	</div>
	</div> 
</div></div></div></div>"""


def depth_prefix(path: Path) -> str:
    rel = path.relative_to(SITE)
    parts = rel.parts
    if len(parts) <= 1:
        return ""
    return "../" * (len(parts) - 1)


def fix_paths(html: str, prefix: str) -> str:
    if not prefix:
        return html
    return html.replace('href="/', f'href="{prefix}').replace('href="/#', f'href="{prefix}#')


def process_html(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text
    prefix = depth_prefix(path)

    # Team rename
    text = text.replace("Meet The Doctor", "Meet Our Team")
    text = text.replace("Meet the Doctor", "Meet Our Team")

    # Nav: Schedule Appointment first in main menu
    if 'menu-item-schedule' not in text and 'class="sf-menu">' in text and 'menu-item-30' in text:
        text = text.replace(
            '<ul class="sf-menu">\n\t\t\t\t\t\t\t\t<li id="menu-item-30"',
            '<ul class="sf-menu">\n\t\t\t\t\t\t\t\t' + SCHEDULE_NAV + '\t\t\t\t\t\t\t\t<li id="menu-item-30"',
            1,
        )
        # Some pages use different whitespace
        text = text.replace(
            '<ul class="sf-menu"><li id="menu-item-30"',
            '<ul class="sf-menu">' + SCHEDULE_NAV.replace('\n', '') + '<li id="menu-item-30"',
            1,
        )

    # Mobile off-canvas menu (first item in ul.menu inside off-canvas container)
    if "off-canvas-menu-container" in text:
        oc_start = text.find("off-canvas-menu-container")
        oc_end = oc_start + 4000 if oc_start != -1 else 0
        oc_chunk = text[oc_start:oc_end]
        if "menu-item-schedule" not in oc_chunk:
            text = re.sub(
                r'(<div class="off-canvas-menu-container[^"]*"[^>]*>\s*[\s\S]*?<ul class="menu">\s*)',
                r"\1" + SCHEDULE_MOBILE,
                text,
                count=1,
            )

    # Booking CTAs -> schedule page
    text = text.replace('href="/make-an-appointment/"', 'href="/schedule-appointment/"')
    text = re.sub(
        r'<span>BOOK AN APPOINTMENT</span>',
        '<span>SCHEDULE APPOINTMENT</span>',
        text,
        flags=re.I,
    )
    text = re.sub(
        r'<span>Make An Appointment</span>',
        '<span>Schedule Appointment</span>',
        text,
        flags=re.I,
    )
    text = re.sub(
        r'>Make An Appointment</a>',
        '>Schedule Appointment</a>',
        text,
        flags=re.I,
    )
    text = re.sub(
        r'>Make An Appointment<',
        '>Schedule Appointment<',
        text,
        flags=re.I,
    )

    # Footer meet link text
    text = text.replace(
        '<i class="fa fa-angle-right" aria-hidden="true"></i> Meet The Doctor</a>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i> Meet Our Team</a>',
    )

    # Privacy policy updates
    if path.name == "index.html" and "privacy-policy" in str(path):
        text = text.replace(
            '<a href="mailto:email@website.com">email@website.com</a>',
            '<a href="mailto:info@doctorasher.com">info@doctorasher.com</a>',
        )
        if "Text Messaging (SMS)" not in text:
            text = text.replace(
                '<div class="toggle default" data-inner-wrap="true"><h3><a href="/privacy-policy/#"><i class="fa fa-plus-circle"></i>Contact Us:</a></h3>',
                SMS_PRIVACY + '\n<div class="toggle default" data-inner-wrap="true"><h3><a href="/privacy-policy/#"><i class="fa fa-plus-circle"></i>Contact Us:</a></h3>',
                1,
            )

    # Terms updates
    if path.name == "index.html" and "terms-conditions" in str(path):
        if "8. Text Messaging" not in text:
            terms_anchor = (
                "<p>If you break these terms, we can limit or stop your access to our website.</p>\n\t</div>\n</div>\n\n\n\n"
                "</div></div></div></div></div>"
            )
            terms_replacement = (
                "<p>If you break these terms, we can limit or stop your access to our website.</p>\n\t</div>\n</div>\n\n\n\n"
                "</div></div></div></div>"
                + SMS_TERMS
                + "</div>"
            )
            text = text.replace(terms_anchor, terms_replacement, 1)

    # Team carousel: add Ceci after Katie slide
    if "cecilia-nettles-square.jpg" not in text and "Accu-Spina table." in text:
        img_prefix = prefix
        ceci = CECI_CAROUSEL.replace("wp-content/", f"{img_prefix}wp-content/")
        katie_end = (
            'certified in IDD therapy for spinal decompression via the Accu-Spina table.</p>\n\t</div>\n</div>\n\n\n\n'
            '<a class="nectar-button large regular accent-color  regular-button"  style="" href="/schedule-appointment/" '
            'data-color-override="false" data-hover-color-override="false" data-hover-text-color-override="#fff">'
            "<span>SCHEDULE APPOINTMENT</span></a>\n\t\t</div> \n\t</div>\n\t</div> \n</div></div></div></div>"
        )
        if katie_end in text:
            text = text.replace(katie_end, katie_end + ceci, 1)

    # Homepage: ReviewWave badge + remove Trustindex loader
    if path == SITE / "index.html":
        if "reviews_embed.js" not in text:
            text = text.replace(
                '<script src="homepage-fixes.js"></script>',
                REVIEWWAVE_BADGE + '\n\t\t<script src="homepage-fixes.js"></script>',
            )
        text = re.sub(
            r'<script[^>]*trustindex\.io/loader\.js[^>]*></script>\s*',
            '',
            text,
            count=1,
        )
        if '<pre class="ti-widget">' in text:
            text = re.sub(
                r'\t<div class="wpb_raw_code wpb_content_element wpb_raw_html" >\s*'
                r'<div class="wpb_wrapper">\s*<pre class="ti-widget">.*?</pre>.*?</div>\s*</div>',
                '',
                text,
                flags=re.S,
                count=1,
            )

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main():
    count = 0
    for path in SITE.rglob("*.html"):
        if "wp-content" in str(path):
            continue
        if process_html(path):
            print(path.relative_to(SITE))
            count += 1
    print(f"Updated {count} HTML files")


if __name__ == "__main__":
    main()
