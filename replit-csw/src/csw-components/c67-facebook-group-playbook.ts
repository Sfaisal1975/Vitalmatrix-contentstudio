/**
 * c67-facebook-group-playbook.ts
 * VitalMatrix Content Studio — Facebook Group Engagement Playbook
 *
 * Scripts a repeatable weekly engagement strategy for Facebook groups
 * frequented by functional medicine practitioners. All content is
 * helpful-first; VitalMatrix is mentioned only when naturally relevant.
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

/** A single engagement action within a Facebook group. */
export interface GroupEngagementAction {
  /** The kind of engagement. */
  type: 'comment' | 'answer-question' | 'share-insight' | 'ask-question' | 'share-content' | 'direct-message';
  /** The actual content / copy to post. */
  content: string;
  /** When to execute (e.g. "9:00 AM GMT", "mid-morning"). */
  timing: string;
  /** Target Facebook group name. */
  group: string;
  /** Actions explicitly prohibited for this interaction. */
  doNots: string[];
}

/** A single day's planned actions. */
export interface DayPlan {
  /** Day of the week. */
  day: string;
  /** Ordered list of actions for the day. */
  actions: GroupEngagementAction[];
}

/** Full weekly engagement playbook for one or more groups. */
export interface EngagementPlaybook {
  /** Seven-day plan (Monday to Friday active, weekend optional). */
  weeklyPlan: DayPlan[];
  /** Universal prohibitions across all engagement. */
  doNots: string[];
  /** Steps when a conversation escalates beyond group engagement. */
  escalationPath: string[];
  /** Signals that a practitioner is ready for a deeper conversation. */
  conversionTriggers: string[];
}

// ---------------------------------------------------------------------------
// Constants — DO NOTs
// ---------------------------------------------------------------------------

/** Master prohibition list. Applies to every piece of group content. */
const GLOBAL_DO_NOTS: string[] = [
  'Never hard sell VitalMatrix in any group post or comment.',
  'Never post links in the first 2 weeks of joining a group.',
  'Never mention pricing unless directly and specifically asked.',
  'Never claim VitalMatrix diagnoses or treats patients.',
  'Never criticise other approaches, protocols, or methodologies.',
  'Never use competitor names, founder names, or competitor product names (K10).',
  'Never share patient data or fabricated case studies.',
  'Never use em dashes (K8).',
  'Never use credentials other than MBBS, FAAMFM (K7).',
  'Never imply VitalMatrix replaces clinical judgement.',
  'Never post identical content across multiple groups on the same day.',
  'Never engage in arguments or defensive responses.',
];

// ---------------------------------------------------------------------------
// Constants — Conversion triggers
// ---------------------------------------------------------------------------

const CONVERSION_TRIGGERS: string[] = [
  'Practitioner asks about systematising FM assessment.',
  'Practitioner mentions time pressure or admin burden.',
  'Practitioner discusses cascade or terrain concepts.',
  'Practitioner expresses frustration with manual IFM matrix mapping.',
  'Practitioner asks how to track patient progress longitudinally.',
  'Practitioner mentions wanting evidence tiers on recommendations.',
  'Practitioner discusses UK regulatory compliance challenges.',
  'Practitioner asks about structured intake processes.',
];

// ---------------------------------------------------------------------------
// Constants — Escalation path
// ---------------------------------------------------------------------------

const ESCALATION_PATH: string[] = [
  'Step 1: Continue adding value in the group thread.',
  'Step 2: If the practitioner engages twice, respond with a slightly deeper insight referencing a zone or node concept.',
  'Step 3: If the practitioner asks a direct question about your approach, mention VitalMatrix by name with a one-sentence descriptor.',
  'Step 4: If interest is confirmed, suggest a DM to share more detail.',
  'Step 5: In the DM, offer a 15-minute discovery call with no commitment.',
  'Step 6: After the call, follow up with a personalised email within 24 hours.',
];

// ---------------------------------------------------------------------------
// Pre-built weekly plan template
// ---------------------------------------------------------------------------

/**
 * Builds the default weekly plan for a given list of group names.
 * If no groups are supplied, uses a placeholder.
 */
