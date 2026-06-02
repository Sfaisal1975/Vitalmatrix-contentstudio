/**
 * Component 32: Competitive Positioning Engine
 *
 * K10-compliant differentiation content. NEVER names competitors.
 * All framing uses "builds upon" not "corrects" (IFM amplification).
 * Generates comparison content, FAQ-style differentiation, and
 * category-specific positioning text.
 *
 * Kill List K10: No Mark Hyman, LaValle, Metabolic Code, or adjacent names.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND, type EvidenceTier } from './brand-config';

// --- Types ---

export type DifferentiatorCategory =
  | 'approach'
  | 'evidence'
  | 'technology'
  | 'regulatory'
  | 'pricing'
  | 'support';

export interface Differentiator {
  category: DifferentiatorCategory;
  whatWeDoWell: string;
  whatOthersMiss: string;
  evidenceTier: EvidenceTier;
  practitionerBenefit: string;
}

// --- K10 Compliance ---

/** Blocked terms per K10 kill list. Content must never include these. */
const K10_BLOCKED_TERMS: string[] = [
  'mark hyman',
  'hyman',
  'lavalle',
  'metabolic code',
  'ultra wellness',
  'ultrawellness',
  'cleveland clinic functional',
];

/**
 * Validates that content passes K10 compliance.
 * Returns true if clean, false if a blocked term is detected.
 */
function passesK10(text: string): boolean {
  const lower = text.toLowerCase();
  return !K10_BLOCKED_TERMS.some(term => lower.includes(term));
}

/**
 * Asserts K10 compliance. Throws if blocked terms are found.
 */
function enforceK10(text: string, context: string): void {
  if (!passesK10(text)) {
    throw new Error(`K10 violation in ${context}: competitor name detected. Remove all competitor references.`);
  }
}

// --- Differentiator Data ---

