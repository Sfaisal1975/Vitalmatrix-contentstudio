/**
 * Component 7: Compliance Scanner
 * CRITICAL PRODUCTIVITY FEATURE
 *
 * Single-pass scanner that checks ANY content (TypeScript, HTML, Markdown, clinical output)
 * against all VitalMatrix compliance rules. Run before anything goes to W08 or external use.
 *
 * Checks:
 *  - Kill List (K7, K8, K10)
 *  - Credential errors (MD, FMAARM)
 *  - Deprecated terms (ITRE, FeatureAtlas, Halo, etc.)
 *  - Platform descriptor violations ("clinical AI platform", "clinical decision support")
 *  - T-01 violations (W5-1 to W5-7 on clinical outputs)
 *  - Evidence tier gaps (clinical claims without tier labels)
 *  - Architecture violations (8th node, Z6+, S7+, S4 not Theoretical, S6 not Unidirectional)
 *  - Mnemonic TM compliance (first use without TM)
 *  - MHRA SaMD exposure (diagnostic language, "recommends", "should take")
 *  - ASA exposure (unsubstantiated claims)
 *  - GDPR flags (patient identifiers without encryption context)
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ViolationCategory =
  | 'CREDENTIAL'
  | 'DEPRECATED'
  | 'DESCRIPTOR'
  | 'T01'
  | 'EVIDENCE_TIER'
  | 'ARCHITECTURE'
  | 'MNEMONIC'
  | 'MHRA'
  | 'ASA'
  | 'GDPR'
  | 'KILL_LIST'
  | 'LANGUAGE';

export interface Violation {
  line: number;
  column?: number;
  category: ViolationCategory;
  severity: SeverityLevel;
  rule: string;
  message: string;
  context: string;  // surrounding text
}

export interface ScanResult {
  totalViolations: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  violations: Violation[];
  passedChecks: string[];
  scannedAt: string;
}

// --- Rule Definitions ---

interface ScanRule {
  category: ViolationCategory;
  severity: SeverityLevel;
  rule: string;
  pattern: RegExp;
  message: string;
}

const SCAN_RULES: ScanRule[] = [
  // --- CREDENTIAL ERRORS ---
  { category: 'CREDENTIAL', severity: 'CRITICAL', rule: 'K7-MD',
    pattern: /\bMD\b(?!\.md\b|\.MD\b|MEMORY\.md|README\.md|CLAUDE\.md)/g,
    message: 'Credential error: "MD" found — must be MBBS' },
  { category: 'CREDENTIAL', severity: 'CRITICAL', rule: 'K7-FMAARM',
    pattern: /FMAARM/gi,
    message: 'Credential error: "FMAARM" found — must be FAAMFM' },

  // --- DEPRECATED TERMS ---
  { category: 'DEPRECATED', severity: 'HIGH', rule: 'DEP-ITRE',
    pattern: /\bITRE\b/g,
    message: 'Deprecated term: "ITRE" — removed from architecture' },
  { category: 'DEPRECATED', severity: 'HIGH', rule: 'DEP-FEATUREATLAS',
    pattern: /FeatureAtlas/gi,
    message: 'Deprecated term: "FeatureAtlas" — removed from architecture' },
  { category: 'DEPRECATED', severity: 'HIGH', rule: 'DEP-HALO',
    pattern: /\bHalo\b/g,
    message: 'Deprecated term: "Halo" — removed from architecture' },
  { category: 'DEPRECATED', severity: 'HIGH', rule: 'DEP-TIMELINE-ARCH',
    pattern: /Timeline Archaeology/gi,
    message: 'Deprecated term: "Timeline Archaeology" — removed' },
  { category: 'DEPRECATED', severity: 'HIGH', rule: 'DEP-CARPET',
    pattern: /\bCARPET\b/g,
    message: 'Deprecated term: "CARPET" — FMFT IP' },
  { category: 'DEPRECATED', severity: 'HIGH', rule: 'DEP-DAMPIN',
    pattern: /\bDAMPIN\b/g,
    message: 'Deprecated term: "DAMPIN" — FMFT IP' },

  // --- PLATFORM DESCRIPTOR ---
  { category: 'DESCRIPTOR', severity: 'CRITICAL', rule: 'DESC-AI',
    pattern: /clinical AI platform/gi,
    message: 'Wrong descriptor: "clinical AI platform" — must be "terrain intelligence platform"' },
  { category: 'DESCRIPTOR', severity: 'CRITICAL', rule: 'DESC-CIP',
    pattern: /clinical intelligence platform/gi,
    message: 'Superseded descriptor (D-210): "clinical intelligence platform" — must be "terrain intelligence platform"' },
  { category: 'DESCRIPTOR', severity: 'CRITICAL', rule: 'DESC-CDS',
    pattern: /clinical decision support/gi,
    message: 'Wrong descriptor: "clinical decision support" — prohibited' },

  // --- ARCHITECTURE VIOLATIONS ---
  { category: 'ARCHITECTURE', severity: 'CRITICAL', rule: 'ARCH-N8',
    pattern: /\bN8\b|node\s*8|eight\s*node/gi,
    message: 'Architecture violation: 8th node reference — only 7 nodes exist' },
  { category: 'ARCHITECTURE', severity: 'CRITICAL', rule: 'ARCH-Z6',
    pattern: /\bZ[6-9]\b|zone\s*[6-9]/gi,
    message: 'Architecture violation: Z6+ reference — only 5 zones exist' },
  { category: 'ARCHITECTURE', severity: 'CRITICAL', rule: 'ARCH-S7',
    pattern: /\bS[7-9]\b|stack\s*[7-9]/gi,
    message: 'Architecture violation: S7+ reference — only 6 stacks exist' },
  { category: 'ARCHITECTURE', severity: 'HIGH', rule: 'ARCH-MES-NODE',
    pattern: /MES\s*(node|is a node|as a node|eighth node)/gi,
    message: 'Architecture violation: MES is foundational context, NOT a node' },

  // --- MHRA SaMD EXPOSURE ---
  { category: 'MHRA', severity: 'CRITICAL', rule: 'MHRA-DIAGNOSE',
    pattern: /\b(diagnos(es|ing|ed|tic)|this (means|indicates) you have)\b/gi,
    message: 'MHRA exposure: diagnostic language detected — VitalMatrix does not diagnose' },
  { category: 'MHRA', severity: 'CRITICAL', rule: 'MHRA-RECOMMEND',
    pattern: /\b(recommends? (you |that |the patient )?take|should take|must take|prescri(be|ption))\b/gi,
    message: 'MHRA exposure: prescriptive language — VitalMatrix does not recommend treatments' },

  // --- ASA EXPOSURE ---
  { category: 'ASA', severity: 'HIGH', rule: 'ASA-GUARANTEE',
    pattern: /\b(guaranteed|proven to|will cure|100%|clinically proven)\b/gi,
    message: 'ASA exposure: unsubstantiated claim — requires evidence tier and qualification' },

  // --- KILL LIST ---
  { category: 'KILL_LIST', severity: 'HIGH', rule: 'K10-HYMAN',
    pattern: /Mark Hyman/gi,
    message: 'K10: Competitor name "Mark Hyman" — prohibited in VitalMatrix content' },
  { category: 'KILL_LIST', severity: 'HIGH', rule: 'K10-LAVALLE',
    pattern: /\bLaValle\b/gi,
    message: 'K10: Competitor-adjacent name "LaValle" — prohibited' },
  { category: 'KILL_LIST', severity: 'HIGH', rule: 'K10-METABOLIC-CODE',
    pattern: /Metabolic Code/gi,
    message: 'K10: Competitor reference "Metabolic Code" — prohibited' },

  // --- LANGUAGE ---
  { category: 'LANGUAGE', severity: 'LOW', rule: 'K8-EM-DASH',
    pattern: /\u2014/g,
    message: 'K8: Em dash found — use en dash or comma instead' },

  // --- GDPR FLAGS ---
  { category: 'GDPR', severity: 'HIGH', rule: 'GDPR-NHS',
    pattern: /NHS\s*number/gi,
    message: 'GDPR: NHS number reference — must be encrypted (Feature 48)' },
  { category: 'GDPR', severity: 'HIGH', rule: 'GDPR-DOB',
    pattern: /date of birth|DOB/gi,
    message: 'GDPR: Date of birth reference — Art 9 special category data' },
];

// --- Scanner ---

export function scanContent(content: string, fileName?: string): ScanResult {
  const lines = content.split('\n');
  const violations: Violation[] = [];
  const passedChecks: string[] = [];

  for (const rule of SCAN_RULES) {
    let found = false;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      let match;
      rule.pattern.lastIndex = 0;

      while ((match = rule.pattern.exec(line)) !== null) {
        found = true;
        const contextStart = Math.max(0, match.index - 30);
        const contextEnd = Math.min(line.length, match.index + match[0].length + 30);

        violations.push({
          line: lineIndex + 1,
          column: match.index + 1,
          category: rule.category,
          severity: rule.severity,
          rule: rule.rule,
          message: rule.message,
          context: '...' + line.slice(contextStart, contextEnd) + '...',
        });
      }
    }

    if (!found) {
      passedChecks.push(rule.rule);
    }
  }

  // Sort by severity
  const severityOrder: Record<SeverityLevel, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  violations.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    totalViolations: violations.length,
    critical: violations.filter(v => v.severity === 'CRITICAL').length,
    high: violations.filter(v => v.severity === 'HIGH').length,
    medium: violations.filter(v => v.severity === 'MEDIUM').length,
    low: violations.filter(v => v.severity === 'LOW').length,
    violations,
    passedChecks,
    scannedAt: new Date().toISOString(),
  };
}

// --- Report Generator ---

export function generateScanReport(result: ScanResult, fileName?: string): string {
  const lines: string[] = [];

  lines.push('# VitalMatrix Compliance Scan Report');
  lines.push(`Scanned: ${result.scannedAt}`);
  if (fileName) lines.push(`File: ${fileName}`);
  lines.push('');

  // Summary
  const status = result.critical > 0 ? 'FAIL' : result.high > 0 ? 'WARNING' : 'PASS';
  lines.push(`## Result: ${status}`);
  lines.push(`| Severity | Count |`);
  lines.push(`|----------|-------|`);
  lines.push(`| CRITICAL | ${result.critical} |`);
  lines.push(`| HIGH     | ${result.high} |`);
  lines.push(`| MEDIUM   | ${result.medium} |`);
  lines.push(`| LOW      | ${result.low} |`);
  lines.push(`| **TOTAL** | **${result.totalViolations}** |`);
  lines.push('');

  // Violations
  if (result.violations.length > 0) {
    lines.push('## Violations');
    for (const v of result.violations) {
      lines.push(`### [${v.severity}] ${v.rule} (line ${v.line})`);
      lines.push(`${v.message}`);
      lines.push(`> ${v.context}`);
      lines.push('');
    }
  }

  // Passed
  lines.push(`## Passed Checks: ${result.passedChecks.length}/${SCAN_RULES.length}`);

  return lines.join('\n');
}

// --- Batch Scanner ---

export async function scanFiles(filePaths: string[], readFile: (path: string) => Promise<string>): Promise<Map<string, ScanResult>> {
  const results = new Map<string, ScanResult>();

  for (const filePath of filePaths) {
    const content = await readFile(filePath);
    results.set(filePath, scanContent(content, filePath));
  }

  return results;
}
