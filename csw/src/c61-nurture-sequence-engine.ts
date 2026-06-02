/**
 * Component 61: Nurture Sequence Engine
 *
 * Post-quiz and post-lead-magnet email nurture sequences.
 * Manages multi-step drip campaigns with branch logic, personalisation,
 * and contact stage progression. Pre-built sequences for quiz, lead magnet,
 * ad click, webinar follow-up, and cold reactivation flows.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Trigger events that initiate a nurture sequence */
export type NurtureTrigger =
  | 'quiz-completed'
  | 'lead-magnet-downloaded'
  | 'ad-clicked'
  | 'webinar-registered'
  | 'website-visited'
  | 'referral-received';

/** Contact stage within a nurture journey */
export type ContactStage = 'new' | 'nurturing' | 'engaged' | 'ready' | 'converted';

/** A single email within a nurture sequence */
export interface NurtureEmail {
  /** Day offset from sequence start (day 0 = trigger event) */
  dayOffset: number;
  /** Email subject line */
  subject: string;
  /** Email body content (supports {{merge}} fields) */
  body: string;
  /** Call-to-action text */
  cta: string;
  /** Merge fields available for personalisation */
  personalisation: string[];
  /** Optional condition that must be true for this email to send */
  condition?: string;
}

/** Branch condition for routing contacts to alternative sequences */
export interface BranchCondition {
  /** Field to evaluate on the contact record */
  field: string;
  /** Value to match */
  value: string;
  /** Sequence ID to route to if matched */
  nextSequence: string;
}

/** A complete nurture sequence definition */
export interface NurtureSequence {
  /** Unique sequence identifier */
  id: string;
  /** Human-readable sequence name */
  name: string;
  /** Event that triggers this sequence */
  trigger: NurtureTrigger;
  /** Ordered list of emails in the sequence */
  emails: NurtureEmail[];
  /** Optional branch conditions evaluated after each email */
  branchConditions?: BranchCondition[];
}

/** A contact being nurtured through a sequence */
export interface NurtureContact {
  /** Contact email address */
  email: string;
  /** Contact name (if known) */
  name?: string;
  /** Source that originated this contact */
  source: string;
  /** Quiz result zone (if applicable) */
  quizResult?: string;
  /** Lead magnet identifier (if applicable) */
  leadMagnetId?: string;
  /** Current nurture stage */
  stage: ContactStage;
  /** Total touchpoints delivered */
  touchpoints: number;
  /** Day offset of last email sent */
  lastEmailDay: number;
}

/** Report on a nurture sequence's performance */
export interface NurtureReport {
  sequenceId: string;
  sequenceName: string;
  totalContacts: number;
  emailMetrics: {
    dayOffset: number;
    subject: string;
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  }[];
  stageBreakdown: Record<ContactStage, number>;
  overallConversionRate: number;
}

/** Timeline entry for a contact */
export interface ContactTimelineEntry {
  timestamp: string;
  event: string;
  detail: string;
}

// --- Pre-built Sequences ---

/**
 * Quiz-to-discovery sequence: 7 emails over 21 days.
 * Takes a quiz completer from result recap through to discovery call booking.
 */
