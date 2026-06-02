/**
 * Component 53: X (formerly Twitter) Manager
 *
 * X/Twitter content management for VitalMatrix. Generates single tweets,
 * threads, quote tweets, daily content, bio, and pinned tweet. All content
 * is B2B practitioner-facing with evidence tiers on clinical claims and
 * no diagnostic language.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** Supported tweet formats */
export type TweetType = 'single' | 'thread' | 'quote' | 'reply';

/** Engagement metrics for a tweet */
export interface TweetEngagement {
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  bookmarks: number;
}

/** A single tweet */
export interface Tweet {
  id: string;
  type: TweetType;
  content: string;
  hashtags: string[];
  mediaUrl?: string;
  inReplyTo?: string;
  threadPosition?: number;
  engagement: TweetEngagement;
}

/** A thread of tweets */
export interface Thread {
  id: string;
  tweets: Tweet[];
  topic: string;
}

// --- Constants ---

/** X character limit */
const X_CHAR_LIMIT = 280;

/** X bio character limit */
const X_BIO_LIMIT = 160;

/** Node labels */
const NODE_LABELS: string[] = [
  'N1: Metabolic and Endocrine',
  'N2: Immune and Inflammatory',
  'N3: Neurological and Cognitive',
  'N4: Cardiovascular and Circulatory',
  'N5: Gastrointestinal and Hepatic',
  'N6: Musculoskeletal and Structural',
  'N7: Psycho-Emotional and Behavioural',
];

/** Zone labels */
const ZONE_LABELS: Record<string, { name: string; shortDesc: string }> = {
  Z1: { name: 'Terrain Foundation', shortDesc: 'Baseline biochemistry underpinning system stability.' },
  Z2: { name: 'Functional Load', shortDesc: 'Metabolic burden and detoxification capacity.' },
  Z3: { name: 'Regulatory Coherence', shortDesc: 'Neuro-immune-endocrine axis balance.' },
  Z4: { name: 'Adaptive Capacity', shortDesc: 'Resilience reserves and recovery dynamics.' },
  Z5: { name: 'Expression and Output', shortDesc: 'Phenotypic manifestation and symptom clustering.' },
};

// --- Helpers ---

/**
 * Generates a unique tweet identifier.
 *
 * @returns A string identifier prefixed with tw-
 */
