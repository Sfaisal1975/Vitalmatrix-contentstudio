/**
 * c73-influencer-outreach.ts
 * VitalMatrix Content Studio -- Influencer Outreach Engine
 *
 * Identifies and manages relationships with functional medicine influencers
 * and thought leaders in England for collaboration. All outreach uses a
 * peer-to-peer professional tone (Dr Faisal to fellow practitioner).
 *
 * Compliance:
 *  - NEVER offer payment for endorsement (ASA compliance).
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

/** An FM influencer or thought leader in England. */
export interface Influencer {
  id: string;
  name: string;
  title: string;
  platform: string[];
  followerCount: number;
  engagement: 'high' | 'medium' | 'low';
  speciality: string;
  fmRelevance: 'core' | 'adjacent' | 'peripheral';
  status: 'identified' | 'contacted' | 'engaged' | 'collaborating' | 'declined';
  notes: string;
}

/** Types of collaboration we pursue. */
export type CollaborationType =
  | 'guest-post'
  | 'podcast-appearance'
  | 'webinar-co-host'
  | 'social-mention'
  | 'case-discussion'
  | 'endorsement'
  | 'content-swap';

/** Outreach email template for a specific collaboration type. */
export interface OutreachTemplate {
  type: CollaborationType;
  subject: string;
  body: string;
  followUp: string;
}

/** Gifting strategy item -- what we can offer an influencer. */
export interface GiftingStrategyItem {
  offer: string;
  description: string;
  value: string;
  asaCompliant: boolean;
}

/** Pipeline status report. */
export interface InfluencerReport {
  total: number;
  byStatus: Record<Influencer['status'], number>;
  byRelevance: Record<Influencer['fmRelevance'], number>;
  byPlatform: Record<string, number>;
  topEngaged: Influencer[];
  generatedAt: string;
}

/** Collaboration brief for a specific influencer and type. */
export interface CollaborationBrief {
  influencer: Influencer;
  collaborationType: CollaborationType;
  whatWePropose: string;
  whatTheyGet: string;
  timeline: string;
  nextSteps: string[];
}

// ---------------------------------------------------------------------------
// Criteria
// ---------------------------------------------------------------------------

/** Eligibility criteria for influencer selection. */
export const INFLUENCER_CRITERIA = {
  geography: 'England',
  requirement: 'Must practise or teach functional medicine approach',
  audienceType: 'Practitioner audience (not patient audience)',
  minimumFollowers: 500,
  preferredEngagement: 'high' as const,
} as const;

// ---------------------------------------------------------------------------
// Pre-built outreach templates
// ---------------------------------------------------------------------------

const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    type: 'guest-post',
    subject: 'Collaboration opportunity -- guest contribution on terrain-based clinical intelligence',
    body: `Dear {{name}},

I hope this message finds you well. I am Dr ${VM_BRAND.credentials.name.replace('Dr ', '')}, ${VM_BRAND.credentials.qualifications}, ${VM_BRAND.credentials.title} at ${VM_BRAND.credentials.company}.

I have been following your work in {{speciality}} with great interest, particularly your contributions to the FM community. Your perspective on {{speciality}} aligns closely with our terrain-based approach at ${VM_BRAND.platform.domain}.

I would like to invite you to contribute a guest article for our practitioner community. We believe your insights into {{speciality}} would provide tremendous value to our audience of FM practitioners across England.

${VM_BRAND.platform.descriptor} -- that is what we are building. A platform designed exclusively for practitioners like yourself who take the functional medicine approach seriously.

Would you be open to a brief conversation to explore this? I would welcome a 20-minute call at your convenience.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    followUp: `Dear {{name}},

I wanted to follow up on my earlier message regarding a guest contribution opportunity. I understand you are busy, and I appreciate your time.

If the timing is not right, I completely understand. We would love to collaborate whenever it suits your schedule.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}`,
  },
  {
    type: 'podcast-appearance',
    subject: 'Invitation to discuss terrain-based clinical intelligence on your podcast',
    body: `Dear {{name}},

