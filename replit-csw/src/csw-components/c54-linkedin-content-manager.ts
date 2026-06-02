/**
 * Component 54: LinkedIn Content Manager
 *
 * LinkedIn content management for VitalMatrix covering posts, articles,
 * document posts, polls, newsletter editions, and company page content.
 * Positions Dr Faisal as a thought leader (MBBS, FAAMFM -- never MD).
 * IFM amplification framing throughout. All clinical content includes
 * regulatory footers.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** Supported LinkedIn content formats */
export type LinkedInContentType = 'post' | 'article' | 'document' | 'poll' | 'newsletter-edition';

/** Engagement metrics for a LinkedIn post */
export interface LinkedInEngagement {
  likes: number;
  comments: number;
  reposts: number;
  impressions: number;
}

/** A single LinkedIn post */
export interface LinkedInPost {
  id: string;
  type: LinkedInContentType;
  content: string;
  hashtags: string[];
  documentUrl?: string;
  articleBody?: string;
  pollOptions?: string[];
  engagement: LinkedInEngagement;
}

/** A long-form LinkedIn article */
export interface LinkedInArticle {
  title: string;
  body: string;
  coverImageDescription: string;
  tags: string[];
}

/** A slide within a document post */
export interface DocumentSlide {
  slideNumber: number;
  heading: string;
  body: string;
}

// --- Constants ---

/** LinkedIn post character limit */
const LI_POST_LIMIT = 3000;

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
const ZONE_LABELS: Record<string, { name: string; description: string }> = {
  Z1: { name: 'Terrain Foundation', description: 'Baseline biochemistry and foundational markers that underpin system stability.' },
  Z2: { name: 'Functional Load', description: 'Metabolic burden, detoxification capacity, and cumulative physiological stress.' },
  Z3: { name: 'Regulatory Coherence', description: 'Neuro-immune-endocrine axis balance and inter-system communication fidelity.' },
  Z4: { name: 'Adaptive Capacity', description: 'Resilience reserves, recovery dynamics, and allostatic flexibility.' },
  Z5: { name: 'Expression and Output', description: 'Phenotypic manifestation, symptom clustering, and clinical presentation patterns.' },
};

/** Standard LinkedIn hashtags */
const LI_HASHTAGS: string[] = [
  '#FunctionalMedicine', '#ClinicalIntelligence', '#VitalMatrix',
  '#TerrainMedicine', '#PrecisionMedicine', '#HealthTech',
  '#IntegrativeMedicine', '#SystemsBiology', '#MedTech',
  '#PractitionerTools',
];

// --- Helpers ---

/**
 * Generates a unique post identifier.
 *
 * @returns A string identifier prefixed with li-
 */
