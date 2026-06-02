/**
 * Component 22D: Feature Phase Guard
 * DEV PACKAGE — Internal tooling only
 *
 * Hard gate preventing Phase 2 feature builds from entering the codebase.
 * Enforces three rules:
 *   1. VECTOR (mnemonic #30) is reserved Phase 2 — HARD BLOCK on any build attempt.
 *   2. Phase 2/3 feature references (F201–F999) must not be presented as buildable.
 *   3. HHW and The Performance Code are PAUSED — no active build references.
 *
 * Any VECTOR build attempt triggers an immediate HARD BLOCK.
 * HHW/Performance Code violations are WARNING-level unless they contain
 * build-active language, in which case they escalate to BLOCK.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Result of a phase compliance check. */
export interface PhaseGuardResult {
  /** Whether the scanned files are phase-compliant. */
  allowed: boolean;
  /** Individual violations found. */
  violations: PhaseViolation[];
}

/** A single phase violation. */
export interface PhaseViolation {
  /** File where the violation was found. */
  file: string;
  /** Line number (1-based). */
  line: number;
  /** Feature or project name triggering the violation. */
  feature: string;
  /** Human-readable reason for the violation. */
  reason: string;
}

/** Severity classification. */
export type ViolationSeverity = 'HARD_BLOCK' | 'BLOCK' | 'WARNING';

/** Extended violation with severity for internal processing. */
interface ClassifiedViolation extends PhaseViolation {
  severity: ViolationSeverity;
}

// --- Constants ---

/** Phase 2 reserved features — NEVER build in Phase 1. */
export const PHASE_2_RESERVED: readonly string[] = [
  'VECTOR',
] as const;

/** Regex patterns matching Phase 2/3 feature ID ranges. */
const PHASE_2_FEATURE_RANGE = /\bF[2-9]\d{2}\b/;

/** Paused projects — no active build references allowed. */
export const PAUSED_PROJECTS: readonly string[] = [
  'HHW',
  'Health Horizon Wellness',
  'The Performance Code',
] as const;

/**
 * Patterns indicating active build intent (not mere reference/history).
 * If a paused project name appears near these, it escalates to BLOCK.
 */
const BUILD_ACTIVE_PATTERNS = [
  /\bimport\b.*\bfrom\b/,
  /\bexport\b\s+(function|class|const|interface|type)\b/,
  /\bnew\s+\w*HHW\w*/i,
  /\bnew\s+\w*PerformanceCode\w*/i,
  /\bBUILT\b/,
  /\bIMPLEMENTED\b/,
  /\bfunction\s+\w*(vector|hhw|performanceCode)\w*/i,
  /\bclass\s+\w*(Vector|HHW|PerformanceCode)\w*/i,
];

/**
 * Patterns for VECTOR build attempts.
 * These include function/class definitions, imports, and instantiation.
 */