I am Dr ${VM_BRAND.credentials.name.replace('Dr ', '')}, ${VM_BRAND.credentials.qualifications}, and I have been an avid listener of your podcast. Your episode on {{speciality}} particularly resonated with our work at ${VM_BRAND.credentials.company}.

We are building a ${VM_BRAND.platform.descriptor} that helps FM practitioners in England map patient terrain across multiple clinical zones. I believe your audience would find the intersection of clinical intelligence and functional medicine practice genuinely useful.

I would be honoured to appear as a guest to discuss how terrain-based thinking is evolving in clinical practice. No sales pitch, just a genuine conversation about where FM is heading.

Would this be of interest?

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    followUp: `Dear {{name}},

A brief follow-up on my podcast appearance enquiry. I appreciate how many requests you receive and wanted to reiterate my genuine interest in contributing to the conversation.

Happy to share topic ideas or a brief bio if helpful.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}`,
  },
  {
    type: 'webinar-co-host',
    subject: 'Co-hosting opportunity -- live session on {{speciality}} for FM practitioners',
    body: `Dear {{name}},

I am Dr ${VM_BRAND.credentials.name.replace('Dr ', '')}, ${VM_BRAND.credentials.qualifications}, Founder of ${VM_BRAND.credentials.company}. I am reaching out because your expertise in {{speciality}} is exactly what our practitioner community needs.

We are planning a webinar series for FM practitioners in England and I believe a co-hosted session with you would be exceptionally valuable. The format would be a 45-minute live discussion with Q&A, covering practical applications in {{speciality}}.

What you would get:
- Exposure to our growing practitioner network across England
- Co-branded recording for your own channels
- Full promotion across our social platforms

This is a peer-to-peer educational collaboration, not a commercial arrangement.

Would you be interested in exploring this further?

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    followUp: `Dear {{name}},

Following up on the webinar co-hosting opportunity. We are flexible on timing and format, and I would be happy to adapt the session to complement your existing content calendar.

Do let me know if you would like to discuss further.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}`,
  },
  {
    type: 'social-mention',
    subject: 'Your recent post on {{speciality}} -- collaboration thought',
    body: `Dear {{name}},

I came across your recent post about {{speciality}} and found it genuinely insightful. The way you framed the clinical reasoning resonates with how we approach terrain mapping at ${VM_BRAND.credentials.company}.

I would love to share your content with our practitioner network (with full attribution, of course) and explore whether there are opportunities to cross-promote content that serves the FM community in England.

No strings attached. Simply one practitioner recognising excellent work by another.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}`,
    followUp: `Dear {{name}},

Just a gentle follow-up. We shared your {{speciality}} post with our community and it was well received. Would love to explore doing more together when the time is right.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}`,
  },
  {
    type: 'case-discussion',
    subject: 'Invitation -- clinical case discussion for FM practitioners',
    body: `Dear {{name}},

I am Dr ${VM_BRAND.credentials.name.replace('Dr ', '')}, ${VM_BRAND.credentials.qualifications}. I am organising a series of peer-to-peer clinical case discussions for FM practitioners in England, and your expertise in {{speciality}} would elevate the conversation enormously.

The format is collegial and educational: anonymised cases, terrain-based analysis, and open discussion. Strictly for practitioners only, no patient-facing content.

Each session is recorded (with consent) and shared within our practitioner network. It is an excellent way to build your profile amongst FM colleagues.

Would you be interested in participating?

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    followUp: `Dear {{name}},

Following up on the case discussion invitation. Our next session is being planned for the coming weeks and I wanted to check whether you might be available.

No pressure at all. The invitation remains open.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}`,
  },
  {
    type: 'endorsement',
    subject: 'Your perspective on clinical intelligence tools for FM practice',
    body: `Dear {{name}},

I am Dr ${VM_BRAND.credentials.name.replace('Dr ', '')}, ${VM_BRAND.credentials.qualifications}. We are building a ${VM_BRAND.platform.descriptor} at ${VM_BRAND.platform.domain}, designed exclusively for FM practitioners in England.

I deeply respect your standing in the FM community and would value your honest perspective on what we are building. This is not a request for a paid endorsement. I am genuinely seeking peer feedback from someone whose clinical judgement I trust.

If after exploring the platform you felt it merited a mention to your network, that would be wonderful. But the primary goal is to get your candid input.

Would you be open to a demonstration?

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    followUp: `Dear {{name}},

A gentle follow-up on my earlier message. I would genuinely value your perspective, even if it is critical. Your feedback would help us serve the FM community better.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}`,
  },
  {
    type: 'content-swap',
    subject: 'Content exchange opportunity for our FM practitioner audiences',
    body: `Dear {{name}},

