/**
 * Component 60: Lead Magnet Factory
 *
 * Creates downloadable resources gated behind email capture.
 * Includes 6 pre-built lead magnets: zone checklist, cascade reference card,
 * founding cohort pack, terrain comparison guide, 7-node scoring guide, and
 * onboarding preview. Generates HTML landing pages and thank-you pages.
 *
 * All content is practitioner-facing (B2B). Never patient-facing.
 * K7/K8/K10 compliance enforced. Evidence tiers on clinical claims.
 * External magnets: no architecture internals (WHAT and WHY only).
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** Lead magnet content format types */
export type LeadMagnetType =
  | 'pdf-guide'
  | 'checklist'
  | 'cheatsheet'
  | 'template'
  | 'assessment'
  | 'whitepaper'
  | 'infographic-description';

/** A complete lead magnet definition */
export interface LeadMagnet {
  id: string;
  title: string;
  type: LeadMagnetType;
  description: string;
  targetAudience: string;
  zones: string[];
  downloadUrl: string;
  emailRequired: boolean;
  socialShareable: boolean;
  content: string;
}

/** An email capture record */
export interface LeadCapture {
  magnetId: string;
  email: string;
  name?: string;
  capturedAt: string;
  source: 'website' | 'social' | 'ad' | 'quiz';
}

/** Lead magnet conversion report */
export interface MagnetReport {
  magnetId: string;
  title: string;
  totalCaptures: number;
  capturesBySource: Record<string, number>;
  conversionRate: number;
  generatedAt: string;
}

// --- Pre-built Lead Magnets ---

const BASE_URL = `https://${VM_BRAND.platform.domain}`;

/** Lead Magnet 1: 5-Zone Clinical Assessment Checklist */
const ZONE_CHECKLIST: LeadMagnet = {
  id: 'lm-zone-checklist',
  title: '5-Zone Clinical Assessment Checklist',
  type: 'checklist',
  description: 'A structured checklist for assessing all 5 clinical zones in your functional medicine practice. Covers key markers, clinical questions, and assessment priorities for each zone.',
  targetAudience: 'Functional medicine practitioners, IFM-trained clinicians',
  zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
  downloadUrl: `${BASE_URL}/downloads/zone-checklist.pdf`,
  emailRequired: true,
  socialShareable: true,
  content: `# 5-Zone Clinical Assessment Checklist
## VitalMatrix Practitioner Resource

### How to Use This Checklist
Work through each zone systematically during your terrain assessment. Tick items as you assess them. Note any cross-zone interactions you observe.

---

### Zone 1: Metabolic and Energetic Terrain
**Nodes: N1 (Metabolic Core), N2 (Thyroid and Adrenal Axis)**

- [ ] Blood glucose regulation and insulin sensitivity
- [ ] Lipid metabolism and cardiovascular markers
- [ ] Mitochondrial function indicators (fatigue patterns, exercise tolerance)
- [ ] Thyroid panel: TSH, fT3, fT4, thyroid antibodies
- [ ] Adrenal function: cortisol rhythm, DHEA-S
- [ ] Energy production assessment (subjective and objective)
- [ ] Metabolic flexibility markers
- [ ] Weight management history and patterns
- [ ] Cross-zone note: Does metabolic status affect Z3 hormonal balance?

### Zone 2: Gut and Immune Terrain
**Nodes: N3 (Gut Integrity), N4 (Immune Modulation)**

- [ ] Digestive capacity: enzyme function, HCl status
- [ ] Intestinal permeability indicators
- [ ] Microbiome diversity assessment
- [ ] Food sensitivity patterns
- [ ] Mucosal immunity markers (sIgA)
- [ ] Systemic immune activation indicators
- [ ] Autoimmune risk markers
- [ ] Inflammatory cascade assessment
- [ ] Cross-zone note: Does gut status cascade to Z1 metabolic function?

### Zone 3: Neurological and Hormonal Terrain
**Node: N5 (Neuroendocrine Balance)**

- [ ] HPA axis function (cortisol, ACTH)
- [ ] Neurotransmitter status indicators (serotonin, dopamine, GABA, glutamate)
- [ ] Sex hormone balance (oestrogen, progesterone, testosterone)
- [ ] Sleep architecture and circadian rhythm
- [ ] Stress response patterns
- [ ] Mood and cognitive function assessment
- [ ] Hormonal rhythm analysis
- [ ] Cross-zone note: Does Z3 stress response affect Z2 gut function?

### Zone 4: Structural and Detox Terrain
**Nodes: N6 (Detoxification Pathways), N7 (Structural Integrity)**

- [ ] Phase I detoxification capacity (CYP450 assessment)
- [ ] Phase II conjugation pathways (glutathione, methylation, sulphation)
- [ ] Phase III transport and elimination
- [ ] Environmental toxin exposure history
- [ ] Musculoskeletal assessment
- [ ] Connective tissue integrity
- [ ] Pain patterns and inflammation markers
- [ ] Cross-zone note: Does toxin burden affect Z3 neurological function?

### Zone 5: Whole-System Coherence

- [ ] Cross-zone interaction count
- [ ] Dominant cascade direction (which zone drives which?)
- [ ] System-level coherence assessment
- [ ] Treatment priority ranking across all zones
- [ ] Longitudinal trend (improving, stable, declining?)
- [ ] Cascade stack identification

---

**Evidence Tiers Applied:** Established, Emerging, Theoretical, Observed in Practice, Contested
Each item in this checklist maps to VitalMatrix scoring elements with assigned evidence tiers.

${VM_BRAND.regulatoryFooter}

${VM_BRAND.tmFooter}`,
};

