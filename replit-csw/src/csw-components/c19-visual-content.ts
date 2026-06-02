/**
 * Component 19: Visual Content Generator
 * EXTREMELY HIGH-YIELD
 *
 * HTML snippet factory for the website — zone diagrams, pipeline flows,
 * feature cards, pricing tables. All using VM design system.
 * These are the website elements that make practitioners sign up.
 */

import { VM_BRAND } from './brand-config';

// --- Shared Styles ---

const STYLES = {
  card: `background:${VM_BRAND.colours.charcoal};border:1px solid rgba(201,168,76,0.15);border-radius:12px;padding:24px;font-family:${VM_BRAND.fonts.body},sans-serif;color:${VM_BRAND.colours.white};`,
  heading: `font-family:${VM_BRAND.fonts.heading},Georgia,serif;color:${VM_BRAND.colours.gold};`,
  label: `font-family:${VM_BRAND.fonts.data},monospace;font-size:10px;letter-spacing:0.15em;color:rgba(201,168,76,0.6);text-transform:uppercase;`,
  body: `font-family:${VM_BRAND.fonts.body},sans-serif;font-size:14px;color:${VM_BRAND.colours.white};line-height:1.6;`,
};

// --- Zone Diagram ---

export function generateZoneDiagram(): string {
  const zones = [
    { id: 'Z1', name: 'Metabolic Energy Axis', nodes: 'N6 + N3', colour: VM_BRAND.colours.gold },
    { id: 'Z2', name: 'Resilience Network', nodes: 'N1 + N2 + N6', colour: VM_BRAND.colours.teal },
    { id: 'Z3', name: 'Cardiovascular-Neural Axis', nodes: 'N5 + N6', colour: VM_BRAND.colours.purple },
    { id: 'Z4', name: 'Detoxification Trident', nodes: 'N4 + N2', colour: VM_BRAND.colours.sage },
    { id: 'Z5', name: 'Hormonal Terrain Axis', nodes: 'N6 + N4 + N3', colour: '#C97A4C' },
  ];

  const cards = zones.map(z => `
    <div style="${STYLES.card}border-left:3px solid ${z.colour};margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <span style="${STYLES.label}">${z.id}</span>
          <h3 style="${STYLES.heading}font-size:18px;margin:4px 0;">${z.name}</h3>
        </div>
        <span style="${STYLES.label}">${z.nodes}</span>
      </div>
    </div>`).join('\n');

  return `<div style="max-width:600px;margin:0 auto;padding:20px;">\n${cards}\n</div>`;
}

// --- Pipeline Flow ---

export function generatePipelineFlow(): string {
  const stages = [
    { id: 'L1', name: 'FLINT\u2122', question: 'WHERE?', desc: 'Node scoring' },
    { id: 'L2', name: 'NCZ\u2122', question: 'WHICH?', desc: 'Zone activation' },
    { id: 'L3', name: 'CascadeIQ\u2122', question: 'HOW?', desc: 'Cascade detection' },
    { id: 'L4', name: 'DRD\u2122', question: 'WHO STARTED IT?', desc: 'Burden designation' },
    { id: 'L7', name: 'CascadeAtlas\u2122', question: 'WHAT DOES IT LOOK LIKE?', desc: 'Visual mapping' },
    { id: 'L9', name: 'DeltaScan\u2122', question: 'WHAT CHANGED?', desc: 'Longitudinal tracking' },
  ];

  const items = stages.map((s, i) => `
    <div style="${STYLES.card}display:flex;align-items:center;gap:16px;margin-bottom:4px;">
      <div style="min-width:36px;height:36px;border-radius:50%;background:${VM_BRAND.colours.gold};display:flex;align-items:center;justify-content:center;font-family:${VM_BRAND.fonts.data};font-size:11px;color:${VM_BRAND.colours.prussianBlue};font-weight:600;">${i + 1}</div>
      <div style="flex:1;">
        <div style="${STYLES.label}">${s.id} — ${s.question}</div>
        <div style="${STYLES.heading}font-size:16px;">${s.name}</div>
        <div style="font-size:12px;color:rgba(244,241,235,0.5);">${s.desc}</div>
      </div>
    </div>`).join('\n');

  return `<div style="max-width:500px;margin:0 auto;padding:20px;">\n${items}\n</div>`;
}

// --- Feature Card ---

export function generateFeatureCard(title: string, description: string, icon: string, mnemonic?: string): string {
  return `
<div style="${STYLES.card}text-align:center;max-width:280px;">
  <div style="font-size:32px;margin-bottom:12px;">${icon}</div>
  ${mnemonic ? `<span style="${STYLES.label}">${mnemonic}\u2122</span>` : ''}
  <h3 style="${STYLES.heading}font-size:20px;margin:8px 0;">${title}</h3>
  <p style="${STYLES.body}font-size:13px;color:rgba(244,241,235,0.7);">${description}</p>
</div>`;
}

// --- Pricing Table ---

export function generatePricingTable(): string {
  return `
<div style="display:flex;gap:16px;max-width:700px;margin:0 auto;flex-wrap:wrap;justify-content:center;">
  <div style="${STYLES.card}flex:1;min-width:280px;max-width:400px;text-align:center;border-color:${VM_BRAND.colours.gold};">
    <span style="${STYLES.label}">Founding Cohort</span>
    <div style="${STYLES.heading}font-size:36px;margin:12px 0;">GBP ${VM_BRAND.pricing.foundingMonthly}<span style="font-size:14px;color:rgba(244,241,235,0.4);">/month</span></div>
    <p style="font-size:12px;color:rgba(244,241,235,0.5);margin-bottom:16px;">For all functional medicine practitioners</p>
    <ul style="list-style:none;padding:0;text-align:left;font-size:13px;color:rgba(244,241,235,0.7);">
      <li style="padding:6px 0;border-bottom:1px solid rgba(244,241,235,0.06);">Full platform access</li>
      <li style="padding:6px 0;border-bottom:1px solid rgba(244,241,235,0.06);">All 7 pipeline engines</li>
      <li style="padding:6px 0;border-bottom:1px solid rgba(244,241,235,0.06);">${VM_BRAND.pricing.guarantee}</li>
      <li style="padding:6px 0;">Founding member priority</li>
    </ul>
  </div>
</div>`;
}

// --- Testimonial Card ---

export function generateTestimonialCard(quote: string, name: string, title: string): string {
  return `
<div style="${STYLES.card}max-width:500px;border-left:3px solid ${VM_BRAND.colours.gold};">
  <p style="${STYLES.body}font-style:italic;margin-bottom:16px;">"${quote}"</p>
  <div style="${STYLES.label}">${name} — ${title}</div>
</div>`;
}
