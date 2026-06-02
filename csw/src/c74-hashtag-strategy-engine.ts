/**
 * c74-hashtag-strategy-engine.ts
 * VitalMatrix Content Studio -- Hashtag Strategy Engine
 *
 * Deep hashtag research and strategy for maximum FM practitioner discovery.
 * Platform-specific limits enforced. Weekly rotation to avoid shadowban.
 *
 * Platform limits:
 *  - Instagram: max 30 hashtags
 *  - LinkedIn: max 5 recommended
 *  - X (Twitter): max 3
 *  - Facebook: max 5
 *
 * Compliance:
 *  - K7: MBBS, FAAMFM only.
 *  - K8: No em dashes. British English throughout.
 *  - MHRA/ASA: NEVER use #cure #treatment #diagnosis #prescription.
 *
 * (c) VitalMatrix Ltd 2026. All rights reserved.
 */

import { VM_BRAND } from './brand-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Category of hashtag set. */
export type HashtagCategory =
  | 'brand'
  | 'clinical'
  | 'zone'
  | 'community'
  | 'trending'
  | 'niche';

/** A curated set of hashtags for a specific purpose and platform. */
export interface HashtagSet {
  id: string;
  name: string;
  hashtags: string[];
  platform: string;
  category: HashtagCategory;
  estimatedReach?: number;
  competitiveness: 'high' | 'medium' | 'low';
}

/** Platform-level hashtag strategy with always-use, rotation, and exclusion lists. */
export interface HashtagStrategy {
  platform: string;
  alwaysUse: string[];
  rotateWeekly: string[][];
  neverUse: string[];
}

/** Performance record for a single hashtag. */
export interface HashtagPerformance {
  hashtag: string;
  impressions: number;
  uses: number;
  averageImpressions: number;
  platform: string;
  lastUsed: string;
}