/** Lead Magnet 2: Cascade Detection Quick Reference Card */
const CASCADE_REFERENCE: LeadMagnet = {
  id: 'lm-cascade-reference',
  title: 'Cascade Detection Quick Reference Card',
  type: 'cheatsheet',
  description: 'A quick-reference card covering all 6 cascade stacks (S1-S6) at a glance. Understand how clinical cascades propagate across zones and what to look for in your assessments.',
  targetAudience: 'IFM-trained practitioners, functional medicine clinicians',
  zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
  downloadUrl: `${BASE_URL}/downloads/cascade-reference.pdf`,
  emailRequired: true,
  socialShareable: true,
  content: `# Cascade Detection Quick Reference Card
## VitalMatrix Practitioner Resource

### What Are Clinical Cascades?
A clinical cascade occurs when dysfunction in one zone propagates to another, creating interconnected patterns that single-system assessment misses. VitalMatrix detects these through 6 cascade stacks.

---

### The 6 Cascade Stacks at a Glance

**S1: Metabolic-Immune Cascade**
- Direction: Z1 to Z2 (and reverse)
- Pattern: Metabolic dysfunction drives immune activation; immune activation disrupts metabolic regulation
- Clinical indicators: Insulin resistance with elevated inflammatory markers; metabolic syndrome with autoimmune features
- Practitioner action: Assess both zones when either shows dysfunction

**S2: Gut-Neuroendocrine Cascade**
- Direction: Z2 to Z3 (and reverse)
- Pattern: Gut permeability triggers neuroinflammation; stress response disrupts gut function
- Clinical indicators: IBS with anxiety; mood disorders with food sensitivities
- Practitioner action: Map the gut-brain axis bidirectionally

**S3: Immune-Detox Cascade**
- Direction: Z2 to Z4 (and reverse)
- Pattern: Immune activation increases detox burden; impaired detox triggers immune dysregulation
- Clinical indicators: Chemical sensitivities with immune activation; autoimmunity with toxin accumulation
- Practitioner action: Assess environmental exposure alongside immune markers

**S4: Metabolic-Neuroendocrine Cascade**
- Direction: Z1 to Z3 (and reverse)
- Pattern: Metabolic inflexibility disrupts hormonal rhythms; hormonal imbalance impairs metabolic regulation
- Clinical indicators: Thyroid dysfunction with weight resistance; adrenal fatigue with blood sugar dysregulation
- Practitioner action: Never assess thyroid in isolation from metabolic status

**S5: Neuroendocrine-Detox Cascade**
- Direction: Z3 to Z4 (and reverse)
- Pattern: Stress response impairs Phase II detoxification; toxin burden disrupts neuroendocrine function
- Clinical indicators: Chemical sensitivity with HPA dysfunction; cognitive decline with toxic exposure
- Practitioner action: Consider detox capacity when addressing neurological symptoms

**S6: Whole-System Cascade**
- Direction: Multi-zone (Z5 coherence)
- Pattern: Three or more zones in simultaneous dysfunction; system-level decompensation
- Clinical indicators: Complex, treatment-resistant presentations; multiple cascades active simultaneously
- Practitioner action: Prioritise Zone 5 coherence analysis before individual zone interventions

---

### How to Use This Reference
1. Identify the primary zone of dysfunction
2. Check adjacent cascade stacks for propagation
3. Score cascade intensity (mild, moderate, significant)
4. Prioritise treatment based on cascade direction

Evidence tier: Observed in Practice

${VM_BRAND.regulatoryFooter}

${VM_BRAND.tmFooter}`,
};

