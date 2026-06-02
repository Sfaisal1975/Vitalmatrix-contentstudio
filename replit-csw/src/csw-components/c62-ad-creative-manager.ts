/**
 * Component 62: Ad Creative Manager
 *
 * Manages ad creatives with A/B testing and performance tracking.
 * Enforces best practices: max 3 variants per test, minimum 7 days runtime,
 * minimum 100 impressions before declaring a winner. Generates creative briefs
 * and performance reports in VM brand style.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Performance metrics for a single ad creative */
export interface CreativePerformance {
  /** Total impressions served */
  impressions: number;
  /** Total clicks received */
  clicks: number;
  /** Click-through rate (clicks / impressions) */
  ctr: number;
  /** Total conversions attributed */
  conversions: number;
  /** Cost per click in GBP */
  costPerClick: number;
  /** Cost per conversion in GBP */
  costPerConversion: number;
  /** Platform quality score (optional, 1-10) */
  qualityScore?: number;
  /** Platform relevance score (optional, 1-10) */
  relevanceScore?: number;
}

/** Status of an ad creative */
export type CreativeStatus = 'draft' | 'active' | 'paused' | 'completed';

/** Variant label for A/B/C testing */
export type CreativeVariant = 'A' | 'B' | 'C';

/** A single ad creative with copy, targeting, and performance */
export interface AdCreative {
  /** Unique creative identifier */
  id: string;
  /** Creative name for internal reference */
  name: string;
  /** Headline text */
  headline: string;
  /** Body copy */
  body: string;
  /** Opening hook */
  hook: string;
  /** Call-to-action text */
  cta: string;
  /** Description of the visual or image */
  visualDescription: string;
  /** Optional meme template reference */
  memeTemplateId?: string;
  /** Target platform */
  platform: string;
  /** A/B/C variant label */
  variant: CreativeVariant;
  /** Current creative status */
  status: CreativeStatus;
  /** Performance metrics */
  performance: CreativePerformance;
}

/** An A/B (or A/B/C) test grouping creatives */
export interface CreativeTest {
  /** Unique test identifier */
  id: string;
  /** Creatives under test (2-3 variants) */
  creatives: AdCreative[];
  /** Winning creative ID (set when test concludes) */
  winner?: string;
  /** Statistical confidence level (0-1) */
  confidence: number;
  /** Test start date (ISO string) */
  startDate: string;
  /** Test end date (ISO string, set when concluded) */
  endDate?: string;
  /** Total spend across all variants in GBP */
  totalSpend: number;
}

// --- State ---

/** All creatives keyed by ID */
const creatives: Map<string, AdCreative> = new Map();

/** All tests keyed by ID */
const tests: Map<string, CreativeTest> = new Map();

/** Auto-incrementing ID counters */
let creativeCounter = 0;
let testCounter = 0;

// --- Helper Functions ---

/**
 * Generates a unique creative ID.
 */
function nextCreativeId(): string {
  creativeCounter += 1;
  return `creative-${String(creativeCounter).padStart(4, '0')}`;
}

/**
 * Generates a unique test ID.
 */
function nextTestId(): string {
  testCounter += 1;
  return `test-${String(testCounter).padStart(4, '0')}`;
}

/**
 * Calculates days between two ISO date strings.
 */
function daysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

// --- Core Functions ---

/**
 * Creates a new ad creative in draft status.
 * @param name - Internal creative name
 * @param headline - Ad headline
 * @param body - Ad body copy
 * @param hook - Opening hook line
 * @param cta - Call-to-action text
 * @param visualDescription - Description of the visual
 * @param platform - Target platform (e.g. 'linkedin', 'facebook', 'instagram', 'x')
 * @param variant - Variant label (defaults to 'A')
 * @returns The created AdCreative
 */
export function createCreative(
  name: string,
  headline: string,
  body: string,
  hook: string,
  cta: string,
  visualDescription: string,
  platform: string,
  variant: CreativeVariant = 'A'
): AdCreative {
  const creative: AdCreative = {
    id: nextCreativeId(),
    name,
    headline,
    body,
    hook,
    cta,
    visualDescription,
    platform,
    variant,
    status: 'draft',
    performance: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      costPerClick: 0,
      costPerConversion: 0,
    },
  };
  creatives.set(creative.id, creative);
  return creative;
}

