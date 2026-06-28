# VitalMatrix — Permissions, Approvals & Data Flows
**Date:** 2026-06-28  
**Author:** Dr Shahzad Faisal (MBBS, FAAMFM)  
**Purpose:** Plain-English record of every feature that requires consent, permission, or approval — from visitors, from Dr Faisal, or from third-party platforms.

---

## Section 1 — What Website Visitors Are Asked to Allow

### 1a. Cookie Consent Banner
- **Shown on:** All 30 pages, on first visit
- **Text shown to visitor:** *"We use analytics to understand how visitors use this site. No patient data is collected."*
- **Options:** Accept analytics / Decline
- **What happens if accepted:** Google Analytics G-TRM1JTE0PB activates and begins tracking page views and interactions
- **What happens if declined:** No analytics data is collected; the visitor's session is not tracked
- **Patient data:** Never stored in analytics — confirmed in banner copy and in `TrustSafety_latest.html`

### 1b. Chatbot Privacy Toggle
- **Shown on:** All 30 pages (inside the chatbot widget)
- **What it does:** Visitor can switch "Private mode" on at any time during a conversation
- **What happens when enabled:** Session ID is not persisted; messages are not stored to the database; the conversation exists only for the current page load
- **What happens when disabled (default):** Session ID is stored locally in the browser; messages are saved to the `conversations` and `messages` database tables so the conversation can resume on return visits
- **Who can see stored conversations:** Admin only (via the admin panel Chat Sessions tab)

### 1c. Enquiry Form Consent
- **Shown on:** Contact page and Lead Gen Landing page
- **What visitor confirms:** Their name, email, practice type, and message can be stored and used to send relevant follow-up information
- **What is stored:** Name, email, role, practice type, message text, source page, submission timestamp — stored in the `enquiries` database table
- **What is sent automatically after submission:**
  1. Confirmation email to the visitor
  2. Notification email to Dr Faisal at `hello@vitalmatrix.co.uk`
  3. 4-email nurture sequence over 8 days (Days 2, 4, 6, 8)
- **GDPR basis:** Legitimate interest (B2B professional enquiry); no sensitive/patient data collected

---

## Section 2 — Features Dr Faisal Approved During the Build

These are automated features that run without further manual action. Each was explicitly discussed and approved before being activated.

### 2a. Nurture Email Sequence
- **Approved:** Yes
- **What it does:** After every enquiry form submission, automatically sends 4 follow-up emails to the enquirer on Days 2, 4, 6, and 8
- **Sent from:** `Dr Shahzad Faisal | VitalMatrix <hello@vitalmatrix.co.uk>`
- **Content:** Clinical peer-to-peer register; no countdown timers, no manufactured urgency
- **Can it be stopped mid-sequence?** Not currently — Phase 2 will add cancellation if the practitioner books a call
- **Reference:** `34_Launch-Sequence/Nurture-Emails-Week1-Week4.md`

### 2b. Weekly Digest Email
- **Approved:** Yes
- **What it does:** Every Monday at 09:00 UK time, automatically emails an operational summary to `hello@vitalmatrix.co.uk`
- **Contents:** Enquiry count, chat session stats, nurture queue status, social queue status
- **No action required** from Dr Faisal for it to run

### 2c. Chat Session Cleanup (Automated Deletion)
- **Approved:** Yes
- **What it does:** Automatically deletes old chat sessions beyond a configurable age threshold
- **Audit trail:** Every cleanup run is logged to the `maintenance_log` database table with timestamp and count of deleted records
- **Viewable in:** Admin panel → Status tab → Cleanup History

### 2d. Social Media Scheduler
- **Approved:** Yes
- **What it does:** Reads posts from the `social_queue` database table and automatically publishes them to LinkedIn, Facebook, Instagram, and X every 10 minutes
- **Current status:** Built and running — but will not post anything until social platform credentials are added as Replit secrets
- **Posts only what Dr Faisal queues** via the admin panel Social tab — it does not generate or post content autonomously
- **Reference:** `03_Marketing-Assets/Social-Automation-Setup.md` for credential setup

### 2e. GitHub Sync
- **Approved:** Yes
- **What it does:** Pushes all Content Studio markdown files to `https://github.com/Sfaisal1975/Vitalmatrix-contentstudio`
- **Credentials used:** `GITHUB_TOKEN` — a Personal Access Token stored as a Replit secret
- **Scope:** Only pushes content studio files; does not push application code or database credentials
- **97 files synced** as of 2026-06-03; documentation subsection added 2026-06-28

### 2f. Notion Integration
- **Approved:** Yes
- **What it does:** Reads from and writes to Dr Faisal's Notion workspace
- **Key page connected:** "🚀 VitalMatrix is LIVE" — Page ID `36dc2e2d-3782-812e-8810-dd1ad5c2187f`
- **Used for:** External changelog and CRM layer; major content studio changes are logged there
- **Credentials:** OAuth access token via Replit Notion integration

### 2g. Admin Panel — Full Data Access
- **Approved:** Yes
- **What it exposes:** All enquiry submissions, all chat sessions and message content, nurture queue, social queue, maintenance log
- **Access control:** Protected by `ADMIN_API_KEY` — must be sent as `x-admin-key` header on all admin API calls, or as `Authorization: Basic admin:<key>` for content studio routes
- **Who has access:** Only someone who knows the `ADMIN_API_KEY` value

### 2h. Rate Limiting
- **Approved:** Yes
- **What it does:** Automatically blocks or throttles IP addresses making excessive requests to the chatbot or enquiry form endpoints
- **Purpose:** Prevents abuse, spam submissions, and server overload
- **No notification** is sent when an IP is rate-limited — they simply receive a 429 response

---

## Section 3 — Data Flow Summary

```
Visitor arrives on any of 30 pages
│
├── Accepts cookies → Google Analytics activates
│
├── Opens chatbot
│   ├── Privacy mode OFF (default) → session stored in DB (conversations, messages)
│   └── Privacy mode ON → no DB storage; session exists only in browser memory
│
└── Submits enquiry form → enquiry stored in DB
    ├── Confirmation email sent to visitor (Resend)
    ├── Notification email sent to Dr Faisal (Resend)
    └── Nurture queue entry created
        ├── Day 2 email → sent automatically
        ├── Day 4 email → sent automatically
        ├── Day 6 email → sent automatically
        └── Day 8 email → sent automatically

Every Monday 09:00 UK → Weekly digest email to Dr Faisal

Every 10 minutes → Social scheduler checks queue → posts if credentials present

On schedule → Chat cleanup → old sessions deleted → logged to maintenance_log

Dr Faisal (via admin panel) → queues social posts → scheduler picks up and posts
```

---

## Section 4 — What Is Never Stored

- No patient health data, clinical records, or treatment information
- No payment card data (no payment processing on this site)
- No passwords (admin access is key-based, not password-based)
- No biometric or sensitive personal data (as defined by UK GDPR Article 9)
- Analytics data is aggregated and anonymised at source (Google Analytics)

---

## Section 5 — Compliance References

| Document | Location |
|----------|----------|
| Privacy Policy | `Privacy_latest.html` |
| Cookie Policy | `CookiePolicy_latest.html` |
| Trust & Safety | `TrustSafety_latest.html` |
| Clinical Ethics | `ClinicalEthics_latest.html` |
| ICO Registration | ZC101813 |
| Company Registration | VitalMatrix Ltd — No. 17046123 |
| MHRA Crisis Playbook | `29_Crisis-Content-Playbook/` |
