# Phase 1 Practitioner Acquisition Playbook
**Section:** 19_Content-Pipeline
**Status:** ACTIVE — operational reference for all Phase 1 acquisition activity
**Owner:** Dr Faisal + W05
**Review gate:** Dr Faisal approval before first use
**Audience tier:** INTERNAL (D-57)
**Version:** 1.0 — 31 May 2026

---

## WHY THIS DOCUMENT EXISTS

The content studio now contains 16 content assets across 6 sections. Without this playbook, those assets are raw materials with no operational logic connecting them.

This document is the single source of truth for converting a practitioner from first enquiry to activated founding member. It tells you exactly what to do, when, using which asset, and what to do when things do not go to plan.

**If you do one thing before the first discovery call: read this document.**

---

## THE FUNNEL — 7 STAGES

```
STAGE 1 — ENQUIRY RECEIVED
        ↓
STAGE 2 — NURTURE SEQUENCE (automated, Days 2–8)
        ↓
STAGE 3 — DISCOVERY CALL BOOKED
        ↓
STAGE 4 — DISCOVERY CALL COMPLETED
        ↓
STAGE 5 — DECISION (proceed / needs time / not a fit)
        ↓
STAGE 6 — ONBOARDING (Days 0–7)
        ↓
STAGE 7 — ACTIVATED FOUNDING PRACTITIONER
```

Each stage has: a trigger, content assets deployed, the person responsible, timing, success criteria, and failure recovery.

---

## STAGE 1 — ENQUIRY RECEIVED

**Trigger:** Form submission on any VitalMatrix page
**Responsible:** System (automated) → Dr Faisal team within 24 hours

### What fires automatically (system)
| Action | Timing | Asset |
|--------|--------|-------|
| Enquiry confirmation email to practitioner | Immediate | `email.ts` → `sendEnquiryConfirmation()` |
| Enquiry notification to hello@vitalmatrix.co.uk | Immediate | `email.ts` → `sendEnquiryNotification()` |
| Nurture sequence scheduled (4 emails) | Queued for Days 2/4/6/8 | `nurtureSequence.ts` |

### What Dr Faisal's team does (manual)
| Action | Timing | Asset |
|--------|--------|-------|
| Read enquiry notification | Within 2 hours | Email inbox |
| Log practitioner in lead tracker (see below) | Same day | Lead Status Tracker (Section 7 of this document) |
| Assess enquiry quality: ICP check (see Section 5) | Same day | ICP Qualification Criteria (Section 5 of this document) |
| If HOT lead: personal email from Dr Faisal | Within 24 hours | Bespoke — reference `36_Bio-Library.md` for signature |

### Success criteria
Enquiry logged. Nurture sequence confirmed in database. Quality assessed.

### Stage 1 failure: no notification email received
Check `RESEND_API_KEY` secret and API server logs. Contact hello@vitalmatrix.co.uk manually.

---

## STAGE 2 — NURTURE SEQUENCE (automated)

**Trigger:** Automatic — fires from nurture_queue table after Stage 1
**Responsible:** System (automated) — zero manual action required unless failure

### Sequence timeline
| Email | Day | Subject | Purpose | Asset |
|-------|-----|---------|---------|-------|
| N1 | Day 2 | A bit more about Dr Faisal | Credibility — 26 years, Harley Street, why he built this | `nurtureSequence.ts` Step 1 |
| N2 | Day 4 | What VitalMatrix does in the consulting room | Clinical use case — NCZ™, FLINT™, terrain architecture | `nurtureSequence.ts` Step 2 |
| N3 | Day 6 | The founding 10 — what it means | Exclusivity — £299/mo, 60-month guarantee, founding designation | `nurtureSequence.ts` Step 3 |
| N4 | Day 8 | Is the discovery call still on your list? | Soft final nudge — no pressure, direct to Calendly | `nurtureSequence.ts` Step 4 |