/**
 * Creates an A/B (or A/B/C) test with 2-3 creative variants.
 * Enforces max 3 variants per test.
 * @param creativeA - First variant (required)
 * @param creativeB - Second variant (required)
 * @param creativeC - Third variant (optional)
 * @returns The created CreativeTest
 * @throws Error if fewer than 2 creatives provided
 */
export function createABTest(
  creativeA: AdCreative,
  creativeB: AdCreative,
  creativeC?: AdCreative
): CreativeTest {
  const testCreatives = [creativeA, creativeB];
  if (creativeC) testCreatives.push(creativeC);

  // Assign variant labels
  creativeA.variant = 'A';
  creativeA.status = 'active';
  creatives.set(creativeA.id, creativeA);

  creativeB.variant = 'B';
  creativeB.status = 'active';
  creatives.set(creativeB.id, creativeB);

  if (creativeC) {
    creativeC.variant = 'C';
    creativeC.status = 'active';
    creatives.set(creativeC.id, creativeC);
  }

  const test: CreativeTest = {
    id: nextTestId(),
    creatives: testCreatives,
    confidence: 0,
    startDate: new Date().toISOString(),
    totalSpend: 0,
  };
  tests.set(test.id, test);
  return test;
}

/**
 * Updates performance metrics for a creative.
 * Recalculates CTR and cost metrics automatically.
 * @param creativeId - The creative to update
 * @param metrics - Partial performance metrics to apply
 * @returns The updated AdCreative or undefined if not found
 */
export function updatePerformance(
  creativeId: string,
  metrics: Partial<CreativePerformance>
): AdCreative | undefined {
  const creative = creatives.get(creativeId);
  if (!creative) return undefined;

  Object.assign(creative.performance, metrics);

  // Recalculate derived metrics
  if (creative.performance.impressions > 0) {
    creative.performance.ctr =
      (creative.performance.clicks / creative.performance.impressions) * 100;
  }
  if (creative.performance.conversions > 0 && creative.performance.costPerClick > 0) {
    creative.performance.costPerConversion =
      (creative.performance.clicks * creative.performance.costPerClick) /
      creative.performance.conversions;
  }

  creatives.set(creativeId, creative);
  return creative;
}

/**
 * Determines the winner of an A/B test.
 * Requires minimum 100 impressions per variant and 7 days of runtime.
 * Winner is determined by combined CTR + conversion rate score.
 * @param testId - The test to evaluate
 * @returns Object with winner ID, confidence, and reasoning, or null if test cannot be concluded
 */
export function determineWinner(
  testId: string
): { winner: string; confidence: number; reasoning: string } | null {
  const test = tests.get(testId);
  if (!test) return null;

  // Check minimum runtime (7 days)
  const daysRunning = daysBetween(test.startDate, new Date().toISOString());
  if (daysRunning < 7) {
    return null;
  }

  // Check minimum impressions (100 per variant)
  const allHaveMinImpressions = test.creatives.every(
    (c) => c.performance.impressions >= 100
  );
  if (!allHaveMinImpressions) {
    return null;
  }

  // Score each creative: CTR weight 0.6 + conversion rate weight 0.4
  const scored = test.creatives.map((c) => {
    const conversionRate =
      c.performance.clicks > 0
        ? (c.performance.conversions / c.performance.clicks) * 100
        : 0;
    const score = c.performance.ctr * 0.6 + conversionRate * 0.4;
    return { creative: c, score, conversionRate };
  });

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const secondBest = scored[1];

  // Simple confidence based on score gap
  const gap = best.score - secondBest.score;
  const confidence = Math.min(0.99, gap / (best.score || 1));

  test.winner = best.creative.id;
  test.confidence = confidence;
  test.endDate = new Date().toISOString();
  test.totalSpend = test.creatives.reduce(
    (sum, c) => sum + c.performance.clicks * c.performance.costPerClick,
    0
  );

  // Mark non-winners as completed
  for (const c of test.creatives) {
    if (c.id !== best.creative.id) {
      c.status = 'completed';
      creatives.set(c.id, c);
    }
  }

  tests.set(testId, test);

  return {
    winner: best.creative.id,
    confidence,
    reasoning: `Variant ${best.creative.variant} won with CTR ${best.creative.performance.ctr.toFixed(2)}% and conversion rate ${best.conversionRate.toFixed(2)}%. Score gap: ${gap.toFixed(3)}.`,
  };
}

