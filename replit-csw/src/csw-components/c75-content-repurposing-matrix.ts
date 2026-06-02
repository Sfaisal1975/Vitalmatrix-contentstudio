/**
 * c75-content-repurposing-matrix.ts
 * VitalMatrix Content Studio -- Content Repurposing Matrix
 *
 * Systematic matrix that turns ONE piece of content into 16 assets across
 * all channels. One blog post, clinical insight, or webinar recording
 * feeds content for 2-3 weeks.
 *
 * 16 asset formats supported:
 *  linkedin-post, linkedin-article, facebook-post, facebook-event,
 *  instagram-feed, instagram-carousel, instagram-reel-script,
 *  instagram-story, x-tweet, x-thread, email-newsletter,
 *  lead-magnet-section, ad-copy-awareness, ad-copy-conversion,
 *  meme, quiz-question.
 *
 * Compliance:
 *  - K7: MBBS, FAAMFM only.
 *  - K8: No em dashes. British English throughout.
 *  - K10: No competitor names.
 *
 * (c) VitalMatrix Ltd 2026. All rights reserved.
 */

import { VM_BRAND } from './brand-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Source content type. */
export type SourceContentType =
  | 'blog'
  | 'clinical-insight'
  | 'webinar-recording'
  | 'case-observation'
  | 'research-finding'
  | 'platform-feature';

/** All supported repurposed asset formats. */
export type AssetFormat =
  | 'linkedin-post'
  | 'linkedin-article'
  | 'facebook-post'
  | 'facebook-event'
  | 'instagram-feed'
  | 'instagram-carousel'
  | 'instagram-reel-script'
  | 'instagram-story'
  | 'x-tweet'
  | 'x-thread'
  | 'email-newsletter'
  | 'lead-magnet-section'
  | 'ad-copy-awareness'
  | 'ad-copy-conversion'
  | 'meme'
  | 'quiz-question';

/** The original source piece of content. */
export interface SourceContent {
  id: string;
  title: string;
  body: string;
  type: SourceContentType;
  zones: string[];
  nodes: string[];
}

/** A single repurposed asset derived from a source. */
export interface RepurposedAsset {
  sourceId: string;
  format: AssetFormat;
  platform: string;
  content: string;
  status: 'generated' | 'scheduled' | 'posted';
}

/** Full repurposing matrix for a single source content piece. */
export interface RepurposingMatrix {
  source: SourceContent;
  assets: RepurposedAsset[];
}

/** Publishing schedule entry. */
export interface ScheduleEntry {
  asset: RepurposedAsset;
  suggestedDate: string;
  dayOffset: number;
  platform: string;
}

/** Matrix report summarising output from a source. */
export interface MatrixReport {
  sourceId: string;
  sourceTitle: string;
  sourceType: SourceContentType;
  totalAssets: number;
  byFormat: Record<string, number>;
  byPlatform: Record<string, number>;
  byStatus: Record<string, number>;
  contentMultiplier: string;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// All 16 asset formats with metadata
// ---------------------------------------------------------------------------

const ALL_FORMATS: AssetFormat[] = [
  'linkedin-post',
  'linkedin-article',
  'facebook-post',
  'facebook-event',
  'instagram-feed',
  'instagram-carousel',
  'instagram-reel-script',
  'instagram-story',
  'x-tweet',
  'x-thread',
  'email-newsletter',
  'lead-magnet-section',
  'ad-copy-awareness',
  'ad-copy-conversion',
  'meme',
  'quiz-question',
];

const FORMAT_PLATFORM_MAP: Record<AssetFormat, string> = {
  'linkedin-post': 'LinkedIn',
  'linkedin-article': 'LinkedIn',
  'facebook-post': 'Facebook',
  'facebook-event': 'Facebook',
  'instagram-feed': 'Instagram',
  'instagram-carousel': 'Instagram',
  'instagram-reel-script': 'Instagram',
  'instagram-story': 'Instagram',
  'x-tweet': 'X',
  'x-thread': 'X',
  'email-newsletter': 'Email',
  'lead-magnet-section': 'Lead Magnet',
  'ad-copy-awareness': 'Ads',
  'ad-copy-conversion': 'Ads',
  'meme': 'Multi-platform',
  'quiz-question': 'Multi-platform',
};

// ---------------------------------------------------------------------------
// Asset generation helpers
// ---------------------------------------------------------------------------

/**
 * Extracts a concise summary (first ~200 characters) from the body.
 */
function extractSummary(body: string, maxLength: number = 200): string {
  if (body.length <= maxLength) return body;
  const trimmed = body.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) + '...' : trimmed + '...';
}

