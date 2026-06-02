/**
 * Component 51: Facebook Page Manager
 *
 * Facebook page content management for VitalMatrix.
 * Generates posts, events, polls, link shares, weekly plans,
 * and page insights reports. All content is B2B practitioner-facing
 * with regulatory footers on clinical material.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** Supported Facebook post formats */
export type FacebookPostType = 'text' | 'image' | 'video' | 'link' | 'event' | 'poll';

/** Engagement metrics for a Facebook post */
export interface FacebookEngagement {
  reactions: number;
  comments: number;
  shares: number;
  reach: number;
}

/** A single Facebook post */
export interface FacebookPost {
  id: string;
  type: FacebookPostType;
  content: string;
  mediaUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  scheduledDate?: string;
  published: boolean;
  engagement: FacebookEngagement;
}

/** Facebook page overview */
export interface FacebookPage {
  name: 'VitalMatrix';
  posts: FacebookPost[];
  followers: number;
  weeklyReach: number;
}

/** Options for post creation */
export interface FacebookPostOptions {
  mediaUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  scheduledDate?: string;
  evidenceTier?: EvidenceTier;
}

// --- Constants ---

/** Facebook character limit for posts */
const FB_CHAR_LIMIT = 63206;

/** Days of the week mapped to weekly plan themes */
const WEEKLY_THEMES: Record<string, string> = {
  Monday: 'clinical-insight',
  Tuesday: 'behind-the-scenes',
  Wednesday: 'practitioner-spotlight',
  Thursday: 'zone-explainer',
  Friday: 'founding-cohort-cta',
};

/** Zone labels for explainer posts */
const ZONE_LABELS: Record<string, { name: string; description: string }> = {
  Z1: { name: 'Terrain Foundation', description: 'Baseline biochemistry and foundational markers that underpin system stability.' },
  Z2: { name: 'Functional Load', description: 'Metabolic burden, detoxification capacity, and cumulative physiological stress.' },
  Z3: { name: 'Regulatory Coherence', description: 'Neuro-immune-endocrine axis balance and inter-system communication fidelity.' },
  Z4: { name: 'Adaptive Capacity', description: 'Resilience reserves, recovery dynamics, and allostatic flexibility.' },
  Z5: { name: 'Expression and Output', description: 'Phenotypic manifestation, symptom clustering, and clinical presentation patterns.' },
};

/** Node labels for clinical insight posts */
const NODE_LABELS: string[] = [
  'N1: Metabolic and Endocrine',
  'N2: Immune and Inflammatory',
  'N3: Neurological and Cognitive',
  'N4: Cardiovascular and Circulatory',
  'N5: Gastrointestinal and Hepatic',
  'N6: Musculoskeletal and Structural',
  'N7: Psycho-Emotional and Behavioural',
];

// --- Helpers ---

/**
 * Generates a unique post identifier.
 *
 * @returns A string identifier prefixed with fb-
 */
