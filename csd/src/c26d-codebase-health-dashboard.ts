/**
 * C26D — Codebase Health Dashboard
 * VitalMatrix Content Studio Dev
 *
 * Single aggregated health report for the VitalMatrix engine codebase.
 * Grades the codebase across multiple dimensions and produces a markdown
 * dashboard with per-dimension scores and prioritised action items.
 *
 * Architecture context: 7 nodes (N1–N7), 5 zones (Z1–Z5), 6 cascade
 * stacks (S1–S6). ALB v1.4 locked. Pipeline D-233b locked.
 *
 * @module c26d-codebase-health-dashboard
 */

import { VM_BRAND } from './brand-config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Largest-file entry used in the dashboard detail section. */
export interface LargestFileEntry {
  readonly path: string;
  readonly lines: number;
}

/** Raw metrics collected from the codebase. */
export interface HealthMetrics {
  readonly totalFiles: number;
  readonly totalLines: number;
  readonly testCount: number;
  readonly testPassRate: number;       // 0–100
  readonly coveragePercent: number;    // 0–100
  readonly duplicationPercent: number; // 0–100
  readonly complianceScore: number;    // 0–100
  readonly architectureViolations: number;
  readonly circularDeps: number;
  readonly staleFiles: number;
  readonly avgFileSize: number;        // lines
  readonly largestFiles: LargestFileEntry[];
}

/** Overall codebase grade. */
export type HealthGrade = 'A' | 'B' | 'C' | 'D' | 'F';

/** Per-dimension assessment used internally. */
interface DimensionResult {
  readonly dimension: string;
  readonly score: number;          // 0–100
  readonly status: 'pass' | 'warning' | 'fail';
  readonly detail: string;
}

/* ------------------------------------------------------------------ */
/*  Thresholds                                                         */
/* ------------------------------------------------------------------ */

const THRESHOLDS = {
  testPassRate:             { warn: 90, fail: 80 },
  coveragePercent:          { warn: 70, fail: 50 },
  complianceScore:          { warn: 80, fail: 80 },   // <80 = fail directly
  duplicationPercent:       { warn: 15, fail: 30 },
  architectureViolations:   { warn: 0,  fail: 0 },    // >0 = fail directly
  circularDeps:             { warn: 0,  fail: 5 },    // >0 = warning, >5 = fail
  staleFiles:               { warn: 10, fail: 25 },
  avgFileSize:              { warn: 400, fail: 800 },
} as const;

/* ------------------------------------------------------------------ */
/*  Dimension scorers                                                  */
/* ------------------------------------------------------------------ */

/**
 * Evaluates every dimension and returns an array of results.
 *
 * @param m - Raw health metrics
 * @returns Per-dimension assessment array
 */
function evaluateDimensions(m: HealthMetrics): DimensionResult[] {
  const results: DimensionResult[] = [];

  // Test pass rate
  results.push(scoreDimension(
    'Test Pass Rate',
    m.testPassRate,
    THRESHOLDS.testPassRate,
    `${m.testPassRate.toFixed(1)}% of ${m.testCount} tests passing`,
    true,
  ));

  // Coverage
  results.push(scoreDimension(
    'Test Coverage',
    m.coveragePercent,
    THRESHOLDS.coveragePercent,
    `${m.coveragePercent.toFixed(1)}% statement coverage`,
    true,
  ));

  // Compliance (D-series, credential, British English)
  results.push(scoreDimension(
    'Compliance',
    m.complianceScore,
    THRESHOLDS.complianceScore,
    `Compliance score ${m.complianceScore}/100`,
    true,
  ));

  // Duplication — lower is better so invert
  results.push(scoreDimension(
    'Duplication',
    100 - m.duplicationPercent,
    { warn: 100 - THRESHOLDS.duplicationPercent.warn, fail: 100 - THRESHOLDS.duplicationPercent.fail },
    `${m.duplicationPercent.toFixed(1)}% duplicated code`,
    true,
  ));

  // Architecture violations — zero tolerance
  const archStatus: 'pass' | 'fail' = m.architectureViolations > 0 ? 'fail' : 'pass';
  results.push({
    dimension: 'Architecture Integrity',
    score: m.architectureViolations === 0 ? 100 : Math.max(0, 100 - m.architectureViolations * 20),
    status: archStatus,
    detail: m.architectureViolations === 0
      ? 'No architecture violations detected'
      : `${m.architectureViolations} violation(s) — N1–N7, Z1–Z5, S1–S6 boundaries breached`,
  });

  // Circular dependencies
  const circStatus: 'pass' | 'warning' | 'fail' =
    m.circularDeps === 0 ? 'pass' : m.circularDeps > 5 ? 'fail' : 'warning';
  results.push({
    dimension: 'Circular Dependencies',
    score: m.circularDeps === 0 ? 100 : Math.max(0, 100 - m.circularDeps * 15),
    status: circStatus,
    detail: m.circularDeps === 0
      ? 'No circular dependencies'
      : `${m.circularDeps} circular dependency chain(s) detected`,
  });

  // Stale files
  results.push(scoreDimension(
    'Stale Files',
    Math.max(0, 100 - m.staleFiles * 3),
    { warn: 100 - THRESHOLDS.staleFiles.warn * 3, fail: 100 - THRESHOLDS.staleFiles.fail * 3 },
    `${m.staleFiles} file(s) with no recent changes`,
    true,
  ));

  // Average file size
  results.push(scoreDimension(
    'Average File Size',
    m.avgFileSize <= 200 ? 100 : Math.max(0, 100 - ((m.avgFileSize - 200) / 6)),
    { warn: 100 - ((THRESHOLDS.avgFileSize.warn - 200) / 6), fail: 100 - ((THRESHOLDS.avgFileSize.fail - 200) / 6) },
    `${m.avgFileSize} lines average`,
    true,
  ));

  return results;
}

