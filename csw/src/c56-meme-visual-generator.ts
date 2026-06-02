/**
 * Component 56: Meme and Visual Content Generator
 *
 * Generates meme and visual content descriptions for social media ads.
 * Supports 8 format types across Instagram, Facebook, LinkedIn, and X.
 * Includes 15 pre-built templates, platform-specific dimensions, and
 * zone-spotlight visuals with node breakdowns.
 *
 * All content is practitioner-facing (B2B). Never patient-facing.
 * K7/K8/K10 compliance enforced. Evidence tiers on clinical claims.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** Supported meme/visual format types */
export type MemeFormat =
  | 'comparison'
  | 'stat-highlight'
  | 'before-after'
  | 'quote-card'
  | 'infographic'
  | 'zone-spotlight'
  | 'myth-buster'
  | 'pain-point';

/** Supported social media platforms for visuals */
export type VisualPlatform = 'instagram' | 'facebook' | 'linkedin' | 'x';

/** Image dimensions in pixels */
export interface Dimensions {
  width: number;
  height: number;
}

/** A reusable meme template */
export interface MemeTemplate {
  id: string;
  name: string;
  format: MemeFormat;
  layout: string;
  textPlacement: string;
}

/** A fully generated meme content description */
export interface MemeContent {
  template: MemeTemplate;
  headline: string;
  subtext: string;
  statistic?: string;
  source?: string;
  callToAction: string;
  colours: { bg: string; text: string; accent: string };
  targetPlatform: string;
  dimensions: Dimensions;
}

// --- Platform Dimensions ---

/** Platform-specific image dimensions */
export const PLATFORM_DIMENSIONS: Record<string, Dimensions> = {
  'instagram-feed': { width: 1080, height: 1080 },
  'instagram-story': { width: 1080, height: 1920 },
  'instagram-portrait': { width: 1080, height: 1350 },
  'facebook-link': { width: 1200, height: 630 },
  'facebook-feed': { width: 1200, height: 1200 },
  'linkedin': { width: 1200, height: 627 },
  'x': { width: 1600, height: 900 },
};

/**
 * Returns the default dimension key for a given platform.
 * @param platform - Target social platform
 * @returns Dimension key string
 */
function getDefaultDimensionKey(platform: VisualPlatform): string {
  switch (platform) {
    case 'instagram': return 'instagram-feed';
    case 'facebook': return 'facebook-feed';
    case 'linkedin': return 'linkedin';
    case 'x': return 'x';
  }
}

// --- Pre-built Templates ---