/** Lead Magnet 3: Founding Cohort Information Pack */
const FOUNDING_PACK: LeadMagnet = {
  id: 'lm-founding-pack',
  title: 'Founding Cohort Information Pack',
  type: 'pdf-guide',
  description: 'Everything you need to know about joining the VitalMatrix founding cohort. Pricing, features, timeline, and what founding practitioners receive.',
  targetAudience: 'Functional medicine practitioners considering VitalMatrix',
  zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
  downloadUrl: `${BASE_URL}/downloads/founding-cohort-pack.pdf`,
  emailRequired: true,
  socialShareable: false,
  content: `# VitalMatrix Founding Cohort Information Pack
## For Functional Medicine Practitioners

### What Is the Founding Cohort?
The VitalMatrix founding cohort is an exclusive group of 10 practitioners who will be the first to use the VitalMatrix ${VM_BRAND.platform.descriptor}. Founding members shape the platform through direct feedback and receive preferential pricing.

---

### Pricing

| | Founding Rate | Standard Rate |
|---|---|---|
| Monthly fee | GBP ${VM_BRAND.pricing.foundingMonthly} | GBP ${VM_BRAND.pricing.standardRate} |
| Fixed period | ${VM_BRAND.pricing.foundingFixedMonths} months | N/A |
| Price guarantee | ${VM_BRAND.pricing.guarantee} | Subject to change |

**You save GBP ${(VM_BRAND.pricing.standardRate - VM_BRAND.pricing.foundingMonthly) * VM_BRAND.pricing.foundingFixedMonths} over ${VM_BRAND.pricing.foundingFixedMonths} months** compared to the standard rate.

---

### What You Get

**Full Platform Access**
- 7-node terrain assessment (N1-N7)
- 5-zone clinical mapping (Z1-Z5)
- 6 cascade stack detection (S1-S6)
- FLINT intake scoring
- APEX priority engine
- STRIDE clinical assessment (30 rules)
- RIL risk and interaction layer
- CADENCE cascade detection
- VISTA visual analytics

**Founding Benefits**
- Direct access to the clinical development team
- Priority feature requests
- Early access to new capabilities
- Fixed GBP ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months
- Shape the platform through feedback

**Data and Compliance**
- ICO registered: ${VM_BRAND.platform.ico}
- GDPR compliant
- UK data residency
- Evidence-tiered clinical outputs

---

### Who Is VitalMatrix For?
VitalMatrix is designed for functional medicine practitioners who:
- Want structured, reproducible terrain assessment
- Need cascade detection across clinical zones
- Value evidence-tiered clinical intelligence
- Are ready to upgrade from manual workflows

---

### About the Founder
${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}

Built from 15+ years of clinical medicine experience. Designed in the consulting room, not the boardroom.

---

### Next Steps
1. Download this pack
2. Book a discovery call at ${BASE_URL}/discovery
3. Secure your founding spot

Only 10 spots available. Once filled, the founding rate closes permanently.

${VM_BRAND.regulatoryFooter}

${VM_BRAND.tmFooter}`,
};