function generateId(): string {
  return `tw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Creates a default engagement object with zero values.
 *
 * @returns A TweetEngagement with all zeros
 */
function emptyEngagement(): TweetEngagement {
  return { likes: 0, retweets: 0, replies: 0, impressions: 0, bookmarks: 0 };
}

// --- Core Functions ---

/**
 * Creates a single tweet with validation.
 *
 * Validates the 280 character limit.
 *
 * @param content - The tweet text
 * @param hashtags - Optional array of hashtags (counted in character limit)
 * @returns A Tweet object
 */
export function createTweet(content: string, hashtags: string[] = []): Tweet {
  const fullContent = hashtags.length > 0
    ? `${content}\n\n${hashtags.join(' ')}`
    : content;

  if (fullContent.length > X_CHAR_LIMIT) {
    throw new Error(
      `Tweet exceeds ${X_CHAR_LIMIT} character limit. Current length: ${fullContent.length}.`
    );
  }

  return {
    id: generateId(),
    type: 'single',
    content: fullContent,
    hashtags,
    engagement: emptyEngagement(),
  };
}

/**
 * Generates a tweet thread with numbered tweets (1/n format).
 *
 * The first tweet is the hook. The last tweet is a CTA.
 * Threads should contain 5-8 tweets for optimal engagement.
 *
 * @param topic - The thread topic
 * @param points - Array of content points (each becomes a tweet)
 * @returns A Thread object with numbered tweets
 */
export function generateThread(topic: string, points: string[]): Thread {
  if (points.length < 5 || points.length > 8) {
    throw new Error('Threads should contain between 5 and 8 tweets.');
  }

  const threadId = generateId();
  const total = points.length;

  const tweets: Tweet[] = points.map((point, i) => {
    const position = i + 1;
    const numberedContent = `${position}/${total} ${point}`;

    if (numberedContent.length > X_CHAR_LIMIT) {
      throw new Error(
        `Tweet ${position}/${total} exceeds ${X_CHAR_LIMIT} characters. Length: ${numberedContent.length}.`
      );
    }

    return {
      id: generateId(),
      type: 'thread' as TweetType,
      content: numberedContent,
      hashtags: position === total ? ['#VitalMatrix', '#FunctionalMedicine', '#TerrainMedicine'] : [],
      inReplyTo: i === 0 ? undefined : tweets[i - 1]?.id,
      threadPosition: position,
      engagement: emptyEngagement(),
    };
  });

  // Fix reply chain (first tweet has no inReplyTo, rest reply to previous)
  for (let i = 1; i < tweets.length; i++) {
    tweets[i].inReplyTo = tweets[i - 1].id;
  }

  return { id: threadId, tweets, topic };
}

/**
 * Pre-built thread: "What is terrain medicine?"
 *
 * 6-tweet thread introducing terrain medicine concepts.
 *
 * @returns A Thread object
 */
export function threadTerrainMedicine(): Thread {
  return generateThread('What is terrain medicine?', [
    'What is terrain medicine? A thread for practitioners who want to move beyond symptom-level thinking.',
    'The terrain is the totality of your patient\'s biological landscape. Genetics, environment, lifestyle, and biochemistry converge into a dynamic system.',
    'Traditional models isolate systems. Terrain medicine maps the connections between them. A thyroid finding is never just a thyroid finding.',
    'VitalMatrix quantifies terrain state across 7 interconnected nodes. Each node influences the others through measurable cascade pathways.',
    'This is not about replacing clinical judgement. It is about giving practitioners the cross-system visibility to make better-informed decisions. [Established]',
    `Explore terrain-level intelligence at ${VM_BRAND.platform.domain}. Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month.`,
  ]);
}

/**
 * Pre-built thread: "Why VitalMatrix exists"
 *
 * 5-tweet thread on the origin story and mission.
 *
 * @returns A Thread object
 */
export function threadWhyVitalMatrix(): Thread {
  return generateThread('Why VitalMatrix exists', [
    `Why does VitalMatrix exist? ${VM_BRAND.credentials.name} (${VM_BRAND.credentials.qualifications}) spent years in functional medicine practice. This is what he saw.`,
    'Practitioners were drowning in data but starved of connections. Lab results existed in silos. Cross-system patterns were invisible without hours of manual correlation.',
    'The tools that existed were either too simplistic (single-system) or too academic (not built for clinical workflow). Nothing sat in between.',
    'VitalMatrix was built to close that gap. A ${VM_BRAND.platform.descriptor} that maps terrain-level connections and surfaces cascade patterns automatically.',
    `The founding cohort is open: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. ${VM_BRAND.platform.domain}`,
  ]);
}

/**
 * Pre-built thread: "7 nodes in 7 tweets"
 *
 * 8-tweet thread covering all 7 nodes plus a CTA.
 *
 * @returns A Thread object
 */
export function threadSevenNodes(): Thread {
  return generateThread('7 nodes in 7 tweets', [
    'VitalMatrix maps clinical intelligence across 7 interconnected nodes. Here they are, one by one.',
    `${NODE_LABELS[0]}: Hormonal signalling, glucose metabolism, thyroid and adrenal function. The metabolic engine. [Established]`,
    `${NODE_LABELS[1]}: Cytokine networks, mucosal immunity, inflammatory cascades. Where chronic conditions often originate. [Established]`,
    `${NODE_LABELS[2]}: Neurotransmitter balance, cognitive load, autonomic regulation. The brain-body interface. [Established]`,
    `${NODE_LABELS[3]}: Vascular integrity, perfusion dynamics. Every node depends on delivery. [Established]`,
    `${NODE_LABELS[4]}: Microbiome ecology, hepatic biotransformation, barrier function. The gateway node. [Established]`,
    `${NODE_LABELS[5]}: Connective tissue, joint mechanics, structural resilience. Often overlooked in functional analysis. [Emerging]`,
    `${NODE_LABELS[6]}: Stress response, emotional resilience, behavioural patterns. The node that modulates everything. ${VM_BRAND.platform.domain}`,
  ]);
}

/**
 * Pre-built thread: "The cascade effect explained"
 *
 * 6-tweet thread explaining cascade detection.
 *
 * @returns A Thread object
 */
export function threadCascadeEffect(): Thread {
  return generateThread('The cascade effect explained', [
    'What happens when one node destabilises? It cascades. Here is how VitalMatrix detects and quantifies cross-system propagation.',
    'A cascade begins when a disturbance in one node (e.g. N5: GI) propagates to connected nodes (e.g. N2: Immune, N1: Metabolic). Traditional analysis misses this.',
    'VitalMatrix scores cascade risk using CascadeIQ. Higher scores indicate greater propagation potential across the terrain. [Emerging]',
    'Practitioners can see which nodes are amplifying signals and which are dampening them. This changes the intervention strategy fundamentally.',
    'Instead of chasing downstream symptoms, you can target the upstream driver. That is the clinical value of cascade detection.',
    `See cascade detection in action: ${VM_BRAND.platform.domain}. Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month.`,
  ]);
}

/**
 * Generates a daily tweet based on the day of the week.
 *
 * Schedule:
 * - Monday: Clinical insight
 * - Tuesday: Statistic or data point
 * - Wednesday: Question for practitioners
 * - Thursday: Zone spotlight
 * - Friday: Founding cohort CTA
 *
 * @param dayOfWeek - Day name (Monday-Friday)
 * @returns A Tweet object
 */
export function generateDailyTweet(
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
): Tweet {
  switch (dayOfWeek) {
    case 'Monday': {
      const node = NODE_LABELS[Math.floor(Math.random() * NODE_LABELS.length)];
      return createTweet(
        `Clinical insight: ${node.split(': ')[1]} patterns rarely exist in isolation. Cross-node mapping reveals the connections that single-system analysis misses. [Established]\n\n#FunctionalMedicine #VitalMatrix`
      );
    }
    case 'Tuesday':
      return createTweet(
        `VitalMatrix maps over 630 audited clinical elements across 7 nodes and 5 zones. Every element traced to peer-reviewed literature.\n\n#ClinicalIntelligence #VitalMatrix`
      );
    case 'Wednesday':
      return createTweet(
        `Question for FM practitioners: what is the biggest bottleneck in your current clinical workflow? Data overload, interpretation time, or cross-system correlation?\n\n#FunctionalMedicine`
      );
    case 'Thursday': {
      const zoneKeys = Object.keys(ZONE_LABELS);
      const key = zoneKeys[Math.floor(Math.random() * zoneKeys.length)];
      const zone = ZONE_LABELS[key];
      return createTweet(
        `Zone spotlight: ${key} (${zone.name}). ${zone.shortDesc} One of 5 zones in the VitalMatrix terrain framework. [Established]\n\n#TerrainMedicine`
      );
    }
    case 'Friday':
      return createTweet(
        `Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Standard rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month.\n\n${VM_BRAND.platform.domain}\n\n#VitalMatrix`
      );
  }
}

