/**
 * c68-social-proof-screenshot.ts
 * VitalMatrix Content Studio — Social Proof Screenshot Generator
 *
 * Generates platform screenshot descriptions and shareable social proof
 * cards for use across social media, ads and landing pages.
 *
 * All cards carry a "For practitioner use only" watermark and never
 * contain actual patient data.
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

/** Supported screenshot categories. */
export type ScreenshotType =
  | 'terrain-assessment'
  | 'zone-scoring'
  | 'cascade-atlas'
  | 'deltascan-comparison'
  | 'pipeline-flow'
  | 'intake-form';

/** A shareable social proof card describing a platform screenshot. */
export interface SocialProofCard {
  /** Card headline. */
  title: string;
  /** Short description of what the screenshot shows. */
  description: string;
  /** Detailed textual description of the screenshot contents. */
  screenshotDescription: string;
  /** Text overlaid on the screenshot image. */
  overlayText: string;
  /** Badge text shown in corner (e.g. "VitalMatrix Clinical Intelligence Platform"). */
  platformBadge: string;
  /** Pixel dimensions for the target platform. */
  dimensions: { width: number; height: number };
  /** Call-to-action text. */
  callToAction: string;
}

// ---------------------------------------------------------------------------
// Pre-built screenshot definitions
// ---------------------------------------------------------------------------

interface ScreenshotDefinition {
  title: string;
  description: string;
  screenshotDescription: string;
  overlayText: string;
  callToAction: string;
  evidenceTier?: EvidenceTier;
}

const SCREENSHOT_LIBRARY: Record<ScreenshotType, ScreenshotDefinition> = {
  'terrain-assessment': {
    title: 'Live Terrain Assessment',
    description: 'See how VitalMatrix scores all 7 nodes in real time, with zone activations highlighted.',
    screenshotDescription:
      'A dashboard displaying 7 terrain nodes (N1 Gut, N2 Immune-Inflammatory, N3 Energy-Mitochondria, ' +
      'N4 Detox-Biotransformation, N5 Cardiovascular-Metabolic, N6 Neuroendocrine, N7 Structural-Musculoskeletal) ' +
      'each with a numerical score and colour-coded severity indicator. Zone activations (Z1 through Z5) are ' +
      'highlighted on the right panel. Watermark: "For practitioner use only. Sample data."',
    overlayText: '7 nodes. 5 zones. One systematic view.',
    callToAction: 'See how terrain scoring works.',
  },
  'zone-scoring': {
    title: 'Zone Scoring Dashboard',
    description: 'A 5-zone status overview showing which clinical zones are currently active.',
    screenshotDescription:
      'A horizontal bar chart showing 5 zones: Z1 (Energy-Neuroendocrine), Z2 (Immune-Inflammatory), ' +
      'Z3 (Cardiovascular-Metabolic), Z4 (Detox-Biotransformation), Z5 (Hormonal-Reproductive). Each zone ' +
      'displays a composite score derived from contributing nodes. Active zones are highlighted in ' +
      `${VM_BRAND.colours.teal}. Watermark: "For practitioner use only. Sample data."`,
    overlayText: 'Which zones need attention? See it at a glance.',
    callToAction: 'Explore zone-level clinical intelligence.',
  },
  'cascade-atlas': {
    title: 'CascadeAtlas View',
    description: 'Visualise cascade pathways between nodes and zones.',
    screenshotDescription:
      'A network diagram showing directional cascade pathways between the 7 nodes. Highlighted edges ' +
      'indicate active cascades (e.g. N1 to N2, N2 to N6). Each edge is labelled with the cascade ' +
      'type and evidence tier. A sidebar lists the top 5 active cascades with severity scores. ' +
      'Watermark: "For practitioner use only. Sample data."',
    overlayText: 'Cascades your assessment might be missing.',
    callToAction: 'See how CascadeAtlas maps clinical connections.',
    evidenceTier: 'Observed in Practice',
  },
  'deltascan-comparison': {
    title: 'DeltaScan Comparison',
    description: 'Compare visit 1 and visit 2 side by side to track clinical improvement.',
    screenshotDescription:
      'A split-screen comparison: left panel shows Visit 1 terrain scores (all 7 nodes), right panel ' +
      'shows Visit 2 scores. Delta arrows indicate improvement (green, downward) or deterioration ' +
      '(amber, upward) for each node. A summary bar at the bottom shows overall terrain improvement ' +
      'percentage. Watermark: "For practitioner use only. Sample data."',
    overlayText: 'Track real clinical progress, visit by visit.',
    callToAction: 'See how DeltaScan tracks outcomes.',
  },
  'pipeline-flow': {
    title: 'FLINT Pipeline',
    description: 'The 6-engine clinical intelligence pipeline in a single flow diagram.',
    screenshotDescription:
      'A horizontal flow diagram showing 6 pipeline engines: FLINT, APEX, STRIDE, RIL, CADENCE/CIL, ' +
      'and VISTA. Each engine is represented as a rounded rectangle with its name and a one-line ' +
      'descriptor. Arrows connect them left to right. The current processing stage is highlighted. ' +
      'Watermark: "For practitioner use only. Illustrative."',
    overlayText: 'From intake to insight in 6 steps.',
    callToAction: 'Discover the VitalMatrix pipeline.',
  },
  'intake-form': {
    title: 'Terrain Support Considerations',
    description: 'Preview of the structured output document generated after assessment.',
    screenshotDescription:
      'A document preview showing a structured clinical output: patient header (redacted), terrain ' +
      'summary table, zone activation list, cascade alerts, and terrain support considerations. ' +
      'Each recommendation carries an evidence tier badge. The document footer shows the VitalMatrix ' +
      'regulatory disclaimer. Watermark: "For practitioner use only. Sample data."',
    overlayText: 'Structured outputs, evidence-tagged.',
    callToAction: 'See what a VitalMatrix output looks like.',
  },
};