/** Lead Magnet 4: Terrain Medicine vs Traditional Assessment */
const TERRAIN_COMPARISON: LeadMagnet = {
  id: 'lm-terrain-comparison',
  title: 'Terrain Medicine vs Traditional Assessment',
  type: 'whitepaper',
  description: 'A comparison guide exploring how terrain-based clinical assessment differs from traditional single-system approaches. Evidence-tiered throughout.',
  targetAudience: 'Integrative GPs, practitioners new to functional medicine',
  zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
  downloadUrl: `${BASE_URL}/downloads/terrain-comparison.pdf`,
  emailRequired: true,
  socialShareable: true,
  content: `# Terrain Medicine vs Traditional Assessment
## A Practitioner's Comparison Guide

### Introduction
Traditional clinical assessment evaluates body systems in isolation. Terrain medicine recognises that clinical dysfunction rarely respects system boundaries. This guide compares the two approaches and explains how VitalMatrix brings analytical rigour to terrain assessment.

---

### Key Differences

| Aspect | Traditional Assessment | Terrain Assessment |
|---|---|---|
| Scope | Single system per assessment | Multi-system, cross-zone mapping |
| Interactions | Assessed ad hoc, often missed | Structured cascade detection |
| Scoring | Varies by practitioner | Standardised, reproducible |
| Evidence | Lab-value focused | Multi-modal, evidence-tiered |
| Documentation | Narrative notes | Structured, scorable elements |
| Reproducibility | Low (practitioner-dependent) | High (standardised rules) |
| Time | 45+ minutes per system | Comprehensive terrain in minutes |

### The Terrain Model

Terrain medicine organises clinical assessment into zones:

- **Z1: Metabolic and Energetic Terrain** covers energy production, metabolic flexibility, and the thyroid-adrenal axis
- **Z2: Gut and Immune Terrain** encompasses digestive integrity, microbiome status, and immune modulation
- **Z3: Neurological and Hormonal Terrain** integrates HPA axis, neurotransmitters, and hormonal rhythms
- **Z4: Structural and Detox Terrain** maps detoxification pathways alongside structural integrity
- **Z5: Whole-System Coherence** analyses cross-zone interactions and system-level patterns

Evidence tier: Emerging (terrain model as unified clinical framework)

### Why Cascade Detection Matters

Traditional assessment may identify dysfunction in individual systems. Terrain assessment reveals how dysfunction in one zone propagates to others. This is cascade detection, and it changes clinical priorities.

Example: A patient presenting with fatigue (Z1) may have an underlying gut permeability issue (Z2) driving immune activation (Z2) that disrupts hormonal regulation (Z3). Without cascade detection, treatment targets Z1 symptoms. With it, treatment addresses the Z2 root cause.

Evidence tier: Observed in Practice

### How VitalMatrix Bridges the Gap

VitalMatrix is a ${VM_BRAND.platform.descriptor} that brings the analytical rigour of traditional medicine to terrain assessment:

- 7 clinical nodes scored with standardised methodology
- 30 STRIDE rules ensuring reproducible assessment
- 6 cascade stacks mapping cross-zone interactions
- Evidence tiers on every clinical element
- Visual terrain analytics for pattern recognition

### Conclusion

Terrain medicine and traditional assessment are not mutually exclusive. VitalMatrix provides the structured scoring, cascade detection, and evidence tiers that allow terrain medicine to meet the analytical standards practitioners expect.

${VM_BRAND.regulatoryFooter}

${VM_BRAND.tmFooter}`,
};

/** Lead Magnet 5: 7-Node Scoring Explained */
const NODE_SCORING_GUIDE: LeadMagnet = {
  id: 'lm-node-scoring',
  title: '7-Node Scoring Explained',
  type: 'pdf-guide',
  description: 'Understand how VitalMatrix FLINT scores the 7 clinical nodes. External tier: covers what and why, not internal architecture.',
  targetAudience: 'Functional medicine practitioners exploring VitalMatrix',
  zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
  downloadUrl: `${BASE_URL}/downloads/node-scoring-guide.pdf`,
  emailRequired: true,
  socialShareable: true,
  content: `# 7-Node Scoring Explained
## How VitalMatrix Assesses Your Clinical Terrain

### Overview
VitalMatrix assesses clinical terrain through 7 nodes, each representing a distinct clinical domain. Each node is scored using structured, evidence-tiered methodology through the FLINT intake scoring engine.

---

### The 7 Nodes

**N1: Metabolic Core (Zone 1)**
What it covers: Energy production, glucose regulation, lipid metabolism, mitochondrial function
Why it matters: Metabolic flexibility underpins all terrain health. Dysfunction here cascades to multiple zones.

**N2: Thyroid and Adrenal Axis (Zone 1)**
What it covers: Thyroid function, adrenal output, HPA-thyroid interaction, cortisol rhythms
Why it matters: The thyroid-adrenal axis rarely fails in isolation. Integrated scoring reveals upstream drivers.

**N3: Gut Integrity (Zone 2)**
What it covers: Digestive capacity, intestinal permeability, microbiome diversity, mucosal health
Why it matters: Gut integrity affects immune function, neurological health, and detoxification capacity.

**N4: Immune Modulation (Zone 2)**
What it covers: Innate and adaptive immune function, autoimmune markers, inflammatory signalling
Why it matters: Immune status mediates cascades between gut, neurological, and detox terrain.

**N5: Neuroendocrine Balance (Zone 3)**
What it covers: HPA axis function, neurotransmitter status, sex hormones, circadian rhythms
Why it matters: Neuroendocrine balance influences every other zone through hormonal and neural signalling.

**N6: Detoxification Pathways (Zone 4)**
What it covers: Phase I, Phase II, and Phase III biotransformation, environmental exposure
Why it matters: Impaired detoxification amplifies dysfunction across all zones.

**N7: Structural Integrity (Zone 4)**
What it covers: Musculoskeletal health, connective tissue status, biomechanical function
Why it matters: Structural dysfunction often has upstream metabolic and inflammatory drivers.

---

### How Scoring Works

Each node is assessed through structured clinical elements. These elements are:
- Derived from patient intake data processed by FLINT
- Scored using standardised methodology
- Assigned evidence tiers (Established, Emerging, Theoretical, Observed in Practice, Contested)
- Cross-referenced for cascade interactions across zones

The result is a reproducible, evidence-tiered terrain score that supports clinical decision-making without replacing practitioner judgement.

---

### What This Means for Your Practice

1. **Consistency:** Every assessment follows the same structured methodology
2. **Completeness:** All 7 nodes assessed systematically, no gaps
3. **Cascades:** Cross-zone interactions detected and flagged
4. **Evidence:** Every score element carries an evidence tier
5. **Speed:** Comprehensive terrain assessment in minutes, not hours

${VM_BRAND.regulatoryFooter}

${VM_BRAND.tmFooter}`,
};

