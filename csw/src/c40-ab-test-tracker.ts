/**
 * Component 40: A/B Test Tracker
 *
 * Tracks A/B (and A/B/C) test results across content types, builds a
 * learning database of winning patterns, and recommends optimal hooks
 * based on historical data. Supports segment-level analysis.
 *
 * Content types: headline, CTA, subject line, body.
 * Metrics: clicks, opens, conversions, engagement.
 * British English throughout.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Content types that can be A/B tested. */
export type TestContentType = 'headline' | 'cta' | 'subject' | 'body';

/** Metrics used to determine test winners. */
export type TestMetric = 'clicks' | 'opens' | 'conversions' | 'engagement';

/** Variant identifiers. */
export type VariantId = 'A' | 'B' | 'C';

/** A single A/B (or A/B/C) test record. */
export interface AbTest {
  /** Unique test identifier. */
  id: string;
  /** The type of content being tested. */
  contentType: TestContentType;
  /** Variant A text. */
  variantA: string;
  /** Variant B text. */
  variantB: string;
  /** Optional variant C text for 3-way tests. */
  variantC?: string;
  /** The winning variant, if determined. */
  winner?: VariantId;
  /** The metric used to judge the winner. */
  metric: TestMetric;
  /** Optional target segment. */
  segment?: string;
  /** ISO date when the test was created. */
  dateCreated: string;
  /** ISO date when the test was completed. */
  dateCompleted?: string;
  /** Hook type classification for pattern analysis. */
  hookType?: string;
  /** Recorded metric values per variant. */
  metrics?: Record<VariantId, number>;
}

/** Aggregated winning pattern from historical data. */
export interface WinningPattern {
  /** The hook type (e.g. 'curiosity', 'authority', 'urgency'). */
  hookType: string;
  /** Percentage of tests won by this hook type (0-100). */
  winRate: number;
  /** Number of tests in the sample. */
  sampleSize: number;
  /** The segment where this hook performs best. */
  bestSegment: string;
}

// --- In-Memory Store ---

const testStore: AbTest[] = [];

// --- Hook Type Classifications ---

/** Known hook types for pattern classification. */
const HOOK_TYPES = [
  'curiosity',
  'authority',
  'urgency',
  'social-proof',
  'data-driven',
  'question',
  'challenge',
  'benefit-led',
  'fear-of-missing',
  'personal',
] as const;

/**
 * Infers a hook type from variant text based on keyword patterns.
 */
function inferHookType(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes('did you know') || lower.includes('secret') || lower.includes('discover') || lower.includes('hidden')) {
    return 'curiosity';
  }
  if (lower.includes('dr ') || lower.includes('research') || lower.includes('evidence') || lower.includes('study') || lower.includes('clinical')) {
    return 'authority';
  }
  if (lower.includes('limited') || lower.includes('last chance') || lower.includes('closing') || lower.includes('final') || lower.includes('expires')) {
    return 'urgency';
  }
  if (lower.includes('practitioners') || lower.includes('colleagues') || lower.includes('cohort') || lower.includes('join')) {
    return 'social-proof';
  }
  if (lower.includes('%') || lower.includes('hours') || lower.includes('minutes') || lower.includes('gbp') || lower.includes('save')) {
    return 'data-driven';
  }
  if (lower.includes('?') || lower.startsWith('what') || lower.startsWith('how') || lower.startsWith('why') || lower.startsWith('are you')) {
    return 'question';
  }
  if (lower.includes('most') || lower.includes('never') || lower.includes('stop') || lower.includes('wrong')) {
    return 'challenge';
  }
  if (lower.includes('transform') || lower.includes('improve') || lower.includes('unlock') || lower.includes('gain') || lower.includes('boost')) {
    return 'benefit-led';
  }
  if (lower.includes('miss') || lower.includes('without') || lower.includes('lose') || lower.includes('risk')) {
    return 'fear-of-missing';
  }
  if (lower.includes('you') || lower.includes('your') || lower.includes('personal')) {
    return 'personal';
  }

  return 'unclassified';
}

// --- Core Functions ---

/**
 * Creates a new A/B test and adds it to the store.
 *
 * Automatically infers hook type from variant A text if not provided.
 *
 * @param test - The test configuration (id, variants, metric, etc.).
 * @returns The created AbTest with inferred hook type.
 */
export function createTest(test: Omit<AbTest, 'hookType'> & { hookType?: string }): AbTest {
  const newTest: AbTest = {
    ...test,
    hookType: test.hookType ?? inferHookType(test.variantA),
    dateCreated: test.dateCreated || new Date().toISOString().split('T')[0],
  };
  testStore.push(newTest);
  return { ...newTest };
}

/**
 * Records the result of a completed A/B test.
 *
 * @param testId - The test identifier.
 * @param winner - The winning variant ('A', 'B', or 'C').
 * @param metrics - Metric values per variant.
 * @returns The updated AbTest, or undefined if not found.
 */
