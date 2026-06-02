/**
 * Component 58: Ad Content Pipeline
 *
 * Sources content from existing CSW components and formats for ads.
 * Generates ads from clinical insights, pain points, features, and pricing.
 * Builds full ad sets across platforms and ad funnels (awareness, consideration,
 * conversion). Includes compliance validation and campaign brief generation.
 *
 * All content is practitioner-facing (B2B). Never patient-facing.
 * K7/K8/K10 compliance enforced. Evidence tiers on clinical claims.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** Content source categories for ad generation */
export type ContentSource =
  | 'clinical-insight'
  | 'zone-explainer'
  | 'evidence-finding'
  | 'practitioner-pain-point'
  | 'platform-feature'
  | 'pricing'
  | 'testimonial'
  | 'quiz-result'
  | 'blog-post';

/** Ad funnel objective stages */
export type AdObjective = 'awareness' | 'consideration' | 'conversion';

/** Supported ad platforms */
export type AdPlatform = 'linkedin' | 'facebook' | 'instagram' | 'x' | 'google';

/** A single ad content unit */
export interface AdContent {
  source: ContentSource;
  headline: string;
  body: string;
  cta: string;
  hook: string;
  targetAudience: string;
  platform: string;
  landingUrl: string;
  adType: AdObjective;
}

/** Ad content pipeline state */
export interface AdContentPipeline {
  sources: ContentSource[];
  generatedAds: AdContent[];
}

/** Compliance validation result */
export interface AdComplianceResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/** Campaign brief for review */
export interface CampaignBrief {
  title: string;
  objective: AdObjective;
  platforms: string[];
  adCount: number;
  content: string;
}

// --- Pre-built Content Sources ---

/** Zone-based clinical insights, one per node (N1-N7) */
const NODE_INSIGHTS: Record<string, { node: string; zone: string; insight: string; evidenceTier: EvidenceTier }> = {
  N1: {
    node: 'N1 - Metabolic Core',
    zone: 'Z1',
    insight: 'Metabolic flexibility is the foundation of terrain health. VitalMatrix scores mitochondrial function, glucose regulation, and lipid metabolism as an integrated system, not isolated markers.',
    evidenceTier: 'Established',
  },
  N2: {
    node: 'N2 - Thyroid and Adrenal Axis',
    zone: 'Z1',
    insight: 'The thyroid-adrenal axis rarely fails in isolation. VitalMatrix maps the bidirectional cascade between N2 and other nodes to reveal upstream drivers.',
    evidenceTier: 'Established',
  },
  N3: {
    node: 'N3 - Gut Integrity',
    zone: 'Z2',
    insight: 'Gut integrity extends beyond permeability. VitalMatrix assesses microbiome diversity, mucosal immunity, and digestive capacity as interconnected terrain elements.',
    evidenceTier: 'Emerging',
  },
  N4: {
    node: 'N4 - Immune Modulation',
    zone: 'Z2',
    insight: 'Immune modulation sits at the intersection of gut, neurological, and detoxification pathways. Cross-zone cascade detection reveals patterns invisible to single-system assessment.',
    evidenceTier: 'Emerging',
  },
  N5: {
    node: 'N5 - Neuroendocrine Balance',
    zone: 'Z3',
    insight: 'Neuroendocrine balance requires simultaneous assessment of HPA axis, neurotransmitter status, and hormonal rhythms. VitalMatrix integrates these into a unified zone score.',
    evidenceTier: 'Established',
  },
  N6: {
    node: 'N6 - Detoxification Pathways',
    zone: 'Z4',
    insight: 'Phase I, Phase II, and Phase III detoxification interact in ways that manual assessment rarely captures. VitalMatrix maps the complete detox terrain with cascade awareness.',
    evidenceTier: 'Emerging',
  },
  N7: {
    node: 'N7 - Structural Integrity',
    zone: 'Z4',
    insight: 'Structural integrity encompasses musculoskeletal health, connective tissue status, and biomechanical function. VitalMatrix links structural findings to upstream metabolic and inflammatory drivers.',
    evidenceTier: 'Observed in Practice',
  },
};

