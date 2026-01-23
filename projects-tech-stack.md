# Projects Technology Stack Reference

This document contains detailed technology information for each project. Use this to update project pages and add new projects.

---

## My Core Technologies (for "Technologies I Use" section)

### Databases
- SQL Server, MySQL, PostgreSQL, MongoDB

### Web
- HTML, CSS, JavaScript, React, Next.js

### Mobile
- React Native

### Design
- Figma, Adobe Photoshop

### Data
- Python, Power BI, Excel

### Tools
- Git, VS Code

---

## Project: TOOL (Mobile App - Native Conversion)

### Framework & Platform
- React Native (0.81.5) - framework pentru aplicații mobile cross-platform
- Expo (~54.0.31) - platformă de dezvoltare și build pentru React Native
- EAS (Expo Application Services) - pentru build-uri și deploy

### Language
- TypeScript (5.9.3) - limbaj principal cu tipare statice

### State Management & Data Fetching
- Zustand (5.0.8) - state management simplu și performant
- TanStack React Query (5.90.10) - data fetching, caching și sincronizare

### Navigation
- React Navigation (7.x) - navigare cu bottom tabs și native stack

### Backend & Database
- Supabase (2.84.0) - Backend-as-a-Service (autentificare, bază de date, storage)

### UI & Components
- @gorhom/bottom-sheet - bottom sheets animate
- React Native Reanimated - animații performante
- React Native Gesture Handler - gesturi native
- React Native Maps - hărți Google Maps
- Expo Vector Icons - iconuri

### Expo Features
- expo-image-picker - selectare imagini/video
- expo-location - geolocalizare
- expo-notifications - notificări push
- expo-av / expo-video - audio/video
- expo-secure-store - stocare securizată
- expo-updates - OTA updates
- expo-store-review - review-uri în app

### Internationalization
- i18n-js - traduceri și localizare
- expo-localization - detectare limbă

### Utilities
- date-fns - formatare date
- AsyncStorage - stocare locală

### Linting & Formatting
- ESLint + TypeScript ESLint - linting
- Prettier - formatare cod

---

## Project: TOOL (Website & Web App)

### Framework & Core
- Next.js 16.0.10 - Framework React cu Turbopack pentru development
- React 19.2.3 - Librăria UI principală
- TypeScript 5.7.3 - Pentru tipare statice

### Backend & Database
- Supabase - Backend-as-a-Service (autentificare, bază de date, etc.)
- @supabase/supabase-js - Client SDK
- @supabase/ssr - Integrare pentru Server-Side Rendering

### Styling
- Tailwind CSS 3.4.17 - Framework CSS utility-first
- PostCSS - Procesare CSS
- Autoprefixer - Adăugare automată prefixe vendor

### UI & Components
- Lucide React - Icoane
- Recharts - Grafice și vizualizări de date

### Utilities
- clsx - Construire clase CSS condiționale
- tailwind-merge - Merge inteligent clase Tailwind
- date-fns - Manipulare date

### Development & Tooling
- ESLint 9 - Linting cod
- Netlify - Deployment

---

## Project: Primăria Municipiului Salonta (Website)

### Framework & Language
- Next.js 16.1.1 - framework React pentru aplicații web
- React 19.2.3 - librărie UI
- TypeScript 5 - limbaj de programare tipizat

### Styling
- Tailwind CSS 4 - framework CSS utility-first
- class-variance-authority - pentru variante de componente
- clsx + tailwind-merge - pentru gestionarea claselor CSS

### Database & Storage
- Supabase (PostgreSQL) - bază de date
- Cloudflare R2 - storage pentru documente (via AWS SDK S3)

### Internationalization (i18n)
- next-intl - suport pentru 3 limbi: Română, Maghiară, Engleză

### Forms & Validation
- React Hook Form - gestionare formulare
- Zod - validare scheme de date
- react-google-recaptcha-v3 - protecție anti-spam