export function recordResult(
  testId: string,
  winner: VariantId,
  metrics: Record<VariantId, number>
): AbTest | undefined {
  const test = testStore.find(t => t.id === testId);
  if (!test) return undefined;

  test.winner = winner;
  test.metrics = metrics;
  test.dateCompleted = new Date().toISOString().split('T')[0];

  // Reclassify hook type based on winning variant text
  const winningText = winner === 'A' ? test.variantA
    : winner === 'B' ? test.variantB
    : test.variantC ?? test.variantA;
  test.hookType = inferHookType(winningText);

  return { ...test };
}

/**
 * Retrieves all tests for a given content type.
 *
 * @param contentType - The content type to filter by.
 * @returns Array of matching AbTest objects.
 */
export function getTestsByContent(contentType: TestContentType): AbTest[] {
  return testStore
    .filter(t => t.contentType === contentType)
    .map(t => ({ ...t }));
}

/**
 * Analyses completed tests to identify winning patterns by hook type.
 *
 * Groups completed tests by the hook type of the winning variant,
 * calculates win rates, and identifies the best-performing segment
 * for each hook type.
 *
 * @returns Array of WinningPattern objects, sorted by win rate descending.
 */
export function getWinningPatterns(): WinningPattern[] {
  const completed = testStore.filter(t => t.winner && t.hookType);

  if (completed.length === 0) return [];

  // Count wins per hook type
  const hookStats: Map<string, { wins: number; total: number; segments: Map<string, number> }> = new Map();

  // Count total tests per hook type (including losses)
  for (const test of completed) {
    // Track the hook type of each variant
    const hookA = inferHookType(test.variantA);
    const hookB = inferHookType(test.variantB);
    const hookC = test.variantC ? inferHookType(test.variantC) : undefined;

    const allHooks = [hookA, hookB];
    if (hookC) allHooks.push(hookC);

    for (const hook of new Set(allHooks)) {
      if (!hookStats.has(hook)) {
        hookStats.set(hook, { wins: 0, total: 0, segments: new Map() });
      }
      const stats = hookStats.get(hook)!;
      stats.total++;
    }

    // Record the win
    const winningHook = test.hookType!;
    if (!hookStats.has(winningHook)) {
      hookStats.set(winningHook, { wins: 0, total: 0, segments: new Map() });
    }
    const winnerStats = hookStats.get(winningHook)!;
    winnerStats.wins++;

    if (test.segment) {
      const segCount = winnerStats.segments.get(test.segment) ?? 0;
      winnerStats.segments.set(test.segment, segCount + 1);
    }
  }

  // Build patterns
  const patterns: WinningPattern[] = [];
  for (const [hookType, stats] of hookStats) {
    if (stats.wins === 0) continue;

    let bestSegment = 'all';
    let bestSegmentCount = 0;
    for (const [seg, count] of stats.segments) {
      if (count > bestSegmentCount) {
        bestSegment = seg;
        bestSegmentCount = count;
      }
    }

    patterns.push({
      hookType,
      winRate: Math.round((stats.wins / stats.total) * 100),
      sampleSize: stats.total,
      bestSegment,
    });
  }

  return patterns.sort((a, b) => b.winRate - a.winRate);
}

/**
 * Generates a learnings report from all completed tests.
 *
 * Summarises winning patterns with segment-specific insights.
 * Format: "Curiosity hooks win 67% for IFM-trained, Authority hooks
 * win 72% for non-IFM".
 *
 * @returns Markdown string with the full learnings report.
 */
export function generateLearningsReport(): string {
  const patterns = getWinningPatterns();
  const completed = testStore.filter(t => t.winner);
  const total = testStore.length;

  if (patterns.length === 0) {
    return `# A/B Test Learnings Report\n\nNo completed tests yet. Create and complete tests to build the learning database.\n\n---\n${VM_BRAND.regulatoryFooter}`;
  }

  const patternSummaries = patterns.map(p => {
    const segmentNote = p.bestSegment !== 'all'
      ? ` (strongest with ${p.bestSegment})`
      : '';
    return `- **${p.hookType}** hooks win ${p.winRate}% of the time (n=${p.sampleSize})${segmentNote}`;
  }).join('\n');

  const topInsights = patterns.slice(0, 3).map(p => {
    const segLabel = p.bestSegment !== 'all' ? ` for ${p.bestSegment}` : '';
    return `${capitalise(p.hookType)} hooks win ${p.winRate}%${segLabel}`;
  }).join('. ');

  const contentTypeSummary = (['headline', 'cta', 'subject', 'body'] as TestContentType[])
    .map(ct => {
      const tests = completed.filter(t => t.contentType === ct);
      return `- **${ct}**: ${tests.length} completed test${tests.length !== 1 ? 's' : ''}`;
    }).join('\n');

  return `# A/B Test Learnings Report

**Platform:** VitalMatrix -- ${VM_BRAND.platform.descriptor}
**Total tests:** ${total} (${completed.length} completed)
**Generated:** ${new Date().toISOString().split('T')[0]}

---

## Key Insight

${topInsights}.

---

## Winning Patterns by Hook Type

${patternSummaries}

---

## Tests by Content Type

${contentTypeSummary}

---

## Recommendations

${patterns.length > 0 ? generateRecommendations(patterns) : 'Insufficient data for recommendations.'}

---

${VM_BRAND.regulatoryFooter}
`.trim();
}

