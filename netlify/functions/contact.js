import nodemailer from 'nodemailer';

// Keep the existing endpoint; Netlify enforces this before invoking the function.
// Verify rule activation in the deploy log (local emulators do not enforce it).
export const config = {
  path: '/.netlify/functions/contact',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};

const MAX_BODY_BYTES = 48 * 1024;
const FIELD_LIMITS = { name: 120, email: 254, subject: 160, message: 5000, recaptchaToken: 4096 };

function respond(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders
    },
    body: JSON.stringify(payload)
  };
}

function trustedOrigins() {
  const origins = new Set(['https://alexjungean.com', 'https://www.alexjungean.com']);
  for (const value of [process.env.URL, process.env.DEPLOY_URL, process.env.DEPLOY_PRIME_URL]) {
    try { if (value) origins.add(new URL(value).origin); } catch { /* Ignore invalid deploy metadata. */ }
  }
  if (process.env.NETLIFY_DEV === 'true') {
    origins.add('http://localhost:8888');
    origins.add('http://127.0.0.1:8888');
  }
  return origins;
}

function validRecaptcha(result, origins) {
  const hostnames = new Set([...origins].map(origin => new URL(origin).hostname));
  const timestamp = Date.parse(result?.challenge_ts);
  const age = Date.now() - timestamp;
  return result?.success === true &&
    typeof result.score === 'number' && Number.isFinite(result.score) &&
    result.score >= 0.5 && result.score <= 1 &&
    result.action === 'contact' && hostnames.has(result.hostname) &&
    Number.isFinite(timestamp) && age >= -30000 && age <= 120000;
}