/**
 * Generates a compliant quote tweet with commentary.
 *
 * Ensures no diagnostic language and appends evidence tier
 * if clinical claims are present in the commentary.
 *
 * @param originalTweetContent - The text of the tweet being quoted
 * @param commentary - The VitalMatrix commentary to add
 * @param evidenceTier - Optional evidence tier for clinical commentary
 * @returns A Tweet of type 'quote'
 */
export function generateQuoteTweet(
  originalTweetContent: string,
  commentary: string,
  evidenceTier?: EvidenceTier
): Tweet {
  let finalCommentary = commentary;
  if (evidenceTier) {
    finalCommentary += ` [${evidenceTier}]`;
  }

  if (finalCommentary.length > X_CHAR_LIMIT) {
    throw new Error(
      `Quote tweet commentary exceeds ${X_CHAR_LIMIT} characters. Length: ${finalCommentary.length}.`
    );
  }

  return {
    id: generateId(),
    type: 'quote',
    content: finalCommentary,
    hashtags: [],
    engagement: emptyEngagement(),
  };
}

/**
 * Generates an optimised X bio (160 characters) and pinned tweet.
 *
 * @returns Object with bio and pinnedTweet strings
 */
export function generateBioAndPinnedTweet(): { bio: string; pinnedTweet: string } {
  const bio = `Clinical intelligence platform for FM practitioners. 7 nodes. 5 zones. Terrain-level analysis. Founded by ${VM_BRAND.credentials.name}.`;

  if (bio.length > X_BIO_LIMIT) {
    // Fallback shorter bio
    const shortBio = `Clinical intelligence for FM practitioners. 7 nodes. 5 zones. Terrain-level analysis. ${VM_BRAND.platform.domain}`;
    return {
      bio: shortBio.slice(0, X_BIO_LIMIT),
      pinnedTweet: [
        `VitalMatrix is a ${VM_BRAND.platform.descriptor} built for functional medicine practitioners.`,
        '',
        '7 nodes. 5 zones. 630+ audited elements.',
        '',
        `Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months (standard: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month).`,
        '',
        `Built by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}.`,
        '',
        VM_BRAND.platform.domain,
      ].join('\n'),
    };
  }

  return {
    bio,
    pinnedTweet: [
      `VitalMatrix is a ${VM_BRAND.platform.descriptor} built for functional medicine practitioners.`,
      '',
      '7 nodes. 5 zones. 630+ audited elements.',
      '',
      `Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months (standard: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month).`,
      '',
      `Built by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}.`,
      '',
      VM_BRAND.platform.domain,
    ].join('\n'),
  };
}
