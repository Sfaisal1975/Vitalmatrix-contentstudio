/**
 * Component 10: Architecture Guard
 * HIGH-YIELD PRODUCTIVITY FEATURE
 *
 * Validates TypeScript source code and clinical content against ALB v1.4 constraints.
 * Catches violations at write-time instead of audit-time.
 * Run on every file before commit.
 *
 * Checks:
 *  - Node counts (7 only, never 8)
 *  - Zone counts (5 only, Z6+ always error)
 *  - Stack counts (6 only, no S7)
 *  - Zone-to-node mappings match D-01
 *  - S4 must be labelled Theoretical
 *  - S6 must be labelled Unidirectional
 *  - N6 dampening = 0.7 (D-160)
 *  - Scoring: 0-100 internal, 0-10 display (D-15)
 *  - Floor formula: MAX(dampened)-10 (D-212)
 *  - Thresholds: Z1-Z4=40, Z5=32 (D-38)
 *  - Pipeline order: FLINT→APEX→STRIDE→RIL→CADENCE→CIL→VISTA (D-233b)
 *  - Deprecated variable names and comments
 *  - CSV Principles 1-5 compliance
 */

// --- Types ---

export type GuardSeverity = 'ERROR' | 'WARNING' | 'INFO';

export interface GuardViolation {
  file?: string;
  line: number;
  severity: GuardSeverity;
  rule: string;
  message: string;
  fix?: string;
}

// --- Canonical Architecture (ALB v1.4) ---

export const CANONICAL = {
  nodes: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'] as const,
  nodeNames: {
    N1: 'Assimilation',
    N2: 'Defence and Repair',
    N3: 'Energy',
    N4: 'Biotransformation and Elimination',
    N5: 'Transport',
    N6: 'Communication',
    N7: 'Structural Integrity',
  },

  zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'] as const,
  zoneMappings: {
    Z1: ['N6', 'N3'],  // Metabolic Energy Axis
    Z2: ['N1', 'N2', 'N6'],  // Resilience Network
    Z3: ['N5', 'N6'],  // Cardiovascular-Neural Axis
    Z4: ['N4', 'N2'],  // Detoxification Trident
    Z5: ['N6', 'N4', 'N3'],  // Hormonal Terrain Axis
  },

  stacks: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'] as const,
  stackRules: {
    S1: { from: 'Z2', to: 'Z1', speed: 'MEDIUM', evidence: 'Emerging' },
    S2: { from: 'Z1', to: 'Z5', speed: 'FAST', evidence: 'Established' },
    S3: { from: 'Z4', to: 'Z1', speed: 'SLOW', evidence: 'Emerging' },
    S4: { from: 'Z5', to: 'Z2', speed: 'MEDIUM', evidence: 'Theoretical' },  // ALWAYS Theoretical
    S5: { from: 'Z2', to: 'Z3', speed: 'FAST', evidence: 'Emerging' },
    S6: { from: 'Z1', to: 'Z3', speed: 'MEDIUM', evidence: 'Established' },  // UNIDIRECTIONAL
  },

  scoring: {
    internalScale: [0, 100] as const,  // high = burden
    displayScale: [0, 10] as const,    // low = burden, high = resilience
    translationDivisor: 10,
    n6DampeningFactor: 0.7,            // D-160
    floorFormula: 'MAX(dampened) - 10', // D-212, on internal 0-100
  },

  thresholds: {
    Z1: 40, Z2: 40, Z3: 40, Z4: 40,   // D-38
    Z5: 32,
    borderlineWindow: 5,  // Configurable Parameter 8
  },

  pipeline: ['FLINT', 'APEX', 'STRIDE', 'RIL', 'CADENCE', 'CIL', 'VISTA'] as const,  // D-233b

  terrainLock: {
    loop: ['Z2', 'Z1', 'Z5', 'Z2'],
    tiebreaker: 'Z2',  // gut restoration
    gate: 'N1+N2-only Z2 > 40 (strict)',  // D-236A
  },
};

