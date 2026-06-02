/**
 * c71-ugc-amplifier.ts
 * VitalMatrix Content Studio — User-Generated Content Amplifier
 *
 * Captures, reviews, approves and amplifies user-generated content
 * from founding practitioners across LinkedIn, Facebook, Instagram and X.
 *
 * RULES:
 * - Never amplify without explicit consent.
 * - Never include patient data.
 * - Evidence tier required on clinical observations.
 * - Regulatory footer on all amplified outputs.
 *
 * K7: credentials locked (MBBS, FAAMFM).
 * K8: British English throughout.
 * K10: ZERO competitor names.
 *
 * (c) VitalMatrix Ltd 2026. All rights reserved.
 */

import { VM_BRAND } from './brand-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Evidence tier re-export for clinical claim tagging. */
export type EvidenceTier = typeof VM_BRAND.evidenceTiers[number];

/** The kind of user-generated content. */
export type UgcContentType =
  | 'testimonial'
  | 'case-mention'
  | 'screenshot-share'
  | 'recommendation'
  | 'clinical-observation';

/** A captured piece of user-generated content. */
export interface UgcItem {
  /** Unique identifier. */
  id: string;
  /** Practitioner's name. */
  practitionerName: string;
  /** Practitioner's professional title. */
  practitionerTitle: string;
  /** Platform where the content was originally posted. */
  originalPlatform: string;
  /** The original content text. */
  originalContent: string;
  /** Content classification. */
  contentType: UgcContentType;
  /** ISO date when the content was posted. */
  datePosted: string;
  /** Whether the content has been reviewed and approved for amplification. */
  approved: boolean;
  /** Whether explicit consent has been obtained from the practitioner. */
  consentObtained: boolean;
}

/** Amplified versions of a UGC item for each platform. */
export interface AmplifiedContent {
  /** The original UGC item. */
  original: UgcItem;
  /** LinkedIn version. */
  linkedin: string;
  /** Facebook version. */
  facebook: string;
  /** Instagram version. */
  instagram: string;
  /** X (formerly Twitter) version. */
  x: string;
}

// ---------------------------------------------------------------------------
// In-memory UGC store
// ---------------------------------------------------------------------------

const ugcStore: Map<string, UgcItem> = new Map();
let nextId = 1;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Generates a unique UGC item ID.
 */
function generateId(): string {
  return `UGC-${String(nextId++).padStart(4, '0')}`;
}

/**
 * Validates that a UGC item is safe to amplify.
 * Checks consent, approval and absence of patient data indicators.
 */
function validateForAmplification(item: UgcItem): string[] {
  const errors: string[] = [];
  if (!item.approved) errors.push('Content has not been approved.');
  if (!item.consentObtained) errors.push('Practitioner consent has not been obtained.');

  const patientDataIndicators = [
    'patient name',
    'date of birth',
    'NHS number',
    'address',
    'diagnosis',
    'diagnosed with',
    'test result',
    'blood test',
    'lab result',
  ];

  const lowerContent = item.originalContent.toLowerCase();
  for (const indicator of patientDataIndicators) {
    if (lowerContent.includes(indicator)) {
      errors.push(`Potential patient data detected: "${indicator}". Manual review required.`);
    }
  }

  return errors;
}

/**
 * Builds an evidence tier note if the content type is clinical-observation.
 */
function evidenceNote(item: UgcItem): string {
  if (item.contentType === 'clinical-observation') {
    return '\n[Evidence tier: Observed in Practice]';
  }
  return '';
}

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Captures a new piece of user-generated content.
 *
 * @param practitioner - Object with name and title.
 * @param content      - The original content text.
 * @param platform     - Platform where the content was posted.
 * @param type         - Content classification.
 * @returns The stored {@link UgcItem} with a generated ID.
 */
