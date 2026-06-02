/**
 * Component 30: Practitioner Persona Engine
 * EXTREMELY HIGH-YIELD
 *
 * Deep persona profiles for 8 practitioner segments. Each persona
 * includes demographics, pain points, motivations, objections,
 * decision triggers, preferred channels, language patterns,
 * relevant zones, cascades, pricing tier, and conversion hooks.
 * Powers personalised messaging across all content channels.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type PersonaSegment =
  | 'ifm-trained'
  | 'non-ifm'
  | 'gut-specialist'
  | 'hormone-specialist'
  | 'general-fm'
  | 'newly-qualified'
  | 'experienced-solo'
  | 'group-practice';

export type MessageType =
  | 'email-intro'
  | 'linkedin-message'
  | 'follow-up'
  | 'demo-invite'
  | 'case-study-share'
  | 'newsletter-cta';

export interface PractitionerPersona {
  segment: PersonaSegment;
  demographics: {
    typicalAge: string;
    yearsInPractice: string;
    practiceSize: string;
    location: string;
  };
  painPoints: string[];
  motivations: string[];
  objections: string[];
  decisionTriggers: string[];
  preferredChannels: string[];
  languagePatterns: {
    resonates: string[];
    avoids: string[];
  };
  relevantZones: string[];
  relevantCascades: string[];
  pricingTier: string;
  conversionHooks: string[];
}

// --- Pre-built Personas ---

const PERSONAS: Record<PersonaSegment, PractitionerPersona> = {
  'ifm-trained': {
    segment: 'ifm-trained',
    demographics: {
      typicalAge: '35-55',
      yearsInPractice: '5-20',
      practiceSize: 'Solo or small group (1-3 practitioners)',
      location: 'UK, US, Australia, Europe',
    },
    painPoints: [
      'Overwhelmed by data from multiple lab panels with no unified view',
      'Spending 60-90 minutes per patient on manual clinical reasoning',
      'No structured way to track terrain shifts over time',
      'IFM matrix is familiar but lacks computational support',
      'Difficulty explaining complex multi-system interactions to patients',
    ],
    motivations: [
      'Wants to deepen clinical reasoning without adding hours',
      'Values evidence-graded outputs over black-box AI',
      'Seeks a tool built by a practitioner who understands the IFM framework',
      'Desires a competitive edge in functional medicine consultations',
      'Wants to scale practice without sacrificing quality',
    ],
    objections: [
      'Already using IFM matrix manually — why change?',
      'Concerns about data privacy and patient information',
      'Sceptical of AI-generated clinical outputs',
      'Price sensitivity during early adoption',
      'Worried about learning curve and time investment',
    ],
    decisionTriggers: [
      'Seeing a demo with real clinical scenarios',
      'Peer recommendation from another IFM practitioner',
      'Published evidence tier on every clinical output',
      'Founding cohort pricing and direct access to the founder',
      'GDPR and ICO compliance confirmation',
    ],
    preferredChannels: ['email', 'LinkedIn', 'IFM community forums', 'webinars'],
    languagePatterns: {
      resonates: [
        'terrain assessment',
        'clinical intelligence',
        'evidence-graded',
        'IFM-aligned',
        'node-based reasoning',
        'cascade detection',
        'burden designation',
      ],
      avoids: [
        'AI diagnosis',
        'automated treatment',
        'replace your clinical judgement',
        'machine learning magic',
      ],
    },
    relevantZones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
    relevantCascades: ['Gut-Brain Axis', 'HPA Axis', 'Immune-Gut', 'Metabolic-Hormonal'],
    pricingTier: `GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)`,
    conversionHooks: [
      'Maps directly to the IFM matrix you already use',
      'Built by an IFM-trained clinician, not a tech company',
      'Every output shows its evidence tier — no black boxes',
      'Founding cohort: shape the platform with direct feedback',
    ],
  },

  'non-ifm': {
    segment: 'non-ifm',
    demographics: {
      typicalAge: '30-50',
      yearsInPractice: '3-15',
      practiceSize: 'Solo or group (1-5 practitioners)',
      location: 'UK, Europe',
    },
    painPoints: [
      'Lacks a structured framework for functional assessment',
      'Feels behind peers who have IFM certification',
      'Struggles to connect symptoms across body systems',
      'No formal training in multi-system clinical reasoning',
      'Patients are asking about functional medicine and practitioner has no tools',
    ],
    motivations: [
      'Wants to offer functional medicine services without years of IFM training',
      'Seeks a structured framework that teaches as it assesses',
      'Desires credibility with patients interested in root-cause medicine',
      'Wants to differentiate from conventional GP practice',
      'Values a guided approach over open-ended complexity',
    ],
    objections: [
      'Not sure if this is for non-IFM practitioners',
      'Worried about being out of depth clinically',
      'Price is higher than expected for early-stage platform',
      'Unsure if patients will value the approach',
      'Concerned about regulatory implications',
    ],
    decisionTriggers: [
      'Clear onboarding path for non-IFM practitioners',
      'Case studies showing results without IFM background',
      'Guided first-patient session with Dr Faisal',
      'Regulatory clarity and ICO registration confirmation',
      'Trial period or money-back guarantee',
    ],
    preferredChannels: ['email', 'LinkedIn', 'webinars', 'professional networks'],
    languagePatterns: {
      resonates: [
        'guided assessment',
        'structured framework',
        'no IFM training required',
        'clinical decision support',
        'step-by-step',
        'evidence-based',
      ],
      avoids: [
        'advanced IFM concepts',
        'assumes prior knowledge',
        'expert-only',
        'replace clinical training',
      ],
    },
    relevantZones: ['Z1', 'Z2', 'Z4'],
    relevantCascades: ['Gut-Immune', 'Metabolic Basics'],
    pricingTier: `GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)`,
    conversionHooks: [
      'No IFM training required — the platform guides you',
      'Guided first-patient session included',
      'Structured framework teaches as you assess',
      'Add functional medicine to your practice this month',
    ],
  },

  'gut-specialist': {
    segment: 'gut-specialist',
    demographics: {
      typicalAge: '35-50',
      yearsInPractice: '5-15',
      practiceSize: 'Solo or small group',
      location: 'UK, US, Australia',
    },
    painPoints: [
      'Gut assessment is complex with overlapping biomarkers',
      'Difficult to track microbiome shifts across multiple test providers',
      'Patients present with gut symptoms but root cause is elsewhere',
      'No unified dashboard for SIBO, leaky gut, dysbiosis markers',
      'Spending too much time correlating stool tests with symptoms',
    ],
    motivations: [
      'Wants deep Z1 (Gut and Microbiome) intelligence',
      'Seeks cascade detection showing gut-brain and gut-immune links',
      'Values terrain-level tracking of microbiome over time',
      'Wants to catch upstream causes before they manifest as gut symptoms',
      'Desires faster differential between functional and organic pathology',
    ],
    objections: [
      'Already has specialist gut assessment tools',
      'Concerned platform is too broad and not deep enough on gut',
      'Wants to see Z1-specific evidence base',
      'Price versus value for single-zone focus',
    ],
    decisionTriggers: [
      'Z1 deep-dive demo with real gut cases',
      'Cascade detection showing gut-brain axis in action',
      'Evidence tier specifically for microbiome research',
      'Integration with common stool test providers',
    ],
    preferredChannels: ['email', 'specialist forums', 'conferences', 'LinkedIn'],
    languagePatterns: {
      resonates: [
        'microbiome terrain',
        'dysbiosis detection',
        'gut-brain cascade',
        'SIBO assessment',
        'mucosal immunity',
        'terrain shift tracking',
      ],
      avoids: [
        'generic wellness',
        'broad-spectrum',
        'one-size-fits-all',
      ],
    },
    relevantZones: ['Z1'],
    relevantCascades: ['Gut-Brain Axis', 'Gut-Immune', 'Gut-Hormone'],
    pricingTier: `GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)`,
    conversionHooks: [
      'Z1 deep-dive: the most detailed gut terrain assessment available',
      'Cascade detection catches gut-brain connections you might miss',
      'Track microbiome terrain shifts across multiple test results',
      'Built for the depth a gut specialist demands',
    ],
  },

  'hormone-specialist': {
    segment: 'hormone-specialist',
    demographics: {
      typicalAge: '35-55',
      yearsInPractice: '8-20',
      practiceSize: 'Solo or small group',
      location: 'UK, US',
    },
    painPoints: [
      'Hormonal panels generate vast data without prioritised clinical focus',
      'Difficulty separating primary hormonal imbalance from secondary cascades',
      'Patients on HRT need nuanced monitoring beyond standard labs',
      'Thyroid, adrenal, and sex hormone interactions are hard to model manually',
      'No structured way to track hormonal terrain across menstrual cycles',
    ],
    motivations: [
      'Wants Z2 (Metabolic and Hormonal) depth',
      'Seeks HPA axis cascade detection',
      'Values longitudinal hormonal terrain tracking',
      'Wants to differentiate primary vs. secondary hormonal drivers',
      'Desires evidence-graded output for complex hormone cases',
    ],
    objections: [
      'Already uses DUTCH or similar hormonal panels',
      'Concerned the platform oversimplifies hormonal assessment',
      'Wants to see Z2 case studies specifically',
      'Integration with existing hormone testing workflows',
    ],
    decisionTriggers: [
      'Z2 demo with complex hormonal case',
      'HPA axis cascade detection walkthrough',
      'Evidence tier for hormonal biomarker research',
      'Peer endorsement from another hormone specialist',
    ],
    preferredChannels: ['email', 'specialist conferences', 'LinkedIn', 'podcasts'],
    languagePatterns: {
      resonates: [
        'hormonal terrain',
        'HPA axis',
        'metabolic cascades',
        'endocrine mapping',
        'hormonal burden',
        'thyroid-adrenal interplay',
      ],
      avoids: [
        'basic hormone testing',
        'simplistic panels',
        'automated prescribing',
      ],
    },
    relevantZones: ['Z2'],
    relevantCascades: ['HPA Axis', 'Thyroid-Adrenal', 'Metabolic-Hormonal', 'Hormonal-Immune'],
    pricingTier: `GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)`,
    conversionHooks: [
      'Z2 depth: HPA axis cascade detection built for hormone specialists',
      'Track hormonal terrain shifts across cycles and interventions',
      'Separate primary from secondary hormonal drivers automatically',
      'Evidence-graded output your hormone patients deserve',
    ],
  },

  'general-fm': {
    segment: 'general-fm',
    demographics: {
      typicalAge: '30-55',
      yearsInPractice: '3-20',
      practiceSize: 'Solo or small group',
      location: 'UK, Europe, US',
    },
    painPoints: [
      'Jack of all trades, master of none — covers every body system',
      'Overwhelmed by the breadth of functional medicine assessments',
      'Needs a unified framework that covers all zones without deep specialisation',
      'Struggles to prioritise which body system to address first',
      'Clinical reasoning is good but not systematic',
    ],
    motivations: [
      'Wants a complete platform that covers Z1 through Z5',
      'Values the 7-node model as a unifying framework',
      'Seeks faster clinical reasoning across all body systems',
      'Desires confidence when addressing unfamiliar zones',
      'Wants to grow practice by offering comprehensive assessments',
    ],
    objections: [
      'Worried about information overload',
      'Concerned the platform is too complex for general use',
      'Price sensitivity — is the full platform necessary?',
      'Unsure how long onboarding will take',
    ],
    decisionTriggers: [
      'End-to-end demo showing a general patient case',
      'Clear prioritisation engine (which zone to address first)',
      'Guided onboarding with manageable learning curve',
      'Founding cohort community and peer support',
    ],
    preferredChannels: ['email', 'LinkedIn', 'webinars', 'peer groups'],
    languagePatterns: {
      resonates: [
        'complete terrain assessment',
        'unified framework',
        'clinical prioritisation',
        '7-node model',
        'all five zones',
        'where to start',
      ],
      avoids: [
        'specialist-only',
        'requires deep expertise',
        'advanced clinical knowledge assumed',
      ],
    },
    relevantZones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
    relevantCascades: ['All major cascades'],
    pricingTier: `GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)`,
    conversionHooks: [
      'One platform, all five zones, complete terrain assessment',
      'Prioritisation engine tells you where to start',
      'No need to specialise — the framework guides you',
      'See complex patients with confidence from day one',
    ],
  },

  'newly-qualified': {
    segment: 'newly-qualified',
    demographics: {
      typicalAge: '25-35',
      yearsInPractice: '0-3',
      practiceSize: 'Solo (just starting)',
      location: 'UK, Europe',
    },
    painPoints: [
      'Lacks clinical experience for complex multi-system cases',
      'No established patient base yet',
      'Uncertain how to structure functional medicine consultations',
      'Overwhelmed by the volume of literature and protocols',
      'Imposter syndrome when faced with experienced patients',
    ],
    motivations: [
      'Wants a structured framework to build clinical confidence',
      'Seeks a mentor-like tool that guides clinical reasoning',
      'Values affordability and founding cohort access',
      'Desires to differentiate from day one with advanced assessments',
      'Wants to build credibility quickly with evidence-graded outputs',
    ],
    objections: [
      'Price is a barrier at early career stage',
      'Worried about relying too heavily on a platform',
      'Unsure if they have enough clinical knowledge to use it',
      'Concerned about making mistakes with complex assessments',
    ],
    decisionTriggers: [
      'Guided first-patient session with Dr Faisal',
      'Clear evidence tiers that support learning',
      'Affordable founding cohort pricing',
      'Testimonials from other newly qualified practitioners',
      'Risk-free trial period',
    ],
    preferredChannels: ['LinkedIn', 'Instagram', 'email', 'online communities'],
    languagePatterns: {
      resonates: [
        'clinical confidence',
        'guided assessment',
        'learn as you practise',
        'evidence-graded',
        'structured approach',
        'mentor-like support',
      ],
      avoids: [
        'expert-level',
        'assumes clinical experience',
        'advanced practitioners only',
      ],
    },
    relevantZones: ['Z1', 'Z2', 'Z4'],
    relevantCascades: ['Gut-Immune', 'Metabolic Basics'],
    pricingTier: `GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)`,
    conversionHooks: [
      'Build clinical confidence from your very first patient',
      'Evidence tiers teach you as you assess',
      'Guided sessions with the founder included',
      'Start your career with the same tools experienced practitioners use',
    ],
  },

  'experienced-solo': {
    segment: 'experienced-solo',
    demographics: {
      typicalAge: '40-60',
      yearsInPractice: '10-30',
      practiceSize: 'Solo practitioner',
      location: 'UK, US, Australia',
    },
    painPoints: [
      'Clinical reasoning is excellent but unscalable',
      'All knowledge lives in their head — no system to capture it',
      'Burnout from seeing complex patients back to back',
      'Cannot take holiday without losing momentum',
      'Patients expect faster results but complexity requires time',
    ],
    motivations: [
      'Wants to systematise decades of clinical intuition',
      'Seeks time savings without sacrificing clinical depth',
      'Values a platform that respects clinical autonomy',
      'Desires to see their own reasoning reflected back structurally',
      'Wants to eventually scale or bring on associates',
    ],
    objections: [
      'Has practised successfully without technology for years',
      'Sceptical that a platform can match their clinical reasoning',
      'Concerned about learning curve at this career stage',
      'Does not want to change established workflow',
    ],
    decisionTriggers: [
      'Demo showing how the platform augments (not replaces) reasoning',
      'Time savings demonstration (60 minutes down to 30)',
      'Built by a fellow clinician, not a tech startup',
      'Option to customise assessment priorities',
    ],
    preferredChannels: ['email', 'phone', 'in-person events', 'peer recommendation'],
    languagePatterns: {
      resonates: [
        'augment your reasoning',
        'save time',
        'clinical autonomy',
        'systematise your expertise',
        'built by a clinician',
        'respect your workflow',
      ],
      avoids: [
        'replace your judgement',
        'AI knows better',
        'disruptive technology',
        'move fast and break things',
      ],
    },
    relevantZones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
    relevantCascades: ['All major cascades'],
    pricingTier: `GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)`,
    conversionHooks: [
      'Systematise your decades of clinical intuition',
      'Save 30 minutes per patient without sacrificing depth',
      'Built by a clinician who understands your workflow',
      'Your reasoning, structured and evidence-graded',
    ],
  },

  'group-practice': {
    segment: 'group-practice',
    demographics: {
      typicalAge: '35-55 (lead practitioner)',
      yearsInPractice: '10-25 (lead), 2-10 (associates)',
      practiceSize: 'Group (3-10 practitioners)',
      location: 'UK, US',
    },
    painPoints: [
      'Inconsistent clinical reasoning across practitioners in the group',
      'No standardised assessment framework for the team',
      'Difficult to maintain quality when associates see complex patients',
      'Training new associates takes months of shadowing',
      'Cannot easily review or audit associate assessments',
    ],
    motivations: [
      'Wants a standardised platform for the entire practice',
      'Seeks to reduce training time for new associates',
      'Values consistent quality across all practitioners',
      'Desires audit and review capabilities for clinical governance',
      'Wants to scale the practice without diluting quality',
    ],
    objections: [
      'Multi-seat pricing concerns',
      'Change management across the team',
      'Integration with existing practice management software',
      'Data sharing and privacy across practitioners',
      'Resistance from experienced associates',
    ],
    decisionTriggers: [
      'Multi-seat pricing and group discount',
      'Admin dashboard for practice lead',
      'Standardised assessment templates across the team',
      'Clinical governance and audit trail',
      'Reference from another group practice',
    ],
    preferredChannels: ['email', 'phone', 'in-person meeting', 'LinkedIn'],
    languagePatterns: {
      resonates: [
        'practice-wide standardisation',
        'clinical governance',
        'team consistency',
        'reduce training time',
        'scalable quality',
        'audit trail',
      ],
      avoids: [
        'individual use only',
        'solo practitioner tool',
        'no team features',
      ],
    },
    relevantZones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
    relevantCascades: ['All major cascades'],
    pricingTier: 'Custom group pricing (contact for quote)',
    conversionHooks: [
      'One platform, consistent quality across your entire team',
      'Reduce associate training time from months to weeks',
      'Clinical governance and audit trail built in',
      'Scale your practice without diluting clinical excellence',
    ],
  },
};

// --- Core Functions ---

/**
 * Get the full persona profile for a given segment.
 */