### Parallel: Launch sequence (if Phase 1 window is open)
If the Launch Sequence has been activated (see `34_Launch-Sequence/Launch-Email-Sequence.md`), the practitioner may also receive L1/L2/L3 as a separate manual campaign. These are not duplicates — the nurture sequence is personal and post-enquiry; the launch sequence is broadcast and pre-close. Both can run simultaneously.

### What to watch for
- If a practitioner books a discovery call after N1 or N2: they do not need N3 and N4. **No manual cancellation is currently possible** — they will still receive the remaining emails. This is acceptable; the emails are not intrusive. Phase 2 will add booking-triggered sequence cancellation.
- If a practitioner replies to a nurture email: respond personally within 24 hours. Forward to Dr Faisal if clinical. Log the reply in the lead tracker.

### Success criteria
All 4 emails delivered. Open/reply tracked manually (check Resend dashboard). At least 1 Calendly booking per 8–12 nurture sequences is a healthy Phase 1 conversion rate.

---

## STAGE 3 — DISCOVERY CALL BOOKED

**Trigger:** Practitioner books via Calendly
**Responsible:** System (Calendly confirmation) → Dr Faisal team (pre-call prep)

### What fires
| Action | Timing | Asset |
|--------|--------|-------|
| Calendly sends booking confirmation | Immediate (Calendly auto) | Calendly system |
| Pre-call email from Dr Faisal's team | 24 hours before call | `11_Demo-Call-Materials/Pre-Call-Email.md` |
| Dr Faisal reviews lead notes before call | Day of call | Lead Status Tracker entry from Stage 1 |
| Dr Faisal reads call guide | 15 min before call | `11_Demo-Call-Materials/Discovery-Call-Script.md` |

### Pre-call prep (15 minutes before)
1. Pull up the practitioner's original enquiry message — what did they say? What language did they use?
2. Note their ICP assessment from Stage 1 — which discovery questions are most relevant?
3. Note any nurture emails they received — which one did they respond to, or which one led to the booking?
4. Have the call script open as a reference — not a script to read, a guide to return to if needed.

### Success criteria
Call takes place. Dr Faisal is prepared. Practitioner primed by pre-call email.

### Stage 3 failure: no-show
- Wait 5 minutes after scheduled start time
- Send a brief, warm email: "I had us down for [TIME] today — happy to reschedule if life got in the way. Here's the calendar link."
- Log as NO-SHOW in lead tracker
- If no response within 48 hours: one final outreach, then move to COLD status

---

## STAGE 4 — DISCOVERY CALL COMPLETED

**Trigger:** Call ends
**Responsible:** Dr Faisal — within 60 minutes of call ending

### What Dr Faisal does in the 60 minutes after the call
| Action | Timing | Asset |
|--------|--------|-------|
| Send post-call follow-up email | Within 60 minutes | `11_Demo-Call-Materials/Post-Call-Follow-Up.md` — correct version (A/B/C) |
| Log call outcome and notes in lead tracker | Within 60 minutes | Lead Status Tracker (Section 7) |
| Assess outcome: proceed / needs time / not a fit | Immediate | See Stage 5 |

### Choosing the correct post-call email version
| Outcome | Email version | Key action in email |
|---------|--------------|-------------------|
| Practitioner ready to proceed | Version A | Confirms onboarding starts — credentials within 4 hours |
| Practitioner needs more time / discussing with partner | Version B | Sends founding summary — clear Phase 1 close date |
| Not the right fit (either party) | Version C | Warm close — preserves Phase 2 relationship |

### Success criteria
Post-call email sent within 60 minutes. Outcome logged. Next action clear.

---

## STAGE 5 — DECISION

Three paths from here.

---

### PATH A — PROCEEDING

**Trigger:** Practitioner confirms yes (on call or by email reply to Version A)
**Responsible:** Dr Faisal — initiate onboarding same day

| Action | Timing | Asset |
|--------|--------|-------|
| Send welcome email | Within 2 hours of confirmation | `20_Practitioner-Onboarding/Welcome-Email.md` |
| Prepare platform credentials | Same day | Platform admin |
| Send credentials | Within 4 hours of welcome email | Platform admin |
| Schedule orientation session | Within 24 hours | Dr Faisal's team — video call, 20 minutes |
| Log as PROCEEDING → ONBOARDING in lead tracker | Same day | Lead Status Tracker |
| Update founding slots counter | Same day | Manually: decrement available slots count |