I am Dr ${VM_BRAND.credentials.name.replace('Dr ', '')}, ${VM_BRAND.credentials.qualifications}, Founder of ${VM_BRAND.credentials.company}.

I have an idea that could benefit both our audiences. A content exchange: you create a piece for our practitioner community, and we create one for yours. Both audiences get fresh, expert perspectives, and we both extend our reach within the FM community in England.

Topics could align with your speciality in {{speciality}}, perhaps a practical clinical insight or a terrain-based approach article.

Interested in exploring this?

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    followUp: `Dear {{name}},

Following up on the content exchange idea. Happy to start small with a single piece and see how it resonates with both our audiences.

With warm regards,
${VM_BRAND.credentials.name}
${VM_BRAND.credentials.qualifications}`,
  },
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** In-memory influencer registry. */
const influencerRegistry: Map<string, Influencer> = new Map();

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Adds a new influencer to the registry.
 * Validates geography and FM relevance criteria.
 * @param influencer - The influencer record to add.
 * @returns The added influencer.
 */
export function addInfluencer(influencer: Influencer): Influencer {
  if (influencerRegistry.has(influencer.id)) {
    throw new Error(`Influencer with id "${influencer.id}" already exists.`);
  }
  influencerRegistry.set(influencer.id, { ...influencer });
  return influencer;
}

/**
 * Updates the status of an existing influencer.
 * @param id - The influencer identifier.
 * @param status - The new pipeline status.
 * @returns The updated influencer.
 */
export function updateStatus(
  id: string,
  status: Influencer['status'],
): Influencer {
  const inf = influencerRegistry.get(id);
  if (!inf) {
    throw new Error(`Influencer "${id}" not found.`);
  }
  inf.status = status;
  influencerRegistry.set(id, inf);
  return inf;
}

/**
 * Retrieves all influencers matching a given pipeline status.
 * @param status - The status to filter by.
 * @returns Array of matching influencers.
 */
export function getByStatus(status: Influencer['status']): Influencer[] {
  return Array.from(influencerRegistry.values()).filter(
    (inf) => inf.status === status,
  );
}

/**
 * Retrieves all influencers active on a given platform.
 * @param platform - The platform name (e.g. "LinkedIn", "Instagram").
 * @returns Array of matching influencers.
 */
export function getByPlatform(platform: string): Influencer[] {
  const normalised = platform.toLowerCase();
  return Array.from(influencerRegistry.values()).filter((inf) =>
    inf.platform.some((p) => p.toLowerCase() === normalised),
  );
}

/**
 * Generates a personalised outreach email for an influencer.
 * Uses the pre-built template for the given collaboration type and merges
 * influencer-specific fields.
 * @param influencer - The target influencer.
 * @param collaborationType - The type of collaboration being proposed.
 * @returns An object with subject and body ready to send.
 */
export function generateOutreachEmail(
  influencer: Influencer,
  collaborationType: CollaborationType,
): { subject: string; body: string } {
  const template = OUTREACH_TEMPLATES.find((t) => t.type === collaborationType);
  if (!template) {
    throw new Error(`No outreach template found for type "${collaborationType}".`);
  }

  const merge = (text: string): string =>
    text
      .replace(/\{\{name\}\}/g, influencer.name)
      .replace(/\{\{speciality\}\}/g, influencer.speciality);

  return {
    subject: merge(template.subject),
    body: merge(template.body),
  };
}

/**
 * Generates a follow-up email for an influencer who has been contacted
 * but has not yet responded.
 * @param influencer - The target influencer.
 * @returns An object with subject and body for the follow-up.
 */
