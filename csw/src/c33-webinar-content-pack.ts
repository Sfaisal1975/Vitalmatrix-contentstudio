/**
 * Component 33: Webinar Content Pack Generator
 *
 * Generates a full event content pack: slides outline (10-12 slides),
 * speaker notes, attendee handout with zone diagram, and a 3-email
 * follow-up sequence (thank you + recording, deep dive blog, CTA
 * for discovery call).
 *
 * All outputs are VM-branded and K10-compliant.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface WebinarConfig {
  title: string;
  topic: string;
  targetSegment: string;
  date: string;
  duration: number;          // minutes
  speakerBio: string;
}

export interface SlideOutline {
  slideNumber: number;
  title: string;
  bulletPoints: string[];
  speakerNote: string;
  duration: number;          // minutes allocated to this slide
}

export interface WebinarPack {
  slidesOutline: SlideOutline[];
  speakerNotes: string;
  attendeeHandout: string;
  followUpSequence: string[];
  recordingSummaryTemplate: string;
}

// --- Constants ---

const DEFAULT_SLIDE_COUNT = 12;

// --- Slide Generation ---

/**
 * Generates a 10-12 slide outline branded with VitalMatrix design system.
 */
export function generateSlidesOutline(config: WebinarConfig): SlideOutline[] {
  const { title, topic, targetSegment, duration } = config;
  const { credentials, platform } = VM_BRAND;

  // Calculate per-slide duration (roughly)
  const avgDuration = Math.floor(duration / DEFAULT_SLIDE_COUNT);
  const remainder = duration - (avgDuration * DEFAULT_SLIDE_COUNT);

  const slides: SlideOutline[] = [
    {
      slideNumber: 1,
      title: `Welcome: ${title}`,
      bulletPoints: [
        `Presenter: ${credentials.name}, ${credentials.qualifications}`,
        `${credentials.title}, ${credentials.company}`,
        `Today's focus: ${topic}`,
        `Audience: ${targetSegment}`,
      ],
      speakerNote: `Welcome attendees by name if possible. Mention that VitalMatrix is a ${platform.descriptor} designed for qualified practitioners. Set expectations for the session duration (${duration} minutes) and confirm recording availability.`,
      duration: avgDuration,
    },
    {
      slideNumber: 2,
      title: 'The Clinical Challenge',
      bulletPoints: [
        'Functional medicine assessments typically take 45-60 minutes per patient',
        'Cross-system interactions are difficult to track manually',
        'Evidence quality varies and is rarely labelled',
        `${targetSegment} practitioners need structured, reproducible terrain analysis`,
      ],
      speakerNote: `Frame the problem from the practitioner's perspective. Use specific examples relevant to ${targetSegment}. Avoid naming any competitor tools or practitioners.`,
      duration: avgDuration,
    },
    {
      slideNumber: 3,
      title: 'Introducing VitalMatrix',
      bulletPoints: [
        `A ${platform.descriptor} for functional medicine practitioners`,
        '5-zone terrain model with 7 physiological nodes',
        'Every output carries an evidence tier label',
        'Builds upon IFM principles with quantified scoring',
      ],
      speakerNote: `Emphasise "builds upon" rather than "corrects" or "replaces". VitalMatrix amplifies what trained practitioners already know. This is the core IFM amplification framing.`,
      duration: avgDuration,
    },
    {
      slideNumber: 4,
      title: 'The 5-Zone Terrain Model',
      bulletPoints: [
        'Z1: Metabolic energy and mitochondrial function',
        'Z2: Gut terrain and immune interface',
        'Z3: Cardiovascular and communication networks',
        'Z4: Detoxification and structural integrity',
        'Z5: Hormonal terrain and neuroendocrine balance',
      ],
      speakerNote: `Walk through each zone briefly. Mention that each zone maps to IFM matrix categories. Use the zone diagram from the handout. Highlight that Z5 has a lower threshold (32 vs 35 for Z1-Z4).`,
      duration: avgDuration + Math.min(remainder, 1),
    },
    {
      slideNumber: 5,
      title: 'CascadeIQ: Cross-Zone Mapping',
      bulletPoints: [
        'Six validated inter-zone cascades (S1-S6)',
        'Directional influence: which zone drives which',
        'TerrainLock detection for self-perpetuating loops',
        'Enables upstream intervention targeting',
      ],
      speakerNote: `This is the key differentiator. Show how a gut issue (Z2) can cascade to thyroid (Z1 via S1) and cardiovascular (Z3 via S5). Explain that without cascade awareness, practitioners chase symptoms.`,
      duration: avgDuration,
    },
    {
      slideNumber: 6,
      title: 'Evidence Tiers in Practice',
      bulletPoints: [
        'Established: peer-reviewed, replicated findings',
        'Emerging: promising research with limited replication',
        'Theoretical: mechanistically sound, awaiting clinical data',
        'Observed in Practice: clinical observation, not yet published',
        'Contested: conflicting evidence, requires careful interpretation',
      ],
      speakerNote: 'Show a real example of how the same nutrient-condition pairing might carry different evidence tiers depending on the specific claim. This builds trust with evidence-minded practitioners.',
      duration: avgDuration,
    },
    {
      slideNumber: 7,
      title: `Relevance to ${targetSegment}`,
      bulletPoints: [
        `How ${topic} maps to the terrain model`,
        'Speciality-specific zone priorities',
        'Case flow: intake to terrain assessment to support considerations',
        'Time savings in your specific workflow',
      ],
      speakerNote: `Tailor this slide heavily to the ${targetSegment} audience. Use speciality-specific language and examples. Reference the zone mapping most relevant to their practice.`,
      duration: avgDuration,
    },
    {
      slideNumber: 8,
      title: 'The Processing Pipeline',
      bulletPoints: [
        'FLINT: initial data intake and normalisation',
        'APEX: zone scoring with dampened maximum',
        'STRIDE: 30-rule validation layer',
        'CADENCE: temporal trend analysis',
        'VISTA: final clinical presentation',
      ],
      speakerNote: 'Keep this high-level. Practitioners want to know the pipeline exists and is rigorous, but they do not need implementation detail. Emphasise that T-01 protective architecture ensures every output requires their decision.',
      duration: avgDuration,
    },
    {
      slideNumber: 9,
      title: 'Live Demonstration',
      bulletPoints: [
        'INTAKE form: 10-15 minutes for the patient',
        'Terrain assessment returned in seconds',
        'Zone scores, cascade alerts, TerrainLock flags',
        'Support considerations with evidence tier labels',
      ],
      speakerNote: `If possible, run a live demo with anonymised sample data. Walk through the INTAKE form, show the terrain map, highlight a cascade alert, and demonstrate the evidence tier labelling on a support consideration.`,
      duration: avgDuration + Math.max(0, remainder - 1),
    },
    {
      slideNumber: 10,
      title: 'Data Security and Compliance',
      bulletPoints: [
        `ICO registered: ${VM_BRAND.platform.ico}`,
        'AES-256-GCM field-level encryption',
        'UK data residency, GDPR Art 17 compliant',
        'Class I SaMD registered',
      ],
      speakerNote: 'Address data security early and directly. Many practitioners have concerns about patient data in cloud platforms. Emphasise UK residency and field-level encryption.',
      duration: avgDuration,
    },
    {
      slideNumber: 11,
      title: 'Founding Cohort Offer',
      bulletPoints: [
        `GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)`,
        `${VM_BRAND.pricing.guarantee}, no lock-in contract`,
        'Unlimited assessments within subscription',
        '10 founding spots: limited availability',
        'Direct access to the clinical architect during founding phase',
      ],
      speakerNote: `Create urgency with the limited spots. Mention that standard rate from month ${VM_BRAND.pricing.foundingFixedMonths + 1} is GBP ${VM_BRAND.pricing.standardRate}. Reiterate no lock-in and monthly billing.`,
      duration: avgDuration,
    },
    {
      slideNumber: 12,
      title: 'Questions and Next Steps',
      bulletPoints: [
        'Open Q&A session',
        'Book a discovery call: personalised to your speciality',
        `Contact: ${VM_BRAND.platform.domain}`,
        'Recording will be available within 24 hours',
      ],
      speakerNote: `Encourage questions. Have the discovery call booking link ready. Mention the follow-up email sequence: recording link tomorrow, deep dive content in 3 days, personalised discovery call invitation in 7 days.`,
      duration: avgDuration,
    },
  ];

  return slides;
}