/** Zone explainer content */
const ZONE_EXPLAINERS: Record<string, { zone: string; name: string; description: string }> = {
  Z1: { zone: 'Z1', name: 'Metabolic and Energetic Terrain', description: 'Zone 1 encompasses metabolic core function, thyroid-adrenal axis, and energy production. VitalMatrix scores N1 and N2 together, detecting cascades between metabolic flexibility and hormonal regulation.' },
  Z2: { zone: 'Z2', name: 'Gut and Immune Terrain', description: 'Zone 2 maps gut integrity alongside immune modulation. VitalMatrix reveals how mucosal immunity, microbiome status, and inflammatory signalling interact across N3 and N4.' },
  Z3: { zone: 'Z3', name: 'Neurological and Hormonal Terrain', description: 'Zone 3 integrates neuroendocrine balance through N5, assessing HPA axis function, neurotransmitter status, and hormonal rhythms as a unified system.' },
  Z4: { zone: 'Z4', name: 'Structural and Detox Terrain', description: 'Zone 4 combines detoxification pathways and structural integrity through N6 and N7, linking biotransformation capacity to musculoskeletal and connective tissue status.' },
  Z5: { zone: 'Z5', name: 'Whole-System Coherence', description: 'Zone 5 is the cross-zone coherence layer. VitalMatrix analyses interactions between all zones, detecting system-level cascades and generating whole-terrain scoring.' },
};

/** Practitioner pain points with solutions */
const PAIN_POINTS: Array<{ pain: string; solution: string; hook: string }> = [
  { pain: 'Manual terrain assessment takes 45+ minutes per patient', solution: 'VitalMatrix automates 7-node scoring in seconds, freeing you to focus on clinical decisions.', hook: 'Your clinical time is too valuable for manual scoring.' },
  { pain: 'Cascade interactions are invisible in spreadsheet-based assessments', solution: '6 cascade stacks map cross-zone interactions automatically, surfacing patterns you would miss manually.', hook: 'How many cascades did your last assessment miss?' },
  { pain: 'No reproducibility between assessments or between practitioners', solution: 'Standardised scoring with 30 STRIDE rules ensures every assessment is consistent and reproducible.', hook: 'Would a colleague reach the same score you did?' },
  { pain: 'Clinical documentation takes longer than the consultation', solution: 'Automated reporting generates evidence-tiered documentation from assessment data.', hook: 'Stop spending evenings on documentation.' },
  { pain: 'Zone-by-zone assessment misses cross-zone patterns', solution: 'Whole-system coherence scoring in Zone 5 reveals interactions across all terrain zones.', hook: 'Your zones are connected. Your tools should be too.' },
  { pain: 'No way to track patient terrain changes over time', solution: 'Longitudinal terrain tracking shows how scores evolve, making treatment response visible.', hook: 'Can you prove your treatment is working?' },
  { pain: 'New patients require extensive intake before clinical assessment', solution: 'FLINT intake scoring structures patient data from the first interaction, feeding directly into assessment.', hook: 'What if intake and assessment were one seamless flow?' },
  { pain: 'Difficulty explaining terrain medicine to conventionally trained colleagues', solution: 'Evidence-tiered outputs with structured scoring give terrain medicine the analytical language conventional medicine respects.', hook: 'Terrain medicine deserves analytical rigour.' },
  { pain: 'Practice growth limited by assessment bottleneck', solution: 'Faster assessments mean more patients seen without sacrificing clinical depth.', hook: 'Your assessment speed is your growth ceiling.' },
  { pain: 'Keeping up with emerging evidence across all nodes', solution: 'VitalMatrix integrates evidence tiers across all clinical elements, keeping your practice current.', hook: 'Evidence evolves. Your tools should too.' },
];

/** Platform feature content, one per pipeline engine */
const PLATFORM_FEATURES: Array<{ engine: string; feature: string; description: string }> = [
  { engine: 'FLINT', feature: 'Intelligent Intake Scoring', description: 'FLINT transforms raw patient intake data into structured, scorable clinical elements. Over 500 items processed before you open the assessment.' },
  { engine: 'APEX', feature: 'Automated Priority Engine', description: 'APEX ranks clinical priorities across all 7 nodes, surfacing the most clinically significant findings first.' },
  { engine: 'STRIDE', feature: '30-Rule Clinical Assessment', description: 'STRIDE applies 30 validated clinical rules to every assessment, ensuring rigour and reproducibility across all terrain evaluations.' },
  { engine: 'RIL', feature: 'Risk and Interaction Layer', description: 'RIL evaluates clinical risk states across 4 levels, flagging interactions that require immediate practitioner attention.' },
  { engine: 'CADENCE', feature: 'Cascade Detection Engine', description: 'CADENCE maps cross-zone cascade interactions across 6 stacks, revealing clinical patterns invisible to single-zone assessment.' },
  { engine: 'VISTA', feature: 'Visual Terrain Analytics', description: 'VISTA generates visual terrain maps, zone comparisons, and longitudinal trend displays that make complex clinical data immediately comprehensible.' },
];

