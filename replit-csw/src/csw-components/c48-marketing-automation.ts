/**
 * Component 48: Marketing Automation
 *
 * Email sequence automation and marketing funnel management for the
 * VitalMatrix founding cohort launch. Pre-built sequences for welcome,
 * discovery call follow-up, inactive re-engagement, referral programme,
 * and milestone celebration. All emails include the regulatory footer
 * and are strictly practitioner-facing (B2B).
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Triggers that initiate an email sequence */
export type SequenceTrigger =
  | 'signup'
  | 'discovery-call-booked'
  | 'discovery-call-completed'
  | 'trial-started'
  | 'inactive-7d'
  | 'inactive-14d'
  | 'inactive-30d'
  | 'milestone-reached'
  | 'referral-invited';

/** Sequence lifecycle status */
export type SequenceStatus = 'active' | 'paused' | 'draft';

/** Funnel stage name */
export type FunnelStageName =
  | 'awareness'
  | 'interest'
  | 'consideration'
  | 'decision'
  | 'onboarding'
  | 'retention';

/** A single email within a sequence */
export interface SequenceEmail {
  dayOffset: number;
  subject: string;
  body: string;
  cta: string;
  sendCondition?: string;
}

/** An automated email sequence triggered by a specific event */
export interface EmailSequence {
  id: string;
  name: string;
  trigger: SequenceTrigger;
  emails: SequenceEmail[];
  status: SequenceStatus;
}

/** A single stage in the marketing funnel */
export interface FunnelStage {
  name: FunnelStageName;
  content: string[];
  conversionTrigger: string;
  targetConversionRate: number;
}

/** The complete marketing funnel */
export interface MarketingFunnel {
  stages: FunnelStage[];
}

/** Funnel conversion report entry */
export interface FunnelReportEntry {
  stage: FunnelStageName;
  targetRate: number;
  content: string[];
  conversionTrigger: string;
}

// --- Constants ---

const CREDS = VM_BRAND.credentials;
const DOMAIN = VM_BRAND.platform.domain;
const PRICE = `GBP ${VM_BRAND.pricing.foundingMonthly}/month`;
const REG_FOOTER = `\n\n---\n${VM_BRAND.regulatoryFooter}`;
const SIGN_OFF = `\n\nWarm regards,\n${CREDS.name}, ${CREDS.qualifications}\n${CREDS.title}, ${CREDS.company}`;

// --- Pre-built Sequences ---

/**
 * Welcome sequence: 5 emails over 14 days.
 * Introduces the platform, builds trust, and guides to discovery call.
 */
function buildWelcomeSequence(): EmailSequence {
  return {
    id: 'seq-welcome',
    name: 'Welcome Sequence',
    trigger: 'signup',
    status: 'active',
    emails: [
      {
        dayOffset: 0,
        subject: `Welcome to VitalMatrix -- your ${VM_BRAND.platform.descriptor}`,
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `Thank you for your interest in VitalMatrix. I built this ${VM_BRAND.platform.descriptor} because I believe practitioners deserve better tools -- ones that reveal the clinical connections that matter most.`,
          ``,
          `Over the next two weeks, I will share how VitalMatrix can transform your clinical workflow. But first, a quick overview of what you have access to:`,
          ``,
          `- Terrain-level mapping across 7 nodes and 5 zones`,
          `- Evidence-tiered clinical insights`,
          `- Personalised intake-to-analysis pipelines`,
          ``,
          `If you have any questions, reply directly to this email.`,
          SIGN_OFF,
        ].join('\n'),
        cta: `Explore VitalMatrix: https://${DOMAIN}`,
      },
      {
        dayOffset: 2,
        subject: 'How VitalMatrix maps clinical connections',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `Most clinical tools show you data in silos. VitalMatrix connects the dots.`,
          ``,
          `Our 7-node architecture maps relationships between metabolic, hormonal, neurological, immunological, and structural systems. Each connection is evidence-tiered, so you always know the strength of the underlying research.`,
          ``,
          `This is not a diagnostic tool -- it is an intelligence layer that helps you see patterns faster and with greater confidence.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'See the architecture in action',
      },
      {
        dayOffset: 5,
        subject: 'What founding practitioners are saying',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `Our founding cohort of 10 practitioners is already exploring how terrain-level mapping changes their clinical thinking.`,
          ``,
          `The founding rate of ${PRICE} is fixed for ${VM_BRAND.pricing.foundingFixedMonths} months -- compared to the standard rate of GBP ${VM_BRAND.pricing.standardRate}/month. This rate is guaranteed for all founding members.`,
          ``,
          `Would a 20-minute discovery call be useful? I would welcome the chance to walk you through the platform personally.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Book a Discovery Call',
      },
      {
        dayOffset: 9,
        subject: 'A clinical scenario: connecting the dots across zones',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `Imagine a practitioner analysing a complex case. Gut-immune-hormonal connections are flagged automatically. Evidence tiers are shown for each link. The clinical picture emerges faster.`,
          ``,
          `That is what VitalMatrix does -- it is terrain medicine, systematised and evidence-graded. No guesswork. No diagnostic claims. Just better visibility.`,
          ``,
          `I would love to show you how this works with your own clinical scenarios.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Book a Discovery Call',
      },
      {
        dayOffset: 14,
        subject: 'Your founding spot is still available',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `I wanted to follow up one final time. Your founding spot at ${PRICE} (fixed for ${VM_BRAND.pricing.foundingFixedMonths} months) is still available, but the cohort is limited to 10 practitioners.`,
          ``,
          `If the timing is not right, I completely understand. You are welcome to reach out whenever you are ready.`,
          ``,
          `If you would like to explore further, a 20-minute discovery call is the best next step.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Book a Discovery Call',
        sendCondition: 'has_not_booked_discovery_call',
      },
    ],
  };
}

