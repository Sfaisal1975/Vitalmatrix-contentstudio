/**
 * Component 37: Practitioner Success Tracker
 *
 * Tracks practitioner milestones (first patient, first DeltaScan, referral,
 * tenure) and generates celebration, retention, and upsell content. Supports
 * the founding cohort of 10 practitioners.
 *
 * Channels: email, LinkedIn, internal dashboard.
 * British English throughout.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Recognised milestone events in the practitioner journey. */
export type MilestoneType =
  | '1st-patient'
  | '5th-patient'
  | '10th-patient'
  | '1st-deltascan'
  | '1st-month'
  | '3rd-month'
  | '6th-month'
  | 'referral-made';

/** A single practitioner milestone record. */
export interface PractitionerMilestone {
  /** Unique practitioner identifier. */
  practitionerId: string;
  /** Practitioner display name. */
  name: string;
  /** The milestone achieved. */
  milestone: MilestoneType;
  /** ISO date when the milestone was reached. */
  dateReached: string;
  /** Whether celebration content has been sent. */
  celebrated: boolean;
}

/** Generated content for practitioner engagement. */
export interface SuccessContent {
  /** Content purpose. */
  type: 'celebration' | 'nudge' | 'upsell';
  /** Email subject line or notification title. */
  subject: string;
  /** Full message body in HTML. */
  body: string;
  /** Delivery channel. */
  channel: 'email' | 'linkedin' | 'internal';
}

// --- In-Memory Store ---

const milestoneStore: PractitionerMilestone[] = [];

// --- Milestone Metadata ---

const MILESTONE_LABELS: Record<MilestoneType, string> = {
  '1st-patient': 'First Patient Assessed',
  '5th-patient': 'Five Patients Milestone',
  '10th-patient': 'Ten Patients Milestone',
  '1st-deltascan': 'First DeltaScan Completed',
  '1st-month': 'One Month on VitalMatrix',
  '3rd-month': 'Three Months on VitalMatrix',
  '6th-month': 'Six Months on VitalMatrix',
  'referral-made': 'First Referral Made',
};

const MILESTONE_EMOJIS: Record<MilestoneType, string> = {
  '1st-patient': '',
  '5th-patient': '',
  '10th-patient': '',
  '1st-deltascan': '',
  '1st-month': '',
  '3rd-month': '',
  '6th-month': '',
  'referral-made': '',
};

// --- Core Functions ---

/**
 * Records a practitioner milestone in the store.
 *
 * @param milestone - The milestone to record.
 * @returns The total number of milestones for this practitioner.
 */
export function recordMilestone(milestone: PractitionerMilestone): number {
  milestoneStore.push({ ...milestone });
  return milestoneStore.filter(m => m.practitionerId === milestone.practitionerId).length;
}

/**
 * Retrieves all milestones for a given practitioner.
 *
 * @param practitionerId - The practitioner's unique identifier.
 * @returns Array of milestones, sorted by date.
 */
export function getMilestones(practitionerId: string): PractitionerMilestone[] {
  return milestoneStore
    .filter(m => m.practitionerId === practitionerId)
    .sort((a, b) => new Date(a.dateReached).getTime() - new Date(b.dateReached).getTime());
}

/**
 * Generates a personalised celebration email for a practitioner milestone.
 *
 * The email uses VM branding, acknowledges the specific achievement,
 * and reinforces the value of the platform.
 *
 * @param milestone - The milestone to celebrate.
 * @returns A SuccessContent object with the celebration email.
 */
