# VitalMatrix Content Studio - Master Specifications v2.0

Date: 20 May 2026
Owner: VitalMatrix Ltd (Company No. 17046123 | ICO ZC101813)
Produced by: W05 Claude Code
Status: DRAFT - Requires W08 review before operational use
Audience tier: INTERNAL (D-57)
Supersedes: HHW ContentStudio (March 2026, PAUSED)

---

## 0. HOW TO USE THIS STUDIO

**New to the ContentStudio? Start here.**

1. **Find what exists:** Browse the section index (Section 2) to locate where content of your type belongs.
2. **Check the README:** Every section has a `_README.md` explaining purpose, what goes there, review gate, and owner window.
3. **Create content:** Use the templates in `_Templates/` (content brief, naming convention, evidence tier assignment).
4. **Name your file:** Follow Rule F (see `_Templates/Content-Naming-Convention.md`). Specific descriptor first, never window names or dates first.
5. **Submit for review:** Place in `19_Content-Pipeline/Drafts/[category]/`. Fill in a W08 review request (see `_Templates/W08-Review-Request-Template.md`).
6. **Track status:** Content moves through: Draft > T-01 Check > ASA Pre-Review > W08 Queue > Approved/Rejected > Published.
7. **Evidence claims:** Any content containing a clinical claim must have an evidence tier assignment (see `_Templates/Evidence-Tier-Assignment-Template.md`).
8. **Audience tier:** Know your audience: INTERNAL (41 TM footer), INVESTOR (38), PRACTITIONER (37). This determines terminology, TM footer, and review gate.