**→ Continue to STAGE 6**

---

### PATH B — NEEDS MORE TIME

**Trigger:** Post-call Version B sent. Practitioner has not yet confirmed.
**Responsible:** Dr Faisal's team — managed follow-up

| Action | Timing | Asset |
|--------|--------|-------|
| Version B email sent | Within 60 min of call | `11_Demo-Call-Materials/Post-Call-Follow-Up.md` (Version B) |
| First follow-up if no response | Day 4 after call | Brief personal note: "Checking in — any questions I can answer?" |
| Second follow-up if no response | Day 8 after call | Scarcity reminder: state Phase 1 close date explicitly |
| Decision deadline | Phase 1 close date | If no response by close date: send Version C |
| Log as PENDING in lead tracker | After call | Lead Status Tracker |

**Key rule:** Never follow up more than twice after the call. A third chase is pressure, not persistence. If they have not responded after two follow-ups plus the close-date email, they are a Phase 2 prospect — log and move on.

---

### PATH C — NOT THE RIGHT FIT

**Trigger:** Either party identified this during or after the call
**Responsible:** Dr Faisal — Version C email within 60 minutes

| Action | Timing | Asset |
|--------|--------|-------|
| Version C email sent | Within 60 min of call | `11_Demo-Call-Materials/Post-Call-Follow-Up.md` (Version C) |
| Log reason for not proceeding | Same day | Lead Status Tracker — reasons field |
| Set Phase 2 reminder | Same day | Calendar reminder with reason (e.g. "solo practice, very low case volume — revisit at Phase 2 when entry price lower") |

**Common not-a-fit reasons and Phase 2 notes:**
| Reason | Phase 2 relevance |
|--------|-----------------|
| Not IFM-trained | Revisit if VitalMatrix adds non-IFM mode |
| Low case volume (< 5 complex cases/week) | ROI does not work at this volume — revisit at Phase 2 pricing |
| NHS-only practice | Revisit when regulatory position on NHS use is confirmed |
| Tech aversion | Revisit — unlikely to change, note for file |
| Timing (maternity, sabbatical, moving) | High-priority Phase 2 contact — set specific reminder |

---

## STAGE 6 — ONBOARDING (Days 0–7)

**Trigger:** PATH A confirmed — proceeding
**Responsible:** Dr Faisal's team (Days 0–2) + Dr Faisal personally (Day 7)

### Day 0 — Activation day
| Action | Asset |
|--------|-------|
| Welcome email sent | `20_Practitioner-Onboarding/Welcome-Email.md` |
| Platform credentials issued | Platform admin |
| Log activation date in lead tracker | Lead Status Tracker — activation date field |
| Record as FOUNDING PRACTITIONER #[N] | Cohort record |

### Days 1–2 — Orientation
| Action | Asset |
|--------|-------|
| Team contacts practitioner to schedule orientation | Personal email from team |
| Orientation session held (20 min video call) | `20_Practitioner-Onboarding/Platform-Orientation-Guide.md` (reference during call) |
| Orientation guide sent as PDF after call | `20_Practitioner-Onboarding/Platform-Orientation-Guide.md` |
| First-session walkthrough shared | `20_Practitioner-Onboarding/First-Clinical-Session-Walkthrough.md` |

### Day 7 — Check-in
| Action | Asset |
|--------|-------|
| Personal email from Dr Faisal | `20_Practitioner-Onboarding/Week1-Checkin-Template.md` |
| Log response (or non-response) in lead tracker | Lead Status Tracker |
| If no response by Day 10: one follow-up | Brief personal note |
| If no response by Day 14: Dr Faisal phones directly | — |

### Success criteria
Orientation completed. First case run through platform. Week 1 check-in response received. Feedback logged for terrain engine calibration.

---

## STAGE 7 — ACTIVATED FOUNDING PRACTITIONER

