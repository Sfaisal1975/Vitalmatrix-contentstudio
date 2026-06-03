# Lead Magnet 03 — Clinical Terrain Quiz
**Section:** 13_Intellectual-Property
**Format:** Web-based quiz (email-gated output)
**Status:** FRAMEWORK READY — development required
**Owner:** W08
**Funnel position:** Primary quiz funnel / website homepage CTA / social media traffic destination
**Email gate:** Yes — full terrain pattern delivered by email after submission
**Review gate:** W08 + Dr Faisal approval before any public release

---

## Why This Replaces the Zone Score Calculator

Node values (N1–N7) are computed inside VitalMatrix from clinical intake data. They do not exist independently. A practitioner cannot "enter their node values" because they have no node values until they use the platform.

What practitioners DO have is their clinical observation of the patient in front of them: what the patient presents with, what has not responded to treatment, which body systems appear to be under burden.

The Clinical Terrain Quiz translates clinical observation into a terrain pattern. It is the logical, usable version of an interactive lead magnet.

---

## Quiz Premise

**Title:** "Which terrain zones are active in your most complex patient?"

**Sub-heading:** "12 clinical questions. Under 3 minutes. Your patient's likely terrain pattern — delivered to your inbox."

**Audience:** Functional medicine practitioners with a complex patient in mind

**Instruction at start:** "Think of your most complex patient — the one whose presentation spans multiple systems and has not fully responded to your current protocols. Answer each question with that patient in mind."

---

## Scoring Logic

Each question answer contributes weighted points to one or more zones (Z1–Z5).

**Activation threshold:** If a zone accumulates 6 or more weighted points across all questions, it is flagged as LIKELY ACTIVE in the output.

**TerrainLock flag:** If Z2, Z1, and Z5 all score 6+, the output includes a TerrainLock risk flag.

**DRD indicator:** The zone with the highest weighted score is highlighted as the likely Driver zone in the output.

---

## The 12 Questions

---

### Q1 — Energy and Metabolic Function
**Question:** How would you describe your patient's energy pattern?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Persistent fatigue unresponsive to rest or sleep | +3 | | | | |
| Energy crashes after meals | +2 | +1 | | | |
| Morning fatigue, better by afternoon | | | | | +2 |
| Variable — some days normal, some days very low | +1 | +1 | | | +1 |
| Energy is not a primary complaint | 0 | | | | |

---

### Q2 — Gastrointestinal Symptoms
**Question:** Does your patient have ongoing gastrointestinal symptoms?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Yes — bloating, irregular bowel, food sensitivities | | +3 | | | |
| Yes — recurring infections, slow recovery from illness | | +2 | | | |
| Yes — reflux, upper GI discomfort | | +2 | | | |
| Mild symptoms present but not primary complaint | | +1 | | | |
| No GI symptoms | 0 | | | | |

---

### Q3 — Inflammatory and Immune Patterns
**Question:** What is your patient's inflammatory picture?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Elevated CRP/ESR with no identified cause | | +2 | | +1 | |
| History of autoimmune diagnosis or suspicion | | +3 | | | +1 |
| Recurring infections, slow healing | | +2 | | +1 | |
| No significant inflammatory history | 0 | | | | |

---

### Q4 — Hormonal Presentation
**Question:** Does your patient have hormonal symptoms?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Yes — irregular cycles, low libido, thyroid symptoms | | | | | +3 |
| Yes — weight gain/loss without dietary explanation | +2 | | | | +2 |
| Yes — temperature dysregulation, sweating, mood swings | | | | | +2 |
| Mild hormonal symptoms, not primary complaint | | | | | +1 |
| No hormonal symptoms | 0 | | | | |

---

### Q5 — Cognitive and Neurological Function
**Question:** How is your patient's cognitive function?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Brain fog — difficulty concentrating, word-finding problems | | | +3 | | |
| Mood dysregulation — anxiety, low mood, irritability | | | +2 | | +1 |
| Poor stress tolerance — disproportionate stress response | | | +2 | | +1 |
| Mild cognitive symptoms only | | | +1 | | |
| No cognitive or neurological complaints | 0 | | | | |

---

### Q6 — Musculoskeletal and Structural
**Question:** What is your patient's musculoskeletal picture?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Chronic joint pain, stiffness, reduced mobility | | | | +3 | |
| Connective tissue symptoms (hypermobility, easy bruising) | | | | +2 | |
| Slow recovery from physical exertion or injury | | | | +2 | +1 |
| Mild musculoskeletal symptoms | | | | +1 | |
| No musculoskeletal complaints | 0 | | | | |

---

### Q7 — Treatment Response History
**Question:** How has your patient responded to previous functional medicine protocols?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Initial improvement then plateau — protocols stop working | +1 | +2 | | | +1 |
| No meaningful response despite correct protocols | +1 | +3 | | | +2 |
| Response in one area but worsening in another | | +2 | +1 | | +1 |
| Partial response — some improvement but incomplete | +1 | +1 | | | |
| Good response overall | 0 | | | | |

> **Scoring note:** "No response despite correct protocols" + Z2 + Z1 + Z5 all elevated → increase TerrainLock weighting by 2 points per zone if this answer is selected

---

### Q8 — Sleep Architecture
**Question:** Describe your patient's sleep pattern.

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Difficulty falling asleep — racing mind, anxiety at night | | | +2 | | +1 |
| Waking in the night (2–4am), unable to return to sleep | | | +1 | | +2 |
| Non-restorative sleep — wakes unrefreshed | +2 | | +1 | | +1 |
| Excessive sleep requirement without feeling rested | +3 | | | | |
| Sleep is not a significant complaint | 0 | | | | |