### Security & Rate Limiting
- Upstash Redis + Upstash Ratelimit - rate limiting pentru API

### Other Libraries
- Nodemailer - trimitere email-uri
- Sharp - procesare imagini
- Lucide React - iconițe
- date-fns - manipulare date

### Hosting & DevOps
- Netlify - hosting producție
- ESLint - linting cod

---

## Project: Amidamaru (Transport Company Website)

### Framework & Runtime
- Next.js 16.1.1 - Framework React pentru aplicații web, configurat pentru export static (output: 'export')
- React 19.2.3 - Biblioteca principală pentru UI
- React DOM 19.2.3 - Renderer pentru browser

### Language
- TypeScript 5 - Superset de JavaScript cu tipuri statice, configurat cu mod strict

### Styling
- Tailwind CSS 4 - Framework CSS utility-first
- PostCSS - Procesor CSS (folosit pentru integrarea Tailwind)

### Development Tools
- ESLint 9 - Linter pentru cod JavaScript/TypeScript
- eslint-config-next - Configurație ESLint specifică pentru Next.js

### Notable Configuration
- Static Site Generation (SSG) - generează fișiere HTML statice
- App Router (structura app/)
- Multi-language support (LanguageContext.tsx și translations.ts)
- Privacy și Cookies pages (GDPR compliance)
- SEO files: robots.txt, sitemap.xml, llms.txt

---

## Project: Emamut (Security Systems - Cameras, Sensors, Alarms)

### Framework & Core
- Next.js 16.1.1 - Framework React pentru producție
- React 19.2.3 - Biblioteca UI
- TypeScript 5 - Superset JavaScript cu tipuri statice

### Styling
- Tailwind CSS 4 - Framework CSS utility-first
- clsx & tailwind-merge - Utilitare pentru clase CSS condiționale

### Internationalization
- next-intl 4.6.1 - Suport multilingv (ro, en, hu)

### Forms & Validation
- React Hook Form 7.69.0 - Gestionarea formularelor
- @hookform/resolvers - Integrare validatori
- Zod 4.2.1 - Validare scheme de date

### UI & Animations
- Framer Motion 12 - Animații și tranziții
- Lucide React - Iconuri SVG

### Integrations
- @react-google-maps/api - Integrare Google Maps
- Sharp - Optimizare imagini server-side

### Development Tools
- ESLint 9 + eslint-config-next - Linting
- PostCSS - Procesare CSS

### Project Architecture
- App Router (Next.js 16) cu rute dinamice ([locale], [slug])
- Routing bazat pe locale pentru multilingvism
- Componente organizate în components/ (common, layout, sections, ui, seo)
- Conținut Markdown pentru pagini legale (content/legal/)

---

## Project: NUESTRA (Streetwear & Sports Equipment E-commerce + Fan Pages)

### Description
- Secțiune Streetwear cu vânzări de produse STREET
- Secțiune cu echipamente sportive NUESTRA branded
- Opțiune pentru cluburi sportive și sportivi cunoscuți să-și deschidă fanpage și să-l gestioneze

### Framework & Runtime
- Next.js 16.1.1 - Framework React pentru aplicații web cu SSR și routing
- React 19.2.3 - Bibliotecă pentru construirea interfețelor utilizator
- React DOM 19.2.3 - Pachet pentru randarea React în browser

### Language
- TypeScript 5.9.3 - JavaScript cu tipare statice, configurat în mod strict

### Styling
- Tailwind CSS 4 - Framework CSS utility-first
- PostCSS - Procesare CSS

### Linting & Code Quality
- ESLint 9 - Linter pentru identificarea problemelor de cod
- eslint-config-next - Configurație ESLint specifică pentru Next.js

### Project Structure
- App Router (Next.js 13+)
- Rute dinamice ([id])
- Layout-uri nested (layout.tsx)
- Organizare pe secțiuni (sport/, shop/, product/)

