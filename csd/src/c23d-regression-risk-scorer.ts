/**
 * Component 23D: Regression Risk Scorer
 * DEV PACKAGE — Internal tooling only
 *
 * Scores the regression risk when a file changes, based on its position
 * in the architecture, dependency count, and criticality.
 *
 * Risk factors:
 *   - Files in l1–l9 engines: +40
 *   - Files in safety/: +30
 *   - Files imported by 5+ others: +20
 *   - Files with D-series decision references: +10
 *   - Test files: +0 (no added risk)
 *
 * Designed to run on changesets before commits, surfacing which
 * changed files carry the most downstream risk.
 *
 * Pipeline context: FLINT > APEX > STRIDE > RIL > CADENCE > CIL > VISTA
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Risk level classification. */
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

/** Risk score for a single file. */
export interface RiskScore {
  /** File path being scored. */
  file: string;
  /** Classified risk level. */
  riskLevel: RiskLevel;
  /** Numeric score 0–100. */
  score: number;
  /** Number of files that depend on this file. */
  dependentFiles: number;
  /** Engine paths that this file is part of or feeds into. */
  enginesCritical: string[];
  /** Human-readable reason for the risk level. */
  reason: string;
}

/** Risk factors used in scoring calculations. */
export interface RiskFactors {
  /** Whether the file is in an L1–L9 engine directory. */
  isEngine: boolean;
  /** Whether the file is in the safety/ directory. */
  isSafety: boolean;
  /** Number of files that import this file. */
  importedByCount: number;
  /** Whether the file contains D-series decision references. */
  hasDSeriesRefs: boolean;
  /** Whether the file is a test file. */
  isTestFile: boolean;
}

/** Simple dependency graph structure. */
export interface DependencyGraph {
  /** Map of file path to array of files that import it. */
  dependents: Map<string, string[]>;
}

// --- Constants ---

/** Score weights for each risk factor. */
const WEIGHTS = {
  ENGINE: 40,
  SAFETY: 30,
  HIGH_IMPORT: 20,
  D_SERIES: 10,
} as const;

/** Threshold for high-import-count bonus. */
const HIGH_IMPORT_THRESHOLD = 5;

/** Score thresholds for risk level classification. */
const THRESHOLDS = {
  CRITICAL: 70,
  HIGH: 50,
  MEDIUM: 25,
} as const;

/** Engine pipeline stages for reference in reports. */
const PIPELINE_ENGINES = [
  'FLINT', 'APEX', 'STRIDE', 'RIL', 'CADENCE', 'CIL', 'VISTA',
] as const;

/** Patterns matching engine directories (L1–L9). */
const ENGINE_DIR_PATTERN = /[/\\]l[1-9][/\\]/i;

/** Pattern matching safety directory. */
const SAFETY_DIR_PATTERN = /[/\\]safety[/\\]/i;

/** Pattern matching test files. */
const TEST_FILE_PATTERN = /\.(test|spec)\.(ts|tsx|js|jsx)$/i;

/** Pattern matching D-series decision references in content. */
const D_SERIES_PATTERN = /\bD-\d{1,3}\b/;

// --- Factor Extraction ---

/**
 * Extract risk factors for a file based on its path and content.
 *
 * @param filePath - Absolute or relative file path.
 * @param dependencyCount - Number of files that import this file.
 * @param fileContent - Optional file content for D-series reference scanning.
 * @returns Extracted risk factors.
 */
export function extractRiskFactors(
  filePath: string,
  dependencyCount: number,
  fileContent?: string
): RiskFactors {
  const normalisedPath = filePath.replace(/\\/g, '/');

  return {
    isEngine: ENGINE_DIR_PATTERN.test(normalisedPath),
    isSafety: SAFETY_DIR_PATTERN.test(normalisedPath),
    importedByCount: dependencyCount,
    hasDSeriesRefs: fileContent ? D_SERIES_PATTERN.test(fileContent) : false,
    isTestFile: TEST_FILE_PATTERN.test(normalisedPath),
  };
}

