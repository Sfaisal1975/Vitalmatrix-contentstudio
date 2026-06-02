/**
 * Component 57: Hook Library
 *
 * Pre-built library of 100 hooks for social media ads and content.
 * Covers 10 hook types mapped to platforms and audience segments.
 * Includes performance scoring, A/B variant generation, and
 * ad hook sequence building (hook + bridge + CTA).
 *
 * All hooks are practitioner-facing (B2B). Never patient-facing.
 * K7/K8/K10 compliance enforced. No diagnostic language. No "clinical AI platform".
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Supported hook types */
export type HookType =
  | 'curiosity'
  | 'contrarian'
  | 'statistic'
  | 'question'
  | 'story-open'
  | 'pain-agitate'
  | 'authority'
  | 'scarcity'
  | 'social-proof'
  | 'challenge';

/** Supported platforms for hook targeting */
export type HookPlatform = 'linkedin' | 'facebook' | 'instagram' | 'x' | 'email' | 'all';

/** Practitioner audience segments */
export type PractitionerSegment =
  | 'ifm-trained'
  | 'naturopath'
  | 'integrative-gp'
  | 'functional-nutritionist'
  | 'new-to-functional'
  | 'established-practice'
  | 'solo-practitioner'
  | 'clinic-owner';

/** A single hook entry */
export interface Hook {
  id: string;
  text: string;
  hookType: HookType;
  platform: HookPlatform[];
  targetSegment: PractitionerSegment[];
  performanceScore?: number;
}

/** Categorised hook library */
export interface HookLibrary {
  hooks: Hook[];
  categories: Record<HookType, Hook[]>;
}

/** Ad hook sequence: hook + bridge + CTA */
export interface AdHookSequence {
  hook: string;
  bridge: string;
  cta: string;
  platform: string;
  topic: string;
}

// --- Pre-built Hooks (100) ---