export function captureUgc(
  practitioner: { name: string; title: string },
  content: string,
  platform: string,
  type: UgcContentType,
): UgcItem {
  const item: UgcItem = {
    id: generateId(),
    practitionerName: practitioner.name,
    practitionerTitle: practitioner.title,
    originalPlatform: platform,
    originalContent: content,
    contentType: type,
    datePosted: new Date().toISOString().split('T')[0],
    approved: false,
    consentObtained: false,
  };

  ugcStore.set(item.id, item);
  return item;
}

/**
 * Marks a UGC item as approved after internal review.
 *
 * @param id - The UGC item ID.
 * @returns The updated {@link UgcItem}, or null if not found.
 */
export function approveUgc(id: string): UgcItem | null {
  const item = ugcStore.get(id);
  if (!item) return null;
  item.approved = true;
  return item;
}

/**
 * Marks a UGC item as having practitioner consent.
 *
 * @param id - The UGC item ID.
 * @returns The updated {@link UgcItem}, or null if not found.
 */
export function obtainConsent(id: string): UgcItem | null {
  const item = ugcStore.get(id);
  if (!item) return null;
  item.consentObtained = true;
  return item;
}

/**
 * Amplifies a UGC item into 4-platform versions with attribution.
 * Throws if the item has not been approved or consent has not been obtained.
 *
 * @param id - The UGC item ID.
 * @returns An {@link AmplifiedContent} object with platform-specific versions.
 * @throws Error if validation fails.
 */
export function amplifyUgc(id: string): AmplifiedContent {
  const item = ugcStore.get(id);
  if (!item) {
    throw new Error(`UGC item ${id} not found.`);
  }

  const errors = validateForAmplification(item);
  if (errors.length > 0) {
    throw new Error(`Cannot amplify ${id}: ${errors.join(' ')}`);
  }

  const attribution = `${item.practitionerName}, ${item.practitionerTitle}`;
  const evidenceSuffix = evidenceNote(item);
  const footer = VM_BRAND.regulatoryFooter;

  const linkedin =
    `"${item.originalContent}"\n\n` +
    `${attribution} shared their experience with VitalMatrix.${evidenceSuffix}\n\n` +
    `VitalMatrix is a ${VM_BRAND.platform.descriptor} for functional medicine practitioners.\n\n` +
    `${footer}`;

  const facebook =
    `${attribution} shared their experience with VitalMatrix:\n\n` +
    `"${item.originalContent}"${evidenceSuffix}\n\n` +
    `Want to see what VitalMatrix can do for your practice? Link in comments.\n\n` +
    `${footer}`;

  const instagram =
    `"${item.originalContent}"\n\n` +
    `${attribution}${evidenceSuffix}\n\n` +
    `#VitalMatrix #FunctionalMedicine #TerrainAssessment #ClinicalIntelligence\n\n` +
    `${footer}`;

  const x =
    `"${item.originalContent.length > 180 ? item.originalContent.substring(0, 177) + '...' : item.originalContent}" ` +
    `${attribution}${evidenceSuffix}\n\n${footer}`;

  return { original: item, linkedin, facebook, instagram, x };
}

/**
 * Generates a weekly or monthly roundup post from multiple UGC items.
 *
 * @param items - UGC items to include in the roundup.
 * @returns A markdown-formatted roundup post.
 */
export function generateUgcRoundup(items: UgcItem[]): string {
  const approved = items.filter((i) => i.approved && i.consentObtained);

  if (approved.length === 0) {
    return '# UGC Roundup\n\nNo approved and consented content available for this period.';
  }

  const entries = approved
    .map(
      (item) =>
        `### ${item.practitionerName}, ${item.practitionerTitle}\n` +
        `*${item.contentType} on ${item.originalPlatform} (${item.datePosted})*\n\n` +
        `> "${item.originalContent}"${evidenceNote(item)}`,
    )
    .join('\n\n');

  return (
    `# What Founding Practitioners Are Saying\n\n` +
    `${approved.length} practitioners shared their experience with VitalMatrix.\n\n` +
    entries +
    `\n\n---\n${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`
  );
}

