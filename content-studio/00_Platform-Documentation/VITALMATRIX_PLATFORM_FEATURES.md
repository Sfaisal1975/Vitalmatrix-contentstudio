# VitalMatrix — Complete Platform Features & Specifications
**Date:** 2026-06-28  
**Maintained by:** Replit Agent (on behalf of Dr Shahzad Faisal MBBS, FAAMFM)  
**Status:** Current — load this file for full platform context

---

## 1. Website — All 30 Pages

All pages live at `artifacts/vitalmatrix/public/` as `*_latest.html` files, served statically by the Vite frontend.

| # | Page Name | File | Purpose |
|---|-----------|------|---------|
| 1 | Homepage | `Homepage_latest.html` | Primary landing — NCZ™ platform intro |
| 2 | How It Works | `HowItWorks_latest.html` | Platform workflow explanation |
| 3 | About | `About_latest.html` | Dr Faisal bio + VitalMatrix origin story |
| 4 | Why VitalMatrix | `WhyVitalMatrix_latest.html` | Problem/solution positioning |
| 5 | Founding Practitioners | `FoundingPractitioners_latest.html` | Founding cohort offer details |
| 6 | Pricing | `Pricing_latest.html` | Founding price tiers |
| 7 | Blog | `blog_latest.html` | Clinical content hub |
| 8 | Book Walkthrough | `BookWalkthrough_latest.html` | Calendly embed — product walkthrough |
| 9 | Book Discovery Call | `BookDiscoveryCall_latest.html` | Calendly embed — discovery call |
| 10 | Contact | `Contact_latest.html` | Enquiry form + contact details |
| 11 | FAQ | `FAQ_latest.html` | Practitioner FAQs |
| 12 | Privacy | `Privacy_latest.html` | Privacy policy (GDPR) |
| 13 | Cookie Policy | `CookiePolicy_latest.html` | Cookie consent policy |
| 14 | Trust & Safety | `TrustSafety_latest.html` | Data security + compliance |
| 15 | Clinical Ethics | `ClinicalEthics_latest.html` | Ethical framework for the platform |
| 16 | Mission | `Mission_latest.html` | Vision and mission statement |
| 17 | Our Approach | `OurApproach_latest.html` | Clinical methodology |
| 18 | Platform Demo | `PlatformDemo_latest.html` | Interactive demo |
| 19 | Practitioner Overview | `PractitionerOverview_latest.html` | Who the platform is for |
| 20 | NCZ Architecture | `NCZArchitecture_latest.html` | 7-node × 5-zone technical architecture |
| 21 | Living Architectures | `LivingArchitectures_latest.html` | Terrain systems deep-dive |
| 22 | Terrain Intelligence | `TerrainIntelligence_latest.html` | TIE (Terrain Intelligence Engine) |
| 23 | Terrain Signals | `TerrainSignals_latest.html` | Signal detection and mapping |
| 24 | Cascade Atlas | `CascadeAtlas_latest.html` | Cascade mapping system |
| 25 | ORBIT | `ORBIT_latest.html` | ORBIT framework |
| 26 | SPHERE | `SPHERE_latest.html` | SPHERE framework |
| 27 | Investor Overview | `InvestorOverview_latest.html` | Investor-facing deck |
| 28 | Lead Gen Landing | `LeadGenLandingPage_latest.html` | Lead capture page |
| 29 | Patient Report | `patient-report_latest.html` | Patient-facing terrain report |
| 30 | Results | `results_latest.html` | Outcomes and results overview |

---

## 2. SEO Features (Applied Across All 30 Pages)

### Per-Page SEO Tags
Every `*_latest.html` page includes:

- **`<title>`** — unique, keyword-rich title per page
- **`<meta name="description">`** — 120–160 character description per page
- **`<meta name="keywords">`** — functional medicine and terrain intelligence keywords
- **`<link rel="canonical">`** — canonical URL pointing to `https://vitalmatrix.co.uk/` (28 of 30 pages)

### Open Graph (Social Sharing)
25 of 30 pages include full Open Graph tags:
- `og:title` — matches page title
- `og:description` — social-optimised description
- `og:url` — canonical page URL
- `og:type` — `website`
- `og:image` — brand image (where applicable)

### Site-Level SEO Files

| File | Location | Purpose |
|------|----------|---------|
| `sitemap.xml` | `artifacts/vitalmatrix/public/sitemap.xml` | Submitted to search engines; lists all 30 pages with `<lastmod>` |
| `robots.txt` | `artifacts/vitalmatrix/public/robots.txt` | Allows all crawlers; points to sitemap |