/**
 * Generates a hashtag string from zones.
 */
function zoneHashtags(zones: string[]): string {
  const zoneMap: Record<string, string> = {
    Z1: '#MetabolicHealth #EnergyAxis',
    Z2: '#GutTerrain #MicrobiomeIntelligence',
    Z3: '#CardiovascularTerrain #HeartBrainAxis',
    Z4: '#DetoxTerrain #BiotransformationPath',
    Z5: '#HormonalTerrain #HormoneAxis',
  };
  return zones.map((z) => zoneMap[z] || '').filter(Boolean).join(' ');
}

/**
 * Generates a single repurposed asset from a source in the specified format.
 * @param source - The original content.
 * @param format - The target asset format.
 * @returns A RepurposedAsset.
 */
export function generateAsset(
  source: SourceContent,
  format: AssetFormat,
): RepurposedAsset {
  const summary = extractSummary(source.body);
  const shortSummary = extractSummary(source.body, 100);
  const zTags = zoneHashtags(source.zones);
  const credential = `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`;
  const domain = VM_BRAND.platform.domain;
  const descriptor = VM_BRAND.platform.descriptor;
  const price = `${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month`;

  const generators: Record<AssetFormat, () => string> = {
    'linkedin-post': () =>
      `${source.title}\n\n${summary}\n\nAs FM practitioners, we know that terrain-based thinking changes clinical outcomes. This is exactly why we built the VitalMatrix ${descriptor}.\n\nWhat has been your experience with this in practice?\n\n#VitalMatrix #ClinicalIntelligence ${zTags}\n\n${credential}`,

    'linkedin-article': () =>
      `# ${source.title}\n\n## Overview\n\n${source.body}\n\n## Clinical Implications\n\nFor FM practitioners working across England, understanding terrain-based clinical patterns is essential. The VitalMatrix ${descriptor} maps these connections systematically.\n\n## What This Means for Your Practice\n\nTerrain intelligence transforms how we approach complex cases. Rather than treating symptoms in isolation, we can see the full clinical picture.\n\nLearn more at ${domain}\n\n---\n${credential}\n${VM_BRAND.regulatoryFooter}`,

    'facebook-post': () =>
      `${source.title}\n\n${summary}\n\nThis is what terrain-based clinical intelligence looks like in practice. Every FM practitioner in England deserves tools that think the way they do.\n\nLink in comments.\n\n#VitalMatrix #FunctionalMedicineUK ${zTags}`,

    'facebook-event': () =>
      `EVENT: Deep Dive into "${source.title}"\n\nJoin ${credential} for a live practitioner-only session exploring:\n\n${summary}\n\nWho is this for? FM practitioners in England who want to sharpen their terrain-based clinical thinking.\n\nFormat: 45-minute presentation + 15-minute Q&A\nCost: Free for registered practitioners\n\nRegister at ${domain}\n\n${VM_BRAND.regulatoryFooter}`,

    'instagram-feed': () =>
      `${source.title}\n\n${shortSummary}\n\nTerrain-based thinking. Clinical intelligence. Built for FM practitioners.\n\nLink in bio.\n\n#VitalMatrix #TerrainMedicine #ClinicalIntelligence #FunctionalMedicineUK #IFMPractitioner ${zTags}`,

    'instagram-carousel': () =>
      `CAROUSEL: ${source.title}\n\n[Slide 1 - Hook]\n"${shortSummary}"\n\n[Slide 2 - The Problem]\nFM practitioners often work with fragmented clinical data. Terrain connections get missed.\n\n[Slide 3 - The Insight]\n${summary}\n\n[Slide 4 - Zone Mapping]\nZones covered: ${source.zones.join(', ')}\nNodes involved: ${source.nodes.join(', ')}\n\n[Slide 5 - Clinical Application]\nTerrain intelligence shows us the full picture, connecting patterns across zones.\n\n[Slide 6 - CTA]\nExplore the VitalMatrix ${descriptor}.\nLink in bio | ${domain}\n\n#VitalMatrix #TerrainMedicine ${zTags}`,

    'instagram-reel-script': () =>
      `REEL SCRIPT: ${source.title}\n\n[0-3s] Hook: "Here is something most practitioners miss about ${source.zones[0] || 'clinical terrain'}..."\n\n[3-10s] "${shortSummary}"\n\n[10-20s] "When you map the terrain across ${source.zones.join(' and ')}, a completely different clinical picture emerges."\n\n[20-25s] "This is what terrain-based clinical intelligence looks like."\n\n[25-30s] CTA: "Follow for more clinical insights. Link in bio."\n\nAudio: Professional, educational tone. No background music with lyrics.\nText overlay: Key phrases from each section.\n\n#VitalMatrix #TerrainMedicine ${zTags}`,

    'instagram-story': () =>
      `STORY SEQUENCE: ${source.title}\n\n[Story 1] Poll: "Do you map ${source.zones[0] || 'clinical terrain'} connections in your practice?" YES / NOT YET\n\n[Story 2] Key insight: "${shortSummary}"\n\n[Story 3] "Terrain-based thinking changes everything for FM practitioners."\n\n[Story 4] Swipe up: "Explore the ${descriptor} at ${domain}"`,

    'x-tweet': () => {
      const tweet = `${shortSummary}\n\nTerrain-based clinical intelligence for FM practitioners.\n\n#VitalMatrix ${source.zones[0] ? zoneHashtags([source.zones[0]]).split(' ')[0] : ''}`.slice(0, 280);
      return tweet;
    },

    'x-thread': () =>
      `THREAD: ${source.title}\n\n1/ ${shortSummary}\n\n2/ For FM practitioners in England, understanding terrain connections across ${source.zones.join(', ')} changes clinical outcomes.\n\n3/ ${summary}\n\n4/ This is exactly what we built VitalMatrix to solve. A ${descriptor} that maps the terrain the way FM practitioners think.\n\n5/ Explore the platform: ${domain}\n\n#VitalMatrix #TerrainMedicine #FunctionalMedicineUK`,

    'email-newsletter': () =>
      `Subject: ${source.title}\n\nDear Colleague,\n\n${source.body}\n\nClinical Takeaway\n\nFor practitioners working with ${source.zones.join(', ')} terrain patterns, this insight offers practical guidance that can be applied in your next clinical session.\n\nThe VitalMatrix ${descriptor} maps these connections automatically, giving you a complete terrain view of your patient.\n\nExplore VitalMatrix: ${domain}\nFounding rate: ${price} (fixed for ${VM_BRAND.pricing.foundingFixedMonths} months)\n\nWith warm regards,\n${credential}\n${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}\n\n${VM_BRAND.regulatoryFooter}`,

    'lead-magnet-section': () =>
      `## ${source.title}\n\n${source.body}\n\n### Key Terrain Connections\n\nZones: ${source.zones.join(', ')}\nNodes: ${source.nodes.join(', ')}\n\nThis section demonstrates how terrain-based clinical intelligence maps complex patterns that conventional approaches often miss.\n\n---\nExtracted from the VitalMatrix ${descriptor}.\n${VM_BRAND.regulatoryFooter}`,

    'ad-copy-awareness': () =>
      `Headline: ${source.title}\n\nPrimary text: ${shortSummary} FM practitioners across England are discovering how terrain-based clinical intelligence transforms their practice.\n\nCTA: Learn More\nURL: ${domain}\n\nAudience: FM practitioners, England only\nObjective: Awareness`,

    'ad-copy-conversion': () =>
      `Headline: Transform Your FM Practice with Terrain Intelligence\n\nPrimary text: ${shortSummary} Join the founding cohort at just ${price}. Fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Standard rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month.\n\nCTA: Join Founding Cohort\nURL: ${domain}\n\nAudience: FM practitioners, England only\nObjective: Conversion`,

    'meme': () =>
      `MEME CONCEPT: ${source.title}\n\n[Top text]: When you have been treating symptoms for years\n[Bottom text]: And then terrain mapping shows you what was actually connected\n\nFormat: Two-panel or Drake meme format\nTone: Professionally humorous, relatable to FM practitioners\nBrand: Include VitalMatrix watermark\n\nAlternative:\n[Top]: "Just one more biomarker and I will see the full picture"\n[Bottom]: *Maps terrain across ${source.zones.join(', ')}* "Oh. There it is."`,

    'quiz-question': () =>
      `QUIZ QUESTION from: ${source.title}\n\nQ: Based on terrain-based clinical intelligence, which zones are most commonly connected in the pattern described above?\n\nA) ${source.zones[0] || 'Z1'} and ${source.zones[1] || 'Z2'} only\nB) All zones operate independently\nC) ${source.zones.join(', ')} show interconnected terrain patterns\nD) Zone mapping is not relevant to this clinical picture\n\nCorrect answer: C\n\nExplanation: Terrain-based analysis reveals that ${source.zones.join(', ')} are interconnected. The VitalMatrix ${descriptor} maps these connections automatically.\n\nSource: ${source.title}`,
  };

  return {
    sourceId: source.id,
    format,
    platform: FORMAT_PLATFORM_MAP[format],
    content: generators[format](),
    status: 'generated',
  };
}

