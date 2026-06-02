/**
 * Component 33D: Session Cost Tracker
 * DEV PACKAGE — Internal tooling only
 *
 * Tracks API token usage across a development session and provides
 * cost breakdowns. Uses Opus pricing: $3/1M input, $15/1M output.
 *
 * Generates markdown reports with per-operation cost analysis and
 * suggestions for reducing token consumption.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A single recorded token usage event. */
export interface TokenUsage {
  /** ISO timestamp of the usage event. */
  timestamp: string;
  /** Name of the operation (e.g., 'file-read', 'code-generation'). */
  operation: string;
  /** Number of input tokens consumed. */
  inputTokens: number;
  /** Number of output tokens consumed. */
  outputTokens: number;
  /** Estimated cost in USD. */
  estimatedCost: number;
}

/** Aggregated cost breakdown for a session. */
export interface SessionCost {
  /** Total input tokens across all operations. */
  totalInputTokens: number;
  /** Total output tokens across all operations. */
  totalOutputTokens: number;
  /** Total estimated cost in USD. */
  totalCost: number;
  /** Per-operation breakdown: operation name -> { tokens, cost }. */
  operationBreakdown: Record<string, { tokens: number; cost: number }>;
  /** Average cost per operation in USD. */
  averageCostPerOperation: number;
  /** Top operations by cost. */
  mostExpensiveOperations: TokenUsage[];
}

// --- Constants ---

/** Opus pricing per token (USD). */
const PRICING = {
  INPUT_PER_TOKEN: 3 / 1_000_000,
  OUTPUT_PER_TOKEN: 15 / 1_000_000,
} as const;

/** Cost percentage threshold for savings suggestions. */
const SUGGESTION_THRESHOLD = 0.3;

// --- Session State ---

/** Internal session log of all token usage events. */
let sessionLog: TokenUsage[] = [];

// --- Core Functions ---

/**
 * Calculate the estimated cost for a given token count.
 *
 * @param inputTokens - Number of input tokens.
 * @param outputTokens - Number of output tokens.
 * @returns Estimated cost in USD.
 */
function calculateCost(inputTokens: number, outputTokens: number): number {
  return (
    inputTokens * PRICING.INPUT_PER_TOKEN + outputTokens * PRICING.OUTPUT_PER_TOKEN
  );
}

/**
 * Track a token usage event for the current session.
 *
 * @param operation - Name of the operation being tracked.
 * @param inputTokens - Number of input tokens consumed.
 * @param outputTokens - Number of output tokens consumed.
 * @returns The recorded usage event.
 */
export function trackUsage(
  operation: string,
  inputTokens: number,
  outputTokens: number,
): TokenUsage {
  const estimatedCost = calculateCost(inputTokens, outputTokens);
  const usage: TokenUsage = {
    timestamp: new Date().toISOString(),
    operation,
    inputTokens,
    outputTokens,
    estimatedCost,
  };

  sessionLog.push(usage);
  return usage;
}

/**
 * Get the aggregated cost breakdown for the current session.
 *
 * @returns Full session cost analysis.
 */
export function getSessionCost(): SessionCost {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCost = 0;
  const operationBreakdown: Record<string, { tokens: number; cost: number }> = {};

  for (const usage of sessionLog) {
    totalInputTokens += usage.inputTokens;
    totalOutputTokens += usage.outputTokens;
    totalCost += usage.estimatedCost;

    const key = usage.operation;
    if (!operationBreakdown[key]) {
      operationBreakdown[key] = { tokens: 0, cost: 0 };
    }
    operationBreakdown[key].tokens += usage.inputTokens + usage.outputTokens;
    operationBreakdown[key].cost += usage.estimatedCost;
  }

  const averageCostPerOperation =
    sessionLog.length > 0 ? totalCost / sessionLog.length : 0;

  // Sort by cost descending for most expensive
  const sorted = [...sessionLog].sort(
    (a, b) => b.estimatedCost - a.estimatedCost,
  );

  return {
    totalInputTokens,
    totalOutputTokens,
    totalCost,
    operationBreakdown,
    averageCostPerOperation,
    mostExpensiveOperations: sorted,
  };
}

/**
 * Get the top N most expensive operations in the current session.
 *
 * @param n - Number of operations to return.
 * @returns Array of the most expensive token usage events.
 */
export function getMostExpensiveOperations(n: number): TokenUsage[] {
  const sorted = [...sessionLog].sort(
    (a, b) => b.estimatedCost - a.estimatedCost,
  );
  return sorted.slice(0, n);
}

/**
 * Generate cost-saving suggestions based on the session breakdown.
 *
 * @param sessionCost - Aggregated session cost data.
 * @returns Array of suggestion strings.
 */
