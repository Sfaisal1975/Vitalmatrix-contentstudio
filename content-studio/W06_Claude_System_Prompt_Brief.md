# VitalMatrix — Claude AI System Prompt Brief
## For W06 Prompt Factory Window
**Purpose:** Paste this entire document into W06. It contains everything needed to write the Claude Projects system prompt for the VitalMatrix Ecosystem Assistant.
**Date:** 2026-05-31

---

## PART A — THE ECOSYSTEM AND THE PEOPLE

### Who This Is For
Dr Shahzad Faisal — MBBS, FAAMFM. 26 years of functional medicine clinical practice. UK-based, Harley Street adjacent. IFM-trained. Founder of VitalMatrix Ltd (Company No. 17046123, ICO ZC101813). Email: hello@vitalmatrix.co.uk

### What VitalMatrix Is
VitalMatrix is a clinical intelligence platform for functional medicine practitioners. It automates IFM-style terrain matrix generation using the proprietary NCZ™ framework (7 biological nodes × 5 terrain zones). The platform reduces multi-system case documentation from hours to under 60 seconds. Practitioners retain full clinical judgement — VitalMatrix structures what they already know.

### Current Phase
Phase 1 — Practitioner Acquisition. Target: 10 founding practitioners at a founding price. These are not customers. They are clinical co-builders. Phase 2 is post-cohort scale.

### Who Uses What
- **Dr Faisal and his team (W08)** — use Claude Projects for content creation, strategy, and clinical communications
- **The Replit coding agent** — builds and maintains the website, API, database, and all automation systems
- **Founding practitioners** — use Lyceum (the VitalMatrix app) for clinical work
- **Prospective practitioners** — encounter the website and nurture emails during acquisition

---

## PART B — THE THREE LAYERS OF THE ECOSYSTEM

### Layer 1: The Website (Acquisition Layer)
**URL:** https://vitalmatrix-transfer.replit.app
**Built with:** React + Vite, hosted on Replit
**Purpose:** Convert practitioner interest into enquiry form submissions

Pages: homepage, about Dr Faisal, how VitalMatrix works, founding cohort offer, enquiry form. Embedded AI chatbot widget on all pages with session history, privacy toggle, and unread message badge.

What happens when someone submits the enquiry form: confirmation email sent to enquirer + notification to Dr Faisal + 4-email automated nurture sequence triggered automatically.

### Layer 2: Lyceum — The VitalMatrix App (Clinical Layer)
**What it is:** The practitioner-facing clinical intelligence platform. This is what founding practitioners log into. It is the core product.

**Core capability:** Practitioner inputs patient terrain data → NCZ™ framework computes across 7 biological nodes × 5 terrain zones → outputs a completed IFM-style terrain matrix architecture in under 60 seconds.

**What Lyceum is NOT:**
- Not a medical device (unless registered as such)
- Not a diagnostic system
- Not a prescribing system
- Not a replacement for clinical judgement
- Not an AI doctor

**Content Claude helps create for Lyceum:**
- Onboarding flows (welcome screens, first-use prompts, feature introductions)
- In-app copy (tooltips, empty states, error messages, navigation labels)
- Practitioner quick-start guide
- NCZ™ framework explainer (practitioner-level, clinical, detailed)
- FAQ for founding practitioners
- "How to read your terrain architecture output" guide
- Feature release announcements
- Monthly practitioner founder updates

### Layer 3: The Content Studio (Operational Knowledge Layer)
A 39-section file-based operational knowledge library stored as markdown (.md) files in the Replit project. Every piece of content, brand guidance, clinical evidence, launch sequence, playbook, and template the VitalMatrix operation runs on lives here.

**Master specifications file:** `content-studio/ContentStudio_MasterSpecs_v2.1_2026-05-31.md`
This is the canonical index of what exists across all 39 sections. Always consult it before creating new content to avoid duplication.

**CRITICAL RULE:** v3 of the master spec is RESERVED for the INTAKE form specification. Never use v3 for any other document under any circumstances.

**Active sections (most important to know):**

| Section | Name | What it contains |
|---------|------|-----------------|
| 03 | Marketing Assets | Social media content calendar, automation setup guide |
| 06 | Brand Assets | Messaging Framework, Email Hooks Library (6 types), Email Style Guide |
| 11 | Demo Call Materials | Discovery call scripts, prep guides, objection handling |
| 19 | Content Pipeline | Phase 1 Practitioner Acquisition Playbook (master funnel document) |
| 20 | Practitioner Onboarding | Complete onboarding sequence for founding practitioners |
| 21 | Evidence Register | 12 registered clinical claims — must be checked before any public claim |
| 29 | Crisis Content Playbook | MHRA reclassification response — URGENT, deadline ~5 June 2026 |
| 34 | Launch Sequence | Phase 1 launch emails L1, L2, L3 |
| 36 | Dr Faisal Personal Brand | Bio, founding narrative, positioning, credentials |

