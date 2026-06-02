/**
 * C29D — Error Pattern Analyser
 * VitalMatrix Content Studio Dev
 *
 * Categorises test failures against known error patterns specific to
 * the VitalMatrix engine codebase, suggests context-aware fixes, and
 * generates a grouped failure report. Patterns are tuned for the 7-node,
 * 5-zone, 6-stack architecture with ALB v1.4 constraints.
 *
 * @module c29d-error-pattern-analyzer
 */

import { VM_BRAND } from './brand-config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Error categories aligned with common VitalMatrix failure modes. */
export type ErrorCategory =
  | 'type-error'
  | 'assertion-failure'
  | 'architecture-violation'
  | 'import-error'
  | 'runtime-error'
  | 'timeout';

/** Severity levels for triaging failures. */
export type FailureSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

/** A known error pattern with its regex, category, and suggested fix. */
export interface ErrorPattern {
  readonly category: ErrorCategory;
  readonly pattern: RegExp;
  readonly suggestedFix: string;
  readonly examples: string[];
}

/** Analysis result for a single test failure. */
export interface FailureAnalysis {
  readonly testName: string;
  readonly errorMessage: string;
  readonly category: ErrorCategory;
  readonly suggestedFix: string;
  readonly relatedFiles: string[];
  readonly severity: FailureSeverity;
}

/* ------------------------------------------------------------------ */
/*  Known patterns                                                     */
/* ------------------------------------------------------------------ */

/**
 * Built-in error patterns covering common VitalMatrix failure modes.
 * Order matters — first match wins.
 */
const KNOWN_PATTERNS: ErrorPattern[] = [
  // Architecture violations
  {
    category: 'architecture-violation',
    pattern: /N8|N9|N10|node[_\s]?8|node[_\s]?9/i,
    suggestedFix: 'Architecture violation: N8+ reference found. Only N1–N7 exist (ALB v1.4).',
    examples: ['ReferenceError: N8 is not defined', 'node_8_score is not a valid node'],
  },
  {
    category: 'architecture-violation',
    pattern: /Z6|Z7|zone[_\s]?6|zone[_\s]?7/i,
    suggestedFix: 'Architecture violation: Z6+ reference found. Only Z1–Z5 exist.',
    examples: ['Expected zone Z6 to be defined', 'zone_6 is not assignable'],
  },
  {
    category: 'architecture-violation',
    pattern: /S7|S8|stack[_\s]?7|stack[_\s]?8/i,
    suggestedFix: 'Architecture violation: S7+ reference found. Only S1–S6 cascade stacks exist.',
    examples: ['stack_7 is undefined', 'S7 cascade not found'],
  },
  {
    category: 'architecture-violation',
    pattern: /pipeline.*order|order.*pipeline|FLINT.*VISTA/i,
    suggestedFix: 'Pipeline order violation. Check D-233b: FLINT->APEX->STRIDE->RIL->CADENCE->CIL->VISTA.',
    examples: ['Pipeline stages out of order', 'APEX called before FLINT'],
  },

  // Type errors
  {
    category: 'type-error',
    pattern: /TypeError|is not assignable to type|Type '.*' is not assignable/i,
    suggestedFix: 'Type mismatch. Check interface definitions and ensure score types are number (0–100).',
    examples: ["Type 'string' is not assignable to type 'number'", 'TypeError: Cannot read properties of undefined'],
  },
  {
    category: 'type-error',
    pattern: /zone.*score.*type|score.*type.*zone|threshold.*type/i,
    suggestedFix: 'Type error in zone score: check D-38 threshold types. Zone scores must be 0–100 number.',
    examples: ['Expected zone score to be number, got string', 'Threshold type mismatch in Z3'],
  },
  {
    category: 'type-error',
    pattern: /dampening.*factor|factor.*0\.7|N6.*damp/i,
    suggestedFix: 'N6 dampening factor must be 0.7 (number). Check D-212 scoring: MAX(dampened)-10.',
    examples: ['N6 dampening factor expected 0.7, got 1.0', 'dampening_factor is not a number'],
  },

  // Import errors
  {
    category: 'import-error',
    pattern: /Cannot find module|Module not found|ERR_MODULE_NOT_FOUND/i,
    suggestedFix: 'Module not found. Check file path (kebab-case convention), ensure file exists and exports are correct.',
    examples: ["Cannot find module './stride-engine'", "Module not found: './connections/n3-z2'"],
  },
  {
    category: 'import-error',
    pattern: /is not exported from|does not provide an export named/i,
    suggestedFix: 'Named export missing. Check the source file exports match the import statement.',
    examples: ["'calculateScore' is not exported from './l4-scoring'"],
  },

  // Assertion failures
  {
    category: 'assertion-failure',
    pattern: /AssertionError|Expected.*to (equal|be|match|contain)|expect\(.*\)\.(toBe|toEqual|toMatch)/i,
    suggestedFix: 'Assertion mismatch. Verify expected values against D-series decision thresholds and scoring rules.',
    examples: ['Expected 85 to equal 75', "AssertionError: expected 'A' to be 'B'"],
  },
  {
    category: 'assertion-failure',
    pattern: /score.*expected|expected.*score|threshold.*fail/i,
    suggestedFix: 'Score assertion failure. Check scoring is 0–100 internal, D-212 MAX(dampened)-10 rule applied.',
    examples: ['Expected score 92 but got 82', 'Threshold check failed for compliance score'],
  },

  // Runtime errors
  {
    category: 'runtime-error',
    pattern: /RangeError|Maximum call stack|out of memory|heap/i,
    suggestedFix: 'Runtime error: possible infinite recursion or memory issue. Check circular dependencies.',
    examples: ['RangeError: Maximum call stack size exceeded', 'JavaScript heap out of memory'],
  },
  {
    category: 'runtime-error',
    pattern: /ReferenceError|is not defined|undefined is not/i,
    suggestedFix: 'Undefined reference. Check variable initialisation and ensure imports are in place.',
    examples: ['ReferenceError: cascadeScore is not defined', "undefined is not a function"],
  },
  {
    category: 'runtime-error',
    pattern: /Error|ENOENT|EACCES|EPERM/i,
    suggestedFix: 'Runtime error. Check file paths, permissions, and environment configuration.',
    examples: ["ENOENT: no such file or directory", 'EACCES: permission denied'],
  },

  // Timeouts
  {
    category: 'timeout',
    pattern: /timeout|timed out|exceeded.*ms|TIMEOUT/i,
    suggestedFix: 'Test timeout. Check for unresolved promises, missing async/await, or slow database queries.',
    examples: ['Timeout - Async callback was not invoked within 5000ms', 'Test timed out after 30000ms'],
  },
];

