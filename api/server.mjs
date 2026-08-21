import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { loadEnv } from './load-env.mjs';
import {
  clinicEmailHtml,
  clinicEmailPlain,
  clinicRecipients,
  sendMaileroo,
} from './email.mjs';

loadEnv();

const PORT = Number(process.env.PORT || 3000);
const STATIC_DIR = resolve(
  process.env.STATIC_DIR || 'drasher-static/drashernaturals.com'
);
const ALLOWED_ORIGINS = String(
  process.env.CONTACT_ALLOWED_ORIGINS ||
    'https://doctorasher.com,https://www.doctorasher.com,http://localhost:3000,http://127.0.0.1:3000'
)
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const hits = new Map();

function originAllowed(origin) {
  if (!origin) return true;
  return ALLOWED_ORIGINS.some((allowed) => origin === allowed || origin.endsWith('.amplifyapp.com'));
}

function corsHeaders(origin) {
  const allow = originAllowed(origin) ? origin || ALLOWED_ORIGINS[0] : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function json(res, status, body, extraHeaders = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    ...extraHeaders,
  });
  res.end(payload);
}

function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((time) => now - time < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > 8;
}

function clean(value, max = 400) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function readBody(req, limit = 80_000) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parsePayload(raw, contentType) {
  if (!raw) return {};
  if ((contentType || '').includes('application/json')) {
    return JSON.parse(raw);
  }
  const params = new URLSearchParams(raw);
  const data = {};
  for (const [key, value] of params.entries()) data[key] = value;
  return data;
}

function normalizeSubmission(input) {
  return {
    name: clean(input.name || input['your-name'] || input['contact-form-name']),
    email: clean(input.email || input['your-email'] || input['contact-form-email']),
    phone: clean(input.phone || input['your-phone'] || input['contact-form-phone'], 40),
    subject: clean(input.subject || input['your-subject'], 180),
    message: String(input.message || input['your-message'] || input['contact-form-message'] || '')
      .trim()
      .slice(0, 4000),
    smsOptIn: input.smsOptIn === true || input.smsOptIn === 'yes' || input['sms-opt-in'] === 'yes' ? 'Yes' : input.phone || input['contact-form-phone'] ? 'No' : '',
    source: clean(input.source || input['data-form'] || 'website', 80),
    page: clean(input.page, 300),
    honeypot: clean(input.company_website || input._gotcha || input.website, 80),
  };
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

function serveStatic(req, res) {
  let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const filePath = normalize(join(STATIC_DIR, pathname));
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
}

async function handleContact(req, res, origin) {
  const headers = corsHeaders(origin);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }
  if (req.method !== 'POST') {
    json(res, 405, { ok: false, message: 'Method not allowed' }, headers);
    return;
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  if (rateLimited(ip)) {
    json(res, 429, { ok: false, message: 'Too many submissions. Please try again later.' }, headers);
    return;
  }

  let input;
  try {
    input = parsePayload(await readBody(req), req.headers['content-type']);
  } catch {
    json(res, 400, { ok: false, message: 'Invalid form data.' }, headers);
    return;
  }

  const data = normalizeSubmission(input);
  if (data.honeypot) {
    json(res, 200, { ok: true }, headers);
    return;
  }
  if (!data.name || !validEmail(data.email)) {
    json(res, 400, { ok: false, message: 'Please enter your name and a valid email address.' }, headers);
    return;
  }
  if (!data.message && !data.phone) {
    json(res, 400, { ok: false, message: 'Please include a message or phone number.' }, headers);
    return;
  }

  const subjectLine = data.subject || `Website message from ${data.name}`;

  await sendMaileroo({
    to: clinicRecipients(),
    replyTo: { address: data.email, display_name: data.name },
    subject: subjectLine.slice(0, 255),
    html: clinicEmailHtml(data),
    plain: clinicEmailPlain(data),
  });

  json(res, 200, { ok: true }, headers);
}

const server = createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  const url = new URL(req.url, 'http://localhost');

  try {
    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
      await handleContact(req, res, origin);
      return;
    }
    if (url.pathname === '/health') {
      json(res, 200, { ok: true });
      return;
    }
    if (req.method === 'GET' || req.method === 'HEAD') {
      serveStatic(req, res);
      return;
    }
    json(res, 404, { ok: false, message: 'Not found' });
  } catch (err) {
    console.error(err);
    json(res, 500, { ok: false, message: 'Sorry, something went wrong sending your message.' }, corsHeaders(origin));
  }
});

server.listen(PORT, () => {
  console.log(`Contact API listening on ${PORT}`);
});
