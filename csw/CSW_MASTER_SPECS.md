# VitalMatrix Content Studio Web — Master Specifications
## Version 6.0 | 2 June 2026

> RETROSPECTIVE SPECIFICATION: Components built under rapid prototyping (1-2 June 2026).
> Spec documentation follows component implementation. W06 TYPE 3 specs pending.

### Purpose
Content production toolkit for VitalMatrix practitioner recruitment and engagement.
Deployed on Replit. Feeds W02 (Website Content Production) and W09 (Brand and Design).

### Target Outcome
10 founding practitioners paying and active. GBP 99/month (all practitioners, no IFM discount), fixed 24 months.

---

## Component Register (66 Components)

### Tier 1: Foundation (adapted from HHW, 18 March 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C1 | Citation and Evidence Engine | PubMed API search, Vancouver formatting, evidence tier assignment | BUILT |
| C2 | PDF Branding Engine | Cover pages, TOC, headers/footers, 5 PDF templates | BUILT |
| C3 | JSON-LD Schema Markup | MedicalWebPage structured data for SEO | BUILT |
| C4 | SEO Metadata for Blog | Meta titles, descriptions, keyword tracking, readability, SEO score 0-100 | BUILT |
| C5 | Email-to-Blog Content Expansion | Short note → full blog post (2x/3-4x/5-6x), 3 templates, reverse condensing | BUILT |
| C7 | Compliance Scanner | 22 rules: kill list (K7/K8/K10), credentials, deprecated terms, MHRA/ASA/GDPR | BUILT |

### Tier 2: Extremely High-Yield (founding cohort recruitment)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C16 | Blog Assembly Pipeline | Chains C5→C4→C7→C3. Input: note. Output: publish-ready blog | BUILT |
| C17 | Practitioner Outreach Kit | 5-document recruitment pack per practitioner | BUILT |
| C18 | Evidence Library Builder | Pre-built citation bank per node (7) and zone (5) | BUILT |
| C19 | Visual Content Generator | HTML snippets: zone diagrams, pipeline flows, pricing tables, feature cards | BUILT |
| C20 | Content Repurposing Engine | One content → 4 formats: blog + email + LinkedIn + PDF | BUILT |
| C21 | Landing Page Generator | Segment-specific HTML landing pages (5 segments) | BUILT |
| C22 | Clinical Newsletter Builder | Monthly practitioner digest with PubMed mapping | BUILT |
| C23 | Discovery Call Prep Engine | Personalised meeting briefings with speciality→zone mapping | BUILT |
| C24 | Content Freshness Auditor | Staleness, compliance drift, outdated pricing detection | BUILT |
| C25 | Practitioner Onboarding Sequence | 6-stage drip content: Day 1 → Month 3 | BUILT |

### Tier 3: Force Multipliers (system-level productivity)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C26 | Content Command Centre | Dashboard: all content status, compliance/SEO scores, stale alerts | BUILT |
| C27 | Practitioner CRM | Lead tracking, 7-stage pipeline, touchpoints, overdue follow-ups, conversion rates | BUILT |
| C28 | A/B Copy Variant Generator | 3 variants per headline/CTA/subject with 6 psychological hooks, compliance-checked | BUILT |
| C29 | Content Calendar Engine | 90-day auto-scheduler with Z1-Z5 zone rotation, weekly content mix | BUILT |
| C30 | Practitioner Persona Engine | 8 deep persona profiles with personalised messaging for 6 message types | BUILT |
| C31 | ROI Calculator Widget | Interactive HTML widget: patients/month → time saved, cost/patient, payback period | BUILT |
| C32 | Competitive Positioning Engine | K10-compliant differentiation, IFM amplification framing, FAQ format | BUILT |
| C33 | Webinar Content Pack | Full event pack: 10-12 slides, speaker notes, handout, 3-email follow-up | BUILT |
| C34 | Social Proof Aggregator | Testimonials, cohort milestones ("3 of 10 spots filled"), branded HTML blocks | BUILT |
| C35 | Content Performance Scorer | 5-dimension scoring (SEO/compliance/freshness/audience/conversion), A-F grading | BUILT |

