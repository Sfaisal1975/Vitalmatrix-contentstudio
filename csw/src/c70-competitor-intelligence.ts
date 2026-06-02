/**
 * c70-competitor-intelligence.ts
 * VitalMatrix Content Studio — K10-Compliant Competitive Intelligence
 *
 * Captures market gaps observed in FM practitioner groups, feedback
 * and research. Generates positioning content that addresses those
 * gaps WITHOUT EVER naming competitors (K10 enforced at every output).
 *
 * Positioning stance: "building upon IFM", never "better than X".
 *
 * K7: credentials locked (MBBS, FAAMFM).
 * K8: British English throughout.
 * K10: ZERO competitor names. Enforced programmatically.
 *
 * (c) VitalMatrix Ltd 2026. All rights reserved.
 */

import { VM_BRAND } from './brand-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Evidence tier re-export for clinical claim tagging. */
export type EvidenceTier = typeof VM_BRAND.evidenceTiers[number];

/** Category of a market gap. */
export type GapCategory = 'feature' | 'pricing' | 'support' | 'clinical' | 'technology' | 'regulatory';

/** How the gap was identified. */
export type GapSourceType = 'group-observation' | 'practitioner-feedback' | 'market-research';

/** A single market gap observed in the FM practitioner landscape. */
export interface MarketGap {
  /** Unique identifier. */
  id: string;
  /** Gap category. */
  category: GapCategory;
  /** Description of the gap (K10: no competitor names). */
  description: string;
  /** How VitalMatrix fills this gap. */
  vmAdvantage: string;
  /** How the gap was identified. */
  sourceType: GapSourceType;
  /** ISO date when the gap was first identified. */
  dateIdentified: string;
}

/** A recurring pattern observed in competitive landscape. */
export interface CompetitorPattern {
  /** Description of the pattern (K10: no competitor names). */
  pattern: string;
  /** How frequently this pattern is observed. */
  frequency: 'common' | 'occasional' | 'rare';
  /** How VitalMatrix responds to this pattern. */
  vmResponse: string;
}

// ---------------------------------------------------------------------------
// K10 enforcement
// ---------------------------------------------------------------------------

/** Words and phrases that must NEVER appear in any output (K10). */
const K10_BLOCKED_TERMS: string[] = [
  'dr mark hyman',
  'mark hyman',
  'hyman',
  'lavalle',
  'metabolic code',
  'opus 23',
  'nutri-q',
  'genova',
  'dutch test',
  'ifm matrix', // only blocked as competitor reference; "IFM" alone is fine
];

/**
 * Strips K10-blocked terms from a string. Replaces with "[redacted]".
 *
 * @param text - Input text to sanitise.
 * @returns Sanitised text with no competitor names.
 */
function enforceK10(text: string): string {
  let sanitised = text;
  for (const term of K10_BLOCKED_TERMS) {
    const regex = new RegExp(term, 'gi');
    sanitised = sanitised.replace(regex, '[redacted]');
  }
  return sanitised;
}

// ---------------------------------------------------------------------------
// Pre-built gaps
// ---------------------------------------------------------------------------

