# VitalMatrix Claims Register
**Section:** 21_Evidence-Register
**Status:** ACTIVE — update every time a new claim appears in published content
**Owner:** W05
**Review gate:** W10 + SA

---

## How to Use This Register

Every factual or clinical claim in VitalMatrix content must have an entry here before it is published. Column definitions:

- **Claim ID:** Sequential, format `CR-001`
- **Claim text:** Exact wording as it appears in content
- **Tier:** T1–T5 (see Evidence-Tier-Framework.md)
- **Source:** Citation, document, or proprietary reference
- **Public use:** YES (T1–T4 with correct qualification) / INTERNAL ONLY (T5)
- **Status:** APPROVED / UNDER REVIEW / QUARANTINED

---

## Register

| Claim ID | Claim text | Tier | Source | Public use | Status |
|----------|-----------|------|--------|-----------|--------|
| CR-001 | "26 years of clinical experience" | T5 | Dr Faisal clinical record | YES | APPROVED |
| CR-002 | "Fellow of the American Academy of Functional Medicine (FAAMFM)" | T4 | AAFM accreditation | YES | APPROVED |
| CR-003 | "Harley Street clinical practice" | T5 | Practice record | YES | APPROVED |
| CR-004 | "Clinical (terrain) intelligence platform" | T5 | Platform descriptor — proprietary definition | YES | APPROVED |
| CR-005 | "7 biological nodes" | T5 | NCZ™ proprietary architecture | INTERNAL / YES with T5 disclosure | APPROVED |
| CR-006 | "5 terrain zones" | T5 | NCZ™ proprietary architecture | INTERNAL / YES with T5 disclosure | APPROVED |
| CR-007 | "5,000+ terrain computation algorithms" | T5 | Proprietary platform architecture | YES — functional description, not outcome claim | APPROVED |
| CR-008 | "Generates working terrain architecture for practitioner review" | T5 | Platform function description | YES — with standard disclaimer | APPROVED |
| CR-009 | "Aligned with IFM terrain principles" | T4 | IFM curriculum (Institute for Functional Medicine, 2023) | YES — with IFM attribution | UNDER REVIEW |
| CR-010 | "FLINT™ score" | T5 | Proprietary scoring framework | YES — with definition; not a diagnostic claim | APPROVED |
| CR-011 | "Cascade burden map" | T5 | NCZ™ proprietary architecture | YES — with T5 disclosure | APPROVED |
| CR-012 | "Structured clinical documentation" | T4/T5 | IFM matrix documentation practice; Dr Faisal 26y experience | YES — with standard disclaimer | APPROVED |

---

## Standard Disclaimer (must appear on all published content containing T5 claims)

> *VitalMatrix™ outputs are terrain support considerations only and do not constitute a diagnosis. All clinical decisions remain with the registered practitioner.*

---

## Quarantined Claims

Claims that have been used previously and are now suspended pending review:

| Claim ID | Claim text | Reason quarantined | Date |
|----------|-----------|--------------------|------|
| — | None currently quarantined | — | — |

---

## Adding a New Claim

1. Assign the next `CR-XXX` ID
2. Assign an evidence tier (see Evidence-Tier-Framework.md)
3. Identify source / backing
4. Set status to UNDER REVIEW
5. Submit W10 + SA review request (see `_Templates/W08-Review-Request-Template.md`)
6. Only change to APPROVED after review sign-off
