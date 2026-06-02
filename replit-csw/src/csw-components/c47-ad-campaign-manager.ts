/**
 * Component 47: Ad Campaign Manager
 *
 * Advertisement campaign planning and content generation for Google Ads,
 * Meta Ads, and LinkedIn Ads. Creates compliant ad copy targeting
 * functional medicine practitioners (B2B only). Validates against
 * MHRA, ASA, and K7/K8/K10 compliance rules. Generates platform-specific
 * ad formats and campaign performance reports.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Supported advertising platforms */
export type AdPlatform = 'google-ads' | 'meta-ads' | 'linkedin-ads';

/** Campaign marketing objective */
export type CampaignObjective = 'awareness' | 'consideration' | 'conversion';

/** Campaign lifecycle status */
export type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed';

/** Ad format type */
export type AdType = 'search' | 'display' | 'social' | 'video';

/** A single advertisement unit */
export interface Ad {
  id: string;
  headline: string;
  description: string;
  cta: string;
  landingUrl: string;
  mediaUrl?: string;
  adType: AdType;
}

/** Target audience demographics */
export interface Demographics {
  ageRange: string;
  locations: string[];
  interests: string[];
  jobTitles: string[];
}

/** Audience segment for targeting */
export interface AudienceSegment {
  name: string;
  demographics: Demographics;
  estimatedReach?: number;
}

/** Campaign budget configuration */
export interface CampaignBudget {
  daily: number;
  total: number;
  currency: string;
}

/** A complete advertising campaign */
export interface AdCampaign {
  id: string;
  name: string;
  platform: AdPlatform;
  objective: CampaignObjective;
  targetAudience: AudienceSegment;
  budget: CampaignBudget;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  ads: Ad[];
}

/** Ad compliance validation result */
export interface AdComplianceResult {
  compliant: boolean;
  errors: string[];
  warnings: string[];
}

/** Budget estimate for campaign planning */
export interface BudgetEstimate {
  platform: AdPlatform;
  objective: CampaignObjective;
  durationDays: number;
  estimatedDailySpend: number;
  estimatedTotalSpend: number;
  estimatedImpressions: number;
  estimatedClicks: number;
  currency: string;
}

// --- Pre-built Audience Segments ---

/** Pre-configured audience segments for UK practitioner targeting */
export const AUDIENCE_SEGMENTS: Record<string, AudienceSegment> = {
  'uk-fm-practitioners': {
    name: 'UK Functional Medicine Practitioners',
    demographics: {
      ageRange: '30-65',
      locations: ['United Kingdom'],
      interests: ['Functional Medicine', 'Integrative Medicine', 'Clinical Nutrition', 'Systems Biology'],
      jobTitles: ['Functional Medicine Practitioner', 'Integrative Medicine Doctor', 'Clinical Nutritionist'],
    },
    estimatedReach: 8500,
  },
  'uk-ifm-certified': {
    name: 'IFM Certified Practitioners UK',
    demographics: {
      ageRange: '30-65',
      locations: ['United Kingdom'],
      interests: ['Institute for Functional Medicine', 'Functional Medicine', 'AFMCP'],
      jobTitles: ['IFM Certified Practitioner', 'Functional Medicine Doctor'],
    },
    estimatedReach: 2200,
  },
  'uk-integrative-health': {
    name: 'UK Integrative Health Practitioners',
    demographics: {
      ageRange: '28-65',
      locations: ['United Kingdom'],
      interests: ['Integrative Health', 'Holistic Medicine', 'Personalised Medicine'],
      jobTitles: ['Integrative Health Practitioner', 'Holistic Health Professional'],
    },
    estimatedReach: 12000,
  },
  'uk-naturopaths': {
    name: 'UK Naturopathic Practitioners',
    demographics: {
      ageRange: '28-60',
      locations: ['United Kingdom'],
      interests: ['Naturopathy', 'Natural Medicine', 'Herbal Medicine', 'Nutrition'],
      jobTitles: ['Naturopath', 'Naturopathic Practitioner', 'Natural Health Practitioner'],
    },
    estimatedReach: 6500,
  },
  'uk-nutritional-therapists': {
    name: 'UK Nutritional Therapists',
    demographics: {
      ageRange: '25-60',
      locations: ['United Kingdom'],
      interests: ['Nutritional Therapy', 'Clinical Nutrition', 'Nutrigenomics', 'Functional Nutrition'],
      jobTitles: ['Nutritional Therapist', 'Registered Nutritionist', 'Clinical Nutritionist'],
    },
    estimatedReach: 9000,
  },
};