/** Hashtag performance report. */
export interface HashtagReport {
  totalTracked: number;
  byPlatform: Record<string, HashtagPerformance[]>;
  topPerformers: HashtagPerformance[];
  underperformers: HashtagPerformance[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum hashtags per platform. */
export const PLATFORM_LIMITS: Record<string, number> = {
  Instagram: 30,
  LinkedIn: 5,
  X: 3,
  Facebook: 5,
};

/** Hashtags that must NEVER be used (MHRA/ASA risk). */
export const BANNED_HASHTAGS: string[] = [
  '#cure',
  '#treatment',
  '#diagnosis',
  '#prescription',
  '#cures',
  '#treatments',
  '#diagnose',
  '#prescribe',
  '#medicaladvice',
  '#medicaltreatment',
];

// ---------------------------------------------------------------------------
// Pre-built hashtag sets
// ---------------------------------------------------------------------------

const HASHTAG_SETS: HashtagSet[] = [
  // Brand sets -- all platforms
  {
    id: 'brand-instagram',
    name: 'Brand Core (Instagram)',
    hashtags: ['#VitalMatrix', '#TerrainMedicine', '#ClinicalIntelligence', '#FLINT'],
    platform: 'Instagram',
    category: 'brand',
    competitiveness: 'low',
  },
  {
    id: 'brand-linkedin',
    name: 'Brand Core (LinkedIn)',
    hashtags: ['#VitalMatrix', '#ClinicalIntelligence', '#TerrainMedicine'],
    platform: 'LinkedIn',
    category: 'brand',
    competitiveness: 'low',
  },
  {
    id: 'brand-x',
    name: 'Brand Core (X)',
    hashtags: ['#VitalMatrix', '#TerrainMedicine'],
    platform: 'X',
    category: 'brand',
    competitiveness: 'low',
  },
  {
    id: 'brand-facebook',
    name: 'Brand Core (Facebook)',
    hashtags: ['#VitalMatrix', '#TerrainMedicine', '#ClinicalIntelligence'],
    platform: 'Facebook',
    category: 'brand',
    competitiveness: 'low',
  },

  // Zone-specific clinical sets (Instagram as primary, adaptable to others)
  {
    id: 'zone-z1-instagram',
    name: 'Z1 Metabolic (Instagram)',
    hashtags: ['#MetabolicHealth', '#ThyroidTerrain', '#EnergyAxis', '#BloodSugarBalance', '#InsulinResistance', '#MetabolicTerrain', '#MitochondrialHealth'],
    platform: 'Instagram',
    category: 'zone',
    competitiveness: 'medium',
  },
  {
    id: 'zone-z2-instagram',
    name: 'Z2 Gut/Immune (Instagram)',
    hashtags: ['#GutTerrain', '#ImmuneResilience', '#MicrobiomeIntelligence', '#GutHealth', '#IntestinalPermeability', '#GutBrainAxis', '#MicrobiomeMapping'],
    platform: 'Instagram',
    category: 'zone',
    competitiveness: 'high',
  },
  {
    id: 'zone-z3-instagram',
    name: 'Z3 Cardiovascular (Instagram)',
    hashtags: ['#CardiovascularTerrain', '#HeartBrainAxis', '#VascularHealth', '#CardioMetabolic', '#HeartHealthPractitioner', '#CVDPrevention'],
    platform: 'Instagram',
    category: 'zone',
    competitiveness: 'medium',
  },
  {
    id: 'zone-z4-instagram',
    name: 'Z4 Detox (Instagram)',
    hashtags: ['#DetoxTerrain', '#LiverBurden', '#BiotransformationPath', '#PhaseIIDetox', '#ToxicBurden', '#LiverHealth', '#Detoxification'],
    platform: 'Instagram',
    category: 'zone',
    competitiveness: 'medium',
  },
  {
    id: 'zone-z5-instagram',
    name: 'Z5 Hormonal (Instagram)',
    hashtags: ['#HormonalTerrain', '#HormoneAxis', '#EndocrineBalance', '#HormoneHealth', '#HPAAxis', '#AdrenalHealth', '#HormonalBalance'],
    platform: 'Instagram',
    category: 'zone',
    competitiveness: 'high',
  },

  // Zone sets for LinkedIn
  {
    id: 'zone-z1-linkedin',
    name: 'Z1 Metabolic (LinkedIn)',
    hashtags: ['#MetabolicHealth', '#ThyroidTerrain', '#EnergyAxis'],
    platform: 'LinkedIn',
    category: 'zone',
    competitiveness: 'medium',
  },
  {
    id: 'zone-z2-linkedin',
    name: 'Z2 Gut/Immune (LinkedIn)',
    hashtags: ['#GutTerrain', '#ImmuneResilience', '#MicrobiomeIntelligence'],
    platform: 'LinkedIn',
    category: 'zone',
    competitiveness: 'high',
  },
  {
    id: 'zone-z3-linkedin',
    name: 'Z3 Cardiovascular (LinkedIn)',
    hashtags: ['#CardiovascularTerrain', '#HeartBrainAxis'],
    platform: 'LinkedIn',
    category: 'zone',
    competitiveness: 'medium',
  },
  {
    id: 'zone-z4-linkedin',
    name: 'Z4 Detox (LinkedIn)',
    hashtags: ['#DetoxTerrain', '#LiverBurden', '#BiotransformationPath'],
    platform: 'LinkedIn',
    category: 'zone',
    competitiveness: 'medium',
  },
  {
    id: 'zone-z5-linkedin',
    name: 'Z5 Hormonal (LinkedIn)',
    hashtags: ['#HormonalTerrain', '#HormoneAxis'],
    platform: 'LinkedIn',
    category: 'zone',
    competitiveness: 'high',
  },

  // Community sets
  {
    id: 'community-instagram',
    name: 'FM Community (Instagram)',
    hashtags: ['#FunctionalMedicineUK', '#IFMPractitioner', '#TerrainApproach', '#FMCommunity', '#RootCauseMedicine', '#FunctionalMedicine', '#IntegrativeMedicine', '#FMPractitioner'],
    platform: 'Instagram',
    category: 'community',
    competitiveness: 'high',
  },
  {
    id: 'community-linkedin',
    name: 'FM Community (LinkedIn)',
    hashtags: ['#FunctionalMedicineUK', '#IFMPractitioner', '#RootCauseMedicine'],
    platform: 'LinkedIn',
    category: 'community',
    competitiveness: 'high',
  },
  {
    id: 'community-x',
    name: 'FM Community (X)',
    hashtags: ['#FunctionalMedicineUK', '#FMCommunity', '#RootCauseMedicine'],
    platform: 'X',
    category: 'community',
    competitiveness: 'high',
  },
  {
    id: 'community-facebook',
    name: 'FM Community (Facebook)',
    hashtags: ['#FunctionalMedicineUK', '#IFMPractitioner', '#FMCommunity', '#TerrainApproach', '#RootCauseMedicine'],
    platform: 'Facebook',
    category: 'community',
    competitiveness: 'high',
  },

  // Niche sets
  {
    id: 'niche-practitioner-tools',
    name: 'Practitioner Tools (Instagram)',
    hashtags: ['#PractitionerTools', '#ClinicalDecisionSupport', '#FMTech', '#HealthTechUK', '#PractitionerLife'],
    platform: 'Instagram',
    category: 'niche',
    competitiveness: 'low',
  },
  {
    id: 'niche-terrain',
    name: 'Terrain Approach (Instagram)',
    hashtags: ['#TerrainTheory', '#TerrainMapping', '#ClinicalTerrain', '#TerrainBasedMedicine', '#TerrainAnalysis'],
    platform: 'Instagram',
    category: 'niche',
    competitiveness: 'low',
  },
];

// ---------------------------------------------------------------------------
// Pre-built strategies per platform
// ---------------------------------------------------------------------------

const PLATFORM_STRATEGIES: HashtagStrategy[] = [
  {
    platform: 'Instagram',
    alwaysUse: ['#VitalMatrix', '#TerrainMedicine', '#ClinicalIntelligence'],
    rotateWeekly: [
      ['#FunctionalMedicineUK', '#IFMPractitioner', '#RootCauseMedicine', '#GutTerrain', '#MetabolicHealth', '#PractitionerTools'],
      ['#FMCommunity', '#TerrainApproach', '#HormonalTerrain', '#DetoxTerrain', '#IntegrativeMedicine', '#ClinicalDecisionSupport'],
      ['#FMPractitioner', '#MicrobiomeIntelligence', '#CardiovascularTerrain', '#EnergyAxis', '#FunctionalMedicine', '#HealthTechUK'],
      ['#TerrainMapping', '#ImmuneResilience', '#HPAAxis', '#LiverBurden', '#TerrainBasedMedicine', '#PractitionerLife'],
    ],
    neverUse: [...BANNED_HASHTAGS],
  },
  {
    platform: 'LinkedIn',
    alwaysUse: ['#VitalMatrix', '#ClinicalIntelligence'],
    rotateWeekly: [
      ['#FunctionalMedicineUK', '#RootCauseMedicine', '#HealthTechUK'],
      ['#IFMPractitioner', '#TerrainMedicine', '#PractitionerTools'],
      ['#IntegrativeMedicine', '#ClinicalDecisionSupport', '#FMCommunity'],
      ['#TerrainApproach', '#FunctionalMedicine', '#DigitalHealth'],
    ],
    neverUse: [...BANNED_HASHTAGS],
  },
  {
    platform: 'X',
    alwaysUse: ['#VitalMatrix'],
    rotateWeekly: [
      ['#FunctionalMedicineUK', '#TerrainMedicine'],
      ['#FMCommunity', '#ClinicalIntelligence'],
      ['#RootCauseMedicine', '#IFMPractitioner'],
      ['#TerrainApproach', '#HealthTechUK'],
    ],
    neverUse: [...BANNED_HASHTAGS],
  },
  {
    platform: 'Facebook',
    alwaysUse: ['#VitalMatrix', '#TerrainMedicine'],
    rotateWeekly: [
      ['#FunctionalMedicineUK', '#IFMPractitioner', '#RootCauseMedicine'],
      ['#FMCommunity', '#TerrainApproach', '#IntegrativeMedicine'],
      ['#FunctionalMedicine', '#ClinicalIntelligence', '#PractitionerTools'],
      ['#FMPractitioner', '#TerrainMapping', '#HealthTechUK'],
    ],
    neverUse: [...BANNED_HASHTAGS],
  },
];

// ---------------------------------------------------------------------------
// Performance tracking state
// ---------------------------------------------------------------------------

const performanceLog: Map<string, HashtagPerformance> = new Map();

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Retrieves all hashtag sets matching a given platform and category.
 * @param platform - Target platform (e.g. "Instagram").
 * @param category - The hashtag category to filter by.
 * @returns Array of matching HashtagSet records.
 */
export function getHashtagSet(
  platform: string,
  category: HashtagCategory,
): HashtagSet[] {
  return HASHTAG_SETS.filter(
    (s) =>
      s.platform.toLowerCase() === platform.toLowerCase() &&
      s.category === category,
  );
}

/**
 * Generates an optimal hashtag set for a given platform, mixing brand,
 * clinical/zone, and community hashtags. Enforces platform-specific limits.
 * @param platform - Target platform.
 * @param zone - Optional zone identifier (e.g. "Z1", "Z2") for zone-specific tags.
 * @param maxCount - Optional override for maximum hashtag count.
 * @returns Array of hashtags optimised for the platform.
 */
export function generateOptimalSet(
  platform: string,
  zone?: string,
  maxCount?: number,
): string[] {
  const limit = maxCount ?? PLATFORM_LIMITS[platform] ?? 10;
  const result: string[] = [];
  const seen = new Set<string>();

  const addUnique = (tags: string[]): void => {
    for (const tag of tags) {
      const lower = tag.toLowerCase();
      if (!seen.has(lower) && !BANNED_HASHTAGS.includes(lower) && result.length < limit) {
        seen.add(lower);
        result.push(tag);
      }
    }
  };

  // 1. Brand hashtags (always first)
  const brandSets = getHashtagSet(platform, 'brand');
  for (const s of brandSets) {
    addUnique(s.hashtags);
  }

  // 2. Zone-specific clinical hashtags
  if (zone) {
    const zoneSets = HASHTAG_SETS.filter(
      (s) =>
        s.platform.toLowerCase() === platform.toLowerCase() &&
        s.category === 'zone' &&
        s.id.includes(zone.toLowerCase()),
    );
    for (const s of zoneSets) {
      addUnique(s.hashtags);
    }
  }

  // 3. Community hashtags
  const communitySets = getHashtagSet(platform, 'community');
  for (const s of communitySets) {
    addUnique(s.hashtags);
  }

  // 4. Niche hashtags to fill remaining slots
  const nicheSets = getHashtagSet(platform, 'niche');
  for (const s of nicheSets) {
    addUnique(s.hashtags);
  }

  return result.slice(0, limit);
}

/**
 * Returns a fresh rotation of hashtags for the current week to avoid
 * shadowban risk from using the same set repeatedly.
 * @param platform - Target platform.
 * @returns Array of hashtags for this week.
 */
export function rotateWeekly(platform: string): string[] {
  const strategy = PLATFORM_STRATEGIES.find(
    (s) => s.platform.toLowerCase() === platform.toLowerCase(),
  );
  if (!strategy) {
    throw new Error(`No hashtag strategy found for platform "${platform}".`);
  }

  // Determine week index (ISO week number mod rotation length)
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );
  const weekIndex = Math.floor(dayOfYear / 7) % strategy.rotateWeekly.length;

  const limit = PLATFORM_LIMITS[platform] ?? 10;
  const result = [...strategy.alwaysUse];
  const weeklyTags = strategy.rotateWeekly[weekIndex];
  const remaining = limit - result.length;

  result.push(...weeklyTags.slice(0, remaining));

  return result.slice(0, limit);
}

/**
 * Records performance data for a hashtag to track effectiveness over time.
 * @param hashtag - The hashtag (including #).
 * @param impressions - Number of impressions attributed to this hashtag.
 * @param platform - The platform where the hashtag was used.
 */
export function analyseHashtagPerformance(
  hashtag: string,
  impressions: number,
  platform?: string,
): HashtagPerformance {
  const key = hashtag.toLowerCase();
  const existing = performanceLog.get(key);

  if (existing) {
    existing.impressions += impressions;
    existing.uses += 1;
    existing.averageImpressions = Math.round(existing.impressions / existing.uses);
    existing.lastUsed = new Date().toISOString();
    performanceLog.set(key, existing);
    return existing;
  }

  const record: HashtagPerformance = {
    hashtag,
    impressions,
    uses: 1,
    averageImpressions: impressions,
    platform: platform ?? 'unknown',
    lastUsed: new Date().toISOString(),
  };
  performanceLog.set(key, record);
  return record;
}

/**
 * Generates a comprehensive hashtag performance report across all platforms.
 * @returns A structured HashtagReport.
 */
export function generateHashtagReport(): HashtagReport {
  const all = Array.from(performanceLog.values());

  const byPlatform: Record<string, HashtagPerformance[]> = {};
  for (const perf of all) {
    if (!byPlatform[perf.platform]) {
      byPlatform[perf.platform] = [];
    }
    byPlatform[perf.platform].push(perf);
  }

  // Sort each platform group by average impressions descending
  for (const key of Object.keys(byPlatform)) {
    byPlatform[key].sort((a, b) => b.averageImpressions - a.averageImpressions);
  }

  const sorted = [...all].sort(
    (a, b) => b.averageImpressions - a.averageImpressions,
  );

  return {
    totalTracked: all.length,
    byPlatform,
    topPerformers: sorted.slice(0, 10),
    underperformers: sorted.slice(-5).reverse(),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Suggests relevant hashtags for a given topic, drawing from existing sets
 * and generating topical variations.
 * @param topic - The topic to generate hashtags for (e.g. "gut health", "thyroid").
 * @returns Array of suggested hashtags.
 */
export function suggestNewHashtags(topic: string): string[] {
  const normalised = topic.toLowerCase().trim();
  const suggestions: string[] = [];

  // Search existing sets for matches
  for (const set of HASHTAG_SETS) {
    for (const tag of set.hashtags) {
      if (tag.toLowerCase().includes(normalised.replace(/\s+/g, ''))) {
        suggestions.push(tag);
      }
    }
  }

  // Generate topic-specific variations
  const camelCase = topic
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');

  const variations = [
    `#${camelCase}`,
    `#${camelCase}UK`,
    `#${camelCase}Practitioner`,
    `#${camelCase}FM`,
    `#${camelCase}Terrain`,
    `#${camelCase}Intelligence`,
  ];

  for (const v of variations) {
    if (
      !suggestions.includes(v) &&
      !BANNED_HASHTAGS.includes(v.toLowerCase())
    ) {
      suggestions.push(v);
    }
  }

  // Deduplicate
  return [...new Set(suggestions)];
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

/** Regulatory footer for hashtag strategy documents. */
export const HASHTAG_FOOTER = `${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`;