---

## Architecture Rules (enforced in all components)

- Platform descriptor: "clinical intelligence platform" ONLY
- Credentials: MBBS, FAAMFM (never MD, never FMAARM)
- Audience: PRACTITIONER (never patient-facing)
- Evidence tiers on every clinical claim
- "For practitioner use only" on all clinical outputs
- Kill list (K7, K8, K10) checked before any output
- VitalMatrix design system: Prussian Blue #0D2B4E, Gold #C9A84C, Teal #1A7A8A
- Fonts: Cormorant Garamond (headings), Outfit (body), DM Mono (data)
- TM on first use of all 30 mnemonics per document
- ICO ZC101813 in all footers
- British English throughout, no em dashes

## Shared Configuration

- `brand-config.ts` — single source of truth for all brand constants
- Used by every component
- Changes propagate automatically

## Dependencies

### Tier 1 (standalone)
- C1-C5, C7: depend on brand-config only

### Tier 2
- C16 depends on: C3, C4, C5, C7
- C17 depends on: brand-config
- C18 depends on: C1
- C19 depends on: brand-config
- C20 depends on: C4
- C21 depends on: C3, C19
- C22 depends on: brand-config
- C23 depends on: brand-config
- C24 depends on: C7
- C25 depends on: brand-config

### Tier 3
- C26 depends on: brand-config (standalone tracking)
- C27 depends on: brand-config (standalone CRM)
- C28 depends on: brand-config (compliance checks inline)
- C29 depends on: brand-config (zone rotation)
- C30 depends on: brand-config (persona data)
- C31 depends on: brand-config (VM design system)
- C32 depends on: brand-config (K10 compliance)
- C33 depends on: brand-config (VM branding)
- C34 depends on: brand-config (VM styled HTML)
- C35 depends on: C7 (compliance scoring)

## Deployment

- **Replit:** Clone from GitHub (Sfaisal1975/Vitalmatrix-content-studio-web)
- **Local:** `csw` (cd) or `ccsw` (cd + Claude Code)
- **GitHub:** Private repo, Sfaisal1975 account

## Stats

### Tier 4: Revenue Accelerators (built 2 June 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C36 | Intake-to-Content Bridge | INTAKE questions → educational blog posts explaining WHY each question matters | BUILT |
| C37 | Practitioner Success Tracker | Usage milestones, celebration emails, retention nudges, cohort progress | BUILT |
| C38 | Referral Programme Engine | Referral codes, invite emails, 3-email drip, landing page snippets | BUILT |
| C39 | Pricing Objection Handler | 10 objections, 5 categories, 4 segment variants each, sales playbook | BUILT |
| C40 | A/B Test Tracker | Tracks variant winners, builds learning database, suggests best hooks | BUILT |
| C41 | Multi-Language Adapter | 7 locales, currency/date/regulatory adaptation, translator briefs | BUILT |
| C42 | Video Script Generator | 5 video types, timed segments, visual cues, teleprompter text, shot lists | BUILT |
| C43 | Event Calendar Publisher | Event management, ICS generation, HTML calendar, reminder emails | BUILT |
| C44 | Practitioner FAQ Knowledge Base | 30 pre-built FAQs, search, categories, HTML page, JSON-LD FAQPage SEO | BUILT |
| C45 | Content Metrics Dashboard | Executive dashboard: content + CRM + calendar + cohort + performance | BUILT |

---

## Stats

