/**
 * Component 17: Practitioner Outreach Kit
 * EXTREMELY HIGH-YIELD
 *
 * Generates the complete founding cohort recruitment pack.
 * One command → 5 branded, compliant documents.
 * These are the materials that convert practitioners into subscribers.
 */

import { VM_BRAND } from './brand-config';

export const W08_REVIEW_REQUIRED = 'W08 REVIEW REQUIRED: This document is for external practitioner use. Do not send without W08 clearance.';

// --- Types ---

export interface OutreachConfig {
  practitionerName: string;
  practitionerTitle?: string;
  speciality?: string;
  meetingDate?: string;
  customNotes?: string;
}

export interface OutreachKit {
  discoveryCallPrep: string;
  onePageCapability: string;
  pricingBreakdown: string;
  onboardingChecklist: string;
  followUpEmail: string;
}

// --- Pricing (from VM_BRAND single source of truth) ---

const PRICING = {
  monthly: VM_BRAND.pricing.foundingMonthly,
  label: 'Founding Cohort Rate',
  month25Rate: VM_BRAND.pricing.standardRate,
  guarantee: VM_BRAND.pricing.guarantee,
};

// --- Generators ---

export function generateOutreachKit(config: OutreachConfig): OutreachKit {
  return {
    discoveryCallPrep: generateDiscoveryCallPrep(config),
    onePageCapability: generateOnePageCapability(config),
    pricingBreakdown: generatePricingBreakdown(config),
    onboardingChecklist: generateOnboardingChecklist(config),
    followUpEmail: generateFollowUpEmail(config),
  };
}