const VECTOR_BUILD_PATTERNS = [
  /\bfunction\s+\w*[Vv]ector\w*\s*\(/,
  /\bclass\s+\w*Vector\w*/,
  /\bconst\s+\w*[Vv]ector\w*\s*=/,
  /\blet\s+\w*[Vv]ector\w*\s*=/,
  /\bexport\s+.*\bVector\b/,
  /\bnew\s+\w*Vector\w*\(/,
  /\bimport\b.*\bVector\b.*\bfrom\b/,
  /\bimport\b.*\bfrom\b.*vector/i,
  /\bVECTOR\b.*\bBUILT\b/,
  /\bBUILT\b.*\bVECTOR\b/,
  /\bVECTOR\b.*(?:engine|module|feature|component|service)\b/i,
];

/**
 * Allowlist: VECTOR references that are NOT build attempts.
 * These include references in comments about Phase 2 planning,
 * TM footer listings, and phase guard code itself.
 */
const VECTOR_ALLOWLIST_PATTERNS = [
  /phase\s*2\s*reserved/i,
  /tmFooter/,
  /PHASE_2_RESERVED/,
  /paused|deferred|reserved|planned|future/i,
  /\/\/.*VECTOR.*reserved/i,
  /\/\/.*VECTOR.*Phase\s*2/i,
  /VECTOR.*trademark/i,
  /VECTOR\u2122/,
];

// --- File Input ---

/** Input file descriptor. */
export interface FileInput {
  path: string;
  content: string;
}

// --- Core Scanner ---

/**
 * Check a set of files for phase compliance.
 * Scans for VECTOR build attempts, Phase 2/3 feature references,
 * and HHW/Performance Code active build references.
 *
 * @param files - Array of file inputs to scan.
 * @returns PhaseGuardResult indicating compliance status and violations.
 */
export function checkPhaseCompliance(files: FileInput[]): PhaseGuardResult {
  const allViolations: ClassifiedViolation[] = [];

  for (const file of files) {
    const lines = file.content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // 1. VECTOR build attempts — HARD BLOCK
      checkVectorViolations(file.path, line, lineNum, allViolations);

      // 2. Phase 2/3 feature range references
      checkPhaseRangeViolations(file.path, line, lineNum, allViolations);

      // 3. Paused project references
      checkPausedProjectViolations(file.path, line, lineNum, allViolations);
    }
  }

  const hasBlock = allViolations.some(
    v => v.severity === 'HARD_BLOCK' || v.severity === 'BLOCK'
  );

  return {
    allowed: !hasBlock,
    violations: allViolations.map(({ severity, ...rest }) => rest),
  };
}

/**
 * Check a line for VECTOR build attempts.
 */
function checkVectorViolations(
  filePath: string,
  line: string,
  lineNum: number,
  violations: ClassifiedViolation[]
): void {
  // Skip if line does not mention VECTOR at all
  if (!/vector/i.test(line)) return;

  // Check allowlist first
  for (const pattern of VECTOR_ALLOWLIST_PATTERNS) {
    if (pattern.test(line)) return;
  }

  // Check for build patterns
  for (const pattern of VECTOR_BUILD_PATTERNS) {
    if (pattern.test(line)) {
      violations.push({
        file: filePath,
        line: lineNum,
        feature: 'VECTOR',
        reason: 'HARD BLOCK: VECTOR is reserved Phase 2. No build attempts permitted.',
        severity: 'HARD_BLOCK',
      });
      return; // One violation per line is sufficient
    }
  }
}

/**
 * Check a line for Phase 2/3 feature range references (F201–F999).
 */
function checkPhaseRangeViolations(
  filePath: string,
  line: string,
  lineNum: number,
  violations: ClassifiedViolation[]
): void {
  const match = PHASE_2_FEATURE_RANGE.exec(line);
  if (!match) return;

  // Allow if clearly marked as future/planned
  if (/reserved|planned|future|phase\s*[23]/i.test(line)) return;

  // Allow if in a comment only
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;

  violations.push({
    file: filePath,
    line: lineNum,
    feature: match[0],
    reason: `Phase 2/3 feature reference ${match[0]} detected in active code. Only F001–F200 are Phase 1.`,
    severity: 'BLOCK',
  });
}

/**
 * Check a line for paused project references.
 */
function checkPausedProjectViolations(
  filePath: string,
  line: string,
  lineNum: number,
  violations: ClassifiedViolation[]
): void {
  for (const project of PAUSED_PROJECTS) {
    if (!line.includes(project)) continue;

    // Check if paused/historical reference (allowed)
    if (/paused|deprecated|removed|historical|was\s+/i.test(line)) continue;

    // Check if this is in the brand config kill list or comment
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    // Check for active build patterns (escalate to BLOCK)
    const isActiveBuild = BUILD_ACTIVE_PATTERNS.some(p => p.test(line));

    violations.push({
      file: filePath,
      line: lineNum,
      feature: project,
      reason: isActiveBuild
        ? `BLOCK: Active build code references paused project "${project}". HHW and The Performance Code are PAUSED.`
        : `WARNING: Reference to paused project "${project}". Verify this is not an active build.`,
      severity: isActiveBuild ? 'BLOCK' : 'WARNING',
    });
  }
}

// --- Report Generation ---

/**
 * Generate a markdown phase guard report.
 *
 * @param result - PhaseGuardResult to format.
 * @returns Markdown string.
 */
export function generatePhaseGuardReport(result: PhaseGuardResult): string {
  const lines: string[] = [
    `# Phase Guard Report`,
    `Generated by ${VM_BRAND.platform.descriptor} Content Studio`,
    '',
    `**Status:** ${result.allowed ? 'COMPLIANT' : 'BLOCKED'}`,
    `**Violations:** ${result.violations.length}`,
    '',
  ];

  if (result.violations.length === 0) {
    lines.push('No phase violations detected. All code is Phase 1 compliant.');
    lines.push('');
  } else {
    // Group by feature
    const grouped = new Map<string, PhaseViolation[]>();
    for (const v of result.violations) {
      const existing = grouped.get(v.feature) || [];
      existing.push(v);
      grouped.set(v.feature, existing);
    }

    for (const [feature, violations] of grouped) {
      lines.push(`## ${feature}`);
      lines.push('');
      for (const v of violations) {
        lines.push(`- **${v.file}:${v.line}** — ${v.reason}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push(`Phase 1 active features: F001–F200. Phase 2 reserved: VECTOR, F201+.`);
  lines.push(`Paused projects: ${PAUSED_PROJECTS.join(', ')}.`);
  lines.push('');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