const quizToDiscovery: NurtureSequence = {
  id: 'seq-quiz-to-discovery',
  name: 'Quiz to Discovery Call',
  trigger: 'quiz-completed',
  emails: [
    {
      dayOffset: 0,
      subject: 'Your {{quizResult}} results are ready',
      body: `Dear {{name}},\n\nThank you for completing the VitalMatrix Clinical Needs Assessment.\n\nYour result: {{quizResult}}\n\nThis means your practice may benefit from structured clinical intelligence in the areas we identified. In the coming days, we will share specific insights relevant to your result.\n\n${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'View your full results',
      personalisation: ['name', 'quizResult'],
    },
    {
      dayOffset: 3,
      subject: 'Understanding your {{quizResult}} zone in depth',
      body: `Dear {{name}},\n\nYour {{quizResult}} result highlights a specific area where practitioners often see the greatest clinical complexity.\n\nVitalMatrix maps 7 interconnected nodes across 5 clinical zones, giving you a structured view of how patient data connects to actionable insights.\n\nHere is what the {{quizResult}} zone means for your daily clinical decisions.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Read the zone deep dive',
      personalisation: ['name', 'quizResult'],
    },
    {
      dayOffset: 6,
      subject: 'How practitioners are using clinical intelligence for {{quizResult}}',
      body: `Dear {{name}},\n\nWe often hear from practitioners dealing with {{quizResult}}-related challenges that the biggest obstacle is connecting the dots across multiple patient data points.\n\nVitalMatrix -- the ${VM_BRAND.platform.descriptor} -- was designed specifically for this. Here is how it works in practice.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'See the clinical context',
      personalisation: ['name', 'quizResult'],
    },
    {
      dayOffset: 9,
      subject: 'See VitalMatrix in action (2-minute walkthrough)',
      body: `Dear {{name}},\n\nWe have put together a brief platform walkthrough showing how VitalMatrix handles the {{quizResult}} workflow.\n\nNo obligation -- just a clear look at what the platform does and how it fits into your existing practice workflow.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Watch the walkthrough',
      personalisation: ['name', 'quizResult'],
    },
    {
      dayOffset: 12,
      subject: `Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months`,
      body: `Dear {{name}},\n\nWe are currently onboarding our founding cohort of 10 practitioners at a fixed rate of ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months (standard rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month).\n\nThis is not a discount that expires -- it is a fixed founding rate for early adopters who help shape the platform.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Learn about founding membership',
      personalisation: ['name'],
    },
    {
      dayOffset: 16,
      subject: 'Limited spots remaining in the founding cohort',
      body: `Dear {{name}},\n\nOur founding cohort of 10 practitioners is filling. Once these spots are taken, the rate moves to ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month.\n\nIf you have been considering whether VitalMatrix is right for your practice, now is the time to book a discovery call.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Book your discovery call',
      personalisation: ['name'],
    },
    {
      dayOffset: 21,
      subject: 'Last chance: your founding cohort invitation',
      body: `Dear {{name}},\n\nThis is my final note about the founding cohort. If VitalMatrix is not the right fit for your practice right now, I completely understand.\n\nBut if you have been thinking about it, I would love to have a brief conversation to answer any questions.\n\n${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Book a 15-minute call',
      personalisation: ['name'],
    },
  ],
  branchConditions: [
    { field: 'quizResult', value: 'high-complexity', nextSequence: 'seq-high-complexity-track' },
  ],
};

/**
 * Lead-magnet-to-trial sequence: 5 emails over 14 days.
 * Nurtures a lead magnet downloader towards a discovery call.
 */
const leadMagnetToTrial: NurtureSequence = {
  id: 'seq-lead-magnet-to-trial',
  name: 'Lead Magnet to Trial',
  trigger: 'lead-magnet-downloaded',
  emails: [
    {
      dayOffset: 0,
      subject: 'Your download is ready: {{leadMagnetTitle}}',
      body: `Dear {{name}},\n\nThank you for downloading "{{leadMagnetTitle}}". Your copy is attached.\n\nThis resource was created by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}, to address the specific clinical challenges practitioners face in this area.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Download your copy',
      personalisation: ['name', 'leadMagnetTitle'],
    },
    {
      dayOffset: 3,
      subject: 'Related reading: going deeper on {{leadMagnetTopic}}',
      body: `Dear {{name}},\n\nIf you found "{{leadMagnetTitle}}" useful, here are two related resources that expand on the key themes.\n\nThese cover the clinical intelligence approach that VitalMatrix takes to {{leadMagnetTopic}}.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Read more',
      personalisation: ['name', 'leadMagnetTitle', 'leadMagnetTopic'],
    },
    {
      dayOffset: 7,
      subject: 'How VitalMatrix handles {{leadMagnetTopic}} in practice',
      body: `Dear {{name}},\n\nThe concepts in "{{leadMagnetTitle}}" are exactly what VitalMatrix automates. Our ${VM_BRAND.platform.descriptor} connects 7 clinical nodes across 5 zones to give you structured, actionable intelligence.\n\nHere is a brief preview of how it works.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'See the platform preview',
      personalisation: ['name', 'leadMagnetTitle', 'leadMagnetTopic'],
    },
    {
      dayOffset: 10,
      subject: 'Let us walk you through VitalMatrix',
      body: `Dear {{name}},\n\nWould a 15-minute discovery call be useful? I can show you exactly how VitalMatrix applies to your practice area and answer any questions.\n\nNo pressure -- just a conversation between practitioners.\n\n${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Book a discovery call',
      personalisation: ['name'],
    },
    {
      dayOffset: 14,
      subject: `Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month (${VM_BRAND.pricing.foundingFixedMonths}-month lock)`,
      body: `Dear {{name}},\n\nOur founding cohort is limited to 10 practitioners at ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.\n\nIf you are interested, I would love to have you as part of our founding group.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Join the founding cohort',
      personalisation: ['name'],
    },
  ],
};