/**
 * Identify which engine stages a file path relates to.
 *
 * @param filePath - File path to check.
 * @returns Array of engine names the file is associated with.
 */
function identifyCriticalEngines(filePath: string): string[] {
  const normalisedPath = filePath.replace(/\\/g, '/').toLowerCase();
  const engines: string[] = [];

  // Direct engine directory match
  const levelMatch = normalisedPath.match(/[/\\]l(\d)[/\\]/i);
  if (levelMatch) {
    const level = parseInt(levelMatch[1], 10);
    if (level >= 1 && level <= 7 && level <= PIPELINE_ENGINES.length) {
      engines.push(PIPELINE_ENGINES[level - 1]);
    }
  }

  // Name-based matching
  for (const engine of PIPELINE_ENGINES) {
    if (normalisedPath.includes(engine.toLowerCase())) {
      if (!engines.includes(engine)) {
        engines.push(engine);
      }
    }
  }

  // Safety files affect the full pipeline
  if (SAFETY_DIR_PATTERN.test(normalisedPath)) {
    engines.push('ALL (safety layer)');
  }

  // Connection files affect CADENCE/CIL
  if (/[/\\]connections[/\\]/i.test(normalisedPath)) {
    if (!engines.includes('CADENCE')) engines.push('CADENCE');
    if (!engines.includes('CIL')) engines.push('CIL');
  }

  // STRIDE-specific files
  if (/[/\\]stride[/\\]/i.test(normalisedPath)) {
    if (!engines.includes('STRIDE')) engines.push('STRIDE');
  }

  return engines;
}

// --- Scoring ---

/**
 * Classify a numeric score into a risk level.
 *
 * @param score - Numeric score 0–100.
 * @returns Risk level classification.
 */
function classifyRisk(score: number): RiskLevel {
  if (score >= THRESHOLDS.CRITICAL) return 'CRITICAL';
  if (score >= THRESHOLDS.HIGH) return 'HIGH';
  if (score >= THRESHOLDS.MEDIUM) return 'MEDIUM';
  return 'LOW';
}

/**
 * Build a human-readable reason string from risk factors.
 */
function buildReason(factors: RiskFactors, engines: string[]): string {
  const parts: string[] = [];

  if (factors.isTestFile) {
    return 'Test file — no regression risk.';
  }

  if (factors.isEngine) parts.push('engine file (L1–L9)');
  if (factors.isSafety) parts.push('safety-critical file');
  if (factors.importedByCount >= HIGH_IMPORT_THRESHOLD) {
    parts.push(`high fan-out (imported by ${factors.importedByCount} files)`);
  }
  if (factors.hasDSeriesRefs) parts.push('contains D-series decision references');

  if (engines.length > 0) {
    parts.push(`affects: ${engines.join(', ')}`);
  }

  return parts.length > 0 ? parts.join('; ') : 'Low criticality file.';
}

/**
 * Score the regression risk of a single file.
 *
 * @param filePath - Path to the file.
 * @param dependencyCount - Number of files that depend on this file.
 * @param enginePaths - Optional array of engine directory paths for context.
 * @param fileContent - Optional file content for D-series scanning.
 * @returns RiskScore for the file.
 */
export function scoreFileRisk(
  filePath: string,
  dependencyCount: number,
  enginePaths?: string[],
  fileContent?: string
): RiskScore {
  const factors = extractRiskFactors(filePath, dependencyCount, fileContent);
  const engines = identifyCriticalEngines(filePath);

  // Test files always score 0
  if (factors.isTestFile) {
    return {
      file: filePath,
      riskLevel: 'LOW',
      score: 0,
      dependentFiles: dependencyCount,
      enginesCritical: [],
      reason: 'Test file — no regression risk.',
    };
  }

  // Calculate score
  let score = 0;
  if (factors.isEngine) score += WEIGHTS.ENGINE;
  if (factors.isSafety) score += WEIGHTS.SAFETY;
  if (factors.importedByCount >= HIGH_IMPORT_THRESHOLD) score += WEIGHTS.HIGH_IMPORT;
  if (factors.hasDSeriesRefs) score += WEIGHTS.D_SERIES;

  // Cap at 100
  score = Math.min(score, 100);

  return {
    file: filePath,
    riskLevel: classifyRisk(score),
    score,
    dependentFiles: dependencyCount,
    enginesCritical: engines,
    reason: buildReason(factors, engines),
  };
}