/**
 * Discovery call follow-up: 3 emails after call completion.
 */
function buildDiscoveryCallFollowup(): EmailSequence {
  return {
    id: 'seq-discovery-followup',
    name: 'Discovery Call Follow-up',
    trigger: 'discovery-call-completed',
    status: 'active',
    emails: [
      {
        dayOffset: 0,
        subject: 'Thank you for your time today',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `Thank you for taking the time to explore VitalMatrix today. I enjoyed our conversation and hearing about your practice.`,
          ``,
          `As discussed, here is a summary of the key points:`,
          ``,
          `- Founding rate: ${PRICE}, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months`,
          `- Full access to all ${VM_BRAND.platform.descriptor} features`,
          `- Priority support and direct access to the development roadmap`,
          ``,
          `Please do not hesitate to reach out with any questions.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Secure Your Founding Spot',
      },
      {
        dayOffset: 3,
        subject: 'Following up on your VitalMatrix discovery call',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `I wanted to check whether you had any further questions after our call. I am happy to arrange a brief follow-up or provide additional information about any aspect of the platform.`,
          ``,
          `The founding cohort is limited to 10 practitioners, and I want to ensure you have everything you need to make the right decision for your practice.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Reply with Questions',
        sendCondition: 'has_not_converted',
      },
      {
        dayOffset: 7,
        subject: 'Your founding spot -- final follow-up',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `This is my final follow-up regarding the founding cohort. The ${PRICE} rate is guaranteed for ${VM_BRAND.pricing.foundingFixedMonths} months, and spots are limited.`,
          ``,
          `If the timing is not right, I understand completely. You are welcome to join at the standard rate of GBP ${VM_BRAND.pricing.standardRate}/month whenever you are ready.`,
          ``,
          `Thank you again for your interest in VitalMatrix.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Join the Founding Cohort',
        sendCondition: 'has_not_converted',
      },
    ],
  };
}

/**
 * Inactive re-engagement: 3 emails with escalating urgency.
 */
function buildInactiveReengagement(): EmailSequence {
  return {
    id: 'seq-inactive-reengagement',
    name: 'Inactive Re-engagement',
    trigger: 'inactive-7d',
    status: 'active',
    emails: [
      {
        dayOffset: 0,
        subject: 'We have missed you on VitalMatrix',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `I noticed you have not logged in recently. Is there anything I can help with? Sometimes a quick walkthrough of a specific feature can make all the difference.`,
          ``,
          `Here are a few things you might find useful:`,
          ``,
          `- Run an intake analysis on a current case`,
          `- Explore the terrain map for a specific zone`,
          `- Review evidence-tiered connections for a clinical question`,
          ``,
          `I am here to help.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Log in to VitalMatrix',
      },
      {
        dayOffset: 7,
        subject: 'A new feature you might have missed',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `We have been adding new capabilities to VitalMatrix. As a founding member, you have full access to everything -- including features that were not available when you last visited.`,
          ``,
          `Would a brief catch-up call be helpful? I can walk you through what is new and how it applies to your practice.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Schedule a Catch-up',
        sendCondition: 'still_inactive',
      },
      {
        dayOffset: 21,
        subject: 'Is VitalMatrix still right for your practice?',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `I want to be direct: if VitalMatrix is not meeting your needs, I would genuinely like to know why. Your feedback as a founding member is invaluable.`,
          ``,
          `Could you spare 10 minutes for a candid conversation? Whether you continue or not, your insights will help shape the platform for every practitioner who follows.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Share Your Feedback',
        sendCondition: 'still_inactive',
      },
    ],
  };
}

