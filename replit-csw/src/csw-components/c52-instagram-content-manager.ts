/**
 * Component 52: Instagram Content Manager
 *
 * Instagram content management for VitalMatrix covering feed posts,
 * carousels, reel scripts, and stories. Includes pre-built educational
 * carousels, hashtag generation, and bio text. All content is B2B
 * practitioner-facing with regulatory footers on clinical material.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** Supported Instagram content formats */
export type InstagramContentType = 'feed-post' | 'carousel' | 'reel-script' | 'story';

/** Engagement metrics for an Instagram post */
export interface InstagramEngagement {
  likes: number;
  comments: number;
  saves: number;
  reach: number;
}

/** A single Instagram post */
export interface InstagramPost {
  id: string;
  type: InstagramContentType;
  caption: string;
  hashtags: string[];
  mediaDescription: string;
  altText: string;
  scheduledDate?: string;
  engagement: InstagramEngagement;
}

/** A single slide within a carousel post */
export interface CarouselSlide {
  slideNumber: number;
  text: string;
  visualDescription: string;
}

/** A scene within a reel script */
export interface ReelScene {
  timestamp: string;
  narration: string;
  visualCue: string;
}

/** A complete reel script */
export interface ReelScript {
  duration: number;
  scenes: ReelScene[];
}

/** A single story frame */
export interface StoryFrame {
  frameNumber: number;
  text: string;
  visualDescription: string;
  interactiveElement?: string;
}

// --- Constants ---

/** Instagram caption character limit */
const IG_CAPTION_LIMIT = 2200;

/** Maximum hashtags per post */
const IG_MAX_HASHTAGS = 30;

/** Node labels for content generation */
const NODE_LABELS: string[] = [
  'N1: Metabolic and Endocrine',
  'N2: Immune and Inflammatory',
  'N3: Neurological and Cognitive',
  'N4: Cardiovascular and Circulatory',
  'N5: Gastrointestinal and Hepatic',
  'N6: Musculoskeletal and Structural',
  'N7: Psycho-Emotional and Behavioural',
];

/** Zone labels for content generation */
const ZONE_LABELS: Record<string, { name: string; description: string }> = {
  Z1: { name: 'Terrain Foundation', description: 'Baseline biochemistry and foundational markers that underpin system stability.' },
  Z2: { name: 'Functional Load', description: 'Metabolic burden, detoxification capacity, and cumulative physiological stress.' },
  Z3: { name: 'Regulatory Coherence', description: 'Neuro-immune-endocrine axis balance and inter-system communication fidelity.' },
  Z4: { name: 'Adaptive Capacity', description: 'Resilience reserves, recovery dynamics, and allostatic flexibility.' },
  Z5: { name: 'Expression and Output', description: 'Phenotypic manifestation, symptom clustering, and clinical presentation patterns.' },
};

/** Core hashtag pool for functional medicine practitioner discovery */
const CORE_HASHTAGS: string[] = [
  '#FunctionalMedicine', '#TerrainMedicine', '#ClinicalIntelligence',
  '#VitalMatrix', '#PractitionerTools', '#FMPractitioner',
  '#IntegrativeMedicine', '#SystemsBiology', '#BiochemistryMatters',
  '#CascadeDetection', '#PrecisionMedicine', '#EvidenceBased',
  '#FunctionalMedicinePractitioner', '#TerrainAnalysis', '#ClinicalWorkflow',
  '#PatientOutcomes', '#BiomarkerAnalysis', '#HealthTech',
  '#MedTech', '#PractitionerLife', '#FunctionalLab',
  '#RootCauseAnalysis', '#WholeBodyApproach', '#IFM',
  '#NutritionalMedicine', '#MetabolicHealth', '#GutHealth',
  '#Neuroimmunology', '#EndocrineHealth', '#ClinicalDecisionSupport',
];

// --- Helpers ---

/**
 * Generates a unique post identifier.
 *
 * @returns A string identifier prefixed with ig-
 */
