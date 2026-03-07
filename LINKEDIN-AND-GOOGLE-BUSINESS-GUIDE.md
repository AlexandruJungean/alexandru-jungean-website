# LinkedIn Projects & Google Business Profile Guide

This document contains ready-to-copy texts for LinkedIn projects and Google Business Profile.

---

## PART 1: LinkedIn Projects (9 projects, in this order)

### How to add: LinkedIn > Profile > Add section > Projects

---

### 1. Primaria Municipiului Salonta - Government Website

- **Project name:** Primaria Municipiului Salonta - Government Website
- **Start date:** October 2025
- **End date:** February 2026
- **URL:** https://salonta.net
- **Skills to tag:** Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL
- **Description:**

```
Designed and developed the official website for Salonta City Hall (Primaria Municipiului Salonta), a comprehensive municipal government platform serving citizens, businesses, and tourists in Bihor County, Romania.

The platform features a trilingual interface (Romanian, Hungarian, English) reflecting the city's bilingual community, with full internationalization using next-intl. Built with Next.js 16 and React 19, it delivers a modern, accessible experience with Incremental Static Regeneration for real-time content updates.

Key features include: a mega navigation menu organized by audience (citizens, businesses, City Hall, tourists), online services integration (payments via Ghiseul.ro, petitions, forms), Local Council management (decisions, committees, asset declarations), public transparency section, news and events management, live webcams, interactive digital map via Map2Web, and a comprehensive admin panel with role-based access and audit logging.

Technical highlights: Self-hosted PostgreSQL database with custom authentication, local file storage for official documents ensuring full data sovereignty, Upstash Redis for rate limiting, reCAPTCHA v3 for form protection, Sharp for image optimization, and bcrypt-based admin authentication.

The admin dashboard with 20+ sections enables non-technical city hall employees to manage all content independently — from council decisions and budget documents to institutional information and public debates.
```

- **Recommended image:** Full-width desktop screenshot of salonta.net homepage (1200x627px)

---

### 2. City Xperience - City Discovery & Community Platform

- **Project name:** City Xperience - City Discovery & Community Platform (Web + Mobile)
- **Start date:** November 2024
- **End date:** (leave empty - ongoing)
- **URL:** https://oradeaexperience.ro
- **Skills to tag:** Next.js, React, React Native, Tailwind CSS, Google Maps, Stripe
- **Description:**

```
Built the complete frontend for City Xperience, a white-label city discovery platform that has grown into a multi-city franchise. Originally launched as Oradea Experience, the platform now operates in two cities: Oradea Experience (oradeaexperience.ro) and Cluj Xperience (clujxperience.ro), each with unique branding, colors, logos, and content.

The ecosystem includes two independent websites (Next.js + Tailwind CSS), a shared mobile app "City Xperience" published on both the App Store and Google Play (React Native/Expo), and a Node.js/Express backend with MongoDB.

Key features: event discovery and ticketing with Stripe payments, business directory with Google Maps, community forum with gamification (points, achievements, badges, leaderboards), community shop with redeemable rewards, startup ideas section, user profiles with QR-based check-ins, giveaways, surveys, and interactive city maps.

Platform results: 5,900+ registered users on Oradea alone, 120+ businesses onboarded, 300+ events published, and hundreds of rewards in the community shop. The Cluj franchise recently launched with a separate legal entity, validating the white-label model.

Responsible for all frontend architecture, UI/UX design, state management, API integration, and the white-label system that enables rapid city deployment.
```

- **Recommended image:** Side-by-side screenshots of oradeaexperience.ro and clujxperience.ro (1200x627px)

---

### 3. Tool Connect - Service Provider Marketplace

- **Project name:** Tool Connect - Service Provider Marketplace (Mobile + Web)
- **Start date:** September 2025
- **End date:** December 2025
- **URL:** https://tool-connect.com
- **Skills to tag:** React Native, Expo, TypeScript, Supabase, Next.js
- **Description:**

