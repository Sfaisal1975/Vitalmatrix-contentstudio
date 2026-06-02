/**
 * Component 21: Landing Page Generator
 * EXTREMELY HIGH-YIELD
 *
 * HTML landing pages for specific practitioner segments.
 * Full VM design system, JSON-LD embedded, mobile-responsive.
 * Direct subscriber acquisition.
 */

import { VM_BRAND } from './brand-config';
import { generateJsonLd } from './c3-jsonld-schema';
import { generatePricingTable } from './c19-visual-content';

// --- Types ---

export type PractitionerSegment = 'ifm-trained' | 'non-ifm' | 'gut-specialist' | 'hormone-specialist' | 'general-fm';

/** Founding cohort pricing — single rate for all segments */
const FOUNDING_RATE = VM_BRAND.pricing.foundingMonthly;

export interface LandingPageConfig {
  segment: PractitionerSegment;
  headline: string;
  subheadline: string;
  painPoints: string[];
  benefits: string[];
  cta: string;
  calendlyLink?: string;
}

// --- Segment Defaults ---

export const SEGMENT_DEFAULTS: Record<PractitionerSegment, Omit<LandingPageConfig, 'calendlyLink'>> = {
  'ifm-trained': {
    segment: 'ifm-trained',
    headline: 'Clinical Intelligence Built on the IFM Matrix',
    subheadline: 'VitalMatrix\u2122 amplifies the functional medicine framework you already use.',
    painPoints: ['Hours spent manually mapping patient data to the IFM matrix', 'No systematic way to track cascade pathways', 'Difficulty showing patients their terrain over time'],
    benefits: ['7-node terrain scoring mapped to IFM taxonomy', 'Automated cascade detection across 6 pathways', 'DeltaScan\u2122 longitudinal tracking for every patient'],
    cta: `Join the Founding Cohort \u2014 GBP ${FOUNDING_RATE}/month`,
  },
  'non-ifm': {
    segment: 'non-ifm',
    headline: 'Functional Medicine Intelligence Without the Guesswork',
    subheadline: 'VitalMatrix\u2122 gives you structured clinical terrain analysis for every patient.',
    painPoints: ['Overwhelmed by the complexity of functional medicine assessment', 'No framework for systematic terrain mapping', 'Difficulty prioritising which system to address first'],
    benefits: ['Structured 7-node assessment framework', 'Evidence-tiered support considerations', 'Clear burden zone designation \u2014 know where to start'],
    cta: `Join the Founding Cohort \u2014 GBP ${FOUNDING_RATE}/month`,
  },
  'gut-specialist': {
    segment: 'gut-specialist',
    headline: 'See How Gut Drives Everything Else',
    subheadline: 'VitalMatrix\u2122 maps gut burden to thyroid, hormones, and cardiovascular zones automatically.',
    painPoints: ['Know gut is upstream but can\'t quantify the cascade', 'Patients don\'t see the connection between gut and energy', 'No way to track gut restoration impact on other zones'],
    benefits: ['Z2 Resilience Network scoring (gut + immune + brain)', 'S1 cascade: gut drives thyroid (Z2\u2192Z1)', 'TerrainLock\u2122 detection when gut restoration is the tiebreaker'],
    cta: 'Join the Founding Cohort',
  },
  'hormone-specialist': {
    segment: 'hormone-specialist',
    headline: 'Map the Hormonal Terrain Objectively',
    subheadline: 'VitalMatrix\u2122 scores androgenic, estrogenic, and progestogenic burden systematically.',
    painPoints: ['Hormonal assessment is subjective and pattern-dependent', 'Difficult to show patients hormonal terrain changes over time', 'Unclear which upstream zone is driving hormonal burden'],
    benefits: ['Z5 Hormonal Terrain Axis scoring', 'S2 cascade: energy drives hormones (Z1\u2192Z5)', 'DRD\u2122 designation: is it hormonal or is hormonal downstream?'],
    cta: 'Join the Founding Cohort',
  },
  'general-fm': {
    segment: 'general-fm',
    headline: 'Stop Guessing. Start Mapping.',
    subheadline: 'VitalMatrix\u2122 turns functional medicine complexity into structured clinical intelligence.',
    painPoints: ['Every patient is complex and unique', 'No systematic way to prioritise interventions', 'Difficult to demonstrate progress to patients'],
    benefits: ['7-node terrain assessment in minutes', '5 clinical zones with clear activation thresholds', 'Evidence tiers on every support consideration'],
    cta: 'Join the Founding Cohort',
  },
};