const DIFFERENTIATORS: Differentiator[] = [
  // Approach
  {
    category: 'approach',
    whatWeDoWell: 'Structured 5-zone terrain model with 7 physiological nodes mapped to functional medicine principles. Builds upon the IFM matrix with quantified, reproducible scoring.',
    whatOthersMiss: 'Most platforms offer symptom checklists or isolated lab panels without cross-system terrain mapping. They lack cascade detection between zones.',
    evidenceTier: 'Established',
    practitionerBenefit: 'See the full terrain picture in one view rather than assembling fragments from multiple tools.',
  },
  {
    category: 'approach',
    whatWeDoWell: 'TerrainLock detection identifies self-perpetuating dysfunction loops. CascadeIQ maps directional influence between zones.',
    whatOthersMiss: 'Static snapshots that miss feedback loops. Without cascade awareness, practitioners chase symptoms rather than upstream drivers.',
    evidenceTier: 'Emerging',
    practitionerBenefit: 'Identify the root driver zone before committing to a support plan, reducing trial-and-error cycles.',
  },

  // Evidence
  {
    category: 'evidence',
    whatWeDoWell: 'Every clinical claim carries an evidence tier label: Established, Emerging, Theoretical, Observed in Practice, or Contested. Full PubMed citation integration.',
    whatOthersMiss: 'Unqualified clinical claims with no evidence grading. Practitioners cannot distinguish peer-reviewed data from marketing.',
    evidenceTier: 'Established',
    practitionerBenefit: 'Communicate evidence confidence to patients transparently. Defend clinical decisions with cited sources.',
  },
  {
    category: 'evidence',
    whatWeDoWell: 'Builds upon IFM functional medicine education. Amplifies what trained practitioners already know by structuring it into reproducible, auditable terrain assessments.',
    whatOthersMiss: 'Some tools present proprietary scoring without showing the underlying model. Practitioners must trust a black box.',
    evidenceTier: 'Established',
    practitionerBenefit: 'Full transparency in how scores are derived. No hidden algorithms.',
  },

  // Technology
  {
    category: 'technology',
    whatWeDoWell: 'Seven-engine processing pipeline (FLINT, APEX, STRIDE, RIL, CADENCE, CIL, VISTA) with protective T-01 architecture ensuring every output requires practitioner decision.',
    whatOthersMiss: 'Single-pass analysis without layered validation. No protective gates between algorithmic output and clinical presentation.',
    evidenceTier: 'Established',
    practitionerBenefit: 'Robust, multi-stage analysis that catches edge cases before they reach your clinical view.',
  },
  {
    category: 'technology',
    whatWeDoWell: 'AES-256-GCM field-level encryption. UK data residency. GDPR Art 17 compliant deletion. No patient data leaves UK infrastructure.',
    whatOthersMiss: 'Cloud-first approaches with data residency in jurisdictions outside the practitioner\'s regulatory framework.',
    evidenceTier: 'Established',
    practitionerBenefit: 'Full GDPR compliance without additional data processing agreements for cross-border transfers.',
  },

  // Regulatory
  {
    category: 'regulatory',
    whatWeDoWell: 'Class I SaMD registered. ICO ZC101813. T-01 protective architecture: mandatory practitioner decision sections on every output. Does not diagnose or prescribe.',
    whatOthersMiss: 'Unclear regulatory classification. Some tools blur the line between decision support and diagnostic claims.',
    evidenceTier: 'Established',
    practitionerBenefit: 'Use the platform with confidence that it sits within MHRA guidelines. No regulatory grey areas.',
  },

  // Pricing
  {
    category: 'pricing',
    whatWeDoWell: `Founding cohort: GBP ${VM_BRAND.pricing.foundingMonthly}/month with a ${VM_BRAND.pricing.guarantee}. No lock-in contract. Monthly billing.`,
    whatOthersMiss: 'Annual contracts, hidden per-patient fees, or tiered pricing that escalates with usage. Some charge per assessment.',
    evidenceTier: 'Established',
    practitionerBenefit: 'Predictable monthly cost regardless of patient volume. The more you use it, the lower your cost per patient.',
  },
  {
    category: 'pricing',
    whatWeDoWell: `Unlimited assessments within the subscription. No per-patient surcharges. Standard rate from month ${VM_BRAND.pricing.foundingFixedMonths + 1}: GBP ${VM_BRAND.pricing.standardRate}.`,
    whatOthersMiss: 'Per-patient or per-assessment pricing that penalises high-volume practices.',
    evidenceTier: 'Established',
    practitionerBenefit: 'Scale your practice without scaling your platform costs.',
  },

  // Support
  {
    category: 'support',
    whatWeDoWell: 'Direct access to the clinical architect (${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}) during the founding cohort. Personalised onboarding sequence.',
    whatOthersMiss: 'Ticket-based support with no clinical context. Support staff unfamiliar with functional medicine workflows.',
    evidenceTier: 'Established',
    practitionerBenefit: 'Get answers from someone who understands both the platform and the clinical model.',
  },
  {
    category: 'support',
    whatWeDoWell: 'Six-stage practitioner onboarding with zone-by-zone guided walkthroughs. Speciality-mapped demonstrations.',
    whatOthersMiss: 'Generic onboarding that does not account for the practitioner\'s speciality or existing workflow.',
    evidenceTier: 'Established',
    practitionerBenefit: 'See the platform through the lens of your own speciality from day one.',
  },
];

// --- Functions ---

/**
 * Returns all differentiators. Each is K10-compliant by construction.
 */
export function getDifferentiators(): Differentiator[] {
  return [...DIFFERENTIATORS];
}

/**
 * Returns differentiators filtered by category.
 */
export function getDifferentiatorsByCategory(category: DifferentiatorCategory): Differentiator[] {
  return DIFFERENTIATORS.filter(d => d.category === category);
}

/**
 * Generates compliant "how we're different" content for a given category.
 * NEVER names competitors. Uses "builds upon" framing for IFM references.
 */
