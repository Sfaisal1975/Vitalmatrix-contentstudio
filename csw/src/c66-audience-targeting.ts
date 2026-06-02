/**
 * c66-audience-targeting.ts
 * VitalMatrix Content Studio — Audience Targeting (Single Source of Truth)
 *
 * EVERY component that needs audience, geography, or profession data
 * MUST import from this file. No other file should hard-code targeting.
 *
 * Geography lock: England only. Scotland, Wales, NI, and all international
 * territories are permanently excluded.
 *
 * (c) VitalMatrix Ltd 2026. All rights reserved.
 */

import { VM_BRAND } from './brand-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Geographic targeting — England-only with explicit exclusions. */
export interface TargetGeography {
  country: 'England';
  regions: string[];
  excludedCountries: string[];
  excludedRegions: string[];
  postcodeAreas?: string[];
}

/** A single target profession with platform-specific search data. */
export interface TargetProfession {
  title: string;
  searchTerms: string[];
  linkedInJobTitles: string[];
  facebookInterests: string[];
  estimatedCount?: number;
}

/** A Facebook group relevant to functional medicine outreach in the UK. */
export interface FacebookGroup {
  name: string;
  url: string;
  memberCount?: number;
  engagement: 'high' | 'medium' | 'low';
  strategy: 'post' | 'engage' | 'observe';
  notes: string;
}

/** A named audience segment combining professions, geography and platforms. */
export interface AudienceSegment {
  id: string;
  name: string;
  professions: TargetProfession[];
  geography: TargetGeography;
  platforms: string[];
  estimatedReach?: number;
}

/** Platform-specific ad targeting configuration. */
export interface PlatformTargeting {
  platform: string;
  locations: string[];
  jobTitles: string[];
  interests: string[];
  excludedInterests: string[];
  ageRange: { min: number; max: number };
  languages: string[];
}