function generateSuggestions(sessionCost: SessionCost): string[] {
  const suggestions: string[] = [];

  // Check if file reads dominate input tokens
  const fileReadOps = ['file-read', 'read', 'file_read', 'Read'];
  let fileReadCost = 0;
  for (const op of fileReadOps) {
    if (sessionCost.operationBreakdown[op]) {
      fileReadCost += sessionCost.operationBreakdown[op].cost;
    }
  }

  if (sessionCost.totalCost > 0 && fileReadCost / sessionCost.totalCost > SUGGESTION_THRESHOLD) {
    const percentage = Math.round((fileReadCost / sessionCost.totalCost) * 100);
    suggestions.push(
      `File reads consumed ${percentage}% of input tokens -- use C12 Context Optimiser to reduce redundant reads.`,
    );
  }

  // Check for repeated operations
  const opCounts = new Map<string, number>();
  for (const usage of sessionLog) {
    opCounts.set(usage.operation, (opCounts.get(usage.operation) || 0) + 1);
  }

  for (const [op, count] of opCounts) {
    if (count > 10) {
      suggestions.push(
        `Operation "${op}" was called ${count} times. Consider batching or caching results.`,
      );
    }
  }

  // Check output token dominance
  if (
    sessionCost.totalOutputTokens > 0 &&
    sessionCost.totalOutputTokens * PRICING.OUTPUT_PER_TOKEN >
      sessionCost.totalCost * 0.7
  ) {
    suggestions.push(
      'Output tokens dominate cost (>70%). Consider requesting shorter responses or using structured output.',
    );
  }

  // General threshold
  if (sessionCost.totalCost > 5) {
    suggestions.push(
      'Session cost exceeds $5. Consider using the local LLM (Qwen 3 4B) for simple lookups and classifications.',
    );
  }

  if (suggestions.length === 0) {
    suggestions.push('No significant optimisation opportunities detected. Token usage is balanced.');
  }

  return suggestions;
}

/**
 * Generate a markdown cost report for the current session.
 *
 * Includes: total cost, per-operation breakdown, and savings suggestions.
 *
 * @returns Markdown-formatted cost report.
 */
export function generateCostReport(): string {
  const cost = getSessionCost();
  const suggestions = generateSuggestions(cost);
  const lines: string[] = [];

  lines.push('# Session Cost Report');
  lines.push('');
  lines.push(`**${VM_BRAND.platform.descriptor}** -- ${VM_BRAND.credentials.company}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total operations:** ${sessionLog.length}`);
  lines.push(`- **Total input tokens:** ${cost.totalInputTokens.toLocaleString()}`);
  lines.push(`- **Total output tokens:** ${cost.totalOutputTokens.toLocaleString()}`);
  lines.push(`- **Total cost:** $${cost.totalCost.toFixed(4)}`);
  lines.push(`- **Average cost per operation:** $${cost.averageCostPerOperation.toFixed(4)}`);
  lines.push('');

  // Pricing reference
  lines.push('## Pricing (Opus)');
  lines.push('');
  lines.push('- Input: $3.00 / 1M tokens');
  lines.push('- Output: $15.00 / 1M tokens');
  lines.push('');

  // Per-operation breakdown
  lines.push('## Operation Breakdown');
  lines.push('');
  lines.push('| Operation | Tokens | Cost |');
  lines.push('|-----------|--------|------|');

  const sortedOps = Object.entries(cost.operationBreakdown).sort(
    ([, a], [, b]) => b.cost - a.cost,
  );

  for (const [op, data] of sortedOps) {
    lines.push(
      `| ${op} | ${data.tokens.toLocaleString()} | $${data.cost.toFixed(4)} |`,
    );
  }
  lines.push('');

  // Most expensive individual operations
  const topN = getMostExpensiveOperations(5);
  if (topN.length > 0) {
    lines.push('## Most Expensive Operations (Top 5)');
    lines.push('');
    for (let i = 0; i < topN.length; i++) {
      const usage = topN[i];
      lines.push(
        `${i + 1}. **${usage.operation}** -- $${usage.estimatedCost.toFixed(4)} ` +
          `(${usage.inputTokens.toLocaleString()} in / ${usage.outputTokens.toLocaleString()} out) ` +
          `at ${usage.timestamp}`,
      );
    }
    lines.push('');
  }

  // Suggestions
  lines.push('## Optimisation Suggestions');
  lines.push('');
  for (const suggestion of suggestions) {
    lines.push(`- ${suggestion}`);
  }
  lines.push('');

  lines.push('---');
  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}

/**
 * Reset the session log, clearing all tracked usage.
 */
export function resetSession(): void {
  sessionLog = [];
}