// ---------------------------------------------------------------------------
// Platform dimension presets
// ---------------------------------------------------------------------------

const PLATFORM_DIMENSIONS: Record<string, { width: number; height: number }> = {
  linkedin: { width: 1200, height: 627 },
  facebook: { width: 1200, height: 630 },
  instagram: { width: 1080, height: 1080 },
  x: { width: 1200, height: 675 },
  story: { width: 1080, height: 1920 },
  email: { width: 600, height: 400 },
};

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Generates a social proof card for a given screenshot type and platform.
 *
 * @param type     - The screenshot category.
 * @param platform - Target social platform (defaults to "linkedin").
 * @returns A fully populated {@link SocialProofCard}.
 */
export function generateScreenshotCard(
  type: ScreenshotType,
  platform: string = 'linkedin',
): SocialProofCard {
  const def = SCREENSHOT_LIBRARY[type];
  const dims = PLATFORM_DIMENSIONS[platform] || PLATFORM_DIMENSIONS.linkedin;

  return {
    title: def.title,
    description: def.description,
    screenshotDescription: def.screenshotDescription,
    overlayText: def.overlayText,
    platformBadge: `VitalMatrix | ${VM_BRAND.platform.descriptor}`,
    dimensions: dims,
    callToAction: def.callToAction,
  };
}

/**
 * Generates a before/after comparison card for a specific metric.
 *
 * @param metricBefore - The initial metric value (e.g. "N3 score: 72").
 * @param metricAfter  - The follow-up metric value (e.g. "N3 score: 41").
 * @param context      - Clinical context for the improvement.
 * @returns A {@link SocialProofCard} showing the comparison.
 */