/**
 * Generates a polite request template asking a practitioner to share their experience.
 *
 * @param practitionerName - The practitioner's name.
 * @returns A personalised request message.
 */
export function generateUgcRequestTemplate(practitionerName: string): string {
  return (
    `Hi ${practitionerName},\n\n` +
    `Thank you for being part of the VitalMatrix founding cohort. We would love to hear ` +
    `how VitalMatrix has supported your clinical workflow.\n\n` +
    `If you are comfortable sharing a brief observation, testimonial or screenshot, we would ` +
    `be grateful. It helps other FM practitioners understand what VitalMatrix offers.\n\n` +
    `A few guidelines:\n` +
    `- Please do not include any patient-identifiable information.\n` +
    `- Please do not make diagnostic claims about VitalMatrix.\n` +
    `- Share your genuine experience in your own words.\n\n` +
    `We will always ask for your explicit approval before sharing anything publicly.\n\n` +
    `Best,\n` +
    `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n` +
    `${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`
  );
}

/**
 * Generates UGC guidelines for practitioners.
 * Details what they can and cannot share.
 *
 * @returns A markdown-formatted guidelines document.
 */
export function generateUgcGuidelines(): string {
  return (
    `# VitalMatrix UGC Guidelines for Practitioners\n\n` +
    `We value your feedback and are grateful when you share your experience. ` +
    `Please follow these guidelines:\n\n` +
    `## You CAN share\n` +
    `- Your general impression of VitalMatrix.\n` +
    `- How VitalMatrix has affected your clinical workflow.\n` +
    `- Observations about terrain assessment, zone scoring or cascade detection.\n` +
    `- Screenshots of the platform (with no patient data visible).\n` +
    `- Recommendations to colleagues.\n\n` +
    `## You CANNOT share\n` +
    `- Any patient-identifiable information (names, dates of birth, NHS numbers).\n` +
    `- Specific diagnostic claims (VitalMatrix does not diagnose).\n` +
    `- Lab results or test data, even if anonymised.\n` +
    `- Internal architecture details (node/zone scoring algorithms).\n` +
    `- Pricing information beyond the published founding rate.\n\n` +
    `## Evidence tiers\n` +
    `If your content includes a clinical observation, please tag it with the ` +
    `appropriate evidence tier:\n` +
    VM_BRAND.evidenceTiers.map((t) => `- ${t}`).join('\n') +
    `\n\n## Consent\n` +
    `We will never share your content publicly without your explicit written approval.\n\n` +
    `---\n${VM_BRAND.regulatoryFooter}`
  );
}

/**
 * Generates a UGC performance report.
 *
 * @returns A markdown-formatted report on UGC volume, platforms and status.
 */
export function generateUgcReport(): string {
  const items = Array.from(ugcStore.values());
  const total = items.length;
  const approved = items.filter((i) => i.approved).length;
  const consented = items.filter((i) => i.consentObtained).length;
  const ready = items.filter((i) => i.approved && i.consentObtained).length;

  const byPlatform: Record<string, number> = {};
  const byType: Record<string, number> = {};

  for (const item of items) {
    byPlatform[item.originalPlatform] = (byPlatform[item.originalPlatform] || 0) + 1;
    byType[item.contentType] = (byType[item.contentType] || 0) + 1;
  }

  const platformLines = Object.entries(byPlatform)
    .map(([p, c]) => `- ${p}: ${c}`)
    .join('\n');

  const typeLines = Object.entries(byType)
    .map(([t, c]) => `- ${t}: ${c}`)
    .join('\n');

  return (
    `# UGC Performance Report\n\n` +
    `**Total captured:** ${total}\n` +
    `**Approved:** ${approved}\n` +
    `**Consented:** ${consented}\n` +
    `**Ready to amplify:** ${ready}\n\n` +
    `## By platform\n${platformLines || '- None'}\n\n` +
    `## By content type\n${typeLines || '- None'}\n\n` +
    `---\n${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`
  );
}