function generateDiscoveryCallPrep(config: OutreachConfig): string {
  return `# Discovery Call Preparation
**Practitioner:** ${config.practitionerName}${config.practitionerTitle ? `, ${config.practitionerTitle}` : ''}
**Speciality:** ${config.speciality || 'Functional Medicine'}
**Rate:** ${PRICING.label} (GBP ${PRICING.monthly}/month)
${config.meetingDate ? `**Meeting:** ${config.meetingDate}` : ''}

---

## Key Talking Points

### What VitalMatrix\u2122 Does
- Clinical intelligence platform for functional medicine practitioners
- 7-node terrain assessment mapped to 5 clinical zones
- Automated cascade detection across 6 stack pathways
- Evidence-tiered output: every claim labelled Established, Emerging, or Theoretical

### Why Now
- Phase 1 founding cohort: 10 practitioners only
- ${PRICING.label}: GBP ${PRICING.monthly}/month
- ${PRICING.guarantee}
- GBP ${PRICING.month25Rate}/month from month ${VM_BRAND.pricing.foundingFixedMonths + 1} (non-founding rate)

### What They Get
- Full FLINT\u2122 pipeline access (7 engines)
- Terrain Support Considerations for every patient
- CascadeAtlas\u2122 visual mapping
- DeltaScan\u2122 visit-to-visit tracking
- Priority feature requests as founding member

### Common Objections
| Objection | Response |
|-----------|----------|
| "Is this a diagnostic tool?" | No. VitalMatrix\u2122 is a terrain intelligence platform. It supports practitioner decision-making. It does not diagnose, prescribe, or replace clinical judgement. |
| "Is it MHRA approved?" | Class I SaMD registered. T-01 protective architecture in place. All outputs include practitioner decision sections. |
| "What about data protection?" | ICO registered (ZC101813). AES-256-GCM field encryption. GDPR Art 17 compliant deletion. |
| "Can I try before committing?" | Founding cohort includes onboarding support and a guided first-patient walkthrough. |

${config.customNotes ? `### Notes\n${config.customNotes}` : ''}

---
${VM_BRAND.regulatoryFooter}

${W08_REVIEW_REQUIRED}`;
}

function generateOnePageCapability(config: OutreachConfig): string {
  return `# VitalMatrix\u2122 — Phase 1 Capability Statement

**For:** ${config.practitionerName}
**Date:** ${new Date().toISOString().split('T')[0]}

---

## What It Is
A terrain intelligence platform that maps patient data to a 7-node functional medicine terrain model, detects cascade pathways across 5 clinical zones, and generates evidence-tiered support considerations for practitioner review.

## What It Does

| Capability | Engine | Output |
|-----------|--------|--------|
| Node-level terrain scoring | FLINT\u2122 | 7-node burden profile (0-10 scale) |
| Zone activation detection | NCZ\u2122 | 5-zone status (Active/Borderline/Inactive) |
| Cascade pathway analysis | CascadeIQ\u2122 | 6-stack pathway detection with evidence tiers |
| Burden designation | DRD\u2122 | Highest and secondary burden zones |
| Visual terrain mapping | CascadeAtlas\u2122 | Interactive zone and cascade visualisation |
| Longitudinal tracking | DeltaScan\u2122 | Visit-to-visit comparison |

## What It Is Not
- Not a diagnostic tool
- Not a prescribing system
- Not a replacement for clinical judgement
- Not patient-facing

## Regulatory Status
- ICO registered: ZC101813
- MHRA Class I SaMD registered
- T-01 protective architecture active
- All outputs include mandatory practitioner decision sections

## Pricing
- ${PRICING.label}: **GBP ${PRICING.monthly}/month**
- ${PRICING.guarantee}

---
${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}
${VM_BRAND.regulatoryFooter}

${W08_REVIEW_REQUIRED}`;
}

function generatePricingBreakdown(config: OutreachConfig): string {
  const annual = PRICING.monthly * 12;
  const savingsVsMonth25 = (PRICING.month25Rate - PRICING.monthly) * 12;

  return `# VitalMatrix\u2122 — Pricing for ${config.practitionerName}

## Founding Cohort Rate
| Item | Amount |
|------|--------|
| Monthly subscription | **GBP ${PRICING.monthly}** |
| Annual cost | GBP ${annual} |
| Rate type | ${PRICING.label} |
| Price guarantee | ${PRICING.guarantee} |

## Savings vs Standard Rate (from month ${VM_BRAND.pricing.foundingFixedMonths + 1})
| Comparison | Monthly | Annual |
|-----------|---------|--------|
| Standard rate | GBP ${PRICING.month25Rate} | GBP ${PRICING.month25Rate * 12} |
| Your founding rate | GBP ${PRICING.monthly} | GBP ${annual} |
| **You save** | **GBP ${PRICING.month25Rate - PRICING.monthly}/month** | **GBP ${savingsVsMonth25}/year** |

## What's Included
- Full platform access (all 7 pipeline engines)
- Unlimited patient assessments
- CascadeAtlas\u2122 visual mapping
- DeltaScan\u2122 longitudinal tracking
- Priority founding member support
- Feature request priority

## Payment
- Monthly billing, cancel anytime
- No setup fees
- No lock-in contract (price guarantee is ours to you, not yours to us)

---
${VM_BRAND.regulatoryFooter}

${W08_REVIEW_REQUIRED}`;
}

function generateOnboardingChecklist(config: OutreachConfig): string {
  return `# VitalMatrix\u2122 — Onboarding Checklist
**Practitioner:** ${config.practitionerName}

## Week 1: Setup
- [ ] Account created and credentials received
- [ ] Platform walkthrough completed (guided session with Dr Faisal)
- [ ] Informed consent template reviewed and approved (Feature 41)
- [ ] Data processing agreement signed
- [ ] First patient entered (guided)

## Week 2: First Patient
- [ ] Complete INTAKE\u2122 form for first patient
- [ ] Review FLINT\u2122 terrain assessment output
- [ ] Review Terrain Support Considerations document
- [ ] Complete Practitioner Clinical Decision section
- [ ] Schedule follow-up visit for DeltaScan\u2122 comparison

## Week 3-4: Independent Use
- [ ] Enter 3-5 patients independently
- [ ] Review CascadeAtlas\u2122 visualisations
- [ ] Provide feedback via practitioner feedback form (Feature 152)
- [ ] Flag any clinical accuracy concerns

## Ongoing
- [ ] Monthly check-in with founding cohort
- [ ] Feature request submissions
- [ ] Pilot validation participation (Feature 157)

---
${VM_BRAND.regulatoryFooter}

${W08_REVIEW_REQUIRED}`;
}

function generateFollowUpEmail(config: OutreachConfig): string {
  return `Subject: VitalMatrix\u2122 — Following Up on Our Conversation

Dear ${config.practitionerName},

Thank you for taking the time to discuss VitalMatrix\u2122. I wanted to follow up with the key points from our conversation.

VitalMatrix\u2122 is a terrain intelligence platform designed specifically for functional medicine practitioners. It maps patient data to a 7-node terrain model and detects cascade pathways across 5 clinical zones, giving you evidence-tiered support considerations for every patient.

As a founding cohort member, your rate would be GBP ${PRICING.monthly}/month with a ${PRICING.guarantee}. The standard rate from month ${VM_BRAND.pricing.foundingFixedMonths + 1} will be GBP ${PRICING.month25Rate}/month, so this represents a significant ongoing saving.

I have attached:
1. Phase 1 Capability Statement
2. Pricing breakdown
3. Onboarding checklist

The founding cohort is limited to 10 practitioners. If you would like to proceed, I can set up your account and schedule a guided walkthrough at your convenience.

Kind regards,

${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}

${VM_BRAND.regulatoryFooter}

${W08_REVIEW_REQUIRED}`;
}