/* ------------------------------------------------------------------ */
/*  Categorisation                                                     */
/* ------------------------------------------------------------------ */

/**
 * Categorises an error message against known patterns.
 *
 * @param errorMessage - The error text to categorise
 * @returns Matching ErrorPattern, or a generic runtime-error fallback
 */
export function categorizeError(errorMessage: string): ErrorPattern {
  for (const pattern of KNOWN_PATTERNS) {
    if (pattern.pattern.test(errorMessage)) {
      return pattern;
    }
  }

  // Fallback
  return {
    category: 'runtime-error',
    pattern: /.*/,
    suggestedFix: 'Unrecognised error. Review the stack trace and check recent changes.',
    examples: [],
  };
}

/**
 * Determines severity based on the error category.
 *
 * - CRITICAL: architecture-violation, import-error (build-breaking)
 * - HIGH: type-error, assertion-failure
 * - MEDIUM: runtime-error, timeout
 *
 * @param category - Error category
 * @returns Severity level
 */
function determineSeverity(category: ErrorCategory): FailureSeverity {
  switch (category) {
    case 'architecture-violation':
    case 'import-error':
      return 'CRITICAL';
    case 'type-error':
    case 'assertion-failure':
      return 'HIGH';
    case 'runtime-error':
    case 'timeout':
      return 'MEDIUM';
  }
}

/**
 * Extracts file paths mentioned in an error message or stack trace.
 *
 * @param text - Error message or stack trace
 * @returns Array of related file paths
 */
function extractRelatedFiles(text: string): string[] {
  const fileMatches = text.match(/(?:src\/|\.\/|\/)[^\s:()]+\.[tj]sx?/g) ?? [];
  return [...new Set(fileMatches)];
}

/* ------------------------------------------------------------------ */
/*  Parsing                                                            */
/* ------------------------------------------------------------------ */

/**
 * Parses raw npm test output into structured failure analyses.
 *
 * Recognises test failure blocks from common test runners (Jest, Vitest,
 * Node test runner). Each failure is categorised, assigned a severity,
 * and given a context-aware fix suggestion.
 *
 * @param npmTestOutput - Raw stdout/stderr from `npm test`
 * @returns Array of failure analyses
 */
export function parseTestOutput(npmTestOutput: string): FailureAnalysis[] {
  const analyses: FailureAnalysis[] = [];
  const lines = npmTestOutput.split('\n');

  let currentTestName = '';
  let currentError = '';
  let collecting = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect test name lines (common patterns)
    const failMatch = line.match(/(?:FAIL|FAILED|not ok|x\s+)\s*(.+)/i);
    if (failMatch) {
      // Flush previous
      if (collecting && currentTestName && currentError) {
        analyses.push(buildAnalysis(currentTestName, currentError));
      }
      currentTestName = failMatch[1].trim();
      currentError = '';
      collecting = true;
      continue;
    }

    // Detect error lines
    const errorMatch = line.match(/^\s*(Error|TypeError|ReferenceError|RangeError|AssertionError|Expected|Timeout|Cannot find module|Module not found)/i);
    if (errorMatch && collecting) {
      currentError += line.trim() + '\n';
      continue;
    }

    // Collect stack trace lines
    if (collecting && (line.trim().startsWith('at ') || line.includes('.ts:') || line.includes('.js:'))) {
      currentError += line.trim() + '\n';
      continue;
    }

    // Detect block boundaries
    if (collecting && line.trim() === '') {
      // Possible end of error block — continue collecting but mark boundary
      currentError += '\n';
    }
  }

  // Flush last
  if (collecting && currentTestName && currentError) {
    analyses.push(buildAnalysis(currentTestName, currentError));
  }

  return analyses;
}