/**
 * Generates the full repurposing matrix: ALL 16 asset formats from a single
 * source content piece.
 * @param source - The original content to repurpose.
 * @returns A RepurposingMatrix containing all 16 assets.
 */
export function generateFullMatrix(source: SourceContent): RepurposingMatrix {
  const assets = ALL_FORMATS.map((format) => generateAsset(source, format));
  return { source, assets };
}

/**
 * Generates a publishing schedule that spreads assets across 2-3 weeks
 * so one source feeds content for weeks.
 * @param matrix - The repurposing matrix to schedule.
 * @returns Array of ScheduleEntry records with suggested dates.
 */
export function generatePublishingSchedule(
  matrix: RepurposingMatrix,
): ScheduleEntry[] {
  const schedule: ScheduleEntry[] = [];
  const now = new Date();

  // Publishing cadence: spread across ~18 days (about 2.5 weeks)
  // Group by platform and stagger
  const platformOrder = [
    'LinkedIn',
    'Instagram',
    'Facebook',
    'X',
    'Email',
    'Lead Magnet',
    'Ads',
    'Multi-platform',
  ];

  let dayOffset = 0;

  for (const platform of platformOrder) {
    const platformAssets = matrix.assets.filter(
      (a) => a.platform === platform,
    );

    for (const asset of platformAssets) {
      const suggestedDate = new Date(now);
      suggestedDate.setDate(suggestedDate.getDate() + dayOffset);

      schedule.push({
        asset,
        suggestedDate: suggestedDate.toISOString().split('T')[0],
        dayOffset,
        platform,
      });

      // Stagger: 1-2 day gaps within platform, longer gaps between platforms
      dayOffset += 1;
    }

    // Extra day gap between platforms
    dayOffset += 1;
  }

  return schedule;
}