export function generateBeforeAfterCard(
  metricBefore: string,
  metricAfter: string,
  context: string,
): SocialProofCard {
  return {
    title: 'Clinical Progress Tracked',
    description: `Before: ${metricBefore}. After: ${metricAfter}. ${context}`,
    screenshotDescription:
      `Left panel: "${metricBefore}" displayed in ${VM_BRAND.colours.gold} on a ` +
      `${VM_BRAND.colours.prussianBlue} background. Right panel: "${metricAfter}" displayed in ` +
      `${VM_BRAND.colours.teal}. A delta arrow connects the two values. ` +
      `Context text below: "${context}". Watermark: "For practitioner use only. Sample data."`,
    overlayText: `From ${metricBefore} to ${metricAfter}.`,
    platformBadge: `VitalMatrix | ${VM_BRAND.platform.descriptor}`,
    dimensions: PLATFORM_DIMENSIONS.linkedin,
    callToAction: 'Track outcomes with DeltaScan.',
  };
}

/**
 * Generates a multi-feature showcase card.
 *
 * @param features - List of feature names to highlight.
 * @returns A {@link SocialProofCard} displaying multiple features.
 */
export function generateFeatureShowcase(features: string[]): SocialProofCard {
  const featureList = features.map((f, i) => `${i + 1}. ${f}`).join('\n');

  return {
    title: 'What You Get with VitalMatrix',
    description: `${features.length} features built for functional medicine practitioners.`,
    screenshotDescription:
      `A grid layout showing ${features.length} feature tiles on a ${VM_BRAND.colours.prussianBlue} ` +
      `background. Each tile has an icon placeholder, feature name and one-line description. ` +
      `Features listed:\n${featureList}\n` +
      `Watermark: "For practitioner use only."`,
    overlayText: `${features.length} features. One platform.`,
    platformBadge: `VitalMatrix | ${VM_BRAND.platform.descriptor}`,
    dimensions: PLATFORM_DIMENSIONS.linkedin,
    callToAction: `Join the founding cohort at ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month.`,
  };
}

/**
 * Generates a "here is what you will see" preview card for each pipeline stage.
 *
 * @returns An array of {@link SocialProofCard} objects, one per pipeline engine.
 */
export function generatePlatformPreview(): SocialProofCard[] {
  const engines = [
    { name: 'FLINT', desc: 'Intake processing and data structuring.' },
    { name: 'APEX', desc: 'Node scoring and terrain mapping.' },
    { name: 'STRIDE', desc: 'Clinical threshold application.' },
    { name: 'RIL', desc: 'Regulatory and interpretive layer.' },
    { name: 'CADENCE/CIL', desc: 'Cascade detection and intelligence.' },
    { name: 'VISTA', desc: 'Output generation and visualisation.' },
  ];

  return engines.map((engine) => ({
    title: `Pipeline Stage: ${engine.name}`,
    description: `Here is what you will see at the ${engine.name} stage.`,
    screenshotDescription:
      `A single-panel view of the ${engine.name} engine output. Header: "${engine.name}" in ` +
      `${VM_BRAND.fonts.heading}. Body shows ${engine.desc} Key metrics are displayed in ` +
      `${VM_BRAND.fonts.data}. Watermark: "For practitioner use only. Illustrative."`,
    overlayText: `${engine.name}: ${engine.desc}`,
    platformBadge: `VitalMatrix | ${VM_BRAND.platform.descriptor}`,
    dimensions: PLATFORM_DIMENSIONS.linkedin,
    callToAction: 'See the full pipeline in action.',
  }));
}

/**
 * Generates a batch of varied social proof cards for posting rotation.
 *
 * @param count - Number of cards to generate (max equals the library size).
 * @returns An array of {@link SocialProofCard} objects.
 */
export function generateSocialProofBatch(count: number): SocialProofCard[] {
  const types = Object.keys(SCREENSHOT_LIBRARY) as ScreenshotType[];
  const platforms = ['linkedin', 'facebook', 'instagram', 'x'];
  const results: SocialProofCard[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const platform = platforms[i % platforms.length];
    results.push(generateScreenshotCard(type, platform));
  }

  return results;
}