### Tier 5: Social Media, Marketing & Advertising (built 2 June 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C46 | Social Media Manager | Multi-platform posting (LinkedIn, Facebook, Instagram, X), cross-posting, calendar | BUILT |
| C47 | Ad Campaign Manager | Google Ads, Meta Ads, LinkedIn Ads — campaign planning, compliant ad copy, budget | BUILT |
| C48 | Marketing Automation | Email sequences (5 pre-built), marketing funnel (6 stages), drip campaigns | BUILT |
| C49 | Social Content Factory | Clinical insights → platform-specific content packs (all 4 platforms) | BUILT |
| C50 | Analytics Tracker | Content + campaign metrics, ROI, funnel analysis, weekly digest | BUILT |
| C51 | Facebook Page Manager | Facebook posts, events, polls, link shares, weekly plan, page insights | BUILT |
| C52 | Instagram Content Manager | Feed posts, carousels (4 pre-built), reels scripts, stories, hashtag sets | BUILT |
| C53 | X/Twitter Manager | Tweets, threads (4 pre-built), daily schedule, bio, pinned tweet | BUILT |
| C54 | LinkedIn Content Manager | Posts, articles, document posts, polls, company page, thought leadership | BUILT |
| C55 | Marketing Dashboard | Unified dashboard: all channels, cohort progress, budget recommendations | BUILT |

---

## Stats

### Tier 6: Social Media Master Hub (built 2 June 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C56 | Meme/Visual Generator | 15 templates, 8 formats, platform-specific dimensions | BUILT |
| C57 | Hook Library | 100 pre-built hooks, 10 types, A/B variants | BUILT |
| C58 | Ad Content Pipeline | Sources from nodes/zones/pain points → ad formats | BUILT |
| C59 | Quiz Engine | 3 pre-built quizzes, HTML generation, email capture, social sharing | BUILT |
| C60 | Lead Magnet Factory | 6 downloadable resources, email gate, landing pages | BUILT |
| C61 | Nurture Sequence Engine | 5 pre-built sequences, branching logic, contact timeline | BUILT |
| C62 | Ad Creative Manager | A/B/C testing, performance tracking, winner determination | BUILT |
| C63 | Posting Scheduler | Optimal times per platform, auto-schedule, pattern analysis | BUILT |
| C64 | Conversion Funnel Tracker | 14-stage funnel, bottleneck detection, visualisation | BUILT |
| C65 | Social Media Command Hub | Master dashboard, daily brief, cohort progress X/10 | BUILT |
| C66 | Audience Targeting | England-only, FM-only, 12 FB groups, 6 professions, 3 ad platforms | BUILT |
| C67 | Facebook Group Playbook | Weekly engagement plan, comment templates, DM templates, DO NOTs | BUILT |
| C68 | Social Proof Screenshot Generator | 6 screenshot types, before/after cards, feature showcases | BUILT |
| C69 | Retargeting Content Engine | 8 trigger types, personalised retargeting, dynamic ads | BUILT |
| C70 | Competitor Intelligence | K10-compliant gap analysis, 10 pre-built market gaps | BUILT |
| C71 | UGC Amplifier | Capture, consent, 4-platform amplification, guidelines | BUILT |
| C72 | Seasonal Content Calendar | 16 topics (4/season), zone-mapped, year-round plan | BUILT |
| C73 | Influencer Outreach | FM influencer pipeline, 7 collaboration types, gifting strategy | BUILT |
| C74 | Hashtag Strategy Engine | Platform-optimised sets, rotation, banned hashtags, performance | BUILT |
| C75 | Content Repurposing Matrix | 1 source → 16 asset formats, publishing schedule | BUILT |
| C76 | Engagement Response Templates | 50 templates, 9 categories, auto-categorisation, playbook | BUILT |

---

## Audience Targeting (C66 — Single Source of Truth)

- **Geography:** England ONLY (9 regions)
- **Excluded:** Scotland, Wales, Northern Ireland, Republic of Ireland, USA, Canada, Australia, New Zealand, Germany, France, Spain, Italy, Netherlands
- **Professions:** All must be practising functional medicine approach
- **Facebook Groups:** 12 FM-specific groups
- **Ad Platforms:** Google Ads, Meta Ads, LinkedIn Ads — all England + FM filtered

## Stats

- **Components:** 66
- **Files:** 70 (66 components + index.ts + brand-config.ts + test + sync script)
- **Lines:** ~35,000
- **Commits:** 14

---
VitalMatrix Ltd | ICO ZC101813 | For practitioner use only | 2026