function generateId(): string {
  return `ig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Formats seconds into MM:SS timestamp string.
 *
 * @param seconds - Total seconds from start
 * @returns Formatted timestamp
 */
function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Appends the regulatory footer to clinical content.
 *
 * @param caption - The caption text
 * @param evidenceTier - Optional evidence tier
 * @returns Caption with footer appended
 */
function appendRegulatoryFooter(caption: string, evidenceTier?: EvidenceTier): string {
  let footer = '';
  if (evidenceTier) {
    footer += `\n\nEvidence tier: ${evidenceTier}.`;
  }
  footer += `\n\n${VM_BRAND.regulatoryFooter}`;
  return caption + footer;
}

// --- Core Functions ---

/**
 * Creates an Instagram feed post with validation.
 *
 * Validates the 2,200 character caption limit and requires at least
 * one media description. Appends regulatory footer to clinical content.
 *
 * @param caption - The post caption text
 * @param hashtags - Array of hashtags (max 30)
 * @param mediaDescription - Description of the visual media
 * @param evidenceTier - Optional evidence tier for clinical content
 * @returns An InstagramPost object
 */
export function createFeedPost(
  caption: string,
  hashtags: string[],
  mediaDescription: string,
  evidenceTier?: EvidenceTier
): InstagramPost {
  if (!mediaDescription || mediaDescription.trim().length === 0) {
    throw new Error('Instagram feed posts require at least one media description.');
  }

  if (hashtags.length > IG_MAX_HASHTAGS) {
    throw new Error(`Instagram allows a maximum of ${IG_MAX_HASHTAGS} hashtags. Received: ${hashtags.length}.`);
  }

  let finalCaption = caption;
  if (evidenceTier) {
    finalCaption = appendRegulatoryFooter(caption, evidenceTier);
  }

  if (finalCaption.length > IG_CAPTION_LIMIT) {
    throw new Error(
      `Instagram caption exceeds ${IG_CAPTION_LIMIT} character limit. Current length: ${finalCaption.length}.`
    );
  }

  return {
    id: generateId(),
    type: 'feed-post',
    caption: finalCaption,
    hashtags,
    mediaDescription,
    altText: mediaDescription,
    engagement: { likes: 0, comments: 0, saves: 0, reach: 0 },
  };
}

/**
 * Generates an educational carousel post.
 *
 * Carousels should contain between 5 and 10 slides for optimal
 * engagement. Each slide includes text and a visual description.
 *
 * @param topic - The carousel topic
 * @param slides - Array of CarouselSlide objects (5-10 slides)
 * @param evidenceTier - Optional evidence tier for clinical content
 * @returns An InstagramPost of type 'carousel'
 */
export function generateCarousel(
  topic: string,
  slides: CarouselSlide[],
  evidenceTier?: EvidenceTier
): InstagramPost {
  if (slides.length < 5 || slides.length > 10) {
    throw new Error('Carousels should contain between 5 and 10 slides.');
  }

  const slideText = slides
    .map((s) => `Slide ${s.slideNumber}: ${s.text}`)
    .join('\n');

  let caption = [
    topic,
    '',
    'Swipe through to learn more.',
    '',
    slideText,
    '',
    `Learn more at ${VM_BRAND.platform.domain}`,
  ].join('\n');

  if (evidenceTier) {
    caption = appendRegulatoryFooter(caption, evidenceTier);
  }

  const hashtags = generateHashtagSet();

  return {
    id: generateId(),
    type: 'carousel',
    caption,
    hashtags,
    mediaDescription: `${slides.length}-slide educational carousel: ${topic}`,
    altText: `Educational carousel about ${topic} with ${slides.length} slides`,
    engagement: { likes: 0, comments: 0, saves: 0, reach: 0 },
  };
}

/**
 * Pre-built carousel: "What are the 7 nodes?"
 *
 * 9 slides: intro + 7 node slides + CTA.
 *
 * @returns An InstagramPost carousel
 */
export function carouselSevenNodes(): InstagramPost {
  const slides: CarouselSlide[] = [
    { slideNumber: 1, text: 'What Are the 7 Nodes? A framework for terrain-level clinical intelligence.', visualDescription: 'Title slide with VitalMatrix branding and node icons.' },
    { slideNumber: 2, text: `${NODE_LABELS[0]}: Hormonal signalling, glucose metabolism, thyroid and adrenal function.`, visualDescription: 'N1 node diagram in gold accent.' },
    { slideNumber: 3, text: `${NODE_LABELS[1]}: Cytokine networks, mucosal immunity, and inflammatory cascades.`, visualDescription: 'N2 node diagram in teal accent.' },
    { slideNumber: 4, text: `${NODE_LABELS[2]}: Neurotransmitter balance, cognitive load, and autonomic regulation.`, visualDescription: 'N3 node diagram in purple accent.' },
    { slideNumber: 5, text: `${NODE_LABELS[3]}: Vascular integrity, perfusion dynamics, and haemodynamic balance.`, visualDescription: 'N4 node diagram in sage accent.' },
    { slideNumber: 6, text: `${NODE_LABELS[4]}: Microbiome ecology, hepatic biotransformation, and barrier function.`, visualDescription: 'N5 node diagram in teal accent.' },
    { slideNumber: 7, text: `${NODE_LABELS[5]}: Connective tissue integrity, joint mechanics, and structural resilience.`, visualDescription: 'N6 node diagram in gold accent.' },
    { slideNumber: 8, text: `${NODE_LABELS[6]}: Stress response, emotional resilience, and behavioural patterns.`, visualDescription: 'N7 node diagram in purple accent.' },
    { slideNumber: 9, text: `VitalMatrix maps all 7 nodes. Join the founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months.`, visualDescription: 'CTA slide with pricing and domain.' },
  ];

  return generateCarousel('What Are the 7 Nodes?', slides, 'Established');
}

/**
 * Pre-built carousel: "5 zones explained"
 *
 * 7 slides: intro + 5 zone slides + CTA.
 *
 * @returns An InstagramPost carousel
 */
export function carouselFiveZones(): InstagramPost {
  const zoneKeys = Object.keys(ZONE_LABELS);
  const slides: CarouselSlide[] = [
    { slideNumber: 1, text: '5 Zones of Clinical Intelligence: How VitalMatrix organises terrain data.', visualDescription: 'Title slide with zone colour gradient.' },
    ...zoneKeys.map((key, i) => ({
      slideNumber: i + 2,
      text: `${key}: ${ZONE_LABELS[key].name} -- ${ZONE_LABELS[key].description}`,
      visualDescription: `${key} zone diagram with description overlay.`,
    })),
    { slideNumber: 7, text: `Explore all 5 zones at ${VM_BRAND.platform.domain}. Founding cohort open now.`, visualDescription: 'CTA slide with all 5 zone icons and pricing.' },
  ];

  return generateCarousel('5 Zones Explained', slides, 'Established');
}

/**
 * Pre-built carousel: "How cascade detection works"
 *
 * 6 slides explaining the cascade detection concept.
 *
 * @returns An InstagramPost carousel
 */
export function carouselCascadeDetection(): InstagramPost {
  const slides: CarouselSlide[] = [
    { slideNumber: 1, text: 'How Cascade Detection Works: Finding the upstream drivers of downstream symptoms.', visualDescription: 'Title slide with cascade flow diagram.' },
    { slideNumber: 2, text: 'Traditional analysis: single-system, isolated markers, siloed interpretation.', visualDescription: 'Diagram showing disconnected data points.' },
    { slideNumber: 3, text: 'Terrain analysis: cross-node connections, cascade pathways, upstream mapping.', visualDescription: 'Connected node network diagram.' },
    { slideNumber: 4, text: 'CascadeIQ scores quantify the propagation risk across interconnected nodes.', visualDescription: 'Score visualisation with threshold indicators.' },
    { slideNumber: 5, text: 'Practitioners see which nodes amplify or dampen signals from other systems.', visualDescription: 'Amplification and dampening flow arrows.' },
    { slideNumber: 6, text: `Experience cascade detection: ${VM_BRAND.platform.domain}`, visualDescription: 'CTA slide with VitalMatrix branding.' },
  ];

  return generateCarousel('How Cascade Detection Works', slides, 'Emerging');
}

/**
 * Pre-built carousel: "Why terrain medicine?"
 *
 * 5 slides on the terrain medicine approach.
 *
 * @returns An InstagramPost carousel
 */
export function carouselWhyTerrainMedicine(): InstagramPost {
  const slides: CarouselSlide[] = [
    { slideNumber: 1, text: 'Why Terrain Medicine? Moving beyond symptom suppression to system understanding.', visualDescription: 'Title slide with terrain landscape visual.' },
    { slideNumber: 2, text: 'The terrain is the biological landscape your patient lives in. Genetics, environment, lifestyle, and biochemistry converge here.', visualDescription: 'Layered terrain illustration.' },
    { slideNumber: 3, text: 'Terrain-aware practice identifies root patterns, not isolated findings.', visualDescription: 'Root system metaphor diagram.' },
    { slideNumber: 4, text: 'VitalMatrix quantifies terrain state across 7 nodes and 5 zones, giving practitioners a structured clinical framework.', visualDescription: 'Platform screenshot mockup.' },
    { slideNumber: 5, text: `Join practitioners who are adopting terrain-level intelligence. ${VM_BRAND.platform.domain}`, visualDescription: 'CTA slide with founding cohort details.' },
  ];

  return generateCarousel('Why Terrain Medicine?', slides, 'Established');
}

/**
 * Generates a reel script with scene-by-scene breakdown.
 *
 * Supports 30s, 60s, and 90s durations. Each scene includes
 * a timestamp, narration, and visual cue.
 *
 * @param topic - The reel topic
 * @param duration - Duration in seconds (30, 60, or 90)
 * @returns A ReelScript with timed scenes
 */
export function generateReelScript(topic: string, duration: 30 | 60 | 90): ReelScript {
  const sceneDuration = duration === 30 ? 6 : duration === 60 ? 10 : 15;
  const sceneCount = Math.floor(duration / sceneDuration);

  const scenes: ReelScene[] = [];

  // Hook scene
  scenes.push({
    timestamp: formatTimestamp(0),
    narration: `Here is what most practitioners miss about ${topic}.`,
    visualCue: 'Hook text overlay on branded background. Quick zoom in.',
  });

  // Content scenes
  const contentScenes = sceneCount - 2;
  for (let i = 0; i < contentScenes; i++) {
    const startTime = sceneDuration * (i + 1);
    scenes.push({
      timestamp: formatTimestamp(startTime),
      narration: `[Content point ${i + 1} about ${topic}. Expand with specific clinical intelligence insight.]`,
      visualCue: `B-roll or diagram illustrating point ${i + 1}. Text overlay with key phrase.`,
    });
  }

  // CTA scene
  scenes.push({
    timestamp: formatTimestamp(duration - sceneDuration),
    narration: `VitalMatrix maps this across 7 nodes and 5 zones. Link in bio for the founding cohort.`,
    visualCue: 'VitalMatrix logo. Founding cohort pricing overlay. Link in bio prompt.',
  });

  return { duration, scenes };
}

/**
 * Generates a story sequence of 5-7 frames with interactive elements.
 *
 * Includes polls, question stickers, and engagement prompts
 * relevant to functional medicine practitioners.
 *
 * @param topic - The story topic
 * @returns An array of StoryFrame objects
 */
export function generateStorySequence(topic: string): StoryFrame[] {
  return [
    {
      frameNumber: 1,
      text: `Let us talk about ${topic}.`,
      visualDescription: 'Branded title card with topic text.',
      interactiveElement: undefined,
    },
    {
      frameNumber: 2,
      text: `Most practitioners approach ${topic} through a single-system lens. But the terrain tells a different story.`,
      visualDescription: 'Text overlay on clinical background.',
      interactiveElement: undefined,
    },
    {
      frameNumber: 3,
      text: 'Do you currently assess cross-node interactions in your practice?',
      visualDescription: 'Poll sticker frame.',
      interactiveElement: 'Poll: Yes, routinely / Sometimes / Not yet / What are nodes?',
    },
    {
      frameNumber: 4,
      text: `VitalMatrix maps ${topic} across the full terrain, revealing connections that isolated analysis misses.`,
      visualDescription: 'Platform diagram or node map visual.',
      interactiveElement: undefined,
    },
    {
      frameNumber: 5,
      text: 'What is your biggest challenge with terrain-level analysis?',
      visualDescription: 'Question sticker frame.',
      interactiveElement: 'Question sticker: Type your answer...',
    },
    {
      frameNumber: 6,
      text: `Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months.`,
      visualDescription: 'Pricing card with swipe-up CTA.',
      interactiveElement: 'Link sticker: vitalmatrix.co.uk',
    },
    {
      frameNumber: 7,
      text: 'Share this with a colleague who would benefit from terrain-level intelligence.',
      visualDescription: 'Share prompt with VitalMatrix logo.',
      interactiveElement: 'Share button prompt',
    },
  ];
}

/**
 * Generates an optimised set of 30 hashtags for practitioner discovery.
 *
 * Optionally biases towards a specific zone or node topic.
 *
 * @param zone - Optional zone key (Z1-Z5) to bias hashtags
 * @param node - Optional node key (N1-N7) to bias hashtags
 * @returns Array of 30 hashtags
 */
export function generateHashtagSet(zone?: string, node?: string): string[] {
  const hashtags = [...CORE_HASHTAGS];

  if (zone && ZONE_LABELS[zone]) {
    const zoneName = ZONE_LABELS[zone].name.replace(/\s+/g, '');
    hashtags.unshift(`#${zoneName}`, `#${zone}Zone`, `#TerrainZone${zone.slice(1)}`);
  }

  if (node) {
    const nodeIndex = parseInt(node.replace('N', ''), 10);
    if (nodeIndex >= 1 && nodeIndex <= 7) {
      const nodeLabel = NODE_LABELS[nodeIndex - 1].split(': ')[1].split(' and ')[0];
      hashtags.unshift(`#${nodeLabel.replace(/\s+/g, '')}`, `#Node${nodeIndex}`, `#ClinicalNode`);
    }
  }

  // Deduplicate and trim to 30
  const unique = [...new Set(hashtags)];
  return unique.slice(0, IG_MAX_HASHTAGS);
}

/**
 * Generates the VitalMatrix Instagram bio text with link-in-bio CTA.
 *
 * @returns The bio string (max 150 characters for display name area, full text for bio field)
 */
export function generateInstagramBio(): string {
  return [
    `VitalMatrix | Clinical Intelligence Platform`,
    `Terrain-level analysis for FM practitioners`,
    `7 nodes. 5 zones. One platform.`,
    `Founded by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
    `Founding cohort open -- link below`,
    VM_BRAND.platform.domain,
  ].join('\n');
}