```
Designed, developed, and launched Tool Connect, a marketplace platform connecting local service providers with clients in Prague, Czech Republic. Delivered a complete product including native mobile apps (iOS and Android), a marketing website, branding, and database architecture.

The mobile app (React Native/Expo) features: phone authentication, real-time chat with attachments, Google Maps-based provider search with filters, portfolio management for providers, review system, push notifications via OneSignal, Google Translate integration for bilingual support (EN/CS), and a complete admin dashboard with analytics.

The Next.js website serves as the platform's online presence with download links, feature showcase, and SEO optimization (JSON-LD structured data, sitemap, Open Graph).

Additionally created the complete branding package: logo, slogan, USP, social media content (9 promotional posts for providers and clients), YouTube banner, LinkedIn cover, Facebook cover, and 2 printed flyers (one for service providers, one for clients).

The app is live on both the App Store and Google Play with active users in Prague, Czech Republic.
```

- **Recommended image:** Phone mockup showing the app + laptop showing tool-connect.com (1200x627px)

---

### 4. FleetKeeper - B2B Fleet Management SaaS

- **Project name:** FleetKeeper - B2B Fleet Management SaaS
- **Start date:** January 2026
- **End date:** (leave empty - ongoing)
- **URL:** https://fleetkeeper.app
- **Skills to tag:** React Native, Expo, TypeScript, Supabase, PostgreSQL
- **Description:**

```
Developing FleetKeeper, a B2B SaaS mobile application for fleet and transportation companies to track vehicle, driver, and company document expiration dates with automated notifications.

The platform addresses a critical pain point: transport companies manage 100+ different expiration types (ITP, RCA, CASCO, tachograph, ADR, CPC, medical certificates, etc.) and missing a single deadline can result in fines or grounded vehicles.

Technical architecture: React Native with Expo for cross-platform mobile (iOS + Android), Supabase for multi-tenant backend with Row Level Security, AI-powered document scanning using GPT-4o-mini for automatic date extraction, dual storage (Supabase for images, Cloudflare R2 for documents), push notifications (Expo Push) and email alerts (Brevo) with configurable reminder schedules.

Key features: role-based access (Admin/Manager/Driver), 116+ predefined expiration types, subscription tiers with Stripe, 12-language support (EN, RO, HU, DE, FR, ES, IT, PL, BG, CS, NL, PT), automated daily notification cron jobs via pg_cron, and a companion marketing website.

The marketing site (fleetkeeper.app) supports the same 12 languages with SEO optimization, Schema.org structured data, and a modern responsive design.
```

- **Recommended image:** App screenshots showing dashboard + fleetkeeper.app website (1200x627px)

---

### 5. Radical Football - Educational Platform

- **Project name:** Radical Football - Youth Football Educational Platform
- **Start date:** October 2025
- **End date:** March 2026
- **URL:** https://alexjungean.com/projects/radical-football
- **Skills to tag:** Next.js, React, TypeScript, Supabase, Stripe, Tailwind CSS
- **Description:**

```
Built a comprehensive educational platform for Radical Football, transforming youth football education through emotional intelligence. The platform serves coaches, parents, educators, and researchers with conferences, resources, and community features in Oradea, Romania.

Developed 6 interconnected subsystems: Conference management (with ticketing via Stripe, accommodation booking, room pairing, speaker applications), Resource Library (with a custom Konva-based training diagram builder for visual session planning), Magazine for editorial content, Community section (forum, member map via Google Maps, emotional Break Spaces), and a Speaker Portal (multi-step onboarding with deadlines and honorarium tracking).

Technical implementation: Next.js 16 with React 19, Supabase with Row Level Security, Stripe for payments (tickets, donations, sponsorships), Upstash Redis for rate limiting, Resend for transactional emails, Radix UI for accessible components, and React Compiler for automatic memoization.

The 14-tab admin dashboard provides complete platform management including analytics, user management, content moderation, and conference operations. Bilingual support (RO/EN) and full SEO optimization with ISR.
```

- **Recommended image:** Desktop screenshot of the platform homepage (1200x627px)

---

### 6. Amidamaru - International Transport Website