/** Top-level audience configuration aggregating all targeting data. */
export interface TargetAudienceConfig {
  geography: TargetGeography;
  professions: TargetProfession[];
  facebookGroups: FacebookGroup[];
  segments: AudienceSegment[];
  adPlatformTargeting: Record<string, PlatformTargeting>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * TARGET_GEOGRAPHY
 * England only — all nine official regions included.
 * Every non-England territory is explicitly excluded.
 */
export const TARGET_GEOGRAPHY: TargetGeography = {
  country: 'England',
  regions: [
    'London',
    'South East',
    'South West',
    'East of England',
    'West Midlands',
    'East Midlands',
    'Yorkshire and the Humber',
    'North West',
    'North East',
  ],
  excludedCountries: [
    'Scotland',
    'Wales',
    'Northern Ireland',
    'Republic of Ireland',
    'USA',
    'Canada',
    'Australia',
    'New Zealand',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'rest of world',
  ],
  excludedRegions: [
    'Channel Islands',
    'Isle of Man',
  ],
};

/**
 * TARGET_PROFESSIONS
 * Six core professions within the functional/integrative medicine space.
 */
export const TARGET_PROFESSIONS: TargetProfession[] = [
  {
    title: 'Functional Medicine Practitioner',
    searchTerms: ['functional medicine', 'IFM certified', 'AFMCP graduate'],
    linkedInJobTitles: ['Functional Medicine Practitioner', 'IFM Certified Practitioner'],
    facebookInterests: ['Institute for Functional Medicine', 'functional medicine', 'terrain medicine'],
  },
  {
    title: 'GP Practising Functional Medicine',
    searchTerms: ['functional medicine GP', 'integrative GP functional medicine', 'GP IFM'],
    linkedInJobTitles: ['General Practitioner'],
    facebookInterests: ['Institute for Functional Medicine', 'functional medicine', 'integrative medicine'],
    // QUALIFIER: Must be practising FM approach. General GPs excluded.
  },
  {
    title: 'Nutritional Therapist Practising Functional Medicine',
    searchTerms: ['nutritional therapy functional medicine', 'BANT functional medicine', 'CNM functional medicine'],
    linkedInJobTitles: ['Nutritional Therapist', 'Registered Nutritional Therapist'],
    facebookInterests: ['functional medicine', 'Institute for Functional Medicine', 'terrain medicine'],
    // QUALIFIER: Must be practising FM approach. General nutritional therapists excluded.
  },
  {
    title: 'Naturopath Practising Functional Medicine',
    searchTerms: ['naturopath functional medicine', 'naturopathic functional medicine'],
    linkedInJobTitles: ['Naturopath', 'Naturopathic Practitioner'],
    facebookInterests: ['functional medicine', 'Institute for Functional Medicine', 'terrain medicine'],
    // QUALIFIER: Must be practising FM approach. General naturopaths excluded.
  },
  {
    title: 'Integrative Medicine Doctor Practising Functional Medicine',
    searchTerms: ['integrative functional medicine', 'functional medicine doctor'],
    linkedInJobTitles: ['Integrative Medicine Physician'],
    facebookInterests: ['functional medicine', 'Institute for Functional Medicine', 'integrative functional medicine'],
    // QUALIFIER: Must be practising FM approach. General integrative doctors excluded.
  },
  {
    title: 'Clinical Nutritionist Practising Functional Medicine',
    searchTerms: ['clinical nutrition functional medicine', 'functional nutrition'],
    linkedInJobTitles: ['Clinical Nutritionist'],
    facebookInterests: ['functional medicine', 'Institute for Functional Medicine', 'functional nutrition'],
    // QUALIFIER: Must be practising FM approach. General clinical nutritionists excluded.
  },
];

/**
 * FACEBOOK_GROUPS
 * Pre-identified UK functional medicine Facebook groups.
 * URLs left empty — to be populated when actual groups are confirmed.
 */
export const FACEBOOK_GROUPS: FacebookGroup[] = [
  {
    name: 'Functional Medicine UK',
    url: '',
    engagement: 'high',
    strategy: 'engage',
    notes: 'Primary UK FM community. High-value engagement target.',
  },
  {
    name: 'IFM UK Practitioners',
    url: '',
    engagement: 'high',
    strategy: 'engage',
    notes: 'IFM-certified practitioners based in the UK.',
  },
  {
    name: 'Integrative and Functional Medicine Practitioners UK',
    url: '',
    engagement: 'high',
    strategy: 'engage',
    notes: 'Broad integrative and FM practitioner community.',
  },
  {
    name: 'Functional Medicine Nutritional Therapists UK',
    url: '',
    engagement: 'medium',
    strategy: 'engage',
    notes: 'Nutritional therapists practising FM approach specifically. Not general NT groups.',
  },
  {
    name: 'BANT Functional Medicine Interest Group',
    url: '',
    engagement: 'medium',
    strategy: 'engage',
    notes: 'BANT members with functional medicine interest. FM-qualified subset only.',
  },
  {
    name: 'Functional Medicine Naturopaths UK',
    url: '',
    engagement: 'medium',
    strategy: 'engage',
    notes: 'Naturopaths practising FM approach. Not general naturopathy groups.',
  },
  {
    name: 'Functional Medicine Discussion Group',
    url: '',
    engagement: 'high',
    strategy: 'post',
    notes: 'Open discussion format — suitable for sharing content directly.',
  },
  {
    name: 'Root Cause Medicine UK',
    url: '',
    engagement: 'medium',
    strategy: 'engage',
    notes: 'Root-cause and systems-based medicine practitioners.',
  },
  {
    name: 'Functional Medicine and Root Cause Practitioners UK',
    url: '',
    engagement: 'low',
    strategy: 'engage',
    notes: 'FM and root cause practitioners. Engage only with FM-relevant content.',
  },
  {
    name: 'Functional Nutrition Practitioners UK',
    url: '',
    engagement: 'medium',
    strategy: 'engage',
    notes: 'Clinical nutritionists practising FM approach specifically.',
  },
  {
    name: 'Integrative Health UK',
    url: '',
    engagement: 'medium',
    strategy: 'engage',
    notes: 'Integrative health practitioners across disciplines.',
  },
  {
    name: 'Personalised Medicine Practitioners',
    url: '',
    engagement: 'low',
    strategy: 'engage',
    notes: 'Emerging personalised medicine community — observe and assess.',
  },
];

/**
 * AD_PLATFORM_TARGETING
 * Pre-built targeting configurations for Google Ads, Meta Ads and LinkedIn Ads.
 */
export const AD_PLATFORM_TARGETING: Record<string, PlatformTargeting> = {
  'google-ads': {
    platform: 'Google Ads',
    locations: ['England', 'United Kingdom'],
    jobTitles: [
      'functional medicine practitioner',
      'nutritional therapist',
      'naturopath',
      'integrative medicine doctor',
      'clinical nutritionist',
      'general practitioner',
    ],
    interests: [
      'functional medicine',
      'integrative medicine',
      'nutritional therapy',
      'naturopathy',
      'clinical nutrition',
      'personalised medicine',
      'IFM certified',
      'AFMCP',
      'root cause medicine',
    ],
    excludedInterests: [
      'patient self-help',
      'alternative medicine quackery',
      'MLM supplements',
      'health coaching certification',
    ],
    ageRange: { min: 28, max: 65 },
    languages: ['English'],
  },
  'meta-ads': {
    platform: 'Meta Ads',
    locations: ['England', 'United Kingdom'],
    jobTitles: [
      'Functional Medicine Practitioner',
      'Nutritional Therapist',
      'Naturopath',
      'Integrative Medicine Physician',
      'Clinical Nutritionist',
      'General Practitioner',
    ],
    interests: [
      'Institute for Functional Medicine',
      'functional medicine',
      'integrative medicine',
      'BANT',
      'College of Naturopathic Medicine',
      'nutritional therapy',
      'naturopathy UK',
      'clinical nutrition',
      'personalised medicine',
      'terrain medicine',
      'holistic medicine',
    ],
    excludedInterests: [
      'patient wellness',
      'diet fads',
      'MLM health products',
      'health coaching',
    ],
    ageRange: { min: 28, max: 65 },
    languages: ['English'],
  },
  'linkedin-ads': {
    platform: 'LinkedIn Ads',
    locations: ['England', 'United Kingdom'],
    jobTitles: [
      'Functional Medicine Practitioner',
      'IFM Certified Practitioner',
      'General Practitioner',
      'Nutritional Therapist',
      'Registered Nutritional Therapist',
      'Naturopath',
      'Naturopathic Practitioner',
      'Integrative Medicine Physician',
      'Clinical Nutritionist',
    ],
    interests: [
      'Functional Medicine',
      'Integrative Medicine',
      'Nutritional Therapy',
      'Naturopathic Medicine',
      'Clinical Nutrition',
      'Personalised Medicine',
      'Systems Biology',
      'Root Cause Analysis',
    ],
    excludedInterests: [
      'Health Coaching',
      'Wellness Influencer',
      'Life Coaching',
    ],
    ageRange: { min: 28, max: 65 },
    languages: ['English'],
  },
};

// ---------------------------------------------------------------------------
// Pre-built audience segments
// ---------------------------------------------------------------------------

/** Default audience segments combining professions with geography. */
const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: 'seg-fm-core',
    name: 'Core Functional Medicine Practitioners',
    professions: [TARGET_PROFESSIONS[0], TARGET_PROFESSIONS[4]],
    geography: TARGET_GEOGRAPHY,
    platforms: ['Facebook', 'LinkedIn', 'Instagram'],
    estimatedReach: 2500,
  },
  {
    id: 'seg-gp-integrative',
    name: 'GPs with Integrative Interest',
    professions: [TARGET_PROFESSIONS[1]],
    geography: TARGET_GEOGRAPHY,
    platforms: ['LinkedIn', 'Instagram'],
    estimatedReach: 5000,
  },
  {
    id: 'seg-nutrition',
    name: 'Nutritional Therapists and Clinical Nutritionists',
    professions: [TARGET_PROFESSIONS[2], TARGET_PROFESSIONS[5]],
    geography: TARGET_GEOGRAPHY,
    platforms: ['Facebook', 'LinkedIn', 'Instagram'],
    estimatedReach: 8000,
  },
  {
    id: 'seg-naturopath',
    name: 'Naturopaths',
    professions: [TARGET_PROFESSIONS[3]],
    geography: TARGET_GEOGRAPHY,
    platforms: ['Facebook', 'Instagram'],
    estimatedReach: 1500,
  },
];

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Returns the target geography configuration.
 * England only with all exclusions.
 */
