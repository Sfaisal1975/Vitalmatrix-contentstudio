/**
 * Component 23: Discovery Call Prep Engine
 * EXTREMELY HIGH-YIELD
 *
 * Before every practitioner meeting: generates personalised briefing.
 * Speciality-mapped zones, talking points, objection handling, follow-up template.
 * Turns every call into a conversion opportunity.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface PractitionerProfile {
  name: string;
  title?: string;
  speciality: string;
  ifmTrained: boolean;
  practiceSize?: string;
  knownInterests?: string[];
  previousContact?: string;
  referredBy?: string;
}

export interface CallPrep {
  briefing: string;
  talkingPoints: string[];
  relevantZones: string[];
  relevantCascades: string[];
  objectionResponses: Record<string, string>;
  followUpActions: string[];
  pricingTier: string;
  monthlyRate: number;
}

// --- Speciality-to-Zone Mapping ---

const SPECIALITY_ZONES: Record<string, { zones: string[]; cascades: string[]; hooks: string[] }> = {
  'gastroenterology': { zones: ['Z2', 'Z4'], cascades: ['S1 (Z2→Z1)', 'S5 (Z2→Z3)'], hooks: ['Gut drives thyroid via S1', 'TerrainLock\u2122 Z2 tiebreaker'] },
  'endocrinology': { zones: ['Z1', 'Z5'], cascades: ['S2 (Z1→Z5)'], hooks: ['Energy drives hormonal burden', 'Z5 threshold 32 (lower than Z1-Z4)'] },
  'cardiology': { zones: ['Z3', 'Z1'], cascades: ['S6 (Z1→Z3) UNIDIRECTIONAL', 'S5 (Z2→Z3)'], hooks: ['Metabolic energy drives cardiovascular', 'Gut inflammation reaches heart via S5'] },
  'rheumatology': { zones: ['Z2', 'Z4'], cascades: ['S3 (Z4→Z1)'], hooks: ['Immune dysregulation (N2) drives structural (N7)', 'Detox trident clears inflammatory load'] },
  'neurology': { zones: ['Z2', 'Z3'], cascades: ['S5 (Z2→Z3)'], hooks: ['Gut-brain axis via Z2 Resilience Network', 'N6 Communication dampening factor'] },
  'dermatology': { zones: ['Z2', 'Z4', 'Z5'], cascades: ['S1 (Z2→Z1)', 'S4 (Z5→Z2) Theoretical'], hooks: ['Skin reflects gut (Z2) and detox (Z4)', 'Hormonal terrain (Z5) drives skin changes'] },
  'general': { zones: ['Z1', 'Z2'], cascades: ['S1 (Z2→Z1)', 'S2 (Z1→Z5)'], hooks: ['Start with gut (Z2) and energy (Z1)', 'TerrainLock\u2122 shows self-perpetuating patterns'] },
  'functional-medicine': { zones: ['Z1', 'Z2', 'Z5'], cascades: ['S1', 'S2', 'S5'], hooks: ['Maps directly to IFM matrix', 'Evidence tiers on every output', 'Amplifies what you already do'] },
};

// --- Standard Objections ---

const OBJECTIONS: Record<string, string> = {
  'cost': `The founding rate is GBP ${VM_BRAND.pricing.foundingMonthly}/month with a ${VM_BRAND.pricing.guarantee}. The standard rate from month ${VM_BRAND.pricing.foundingFixedMonths + 1} is GBP ${VM_BRAND.pricing.standardRate}. This is a clinical tool, not an overhead \u2014 it saves consultation time and improves documentation quality.`,
  'regulatory': 'VitalMatrix\u2122 is Class I SaMD registered. T-01 protective architecture is active: every output includes a mandatory practitioner decision section. It does not diagnose, prescribe, or replace clinical judgement.',
  'data-privacy': 'ICO registered (ZC101813). AES-256-GCM field-level encryption. GDPR Art 17 compliant data deletion. UK data residency.',
  'time': 'INTAKE\u2122 form takes 10-15 minutes. The platform returns terrain assessment, cascade analysis, and support considerations in seconds. Net time saving from visit 2 onwards.',
  'evidence': 'Every clinical claim carries an evidence tier label: Established, Emerging, Theoretical, or Observed in Practice. We never present unqualified claims.',
  'lock-in': `No lock-in contract. Monthly billing, cancel anytime. The ${VM_BRAND.pricing.guarantee} is ours to you, not yours to us.`,
  'ai-trust': 'VitalMatrix\u2122 is a terrain intelligence platform, not an AI chatbot. It applies a structured terrain model with transparent scoring. The practitioner always makes the final clinical decision.',
};

// --- Generator ---

export function generateCallPrep(profile: PractitionerProfile): CallPrep {
  const specKey = Object.keys(SPECIALITY_ZONES).find(k =>
    profile.speciality.toLowerCase().includes(k)
  ) || 'general';

  const specData = SPECIALITY_ZONES[specKey];
  const rate = VM_BRAND.pricing.foundingMonthly;
  const tierLabel = 'Founding Cohort Rate';

  const talkingPoints = [
    `${profile.name}'s speciality (${profile.speciality}) maps directly to ${specData.zones.join(', ')}`,
    ...specData.hooks,
    `Founding cohort rate: GBP ${rate}/month (${tierLabel})`,
    `${VM_BRAND.pricing.guarantee}`,
    profile.knownInterests ? `Known interests: ${profile.knownInterests.join(', ')}` : null,
    profile.referredBy ? `Referred by: ${profile.referredBy}` : null,
  ].filter(Boolean) as string[];

  const followUpActions = [
    `Send capability statement (personalised for ${profile.speciality})`,
    `Send pricing breakdown`,
    `Send onboarding checklist`,
    `Schedule follow-up if interested`,
    profile.previousContact ? `Reference previous conversation: ${profile.previousContact}` : null,
  ].filter(Boolean) as string[];

  const briefing = [
    `# Discovery Call Prep: ${profile.name}`,
    `**Speciality:** ${profile.speciality} | **IFM:** ${profile.ifmTrained ? 'Yes' : 'No'} | **Rate:** GBP ${rate}/month`,
    profile.practiceSize ? `**Practice:** ${profile.practiceSize}` : '',
    profile.referredBy ? `**Referred by:** ${profile.referredBy}` : '',
    '',
    `## Relevant Zones`,
    specData.zones.map(z => `- ${z}`).join('\n'),
    '',
    `## Relevant Cascades`,
    specData.cascades.map(c => `- ${c}`).join('\n'),
    '',
    `## Talking Points`,
    talkingPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'),
    '',
    `## Key Objection Responses`,
    Object.entries(OBJECTIONS).slice(0, 4).map(([k, v]) => `**"${k}":** ${v}`).join('\n\n'),
    '',
    `## Follow-Up Actions`,
    followUpActions.map(a => `- [ ] ${a}`).join('\n'),
    '',
    '---',
    VM_BRAND.regulatoryFooter,
  ].filter(Boolean).join('\n');

  return {
    briefing,
    talkingPoints,
    relevantZones: specData.zones,
    relevantCascades: specData.cascades,
    objectionResponses: OBJECTIONS,
    followUpActions,
    pricingTier: tierLabel,
    monthlyRate: rate,
  };
}