function validateFields(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const fields = {};
  for (const [key, maximum] of Object.entries(FIELD_LIMITS)) {
    const value = data[key] ?? (key === 'subject' ? '' : null);
    if (typeof value !== 'string' || value.length > maximum) return null;
    fields[key] = value.trim();
    if (key !== 'subject' && !fields[key]) return null;
    // Header fields must stay single-line. Preserve message punctuation and newlines;
    // escape at the HTML boundary instead of silently truncating user submissions.
    const controls = key === 'message' ? /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/ : /[\x00-\x1F\x7F]/;
    if (controls.test(value)) return null;
  }
  // Reject address lists and display-name/header syntax: this is one reply address.
  if (!/^[^\s@<>,;:"()[\]\\]+@[^\s@<>,;:"()[\]\\]+\.[^\s@<>,;:"()[\]\\]+$/.test(fields.email)) return null;
  const [localPart, domain] = fields.email.split('@');
  if (localPart.length > 64 || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) return null;
  if (!/^(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(domain)) return null;
  return fields;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMessage(str) {
  return escapeHtml(str).replace(/\r?\n/g, '<br>');
}

function buildEmailLayout({ preheader, eyebrow, title, intro, content, cta }) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(title)}</title>
        <style>
          @media only screen and (max-width: 600px) {
            .email-pad { padding-left: 20px !important; padding-right: 20px !important; }
            .email-title { font-size: 24px !important; }
            .email-logo { width: 150px !important; }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;color:#181818;font-family:Arial,Helvetica,sans-serif;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          ${escapeHtml(preheader)}
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;">
          <tr>
            <td align="center" style="padding:0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background-color:#f5f7f8;border-radius:12px;overflow:hidden;">
                <tr>
                  <td class="email-pad" style="background-color:#181818;padding:20px 24px;border-radius:12px 12px 0 0;">
                    <a href="https://alexjungean.com" style="display:inline-block;text-decoration:none;">
                      <img class="email-logo" src="https://alexjungean.com/images/email-logo.png" width="180" height="35" alt="Alexandru Jungean" style="display:block;width:180px;max-width:100%;height:auto;border:0;">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td class="email-pad" style="background-color:#f5f7f8;padding:30px 24px 12px;">
                    <p style="margin:0 0 10px;color:#678b9e;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
                    <h1 class="email-title" style="margin:0 0 14px;color:#181818;font-size:27px;line-height:1.25;">${escapeHtml(title)}</h1>
                    <p style="margin:0;color:#474644;font-size:16px;line-height:1.65;">${escapeHtml(intro)}</p>
                  </td>
                </tr>
                <tr>
                  <td class="email-pad" style="background-color:#f5f7f8;padding:12px 24px 28px;">
                    ${content}
                    ${cta || ''}
                  </td>
                </tr>
                <tr>
                  <td class="email-pad" style="background-color:#181818;padding:20px 24px;color:#bfbfbf;font-size:12px;line-height:1.6;border-radius:0 0 12px 12px;">
                    <p style="margin:0 0 10px;">
                      <a href="https://alexjungean.com/projects" style="color:#ffffff;text-decoration:none;">Projects</a>
                      <span style="color:#678b9e;padding:0 8px;">•</span>
                      <a href="https://www.linkedin.com/in/alexandru-jungean/" style="color:#ffffff;text-decoration:none;">LinkedIn</a>
                      <span style="color:#678b9e;padding:0 8px;">•</span>
                      <a href="https://github.com/AlexandruJungean" style="color:#ffffff;text-decoration:none;">GitHub</a>
                    </p>
                    <p style="margin:0;">Alexandru Jungean · IT Freelancer</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' }, { Allow: 'POST' });
  }

  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
  const origins = trustedOrigins();
  if (headers.origin && !origins.has(headers.origin)) {
    return respond(403, { error: 'Request origin is not allowed' });
  }
  if (!/^application\/json(?:\s*;|$)/i.test(headers['content-type'] || '')) {
    return respond(415, { error: 'Please send a JSON request' });
  }
  if (typeof event.body !== 'string' || Buffer.byteLength(event.body, 'utf8') > MAX_BODY_BYTES * (event.isBase64Encoded ? 4 / 3 : 1)) {
    return respond(413, { error: 'Message is too large' });
  }
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
    return respond(413, { error: 'Message is too large' });
  }
  let data;
  try { data = JSON.parse(body); } catch {
    return respond(400, { error: 'Invalid JSON request' });
  }
  const fields = validateFields(data);
  if (!fields) {
    return respond(400, { error: 'Please check your name, email and message. Maximum message length is 5,000 characters.' });
  }
  const { name, email, subject, message, recaptchaToken } = fields;
  if (!process.env.RECAPTCHA_SECRET_KEY || !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Contact form configuration is incomplete');
    return respond(503, { error: 'The contact form is temporarily unavailable. Please email me directly.' });
  }

  try {
    // Verify reCAPTCHA
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: recaptchaToken }).toString(),
      signal: AbortSignal.timeout(8000)
    });
    if (!recaptchaResponse.ok) throw new Error('Verification provider unavailable');
    const recaptchaResult = await recaptchaResponse.json();

    if (!validRecaptcha(recaptchaResult, origins)) {
      return respond(400, { error: 'reCAPTCHA verification failed. Please try again.' });
    }

    // Create email transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
      disableFileAccess: true,
      disableUrlAccess: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Email to you (notification)
    const notificationEmail = {
      from: `"Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Contact: ${subject || 'No Subject'} - from ${name}`,
      text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'Not specified'}\n\nMessage:\n${message}\n\nreCAPTCHA score: ${recaptchaResult.score}`,
      html: buildEmailLayout({
        preheader: `New message from ${name}`,
        eyebrow: 'New website inquiry',
        title: `New message from ${name}`,
        intro: 'A new contact form submission has arrived from alexjungean.com.',
        content: `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;">
            <tr><td style="padding:0 0 10px;color:#678b9e;font-size:12px;font-weight:bold;text-transform:uppercase;">Contact details</td></tr>
            <tr><td style="padding:0 0 8px;color:#474644;font-size:14px;"><strong style="color:#181818;">Name:</strong> ${escapeHtml(name)}</td></tr>
            <tr><td style="padding:0 0 8px;color:#474644;font-size:14px;"><strong style="color:#181818;">Email:</strong> <a href="mailto:${escapeHtml(encodeURIComponent(email))}" style="color:#678b9e;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:0 0 8px;color:#474644;font-size:14px;"><strong style="color:#181818;">Subject:</strong> ${escapeHtml(subject || 'Not specified')}</td></tr>
          </table>
          <div style="margin-top:16px;color:#474644;font-size:15px;line-height:1.65;">
            ${formatMessage(message)}
          </div>
          <p style="margin:18px 0 0;color:#838383;font-size:12px;">reCAPTCHA score: ${escapeHtml(recaptchaResult.score)}</p>
        `,
        cta: `
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
            <tr><td style="background-color:#678b9e;border-radius:7px;"><a href="mailto:${escapeHtml(encodeURIComponent(email))}" style="display:inline-block;padding:12px 20px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">Reply to ${escapeHtml(name)}</a></td></tr>
          </table>
        `
      })
    };

    // Fixed-content receipt: an unverified email address must not become a relay
    // for attacker-controlled messages or links to an unrelated recipient.
    const confirmationEmail = {
      from: `"Alexandru Jungean" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting me!',
      text: "Thank you for reaching out!\n\nI've received an inquiry submitted with this email address and will get back to you as soon as possible, typically within 24-48 hours.\n\nIf you did not submit this inquiry, you can ignore this confirmation. No account or subscription has been created.\n\nBest regards,\nAlexandru Jungean\nIT Freelancer",
      html: buildEmailLayout({
        preheader: 'Your message has been received. I will get back to you within 24-48 hours.',
        eyebrow: 'Message received',
        title: 'Thank you for reaching out!',
        intro: "I've received your message and will get back to you as soon as possible, typically within 24-48 hours.",
        content: `
          <p style="margin:0;color:#474644;font-size:15px;line-height:1.65;">An inquiry was submitted with this email address. If you did not send it, you can ignore this confirmation. No account or subscription has been created.</p>
          <p style="margin:24px 0 0;color:#474644;font-size:15px;line-height:1.65;">In the meantime, you can explore some of my recent work.</p>
        `,
        cta: `
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:18px;">
            <tr><td style="background-color:#678b9e;border-radius:7px;"><a href="https://alexjungean.com/projects" style="display:inline-block;padding:12px 20px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">View my projects</a></td></tr>
          </table>
          <p style="margin:28px 0 0;color:#474644;font-size:14px;line-height:1.6;">Best regards,<br><strong style="color:#181818;">Alexandru Jungean</strong><br>IT Freelancer</p>
          <p style="margin:22px 0 0;color:#838383;font-size:11px;line-height:1.5;">This is an automated confirmation email. Please use the <a href="https://alexjungean.com/contact" style="color:#678b9e;">contact form</a> if you need to send another message.</p>
        `
      })
    };

    // Once the inquiry reaches the business, a receipt failure must not prompt a
    // resubmission and duplicate the inquiry. No submitted content is logged.
    await transporter.sendMail(notificationEmail);
    let confirmationSent = true;
    try { await transporter.sendMail(confirmationEmail); } catch {
      confirmationSent = false;
      console.warn('Contact inquiry delivered; confirmation email unavailable');
    }
    return respond(200, { success: true, confirmationSent, message: 'Message sent successfully!' });

  } catch {
    console.error('Contact form delivery or verification failed');
    return respond(502, { error: 'Failed to send message. Please try again later or email me directly.' });
  }
}