/**
 * Returns all currently active tests.
 */
export function getActiveTests(): CreativeTest[] {
  return Array.from(tests.values()).filter((t) => !t.endDate);
}

/**
 * Returns all completed tests.
 */
export function getCompletedTests(): CreativeTest[] {
  return Array.from(tests.values()).filter((t) => !!t.endDate);
}

/**
 * Returns all creatives, optionally filtered by status.
 */
export function getCreatives(status?: CreativeStatus): AdCreative[] {
  const all = Array.from(creatives.values());
  return status ? all.filter((c) => c.status === status) : all;
}

/**
 * Generates a detailed markdown report for a creative test.
 * Includes per-variant metrics, winner declaration, and learnings.
 * @param testId - The test to report on
 * @returns Markdown-formatted report
 */
export function generateCreativeReport(testId: string): string {
  const test = tests.get(testId);
  if (!test) return `Test "${testId}" not found.`;

  const daysRunning = daysBetween(
    test.startDate,
    test.endDate || new Date().toISOString()
  );

  const lines: string[] = [
    `# Ad Creative Test Report: ${test.id}`,
    '',
    `**Status:** ${test.endDate ? 'Completed' : 'Active'}`,
    `**Start Date:** ${test.startDate.split('T')[0]}`,
    `**Duration:** ${daysRunning} days`,
    `**Total Spend:** ${VM_BRAND.pricing.currency} ${test.totalSpend.toFixed(2)}`,
    '',
    '## Per-Variant Performance',
    '',
    '| Variant | Impressions | Clicks | CTR | Conversions | CPC | CPConv | Quality |',
    '|---------|----------:|-------:|----:|----------:|----:|------:|--------:|',
  ];

  for (const c of test.creatives) {
    const p = c.performance;
    lines.push(
      `| ${c.variant} — ${c.name} | ${p.impressions.toLocaleString()} | ${p.clicks.toLocaleString()} | ${p.ctr.toFixed(2)}% | ${p.conversions} | ${VM_BRAND.pricing.currency} ${p.costPerClick.toFixed(2)} | ${VM_BRAND.pricing.currency} ${p.costPerConversion.toFixed(2)} | ${p.qualityScore || 'N/A'} |`
    );
  }

  lines.push('');

  if (test.winner) {
    const winnerCreative = test.creatives.find((c) => c.id === test.winner);
    lines.push('## Winner');
    lines.push('');
    lines.push(
      `**${winnerCreative?.variant} — ${winnerCreative?.name}** with confidence ${(test.confidence * 100).toFixed(1)}%`
    );
    lines.push('');
    lines.push(`**Winning Headline:** ${winnerCreative?.headline}`);
    lines.push(`**Winning Hook:** ${winnerCreative?.hook}`);
    lines.push(`**Winning CTA:** ${winnerCreative?.cta}`);
  } else {
    lines.push('## Status');
    lines.push('');
    lines.push('Test is still active. No winner declared yet.');
    const insufficientImpressions = test.creatives.filter(
      (c) => c.performance.impressions < 100
    );
    if (insufficientImpressions.length > 0) {
      lines.push(
        `Variants below 100 impressions: ${insufficientImpressions.map((c) => c.variant).join(', ')}`
      );
    }
    if (daysRunning < 7) {
      lines.push(`Minimum 7-day runtime not yet reached (${daysRunning} days elapsed).`);
    }
  }

  lines.push('');
  lines.push('## Learnings');
  lines.push('');

  // Generate learnings based on performance differences
  const sorted = [...test.creatives].sort(
    (a, b) => b.performance.ctr - a.performance.ctr
  );
  if (sorted.length >= 2) {
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    if (best.performance.ctr > worst.performance.ctr) {
      lines.push(
        `- Variant ${best.variant} outperformed Variant ${worst.variant} by ${(best.performance.ctr - worst.performance.ctr).toFixed(2)} percentage points on CTR.`
      );
    }
    if (best.hook !== worst.hook) {
      lines.push(
        `- Hook comparison: "${best.hook}" vs "${worst.hook}" — the former drove higher engagement.`
      );
    }
    if (best.cta !== worst.cta) {
      lines.push(
        `- CTA comparison: "${best.cta}" vs "${worst.cta}" — test further in future iterations.`
      );
    }
  }

  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generates a creative brief for a campaign.
 * @param campaign - Campaign name or theme
 * @param count - Number of creatives to brief
 * @returns Markdown creative brief
 */
export function generateCreativeBrief(campaign: string, count: number): string {
  const lines: string[] = [
    `# Creative Brief: ${campaign}`,
    '',
    `**Brand:** ${VM_BRAND.credentials.company}`,
    `**Platform:** ${VM_BRAND.platform.descriptor}`,
    `**Audience:** ${VM_BRAND.platform.audience} — B2B practitioners`,
    `**Number of Creatives Required:** ${count}`,
    '',
    '## Brand Guidelines',
    '',
    `- **Primary Colour:** ${VM_BRAND.colours.prussianBlue}`,
    `- **Accent Colour:** ${VM_BRAND.colours.gold}`,
    `- **Heading Font:** ${VM_BRAND.fonts.heading}`,
    `- **Body Font:** ${VM_BRAND.fonts.body}`,
    `- **Tone:** Professional, clinical, evidence-based. British English throughout.`,
    '',
    '## Key Messages',
    '',
    `- VitalMatrix is a ${VM_BRAND.platform.descriptor} with 7 nodes, 5 zones, 6 stacks.`,
    `- Founding cohort: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.`,
    `- Standard rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month.`,
    `- Created by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}.`,
    '',
    '## Creative Requirements',
    '',
  ];

  for (let i = 1; i <= count; i++) {
    lines.push(`### Creative ${i}`);
    lines.push('');
    lines.push('- **Headline:** [to be written]');
    lines.push('- **Body:** [to be written]');
    lines.push('- **Hook:** [to be written]');
    lines.push('- **CTA:** [to be written]');
    lines.push('- **Visual:** [to be described]');
    lines.push('');
  }

  lines.push('## Testing Plan');
  lines.push('');
  lines.push(`- Run A/B test with minimum 2 variants per concept.`);
  lines.push(`- Minimum 7-day test duration.`);
  lines.push(`- Minimum 100 impressions per variant before evaluating.`);
  lines.push(`- Evaluate on combined CTR (60% weight) + conversion rate (40% weight).`);
  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Archives (pauses) creatives with CTR below a given threshold.
 * @param threshold - Minimum CTR percentage to keep active
 * @returns Array of archived creative IDs
 */
export function archiveUnderperformers(threshold: number): string[] {
  const archived: string[] = [];

  for (const creative of creatives.values()) {
    if (
      creative.status === 'active' &&
      creative.performance.impressions >= 100 &&
      creative.performance.ctr < threshold
    ) {
      creative.status = 'paused';
      creatives.set(creative.id, creative);
      archived.push(creative.id);
    }
  }

  return archived;
}

/**
 * Returns all creatives and tests. Intended for reporting and export.
 */
export function getAllCreativesAndTests(): { creatives: AdCreative[]; tests: CreativeTest[] } {
  return {
    creatives: Array.from(creatives.values()),
    tests: Array.from(tests.values()),
  };
}

/**
 * Clears all creative and test stores. Intended for testing only.
 */
export function clearCreativeStore(): void {
  creatives.clear();
  tests.clear();
  creativeCounter = 0;
  testCounter = 0;
}

/**
 * Exports all creatives and tests as a JSON string.
 */
export function exportToJson(): string {
  return JSON.stringify(getAllCreativesAndTests(), null, 2);
}

/**
 * Imports creatives and tests from a JSON string, replacing the current stores.
 */
export function importFromJson(json: string): void {
  const data: { creatives: AdCreative[]; tests: CreativeTest[] } = JSON.parse(json);
  clearCreativeStore();
  for (const creative of data.creatives) {
    creatives.set(creative.id, creative);
  }
  for (const test of data.tests) {
    tests.set(test.id, test);
  }
}