/**
 * Referral programme: 3 emails encouraging practitioner referrals.
 */
function buildReferralProgramme(): EmailSequence {
  return {
    id: 'seq-referral',
    name: 'Referral Programme',
    trigger: 'referral-invited',
    status: 'active',
    emails: [
      {
        dayOffset: 0,
        subject: 'Know a colleague who would benefit from VitalMatrix?',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `As a founding member, you are part of a select group of practitioners shaping the future of terrain-based clinical intelligence.`,
          ``,
          `If you know a colleague who would benefit from VitalMatrix, I would welcome an introduction. Founding spots are limited, and personal referrals help us ensure the right practitioners join the cohort.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Refer a Colleague',
      },
      {
        dayOffset: 7,
        subject: 'Your referral makes a difference',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `A quick reminder: if you have a colleague in mind, a simple introduction email is all it takes. I will handle the rest and ensure they receive a personal walkthrough.`,
          ``,
          `Every founding member has been hand-selected, and your recommendation carries significant weight.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Make an Introduction',
        sendCondition: 'has_not_referred',
      },
      {
        dayOffset: 14,
        subject: 'Thank you for being part of the VitalMatrix community',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `Whether or not you have referred a colleague, I want you to know how much I value your membership in the founding cohort. Your clinical insights and feedback are shaping VitalMatrix every day.`,
          ``,
          `If a referral opportunity arises in future, the invitation is always open.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'Continue Exploring VitalMatrix',
      },
    ],
  };
}

/**
 * Milestone celebration: triggered when a practitioner reaches
 * a significant usage milestone (from C37).
 */
function buildMilestoneCelebration(): EmailSequence {
  return {
    id: 'seq-milestone',
    name: 'Milestone Celebration',
    trigger: 'milestone-reached',
    status: 'active',
    emails: [
      {
        dayOffset: 0,
        subject: 'Congratulations -- you have reached a milestone on VitalMatrix',
        body: [
          `Dear {{practitionerName}},`,
          ``,
          `I wanted to personally acknowledge your progress. You have reached a significant milestone in your use of VitalMatrix:`,
          ``,
          `{{milestoneDescription}}`,
          ``,
          `This reflects genuine engagement with terrain-level clinical intelligence. I hope the platform continues to add value to your practice.`,
          SIGN_OFF,
        ].join('\n'),
        cta: 'View Your Progress Dashboard',
      },
    ],
  };
}

// --- Sequence Registry ---

const SEQUENCE_REGISTRY: Record<SequenceTrigger, () => EmailSequence> = {
  'signup': buildWelcomeSequence,
  'discovery-call-booked': buildDiscoveryCallFollowup,
  'discovery-call-completed': buildDiscoveryCallFollowup,
  'trial-started': buildWelcomeSequence,
  'inactive-7d': buildInactiveReengagement,
  'inactive-14d': buildInactiveReengagement,
  'inactive-30d': buildInactiveReengagement,
  'milestone-reached': buildMilestoneCelebration,
  'referral-invited': buildReferralProgramme,
};

// --- Default Funnel ---

/** The standard VitalMatrix marketing funnel */
export const DEFAULT_FUNNEL: MarketingFunnel = {
  stages: [
    {
      name: 'awareness',
      content: [
        'LinkedIn thought-leadership posts',
        'Blog articles on terrain medicine',
        'Conference and webinar appearances',
        'SEO-optimised landing pages',
      ],
      conversionTrigger: 'Visits website or engages with social content',
      targetConversionRate: 0.05,
    },
    {
      name: 'interest',
      content: [
        'Email sign-up via lead magnet',
        'Welcome email sequence (5 emails)',
        'Platform overview video',
        'Case study downloads',
      ],
      conversionTrigger: 'Signs up for email list or downloads resource',
      targetConversionRate: 0.15,
    },
    {
      name: 'consideration',
      content: [
        'Discovery call invitation',
        'Detailed feature comparison',
        'Founding cohort pricing page',
        'Testimonial and social proof content',
      ],
      conversionTrigger: 'Books a discovery call',
      targetConversionRate: 0.25,
    },
    {
      name: 'decision',
      content: [
        'Discovery call follow-up sequence',
        'Personalised proposal',
        'ROI analysis for their practice',
        'Founding rate guarantee details',
      ],
      conversionTrigger: 'Commits to founding membership',
      targetConversionRate: 0.40,
    },
    {
      name: 'onboarding',
      content: [
        'Welcome and setup guide',
        'First-case walkthrough',
        'Zone-by-zone tutorial series',
        'Direct support channel access',
      ],
      conversionTrigger: 'Completes first full analysis',
      targetConversionRate: 0.80,
    },
    {
      name: 'retention',
      content: [
        'Milestone celebrations',
        'Feature update announcements',
        'Re-engagement sequences for inactivity',
        'Referral programme invitations',
      ],
      conversionTrigger: 'Sustained monthly usage for 3+ months',
      targetConversionRate: 0.85,
    },
  ],
};

// --- Core Functions ---

/**
 * Retrieve a pre-built email sequence for a given trigger.
 *
 * @param trigger - The event that initiates the sequence
 * @returns The pre-built EmailSequence
 */
export function getSequence(trigger: SequenceTrigger): EmailSequence {
  const builder = SEQUENCE_REGISTRY[trigger];
  return builder();
}

/**
 * Customise a sequence by replacing the {{practitionerName}} placeholder
 * with the actual practitioner's name.
 *
 * @param sequence - The base email sequence
 * @param practitionerName - Name to personalise with
 * @returns A new EmailSequence with personalised content
 */
export function customiseSequence(
  sequence: EmailSequence,
  practitionerName: string,
): EmailSequence {
  return {
    ...sequence,
    id: `${sequence.id}-custom`,
    emails: sequence.emails.map((email) => ({
      ...email,
      subject: email.subject.replace(/\{\{practitionerName\}\}/g, practitionerName),
      body: email.body.replace(/\{\{practitionerName\}\}/g, practitionerName),
    })),
  };
}

/**
 * Generate a funnel conversion analysis report in Markdown.
 *
 * @param funnel - The marketing funnel to analyse
 * @returns Markdown-formatted funnel report
 */
export function generateFunnelReport(funnel: MarketingFunnel): string {
  const lines: string[] = [
    '# VitalMatrix Marketing Funnel Report',
    '',
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    `**Platform:** ${VM_BRAND.platform.descriptor}`,
    '',
    '## Funnel Stages',
    '',
  ];

  let cumulativeRate = 1.0;

  for (const stage of funnel.stages) {
    cumulativeRate *= stage.targetConversionRate;
    lines.push(`### ${stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}`);
    lines.push('');
    lines.push(`**Target conversion rate:** ${(stage.targetConversionRate * 100).toFixed(1)}%`);
    lines.push(`**Cumulative rate:** ${(cumulativeRate * 100).toFixed(3)}%`);
    lines.push(`**Conversion trigger:** ${stage.conversionTrigger}`);
    lines.push('');
    lines.push('Content:');
    for (const item of stage.content) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  lines.push('## Summary');
  lines.push('');
  lines.push(`If 1,000 practitioners enter at awareness, approximately ${Math.round(cumulativeRate * 1000)} would reach retention.`);
  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generate a rendered email preview with placeholder substitution.
 * Includes the regulatory footer automatically.
 *
 * @param email - The SequenceEmail to preview
 * @param practitionerName - Name for personalisation
 * @returns Rendered email text ready for review
 */
export function generateEmailPreview(
  email: SequenceEmail,
  practitionerName: string,
): string {
  const subject = email.subject.replace(/\{\{practitionerName\}\}/g, practitionerName);
  const body = email.body.replace(/\{\{practitionerName\}\}/g, practitionerName);

  const lines: string[] = [
    `Subject: ${subject}`,
    '',
    body,
    '',
    `[${email.cta}]`,
    REG_FOOTER,
  ];

  if (email.sendCondition) {
    lines.push('');
    lines.push(`(Send condition: ${email.sendCondition})`);
  }

  return lines.join('\n');
}
