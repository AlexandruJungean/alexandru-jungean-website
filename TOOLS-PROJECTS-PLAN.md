# Tools Projects - Complete Development Plan

Each tool is an independent product with its own brand, domain, and identity. All tools share a common quality standard: they must be the best free option available, with premium tiers for power users.

---

## Brand Names Reference

All original names (CompressIt, ConvertFlow, SEOPulse, ScrapeMaster, ApplyBot, QRForge, BizMailer, BizFinder) are **already taken** by existing products. Below are verified-unique alternatives for each tool. Check domain availability before committing — pick from the options below.

| # | Tool | Recommended | Alternative 1 | Alternative 2 | Search terms targeted |
|---|------|-------------|---------------|---------------|----------------------|
| 1 | Compression | **Crushd** (crushd.app) | Lightify (lightify.app) | Shrynk (shrynk.app) | "compress image online", "reduce file size" |
| 2 | Conversion | **FileFlip** (fileflip.app) | Swapify (swapify.app) | Morphit (morphit.app) | "convert png to webp", "file converter online" |
| 3 | SEO Checker | **SEOScope** (seoscope.app) | PageGrade (pagegrade.app) | CrawlCheck (crawlcheck.app) | "SEO checker", "website SEO audit" |
| 4 | Web Scraper | **GrabData** (grabdata.app) | PluckData (pluckdata.app) | ScrapeNest (scrapenest.app) | "web scraper online", "extract data from website" |
| 5 | CV/Jobs | **HireReady** (hireready.app) | ResumeRadar (resumeradar.app) | CVForge (cvforge.app) | "CV optimizer", "ATS resume checker" |
| 6 | QR Codes | **QRMint** (qrmint.app) | ScanCraft (scancraft.app) | QRBrew (qrbrew.app) | "QR code generator", "custom QR code" |
| 7 | Email/Signatures | **SignaPro** (signapro.app) | MailCraft (mailcraft.app) | InboxForge (inboxforge.app) | "email signature generator", "business email setup" |
| 8 | Director firme RO | **FirmaCheck** (firmacheck.ro) | CUISearch (cuisearch.ro) | FirmaScan (firmascan.ro) | "verificare firma CUI", "informatii firma Romania" |

> **Before starting any tool:** Verify the chosen domain is still available at your registrar. If the recommended name is taken by then, use Alternative 1 or 2. The feature plans below apply regardless of the final brand name.

---

## Shared Technical Foundation

All tools share:
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Auth (premium):** Supabase Auth (email + Google)
- **Hosting:** Vercel or Netlify
- **Analytics:** Plausible (privacy-first) or PostHog
- **Monetization:** Freemium (generous free tier + paid plans)
- **SEO:** JSON-LD, Open Graph, sitemap, robots.txt, llms.txt
- **GitHub:** Public repo with excellent README, contributing guidelines, MIT license

### Shared UI Pattern
- Clean, minimal interface with one clear action per screen
- Dark/light mode toggle
- Results appear instantly (no page reloads)
- Export/download results in multiple formats
- Mobile-responsive from day one
- Keyboard shortcuts for power users
- No account required for basic usage
- Subtle branding that doesn't distract from the tool

---

## Tool 1: Image & File Compression