**When creating new content studio documents, always include at the top:**
- Section number and name
- Status (DRAFT / ACTIVE / ARCHIVED)
- Owner (W08 unless stated otherwise)
- Review gate (who must approve before publication)

---

## PART C — THE REPLIT CODING AGENT (MY ROLE AND CAPABILITIES)

### What the Replit Coding Agent Is
The Replit coding agent is a separate AI system that lives inside the Replit development environment with direct access to all code files, the database, terminal commands, and the live server. It is not the same as this Claude Projects instance.

Think of it as: **Claude Projects = the strategic content brain. Replit coding agent = the technical hands that build and maintain everything.**

### What the Replit Coding Agent Has Already Built

**Core website and infrastructure:**
- Full VitalMatrix website (React + Vite) with all pages, chatbot widget, and brand styling
- Express API server handling all backend operations
- PostgreSQL database with Drizzle ORM

**Automation systems (all live and running):**
- **4-email nurture sequence** — Days 2, 4, 6, 8 post-enquiry. Dark navy HTML template with gold accents. Triggers automatically when enquiry form is submitted. Processes every 15 minutes.
- **Social media scheduler** — posts to LinkedIn, Facebook, Instagram, and X automatically. Runs every 10 minutes. Has retry logic, error detection, and terminal error handling. Awaiting platform credentials to activate.
- **Weekly digest** — automated Monday 09:00 UK operational summary to Dr Faisal
- **Chat session cleanup** — removes expired sessions every day, logs every run to maintenance_log database table

**Chatbot widget:**
- Session history with server persistence
- Privacy toggle (history on/off) with in-chat notice
- Unread message badge with gold pulse animation when chat is minimised
- Open/minimised state remembered across page navigations
- sessionStorage caching so messages don't reload from server on every page

**Database tables live in production:**
- conversations, messages, enquiries, status_checks
- nurture_queue (tracks email send state)
- social_queue (tracks scheduled social posts — platform, content, status, retry count)
- maintenance_log (records every cleanup job run)
- app_settings

**Admin API endpoints (all require x-admin-key header):**
- GET /api/chat/stats — active sessions + last 30 cleanup runs
- POST /api/social/schedule — schedule a post to any platform
- GET /api/social/queue — view pending/posted/failed posts
- DELETE /api/social/queue/:id — cancel a pending post
- GET /api/social/history — view posting history

**Content studio files created:**
- Email Hooks Library — 6 hook types with examples, selection guide, subject line formulas
- Email Style Guide — complete HTML template spec, two registers, length guidelines per email, banned elements, compliance checklist
- Social Media Content Calendar — platform strategy, weekly cadence, post templates for all 4 platforms, repurposing workflow
- Social Automation Setup Guide — all credentials needed, API endpoints, retry logic, token expiry reminders
- Phase 1 Practitioner Acquisition Playbook — 7-stage funnel, 3 decision paths, ICP scoring, failure recovery protocols, content asset master map, 10 rules

### What the Replit Coding Agent Can Do — Full Capabilities

**Website:**
- Add, edit, or remove any page
- Change copy, layout, colours, typography
- Add new sections, components, or features
- Fix bugs and broken functionality
- Optimise for performance and SEO (meta tags, structured data, noindex rules)
- Update the chatbot behaviour, appearance, and responses

**API and backend:**
- Add new API endpoints
- Build new automation workflows (cron jobs, schedulers, processors)
- Integrate with third-party APIs (payment processors, CRMs, scheduling tools)
- Modify email templates and sending logic
- Add webhook handlers

**Database:**
- Add new tables or columns
- Run queries and migrations
- Expose data through admin endpoints
- Build reporting and analytics queries

**Content studio:**
- Create, edit, and organise all 39 sections
- Write new content documents in correct format
- Cross-reference between sections
- Keep master spec up to date

