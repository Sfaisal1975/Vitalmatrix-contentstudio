/**
 * Component 22: Clinical Newsletter Builder
 * EXTREMELY HIGH-YIELD
 *
 * Monthly practitioner digest: curates recent PubMed findings,
 * maps to 7 nodes and 5 zones, wraps in VM branding.
 * Recurring touchpoint that builds authority and drives sign-ups.
 */

import { VM_BRAND, EvidenceTier } from './brand-config';

// --- Types ---

export interface NewsletterItem {
  title: string;
  summary: string;
  nodeRelevance: string[];
  zoneRelevance: string[];
  evidenceTier: EvidenceTier;
  pubmedId?: string;
  doi?: string;
  practitionerInsight: string;
}

export interface NewsletterConfig {
  issueNumber: number;
  month: string;
  year: number;
  editorNote: string;
  items: NewsletterItem[];
  featuredZone?: string;
  ctaText?: string;
}

// --- Generator ---

export function generateNewsletter(config: NewsletterConfig): string {
  const sections: string[] = [];

  // Header
  sections.push(`# VitalMatrix\u2122 Clinical Intelligence Digest`);
  sections.push(`**Issue ${config.issueNumber}** | ${config.month} ${config.year}`);
  sections.push(`*For functional medicine practitioners*`);
  sections.push('');
  sections.push('---');
  sections.push('');

  // Editor note
  sections.push(`## From Dr Faisal`);
  sections.push(config.editorNote);
  sections.push('');

  // Featured zone
  if (config.featuredZone) {
    sections.push(`## Featured Zone: ${config.featuredZone}`);
    const zoneItems = config.items.filter(i => i.zoneRelevance.includes(config.featuredZone!));
    if (zoneItems.length > 0) {
      sections.push(`${zoneItems.length} new findings relevant to ${config.featuredZone} this month.`);
    }
    sections.push('');
  }

  // Research items
  sections.push('## Research Highlights');
  sections.push('');

  for (const item of config.items) {
    sections.push(`### ${item.title}`);
    sections.push(`**Nodes:** ${item.nodeRelevance.join(', ')} | **Zones:** ${item.zoneRelevance.join(', ')} | **Evidence:** ${item.evidenceTier}`);
    sections.push('');
    sections.push(item.summary);
    sections.push('');
    sections.push(`**Practitioner insight:** ${item.practitionerInsight}`);
    if (item.pubmedId) sections.push(`*PMID: ${item.pubmedId}${item.doi ? ` | doi:${item.doi}` : ''}*`);
    sections.push('');
    sections.push('---');
    sections.push('');
  }

  // CTA
  sections.push(`## ${config.ctaText || 'Join the VitalMatrix\u2122 Founding Cohort'}`);
  sections.push(`VitalMatrix\u2122 maps these findings to a structured 7-node terrain model, detects cascade pathways, and generates evidence-tiered support considerations for every patient.`);
  sections.push('');
  sections.push(`Founding cohort: 10 practitioners, GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort).`);
  sections.push(`Book a discovery call: calendly.com/vitalmatrix-discovery-call`);
  sections.push('');

  // Footer
  sections.push('---');
  sections.push(`${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`);
  sections.push(`${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`);
  sections.push('');
  sections.push(VM_BRAND.regulatoryFooter);

  return sections.join('\n');
}

// --- HTML Email Version ---

export function generateNewsletterHtml(config: NewsletterConfig): string {
  const markdown = generateNewsletter(config);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
body{background:${VM_BRAND.colours.prussianBlue};color:${VM_BRAND.colours.white};font-family:'Outfit',Arial,sans-serif;padding:40px 24px;margin:0;}
.container{max-width:600px;margin:0 auto;background:${VM_BRAND.colours.charcoal};border-radius:12px;padding:32px;}
h1{font-family:'Cormorant Garamond',Georgia,serif;color:${VM_BRAND.colours.gold};font-size:28px;}
h2{font-family:'Cormorant Garamond',Georgia,serif;color:${VM_BRAND.colours.gold};font-size:20px;margin-top:24px;}
h3{color:${VM_BRAND.colours.white};font-size:16px;margin-top:16px;}
p{font-size:14px;line-height:1.6;color:rgba(244,241,235,0.8);}
hr{border:none;border-top:1px solid rgba(244,241,235,0.08);margin:16px 0;}
.label{font-family:'DM Mono',monospace;font-size:10px;color:rgba(201,168,76,0.6);}
.cta{display:inline-block;padding:12px 32px;background:${VM_BRAND.colours.gold};color:${VM_BRAND.colours.prussianBlue};font-weight:600;border-radius:6px;text-decoration:none;margin-top:16px;}
.footer{font-family:'DM Mono',monospace;font-size:9px;color:rgba(244,241,235,0.2);margin-top:32px;line-height:1.8;}
</style></head><body>
<div class="container">
<pre style="white-space:pre-wrap;font-family:inherit;font-size:inherit;">${markdown}</pre>
</div></body></html>`;
}