### Analytics
- **Google Analytics 4:** Tracking ID `G-TRM1JTE0PB` — embedded on all pages
- Events tracked: page views, chatbot interactions, enquiry form submissions, CTA clicks

### SEO Keyword Clusters (from `09_SEO-Research/`)
Primary targets:
- "functional medicine platform UK"
- "terrain intelligence platform"
- "NCZ framework functional medicine"
- "IFM terrain matrix tool"
- "clinical terrain intelligence"
- "Dr Shahzad Faisal VitalMatrix"

---

## 3. Automated Systems

### 3a. Chatbot Widget (LIVE)
- **File:** `artifacts/vitalmatrix/public/vm-chatbot.js` (vanilla JS, ~3,000 lines)
- **Embedded on:** all 30 pages
- **Features:**
  - AI-assisted enquiry capture
  - Session persistence (session ID stored locally)
  - Privacy toggle — patient data never stored without consent
  - Unread message badge
  - Mobile-responsive floating widget
  - Rate-limited API calls to prevent abuse
- **DB tables:** `conversations`, `messages`
- **API endpoints:** `POST /api/chat/session`, `POST /api/chat/message`, `GET /api/chat/session/:id`

### 3b. Enquiry Form (LIVE)
- **Trigger:** `POST /api/enquiry`
- **On submission:**
  1. Saves to `enquiries` DB table
  2. Sends confirmation email to enquirer (branded HTML template)
  3. Sends notification to `hello@vitalmatrix.co.uk` (Dr Faisal)
  4. Automatically enqueues 4-email nurture sequence
- **Enquiry data captured:** name, email, role, practice type, message, source page, timestamp

### 3c. Nurture Email Sequence (LIVE)
- **Schedule:** Day 2, Day 4, Day 6, Day 8 post-enquiry
- **Processor:** `artifacts/api-server/src/lib/nurtureSequence.ts`
- **Runs:** every 15 minutes via node-cron
- **DB table:** `nurture_queue`
- **Email from:** `Dr Shahzad Faisal | VitalMatrix <hello@vitalmatrix.co.uk>`
- **Template:** Dark navy (`#0D2B4E`) with gold (`#C9A84C`) accent — see `06_Brand-Assets/Email-Style-Guide.md`
- **Email provider:** Resend (`RESEND_API_KEY`)
- **Content reference:** `34_Launch-Sequence/Nurture-Emails-Week1-Week4.md`

### 3d. Social Media Scheduler (LIVE — awaiting credentials)
- **Platforms:** LinkedIn, Facebook, Instagram, X (Twitter)
- **Scheduler:** `artifacts/api-server/src/lib/socialScheduler.ts`
- **Runs:** every 10 minutes via node-cron
- **DB table:** `social_queue`
- **Admin endpoints:**
  - `POST /api/social/schedule` — queue a post
  - `GET /api/social/queue` — view pending posts
  - `DELETE /api/social/queue/:id` — remove a queued post
  - `GET /api/social/history` — view sent posts
- **Retry logic:** Exponential backoff; terminal errors (invalid token, missing image) do not retry
- **BLOCKED:** Needs social platform credentials added as Replit secrets
- **Reference:** `03_Marketing-Assets/Social-Automation-Setup.md`

### 3e. Weekly Digest (LIVE)
- **Schedule:** Every Monday at 09:00 UK time
- **File:** `artifacts/api-server/src/lib/weeklyDigest.ts`
- **Contents:** Enquiry count, chat session stats, nurture queue status, social queue status
- **Sent to:** `hello@vitalmatrix.co.uk`

### 3f. Chat Session Cleanup (LIVE)
- **Function:** Deletes chat sessions older than configurable threshold
- **DB table:** `maintenance_log` (every cleanup run is recorded)
- **Admin endpoint:** `GET /api/chat/stats` — view cleanup history

### 3g. Rate Limiter
- **File:** `artifacts/api-server/src/lib/rate-limiter.ts`
- **Applied to:** All public-facing API endpoints
- **Protects:** `/api/chat/*`, `/api/enquiry`

---

## 4. Admin Panel

Accessible at `/admin` (auth-gated via `ADMIN_API_KEY`).

### Admin Tabs

| Tab | Features |
|-----|---------|
| **Enquiries** | Full enquiry list; filter by date range, source page; date preset filter with sessionStorage persistence; saved named views (localStorage); download CSV |
| **Chat Sessions** | All sessions; filter by message count (High volume >10, Very active >25); search by session ID or date; full session ID in CSV export; download CSV |
| **Content Studio** | 4 sub-tabs: Brand Guide, Launch Sequence, Evidence Register, File Browser |
| **Social Scheduler** | Queue posts; view pending/sent history |
| **Status** | System health; maintenance log; cleanup history |