// --- Compliance Patterns ---

const AD_COMPLIANCE_PATTERNS: { pattern: RegExp; message: string; level: 'error' | 'warning' }[] = [
  { pattern: /Mark\s+Hyman/i, message: 'K10: competitor name (Mark Hyman)', level: 'error' },
  { pattern: /LaValle/i, message: 'K10: competitor name (LaValle)', level: 'error' },
  { pattern: /Metabolic\s+Code/i, message: 'K10: competitor-adjacent term', level: 'error' },
  { pattern: /FMAARM/i, message: 'K7: incorrect credential FMAARM', level: 'error' },
  { pattern: /\bMD\b/, message: 'K7: MD credential (must be MBBS)', level: 'error' },
  { pattern: /\u2014/g, message: 'K8: em dash detected', level: 'error' },
  { pattern: /clinical\s+AI\s+platform/i, message: 'Descriptor: must be "terrain intelligence platform"', level: 'error' },
  { pattern: /diagnos(e|is|tic)/i, message: 'MHRA: diagnostic language not permitted in advertising', level: 'error' },
  { pattern: /cure[sd]?\b/i, message: 'ASA: curative claims not permitted', level: 'error' },
  { pattern: /guaranteed?\s+(results|outcomes)/i, message: 'ASA: guaranteed outcomes claim', level: 'error' },
  { pattern: /patient/i, message: 'Audience: patient-facing language -- B2B practitioner only', level: 'warning' },
  { pattern: /treat(s|ment|ing)?\b/i, message: 'MHRA: treatment language -- ensure context is practitioner-facing', level: 'warning' },
];

// --- In-memory store ---

const campaigns: AdCampaign[] = [];

// --- Utility ---

/** Generate a unique identifier */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// --- Core Functions ---

/**
 * Create a new advertising campaign.
 *
 * @param name - Campaign name
 * @param platform - Target ad platform
 * @param objective - Marketing objective
 * @param segmentKey - Key into AUDIENCE_SEGMENTS or a custom AudienceSegment
 * @param budget - Budget configuration
 * @param startDate - Campaign start date (ISO string)
 * @param endDate - Campaign end date (ISO string)
 * @returns The created AdCampaign
 */
export function createCampaign(
  name: string,
  platform: AdPlatform,
  objective: CampaignObjective,
  segmentKey: string | AudienceSegment,
  budget: CampaignBudget,
  startDate: string,
  endDate: string,
): AdCampaign {
  const targetAudience =
    typeof segmentKey === 'string'
      ? AUDIENCE_SEGMENTS[segmentKey] ?? AUDIENCE_SEGMENTS['uk-fm-practitioners']
      : segmentKey;

  const campaign: AdCampaign = {
    id: generateId('camp'),
    name,
    platform,
    objective,
    targetAudience,
    budget: { ...budget, currency: budget.currency || VM_BRAND.pricing.currency },
    startDate,
    endDate,
    status: 'planning',
    ads: [],
  };

  campaigns.push(campaign);
  return campaign;
}

/**
 * Add an advertisement to an existing campaign.
 *
 * @param campaignId - Target campaign identifier
 * @param ad - Ad configuration (without id)
 * @returns The created Ad or undefined if campaign not found
 */
export function addAd(
  campaignId: string,
  ad: Omit<Ad, 'id'>,
): Ad | undefined {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign) return undefined;

  const newAd: Ad = {
    id: generateId('ad'),
    ...ad,
  };

  campaign.ads.push(newAd);
  return newAd;
}

