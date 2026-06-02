/**
 * c69-retargeting-content-engine.ts
 * VitalMatrix Content Studio — Retargeting Content Engine
 *
 * Generates personalised retargeting ad copy based on a prospect's
 * previous interactions with VitalMatrix touchpoints (website, quiz,
 * lead magnets, pricing page, discovery call page, emails, ads).
 *
 * K7: credentials locked (MBBS, FAAMFM).
 * K8: British English throughout.
 * K10: ZERO competitor names.
 *
 * (c) VitalMatrix Ltd 2026. All rights reserved.
 */

import { VM_BRAND } from './brand-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Evidence tier re-export for clinical claim tagging. */
export type EvidenceTier = typeof VM_BRAND.evidenceTiers[number];

/** The interaction that triggered retargeting. */
export type RetargetingTrigger =
  | 'website-visit'
  | 'quiz-started-not-completed'
  | 'quiz-completed'
  | 'lead-magnet-downloaded'
  | 'pricing-page-viewed'
  | 'discovery-call-page-viewed-not-booked'
  | 'email-opened-not-clicked'
  | 'ad-clicked-no-action';

/** Urgency level for retargeting creative. */
export type UrgencyLevel = 'low' | 'medium' | 'high';

/** A single retargeting ad unit. */
export interface RetargetingAd {
  /** The interaction that triggered this ad. */
  trigger: RetargetingTrigger;
  /** Ad headline. */
  headline: string;
  /** Ad body copy. */
  body: string;
  /** Call-to-action button text. */
  cta: string;
  /** Urgency level controlling scarcity language. */
  urgency: UrgencyLevel;
  /** Target ad platform. */
  platform: string;
  /** Dynamic personalisation merge fields used. */
  personalisation: string[];
}

/** A multi-touch retargeting sequence. */
export interface RetargetingSequence {
  /** The initial trigger. */
  trigger: RetargetingTrigger;
  /** Ordered ads in the sequence. */
  ads: RetargetingAd[];
  /** Days after trigger to show each ad. */
  dayOffsets: number[];
}

// ---------------------------------------------------------------------------
// Pre-built ad templates
// ---------------------------------------------------------------------------

const CURRENCY = VM_BRAND.pricing.currency;
const PRICE = VM_BRAND.pricing.foundingMonthly;

function buildAd(
  trigger: RetargetingTrigger,
  headline: string,
  body: string,
  cta: string,
  urgency: UrgencyLevel,
  platform: string,
  personalisation: string[] = [],
): RetargetingAd {
  return { trigger, headline, body, cta, urgency, platform, personalisation };
}

// ---------------------------------------------------------------------------
// Pre-built sequences
// ---------------------------------------------------------------------------

