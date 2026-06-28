# VitalMatrix Agent Context
**File purpose:** Instant orientation for the agent at every session start.
**Load this file first.** Then check `.agents/memory/MEMORY.md` for session-specific lessons.
**Last updated:** 2026-06-01

---

## 1. Who This Is For and What This Project Is

**Dr Shahzad Faisal** — MBBS, FAAMFM. UK functional medicine practitioner with 26 years of clinical experience. Founder of VitalMatrix Ltd (Company No. 17046123, ICO ZC101813). Based in the UK, Harley Street adjacent.

**VitalMatrix** is a terrain intelligence platform for functional medicine practitioners. The core clinical tool is **Lyceum**, which automates IFM-style terrain matrix generation using the proprietary **NCZ™ framework** (7 biological nodes × 5 terrain zones) — reducing multi-system case documentation from hours to under 60 seconds. Practitioners retain full clinical judgement. VitalMatrix structures what they already know.

**Current phase:** Phase 1 — Practitioner Acquisition. Target: 10 founding practitioners at a founding price. Phase 2 is post-cohort scale.

**Website:** https://vitalmatrix-transfer.replit.app
**Email:** hello@vitalmatrix.co.uk
**Calendly:** https://calendly.com/vitalmatrix-discovery-call/30min

---

## 2. Dr Faisal's Communication Preferences

- Peer-to-peer register — he is the expert, not the customer
- Clinical specificity always outperforms generic health content
- Never use "excited to share", countdown timers, or manufactured urgency
- He values precision: exact figures, exact dates, exact claims
- Email persona: always "Dr Shahzad Faisal | VitalMatrix" from `hello@vitalmatrix.co.uk`
- He is building this alongside clinical practice — respect his time, be efficient

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces |
| Runtime | Node.js 24, TypeScript 5.9 |
| Frontend | React + Vite (`artifacts/vitalmatrix`) |
| API | Express 5 (`artifacts/api-server`, port from `PORT` env var) |
| Database | PostgreSQL + Drizzle ORM (`lib/db`) |
| Email | Resend (`RESEND_API_KEY` secret) |
| Scheduling | node-cron (nurture processor every 15min, social scheduler every 10min, weekly digest Mondays 09:00 UK) |
| Analytics | Google Analytics G-TRM1JTE0PB |
| Chatbot | `artifacts/vitalmatrix/public/vm-chatbot.js` (vanilla JS widget embedded in all pages) |

**DB push command:** `cd lib/db && pnpm run push`
**API server restart:** Use the `artifacts/api-server: API Server` workflow

---

## 4. Repository Map

```
/
├── artifacts/
│   ├── api-server/           Express API (port $PORT)
│   │   └── src/
│   │       ├── index.ts      Entry point — starts all schedulers
│   │       ├── app.ts        Express setup, /api prefix
│   │       ├── routes/       health, chat, enquiry, status, social
│   │       └── lib/          email, nurtureSequence, socialScheduler,
│   │                         weeklyDigest, statusRecorder, logger, rate-limiter
│   ├── mockup-sandbox/       Canvas/design preview server
│   └── vitalmatrix/          React+Vite website
│       └── public/
│           └── vm-chatbot.js Chatbot widget (vanilla JS)
├── lib/
│   └── db/
│       └── src/schema/       DB schema files (Drizzle)
│           ├── index.ts      Exports all tables
│           ├── conversations.ts
│           ├── messages.ts
│           ├── enquiries.ts
│           ├── nurture_queue.ts
│           ├── social_queue.ts
│           ├── app_settings.ts
│           └── maintenance_log.ts
└── content-studio/           All content assets (39 sections)
    ├── 03_Marketing-Assets/  Social media calendar + automation setup
    ├── 06_Brand-Assets/      Messaging framework, email hooks, email style guide
    ├── 11_Demo-Call-Materials/
    ├── 19_Content-Pipeline/  Phase 1 Practitioner Acquisition Playbook
    ├── 20_Practitioner-Onboarding/
    ├── 21_Evidence-Register/ Claims register (12 registered claims)
    ├── 34_Launch-Sequence/
    └── 36_Dr-Faisal-Personal-Brand/
```

---

## 5. Live Systems and Their Status