---

## Project: Oradea Experience (Website - Frontend Only)

### Note
**IMPORTANT**: Am făcut doar frontend-ul. Express, Node.js, etc. nu au ținut de mine.

### Frontend (Client)

#### Framework
- Next.js 15.5 cu React 19

#### Styling
- Tailwind CSS 4

#### UI Components
- Lucide React
- React Icons
- class-variance-authority

#### Charts
- Chart.js cu react-chartjs-2

#### Maps
- Google Maps (@vis.gl/react-google-maps)

#### Other
- QR Scanner
- canvas-confetti
- i18n-iso-countries

### Backend (Server) - NOT MY WORK

#### Runtime
- Node.js (ES Modules)

#### Framework
- Express.js 5

#### Database
- MongoDB cu Mongoose 8

#### Authentication
- Passport.js (local, Google OAuth, Apple Sign-in)

#### Email
- Mailgun

#### Payments
- Stripe

#### AI/ML
- OpenAI
- Google Cloud Vision (moderare imagini)

#### Image Processing
- Sharp
- Canvas
- HEIC convert

#### Security
- bcrypt
- express-rate-limit
- express-session

#### Logging
- Winston

#### QR Code
- styled-qr-code-node

### Infrastructure
- Control versiuni: Git
- Sesiuni: MongoDB (connect-mongo)
- Variabile de mediu: dotenv

### Description
Aplicație full-stack modernă pentru experiențe locale în Oradea, cu funcționalități pentru business-uri, evenimente, forumuri, recompense, giveaway-uri, și un sistem de achievements/badges.

---

## Project: Oradea Experience (Mobile App)

### Main Framework
- React Native (v0.81.5) - framework pentru dezvoltare mobilă cross-platform
- Expo (v54) - platformă pentru dezvoltare și build React Native
- React (v19.1.0) - biblioteca UI de bază

### Navigation
- React Navigation v7 - pentru navigarea în aplicație
  - @react-navigation/native
  - @react-navigation/stack
  - @react-navigation/bottom-tabs

### Authentication
- Google Sign-In (@react-native-google-signin/google-signin)
- Apple Authentication (expo-apple-authentication)
- reCAPTCHA (react-native-recaptcha-that-works)

### Native Features
- expo-camera - acces la cameră
- expo-location - servicii de localizare
- expo-image-picker - selectare imagini
- react-native-maps - integrare hărți
- expo-video - redare video

### UI/UX
- expo-image - imagine optimizată
- expo-blur - efecte blur
- expo-linear-gradient - gradiente
- react-native-svg - grafică vectorială
- react-native-reanimated - animații fluide
- react-native-gesture-handler - gesturi touch
- react-native-confetti-cannon - efecte de confetti

### Storage & Utilities
- AsyncStorage - stocare locală persistentă
- expo-web-browser - deschidere browser
- expo-linking - deep linking
- expo-in-app-updates / expo-updates - actualizări OTA

### Build & Deployment
- EAS (Expo Application Services) - pentru build-uri de producție pe Android și iOS
- Suport nativ pentru Android (Kotlin) și iOS

### Description
Aplicație tipică React Native/Expo modernă cu funcționalități complete pentru o experiență de tip city/tourism app, incluzând hărți, localizare, autentificare socială și media.

---

## Project: Radical Football (Football Conferences Website)

### Framework & Language
- Next.js 16 - framework React cu Turbopack pentru development
- React 19 - cea mai recentă versiune
- TypeScript 5 - pentru type safety

### Styling
- Tailwind CSS 4 - utility-first CSS framework
- clsx și tailwind-merge - pentru gestionarea claselor CSS

### Backend & Database
- Supabase - Backend-as-a-Service (autentificare, bază de date PostgreSQL)
- @supabase/supabase-js și @supabase/ssr pentru integrare SSR

### Payments
- Stripe - pentru procesarea plăților (stripe + @stripe/stripe-js)