export function getPersona(segment: PersonaSegment): PractitionerPersona {
  return PERSONAS[segment];
}

/**
 * Get the most relevant persona for a given speciality string.
 * Matches against known speciality keywords.
 */
export function getPersonaForSpeciality(speciality: string): PractitionerPersona {
  const lower = speciality.toLowerCase();

  if (/gut|gastro|microbiome|sibo|digest/i.test(lower)) {
    return PERSONAS['gut-specialist'];
  }
  if (/hormone|endocrin|thyroid|adrenal|hrt|menopaus/i.test(lower)) {
    return PERSONAS['hormone-specialist'];
  }
  if (/ifm|institute.*functional/i.test(lower)) {
    return PERSONAS['ifm-trained'];
  }
  if (/group|multi.*practitioner|team/i.test(lower)) {
    return PERSONAS['group-practice'];
  }
  if (/new|junior|graduate|recently.*qualified/i.test(lower)) {
    return PERSONAS['newly-qualified'];
  }
  if (/solo|independent|established/i.test(lower)) {
    return PERSONAS['experienced-solo'];
  }
  if (/functional.*medicine|fm\b/i.test(lower)) {
    return PERSONAS['general-fm'];
  }

  // Default to general FM
  return PERSONAS['general-fm'];
}

/**
 * Get all available persona segments.
 */