/**
 * Filters matrix assets by platform.
 * @param matrix - The repurposing matrix.
 * @param platform - The platform to filter by.
 * @returns Filtered array of RepurposedAsset records.
 */
export function getAssetsByPlatform(
  matrix: RepurposingMatrix,
  platform: string,
): RepurposedAsset[] {
  return matrix.assets.filter(
    (a) => a.platform.toLowerCase() === platform.toLowerCase(),
  );
}

/**
 * Filters matrix assets by status.
 * @param matrix - The repurposing matrix.
 * @param status - The status to filter by.
 * @returns Filtered array of RepurposedAsset records.
 */
export function getAssetsByStatus(
  matrix: RepurposingMatrix,
  status: RepurposedAsset['status'],
): RepurposedAsset[] {
  return matrix.assets.filter((a) => a.status === status);
}

/**
 * Generates a report summarising the matrix output for a source content piece.
 * @param matrix - The repurposing matrix.
 * @returns A MatrixReport.
 */
export function generateMatrixReport(matrix: RepurposingMatrix): MatrixReport {
  const byFormat: Record<string, number> = {};
  const byPlatform: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const asset of matrix.assets) {
    byFormat[asset.format] = (byFormat[asset.format] || 0) + 1;
    byPlatform[asset.platform] = (byPlatform[asset.platform] || 0) + 1;
    byStatus[asset.status] = (byStatus[asset.status] || 0) + 1;
  }

  return {
    sourceId: matrix.source.id,
    sourceTitle: matrix.source.title,
    sourceType: matrix.source.type,
    totalAssets: matrix.assets.length,
    byFormat,
    byPlatform,
    byStatus,
    contentMultiplier: `1 ${matrix.source.type} = ${matrix.assets.length} assets`,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Calculates and returns the content multiplier summary.
 * @returns A human-readable content multiplier report.
 */
export function calculateContentMultiplier(): string {
  return [
    'VitalMatrix Content Multiplier Report',
    '======================================',
    '',
    `1 blog post = ${ALL_FORMATS.length} assets`,
    `1 clinical insight = ${ALL_FORMATS.length} assets`,
    `1 webinar recording = ${ALL_FORMATS.length} assets`,
    `1 case observation = ${ALL_FORMATS.length} assets`,
    `1 research finding = ${ALL_FORMATS.length} assets`,
    `1 platform feature = ${ALL_FORMATS.length} assets`,
    '',
    'Asset formats:',
    ...ALL_FORMATS.map((f) => `  - ${f} (${FORMAT_PLATFORM_MAP[f]})`),
    '',
    'Publishing cadence: 2-3 weeks of content from a single source.',
    '',
    `${VM_BRAND.regulatoryFooter}`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Pre-built example: Z2 gut terrain clinical insight
// ---------------------------------------------------------------------------

/** Example source content: Z2 gut terrain clinical insight. */
export const EXAMPLE_SOURCE: SourceContent = {
  id: 'example-z2-gut-terrain-001',
  title: 'Gut Terrain Mapping: How Microbiome Intelligence Reveals Hidden Clinical Patterns',
  body: 'The gut terrain represents one of the most complex and clinically significant zones in functional medicine practice. When we map the microbiome intelligence alongside immune resilience markers, patterns emerge that conventional single-marker testing simply cannot reveal. In our clinical experience, practitioners who adopt terrain-based gut analysis report more coherent treatment strategies and better patient outcomes. The interconnection between Z2 gut terrain and other zones, particularly Z1 metabolic and Z5 hormonal, creates a web of clinical intelligence that transforms how we approach complex cases.',
  type: 'clinical-insight',
  zones: ['Z2', 'Z1', 'Z5'],
  nodes: ['N2', 'N4', 'N6'],
};

/** Pre-built example matrix from the Z2 gut terrain source. */
export const EXAMPLE_MATRIX: RepurposingMatrix = generateFullMatrix(EXAMPLE_SOURCE);

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

/** Regulatory footer for repurposed content. */
export const REPURPOSING_FOOTER = `${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`;