export function generateCelebrationEmail(milestone: PractitionerMilestone): SuccessContent {
  const label = MILESTONE_LABELS[milestone.milestone];
  const firstName = milestone.name.split(' ')[0];

  const milestoneMessages: Record<MilestoneType, string> = {
    '1st-patient': `You have just assessed your first patient using VitalMatrix. That first terrain map represents a fundamentally different approach to clinical assessment -- one that connects nodes, zones, and cascades into a coherent clinical picture.`,
    '5th-patient': `Five patients assessed through VitalMatrix. You are now building a genuine clinical dataset. Patterns across your patient cohort will start to emerge, and DeltaScan comparisons will become increasingly powerful.`,
    '10th-patient': `Ten patients. Double digits. You are among the most active practitioners in the founding cohort. Your clinical data is now generating meaningful terrain patterns across your practice population.`,
    '1st-deltascan': `Your first DeltaScan is complete. This before-and-after terrain comparison is something no other platform can generate. You can now show patients objective evidence of terrain shifts over time.`,
    '1st-month': `One month in. By now, VitalMatrix should be part of your clinical workflow. If you have not yet explored the full INTAKE-to-assessment pipeline, this week is the perfect time.`,
    '3rd-month': `Three months of clinical intelligence. Practitioners who reach this milestone report that VitalMatrix has fundamentally changed how they structure their assessments and communicate findings to patients.`,
    '6th-month': `Six months as a founding member. You are a VitalMatrix veteran. Your feedback has directly shaped the platform, and your locked founding rate of GBP ${VM_BRAND.pricing.foundingMonthly}/month reflects that partnership.`,
    'referral-made': `You have referred a colleague to VitalMatrix. Peer recommendation is the highest compliment a platform can receive. Thank you for helping grow the founding community.`,
  };

  const body = `
<div style="font-family: ${VM_BRAND.fonts.body}; background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; padding: 2rem; border-radius: 8px; max-width: 600px;">
  <div style="text-align: center; padding-bottom: 1.5rem; border-bottom: 2px solid ${VM_BRAND.colours.gold};">
    <h1 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin: 0;">Milestone Reached</h1>
    <p style="font-family: ${VM_BRAND.fonts.data}; color: ${VM_BRAND.colours.teal}; margin: 0.5rem 0 0 0;">${label}</p>
  </div>

  <div style="padding: 1.5rem 0;">
    <p>Dear ${firstName},</p>
    <p>${milestoneMessages[milestone.milestone]}</p>
    <p>We are building something genuinely new in functional medicine, and your participation in the founding cohort is what makes it possible.</p>
  </div>

  <div style="background: ${VM_BRAND.colours.deepTeal}; padding: 1rem; border-radius: 6px; text-align: center;">
    <p style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin: 0;">Keep exploring. Keep assessing. The terrain tells the story.</p>
  </div>

  <div style="margin-top: 1.5rem; font-size: 0.85rem;">
    <p>${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}<br>${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}</p>
  </div>

  <footer style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.7rem; font-family: ${VM_BRAND.fonts.data};">
    <p>${VM_BRAND.regulatoryFooter}</p>
  </footer>
</div>`.trim();

  // Mark as celebrated
  const stored = milestoneStore.find(
    m => m.practitionerId === milestone.practitionerId && m.milestone === milestone.milestone
  );
  if (stored) {
    stored.celebrated = true;
  }

  return {
    type: 'celebration',
    subject: `${label} -- Congratulations, ${firstName}`,
    body,
    channel: 'email',
  };
}

/**
 * Generates a re-engagement nudge for practitioners who have not logged in recently.
 *
 * Escalates tone based on days since last login:
 * - 7-14 days: gentle reminder
 * - 15-30 days: value reinforcement
 * - 31+ days: direct outreach from Dr Faisal
 *
 * @param practitionerId - The practitioner's unique identifier.
 * @param daysSinceLastLogin - Number of days since their last platform login.
 * @returns A SuccessContent object with the re-engagement content.
 */