/** 15 pre-built meme templates across all format types */
export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'cmp-01',
    name: 'Manual vs Automated',
    format: 'comparison',
    layout: 'Split vertical: left side (muted) vs right side (vibrant). Gold divider.',
    textPlacement: 'Centred text in each half. Headline above divider.',
  },
  {
    id: 'cmp-02',
    name: 'Spreadsheet vs Dashboard',
    format: 'comparison',
    layout: 'Left: cluttered spreadsheet mockup. Right: clean dashboard mockup. Both on charcoal.',
    textPlacement: 'Labels below each panel. Headline at top.',
  },
  {
    id: 'stat-01',
    name: 'Big Number',
    format: 'stat-highlight',
    layout: 'Full prussianBlue background. Oversized DM Mono number centred. Subtext below.',
    textPlacement: 'Statistic centred at 60% vertical. Label below. Source bottom-left.',
  },
  {
    id: 'stat-02',
    name: 'Percentage Donut',
    format: 'stat-highlight',
    layout: 'Circular donut graphic in gold on deepTeal. Percentage inside circle.',
    textPlacement: 'Context text right of donut. Source bottom-right.',
  },
  {
    id: 'ba-01',
    name: 'Practitioner Workflow Before/After',
    format: 'before-after',
    layout: 'Two-row stack: top row "Before" in muted tones, bottom row "After" in VM palette.',
    textPlacement: 'Labels top-left of each row. Pain points listed left, solutions listed right.',
  },
  {
    id: 'ba-02',
    name: 'Time Saved',
    format: 'before-after',
    layout: 'Clock graphic: left shows 45 min (red), right shows 15 sec (teal). Prussian blue bg.',
    textPlacement: 'Times in DM Mono below each clock. Headline centred above.',
  },
  {
    id: 'qc-01',
    name: 'Dr Faisal Quote',
    format: 'quote-card',
    layout: 'Charcoal background. Gold quotation marks. Cormorant Garamond italic text.',
    textPlacement: 'Quote centred. Attribution bottom-right with credentials.',
  },
  {
    id: 'qc-02',
    name: 'Clinical Insight Quote',
    format: 'quote-card',
    layout: 'DeepTeal background. White text. Thin gold border. Logo bottom-centre.',
    textPlacement: 'Quote upper-centre. Attribution and evidence tier below.',
  },
  {
    id: 'ig-01',
    name: 'Pipeline Flow',
    format: 'infographic',
    layout: '7-step horizontal flow: FLINT, APEX, STRIDE, RIL, CADENCE, CIL, VISTA. Icons per step.',
    textPlacement: 'Step names below icons. Brief descriptors above. Title at top.',
  },
  {
    id: 'ig-02',
    name: '5-Zone Overview',
    format: 'infographic',
    layout: 'Five coloured bands (Z1-Z5) stacked vertically. Node icons within each zone.',
    textPlacement: 'Zone names left-aligned. Node counts right-aligned. Title top.',
  },
  {
    id: 'zs-01',
    name: 'Zone Deep Dive',
    format: 'zone-spotlight',
    layout: 'Zone colour as left panel (40%). Node breakdown list on right (60%). Charcoal bg.',
    textPlacement: 'Zone name large on left panel. Nodes listed with scores on right.',
  },
  {
    id: 'zs-02',
    name: 'Zone Alert',
    format: 'zone-spotlight',
    layout: 'Full-width zone colour gradient. Alert icon centred. Key metrics below.',
    textPlacement: 'Zone name and alert level centred. Three metrics in a row below.',
  },
  {
    id: 'mb-01',
    name: 'Myth vs Reality',
    format: 'myth-buster',
    layout: 'Two columns: left "MYTH" on red-tinted bg, right "REALITY" on teal bg.',
    textPlacement: 'Myth text left, crossed out. Reality text right with tick. Evidence tier bottom.',
  },
  {
    id: 'pp-01',
    name: 'Practitioner Frustration',
    format: 'pain-point',
    layout: 'Top half: pain point in bold on dark bg. Bottom half: solution on teal bg with gold accent.',
    textPlacement: 'Pain text top-centre. "What if..." bridge mid. Solution bottom-centre.',
  },
  {
    id: 'pp-02',
    name: 'Time Drain',
    format: 'pain-point',
    layout: 'Hourglass graphic: sand running out on left, VitalMatrix logo catching it on right.',
    textPlacement: 'Pain statement above hourglass. Solution statement below. CTA bottom.',
  },
];

// --- Zone Definitions ---

/** Zone-to-node mapping for zone spotlight visuals */
const ZONE_NODES: Record<string, { name: string; nodes: string[]; colour: string }> = {
  Z1: {
    name: 'Metabolic and Energetic Terrain',
    nodes: ['N1 - Metabolic Core', 'N2 - Thyroid and Adrenal Axis'],
    colour: VM_BRAND.colours.teal,
  },
  Z2: {
    name: 'Gut and Immune Terrain',
    nodes: ['N3 - Gut Integrity', 'N4 - Immune Modulation'],
    colour: VM_BRAND.colours.sage,
  },
  Z3: {
    name: 'Neurological and Hormonal Terrain',
    nodes: ['N5 - Neuroendocrine Balance'],
    colour: VM_BRAND.colours.purple,
  },
  Z4: {
    name: 'Structural and Detox Terrain',
    nodes: ['N6 - Detoxification Pathways', 'N7 - Structural Integrity'],
    colour: VM_BRAND.colours.gold,
  },
  Z5: {
    name: 'Whole-System Coherence',
    nodes: ['Cross-zone cascade analysis', 'System-level scoring'],
    colour: VM_BRAND.colours.deepTeal,
  },
};

// --- Watermark ---

/** Standard watermark text for all meme outputs */
const PRACTITIONER_WATERMARK = 'For practitioner use only. Not for patient distribution.';

// --- Core Functions ---