export function getTargetGeography(): TargetGeography {
  return TARGET_GEOGRAPHY;
}

/**
 * Returns all six target professions.
 */
export function getTargetProfessions(): TargetProfession[] {
  return TARGET_PROFESSIONS;
}

/**
 * Returns Facebook groups, optionally filtered by strategy.
 * @param strategy - If provided, returns only groups matching this strategy.
 */
export function getFacebookGroups(strategy?: 'post' | 'engage' | 'observe'): FacebookGroup[] {
  if (!strategy) {
    return FACEBOOK_GROUPS;
  }
  return FACEBOOK_GROUPS.filter((group) => group.strategy === strategy);
}

/**
 * Returns all pre-built audience segments.
 */
export function getAudienceSegments(): AudienceSegment[] {
  return AUDIENCE_SEGMENTS;
}

/**
 * Returns the ad platform targeting configuration for a specific platform.
 * @param platform - Platform key: 'google-ads', 'meta-ads', or 'linkedin-ads'.
 * @returns The targeting config, or undefined if the platform is not configured.
 */
export function getPlatformTargeting(platform: string): PlatformTargeting | undefined {
  return AD_PLATFORM_TARGETING[platform];
}

/**
 * Checks whether a location string falls within the target geography.
 * Matches against country, region names, and checks it is not excluded.
 * @param location - A location string to test (e.g. 'London', 'England', 'South East').
 */