/** Master hook library: 100 hooks across all 10 types */
const HOOKS: Hook[] = [
  // --- CURIOSITY (10) ---
  { id: 'cur-01', text: 'What if your gut assessment was wrong because you could not see the cascade?', hookType: 'curiosity', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'cur-02', text: 'There is a pattern hiding in your patient data that manual assessment will never find.', hookType: 'curiosity', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'cur-03', text: 'What happens when you map all 7 clinical nodes simultaneously?', hookType: 'curiosity', platform: ['all'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'cur-04', text: 'The connection between Zone 2 and Zone 4 that most practitioners overlook.', hookType: 'curiosity', platform: ['linkedin', 'x'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'cur-05', text: 'Why do some functional medicine practices grow 3x faster than others?', hookType: 'curiosity', platform: ['all'], targetSegment: ['solo-practitioner', 'clinic-owner'] },
  { id: 'cur-06', text: 'There is a reason your terrain assessment takes 45 minutes. And it is not clinical complexity.', hookType: 'curiosity', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'solo-practitioner'] },
  { id: 'cur-07', text: 'What would change if you could see every cascade interaction in real time?', hookType: 'curiosity', platform: ['all'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'cur-08', text: 'The single metric that predicts clinical complexity before you even start the consultation.', hookType: 'curiosity', platform: ['linkedin', 'x'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'cur-09', text: 'Most practitioners assess zones in isolation. Here is what they are missing.', hookType: 'curiosity', platform: ['all'], targetSegment: ['new-to-functional', 'functional-nutritionist'] },
  { id: 'cur-10', text: 'What if terrain medicine had the same analytical rigour as laboratory diagnostics?', hookType: 'curiosity', platform: ['linkedin'], targetSegment: ['integrative-gp', 'established-practice'] },

  // --- CONTRARIAN (10) ---
  { id: 'con-01', text: 'The IFM matrix is powerful. But it is manual. What if it was not?', hookType: 'contrarian', platform: ['all'], targetSegment: ['ifm-trained'] },
  { id: 'con-02', text: 'Functional medicine does not have a knowledge problem. It has a workflow problem.', hookType: 'contrarian', platform: ['linkedin', 'x'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'con-03', text: 'More supplements will not fix your practice. Better systems will.', hookType: 'contrarian', platform: ['all'], targetSegment: ['naturopath', 'functional-nutritionist'] },
  { id: 'con-04', text: 'Your clinical intuition is not enough. And that is actually good news.', hookType: 'contrarian', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'solo-practitioner'] },
  { id: 'con-05', text: 'The biggest risk in functional medicine is not getting it wrong. It is missing the cascade.', hookType: 'contrarian', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'con-06', text: 'You were trained to think in systems. So why is your assessment tool a spreadsheet?', hookType: 'contrarian', platform: ['linkedin', 'x'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'con-07', text: 'Terrain medicine is not alternative. It is the future of clinical assessment.', hookType: 'contrarian', platform: ['all'], targetSegment: ['new-to-functional', 'integrative-gp'] },
  { id: 'con-08', text: 'The best functional medicine practitioners do not work harder. They work with better data.', hookType: 'contrarian', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'con-09', text: 'Complexity is not the enemy. Unstructured complexity is.', hookType: 'contrarian', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'con-10', text: 'Stop treating symptoms of a broken workflow. Fix the system.', hookType: 'contrarian', platform: ['linkedin', 'x'], targetSegment: ['solo-practitioner', 'clinic-owner'] },

  // --- STATISTIC (10) ---
  { id: 'sta-01', text: 'Most functional medicine practitioners spend 45 minutes on what takes VitalMatrix 15 seconds.', hookType: 'statistic', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath', 'integrative-gp', 'functional-nutritionist', 'new-to-functional', 'established-practice', 'solo-practitioner', 'clinic-owner'] },
  { id: 'sta-02', text: '83% reduction in assessment preparation time. That is what our pilot practitioners reported.', hookType: 'statistic', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'sta-03', text: '7 clinical nodes. 5 zones. 6 cascade stacks. One unified assessment.', hookType: 'statistic', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'sta-04', text: 'The average practitioner loses 12 hours per week to manual terrain documentation.', hookType: 'statistic', platform: ['linkedin', 'x'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'sta-05', text: 'Practitioners using structured scoring identify 2.4x more cascade interactions.', hookType: 'statistic', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sta-06', text: 'GBP 99/month. 24 months fixed. No price increases. 10 founding spots only.', hookType: 'statistic', platform: ['all'], targetSegment: ['solo-practitioner', 'new-to-functional'] },
  { id: 'sta-07', text: 'Over 500 clinical elements mapped across the terrain model. Every one scored.', hookType: 'statistic', platform: ['linkedin'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sta-08', text: '6 pipeline engines process your clinical data before you see the first result.', hookType: 'statistic', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'sta-09', text: '30 clinical rules govern every STRIDE assessment. Zero are optional.', hookType: 'statistic', platform: ['linkedin', 'x'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sta-10', text: 'From intake to insight in under 60 seconds. That is the VitalMatrix pipeline.', hookType: 'statistic', platform: ['all'], targetSegment: ['established-practice', 'clinic-owner'] },

  // --- QUESTION (10) ---
  { id: 'que-01', text: 'How many cascade interactions did you miss in your last assessment?', hookType: 'question', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'que-02', text: 'Are you still using spreadsheets for terrain assessment in 2026?', hookType: 'question', platform: ['linkedin', 'x'], targetSegment: ['established-practice', 'solo-practitioner'] },
  { id: 'que-03', text: 'What if you could see every zone interaction before the consultation starts?', hookType: 'question', platform: ['all'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'que-04', text: 'When was the last time your clinical workflow genuinely surprised you?', hookType: 'question', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'que-05', text: 'Is your terrain assessment reproducible? Would a colleague reach the same score?', hookType: 'question', platform: ['linkedin'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'que-06', text: 'What would you do with 12 extra hours per week?', hookType: 'question', platform: ['all'], targetSegment: ['solo-practitioner', 'clinic-owner'] },
  { id: 'que-07', text: 'Can your current system detect a Zone 2 to Zone 4 cascade?', hookType: 'question', platform: ['linkedin', 'x'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'que-08', text: 'What does your patient intake actually tell you? And what does it miss?', hookType: 'question', platform: ['all'], targetSegment: ['new-to-functional', 'functional-nutritionist'] },
  { id: 'que-09', text: 'Ready to move from manual assessment to clinical intelligence?', hookType: 'question', platform: ['all'], targetSegment: ['established-practice', 'solo-practitioner'] },
  { id: 'que-10', text: 'If terrain medicine is systems-based, why are your tools siloed?', hookType: 'question', platform: ['linkedin', 'x'], targetSegment: ['ifm-trained', 'integrative-gp'] },

  // --- STORY-OPEN (10) ---
  { id: 'sto-01', text: 'A practitioner walked into a consultation with 45 minutes of prep notes. Then she found VitalMatrix.', hookType: 'story-open', platform: ['linkedin', 'facebook'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'sto-02', text: 'Three years ago, I realised that terrain medicine had a tooling problem no one was solving.', hookType: 'story-open', platform: ['linkedin'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sto-03', text: 'The cascade was obvious in hindsight. But without structured scoring, it was invisible.', hookType: 'story-open', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'sto-04', text: 'I spent 15 years in clinical medicine before I understood what terrain really meant.', hookType: 'story-open', platform: ['linkedin', 'facebook'], targetSegment: ['integrative-gp', 'new-to-functional'] },
  { id: 'sto-05', text: 'When we showed the first zone map to a pilot practitioner, she said: "This changes everything."', hookType: 'story-open', platform: ['all'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'sto-06', text: 'The patient had been to six practitioners. None had mapped the full terrain.', hookType: 'story-open', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'sto-07', text: 'It started with a simple question: why is functional medicine assessment still manual?', hookType: 'story-open', platform: ['linkedin'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sto-08', text: 'Every spreadsheet I built for terrain assessment had the same fatal flaw.', hookType: 'story-open', platform: ['all'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'sto-09', text: 'The founding cohort started with one practitioner and a prototype. Here is what happened next.', hookType: 'story-open', platform: ['linkedin', 'facebook'], targetSegment: ['new-to-functional', 'clinic-owner'] },
  { id: 'sto-10', text: 'She almost missed the neuroendocrine cascade. Almost.', hookType: 'story-open', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },

  // --- PAIN-AGITATE (10) ---
  { id: 'pai-01', text: 'You trained for years in functional medicine. And now you spend half your day on admin.', hookType: 'pain-agitate', platform: ['all'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'pai-02', text: 'Another patient, another 45-minute manual assessment. There has to be a better way.', hookType: 'pain-agitate', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'pai-03', text: 'Your clinical knowledge is world-class. Your workflow tools are from 2005.', hookType: 'pain-agitate', platform: ['all'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'pai-04', text: 'Missed cascades mean missed outcomes. And your current tools cannot catch them.', hookType: 'pain-agitate', platform: ['linkedin', 'x'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'pai-05', text: 'You know terrain medicine works. But proving it to patients takes hours of documentation.', hookType: 'pain-agitate', platform: ['all'], targetSegment: ['naturopath', 'functional-nutritionist'] },
  { id: 'pai-06', text: 'Every zone assessed in isolation. Every cascade discovered by accident. Sound familiar?', hookType: 'pain-agitate', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'pai-07', text: 'Your patients deserve better than a patchwork of spreadsheets and sticky notes.', hookType: 'pain-agitate', platform: ['all'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'pai-08', text: 'The irony: you teach patients to see the whole picture, but your tools only show fragments.', hookType: 'pain-agitate', platform: ['linkedin'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'pai-09', text: 'Burning out is not a badge of honour. It is a sign your systems need upgrading.', hookType: 'pain-agitate', platform: ['all'], targetSegment: ['solo-practitioner', 'clinic-owner'] },
  { id: 'pai-10', text: 'You did not become a practitioner to spend evenings on data entry.', hookType: 'pain-agitate', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'solo-practitioner'] },

  // --- AUTHORITY (10) ---
  { id: 'aut-01', text: 'Built by a clinician with 15+ years in medicine. Not by a tech company guessing at clinical needs.', hookType: 'authority', platform: ['all'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'aut-02', text: 'Dr Shahzad Faisal, MBBS, FAAMFM, designed VitalMatrix from the consulting room, not the boardroom.', hookType: 'authority', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'aut-03', text: 'ICO registered. GDPR compliant. Built for UK practitioners who take data seriously.', hookType: 'authority', platform: ['all'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'aut-04', text: 'Every clinical element in VitalMatrix is evidence-tiered. No black boxes.', hookType: 'authority', platform: ['linkedin'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'aut-05', text: 'VitalMatrix: the only terrain intelligence platform built specifically for terrain medicine.', hookType: 'authority', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'aut-06', text: 'From FLINT intake scoring to VISTA visualisation. Every step clinician-validated.', hookType: 'authority', platform: ['linkedin', 'x'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'aut-07', text: 'Over 500 clinical elements. 30 STRIDE rules. 6 cascade stacks. All peer-reviewed methodology.', hookType: 'authority', platform: ['linkedin'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'aut-08', text: 'We do not just claim clinical rigour. We publish our evidence tiers on every output.', hookType: 'authority', platform: ['all'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'aut-09', text: 'VitalMatrix Ltd. British-built. Clinician-led. Purpose-designed for functional medicine.', hookType: 'authority', platform: ['all'], targetSegment: ['integrative-gp', 'new-to-functional'] },
  { id: 'aut-10', text: 'FAAMFM-certified founder. IFM-aligned methodology. Real clinical pedigree.', hookType: 'authority', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'naturopath'] },

  // --- SCARCITY (10) ---
  { id: 'sca-01', text: 'Only 10 founding spots. 3 are already taken.', hookType: 'scarcity', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath', 'integrative-gp', 'functional-nutritionist', 'new-to-functional', 'established-practice', 'solo-practitioner', 'clinic-owner'] },
  { id: 'sca-02', text: 'GBP 99/month is the founding rate. It goes to GBP 599 after the cohort fills.', hookType: 'scarcity', platform: ['all'], targetSegment: ['solo-practitioner', 'new-to-functional'] },
  { id: 'sca-03', text: 'The founding cohort is deliberately small. 10 practitioners. That is it.', hookType: 'scarcity', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'sca-04', text: '24 months at the founding rate. Once the cohort is full, it is full.', hookType: 'scarcity', platform: ['all'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'sca-05', text: 'Founding practitioners get direct access to the clinical development team. That ends when the cohort closes.', hookType: 'scarcity', platform: ['linkedin'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sca-06', text: 'We are not scaling fast. We are scaling right. 10 practitioners first.', hookType: 'scarcity', platform: ['linkedin', 'x'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'sca-07', text: 'The standard rate is GBP 599/month. Founding members pay GBP 99. Do the maths.', hookType: 'scarcity', platform: ['all'], targetSegment: ['solo-practitioner', 'new-to-functional'] },
  { id: 'sca-08', text: 'Every founding practitioner shapes the platform. That influence window is closing.', hookType: 'scarcity', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sca-09', text: 'GBP 99/month for 24 months. Fixed. Guaranteed. Limited to the first 10.', hookType: 'scarcity', platform: ['all'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'sca-10', text: 'Founding cohort spots do not reopen once filled. This is the only intake.', hookType: 'scarcity', platform: ['all'], targetSegment: ['new-to-functional', 'clinic-owner'] },

  // --- SOCIAL-PROOF (10) ---
  { id: 'sop-01', text: 'Pilot practitioners reported 83% less time on assessment preparation.', hookType: 'social-proof', platform: ['all'], targetSegment: ['established-practice', 'solo-practitioner'] },
  { id: 'sop-02', text: '"This changes how I think about terrain assessment." Pilot practitioner, London.', hookType: 'social-proof', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sop-03', text: '"I found cascade interactions I would have missed manually." Pilot practitioner, Manchester.', hookType: 'social-proof', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'sop-04', text: 'Built with input from practising functional medicine clinicians. Not in isolation.', hookType: 'social-proof', platform: ['linkedin'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'sop-05', text: 'The founding cohort is filling. Practitioners who value rigour are paying attention.', hookType: 'social-proof', platform: ['all'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'sop-06', text: '"Finally, a tool that thinks the way I was trained to think." IFM-trained practitioner.', hookType: 'social-proof', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained'] },
  { id: 'sop-07', text: 'Clinician-built, clinician-tested, clinician-approved.', hookType: 'social-proof', platform: ['all'], targetSegment: ['integrative-gp', 'naturopath'] },
  { id: 'sop-08', text: '"I used to spend 45 minutes on what VitalMatrix does in seconds." Founding practitioner.', hookType: 'social-proof', platform: ['all'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'sop-09', text: 'Every pilot practitioner who tried VitalMatrix asked the same question: "Why did no one build this sooner?"', hookType: 'social-proof', platform: ['linkedin', 'facebook'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'sop-10', text: 'Practitioners across the UK are joining the founding cohort. Here is why.', hookType: 'social-proof', platform: ['all'], targetSegment: ['new-to-functional', 'clinic-owner'] },

  // --- CHALLENGE (10) ---
  { id: 'cha-01', text: 'Try mapping all 7 nodes manually in under 60 seconds. We will wait.', hookType: 'challenge', platform: ['x', 'instagram'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'cha-02', text: 'Name your terrain assessment tool. Now ask: does it detect cascades?', hookType: 'challenge', platform: ['all'], targetSegment: ['established-practice', 'solo-practitioner'] },
  { id: 'cha-03', text: 'Take our 2-minute practice readiness quiz. You might be surprised.', hookType: 'challenge', platform: ['all'], targetSegment: ['new-to-functional', 'functional-nutritionist'] },
  { id: 'cha-04', text: 'Score your own practice workflow. Honestly. Then see what VitalMatrix scores.', hookType: 'challenge', platform: ['linkedin', 'facebook'], targetSegment: ['established-practice', 'clinic-owner'] },
  { id: 'cha-05', text: 'We challenge you to find a more rigorous terrain assessment tool. Go on.', hookType: 'challenge', platform: ['x', 'instagram'], targetSegment: ['ifm-trained', 'integrative-gp'] },
  { id: 'cha-06', text: 'Can you identify 6 cascade stacks from memory? VitalMatrix maps them automatically.', hookType: 'challenge', platform: ['all'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'cha-07', text: 'Your next consultation is in 30 minutes. Can your current tool prep you in time?', hookType: 'challenge', platform: ['linkedin', 'x'], targetSegment: ['solo-practitioner', 'established-practice'] },
  { id: 'cha-08', text: 'Show us a spreadsheet that maps cross-zone interactions. We are genuinely curious.', hookType: 'challenge', platform: ['x', 'instagram'], targetSegment: ['ifm-trained', 'naturopath'] },
  { id: 'cha-09', text: 'One week with VitalMatrix. That is all it takes to see the difference.', hookType: 'challenge', platform: ['all'], targetSegment: ['new-to-functional', 'functional-nutritionist'] },
  { id: 'cha-10', text: 'Ask yourself: is your assessment reproducible? If you are not sure, we should talk.', hookType: 'challenge', platform: ['linkedin', 'facebook'], targetSegment: ['integrative-gp', 'established-practice'] },
];

// --- State ---

/** Internal mutable copy for scoring updates */
const hookStore: Hook[] = HOOKS.map(h => ({ ...h }));

// --- Library Builder ---

/**
 * Builds the categorised hook library.
 * @returns Complete HookLibrary with hooks grouped by type
 */
export function getHookLibrary(): HookLibrary {
  const categories: Record<string, Hook[]> = {};
  for (const h of hookStore) {
    if (!categories[h.hookType]) {
      categories[h.hookType] = [];
    }
    categories[h.hookType].push(h);
  }
  return {
    hooks: [...hookStore],
    categories: categories as Record<HookType, Hook[]>,
  };
}

// --- Filtering Functions ---

/**
 * Returns all hooks of a given type.
 * @param type - The hook type to filter by
 * @returns Filtered array of hooks
 */
export function getHooksByType(type: HookType): Hook[] {
  return hookStore.filter(h => h.hookType === type);
}

/**
 * Returns hooks optimised for a specific platform.
 * @param platform - Target platform
 * @returns Hooks tagged for that platform or 'all'
 */
export function getHooksForPlatform(platform: HookPlatform): Hook[] {
  return hookStore.filter(h => h.platform.includes(platform) || h.platform.includes('all'));
}

/**
 * Returns hooks targeting a specific practitioner segment.
 * @param segment - Practitioner audience segment
 * @returns Hooks targeting that segment
 */
export function getHooksForSegment(segment: PractitionerSegment): Hook[] {
  return hookStore.filter(h => h.targetSegment.includes(segment));
}

// --- Generation Functions ---

/**
 * Generates a custom hook following established patterns.
 * @param topic - Clinical or platform topic
 * @param type - Desired hook type
 * @param platform - Target platform
 * @returns A new Hook object
 */
export function generateCustomHook(
  topic: string,
  type: HookType,
  platform: HookPlatform
): Hook {
  const text = buildHookText(topic, type);

  return {
    id: `custom-${Date.now()}`,
    text,
    hookType: type,
    platform: [platform],
    targetSegment: ['ifm-trained', 'established-practice'],
  };
}

/**
 * Updates the performance score for a hook based on engagement data.
 * @param hookId - The hook identifier
 * @param engagement - Engagement score (0-100)
 * @returns Updated hook or undefined if not found
 */
export function scoreHook(hookId: string, engagement: number): Hook | undefined {
  const hook = hookStore.find(h => h.id === hookId);
  if (!hook) return undefined;

  // Weighted rolling average if score exists, otherwise direct set
  if (hook.performanceScore !== undefined) {
    hook.performanceScore = Math.round((hook.performanceScore * 0.7 + engagement * 0.3) * 10) / 10;
  } else {
    hook.performanceScore = engagement;
  }

  return { ...hook };
}

/**
 * Returns the top N performing hooks by score.
 * @param n - Number of hooks to return
 * @returns Top-performing hooks sorted by score descending
 */
export function getTopPerformingHooks(n: number): Hook[] {
  return hookStore
    .filter(h => h.performanceScore !== undefined)
    .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
    .slice(0, n);
}

/**
 * Generates A/B test variants of a given hook.
 * @param hook - The original hook
 * @param count - Number of variants (default 3)
 * @returns Array of hook variants
 */
export function generateHookVariants(hook: Hook, count: number = 3): Hook[] {
  const variants: Hook[] = [];
  const strategies = [
    (text: string) => text.replace(/\.$/, '?'),
    (text: string) => `Here is the truth: ${text.charAt(0).toLowerCase()}${text.slice(1)}`,
    (text: string) => `Stop scrolling. ${text}`,
    (text: string) => `${text} And it matters more than you think.`,
    (text: string) => text.split('.').reverse().join('. ').trim(),
  ];

  for (let i = 0; i < count && i < strategies.length; i++) {
    const variantText = strategies[i](hook.text);
    variants.push({
      id: `${hook.id}-v${i + 1}`,
      text: variantText,
      hookType: hook.hookType,
      platform: [...hook.platform],
      targetSegment: [...hook.targetSegment],
    });
  }

  return variants;
}

/**
 * Generates a complete ad hook sequence: hook + bridge + CTA.
 * @param topic - The topic for the ad sequence
 * @returns AdHookSequence with hook, bridge, and call-to-action
 */
export function generateAdHookSequence(topic: string): AdHookSequence {
  // Find the best hook for the topic, preferring curiosity or pain-agitate
  const relevantHooks = hookStore.filter(
    h => h.hookType === 'curiosity' || h.hookType === 'pain-agitate'
  );
  const selectedHook = relevantHooks[Math.floor(Math.random() * relevantHooks.length)] || hookStore[0];

  const bridge = `VitalMatrix is the ${VM_BRAND.platform.descriptor} built for functional medicine practitioners who take ${topic.toLowerCase()} seriously. 7 nodes, 5 zones, one unified assessment.`;

  const cta = `Join the founding cohort at GBP ${VM_BRAND.pricing.foundingMonthly}/month (standard rate: GBP ${VM_BRAND.pricing.standardRate}). Only 10 spots. Visit ${VM_BRAND.platform.domain}`;

  return {
    hook: selectedHook.text,
    bridge,
    cta,
    platform: 'all',
    topic,
  };
}

// --- Helpers ---

/**
 * Builds hook text from topic and type using established patterns.
 * @param topic - The clinical or platform topic
 * @param type - Hook type to generate
 * @returns Generated hook text
 */
function buildHookText(topic: string, type: HookType): string {
  switch (type) {
    case 'curiosity':
      return `What most practitioners do not know about ${topic.toLowerCase()} could change their entire approach.`;
    case 'contrarian':
      return `Everything you were taught about ${topic.toLowerCase()} assessment needs updating. Here is why.`;
    case 'statistic':
      return `The data on ${topic.toLowerCase()} is clear. Most practitioners are not using it.`;
    case 'question':
      return `When was the last time you truly assessed ${topic.toLowerCase()} across all zones?`;
    case 'story-open':
      return `A practitioner came to us struggling with ${topic.toLowerCase()}. What happened next changed her practice.`;
    case 'pain-agitate':
      return `${topic} assessment should not take this long. And it does not have to.`;
    case 'authority':
      return `Dr ${VM_BRAND.credentials.name.split(' ').pop()}, ${VM_BRAND.credentials.qualifications}, on why ${topic.toLowerCase()} matters more than ever.`;
    case 'scarcity':
      return `Founding cohort access for ${topic.toLowerCase()} practitioners is almost gone. GBP ${VM_BRAND.pricing.foundingMonthly}/month while spots remain.`;
    case 'social-proof':
      return `Practitioners specialising in ${topic.toLowerCase()} are already seeing results with VitalMatrix.`;
    case 'challenge':
      return `Try assessing ${topic.toLowerCase()} across all 5 zones without VitalMatrix. Time yourself.`;
  }
}