### UI Components
- Radix UI - componente accesibile și headless (dialog, dropdown-menu, tabs, avatar)
- Lucide React - iconițe

### Maps & Canvas
- Google Maps (@react-google-maps/api) - pentru hărți interactive
- Konva + react-konva - pentru grafică canvas 2D

### Security & Rate Limiting
- Upstash Redis - pentru rate limiting (@upstash/ratelimit, @upstash/redis)
- reCAPTCHA v3 - protecție anti-spam
- isomorphic-dompurify - sanitizare HTML
- validator - validare input

### Other Dependencies
- Sharp - procesare imagini
- babel-plugin-react-compiler - React Compiler pentru optimizări automate

### Development Tools
- ESLint - linting
- PostCSS - procesare CSS

### Description
Stack modern, orientat spre performanță, cu Next.js 16 și React 19 la bază, Supabase pentru backend, și Stripe pentru plăți.

---

## Project: TermeneAuto (Native Mobile App - In Construction)

### Description
Aplicație mobile-first B2B SaaS pentru companii de transport, care urmărește termenele de expirare pentru vehicule, șoferi și documente ale companiei.

### Frontend (Mobile App)

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Framework UI pentru mobile |
| Expo | ^54.0.30 | Framework React Native |
| Expo Router | ~6.0.21 | Navigație bazată pe fișiere |
| TypeScript | ~5.9.2 | Type safety |
| Zustand | ^5.0.5 | State management client |
| React Query (TanStack) | ^5.80.7 | Server state management |
| i18next + react-i18next | ^25.2.1 / ^15.5.2 | Internaționalizare (12 limbi) |
| React Hook Form | ^7.56.4 | Gestionare formulare |
| Zod | ^3.25.30 | Validare schema |
| date-fns | ^4.1.0 | Manipulare date |
| React Native Reanimated | ~4.1.1 | Animații |

### Backend (Supabase)

| Service | Purpose |
|---------|---------|
| PostgreSQL | Bază de date primară |
| Supabase Auth | Autentificare și autorizare |
| Row Level Security (RLS) | Izolarea datelor multi-tenant |
| Supabase Storage | Stocare fișiere/atașamente |
| Edge Functions | Jobs de fundal, notificări |
| Realtime | Actualizări live |
| pg_cron | Jobs programate |

### External Services (Planned)

| Service | Purpose |
|---------|---------|
| Expo Push | Notificări push |
| Resend | Emailuri tranzacționale |
| Sentry | Urmărire erori |

### Other Notable Dependencies
- expo-secure-store - Stocare securizată
- expo-image / expo-image-picker - Imagini
- expo-notifications - Notificări
- expo-localization - Detectare limbă dispozitiv
- @expo/vector-icons - Iconuri

---

## Technologies Summary for Portfolio

### Most Used Technologies Across Projects

#### Frameworks
- Next.js (16.x) - Most used web framework
- React (19.x) - UI library
- React Native (0.81.x) - Mobile framework
- Expo (54.x) - React Native platform

#### Languages
- TypeScript (5.x) - Primary language
- JavaScript - Secondary

#### Styling
- Tailwind CSS (4.x) - Primary CSS framework
- PostCSS - CSS processing

#### Backend
- Supabase - Primary BaaS (PostgreSQL, Auth, Storage)
- Node.js + Express - For Oradea Experience

#### State Management
- Zustand - Client state
- TanStack React Query - Server state

#### Forms & Validation
- React Hook Form
- Zod

#### Payments
- Stripe

#### Maps
- Google Maps (@react-google-maps/api, react-native-maps)

#### Internationalization
- next-intl
- i18next / i18n-js

#### Security
- reCAPTCHA v3
- Upstash Redis (rate limiting)

#### Image Processing
- Sharp

#### Icons
- Lucide React
- Expo Vector Icons

#### Development
- ESLint
- Prettier
- Git