**Brand options:** Crushd | Lightify | Shrynk
**Domain options:** crushd.app | lightify.app | shrynk.app
**Taglines:** "Crush your file sizes. Instantly." | "Make your files lighter." | "Shrink anything. Instantly."
**Color:** Electric blue (#2563EB) + white

### What It Does
Drag-and-drop compression for images, PDFs, and videos. No upload to server for images (client-side processing). Server-side for PDF and video.

### Why It Will Be the Best
Most compressors either: have aggressive limits, upload your files to their servers (privacy concern), or have bad UX. CompressIt processes images entirely in the browser using WASM, keeping files private.

### Features

#### Free Tier
- Image compression (JPEG, PNG, WebP, AVIF)
  - Batch upload (up to 20 files)
  - Quality slider (1-100) with live preview
  - Auto-optimize (smart quality detection)
  - Resize while compressing (width/height or percentage)
  - Format conversion during compression (PNG -> WebP, etc.)
  - Side-by-side before/after comparison with slider
  - File size reduction shown in real-time (percentage + bytes)
- Download individual files or all as ZIP
- No file size limit on free tier for images (client-side = no cost)

#### Premium Tier ($5/month or $39/year)
- PDF compression (with quality levels: screen, ebook, print, prepress)
- Video compression (H.264/H.265, resolution/bitrate control)
- API access (REST API with key)
- Bulk processing (100+ files)
- Custom presets (save quality/size settings)
- Priority processing for server-side tasks

### Technical Architecture
- **Image processing:** Browser-side using `browser-image-compression` library or custom WASM (libvips compiled to WASM)
- **PDF processing:** Server-side using `pdf-lib` or Ghostscript in a serverless function
- **Video processing:** Server-side using FFmpeg WASM or serverless FFmpeg
- **File handling:** Drag-and-drop zone with `react-dropzone`, progress indicators per file
- **ZIP creation:** `jszip` library for client-side ZIP packaging

### UI/UX Structure

```
Homepage
├── Hero: "Compress anything. Instantly." + drag-drop zone
├── File queue (list of dropped files with status)
├── Settings panel (quality, format, resize)
├── Results (before/after sizes, download buttons)
└── Footer: How it works, FAQ, Pricing

/pricing - Pricing page
/api - API documentation (for premium)
```

**Key UX decisions:**
- The drag-drop zone IS the homepage hero. No landing page fluff.
- Files start processing immediately on drop (no "Start" button needed)
- Results appear inline as each file completes
- Settings changes re-process all files in queue

### Competitive Advantage Over Existing Tools
- **TinyPNG:** Limits free to 20 images/day, 5MB each. CompressIt: unlimited, no size limit.
- **Squoosh (Google):** Single file only, no batch. CompressIt: batch processing.
- **iLoveIMG:** Uploads to server, privacy concern. CompressIt: client-side.
- **Compressor.io:** Limited formats, no batch. CompressIt: all formats + batch.

---

## Tool 2: Universal File Converter

**Brand options:** FileFlip | Swapify | Morphit
**Domain options:** fileflip.app | swapify.app | morphit.app
**Taglines:** "Flip any file. Any format." | "Swap formats instantly." | "Morph files into anything."
**Color:** Emerald green (#10B981) + dark

### What It Does
Universal file converter supporting images, documents, audio, and video formats.

### Features

#### Free Tier
- **Image:** JPG, PNG, WebP, AVIF, SVG, GIF, BMP, TIFF, ICO, HEIC
- **Document:** PDF to DOCX, DOCX to PDF, Markdown to PDF, HTML to PDF, CSV to XLSX
- **Audio:** MP3, WAV, OGG, FLAC, AAC, M4A
- Batch conversion (up to 10 files)
- Client-side conversion for images (WASM)
- Instant preview of converted files

#### Premium ($5/month)
- **Video:** MP4, WebM, AVI, MOV, MKV, GIF-to-MP4
- Unlimited batch processing
- API access
- Custom output settings (resolution, bitrate, sample rate)
- Priority server processing

### UI/UX Structure

```
Homepage
├── Hero: "Convert [X] to [Y]" with two dropdown selectors
├── Drag-drop zone (appears after format selection)
├── Conversion queue with progress
├── Download results
└── Popular conversions grid (PNG to WebP, PDF to DOCX, etc.)

/convert/[from]-to-[to]  (e.g., /convert/png-to-webp)
  - Dedicated SEO pages for each conversion pair
  - These pages drive organic traffic
```

**Critical SEO strategy:** Create individual pages for every popular conversion pair (e.g., `/convert/png-to-webp`, `/convert/pdf-to-docx`). Each page targets "convert PNG to WebP online free" type searches. This alone can drive 50K+ monthly visits.

### Technical Architecture
- **Images:** `sharp` compiled to WASM, or Canvas API for basic conversions
- **Documents:** `pdf-lib`, `mammoth` (DOCX), `marked` (Markdown), `puppeteer` (HTML to PDF on server)
- **Audio:** `ffmpeg.wasm` for client-side, serverless FFmpeg for premium
- **Video:** Server-side only, FFmpeg in containerized function

### Competitive Advantage
- **CloudConvert:** Paid after 25 conversions/day. ConvertFlow: generous free tier.
- **Zamzar:** Slow, email-based delivery. ConvertFlow: instant.
- **Online-Convert:** Cluttered UI, ads. ConvertFlow: clean, modern, no ads.

---

## Tool 3: Advanced SEO Checker

**Brand options:** SEOScope | PageGrade | CrawlCheck
**Domain options:** seoscope.app | pagegrade.app | crawlcheck.app
**Taglines:** "See everything Google sees." | "Grade your page in seconds." | "Crawl. Check. Rank."
**Color:** Violet (#7C3AED) + gradient to indigo

### What It Does
Advanced SEO analyzer that scans any URL and provides a comprehensive, actionable report. Not just a checker but a diagnostic tool with fix suggestions.

### Why It Will Be the Best
Most free SEO checkers give surface-level info (title tag exists, meta description length). SEOPulse goes deep: performance metrics, structured data validation, accessibility scoring, security headers, Core Web Vitals estimation, and competitor comparison.

### Features

#### Free Tier (per scan, 5 scans/day)
- **On-Page SEO (30+ checks)**
  - Title tag: length, keyword presence, uniqueness
  - Meta description: length, compelling copy, keyword usage
  - Heading hierarchy: H1-H6 structure, keyword distribution
  - URL structure: length, readability, keyword presence
  - Image optimization: alt tags, file sizes, next-gen formats (WebP/AVIF)
  - Internal linking: count, anchor text diversity, orphan pages
  - External links: count, nofollow ratio, broken links
  - Canonical URL: present, self-referencing, proper format
  - Open Graph: all tags present, image dimensions
  - Twitter Card: all tags present
  - Robots meta: indexability, follow directives

- **Technical SEO (20+ checks)**
  - HTTPS enforcement
  - robots.txt: present, valid, not blocking important pages
  - XML sitemap: present, valid, URL count
  - Structured data: JSON-LD validation, Schema.org types detected
  - hreflang: present, valid, consistent
  - Page speed estimation (based on DOM size, resource count, image sizes)
  - Mobile-friendliness (viewport meta, font sizes, tap targets)
  - Security headers: CSP, HSTS, X-Frame-Options, etc.
  - HTTP/2 or HTTP/3 support
  - Compression: Gzip/Brotli detection
  - Redirect chains detection

- **Content Analysis**
  - Word count and reading time
  - Keyword density analysis
  - Content-to-HTML ratio
  - Duplicate content risk (thin content detection)

- **Scoring System**
  - Overall SEO Score (0-100)
  - Category scores: On-Page, Technical, Performance, Content
  - Issues categorized as: Critical, Warning, Info, Passed
  - Each issue with "How to Fix" explanation

#### Premium ($9/month)
- Unlimited scans
- Bulk URL scanning (crawl entire site)
- Competitor comparison (scan 2 URLs side by side)
- Historical tracking (re-scan monthly, see progress)
- PDF report export with branding
- API access
- Lighthouse integration (real Core Web Vitals)
- Backlink overview (via third-party API)

### UI/UX Structure

```
Homepage
├── Hero: "Enter any URL" + large input field + "Analyze" button
├── Recent scans (if logged in)
├── Feature grid (what gets checked)
└── Testimonials / Usage stats

/scan/[id] - Scan results page
├── Overall score (large circular gauge)
├── Category breakdown (4 category scores)
├── Issues list (tabbed by category)
│   ├── Critical (red)
│   ├── Warnings (amber)
│   ├── Info (blue)
│   └── Passed (green)
├── Each issue expandable with:
│   ├── What was found
│   ├── Why it matters
│   └── How to fix it (with code examples)
└── "Download Report" / "Share Results" buttons
```

### Technical Architecture
- **Scanning engine:** Serverless function that fetches the URL, parses HTML with `cheerio` or `jsdom`
- **Performance:** Lighthouse API (via Google PageSpeed Insights API) for real metrics
- **Structured data:** `schema-dts` for validation, custom parser for JSON-LD extraction
- **Security headers:** Direct HTTP response header analysis
- **Rate limiting:** Upstash Redis for free tier limits
- **Report storage:** Supabase for scan results, share links
- **PDF generation:** `@react-pdf/renderer` or Puppeteer

### Competitive Advantage
- **Ahrefs Free Webmaster Tools:** Requires site verification. SEOPulse: scan any URL instantly.
- **SEMrush Site Audit:** Paid only. SEOPulse: generous free tier.
- **Seobility:** Basic checks only. SEOPulse: 50+ checks with fix suggestions.
- **GTmetrix:** Performance only. SEOPulse: full SEO audit.

---

## Tool 4: Visual Web Scraper

**Brand options:** GrabData | PluckData | ScrapeNest
**Domain options:** grabdata.app | pluckdata.app | scrapenest.app
**Taglines:** "Point. Click. Extract." | "Pluck data from any page." | "Your data extraction nest."
**Color:** Amber (#F59E0B) + dark background

### What It Does
Visual web scraper that lets users point-and-click to select data on any webpage, then exports it as CSV, JSON, or Excel. No coding required for basic use; API for developers.

### Features

#### Free Tier (10 scrapes/day)
- **Visual selector:** Enter URL, see rendered page, click elements to select
- Auto-detect patterns (tables, lists, repeating elements)
- Extract: text, links, images, attributes
- Preview data in table format before export
- Export: CSV, JSON, XLSX
- **Built-in templates** for common sites:
  - Google search results
  - Product listings (generic e-commerce pattern)
  - Contact information pages
  - Job listings
  - News articles

#### Premium ($12/month)
- Unlimited scrapes
- Scheduled scraping (daily, weekly, monthly)
- API access (REST + webhooks)
- JavaScript rendering (for SPAs)
- Pagination auto-follow
- Data transformation (regex, formatting)
- Webhook delivery (send data to your server)
- Multi-page crawling

### UI/UX Structure

```
Homepage
├── "Enter URL to scrape" input
├── How it works (3 steps: Enter URL, Select Data, Export)
├── Template library (common patterns)
└── API documentation preview

/scrape/new - Scraping interface
├── Left: Rendered webpage (iframe or screenshot)
├── Right: Selected fields + data preview
├── Bottom: Export options + Run button

/dashboard - User dashboard (premium)
├── Saved scrapers
├── Scheduled tasks
├── History
└── API keys
```

### Legal Considerations
- Add clear Terms of Service disclaiming responsibility for misuse
- Include robots.txt respect (warn user if site disallows scraping)
- Rate limiting to prevent abuse
- No scraping of personal data (GDPR notice)
- Focus marketing on legitimate uses: market research, price monitoring, content aggregation

### Technical Architecture
- **Rendering:** Puppeteer or Playwright in serverless (for JS-rendered pages)
- **Selection:** Custom overlay system using CSS selectors, or injected script that communicates with parent frame
- **Pattern detection:** Auto-detect `<table>`, `<ul>/<ol>`, repeating `<div>` patterns with similar class names
- **Export:** `xlsx` library for Excel, native JSON, `papaparse` for CSV
- **Scheduling:** Supabase Edge Functions with pg_cron, or Vercel Cron Jobs

---

## Tool 5: CV Optimizer & Job Application Tracker

**Brand options:** HireReady | ResumeRadar | CVForge
**Domain options:** hireready.app | resumeradar.app | cvforge.app
**Taglines:** "Land your next job. Faster." | "Your resume, under the radar." | "Forge the perfect CV."
**Color:** Sky blue (#0EA5E9) + white

### What It Does
CV/Resume optimization and job application automation. Analyzes your CV against job descriptions, suggests improvements, and helps manage applications.

### Features

#### Free Tier
- **CV Analysis:**
  - Upload PDF/DOCX resume
  - AI-powered review (formatting, content, keywords)
  - ATS (Applicant Tracking System) compatibility score
  - Keyword match against a job description (paste JD, get match %)
  - Section-by-section feedback (summary, experience, skills, education)
  - Suggested improvements with rewritten examples
- **Job Description Analyzer:**
  - Paste any job description
  - Extract key requirements, skills, and keywords
  - Highlight what's in your CV vs what's missing
- 5 analyses per day

#### Premium ($9/month)
- Unlimited analyses
- **CV Generator:** Create ATS-optimized CVs from scratch with guided wizard
- **Cover Letter Generator:** AI-generated cover letters tailored to each job
- **Application Tracker:**
  - Add jobs you've applied to
  - Track status (Applied, Interview, Offer, Rejected)
  - Reminders for follow-ups
  - Statistics dashboard (applications/week, response rate)
- **Batch Optimization:** Upload one CV, paste multiple JDs, get tailored versions
- Export optimized CVs in PDF, DOCX, and plain text
- API for integrations

### UI/UX Structure

```
Homepage
├── Hero: "Optimize your CV in 30 seconds" + upload zone
├── Paste job description field
├── Feature highlights
└── Success stories / Statistics

/analyze - Analysis results
├── Overall ATS Score (gauge)
├── Keyword Match (Venn diagram: your CV vs JD)
├── Section Reviews (expandable cards)
│   ├── Contact Info: ✓/✗ checks
│   ├── Professional Summary: rewrite suggestion
│   ├── Experience: bullet point improvements
│   ├── Skills: missing skills highlighted
│   └── Education: formatting check
└── "Download Optimized" / "Generate Cover Letter"

/tracker - Application tracker (premium)
├── Kanban board (Applied -> Interview -> Offer)
├── Statistics sidebar
└── Calendar with follow-up reminders
```

### Technical Architecture
- **AI:** OpenAI GPT-4o-mini for analysis and suggestions (cost-effective)
- **PDF parsing:** `pdf-parse` or `pdfjs-dist` for text extraction
- **DOCX parsing:** `mammoth` library
- **CV generation:** `@react-pdf/renderer` for PDF output
- **ATS scoring:** Custom algorithm based on formatting rules (no images, standard sections, keyword density)
- **Application tracker:** Supabase for data storage, real-time subscriptions

---

## Tool 6: QR Code Generator

**Brand options:** QRMint | ScanCraft | QRBrew
**Domain options:** qrmint.app | scancraft.app | qrbrew.app
**Taglines:** "Mint beautiful QR codes." | "Craft scannable art." | "Brew your perfect QR."
**Color:** Rose (#F43F5E) + dark

### What It Does
Advanced QR code generator with customization, analytics, and dynamic codes. Goes far beyond basic black-and-white squares.

### Features

#### Free Tier
- **QR Code Types:**
  - URL / Website
  - Plain text
  - Email (mailto:)
  - Phone number (tel:)
  - SMS
  - WiFi credentials
  - vCard (contact card)
  - Geographic location
  - Calendar event
  - Bitcoin/Crypto address
- **Customization:**
  - Foreground and background colors
  - Gradient fills (linear, radial)
  - Corner styles: square, rounded, dots, extra-rounded
  - Center logo/image upload
  - Frame templates (call-to-action borders: "Scan Me", "Visit Us", etc.)
  - Multiple dot styles: squares, circles, rounded, diamonds, stars
  - Error correction levels (L, M, Q, H)
- **Export:**
  - PNG (custom resolution up to 4096px)
  - SVG (vector, infinite scaling)
  - PDF (print-ready with bleed marks)
- Live preview as you edit
- Download without account
- No watermarks ever

#### Premium ($7/month)
- **Dynamic QR codes:** Change the destination URL after printing
- **Analytics:** Scan count, location, device, time of day
- **Batch generation:** Upload CSV with data, generate 100+ codes at once
- **Templates:** Save and reuse design templates
- **API access**
- **Custom short URLs** for dynamic codes
- **Team features:** Shared QR code library

### UI/UX Structure

```
Homepage (= The tool itself)
├── Left panel: QR content input (tabs for each type)
├── Center: Live QR code preview (large, real-time)
├── Right panel: Customization controls
│   ├── Colors tab (foreground, background, gradient)
│   ├── Style tab (corners, dots, frame)
│   ├── Logo tab (upload, position, size)
│   └── Export tab (format, resolution)
└── Bottom: "Download" button (always visible)

/dashboard (premium)
├── My QR codes library
├── Analytics overview
└── Batch generator
```

**Key UX:** The homepage IS the tool. No landing page needed. Users see the generator immediately and can create + download without signing up.

### Technical Architecture
- **QR generation:** `qr-code-styling` library (most customizable) or custom canvas rendering
- **SVG output:** Direct SVG generation for vector exports
- **PDF output:** `jsPDF` with SVG embed
- **Dynamic codes:** Short URL service (custom or Vercel redirects) -> Supabase for URL mapping
- **Analytics:** Supabase Edge Function as redirect proxy, logging scans
- **Logo processing:** Canvas API for embedding logos into QR codes client-side

### Competitive Advantage
- **QR Code Generator (qr-code-generator.com):** Requires account for any customization. QRForge: full customization, no account.
- **QR Code Monkey:** Limited styles, watermark on some features. QRForge: no watermarks, more styles.
- **Canva QR:** Locked behind Canva subscription. QRForge: free and focused.

---

## Tool 7: Business Email & Signature Builder

**Brand options:** SignaPro | MailCraft | InboxForge
**Domain options:** signapro.app | mailcraft.app | inboxforge.app
**Taglines:** "Professional email signatures in seconds." | "Craft your business inbox." | "Forge your professional inbox."
**Color:** Indigo (#6366F1) + white

### What It Does
Helps small businesses set up and manage professional email addresses (name@yourdomain.com) with templates, signatures, and DNS configuration guidance.

### Features

#### Free Tier
- **Email Signature Generator:**
  - Visual builder (drag-and-drop blocks)
  - Templates (Corporate, Creative, Minimal, Tech)
  - Fields: name, title, company, phone, email, website, social links, logo
  - HTML output (compatible with Gmail, Outlook, Apple Mail, Thunderbird)
  - Live preview for desktop and mobile
  - Copy HTML or one-click install guide per email client
- **DNS Setup Guide:**
  - Step-by-step guide for setting up business email
  - Provider-specific instructions (Google Workspace, Zoho, ProtonMail, etc.)
  - MX, SPF, DKIM, DMARC record generator with copy-paste values
  - DNS record validator (check if records are properly configured)
- **Email Template Library:**
  - 20+ professional email templates (welcome, follow-up, proposal, invoice, etc.)
  - Copy-paste ready with placeholders

#### Premium ($5/month)
- **Bulk signature creation** (generate for entire team from CSV)
- **Custom branded templates** (company colors, logo, fonts)
- **Analytics on signatures** (click tracking on links)
- **Hosted signature images** (so images always display)
- **API for signature generation**
- **Email warmup guide** (for new domains)

### UI/UX Structure

```
Homepage
├── Hero: "Professional emails for your business"
├── Three cards:
│   ├── "Create Email Signature" -> /signature
│   ├── "Set Up Business Email" -> /setup
│   └── "Email Templates" -> /templates
└── Why professional email matters (trust, branding, etc.)

/signature - Signature builder
├── Left: Form fields (name, title, etc.)
├── Center: Live preview (desktop + mobile toggle)
├── Right: Style controls (template, colors, layout)
└── Bottom: "Copy HTML" / "Install Guide" buttons

/setup - DNS setup wizard
├── Step 1: Choose email provider
├── Step 2: Enter domain name
├── Step 3: Generated DNS records with copy buttons
├── Step 4: Validate configuration
└── Done: Confirmation + next steps

/templates - Email template library
├── Category filter (Welcome, Follow-up, Sales, etc.)
├── Template cards with preview
└── Click to view full template + copy
```

### Technical Architecture
- **Signature builder:** React component with inline styles (for email client compatibility)
- **DNS validation:** `dns` module in serverless function, or public DNS API (Google DNS over HTTPS)
- **HTML email compatibility:** Use table-based layouts for signatures (email clients don't support modern CSS)
- **Template system:** MDX or Handlebars templates with variable substitution

---

## Tool 8: Romanian Company Directory

**Brand options:** FirmaCheck | CUISearch | FirmaScan
**Domain options:** firmacheck.ro | cuisearch.ro | firmascan.ro
**Taglines:** "Verifica orice firma. Instant." | "Cauta dupa CUI in secunde." | "Scaneaza orice firma din Romania."
**Color:** Teal (#14B8A6) + white

### What It Does
Romanian business directory with search, filtering, and company profiles. Uses ONLY public data from official sources (ANAF, ONRC open data APIs).

### IMPORTANT: Legal Compliance
- Use ONLY official public APIs (ANAF webservices, Open Data portals)
- Do NOT scrape listafirme.ro or similar sites
- All data must come from public government sources
- Include clear data source attribution
- GDPR compliant: no personal data, only company data (CUI, name, address, status)

### Features

#### Free Tier
- **Company Search:**
  - Search by: company name, CUI/CIF, CAEN code, county, city
  - Instant results with auto-complete
  - Company profile: name, CUI, registration number, CAEN codes, address, status (active/inactive), TVA status, fiscal attributes
- **Filters:**
  - By county and city
  - By CAEN code (with human-readable descriptions)
  - By status (active, inactive, dissolved)
  - By VAT payer status
  - By founding year
- **Company Profile Page:**
  - All public fiscal data
  - CAEN activity codes with descriptions
  - Registration history
  - Fiscal status timeline
  - Google Maps location (based on address)

#### Premium ($7/month)
- **Bulk search:** Upload CSV of CUIs, get all data
- **Export:** CSV, XLSX, JSON
- **API access** (REST with rate limits)
- **Watchlist:** Monitor companies for status changes
- **CAEN statistics:** How many companies per CAEN code, per region
- **Advanced analytics:** Founding trends, industry distribution

### Technical Architecture
- **Data source:** ANAF SOAP webservices (https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva)
- **Caching:** Supabase/PostgreSQL cache of looked-up companies (refreshed on request)
- **Search:** PostgreSQL full-text search with trigram indexes for fuzzy matching
- **CAEN codes:** Static dataset imported from official CAEN Rev.3 classification (in vigoare din 1 ianuarie 2025, aliniat cu NACE Rev. 2.1). Important: include maparea Rev.2 -> Rev.3 pentru companiile care nu si-au actualizat inca codurile (termen 18 luni de la 25.03.2025 conform HG 284/2025)
- **Maps:** Google Maps or OpenStreetMap for address visualization

---

## Launch Strategy (for all tools)

### Phase 1: Build & Soft Launch (per tool)
1. Build MVP with core free features
2. Deploy with SEO pages for conversion keywords
3. Create GitHub repo with excellent README
4. Soft launch to dev communities (X/Twitter, Reddit)

### Phase 2: Growth
1. Submit to Product Hunt
2. Write "How I Built X" blog post on Dev.to / Hashnode
3. Share on Reddit (r/webdev, r/SideProject, r/startups)
4. Create YouTube demo video

### Phase 3: Monetization
1. Add premium tier after 1,000+ users
2. Stripe integration for subscriptions
3. API documentation for developer tier

### Recommended Build Order
1. **QR Code Generator** (QRMint/ScanCraft/QRBrew) - Quickest to build, instant value, high search volume
2. **Compression Tool** (Crushd/Lightify/Shrynk) - High demand, strong SEO potential
3. **SEO Checker** (SEOScope/PageGrade/CrawlCheck) - Positions you as an SEO expert (meta-benefit for your own brand)
4. **File Converter** (FileFlip/Swapify/Morphit) - Many SEO landing pages possible (one per conversion pair)
5. **Email Signatures** (SignaPro/MailCraft/InboxForge) - Solves a real small business problem
6. **CV Optimizer** (HireReady/ResumeRadar/CVForge) - AI-powered, differentiator
7. **Web Scraper** (GrabData/PluckData/ScrapeNest) - Developer audience
8. **Director Firme** (FirmaCheck/CUISearch/FirmaScan) - Romania-specific niche