**Trigger:** Practitioner has completed orientation AND run at least one case
**Status:** ACTIVE FOUNDING MEMBER

### Ongoing cadence (post-activation)
| Touchpoint | Frequency | Who | Asset (when built) |
|-----------|-----------|-----|-------------------|
| Monthly founder update email | Monthly | Dr Faisal | `22_Practitioner-Communications/` (TBD) |
| Quarterly value report | Quarterly | Team | `31_Proof-of-Value-Engine/` (TBD) |
| Feature request acknowledgement | On submission | Team | `22_Practitioner-Communications/` (TBD) |
| Annual renewal prep | 60 days before renewal | Team | `27_Cohort-Personalisation/` (TBD) |

---

## SECTION 5 — ICP QUALIFICATION CRITERIA

Not every practitioner who enquires should become a founding practitioner. With 10 slots, the wrong selection damages the terrain engine calibration. Use this at Stage 1.

### Ideal founding practitioner profile
| Criteria | Ideal | Acceptable | Disqualifying |
|----------|-------|-----------|--------------|
| IFM training | IFM certified (FAAMFM, IFMCP, or equivalent) | Functional medicine trained, non-certified | No functional medicine exposure |
| Case complexity | 5+ complex multi-system cases per week | 3–5 complex cases per week | Primarily simple/acute presentations |
| Practice type | Private functional medicine practice | Integrated/private with FM component | NHS-only (regulatory uncertainty) |
| Documentation habit | Currently uses IFM matrix or similar | Uses clinical notes but interested in structured documentation | Never documented terrain architecture |
| Tech readiness | Uses clinical software, comfortable with SaaS | Uses basic tech, willing to learn | Active technology resistance |
| Patient volume | 15+ patients per week | 8–15 patients per week | < 8 patients per week |
| Geography | UK-based | UK-based | Outside UK (MHRA/regulatory complexity) |

### HOT lead signals (prioritise personal outreach within 24h)
- Mentions specific IFM terminology in their enquiry (node, terrain, cascade, FLINT, COMPASS, etc.)
- Currently building matrices by hand and mentions time cost
- Senior/established practitioner (10+ years, known in IFM community)
- Reached out after a Dr Faisal LinkedIn post or article
- Referred by another practitioner

### WARM lead signals (standard nurture sequence, assess at call)
- Mentions functional medicine but not specific IFM methodology
- General interest in "clinical documentation tools"
- Early-career FM practitioner (high growth potential, lower immediate case volume)

### COLD lead signals (nurture sequence only, do not prioritise personal outreach)
- General health enquiry with no FM context
- Patient or patient-adjacent enquiry (not a practitioner)
- No clinical credential mentioned

---

## SECTION 6 — CONVERSION TARGETS AND BENCHMARKS

Phase 1 targets (internal — not published):

| Metric | Target | Why |
|--------|--------|-----|
| Enquiry → call booked | 25–35% | Industry B2B SaaS benchmark for niche clinical software |
| Call booked → call completed | 75%+ | No-shows are high with clinicians; pre-call email helps |
| Call completed → proceeding (PATH A) | 40–60% | High because Dr Faisal self-selects strong leads |
| Call completed → needs time (PATH B) | 20–30% | Expected; nurture to close date |
| PATH B → proceeding | 30–50% | Within Phase 1 window |
| Onboarded → activated (first case run) | 90%+ | Orientation call reduces drop-off significantly |
| Activated → Month 1 renewal | 95%+ | With Week 1 check-in and monthly founder update |

**Founding cohort target:** 10 activated practitioners before Phase 1 close date.
**Revenue at full cohort:** £35,880/year (10 × £299 × 12).
**Phase 1 close trigger:** Either all 10 slots filled, or the stated Phase 1 close date — whichever comes first.

---

## SECTION 7 — LEAD STATUS TRACKER (TEMPLATE)

Maintain this as a simple spreadsheet or Notion table. One row per practitioner.