const PRE_BUILT_SEQUENCES: Record<string, () => RetargetingSequence> = {
  'quiz-started-not-completed': () => ({
    trigger: 'quiz-started-not-completed',
    ads: [
      buildAd(
        'quiz-started-not-completed',
        'You were exploring your clinical zones.',
        'You started the 5-Zone Clinical Assessment Quiz but did not finish. Your partial results are waiting. ' +
          'It takes less than 3 minutes to complete.',
        'Complete your quiz',
        'low',
        'facebook',
        ['quiz_progress_percentage'],
      ),
      buildAd(
        'quiz-started-not-completed',
        'Still curious about your zones?',
        'Practitioners who complete the quiz discover which of the 5 clinical zones dominates their caseload. ' +
          'Finish yours and see your result.',
        'See my result',
        'medium',
        'facebook',
        ['quiz_progress_percentage'],
      ),
      buildAd(
        'quiz-started-not-completed',
        'Your zone result is one click away.',
        'You are {{quiz_progress_percentage}}% through. Complete the quiz now and find out which zone ' +
          'shapes your clinical approach.',
        'Finish the quiz',
        'medium',
        'instagram',
        ['quiz_progress_percentage'],
      ),
    ],
    dayOffsets: [1, 3, 7],
  }),

  'quiz-completed': () => ({
    trigger: 'quiz-completed',
    ads: [
      buildAd(
        'quiz-completed',
        'You scored {{dominant_zone}} dominant.',
        'Your quiz result showed {{dominant_zone}} as your primary clinical zone. Here is what that means ' +
          'for your practice and how VitalMatrix maps it systematically.',
        'Learn more about {{dominant_zone}}',
        'low',
        'facebook',
        ['dominant_zone', 'practitioner_name'],
      ),
      buildAd(
        'quiz-completed',
        '{{dominant_zone}} practitioners see this pattern.',
        'Most {{dominant_zone}}-dominant practitioners tell us they struggle to track cascades into adjacent zones. ' +
          `VitalMatrix does it automatically. Founding rate: ${CURRENCY} ${PRICE}/month.`,
        'See how it works',
        'medium',
        'linkedin',
        ['dominant_zone'],
      ),
      buildAd(
        'quiz-completed',
        'From quiz to clinic in 15 minutes.',
        'You know your zone. Now see VitalMatrix map your entire terrain. Book a 15-minute discovery call.',
        'Book a call',
        'medium',
        'facebook',
        ['dominant_zone'],
      ),
    ],
    dayOffsets: [1, 4, 10],
  }),

  'lead-magnet-downloaded': () => ({
    trigger: 'lead-magnet-downloaded',
    ads: [
      buildAd(
        'lead-magnet-downloaded',
        'You downloaded the 5-Zone Checklist.',
        'Ready to see it in action? VitalMatrix automates zone scoring across 7 nodes and 5 zones, ' +
          'so you spend less time mapping and more time with patients.',
        'See it in action',
        'low',
        'facebook',
        ['lead_magnet_name', 'practitioner_name'],
      ),
      buildAd(
        'lead-magnet-downloaded',
        'From checklist to clinical intelligence.',
        'The 5-Zone Checklist is a starting point. VitalMatrix takes it further with automated terrain ' +
          `assessment, cascade detection and DeltaScan tracking. ${CURRENCY} ${PRICE}/month founding rate.`,
        'Explore the platform',
        'medium',
        'linkedin',
        ['lead_magnet_name'],
      ),
      buildAd(
        'lead-magnet-downloaded',
        'Practitioners using the checklist asked for more.',
        `That is why we built VitalMatrix. 7 nodes, 5 zones, 6 pipeline engines. ` +
          `Founding spots are limited. ${CURRENCY} ${PRICE}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.`,
        'Join the founding cohort',
        'high',
        'facebook',
        ['lead_magnet_name'],
      ),
    ],
    dayOffsets: [2, 5, 12],
  }),

  'pricing-page-viewed': () => ({
    trigger: 'pricing-page-viewed',
    ads: [
      buildAd(
        'pricing-page-viewed',
        `Still considering? ${CURRENCY} ${PRICE}/month founding rate.`,
        `7 of 10 founding spots remain. The founding rate of ${CURRENCY} ${PRICE}/month is fixed for ` +
          `${VM_BRAND.pricing.foundingFixedMonths} months. Standard rate after founding closes: ` +
          `${CURRENCY} ${VM_BRAND.pricing.standardRate}/month.`,
        'Secure your spot',
        'high',
        'facebook',
        ['practitioner_name'],
      ),
      buildAd(
        'pricing-page-viewed',
        `${CURRENCY} ${PRICE} vs ${CURRENCY} ${VM_BRAND.pricing.standardRate}. The difference is timing.`,
        `Founding practitioners lock in ${CURRENCY} ${PRICE}/month for ${VM_BRAND.pricing.foundingFixedMonths} months. ` +
          'Once the cohort closes, the rate rises. No discount codes, no exceptions.',
        'Lock in your rate',
        'high',
        'linkedin',
        [],
      ),
    ],
    dayOffsets: [1, 5],
  }),

  'discovery-call-page-viewed-not-booked': () => ({
    trigger: 'discovery-call-page-viewed-not-booked',
    ads: [
      buildAd(
        'discovery-call-page-viewed-not-booked',
        'Your discovery call slot is still open.',
        '15 minutes, no commitment. See how VitalMatrix maps terrain across 7 nodes and 5 zones. ' +
          `Speak directly with ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}.`,
        'Book your call',
        'medium',
        'facebook',
        ['practitioner_name'],
      ),
      buildAd(
        'discovery-call-page-viewed-not-booked',
        '15 minutes. No pitch. Just a demo.',
        'You visited the discovery call page but did not book. We understand. ' +
          'The call is genuinely exploratory. See the platform, ask questions, decide afterwards.',
        'Book now',
        'medium',
        'linkedin',
        [],
      ),
    ],
    dayOffsets: [1, 4],
  }),

  'website-visit': () => ({
    trigger: 'website-visit',
    ads: [
      buildAd(
        'website-visit',
        'You visited VitalMatrix.',
        `VitalMatrix is a ${VM_BRAND.platform.descriptor} for functional medicine practitioners in England. ` +
          '7 nodes, 5 zones, one systematic approach.',
        'Learn more',
        'low',
        'facebook',
        [],
      ),
    ],
    dayOffsets: [2],
  }),

  'email-opened-not-clicked': () => ({
    trigger: 'email-opened-not-clicked',
    ads: [
      buildAd(
        'email-opened-not-clicked',
        'You opened our email but did not click.',
        'We know inboxes are busy. Here is the key takeaway: VitalMatrix systematises FM terrain assessment ' +
          `so you can focus on clinical decisions. ${CURRENCY} ${PRICE}/month founding rate.`,
        'See the platform',
        'low',
        'facebook',
        ['email_subject'],
      ),
    ],
    dayOffsets: [2],
  }),

  'ad-clicked-no-action': () => ({
    trigger: 'ad-clicked-no-action',
    ads: [
      buildAd(
        'ad-clicked-no-action',
        'Still exploring?',
        'You clicked but did not take the next step. No pressure. When you are ready, here is what VitalMatrix ' +
          'offers: systematic terrain assessment, cascade detection and longitudinal tracking.',
        'Take the next step',
        'low',
        'facebook',
        [],
      ),
    ],
    dayOffsets: [3],
  }),
};

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Generates a single retargeting ad for a given trigger.
 *
 * @param trigger    - The interaction that triggered retargeting.
 * @param quizResult - Optional quiz result zone (e.g. "Z2") for personalisation.
 * @param platform   - Target ad platform (defaults to "facebook").
 * @returns A personalised {@link RetargetingAd}.
 */