export function isInTargetGeography(location: string): boolean {
  const normalised = location.trim().toLowerCase();

  if (isExcludedGeography(location)) {
    return false;
  }

  if (normalised === TARGET_GEOGRAPHY.country.toLowerCase()) {
    return true;
  }

  return TARGET_GEOGRAPHY.regions.some(
    (region) => region.toLowerCase() === normalised,
  );
}

/**
 * Checks whether a location string is explicitly excluded from targeting.
 * @param location - A location string to test (e.g. 'Scotland', 'Channel Islands').
 */
export function isExcludedGeography(location: string): boolean {
  const normalised = location.trim().toLowerCase();

  const isExcludedCountry = TARGET_GEOGRAPHY.excludedCountries.some(
    (country) => country.toLowerCase() === normalised,
  );

  const isExcludedRegion = TARGET_GEOGRAPHY.excludedRegions.some(
    (region) => region.toLowerCase() === normalised,
  );

  return isExcludedCountry || isExcludedRegion;
}

/**
 * Generates a markdown targeting brief summarising all audience targeting.
 * Suitable for review by the content or marketing team.
 */
export function generateTargetingBrief(): string {
  const lines: string[] = [];

  lines.push(`# ${VM_BRAND.platform.descriptor.toUpperCase()} — Audience Targeting Brief`);
  lines.push('');
  lines.push(`**Company:** ${VM_BRAND.credentials.company}`);
  lines.push(`**Audience type:** ${VM_BRAND.platform.audience} (B2B)`);
  lines.push(`**Regulatory context:** ${VM_BRAND.targetAudience.regulatory}`);
  lines.push('');

  // Geography
  lines.push('## Geography');
  lines.push('');
  lines.push(`**Target country:** ${TARGET_GEOGRAPHY.country}`);
  lines.push(`**Regions:** ${TARGET_GEOGRAPHY.regions.join(', ')}`);
  lines.push(`**Excluded countries:** ${TARGET_GEOGRAPHY.excludedCountries.join(', ')}`);
  lines.push(`**Excluded regions:** ${TARGET_GEOGRAPHY.excludedRegions.join(', ')}`);
  lines.push('');

  // Professions
  lines.push('## Target Professions');
  lines.push('');
  for (const profession of TARGET_PROFESSIONS) {
    lines.push(`### ${profession.title}`);
    lines.push(`- **Search terms:** ${profession.searchTerms.join(', ')}`);
    lines.push(`- **LinkedIn job titles:** ${profession.linkedInJobTitles.join(', ')}`);
    lines.push(`- **Facebook interests:** ${profession.facebookInterests.join(', ')}`);
    if (profession.estimatedCount !== undefined) {
      lines.push(`- **Estimated count:** ${profession.estimatedCount.toLocaleString()}`);
    }
    lines.push('');
  }

  // Segments
  lines.push('## Audience Segments');
  lines.push('');
  for (const segment of AUDIENCE_SEGMENTS) {
    lines.push(`### ${segment.name} (${segment.id})`);
    lines.push(`- **Professions:** ${segment.professions.map((p) => p.title).join(', ')}`);
    lines.push(`- **Platforms:** ${segment.platforms.join(', ')}`);
    if (segment.estimatedReach !== undefined) {
      lines.push(`- **Estimated reach:** ${segment.estimatedReach.toLocaleString()}`);
    }
    lines.push('');
  }

  // Ad platforms
  lines.push('## Ad Platform Targeting');
  lines.push('');
  for (const [key, targeting] of Object.entries(AD_PLATFORM_TARGETING)) {
    lines.push(`### ${targeting.platform} (${key})`);
    lines.push(`- **Locations:** ${targeting.locations.join(', ')}`);
    lines.push(`- **Age range:** ${targeting.ageRange.min}--${targeting.ageRange.max}`);
    lines.push(`- **Languages:** ${targeting.languages.join(', ')}`);
    lines.push(`- **Job titles:** ${targeting.jobTitles.join(', ')}`);
    lines.push(`- **Interests:** ${targeting.interests.join(', ')}`);
    lines.push(`- **Excluded interests:** ${targeting.excludedInterests.join(', ')}`);
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push(`Generated from c66-audience-targeting.ts | ${VM_BRAND.credentials.company}`);

  return lines.join('\n');
}

/**
 * Generates a markdown strategy document for Facebook group engagement.
 * Covers all 12 groups with prioritised actions by strategy type.
 */
export function generateFacebookGroupStrategy(): string {
  const lines: string[] = [];

  lines.push('# Facebook Group Engagement Strategy');
  lines.push('');
  lines.push(`**Platform:** ${VM_BRAND.credentials.company} — ${VM_BRAND.platform.descriptor}`);
  lines.push(`**Pricing hook:** Founding rate ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month (fixed ${VM_BRAND.pricing.foundingFixedMonths} months)`);
  lines.push('');

  const strategyOrder: Array<'engage' | 'post' | 'observe'> = ['engage', 'post', 'observe'];
  const strategyDescriptions: Record<string, string> = {
    engage: 'Actively participate in discussions, answer questions, and build credibility before sharing content.',
    post: 'Share original content directly — articles, case studies, and platform insights.',
    observe: 'Monitor conversations and sentiment. Do not post until engagement level is confirmed.',
  };

  for (const strat of strategyOrder) {
    const groups = FACEBOOK_GROUPS.filter((g) => g.strategy === strat);
    if (groups.length === 0) continue;

    lines.push(`## Strategy: ${strat.toUpperCase()}`);
    lines.push('');
    lines.push(strategyDescriptions[strat]);
    lines.push('');

    for (const group of groups) {
      lines.push(`### ${group.name}`);
      lines.push(`- **Engagement level:** ${group.engagement}`);
      lines.push(`- **Notes:** ${group.notes}`);
      if (group.url) {
        lines.push(`- **URL:** ${group.url}`);
      }
      if (group.memberCount !== undefined) {
        lines.push(`- **Members:** ${group.memberCount.toLocaleString()}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('All group engagement must comply with group rules. No hard selling. Lead with value.');

  return lines.join('\n');
}

/**
 * Generates a formatted targeting export for copy-paste into a specific ad platform.
 * @param platform - Platform key: 'google-ads', 'meta-ads', or 'linkedin-ads'.
 * @returns Formatted text ready for use in the ad platform, or an error message.
 */
export function generateAdTargetingExport(platform: string): string {
  const targeting = AD_PLATFORM_TARGETING[platform];

  if (!targeting) {
    return `ERROR: No targeting configuration found for platform "${platform}". Available: ${Object.keys(AD_PLATFORM_TARGETING).join(', ')}`;
  }

  const lines: string[] = [];

  lines.push(`=== ${targeting.platform} Targeting Export ===`);
  lines.push('');
  lines.push('LOCATIONS');
  lines.push(`  Include: ${targeting.locations.join('; ')}`);
  lines.push(`  Exclude: ${TARGET_GEOGRAPHY.excludedCountries.join('; ')}`);
  lines.push(`  Exclude regions: ${TARGET_GEOGRAPHY.excludedRegions.join('; ')}`);
  lines.push('');
  lines.push('AGE RANGE');
  lines.push(`  ${targeting.ageRange.min} - ${targeting.ageRange.max}`);
  lines.push('');
  lines.push('LANGUAGES');
  lines.push(`  ${targeting.languages.join('; ')}`);
  lines.push('');
  lines.push('JOB TITLES / KEYWORDS');
  for (const title of targeting.jobTitles) {
    lines.push(`  + ${title}`);
  }
  lines.push('');
  lines.push('INTERESTS (INCLUDE)');
  for (const interest of targeting.interests) {
    lines.push(`  + ${interest}`);
  }
  lines.push('');
  lines.push('INTERESTS (EXCLUDE)');
  for (const excluded of targeting.excludedInterests) {
    lines.push(`  - ${excluded}`);
  }
  lines.push('');
  lines.push(`=== End ${targeting.platform} Export ===`);

  return lines.join('\n');
}

/**
 * Estimates the total reach across all audience segments.
 * Sums the estimatedReach value of each segment.
 * @returns Total estimated reach, or 0 if no segments have estimates.
 */
export function estimateTotalReach(): number {
  return AUDIENCE_SEGMENTS.reduce((total, segment) => {
    return total + (segment.estimatedReach ?? 0);
  }, 0);
}

/**
 * Validates a targeting configuration to ensure no excluded geographies have leaked in.
 * Checks locations across all platform targeting entries.
 * @param config - The TargetAudienceConfig to validate.
 * @returns An object with `valid` boolean and an array of `errors`.
 */
export function validateTargeting(
  config: TargetAudienceConfig,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check geography country
  if (config.geography.country !== 'England') {
    errors.push(`Geography country must be "England", found "${config.geography.country}".`);
  }

  // Check regions are valid
  for (const region of config.geography.regions) {
    if (!TARGET_GEOGRAPHY.regions.includes(region)) {
      errors.push(`Unknown region in geography: "${region}".`);
    }
  }

  // Check no excluded countries appear in geography
  for (const excluded of TARGET_GEOGRAPHY.excludedCountries) {
    if (config.geography.regions.some((r) => r.toLowerCase() === excluded.toLowerCase())) {
      errors.push(`Excluded country "${excluded}" found in geography regions.`);
    }
  }

  // Check ad platform targeting locations
  for (const [platformKey, targeting] of Object.entries(config.adPlatformTargeting)) {
    for (const location of targeting.locations) {
      if (isExcludedGeography(location)) {
        errors.push(
          `Excluded geography "${location}" found in ${platformKey} targeting locations.`,
        );
      }
    }

    // Check age range bounds
    if (targeting.ageRange.min < 18) {
      errors.push(`${platformKey}: minimum age ${targeting.ageRange.min} is below 18.`);
    }
    if (targeting.ageRange.max > 80) {
      errors.push(`${platformKey}: maximum age ${targeting.ageRange.max} exceeds 80.`);
    }
  }

  // Check professions are not empty
  if (config.professions.length === 0) {
    errors.push('No target professions defined.');
  }

  // Check segments do not reference excluded geographies
  for (const segment of config.segments) {
    if (segment.geography.country !== 'England') {
      errors.push(
        `Segment "${segment.name}" targets "${segment.geography.country}" instead of England.`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ---------------------------------------------------------------------------
// Full config export (convenience)
// ---------------------------------------------------------------------------

/**
 * Returns the complete TargetAudienceConfig for use by other components.
 * This is the canonical assembled configuration.
 */
export function getFullTargetAudienceConfig(): TargetAudienceConfig {
  return {
    geography: TARGET_GEOGRAPHY,
    professions: TARGET_PROFESSIONS,
    facebookGroups: FACEBOOK_GROUPS,
    segments: AUDIENCE_SEGMENTS,
    adPlatformTargeting: AD_PLATFORM_TARGETING,
  };
}
