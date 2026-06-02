/**
 * VitalMatrix Content Studio — Brand Configuration
 * Adapted from HHW Content Studio, 18 March 2026
 * All HHW-specific elements stripped. VitalMatrix design system applied.
 */

export const VM_BRAND = {
  // Colours — VitalMatrix design system (Section 14)
  colours: {
    prussianBlue: '#0D2B4E',   // flagship background
    charcoal: '#1A2030',        // secondary background
    deepTeal: '#0C4452',        // clinical background
    gold: '#C9A84C',            // accent
    teal: '#1A7A8A',            // accent
    purple: '#7B5EA7',          // Z3 (never blue #4A6FA5)
    sage: '#5F7C6C',            // accent
    white: '#F4F1EB',           // text
  },

  // Typography — offline fonts only, no CDN
  fonts: {
    heading: 'Cormorant Garamond',
    body: 'Outfit',
    data: 'DM Mono',
    // NEVER: DM Sans, IBM Plex Mono, Inter
  },

  // CSS variable prefix
  cssPrefix: '--vm-',

  // Credentials — NEVER MD, NEVER FMAARM
  credentials: {
    name: 'Dr Shahzad Faisal',
    qualifications: 'MBBS, FAAMFM',
    title: 'Founder and CEO',
    company: 'VitalMatrix Ltd',
  },

  // Platform identity
  platform: {
    descriptor: 'terrain intelligence platform',  // ONLY this. Never "clinical AI platform", never "clinical intelligence platform" (superseded by D-210)
    ico: 'ICO ZC101813',
    domain: 'vitalmatrix.co.uk',
    audience: 'PRACTITIONER',  // B2B, never patient-facing
  },

  // Evidence tiers — required on every clinical claim
  evidenceTiers: [
    'Established',
    'Emerging',
    'Theoretical',
    'Observed in Practice',
    'Contested',
  ] as const,

  // TM footer — practitioner-facing 38 mnemonics (D-149/D-159/D-232)
  // Excluded: COMPASS (D-93), VAULT (D-138), TerrainRoot (ALB), VOLTERRAIN (Tier 3), TIE included (D-214 Tier 1)
  tmFooter: 'VOS\u2122, VitalMatrix\u2122, NCZ\u2122, DRD\u2122, APEX\u2122, TIQ\u2122, CIB\u2122, CascadeIQ\u2122, FLINT\u2122, CZR\u2122, TRACE\u2122, DeltaScan\u2122, MedTerrain\u2122, TerrainLock\u2122, CascadeAtlas\u2122, PRISM\u2122, KINETICS\u2122, COHERENCE\u2122, ORBIT\u2122, SPHERE\u2122, HERALD\u2122, BEACON\u2122, MAPS\u2122, RECON\u2122, GENOME\u2122, ANCHOR\u2122, AXIS\u2122, INTAKE\u2122, VECTOR\u2122, VERITY\u2122, VANTAGE\u2122, VISTA\u2122, CADENCE\u2122, TerrainSpiral\u2122, MODES\u2122, GRADE\u2122, NEXUS\u2122, TIE\u2122, STRIDE\u2122 and all associated marks are trademarks of VitalMatrix Ltd. All rights reserved. ICO ZC101813.',

  // Regulatory footer — on all clinical outputs
  regulatoryFooter: 'For practitioner use only. Not a diagnostic tool. VitalMatrix Ltd 2026.',

  // Document classification
  documentTiers: {
    external: 'WHAT and WHY only. TM marks. No architecture internals. For practitioners and investors.',
    internal: 'Full architecture detail. For Dr Faisal and Abid only.',
  },

  // Pricing — single source of truth
  // Founding cohort: GBP 99/month fixed for 24 months. No IFM discount — single price for all.
  pricing: {
    foundingMonthly: 99,
    foundingFixedMonths: 24,
    standardRate: 599,
    currency: 'GBP',
    guarantee: '24-month fixed founding rate',
  },

  // Target audience — England only (see c66-audience-targeting.ts for full config)
  targetAudience: {
    geography: 'England',
    excluded: ['Scotland', 'Wales', 'Northern Ireland', 'USA', 'Canada', 'Europe'],
    professions: ['Functional medicine practitioners', 'GPs practising FM', 'Nutritional therapists practising FM', 'Naturopaths practising FM', 'Integrative doctors practising FM', 'Clinical nutritionists practising FM'],
    qualifier: 'Must be practising functional medicine approach. General practitioners of other modalities excluded.',
    channels: ['Facebook FM groups', 'LinkedIn', 'Instagram', 'X'],
    regulatory: 'MHRA',  // not FDA, not EMA
  },

  // Kill list triggers (from HHW extraction)
  killList: {
    K7: 'Credential error: must be MBBS, FAAMFM. Never MD, never FMAARM.',
    K8: 'British English throughout. No em dashes.',
    K10: 'No competitor names: Dr Mark Hyman, LaValle, Metabolic Code-adjacent practitioners.',
  },
} as const;

export type EvidenceTier = typeof VM_BRAND.evidenceTiers[number];
