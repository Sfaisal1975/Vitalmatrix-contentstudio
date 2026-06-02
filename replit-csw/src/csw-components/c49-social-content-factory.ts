/**
 * Component 49: Social Content Factory
 *
 * Generates platform-specific social media content from clinical insights.
 * Transforms a single content seed (topic + evidence tier + clinical insight)
 * into optimised posts for LinkedIn, Facebook, Instagram, and X. Includes
 * zone-specific hashtag sets, carousel slide generation, X thread creation,
 * and LinkedIn long-form article generation.
 *
 * All content is practitioner-facing (B2B). Never patient-facing.
 * K7/K8/K10 compliance enforced on all outputs.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** Supported social media platforms */
export type SocialPlatform = 'linkedin' | 'facebook' | 'instagram' | 'x';

/** A clinical insight seed for content generation */
export interface ContentSeed {
  topic: string;
  nodeRelevance: string[];
  zoneRelevance: string[];
  evidenceTier: EvidenceTier;
  clinicalInsight: string;
}

/** Multi-platform content pack generated from a single seed */
export interface SocialContentPack {
  linkedin: string;
  facebook: string;
  instagram: string;
  x: string;
  hashtags: Record<SocialPlatform, string[]>;
}

/** A single slide in an Instagram carousel */
export interface CarouselSlide {
  slideNumber: number;
  title: string;
  body: string;
}

/** A single post in an X thread */
export interface ThreadPost {
  position: number;
  content: string;
  charCount: number;
}

/** Daily content plan entry */
export interface DailyContentPlan {
  day: number;
  date: string;
  platform: SocialPlatform;
  topic: string;
  content: string;
  hashtags: string[];
  evidenceTier: EvidenceTier;
}

// --- Hashtag Sets ---

/** General VitalMatrix hashtags applicable to all content */
const GENERAL_HASHTAGS: string[] = [
  '#VitalMatrix',
  '#FunctionalMedicine',
  '#ClinicalIntelligence',
  '#TerrainMedicine',
  '#PractitionerTools',
];

/** Zone-specific hashtag sets */
const ZONE_HASHTAGS: Record<string, string[]> = {
  Z1: ['#MetabolicHealth', '#ThyroidFunction', '#EnergyMedicine'],
  Z2: ['#GutHealth', '#ImmuneFunction', '#Microbiome'],
  Z3: ['#CardiovascularHealth', '#HeartBrain'],
  Z4: ['#Detoxification', '#LiverHealth'],
  Z5: ['#HormonalHealth', '#Hormones', '#Endocrine'],
};

/** Node-specific hashtag supplements */
const NODE_HASHTAGS: Record<string, string[]> = {
  N1: ['#Metabolism', '#BioenergySystems'],
  N2: ['#GutMicrobiome', '#DigestiveHealth'],
  N3: ['#Neuroinflammation', '#BrainHealth'],
  N4: ['#ImmuneRegulation', '#Autoimmunity'],
  N5: ['#MusculoskeletalHealth', '#MovementMedicine'],
  N6: ['#Endocrinology', '#HormoneBalance'],
  N7: ['#ToxicantBurden', '#EnvironmentalHealth'],
};

/** Platform-specific maximum hashtag counts */
const PLATFORM_HASHTAG_LIMITS: Record<SocialPlatform, number> = {
  linkedin: 10,
  facebook: 10,
  instagram: 30,
  x: 3,
};

// --- Compliance ---

/** Kill-list and compliance patterns */
const COMPLIANCE_PATTERNS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /Mark\s+Hyman/gi, replacement: '[removed -- K10]' },
  { pattern: /LaValle/gi, replacement: '[removed -- K10]' },
  { pattern: /Metabolic\s+Code/gi, replacement: '[removed -- K10]' },
  { pattern: /FMAARM/gi, replacement: 'FAAMFM' },
  { pattern: /\u2014/g, replacement: ' -- ' },
  { pattern: /clinical\s+AI\s+platform/gi, replacement: VM_BRAND.platform.descriptor },
  { pattern: /\bdiagnos(e|is|tic)\b/gi, replacement: 'clinical assessment' },
  { pattern: /\bpatients?\b/gi, replacement: 'practitioners' },
];

/**
 * Sanitise text against K7/K8/K10 compliance rules and
 * practitioner-facing language requirements.
 */
