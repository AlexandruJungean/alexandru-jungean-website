# Client Intake Forms - Strategy & Implementation Plan

## Overview

Replace the generic contact form with specialized intake questionnaires that pre-qualify leads and collect project requirements upfront. This reduces back-and-forth emails, filters serious clients, and positions you as a professional who values structured processes.

---

## Form Architecture

### 4 Distinct Forms

```
/start-a-project
    ├── /start-a-project/website        (Website Development)
    ├── /start-a-project/mobile-app     (Mobile App Development)
    ├── /start-a-project/marketing      (Marketing Strategy)
    └── /start-a-project/general        (General Inquiry)
```

### Landing Page: `/start-a-project`

A selection page where the user picks their form type. Four cards, each with an icon, title, short description, and a CTA button.

- "I need a Website" -> /start-a-project/website
- "I need a Mobile App" -> /start-a-project/mobile-app
- "I need a Marketing Strategy" -> /start-a-project/marketing
- "I have a different request" -> /start-a-project/general

Design: Same dark theme as the rest of the site. Cards should feel premium and inviting, not like a boring survey.

---

## Form 1: Website Development

### Step 1 - About You (3 fields)
- Full Name (text, required)
- Email Address (email, required)
- Company / Business Name (text, optional)

### Step 2 - Project Type (single select)
- Business / Corporate website
- E-commerce / Online store
- Government / Institutional
- Portfolio / Personal brand
- Landing page / Single page
- Web application (SaaS, dashboard, etc.)
- Blog / Content platform
- Other (text field opens)

### Step 3 - Scope & Features (multi-select checkboxes)
- Responsive design (mobile, tablet, desktop)
- Multilingual support (how many languages? -> number input)
- Admin panel / CMS for content management
- Contact form with email notifications
- User authentication (login, registration)
- Payment integration (Stripe, PayPal, etc.)
- Blog / News section
- SEO optimization
- Google Maps integration
- Live chat / Support widget
- Analytics integration (Google Analytics, etc.)
- Social media integration
- Newsletter / Email subscription
- Image gallery / Portfolio section
- Booking / Reservation system
- Document upload / Download section
- API integrations (specify which -> text field)
- Other (text field)

### Step 4 - Content & Design (mixed)
- Do you have existing branding? (Yes / No / Partially)
  - If Yes: "Please describe your brand colors, fonts, and guidelines" (textarea)
- Do you have content ready? (Yes / No / Some of it)
  - Text content (pages, descriptions)
  - Images / Photography
  - Logo and brand assets
- Design preference (single select):
  - Minimalist and clean
  - Bold and modern
  - Corporate and professional
  - Creative and artistic
  - I'd like suggestions based on my industry
- Reference websites you like (textarea, placeholder: "Share 2-3 websites you admire and what you like about them")

### Step 5 - Technical Preferences (optional, can skip)
- Do you have a domain name? (Yes -> text / No / I need help choosing)
- Do you have hosting? (Yes -> text / No / I need help choosing)
- Any specific technology preferences? (textarea, placeholder: "e.g., WordPress, Next.js, React, Shopify...")
- Do you need the website to integrate with existing systems? (textarea)

### Step 6 - Timeline & Budget
- When do you need the website ready? (single select)
  - ASAP (within 2-4 weeks)
  - 1-2 months
  - 2-3 months
  - 3+ months
  - No specific deadline
- Budget range (single select)
  - Under €1,000
  - €1,000 - €3,000
  - €3,000 - €5,000
  - €5,000 - €10,000
  - €10,000+
  - I'd like a quote based on requirements
- How did you hear about me? (single select)
  - Google Search
  - LinkedIn
  - Referral from someone
  - Social media
  - Existing client
  - Other

### Step 7 - Additional Details
- Anything else you'd like to share about your project? (textarea, large)
- Preferred communication method (single select):
  - Email
  - Phone/WhatsApp
  - Video call (Zoom/Google Meet)
- Phone number (tel, optional)

---

## Form 2: Mobile App Development

### Step 1 - About You (same as Form 1)

### Step 2 - App Type (single select)
- Consumer / B2C app (general public)
- Business / B2B app (companies, teams)
- Internal tool (employees only)
- Marketplace (connecting buyers and sellers)
- Social / Community app
- Utility / Productivity app
- E-commerce app
- Other (text field)

### Step 3 - Platforms (multi-select)
- iOS (iPhone, iPad)
- Android
- Both iOS and Android
- Web app (browser-based)
- I need guidance on this

### Step 4 - Core Features (multi-select checkboxes)
- User registration and login
  - Email/password
  - Google Sign-In
  - Apple Sign-In
  - Phone number authentication
- Push notifications
- In-app messaging / Chat
- Payment processing (subscriptions, one-time, etc.)
- Camera / Photo capabilities
- Location services / Maps
- QR code scanning
- Offline functionality
- Multi-language support (how many? -> number)
- Admin dashboard / Back-office
- Analytics and reporting
- Social features (profiles, followers, feed)
- Search with filters
- Booking / Scheduling
- File upload / Document management
- Integration with external APIs (specify -> textarea)
- Other (textarea)

### Step 5 - Design & UX
- Do you have existing branding? (Yes / No / Partially)
- Do you have wireframes or mockups? (Yes, I have designs / I have rough sketches / No, I need everything designed)
- Design preference (single select):
  - Clean and minimal (like Apple apps)
  - Bold and colorful (like Duolingo)
  - Professional and data-rich (like banking apps)
  - Fun and engaging (like social media apps)
  - I'd like suggestions
- Reference apps you like (textarea)