export function generateRetargetingAd(
  trigger: RetargetingTrigger,
  quizResult?: string,
  platform: string = 'facebook',
): RetargetingAd {
  const sequence = PRE_BUILT_SEQUENCES[trigger]?.();
  if (!sequence || sequence.ads.length === 0) {
    return buildAd(
      trigger,
      'Discover VitalMatrix.',
      `A ${VM_BRAND.platform.descriptor} for functional medicine practitioners. ` +
        `${CURRENCY} ${PRICE}/month founding rate.`,
      'Learn more',
      'low',
      platform,
    );
  }

  const ad = { ...sequence.ads[0], platform };

  if (quizResult) {
    ad.headline = ad.headline.replace(/\{\{dominant_zone\}\}/g, quizResult);
    ad.body = ad.body.replace(/\{\{dominant_zone\}\}/g, quizResult);
    ad.cta = ad.cta.replace(/\{\{dominant_zone\}\}/g, quizResult);
  }

  return ad;
}

/**
 * Generates a full multi-touch retargeting sequence for a trigger.
 *
 * @param trigger - The interaction that triggered retargeting.
 * @returns A {@link RetargetingSequence} with multiple ads and day offsets.
 */
export function generateRetargetingSequence(trigger: RetargetingTrigger): RetargetingSequence {
  const builder = PRE_BUILT_SEQUENCES[trigger];
  if (builder) {
    return builder();
  }

  return {
    trigger,
    ads: [
      buildAd(
        trigger,
        'Discover VitalMatrix.',
        `A ${VM_BRAND.platform.descriptor} for FM practitioners. ${CURRENCY} ${PRICE}/month founding rate.`,
        'Learn more',
        'low',
        'facebook',
      ),
    ],
    dayOffsets: [3],
  };
}