### Nurture Email Sequence (LIVE)
- 4 emails: Day 2, 4, 6, 8 post-enquiry
- Triggers on enquiry form submission
- DB table: `nurture_queue`
- Processor: `artifacts/api-server/src/lib/nurtureSequence.ts`
- From: `Dr Shahzad Faisal | VitalMatrix <hello@vitalmatrix.co.uk>`
- Template: dark navy (#0D2B4E) with gold (#C9A84C) — see `06_Brand-Assets/Email-Style-Guide.md`

### Social Media Scheduler (LIVE — awaiting credentials)
- Platforms: LinkedIn, Facebook, Instagram, X
- DB table: `social_queue`
- Scheduler: `artifacts/api-server/src/lib/socialScheduler.ts`
- Runs every 10 minutes
- Admin endpoints: `POST /api/social/schedule`, `GET /api/social/queue`, `DELETE /api/social/queue/:id`, `GET /api/social/history`
- **BLOCKED:** Needs `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN`, `META_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`, `INSTAGRAM_ACCOUNT_ID`, `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` added as Replit secrets
- Reference: `content-studio/03_Marketing-Assets/Social-Automation-Setup.md`

### Weekly Digest (LIVE)
- Runs Mondays 09:00 UK time
- Scheduler: `artifacts/api-server/src/lib/weeklyDigest.ts`

### Maintenance Log (LIVE)
- `maintenance_log` DB table records every chat cleanup run
- Admin endpoint: `GET /api/chat/stats`

### Chatbot Widget (LIVE)
- Embedded on all website pages
- Session persistence, privacy toggle, unread badge
- File: `artifacts/vitalmatrix/public/vm-chatbot.js`

### Enquiry Form (LIVE)
- `POST /api/enquiry`
- Sends confirmation to enquirer + notification to Dr Faisal
- Triggers nurture sequence automatically

---

## 6. Secrets and Environment Variables

| Secret name | Purpose | Status |
|-------------|---------|--------|
| `RESEND_API_KEY` | All outbound email | ✅ Set |
| `ADMIN_API_KEY` | Admin endpoint auth header (`x-admin-key`) | ✅ Set |
| `DATABASE_URL` | PostgreSQL connection | ✅ Set |
| `LINKEDIN_ACCESS_TOKEN` | LinkedIn posting | ⏳ Pending — Dr Faisal to add |
| `LINKEDIN_PERSON_URN` | LinkedIn author URN | ⏳ Pending |
| `LINKEDIN_ORG_URN` | LinkedIn company page URN | ⏳ Pending |
| `META_ACCESS_TOKEN` | Facebook + Instagram posting | ⏳ Pending |
| `FACEBOOK_PAGE_ID` | Facebook page ID | ⏳ Pending |
| `INSTAGRAM_ACCOUNT_ID` | Instagram account ID | ⏳ Pending |
| `X_API_KEY` | X (Twitter) API key | ⏳ Pending |
| `X_API_SECRET` | X API secret | ⏳ Pending |
| `X_ACCESS_TOKEN` | X access token | ⏳ Pending |
| `X_ACCESS_TOKEN_SECRET` | X access token secret | ⏳ Pending |
| `GITHUB_TOKEN` | GitHub sync PAT | ⏳ Pending — for content studio sync |

---

## 7. Content Studio Structure

The content studio (`/content-studio/`) is a file-based knowledge system with 39 numbered sections. Do not create new sections without checking this map first.

| Section | Name | Status |
|---------|------|--------|
| 01 | Research Library | Exists |
| 02 | Core Content | Exists |
| 03 | Marketing Assets | **ACTIVE** — Social calendar + automation setup |
| 04 | Website Content | Exists |
| 05 | Repurposing Matrix | Exists |
| 06 | Brand Assets | **ACTIVE** — Messaging Framework, Email Hooks Library, Email Style Guide |
| 07 | Social Proof | Exists |
| 08 | Competitive Intelligence | Exists |
| 09 | SEO Research | Exists |
| 10 | Analytics Data | Exists |
| 11 | Demo Call Materials | **ACTIVE** |
| 12 | Multimedia Library | Exists |
| 13 | Intellectual Property | Exists |
| 14 | Relationship Capital | Exists |
| 15 | Business Intelligence | Exists |
| 16 | Legacy Archive | Exists |
| 17 | Innovation Lab | Exists |
| 18 | Regulatory Compliance | Exists — MHRA critical |
| 19 | Content Pipeline | **ACTIVE** — Phase 1 Practitioner Acquisition Playbook |
| 20 | Practitioner Onboarding | **ACTIVE** |
| 21 | Evidence Register | **ACTIVE** — 12 registered claims |
| 22 | Practitioner Communications | Exists |
| 23 | SA Ruling Library | Exists |
| 24 | Content DeltaScan | Exists |
| 25 | (gap) | — |
| 26 | Window Sync Protocol | Exists |
| 27 | Cohort Personalisation | Exists |
| 28 | Content ROI Tracker | Exists |
| 29 | Crisis Content Playbook | **URGENT** — MHRA reclassification ~5 June 2026 |
| 30 | Localisation Framework | Exists |
| 31 | Proof of Value Engine | Exists |
| 32 | Referral Content Machine | Exists |
| 33 | Conference Content Kit | Exists |
| 34 | Launch Sequence | **ACTIVE** |
| 35 | Screenshot Library | Exists |
| 36 | Dr Faisal Personal Brand | **ACTIVE** |
| 37 | Learning Loop Architecture | Exists |
| 38 | Learning Channels | Exists |
| 39 | Evolution Reports | Exists |

**Master spec:** `content-studio/ContentStudio_MasterSpecs_v2.1_2026-05-31.md`
**v3 designation is RESERVED for the INTAKE form spec — never use v3 for anything else.**

---

## 8. Notion Integration

- Integration: `notion` (installed via Replit integrations)
- Access token: retrieved via `listConnections('notion')` → `settings.oauth.credentials.access_token`
- Key page: "🚀 VitalMatrix is LIVE" — Page ID: `36dc2e2d-3782-812e-8810-dd1ad5c2187f`
- Notion is the external changelog/CRM layer — major content studio additions should be logged there

---

## 9. Brand Colours (Canonical)

| Name | Hex | Usage |
|------|-----|-------|
| Deep Navy | `#0D2B4E` | Email background, primary dark |
| Gold | `#C9A84C` | Accent, CTAs, brand mark |
| Off-White | `#F4F4F2` | Body text on dark backgrounds |
| Light Grey | `#f4f4f2` | Outer email background |
| N6 Node | see `node-colours.md` in memory | NCZ™ visualisation |
| N7 Node | see `node-colours.md` in memory | NCZ™ visualisation |

---

## 10. Clinical and Regulatory Rules

1. **Never make outcome guarantees** — "will cure", "eliminates", "reverses"
2. **All clinical claims must be registered** — check `21_Evidence-Register/Claims-Register.md` before any public-facing content
3. **Standard disclaimer** (mandatory on all platform-related content):
   > *"VitalMatrix™ outputs are terrain support considerations only — not diagnoses."*
4. **MHRA reclassification** — Section 29 Crisis Playbook is flagged URGENT. Response window ~5 June 2026.
5. **NCZ™ is a registered trademark** — always use ™ symbol. Never describe as "AI diagnosis tool."
6. **Platform descriptor** — sole authorised form: **"clinical (terrain) intelligence platform"**. Never: "clinical intelligence platform" / "terrain intelligence platform" (without "clinical") / "clinical AI platform" / "clinical decision support" / "terrain intelligence system" / "AI doctor" / "diagnostic tool" / "treatment recommendation system."
7. **Lyceum** — the core clinical tool inside VitalMatrix. Not a medical device (unless registered), not a diagnostic system, not a prescribing system, not a replacement for clinical judgement.

---

## 11. At the Start of Every Session — Checklist

1. Read `VITALMATRIX_AGENT.md` (this file) ✓
2. Check `.agents/memory/MEMORY.md` for session-specific lessons
3. Check the scratchpad in the previous session summary (if available)
4. If working on content: check `06_Brand-Assets/Messaging-Framework.md` for positioning
5. If working on emails: check `06_Brand-Assets/Email-Hooks-Library.md` and `Email-Style-Guide.md`
6. If working on clinical claims: check `21_Evidence-Register/Claims-Register.md`
7. If the MHRA deadline is within 7 days: flag Section 29 to the user before starting any other work

---

## 12. Next Priorities (as of 2026-05-31)

| Priority | Item | Notes |
|----------|------|-------|
| 🔴 URGENT | Section 29 — Crisis Content Playbook (MHRA) | Response due ~5 June 2026 |
| 🟠 HIGH | Social media credentials — Dr Faisal to add secrets | Scheduler is ready and waiting |
| 🟠 HIGH | GitHub sync — add `GITHUB_TOKEN` PAT as secret | Push to https://github.com/Sfaisal1975/Vitalmatrix-contentstudio |
| 🟡 MEDIUM | Section 07 — Social Proof | Testimonials, case studies framework |
| 🟡 MEDIUM | Section 22 — Practitioner Communications | Templates for practitioner-to-patient content |
| 🟢 PLANNED | Notion ↔ Content Studio sync | Auto-log content studio changes to Notion |
| 🟢 PLANNED | Enquiry → Notion Leads database | Auto-log enquiries as Notion rows |
| 🟢 PLANNED | Admin health dashboard | Single endpoint for all queue statuses |

---

## 13. Known Gotchas

- **Notion access token path:** `settings.oauth.credentials.access_token` — NOT `settings.access_token`
- **PORT env var:** API server reads `PORT` from environment. Never hardcode 8080 in new code.
- **DB push after schema changes:** Always run `cd lib/db && pnpm run push` after adding or modifying a schema file. The post-merge script does this automatically for task merges, but not for direct edits.
- **Social scheduler — Instagram:** Requires `imageUrl` for every post. Posts without an image will fail immediately (not retried).
- **LinkedIn token expiry:** Every 60 days. Meta tokens also every 60 days. X tokens do not expire.
- **Nurture sequence — no mid-sequence cancellation:** If a practitioner books a call mid-sequence, the nurture emails continue. Phase 2 enhancement to add cancellation logic.
- **v3 spec designation:** RESERVED for the INTAKE form. Never use v3 for content studio master spec or any other document.
- **`listConnections('github')` returns 401:** GitHub is not connected via Replit integrations. Use the `GITHUB_TOKEN` secret approach instead.
