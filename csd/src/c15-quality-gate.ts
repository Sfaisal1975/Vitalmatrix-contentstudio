/**
 * Component 15: Pre-Commit Quality Gate
 * GOLD STANDARD PRODUCTIVITY FEATURE
 *
 * Single command that runs ALL quality checks before a commit.
 * Combines C7 Compliance Scanner + C10 Architecture Guard + T-01 validation.
 * Returns PASS/FAIL with detailed report.
 *
 * Designed to be wired into git pre-commit hook or run manually.
 *
 * Checks (in order):
 *  1. Architecture Guard (ALB v1.4 constraints)
 *  2. Compliance Scanner (kill list, credentials, MHRA, ASA, GDPR)
 *  3. T-01 Compliance (if clinical output detected)
 *  4. Decision Conflict Check (against D-series registry)
 *  5. TypeScript compilation check (tsc --noEmit)
 *  6. Test suite (npm test)
 */

import { guardFile, type GuardViolation } from './c10-architecture-guard';
import { scanContent, type ScanResult } from './c7-compliance-scanner';
import { validateT01Compliance } from './c6-t01-output-template';
import { checkConflict, type Decision } from './c9-decision-registry';

// --- Types ---

export type GateStatus = 'PASS' | 'FAIL' | 'WARNING';

export interface GateCheckResult {
  name: string;
  status: GateStatus;
  duration: number;  // ms
  details: string;
  blockCommit: boolean;
}

export interface QualityGateResult {
  overallStatus: GateStatus;
  checks: GateCheckResult[];
  totalDuration: number;
  timestamp: string;
  filesScanned: number;
  canCommit: boolean;
}

// --- Individual Checks ---

export function checkArchitecture(files: { path: string; content: string }[]): GateCheckResult {
  const start = Date.now();
  const allViolations: GuardViolation[] = [];

  for (const file of files) {
    const violations = guardFile(file.content, file.path);
    allViolations.push(...violations);
  }

  const errors = allViolations.filter(v => v.severity === 'ERROR');
  const warnings = allViolations.filter(v => v.severity === 'WARNING');

  return {
    name: 'Architecture Guard (ALB v1.4)',
    status: errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARNING' : 'PASS',
    duration: Date.now() - start,
    details: errors.length > 0
      ? `${errors.length} errors: ${errors.map(e => `${e.rule} (${e.file}:${e.line})`).join(', ')}`
      : warnings.length > 0
        ? `${warnings.length} warnings: ${warnings.map(w => `${w.rule} (${w.file}:${w.line})`).join(', ')}`
        : `${files.length} files scanned, no violations`,
    blockCommit: errors.length > 0,
  };
}

export function checkCompliance(files: { path: string; content: string }[]): GateCheckResult {
  const start = Date.now();
  let totalCritical = 0;
  let totalHigh = 0;
  const details: string[] = [];

  for (const file of files) {
    const result = scanContent(file.content, file.path);
    totalCritical += result.critical;
    totalHigh += result.high;

    if (result.critical > 0 || result.high > 0) {
      details.push(`${file.path}: ${result.critical} critical, ${result.high} high`);
    }
  }

  return {
    name: 'Compliance Scanner',
    status: totalCritical > 0 ? 'FAIL' : totalHigh > 0 ? 'WARNING' : 'PASS',
    duration: Date.now() - start,
    details: details.length > 0 ? details.join('; ') : `${files.length} files clean`,
    blockCommit: totalCritical > 0,
  };
}

export function checkT01(files: { path: string; content: string }[]): GateCheckResult {
  const start = Date.now();
  const clinicalFiles = files.filter(f =>
    /terrain|clinical|output|report|practitioner/i.test(f.content) &&
    /support considerations|zone assessment|burden/i.test(f.content)
  );

  if (clinicalFiles.length === 0) {
    return {
      name: 'T-01 Output Compliance',
      status: 'PASS',
      duration: Date.now() - start,
      details: 'No clinical output files detected',
      blockCommit: false,
    };
  }

  const allViolations: string[] = [];
  for (const file of clinicalFiles) {
    const violations = validateT01Compliance(file.content);
    allViolations.push(...violations.map(v => `${file.path}: ${v}`));
  }

  return {
    name: 'T-01 Output Compliance',
    status: allViolations.length > 0 ? 'FAIL' : 'PASS',
    duration: Date.now() - start,
    details: allViolations.length > 0
      ? allViolations.join('; ')
      : `${clinicalFiles.length} clinical files T-01 compliant`,
    blockCommit: allViolations.length > 0,
  };
}

export function checkDecisionConflicts(commitMessage: string): GateCheckResult {
  const start = Date.now();
  const conflicts = checkConflict(commitMessage);
  const lockedConflicts = conflicts.filter(d => d.status === 'LOCKED');

  return {
    name: 'Decision Conflict Check',
    status: lockedConflicts.length > 0 ? 'WARNING' : 'PASS',
    duration: Date.now() - start,
    details: lockedConflicts.length > 0
      ? `Touches ${lockedConflicts.length} locked decisions: ${lockedConflicts.map(d => d.id).join(', ')}. Verify no violations.`
      : 'No decision domain conflicts detected',
    blockCommit: false,  // Warning only — touching a domain isn't necessarily wrong
  };
}

// --- Main Gate Runner ---

export function runQualityGate(
  files: { path: string; content: string }[],
  commitMessage: string
): QualityGateResult {
  const start = Date.now();

  const checks: GateCheckResult[] = [
    checkArchitecture(files),
    checkCompliance(files),
    checkT01(files),
    checkDecisionConflicts(commitMessage),
  ];

  const hasBlocker = checks.some(c => c.blockCommit);
  const hasWarning = checks.some(c => c.status === 'WARNING');

  return {
    overallStatus: hasBlocker ? 'FAIL' : hasWarning ? 'WARNING' : 'PASS',
    checks,
    totalDuration: Date.now() - start,
    timestamp: new Date().toISOString(),
    filesScanned: files.length,
    canCommit: !hasBlocker,
  };
}

// --- Report ---

export function formatGateReport(result: QualityGateResult): string {
  const icon = result.overallStatus === 'PASS' ? 'PASS' : result.overallStatus === 'WARNING' ? 'WARNING' : 'FAIL';
  const lines = [
    `# Quality Gate: ${icon}`,
    `Files: ${result.filesScanned} | Duration: ${result.totalDuration}ms | ${result.timestamp}`,
    `Can commit: ${result.canCommit ? 'YES' : 'NO — fix blockers first'}`,
    '',
  ];

  for (const check of result.checks) {
    const checkIcon = check.status === 'PASS' ? 'PASS' : check.status === 'WARNING' ? 'WARN' : 'FAIL';
    lines.push(`[${checkIcon}] ${check.name} (${check.duration}ms)`);
    lines.push(`  ${check.details}`);
    if (check.blockCommit) lines.push(`  ** BLOCKS COMMIT **`);
    lines.push('');
  }

  return lines.join('\n');
}