function generateId(): string {
  return `li-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Creates a default engagement object with zero values.
 *
 * @returns A LinkedInEngagement with all zeros
 */
function emptyEngagement(): LinkedInEngagement {
  return { likes: 0, comments: 0, reposts: 0, impressions: 0 };
}

/**
 * Appends the regulatory footer to clinical content.
 *
 * @param content - The post body
 * @param evidenceTier - Optional evidence tier
 * @returns Content with footer appended
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
 * Generates the author bio block for articles and thought leadership.
 *
 * @returns Formatted author bio string
 */
function authorBio(): string {
  return [
    `---`,
    `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
    `${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    `${VM_BRAND.platform.domain}`,
  ].join('\n');
}

// --- Core Functions ---

/**
 * Creates a LinkedIn post with validation.
 *
 * Validates the 3,000 character limit.
 *
 * @param content - The post body text
 * @param hashtags - Array of hashtags
 * @param evidenceTier - Optional evidence tier for clinical content
 * @returns A LinkedInPost object
 */
export function createPost(
  content: string,
  hashtags: string[],
  evidenceTier?: EvidenceTier
): LinkedInPost {
  let finalContent = content;
  if (evidenceTier) {
    finalContent = appendRegulatoryFooter(content, evidenceTier);
  }

  const fullText = hashtags.length > 0
    ? `${finalContent}\n\n${hashtags.join(' ')}`
    : finalContent;

  if (fullText.length > LI_POST_LIMIT) {
    throw new Error(
      `LinkedIn post exceeds ${LI_POST_LIMIT} character limit. Current length: ${fullText.length}.`
    );
  }

  return {
    id: generateId(),
    type: 'post',
    content: fullText,
    hashtags,
    engagement: emptyEngagement(),
  };
}

/**
 * Generates a long-form LinkedIn article with VM branding.
 *
 * Includes author bio, evidence tiers on clinical claims, and
 * regulatory footer.
 *
 * @param topic - The article title/topic
 * @param body - The article body text
 * @param evidenceTier - Optional evidence tier for clinical content
 * @returns A LinkedInArticle object
 */
export function generateArticle(
  topic: string,
  body: string,
  evidenceTier?: EvidenceTier
): LinkedInArticle {
  let finalBody = body;
  if (evidenceTier) {
    finalBody = appendRegulatoryFooter(body, evidenceTier);
  }

  finalBody += `\n\n${authorBio()}`;

  return {
    title: topic,
    body: finalBody,
    coverImageDescription: `VitalMatrix branded cover image for article: ${topic}. Prussian blue background with gold accent typography.`,
    tags: ['Functional Medicine', 'Clinical Intelligence', 'Terrain Medicine', 'Health Technology', 'Precision Medicine'],
  };
}

/**
 * Generates a weekly LinkedIn content plan with 4-5 posts.
 *
 * Schedule:
 * - Monday: Clinical intelligence insight
 * - Tuesday: Platform update / behind the scenes
 * - Wednesday: IFM/FM industry commentary (building upon, never correcting)
 * - Thursday: Data/evidence post
 * - Friday: Founding cohort invitation
 *
 * @returns An array of LinkedInPost objects
 */
export function generateWeeklyLinkedInPlan(): LinkedInPost[] {
  const posts: LinkedInPost[] = [];

  // Monday -- Clinical intelligence insight
  const node = NODE_LABELS[Math.floor(Math.random() * NODE_LABELS.length)];
  posts.push(
    createPost(
      [
        `Cross-node intelligence: why ${node.split(': ')[1]} patterns cannot be read in isolation.`,
        '',
        `In functional medicine, we have long understood that systems interact. But quantifying those interactions at the terrain level remains a gap in most clinical workflows.`,
        '',
        `VitalMatrix maps connections across 7 nodes, surfacing cascade patterns that single-system analysis misses. The ${node.split(': ')[1]} node does not exist in a vacuum. Its state is modulated by, and in turn modulates, every other node in the terrain.`,
        '',
        `This is not theoretical. It is computational terrain analysis built for practitioner workflows.`,
      ].join('\n'),
      ['#FunctionalMedicine', '#ClinicalIntelligence', '#VitalMatrix', '#TerrainMedicine'],
      'Established'
    )
  );

  // Tuesday -- Platform update
  posts.push(
    createPost(
      [
        `Building in the open: what we are working on this week at VitalMatrix.`,
        '',
        `Our focus this week is on refining cascade detection sensitivity. When one node shifts, how quickly does VitalMatrix detect the downstream impact? That latency matters in clinical practice.`,
        '',
        `Every element in our platform has been individually audited. Over 630 clinical elements, each traced to peer-reviewed literature. This is not a black box. It is transparent, auditable clinical intelligence.`,
        '',
        `Built by a practitioner, for practitioners.`,
      ].join('\n'),
      ['#HealthTech', '#VitalMatrix', '#BuildInPublic', '#MedTech']
    )
  );

  // Wednesday -- IFM/FM industry commentary (building upon, never correcting)
  posts.push(
    createPost(
      [
        `The IFM framework has transformed how practitioners think about chronic disease. VitalMatrix builds upon that foundation.`,
        '',
        `What IFM has given us: a systems-biology approach to clinical thinking. The functional medicine matrix. The understanding that upstream drivers matter more than downstream symptoms.`,
        '',
        `What VitalMatrix adds: computational terrain analysis that quantifies those connections. Seven nodes. Five zones. Measurable cascade pathways.`,
        '',
        `We are not replacing the IFM model. We are giving practitioners the tools to operationalise it at scale.`,
      ].join('\n'),
      ['#FunctionalMedicine', '#IFM', '#ClinicalIntelligence', '#VitalMatrix']
    )
  );

  // Thursday -- Data/evidence post
  posts.push(
    createPost(
      [
        `Evidence matters. Here is how VitalMatrix approaches clinical rigour.`,
        '',
        `Every clinical element in VitalMatrix carries an evidence tier:`,
        `- Established: supported by robust peer-reviewed evidence`,
        `- Emerging: supported by growing but not yet definitive research`,
        `- Theoretical: mechanistically plausible, awaiting clinical validation`,
        `- Observed in Practice: consistent clinical observation, formal studies pending`,
        `- Contested: active scientific debate`,
        '',
        `This transparency allows practitioners to weigh findings appropriately. No black boxes. No unsourced claims. Every element auditable.`,
      ].join('\n'),
      ['#EvidenceBased', '#ClinicalIntelligence', '#VitalMatrix', '#PrecisionMedicine'],
      'Established'
    )
  );

  // Friday -- Founding cohort invitation
  posts.push(
    createPost(
      [
        `The VitalMatrix founding cohort is open.`,
        '',
        `${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Standard rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month.`,
        '',
        `This is for functional medicine practitioners who want terrain-level clinical intelligence from day one. Not a waiting list. Not a beta. A founding partnership.`,
        '',
        `What you get:`,
        `- Full access to the VitalMatrix ${VM_BRAND.platform.descriptor}`,
        `- 7-node, 5-zone terrain analysis`,
        `- Cascade detection and cross-node mapping`,
        `- ${VM_BRAND.pricing.guarantee}`,
        '',
        `${VM_BRAND.platform.domain}`,
      ].join('\n'),
      ['#FunctionalMedicine', '#VitalMatrix', '#FoundingCohort']
    )
  );

  return posts;
}

/**
 * Generates a PDF-style carousel document post.
 *
 * @param title - The document title
 * @param slides - Array of DocumentSlide objects
 * @returns A LinkedInPost of type 'document'
 */
export function generateDocumentPost(title: string, slides: DocumentSlide[]): LinkedInPost {
  const slideText = slides
    .map((s) => `[Slide ${s.slideNumber}] ${s.heading}\n${s.body}`)
    .join('\n\n');

  const content = [
    title,
    '',
    'Swipe through the document below.',
    '',
    slideText,
    '',
    `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
    VM_BRAND.platform.domain,
  ].join('\n');

  return {
    id: generateId(),
    type: 'document',
    content,
    hashtags: ['#FunctionalMedicine', '#VitalMatrix', '#ClinicalIntelligence'],
    documentUrl: `[PDF document: ${title}]`,
    engagement: emptyEngagement(),
  };
}