/** Landing URL base */
const BASE_URL = `https://${VM_BRAND.platform.domain}`;

// --- Pipeline State ---

/** Internal store for generated ads */
const pipelineStore: AdContent[] = [];

// --- Core Functions ---

/**
 * Generates an ad from a clinical insight for a specific node or zone.
 * @param nodeOrZone - Node (N1-N7) or zone (Z1-Z5) identifier
 * @param platform - Target ad platform
 * @returns AdContent targeting that node/zone's practitioners
 */
export function generateAdFromInsight(
  nodeOrZone: string,
  platform: AdPlatform
): AdContent {
  const insight = NODE_INSIGHTS[nodeOrZone];
  const zone = ZONE_EXPLAINERS[nodeOrZone];

  if (!insight && !zone) {
    throw new Error(`Invalid node or zone: ${nodeOrZone}. Use N1-N7 or Z1-Z5.`);
  }

  let headline: string;
  let body: string;
  let hook: string;

  if (insight) {
    headline = `${insight.node}: See the Full Picture`;
    body = `${insight.insight}\n\nEvidence tier: ${insight.evidenceTier}\n\nVitalMatrix maps this node within ${insight.zone}, detecting cascades that manual assessment misses.\n\n${VM_BRAND.regulatoryFooter}`;
    hook = `What if your ${insight.node.split(' - ')[1].toLowerCase()} assessment could see cascades?`;
  } else {
    headline = `${zone!.name}: Unified Zone Assessment`;
    body = `${zone!.description}\n\nVitalMatrix: the ${VM_BRAND.platform.descriptor} for terrain medicine.\n\n${VM_BRAND.regulatoryFooter}`;
    hook = `Your ${zone!.name.toLowerCase()} assessment is about to change.`;
  }

  const ad: AdContent = {
    source: 'clinical-insight',
    headline: truncateForPlatform(headline, platform, 'headline'),
    body: truncateForPlatform(body, platform, 'body'),
    cta: `Explore ${nodeOrZone} assessment at ${BASE_URL}`,
    hook,
    targetAudience: 'Functional medicine practitioners, IFM-trained clinicians, integrative GPs',
    platform,
    landingUrl: `${BASE_URL}/zones/${nodeOrZone.toLowerCase()}`,
    adType: 'awareness',
  };

  pipelineStore.push(ad);
  return ad;
}

/**
 * Generates an ad from a practitioner pain point.
 * @param painPoint - Pain point description or index (0-9)
 * @param platform - Target ad platform
 * @returns AdContent structured as pain-to-solution
 */
export function generateAdFromPainPoint(
  painPoint: string | number,
  platform: AdPlatform
): AdContent {
  let pp: { pain: string; solution: string; hook: string };

  if (typeof painPoint === 'number') {
    if (painPoint < 0 || painPoint >= PAIN_POINTS.length) {
      throw new Error(`Pain point index out of range: ${painPoint}. Use 0-${PAIN_POINTS.length - 1}.`);
    }
    pp = PAIN_POINTS[painPoint];
  } else {
    pp = PAIN_POINTS.find(p => p.pain.toLowerCase().includes(painPoint.toLowerCase())) || {
      pain: painPoint,
      solution: `VitalMatrix solves this with automated terrain assessment. 7 nodes, 5 zones, one ${VM_BRAND.platform.descriptor}.`,
      hook: `This does not have to be your reality.`,
    };
  }

  const ad: AdContent = {
    source: 'practitioner-pain-point',
    headline: pp.pain,
    body: `${pp.hook}\n\n${pp.solution}\n\nJoin the founding cohort: GBP ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months.\n\n${VM_BRAND.regulatoryFooter}`,
    cta: `Solve this today. Visit ${BASE_URL}`,
    hook: pp.hook,
    targetAudience: 'Functional medicine practitioners experiencing workflow inefficiency',
    platform,
    landingUrl: `${BASE_URL}/founding-cohort`,
    adType: 'consideration',
  };

  pipelineStore.push(ad);
  return ad;
}