function buildDefaultWeeklyPlan(groups: string[]): DayPlan[] {
  const g = (index: number): string => groups[index % groups.length] || 'Target FM Group';

  return [
    {
      day: 'Monday',
      actions: [
        {
          type: 'answer-question',
          content:
            'Look for two unanswered clinical questions. Provide a helpful, concise answer grounded in zone-relevant insight. ' +
            'For example: "In my experience, when Zone 2 (immune-inflammatory) is active alongside Zone 1 (energy-neuroendocrine), ' +
            'addressing mitochondrial support before immune modulation tends to yield better outcomes. [Evidence tier: Observed in Practice]"',
          timing: '9:00 AM GMT',
          group: g(0),
          doNots: ['Do not link to VitalMatrix.', 'Do not mention pricing.'],
        },
        {
          type: 'answer-question',
          content:
            'Find a second clinical question, ideally in a different zone. Offer a concise, evidence-tagged answer. ' +
            'Demonstrate systematic thinking without naming VitalMatrix.',
          timing: '2:00 PM GMT',
          group: g(1),
          doNots: ['Do not link to VitalMatrix.', 'Do not mention pricing.'],
        },
      ],
    },
    {
      day: 'Tuesday',
      actions: [
        {
          type: 'share-insight',
          content:
            'Share a brief clinical observation linking to a zone. Example: ' +
            '"I have been noticing a pattern in my clinic: practitioners who map gut findings (Zone 2) alongside ' +
            'hormonal markers (Zone 5) often spot cascades they would otherwise miss. Has anyone else observed this?"',
          timing: '10:00 AM GMT',
          group: g(0),
          doNots: ['Do not hard sell.', 'Do not post a link.'],
        },
      ],
    },
    {
      day: 'Wednesday',
      actions: [
        {
          type: 'ask-question',
          content:
            'Post a thought-provoking FM question that invites discussion. Example: ' +
            '"If you could only assess three nodes in a new patient, which three would give you the most terrain insight ' +
            'and why? Curious how others prioritise."',
          timing: '11:00 AM GMT',
          group: g(1),
          doNots: ['Do not answer your own question with a VM pitch.', 'Do not steer towards VitalMatrix.'],
        },
      ],
    },
    {
      day: 'Thursday',
      actions: [
        {
          type: 'share-content',
          content:
            'Share a short insight with a subtle, natural VM mention only if contextually appropriate. Example: ' +
            '"We have been building a systematic way to score terrain across 7 nodes at VitalMatrix. One thing that ' +
            'surprised us: Node 4 (detox-biotransformation) flags far more often when Node 1 (gut) is already compromised. ' +
            '[Evidence tier: Observed in Practice]"',
          timing: '10:00 AM GMT',
          group: g(0),
          doNots: ['Do not include a link.', 'Do not mention pricing.', 'Do not push for sign-ups.'],
        },
      ],
    },
    {
      day: 'Friday',
      actions: [
        {
          type: 'comment',
          content:
            'Engage authentically with 3-5 other practitioners\' posts. Like, comment with genuine insight, ' +
            'ask follow-up questions. Build relationships. No VM mention needed.',
          timing: '9:00 AM GMT',
          group: g(0),
          doNots: ['Do not hijack threads.', 'Do not mention VitalMatrix unless directly asked.'],
        },
        {
          type: 'comment',
          content:
            'Continue relationship-building in a second group. Prioritise practitioners who have posted ' +
            'conversion-trigger content this week.',
          timing: '2:00 PM GMT',
          group: g(1),
          doNots: ['Do not send unsolicited DMs.', 'Do not pitch.'],
        },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Generates a full weekly engagement playbook for the supplied groups.
 *
 * @param groups - Facebook group names to target.
 * @returns A complete {@link EngagementPlaybook} with daily actions, prohibitions,
 *          escalation steps and conversion triggers.
 */
export function generateWeeklyPlaybook(groups: string[]): EngagementPlaybook {
  return {
    weeklyPlan: buildDefaultWeeklyPlan(groups),
    doNots: [...GLOBAL_DO_NOTS],
    escalationPath: [...ESCALATION_PATH],
    conversionTriggers: [...CONVERSION_TRIGGERS],
  };
}

/**
 * Generates a helpful comment template for a given topic and zone.
 *
 * @param topic - The clinical topic being discussed (e.g. "thyroid cascade").
 * @param zone  - The relevant zone identifier (e.g. "Z1", "Z2").
 * @returns A ready-to-post comment string.
 */
export function generateComment(topic: string, zone: string): string {
  return (
    `Great question about ${topic}. ` +
    `From a terrain perspective, this often sits within ${zone}, and I have found that mapping it ` +
    `alongside adjacent zones can reveal cascade patterns that are easy to miss in isolation. ` +
    `Happy to share more detail if helpful. ` +
    `[Evidence tier: Observed in Practice]\n\n` +
    `${VM_BRAND.regulatoryFooter}`
  );
}

/**
 * Generates a shareable insight post linking a zone and node.
 *
 * @param zone - Zone identifier (e.g. "Z2").
 * @param node - Node identifier (e.g. "N1").
 * @returns A ready-to-post insight string.
 */
export function generateInsightPost(zone: string, node: string): string {
  return (
    `Something I have been exploring in my clinical work:\n\n` +
    `When ${node} is compromised, ${zone} activation tends to follow in a predictable pattern. ` +
    `Systematically tracking this cascade has changed how I prioritise interventions.\n\n` +
    `Has anyone else noticed similar patterns in their practice? Would love to hear your experience.\n\n` +
    `[Evidence tier: Observed in Practice]\n\n` +
    `${VM_BRAND.regulatoryFooter}`
  );
}

/**
 * Generates a warm DM template for a practitioner who has shown a conversion trigger.
 *
 * @param practitionerName - The practitioner's name (e.g. "Dr Smith").
 * @param trigger          - The conversion trigger that prompted the DM.
 * @returns A personalised DM string.
 */
export function generateDmTemplate(practitionerName: string, trigger: string): string {
  return (
    `Hi ${practitionerName},\n\n` +
    `I noticed your post about "${trigger}" and it resonated with something I have been working on. ` +
    `We have built a ${VM_BRAND.platform.descriptor} called VitalMatrix that systematises ` +
    `terrain assessment across 7 nodes and 5 zones, specifically for FM practitioners in England.\n\n` +
    `It is still early days and we are onboarding a small founding cohort. ` +
    `If you are curious, I would be happy to walk you through it in a 15-minute call, no commitment.\n\n` +
    `Either way, enjoyed your insights in the group.\n\n` +
    `Best,\n` +
    `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n` +
    `${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}\n` +
    `${VM_BRAND.platform.domain}`
  );
}

/**
 * Generates an engagement metrics report from a list of completed actions.
 *
 * @param actions - Actions completed during the reporting period.
 * @returns A markdown-formatted engagement report.
 */
export function generateGroupReport(actions: GroupEngagementAction[]): string {
  const counts: Record<string, number> = {};
  const groupCounts: Record<string, number> = {};

  for (const action of actions) {
    counts[action.type] = (counts[action.type] || 0) + 1;
    groupCounts[action.group] = (groupCounts[action.group] || 0) + 1;
  }

  const typeLines = Object.entries(counts)
    .map(([type, count]) => `- ${type}: ${count}`)
    .join('\n');

  const groupLines = Object.entries(groupCounts)
    .map(([group, count]) => `- ${group}: ${count} actions`)
    .join('\n');

  return (
    `# Facebook Group Engagement Report\n\n` +
    `**Total actions:** ${actions.length}\n\n` +
    `## By type\n${typeLines}\n\n` +
    `## By group\n${groupLines}\n\n` +
    `## Conversion trigger alignment\n` +
    `Review each action against the following triggers:\n` +
    CONVERSION_TRIGGERS.map((t) => `- ${t}`).join('\n') +
    `\n\n---\n${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`
  );
}

/**
 * Returns the full prohibition list for group engagement.
 *
 * @returns An array of DO NOT strings.
 */
export function getDoNots(): string[] {
  return [...GLOBAL_DO_NOTS];
}