function sanitise(text: string): string {
  let result = text;
  for (const { pattern, replacement } of COMPLIANCE_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Validate content passes all compliance checks.
 * Returns true if clean, false if any violations found.
 */
function validateCompliance(text: string): boolean {
  const checkPatterns = [
    /Mark\s+Hyman/i,
    /LaValle/i,
    /Metabolic\s+Code/i,
    /FMAARM/i,
    /\u2014/,
    /clinical\s+AI\s+platform/i,
  ];
  return !checkPatterns.some((p) => p.test(text));
}

// --- Core Functions ---

/**
 * Generate a complete social content pack from a clinical insight seed.
 * Produces optimised content for all four platforms with appropriate
 * hashtags, formatting, and evidence tier attribution.
 *
 * @param seed - Clinical insight content seed
 * @returns SocialContentPack with content for all platforms
 */
export function generateFromInsight(seed: ContentSeed): SocialContentPack {
  const tier = seed.evidenceTier;
  const tierLabel = `[Evidence: ${tier}]`;
  const zones = seed.zoneRelevance.join(', ');
  const creds = VM_BRAND.credentials;
  const descriptor = VM_BRAND.platform.descriptor;

  // LinkedIn: professional long-form (up to 3000 chars)
  const linkedin = sanitise([
    `${seed.topic}`,
    '',
    seed.clinicalInsight,
    '',
    `This insight maps across ${zones} in the VitalMatrix ${descriptor}. ${tierLabel}`,
    '',
    `Terrain medicine is about seeing connections -- not isolated data points. When practitioners can visualise how ${seed.nodeRelevance.join(', ')} interact, clinical reasoning deepens.`,
    '',
    `VitalMatrix was built to make these connections visible and evidence-graded. For practitioners who want to move beyond siloed thinking.`,
    '',
    tierLabel,
    `${VM_BRAND.regulatoryFooter}`,
  ].join('\n'));

  // Facebook: conversational, slightly shorter
  const facebook = sanitise([
    `${seed.topic}`,
    '',
    seed.clinicalInsight,
    '',
    `Relevant zones: ${zones}`,
    `Evidence tier: ${tier}`,
    '',
    `VitalMatrix helps practitioners map these clinical connections across 7 nodes and 5 zones. Built for practitioners, by a practitioner.`,
    '',
    `Learn more: ${VM_BRAND.platform.domain}`,
    '',
    VM_BRAND.regulatoryFooter,
  ].join('\n'));

  // Instagram: concise, visual-first (max 2200 chars)
  const instagram = sanitise([
    `${seed.topic}`,
    '',
    seed.clinicalInsight.length > 500
      ? seed.clinicalInsight.slice(0, 497) + '...'
      : seed.clinicalInsight,
    '',
    `${tierLabel}`,
    `Zones: ${zones}`,
    '',
    `VitalMatrix -- ${descriptor} for practitioners.`,
    '',
    'Link in bio for more.',
    '',
    VM_BRAND.regulatoryFooter,
  ].join('\n'));

  // X: 280 chars max, punchy
  const xContent = sanitise(
    `${seed.topic}: ${seed.clinicalInsight.slice(0, 150)}... [${tier}] ${VM_BRAND.platform.domain}`,
  );
  const x = xContent.length > 280 ? xContent.slice(0, 277) + '...' : xContent;

  // Generate platform-specific hashtags
  const hashtags = {
    linkedin: generateHashtags('linkedin', seed.zoneRelevance, seed.nodeRelevance),
    facebook: generateHashtags('facebook', seed.zoneRelevance, seed.nodeRelevance),
    instagram: generateHashtags('instagram', seed.zoneRelevance, seed.nodeRelevance),
    x: generateHashtags('x', seed.zoneRelevance, seed.nodeRelevance),
  };

  return { linkedin, facebook, instagram, x, hashtags };
}

/**
 * Generate a 7-day content plan across platforms from an array of seeds.
 *
 * @param seeds - Array of content seeds (at least 7 recommended)
 * @returns Array of DailyContentPlan entries for 7 days
 */
export function generateWeeklyContentPlan(seeds: ContentSeed[]): DailyContentPlan[] {
  const platforms: SocialPlatform[] = ['linkedin', 'facebook', 'instagram', 'x'];
  const plan: DailyContentPlan[] = [];
  const today = new Date();

  for (let day = 0; day < 7; day++) {
    const seedIndex = day % seeds.length;
    const seed = seeds[seedIndex];
    const platform = platforms[day % platforms.length];
    const pack = generateFromInsight(seed);

    const postDate = new Date(today);
    postDate.setDate(today.getDate() + day);

    plan.push({
      day: day + 1,
      date: postDate.toISOString().split('T')[0],
      platform,
      topic: seed.topic,
      content: pack[platform],
      hashtags: pack.hashtags[platform],
      evidenceTier: seed.evidenceTier,
    });
  }

  return plan;
}

/**
 * Generate platform-optimised hashtags based on zones and nodes.
 * Combines general, zone-specific, and node-specific hashtags,
 * limited to the platform's recommended count.
 *
 * @param platform - Target social platform
 * @param zones - Relevant zone identifiers (e.g., ['Z1', 'Z3'])
 * @param nodes - Relevant node identifiers (e.g., ['N1', 'N4'])
 * @returns Array of hashtag strings
 */
export function generateHashtags(
  platform: SocialPlatform,
  zones: string[],
  nodes: string[],
): string[] {
  const limit = PLATFORM_HASHTAG_LIMITS[platform];
  const tags: string[] = [...GENERAL_HASHTAGS];

  // Add zone-specific hashtags
  for (const zone of zones) {
    const zoneTags = ZONE_HASHTAGS[zone];
    if (zoneTags) {
      tags.push(...zoneTags);
    }
  }

  // Add node-specific hashtags
  for (const node of nodes) {
    const nodeTags = NODE_HASHTAGS[node];
    if (nodeTags) {
      tags.push(...nodeTags);
    }
  }

  // Deduplicate and limit
  const unique = [...new Set(tags)];
  return unique.slice(0, limit);
}

/**
 * Generate Instagram carousel slide text from a topic and key points.
 *
 * @param topic - Carousel topic / title
 * @param points - Array of key points (one per slide)
 * @returns Array of CarouselSlide objects
 */
export function generateCarouselSlides(topic: string, points: string[]): CarouselSlide[] {
  const slides: CarouselSlide[] = [];

  // Title slide
  slides.push({
    slideNumber: 1,
    title: sanitise(topic),
    body: `A ${VM_BRAND.platform.descriptor} perspective.\nSwipe to learn more.`,
  });

  // Content slides
  for (let i = 0; i < points.length; i++) {
    slides.push({
      slideNumber: i + 2,
      title: `Point ${i + 1}`,
      body: sanitise(points[i]),
    });
  }

  // Closing slide
  slides.push({
    slideNumber: points.length + 2,
    title: 'VitalMatrix',
    body: [
      `${VM_BRAND.platform.descriptor}`,
      `Built for practitioners.`,
      '',
      `${VM_BRAND.platform.domain}`,
      '',
      VM_BRAND.regulatoryFooter,
    ].join('\n'),
  });

  return slides;
}

/**
 * Generate an X (Twitter) thread from a blog post.
 * Splits the blog into 5-8 concise thread posts within the 280-char limit.
 *
 * @param blogTitle - Title of the source blog post
 * @param blogBody - Full text of the blog post
 * @returns Array of ThreadPost objects
 */
export function generateThreadFromBlog(blogTitle: string, blogBody: string): ThreadPost[] {
  const thread: ThreadPost[] = [];
  const domain = VM_BRAND.platform.domain;

  // Thread opener
  const opener = sanitise(`${blogTitle}\n\nA thread on what this means for practitioners. [1/]`);
  thread.push({
    position: 1,
    content: opener.slice(0, 280),
    charCount: Math.min(opener.length, 280),
  });

  // Split body into sentences and group into thread-sized chunks
  const sentences = blogBody
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0)
    .map((s) => sanitise(s.trim()));

  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const candidate = currentChunk ? `${currentChunk} ${sentence}` : sentence;
    if (candidate.length > 250) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = sentence.length > 250 ? sentence.slice(0, 250) : sentence;
    } else {
      currentChunk = candidate;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  // Take 4-6 middle posts
  const middleChunks = chunks.slice(0, 6);
  for (let i = 0; i < middleChunks.length; i++) {
    const position = i + 2;
    const postContent = `${middleChunks[i]} [${position}/]`;
    thread.push({
      position,
      content: postContent.slice(0, 280),
      charCount: Math.min(postContent.length, 280),
    });
  }

  // Closing post
  const totalPosts = middleChunks.length + 2;
  const closer = sanitise(
    `VitalMatrix maps these connections across 7 nodes and 5 zones. For practitioners who want evidence-graded clinical intelligence.\n\n${domain} [${totalPosts}/${totalPosts}]`,
  );
  thread.push({
    position: totalPosts,
    content: closer.slice(0, 280),
    charCount: Math.min(closer.length, 280),
  });

  // Update thread numbering with totals
  for (const post of thread) {
    post.content = post.content.replace(
      /\[(\d+)\/\]/,
      `[$1/${totalPosts}]`,
    );
    post.charCount = post.content.length;
  }

  return thread;
}

/**
 * Generate a long-form LinkedIn article from a topic and body text.
 * Adds professional framing, evidence tier attribution, credentials,
 * and regulatory footer.
 *
 * @param topic - Article title
 * @param body - Article body text
 * @returns Formatted LinkedIn article string
 */
export function generateLinkedInArticle(topic: string, body: string): string {
  const creds = VM_BRAND.credentials;
  const descriptor = VM_BRAND.platform.descriptor;

  const article = sanitise([
    `# ${topic}`,
    '',
    `*By ${creds.name}, ${creds.qualifications} -- ${creds.title}, ${creds.company}*`,
    '',
    body,
    '',
    '---',
    '',
    `**About VitalMatrix**`,
    '',
    `VitalMatrix is a ${descriptor} built for functional medicine practitioners. It maps terrain-level clinical connections across 7 nodes and 5 zones, with evidence-tiered insights graded as Established, Emerging, Theoretical, Observed in Practice, or Contested.`,
    '',
    `The founding cohort is limited to 10 practitioners at GBP ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.`,
    '',
    `Learn more: ${VM_BRAND.platform.domain}`,
    '',
    '---',
    VM_BRAND.regulatoryFooter,
  ].join('\n'));

  // Final compliance validation
  if (!validateCompliance(article)) {
    // Should not happen after sanitise, but defence in depth
    return sanitise(article);
  }

  return article;
}