/**
 * Generate compliant ad copy for a given objective and audience segment.
 * Produces headline, description, and CTA without clinical claims.
 *
 * @param objective - Campaign objective
 * @param segment - Target audience segment
 * @returns An Ad object with generated copy
 */
export function generateAdCopy(objective: CampaignObjective, segment: AudienceSegment): Ad {
  const domain = VM_BRAND.platform.domain;
  const descriptor = VM_BRAND.platform.descriptor;
  const price = `${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month`;

  const templates: Record<CampaignObjective, { headline: string; description: string; cta: string }> = {
    awareness: {
      headline: `VitalMatrix -- ${descriptor}`,
      description: `Built for ${segment.name.toLowerCase()}. Map terrain-level clinical connections across 7 nodes and 5 zones. Evidence-tiered insights for practitioner workflows.`,
      cta: 'Learn More',
    },
    consideration: {
      headline: 'Transform Your Clinical Workflow',
      description: `VitalMatrix helps practitioners see connections others miss. Founding cohort: ${price} fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Limited to 10 practitioners.`,
      cta: 'Book a Discovery Call',
    },
    conversion: {
      headline: `Join the Founding Cohort -- ${price}`,
      description: `${VM_BRAND.pricing.guarantee}. Only 10 founding spots available. Full access to VitalMatrix ${descriptor}. Standard rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month.`,
      cta: 'Secure Your Founding Spot',
    },
  };

  const template = templates[objective];

  return {
    id: generateId('ad'),
    headline: template.headline,
    description: template.description,
    cta: template.cta,
    landingUrl: `https://${domain}`,
    adType: 'social',
  };
}

/**
 * Generate Google responsive search ads from keyword groups.
 * Produces 3 ad variants per keyword group with headlines (max 30 chars)
 * and descriptions (max 90 chars).
 *
 * @param keywords - Array of keyword strings
 * @returns Array of Ad objects formatted for Google Search
 */
export function generateGoogleSearchAds(keywords: string[]): Ad[] {
  const ads: Ad[] = [];
  const domain = VM_BRAND.platform.domain;

  for (const keyword of keywords) {
    const truncatedKeyword = keyword.length > 15 ? keyword.slice(0, 15) : keyword;

    const variants: { headline: string; description: string }[] = [
      {
        headline: `VitalMatrix ${truncatedKeyword}`.slice(0, 30),
        description: `${VM_BRAND.platform.descriptor} for practitioners. Evidence-tiered clinical insights.`.slice(0, 90),
      },
      {
        headline: `${truncatedKeyword} Platform`.slice(0, 30),
        description: `Map clinical connections across 7 nodes. Founding rate: GBP 99/month fixed.`.slice(0, 90),
      },
      {
        headline: `${truncatedKeyword} Tools`.slice(0, 30),
        description: `Built for functional medicine. Join the founding cohort. Limited availability.`.slice(0, 90),
      },
    ];

    for (const variant of variants) {
      ads.push({
        id: generateId('gad'),
        headline: variant.headline,
        description: variant.description,
        cta: 'Learn More',
        landingUrl: `https://${domain}/?utm_source=google&utm_term=${encodeURIComponent(keyword)}`,
        adType: 'search',
      });
    }
  }

  return ads;
}

/**
 * Generate Meta (Facebook + Instagram) ad sets for a given objective.
 *
 * @param objective - Campaign objective
 * @returns Array of Ad objects for Facebook and Instagram placements
 */
