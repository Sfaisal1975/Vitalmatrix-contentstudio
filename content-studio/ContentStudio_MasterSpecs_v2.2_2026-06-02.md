# VitalMatrix Content Studio — Master Specification v2.2
**Date:** 2026-06-02  
**Author:** Dr Shahzad Faisal (MBBS, FAAMFM)  
**Status:** Active  
**Previous:** ContentStudio_MasterSpecs_v2.1_2026-05-31.md

---

## What Changed in v2.2

- Standalone Content Studio app built and deployed at `/content-studio`
- Admin ContentStudioTab upgraded with 4 new sub-tabs: Brand Guide, Launch Sequence, Evidence Register, File Browser
- New API routes: `GET /admin/cs-files/sections`, `/sections/:id/files`, `/file`, `/master-spec`, `/search`; `PUT /admin/cs-files/file`
- API OpenAPI spec updated; generated React Query hooks: `useListCsSections`, `useListCsSectionFiles`, `useGetCsFile`, `useSaveCsFile`, `useGetCsMasterSpec`, `useSearchCsFiles`
- GitHub sync complete: 97 files pushed to `Sfaisal1975/Vitalmatrix-contentstudio` under `content-studio/` prefix (2026-06-03)

---

## Purpose

The Content Studio is the operational nerve centre for all VitalMatrix content assets. It provides:

1. A structured 39-section library of markdown files covering brand, clinical evidence, marketing, IP, launch sequences, and operational playbooks
2. A standalone internal app for Dr Faisal to browse, read, and edit content files
3. An admin interface within the VitalMatrix admin panel for the same content (admin-only)
4. API routes to serve content files securely (Basic auth, ADMIN_API_KEY)

---

## Architecture

### Content Files (Source of Truth)

All content lives in `content-studio/` as markdown files. This is the source of truth. Git controls version history.

```
content-studio/
├── 01_Research-Library/
├── 02_Core-Content/
├── 03_Marketing-Assets/
├── 04_Website-Content/
...
├── 34_Launch-Sequence/
│   ├── Founding-Narrative.md
│   └── Launch-Email-Sequence.md
...
├── 36_Dr-Faisal-Personal-Brand/
├── 21_Evidence-Register/
│   └── Claims-Register.md
├── 06_Brand-Assets/
│   ├── Voice-and-Tone-Guide.md
│   ├── Messaging-Framework.md
│   ├── Email-Hooks-Library.md
│   └── Email-Style-Guide.md
├── ContentStudio_MasterSpecs_v2.2_2026-06-02.md
└── [master spec files]
```

### API Routes (`artifacts/api-server/src/routes/content-studio-files.ts`)

All routes under `/api/admin/cs-files/` — require `Authorization: Basic admin:<ADMIN_API_KEY>`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/cs-files/sections` | List all 39 sections with file counts and populated status |
| GET | `/admin/cs-files/sections/:id/files` | List all .md files in a section |
| GET | `/admin/cs-files/file?path=...` | Fetch content of a specific file |
| PUT | `/admin/cs-files/file` | Save content to a specific file (body: `{path, content}`) |
| GET | `/admin/cs-files/master-spec` | Serve the current master spec |
| GET | `/admin/cs-files/search?q=...` | Full-text search across all .md files |

### Standalone App (`artifacts/content-studio/`)

React + Vite app served at `/content-studio`. Auth-gated: admin key stored in `localStorage` key `vm_cs_key`.

**Pages:**

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Grid of all 39 sections; global search |
| `/sections/:id` | Section | File list for a section |
| `/file?path=...` | File Viewer | Read + inline edit with save |
| `/brand` | Brand Guide | Voice & Tone, Messaging Framework, Email Hooks Library, Email Style Guide |
| `/evidence` | Evidence Register | Claims Register as searchable table |
| `/launch` | Launch Sequence | Founding Narrative + Launch Email Sequence |
| `/master-spec` | Master Spec | Current master specification |

### Admin Tab (`artifacts/vitalmatrix/src/pages/content-studio-tab.tsx`)

Sub-tabs added in v2.2 (separated by a divider from the original tabs):

- **Brand Guide** — Voice & Tone, Messaging Framework, Email Hooks Library, Email Style Guide (tab switcher)
- **Launch Sequence** — Founding Narrative, Launch Email Sequence (tab switcher)
- **Evidence Register** — Claims Register as searchable table with tier colour coding
- **File Browser** — Browse all 39 sections; click to drill into files and read content inline

---

## Content Register

### Populated Sections (as of 2026-06-02)

| Section | Files | Key Assets |
|---------|-------|------------|
| 06_Brand-Assets | 4 | Voice-and-Tone, Messaging-Framework, Email-Hooks-Library, Email-Style-Guide |
| 34_Launch-Sequence | 2+ | Founding-Narrative, Launch-Email-Sequence, Nurture W1–W12, Pain-Point-Emails |
| 21_Evidence-Register | 2 | Claims-Register, Evidence-Tier-Framework |
| 36_Dr-Faisal-Personal-Brand | 2 | Bio-Library, LinkedIn-Profile-Copy |
| 11_Demo-Call-Materials | 3 | Pre-Call, Demo Script, Post-Call |
| 20_Practitioner-Onboarding | 4 | Welcome, Programme Brief, Terrain Matrix Guide, FAQ |
| 13_Intellectual-Property | 3 | NCZ Framework, Terrain Scoring, IP Register |
| 03_Marketing-Assets | 5 | Social templates, campaign briefs |
| 02_Core-Content | 1 | Blog-Post-Content-Bank |

---

## Clinical Claims Policy

All clinical or health efficacy claims in any content must be:

1. Listed in `21_Evidence-Register/Claims-Register.md`
2. Tagged with an evidence tier (Tier 1–3)
3. Accompanied by the standard disclaimer on platform-facing content:
   *"VitalMatrix™ outputs are terrain support considerations only — not diagnoses."*

---

## Brand Rules (summary)

- **Register:** Peer-to-peer clinical, never marketing
- **Never use:** "excited to share", countdown timers, GIFs, emojis in email, ALL CAPS subjects
- **Hook types:** TYPE 1 (Clinical Observation) through TYPE 6 (Soft Close) — see Email-Hooks-Library.md
- **Colours:** Navy `#0D2B4E`, Gold `#C9A84C`, Teal `#4ECDC4`
- **Two registers:** Brand Email (dark navy template) vs Personal Email (plain text)
- **CTA labels:** UPPERCASE, end with →

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v2.0 | 2026-05-20 | Initial master spec |
| v2.1 | 2026-05-31 | API routes designed; sections populated |
| v2.2 | 2026-06-03 | Standalone app + admin tab upgrades deployed; 97 files synced to GitHub (`Sfaisal1975/Vitalmatrix-contentstudio`) |

**v3 designation is RESERVED for the INTAKE form — never use v3 for content studio spec.**
