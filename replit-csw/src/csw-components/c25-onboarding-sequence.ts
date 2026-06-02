/**
 * Component 25: Practitioner Onboarding Sequence
 * EXTREMELY HIGH-YIELD
 *
 * Drip content engine for new subscribers.
 * Day 1 → Week 1 → Week 2 → Month 1 → Month 3.
 * Reduces churn from the moment a practitioner signs up.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type SequenceStage = 'day-1' | 'day-3' | 'week-1' | 'week-2' | 'month-1' | 'month-3';

export interface OnboardingEmail {
  stage: SequenceStage;
  dayOffset: number;
  subject: string;
  body: string;
  attachments: string[];
  cta: string;
}

export interface OnboardingConfig {
  practitionerName: string;
  ifmTrained: boolean;
  startDate: string;
}

// --- Sequence ---

export function generateOnboardingSequence(config: OnboardingConfig): OnboardingEmail[] {
  const { practitionerName, ifmTrained } = config;
  const greeting = `Dear ${practitionerName}`;

  return [
    {
      stage: 'day-1',
      dayOffset: 0,
      subject: 'Welcome to VitalMatrix\u2122 — Your Account is Ready',
      body: `${greeting},

Welcome to the VitalMatrix\u2122 founding cohort. Your account is now active.

Here is what happens next:

1. Log in with your credentials (sent separately)
2. Review the platform walkthrough guide (attached)
3. Book your guided first-patient session with Dr Faisal

Your guided session will walk you through the complete INTAKE\u2122 form, FLINT\u2122 terrain assessment, and your first Terrain Support Considerations output.

${ifmTrained ? 'As an IFM-trained practitioner, you will find the 7-node model maps directly to the IFM matrix framework you already use.' : 'The 7-node terrain model provides a structured framework for functional medicine assessment. No prior IFM training is required.'}

We are building this platform for practitioners like you. Your feedback during these early months shapes what VitalMatrix\u2122 becomes.

Kind regards,

${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}
${VM_BRAND.credentials.title}

${VM_BRAND.regulatoryFooter}`,
      attachments: ['Platform Walkthrough Guide', 'Quick Start Card'],
      cta: 'Book Your Guided Session',
    },
    {
      stage: 'day-3',
      dayOffset: 3,
      subject: 'VitalMatrix\u2122 — Understanding Your First Terrain Assessment',
      body: `${greeting},

Before your guided session, here is a quick overview of what you will see:

**FLINT\u2122 Pipeline**
Your patient data flows through 7 engines. Each one answers a specific clinical question:
- WHERE is the burden? (Node scoring)
- WHICH zones are activated? (Zone logic)
- HOW are they connected? (Cascade detection)
- WHO started it? (Burden designation)

**What the Output Looks Like**
You will receive a "Terrain Support Considerations" document with:
- Zone-by-zone scores (0-10 resilience scale)
- Cascade pathway analysis with evidence tiers
- Support considerations (supplements, dietary, lifestyle only)
- A blank Practitioner Clinical Decision section for you to complete

Every output includes a protective header. VitalMatrix\u2122 supports your clinical judgement — it never replaces it.

${VM_BRAND.regulatoryFooter}`,
      attachments: ['Sample Terrain Support Considerations'],
      cta: 'Review Sample Output',
    },
    {
      stage: 'week-1',
      dayOffset: 7,
      subject: 'VitalMatrix\u2122 — Your First Patient: Step by Step',
      body: `${greeting},

This week, enter your first patient into VitalMatrix\u2122.

**Step 1: INTAKE\u2122 Form**
Complete the intake form (10-15 minutes). It covers:
- Medical history with node routing
- Energy curve (5-point diurnal pattern)
- Food reactivity with timing-based analysis
- Blood sugar markers
- Supplement response tracking

**Step 2: Review the Assessment**
The FLINT\u2122 pipeline processes the data and returns:
- 7-node burden profile
- 5-zone activation status
- Cascade pathway analysis
- Burden designation (highest and secondary zones)

**Step 3: Complete Your Clinical Decision**
Review the Terrain Support Considerations. Then complete the Practitioner Clinical Decision section with your assessment, treatment plan, and follow-up schedule.

**Step 4: Schedule Follow-Up**
Book the patient's next visit. At visit 2, DeltaScan\u2122 will show you what changed.

If you need help at any point, reply to this email.

${VM_BRAND.regulatoryFooter}`,
      attachments: ['INTAKE Form Guide', 'Zone Reference Card'],
      cta: 'Enter Your First Patient',
    },
    {
      stage: 'week-2',
      dayOffset: 14,
      subject: 'VitalMatrix\u2122 — CascadeAtlas\u2122 and Visual Mapping',
      body: `${greeting},

Now that you have entered your first patients, let us explore the visual tools.

**CascadeAtlas\u2122**
This is the visual representation of cascade pathways between zones. It shows:
- Which zones are active
- Which cascade stacks are firing
- The direction and evidence tier of each connection

**Key Things to Look For**
1. **TerrainLock\u2122** — A self-perpetuating loop (Z2\u2192Z1\u2192Z5\u2192Z2). If this fires, gut restoration (Z2) is the default starting point.
2. **S4 (Z5\u2192Z2)** — Always labelled Theoretical. This is the least established pathway.
3. **S6 (Z1\u2192Z3)** — UNIDIRECTIONAL. Energy drives cardiovascular, never the reverse.

**Feedback Welcome**
As a founding member, your feedback on these visualisations directly shapes the next version. Use the practitioner feedback form (Feature 152) to tell us what works and what does not.

${VM_BRAND.regulatoryFooter}`,
      attachments: ['CascadeAtlas Visual Guide'],
      cta: 'Explore CascadeAtlas',
    },
    {
      stage: 'month-1',
      dayOffset: 30,
      subject: 'VitalMatrix\u2122 — One Month Check-In',
      body: `${greeting},

You have been using VitalMatrix\u2122 for one month. Here are some questions for our check-in:

1. How many patients have you entered?
2. Has the terrain assessment matched your clinical intuition?
3. What would make the output more useful?
4. Any features you wish existed?
5. Would you recommend VitalMatrix\u2122 to a colleague?

Your answers directly shape the platform. As a founding member, you have priority input on feature development.

I would like to schedule a 15-minute call to discuss your experience. Reply with your availability or book directly.

${VM_BRAND.regulatoryFooter}`,
      attachments: [],
      cta: 'Book Check-In Call',
    },
    {
      stage: 'month-3',
      dayOffset: 90,
      subject: 'VitalMatrix\u2122 — DeltaScan\u2122: Seeing What Changed',
      body: `${greeting},

If you have patients returning for follow-up visits, DeltaScan\u2122 is now your most powerful tool.

**What DeltaScan\u2122 Shows**
- Visit-to-visit comparison of all 7 node scores
- Zone activation changes (did Z2 improve after gut protocol?)
- Cascade pathway changes (did S1 deactivate?)
- Terrain resilience trend (is the patient improving overall?)

**Why This Matters**
This is objective evidence of clinical progress. Practitioners tell us this is the feature that changes how they communicate with patients.

**Pilot Validation**
We are now collecting data for our pilot validation study (Feature 157). Your patient outcomes contribute to the evidence base for VitalMatrix\u2122. All data is anonymised and GDPR compliant.

Thank you for being part of the founding cohort.

${VM_BRAND.regulatoryFooter}`,
      attachments: ['DeltaScan Guide'],
      cta: 'Review Your DeltaScan Data',
    },
  ];
}

// --- Schedule Calculator ---

export function calculateSendDates(startDate: string): Record<SequenceStage, string> {
  const start = new Date(startDate);
  const offsets: Record<SequenceStage, number> = {
    'day-1': 0, 'day-3': 3, 'week-1': 7, 'week-2': 14, 'month-1': 30, 'month-3': 90,
  };

  const dates: Record<string, string> = {};
  for (const [stage, offset] of Object.entries(offsets)) {
    const d = new Date(start);
    d.setDate(d.getDate() + offset);
    dates[stage] = d.toISOString().split('T')[0];
  }

  return dates as Record<SequenceStage, string>;
}