export function generateMetaAds(objective: CampaignObjective): Ad[] {
  const domain = VM_BRAND.platform.domain;
  const ads: Ad[] = [];

  const baseAd = generateAdCopy(objective, AUDIENCE_SEGMENTS['uk-fm-practitioners']);

  // Facebook feed ad
  ads.push({
    id: generateId('fb'),
    headline: baseAd.headline,
    description: `${baseAd.description}\n\nFor practitioner use only.`,
    cta: baseAd.cta,
    landingUrl: `https://${domain}/?utm_source=facebook&utm_medium=social`,
    adType: 'social',
  });

  // Instagram feed ad (shorter copy)
  const instaDesc = baseAd.description.length > 150
    ? baseAd.description.slice(0, 147) + '...'
    : baseAd.description;

  ads.push({
    id: generateId('ig'),
    headline: baseAd.headline,
    description: instaDesc,
    cta: baseAd.cta,
    landingUrl: `https://${domain}/?utm_source=instagram&utm_medium=social`,
    adType: 'social',
  });

  // Facebook/Instagram Stories ad
  ads.push({
    id: generateId('stories'),
    headline: 'VitalMatrix for Practitioners',
    description: objective === 'conversion'
      ? `Founding cohort: GBP ${VM_BRAND.pricing.foundingMonthly}/month. Limited spots.`
      : `${VM_BRAND.platform.descriptor}. Built for functional medicine.`,
    cta: objective === 'conversion' ? 'Sign Up' : 'Learn More',
    landingUrl: `https://${domain}/?utm_source=meta&utm_medium=stories`,
    adType: 'social',
  });

  return ads;
}

/**
 * Generate LinkedIn ad formats: sponsored content and message ads.
 *
 * @param objective - Campaign objective
 * @returns Array of Ad objects for LinkedIn placements
 */
export function generateLinkedInAds(objective: CampaignObjective): Ad[] {
  const domain = VM_BRAND.platform.domain;
  const ads: Ad[] = [];
  const creds = VM_BRAND.credentials;

  // Sponsored content (feed ad)
  ads.push({
    id: generateId('li-feed'),
    headline: objective === 'conversion'
      ? 'Join the VitalMatrix Founding Cohort'
      : 'VitalMatrix -- Clinical Intelligence for Practitioners',
    description: objective === 'conversion'
      ? `${creds.name}, ${creds.qualifications}, is inviting 10 practitioners to join at the founding rate of GBP ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Standard rate: GBP ${VM_BRAND.pricing.standardRate}/month.`
      : `A ${VM_BRAND.platform.descriptor} mapping terrain-level connections across 7 nodes and 5 zones. Evidence-tiered. Built for practitioners, by a practitioner.`,
    cta: objective === 'conversion' ? 'Apply Now' : 'Learn More',
    landingUrl: `https://${domain}/?utm_source=linkedin&utm_medium=sponsored`,
    adType: 'social',
  });

  // Sponsored message ad
  ads.push({
    id: generateId('li-msg'),
    headline: `A message from ${creds.name}`,
    description: [
      `Dear colleague,`,
      ``,
      `I have built VitalMatrix -- a ${VM_BRAND.platform.descriptor} -- to help practitioners like us see the clinical connections that matter.`,
      ``,
      objective === 'conversion'
        ? `I am opening 10 founding spots at GBP ${VM_BRAND.pricing.foundingMonthly}/month (fixed for ${VM_BRAND.pricing.foundingFixedMonths} months). I would welcome a conversation about how it could support your practice.`
        : `I would welcome the opportunity to show you how it works. Book a 20-minute discovery call at your convenience.`,
      ``,
      `${creds.name}, ${creds.qualifications}`,
      `${creds.title}, ${creds.company}`,
    ].join('\n'),
    cta: objective === 'conversion' ? 'Secure Your Spot' : 'Book a Discovery Call',
    landingUrl: `https://${domain}/?utm_source=linkedin&utm_medium=inmail`,
    adType: 'social',
  });

  return ads;
}

/**
 * Validate an ad against MHRA, ASA, and K7/K8/K10 compliance rules.
 *
 * @param ad - The Ad to validate
 * @returns AdComplianceResult with compliant flag, errors, and warnings
 */