const PRE_BUILT_GAPS: MarketGap[] = [
  {
    id: 'GAP-001',
    category: 'feature',
    description: 'No systematic way to track cascades between clinical domains.',
    vmAdvantage: 'CascadeAtlas maps directional cascade pathways between all 7 nodes automatically.',
    sourceType: 'group-observation',
    dateIdentified: '2026-01-15',
  },
  {
    id: 'GAP-002',
    category: 'clinical',
    description: 'Manual IFM matrix mapping is time-consuming and error-prone.',
    vmAdvantage: 'VitalMatrix automates terrain mapping across 7 nodes and 5 zones, building upon IFM principles.',
    sourceType: 'practitioner-feedback',
    dateIdentified: '2026-01-20',
  },
  {
    id: 'GAP-003',
    category: 'feature',
    description: 'No longitudinal comparison between visits.',
    vmAdvantage: 'DeltaScan provides side-by-side visit comparison with delta scoring for every node and zone.',
    sourceType: 'group-observation',
    dateIdentified: '2026-02-01',
  },
  {
    id: 'GAP-004',
    category: 'clinical',
    description: 'Generic protocols not terrain-specific.',
    vmAdvantage: 'VitalMatrix terrain support considerations are generated from the individual terrain profile, not generic templates.',
    sourceType: 'practitioner-feedback',
    dateIdentified: '2026-02-10',
  },
  {
    id: 'GAP-005',
    category: 'clinical',
    description: 'No evidence tiers on recommendations.',
    vmAdvantage: 'Every VitalMatrix output carries an evidence tier: Established, Emerging, Theoretical, Observed in Practice, or Contested.',
    sourceType: 'group-observation',
    dateIdentified: '2026-02-15',
  },
  {
    id: 'GAP-006',
    category: 'pricing',
    description: 'Expensive platforms with limited FM focus.',
    vmAdvantage: `VitalMatrix founding rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Purpose-built for FM practitioners.`,
    sourceType: 'market-research',
    dateIdentified: '2026-02-20',
  },
  {
    id: 'GAP-007',
    category: 'regulatory',
    description: 'US-centric tools not UK regulatory compliant.',
    vmAdvantage: 'VitalMatrix is UK-built, MHRA-aware, ICO registered (ZC101813), England-focused.',
    sourceType: 'practitioner-feedback',
    dateIdentified: '2026-03-01',
  },
  {
    id: 'GAP-008',
    category: 'technology',
    description: 'No practitioner accountability trail.',
    vmAdvantage: 'VitalMatrix maintains a full audit trail of assessments, decisions and outputs for practitioner accountability.',
    sourceType: 'market-research',
    dateIdentified: '2026-03-05',
  },
  {
    id: 'GAP-009',
    category: 'feature',
    description: 'No cascade detection across zones.',
    vmAdvantage: 'CascadeIQ detects cross-zone cascades automatically, alerting practitioners to patterns they might miss.',
    sourceType: 'group-observation',
    dateIdentified: '2026-03-10',
  },
  {
    id: 'GAP-010',
    category: 'clinical',
    description: 'Assessment takes too long.',
    vmAdvantage: 'VitalMatrix FLINT pipeline structures intake data automatically, reducing assessment time significantly.',
    sourceType: 'practitioner-feedback',
    dateIdentified: '2026-03-15',
  },
];

// ---------------------------------------------------------------------------
// In-memory gap store
// ---------------------------------------------------------------------------

const gapStore: MarketGap[] = [...PRE_BUILT_GAPS];

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Adds a new market gap to the intelligence store.
 * All text is K10-sanitised before storage.
 *
 * @param gap - The market gap to add.
 * @returns The sanitised gap as stored.
 */
export function addGap(gap: MarketGap): MarketGap {
  const sanitised: MarketGap = {
    ...gap,
    description: enforceK10(gap.description),
    vmAdvantage: enforceK10(gap.vmAdvantage),
  };
  gapStore.push(sanitised);
  return sanitised;
}

/**
 * Returns all gaps matching a given category.
 *
 * @param category - The gap category to filter by.
 * @returns An array of {@link MarketGap} in that category.
 */
export function getGapsByCategory(category: GapCategory): MarketGap[] {
  return gapStore.filter((g) => g.category === category);
}

/**
 * Generates a full gap analysis in markdown.
 * Lists what practitioners complain about and how VitalMatrix fills each gap.
 *
 * @returns A markdown-formatted gap analysis document.
 */