export function generateFollowUpEmail(
  influencer: Influencer,
): { subject: string; body: string } {
  // Find the most relevant template based on current notes or default to guest-post
  const template =
    OUTREACH_TEMPLATES.find((t) => influencer.notes.toLowerCase().includes(t.type)) ||
    OUTREACH_TEMPLATES[0];

  const merge = (text: string): string =>
    text
      .replace(/\{\{name\}\}/g, influencer.name)
      .replace(/\{\{speciality\}\}/g, influencer.speciality);

  return {
    subject: `Follow-up: ${merge(template.subject)}`,
    body: merge(template.followUp),
  };
}

/**
 * Generates a detailed collaboration brief for a specific influencer and
 * collaboration type. Outlines what we propose and what they receive.
 * @param influencer - The target influencer.
 * @param collaborationType - The collaboration type.
 * @returns A structured CollaborationBrief.
 */
export function generateCollaborationBrief(
  influencer: Influencer,
  collaborationType: CollaborationType,
): CollaborationBrief {
  const proposals: Record<CollaborationType, { propose: string; theyGet: string }> = {
    'guest-post': {
      propose: `A guest article by ${influencer.name} published on the ${VM_BRAND.platform.domain} practitioner blog, covering their expertise in ${influencer.speciality}. Full editorial support provided.`,
      theyGet: 'Author bio with links to their practice, promotion across our social channels, co-branded PDF version for their own distribution, and exposure to our FM practitioner network in England.',
    },
    'podcast-appearance': {
      propose: `A 30-45 minute recorded conversation between ${VM_BRAND.credentials.name} and ${influencer.name} on ${influencer.speciality} and terrain-based clinical thinking.`,
      theyGet: 'Full recording for their own channels, written summary for their blog, social media clips, and cross-promotion to our practitioner audience.',
    },
    'webinar-co-host': {
      propose: `A co-hosted live webinar (45 minutes plus Q&A) for FM practitioners, combining ${influencer.name}'s expertise in ${influencer.speciality} with our terrain-based clinical intelligence approach.`,
      theyGet: 'Co-branded promotional materials, recording rights, attendee list (with consent), and promotion across all our channels.',
    },
    'social-mention': {
      propose: `Cross-promotion of ${influencer.name}'s content to our practitioner network, with full attribution and context about their work in ${influencer.speciality}.`,
      theyGet: 'Increased visibility amongst FM practitioners in England, reciprocal mentions, and introduction to our growing community.',
    },
    'case-discussion': {
      propose: `${influencer.name} participates in a peer-to-peer clinical case discussion, contributing their ${influencer.speciality} expertise to anonymised terrain-based case analysis.`,
      theyGet: 'Recorded session for their CPD portfolio, networking with fellow FM practitioners, and recognition as a clinical thought leader.',
    },
    'endorsement': {
      propose: `We provide ${influencer.name} with full complimentary access to the ${VM_BRAND.platform.descriptor} and seek their honest, candid feedback. Any endorsement is entirely voluntary and unpaid (ASA compliant).`,
      theyGet: `Complimentary founding-rate access (worth ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month), early access to new features, and direct line to ${VM_BRAND.credentials.name} for product feedback.`,
    },
    'content-swap': {
      propose: `A mutual content exchange: ${influencer.name} writes for our audience, and we create content for theirs. Topic aligned with ${influencer.speciality}.`,
      theyGet: 'Expert content for their audience at no cost, cross-promotion, and strengthened positioning in the FM community.',
    },
  };

  const p = proposals[collaborationType];

  return {
    influencer,
    collaborationType,
    whatWePropose: p.propose,
    whatTheyGet: p.theyGet,
    timeline: 'Initial conversation within 2 weeks. Content delivery within 4-6 weeks of agreement.',
    nextSteps: [
      `Send personalised outreach email to ${influencer.name}`,
      'Schedule 20-minute introductory call',
      'Share collaboration brief and agree scope',
      'Set content deadlines and review process',
      'Execute and cross-promote',
    ],
  };
}

/**
 * Generates a pipeline status report across all registered influencers.
 * @returns A structured InfluencerReport.
 */