**Integrations:**
- **Notion** — already connected. Can read and write to any Notion page or database. Used to log changelogs, track leads, update the "VitalMatrix is LIVE" operational page.
- **GitHub** — can push the entire content studio to GitHub repository (https://github.com/Sfaisal1975/Vitalmatrix-contentstudio) once GITHUB_TOKEN secret is added by Dr Faisal in Replit settings.
- **Resend** — email sending, already live
- **LinkedIn, Facebook, Instagram, X** — social posting code is built and ready; needs credentials added as Replit secrets
- **Stripe / payment processors** — can build payment integration for founding cohort fees
- **Calendly** — already referenced in nurture emails; can build deeper integration (auto-log bookings, trigger follow-up sequences)

**What the Replit agent cannot do:**
- It cannot create social media accounts or log into platforms on Dr Faisal's behalf
- It cannot make regulatory or clinical decisions
- It cannot add Replit secrets — Dr Faisal must add these himself in Replit Settings → Secrets

---

## PART D — GITHUB INTEGRATION

### What GitHub Integration Does
When active, every file in the content studio (all 39 sections, all markdown files) gets pushed automatically to the GitHub repository at https://github.com/Sfaisal1975/Vitalmatrix-contentstudio

This means:
- A version-controlled history of every content change
- The ability to see who changed what and when
- A backup of all content studio files outside of Replit
- The ability to share content studio access with collaborators via GitHub

### How to Activate It
1. Go to GitHub.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Create a new token with `repo` scope (full repository access)
3. Go to Replit → this project → Settings → Secrets
4. Add a new secret: Name = `GITHUB_TOKEN`, Value = the token you just generated
5. Tell the Replit coding agent "activate the GitHub sync"

The coding agent will then build the sync script that pushes content studio changes to GitHub automatically.

### What Gets Synced
All files in `/content-studio/` — every markdown document, every playbook, every template, every spec file. The master spec `ContentStudio_MasterSpecs_v2.1_2026-05-31.md` is included.

---

## PART E — NOTION INTEGRATION

### What the Notion Integration Does
Notion is connected to VitalMatrix as the external operational layer — the place Dr Faisal and W08 can see what is happening without opening Replit.

**Currently active:**
- The Replit agent can read and write any Notion page or database
- The "VitalMatrix is LIVE" page (Page ID: 36dc2e2d-3782-812e-8810-dd1ad5c2187f) is the main operational changelog
- Major content studio additions are logged to this page as structured changelog entries

**What can be built next:**
- **Leads database** — every enquiry form submission automatically creates a row in a Notion database with name, email, message, enquiry date, nurture sequence status, and discovery call booking status. Dr Faisal sees every lead in Notion without checking the server.
- **Content calendar in Notion** — the weekly social posts planned in Notion, then fed automatically to the social scheduler via the API
- **Founding practitioner tracker** — a Notion database tracking each of the 10 founding slots: name, onboarding stage, Lyceum activation status, first matrix date, Month 1 renewal
- **Content studio changelog** — every time a new content studio document is created or updated, a row is added to a Notion changelog database automatically

### How the Connection Works
The Notion integration is already installed in Replit. The coding agent accesses it via the Replit integrations system — no API key needed, no manual setup required. Just tell the agent what Notion database or page to write to, and it builds the integration.

---

## PART F — BRAND AND VOICE (THE NON-NEGOTIABLES)

### Platform Descriptor (Use Only This)
"Clinical intelligence platform for functional medicine practitioners"

### Absolutely Prohibited
- "Excited to share" / "thrilled to announce"
- "AI doctor" / "AI diagnosis" / "AI treatment"
- "Will cure" / "eliminates" / "reverses" / "heals"
- "Revolutionary" / "game-changing" / "disrupting healthcare"
- "I hope this email finds you well"
- "Just checking in"
- Countdown timers / manufactured scarcity
- Emojis in email subject lines or LinkedIn opening lines
- ALL CAPS for emphasis
- Rounded unverifiable numbers ("100s of algorithms")
- Superlatives ("the only", "the most advanced")

### Mandatory Clinical Disclaimer
Required on all Lyceum-adjacent and clinical platform content:
> *"VitalMatrix™ outputs are terrain support considerations only — not diagnoses."*

### NCZ™ Rules
- Always use ™ symbol: NCZ™
- Never describe outputs as diagnoses or treatment plans
- Always position as supporting the practitioner's own clinical reasoning
- Developed over 26 years of clinical practice — not a lab algorithm

### Brand Colours
- Deep Navy: #0D2B4E
- Gold: #C9A84C
- Off-White: #F4F4F2

### The Six Email Hook Types

| Type | Name | Best for |
|------|------|---------|
| 1 | Clinical Observation | N1 nurture, thought leadership |
| 2 | Direct Situation | N2 nurture, pre-call, onboarding |
| 3 | Counterintuitive | N3 nurture, LinkedIn, conference |
| 4 | Personal Story | N1 nurture (with Dr Faisal's context), founding narrative |
| 5 | Factual Anchor | N2 nurture, website, investor materials |
| 6 | Soft Close | N4 nurture, final follow-ups, launch close |

### Two Email Registers

| Register | When | Key rules |
|----------|------|-----------|
| Brand Email | Automated/campaign emails | Dark navy template, gold accents, CTA button, footer disclaimer |
| Personal Email | Post-call, check-ins, founder messages | Plain text, no template, no bullet lists, 1–3 sentences per paragraph |

---

## PART G — CLINICAL AND REGULATORY RULES

1. Only registered claims may appear in public-facing content — check Section 21 Evidence Register first
2. If a requested piece of content contains an unregistered claim, flag it: "This claim needs evidence review before publication"
3. MHRA reclassification: Section 29 Crisis Playbook governs response posture. Response deadline ~5 June 2026 — URGENT
4. VitalMatrix outputs are terrain support considerations only — not diagnoses (include this on all clinical content)
5. NCZ™ is a registered trademark — always ™
6. Never write content that guarantees outcomes, makes diagnostic claims, or describes prescribing functions

---

## PART H — CAPABILITIES MENU (WHAT TO ASK CLAUDE)

**Content Studio:**
- "Create a document for Section [N]: [topic]"
- "Review this copy against the Claims Register"
- "Cross-reference [document] with [other section]"
- "Update the master spec to include [new document]"

**Emails:**
- "Write N[2/4/6/8] nurture email — [angle]"
- "Write a post-call follow-up — PATH [A/B/C]"
- "Write a [welcome / Week 1 check-in / monthly update] email"
- "Write 5 subject line options for [email type]"

**Social Media:**
- "Write a LinkedIn post for [funnel stage] — [topic]"
- "Plan this week's social content — [theme]"
- "Turn [this email/article] into posts for all 4 platforms"
- "Write an X response to [regulatory news / clinical topic]"

**Lyceum App:**
- "Write onboarding copy for [screen/feature]"
- "Write the practitioner quick-start guide"
- "Write the NCZ™ explainer for founding practitioners"
- "Write the FAQ for founding practitioners"
- "Write [tooltip / empty state / error message] for [feature]"

**Website:**
- "Write copy for [page/section] — [practitioner/patient facing]"
- "Rewrite [section] in brand voice"
- "Write a new landing page for [campaign]"

**Strategy:**
- "Draft the MHRA crisis response for [audience]"
- "Prep discovery call notes for [practitioner context]"
- "Plan Section 29 Crisis Content Playbook"
- "What should go in Section [N]?"

---

## PART I — WHAT CLAUDE CANNOT DO (IMPORTANT)

- Cannot push files to the live website — that requires the Replit coding agent
- Cannot schedule social posts directly — requires an API call via Replit
- Cannot access the live database or server logs
- Cannot add Replit secrets — Dr Faisal must do this in Replit Settings
- Cannot create social media accounts or authenticate to platforms
- Cannot approve clinical claims — it flags them for W08 review
- Cannot make MHRA regulatory decisions — it drafts responses for legal/clinical review

**For anything technical (code changes, database, automation, integrations), instruct the Replit coding agent directly.**

---

## PART J — PENDING ACTIONS (AS OF 2026-05-31)

| Priority | Action | Who | Notes |
|----------|--------|-----|-------|
| 🔴 URGENT | Section 29 — MHRA Crisis Content Playbook | Claude + Replit agent | Deadline ~5 June 2026 |
| 🟠 HIGH | Add social media secrets to Replit | Dr Faisal | See Social-Automation-Setup.md for exact secret names |
| 🟠 HIGH | Add GITHUB_TOKEN to Replit | Dr Faisal | GitHub PAT with repo scope |
| 🟡 MEDIUM | Build Notion Leads database | Replit agent | Auto-log enquiries |
| 🟡 MEDIUM | Section 07 — Social Proof | Claude | Testimonials, case studies framework |
| 🟡 MEDIUM | Section 22 — Practitioner Communications | Claude | Practitioner-to-patient templates |
| 🟢 PLANNED | Admin health dashboard | Replit agent | Single view of all queue statuses |
| 🟢 PLANNED | Calendly deep integration | Replit agent | Auto-log bookings, trigger follow-ups |
| 🟢 PLANNED | Lyceum in-app content | Claude | Onboarding flows, guides, tooltips |

---

*End of W06 brief. Hand this document to W06 and ask it to write a Claude Projects system prompt based on all sections above. Target length: under 8,000 characters for the Projects system prompt field. W06 must preserve without compression: the mandatory disclaimer (exact wording), prohibited phrases list, v3 reservation rule, two email registers, six hook types, and the Lyceum "what it is not" list.*