- **Project name:** Amidamaru - International Transport Company Website
- **Start date:** January 2026
- **End date:** February 2026
- **URL:** https://amidamaru.ro
- **Skills to tag:** Next.js, React, TypeScript, Tailwind CSS
- **Description:**

```
Designed and developed the corporate website for Amidamaru, an international road freight transport company based in Arad, Romania, operating across 14+ European countries with 20+ years of experience.

Built with Next.js 16 as a static site (SSG) for optimal performance on shared hosting, featuring 9 complete language translations (RO, EN, DE, FR, IT, ES, CZ, PL, HU) to serve their pan-European client base. Language preference persists via localStorage with hydration-safe initialization.

Key sections: full-viewport hero with scroll indicator, company statistics (20+ years, 14+ countries, 23+ trucks, 20,000+ deliveries), four service cards (FTL, LTL, Express Delivery, Logistics Solutions), fleet gallery with 12 images and expand/collapse functionality, company details with Google Maps embed, and a contact form via Web3Forms.

Includes GDPR-compliant privacy and cookie policies, comprehensive SEO with JSON-LD TransportCompany schema, Open Graph metadata, and Apache .htaccess configuration for HTTPS, www redirect, Gzip compression, and UTF-8 encoding.
```

- **Recommended image:** Full screenshot of amidamaru.ro (1200x627px)

---

### 7. Service 24 BDD - Truck Repair Service Website

- **Project name:** Service 24 BDD - Multilingual Truck Service Website
- **Start date:** December 2025
- **End date:** January 2026
- **URL:** https://alexjungean.com/projects/service-24-bdd
- **Skills to tag:** HTML, CSS, JavaScript, SEO
- **Description:**

```
Created a professional multilingual website for Truck Service 24 BDD, a 24/7 mobile truck and trailer repair service based in Arad, Romania, serving truck drivers across Romania and Europe.

The site supports 8 languages (RO, EN, DE, ES, PL, HR, BG, HU) targeting truck drivers across Europe. Features include: device-aware call buttons (phone dialer on mobile, WhatsApp on desktop), a comprehensive ECU pricing table with 50+ SKUs across 6 major brands (Mercedes-Benz, Scania, Volvo, DAF, MAN, Iveco), contact form via Formspree, and a parallax hero design.

Implemented extensive SEO: Schema.org structured data (Organization, AutoRepair, EmergencyService, FAQPage, BreadcrumbList), hreflang tags for 8 languages with x-default, XML sitemap with image metadata, geo meta tags for Arad region, security headers (CSP, HSTS, X-Frame-Options), and Netlify performance optimization with Lighthouse CI plugin.

The design uses a dark hero with teal and orange accents, Inter typography, scroll-based animations, and responsive layouts optimized for truck drivers accessing the site from mobile devices in roadside situations.
```

- **Recommended image:** Screenshot of the website hero section (1200x627px)

---

### 8. Nuestra - E-commerce Platform

- **Project name:** Nuestra - Dual-Brand E-commerce Platform
- **Start date:** February 2026
- **End date:** (leave empty - ongoing)
- **URL:** https://alexjungean.com/projects/nuestra
- **Skills to tag:** Next.js, React, TypeScript, Tailwind CSS
- **Description:**

```
Developing the e-commerce platform for Nuestra, a dual-brand ecosystem combining streetwear fashion ("The Street is Ours") and youth football equipment ("The Game is Ours"), inspired by "la nuestra" from Argentinian football culture.

The platform features two distinct brand experiences within a single Next.js 16 application: a dark-themed streetwear shop with burgundy (#722F37) accents, Oswald/Barlow fonts, and "//" visual identity, and a light-themed sports equipment store with green accents targeting youth football age groups (U8-U16+).

Each brand has independent navigation, product catalogs, filtering systems (categories, collections, price ranges, age groups for sport), and design systems while sharing the common technical foundation and SEO architecture.

Built with modern SEO practices: JSON-LD structured data for Organization, Store, Product, Breadcrumb, FAQ, and Collection schemas, dynamic sitemap generation, comprehensive Open Graph metadata, AVIF/WebP image optimization with responsive srcset, and security headers.

Architecture prepared for Supabase backend integration, Stripe payment processing, and a multi-tenant fan page system for sports clubs and athletes.
```

