/**
 * Component 28: A/B Copy Variants
 * EXTREMELY HIGH-YIELD
 *
 * Generates 3 variants of headlines, CTAs, email subjects, and body
 * openings with different psychological hooks. Every variant is
 * compliance-checked against K7 (credentials), K8 (British English),
 * and K10 (no competitor names) before output.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type HookType =
  | 'curiosity'
  | 'urgency'
  | 'authority'
  | 'social-proof'
  | 'pain-point'
  | 'benefit-led';

export interface CopyVariant {
  id: string;
  original: string;
  variant: string;
  hookType: HookType;
}

export interface ComplianceViolation {
  rule: 'K7' | 'K8' | 'K10';
  detail: string;
}

export interface VariantResult {
  variants: CopyVariant[];
  compliancePass: boolean;
  violations: ComplianceViolation[];
}

// --- Compliance ---

/**
 * Check a single string against K7, K8, and K10 kill-list rules.
 */
function checkCompliance(text: string): ComplianceViolation[] {
  const violations: ComplianceViolation[] = [];

  // K7: Credential errors — must be MBBS, FAAMFM. Never MD, never FMAARM
  if (/\bMD\b/.test(text) && !/\bMD\b.*simulation|markdown/i.test(text)) {
    violations.push({ rule: 'K7', detail: 'Credential error: "MD" found. Must use MBBS, FAAMFM.' });
  }
  if (/FMAARM/i.test(text)) {
    violations.push({ rule: 'K7', detail: 'Credential error: "FMAARM" found. Must use FAAMFM.' });
  }

  // K8: British English — no em dashes, check common American spellings
  if (/\u2014/.test(text)) {
    violations.push({ rule: 'K8', detail: 'Em dash found. Use en dash or comma instead.' });
  }
  if (/\boptimiz(?:e|ation|ing)\b/i.test(text)) {
    violations.push({ rule: 'K8', detail: 'American spelling "optimize" found. Use "optimise".' });
  }
  if (/\bpersonaliz(?:e|ation|ing)\b/i.test(text)) {
    violations.push({ rule: 'K8', detail: 'American spelling "personalize" found. Use "personalise".' });
  }
  if (/\bspecializ(?:e|ation|ing)\b/i.test(text)) {
    violations.push({ rule: 'K8', detail: 'American spelling "specialize" found. Use "specialise".' });
  }

  // K10: No competitor names
  if (/Dr\.?\s*Mark\s*Hyman/i.test(text)) {
    violations.push({ rule: 'K10', detail: 'Competitor name "Dr Mark Hyman" found.' });
  }
  if (/\bLaValle\b/i.test(text)) {
    violations.push({ rule: 'K10', detail: 'Competitor name "LaValle" found.' });
  }
  if (/Metabolic\s*Code/i.test(text)) {
    violations.push({ rule: 'K10', detail: 'Competitor adjacent term "Metabolic Code" found.' });
  }

  return violations;
}

// --- Helpers ---

