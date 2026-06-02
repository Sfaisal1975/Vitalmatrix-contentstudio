/**
 * Component 2: PDF Branding Engine
 * Source: HHW Prompt 4 (PDF Lead Magnet Creation), adapted for VitalMatrix
 * Route: VM W7 (File Command Centre)
 * Gate: Post-Swidan meeting
 *
 * Features:
 *  - Branded cover page (title, subtitle, credentials, logo, date, classification)
 *  - Table of contents auto-generation (H1/H2 headings, clickable links, page numbers)
 *  - Header/footer system (logo, page numbers, ICO ZC101813, TM footer on last page)
 *  - Research citation integration (inline superscript, Vancouver, DOI hyperlinks)
 *  - Template library (save/reuse generated PDFs)
 *  - Export as PDF with all branding embedded
 *
 * VitalMatrix adaptations:
 *  - VitalMatrix design system colours (Prussian Blue, Gold, etc.)
 *  - Cormorant Garamond headings, Outfit body, DM Mono data
 *  - Two-tier document classification (External vs Internal)
 *  - Credentials: MBBS, FAAMFM (never MD, never FMAARM)
 *  - Platform descriptor: "terrain intelligence platform"
 *  - TM footer with all 30 branded mnemonics + ICO ZC101813
 *  - Evidence tier labels on every clinical claim
 *  - "For practitioner use only" on all clinical outputs
 *
 * Stripped (HHW-specific):
 *  - Lead magnet framing (email capture, download gates, conversion tracking)
 *  - Patient handout templates
 *  - Competitor PDF reimagining
 *  - Curated FM doctor resource library (K10 prohibited names)
 *  - QR codes, "About Dr Faisal" patient bio, discovery call CTAs
 *  - HHW colour palette
 *  - Success story / case study patient-facing templates
 *
 * 5 PDF templates to build:
 *  1. Executive Clinical Brief        — Practitioner (External)
 *  2. Founding Cohort Welcome Pack    — Practitioner (External)
 *  3. Phase 1 Capability Statement    — Practitioner/Investor (External)
 *  4. Clinical Intelligence Architecture — Internal
 *  5. Regulatory Briefing             — Internal
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type DocumentTier = 'external' | 'internal';

export interface CoverPageConfig {
  title: string;
  subtitle?: string;
  date: string;
  tier: DocumentTier;
  version?: string;
}

export interface HeaderFooterConfig {
  showLogo: boolean;
  logoPosition: 'top-left' | 'top-centre';
  showPageNumbers: boolean;
  showIco: boolean;
  showTmFooterOnLastPage: boolean;
}

export interface PdfTemplate {
  id: string;
  name: string;
  audience: 'Practitioner' | 'Practitioner/Investor' | 'Internal';
  tier: DocumentTier;
  useCase: string;
  coverConfig: CoverPageConfig;
  headerFooterConfig: HeaderFooterConfig;
}

// --- Brand Constants ---

export const PDF_BRAND = {
  primaryBg: VM_BRAND.colours.prussianBlue,
  secondaryBg: VM_BRAND.colours.charcoal,
  clinicalBg: VM_BRAND.colours.deepTeal,
  accentGold: VM_BRAND.colours.gold,
  accentTeal: VM_BRAND.colours.teal,
  accentSage: VM_BRAND.colours.sage,
  textWhite: VM_BRAND.colours.white,
  headingFont: VM_BRAND.fonts.heading,
  bodyFont: VM_BRAND.fonts.body,
  dataFont: VM_BRAND.fonts.data,
  credentials: `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
  platform: VM_BRAND.platform.descriptor,
  ico: VM_BRAND.platform.ico,
};

// --- Templates ---

export const PDF_TEMPLATES: PdfTemplate[] = [
  {
    id: 'exec-clinical-brief',
    name: 'Executive Clinical Brief',
    audience: 'Practitioner',
    tier: 'external',
    useCase: 'Dr Swidan Meeting 2, founding practitioners',
    coverConfig: {
      title: 'Executive Clinical Brief',
      date: new Date().toISOString().split('T')[0],
      tier: 'external',
    },
    headerFooterConfig: {
      showLogo: true,
      logoPosition: 'top-left',
      showPageNumbers: true,
      showIco: true,
      showTmFooterOnLastPage: true,
    },
  },
  {
    id: 'founding-welcome',
    name: 'Founding Cohort Welcome Pack',
    audience: 'Practitioner',
    tier: 'external',
    useCase: 'Onboarding founding practitioners',
    coverConfig: {
      title: 'Founding Cohort Welcome Pack',
      date: new Date().toISOString().split('T')[0],
      tier: 'external',
    },
    headerFooterConfig: {
      showLogo: true,
      logoPosition: 'top-centre',
      showPageNumbers: true,
      showIco: true,
      showTmFooterOnLastPage: true,
    },
  },
  {
    id: 'phase1-capability',
    name: 'Phase 1 Capability Statement',
    audience: 'Practitioner/Investor',
    tier: 'external',
    useCase: 'What VitalMatrix does in Phase 1',
    coverConfig: {
      title: 'Phase 1 Capability Statement',
      date: new Date().toISOString().split('T')[0],
      tier: 'external',
    },
    headerFooterConfig: {
      showLogo: true,
      logoPosition: 'top-left',
      showPageNumbers: true,
      showIco: true,
      showTmFooterOnLastPage: true,
    },
  },
  {
    id: 'clinical-architecture',
    name: 'Clinical Intelligence Architecture',
    audience: 'Internal',
    tier: 'internal',
    useCase: 'Full FLINT architecture for Dr Faisal and Abid',
    coverConfig: {
      title: 'Clinical Intelligence Architecture',
      subtitle: 'INTERNAL — Full FLINT\u2122 Pipeline Reference',
      date: new Date().toISOString().split('T')[0],
      tier: 'internal',
    },
    headerFooterConfig: {
      showLogo: true,
      logoPosition: 'top-left',
      showPageNumbers: true,
      showIco: true,
      showTmFooterOnLastPage: true,
    },
  },
  {
    id: 'regulatory-briefing',
    name: 'Regulatory Briefing',
    audience: 'Internal',
    tier: 'internal',
    useCase: 'MHRA, ICO, GDPR status documents',
    coverConfig: {
      title: 'Regulatory Briefing',
      subtitle: 'INTERNAL — MHRA SaMD | ICO | GDPR Status',
      date: new Date().toISOString().split('T')[0],
      tier: 'internal',
    },
    headerFooterConfig: {
      showLogo: true,
      logoPosition: 'top-left',
      showPageNumbers: true,
      showIco: true,
      showTmFooterOnLastPage: true,
    },
  },
];

// --- Cover Page Generator ---

export function generateCoverPageHtml(config: CoverPageConfig): string {
  const tierLabel = config.tier === 'external'
    ? 'PRACTITIONER DOCUMENT'
    : 'INTERNAL DOCUMENT — CONFIDENTIAL';

  return `
<div style="background:${PDF_BRAND.primaryBg};color:${PDF_BRAND.textWhite};min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px;font-family:${PDF_BRAND.bodyFont},sans-serif;">
  <p style="font-family:${PDF_BRAND.dataFont},monospace;font-size:10px;letter-spacing:0.25em;color:rgba(201,168,76,0.6);text-transform:uppercase;">${tierLabel}</p>
  <h1 style="font-family:${PDF_BRAND.headingFont},Georgia,serif;font-size:36px;color:${PDF_BRAND.accentGold};margin:20px 0 8px;text-align:center;">${config.title}</h1>
  ${config.subtitle ? `<p style="font-family:${PDF_BRAND.dataFont},monospace;font-size:12px;color:rgba(244,241,235,0.5);margin-bottom:40px;">${config.subtitle}</p>` : ''}
  <p style="font-size:14px;margin-top:40px;">${PDF_BRAND.credentials}</p>
  <p style="font-family:${PDF_BRAND.dataFont},monospace;font-size:11px;color:rgba(244,241,235,0.4);">${VM_BRAND.platform.descriptor} | ${config.date}</p>
  <p style="font-family:${PDF_BRAND.dataFont},monospace;font-size:9px;color:rgba(244,241,235,0.25);margin-top:60px;">${PDF_BRAND.ico}</p>
</div>`;
}

// --- Table of Contents Generator ---

export function generateTocFromHeadings(headings: { level: number; text: string; page: number }[]): string {
  return headings
    .filter(h => h.level <= 2)
    .map(h => {
      const indent = h.level === 2 ? '  ' : '';
      return `${indent}${h.text} ${'.' .repeat(60 - h.text.length - indent.length)} ${h.page}`;
    })
    .join('\n');
}