function generateId(): string {
  return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Appends the regulatory footer to content that contains clinical claims.
 *
 * @param content - The post body
 * @param evidenceTier - Optional evidence tier for the claim
 * @returns Content with regulatory footer appended
 */
function appendRegulatoryFooter(content: string, evidenceTier?: EvidenceTier): string {
  let footer = '';
  if (evidenceTier) {
    footer += `\n\nEvidence tier: ${evidenceTier}.`;
  }
  footer += `\n\n${VM_BRAND.regulatoryFooter}`;
  return content + footer;
}

/**
 * Validates that content does not exceed the Facebook character limit.
 *
 * @param content - The text to validate
 * @throws Error if content exceeds 63,206 characters
 */
function validateCharLimit(content: string): void {
  if (content.length > FB_CHAR_LIMIT) {
    throw new Error(
      `Facebook post exceeds ${FB_CHAR_LIMIT} character limit. Current length: ${content.length}.`
    );
  }
}

/**
 * Checks content for clinical claims that lack an evidence tier.
 * Clinical keywords trigger a requirement for an evidence tier.
 *
 * @param content - The post content
 * @param evidenceTier - The supplied evidence tier, if any
 * @throws Error if clinical language is detected without an evidence tier
 */
function validateClinicalClaims(content: string, evidenceTier?: EvidenceTier): void {
  const clinicalKeywords = [
    'biomarker', 'cortisol', 'inflammatory', 'metabolic', 'endocrine',
    'neurotransmitter', 'detoxification', 'allostatic', 'biochemistry',
    'cascade', 'terrain', 'phenotypic', 'neuro-immune', 'pathophysiology',
    'oxidative stress', 'mitochondrial', 'gut permeability', 'HPA axis',
  ];
  const lower = content.toLowerCase();
  const hasClinical = clinicalKeywords.some((kw) => lower.includes(kw.toLowerCase()));
  if (hasClinical && !evidenceTier) {
    throw new Error(
      'Clinical claim detected without an evidence tier. Provide an EvidenceTier for regulatory compliance.'
    );
  }
}

// --- Core Functions ---

/**
 * Creates a Facebook post with validation.
 *
 * Validates the 63,206 character limit and ensures clinical claims
 * include an evidence tier. Appends the regulatory footer when an
 * evidence tier is provided.
 *
 * @param type - The post format
 * @param content - The post body text
 * @param options - Optional media, link, scheduling, and evidence tier
 * @returns A fully formed FacebookPost object
 */
export function createFacebookPost(
  type: FacebookPostType,
  content: string,
  options?: FacebookPostOptions
): FacebookPost {
  validateClinicalClaims(content, options?.evidenceTier);

  let finalContent = content;
  if (options?.evidenceTier) {
    finalContent = appendRegulatoryFooter(content, options.evidenceTier);
  }

  validateCharLimit(finalContent);

  return {
    id: generateId(),
    type,
    content: finalContent,
    mediaUrl: options?.mediaUrl,
    linkUrl: options?.linkUrl,
    linkTitle: options?.linkTitle,
    scheduledDate: options?.scheduledDate,
    published: false,
    engagement: { reactions: 0, comments: 0, shares: 0, reach: 0 },
  };
}

/**
 * Generates a weekly Facebook content plan with 5 posts.
 *
 * Schedule:
 * - Monday: Clinical insight (with evidence tier)
 * - Tuesday: Behind the scenes
 * - Wednesday: Practitioner spotlight placeholder
 * - Thursday: Zone explainer (with evidence tier)
 * - Friday: Founding cohort CTA
 *
 * @returns An array of 5 FacebookPost objects, one per weekday
 */
export function generateWeeklyFacebookPlan(): FacebookPost[] {
  const posts: FacebookPost[] = [];

  // Monday -- Clinical insight
  const mondayNode = NODE_LABELS[Math.floor(Math.random() * NODE_LABELS.length)];
  posts.push(
    createFacebookPost('text', [
      `Clinical Intelligence Spotlight: ${mondayNode}`,
      '',
      `Understanding the ${mondayNode.split(': ')[1]} node is foundational to terrain-aware practice. ` +
      `VitalMatrix maps connections across all 7 nodes, revealing cascade patterns that single-system analysis misses.`,
      '',
      `How does your current workflow handle cross-node correlations?`,
    ].join('\n'), {
      evidenceTier: 'Established',
      scheduledDate: 'Monday',
    })
  );

  // Tuesday -- Behind the scenes
  posts.push(
    createFacebookPost('image', [
      'Behind the Scenes at VitalMatrix',
      '',
      'Our team is refining the cascade detection algorithms this week. ' +
      'Every element in VitalMatrix has been audited against peer-reviewed literature ' +
      'to ensure clinical rigour meets practical utility.',
      '',
      `Built by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications} ` +
      `-- a practitioner building tools for practitioners.`,
    ].join('\n'), {
      scheduledDate: 'Tuesday',
    })
  );

  // Wednesday -- Practitioner spotlight placeholder
  posts.push(
    createFacebookPost('text', [
      'Practitioner Spotlight',
      '',
      '[Placeholder: Feature a founding cohort practitioner here. ' +
      'Include their specialty, how they use terrain-based analysis, ' +
      'and a brief quote about their experience with VitalMatrix.]',
      '',
      'Interested in being featured? Join the founding cohort and share your story.',
    ].join('\n'), {
      scheduledDate: 'Wednesday',
    })
  );

  // Thursday -- Zone explainer
  const zoneKeys = Object.keys(ZONE_LABELS);
  const zoneKey = zoneKeys[Math.floor(Math.random() * zoneKeys.length)];
  const zone = ZONE_LABELS[zoneKey];
  posts.push(
    createFacebookPost('image', [
      `Zone Explainer: ${zoneKey} -- ${zone.name}`,
      '',
      zone.description,
      '',
      'VitalMatrix organises clinical intelligence across 5 zones and 7 nodes, ' +
      'giving practitioners a structured framework for terrain-level analysis.',
      '',
      `Learn more at ${VM_BRAND.platform.domain}`,
    ].join('\n'), {
      evidenceTier: 'Established',
      scheduledDate: 'Thursday',
    })
  );

  // Friday -- Founding cohort CTA
  posts.push(
    createFacebookPost('text', [
      `Founding Cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month -- Fixed for ${VM_BRAND.pricing.foundingFixedMonths} Months`,
      '',
      `VitalMatrix is opening to a limited founding cohort of practitioners who want ` +
      `terrain-level clinical intelligence from day one.`,
      '',
      `Standard rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month.`,
      `Founding rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.`,
      '',
      `Secure your place: ${VM_BRAND.platform.domain}`,
    ].join('\n'), {
      scheduledDate: 'Friday',
    })
  );

  return posts;
}

/**
 * Generates a Facebook event post for webinars or Q&A sessions.
 *
 * @param title - Event title
 * @param date - Event date and time string
 * @param description - Event description
 * @returns A FacebookPost of type 'event'
 */
export function generateFacebookEvent(
  title: string,
  date: string,
  description: string
): FacebookPost {
  const content = [
    `Event: ${title}`,
    `Date: ${date}`,
    '',
    description,
    '',
    `Hosted by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
    `${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    '',
    `Register at ${VM_BRAND.platform.domain}`,
    '',
    VM_BRAND.regulatoryFooter,
  ].join('\n');

  return createFacebookPost('event', content);
}

/**
 * Generates a Facebook poll for practitioner engagement.
 *
 * @param question - The poll question (functional medicine relevant)
 * @param options - Array of poll answer options
 * @returns A FacebookPost of type 'poll'
 */
export function generatePoll(question: string, options: string[]): FacebookPost {
  if (options.length < 2 || options.length > 4) {
    throw new Error('Facebook polls require between 2 and 4 options.');
  }

  const content = [
    `Poll: ${question}`,
    '',
    ...options.map((opt, i) => `${i + 1}. ${opt}`),
    '',
    'We would love to hear from practitioners in the functional medicine space.',
    '',
    `VitalMatrix -- ${VM_BRAND.platform.descriptor}`,
  ].join('\n');

  return createFacebookPost('poll', content);
}

/**
 * Generates a link share post with VitalMatrix branding.
 *
 * @param url - The URL to share
 * @param title - The link title
 * @param description - A brief description of the linked content
 * @returns A FacebookPost of type 'link'
 */
export function generateLinkPost(
  url: string,
  title: string,
  description: string
): FacebookPost {
  const content = [
    title,
    '',
    description,
    '',
    `Read more: ${url}`,
    '',
    `Shared by VitalMatrix -- ${VM_BRAND.platform.descriptor}`,
    `${VM_BRAND.platform.domain}`,
  ].join('\n');

  return createFacebookPost('link', content, { linkUrl: url, linkTitle: title });
}

/**
 * Generates a markdown page insights report for a Facebook page.
 *
 * Includes total reach, engagement rate, follower count, and
 * a ranked list of best-performing posts by total engagement.
 *
 * @param page - The FacebookPage data to report on
 * @returns A markdown-formatted insights report string
 */
export function generatePageInsightsReport(page: FacebookPage): string {
  const totalEngagement = page.posts.reduce(
    (sum, p) => sum + p.engagement.reactions + p.engagement.comments + p.engagement.shares,
    0
  );
  const totalReach = page.posts.reduce((sum, p) => sum + p.engagement.reach, 0);
  const engagementRate = totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(2) : '0.00';

  const sortedPosts = [...page.posts]
    .sort((a, b) => {
      const aTotal = a.engagement.reactions + a.engagement.comments + a.engagement.shares;
      const bTotal = b.engagement.reactions + b.engagement.comments + b.engagement.shares;
      return bTotal - aTotal;
    })
    .slice(0, 5);

  const postRows = sortedPosts.map((p, i) => {
    const total = p.engagement.reactions + p.engagement.comments + p.engagement.shares;
    const preview = p.content.slice(0, 60).replace(/\n/g, ' ');
    return `| ${i + 1} | ${preview}... | ${p.type} | ${total.toLocaleString()} | ${p.engagement.reach.toLocaleString()} |`;
  });

  return [
    `# ${page.name} -- Facebook Page Insights`,
    '',
    `**Report generated:** ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Overview',
    '',
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Followers | ${page.followers.toLocaleString()} |`,
    `| Weekly reach | ${page.weeklyReach.toLocaleString()} |`,
    `| Total posts | ${page.posts.length} |`,
    `| Published posts | ${page.posts.filter((p) => p.published).length} |`,
    `| Total reach (all posts) | ${totalReach.toLocaleString()} |`,
    `| Total engagement | ${totalEngagement.toLocaleString()} |`,
    `| Engagement rate | ${engagementRate}% |`,
    '',
    '## Best Performing Posts',
    '',
    '| Rank | Preview | Type | Engagement | Reach |',
    '| --- | --- | --- | --- | --- |',
    ...postRows,
    '',
    '---',
    '',
    VM_BRAND.regulatoryFooter,
    '',
    VM_BRAND.tmFooter,
  ].join('\n');
}