export function getAllSegments(): PersonaSegment[] {
  return Object.keys(PERSONAS) as PersonaSegment[];
}

/**
 * Generate a personalised message for a given persona and message type.
 * Uses the persona's language patterns, pain points, and conversion hooks.
 */
export function generatePersonalisedMessage(
  persona: PractitionerPersona,
  messageType: MessageType
): string {
  const { segment, painPoints, conversionHooks, languagePatterns } = persona;
  const name = VM_BRAND.credentials.name;
  const quals = VM_BRAND.credentials.qualifications;
  const platform = VM_BRAND.platform.descriptor;

  const primaryPain = painPoints[0];
  const primaryHook = conversionHooks[0];
  const resonantTerm = languagePatterns.resonates[0];

  switch (messageType) {
    case 'email-intro':
      return [
        `Subject: A ${resonantTerm} approach built for practitioners like you`,
        '',
        'Dear Colleague,',
        '',
        `I understand the challenge: ${primaryPain.toLowerCase()}.`,
        '',
        `That is precisely why I built VitalMatrix, a ${platform} designed for functional medicine practitioners. ${primaryHook}.`,
        '',
        `As a fellow clinician (${quals}), I built this platform to solve problems I face every day in practice. Every clinical output is evidence-graded. No black boxes.`,
        '',
        `I would welcome the opportunity to show you how VitalMatrix works with a 30-minute guided session.`,
        '',
        'Kind regards,',
        '',
        `${name}, ${quals}`,
        VM_BRAND.credentials.title,
        '',
        VM_BRAND.regulatoryFooter,
      ].join('\n');

    case 'linkedin-message':
      return [
        `Hello — I noticed your background in ${segment.replace(/-/g, ' ')} practice.`,
        '',
        `I am ${name} (${quals}), founder of VitalMatrix, a ${platform} for functional medicine practitioners.`,
        '',
        `${primaryHook}.`,
        '',
        `Would you be open to a brief conversation about how ${resonantTerm} could support your clinical work?`,
        '',
        `Best wishes,`,
        `${name}`,
      ].join('\n');

    case 'follow-up':
      return [
        `Subject: Following up — ${resonantTerm} for your practice`,
        '',
        'Dear Colleague,',
        '',
        `I wanted to follow up on my earlier message about VitalMatrix.`,
        '',
        `Many practitioners tell us their biggest challenge is: ${primaryPain.toLowerCase()}. VitalMatrix addresses this directly.`,
        '',
        `${conversionHooks[1] || primaryHook}.`,
        '',
        `Would next week work for a 15-minute call? I am happy to work around your schedule.`,
        '',
        'Kind regards,',
        `${name}, ${quals}`,
        '',
        VM_BRAND.regulatoryFooter,
      ].join('\n');

    case 'demo-invite':
      return [
        `Subject: Your VitalMatrix guided session — book your slot`,
        '',
        'Dear Colleague,',
        '',
        `Thank you for your interest in VitalMatrix. I would like to personally walk you through the platform.`,
        '',
        `During your 30-minute guided session, you will see:`,
        `- ${conversionHooks[0]}`,
        `- ${conversionHooks[1] || 'Evidence-graded clinical outputs'}`,
        `- ${conversionHooks[2] || 'Real patient scenario walkthrough'}`,
        '',
        `As a ${segment.replace(/-/g, ' ')} practitioner, you will find the ${persona.relevantZones.join(', ')} zone${persona.relevantZones.length > 1 ? 's' : ''} particularly relevant to your practice.`,
        '',
        `Pricing: ${persona.pricingTier}.`,
        '',
        `Book your session: ${VM_BRAND.platform.domain}/book`,
        '',
        'Kind regards,',
        `${name}, ${quals}`,
        '',
        VM_BRAND.regulatoryFooter,
      ].join('\n');

    case 'case-study-share':
      return [
        `Subject: Case study — how a ${segment.replace(/-/g, ' ')} practitioner uses VitalMatrix`,
        '',
        'Dear Colleague,',
        '',
        `I thought you might find this relevant. We recently documented how a ${segment.replace(/-/g, ' ')} practitioner used VitalMatrix to address a common challenge:`,
        '',
        `"${primaryPain}"`,
        '',
        `Using the ${persona.relevantZones.join(', ')} zone assessment and ${persona.relevantCascades[0] || 'cascade'} detection, the practitioner was able to ${primaryHook.toLowerCase()}.`,
        '',
        `The full case study is available at ${VM_BRAND.platform.domain}/case-studies.`,
        '',
        'Kind regards,',
        `${name}, ${quals}`,
        '',
        VM_BRAND.regulatoryFooter,
      ].join('\n');

    case 'newsletter-cta':
      return [
        `**For ${segment.replace(/-/g, ' ')} practitioners:**`,
        '',
        `${primaryPain}? ${primaryHook}.`,
        '',
        `Discover how VitalMatrix ${resonantTerm} transforms your clinical workflow.`,
        '',
        `[Learn more](https://${VM_BRAND.platform.domain}/for/${segment})`,
        '',
        `*${VM_BRAND.regulatoryFooter}*`,
      ].join('\n');

    default:
      return `Personalised message for ${segment} — contact ${name} at ${VM_BRAND.platform.domain}`;
  }
}

/**
 * Generate a persona comparison summary across all segments.
 */
export function generatePersonaSummary(): string {
  const lines: string[] = [];

  lines.push('='.repeat(64));
  lines.push('  VITALMATRIX PRACTITIONER PERSONA MAP');
  lines.push(`  ${VM_BRAND.platform.descriptor} | ${VM_BRAND.platform.domain}`);
  lines.push('='.repeat(64));
  lines.push('');

  for (const segment of getAllSegments()) {
    const p = PERSONAS[segment];
    lines.push(`[${segment.toUpperCase()}]`);
    lines.push(`  Age: ${p.demographics.typicalAge} | Experience: ${p.demographics.yearsInPractice} years`);
    lines.push(`  Practice: ${p.demographics.practiceSize}`);
    lines.push(`  Zones: ${p.relevantZones.join(', ')}`);
    lines.push(`  Pricing: ${p.pricingTier}`);
    lines.push(`  Top pain: ${p.painPoints[0]}`);
    lines.push(`  Top hook: ${p.conversionHooks[0]}`);
    lines.push('');
  }

  lines.push('-'.repeat(64));
  lines.push(`${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`);
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