/**
 * Builds a FailureAnalysis from a test name and error text.
 */
function buildAnalysis(testName: string, errorMessage: string): FailureAnalysis {
  const pattern = categorizeError(errorMessage);
  return {
    testName,
    errorMessage: errorMessage.trim(),
    category: pattern.category,
    suggestedFix: pattern.suggestedFix,
    relatedFiles: extractRelatedFiles(errorMessage),
    severity: determineSeverity(pattern.category),
  };
}

/* ------------------------------------------------------------------ */
/*  Fix suggestions                                                    */
/* ------------------------------------------------------------------ */

/**
 * Provides a context-aware fix suggestion for a failure analysis.
 * Enhances the base pattern suggestion with VitalMatrix-specific guidance.
 *
 * @param analysis - A single failure analysis
 * @returns Detailed fix suggestion string
 */
export function suggestFix(analysis: FailureAnalysis): string {
  const parts: string[] = [analysis.suggestedFix];

  // Add context-specific guidance
  if (analysis.category === 'architecture-violation') {
    parts.push('Review ALB v1.4 locked architecture: N1–N7 nodes, Z1–Z5 zones, S1–S6 stacks.');
    parts.push('Pipeline order (D-233b): FLINT->APEX->STRIDE->RIL->CADENCE->CIL->VISTA.');
  }

  if (analysis.category === 'type-error' && /score/i.test(analysis.errorMessage)) {
    parts.push('All scores must be 0–100 (number). D-212 rule: MAX(dampened)-10.');
    parts.push('N6 dampening factor: 0.7.');
  }

  if (analysis.category === 'assertion-failure' && /threshold/i.test(analysis.errorMessage)) {
    parts.push('Check D-series threshold definitions. Zone thresholds come from D-38.');
  }

  if (analysis.relatedFiles.length > 0) {
    parts.push(`Related files: ${analysis.relatedFiles.join(', ')}`);
  }

  return parts.join('\n  ');
}

/* ------------------------------------------------------------------ */
/*  Report generation                                                  */
/* ------------------------------------------------------------------ */

/**
 * Generates a markdown failure report grouped by error category.
 *
 * @param analyses - Array of failure analyses
 * @returns Markdown-formatted failure report
 */
export function generateFailureReport(analyses: FailureAnalysis[]): string {
  const now = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push('# VitalMatrix Test Failure Report');
  lines.push('');
  lines.push(`**Generated:** ${now}`);
  lines.push(`**Platform:** ${VM_BRAND.platform.descriptor}`);
  lines.push(`**Total failures:** ${analyses.length}`);
  lines.push('');

  if (analyses.length === 0) {
    lines.push('No test failures detected. All tests passing.');
    lines.push('');
    lines.push('---');
    lines.push(VM_BRAND.regulatoryFooter);
    return lines.join('\n');
  }

  // Summary by category
  lines.push('## Summary by Category');
  lines.push('');
  lines.push('| Category | Count | Severity |');
  lines.push('| --- | --- | --- |');

  const grouped: Record<string, FailureAnalysis[]> = {};
  for (const a of analyses) {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  }

  for (const [category, items] of Object.entries(grouped).sort()) {
    const maxSeverity = items.some(i => i.severity === 'CRITICAL') ? 'CRITICAL' :
      items.some(i => i.severity === 'HIGH') ? 'HIGH' : 'MEDIUM';
    lines.push(`| ${category} | ${items.length} | ${maxSeverity} |`);
  }
  lines.push('');

  // Detail by category
  for (const [category, items] of Object.entries(grouped).sort()) {
    lines.push(`## ${formatCategory(category)}`);
    lines.push('');

    for (const item of items) {
      lines.push(`### ${item.testName}`);
      lines.push('');
      lines.push(`**Severity:** ${item.severity}`);
      lines.push('');
      lines.push('**Error:**');
      lines.push('```');
      lines.push(item.errorMessage);
      lines.push('```');
      lines.push('');
      lines.push(`**Suggested fix:** ${suggestFix(item)}`);
      lines.push('');
      if (item.relatedFiles.length > 0) {
        lines.push(`**Related files:** ${item.relatedFiles.map(f => '`' + f + '`').join(', ')}`);
        lines.push('');
      }
    }
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);
  lines.push('');

  return lines.join('\n');
}

/**
 * Formats a kebab-case category into a title.
 */
function formatCategory(category: string): string {
  return category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