---

### Q9 — Detoxification and Environmental
**Question:** What is your patient's detoxification picture?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Chemical sensitivities, fragrance/perfume reactions | | +1 | | +3 | |
| Alcohol intolerance — feels worse after small amounts | | | | +2 | |
| Known or suspected heavy metal or environmental exposure | | | | +3 | |
| Slow medication metabolism (requires lower doses) | | | | +2 | |
| No detoxification concerns | 0 | | | | |

---

### Q10 — Stress and HPA Axis
**Question:** How does your patient relate to stress?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Burnout history — sustained high stress, then crash | +2 | | +1 | | +2 |
| Currently under sustained high stress, functioning poorly | +1 | | +2 | | +2 |
| Stress causes GI symptoms — IBS-type response to stress | | +2 | +1 | | |
| Relatively resilient to stress | 0 | | | | |

---

### Q11 — Thyroid and Metabolic Markers
**Question:** Has your patient had thyroid or metabolic investigations?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| Thyroid markers "normal" but patient has classic thyroid symptoms | +2 | | | | +2 |
| Confirmed hypothyroid, on Levothyroxine, but still symptomatic | +2 | +1 | | | +2 |
| Elevated fasting glucose or insulin resistance markers | +3 | | | | |
| Metabolic markers unremarkable | 0 | | | | |

---

### Q12 — Multi-System Complexity
**Question:** How many body systems does this patient's presentation span?

| Answer | Z1 | Z2 | Z3 | Z4 | Z5 |
|--------|----|----|----|----|-----|
| 4 or more systems — genuinely complex multi-system case | +2 | +2 | +1 | +1 | +2 |
| 3 systems — significant complexity | +1 | +1 | +1 | | +1 |
| 2 systems — moderate complexity | | +1 | | | +1 |
| Primarily one system | 0 | | | | |

---

## Output Logic

### Score Calculation
After all 12 questions, total the weighted points per zone:

- **Z1 score ≥ 6** → Z1 flagged as LIKELY ACTIVE (Metabolic-Energetic Terrain)
- **Z2 score ≥ 6** → Z2 flagged as LIKELY ACTIVE (Gastrointestinal Terrain)
- **Z3 score ≥ 6** → Z3 flagged as LIKELY ACTIVE (Cognitive-Neurological Terrain)
- **Z4 score ≥ 6** → Z4 flagged as LIKELY ACTIVE (Musculoskeletal-Structural Terrain)
- **Z5 score ≥ 4** → Z5 flagged as LIKELY ACTIVE ⚠ (Hormonal Terrain — lower threshold, mirroring Z5 activation at 32 not 40)

### TerrainLock Flag
If Z2, Z1, and Z5 are ALL flagged as active → add TerrainLock risk warning to output:
*"Your pattern shows simultaneous burden across Z2, Z1, and Z5. This is consistent with the TerrainLock cascade loop (Z2→Z1→Z5→Z2). Standard single-zone protocols often fail in this pattern. See the TerrainLock Detection Guide (delivered with your results)."*

### Driver Zone Indicator
Highest scoring zone = likely Driver. Present as: *"Based on your responses, Z[X] — [Zone Name] — is carrying the highest burden in this patient's terrain picture."*

---

## Email Output (delivered after form submission)

**Subject:** Your patient's terrain pattern — [First name]

**Content:**
1. Summary of active zones (flagged in zone colour)
2. Driver zone highlighted
3. TerrainLock flag if triggered
4. Suggested APEX tier based on number of active zones
5. Attached: Zone Composition Reference Card (PDF)
6. Attached: TerrainLock Detection Guide (PDF) if TerrainLock triggered
7. CTA: "Book a clinical walkthrough to run this properly with your actual patient data"

---

## Technical Build Notes

- Build as standalone page: `vitalmatrix.co.uk/terrain-quiz/`
- Progress bar: question 1 of 12
- No back-navigation within quiz (reduces abandonment)
- Email capture on final page BEFORE results render (standard quiz funnel pattern)
- Results page: render immediately after email captured — do not make them wait for email
- Email: deliver results within 60 seconds via Resend + include lead magnet PDFs as attachments
- Mobile-first: majority of practitioners will take this on mobile
- No cookie wall before quiz — consent banner after completion only
- GDPR note on email capture form: "Your email will be used to deliver your results and occasional VitalMatrix updates. Unsubscribe anytime."

---

## Connection to Quiz Funnel (Website)

The user has noted they will add a quiz funnel to the website. This IS the quiz funnel. The same question set serves both purposes:

- As a **lead magnet**: standalone page, email-gated, drives practitioner list growth
- As a **website quiz funnel**: embedded on landing page or homepage, drives demo bookings

Same logic. Same output. Different CTA at the end:
- Lead magnet version CTA: "Download your terrain pattern summary"
- Quiz funnel version CTA: "Book a walkthrough — see this with your actual patient"

---

## Claims Register Check Required

Before publication, verify the following implied claims:
- Zone activation thresholds (Z5 at 32) — check CR against Claims Register
- TerrainLock clinical description — check CR-[relevant entry]
- Cascade stack directionality descriptions — check CR
- Any specific clinical associations implied by questions (e.g. thyroid-gut connection)