/**
 * Generates a LinkedIn poll for practitioner engagement.
 *
 * @param question - The poll question
 * @param options - Array of poll options (2-4)
 * @returns A LinkedInPost of type 'poll'
 */
export function generatePoll(question: string, options: string[]): LinkedInPost {
  if (options.length < 2 || options.length > 4) {
    throw new Error('LinkedIn polls require between 2 and 4 options.');
  }

  const content = [
    question,
    '',
    ...options.map((opt, i) => `${i + 1}. ${opt}`),
    '',
    `We are curious to hear from practitioners in the functional medicine space.`,
    '',
    `VitalMatrix -- ${VM_BRAND.platform.descriptor}`,
  ].join('\n');

  return {
    id: generateId(),
    type: 'poll',
    content,
    hashtags: ['#FunctionalMedicine', '#VitalMatrix'],
    pollOptions: options,
    engagement: emptyEngagement(),
  };
}

/**
 * Generates company page content for VitalMatrix Ltd.
 *
 * Includes about section, tagline, and full description.
 *
 * @returns Object with tagline, about, and description strings
 */
export function generateCompanyPageContent(): {
  tagline: string;
  about: string;
  description: string;
} {
  return {
    tagline: `Terrain-level clinical intelligence for functional medicine practitioners.`,
    about: [
      `VitalMatrix is a ${VM_BRAND.platform.descriptor} built for functional medicine practitioners.`,
      '',
      `We map clinical intelligence across 7 interconnected nodes and 5 zones, giving practitioners ` +
      `structured, auditable terrain-level analysis. Every clinical element is traced to peer-reviewed ` +
      `literature and classified by evidence tier.`,
      '',
      `Founded by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}, VitalMatrix ` +
      `was built by a practitioner who understood the gap between the depth of functional medicine ` +
      `thinking and the tools available to operationalise it.`,
      '',
      VM_BRAND.regulatoryFooter,
    ].join('\n'),
    description: [
      `${VM_BRAND.credentials.company}`,
      `${VM_BRAND.platform.domain}`,
      '',
      `Clinical intelligence platform for functional medicine practitioners.`,
      `7 nodes. 5 zones. 630+ audited clinical elements.`,
      `Cascade detection. Cross-node mapping. Evidence-tiered analysis.`,
      '',
      `Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, ` +
      `fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.`,
      '',
      `${VM_BRAND.platform.ico}`,
      '',
      VM_BRAND.regulatoryFooter,
    ].join('\n'),
  };
}

/**
 * Generates a thought leadership post positioning Dr Faisal as an authority.
 *
 * Uses MBBS, FAAMFM credentials (never MD). Adopts IFM amplification
 * framing (building upon, never correcting). Includes regulatory footer
 * for clinical content.
 *
 * @param topic - The thought leadership topic
 * @param evidenceTier - Optional evidence tier
 * @returns A LinkedInPost object
 */
export function generateThoughtLeadership(
  topic: string,
  evidenceTier?: EvidenceTier
): LinkedInPost {
  const content = [
    topic,
    '',
    `After years in functional medicine practice, one gap kept recurring: the distance between ` +
    `what we know about interconnected systems and the tools available to quantify those connections.`,
    '',
    `The IFM framework gave us the conceptual model. Systems biology gave us the language. ` +
    `But translating that into a structured, repeatable clinical workflow required something new.`,
    '',
    `That is why I built VitalMatrix. Not to replace clinical judgement, but to give practitioners ` +
    `the terrain-level visibility to make better-informed decisions. Seven nodes. Five zones. ` +
    `Every element audited and evidence-tiered.`,
    '',
    `The founding cohort is open for practitioners who want to be part of this from the start.`,
    '',
    `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
    `${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    `${VM_BRAND.platform.domain}`,
  ].join('\n');

  return createPost(
    content,
    ['#FunctionalMedicine', '#ThoughtLeadership', '#VitalMatrix', '#ClinicalIntelligence', '#TerrainMedicine'],
    evidenceTier
  );
}