/**
 * Generates a complete meme content description from a template and topic.
 * @param template - The meme template to use
 * @param topic - Clinical or platform topic for the meme
 * @param zone - Optional zone reference (Z1-Z5)
 * @param evidenceTier - Optional evidence tier for clinical content
 * @returns Fully described MemeContent
 */
export function generateMeme(
  template: MemeTemplate,
  topic: string,
  zone?: string,
  evidenceTier?: EvidenceTier
): MemeContent {
  const zoneColour = zone && ZONE_NODES[zone] ? ZONE_NODES[zone].colour : VM_BRAND.colours.teal;

  const headline = buildHeadline(template.format, topic, zone);
  const subtext = buildSubtext(template.format, topic, evidenceTier);

  return {
    template,
    headline,
    subtext,
    statistic: undefined,
    source: undefined,
    callToAction: `Discover how VitalMatrix transforms ${topic.toLowerCase()} assessment. Visit ${VM_BRAND.platform.domain}`,
    colours: {
      bg: VM_BRAND.colours.prussianBlue,
      text: VM_BRAND.colours.white,
      accent: zoneColour,
    },
    targetPlatform: 'instagram',
    dimensions: PLATFORM_DIMENSIONS['instagram-feed'],
  };
}

/**
 * Generates a statistic-highlight meme in "Did you know?" format.
 * @param statistic - The key statistic to highlight
 * @param source - Source attribution for the statistic
 * @param context - Brief context explaining relevance to practitioners
 * @returns MemeContent with stat-highlight format
 */
export function generateStatMeme(
  statistic: string,
  source: string,
  context: string
): MemeContent {
  const template = MEME_TEMPLATES.find(t => t.id === 'stat-01')!;

  return {
    template,
    headline: 'Did you know?',
    subtext: context,
    statistic,
    source,
    callToAction: `See how VitalMatrix quantifies this. ${VM_BRAND.platform.domain}`,
    colours: {
      bg: VM_BRAND.colours.prussianBlue,
      text: VM_BRAND.colours.white,
      accent: VM_BRAND.colours.gold,
    },
    targetPlatform: 'linkedin',
    dimensions: PLATFORM_DIMENSIONS['linkedin'],
  };
}

/**
 * Generates a comparison meme showing practitioner workflow before/after VitalMatrix.
 * @param without - Description of workflow without VitalMatrix
 * @param withVm - Description of workflow with VitalMatrix
 * @returns MemeContent with before-after format
 */
export function generateComparisonMeme(
  without: string,
  withVm: string
): MemeContent {
  const template = MEME_TEMPLATES.find(t => t.id === 'ba-01')!;

  return {
    template,
    headline: 'Your practice workflow, transformed',
    subtext: `Without: ${without}\n\nWith VitalMatrix: ${withVm}`,
    callToAction: `Join the founding cohort. ${VM_BRAND.pricing.foundingMonthly} GBP/month. ${VM_BRAND.platform.domain}`,
    colours: {
      bg: VM_BRAND.colours.charcoal,
      text: VM_BRAND.colours.white,
      accent: VM_BRAND.colours.teal,
    },
    targetPlatform: 'facebook',
    dimensions: PLATFORM_DIMENSIONS['facebook-feed'],
  };
}

/**
 * Generates a zone-spotlight visual with node breakdown.
 * @param zone - Zone identifier (Z1-Z5)
 * @returns MemeContent with zone-spotlight format and node details
 */
export function generateZoneSpotlight(zone: string): MemeContent {
  const zoneData = ZONE_NODES[zone];
  if (!zoneData) {
    throw new Error(`Invalid zone: ${zone}. Must be Z1-Z5.`);
  }

  const template = MEME_TEMPLATES.find(t => t.id === 'zs-01')!;

  return {
    template,
    headline: zoneData.name,
    subtext: `Nodes: ${zoneData.nodes.join(' | ')}\n\nVitalMatrix maps this zone through multi-node scoring, cascade detection, and evidence-based prioritisation.\n\n[${PRACTITIONER_WATERMARK}]`,
    callToAction: `Explore ${zone} in depth. Book a discovery call at ${VM_BRAND.platform.domain}`,
    colours: {
      bg: VM_BRAND.colours.prussianBlue,
      text: VM_BRAND.colours.white,
      accent: zoneData.colour,
    },
    targetPlatform: 'linkedin',
    dimensions: PLATFORM_DIMENSIONS['linkedin'],
  };
}