- **Recommended image:** Split-screen showing both brand homepages (streetwear dark + sport light) (1200x627px)

---

### 9. ARDT Oradea - Long-term Design & Project Collaboration

- **Project name:** ARDT Oradea - 5-Year Design & Project Collaboration
- **Start date:** January 2021
- **End date:** (leave empty - ongoing)
- **URL:** https://alexjungean.com/projects/ardt
- **Skills to tag:** Figma, Adobe Photoshop, Branding, Project Management
- **Description:**

```
Five-year ongoing collaboration with ARDT Oradea (Asociatia pentru Dezvoltare Regionala si Tineret), contributing graphic design, branding, project writing, and strategic planning across multiple youth development programs.

Design deliverables include complete brand identities for: NextGen Entrepreneurs (NGE) with modern blue palette and circular abstract icon, Aleu Summer Camp with earthy green/gold bee motif, TALOS program with sponsor integrations, and ATT program with custom typography system. Each identity includes logo variants (transparent, bordered, grayscale, simplified), color palettes, and typography guidelines.

Beyond design, actively participated in organizational activities: facilitated InternStart training sessions (career orientation, communication, presentation skills for youth), contributed to project proposals and funding applications, attended company visits, and participated in project debates and evaluations in board meetings.

Created promotional materials including roll-ups, flyers, social media posts, Instagram/Facebook content, and event signage. All work organized through structured design systems in Figma with Adobe Photoshop for specialized editing.

This long-term partnership demonstrates sustained collaboration, adaptability across different program needs, and the ability to deliver consistent branding across an organization's entire portfolio of initiatives.
```

- **Recommended image:** Collage of logos created (NGE, Aleu Summer Camp, TALOS) on a professional background (1200x627px)

---

## PART 2: LinkedIn Image Recommendations

For each project, create a **1200x627px** landscape image. Options:

1. **Best option:** Real screenshots of live websites/apps placed in device mockups
2. **Alternative:** Use a tool like Figma, Canva, or Shots.so to create mockup presentations
3. **For City Xperience:** Side-by-side screenshots of both city websites + phone mockup of the app
4. **For Tool Connect & FleetKeeper:** Phone mockup + laptop mockup side by side
5. **For ARDT:** Collage of the program logos you created, arranged on a branded background