export function generateRetentionNudge(practitionerId: string, daysSinceLastLogin: number): SuccessContent {
  const milestones = getMilestones(practitionerId);
  const name = milestones.length > 0 ? milestones[0].name : 'Colleague';
  const firstName = name.split(' ')[0];
  const milestoneCount = milestones.length;

  let urgency: string;
  let message: string;
  let channel: 'email' | 'linkedin' | 'internal';

  if (daysSinceLastLogin <= 14) {
    urgency = 'Gentle Reminder';
    channel = 'email';
    message = `
      <p>Dear ${firstName},</p>
      <p>It has been ${daysSinceLastLogin} days since your last VitalMatrix session. Your patients' terrain data is waiting for you.</p>
      <p>You have reached ${milestoneCount} milestone${milestoneCount !== 1 ? 's' : ''} so far. Log in today and continue building your clinical intelligence dataset.</p>
      <p>Quick actions you might try:</p>
      <ul>
        <li>Run a DeltaScan on your most recent patient</li>
        <li>Review your INTAKE queue for pending assessments</li>
        <li>Explore the cascade connections for your last assessment</li>
      </ul>`;
  } else if (daysSinceLastLogin <= 30) {
    urgency = 'We Miss Your Clinical Insight';
    channel = 'email';
    message = `
      <p>Dear ${firstName},</p>
      <p>It has been ${daysSinceLastLogin} days since you last used VitalMatrix. As a founding cohort member, your engagement directly shapes the platform's development.</p>
      <p>Since you last logged in, we have continued to refine the assessment pipeline. Your existing patient data remains secure and ready for analysis.</p>
      <p>Your founding rate of GBP ${VM_BRAND.pricing.foundingMonthly}/month is locked in -- but only whilst your subscription remains active. We would hate to see you lose that advantage.</p>`;
  } else {
    urgency = 'Personal Message from Dr Faisal';
    channel = 'email';
    message = `
      <p>Dear ${firstName},</p>
      <p>This is a personal note from me. It has been ${daysSinceLastLogin} days since your last VitalMatrix session, and I wanted to reach out directly.</p>
      <p>If something about the platform is not working for your practice, I want to know. Every founding cohort member matters, and your feedback is how we improve.</p>
      <p>Would you be open to a brief call this week? I would like to understand what would make VitalMatrix indispensable to your clinical workflow.</p>
      <p>Warm regards,<br>${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}</p>`;
  }

  const body = `
<div style="font-family: ${VM_BRAND.fonts.body}; background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; padding: 2rem; border-radius: 8px; max-width: 600px;">
  <div style="border-bottom: 2px solid ${VM_BRAND.colours.teal}; padding-bottom: 1rem; margin-bottom: 1.5rem;">
    <h2 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin: 0;">${urgency}</h2>
    <p style="font-family: ${VM_BRAND.fonts.data}; color: ${VM_BRAND.colours.teal}; font-size: 0.8rem;">${daysSinceLastLogin} days since last login</p>
  </div>
  ${message}
  <footer style="margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.7rem; font-family: ${VM_BRAND.fonts.data};">
    <p>${VM_BRAND.regulatoryFooter}</p>
  </footer>
</div>`.trim();

  return {
    type: 'nudge',
    subject: `${urgency} -- VitalMatrix`,
    body,
    channel,
  };
}

/**
 * Generates a monthly usage summary email for a practitioner.
 *
 * Includes milestone count, usage statistics placeholders, and
 * encouragement to deepen platform engagement.
 *
 * @param practitionerId - The practitioner's unique identifier.
 * @returns A SuccessContent object with the usage summary.
 */