export function generateComparisonContent(category: DifferentiatorCategory): string {
  const items = getDifferentiatorsByCategory(category);
  if (items.length === 0) {
    return `No differentiators defined for category: ${category}`;
  }

  const categoryTitles: Record<DifferentiatorCategory, string> = {
    approach: 'Clinical Approach',
    evidence: 'Evidence and Transparency',
    technology: 'Technology and Architecture',
    regulatory: 'Regulatory Compliance',
    pricing: 'Pricing and Value',
    support: 'Support and Onboarding',
  };

  const lines: string[] = [
    `## How VitalMatrix Is Different: ${categoryTitles[category]}`,
    '',
  ];

  for (const item of items) {
    lines.push(`### What We Do`);
    lines.push(item.whatWeDoWell);
    lines.push('');
    lines.push(`### What the Market Typically Misses`);
    lines.push(item.whatOthersMiss);
    lines.push('');
    lines.push(`**Evidence tier:** ${item.evidenceTier}`);
    lines.push(`**Practitioner benefit:** ${item.practitionerBenefit}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push(`*${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications} | ${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}*`);
  lines.push('');
  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  const output = lines.join('\n');
  enforceK10(output, `generateComparisonContent(${category})`);
  return output;
}

/**
 * Generates FAQ-style differentiation content.
 * Each question addresses a common practitioner concern without naming competitors.
 */
export function generateFaqDifferentiators(): string {
  const faqs: Array<{ question: string; answer: string }> = [
    {
      question: 'How is VitalMatrix different from other functional medicine platforms?',
      answer: `VitalMatrix is a ${VM_BRAND.platform.descriptor} that builds upon established functional medicine principles with a structured 5-zone terrain model. Unlike generic health platforms, every output includes evidence tier labels, cascade mapping between physiological zones, and mandatory practitioner decision sections. The platform amplifies what trained practitioners already know rather than replacing clinical judgement.`,
    },
    {
      question: 'Why should I trust the scoring model?',
      answer: 'The terrain scoring model is fully transparent. Each of the 7 physiological nodes maps to published functional medicine frameworks. Every score shows its derivation, evidence tier, and contributing factors. There are no hidden algorithms or proprietary black boxes. STRIDE validation applies 30 rules before any score reaches your clinical view.',
    },
    {
      question: 'What about data security and regulatory compliance?',
      answer: `VitalMatrix is Class I SaMD registered with ICO registration ${VM_BRAND.platform.ico}. All data is encrypted with AES-256-GCM at field level and resides in UK infrastructure. GDPR Art 17 compliant deletion is built in. The T-01 protective architecture ensures every output carries a mandatory practitioner decision section. The platform does not diagnose or prescribe.`,
    },
    {
      question: 'How does the pricing compare to other tools?',
      answer: `Founding cohort rate: GBP ${VM_BRAND.pricing.foundingMonthly}/month with a ${VM_BRAND.pricing.guarantee} and no lock-in contract. All assessments are unlimited within the subscription. There are no per-patient surcharges. Many comparable tools charge per assessment or require annual commitments.`,
    },
    {
      question: 'Does VitalMatrix replace my clinical training?',
      answer: `No. VitalMatrix builds upon your existing functional medicine knowledge. It structures and accelerates your clinical reasoning but every output requires your professional decision. The platform is designed for qualified practitioners (${VM_BRAND.platform.audience} audience only) and is never patient-facing.`,
    },
    {
      question: 'What if I am not IFM-trained?',
      answer: `VitalMatrix welcomes all qualified practitioners. The founding cohort rate is GBP ${VM_BRAND.pricing.foundingMonthly}/month for all practitioners. The onboarding sequence includes zone-by-zone guided walkthroughs that introduce the terrain model in the context of your existing speciality.`,
    },
    {
      question: 'How does VitalMatrix handle evidence quality?',
      answer: 'Every clinical claim in the platform carries one of five evidence tier labels: Established, Emerging, Theoretical, Observed in Practice, or Contested. PubMed citations are integrated directly. This allows you to communicate confidence levels to patients and defend your clinical decisions with sourced evidence.',
    },
  ];

  const lines: string[] = [
    '# VitalMatrix: Frequently Asked Questions',
    '',
    `*${VM_BRAND.platform.descriptor} | ${VM_BRAND.platform.domain}*`,
    '',
  ];

  for (const faq of faqs) {
    lines.push(`## ${faq.question}`);
    lines.push('');
    lines.push(faq.answer);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(`*${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications} | ${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}*`);
  lines.push('');
  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  const output = lines.join('\n');
  enforceK10(output, 'generateFaqDifferentiators');
  return output;
}