/**
 * Generates an ad highlighting a specific platform feature.
 * @param feature - Feature name or pipeline engine name (FLINT, APEX, etc.)
 * @param platform - Target ad platform
 * @returns AdContent with feature highlight
 */
export function generateAdFromFeature(
  feature: string,
  platform: AdPlatform
): AdContent {
  const pf = PLATFORM_FEATURES.find(
    f => f.engine.toLowerCase() === feature.toLowerCase() ||
         f.feature.toLowerCase().includes(feature.toLowerCase())
  );

  if (!pf) {
    throw new Error(`Feature not found: ${feature}. Use engine names: FLINT, APEX, STRIDE, RIL, CADENCE, VISTA.`);
  }

  const ad: AdContent = {
    source: 'platform-feature',
    headline: `${pf.engine}: ${pf.feature}`,
    body: `${pf.description}\n\nPart of the VitalMatrix ${VM_BRAND.platform.descriptor}. Built by clinicians, for clinicians.\n\n${VM_BRAND.regulatoryFooter}`,
    cta: `See ${pf.engine} in action. Book a discovery call at ${BASE_URL}`,
    hook: `What does ${pf.engine} do that your current tools cannot?`,
    targetAudience: 'Functional medicine practitioners evaluating clinical intelligence tools',
    platform,
    landingUrl: `${BASE_URL}/features/${pf.engine.toLowerCase()}`,
    adType: 'consideration',
  };

  pipelineStore.push(ad);
  return ad;
}

/**
 * Generates an ad comparing founding and standard pricing.
 * @param platform - Target ad platform
 * @returns AdContent with pricing comparison
 */
export function generateAdFromPricing(platform: AdPlatform): AdContent {
  const ad: AdContent = {
    source: 'pricing',
    headline: `GBP ${VM_BRAND.pricing.foundingMonthly}/month. Not GBP ${VM_BRAND.pricing.standardRate}.`,
    body: `The VitalMatrix founding cohort is open. 10 practitioners. GBP ${VM_BRAND.pricing.foundingMonthly}/month fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.\n\nThe standard rate is GBP ${VM_BRAND.pricing.standardRate}/month. Founding members lock in at GBP ${VM_BRAND.pricing.foundingMonthly}.\n\n7 nodes. 5 zones. 6 cascade stacks. Full ${VM_BRAND.platform.descriptor} access.\n\nOnce the 10 spots are filled, the founding rate closes permanently.\n\n${VM_BRAND.regulatoryFooter}`,
    cta: `Secure your founding spot at ${BASE_URL}/founding-cohort`,
    hook: `GBP ${VM_BRAND.pricing.foundingMonthly}/month instead of GBP ${VM_BRAND.pricing.standardRate}. But only for 10 practitioners.`,
    targetAudience: 'Functional medicine practitioners ready to invest in clinical intelligence',
    platform,
    landingUrl: `${BASE_URL}/founding-cohort`,
    adType: 'conversion',
  };

  pipelineStore.push(ad);
  return ad;
}

/**
 * Generates a full ad set across multiple platforms for a given objective.
 * @param objective - Campaign objective (awareness, consideration, conversion)
 * @param platforms - Target platforms array
 * @returns Array of AdContent across all specified platforms
 */
export function generateAdSet(
  objective: AdObjective,
  platforms: AdPlatform[]
): AdContent[] {
  const ads: AdContent[] = [];

  for (const platform of platforms) {
    switch (objective) {
      case 'awareness':
        ads.push(generateAdFromInsight('N1', platform));
        ads.push(generateAdFromInsight('Z2', platform));
        ads.push(generateAdFromInsight('N5', platform));
        break;
      case 'consideration':
        ads.push(generateAdFromPainPoint(0, platform));
        ads.push(generateAdFromFeature('CADENCE', platform));
        ads.push(generateAdFromPainPoint(2, platform));
        break;
      case 'conversion':
        ads.push(generateAdFromPricing(platform));
        ads.push(generateAdFromPainPoint(8, platform));
        break;
    }
  }

  return ads;
}