/**
 * Scores a single dimension against warn/fail thresholds.
 * Higher normalised score = better.
 */
function scoreDimension(
  name: string,
  normalisedScore: number,
  thresholds: { warn: number; fail: number },
  detail: string,
  higherBetter: boolean,
): DimensionResult {
  let status: 'pass' | 'warning' | 'fail';
  if (higherBetter) {
    if (normalisedScore < thresholds.fail) status = 'fail';
    else if (normalisedScore < thresholds.warn) status = 'warning';
    else status = 'pass';
  } else {
    if (normalisedScore > thresholds.fail) status = 'fail';
    else if (normalisedScore > thresholds.warn) status = 'warning';
    else status = 'pass';
  }
  return { dimension: name, score: Math.round(normalisedScore), status, detail };
}

/* ------------------------------------------------------------------ */
/*  Public functions                                                   */
/* ------------------------------------------------------------------ */

/**
 * Calculates the overall health grade from raw metrics.
 *
 * Grading rules:
 * - **F** — any dimension is 'fail'
 * - **D** — two or more warnings
 * - **C** — one warning
 * - **B** — all pass, average score < 90
 * - **A** — all pass, average score >= 90
 *
 * @param metrics - Raw codebase health metrics
 * @returns Overall health grade A–F
 */
export function calculateHealth(metrics: HealthMetrics): HealthGrade {
  const dims = evaluateDimensions(metrics);

  const failCount = dims.filter(d => d.status === 'fail').length;
  if (failCount > 0) return 'F';

  const warnCount = dims.filter(d => d.status === 'warning').length;
  if (warnCount >= 2) return 'D';
  if (warnCount === 1) return 'C';

  const avg = dims.reduce((sum, d) => sum + d.score, 0) / dims.length;
  return avg >= 90 ? 'A' : 'B';
}

/**
 * Generates a full markdown health dashboard.
 *
 * Sections: Summary Grade, Per-Dimension Scores, Largest Files,
 * Action Items, and the regulatory footer.
 *
 * @param metrics - Raw codebase health metrics
 * @returns Markdown string ready for rendering or file output
 */
export function generateHealthDashboard(metrics: HealthMetrics): string {
  const grade = calculateHealth(metrics);
  const dims = evaluateDimensions(metrics);
  const now = new Date().toISOString().slice(0, 10);

  const statusIcon = (s: 'pass' | 'warning' | 'fail'): string => {
    switch (s) {
      case 'pass':    return 'PASS';
      case 'warning': return 'WARN';
      case 'fail':    return 'FAIL';
    }
  };

  const lines: string[] = [];

  // Header
  lines.push(`# VitalMatrix Codebase Health Dashboard`);
  lines.push('');
  lines.push(`**Generated:** ${now}`);
  lines.push(`**Platform:** ${VM_BRAND.platform.descriptor}`);
  lines.push(`**Owner:** ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`);
  lines.push('');

  // Summary
  lines.push(`## Overall Grade: ${grade}`);
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Total files | ${metrics.totalFiles} |`);
  lines.push(`| Total lines | ${metrics.totalLines.toLocaleString('en-GB')} |`);
  lines.push(`| Tests | ${metrics.testCount} (${metrics.testPassRate.toFixed(1)}% passing) |`);
  lines.push(`| Coverage | ${metrics.coveragePercent.toFixed(1)}% |`);
  lines.push(`| Duplication | ${metrics.duplicationPercent.toFixed(1)}% |`);
  lines.push(`| Compliance | ${metrics.complianceScore}/100 |`);
  lines.push(`| Architecture violations | ${metrics.architectureViolations} |`);
  lines.push(`| Circular dependencies | ${metrics.circularDeps} |`);
  lines.push(`| Stale files | ${metrics.staleFiles} |`);
  lines.push('');

  // Per-dimension scores
  lines.push(`## Per-Dimension Scores`);
  lines.push('');
  lines.push(`| Dimension | Score | Status | Detail |`);
  lines.push(`| --- | --- | --- | --- |`);
  for (const d of dims) {
    lines.push(`| ${d.dimension} | ${d.score} | ${statusIcon(d.status)} | ${d.detail} |`);
  }
  lines.push('');

  // Largest files
  if (metrics.largestFiles.length > 0) {
    lines.push(`## Largest Files`);
    lines.push('');
    lines.push(`| File | Lines |`);
    lines.push(`| --- | --- |`);
    for (const f of metrics.largestFiles.slice(0, 10)) {
      lines.push(`| ${f.path} | ${f.lines} |`);
    }
    lines.push('');
  }

  // Action items
  const actions = dims.filter(d => d.status !== 'pass');
  if (actions.length > 0) {
    lines.push(`## Action Items`);
    lines.push('');
    for (const a of actions) {
      const severity = a.status === 'fail' ? 'CRITICAL' : 'WARNING';
      lines.push(`- **[${severity}]** ${a.dimension}: ${a.detail}`);
    }
    lines.push('');
  } else {
    lines.push(`## Action Items`);
    lines.push('');
    lines.push('No action items — all dimensions are within healthy thresholds.');
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(VM_BRAND.regulatoryFooter);
  lines.push('');

  return lines.join('\n');
}