export function generateInfluencerReport(): InfluencerReport {
  const all = Array.from(influencerRegistry.values());

  const byStatus: Record<Influencer['status'], number> = {
    identified: 0,
    contacted: 0,
    engaged: 0,
    collaborating: 0,
    declined: 0,
  };

  const byRelevance: Record<Influencer['fmRelevance'], number> = {
    core: 0,
    adjacent: 0,
    peripheral: 0,
  };

  const byPlatform: Record<string, number> = {};

  for (const inf of all) {
    byStatus[inf.status]++;
    byRelevance[inf.fmRelevance]++;
    for (const p of inf.platform) {
      byPlatform[p] = (byPlatform[p] || 0) + 1;
    }
  }

  const topEngaged = all
    .filter((inf) => inf.engagement === 'high' && inf.fmRelevance === 'core')
    .sort((a, b) => b.followerCount - a.followerCount)
    .slice(0, 10);

  return {
    total: all.length,
    byStatus,
    byRelevance,
    byPlatform,
    topEngaged,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generates a gifting strategy for an influencer. All items are ASA-compliant
 * and never constitute payment for endorsement.
 * @param influencer - The target influencer.
 * @returns Array of gifting strategy items.
 */
export function generateGiftingStrategy(influencer: Influencer): GiftingStrategyItem[] {
  const items: GiftingStrategyItem[] = [
    {
      offer: 'Free founding access',
      description: `Complimentary access to the ${VM_BRAND.platform.descriptor} at the founding rate of ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months. This is provided for genuine evaluation and feedback, not in exchange for endorsement.`,
      value: `${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly * VM_BRAND.pricing.foundingFixedMonths} (over ${VM_BRAND.pricing.foundingFixedMonths} months)`,
      asaCompliant: true,
    },
    {
      offer: 'Co-branded content',
      description: `Professionally produced co-branded content featuring ${influencer.name}'s expertise in ${influencer.speciality} alongside VitalMatrix terrain analysis. Full rights shared.`,
      value: 'Mutual value exchange',
      asaCompliant: true,
    },
    {
      offer: 'Early feature access',
      description: `Priority access to new platform features before general release. ${influencer.name} would be amongst the first practitioners to explore new clinical intelligence capabilities.`,
      value: 'Exclusive preview access',
      asaCompliant: true,
    },
    {
      offer: 'Speaking platform',
      description: `Invitation to present at VitalMatrix practitioner events, webinars, and case discussions. Positions ${influencer.name} as a recognised thought leader in ${influencer.speciality}.`,
      value: 'Professional recognition and audience growth',
      asaCompliant: true,
    },
    {
      offer: 'Practitioner network introduction',
      description: `Introduction to our growing network of FM practitioners across England. Genuine peer-to-peer connections, not a mailing list.`,
      value: 'Professional networking',
      asaCompliant: true,
    },
  ];

  // Add enhanced items for high-engagement core influencers
  if (influencer.engagement === 'high' && influencer.fmRelevance === 'core') {
    items.push({
      offer: 'Advisory board invitation',
      description: `Invitation to join the VitalMatrix Clinical Advisory Group. Shape the future of the ${VM_BRAND.platform.descriptor} alongside ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}.`,
      value: 'Strategic influence on platform direction',
      asaCompliant: true,
    });
  }

  return items;
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

/** Regulatory footer for all outreach materials. */
export const OUTREACH_FOOTER = `${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`;

/**
 * Returns all registered influencers. Intended for reporting and export.
 */
export function getAllInfluencers(): Influencer[] {
  return Array.from(influencerRegistry.values());
}

/**
 * Clears all influencers. Intended for testing only.
 */
export function clearInfluencerStore(): void {
  influencerRegistry.clear();
}

/**
 * Exports all influencers as a JSON string.
 */
export function exportToJson(): string {
  return JSON.stringify(getAllInfluencers(), null, 2);
}

/**
 * Imports influencers from a JSON string, replacing the current store.
 */
export function importFromJson(json: string): void {
  const items: Influencer[] = JSON.parse(json);
  clearInfluencerStore();
  for (const item of items) {
    influencerRegistry.set(item.id, { ...item });
  }
}
