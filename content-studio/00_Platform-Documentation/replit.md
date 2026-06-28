# VitalMatrix

Clinical intelligence platform for functional medicine practitioners. Built for Dr Shahzad Faisal (MBBS, FAAMFM). Automates IFM terrain matrix generation using the proprietary NCZ™ framework — reducing multi-system case documentation from hours to under 60 seconds.

**Website:** https://vitalmatrix-transfer.replit.app
**Company:** VitalMatrix Ltd, Company No. 17046123, ICO ZC101813

---

## Run & Operate

```bash
pnpm --filter @workspace/api-server run dev       # API server
pnpm --filter @workspace/vitalmatrix run dev      # Website
pnpm --filter @workspace/content-studio run dev   # Standalone Content Studio app
pnpm --filter @workspace/db run push              # Push DB schema changes (dev only)
pnpm run typecheck                                # Full typecheck
pnpm run build                                    # Typecheck + build all
```

**Required secrets:** `DATABASE_URL`, `RESEND_API_KEY`, `ADMIN_API_KEY`, `GITHUB_TOKEN`
**Pending secrets:** Social media credentials (see `content-studio/03_Marketing-Assets/Social-Automation-Setup.md`)

---

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (`artifacts/api-server`, reads `PORT` env var)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Frontend: React + Vite (`artifacts/vitalmatrix`)
- Email: Resend
- Scheduling: node-cron
- Analytics: Google Analytics G-TRM1JTE0PB

---

## Where things live

| Location | Contents |
|----------|---------|
| `artifacts/api-server/src/routes/` | Express routes: health, chat, enquiry, status, social, cs-files |
| `artifacts/api-server/src/lib/` | email, nurtureSequence, socialScheduler, weeklyDigest, statusRecorder, logger, rate-limiter |
| `artifacts/api-server/src/index.ts` | Entry point — starts all schedulers on boot |
| `artifacts/vitalmatrix/public/vm-chatbot.js` | Chatbot widget (vanilla JS, embedded on all pages) |
| `artifacts/content-studio/` | Standalone Content Studio app (preview: /content-studio) |
| `lib/db/src/schema/` | Drizzle schema — conversations, messages, enquiries, nurture_queue, social_queue, maintenance_log, app_settings |
| `content-studio/` | 39-section content asset library |
| `content-studio/06_Brand-Assets/` | Canonical brand: Messaging Framework, Email Hooks Library, Email Style Guide |
| `content-studio/21_Evidence-Register/` | Claims Register — 12 registered clinical claims |
| `content-studio/ContentStudio_MasterSpecs_v2.2_2026-06-02.md` | Current master spec |
| `VITALMATRIX_AGENT.md` | Full agent context — load at every session start |

---

## Architecture decisions

- **Single API server for all background jobs** — nurture processor (15min), social scheduler (10min), weekly digest (Mon 09:00 UK), and chat cleanup all run inside the Express process via node-cron. Keeps infra simple for Phase 1.
- **File-based content studio** — 39 sections of markdown. Chosen over a CMS for version control, agent editability, and GitHub sync capability.
- **Admin auth via header** — `x-admin-key: [ADMIN_API_KEY]` on all admin endpoints. No session/JWT complexity for Phase 1.
- **Drizzle push over migrations** — `drizzle-kit push` used for dev schema changes. A migrations directory exists at `lib/db/migrations/` for auditable production changes.
- **Nurture sequence has no mid-sequence cancellation** — if a practitioner books a call, emails continue. Phase 2 enhancement.

---

## Product

- **Chatbot widget** — AI-assisted enquiry on all pages, with session history, privacy toggle, and unread badge
- **Enquiry form** — triggers confirmation email + practitioner notification + 4-email nurture sequence automatically
- **Nurture sequence** — Days 2/4/6/8 post-enquiry, brand-templated HTML emails via Resend
- **Social scheduler** — queue posts to LinkedIn, Facebook, Instagram, X; dispatches every 10 minutes; retry logic with terminal error detection
- **Weekly digest** — automated Monday morning operational summary
- **Content studio** — 39-section operational knowledge base with brand guides, clinical evidence, launch sequences, and playbooks
- **Standalone Content Studio app** — auth-gated React app at `/content-studio` with section browser, brand guide reader, evidence register, launch viewer, file editor (inline markdown edit + save)
- **Admin ContentStudioTab upgrades** — 4 new sub-tabs in the admin panel: Brand Guide, Launch Sequence, Evidence Register, File Browser

---

## User preferences

- Dr Faisal prefers peer-to-peer clinical register — never marketing-speak or generic health content
- Never use "excited to share", manufactured countdown urgency, or emojis in professional emails
- Clinical claims must always be cross-referenced against `21_Evidence-Register/Claims-Register.md` before publication
- v3 spec designation is RESERVED for the INTAKE form — never use v3 for content studio master spec
- Standard disclaimer required on all platform-facing content: *"VitalMatrix™ outputs are terrain support considerations only — not diagnoses."*
- Agent should load `VITALMATRIX_AGENT.md` at the start of every session for full context

---

## GitHub Sync

The VitalMatrix codebase can be synced to GitHub for version control and external editing. All sync tools live in `scripts/`.

### One-time setup

1. Create a private repository at https://github.com/new — name it `vitalmatrix`
2. In the Replit Shell, run:
   ```bash
   bash scripts/github-setup.sh https://github.com/<your-username>/vitalmatrix.git
   ```
   This adds a `github` remote and pushes the full codebase as the baseline.

### Syncing changes from GitHub → Replit

After editing pages in Claude Code or pushing commits to GitHub:

```bash
bash scripts/github-sync.sh
```

This fetches and merges from `github/main`, installs any new dependencies, and applies DB schema changes if schema files changed. After running it, restart both Replit workflows (API Server + web) from the Workflows panel.

### Workflow summary

```
Edit in Claude (local) → git push to GitHub → bash scripts/github-sync.sh in Replit → restart workflows
```

### Authentication

The setup script uses HTTPS. When prompted for credentials, use a GitHub Personal Access Token (not your password): https://github.com/settings/tokens/new — scope: `repo`.

Alternatively, use Replit's built-in Git panel (Version Control icon in the sidebar) to connect GitHub and sync directly from the UI.

---

## Gotchas

- **Notion access token:** `settings.oauth.credentials.access_token` — NOT `settings.access_token`
- **Instagram posts:** `imageUrl` is mandatory — posts without an image fail immediately and are not retried
- **LinkedIn/Meta token expiry:** Every 60 days. Set calendar reminders at 50 days.
- **DB schema changes:** Always run `cd lib/db && pnpm run push` after editing any file in `lib/db/src/schema/`
- **PORT env var:** API server reads `PORT` from environment. Never hardcode 8080.
- **MHRA reclassification:** Section 29 Crisis Playbook — response window ~5 June 2026. Flag this if deadline is within 7 days.