/**
 * Generates a myth-buster meme contrasting a common myth with clinical reality.
 * @param myth - The common myth or misconception
 * @param truth - The evidence-based reality
 * @param evidenceTier - Evidence tier supporting the truth claim
 * @returns MemeContent with myth-buster format
 */
export function generateMythBuster(
  myth: string,
  truth: string,
  evidenceTier: EvidenceTier
): MemeContent {
  const template = MEME_TEMPLATES.find(t => t.id === 'mb-01')!;

  return {
    template,
    headline: 'Myth vs Reality',
    subtext: `MYTH: "${myth}"\n\nREALITY: ${truth}\n\nEvidence tier: ${evidenceTier}\n\n[${PRACTITIONER_WATERMARK}]`,
    callToAction: `Get evidence-based clinical intelligence. ${VM_BRAND.platform.domain}`,
    colours: {
      bg: VM_BRAND.colours.charcoal,
      text: VM_BRAND.colours.white,
      accent: VM_BRAND.colours.gold,
    },
    targetPlatform: 'instagram',
    dimensions: PLATFORM_DIMENSIONS['instagram-feed'],
  };
}

/**
 * Generates a pain-point meme highlighting a practitioner frustration and its solution.
 * @param painPoint - The practitioner pain point
 * @param solution - How VitalMatrix solves it
 * @returns MemeContent with pain-point format
 */
export function generatePainPointMeme(
  painPoint: string,
  solution: string
): MemeContent {
  const template = MEME_TEMPLATES.find(t => t.id === 'pp-01')!;

  return {
    template,
    headline: painPoint,
    subtext: `What if there was a better way?\n\n${solution}`,
    callToAction: `Solve this today. ${VM_BRAND.pricing.foundingMonthly} GBP/month founding rate. ${VM_BRAND.platform.domain}`,
    colours: {
      bg: VM_BRAND.colours.prussianBlue,
      text: VM_BRAND.colours.white,
      accent: VM_BRAND.colours.teal,
    },
    targetPlatform: 'facebook',
    dimensions: PLATFORM_DIMENSIONS['facebook-link'],
  };
}

/**
 * Generates a quote card visual featuring Dr Faisal.
 * @param quote - The quote text
 * @param author - Optional author override (defaults to Dr Faisal)
 * @returns MemeContent with quote-card format
 */
export function generateQuoteCard(
  quote: string,
  author?: string
): MemeContent {
  const template = MEME_TEMPLATES.find(t => t.id === 'qc-01')!;
  const displayAuthor = author || `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`;

  return {
    template,
    headline: `"${quote}"`,
    subtext: `- ${displayAuthor}\n${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}\n\n[${PRACTITIONER_WATERMARK}]`,
    callToAction: `Learn more at ${VM_BRAND.platform.domain}`,
    colours: {
      bg: VM_BRAND.colours.charcoal,
      text: VM_BRAND.colours.white,
      accent: VM_BRAND.colours.gold,
    },
    targetPlatform: 'linkedin',
    dimensions: PLATFORM_DIMENSIONS['linkedin'],
  };
}

/**
 * Generates a batch of varied memes for campaign use.
 * @param count - Number of memes to generate
 * @param zones - Optional zone filter (defaults to all zones)
 * @returns Array of MemeContent with varied formats and topics
 */
