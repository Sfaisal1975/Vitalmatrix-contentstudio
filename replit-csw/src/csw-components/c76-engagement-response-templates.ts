/**
 * c76-engagement-response-templates.ts
 * VitalMatrix Content Studio -- Engagement Response Templates
 *
 * Pre-built response templates for social media engagement: comments, DMs,
 * and replies across all platforms. 50 templates across 9 categories.
 *
 * Compliance:
 *  - NEVER diagnose, prescribe, or give clinical advice on social media.
 *  - K7: MBBS, FAAMFM only. Never MD, never FMAARM.
 *  - K8: No em dashes. British English throughout.
 *  - K10: No competitor names. Ever.
 *  - Always use "terrain intelligence platform" as the descriptor.
 *  - Route clinical questions to discovery call, not social media answers.
 *  - Route media and partnership enquiries to Dr Faisal directly.
 *
 * (c) VitalMatrix Ltd 2026. All rights reserved.
 */

import { VM_BRAND } from './brand-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Category of inbound engagement. */
export type ResponseCategory =
  | 'clinical-question'
  | 'pricing-inquiry'
  | 'feature-question'
  | 'comparison-request'
  | 'scepticism'
  | 'praise'
  | 'partnership-inquiry'
  | 'media-inquiry'
  | 'spam';

/** A single response template. */
export interface ResponseTemplate {
  id: string;
  category: ResponseCategory;
  platform: string;
  tone: 'professional' | 'warm' | 'educational' | 'grateful';
  template: string;
  doNots: string[];
  escalateTo?: string;
}

/** An inbound comment for categorisation. */
export interface InboundComment {
  id: string;
  platform: string;
  text: string;
  author: string;
  timestamp: string;
}

/** Suggested response for an inbound comment. */
export interface SuggestedResponse {
  comment: InboundComment;
  detectedCategory: ResponseCategory;
  suggestedTemplate: ResponseTemplate;
  personalisedResponse: string;
}

/** Response effectiveness metrics. */
export interface ResponseMetrics {
  category: ResponseCategory;
  totalResponded: number;
  convertedToLead: number;
  conversionRate: number;
}

// ---------------------------------------------------------------------------
// Do-not lists per category
// ---------------------------------------------------------------------------

const DO_NOTS: Record<ResponseCategory, string[]> = {
  'clinical-question': [
    'Never provide clinical advice on social media',
    'Never diagnose or suggest diagnoses',
    'Never recommend specific supplements or protocols',
    'Never prescribe or suggest prescriptions',
    'Never reference specific patient cases',
    'Never use the word "treatment" or "cure"',
  ],
  'pricing-inquiry': [
    'Never negotiate pricing publicly',
    'Never offer discounts not in the pricing structure',
    'Never mention competitor pricing',
    'Never apologise for the price',
    'Never say "expensive" or "cheap"',
  ],
  'feature-question': [
    'Never reveal unreleased features with specific dates',
    'Never discuss internal architecture (nodes, stacks, engines)',
    'Never promise features not yet built',
    'Never share screenshots of internal dashboards',
  ],
  'comparison-request': [
    'Never name any competitor (K10)',
    'Never disparage any other platform or practitioner',
    'Never claim superiority over unnamed competitors',
    'Never use negative language about alternative approaches',
  ],
  'scepticism': [
    'Never be defensive or dismissive',
    'Never argue or debate publicly',
    'Never make unsubstantiated claims',
    'Never use aggressive or condescending language',
    'Never say "you are wrong"',
  ],
  'praise': [
    'Never be overly salesy in response to praise',
    'Never share testimonials without explicit permission',
    'Never fabricate or exaggerate praise',
    'Never assume consent to reshare',
  ],
  'partnership-inquiry': [
    'Never commit to partnerships without Dr Faisal approval',
    'Never discuss commercial terms publicly',
    'Never agree to exclusivity arrangements',
    'Never offer payment for endorsement (ASA compliance)',
  ],
  'media-inquiry': [
    'Never provide statements without Dr Faisal approval',
    'Never speculate on company direction',
    'Never discuss revenue, user numbers, or financials',
    'Never agree to interviews without clearance',
  ],
  'spam': [
    'Never engage with spam publicly',
    'Never click any links in spam messages',
    'Never share personal or company data in response',
  ],
};