/**
 * Generates a three-stage ad funnel for a single topic.
 * @param topic - The clinical or platform topic
 * @returns Object with awareness, consideration, and conversion ads
 */
export function generateAdFunnel(
  topic: string
): { awareness: AdContent; consideration: AdContent; conversion: AdContent } {
  const awareness: AdContent = {
    source: 'clinical-insight',
    headline: `Understanding ${topic} in Terrain Medicine`,
    body: `${topic} is more complex than single-system assessment suggests. VitalMatrix maps it across nodes and zones, revealing cascade interactions that manual methods miss.\n\n${VM_BRAND.regulatoryFooter}`,
    cta: `Learn more about ${topic.toLowerCase()} assessment at ${BASE_URL}`,
    hook: `What most practitioners do not know about ${topic.toLowerCase()} assessment.`,
    targetAudience: 'Functional medicine practitioners interested in terrain assessment',
    platform: 'all',
    landingUrl: `${BASE_URL}/insights/${topic.toLowerCase().replace(/\s+/g, '-')}`,
    adType: 'awareness',
  };

  const consideration: AdContent = {
    source: 'platform-feature',
    headline: `How VitalMatrix Transforms ${topic} Assessment`,
    body: `Manual ${topic.toLowerCase()} assessment takes too long and misses cascades. VitalMatrix automates scoring, detects cross-zone interactions, and generates evidence-tiered reports.\n\nSee the difference structured clinical intelligence makes.\n\n${VM_BRAND.regulatoryFooter}`,
    cta: `Book a discovery call to see ${topic.toLowerCase()} assessment in action. ${BASE_URL}/discovery`,
    hook: `Your ${topic.toLowerCase()} assessment workflow is about to change.`,
    targetAudience: 'Functional medicine practitioners evaluating clinical tools',
    platform: 'all',
    landingUrl: `${BASE_URL}/discovery`,
    adType: 'consideration',
  };

  const conversion: AdContent = {
    source: 'pricing',
    headline: `Join the Founding Cohort: GBP ${VM_BRAND.pricing.foundingMonthly}/month`,
    body: `Transform your ${topic.toLowerCase()} assessment with VitalMatrix. Founding cohort: 10 practitioners, GBP ${VM_BRAND.pricing.foundingMonthly}/month fixed for ${VM_BRAND.pricing.foundingFixedMonths} months (standard rate: GBP ${VM_BRAND.pricing.standardRate}).\n\n7 nodes. 5 zones. 6 cascade stacks. Complete ${VM_BRAND.platform.descriptor}.\n\n${VM_BRAND.regulatoryFooter}`,
    cta: `Secure your founding spot now at ${BASE_URL}/founding-cohort`,
    hook: `GBP ${VM_BRAND.pricing.foundingMonthly}/month for the complete ${VM_BRAND.platform.descriptor}. Only 10 spots.`,
    targetAudience: 'Functional medicine practitioners ready to purchase',
    platform: 'all',
    landingUrl: `${BASE_URL}/founding-cohort`,
    adType: 'conversion',
  };

  pipelineStore.push(awareness, consideration, conversion);
  return { awareness, consideration, conversion };
}

/**
 * Validates ad content for compliance with kill list and regulatory rules.
 * @param ad - The ad content to validate
 * @returns Compliance result with errors and warnings
 */