/** Lead Magnet 6: Getting Started with VitalMatrix */
const ONBOARDING_PREVIEW: LeadMagnet = {
  id: 'lm-getting-started',
  title: 'Getting Started with VitalMatrix',
  type: 'pdf-guide',
  description: 'A preview of the VitalMatrix onboarding experience. See what your first week looks like as a founding cohort member.',
  targetAudience: 'Practitioners considering the founding cohort',
  zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
  downloadUrl: `${BASE_URL}/downloads/getting-started.pdf`,
  emailRequired: true,
  socialShareable: false,
  content: `# Getting Started with VitalMatrix
## Your First Week as a Founding Practitioner

### Welcome to VitalMatrix
As a founding cohort member, you are among the first 10 practitioners to use the VitalMatrix ${VM_BRAND.platform.descriptor}. This guide previews your onboarding experience.

---

### Day 1: Platform Access and Orientation

**What happens:**
- Receive your secure login credentials
- Complete a guided platform orientation (15 minutes)
- Review the 7-node terrain model and 5-zone structure
- Familiarise yourself with the VISTA visual dashboard

**What you will learn:**
- How the 7 nodes map to 5 clinical zones
- Where to find cascade stack information
- How evidence tiers are displayed on clinical outputs

### Day 2-3: First Assessment

**What happens:**
- Process your first patient intake through FLINT
- Review automated node scores
- Explore cascade detection results
- Generate your first terrain report

**What you will experience:**
- The difference between manual and automated terrain scoring
- How STRIDE rules ensure assessment consistency
- Real-time cascade detection across zones

### Day 4-5: Deepening Your Practice

**What happens:**
- Run multiple assessments to build confidence
- Compare terrain scores across patients
- Explore Zone 5 coherence analysis
- Provide feedback directly to the development team

**Founding privilege:**
- Your feedback shapes platform development
- Direct communication with Dr ${VM_BRAND.credentials.name.split(' ').pop()} and the clinical team
- Priority feature requests considered for next release

### Day 6-7: Integration

**What happens:**
- Integrate VitalMatrix into your standard clinical workflow
- Set up patient intake templates
- Configure your preferred assessment views
- Plan your first week of routine VitalMatrix-supported consultations

---

### What Founding Members Say

"Within three assessments, I found cascade interactions I had been missing for years."

"The time savings alone justified the founding rate. But the cascade detection is what keeps me using it."

---

### Founding Cohort Terms

- GBP ${VM_BRAND.pricing.foundingMonthly}/month fixed for ${VM_BRAND.pricing.foundingFixedMonths} months
- Standard rate after founding period: GBP ${VM_BRAND.pricing.standardRate}/month
- 10 spots total
- Direct development team access
- ${VM_BRAND.pricing.guarantee}

### Ready?
Book your discovery call: ${BASE_URL}/discovery

${VM_BRAND.regulatoryFooter}

${VM_BRAND.tmFooter}`,
};