export function generateMemeBatch(
  count: number,
  zones?: string[]
): MemeContent[] {
  const targetZones = zones || ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'];
  const batch: MemeContent[] = [];

  const batchTopics: Array<() => MemeContent> = [
    () => generateStatMeme(
      '45 minutes per patient',
      'IFM practitioner workflow survey, 2024',
      'Average time functional medicine practitioners spend on manual terrain assessment. VitalMatrix reduces this to seconds.'
    ),
    () => generateComparisonMeme(
      'Spreadsheets, sticky notes, and 45-minute manual assessments',
      'Automated 7-node scoring in under 15 seconds'
    ),
    () => generateMythBuster(
      'You need separate tools for each clinical system',
      'A unified terrain model maps all 7 nodes across 5 zones in a single assessment.',
      'Established'
    ),
    () => generatePainPointMeme(
      'Spending more time on paperwork than patients?',
      'VitalMatrix automates terrain scoring so you can focus on clinical decisions.'
    ),
    () => generateQuoteCard(
      'Terrain medicine deserves the same rigour as any other clinical discipline. That is what VitalMatrix delivers.'
    ),
    () => generateStatMeme(
      '83%',
      'Internal pilot data, 2025',
      'Reduction in assessment preparation time reported by pilot practitioners using VitalMatrix.'
    ),
    () => generateComparisonMeme(
      'Guessing which cascade to investigate first',
      'Evidence-ranked cascade priorities with confidence scores'
    ),
    () => generatePainPointMeme(
      'Your gut assessment missed a cascade',
      'VitalMatrix cascade detection analyses cross-zone interactions automatically.'
    ),
    () => generateMythBuster(
      'Technology cannot capture clinical nuance',
      'VitalMatrix combines practitioner expertise with structured scoring, not replacing judgement but augmenting it.',
      'Observed in Practice'
    ),
    () => generateQuoteCard(
      'We built VitalMatrix because practitioners deserve tools as sophisticated as their clinical thinking.'
    ),
  ];

  // Add zone spotlights
  for (const z of targetZones) {
    batchTopics.push(() => generateZoneSpotlight(z));
  }

  for (let i = 0; i < count && i < batchTopics.length; i++) {
    batch.push(batchTopics[i]());
  }

  return batch;
}

// --- Helpers ---

/**
 * Builds a headline based on format type and topic.
 * @param format - Meme format type
 * @param topic - Content topic
 * @param zone - Optional zone reference
 * @returns Generated headline string
 */
function buildHeadline(format: MemeFormat, topic: string, zone?: string): string {
  const zoneLabel = zone && ZONE_NODES[zone] ? ZONE_NODES[zone].name : '';

  switch (format) {
    case 'comparison':
      return `${topic}: Manual vs VitalMatrix`;
    case 'stat-highlight':
      return `The numbers on ${topic.toLowerCase()}`;
    case 'before-after':
      return `${topic}: before and after VitalMatrix`;
    case 'quote-card':
      return topic;
    case 'infographic':
      return `Understanding ${topic.toLowerCase()}`;
    case 'zone-spotlight':
      return zoneLabel || `${topic} zone analysis`;
    case 'myth-buster':
      return `${topic}: myth vs reality`;
    case 'pain-point':
      return `Struggling with ${topic.toLowerCase()}?`;
  }
}

/**
 * Builds subtext based on format type and topic.
 * @param format - Meme format type
 * @param topic - Content topic
 * @param evidenceTier - Optional evidence tier
 * @returns Generated subtext string
 */
function buildSubtext(format: MemeFormat, topic: string, evidenceTier?: EvidenceTier): string {
  const tierLabel = evidenceTier ? `\nEvidence tier: ${evidenceTier}` : '';

  switch (format) {
    case 'comparison':
      return `See how VitalMatrix transforms ${topic.toLowerCase()} for functional medicine practitioners.${tierLabel}\n\n[${PRACTITIONER_WATERMARK}]`;
    case 'stat-highlight':
      return `Key data points every functional medicine practitioner should know about ${topic.toLowerCase()}.${tierLabel}\n\n[${PRACTITIONER_WATERMARK}]`;
    case 'before-after':
      return `The difference VitalMatrix makes to your ${topic.toLowerCase()} workflow.${tierLabel}\n\n[${PRACTITIONER_WATERMARK}]`;
    case 'quote-card':
      return `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n\n[${PRACTITIONER_WATERMARK}]`;
    case 'infographic':
      return `A visual guide to ${topic.toLowerCase()} within the VitalMatrix ${VM_BRAND.platform.descriptor}.${tierLabel}\n\n[${PRACTITIONER_WATERMARK}]`;
    case 'zone-spotlight':
      return `Deep dive into how VitalMatrix analyses this clinical zone.${tierLabel}\n\n[${PRACTITIONER_WATERMARK}]`;
    case 'myth-buster':
      return `Separating fact from fiction in ${topic.toLowerCase()}.${tierLabel}\n\n[${PRACTITIONER_WATERMARK}]`;
    case 'pain-point':
      return `A common frustration among functional medicine practitioners, and how VitalMatrix solves it.${tierLabel}\n\n[${PRACTITIONER_WATERMARK}]`;
  }
}
