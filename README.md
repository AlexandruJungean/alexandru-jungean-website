# Alexandru Jungean - Personal Portfolio Website

A modern, responsive portfolio website for Alexandru Jungean, IT Freelancer specializing in web development, mobile apps, database solutions, and data analysis.

**Live Site:** [https://alexjungean.com](https://alexjungean.com)

## Overview

This is a static website built with HTML5, CSS3, and vanilla JavaScript, hosted on Netlify with serverless functions for the contact form. The site showcases professional services, portfolio projects, and provides a way for potential clients to get in touch.

## Features

- **Responsive Design** - Fully responsive across all devices (mobile, tablet, desktop)
- **SEO Optimized** - Complete meta tags, Open Graph, Twitter Cards, structured data (JSON-LD), canonical URLs
- **Clean URLs** - Pretty URLs without `.html` extensions
- **Contact Form** - Serverless function with reCAPTCHA v3 protection and email notifications
- **Performance Optimized** - Font preloading, image optimization (WebP), caching headers
- **Accessibility** - Semantic HTML structure, proper heading hierarchy
- **LLM Ready** - Includes `llms.txt` and `llms-full.txt` for AI assistant compatibility

## Project Structure

```
├── index.html              # Homepage
├── services.html           # Services overview page
├── projects.html           # Projects/Portfolio page
├── blog.html               # Blog page
├── contact.html            # Contact page
├── privacy-policy.html     # Privacy policy
├── terms.html              # Terms & conditions
├── 401.html                # Unauthorized error page
├── 404.html                # Not found error page
│
├── css/
│   └── styles.css          # Main stylesheet (includes Normalize.css)
│
├── fonts/
│   ├── ClashDisplay-Medium.woff2
│   ├── ClashDisplay-Semibold.woff2
│   ├── Inter-Regular.woff2
│   └── InterDisplay-SemiBold.woff2
│
├── images/                 # All images (WebP format, responsive sizes)
│
├── services/               # Individual service pages
│   ├── website-creation.html
│   ├── mobile-app-development.html
│   ├── database-solutions.html
│   ├── data-analysis.html
│   ├── ui-ux-design.html
│   ├── branding-design.html
│   └── video-editing.html
│
├── projects/               # Individual project case studies
│   ├── ardt.html
│   ├── bdd-logspeed.html
│   ├── edu-events.html
│   ├── nexus-learning-lab.html
│   ├── oradea-experience.html
│   ├── sql-issues.html
│   ├── termeneauto.html
│   └── tool.html
│
├── netlify/
│   └── functions/
│       └── contact.js      # Serverless contact form handler
│
├── .well-known/
│   └── security.txt        # Security policy
│
├── netlify.toml            # Netlify configuration (redirects, headers, functions)
├── sitemap.xml             # XML sitemap for SEO
├── robots.txt              # Search engine crawling rules
├── humans.txt              # Human-readable site credits
├── llms.txt                # LLM/AI assistant context (summary)
└── llms-full.txt           # LLM/AI assistant context (detailed)
```

## Services Offered

| Service | Description |
|---------|-------------|
| Website Creation | Custom, responsive, SEO-optimized websites |
| Mobile App Development | Cross-platform mobile applications |
| Database Solutions | Database design, optimization, and management |
| Data Analysis | Business intelligence and data visualization |
| UI/UX Design | User interface and experience design |
| Branding Design | Logo design and brand identity |
| Video Editing | Professional video production and editing |

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Custom CSS with CSS Variables
- Normalize.css for browser consistency
- Custom fonts: Clash Display, Inter

### Hosting & Backend
- **Netlify** - Static hosting with CDN
- **Netlify Functions** - Serverless backend for contact form
- **Nodemailer** - Email sending via Gmail SMTP
- **reCAPTCHA v3** - Spam protection

### Development Tools
- VS Code / Cursor IDE
- Git for version control
- Figma for design

## Deployment

The website is automatically deployed via Netlify when changes are pushed to the main branch.

### Environment Variables (Netlify)

For the contact form to work, set these environment variables in Netlify:

| Variable | Description |
|----------|-------------|
| `GMAIL_USER` | Gmail address for sending emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not regular password) |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret key |

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/AlexandruJungean/alexandru-jungean-website.git
   ```

2. Open the project folder:
   ```bash
   cd alexandru-jungean-website
   ```

3. Serve locally (use any static server):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (npx)
   npx serve
   
   # Using VS Code Live Server extension
   ```

4. For testing Netlify functions locally:
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

## SEO Features

- **Meta Tags** - Title, description, keywords, author
- **Open Graph** - Facebook/LinkedIn sharing optimization
- **Twitter Cards** - Twitter sharing optimization
- **Structured Data** - JSON-LD schema for Person, WebSite, ProfessionalService
- **Canonical URLs** - Prevent duplicate content issues
- **Sitemap** - XML sitemap for search engine crawling
- **Clean URLs** - 301 redirects from `.html` to clean URLs
- **Google Site Verification** - Search Console integration

## Performance Optimizations

- **Font Preloading** - Critical fonts loaded early
- **Image Optimization** - WebP format with responsive srcset
- **Caching Headers** - Long-term caching for static assets
- **Minimal Dependencies** - No heavy frameworks

## Contact

- **Website:** [https://alexjungean.com](https://alexjungean.com)
- **Contact Form:** [https://alexjungean.com/contact](https://alexjungean.com/contact)
- **LinkedIn:** [Alexandru Jungean](https://www.linkedin.com/in/alexandru-jungean-5604b7268/)
- **GitHub:** [AlexandruJungean](https://github.com/AlexandruJungean)

## License

This project is proprietary. All rights reserved.

---

*Designed and developed by Alexandru Jungean*