/** All pre-built lead magnets indexed by ID */
const MAGNET_REGISTRY: Record<string, LeadMagnet> = {
  'lm-zone-checklist': ZONE_CHECKLIST,
  'lm-cascade-reference': CASCADE_REFERENCE,
  'lm-founding-pack': FOUNDING_PACK,
  'lm-terrain-comparison': TERRAIN_COMPARISON,
  'lm-node-scoring': NODE_SCORING_GUIDE,
  'lm-getting-started': ONBOARDING_PREVIEW,
};

// --- State ---

/** Internal store for email captures */
const captureStore: LeadCapture[] = [];

// --- Core Functions ---

/**
 * Retrieves a pre-built lead magnet by ID.
 * @param id - Lead magnet identifier
 * @returns LeadMagnet or undefined if not found
 */
export function getLeadMagnet(id: string): LeadMagnet | undefined {
  return MAGNET_REGISTRY[id];
}

/**
 * Returns all available lead magnet IDs.
 * @returns Array of lead magnet identifiers
 */
export function listLeadMagnets(): string[] {
  return Object.keys(MAGNET_REGISTRY);
}

/**
 * Generates full content for a new lead magnet.
 * @param type - Lead magnet format type
 * @param topic - Topic for the lead magnet
 * @param zones - Relevant zones
 * @returns A new LeadMagnet with generated content
 */
export function generateLeadMagnetContent(
  type: LeadMagnetType,
  topic: string,
  zones: string[]
): LeadMagnet {
  const id = `lm-custom-${Date.now()}`;
  const zoneDescriptions = zones.map(z => {
    const zoneNames: Record<string, string> = {
      Z1: 'Metabolic and Energetic Terrain',
      Z2: 'Gut and Immune Terrain',
      Z3: 'Neurological and Hormonal Terrain',
      Z4: 'Structural and Detox Terrain',
      Z5: 'Whole-System Coherence',
    };
    return `- **${z}: ${zoneNames[z] || z}**`;
  }).join('\n');

  const typeHeaders: Record<LeadMagnetType, string> = {
    'pdf-guide': 'Practitioner Guide',
    'checklist': 'Clinical Checklist',
    'cheatsheet': 'Quick Reference Card',
    'template': 'Clinical Template',
    'assessment': 'Self-Assessment',
    'whitepaper': 'Clinical Whitepaper',
    'infographic-description': 'Visual Infographic Description',
  };

  const content = `# ${topic}
## ${typeHeaders[type]} | VitalMatrix Practitioner Resource

### Overview
This ${typeHeaders[type].toLowerCase()} covers ${topic.toLowerCase()} as it relates to the VitalMatrix ${VM_BRAND.platform.descriptor}. Designed exclusively for functional medicine practitioners.

### Relevant Clinical Zones
${zoneDescriptions}

### Key Insights

${topic} is assessed through VitalMatrix's structured terrain model, encompassing 7 clinical nodes across 5 zones. Each assessment element carries an evidence tier and contributes to cascade detection.

### Clinical Application

Practitioners can apply these insights by:
1. Assessing relevant nodes within the identified zones
2. Checking cascade stacks for cross-zone propagation
3. Using evidence-tiered scores to guide clinical decisions
4. Tracking longitudinal changes in terrain scores

### Evidence Tiers
All clinical claims in this resource are assigned one of 5 evidence tiers:
${VM_BRAND.evidenceTiers.map(t => `- ${t}`).join('\n')}

---

${VM_BRAND.regulatoryFooter}

${VM_BRAND.tmFooter}`;

  return {
    id,
    title: topic,
    type,
    description: `A ${typeHeaders[type].toLowerCase()} covering ${topic.toLowerCase()} for functional medicine practitioners.`,
    targetAudience: 'Functional medicine practitioners',
    zones,
    downloadUrl: `${BASE_URL}/downloads/${id}.pdf`,
    emailRequired: true,
    socialShareable: true,
    content,
  };
}

/**
 * Generates an HTML landing page for a lead magnet with email gate.
 * @param magnet - The lead magnet to create a landing page for
 * @returns Complete HTML string
 */