// ---------------------------------------------------------------------------
// Pre-built response templates (50 total)
// ---------------------------------------------------------------------------

const credential = `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`;
const domain = VM_BRAND.platform.domain;
const descriptor = VM_BRAND.platform.descriptor;
const price = `${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month`;

const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  // ---- CLINICAL QUESTION (8 templates) ----
  {
    id: 'cq-01',
    category: 'clinical-question',
    platform: 'LinkedIn',
    tone: 'professional',
    template: `Thank you for raising this, {{author}}. This is exactly the kind of clinical question best explored in a proper consultation setting. We would love to show you how VitalMatrix maps terrain patterns related to this. Would a brief discovery call be useful? You can book one at ${domain}.`,
    doNots: DO_NOTS['clinical-question'],
  },
  {
    id: 'cq-02',
    category: 'clinical-question',
    platform: 'Instagram',
    tone: 'warm',
    template: `Great question, {{author}}! Clinical specifics are best discussed one-to-one rather than in comments. Our ${descriptor} explores exactly these terrain connections. DM us or visit ${domain} to arrange a discovery call.`,
    doNots: DO_NOTS['clinical-question'],
  },
  {
    id: 'cq-03',
    category: 'clinical-question',
    platform: 'Facebook',
    tone: 'educational',
    template: `Thanks for your interest in this topic, {{author}}. We take clinical questions seriously, which is why we prefer to discuss specifics in a professional setting rather than social media. The VitalMatrix ${descriptor} is designed to help practitioners explore exactly these kinds of terrain patterns. Happy to arrange a walkthrough: ${domain}.`,
    doNots: DO_NOTS['clinical-question'],
  },
  {
    id: 'cq-04',
    category: 'clinical-question',
    platform: 'X',
    tone: 'professional',
    template: `Important question, {{author}}. Best explored properly rather than in 280 characters. Book a discovery call at ${domain} and we will walk you through the terrain analysis.`,
    doNots: DO_NOTS['clinical-question'],
  },
  {
    id: 'cq-05',
    category: 'clinical-question',
    platform: 'LinkedIn',
    tone: 'educational',
    template: `{{author}}, this touches on terrain-based clinical intelligence, which is central to what we do at VitalMatrix. The interconnections you are asking about are complex and deserve more than a comment reply. I would welcome the chance to demonstrate how our platform maps these patterns. Shall we arrange a call?`,
    doNots: DO_NOTS['clinical-question'],
  },
  {
    id: 'cq-06',
    category: 'clinical-question',
    platform: 'Instagram',
    tone: 'professional',
    template: `Appreciate the question, {{author}}. We are unable to provide clinical guidance via social media, but this is precisely the type of enquiry our ${descriptor} is built to support. Link in bio for a discovery call.`,
    doNots: DO_NOTS['clinical-question'],
  },
  {
    id: 'cq-07',
    category: 'clinical-question',
    platform: 'Facebook',
    tone: 'warm',
    template: `{{author}}, what a thoughtful question. Clinical terrain patterns like this one are fascinating and complex. We would love to explore this with you properly. Drop us a message or visit ${domain} to arrange a discovery call with our team.`,
    doNots: DO_NOTS['clinical-question'],
  },
  {
    id: 'cq-08',
    category: 'clinical-question',
    platform: 'X',
    tone: 'warm',
    template: `Really appreciate you raising this, {{author}}. Too complex for a tweet, but exactly what VitalMatrix terrain mapping is designed for. Let us show you: ${domain}`,
    doNots: DO_NOTS['clinical-question'],
  },

  // ---- PRICING INQUIRY (6 templates) ----
  {
    id: 'pi-01',
    category: 'pricing-inquiry',
    platform: 'LinkedIn',
    tone: 'professional',
    template: `Thank you for your interest, {{author}}. Our founding cohort rate is ${price}, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. The standard rate will be ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month. Full details at ${domain}. Happy to answer any questions via DM or a discovery call.`,
    doNots: DO_NOTS['pricing-inquiry'],
  },
  {
    id: 'pi-02',
    category: 'pricing-inquiry',
    platform: 'Instagram',
    tone: 'warm',
    template: `Thanks for asking, {{author}}! Founding rate is just ${price}, locked in for ${VM_BRAND.pricing.foundingFixedMonths} months. That is a fraction of the standard ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month rate. Details in bio link or DM us!`,
    doNots: DO_NOTS['pricing-inquiry'],
  },
  {
    id: 'pi-03',
    category: 'pricing-inquiry',
    platform: 'Facebook',
    tone: 'professional',
    template: `Great question, {{author}}. The founding cohort rate is ${price} for ${VM_BRAND.pricing.foundingFixedMonths} months (standard rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month). This is a ${descriptor} built exclusively for FM practitioners. Full info at ${domain}.`,
    doNots: DO_NOTS['pricing-inquiry'],
  },
  {
    id: 'pi-04',
    category: 'pricing-inquiry',
    platform: 'X',
    tone: 'professional',
    template: `{{author}} Founding rate: ${price}, fixed ${VM_BRAND.pricing.foundingFixedMonths} months. Standard will be ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month. Details: ${domain}`,
    doNots: DO_NOTS['pricing-inquiry'],
  },
  {
    id: 'pi-05',
    category: 'pricing-inquiry',
    platform: 'LinkedIn',
    tone: 'warm',
    template: `{{author}}, delighted you are interested. The founding cohort is ${price} for ${VM_BRAND.pricing.foundingFixedMonths} months, which locks in significant savings against the standard ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month rate. Would a discovery call help you evaluate the fit? ${domain}`,
    doNots: DO_NOTS['pricing-inquiry'],
  },
  {
    id: 'pi-06',
    category: 'pricing-inquiry',
    platform: 'Facebook',
    tone: 'warm',
    template: `Thanks, {{author}}! Our founding practitioners pay ${price} for ${VM_BRAND.pricing.foundingFixedMonths} months. It is designed to be accessible for FM practitioners who are serious about terrain-based clinical intelligence. More at ${domain}.`,
    doNots: DO_NOTS['pricing-inquiry'],
  },

  // ---- FEATURE QUESTION (6 templates) ----
  {
    id: 'fq-01',
    category: 'feature-question',
    platform: 'LinkedIn',
    tone: 'professional',
    template: `Great question, {{author}}. VitalMatrix is a ${descriptor} that maps patient terrain across multiple clinical zones. It is built specifically for FM practitioners in England. I would love to walk you through the capabilities in a discovery call. ${domain}`,
    doNots: DO_NOTS['feature-question'],
  },
  {
    id: 'fq-02',
    category: 'feature-question',
    platform: 'Instagram',
    tone: 'educational',
    template: `{{author}}, in brief: VitalMatrix maps clinical terrain across 5 zones and 7 nodes, giving FM practitioners a complete clinical picture. Best way to see it in action is a quick discovery call. Link in bio!`,
    doNots: DO_NOTS['feature-question'],
  },
  {
    id: 'fq-03',
    category: 'feature-question',
    platform: 'Facebook',
    tone: 'warm',
    template: `Lovely question, {{author}}! VitalMatrix is a ${descriptor} for FM practitioners. It maps terrain patterns across clinical zones to reveal connections that single-marker analysis misses. Would you like to see a demonstration? Visit ${domain} or DM us.`,
    doNots: DO_NOTS['feature-question'],
  },
  {
    id: 'fq-04',
    category: 'feature-question',
    platform: 'X',
    tone: 'professional',
    template: `{{author}} VitalMatrix maps patient terrain across clinical zones for FM practitioners. A ${descriptor}, not just a dashboard. Discovery call: ${domain}`,
    doNots: DO_NOTS['feature-question'],
  },
  {
    id: 'fq-05',
    category: 'feature-question',
    platform: 'LinkedIn',
    tone: 'educational',
    template: `{{author}}, the platform uses terrain-based intelligence to map clinical patterns across zones. Think of it as clinical cartography for functional medicine. The WHAT and WHY are best demonstrated live. Shall we arrange a walkthrough?`,
    doNots: DO_NOTS['feature-question'],
  },
  {
    id: 'fq-06',
    category: 'feature-question',
    platform: 'Instagram',
    tone: 'warm',
    template: `Thanks for the interest, {{author}}! We built VitalMatrix to give FM practitioners terrain-level clinical intelligence. Too much to fit in a comment, but we would love to show you. DM us or tap the link in bio.`,
    doNots: DO_NOTS['feature-question'],
  },

  // ---- COMPARISON REQUEST (6 templates) ----
  {
    id: 'cr-01',
    category: 'comparison-request',
    platform: 'LinkedIn',
    tone: 'professional',
    template: `{{author}}, we focus on what VitalMatrix does rather than comparing to other platforms. Our ${descriptor} is purpose-built for terrain-based functional medicine practice in England. The best way to evaluate fit is a discovery call where you can see the approach firsthand. ${domain}`,
    doNots: DO_NOTS['comparison-request'],
  },
  {
    id: 'cr-02',
    category: 'comparison-request',
    platform: 'Instagram',
    tone: 'educational',
    template: `{{author}}, rather than comparing, we would love to show you what makes VitalMatrix unique: terrain-based clinical intelligence built exclusively for FM practitioners. DM us or link in bio for a discovery call.`,
    doNots: DO_NOTS['comparison-request'],
  },
  {
    id: 'cr-03',
    category: 'comparison-request',
    platform: 'Facebook',
    tone: 'professional',
    template: `Thanks for the question, {{author}}. We prefer to let our ${descriptor} speak for itself. VitalMatrix takes a terrain-based approach that is quite distinct in the FM space. A discovery call is the best way to see how it fits your practice. ${domain}`,
    doNots: DO_NOTS['comparison-request'],
  },
  {
    id: 'cr-04',
    category: 'comparison-request',
    platform: 'X',
    tone: 'professional',
    template: `{{author}} We focus on what VitalMatrix does: terrain-based ${descriptor} for FM practitioners. Happy to demonstrate: ${domain}`,
    doNots: DO_NOTS['comparison-request'],
  },
  {
    id: 'cr-05',
    category: 'comparison-request',
    platform: 'LinkedIn',
    tone: 'warm',
    template: `{{author}}, I appreciate the question. Every platform has its strengths. What sets VitalMatrix apart is the terrain-based approach, mapping clinical patterns across zones in a way that reflects how FM practitioners actually think. Let me show you rather than tell you. Shall we arrange a call?`,
    doNots: DO_NOTS['comparison-request'],
  },
  {
    id: 'cr-06',
    category: 'comparison-request',
    platform: 'Facebook',
    tone: 'educational',
    template: `Good question, {{author}}. Rather than a comparison, let me share what VitalMatrix does: it is a ${descriptor} that maps patient terrain across 5 clinical zones. It is built for FM practitioners in England, by an FM practitioner. The approach is unique. Discovery call: ${domain}.`,
    doNots: DO_NOTS['comparison-request'],
  },

  // ---- SCEPTICISM (6 templates) ----
  {
    id: 'sk-01',
    category: 'scepticism',
    platform: 'LinkedIn',
    tone: 'professional',
    template: `{{author}}, I appreciate the healthy scepticism. It is exactly the kind of critical thinking we value in functional medicine. VitalMatrix is built on established and emerging evidence tiers, and we are transparent about where each clinical insight sits on that spectrum. I would welcome the chance to walk you through the approach. ${domain}`,
    doNots: DO_NOTS['scepticism'],
  },
  {
    id: 'sk-02',
    category: 'scepticism',
    platform: 'Instagram',
    tone: 'warm',
    template: `Fair point, {{author}}. We welcome scrutiny. Every insight in VitalMatrix is tagged with an evidence tier (Established, Emerging, Theoretical, Observed in Practice, or Contested). We believe in transparency. DM us if you would like to learn more.`,
    doNots: DO_NOTS['scepticism'],
  },
  {
    id: 'sk-03',
    category: 'scepticism',
    platform: 'Facebook',
    tone: 'educational',
    template: `{{author}}, thank you for raising this. Rigour matters to us. VitalMatrix classifies every clinical insight by evidence tier, from Established through to Contested. We never overstate what the evidence supports. If you are curious about the methodology, we would be happy to discuss it. ${domain}`,
    doNots: DO_NOTS['scepticism'],
  },
  {
    id: 'sk-04',
    category: 'scepticism',
    platform: 'X',
    tone: 'professional',
    template: `{{author}} Healthy scepticism welcomed. Every VitalMatrix insight carries an evidence tier. We are transparent about what is established and what is emerging. Happy to discuss: ${domain}`,
    doNots: DO_NOTS['scepticism'],
  },
  {
    id: 'sk-05',
    category: 'scepticism',
    platform: 'LinkedIn',
    tone: 'educational',
    template: `{{author}}, you raise an important point. At VitalMatrix, we distinguish between five evidence tiers: Established, Emerging, Theoretical, Observed in Practice, and Contested. We believe practitioners deserve that transparency. I would welcome a deeper conversation about our methodology if you are interested.`,
    doNots: DO_NOTS['scepticism'],
  },
  {
    id: 'sk-06',
    category: 'scepticism',
    platform: 'Facebook',
    tone: 'warm',
    template: `Appreciate the pushback, {{author}}. We built VitalMatrix with exactly this kind of scrutiny in mind. Our evidence tier system ensures nothing is presented without appropriate context. Shall we chat? We are always happy to discuss the approach.`,
    doNots: DO_NOTS['scepticism'],
  },

  // ---- PRAISE (6 templates) ----
  {
    id: 'pr-01',
    category: 'praise',
    platform: 'LinkedIn',
    tone: 'grateful',
    template: `Thank you so much, {{author}}. Hearing this from a fellow practitioner means a great deal. We are committed to building something genuinely useful for the FM community. Would you mind if we shared your kind words (with attribution)?`,
    doNots: DO_NOTS['praise'],
  },
  {
    id: 'pr-02',
    category: 'praise',
    platform: 'Instagram',
    tone: 'grateful',
    template: `This made our day, {{author}}! Thank you for the kind words. We would love to share this with our community. Would that be alright with you?`,
    doNots: DO_NOTS['praise'],
  },
  {
    id: 'pr-03',
    category: 'praise',
    platform: 'Facebook',
    tone: 'warm',
    template: `{{author}}, thank you. Feedback like this drives us forward. We are building VitalMatrix for practitioners like you, and knowing it resonates is incredibly motivating. May we share your comment with our wider community?`,
    doNots: DO_NOTS['praise'],
  },
  {
    id: 'pr-04',
    category: 'praise',
    platform: 'X',
    tone: 'grateful',
    template: `Really appreciate this, {{author}}. Thank you. Would you be happy for us to share your kind words?`,
    doNots: DO_NOTS['praise'],
  },
  {
    id: 'pr-05',
    category: 'praise',
    platform: 'LinkedIn',
    tone: 'warm',
    template: `{{author}}, that is genuinely humbling. ${VM_BRAND.credentials.name} and the team are deeply grateful for this feedback. Our mission is to serve the FM community, and your words confirm we are heading in the right direction.`,
    doNots: DO_NOTS['praise'],
  },
  {
    id: 'pr-06',
    category: 'praise',
    platform: 'Instagram',
    tone: 'warm',
    template: `Thank you, {{author}}! Comments like yours are why we do what we do. The FM community in England deserves world-class clinical intelligence, and we are building it together.`,
    doNots: DO_NOTS['praise'],
  },

  // ---- PARTNERSHIP INQUIRY (4 templates) ----
  {
    id: 'pa-01',
    category: 'partnership-inquiry',
    platform: 'LinkedIn',
    tone: 'professional',
    template: `Thank you for reaching out, {{author}}. Partnership enquiries are handled directly by ${credential}. I will pass your message along, or you can contact us directly via ${domain}. We look forward to exploring this.`,
    doNots: DO_NOTS['partnership-inquiry'],
    escalateTo: VM_BRAND.credentials.name,
  },
  {
    id: 'pa-02',
    category: 'partnership-inquiry',
    platform: 'Instagram',
    tone: 'professional',
    template: `Thanks for the interest, {{author}}! Partnership discussions go through ${VM_BRAND.credentials.name} directly. Please DM us your details and we will connect you, or visit ${domain}.`,
    doNots: DO_NOTS['partnership-inquiry'],
    escalateTo: VM_BRAND.credentials.name,
  },
  {
    id: 'pa-03',
    category: 'partnership-inquiry',
    platform: 'Facebook',
    tone: 'warm',
    template: `{{author}}, thank you for this. We would love to explore partnership opportunities. These are managed by ${credential} personally. Could you send us a message with your details? We will make sure it reaches the right person.`,
    doNots: DO_NOTS['partnership-inquiry'],
    escalateTo: VM_BRAND.credentials.name,
  },
  {
    id: 'pa-04',
    category: 'partnership-inquiry',
    platform: 'X',
    tone: 'professional',
    template: `{{author}} Thanks for the interest. Partnerships are handled by ${VM_BRAND.credentials.name} directly. Please DM us or visit ${domain}.`,
    doNots: DO_NOTS['partnership-inquiry'],
    escalateTo: VM_BRAND.credentials.name,
  },

  // ---- MEDIA INQUIRY (4 templates) ----
  {
    id: 'mi-01',
    category: 'media-inquiry',
    platform: 'LinkedIn',
    tone: 'professional',
    template: `Thank you for your interest, {{author}}. All media enquiries are handled by ${credential} personally. I will ensure your message reaches Dr Faisal, or you can contact us directly at ${domain}. We appreciate your interest in covering VitalMatrix.`,
    doNots: DO_NOTS['media-inquiry'],
    escalateTo: VM_BRAND.credentials.name,
  },
  {
    id: 'mi-02',
    category: 'media-inquiry',
    platform: 'Instagram',
    tone: 'professional',
    template: `Thanks, {{author}}! Media enquiries go through ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}, directly. Please DM your details and we will connect you.`,
    doNots: DO_NOTS['media-inquiry'],
    escalateTo: VM_BRAND.credentials.name,
  },
  {
    id: 'mi-03',
    category: 'media-inquiry',
    platform: 'Facebook',
    tone: 'professional',
    template: `{{author}}, thank you for reaching out. All media-related enquiries are managed by ${credential}. Please send us a direct message with your details and publication, and we will ensure a prompt response.`,
    doNots: DO_NOTS['media-inquiry'],
    escalateTo: VM_BRAND.credentials.name,
  },
  {
    id: 'mi-04',
    category: 'media-inquiry',
    platform: 'X',
    tone: 'professional',
    template: `{{author}} Media enquiries are managed by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}. Please DM us your details. Thanks for your interest.`,
    doNots: DO_NOTS['media-inquiry'],
    escalateTo: VM_BRAND.credentials.name,
  },

  // ---- SPAM (4 templates) ----
  {
    id: 'sp-01',
    category: 'spam',
    platform: 'LinkedIn',
    tone: 'professional',
    template: '[DO NOT RESPOND. Flag and report. Hide comment if possible.]',
    doNots: DO_NOTS['spam'],
  },
  {
    id: 'sp-02',
    category: 'spam',
    platform: 'Instagram',
    tone: 'professional',
    template: '[DO NOT RESPOND. Delete comment. Block account if repeat offender. Report to platform.]',
    doNots: DO_NOTS['spam'],
  },
  {
    id: 'sp-03',
    category: 'spam',
    platform: 'Facebook',
    tone: 'professional',
    template: '[DO NOT RESPOND. Hide comment. Ban from page if repeat offender. Report to Facebook.]',
    doNots: DO_NOTS['spam'],
  },
  {
    id: 'sp-04',
    category: 'spam',
    platform: 'X',
    tone: 'professional',
    template: '[DO NOT RESPOND. Block and report. Mute if persistent.]',
    doNots: DO_NOTS['spam'],
  },
];