// --- Generator ---

export function generateLandingPage(config: LandingPageConfig): string {
  const today = new Date().toISOString().split('T')[0];
  const jsonLd = generateJsonLd({
    pageTitle: config.headline,
    pageDescription: config.subheadline,
    pageSlug: `founding/${config.segment}`,
    datePublished: today,
    dateModified: today,
  });

  const painPointsHtml = config.painPoints.map(p =>
    `<li style="padding:8px 0;border-bottom:1px solid rgba(244,241,235,0.06);font-size:14px;color:rgba(244,241,235,0.7);">\u2717 ${p}</li>`
  ).join('\n');

  const benefitsHtml = config.benefits.map(b =>
    `<li style="padding:8px 0;border-bottom:1px solid rgba(244,241,235,0.06);font-size:14px;color:rgba(244,241,235,0.9);">\u2713 ${b}</li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${config.headline} | VitalMatrix\u2122</title>
${jsonLd}
<style>
/* Offline fonts — no CDN imports per VitalMatrix design system */
@font-face { font-family: 'Cormorant Garamond'; src: local('Cormorant Garamond'); font-weight: 400; }
@font-face { font-family: 'Cormorant Garamond'; src: local('Cormorant Garamond SemiBold'); font-weight: 600; }
@font-face { font-family: 'Outfit'; src: local('Outfit'); font-weight: 300; }
@font-face { font-family: 'Outfit'; src: local('Outfit'); font-weight: 400; }
@font-face { font-family: 'Outfit'; src: local('Outfit SemiBold'); font-weight: 600; }
@font-face { font-family: 'DM Mono'; src: local('DM Mono'); font-weight: 400; }
:root{--vm-prussian:${VM_BRAND.colours.prussianBlue};--vm-gold:${VM_BRAND.colours.gold};--vm-charcoal:${VM_BRAND.colours.charcoal};--vm-white:${VM_BRAND.colours.white};--vm-teal:${VM_BRAND.colours.teal};}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--vm-prussian);color:var(--vm-white);font-family:'Outfit',sans-serif;}
.container{max-width:800px;margin:0 auto;padding:60px 24px;}
.hero{text-align:center;margin-bottom:60px;}
.eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.25em;color:rgba(201,168,76,.6);text-transform:uppercase;}
h1{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3rem);color:var(--vm-gold);margin:16px 0;}
.sub{font-size:16px;color:rgba(244,241,235,.6);max-width:600px;margin:0 auto;}
.section{margin-bottom:48px;}
h2{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--vm-gold);margin-bottom:16px;}
ul{list-style:none;padding:0;}
.cta-btn{display:inline-block;padding:16px 40px;background:var(--vm-gold);color:var(--vm-prussian);font-family:'Outfit',sans-serif;font-weight:600;font-size:16px;border-radius:8px;text-decoration:none;margin-top:32px;}
.footer{margin-top:60px;padding-top:24px;border-top:1px solid rgba(244,241,235,.06);font-family:'DM Mono',monospace;font-size:9px;color:rgba(244,241,235,.2);line-height:1.8;}
</style>
</head>
<body>
<div class="container">
  <div class="hero">
    <p class="eyebrow">VitalMatrix\u2122 Founding Cohort</p>
    <h1>${config.headline}</h1>
    <p class="sub">${config.subheadline}</p>
    <a href="${config.calendlyLink || 'https://calendly.com/vitalmatrix-discovery-call'}" class="cta-btn">${config.cta}</a>
  </div>

  <div class="section">
    <h2>Sound Familiar?</h2>
    <ul>${painPointsHtml}</ul>
  </div>

  <div class="section">
    <h2>What VitalMatrix\u2122 Gives You</h2>
    <ul>${benefitsHtml}</ul>
  </div>

  <div class="section" style="text-align:center;">
    <h2>Founding Cohort Pricing</h2>
    ${generatePricingTable()}
  </div>

  <div style="text-align:center;margin-top:40px;">
    <a href="${config.calendlyLink || 'https://calendly.com/vitalmatrix-discovery-call'}" class="cta-btn">${config.cta}</a>
  </div>

  <div class="footer">
    <p>${VM_BRAND.regulatoryFooter}</p>
    <p>${VM_BRAND.tmFooter}</p>
  </div>
</div>
</body>
</html>`;
}