export function validateAdCompliance(ad: Ad): AdComplianceResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const fullText = `${ad.headline} ${ad.description} ${ad.cta}`;

  for (const { pattern, message, level } of AD_COMPLIANCE_PATTERNS) {
    if (pattern.test(fullText)) {
      if (level === 'error') {
        errors.push(message);
      } else {
        warnings.push(message);
      }
    }
  }

  // Google Search headline length check
  if (ad.adType === 'search' && ad.headline.length > 30) {
    errors.push(`Google Search headline exceeds 30 characters: ${ad.headline.length}`);
  }

  // Google Search description length check
  if (ad.adType === 'search' && ad.description.length > 90) {
    errors.push(`Google Search description exceeds 90 characters: ${ad.description.length}`);
  }

  return {
    compliant: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Estimate budget requirements for a campaign based on platform,
 * objective, and duration.
 *
 * @param platform - Target ad platform
 * @param objective - Marketing objective
 * @param durationDays - Campaign duration in days
 * @returns BudgetEstimate with projected spend and performance
 */
export function estimateBudget(
  platform: AdPlatform,
  objective: CampaignObjective,
  durationDays: number,
): BudgetEstimate {
  // Base daily spend estimates (GBP) for niche B2B healthcare targeting
  const baseDailySpend: Record<AdPlatform, Record<CampaignObjective, number>> = {
    'google-ads': { awareness: 15, consideration: 25, conversion: 35 },
    'meta-ads': { awareness: 10, consideration: 20, conversion: 30 },
    'linkedin-ads': { awareness: 25, consideration: 40, conversion: 55 },
  };

  // Estimated CPM (cost per 1000 impressions) by platform
  const cpm: Record<AdPlatform, number> = {
    'google-ads': 8,
    'meta-ads': 6,
    'linkedin-ads': 15,
  };

  // Estimated CTR by objective
  const ctr: Record<CampaignObjective, number> = {
    awareness: 0.008,
    consideration: 0.015,
    conversion: 0.025,
  };

  const dailySpend = baseDailySpend[platform][objective];
  const totalSpend = dailySpend * durationDays;
  const estimatedImpressions = Math.round((totalSpend / cpm[platform]) * 1000);
  const estimatedClicks = Math.round(estimatedImpressions * ctr[objective]);

  return {
    platform,
    objective,
    durationDays,
    estimatedDailySpend: dailySpend,
    estimatedTotalSpend: totalSpend,
    estimatedImpressions,
    estimatedClicks,
    currency: VM_BRAND.pricing.currency,
  };
}

/**
 * Generate a Markdown performance report for a campaign.
 *
 * @param campaign - The campaign to report on
 * @returns Markdown-formatted report string
 */
export function generateCampaignReport(campaign: AdCampaign): string {
  const lines: string[] = [
    `# Campaign Report: ${campaign.name}`,
    '',
    `**Platform:** ${campaign.platform}`,
    `**Objective:** ${campaign.objective}`,
    `**Status:** ${campaign.status}`,
    `**Period:** ${campaign.startDate} to ${campaign.endDate}`,
    `**Target Audience:** ${campaign.targetAudience.name}`,
    '',
    '## Budget',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Daily budget | ${campaign.budget.currency} ${campaign.budget.daily} |`,
    `| Total budget | ${campaign.budget.currency} ${campaign.budget.total} |`,
    '',
    '## Ads',
    '',
    `Total ads: ${campaign.ads.length}`,
    '',
  ];

  for (const ad of campaign.ads) {
    const compliance = validateAdCompliance(ad);
    lines.push(`### ${ad.headline}`);
    lines.push('');
    lines.push(`- **Type:** ${ad.adType}`);
    lines.push(`- **Description:** ${ad.description.slice(0, 100)}${ad.description.length > 100 ? '...' : ''}`);
    lines.push(`- **CTA:** ${ad.cta}`);
    lines.push(`- **Landing URL:** ${ad.landingUrl}`);
    lines.push(`- **Compliant:** ${compliance.compliant ? 'Yes' : 'No'}`);
    if (compliance.errors.length > 0) {
      lines.push(`- **Errors:** ${compliance.errors.join('; ')}`);
    }
    if (compliance.warnings.length > 0) {
      lines.push(`- **Warnings:** ${compliance.warnings.join('; ')}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