// ---------------------------------------------------------------------------
// Metrics tracking state
// ---------------------------------------------------------------------------

const metricsLog: Map<ResponseCategory, ResponseMetrics> = new Map();

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Retrieves the best matching response template for a given category and platform.
 * @param category - The response category.
 * @param platform - The target platform.
 * @returns The best matching ResponseTemplate.
 */
export function getResponse(
  category: ResponseCategory,
  platform: string,
): ResponseTemplate {
  const match = RESPONSE_TEMPLATES.find(
    (t) =>
      t.category === category &&
      t.platform.toLowerCase() === platform.toLowerCase(),
  );

  if (match) return match;

  // Fallback: same category, any platform
  const fallback = RESPONSE_TEMPLATES.find((t) => t.category === category);
  if (fallback) return fallback;

  throw new Error(
    `No response template found for category "${category}" on platform "${platform}".`,
  );
}

/**
 * Personalises a response template by merging context fields (e.g. author name).
 * @param template - The response template to personalise.
 * @param context - Key-value pairs for field replacement (e.g. { author: "Dr Smith" }).
 * @returns The personalised response string.
 */
export function personaliseResponse(
  template: ResponseTemplate,
  context: Record<string, string>,
): string {
  let result = template.template;
  for (const [key, value] of Object.entries(context)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

/**
 * Auto-categorises an inbound comment and suggests an appropriate response.
 * Uses keyword matching to detect the most likely category.
 * @param comment - The inbound comment to analyse.
 * @param platform - The platform the comment was received on.
 * @returns A SuggestedResponse with detected category and personalised template.
 */
export function generateResponseForComment(
  comment: InboundComment,
  platform: string,
): SuggestedResponse {
  const text = comment.text.toLowerCase();
  const category = categoriseComment(text);
  const template = getResponse(category, platform);
  const personalised = personaliseResponse(template, { author: comment.author });

  return {
    comment,
    detectedCategory: category,
    suggestedTemplate: template,
    personalisedResponse: personalised,
  };
}

/**
 * Generates bulk response suggestions for an array of comments.
 * @param comments - Array of inbound comments.
 * @returns Array of SuggestedResponse records.
 */
export function getBatchResponses(
  comments: InboundComment[],
): SuggestedResponse[] {
  return comments.map((c) => generateResponseForComment(c, c.platform));
}

/**
 * Generates a full markdown playbook for social media engagement responses.
 * @returns A comprehensive markdown-formatted response playbook.
 */
export function generateResponsePlaybook(): string {
  const sections: string[] = [
    '# VitalMatrix Social Media Engagement Playbook',
    '',
    `Prepared by: ${credential}`,
    `Platform: ${descriptor}`,
    `Date: ${new Date().toISOString().split('T')[0]}`,
    '',
    '## General Rules',
    '',
    '1. NEVER diagnose, prescribe, or give clinical advice on social media.',
    '2. NEVER name competitors (K10 compliance).',
    `3. Always use "${descriptor}" as the platform descriptor.`,
    `4. Credentials: ${VM_BRAND.credentials.qualifications} only. Never MD, never FMAARM.`,
    '5. British English throughout. No em dashes.',
    '6. Route partnership and media enquiries to Dr Faisal directly.',
    '7. When in doubt, redirect to a discovery call.',
    '',
  ];

  const categories: ResponseCategory[] = [
    'clinical-question',
    'pricing-inquiry',
    'feature-question',
    'comparison-request',
    'scepticism',
    'praise',
    'partnership-inquiry',
    'media-inquiry',
    'spam',
  ];

  for (const cat of categories) {
    const catLabel = cat
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    sections.push(`## ${catLabel}`);
    sections.push('');

    // Do-nots
    sections.push('### Do Nots');
    const doNots = DO_NOTS[cat];
    for (const d of doNots) {
      sections.push(`- ${d}`);
    }
    sections.push('');

    // Templates
    sections.push('### Templates');
    const templates = RESPONSE_TEMPLATES.filter((t) => t.category === cat);
    for (const t of templates) {
      sections.push(`**${t.id}** (${t.platform}, ${t.tone})`);
      sections.push('');
      sections.push(`> ${t.template}`);
      sections.push('');
      if (t.escalateTo) {
        sections.push(`*Escalate to: ${t.escalateTo}*`);
        sections.push('');
      }
    }
  }

  sections.push('---');
  sections.push(VM_BRAND.regulatoryFooter);
  sections.push(VM_BRAND.tmFooter);

  return sections.join('\n');
}

/**
 * Returns the do-not list for a given response category.
 * @param category - The response category.
 * @returns Array of things NOT to say or do.
 */
export function getDoNots(category: ResponseCategory): string[] {
  return DO_NOTS[category] || [];
}

/**
 * Tracks response effectiveness metrics for a given category.
 * @param category - The response category.
 * @param responded - Whether a response was sent (increments count).
 * @param convertedToLead - Whether the interaction converted to a lead.
 * @returns Updated ResponseMetrics.
 */
export function trackResponseMetrics(
  category: ResponseCategory,
  responded: boolean,
  convertedToLead: boolean,
): ResponseMetrics {
  const existing = metricsLog.get(category) || {
    category,
    totalResponded: 0,
    convertedToLead: 0,
    conversionRate: 0,
  };

  if (responded) {
    existing.totalResponded += 1;
  }
  if (convertedToLead) {
    existing.convertedToLead += 1;
  }
  existing.conversionRate =
    existing.totalResponded > 0
      ? Math.round((existing.convertedToLead / existing.totalResponded) * 100)
      : 0;

  metricsLog.set(category, existing);
  return existing;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Categorises a comment based on keyword matching.
 */
function categoriseComment(text: string): ResponseCategory {
  // Order matters: more specific patterns first
  const patterns: Array<{ category: ResponseCategory; keywords: string[] }> = [
    {
      category: 'spam',
      keywords: [
        'buy now',
        'click here',
        'free money',
        'earn from home',
        'crypto opportunity',
        'dm for details',
        'check my profile',
        'follow back',
      ],
    },
    {
      category: 'media-inquiry',
      keywords: [
        'journalist',
        'press',
        'media',
        'interview',
        'article about',
        'writing about',
        'publication',
        'reporter',
      ],
    },
    {
      category: 'partnership-inquiry',
      keywords: [
        'partner',
        'partnership',
        'collaborate',
        'collaboration',
        'joint venture',
        'affiliate',
        'reseller',
        'white label',
      ],
    },
    {
      category: 'comparison-request',
      keywords: [
        'compare',
        'comparison',
        'versus',
        'vs',
        'better than',
        'different from',
        'alternative to',
        'how does it differ',
      ],
    },
    {
      category: 'pricing-inquiry',
      keywords: [
        'price',
        'pricing',
        'cost',
        'how much',
        'subscription',
        'fee',
        'afford',
        'budget',
        'rate',
        'founding rate',
      ],
    },
    {
      category: 'feature-question',
      keywords: [
        'feature',
        'does it',
        'can it',
        'how does',
        'what does',
        'capability',
        'function',
        'integration',
        'api',
        'dashboard',
      ],
    },
    {
      category: 'scepticism',
      keywords: [
        'sceptical',
        'skeptical',
        'doubt',
        'prove',
        'evidence',
        'questionable',
        'really work',
        'sounds too good',
        'not convinced',
        'snake oil',
      ],
    },
    {
      category: 'praise',
      keywords: [
        'amazing',
        'brilliant',
        'love this',
        'fantastic',
        'excellent',
        'well done',
        'impressive',
        'great work',
        'thank you',
        'wonderful',
        'outstanding',
      ],
    },
    {
      category: 'clinical-question',
      keywords: [
        'patient',
        'clinical',
        'symptom',
        'biomarker',
        'lab',
        'protocol',
        'supplement',
        'deficiency',
        'thyroid',
        'gut',
        'hormone',
        'metabolic',
        'terrain',
        'zone',
      ],
    },
  ];

  for (const { category, keywords } of patterns) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }

  // Default to feature question for unrecognised queries
  return 'feature-question';
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

/** Regulatory footer for engagement responses. */
export const ENGAGEMENT_FOOTER = `${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`;