// --- Speaker Notes ---

/**
 * Generates consolidated speaker notes for the entire webinar.
 */
export function generateSpeakerNotes(config: WebinarConfig): string {
  const slides = generateSlidesOutline(config);
  const { credentials } = VM_BRAND;

  const lines: string[] = [
    `# Speaker Notes: ${config.title}`,
    '',
    `**Presenter:** ${credentials.name}, ${credentials.qualifications}`,
    `**Date:** ${config.date}`,
    `**Duration:** ${config.duration} minutes`,
    `**Target audience:** ${config.targetSegment}`,
    '',
    '---',
    '',
  ];

  for (const slide of slides) {
    lines.push(`## Slide ${slide.slideNumber}: ${slide.title} (${slide.duration} min)`);
    lines.push('');
    lines.push('**Key points:**');
    for (const bp of slide.bulletPoints) {
      lines.push(`- ${bp}`);
    }
    lines.push('');
    lines.push(`**Notes:** ${slide.speakerNote}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('**Reminders:**');
  lines.push('- Never name competitor platforms or practitioners (K10)');
  lines.push('- Use "builds upon" not "corrects" when referencing IFM');
  lines.push('- Evidence tier label on every clinical claim');
  lines.push(`- Close with: "${VM_BRAND.regulatoryFooter}"`);

  return lines.join('\n');
}

// --- Attendee Handout ---

/**
 * Generates a one-page attendee handout with zone diagram and key takeaways.
 */
export function generateHandout(config: WebinarConfig): string {
  const { credentials, platform } = VM_BRAND;

  return `# ${config.title}
## Attendee Handout

**Presenter:** ${credentials.name}, ${credentials.qualifications} | ${credentials.title}, ${credentials.company}
**Date:** ${config.date} | **Duration:** ${config.duration} minutes

---

### The VitalMatrix 5-Zone Terrain Model

\`\`\`
+-------------------+-------------------+-------------------+
|                   |                   |                   |
|   Z1: Metabolic   |   Z2: Gut and     |   Z3: Cardio and  |
|   Energy          |   Immune          |   Communication   |
|   Threshold: 35   |   Threshold: 35   |   Threshold: 35   |
|                   |                   |                   |
+-------------------+-------------------+-------------------+
|                   |                   |
|   Z4: Detox and   |   Z5: Hormonal    |
|   Structural      |   Terrain         |
|   Threshold: 35   |   Threshold: 32   |
|                   |                   |
+-------------------+-------------------+

Cascades: S1 (Z2-Z1) | S2 (Z1-Z5) | S3 (Z4-Z1) | S4 (Z5-Z2)
          S5 (Z2-Z3) | S6 (Z1-Z3) UNIDIRECTIONAL
\`\`\`

### Key Takeaways

1. **Terrain over symptoms:** The 5-zone model maps interconnected physiological systems, not isolated complaints.

2. **Evidence tiers matter:** Every VitalMatrix output labels its evidence confidence (Established, Emerging, Theoretical, Observed in Practice, Contested).

3. **Cascade awareness:** CascadeIQ identifies which zone is driving dysfunction in another, enabling upstream intervention.

4. **TerrainLock detection:** Self-perpetuating loops are flagged so practitioners can break the cycle rather than chase symptoms.

5. **Practitioner decision required:** T-01 protective architecture ensures every output requires your professional judgement. VitalMatrix does not diagnose or prescribe.

### Today's Topic: ${config.topic}

This session explored how ${config.topic} maps to the VitalMatrix terrain model, with specific relevance to ${config.targetSegment} practitioners.

### Next Steps

- **Book a discovery call:** Personalised to your speciality and workflow
- **Visit:** ${platform.domain}
- **Founding cohort:** GBP ${VM_BRAND.pricing.foundingMonthly}/month, ${VM_BRAND.pricing.guarantee}

---

*${VM_BRAND.regulatoryFooter}*

*${VM_BRAND.tmFooter}*
`;
}

// --- Follow-Up Sequence ---

/**
 * Generates a 3-email follow-up sequence:
 * 1. Thank you + recording link (sent within 24 hours)
 * 2. Deep dive blog post (sent at day 3)
 * 3. CTA for discovery call (sent at day 7)
 */
export function generateFollowUpSequence(config: WebinarConfig): string[] {
  const { credentials, platform } = VM_BRAND;

  const email1 = `Subject: Recording: ${config.title}

Dear colleague,

Thank you for attending "${config.title}" on ${config.date}. It was a pleasure to share how VitalMatrix approaches ${config.topic} within the terrain model.

**Your recording is ready:**
[Recording link]

**Key moments to revisit:**
- The 5-zone terrain model overview (slide 4)
- CascadeIQ cross-zone mapping (slide 5)
- Live demonstration of INTAKE to terrain assessment (slide 9)

If you have follow-up questions, simply reply to this email. As a founding cohort candidate, you have direct access to me during this phase.

With best regards,

${credentials.name}, ${credentials.qualifications}
${credentials.title}, ${credentials.company}
${platform.domain}

${VM_BRAND.regulatoryFooter}`;

  const email2 = `Subject: Deep Dive: ${config.topic} and the Terrain Model

Dear colleague,

Following our webinar on ${config.date}, I wanted to share a deeper exploration of ${config.topic} and how it maps to the VitalMatrix terrain model.

**Understanding ${config.topic} through terrain mapping:**

In conventional practice, ${config.topic} is often assessed in isolation. The VitalMatrix ${platform.descriptor} maps it across interconnected zones, revealing cascade relationships that change the clinical picture.

For ${config.targetSegment} practitioners, the most relevant zones are typically Z1 (metabolic energy) and Z2 (gut and immune), connected by cascade S1. When the gut terrain is compromised, downstream effects on metabolic energy are quantified and tracked over time.

**Evidence approach:**
Every finding carries an evidence tier label. We never present unqualified claims. This gives you the confidence to discuss findings with patients and colleagues alike.

**Want to see your own patient data mapped?**
A discovery call walks through a sample assessment tailored to your speciality. No obligation, no lock-in.

With best regards,

${credentials.name}, ${credentials.qualifications}
${credentials.title}, ${credentials.company}
${platform.domain}

${VM_BRAND.regulatoryFooter}`;

  const email3 = `Subject: Your Personalised Discovery Call

Dear colleague,

One week on from "${config.title}", I wanted to offer you a personalised discovery call.

**What happens on a discovery call:**
- I map VitalMatrix to your specific speciality (${config.targetSegment})
- We walk through a sample terrain assessment using anonymised data
- You see how CascadeIQ, TerrainLock, and evidence tiers work in your clinical context
- We discuss the founding cohort offer (GBP ${VM_BRAND.pricing.foundingMonthly}/month)

**This is not a sales pitch.** It is a clinical demonstration tailored to your workflow. If VitalMatrix is not the right fit, I will tell you directly.

**Founding cohort spots remaining:** limited availability (10 total).

Book your call: [Booking link]

Or simply reply to this email with your preferred time.

With best regards,

${credentials.name}, ${credentials.qualifications}
${credentials.title}, ${credentials.company}
${platform.domain}

${VM_BRAND.regulatoryFooter}`;

  return [email1, email2, email3];
}

// --- Recording Summary Template ---

function generateRecordingSummaryTemplate(config: WebinarConfig): string {
  return `# Webinar Recording Summary

**Title:** ${config.title}
**Date:** ${config.date}
**Duration:** ${config.duration} minutes
**Presenter:** ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}
**Target segment:** ${config.targetSegment}

## Summary

[Insert 3-4 paragraph summary of the webinar content, key points discussed, and audience questions addressed.]

## Key Timestamps

- 00:00 - Welcome and introduction
- [MM:SS] - The clinical challenge
- [MM:SS] - VitalMatrix terrain model overview
- [MM:SS] - CascadeIQ demonstration
- [MM:SS] - Evidence tiers explanation
- [MM:SS] - Live demonstration
- [MM:SS] - Founding cohort offer
- [MM:SS] - Q&A session

## Audience Questions Addressed

1. [Question] - [Summary of answer]
2. [Question] - [Summary of answer]
3. [Question] - [Summary of answer]

## Follow-Up Actions

- [ ] Send recording link to attendees (within 24 hours)
- [ ] Send deep dive email (day 3)
- [ ] Send discovery call CTA (day 7)
- [ ] Log attendee details in pipeline

---

*${VM_BRAND.regulatoryFooter}*
`;
}

// --- Main Generator ---

/**
 * Generates the complete webinar content pack including slides outline,
 * speaker notes, attendee handout, follow-up email sequence, and
 * recording summary template.
 */
export function generateWebinarPack(config: WebinarConfig): WebinarPack {
  return {
    slidesOutline: generateSlidesOutline(config),
    speakerNotes: generateSpeakerNotes(config),
    attendeeHandout: generateHandout(config),
    followUpSequence: generateFollowUpSequence(config),
    recordingSummaryTemplate: generateRecordingSummaryTemplate(config),
  };
}