### Admin API (all require `x-admin-key` header or `Authorization: Basic admin:<ADMIN_API_KEY>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enquiry` | List all enquiries |
| GET | `/api/chat/sessions` | List all chat sessions |
| GET | `/api/chat/stats` | System stats + maintenance log |
| GET | `/api/social/queue` | Pending social posts |
| GET | `/api/social/history` | Sent social posts |
| GET | `/admin/cs-files/sections` | List all 39 content sections |
| GET | `/admin/cs-files/sections/:id/files` | Files in a section |
| GET | `/admin/cs-files/file?path=...` | Read a content file |
| PUT | `/admin/cs-files/file` | Save edits to a content file |
| GET | `/admin/cs-files/master-spec` | Current master spec |
| GET | `/admin/cs-files/search?q=...` | Full-text search across all .md files |

---

## 5. Content Studio

### Overview
The Content Studio is VitalMatrix's operational knowledge base — a 39-section library of markdown files covering brand, clinical evidence, marketing, IP, launch sequences, and operational playbooks.

**Master Spec:** `ContentStudio_MasterSpecs_v2.2_2026-06-02.md`

### 39 Sections

| # | Section | Status |
|---|---------|--------|
| 01 | Research Library | Exists |
| 02 | Core Content | **ACTIVE** — Blog-Post-Content-Bank |
| 03 | Marketing Assets | **ACTIVE** — Social calendar, automation setup |
| 04 | Website Content | Exists |
| 05 | Repurposing Matrix | Exists |
| 06 | Brand Assets | **ACTIVE** — Messaging Framework, Email Hooks, Voice & Tone, Email Style Guide |
| 07 | Social Proof | Exists |
| 08 | Competitive Intelligence | Exists |
| 09 | SEO Research | Exists |
| 10 | Analytics Data | Exists |
| 11 | Demo Call Materials | **ACTIVE** — Pre-Call, Script, Post-Call |
| 12 | Multimedia Library | Exists |
| 13 | Intellectual Property | **ACTIVE** — NCZ Framework, IP Register, Lead Magnets |
| 14 | Relationship Capital | Exists |
| 15 | Business Intelligence | Exists |
| 16 | Legacy Archive | Exists |
| 17 | Innovation Lab | Exists |
| 18 | Regulatory Compliance | Exists — MHRA critical |
| 19 | Content Pipeline | **ACTIVE** — Phase 1 Practitioner Acquisition Playbook |
| 20 | Practitioner Onboarding | **ACTIVE** — Welcome, Orientation, Walkthrough, Check-In |
| 21 | Evidence Register | **ACTIVE** — 12 registered clinical claims, Evidence Tier Framework |
| 22 | Practitioner Communications | Exists |
| 23 | SA Ruling Library | Exists |
| 24 | Content DeltaScan | Exists — Versioning protocol |
| 25 | (gap) | — |
| 26 | Window Sync Protocol | Exists — Notion sync registry |
| 27 | Cohort Personalisation | Exists |
| 28 | Content ROI Tracker | Exists |
| 29 | Crisis Content Playbook | Exists — MHRA reclassification playbook |
| 30 | Localisation Framework | Exists |
| 31 | Proof of Value Engine | Exists |
| 32 | Referral Content Machine | Exists |
| 33 | Conference Content Kit | Exists |
| 34 | Launch Sequence | **ACTIVE** — Founding Narrative, Launch Emails, Nurture W1–W12, Pain-Point Emails |
| 35 | Screenshot Library | Exists |
| 36 | Dr Faisal Personal Brand | **ACTIVE** — Bio Library, LinkedIn Profile Copy, Thought Leadership |
| 37 | Learning Loop Architecture | Exists |
| 38 | Learning Channels | Exists |
| 39 | Evolution Reports | Exists |

### Standalone Content Studio App
- **URL:** `/content-studio`
- **Auth:** Admin key stored in `localStorage` key `vm_cs_key`
- **Built with:** React + Vite (`artifacts/content-studio/`)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Grid of all 39 sections; global full-text search |
| Section | `/sections/:id` | File list for a section; click to open |
| File Viewer | `/file?path=...` | Read markdown + inline edit with save |
| Brand Guide | `/brand` | Voice & Tone, Messaging Framework, Email Hooks, Email Style Guide |
| Evidence Register | `/evidence` | Claims Register as searchable table with tier colour coding |
| Launch Sequence | `/launch` | Founding Narrative + Launch Email Sequence |
| Master Spec | `/master-spec` | Current master specification |

