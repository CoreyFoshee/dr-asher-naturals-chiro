const NAVY = '#0B2A4A';
const GREEN = '#4A993C';
const CREAM = '#F6F7F4';
const LOGO = 'https://doctorasher.com/wp-content/uploads/2022/09/logo.png';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e6e6e6;width:34%;vertical-align:top;font-size:13px;font-weight:700;color:${NAVY};">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e6e6e6;font-size:15px;line-height:1.5;color:#222;white-space:pre-wrap;">${escapeHtml(value)}</td>
    </tr>`;
}

function layout({ eyebrow, heading, intro, rowsHtml, footer }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${CREAM};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7ece6;">
          <tr>
            <td style="background:${NAVY};padding:22px 28px;text-align:center;">
              <p style="margin:0;color:${GREEN};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;line-height:1.3;">Dr. Asher Natural Chiropractic</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 8px;text-align:center;background:#ffffff;">
              <img src="${LOGO}" alt="Dr. Asher Natural Chiropractic" width="180" style="max-width:180px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              <h2 style="margin:0 0 10px;color:${NAVY};font-size:20px;">${escapeHtml(heading)}</h2>
              <p style="margin:0 0 18px;color:#444;font-size:15px;line-height:1.6;">${escapeHtml(intro)}</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rowsHtml}</table>
              <p style="margin:22px 0 0;color:#777;font-size:13px;line-height:1.5;">${escapeHtml(footer)}</p>
            </td>
          </tr>
          <tr>
            <td style="background:${GREEN};padding:14px 28px;text-align:center;color:#ffffff;font-size:12px;">
              1800 Carol Sue Ave STE #3 · Terrytown, LA 70056 · (504) 336-2707
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function clinicEmailHtml(data) {
  return layout({
    eyebrow: 'Website inquiry',
    heading: 'New message from the website',
    intro: 'A visitor submitted the contact form. Reply directly to this email to reach them.',
    rowsHtml:
      row('Name', data.name) +
      row('Email', data.email) +
      row('Phone', data.phone) +
      row('Subject', data.subject) +
      row('Message', data.message) +
      row('SMS opt-in', data.smsOptIn) +
      row('Form', data.source) +
      row('Page', data.page),
    footer: 'Sent from doctorasher.com via CF Design.',
  });
}

export function clinicEmailPlain(data) {
  return [
    'New website message',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : '',
    data.subject ? `Subject: ${data.subject}` : '',
    '',
    data.message || '',
    '',
    `SMS opt-in: ${data.smsOptIn || 'n/a'}`,
    `Form: ${data.source}`,
    `Page: ${data.page}`,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

export function visitorEmailPlain(data) {
  return [
    'Thank you — we received your message.',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : '',
    data.subject ? `Subject: ${data.subject}` : '',
    '',
    data.message || '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function parseRecipients(raw) {
  return String(raw || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((address) => ({ address }));
}

export async function sendMaileroo({ subject, html, plain, to, replyTo }) {
  const apiKey = process.env.MAILEROO_API_KEY;
  const fromEmail = process.env.MAILEROO_FROM_EMAIL || 'hello@cfdesign.studio';
  const fromName = process.env.MAILEROO_FROM_NAME || 'Dr. Asher Natural Chiropractic';
  const endpoint = process.env.MAILEROO_API_URL || 'https://smtp.maileroo.com/api/v2/emails';

  if (!apiKey) {
    throw new Error('MAILEROO_API_KEY is missing');
  }

  const payload = {
    from: { address: fromEmail, display_name: fromName },
    to,
    subject,
    html,
    plain,
    tracking: false,
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new Error(body.message || `Maileroo error (${res.status})`);
  }
  return body;
}

export function clinicRecipients() {
  const list = parseRecipients(process.env.MAILEROO_TO_EMAILS);
  if (!list.length) {
    return [
      { address: 'info@doctorasher.com' },
      { address: 'drasherdc@yahoo.com' },
    ];
  }
  return list;
}