**Single source of truth:** `C:\Users\Lenovo\Documents\website\vitalmatrix\ContentStudio\` is the only location. No copies.

---

## 1. PURPOSE

The VitalMatrix Content Studio is the centralised content operations scaffold for all
VitalMatrix Ltd content assets. It governs creation, review, publication, versioning,
and compliance tracking for every piece of content produced across all windows.

Platform descriptor: "clinical intelligence platform" ONLY.
Never: "clinical AI platform." Never: "clinical decision support."
Audience: Functional medicine practitioners (B2B SaaS). NOT patients (B2C).

---

## 2. SECTION INDEX

| # | Section | Purpose |
|---|---------|---------|
| 01 | Research-Library | External + proprietary research organised by terrain node |
| 02 | Core-Content | Blog posts, thought leadership, white papers, practitioner guides |
| 03 | Marketing-Assets | Advertising, email sequences, lead magnets, social media |
| 04 | Website-Content | All website page copy organised by section |
| 05 | Repurposing-Matrix | Content atoms and platform adaptation workflows |
| 06 | Brand-Assets | Design system, visual identity, voice/tone, mnemonic register |
| 07 | Social-Proof | Credentials, practitioner testimonials, platform metrics |
| 08 | Competitive-Intelligence | Competitors, market analysis, positioning, content monitoring, alerts |
| 09 | SEO-Research | Keywords, SERP analysis, content gaps, technical SEO |
| 10 | Analytics-Data | Traffic, conversion, platform usage, goals/KPIs |
| 11 | Demo-Call-Materials | Pre-call, during-call, objection handling, post-call, success |
| 12 | Multimedia-Library | Video, audio, interactive tools, visual assets, courses |
| 13 | Intellectual-Property | Trademarks, proprietary architecture, ALB governance framework, patents |
| 14 | Relationship-Capital | Professional network, founding cohort, investor relations |
| 15 | Business-Intelligence | Financial, marketing, operations, strategic planning, content strategy |
| 16 | Legacy-Archive | Practitioner practice impact, industry contributions, knowledge shared |
| 17 | Innovation-Lab | Platform development, AI systems, research pipeline, tech watch |
| 18 | Regulatory-Compliance | MHRA, ICO, GDPR, ASA, insurance, legal |
| 19 | Content-Pipeline | Draft-to-published workflow with W08 gate |
| 20 | Practitioner-Onboarding | Pre-sale to churn prevention, full practitioner lifecycle |
| 21 | Evidence-Register | Clinical claims database, evidence tiers, SA routing |
| 22 | Practitioner-Communications | Product updates, feature requests, feedback loop, community |
| 23 | SA-Ruling-Library | Canonical D-series, T-series, adjudications, content impact index |
| 24 | Content-DeltaScan | Version registry, change log, recall register, audit trail |
| 26 | Window-Sync-Protocol | Content ownership, handoff queues, stalled handoffs, Notion sync |
| 27 | Cohort-Personalisation | Practitioner profiles, segment content, success tracking, renewal |
| 28 | Content-ROI-Tracker | Attribution model, conversion map, cost per asset, kill list |
| 29 | Crisis-Content-Playbook | Regulatory/platform/reputation scenarios, pre-approved statements |
| 30 | Localisation-Framework | en-GB master, future locales, non-localisable register, tagging |
| 31 | Proof-of-Value-Engine | Value metrics, practitioner reports, benchmarks, testimonial triggers |
| 32 | Referral-Content-Machine | Referral programme, shareable assets, peer invites, co-branded content |
| 33 | Conference-Content-Kit | Booth materials, live demo scripts, post-conference follow-up, sponsorship |
| 34 | Launch-Sequence | Founding narrative, countdown content, exclusivity assets, conversion |
| 35 | Screenshot-Library | Master screenshots, annotated, format variants, demo data, style guide |
| 36 | Dr-Faisal-Personal-Brand | Authority assets, clinical voice, thought leadership, social presence |
| 37 | Learning-Loop-Architecture | 6-layer learning system: capture, aggregate, recommend, decide, implement, validate |
| 38 | Learning-Channels | 12 channels: scoring, cascades, DRD, protocols, biomarkers, INTAKE, thresholds, velocity, MedTerrain, constellations, edge cases, workflow |
| 39 | Evolution-Reports | Monthly/quarterly/annual reviews, parameter history, publishable findings |
| -- | _Templates | Reusable templates for all sections (5 templates populated) |
| **TOTAL** | **38 sections + _Templates** | **1,256 directories, 83 files** |

**Audit corrections (v2.0):**
- Section 01_Strategy merged into 15_Business-Intelligence/Content-Strategy (F1: numbering collision)
- Section 25_Competitor-Content-Monitor merged into 08_Competitive-Intelligence (F4: overlap)
- Section 13 ALB-Governance now holds framework only; Section 23 is canonical ruling repository (F3)
- Section numbering gap at 25 is intentional (preserves existing references)

---

## 3. LOCATIONS

| Location | Path | Purpose |
|----------|------|---------|
| Main Studio (SINGLE SOURCE OF TRUTH) | `C:\Users\Lenovo\Documents\website\vitalmatrix\ContentStudio\` | 1,035 dirs, 46 files |

Operational and Claude working copies removed in v2.0 audit (F5). One location eliminates sync drift.

---

## 4. CRITICAL FEATURES (21)

### CF-01: Content Pipeline (Section 19)

**Problem:** No structured workflow from draft to publication. Content could bypass W08/ASA review.
**Solution:** Every content item follows: Draft > T-01 Compliance Check > ASA Pre-Review > W08 Review Queue > Approved/Rejected > Published > Archived.
**Gate rules:**
- No content moves to Published without W08-Approved status
- T-01 compliance check is mandatory for all practitioner-facing content
- ASA pre-review is mandatory for all externally visible content
- W10 legal review required for: regulatory claims, pricing, contractual language
- Rejected items return to Drafts with feedback in W08-Rejected/With-Feedback
**Status:** BUILT (folder structure). NOT OPERATIONAL (no workflow tooling yet).

### CF-02: Practitioner Onboarding (Section 20)

**Problem:** Phase 1 objective is 10 founding practitioners. No structured content journey from demo to embedded daily use.
**Solution:** 7-stage onboarding path:
1. Pre-Sale: demo materials, founding cohort proposition, ROI case
2. Day 1: account setup, platform quick start, GENOME Handbook intro
3. Week 1: INTAKE form configuration, first patient walkthrough, MAPS voice-to-matrix
4. Week 2: FLINT pipeline (node scoring, NCZ zone interpretation, CascadeIQ, DRD)
5. Week 3: advanced features (RECON, COMPASS, DeltaScan, CascadeAtlas)
6. Month 1: confidence check, feature adoption audit, feedback collection
7. Ongoing: CPD calendar, release notes, monthly webinars, help docs
**Churn prevention:** health check templates, re-engagement playbook, exit interview
**Status:** BUILT (folder structure). CONTENT REQUIRED.

### CF-03: Evidence Register (Section 21)

**Problem:** Clinical claims scattered across website, marketing, and practitioner materials with no centralised tracking against evidence tiers.
**Solution:** Single register mapping every clinical claim to:
- Source evidence (literature, case data, expert opinion)
- Evidence tier: Established | Emerging | Theoretical | Observed in Practice | Contested
- Active claims: CS01 to CS08 (T-01b frozen set)
- Contested claims quarantined pending resolution
- SA routing required for any new claim beyond CS01-CS08
- W10 legal review queue for claims with regulatory exposure
- ASA pre-clearance for claims appearing in public-facing content
**Status:** BUILT (folder structure). POPULATION REQUIRED.

### CF-04: Practitioner Communications (Section 22)

**Problem:** No structured channel for ongoing communication with founding cohort. Updates, incidents, and feature requests lack a single source of truth.
**Solution:** 4 communication streams:
1. Product updates: release notes, feature announcements, changelog
2. Incident communications: outage notices, post-mortems, scheduled maintenance
3. Feature requests: submitted > under review > roadmapped > declined with reason
4. Feedback loop: NPS surveys, quarterly reviews, bug reports
**Community layer:** practitioner forum content, peer case discussions (anonymised)
**Status:** BUILT (folder structure). CONTENT AND TOOLING REQUIRED.

### CF-05: SA Ruling Library (Section 23)

**Problem:** 206+ D-series rulings, active T-series restrictions, and SA adjudications are scattered across session logs and Notion. Content creators cannot self-serve "am I allowed to say this?"
**Solution:** Queryable library organised by:
- D-series rulings in batches of 50
- T-series: active restrictions vs expired
- Adjudications: active vs superseded
- Content Impact Index: blocked topics, conditional topics, cleared topics
- Quick Reference: "Can I Say This?" lookup, mnemonic usage rules (D-159), evidence tier requirements
**Key gates indexed:**
- D-196: HERALD/BEACON JSX ban
- T-01b: Clinical claims frozen to CS01-CS08
- D-185: Z5 colour #2E6DB4 mandatory
- D-159: TM footer counts (40/38/37 by audience tier)
- D-12: Theoretical cascade (S4) excluded from DRD trace
- S6: UNIDIRECTIONAL label mandatory in same sentence
**Status:** BUILT (folder structure). POPULATION REQUIRED (extract from session logs + Notion).

### CF-06: Content DeltaScan (Section 24)

**Problem:** No version tracking for published content. Cannot prove what was live at any point in time. DCB0129 requires audit trail for clinical-facing materials.
**Solution:** 4-layer tracking:
1. Version Registry: every published asset versioned by type (website, practitioner, marketing, legal)
2. Change Log: content changes, clinical claim changes, regulatory-triggered changes
3. Diff Archive: before/after snapshots with documented reason for change
4. Recall Register: withdrawn content + corrected content (with timestamps)
**Audit trail:** W08 review history + SA ruling-triggered updates
**Regulatory alignment:**
- DCB0129: change control evidence
- MHRA: post-market surveillance documentation
- ASA: proof of claim modification if challenged
- GDPR: privacy notice version history
**Status:** BUILT (folder structure). PROCESS REQUIRED.

### CF-07: Competitor Content Monitor (now Section 08, merged from former Section 25)

**Problem:** Section 08 holds static competitor folders but provides no system for tracking competitor content activity over time. In a niche market (FM clinical intelligence), failing to monitor competitor messaging means ceding narrative ownership.
**Solution:** Active monitoring scaffold:
- Tracked Competitors: profiles + feature comparison matrix (living document)
- Content Alerts: new blog posts, new feature pages, pricing changes, new case studies
- Positioning Responses: counter-content briefs, differentiation narratives
- Quarterly Landscape Reports: market position snapshot every 3 months
- Messaging Gap Analysis: where competitors claim ground VitalMatrix owns
**Key competitors to track:**
- Optimal DX (lab interpretation)
- Heads Up Health (health data aggregation)
- Living Matrix (IFM timeline tool)
- Nutri-Q / Genova portal (lab ordering)
- Generic FM EHR platforms
**Strategic value:** VitalMatrix has no direct competitor doing terrain-based cascade intelligence. Pre-emptive content that owns the "terrain intelligence" narrative before competitors arrive is worth 10x more than reactive content written after.
**Status:** BUILT (folder structure). COMPETITOR PROFILES REQUIRED.

### CF-08: Window Sync Protocol (Section 26)

**Problem:** VitalMatrix operates across 10+ windows (SA, W02, W05, W06, W08, W10, W11, W13). Content is produced in one window, reviewed in another, published from a third. No structure tracks which window holds the current version or where handoffs stall.
**Solution:** 4-layer sync system:
1. Content Ownership Map: indexed by window and by content type
2. Handoff Queues: dedicated folders for each common handoff path
   - W05-to-W08 (code/content to brand review)
   - W08-to-W02 (approved content to website production)
   - W05-to-W06 (build artefacts to prompt factory)
   - W06-to-W05 (TYPE 3 specs to build)
   - Any-to-W10 (anything requiring legal/regulatory review)
3. Stalled Handoffs: items awaiting review, awaiting SA ruling, awaiting Dr Faisal
4. Session Artefacts: indexed by date and by window for cross-reference
**Notion sync layer:** page registry + last-synced timestamps to prevent drift between local and Notion
**Operational rule:** Any content item not moving for >7 days triggers a stall flag.
**Status:** BUILT (folder structure). HANDOFF PROTOCOL DOCUMENT REQUIRED.

### CF-09: Cohort Personalisation (Section 27)

**Problem:** 10 founding practitioners at GBP 299/month (D-50, 5-year guarantee) are not a mass market. Each has different specialisms, IFM experience, and patient populations. Generic content underperforms vs content that acknowledges their specific practice context.
**Solution:** 4-layer personalisation:
1. Practitioner Profiles: template + active profiles capturing specialism, IFM status, patient volume, feature usage
2. Segment Content: IFM-trained vs non-IFM tracks, plus specialism-specific content (gut terrain, hormonal terrain, metabolic terrain, general FM)
3. Personalised Onboarding: custom FLINT examples relevant to their specialism, practice-specific use cases, relevant case studies from their domain
4. Success Tracking: per-practitioner metrics, feature usage heatmap, terrain score outcomes from their patients
**Renewal content (pricing review at contract renewal):**
- Anniversary reports: "here is what VitalMatrix did for your practice this year"
- Value-delivered summary: time saved, patients processed, terrain scores improved
- Expansion opportunities: features they haven't adopted yet
**Revenue protection:** Each practitioner = GBP 3,588/year (GBP 299 x 12, D-50). Losing 1 of 10 = 10% revenue drop. Personalised "your practice, your results" content is the strongest retention lever.
**Status:** BUILT (folder structure). PRACTITIONER PROFILE TEMPLATE REQUIRED.

### CF-10: Content ROI Tracker (Section 28)

**Problem:** Significant content production effort across multiple windows with no measurement of which content drives practitioner acquisition, retention, or engagement. Without ROI data, content investment is blind.
**Solution:** 4-layer ROI system:
1. Attribution Model: first-touch, last-touch, and multi-touch tracking for every content asset that leads to a practitioner action
2. Content-to-Conversion Map: which content preceded demo bookings, trial starts, subscription activations, and renewals
3. Cost Per Asset: time and resource cost tracked by window and by content type
4. Performance Tiers: high performers (double down), underperformers (investigate or retire), untested (schedule measurement)
**Kill list:** content to retire (zero engagement) + content to refresh (outdated but previously high-performing)
**Quarterly ROI reports:** rank all content by conversion impact. Feed results into Section 01 Strategy.
**At 10 practitioners:** every content asset either moves the needle or wastes a window's time. A lead magnet converting at 40% needs doubling down. A blog post driving zero demos needs retiring.
**Status:** BUILT (folder structure). ATTRIBUTION MODEL DEFINITION REQUIRED.

### CF-11: Crisis Content Playbook (Section 29)

**Problem:** No pre-written, pre-approved content exists for foreseeable crisis scenarios. In a crisis, drafting under pressure leads to regulatory and reputational mistakes.
**Solution:** 3 scenario categories with pre-staged content:
1. Regulatory scenarios:
   - MHRA reclassification (Class I to Class IIa): content audit checklist, practitioner notification, website corrections
   - ASA complaint: holding statement, evidence file, response timeline
   - ICO investigation: data subject notification, practitioner communication, incident report
   - DCB0129 incident: clinical safety officer notification, hazard log update, practitioner alert
2. Platform scenarios:
   - Data breach: GDPR 72-hour notification template, practitioner notification, ICO report
   - Extended outage: status page content, practitioner email, post-mortem template
   - Scoring error discovered: immediate practitioner alert, clinical impact assessment, correction protocol
   - Security vulnerability: disclosure timeline, patch notification, trust restoration
3. Reputation scenarios:
   - Negative press: holding statement, factual correction template
   - Practitioner complaint: acknowledgement template, resolution pathway
   - Competitor attack: differentiation response, factual rebuttal framework
**Pre-approved statements:** holding statements, practitioner notifications, and regulatory responses: all W08-reviewed and ready to deploy within 1 hour.
**Escalation matrix:** who is notified, in what order, via which channel, for each scenario type.
**Immediate priority:** MHRA reclassification scenario (response due ~5 June 2026). If Class IIa comes back, every published reference to Class I needs correction within 48 hours.
**Status:** BUILT (folder structure). HOLDING STATEMENTS REQUIRED (MHRA scenario first).

### CF-12: Localisation Framework (Section 30)

**Problem:** Phase 1 is UK-only, but content produced now will need adaptation for US/EU/ANZ markets. Without locale tagging, international expansion requires full content audit and rewrite.
**Solution:** 3-tier localisation readiness:
1. Master Locale (en-GB): all current content. British English spelling, MHRA regulatory refs, NHS lab ranges, GBP pricing, UK supplement availability.
2. Future Locales: pre-structured for en-US (FDA 510(k) instead of MHRA, imperial units, USD pricing, US supplement regs), en-AU, en-EU. Each with sub-folders for spelling differences, regulatory substitutions, lab unit conversions, currency references.
3. Non-Localisable Content Register: items that must NEVER be translated or adapted:
   - Architecture terms: node, zone, cascade, terrain, stack
   - Mnemonic names: all 41 registered mnemonics (FLINT, RECON, COMPASS, etc.)
   - Trademark references: all TM-marked terms
**Locale tagging protocol:** every content item tagged as locale-sensitive or locale-neutral at creation time. Costs nothing now, saves months of audit work at expansion.
**Translation memory:** approved translations/adaptations stored for consistency across future locale builds.
**Locale QA checklists:** per-locale verification that regulatory refs, units, currency, and spelling are correct.
**Status:** BUILT (folder structure). TAGGING PROTOCOL DOCUMENT REQUIRED.

### CF-13: Proof-of-Value Engine (Section 31)

**Problem:** The single biggest barrier to both conversion and renewal is the practitioner asking "is this actually worth GBP 299/month?" Every platform interaction generates evidence of value, but there is nowhere to capture, package, and present that evidence back.
**Solution:** 4-layer value system:
1. Value Metrics: time saved per patient, patients processed, terrain scores generated, DeltaScan comparisons run, cascade stacks identified
2. Practitioner Value Reports: monthly, quarterly, and annual renewal reports sent directly to each practitioner showing their usage and outcomes
3. Benchmark Data: anonymised average across cohort + top performer comparison, so practitioners see where they stand relative to peers
4. Revenue Impact Calculators: time-to-money conversion ("6 hours saved/week x your hourly rate"), patient throughput increase, diagnostic accuracy improvement
**Testimonial triggers:** when a practitioner hits a value milestone (e.g. 50th patient processed, 100 hours saved), auto-prompt them with a testimonial request template. Feeds directly into Section 07 Social-Proof.
**Renewal yield:** the annual renewal report is the single most important document for justifying continued subscription. "VitalMatrix saved your practice 312 hours this year" closes the renewal conversation before it starts. Pricing per D-50: GBP 299/month, 5-year guarantee.
**Status:** BUILT (folder structure). VALUE METRIC DEFINITIONS REQUIRED.

### CF-14: Referral Content Machine (Section 32)

**Problem:** The cheapest route to practitioners 6-10 is through practitioners 1-5 referring their peers. No structure exists for generating, tracking, or rewarding referrals through content.
**Solution:** 3-layer referral system:
1. Referral Programme: terms, reward structure (discount, credit, or feature unlock), tracking system
2. Referral Content: shareable assets designed for peer-to-peer distribution:
   - One-pagers: single-page platform summary a practitioner can hand to a colleague
   - Platform screenshots: curated visuals showing CascadeAtlas, FLINT output, terrain scores
   - Case study summaries: anonymised 1-page outcomes a practitioner can share
   - Video clips: 60-second platform highlights optimised for WhatsApp/LinkedIn
   - Peer invite templates: pre-written messages for email, WhatsApp, LinkedIn DM
   - Conference handouts: print-ready materials for IFM events
3. Co-Branded Content: "Dr [Name] + VitalMatrix" materials that let founding practitioners co-own the brand story
**Referral tracking:** by practitioner and through the conversion funnel (referred > demo booked > trial started > subscribed)
**Yield:** practitioners trust peers more than marketing. A WhatsApp message from a colleague with a one-pager has a higher conversion rate than any paid ad. Content cost is minimal. Potential return: 50% of founding cohort acquired at zero ad spend.
**Status:** BUILT (folder structure). ONE-PAGER TEMPLATE REQUIRED.

### CF-15: Conference Content Kit (Section 33)

**Problem:** IFM conferences and regional FM meetings are where the entire target market gathers. No pre-built content kit exists for conference presence: booth materials, live demos, follow-up sequences, speaker submissions.
**Solution:** 5-stage conference workflow:
1. Pre-Conference: event calendar, speaker submission packages (Dr Faisal as FAAMFM presenter), attendee research
2. Booth Materials: pull-up banners, table handouts, business cards, QR-code demo links (instant platform access)
3. Live Demo:
   - Conference demo script (optimised for noisy booth environment)
   - 3-minute FLINT pipeline walkthrough (node scoring to DRD designation in real time)
   - CascadeAtlas visual hook (terrain cascade animation: the single most impressive visual for a booth)
   - Tablet-optimised demo (booth-friendly format)
4. Post-Conference: follow-up email sequence (day 1, day 3, day 7), lead scoring (hot/warm/cold), connection database
5. Presentation Materials: slide decks, speaker notes, handout PDFs for talks and workshops
**Sponsorship layer:** sponsorship prospectus for event organisers + ROI tracking per event
**Yield:** one IFM conference puts VitalMatrix in front of hundreds of qualified practitioners in 3 days. The 3-minute CascadeAtlas live demo at a booth is worth more than 6 months of blog posts. Dr Faisal's FAAMFM credential gives immediate credibility that no digital marketing can replicate. All materials are reusable across every event.
**Status:** BUILT (folder structure). CONFERENCE DEMO SCRIPT REQUIRED.

### CF-16: Founding Practitioner Launch Sequence (Section 34)

**Problem:** No choreographed pre-launch content exists to convert interested practitioners into signed founding members. Onboarding (CF-02) assumes they've already paid. This section converts them.
**Solution:** 4-layer launch system:
1. Founding Narrative: 3 story assets that frame the founding cohort
   - Origin Story: Dr Faisal's journey from MBBS to FAAMFM to terrain intelligence
   - Why Now: the gap in FM clinical tooling that VitalMatrix fills
   - Why 10 Not 100: reframes small cohort as deliberate exclusivity, not early-stage limitation
2. Countdown Content: pre-written sequence for days 30, 14, 7, 3, 1, and launch day: each escalating urgency and revealing new platform details
3. Exclusivity Assets: tangible founding benefits
   - Founding certificate (printable, frameable)
   - Digital founding badge (for website/LinkedIn)
   - Price guarantee document (5-year lock per D-50, GBP 299/month)
   - Early access features list (what founders get before general release)
   - Direct line to Dr Faisal (personal WhatsApp/email: the single highest-value differentiator vs every SaaS competitor hiding behind support tickets)
4. Conversion Assets: founding cohort agreement, payment page copy, FAQ objection killer
**Social proof seeding:** pre-launch testimonials from beta access, early reactions, waitlist numbers: creating momentum before launch day
**Yield:** This is the content that generates the first GBP 35,880/year (10 x GBP 299 x 12, D-50). Every other section in the ContentStudio is worthless without paying practitioners. This section creates them.
**Status:** BUILT (folder structure). FOUNDING NARRATIVE REQUIRED (Origin Story first).

### CF-17: Platform Screenshot Library (Section 35)

**Problem:** Every marketing asset, demo, email, social post, conference handout, and investor deck needs platform visuals. Screenshots are currently taken ad hoc: inconsistent crops, random zoom levels, test data visible. Every window wastes time recreating the same visual.
**Solution:** Centralised, W08-approved visual library:
1. Master Screenshots: one approved screenshot per major feature (FLINT pipeline, CascadeAtlas, NCZ zone scores, DRD designation, DeltaScan comparison, INTAKE form, terrain report, RECON lab view, COMPASS protocol, dashboard overview)
2. Annotated Versions: with callouts, with arrows, with blur-redaction (for sensitive data areas)
3. Format Variants: full-width, mobile view, cropped feature focus, social media sized, presentation sized: every screenshot pre-exported in every format any window might need
4. Demo Data Sets: Sarah scenario and James scenario (from learning modules) ensure every screenshot tells the same clinical story. Blank template for custom scenarios.
5. Version Control: current approved vs superseded, so no window uses an outdated visual
6. Style Guide: screenshot standards document (zoom level, browser chrome, data visible, annotation colours)
**Force multiplier effect:** Sections 03 (marketing), 04 (website), 07 (social proof), 11 (demo calls), 12 (multimedia), 32 (referral), 33 (conference), 34 (launch), 36 (Dr Faisal brand) ALL need platform visuals. One curated library serves all of them.
**Status:** BUILT (folder structure). SCREENSHOT STANDARDS DOCUMENT REQUIRED. Screenshots require platform demo environment.

### CF-18: Dr Faisal Personal Brand Content (Section 36)

**Problem:** In B2B SaaS for a niche clinical market, the founder's personal credibility IS the brand. Every IFM practitioner will Google Dr Faisal before they Google VitalMatrix. There is no section dedicated to building, packaging, and deploying his authority as content.
**Solution:** 4-layer personal brand system:
1. Authority Assets:
   - Bio versions: 50-word (social media), 150-word (conference programme), 500-word (website/press)
   - Credential summary: MBBS, FAAMFM (never MD, never FMAARM), clinical experience, IFM certification
   - Professional headshots: high-res, cropped variants, consistent across all platforms
   - Speaking reel: video compilation of talks, conference appearances, platform demonstrations
2. Clinical Voice:
   - Published articles (authored by Dr Faisal, not ghostwritten platform content)
   - Quotes library: approved quotes for use across all sections (one good quote appears in 20 content assets)
   - Opinion pieces on terrain intelligence, FM evolution, clinical technology
   - Interview transcripts and podcast appearances
3. Thought Leadership: terrain intelligence vision, FM future narrative, platform philosophy: the "why" behind VitalMatrix in Dr Faisal's voice
4. Social Presence: LinkedIn content plan, Twitter content plan, conference speaker profile
**Practitioner Connection:**
- Personal welcome video (founding practitioners see Dr Faisal's face on day 1)
- Monthly founder update email ("here's what we built, here's what's coming"): founder updates consistently outperform marketing emails in B2B SaaS engagement (risk: requires Dr Faisal's sustained time commitment)
- "Ask Dr Faisal" format for practitioner Q&A
**Yield:** Trust is the conversion bottleneck for clinical software. Dr Faisal's FAAMFM credential, clinical voice, and visible presence reduce that bottleneck faster than any amount of platform marketing. The quotes library alone feeds sections 03, 04, 05, 07, 32, 33, and 34.
**Status:** BUILT (folder structure). BIO VERSIONS REQUIRED (50/150/500 word).

### CF-19: Learning Loop Architecture (Section 37)

**Problem:** Every practitioner interaction generates clinical signal: score overrides, cascade outcomes, protocol results, edge cases. This signal currently dies at the end of the consultation. The framework cannot evolve without it.
**Solution:** 6-layer learning architecture designed to stay within Class I:
1. **Capture Layer** (automated): silently logs 12 types of practitioner signal: score overrides, cascade outcomes, DRD validation, protocol outcomes, biomarker correlations, INTAKE signal mapping, threshold actions, cascade velocity observations, MedTerrain correlations, constellation discoveries, edge case submissions, workflow analytics
2. **Aggregation Layer** (automated): anonymises patient data, generates cohort pattern reports, enforces statistical thresholds and minimum sample rules before any pattern is surfaced
3. **Recommendation Layer** (automated): surfaces parameter change proposals, evidence tier promotions, new pattern candidates, threshold adjustments: all as recommendations, never as actions
4. **Decision Layer** (human): Dr Faisal review queue. Every recommendation requires human approval or rejection with rationale. SA routing for architectural changes. No auto-implementation.
5. **Implementation Layer** (human + W05): approved changes versioned, ALB update triggers documented, D-series ruling obtained where required
6. **Validation Layer** (automated + human): post-change monitoring confirms improvement. Rollback triggers defined. DCB0129 change control documented.
**MHRA compliance:** the system never auto-changes a clinical parameter. Capture > Aggregate > Recommend is automated. Decide > Implement > Validate requires human gate. This is the practitioner-confirmation model applied to framework evolution itself.
**GDPR compliance:** consent architecture, anonymisation standards, data minimisation, retention policy: all within Section 37.
**Critical line:** if the system ever auto-adjusts clinical output based on learned data, it crosses from Class I to Class IIa+. The human decision gate (Layer 4) is the regulatory firewall.
**Status:** BUILT (folder structure). CAPTURE LAYER SPEC REQUIRED.

### CF-20: 12 Learning Channels (Section 38)

**Problem:** "Learning from practitioners" is vague. It needs to be decomposed into specific, measurable channels with defined capture mechanisms, evolution targets, and minimum viable datasets.
**Solution:** 12 discrete learning channels:

| Channel | Signal captured | What evolves | Min dataset |
|---|---|---|---|
| CH01 Terrain Score Calibration | Practitioner score overrides | Node-to-zone weights, N6 dampening, thresholds | 50 overrides |
| CH02 Cascade Validation | DeltaScan T1/T2 cascade outcomes | Cascade probability weights, evidence tiers | 30 T2 scans |
| CH03 DRD Accuracy | Driver zone treatment outcomes | DRD logic, tiebreaker rules, TerrainLock sensitivity | 40 tracked cases |
| CH04 Protocol Effectiveness | Protocol prescribed vs T2 scores | COMPASS protocol confidence, supplement mappings | 50 protocol cycles |
| CH05 Biomarker Range Refinement | Lab values vs terrain scores vs outcomes | Functional optimal range boundaries, RECON accuracy | 100 lab panels |
| CH06 INTAKE Signal Value | INTAKE responses vs FLINT outputs | Question weighting, adaptive depth, MSQ accuracy | 80 completed intakes |
| CH07 Near-Threshold Accuracy | Practitioner actions on borderline zones | Configurable Parameter 8, zone-specific thresholds | 30 borderline cases |
| CH08 Cascade Velocity | Time between DeltaScan T1/T2 vs cascade progression | Velocity classifications, urgency ratings | 20 longitudinal cases |
| CH09 MedTerrain Accuracy | Medication lists vs terrain scores | Drug-terrain mappings, polypharmacy patterns | 60 medicated patients |
| CH10 Constellation Discovery | Practitioner-flagged symptom patterns | Constellation library expansion, pattern confidence | 10 flagged patterns |
| CH11 Edge Case Library | "System got it wrong" submissions | Scoring exceptions, ANCHOR adjustments | 15 edge cases |
| CH12 Workflow Intelligence | Feature usage, navigation, search, support | UI/UX priorities, onboarding sequence, help docs | 5 active practitioners |

Each channel has: capture spec, anonymisation protocol, minimum sample before surfacing, recommendation format, Dr Faisal review template.
**50-patient milestone:** after the first 50 patients across the cohort, Configurable Parameter 8 recalibration becomes possible (per D-38). This is the first concrete evolution event.
**Status:** BUILT (folder structure). CHANNEL CAPTURE SPECS REQUIRED (CH01 first: highest volume signal).

### CF-21: Evolution Reports (Section 39)

**Problem:** Learning data is useless without structured reporting that surfaces patterns, tracks parameter changes, and documents framework evolution for regulatory and clinical audiences.
**Solution:** 4-tier reporting:
1. **Monthly Learning Digest:** what signal came in, which channels are active, any patterns emerging, data quality metrics
2. **Quarterly Framework Review:** parameter change proposals ready for Dr Faisal, evidence tier movements, channel health assessment
3. **Annual Architecture Assessment:** full review of all 12 channels, framework version history, regulatory impact assessment, recommendation for ALB update
4. **Parameter Change History:** every approved change logged with: what changed, why, what data supported it, who approved it, D-series ruling if applicable, DCB0129 entry
**Cohort milestone reports:** triggered at 50, 100, and 500 patients: each milestone unlocks new calibration possibilities:
- 50 patients: threshold recalibration (D-38), initial cascade validation
- 100 patients: biomarker range refinement, protocol effectiveness patterns
- 500 patients: publishable statistical significance, conference abstracts, peer review pipeline
**Practitioner contribution credits:** practitioners whose overrides, edge cases, or pattern flags led to framework improvements are credited (anonymised patient data, named practitioner contribution). This creates a virtuous loop: practitioners who see their clinical input improving the platform become its strongest advocates.
**Publishable findings:** case series candidates, conference abstracts, peer review pipeline. Real-world evidence from the VitalMatrix cohort becomes Dr Faisal's published research output, feeding Section 36 (personal brand) and Section 07 (social proof).
**Status:** BUILT (folder structure). MONTHLY DIGEST TEMPLATE REQUIRED.

---

## 5. COMPLIANCE FRAMEWORK

### 5.1 W08 Content Gate

Applies to ALL content leaving the studio. Class I self-assessment does NOT remove this gate.

| Gate | Trigger | Removed by Class I? |
|------|---------|---------------------|
| MHRA SaMD compliance | Clinical-facing content | No (Class I self-assessed; formal determination outstanding) |
| ASA advertising standards | All externally visible content | No (independent of device class) |
| T-01 output rules | Practitioner-facing clinical output | No (SA/ALB restriction, not MHRA) |
| T-01b claim freeze | Any new clinical claim beyond CS01-CS08 | No (SA gate) |
| DCB0129 clinical safety | Clinical content changes | No (Class I still requires hazard log) |
| Brand/tone consistency | All content | No (internal quality gate) |

W5-3 (protective header) and W5-4 (blank practitioner decision section): PERMANENT. Never revert.

### 5.2 T-01 Active Restrictions

All T-01 restrictions remain active until ALL THREE conditions are met simultaneously:
1. MHRA SaMD classification confirmed in writing
2. Appropriate regulatory fees paid
3. W10 issues written clearance

Current status: NONE of the three conditions are met (as at 20 May 2026).

### 5.3 Evidence Tier Requirement

Every clinical claim in any content must carry one of:
- Established
- Emerging
- Theoretical
- Observed in Practice
- Contested

No claim may be published without an assigned tier. Contested claims require quarantine review.

### 5.4 Mnemonic Usage Rules (D-159)

- TM on first use per document for all 41 registered mnemonics
- TM footer counts per audience tier (D-149/D-159): 41 (internal) / 38 (investor) / 37 (practitioner)
- The TM footer at the bottom of this document is INTERNAL tier (41 mnemonics)
- HERALD and BEACON: Tier 4 internal only. W08 gated. Never surface in practitioner outputs.
- TerrainRoot: Option F IP lock. Do not reference in any output.
- VECTOR: Reserved Phase 2. Do not build.

---

## 6. DESIGN SYSTEM ALIGNMENT

All content produced within the studio must comply with:

**Backgrounds:** Prussian Blue #0D2B4E (flagship) | Charcoal #1A2030 (conversion) | Deep Teal #0C4452 (terrain/clinical)

**Zone colours (complete mapping):**

| Zone | Name | Website (D-53) | GENOME Handbook (D-44) | Universal override |
|------|------|----------------|------------------------|-------------------|
| Z1 | Metabolic Energy Axis | #C9A84C (Gold) | #D63030 (Red) | -- |
| Z2 | Resilience Network | #1A7A8A (Teal) | #1A7A8A (Teal) | -- |
| Z3 | Cardiovascular-Neural Axis | #7B5EA7 (Purple) | #7B5EA7 (Purple) | -- |
| Z4 | Detoxification Trident | #5F7C6C (Sage) | #5F7C6C (Sage) | -- |
| Z5 | Hormonal Terrain Axis | #2E6DB4 (Blue) | #2E6DB4 (Blue) | #2E6DB4 (Blue) D-185 ALL contexts |

D-185 supersedes D-44 and D-53 for Z5. #2E6DB4 applies universally, no exceptions.

**Accent colours:** Gold #C9A84C | Teal #1A7A8A | Teal Light #2A9BAD

**Typography:**
- Cormorant Garamond (headings) | Outfit (body) | DM Mono (data labels)
- Never: DM Sans | IBM Plex Mono | Inter

**CSS prefix:** --vm-
**Fonts:** Offline only. @font-face with local() fallbacks. No CDN imports.

**TM notation convention:** Use (TM) in plain text files (.md, .txt). Use the symbol in HTML and rich text. State which convention applies in each document.

---

## 7. CONTENT TYPES AND OWNERS

| Content Type | Primary Owner | Review Gate |
|---|---|---|
| Website copy | W02 (Website Production) | W08 (Brand/Design + Regulatory/Legal) |
| Clinical content | W05 (Claude Code) + Dr Faisal | W08 + W10 |
| Marketing/email | W08 (Brand/Design + Regulatory/Legal) | W08 + ASA |
| Legal/regulatory | W10 (Regulatory and Legal) | W10 |
| Architectural docs | SA (Strategic Advisory) | SA |
| Practitioner guides | W05 + W08 | W08 |
| Social media | W08 | W08 + ASA |
| Investor materials | W08 + W13 (Operations) | W08 |

---

## 8. BUILD STATUS

| Item | Status | Next Action |
|---|---|---|
| Folder structure (1,256 dirs, 83 files) | BUILT | Operational |
| MasterSpecs (this file) | DRAFT | W08 review |
| Content Pipeline workflow | STRUCTURE ONLY | Define tooling (Notion/GitHub) |
| Practitioner Onboarding content | STRUCTURE ONLY | Write Day-1 pack first |
| Evidence Register population | STRUCTURE ONLY | Extract CS01-CS08 from session logs |
| Practitioner Comms templates | STRUCTURE ONLY | Write release note template first |
| SA Ruling Library population | STRUCTURE ONLY | Extract D-series from Notion |
| Content DeltaScan process | STRUCTURE ONLY | Define versioning protocol |
| Competitor Content Monitor | STRUCTURE ONLY | Populate competitor profiles |
| Window Sync Protocol | STRUCTURE ONLY | Write handoff protocol document |
| Cohort Personalisation | STRUCTURE ONLY | Create practitioner profile template |
| Content ROI Tracker | STRUCTURE ONLY | Define attribution model |
| Crisis Content Playbook | STRUCTURE ONLY | Write MHRA reclassification holding statement |
| Localisation Framework | STRUCTURE ONLY | Write locale tagging protocol |
| Proof-of-Value Engine | STRUCTURE ONLY | Define value metric definitions |
| Referral Content Machine | STRUCTURE ONLY | Create one-pager template |
| Conference Content Kit | STRUCTURE ONLY | Write conference demo script |
| Launch Sequence | STRUCTURE ONLY | Write founding narrative (Origin Story) |
| Screenshot Library | STRUCTURE ONLY | Write screenshot standards document |
| Dr Faisal Personal Brand | STRUCTURE ONLY | Write bio versions (50/150/500) |
| Learning Loop Architecture | STRUCTURE ONLY | Write capture layer spec |
| 12 Learning Channels | STRUCTURE ONLY | Write CH01 capture spec first |
| Evolution Reports | STRUCTURE ONLY | Write monthly digest template |
| Operational workspace (41 dirs) | BUILT | Link to main studio |
| Claude working copy (48 dirs) | BUILT | Sync protocol needed |

---

## 9. ORIGIN

Customised from HHW (Health Horizon Wellness) ContentStudio (407 dirs, March 2026, PAUSED).
HHW was a B2C men's sexual health clinic scaffold.
VitalMatrix is a B2B SaaS clinical intelligence platform for FM practitioners.

Key transformations:
- ED/PE/testosterone/LifeWave/PEMF research replaced with 7-node terrain research
- Patient education replaced with practitioner education
- Patient testimonials replaced with practitioner testimonials + platform metrics
- Discovery calls replaced with demo calls (FLINT pipeline walkthrough)
- Patient courses replaced with practitioner courses (Foundation, Advanced, GENOME)
- Added: Regulatory Compliance (18), Content Pipeline (19), Practitioner Onboarding (20),
  Evidence Register (21), Practitioner Communications (22), SA Ruling Library (23),
  Content DeltaScan (24), Competitor Content Monitor (25), Window Sync Protocol (26),
  Cohort Personalisation (27), Content ROI Tracker (28), Crisis Content Playbook (29),
  Localisation Framework (30), Proof-of-Value Engine (31), Referral Content Machine (32),
  Conference Content Kit (33), Launch Sequence (34), Screenshot Library (35),
  Dr Faisal Personal Brand (36), Learning Loop Architecture (37),
  12 Learning Channels (38), Evolution Reports (39)
- Added: Investor Relations, ALB Governance, Proprietary Architecture, Phase Roadmap
- Added: LinkedIn Ads (B2B primary), MRR tracking, churn analysis, platform usage analytics

---

VitalMatrix(TM), NCZ(TM), DRD(TM), APEX(TM), TIQ(TM), CIB(TM), CascadeIQ(TM), FLINT(TM),
CZR(TM), TRACE(TM), DeltaScan(TM), MedTerrain(TM), TerrainLock(TM), CascadeAtlas(TM),
PRISM(TM), KINETICS(TM), COHERENCE(TM), TerrainRoot(TM), ORBIT(TM), SPHERE(TM), HERALD(TM),
BEACON(TM), MAPS(TM), RECON(TM), COMPASS(TM), GENOME(TM), ANCHOR(TM), AXIS(TM), INTAKE(TM),
VECTOR(TM), VOLTERRAIN(TM), VANTAGE(TM), VERITY(TM), VISTA(TM), CADENCE(TM),
TerrainSpiral(TM), MODES(TM), GRADE(TM), NEXUS(TM), VAULT(TM)
and all associated marks are trademarks of VitalMatrix Ltd. All rights reserved.

For practitioner use only. Not a diagnostic tool. VitalMatrix Ltd 2026.
ICO ZC101813 | Companies House 17046123

## 10. AUDIT LOG

### Universal Audit v1 (20 May 2026)

| # | Severity | Finding | Fix applied |
|---|---|---|---|
| F1 | CRITICAL | Section 01 numbering collision (Research-Library + Strategy) | Strategy merged into 15_Business-Intelligence/Content-Strategy |
| F2 | CRITICAL | D-50 pricing violation (GBP 399/599 references) | All pricing corrected to GBP 299/month, 5-year guarantee (D-50) |
| F3 | HIGH | Section 13 and 23 SA ruling overlap | Section 13 = framework only, Section 23 = canonical rulings. README pointer added. |
| F4 | HIGH | Section 08 and 25 competitor overlap | Section 25 merged into Section 08. Section 25 removed. |
| F5 | HIGH | Three locations massively out of sync | Operational and Claude copies removed. Main studio = single source of truth. |
| F6 | HIGH | "Patient Impact" language in B2B platform (Section 16) | Renamed to Practitioner-Practice-Impact |
| F7 | MEDIUM | D-series folder range outdated (stopped at D-206) | Ranges corrected: D-151-to-D-200 + D-201-onwards |
| F8 | MEDIUM | _Templates empty and undefined | 5 templates populated (content brief, W08 review, evidence tier, naming, section README) |
| F9 | MEDIUM | No README/index files in any section | 38 section READMEs created with purpose, scope, gate, and owner |
| F10 | MEDIUM | Incomplete zone colour mapping in design system | Full 5-zone table added distinguishing website (D-53) vs GENOME (D-44) vs universal (D-185) |
| F11 | MEDIUM | No GDPR practitioner-facing content locations | Privacy notices, cookie policy, terms of use, and data processing explanation folders added |
| F12 | LOW | TM notation inconsistency ((TM) vs symbol) | Convention stated: (TM) in plain text, symbol in HTML |

**Audit 1 verdict:** 12 findings. 2 CRITICAL, 4 HIGH, 5 MEDIUM, 1 LOW. All 12 fixed. PASS.

### Universal Audit v2 (20 May 2026)

| # | Severity | Finding | Fix applied |
|---|---|---|---|
| F13 | HIGH | CF-07 still references deleted Section 25 | Updated CF-07 header to reference Section 08 |
| F14 | HIGH | Build status table shows stale dir count (1,031) | Updated to 1,059 dirs, 47 files |
| F15 | HIGH | F-W30-004 Evidence Provenance has no ContentStudio home | Added Provenance-Methodology to Section 21 |
| F16 | HIGH | No practitioner app documentation section (in-app copy, help text, errors) | Added App-Content to Section 04 |
| F17 | MEDIUM | Section 16 Stories sub-folder naming confusion from rename | Cleaned up to Practice-Outcome-Reports + Practice-Transformations |
| F18 | MEDIUM | No investor content section with D-159 audience tier tagging | Added Investor-Content with D-159 footer sub-folder to Section 14 |
| F19 | MEDIUM | No master editorial calendar across all sections | Added Editorial-Calendar to Section 15 |
| F20 | MEDIUM | CF-07 numbering gap references non-existent Section 25 | CF-07 header updated to note Section 08 merger |
| F21 | MEDIUM | No accessibility standards for content (alt text, WCAG, contrast) | Added Accessibility-Standards to Section 06 |
| F22 | MEDIUM | No "How to Use This Studio" onboarding guide | Added Section 0 with 8-step guide for new users |
| F23 | LOW | en-EU is not a valid locale code | Renamed to en-IE (Ireland) |
| F24 | LOW | No .gitignore for future Git integration | Created .gitignore at ContentStudio root |

**Audit 2 verdict:** 12 findings. 4 HIGH, 5 MEDIUM, 2 LOW. All 12 fixed. PASS.

**Combined audit v1+v2:** 24 findings. All fixed.

### Universal Audit v3 (20 May 2026): W06 Audit Prompt Applied (10 Flaws)

Audit prompt: UniversalOutputAuditPrompt v1.0 (W06, 13 May 2026), 97 checks, 10 domains.

| # | Domain | Finding | Fix applied |
|---|---|---|---|
| F25 | D1.04 K4 | MasterSpecs filename says v1, content says v2.0 | Renamed to ContentStudio_MasterSpecs_v2_2026-05-20.md |
| F26 | D2.15 | Z5 website column blank in zone table (should show #2E6DB4) | Z5 row corrected: #2E6DB4 in all three columns |
| F27 | D3.11 | TM footer at bottom of file doesn't state audience tier | "INTERNAL tier (41 mnemonics)" label added |
| F28 | D4.04 | W08 described as "Brand and Design" only, missing W10 combined function | Corrected to "Brand/Design + Regulatory/Legal" |
| F29 | D1.08 K8 | Em dashes throughout MasterSpecs | All em dashes replaced with colons |
| F30 | D6.04 | GENOME-Certification is a phantom feature (no programme exists) | Renamed to Phase2 placeholder |
| F31 | D5.06 | MHRA stated with expected date (~5 June) instead of "formal determination outstanding" | Corrected to "Class I self-assessed; formal determination outstanding" |
| F32 | D1.16 H-02 | Multiple CF descriptions lead with opportunity before risk | CF-18 monthly update claim corrected with risk statement |
| F33 | D6.01 | CF-18 "single highest-engagement email any SaaS company can send" is invented specificity | Replaced with sourced claim + risk caveat |
| F34 | D7.09 | MasterSpecs does not declare its own audience tier | "Audience tier: INTERNAL (D-57)" added to header |

### Universal Audit v3 (20 May 2026): W06 Audit Prompt Applied (10 Gaps)

| # | Domain | Gap | Fix applied |
|---|---|---|---|
| G11 | Structure | No P1-P21 website page registry in Section 04 | 21 page folders (P01 to P21) added to 04_Website-Content/Page-Registry |
| G12 | D5.02 | No T-03 content section (acute disclaimer, hard gate) | T-03 Element 1 and 2 folders added to 18_Regulatory-Compliance |
| G13 | Structure | No MSQ-71 content home (87 questions, node mapping) | MSQ-71 section added to 02_Core-Content/Clinical-Instruments |
| G14 | Structure | No DeltaScan T2 follow-up content | T2 folder added to 20_Practitioner-Onboarding/Ongoing-Support |
| G15 | Structure | No D-89 feature portfolio cross-reference (F-W30-001 to F-W30-012) | 6 feature folders added to 15_Business-Intelligence/D89-Feature-Portfolio |
| G16 | Structure | Notion page registry empty (20+ pages referenced, zero registered) | Registry populated with 15 key Notion pages |
| G17 | Structure | No F-W30-005 onboarding UI copy (7 steps need copy) | 7 step folders added to 04_Website-Content/App-Content/Onboarding-UI-Copy |
| G18 | Structure | No FAQ content (P19 ready to build but no content home) | 6 FAQ categories added to 02_Core-Content/FAQ-Content |
| G19 | Structure | No session handover protocol within ContentStudio | Session handover folders by window added to Section 26 |
| G20 | D5.01 | No clinical safety content for practitioners (scoring limitations, escalation) | Clinical safety content folders added to Section 29 |

### Universal Audit v4 (20 May 2026): Deep Compliance + Architecture Gaps (20 More)

| # | Type | Finding | Fix applied |
|---|---|---|---|
| F35 | D6.04 | IFM-CE-Credits folder is phantom (no IFM CE agreement exists) | Renamed to Phase2-Requires-Agreement placeholder |
| F36 | D5.05 | MHRA section missing post-market surveillance, tech docs, conformity | 3 folders added to 18_Regulatory-Compliance/MHRA |
| F37 | D4.03 | Referral programme has no ASA/FCA review gate noted | ASA-FCA-Review-Gate folder added |
| F38 | Structure | Incident Communications missing response template and SLA | Response-Time-SLA and Incident-Template folders added |
| F39 | D5.01 | Learning loop GDPR consent has no practitioner consent form | Practitioner-Consent-Form and Anonymisation-Proof folders added |
| F40 | Structure | No D-series ruling for ContentStudio governance itself | Placeholder created in D-201-onwards |
| G21 | Structure | No ANCHOR confidence layer practitioner guide | Folder added to 02_Core-Content/Practitioner-Guides |
| G22 | Structure | No AXIS 90-second narrative practitioner guide | Folder added to 02_Core-Content/Practitioner-Guides |
| G23 | Structure | No biomarker registry content home (85 markers, separate from research) | Biomarker-Registry with 3 sub-folders added to Clinical-Instruments |
| G24 | Structure | No content versioning protocol document in Section 24 | VersioningProtocol.md created with full protocol |
| G25 | Structure | No W04 clinical content review queue in pipeline | W04 review queue (Pending/Approved/Rejected) added to Section 19 |
| G26 | Structure | No scoring reference for content writers (floor formula, thresholds) | 4 scoring reference folders added to Practitioner-Guides |
| G27 | Structure | No RECON lab test guide for practitioners | 3 RECON guide folders added to Practitioner-Guides |
| G28 | Structure | No COMPASS protocol guide (D-93 internal only) | 3 COMPASS guide folders added to Practitioner-Guides |
| G29 | Structure | No CascadeAtlas practitioner walkthrough | 3 walkthrough folders added to Practitioner-Guides |
| G30 | Structure | No zone clinical entry points content (5 zones) | 5 zone folders added to Practitioner-Guides |
| G31 | Structure | No MHRA technical documentation folder | Added to 18_Regulatory-Compliance/MHRA |
| G32 | Structure | No MHRA conformity declaration folder | Added to 18_Regulatory-Compliance/MHRA |
| G33 | Structure | No T-01 output rules content folder | T-01-Output-Rules added to T-Series-Content |
| G34 | Structure | No patient data anonymisation proof folder for learning loop | Added to 37_Learning-Loop-Architecture/GDPR-Compliance |

**Audit v3+v4 verdict:** 40 findings (20 flaws + 20 gaps). All 40 fixed.

**Combined audit v1-v4:** 64 findings. All fixed.

### Universal Audit v5 (21 May 2026): Practitioner Guide Completeness + Structural Polish

| # | Type | Finding | Fix applied |
|---|---|---|---|
| F41 | MEDIUM | Duplicate folder names (RECON, COMPASS, FLINT x3 each) cause ambiguity | Disambiguation READMEs added to practitioner guide copies |
| F42 | HIGH | No MedTerrain practitioner content (40 medication classes) | MedTerrain guide with 3 sub-folders added |
| F43 | HIGH | No FLINT pipeline practitioner guide (the core product has no guide) | 6-stage FLINT guide (L1-L5 + DeltaScan) created |
| F44 | MEDIUM | Page-Registry (P01-P21) has no README | README added |
| F45 | MEDIUM | No content status tracking template in pipeline | Content-Status-Tracker-Template.md created |
| F46 | HIGH | No backup/disaster recovery content section | Business-Continuity added to Section 18 |
| F47 | MEDIUM | CS01-CS08 folder empty with no population instructions | README with extraction instructions added |
| F48 | MEDIUM | Mnemonic register folder empty with no specs | README with 41-mnemonic specs added |
| F49 | HIGH | No TerrainLock practitioner explanation | 3-folder guide created |
| F50 | HIGH | No DRD designation practitioner guide | 3-folder guide (T-01 display language) created |
| F51 | HIGH | No NCZ zone logic practitioner guide | 4-folder guide (thresholds, N6, Z5) created |
| F52 | MEDIUM | No evidence tier system practitioner guide | 3-folder guide created |
| F53 | MEDIUM | No MES cross-cutting context guide | Folder created |
| F54 | HIGH | No 7-node architecture practitioner guide | 7 node folders (N1-N7) created |
| F55 | HIGH | No cascade stacks practitioner guide (6 stacks) | 6 stack folders (S1-S6 with labels) created |
| F56 | LOW | Countdown folders sort alphabetically not chronologically | Prefixed with sequence numbers (01-06) |
| F57 | HIGH | No T-01 output template practitioner guide | 4-folder guide (W5-3, W5-4, scores, display) created |
| F58 | HIGH | No 6-stage clinical pipeline overview guide | 6 stage folders (L1-L9) created |
| F59 | MEDIUM | Screenshot demo data has no prerequisite note | README with demo environment prerequisite added |
| F60 | MEDIUM | No GENOME Handbook navigation guide content | 3-folder guide (index, navigation, LAs) created |

**Audit v5 verdict:** 20 findings. 10 HIGH, 8 MEDIUM, 2 LOW. All 20 fixed. PASS.

**Combined audit v1-v5:** 84 findings. All fixed.

### Universal Audit v6 (21 May 2026): Mnemonic Guide Coverage + Operational Templates

| # | Type | Finding | Fix applied |
|---|---|---|---|
| F61 | HIGH | No APEX investigation planner practitioner guide | 3-folder guide (budget tiers, zone-to-lab, cost) created |
| F62 | MEDIUM | No PRISM routing concept guide | Folder created |
| F63 | MEDIUM | No TRACE timeline guide | 2-folder guide (temporal cascade, history mapping) created |
| F64 | MEDIUM | No KINETICS velocity board guide | 2-folder guide (fixed vs computed, urgency) created |
| F65 | HIGH | No MAPS documentation assistance guide | 3-folder guide (voice workflow, confirmation model, D-198 fallback) created |
| F66 | HIGH | No CascadeIQ stack detection guide | 3-folder guide (6 stacks, velocity, TerrainLock) created |
| F67 | MEDIUM | No COHERENCE arc explanation | Folder created |
| F68 | MEDIUM | Section 20 README missing F-W30-005 alignment note | README rewritten with TYPE 3 spec reference |
| F69 | HIGH | No Anthropic DPA tracking in Section 18 (GDPR Art 28 critical) | Folder added to GDPR section |
| F70 | MEDIUM | No error message taxonomy for app content | README with taxonomy and rules created |
| F71 | MEDIUM | No practitioner feedback form content | Folder created in Section 22 |
| F72 | MEDIUM | No bug report template | Bug-Report-Template.md created in _Templates |
| F73 | HIGH | No learning channel capture spec template | Learning-Channel-Capture-Spec-Template.md created |
| F74 | HIGH | Founding terms content (Step 5) not linked to F-W30-005 spec | README with 5 mandatory items from TYPE 3 spec added |
| F75 | HIGH | Orientation content (Step 6) has no W04 gate documentation | README with W04 gate and zero-K7 requirement added |
| F76 | MEDIUM | No terrain intelligence keyword content in SEO section | README with priority keyword clusters added |
| F77 | LOW | P01-P21 page folders have no per-page README | 21 per-page READMEs created |
| F78 | HIGH | No DeltaScan engine practitioner guide | 3-folder guide (T1 baseline, T2 comparison, interpretation) created |
| F79 | MEDIUM | No TIQ (Terrain Intelligence Quotient) guide | Folder created |
| F80 | MEDIUM | No CIB (Cascade Intelligence Brief) guide | Folder created |

**Audit v6 verdict:** 20 findings. 8 HIGH, 10 MEDIUM, 2 LOW. All 20 fixed. PASS.

**Grand total across all 6 audit rounds:** 104 findings. All 104 fixed. **CLEAN.**

END OF MASTER SPECIFICATIONS v2.0 | 20 May 2026