| Field | Values |
|-------|--------|
| Name | Full name |
| Email | — |
| Practice | Practice name / location |
| Enquiry date | DD/MM/YYYY |
| ICP score | HOT / WARM / COLD |
| ICP notes | Brief: what signals triggered the score |
| Nurture emails received | N1 / N2 / N3 / N4 (tick as sent) |
| Discovery call date | DD/MM/YYYY or PENDING / NO-SHOW |
| Call outcome | PATH A / PATH B / PATH C |
| Post-call email sent | ✓ with date |
| Status | ENQUIRY / NURTURE / CALL BOOKED / CALL COMPLETED / PENDING / PROCEEDING / ONBOARDING / ACTIVE / NOT A FIT / COLD |
| Activation date | DD/MM/YYYY |
| Founding # | #1 through #10 |
| Notes | Freeform — objections raised, topics of interest, follow-up items, Phase 2 flags |

---

## SECTION 8 — FAILURE RECOVERY PROTOCOLS

### FR-01: Nurture email bounces
Check Resend dashboard. If hard bounce: email address invalid — contact Dr Faisal to send personal email from his own inbox. Log bounce in tracker.

### FR-02: Calendly booking but no pre-call email
Pre-call email is currently manual. If it was not sent, send it as soon as possible — even same-day as call if necessary. A briefer version is better than none.

### FR-03: Discovery call overruns
If the call goes beyond 30 minutes: the practitioner is engaged. Let it run — do not cut off a buying signal. Reschedule your next commitment. Log extra time as strong interest in the tracker.

### FR-04: Practitioner mentions a competitor on the call
Do not disparage. Use the counter-messages from `06_Brand-Assets/Messaging-Framework.md`. The correct response to "I've looked at [competitor]" is: "That's worth knowing — can I ask what attracted you to them? I want to understand where you see the gaps before I tell you about VitalMatrix."

### FR-05: Practitioner wants a free trial
Use the objection script from `11_Demo-Call-Materials/Discovery-Call-Script.md` ("There is no free trial in Phase 1 — the founding cohort model doesn't work with a trial structure..."). Do not improvise a trial offer — it undermines the founding cohort model and creates a precedent.

### FR-06: Phase 1 close date passes with fewer than 10 practitioners
Do not extend Phase 1 indefinitely — this destroys the scarcity model. Options:
1. Close Phase 1 at the stated date regardless of how many slots filled. Open Phase 2 on schedule.
2. Set a new close date — maximum 2-week extension, communicated once to PENDING practitioners only.
Never announce an extension publicly. It signals the platform is struggling to attract practitioners.

### FR-07: Founding practitioner goes silent after onboarding
Follow the Week 1 check-in protocol. If still no response by Day 14: Dr Faisal phones directly. If no engagement after 30 days: schedule a "30-day health check" call — this is when churn risk is highest and direct intervention has the most impact.

---

## SECTION 9 — CONTENT ASSET MASTER MAP

Every content asset in the studio, indexed by the stage of the funnel where it is used.