/**
 * Generates a dynamic ad with merge-field personalisation.
 *
 * @param trigger  - The interaction that triggered retargeting.
 * @param userData - Key-value pairs for merge-field replacement (e.g. { dominant_zone: "Z2" }).
 * @returns A personalised {@link RetargetingAd} with all merge fields resolved.
 */
export function generateDynamicAd(
  trigger: RetargetingTrigger,
  userData: Record<string, string>,
): RetargetingAd {
  const sequence = PRE_BUILT_SEQUENCES[trigger]?.();
  if (!sequence || sequence.ads.length === 0) {
    return generateRetargetingAd(trigger);
  }

  const ad = { ...sequence.ads[0] };

  for (const [key, value] of Object.entries(userData)) {
    const token = `{{${key}}}`;
    ad.headline = ad.headline.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
    ad.body = ad.body.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
    ad.cta = ad.cta.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
  }

  return ad;
}

/**
 * Returns all pre-built ads filtered by urgency level.
 *
 * @param urgency - The urgency level to filter by.
 * @returns An array of {@link RetargetingAd} matching the urgency.
 */
export function getRetargetingByUrgency(urgency: UrgencyLevel): RetargetingAd[] {
  const results: RetargetingAd[] = [];

  for (const builder of Object.values(PRE_BUILT_SEQUENCES)) {
    const sequence = builder();
    for (const ad of sequence.ads) {
      if (ad.urgency === urgency) {
        results.push(ad);
      }
    }
  }

  return results;
}

/**
 * Generates a retargeting performance report by trigger type.
 *
 * @param impressions - Total impressions by trigger.
 * @param conversions - Total conversions by trigger.
 * @returns A markdown-formatted performance report.
 */
export function generateRetargetingReport(
  impressions: Record<RetargetingTrigger, number>,
  conversions: Record<RetargetingTrigger, number>,
): string {
  const triggers = Object.keys(impressions) as RetargetingTrigger[];

  const rows = triggers.map((trigger) => {
    const imp = impressions[trigger] || 0;
    const conv = conversions[trigger] || 0;
    const rate = imp > 0 ? ((conv / imp) * 100).toFixed(2) : '0.00';
    return `| ${trigger} | ${imp} | ${conv} | ${rate}% |`;
  });

  const totalImp = triggers.reduce((sum, t) => sum + (impressions[t] || 0), 0);
  const totalConv = triggers.reduce((sum, t) => sum + (conversions[t] || 0), 0);
  const totalRate = totalImp > 0 ? ((totalConv / totalImp) * 100).toFixed(2) : '0.00';

  return (
    `# Retargeting Performance Report\n\n` +
    `| Trigger | Impressions | Conversions | Rate |\n` +
    `|---------|-------------|-------------|------|\n` +
    rows.join('\n') +
    `\n| **Total** | **${totalImp}** | **${totalConv}** | **${totalRate}%** |\n\n` +
    `## Recommendations\n` +
    `- Focus budget on triggers with conversion rates above 2%.\n` +
    `- Increase urgency for triggers with high impressions but low conversions.\n` +
    `- Pause triggers with zero conversions after 1,000 impressions.\n\n` +
    `---\n${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`
  );
}
