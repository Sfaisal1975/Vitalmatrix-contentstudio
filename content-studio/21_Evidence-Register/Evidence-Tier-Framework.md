# Evidence Tier Framework
**Section:** 21_Evidence-Register
**Status:** ACTIVE — applies to all VitalMatrix content containing a clinical or platform claim
**Owner:** W05 + SA
**Review gate:** W10 + SA before any tier assignment is published

---

## Tier Definitions

| Tier | Label | Description | ASA standing | Examples |
|------|-------|-------------|--------------|----------|
| T1 | Systematic Review / Meta-analysis | Peer-reviewed systematic reviews or meta-analyses of RCTs | Strongest — citable in claims | Cochrane, BMJ, Lancet systematic reviews |
| T2 | Randomised Controlled Trial | Individual peer-reviewed RCTs | Strong — citable with context | NEJM, JAMA RCTs relevant to terrain nodes |
| T3 | Observational / Cohort | Peer-reviewed observational, cohort, or case-control studies | Moderate — requires qualification | Published functional medicine cohort studies |
| T4 | Professional Consensus / Guidelines | IFM, BSEM, BANT, NHS clinical guidelines; expert consensus | Acceptable with attribution | IFM curriculum, BSEM position statements |
| T5 | Proprietary / Clinical Experience | VitalMatrix-internal architecture; Dr Faisal's clinical practice (26y) | Not citable in public claims — internal use only | NCZ™ framework, FLINT™ score, terrain computation algorithms |

---

## ASA Content Rules for VitalMatrix

VitalMatrix operates in the health sector. The ASA CAP Code (section 12) and BCAP Code apply.

**Absolute rules:**
- Never claim VitalMatrix "diagnoses," "treats," or "cures" any condition.
- Never claim outcomes for patients (e.g. "patients recover faster").
- Never imply the platform replaces clinical judgement.
- Always include the standard disclaimer: *"VitalMatrix™ outputs are terrain support considerations only and do not constitute a diagnosis. All clinical decisions remain with the registered practitioner."*
- Platform descriptor: **"clinical intelligence platform"** ONLY. Never "clinical AI platform." Never "clinical decision support."

**Permitted language (with correct tier backing):**
- "Maps terrain signals across 7 biological nodes" — T5 (proprietary, internal only or with T5 disclosure)
- "Generates working terrain architecture for practitioner review" — T5, internal
- "Aligned with IFM terrain principles" — T4 (IFM curriculum backing required)
- "Supporting structured clinical documentation" — T4/T5 combination

---

## Claim Routing Decision Tree

```
Does the content contain a claim about clinical or physiological outcomes?
  YES → Assign evidence tier → T1/T2/T3 required for public claims
  NO  → Does it describe platform functionality?
          YES → T4 or T5 acceptable → add disclaimer → W08 review
          NO  → Standard brand/marketing → W08 review only
```

---

## SA Ruling Library Integration

Cross-reference with `23_SA-Ruling-Library/` before publishing any content
containing a claim. Check for active D-series decisions that may restrict
specific language.

Current active restriction categories (check 23_ for current rulings):
- Terrain mapping claims — check D-series for "terrain" language
- Algorithmic claim quantification — check D-series for numeric claims (e.g. "5,000+")
- Practitioner outcome language — any suggestion of patient benefit requires T1/T2