export function generateUsageSummary(practitionerId: string): SuccessContent {
  const milestones = getMilestones(practitionerId);
  const name = milestones.length > 0 ? milestones[0].name : 'Practitioner';
  const firstName = name.split(' ')[0];

  const celebrated = milestones.filter(m => m.celebrated).length;
  const uncelebrated = milestones.filter(m => !m.celebrated).length;

  const milestoneListHtml = milestones.length > 0
    ? milestones.map(m => {
        const label = MILESTONE_LABELS[m.milestone];
        const date = new Date(m.dateReached).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric',
        });
        return `<li style="margin-bottom: 0.5rem;">${label} -- ${date} ${m.celebrated ? '(celebrated)' : '(new!)'}</li>`;
      }).join('\n')
    : '<li>No milestones recorded yet. Start by assessing your first patient.</li>';

  const body = `
<div style="font-family: ${VM_BRAND.fonts.body}; background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; padding: 2rem; border-radius: 8px; max-width: 600px;">
  <div style="text-align: center; padding-bottom: 1.5rem; border-bottom: 2px solid ${VM_BRAND.colours.gold};">
    <h1 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin: 0;">Monthly Usage Summary</h1>
    <p style="font-family: ${VM_BRAND.fonts.data}; color: ${VM_BRAND.colours.teal};">VitalMatrix ${VM_BRAND.platform.descriptor}</p>
  </div>

  <div style="padding: 1.5rem 0;">
    <p>Dear ${firstName},</p>
    <p>Here is your VitalMatrix activity summary for the past month.</p>

    <div style="background: ${VM_BRAND.colours.charcoal}; padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
      <h3 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin-top: 0;">Milestones</h3>
      <table style="width: 100%; font-family: ${VM_BRAND.fonts.data}; font-size: 0.9rem;">
        <tr><td>Total milestones reached:</td><td style="text-align: right; color: ${VM_BRAND.colours.gold};">${milestones.length}</td></tr>
        <tr><td>Celebrated:</td><td style="text-align: right;">${celebrated}</td></tr>
        <tr><td>New this month:</td><td style="text-align: right; color: ${VM_BRAND.colours.teal};">${uncelebrated}</td></tr>
      </table>
    </div>

    <div style="margin: 1rem 0;">
      <h3 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold};">Milestone Timeline</h3>
      <ul style="list-style: none; padding-left: 0;">
        ${milestoneListHtml}
      </ul>
    </div>

    <div style="background: ${VM_BRAND.colours.deepTeal}; padding: 1rem; border-radius: 6px;">
      <p style="margin: 0; font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold};">Next milestone to unlock</p>
      <p style="margin: 0.5rem 0 0 0;">Continue using VitalMatrix to reach your next achievement. Every patient assessed deepens your clinical terrain intelligence.</p>
    </div>
  </div>

  <div style="margin-top: 1rem; font-size: 0.85rem;">
    <p>${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}<br>${VM_BRAND.credentials.title}</p>
  </div>

  <footer style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.7rem; font-family: ${VM_BRAND.fonts.data};">
    <p>${VM_BRAND.regulatoryFooter}</p>
  </footer>
</div>`.trim();

  return {
    type: 'celebration',
    subject: `Your VitalMatrix Monthly Summary -- ${firstName}`,
    body,
    channel: 'email',
  };
}

/**
 * Generates a cohort-level progress summary.
 *
 * Reports how many of the 10 founding cohort practitioners are
 * active (have recorded at least one milestone this month).
 *
 * @returns A human-readable summary string for internal dashboards.
 */
export function getCohortProgressSummary(): string {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const uniqueIds = new Set<string>();
  const activeThisMonth = new Set<string>();

  for (const m of milestoneStore) {
    uniqueIds.add(m.practitionerId);
    const d = new Date(m.dateReached);
    if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
      activeThisMonth.add(m.practitionerId);
    }
  }

  const totalRegistered = uniqueIds.size;
  const activeCount = activeThisMonth.size;

  return `${activeCount}/10 practitioners active this month (${totalRegistered} total registered). Founding cohort capacity: ${10 - totalRegistered} spots remaining.`;
}

/**
 * Clears the milestone store. Intended for testing only.
 */
export function clearMilestoneStore(): void {
  milestoneStore.length = 0;
}

/**
 * Returns all stored milestones. Intended for reporting and export.
 */
export function getAllMilestones(): PractitionerMilestone[] {
  return [...milestoneStore];
}