Tips:
- Use consistent branding (your brand color #678b9e or #7c3aed as accent)
- Add a subtle watermark or "alexjungean.com" in corner
- Keep it clean and professional - no heavy text overlays

---

## PART 3: Google Business Profile

### Business: Alexandru Jungean - IT Freelancer

### 1. Business Description (750 characters max)

```
Alexandru Jungean is a freelance web and mobile developer based in Romania, specializing in modern digital solutions for businesses of all sizes. Services include custom website development, native mobile app development (iOS & Android), UI/UX design, branding, database architecture, and data analysis. Built with cutting-edge technologies: Next.js, React, React Native, TypeScript, Tailwind CSS, and Supabase. Clients range from government institutions and SaaS startups to transport companies and e-commerce brands across Romania and Europe. Every project is delivered with performance optimization, SEO best practices, and responsive design.
```

(746 characters)

### 2A. Services to Add (Sectiunea "Servicii")

Services appear in Google Search/Maps when people search for specific services. They have a 300-character description limit. Price options: Niciun pret / Liber / Fixa / De la.

**From Google's pre-defined list (select these):**

1. **Dezvoltarea aplicatiilor**
   - Pret: De la → 3000 RON
   - Descriere (300 chars):
   ```
   Custom web and mobile applications built with modern technologies. From simple landing pages to complex platforms with admin panels, payments, and real-time features. Next.js, React, Tailwind CSS, Supabase. Published on App Store and Google Play.
   ```

2. **Dezvoltare aplicatii mobile**
   - Pret: De la → 5000 RON
   - Descriere:
   ```
   Native iOS and Android apps with React Native and Expo. Cross-platform from a single codebase. Features: authentication, push notifications, chat, maps, payments via Stripe, camera/QR scanning. Recent: Tool Connect (Prague marketplace), FleetKeeper (fleet management SaaS).
   ```

3. **Dezvoltare software**
   - Pret: De la → 2000 RON
   - Descriere:
   ```
   End-to-end software development: websites, web apps, mobile apps, databases, and admin dashboards. TypeScript, React, Next.js, Supabase, PostgreSQL. Clients include government institutions, transport companies, e-commerce brands, and SaaS startups across Romania and Europe.
   ```

4. **Externalizarea dezvoltarii software**
   - Pret: Niciun pret
   - Descriere:
   ```
   Outsource your web or mobile development to a reliable freelancer. Clear communication, structured process, on-time delivery. Experience with international clients (Czech Republic, Romania). Full project ownership: design, development, deployment, and post-launch support.
   ```

5. **Consultanta IT**
   - Pret: De la → 500 RON
   - Descriere:
   ```
   Technical consulting for businesses: technology stack selection, architecture planning, SEO audits, database optimization, and digital strategy. I help you choose the right tools and approach before development starts, saving time and budget.
   ```

6. **Consultanta software**
   - Pret: De la → 500 RON
   - Descriere:
   ```
   Software architecture consulting: database design, API planning, authentication strategy, hosting selection, performance optimization. Specialized in Supabase, PostgreSQL, Next.js, and React Native ecosystems. Code reviews and technical audits available.
   ```

**Custom services to add (click "Adauga un serviciu personalizat"):**

7. **UI/UX Design**
   - Pret: De la → 1500 RON
   - Descriere:
   ```
   User interface and experience design in Figma. Responsive layouts, interactive prototypes, design systems with reusable components. Accessibility-first approach. Available standalone or bundled with development. Clean, modern aesthetics that convert visitors into customers.
   ```

8. **Branding & Visual Identity**
   - Pret: De la → 1000 RON
   - Descriere:
   ```
   Complete brand identity: logo design (multiple variants), color palette, typography, social media kit, marketing materials (flyers, banners, posts). 5+ years branding experience with organizations and startups. Delivered in Figma with all source files included.
   ```

9. **Multilingual Website Development**
   - Pret: De la → 4000 RON
   - Descriere:
   ```
   Websites supporting 2 to 12 languages with proper internationalization, hreflang SEO, and locale-specific content. Proven track record: 3 languages (Primaria Salonta), 8 languages (Service 24 BDD), 9 languages (Amidamaru), 12 languages (FleetKeeper).
   ```

10. **E-commerce Development**
    - Pret: De la → 4000 RON
    - Descriere:
    ```
    Online stores with product catalogs, Stripe payment integration, filtering, size/color selectors, and mobile-responsive design. Built with Next.js for fast loading and SEO. Image optimization in AVIF/WebP. Multi-brand architecture support.
    ```

11. **Database Architecture & Solutions**
    - Pret: De la → 1500 RON
    - Descriere:
    ```
    Database design, optimization, and management. PostgreSQL, Supabase, MongoDB, SQL Server. Multi-tenant architectures with Row Level Security, real-time subscriptions, Edge Functions, automated jobs (pg_cron), and data migration from legacy systems.
    ```

---

### 2B. Products to Add (Sectiunea "Produse")

These go in the "Adauga un produs" form on Google Business Profile.
Each entry has: Nume produs (max 58 chars), Categorie, Pret (optional), Descriere (max 1,000 chars), URL.

---

**Product 1:**
- Nume produs: `Custom Website Development`
- Categorie: `Web Development`
- Pret: (leave empty)
- URL: `https://alexjungean.com/services/website-creation`
- Descriere:
```
Professional, modern websites built with Next.js, React, and Tailwind CSS.

What's included:
• Responsive design (mobile, tablet, desktop)
• SEO optimization (meta tags, Schema.org, sitemap, Open Graph)
• Multilingual support (2 to 12 languages with hreflang)
• Admin panel / CMS for easy content management
• Contact forms with email notifications
• Google Maps integration
• Analytics setup (Google Analytics)
• Performance optimization (Core Web Vitals, image compression)
• GDPR-compliant privacy and cookie policies
• Security headers and SSL configuration

Built for businesses of all sizes — from local companies to government institutions. Every website is delivered with clean code, fast loading times, and a design that converts visitors into clients.

Recent projects: Primaria Municipiului Salonta (trilingual government website), Amidamaru (9-language transport company site), Radical Football (educational platform with Stripe payments).
```

---

**Product 2:**
- Nume produs: `Mobile App Development (iOS & Android)`
- Categorie: `App Development`
- Pret: (leave empty)
- URL: `https://alexjungean.com/services/mobile-app-development`
- Descriere:
```
Native mobile applications for iOS and Android, built with React Native and Expo. One codebase, two platforms — published on both the App Store and Google Play.

What's included:
• Cross-platform development (iOS + Android)
• User authentication (email, Google, Apple Sign-In)
• Push notifications
• Real-time messaging / chat
• Google Maps and location services
• Camera, QR scanning, image picker
• Payment integration (Stripe)
• Admin dashboard for content management
• App Store and Play Store publishing
• Post-launch support and bug fixes

Recent projects: Tool Connect (marketplace app live in Prague), FleetKeeper (B2B fleet management with AI document scanning), City Xperience (community platform with 5,900+ users).

Every app is delivered with a companion marketing website and complete branding package.
```

---

**Product 3:**
- Nume produs: `UI/UX Design`
- Categorie: `Design`
- Pret: (leave empty)
- URL: `https://alexjungean.com/services/ui-ux-design`
- Descriere:
```
User-centered interface design that looks great and converts visitors into customers.

What's included:
• Complete website or app UI design in Figma
• Responsive layouts for all screen sizes
• Interactive prototypes for testing before development
• Design system with reusable components
• Color palette, typography, and spacing guidelines
• Accessibility-first approach (WCAG standards)
• Handoff-ready files with specifications for developers

Design is not just about aesthetics — it's about making products intuitive and easy to use. Every design decision is backed by UX principles that improve user engagement and conversion rates.

Available as a standalone service or bundled with website/app development.
```

---

**Product 4:**
- Nume produs: `Branding & Visual Identity`
- Categorie: `Design`
- Pret: (leave empty)
- URL: `https://alexjungean.com/services/branding-design`
- Descriere:
```
Complete brand identity packages that make your business memorable and professional.

What's included:
• Logo design with multiple variants (color, grayscale, transparent, simplified)
• Brand color palette and typography guidelines
• Business card and letterhead design
• Social media kit (profile pictures, cover photos, post templates)
• Marketing materials (flyers, roll-ups, banners)
• Brand guidelines document

Additional branding services:
• Slogan and USP (Unique Selling Proposition) creation
• Social media content creation (feed posts, stories, ads)
• YouTube banners and LinkedIn covers
• Print-ready promotional materials

5+ years of branding experience with organizations like ARDT Oradea, creating visual identities for multiple programs including NextGen Entrepreneurs, Aleu Summer Camp, and TALOS.
```

---

**Product 5:**
- Nume produs: `Database Architecture & Solutions`
- Categorie: `Software Development`
- Pret: (leave empty)
- URL: `https://alexjungean.com/services/database-solutions`
- Descriere:
```
Robust database design, optimization, and management for applications of any scale.

Technologies:
• PostgreSQL (via Supabase)
• MongoDB
• SQL Server
• MySQL

What's included:
• Database schema design and normalization
• Row Level Security (RLS) for multi-tenant applications
• Authentication and authorization setup
• File storage configuration (Supabase Storage, Cloudflare R2)
• API rate limiting (Upstash Redis)
• Data migration from legacy systems
• Performance optimization and indexing
• Backup and recovery strategies
• Audit logging and activity tracking

Experienced with complex multi-tenant architectures, real-time subscriptions, Edge Functions, and automated scheduled jobs (pg_cron).

Recent projects: FleetKeeper (multi-tenant SaaS with 116+ entity types), Primaria Salonta (government CMS with role-based access).
```

---

**Product 6:**
- Nume produs: `E-commerce Website Development`
- Categorie: `Web Development`
- Pret: (leave empty)
- URL: `https://alexjungean.com/services/website-creation`
- Descriere:
```
Modern online stores that showcase your products and convert browsers into buyers.

What's included:
• Product catalog with categories, filters, and search
• Shopping cart and checkout flow
• Payment integration (Stripe)
• Size, color, and variant selectors
• Product image galleries with zoom
• Inventory management
• Order tracking
• Mobile-responsive product pages
• SEO optimization (Product schema, dynamic sitemap, Open Graph)
• Multi-brand support within a single platform

Built with Next.js for fast page loads and excellent SEO. Optimized images in AVIF/WebP format with responsive srcset for all devices.

Recent project: Nuestra — dual-brand e-commerce platform combining streetwear fashion and youth sports equipment in a single application with independent themes and navigation.
```

---

**Product 7:**
- Nume produs: `Multilingual Website Development`
- Categorie: `Web Development`
- Pret: (leave empty)
- URL: `https://alexjungean.com/services/website-creation`
- Descriere:
```
Websites that speak your customers' language — from 2 to 12 languages with proper internationalization and SEO for each locale.

What's included:
• Full content translation management
• Proper URL routing per language (/ro, /en, /hu, etc.)
• hreflang SEO tags for search engines
• Language-specific meta tags and Open Graph
• Automatic language detection based on browser settings
• Language switcher with flag icons
• RTL support if needed
• Locale-specific date, number, and currency formatting

Technologies: next-intl, i18next, custom translation systems.

Proven experience across multiple language counts:
• 3 languages: Primaria Salonta (RO, HU, EN)
• 8 languages: Service 24 BDD (RO, EN, DE, ES, PL, HR, BG, HU)
• 9 languages: Amidamaru (RO, EN, DE, FR, IT, ES, CZ, PL, HU)
• 12 languages: FleetKeeper (EN, RO, HU, DE, FR, ES, IT, PL, BG, CS, NL, PT)
```

---

**Product 8:**
- Nume produs: `SaaS Application Development`
- Categorie: `Software Development`
- Pret: (leave empty)
- URL: `https://alexjungean.com/services/mobile-app-development`
- Descriere:
```
Multi-tenant B2B applications with subscription management, role-based access, and automated workflows.

What's included:
• Multi-tenant architecture with data isolation (Row Level Security)
• Role-based access control (Admin, Manager, User roles)
• Subscription tiers with Stripe billing
• Automated email and push notifications
• Admin dashboard with analytics
• API development for integrations
• AI-powered features (document scanning, content generation)
• Scheduled background jobs (daily reports, reminders)
• White-label support for franchise models

Tech stack: React Native + Expo (mobile), Next.js (web), Supabase (backend), Stripe (payments), Resend/Brevo (email).

Recent projects: FleetKeeper (fleet management SaaS with AI document scanning, 12 languages, multi-tenant), City Xperience (white-label city platform franchised to 2 cities with 5,900+ users).
```

### 3. Photos to Upload

**Logo:** Your current logo from alexjungean.com

**Cover Photo:** Full desktop screenshot of alexjungean.com homepage

**Portfolio Photos (upload 8-10):**
1. Screenshot of salonta.net homepage (government = credibility)
2. Side-by-side of oradeaexperience.ro + clujxperience.ro
3. Tool Connect app screenshot + website
4. FleetKeeper app + fleetkeeper.app website
5. Screenshot of Radical Football platform
6. Screenshot of amidamaru.ro
7. Screenshot of Service 24 BDD website
8. Screenshot of Nuestra (both brand themes)

**At Work Photo:** If you have a professional photo at your desk/workspace, add it.

### 4. Additional Google Business Tips

- **Posts:** Share a portfolio update post mentioning the new projects (free marketing)
- **Q&A:** Pre-populate common questions (What technologies do you use? Do you work internationally? What's your typical project timeline?)
- **Reviews:** Ask satisfied clients to leave Google reviews - this is the #1 factor for local SEO
- **Business Hours:** Set accurate availability hours
- **Messaging:** Enable messaging so potential clients can reach you directly