function generateId(): string {
  return `vm-variant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickThreeHooks(exclude?: HookType): HookType[] {
  const allHooks: HookType[] = [
    'curiosity',
    'urgency',
    'authority',
    'social-proof',
    'pain-point',
    'benefit-led',
  ];
  const available = exclude ? allHooks.filter((h) => h !== exclude) : allHooks;
  // Shuffle and pick 3
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// --- Hook Templates ---

const HEADLINE_HOOKS: Record<HookType, (original: string) => string> = {
  curiosity: (o) =>
    `What ${VM_BRAND.platform.audience.toLowerCase() === 'practitioner' ? 'practitioners' : 'clinicians'} are discovering about ${extractTopic(o)}`,
  urgency: (o) =>
    `Your patients cannot wait: ${extractTopic(o)} demands action now`,
  authority: (o) =>
    `${VM_BRAND.credentials.name} (${VM_BRAND.credentials.qualifications}): Why ${extractTopic(o)} changes everything`,
  'social-proof': (o) =>
    `Founding cohort practitioners are already seeing results with ${extractTopic(o)}`,
  'pain-point': (o) =>
    `Still guessing on ${extractTopic(o)}? There is a better way`,
  'benefit-led': (o) =>
    `Reduce clinical decision time with evidence-led ${extractTopic(o)}`,
};

const CTA_HOOKS: Record<HookType, (original: string) => string> = {
  curiosity: (o) =>
    `Discover how ${extractTopic(o)} works`,
  urgency: (o) =>
    `Start your ${extractTopic(o)} assessment today`,
  authority: (o) =>
    `See the ${VM_BRAND.platform.descriptor} in action`,
  'social-proof': (o) =>
    `Join ${VM_BRAND.platform.audience.toLowerCase()}s already using ${extractTopic(o)}`,
  'pain-point': (o) =>
    `Stop guessing. Get clarity on ${extractTopic(o)}`,
  'benefit-led': (o) =>
    `Unlock better outcomes with ${extractTopic(o)}`,
};

const SUBJECT_HOOKS: Record<HookType, (original: string) => string> = {
  curiosity: (o) =>
    `Have you seen this approach to ${extractTopic(o)}?`,
  urgency: (o) =>
    `Limited founding cohort places: ${extractTopic(o)} inside`,
  authority: (o) =>
    `From ${VM_BRAND.credentials.name}: ${extractTopic(o)}`,
  'social-proof': (o) =>
    `Practitioners are talking about ${extractTopic(o)}`,
  'pain-point': (o) =>
    `Frustrated with ${extractTopic(o)}? Read this`,
  'benefit-led': (o) =>
    `How ${extractTopic(o)} saves you 2 hours per patient`,
};

const BODY_OPENING_HOOKS: Record<HookType, (original: string) => string> = {
  curiosity: (o) =>
    `What if the way you assess ${extractTopic(o)} has been missing a critical dimension? The VitalMatrix ${VM_BRAND.platform.descriptor} reveals patterns that traditional approaches overlook.`,
  urgency: (o) =>
    `Every week without structured ${extractTopic(o)} assessment means clinical decisions made on incomplete data. The founding cohort window is closing.`,
  authority: (o) =>
    `After years of clinical practice and IFM training, ${VM_BRAND.credentials.name} (${VM_BRAND.credentials.qualifications}) built VitalMatrix to solve a problem every functional medicine practitioner faces: ${extractTopic(o)}.`,
  'social-proof': (o) =>
    `Practitioners in the founding cohort are already reporting faster clinical reasoning and more confident treatment decisions when it comes to ${extractTopic(o)}.`,
  'pain-point': (o) =>
    `You know the feeling: a complex patient, overlapping symptoms, and no structured way to assess ${extractTopic(o)}. Spreadsheets and guesswork are not enough.`,
  'benefit-led': (o) =>
    `Imagine cutting your ${extractTopic(o)} assessment time in half whilst improving clinical confidence. That is what the VitalMatrix ${VM_BRAND.platform.descriptor} delivers.`,
};

/**
 * Extract the core topic from the original text.
 * Strips common filler and returns a concise noun phrase.
 */
function extractTopic(original: string): string {
  return original
    .replace(/^(how to|why|what|the|a|an|your|our)\s+/i, '')
    .replace(/[.!?]+$/, '')
    .toLowerCase()
    .trim() || 'terrain assessment';
}

// --- Generator Functions ---

/**
 * Generate 3 headline variants from an original headline,
 * each using a different psychological hook.
 */
export function generateHeadlineVariants(original: string): VariantResult {
  const hooks = pickThreeHooks();
  const allViolations: ComplianceViolation[] = [];
  const variants: CopyVariant[] = hooks.map((hook) => {
    const variant = HEADLINE_HOOKS[hook](original);
    const violations = checkCompliance(variant);
    allViolations.push(...violations);
    return {
      id: generateId(),
      original,
      variant,
      hookType: hook,
    };
  });

  return {
    variants,
    compliancePass: allViolations.length === 0,
    violations: allViolations,
  };
}

/**
 * Generate 3 CTA variants from an original CTA,
 * each using a different psychological hook.
 */
export function generateCtaVariants(original: string): VariantResult {
  const hooks = pickThreeHooks();
  const allViolations: ComplianceViolation[] = [];
  const variants: CopyVariant[] = hooks.map((hook) => {
    const variant = CTA_HOOKS[hook](original);
    const violations = checkCompliance(variant);
    allViolations.push(...violations);
    return {
      id: generateId(),
      original,
      variant,
      hookType: hook,
    };
  });

  return {
    variants,
    compliancePass: allViolations.length === 0,
    violations: allViolations,
  };
}

/**
 * Generate 3 email subject line variants from an original subject,
 * each using a different psychological hook.
 */
export function generateSubjectLineVariants(original: string): VariantResult {
  const hooks = pickThreeHooks();
  const allViolations: ComplianceViolation[] = [];
  const variants: CopyVariant[] = hooks.map((hook) => {
    const variant = SUBJECT_HOOKS[hook](original);
    const violations = checkCompliance(variant);
    allViolations.push(...violations);
    return {
      id: generateId(),
      original,
      variant,
      hookType: hook,
    };
  });

  return {
    variants,
    compliancePass: allViolations.length === 0,
    violations: allViolations,
  };
}

/**
 * Generate 3 body opening variants from an original topic/opening,
 * each using a different psychological hook.
 */
export function generateBodyOpeningVariants(original: string): VariantResult {
  const hooks = pickThreeHooks();
  const allViolations: ComplianceViolation[] = [];
  const variants: CopyVariant[] = hooks.map((hook) => {
    const variant = BODY_OPENING_HOOKS[hook](original);
    const violations = checkCompliance(variant);
    allViolations.push(...violations);
    return {
      id: generateId(),
      original,
      variant,
      hookType: hook,
    };
  });

  return {
    variants,
    compliancePass: allViolations.length === 0,
    violations: allViolations,
  };
}

/**
 * Run compliance check on arbitrary text. Exposed for external use.
 */
export function runComplianceCheck(text: string): ComplianceViolation[] {
  return checkCompliance(text);
}