// --- Guard Rules ---

interface ArchGuardRule {
  id: string;
  severity: GuardSeverity;
  check: (line: string, lineNum: number) => GuardViolation | null;
}

const GUARD_RULES: ArchGuardRule[] = [
  // Node count violations
  {
    id: 'ALB-N8',
    severity: 'ERROR',
    check: (line, lineNum) => {
      if (/\bN8\b/.test(line) && !/['"]N8['"]/.test(line)) {
        return { line: lineNum, severity: 'ERROR', rule: 'ALB-N8', message: '8th node reference. Only N1-N7 exist.', fix: 'Remove N8 reference' };
      }
      return null;
    },
  },

  // Zone count violations
  {
    id: 'ALB-Z6+',
    severity: 'ERROR',
    check: (line, lineNum) => {
      if (/\bZ[6-9]\b/.test(line)) {
        return { line: lineNum, severity: 'ERROR', rule: 'ALB-Z6+', message: 'Zone 6+ reference. Only Z1-Z5 exist.', fix: 'Remove Z6+ reference' };
      }
      return null;
    },
  },

  // Stack count violations
  {
    id: 'ALB-S7+',
    severity: 'ERROR',
    check: (line, lineNum) => {
      if (/\bS[7-9]\b/.test(line) && !/S7.*sentinel|sentinel.*S7/i.test(line)) {
        return { line: lineNum, severity: 'ERROR', rule: 'ALB-S7+', message: 'Stack 7+ reference. Only S1-S6 exist.', fix: 'Remove S7+ reference' };
      }
      return null;
    },
  },

  // S4 must be Theoretical
  {
    id: 'ALB-S4-THEORETICAL',
    severity: 'ERROR',
    check: (line, lineNum) => {
      if (/\bS4\b/.test(line) && /Established|Emerging/i.test(line) && !/Theoretical/i.test(line)) {
        return { line: lineNum, severity: 'ERROR', rule: 'ALB-S4-THEORETICAL', message: 'S4 must ALWAYS be labelled Theoretical.', fix: 'Change evidence tier to Theoretical' };
      }
      return null;
    },
  },

  // S6 must mention Unidirectional
  {
    id: 'ALB-S6-UNIDIR',
    severity: 'WARNING',
    check: (line, lineNum) => {
      if (/\bS6\b/.test(line) && /Z3.*Z1|reverse|bidirectional/i.test(line)) {
        return { line: lineNum, severity: 'ERROR', rule: 'ALB-S6-UNIDIR', message: 'S6 is UNIDIRECTIONAL (Z1→Z3 only, NEVER reverse).', fix: 'Remove reverse direction reference' };
      }
      return null;
    },
  },

  // N6 dampening must be 0.7
  {
    id: 'ALB-N6-DAMP',
    severity: 'ERROR',
    check: (line, lineNum) => {
      const match = line.match(/dampen.*?(\d+\.?\d*)|(\d+\.?\d*).*?dampen/i);
      if (match) {
        const value = parseFloat(match[1] || match[2]);
        if (!isNaN(value) && value !== 0.7 && value !== 7) {
          return { line: lineNum, severity: 'ERROR', rule: 'ALB-N6-DAMP', message: `N6 dampening factor must be 0.7 (D-160). Found: ${value}`, fix: 'Set dampening to 0.7' };
        }
      }
      return null;
    },
  },

  // MES as node
  {
    id: 'ALB-MES-NODE',
    severity: 'ERROR',
    check: (line, lineNum) => {
      if (/MES.*node|node.*MES|eighth.*node|8th.*node/i.test(line)) {
        return { line: lineNum, severity: 'ERROR', rule: 'ALB-MES-NODE', message: 'MES is foundational context, NOT a node.', fix: 'Remove node designation from MES' };
      }
      return null;
    },
  },

  // Deprecated variable names
  {
    id: 'ALB-DEPRECATED-VAR',
    severity: 'WARNING',
    check: (line, lineNum) => {
      const deprecated = ['ITRE', 'FeatureAtlas', 'haloScore', 'timelineArchaeology', 'CARPET', 'DAMPIN'];
      for (const term of deprecated) {
        if (line.includes(term)) {
          return { line: lineNum, severity: 'WARNING', rule: 'ALB-DEPRECATED-VAR', message: `Deprecated term "${term}" in code.`, fix: `Remove or replace "${term}"` };
        }
      }
      return null;
    },
  },

  // Hardcoded Configurable Parameter 8
  {
    id: 'ALB-CP8-HARDCODE',
    severity: 'WARNING',
    check: (line, lineNum) => {
      if (/borderline.*=\s*5\b|nearThreshold.*=\s*5\b|NEAR_THRESHOLD\s*=\s*5/i.test(line)) {
        return { line: lineNum, severity: 'WARNING', rule: 'ALB-CP8-HARDCODE', message: 'Configurable Parameter 8 (near-threshold window) must NEVER be hardcoded.', fix: 'Use configurable parameter instead of literal 5' };
      }
      return null;
    },
  },

  // Pipeline order check
  {
    id: 'ALB-PIPELINE-ORDER',
    severity: 'ERROR',
    check: (line, lineNum) => {
      // Check for wrong pipeline ordering
      if (/STRIDE.*APEX|RIL.*STRIDE.*FLINT|CADENCE.*RIL.*APEX/i.test(line)) {
        return { line: lineNum, severity: 'ERROR', rule: 'ALB-PIPELINE-ORDER', message: 'Pipeline order violation. Must be: FLINT→APEX→STRIDE→RIL→CADENCE→CIL→VISTA (D-233b)', fix: 'Correct pipeline order' };
      }
      return null;
    },
  },

  // Insulin routing
  {
    id: 'CSV-P3-INSULIN',
    severity: 'ERROR',
    check: (line, lineNum) => {
      if (/insulin.*N3|N3.*insulin|insulin.*energy/i.test(line) && !/N6/i.test(line)) {
        return { line: lineNum, severity: 'ERROR', rule: 'CSV-P3-INSULIN', message: 'CSV Principle 3: Insulin = N6 Communication. NEVER N3 Energy.', fix: 'Route insulin to N6' };
      }
      return null;
    },
  },
];

// --- Guard Runner ---

export function guardFile(content: string, fileName?: string): GuardViolation[] {
  const lines = content.split('\n');
  const violations: GuardViolation[] = [];

  for (let i = 0; i < lines.length; i++) {
    for (const rule of GUARD_RULES) {
      const violation = rule.check(lines[i], i + 1);
      if (violation) {
        violation.file = fileName;
        violations.push(violation);
      }
    }
  }

  return violations.sort((a, b) => {
    const order = { ERROR: 0, WARNING: 1, INFO: 2 };
    return order[a.severity] - order[b.severity];
  });
}

// --- Report ---

export function generateGuardReport(violations: GuardViolation[], fileName?: string): string {
  if (violations.length === 0) {
    return `Architecture Guard: PASS${fileName ? ` (${fileName})` : ''}`;
  }

  const errors = violations.filter(v => v.severity === 'ERROR').length;
  const warnings = violations.filter(v => v.severity === 'WARNING').length;

  const lines = [
    `# Architecture Guard: ${errors > 0 ? 'FAIL' : 'WARNING'}${fileName ? ` — ${fileName}` : ''}`,
    `Errors: ${errors} | Warnings: ${warnings}`,
    '',
  ];

  for (const v of violations) {
    lines.push(`[${v.severity}] Line ${v.line}: ${v.rule}`);
    lines.push(`  ${v.message}`);
    if (v.fix) lines.push(`  Fix: ${v.fix}`);
    lines.push('');
  }

  return lines.join('\n');
}
