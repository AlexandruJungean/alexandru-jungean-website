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
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          reCAPTCHA Score: ${recaptchaResult.score} | 
          Sent from alexjungean.com contact form
        </p>
      `
    };

    // Confirmation email to the sender
    const confirmationEmail = {
      from: `"Alexandru Jungean" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Thank you for reaching out, ${name}!</h2>
          
          <p>I've received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your message:</h3>
            <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Check out my <a href="https://alexjungean.com/projects.html">projects</a></li>
            <li>View my <a href="https://alexjungean.com/services.html">services</a></li>
            <li>Connect with me on <a href="https://www.linkedin.com/in/alexandru-jungean-5604b7268/">LinkedIn</a></li>
          </ul>
          
          <p>Best regards,<br>
          <strong>Alexandru Jungean</strong><br>
          IT Freelancer | Web & App Development</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated confirmation email. Please do not reply directly to this email.
            If you need to reach me, send a new message through the <a href="https://alexjungean.com/contact.html">contact form</a>.
          </p>
        </div>
      `
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