### Step 6 - Backend & Data
- Will the app need a backend / database? (Yes / No / I'm not sure)
- Expected number of users at launch (single select):
  - Under 100
  - 100 - 1,000
  - 1,000 - 10,000
  - 10,000+
  - I'm not sure
- Do you have an existing backend / API? (Yes -> describe / No, build from scratch)

### Step 7 - Timeline, Budget & Publishing
- When do you need the app ready? (same options as website)
- Budget range:
  - Under €3,000
  - €3,000 - €7,000
  - €7,000 - €15,000
  - €15,000 - €30,000
  - €30,000+
  - I'd like a quote
- Do you have Apple Developer and Google Play accounts? (Yes / No / I need help)
- Post-launch support needed? (Yes, ongoing maintenance / Just bug fixes for X months / No)

### Step 8 - Additional Details (same as Form 1 Step 7)

---

## Form 3: Marketing Strategy

### Step 1 - About You & Business
- Full Name (text)
- Email (email)
- Company name (text)
- Website URL (url, optional)
- Social media links (textarea, optional)
- Industry / Niche (text)

### Step 2 - Current State (multi-select + text)
- What marketing do you currently do? (multi-select)
  - Nothing yet
  - Social media (organic)
  - Paid ads (Google, Facebook, etc.)
  - SEO
  - Email marketing
  - Content marketing (blog, video)
  - Influencer marketing
  - Print / Offline marketing
- Monthly marketing budget (single select):
  - Under €500/month
  - €500 - €1,500/month
  - €1,500 - €3,000/month
  - €3,000 - €5,000/month
  - €5,000+/month
  - I need guidance on budget

### Step 3 - Goals (multi-select)
- What are your primary goals? (multi-select)
  - Generate leads / Get more clients
  - Increase brand awareness
  - Grow social media following
  - Increase website traffic
  - Improve conversion rate
  - Launch a new product/service
  - Enter a new market
  - Build an email list
  - Other (text)

### Step 4 - Services Needed (multi-select)
- Social media management (content creation, scheduling, engagement)
- Paid advertising (Google Ads, Facebook/Instagram Ads, TikTok Ads)
- SEO optimization (on-page, off-page, technical)
- Content creation:
  - Photography
  - Video production
  - Graphic design (posts, stories, reels covers)
  - Copywriting (blog posts, ad copy, email)
- Email marketing (campaigns, automation, newsletters)
- Branding / Rebranding
- Marketing strategy & consulting
- Analytics setup and reporting
- Other (textarea)

### Step 5 - Target Audience
- Who is your ideal customer? (textarea)
- Geographic target (text, e.g., "Romania", "Europe", "Global")
- Age range (text)
- Key competitors (textarea, placeholder: "List 2-3 competitors and their websites")

### Step 6 - Timeline & Additional
- When do you want to start? (ASAP / Within 1 month / 1-3 months / Just exploring)
- Anything else? (textarea)
- How did you hear about me? (same options)
- Preferred communication (same options)

---

## Form 4: General Inquiry

A shorter, flexible form for anything that doesn't fit the above.

### Fields
- Full Name (text, required)
- Email (email, required)
- Company / Business (text, optional)
- What do you need help with? (single select)
  - Database design & management
  - Data analysis & visualization
  - UI/UX design
  - Branding & logo design
  - Video editing
  - Consulting / Advisory
  - Something else
- Describe your project or request (textarea, large, required)
- Budget range (single select):
  - Under €500
  - €500 - €2,000
  - €2,000 - €5,000
  - €5,000+
  - I'd like a quote
- Timeline (same options)
- How did you hear about me?
- Preferred communication + Phone (optional)

---

## UX & Design Guidelines

### Multi-Step Wizard
- All forms (except General) use a step-by-step wizard, NOT a single long page
- Progress bar at the top showing current step / total steps
- "Back" and "Next" buttons; "Submit" on the last step
- Each step fits on one viewport (no scrolling on desktop)
- Smooth transitions between steps (slide or fade)
- Mobile-friendly: single column, large touch targets

### Validation
- Real-time validation (green checkmark when valid)
- Don't block "Next" for optional fields
- Show clear error messages inline (not alerts)

### After Submission
- Animated success state (checkmark animation or confetti)
- "Thank you" message with estimated response time (e.g., "I'll get back to you within 24 hours")
- Option to book a call directly (Calendly or Cal.com embed)
- Confirmation email to the user with a summary of their responses

### Anti-Spam
- reCAPTCHA v3 (invisible, no user friction)
- Honeypot field (hidden field that bots fill)
- Rate limiting on the API endpoint

---

## Technical Implementation

### Recommended Stack
- **Frontend:** Part of the existing alexjungean.com site, or a separate Next.js micro-site at `start.alexjungean.com`
- **Form state:** React Hook Form + Zod validation
- **Backend:** Netlify Functions or Next.js API routes
- **Email:** Resend or Nodemailer -> sends to your email + confirmation to client
- **Data storage:** Optional Supabase table to track submissions with status (New, Contacted, In Progress, Completed)
- **Spam protection:** reCAPTCHA v3 + honeypot

### Email Flow
1. Client submits form
2. API validates + stores in DB
3. Email to you: formatted summary with all answers, categorized by step
4. Email to client: "Thank you, here's a summary of your request. I'll respond within 24h."

---

## SEO & Conversion Notes

- Replace the current `/contact` page's main CTA with a link to `/start-a-project`
- Keep a simple contact form on `/contact` for quick messages
- The `/start-a-project` URL itself has SEO value: "start a project web developer"
- Each form page should have its own meta tags targeting searches like:
  - "hire web developer for website project"
  - "mobile app development quote"
  - "marketing strategy consultation"