/**
 * Ad-click-to-engagement sequence: 4 emails over 10 days.
 * Warms an ad clicker from welcome through to CTA.
 */
const adClickToEngagement: NurtureSequence = {
  id: 'seq-ad-click-to-engagement',
  name: 'Ad Click to Engagement',
  trigger: 'ad-clicked',
  emails: [
    {
      dayOffset: 0,
      subject: 'Welcome -- here is what VitalMatrix does',
      body: `Dear {{name}},\n\nThank you for your interest in VitalMatrix.\n\nVitalMatrix is a ${VM_BRAND.platform.descriptor} built for practitioners who need structured clinical intelligence across complex, multi-system patient cases.\n\nHere is a brief overview of what we do and why it matters.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Learn more about VitalMatrix',
      personalisation: ['name'],
    },
    {
      dayOffset: 3,
      subject: 'The clinical challenge you are facing',
      body: `Dear {{name}},\n\nMost practitioners we speak with share the same frustration: too much patient data, too many disconnected systems, and not enough time to connect the dots.\n\nVitalMatrix was built to solve exactly this. Our 7-node architecture maps the clinical terrain so you can focus on patient outcomes.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'See how it works',
      personalisation: ['name'],
    },
    {
      dayOffset: 6,
      subject: 'Clinical intelligence that fits your workflow',
      body: `Dear {{name}},\n\nVitalMatrix is not another tool to learn. It integrates into your existing clinical workflow and surfaces the intelligence you need, when you need it.\n\n7 nodes. 5 zones. 6 stacks. One unified clinical picture.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Explore the platform',
      personalisation: ['name'],
    },
    {
      dayOffset: 10,
      subject: 'Ready for a closer look?',
      body: `Dear {{name}},\n\nIf VitalMatrix sounds like it could help your practice, I would welcome a brief conversation.\n\nOur founding cohort of 10 practitioners gets a fixed rate of ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month for ${VM_BRAND.pricing.foundingFixedMonths} months.\n\n${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Book a discovery call',
      personalisation: ['name'],
    },
  ],
};

/**
 * Webinar follow-up sequence: 3 emails over 7 days.
 * Delivers recording, key takeaways, and next steps after a webinar.
 */
const webinarFollowUp: NurtureSequence = {
  id: 'seq-webinar-follow-up',
  name: 'Webinar Follow-up',
  trigger: 'webinar-registered',
  emails: [
    {
      dayOffset: 0,
      subject: 'Your webinar recording: {{webinarTitle}}',
      body: `Dear {{name}},\n\nThank you for attending "{{webinarTitle}}". Here is your recording link.\n\nIf you missed any part or want to revisit specific sections, the full recording is available for the next 30 days.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Watch the recording',
      personalisation: ['name', 'webinarTitle'],
    },
    {
      dayOffset: 3,
      subject: 'Key takeaways from {{webinarTitle}}',
      body: `Dear {{name}},\n\nHere are the three key takeaways from "{{webinarTitle}}" that practitioners found most valuable.\n\nThese insights connect directly to how VitalMatrix structures clinical intelligence in practice.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Read the takeaways',
      personalisation: ['name', 'webinarTitle'],
    },
    {
      dayOffset: 7,
      subject: 'Next steps after {{webinarTitle}}',
      body: `Dear {{name}},\n\nIf the concepts from "{{webinarTitle}}" resonated with your practice, here are your next steps.\n\nI would be happy to discuss how VitalMatrix applies these principles in a brief discovery call.\n\n${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Book a discovery call',
      personalisation: ['name', 'webinarTitle'],
    },
  ],
};

/**
 * Cold reactivation sequence: 3 emails over 14 days.
 * Re-engages contacts who have gone quiet.
 */
const coldReactivation: NurtureSequence = {
  id: 'seq-cold-reactivation',
  name: 'Cold Reactivation',
  trigger: 'website-visited',
  emails: [
    {
      dayOffset: 0,
      subject: 'Still interested in clinical intelligence?',
      body: `Dear {{name}},\n\nIt has been a while since we last connected. We wanted to check in and see if you are still exploring clinical intelligence solutions for your practice.\n\nA lot has changed at VitalMatrix since we last spoke.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'See what is new',
      personalisation: ['name'],
    },
    {
      dayOffset: 7,
      subject: 'New at VitalMatrix: features practitioners asked for',
      body: `Dear {{name}},\n\nBased on practitioner feedback, we have added several new capabilities to the VitalMatrix ${VM_BRAND.platform.descriptor}.\n\nHere is a quick look at what is new and how it helps in daily clinical practice.\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Explore new features',
      personalisation: ['name'],
    },
    {
      dayOffset: 14,
      subject: 'A final note from Dr Faisal',
      body: `Dear {{name}},\n\nI wanted to reach out personally. If VitalMatrix is not the right fit for your practice, I completely understand.\n\nBut if timing was the issue rather than fit, our founding cohort still has spots at ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month.\n\nEither way, I wish you well in your practice.\n\n${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n\n${VM_BRAND.regulatoryFooter}`,
      cta: 'Rejoin the conversation',
      personalisation: ['name'],
    },
  ],
};

// --- State ---

/** All available sequences keyed by ID */
const sequences: Map<string, NurtureSequence> = new Map([
  [quizToDiscovery.id, quizToDiscovery],
  [leadMagnetToTrial.id, leadMagnetToTrial],
  [adClickToEngagement.id, adClickToEngagement],
  [webinarFollowUp.id, webinarFollowUp],
  [coldReactivation.id, coldReactivation],
]);

/** All contacts keyed by email */
const contacts: Map<string, NurtureContact> = new Map();

/** Contact timeline events keyed by email */
const timelines: Map<string, ContactTimelineEntry[]> = new Map();

// --- Functions ---

/**
 * Retrieves a nurture sequence matching the given trigger.
 * @param trigger - The event that triggered the sequence
 * @returns The matching sequence or undefined
 */
export function getSequence(trigger: NurtureTrigger): NurtureSequence | undefined {
  for (const seq of sequences.values()) {
    if (seq.trigger === trigger) return seq;
  }
  return undefined;
}

/**
 * Retrieves a nurture sequence by its ID.
 * @param id - The sequence identifier
 * @returns The matching sequence or undefined
 */
export function getSequenceById(id: string): NurtureSequence | undefined {
  return sequences.get(id);
}

/**
 * Returns all available pre-built sequences.
 */
export function getAllSequences(): NurtureSequence[] {
  return Array.from(sequences.values());
}

/**
 * Personalises an email by merging contact data into template fields.
 * Replaces {{field}} placeholders with contact-specific values.
 * @param email - The template email
 * @param contact - The contact to personalise for
 * @param extraFields - Additional merge fields beyond the contact record
 * @returns A new NurtureEmail with merged content
 */
export function personaliseEmail(
  email: NurtureEmail,
  contact: NurtureContact,
  extraFields?: Record<string, string>
): NurtureEmail {
  const mergeData: Record<string, string> = {
    name: contact.name || 'Practitioner',
    email: contact.email,
    source: contact.source,
    quizResult: contact.quizResult || '',
    leadMagnetId: contact.leadMagnetId || '',
    ...extraFields,
  };

  const merge = (text: string): string => {
    return text.replace(/\{\{(\w+)\}\}/g, (_match, field) => {
      return mergeData[field] || `{{${field}}}`;
    });
  };

  return {
    ...email,
    subject: merge(email.subject),
    body: merge(email.body),
    cta: merge(email.cta),
  };
}

/**
 * Registers a new contact and begins their nurture journey.
 * @param email - Contact email
 * @param source - Originating source
 * @param name - Contact name (optional)
 * @param quizResult - Quiz result zone (optional)
 * @param leadMagnetId - Lead magnet ID (optional)
 * @returns The created NurtureContact
 */
export function registerContact(
  email: string,
  source: string,
  name?: string,
  quizResult?: string,
  leadMagnetId?: string
): NurtureContact {
  const contact: NurtureContact = {
    email,
    name,
    source,
    quizResult,
    leadMagnetId,
    stage: 'new',
    touchpoints: 0,
    lastEmailDay: -1,
  };
  contacts.set(email, contact);
  timelines.set(email, [
    {
      timestamp: new Date().toISOString(),
      event: 'registered',
      detail: `Contact registered from source: ${source}`,
    },
  ]);
  return contact;
}

/**
 * Advances a contact to the next email in their sequence.
 * Updates stage based on touchpoints: 0-1 = nurturing, 2-3 = engaged, 4+ = ready.
 * @param contact - The contact to advance
 * @param sequence - The sequence they are in
 * @returns The next email to send, or undefined if sequence is complete
 */
export function advanceContact(
  contact: NurtureContact,
  sequence: NurtureSequence
): NurtureEmail | undefined {
  const nextEmail = sequence.emails.find((e) => e.dayOffset > contact.lastEmailDay);
  if (!nextEmail) return undefined;

  contact.touchpoints += 1;
  contact.lastEmailDay = nextEmail.dayOffset;

  // Stage progression
  if (contact.touchpoints >= 4) {
    contact.stage = 'ready';
  } else if (contact.touchpoints >= 2) {
    contact.stage = 'engaged';
  } else {
    contact.stage = 'nurturing';
  }

  contacts.set(contact.email, contact);

  const timeline = timelines.get(contact.email) || [];
  timeline.push({
    timestamp: new Date().toISOString(),
    event: 'email-sent',
    detail: `Day ${nextEmail.dayOffset}: "${nextEmail.subject}" | Stage: ${contact.stage}`,
  });
  timelines.set(contact.email, timeline);

  return nextEmail;
}

/**
 * Checks branch conditions against a contact and returns the alternative sequence ID if matched.
 * @param contact - The contact to evaluate
 * @param conditions - Branch conditions to check
 * @returns The next sequence ID if a branch is triggered, or undefined
 */
export function checkBranch(
  contact: NurtureContact,
  conditions: BranchCondition[]
): string | undefined {
  for (const condition of conditions) {
    const contactValue = (contact as unknown as Record<string, unknown>)[condition.field];
    if (contactValue === condition.value) {
      const timeline = timelines.get(contact.email) || [];
      timeline.push({
        timestamp: new Date().toISOString(),
        event: 'branch-triggered',
        detail: `Branch: ${condition.field} = ${condition.value} -> ${condition.nextSequence}`,
      });
      timelines.set(contact.email, timeline);
      return condition.nextSequence;
    }
  }
  return undefined;
}

/**
 * Retrieves a contact by email.
 */
export function getContact(email: string): NurtureContact | undefined {
  return contacts.get(email);
}

/**
 * Returns all contacts at a given stage.
 */
export function getContactsByStage(stage: ContactStage): NurtureContact[] {
  return Array.from(contacts.values()).filter((c) => c.stage === stage);
}

/**
 * Marks a contact as converted.
 */
export function markConverted(email: string): NurtureContact | undefined {
  const contact = contacts.get(email);
  if (!contact) return undefined;
  contact.stage = 'converted';
  contacts.set(email, contact);

  const timeline = timelines.get(email) || [];
  timeline.push({
    timestamp: new Date().toISOString(),
    event: 'converted',
    detail: 'Contact marked as converted',
  });
  timelines.set(email, timeline);

  return contact;
}

/**
 * Generates a performance report for a nurture sequence.
 * Uses simulated metrics based on contact count and stage distribution.
 * @param sequenceId - The sequence to report on
 * @returns Markdown-formatted nurture report
 */
export function generateNurtureReport(sequenceId: string): string {
  const seq = sequences.get(sequenceId);
  if (!seq) return `Sequence "${sequenceId}" not found.`;

  const allContacts = Array.from(contacts.values()).filter((c) => c.source.includes(seq.trigger));
  const totalContacts = allContacts.length;

  const stageBreakdown: Record<ContactStage, number> = {
    new: 0,
    nurturing: 0,
    engaged: 0,
    ready: 0,
    converted: 0,
  };
  for (const c of allContacts) {
    stageBreakdown[c.stage] += 1;
  }

  const conversionRate = totalContacts > 0
    ? ((stageBreakdown.converted / totalContacts) * 100).toFixed(1)
    : '0.0';

  const lines: string[] = [
    `# Nurture Sequence Report: ${seq.name}`,
    '',
    `**Sequence ID:** ${seq.id}`,
    `**Trigger:** ${seq.trigger}`,
    `**Total Contacts:** ${totalContacts}`,
    `**Overall Conversion Rate:** ${conversionRate}%`,
    '',
    '## Stage Breakdown',
    '',
    '| Stage | Count | Percentage |',
    '|-------|------:|----------:|',
  ];

  for (const [stage, count] of Object.entries(stageBreakdown)) {
    const pct = totalContacts > 0 ? ((count / totalContacts) * 100).toFixed(1) : '0.0';
    lines.push(`| ${stage} | ${count} | ${pct}% |`);
  }

  lines.push('');
  lines.push('## Email Performance');
  lines.push('');
  lines.push('| Day | Subject | Estimated Open Rate | Estimated Click Rate |');
  lines.push('|----:|---------|-------------------:|--------------------:|');

  for (const email of seq.emails) {
    const contactsAtDay = allContacts.filter((c) => c.lastEmailDay >= email.dayOffset).length;
    const openRate = contactsAtDay > 0 ? Math.min(65, 40 + Math.random() * 25).toFixed(1) : '0.0';
    const clickRate = contactsAtDay > 0 ? Math.min(20, 5 + Math.random() * 15).toFixed(1) : '0.0';
    lines.push(`| ${email.dayOffset} | ${email.subject.substring(0, 50)} | ${openRate}% | ${clickRate}% |`);
  }

  lines.push('');
  lines.push(`---`);
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generates a full timeline for a given contact.
 * @param email - Contact email address
 * @returns Markdown-formatted contact timeline
 */
export function generateContactTimeline(email: string): string {
  const contact = contacts.get(email);
  const timeline = timelines.get(email);

  if (!contact || !timeline) {
    return `No timeline found for contact: ${email}`;
  }

  const lines: string[] = [
    `# Contact Timeline: ${contact.name || contact.email}`,
    '',
    `**Email:** ${contact.email}`,
    `**Source:** ${contact.source}`,
    `**Current Stage:** ${contact.stage}`,
    `**Touchpoints:** ${contact.touchpoints}`,
    `**Last Email Day:** ${contact.lastEmailDay}`,
    '',
    '## Events',
    '',
    '| Timestamp | Event | Detail |',
    '|-----------|-------|--------|',
  ];

  for (const entry of timeline) {
    lines.push(`| ${entry.timestamp} | ${entry.event} | ${entry.detail} |`);
  }

  lines.push('');
  lines.push(`---`);
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