| Stage | Asset | Section | Status |
|-------|-------|---------|--------|
| 1 — Enquiry | Enquiry confirmation email | `api-server/email.ts` | LIVE |
| 1 — Enquiry | Enquiry notification | `api-server/email.ts` | LIVE |
| 2 — Nurture | N1: A bit more about Dr Faisal | `api-server/nurtureSequence.ts` | LIVE |
| 2 — Nurture | N2: What VitalMatrix does | `api-server/nurtureSequence.ts` | LIVE |
| 2 — Nurture | N3: The founding 10 | `api-server/nurtureSequence.ts` | LIVE |
| 2 — Nurture | N4: Is the discovery call still on your list? | `api-server/nurtureSequence.ts` | LIVE |
| 2 — Nurture | L1/L2/L3 Launch emails (manual campaign) | `34_Launch-Sequence/Launch-Email-Sequence.md` | DRAFT — W08 review |
| 3 — Call booked | Pre-call email | `11_Demo-Call-Materials/Pre-Call-Email.md` | DRAFT — W08 review |
| 4 — Call | Discovery call script | `11_Demo-Call-Materials/Discovery-Call-Script.md` | DRAFT — W08 + Dr Faisal |
| 4 — Call | Counter-messages | `06_Brand-Assets/Messaging-Framework.md` | ACTIVE |
| 4 — Call | Objection handling | `11_Demo-Call-Materials/Discovery-Call-Script.md` | DRAFT |
| 5 — Decision | Post-call email Version A (proceeding) | `11_Demo-Call-Materials/Post-Call-Follow-Up.md` | DRAFT — W08 |
| 5 — Decision | Post-call email Version B (needs time) | `11_Demo-Call-Materials/Post-Call-Follow-Up.md` | DRAFT — W08 |
| 5 — Decision | Post-call email Version C (not a fit) | `11_Demo-Call-Materials/Post-Call-Follow-Up.md` | DRAFT — W08 |
| 6 — Onboarding | Welcome email | `20_Practitioner-Onboarding/Welcome-Email.md` | DRAFT — W08 |
| 6 — Onboarding | Platform orientation guide | `20_Practitioner-Onboarding/Platform-Orientation-Guide.md` | DRAFT — W08 |
| 6 — Onboarding | First clinical session walkthrough | `20_Practitioner-Onboarding/First-Clinical-Session-Walkthrough.md` | DRAFT — W08 |
| 6 — Onboarding | Week 1 check-in | `20_Practitioner-Onboarding/Week1-Checkin-Template.md` | DRAFT — W08 |
| All stages | Voice and tone guide | `06_Brand-Assets/Voice-and-Tone-Guide.md` | ACTIVE |
| All stages | Visual identity spec | `06_Brand-Assets/Visual-Identity-Spec.md` | ACTIVE |
| All stages | Messaging framework | `06_Brand-Assets/Messaging-Framework.md` | ACTIVE |
| All stages | Evidence tier framework | `21_Evidence-Register/Evidence-Tier-Framework.md` | ACTIVE |
| All stages | Claims register | `21_Evidence-Register/Claims-Register.md` | ACTIVE |
| Prospect research | Bio library | `36_Dr-Faisal-Personal-Brand/Bio-Library.md` | DRAFT — Dr Faisal |
| Prospect research | LinkedIn profile copy | `36_Dr-Faisal-Personal-Brand/LinkedIn-Profile-Copy.md` | DRAFT — Dr Faisal |
| Authority building | Article template | `36_Dr-Faisal-Personal-Brand/Thought-Leadership-Article-Template.md` | ACTIVE |
| Founding narrative | Founding narrative | `34_Launch-Sequence/Founding-Narrative.md` | DRAFT |

---

## QUICK REFERENCE — THE 10 RULES OF PHASE 1 ACQUISITION

1. **Qualify before you nurture.** Identify HOT/WARM/COLD at Stage 1. Do not spend Dr Faisal's time on cold leads.
2. **Never pitch before you discover.** The call opens with questions, not with a demo. The discovery section changes everything.
3. **Send the post-call email within 60 minutes.** Every hour of delay reduces conversion probability.
4. **Choose the correct post-call version.** A/B/C. Sending Version A to someone in PATH B is a pressure tactic that destroys trust.
5. **Do not offer a free trial.** Use the script. Stay firm. The founding model depends on it.
6. **The founding cohort is deliberate, not desperate.** If a practitioner is not a fit, say so. Founders who are wrong for the platform damage the terrain engine and leave.
7. **Log everything.** Every call, every email, every objection. Phase 2 acquisition strategy is built on Phase 1 data.
8. **Dr Faisal's personal involvement is the single biggest conversion asset.** The personal check-in, the direct email, the phone call — these are not optional escalations. They are the strategy.
9. **Preserve Phase 2 relationships.** Every practitioner who is not a fit today is a Phase 2 prospect. Leave them warm.
10. **The close date is real.** Phase 1 closes when it closes. The scarcity is the product.

---

*This document supersedes any informal acquisition process. Update it as Phase 1 progresses — it is a living document.*
*Next review: when Founding Practitioner #5 activates, or 30 days from today, whichever comes first.*