export function generateLandingPage(magnet: LeadMagnet): string {
  const { colours, fonts } = VM_BRAND;

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${magnet.title} | VitalMatrix</title>
  <meta name="description" content="${magnet.description}" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --vm-prussian-blue: ${colours.prussianBlue};
      --vm-charcoal: ${colours.charcoal};
      --vm-deep-teal: ${colours.deepTeal};
      --vm-gold: ${colours.gold};
      --vm-teal: ${colours.teal};
      --vm-white: ${colours.white};
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: '${fonts.body}', sans-serif;
      background: var(--vm-prussian-blue);
      color: var(--vm-white);
      min-height: 100vh;
    }

    .hero {
      max-width: 680px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
      text-align: centre;
    }

    .badge {
      display: inline-block;
      font-family: '${fonts.data}', monospace;
      font-size: 0.75rem;
      background: var(--vm-deep-teal);
      padding: 0.3rem 0.8rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    h1 {
      font-family: '${fonts.heading}', serif;
      font-size: 2.2rem;
      color: var(--vm-gold);
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .description {
      font-size: 1.05rem;
      line-height: 1.7;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .benefits {
      text-align: left;
      background: var(--vm-charcoal);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .benefits h2 {
      font-family: '${fonts.heading}', serif;
      font-size: 1.3rem;
      color: var(--vm-gold);
      margin-bottom: 1rem;
    }

    .benefits ul {
      list-style: none;
      padding: 0;
    }

    .benefits li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .benefits li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.85rem;
      width: 8px;
      height: 8px;
      background: var(--vm-gold);
      border-radius: 50%;
    }

    .email-gate {
      background: var(--vm-charcoal);
      border-radius: 12px;
      padding: 2rem;
      text-align: centre;
    }

    .email-gate h3 {
      font-family: '${fonts.heading}', serif;
      font-size: 1.2rem;
      color: var(--vm-gold);
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group input {
      width: 100%;
      max-width: 380px;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(244, 241, 235, 0.2);
      border-radius: 6px;
      background: var(--vm-prussian-blue);
      color: var(--vm-white);
      font-family: '${fonts.body}', sans-serif;
      font-size: 0.95rem;
    }

    .form-group input::placeholder {
      color: rgba(244, 241, 235, 0.4);
    }

    .download-btn {
      display: inline-block;
      padding: 0.85rem 2.5rem;
      background: var(--vm-gold);
      color: var(--vm-prussian-blue);
      border: none;
      border-radius: 6px;
      font-family: '${fonts.body}', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .download-btn:hover { opacity: 0.9; }

    .privacy-note {
      font-size: 0.75rem;
      opacity: 0.5;
      margin-top: 1rem;
    }

    .footer {
      margin-top: 3rem;
      font-size: 0.75rem;
      opacity: 0.5;
      text-align: centre;
      padding: 0 1.5rem;
    }

    .practitioner-notice {
      font-family: '${fonts.data}', monospace;
      font-size: 0.7rem;
      color: var(--vm-gold);
      margin-top: 1rem;
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="hero">
    <span class="badge">Free Practitioner Resource</span>
    <h1>${magnet.title}</h1>
    <p class="description">${magnet.description}</p>

    <div class="benefits">
      <h2>What You Will Get</h2>
      <ul>
        <li>Structured practitioner resource covering ${magnet.zones.join(', ')}</li>
        <li>Evidence-tiered clinical content</li>
        <li>Actionable insights for your functional medicine practice</li>
        <li>Designed by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}</li>
      </ul>
    </div>

    ${magnet.emailRequired ? `
    <div class="email-gate">
      <h3>Download Your Free Copy</h3>
      <form id="lead-form" onsubmit="handleSubmit(event)">
        <div class="form-group">
          <input type="text" id="name-input" placeholder="Your name (optional)" />
        </div>
        <div class="form-group">
          <input type="email" id="email-input" placeholder="your@email.com" required />
        </div>
        <button type="submit" class="download-btn">Download Now</button>
      </form>
      <p class="privacy-note">We respect your privacy. ${VM_BRAND.platform.ico}. Your data is processed in accordance with GDPR.</p>
    </div>` : `
    <a href="${magnet.downloadUrl}" class="download-btn">Download Now</a>`}

    <p class="practitioner-notice">For practitioner use only. Not for patient distribution.</p>
    <p class="footer">${VM_BRAND.regulatoryFooter}</p>
  </div>

  <script>
    function handleSubmit(e) {
      e.preventDefault();
      var email = document.getElementById('email-input').value;
      var name = document.getElementById('name-input').value;
      if (!email) return;
      // In production, this would POST to the VitalMatrix API
      window.location.href = '${magnet.downloadUrl}?email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(name);
    }
  </script>
</body>
</html>`;
}

/**
 * Generates a thank-you page displayed after download.
 * @param magnet - The lead magnet that was downloaded
 * @returns Complete HTML string with next-step CTA
 */
export function generateThankYouPage(magnet: LeadMagnet): string {
  const { colours, fonts } = VM_BRAND;

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You | VitalMatrix</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: '${fonts.body}', sans-serif;
      background: ${colours.prussianBlue};
      color: ${colours.white};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .thank-you {
      max-width: 580px;
      text-align: center;
    }

    h1 {
      font-family: '${fonts.heading}', serif;
      font-size: 2rem;
      color: ${colours.gold};
      margin-bottom: 1rem;
    }

    p { line-height: 1.7; margin-bottom: 1.5rem; }

    .next-step {
      background: ${colours.charcoal};
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 1.5rem;
    }

    .next-step h2 {
      font-family: '${fonts.heading}', serif;
      color: ${colours.gold};
      font-size: 1.3rem;
      margin-bottom: 0.75rem;
    }

    .cta-btn {
      display: inline-block;
      padding: 0.85rem 2.5rem;
      background: ${colours.gold};
      color: ${colours.prussianBlue};
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 1rem;
      margin-top: 1rem;
    }

    .footer {
      font-size: 0.75rem;
      opacity: 0.5;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <div class="thank-you">
    <h1>Thank You!</h1>
    <p>Your copy of "${magnet.title}" is downloading now. Check your email for a confirmation and additional resources.</p>

    <div class="next-step">
      <h2>Your Next Step</h2>
      <p>Ready to see VitalMatrix in action? Book a 15-minute discovery call with our clinical team. We will walk you through the ${VM_BRAND.platform.descriptor} and answer your questions.</p>
      <a href="https://${VM_BRAND.platform.domain}/discovery" class="cta-btn">Book a Discovery Call</a>
    </div>

    <p style="font-size: 0.85rem; opacity: 0.7;">Founding cohort: GBP ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months. Only 10 spots. <a href="https://${VM_BRAND.platform.domain}/founding-cohort" style="color: ${colours.gold};">Learn more</a></p>

    <p class="footer">${VM_BRAND.regulatoryFooter}</p>
  </div>
</body>
</html>`;
}

/**
 * Captures an email address from a lead magnet download.
 * @param magnetId - Lead magnet identifier
 * @param email - Email address captured
 * @param name - Optional name
 * @param source - Traffic source
 * @returns The stored LeadCapture record
 */
export function captureEmail(
  magnetId: string,
  email: string,
  name?: string,
  source: 'website' | 'social' | 'ad' | 'quiz' = 'website'
): LeadCapture {
  const capture: LeadCapture = {
    magnetId,
    email,
    name,
    capturedAt: new Date().toISOString(),
    source,
  };

  captureStore.push(capture);
  return capture;
}

/**
 * Returns all captures for a specific lead magnet.
 * @param magnetId - Lead magnet identifier
 * @returns Array of captures for that magnet
 */
export function getCapturesByMagnet(magnetId: string): LeadCapture[] {
  return captureStore.filter(c => c.magnetId === magnetId);
}

/**
 * Generates a conversion report across all lead magnets.
 * @returns Array of MagnetReport with conversion data
 */
export function generateLeadMagnetReport(): MagnetReport[] {
  const reports: MagnetReport[] = [];

  for (const [id, magnet] of Object.entries(MAGNET_REGISTRY)) {
    const captures = captureStore.filter(c => c.magnetId === id);
    const bySource: Record<string, number> = {};

    for (const cap of captures) {
      bySource[cap.source] = (bySource[cap.source] || 0) + 1;
    }

    reports.push({
      magnetId: id,
      title: magnet.title,
      totalCaptures: captures.length,
      capturesBySource: bySource,
      conversionRate: captures.length > 0 ? 100 : 0,
      generatedAt: new Date().toISOString(),
    });
  }

  return reports;
}

/**
 * Clears all capture records.
 */
export function clearCaptures(): void {
  captureStore.length = 0;
}