export function validateAdContent(ad: AdContent): AdComplianceResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fullText = `${ad.headline} ${ad.body} ${ad.cta} ${ad.hook}`;

  // K7: Credential check
  if (/\bMD\b/.test(fullText) && !/\bMBBS\b/.test(fullText)) {
    errors.push('K7: "MD" found without MBBS. Must use MBBS, FAAMFM only.');
  }
  if (/FMAARM/i.test(fullText)) {
    errors.push('K7: "FMAARM" found. Must use FAAMFM only.');
  }

  // K8: Em dash check
  if (fullText.includes('\u2014')) {
    errors.push('K8: Em dash found. Use comma, full stop, or colon instead.');
  }

  // K10: Competitor names
  const competitors = ['Mark Hyman', 'LaValle', 'Metabolic Code'];
  for (const comp of competitors) {
    if (fullText.toLowerCase().includes(comp.toLowerCase())) {
      errors.push(`K10: Competitor name "${comp}" found. Remove immediately.`);
    }
  }

  // Descriptor check
  if (/clinical AI platform/i.test(fullText)) {
    errors.push('Descriptor error: "clinical AI platform" found. Must use "terrain intelligence platform".');
  }

  // Diagnostic language check
  if (/\bdiagnos(?:e|es|is|tic)\b/i.test(fullText) && !/not a diagnostic/i.test(fullText)) {
    warnings.push('Diagnostic language detected. Ensure "Not a diagnostic tool" disclaimer is included.');
  }

  // Patient-facing language check
  if (/\bpatient-facing\b/i.test(fullText) || /\bconsumer\b/i.test(fullText)) {
    warnings.push('Patient-facing language detected. All ads must be practitioner-facing (B2B).');
  }

  // Regulatory footer check
  if (!ad.body.includes(VM_BRAND.regulatoryFooter)) {
    warnings.push('Regulatory footer missing from body text.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generates a markdown campaign brief for review.
 * @param campaign - Brief configuration
 * @returns Markdown string with complete campaign brief
 */
export function generateAdBrief(campaign: {
  title: string;
  objective: AdObjective;
  platforms: AdPlatform[];
  ads?: AdContent[];
}): string {
  const ads = campaign.ads || pipelineStore.filter(a => a.adType === campaign.objective);

  const sections: string[] = [
    `# Campaign Brief: ${campaign.title}`,
    '',
    `**Objective:** ${campaign.objective.charAt(0).toUpperCase() + campaign.objective.slice(1)}`,
    `**Platforms:** ${campaign.platforms.join(', ')}`,
    `**Ad Count:** ${ads.length}`,
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    '',
    '---',
    '',
    '## Ads',
    '',
  ];

  for (let i = 0; i < ads.length; i++) {
    const ad = ads[i];
    const compliance = validateAdContent(ad);

    sections.push(`### Ad ${i + 1}: ${ad.headline}`);
    sections.push('');
    sections.push(`- **Source:** ${ad.source}`);
    sections.push(`- **Platform:** ${ad.platform}`);
    sections.push(`- **Type:** ${ad.adType}`);
    sections.push(`- **Target:** ${ad.targetAudience}`);
    sections.push(`- **Landing:** ${ad.landingUrl}`);
    sections.push(`- **Compliance:** ${compliance.valid ? 'PASS' : 'FAIL'}`);
    if (compliance.errors.length > 0) {
      sections.push(`- **Errors:** ${compliance.errors.join('; ')}`);
    }
    if (compliance.warnings.length > 0) {
      sections.push(`- **Warnings:** ${compliance.warnings.join('; ')}`);
    }
    sections.push('');
    sections.push(`**Hook:** ${ad.hook}`);
    sections.push('');
    sections.push(`**Body:**`);
    sections.push(ad.body);
    sections.push('');
    sections.push(`**CTA:** ${ad.cta}`);
    sections.push('');
    sections.push('---');
    sections.push('');
  }

  sections.push(`${VM_BRAND.regulatoryFooter}`);
  sections.push('');
  sections.push(`${VM_BRAND.tmFooter}`);

  return sections.join('\n');
}

/**
 * Returns all generated ads in the pipeline.
 * @returns Array of all AdContent generated this session
 */
export function getPipelineAds(): AdContent[] {
  return [...pipelineStore];
}

/**
 * Clears the pipeline store.
 */
export function clearPipeline(): void {
  pipelineStore.length = 0;
}

// --- Helpers ---

/**
 * Truncates text to fit platform character limits.
 * @param text - Original text
 * @param platform - Target platform
 * @param field - Field type (headline or body)
 * @returns Truncated text
 */
function truncateForPlatform(text: string, platform: AdPlatform, field: 'headline' | 'body'): string {
  const limits: Record<string, Record<string, number>> = {
    google: { headline: 30, body: 90 },
    linkedin: { headline: 150, body: 600 },
    facebook: { headline: 150, body: 500 },
    instagram: { headline: 150, body: 2200 },
    x: { headline: 100, body: 280 },
  };

  const limit = limits[platform]?.[field];
  if (!limit || text.length <= limit) return text;

  return text.substring(0, limit - 3) + '...';
}