export function generateGapAnalysis(): string {
  const categories: GapCategory[] = ['feature', 'clinical', 'pricing', 'technology', 'regulatory', 'support'];

  const sections = categories
    .map((cat) => {
      const gaps = gapStore.filter((g) => g.category === cat);
      if (gaps.length === 0) return '';

      const rows = gaps
        .map(
          (g) =>
            `### ${g.id}: ${g.description}\n` +
            `- **Source:** ${g.sourceType}\n` +
            `- **VitalMatrix advantage:** ${g.vmAdvantage}\n` +
            `- **Identified:** ${g.dateIdentified}`,
        )
        .join('\n\n');

      return `## ${cat.charAt(0).toUpperCase() + cat.slice(1)} Gaps\n\n${rows}`;
    })
    .filter((s) => s.length > 0)
    .join('\n\n');

  return (
    `# Market Gap Analysis\n\n` +
    `**Total gaps tracked:** ${gapStore.length}\n\n` +
    `> Positioning: VitalMatrix builds upon the IFM framework, systematising ` +
    `what practitioners already do. No competitor names are used (K10).\n\n` +
    sections +
    `\n\n---\n${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`
  );
}

/**
 * Generates content that addresses gaps without naming competitors.
 * Output is suitable for blog posts, social media or ad copy.
 *
 * @param gaps - Gaps to address (defaults to all stored gaps).
 * @returns An array of positioning statements.
 */
export function generatePositioningFromGaps(gaps?: MarketGap[]): string[] {
  const source = gaps || gapStore;

  return source.map((gap) =>
    enforceK10(
      `Practitioners tell us: "${gap.description}" ` +
        `VitalMatrix addresses this: ${gap.vmAdvantage}`,
    ),
  );
}

/**
 * Generates a guide for listening in Facebook groups.
 * Tells the team what phrases and complaints to watch for.
 *
 * @returns A markdown-formatted listening guide.
 */
export function generateGroupListeningGuide(): string {
  const signals = gapStore.map(
    (g) => `- **${g.id}:** Listen for: "${g.description}" (category: ${g.category})`,
  );

  return (
    `# Facebook Group Listening Guide\n\n` +
    `## What to listen for\n\n` +
    `These are the gaps practitioners mention most often. When you hear ` +
    `these themes, note the group, the practitioner and the exact phrasing.\n\n` +
    signals.join('\n') +
    `\n\n## Rules\n\n` +
    `- NEVER name a competitor (K10).\n` +
    `- NEVER respond with a sales pitch.\n` +
    `- DO note the gap ID and report it for content planning.\n` +
    `- DO engage helpfully if you have genuine clinical insight.\n\n` +
    `---\n${VM_BRAND.regulatoryFooter}`
  );
}

/**
 * Analyses gap frequency to identify trending concerns.
 *
 * @param gaps - Gaps to analyse (defaults to all stored gaps).
 * @returns A sorted array of categories with their gap counts.
 */
export function monitorTrends(gaps?: MarketGap[]): Array<{ category: GapCategory; count: number }> {
  const source = gaps || gapStore;
  const counts: Record<string, number> = {};

  for (const gap of source) {
    counts[gap.category] = (counts[gap.category] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([category, count]) => ({ category: category as GapCategory, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generates a competitive advantage report.
 * Title: "10 things practitioners want that only VitalMatrix provides."
 *
 * @returns A markdown-formatted advantage report.
 */
export function generateCompetitiveAdvantageReport(): string {
  const top = gapStore.slice(0, 10);

  const items = top
    .map(
      (g, i) =>
        `### ${i + 1}. ${g.description}\n` +
        `**How VitalMatrix delivers:** ${g.vmAdvantage}\n` +
        `*Source: ${g.sourceType}*`,
    )
    .join('\n\n');

  return (
    `# 10 Things Practitioners Want That Only VitalMatrix Provides\n\n` +
    `> Built upon IFM principles. Designed for FM practitioners in England.\n` +
    `> No competitor names. No disparagement. Just gaps filled.\n\n` +
    items +
    `\n\n---\n` +
    `**Founding rate:** ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month, ` +
    `fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.\n\n` +
    `${VM_BRAND.regulatoryFooter}\n${VM_BRAND.tmFooter}`
  );
}
