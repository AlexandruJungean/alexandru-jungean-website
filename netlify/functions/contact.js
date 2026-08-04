import nodemailer from 'nodemailer';

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent injection
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().substring(0, 5000);
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
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    let { name, email, subject, message, recaptchaToken } = data;

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    subject = sanitizeInput(subject);
    message = sanitizeInput(message);

    // Validate required fields
    if (!name || !email || !message || !recaptchaToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Please enter a valid email address' })
      };
    }

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    });

    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'reCAPTCHA verification failed. Please try again.' })
      };
    }

    // Create email transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
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
            <tr><td style="padding:0 0 8px;color:#474644;font-size:14px;"><strong style="color:#181818;">Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#678b9e;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:0 0 8px;color:#474644;font-size:14px;"><strong style="color:#181818;">Subject:</strong> ${escapeHtml(subject || 'Not specified')}</td></tr>
          </table>
          <div style="margin-top:16px;color:#474644;font-size:15px;line-height:1.65;">
            ${formatMessage(message)}
          </div>
          <p style="margin:18px 0 0;color:#838383;font-size:12px;">reCAPTCHA score: ${escapeHtml(recaptchaResult.score)}</p>
        `,
        cta: `
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
            <tr><td style="background-color:#678b9e;border-radius:7px;"><a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:12px 20px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">Reply to ${escapeHtml(name)}</a></td></tr>
          </table>
        `
      })
    };

    // Confirmation email to the sender
    const confirmationEmail = {
      from: `"Alexandru Jungean" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting me!',
      text: `Thank you for reaching out, ${name}!\n\nI've received your message and will get back to you as soon as possible, typically within 24-48 hours.\n\nSubject: ${subject || 'Not specified'}\n\nYour message:\n${message}\n\nBest regards,\nAlexandru Jungean\nIT Freelancer`,
      html: buildEmailLayout({
        preheader: 'Your message has been received. I will get back to you within 24-48 hours.',
        eyebrow: 'Message received',
        title: `Thank you for reaching out, ${name}!`,
        intro: "I've received your message and will get back to you as soon as possible, typically within 24-48 hours.",
        content: `
          <div>
            <p style="margin:0 0 10px;color:#678b9e;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Your message</p>
            <p style="margin:0 0 12px;color:#181818;font-size:14px;"><strong>Subject:</strong> ${escapeHtml(subject || 'Not specified')}</p>
            <p style="margin:0;color:#474644;font-size:15px;line-height:1.65;">${formatMessage(message)}</p>
          </div>
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

    // Send both emails
    await transporter.sendMail(notificationEmail);
    await transporter.sendMail(confirmationEmail);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Message sent successfully!' })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message. Please try again later.' })
    };
  }
}