/**
 * Suggests the best hook type for a given segment and content type,
 * based on historical winning patterns.
 *
 * @param segment - The target audience segment (e.g. 'ifm-trained').
 * @param contentType - The content type being created.
 * @returns A recommendation object with hook type and confidence.
 */
export function suggestBestHook(
  segment: string,
  contentType: TestContentType
): { hookType: string; confidence: string; rationale: string } {
  const relevantTests = testStore.filter(
    t => t.winner && t.contentType === contentType
  );

  const segmentTests = relevantTests.filter(t => t.segment === segment);

  // Use segment-specific data if available, otherwise fall back to all data
  const dataPool = segmentTests.length >= 3 ? segmentTests : relevantTests;

  if (dataPool.length === 0) {
    return {
      hookType: 'authority',
      confidence: 'low (no historical data)',
      rationale: `No completed ${contentType} tests found${segment ? ` for segment "${segment}"` : ''}. Defaulting to "authority" hook, which tends to perform well with practitioner audiences in clinical intelligence contexts.`,
    };
  }

  // Count wins per hook type in the data pool
  const hookWins: Map<string, number> = new Map();
  for (const test of dataPool) {
    const hook = test.hookType ?? 'unclassified';
    hookWins.set(hook, (hookWins.get(hook) ?? 0) + 1);
  }

  // Find the hook with the most wins
  let bestHook = 'authority';
  let bestCount = 0;
  for (const [hook, count] of hookWins) {
    if (count > bestCount) {
      bestHook = hook;
      bestCount = count;
    }
  }

  const winRate = Math.round((bestCount / dataPool.length) * 100);
  const dataSource = segmentTests.length >= 3 ? 'segment-specific' : 'cross-segment';
  const confidence = dataPool.length >= 10 ? 'high' : dataPool.length >= 5 ? 'moderate' : 'low';

  return {
    hookType: bestHook,
    confidence: `${confidence} (${dataPool.length} tests, ${dataSource} data)`,
    rationale: `"${capitalise(bestHook)}" hooks have won ${winRate}% of ${contentType} tests${segmentTests.length >= 3 ? ` for the "${segment}" segment` : ' across all segments'} (n=${dataPool.length}).`,
  };
}

// --- Helpers ---

/**
 * Capitalises the first letter of a string.
 */
function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Generates actionable recommendations from winning patterns.
 */
function generateRecommendations(patterns: WinningPattern[]): string {
  const lines: string[] = [];

  if (patterns.length > 0) {
    const top = patterns[0];
    lines.push(`1. **Lead with ${top.hookType} hooks** -- they have the highest win rate at ${top.winRate}% across ${top.sampleSize} tests.`);
  }

  if (patterns.length > 1) {
    const second = patterns[1];
    lines.push(`2. **${capitalise(second.hookType)} hooks** are the second-strongest performer at ${second.winRate}%. Consider alternating between the top two.`);
  }

  const lowPerformers = patterns.filter(p => p.winRate < 30);
  if (lowPerformers.length > 0) {
    const names = lowPerformers.map(p => p.hookType).join(', ');
    lines.push(`3. **Reduce usage of**: ${names} -- these hook types underperform consistently.`);
  }

  const segmentSpecific = patterns.filter(p => p.bestSegment !== 'all');
  if (segmentSpecific.length > 0) {
    const insight = segmentSpecific[0];
    lines.push(`4. **Segment insight**: "${insight.hookType}" hooks perform best with the "${insight.bestSegment}" segment. Personalise content accordingly.`);
  }

  if (lines.length === 0) {
    lines.push('Continue testing to build a more robust dataset. Aim for at least 10 completed tests per content type.');
  }

  return lines.join('\n');
}

/**
 * Clears the test store. Intended for testing only.
 */
export function clearTestStore(): void {
  testStore.length = 0;
}

/**
 * Returns all stored tests. Intended for reporting and export.
 */
export function getAllTests(): AbTest[] {
  return [...testStore];
}

/**
 * Exports all tests as a JSON string.
 */
export function exportToJson(): string {
  return JSON.stringify(getAllTests(), null, 2);
}

/**
 * Imports tests from a JSON string, replacing the current store.
 */
export function importFromJson(json: string): void {
  const items: AbTest[] = JSON.parse(json);
  clearTestStore();
  for (const item of items) {
    testStore.push(item);
  }
}