### Admin ContentStudioTab (inside `/admin`)
4 sub-tabs added in v2.2:
- **Brand Guide** — Voice & Tone, Messaging Framework, Email Hooks Library, Email Style Guide (tab switcher)
- **Launch Sequence** — Founding Narrative, Launch Email Sequence (tab switcher)
- **Evidence Register** — Claims Register searchable table; evidence tier colour coding (Tier 1 = green, Tier 2 = gold, Tier 3 = teal)
- **File Browser** — Browse all 39 sections; click section → file list; click file → read content inline

### Content Studio API Routes
All under `/api/admin/cs-files/` — require `Authorization: Basic admin:<ADMIN_API_KEY>`.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/sections` | List all 39 sections with file counts and populated status |
| GET | `/sections/:id/files` | All .md files in a section |
| GET | `/file?path=...` | Raw content of a specific file |
| PUT | `/file` | Save edited content (body: `{path, content}`) |
| GET | `/master-spec` | Current master spec |
| GET | `/search?q=...` | Full-text search across all .md files |

### GitHub Sync
All content studio files are synced to:
- **Repo:** `https://github.com/Sfaisal1975/Vitalmatrix-contentstudio`
- **97 files pushed** as of 2026-06-03
- **Sync method:** GitHub API via `GITHUB_TOKEN`

---

## 6. Database Schema

| Table | Purpose |
|-------|---------|
| `conversations` | Chatbot session records |
| `messages` | Individual chat messages |
| `enquiries` | Practitioner enquiry form submissions |
| `nurture_queue` | Scheduled nurture emails (Day 2/4/6/8) |
| `social_queue` | Queued social media posts |
| `maintenance_log` | Chat cleanup audit log |
| `app_settings` | Key-value config store |

**DB push:** `cd lib/db && pnpm run push`

---

## 7. Required Secrets

| Secret | Purpose | Status |
|--------|---------|--------|
| `DATABASE_URL` | PostgreSQL connection | ✅ Set |
| `RESEND_API_KEY` | All outbound email | ✅ Set |
| `ADMIN_API_KEY` | Admin endpoint auth | ✅ Set |
| `GITHUB_TOKEN` | GitHub sync PAT | ✅ Set |
| `LINKEDIN_ACCESS_TOKEN` | LinkedIn posting | ⏳ Pending |
| `LINKEDIN_PERSON_URN` | LinkedIn author URN | ⏳ Pending |
| `META_ACCESS_TOKEN` | Facebook + Instagram | ⏳ Pending |
| `FACEBOOK_PAGE_ID` | Facebook page ID | ⏳ Pending |
| `INSTAGRAM_ACCOUNT_ID` | Instagram account ID | ⏳ Pending |
| `X_API_KEY` | X (Twitter) key | ⏳ Pending |
| `X_API_SECRET` | X secret | ⏳ Pending |
| `X_ACCESS_TOKEN` | X access token | ⏳ Pending |
| `X_ACCESS_TOKEN_SECRET` | X access token secret | ⏳ Pending |

---

## 8. Brand Colours (Canonical)

| Name | Hex | Usage |
|------|-----|-------|
| Deep Navy | `#0D2B4E` | Email background, primary dark |
| Gold | `#C9A84C` | Accent, CTAs, brand mark |
| Teal | `#4ECDC4` | Secondary accent, highlights |
| Off-White | `#F4F4F2` | Body text on dark backgrounds |

---

## 9. Clinical & Regulatory Rules

1. **No outcome guarantees** — never "will cure", "eliminates", "reverses"
2. **All clinical claims must be registered** — check `21_Evidence-Register/Claims-Register.md` before any public-facing content
3. **Standard disclaimer (mandatory):** *"VitalMatrix™ outputs are terrain support considerations only — not diagnoses."*
4. **NCZ™ is a registered trademark** — always use ™. Never describe as "AI diagnosis tool"
5. **Platform descriptor** — sole authorised form: **"clinical (terrain) intelligence platform"**
6. **Lyceum** — the core clinical tool inside VitalMatrix. Not a medical device, not a diagnostic system

---

## 10. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces |
| Runtime | Node.js 24, TypeScript 5.9 |
| Frontend | React + Vite (`artifacts/vitalmatrix`) |
| API | Express 5 (`artifacts/api-server`) |
| Database | PostgreSQL + Drizzle ORM |
| Email | Resend |
| Scheduling | node-cron |
| Analytics | Google Analytics G-TRM1JTE0PB |
| Chatbot | Vanilla JS widget (`vm-chatbot.js`) |