/**
 * Score an entire changeset (multiple files) and return sorted risk scores.
 *
 * @param files - Array of changed file paths.
 * @param dependencyGraph - Dependency graph for the codebase.
 * @param fileContents - Optional map of file path to content for D-series scanning.
 * @returns Array of RiskScores, sorted by score descending.
 */
export function scoreChangeset(
  files: string[],
  dependencyGraph: DependencyGraph,
  fileContents?: Map<string, string>
): RiskScore[] {
  const scores: RiskScore[] = [];

  for (const filePath of files) {
    const dependents = dependencyGraph.dependents.get(filePath) || [];
    const content = fileContents?.get(filePath);

    scores.push(scoreFileRisk(filePath, dependents.length, undefined, content));
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  return scores;
}

/**
 * Filter scores to return only files at or above a risk threshold.
 *
 * @param scores - Array of RiskScores.
 * @param threshold - Minimum score to include (default 50 = HIGH).
 * @returns Filtered array of high-risk RiskScores.
 */
export function getHighRiskFiles(
  scores: RiskScore[],
  threshold: number = 50
): RiskScore[] {
  return scores.filter(s => s.score >= threshold);
}

// --- Report Generation ---

/**
 * Generate a markdown regression risk report.
 *
 * @param scores - Array of RiskScores (typically from scoreChangeset).
 * @returns Markdown string.
 */
export function generateRiskReport(scores: RiskScore[]): string {
  const lines: string[] = [
    `# Regression Risk Report`,
    `Generated by ${VM_BRAND.platform.descriptor} Content Studio`,
    '',
    `**Files analysed:** ${scores.length}`,
    `**Critical:** ${scores.filter(s => s.riskLevel === 'CRITICAL').length}`,
    `**High:** ${scores.filter(s => s.riskLevel === 'HIGH').length}`,
    `**Medium:** ${scores.filter(s => s.riskLevel === 'MEDIUM').length}`,
    `**Low:** ${scores.filter(s => s.riskLevel === 'LOW').length}`,
    '',
  ];

  const critical = scores.filter(s => s.riskLevel === 'CRITICAL');
  if (critical.length > 0) {
    lines.push('## CRITICAL Risk Files');
    lines.push('');
    for (const s of critical) {
      lines.push(`- **${s.file}** (score: ${s.score})`);
      lines.push(`  ${s.reason}`);
      lines.push(`  Dependents: ${s.dependentFiles} | Engines: ${s.enginesCritical.join(', ') || 'none'}`);
    }
    lines.push('');
  }

  const high = scores.filter(s => s.riskLevel === 'HIGH');
  if (high.length > 0) {
    lines.push('## HIGH Risk Files');
    lines.push('');
    for (const s of high) {
      lines.push(`- **${s.file}** (score: ${s.score})`);
      lines.push(`  ${s.reason}`);
    }
    lines.push('');
  }

  const medium = scores.filter(s => s.riskLevel === 'MEDIUM');
  if (medium.length > 0) {
    lines.push('## MEDIUM Risk Files');
    lines.push('');
    for (const s of medium) {
      lines.push(`- ${s.file} (score: ${s.score}) — ${s.reason}`);
    }
    lines.push('');
  }

  const low = scores.filter(s => s.riskLevel === 'LOW');
  if (low.length > 0) {
    lines.push('## LOW Risk Files');
    lines.push('');
    for (const s of low) {
      lines.push(`- ${s.file} (score: ${s.score})`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(`Pipeline: ${PIPELINE_ENGINES.join(' > ')}`);
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
