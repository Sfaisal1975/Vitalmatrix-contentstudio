/**
 * C30D — Code Review Checklist
 * VitalMatrix Content Studio Dev
 *
 * Generates per-file and batch review checklists based on what changed.
 * Checklist items are selected based on the file location within the
 * VitalMatrix engine architecture (l1–l9 layers, safety/, connections/,
 * intake-features/, test files) and always include universal compliance
 * checks for the 7-node, 5-zone, 6-stack architecture.
 *
 * @module c30d-code-review-checklist
 */

import { VM_BRAND } from './brand-config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Review checklist categories. */
export type ChecklistCategory =
  | 'architecture'
  | 'compliance'
  | 'clinical'
  | 'testing'
  | 'documentation';

/** A single checklist item. */
export interface ChecklistItem {
  readonly check: string;
  readonly required: boolean;
  readonly category: ChecklistCategory;
}

/** Checklist scoped to a single file. */
export interface FileChecklist {
  readonly file: string;
  readonly items: ChecklistItem[];
}

/* ------------------------------------------------------------------ */
/*  Universal checks                                                   */
/* ------------------------------------------------------------------ */

/** Applied to every file regardless of location. */
const UNIVERSAL_CHECKS: ChecklistItem[] = [
  {
    check: 'No N8/Z6+/S7+ references — only N1–N7, Z1–Z5, S1–S6 permitted',
    required: true,
    category: 'architecture',
  },
  {
    check: `Credentials are ${VM_BRAND.credentials.qualifications} only — never MD, never FMAARM`,
    required: true,
    category: 'compliance',
  },
  {
    check: 'Evidence tier specified on all clinical claims (Established / Emerging / Theoretical / Observed in Practice / Contested)',
    required: true,
    category: 'clinical',
  },
  {
    check: 'British English throughout — no em dashes',
    required: true,
    category: 'compliance',
  },
];

/* ------------------------------------------------------------------ */
/*  Engine layer checks (l1–l9)                                        */
/* ------------------------------------------------------------------ */

const ENGINE_CHECKS: ChecklistItem[] = [
  {
    check: 'Architecture: layer boundaries respected (ALB v1.4 locked)',
    required: true,
    category: 'architecture',
  },
  {
    check: 'Scoring 0–100 internal range enforced',
    required: true,
    category: 'architecture',
  },
  {
    check: 'D-212 scoring rule: MAX(dampened)-10 applied correctly',
    required: true,
    category: 'architecture',
  },
  {
    check: 'Pipeline order matches D-233b: FLINT->APEX->STRIDE->RIL->CADENCE->CIL->VISTA',
    required: true,
    category: 'architecture',
  },
  {
    check: 'N6 dampening factor is 0.7',
    required: true,
    category: 'architecture',
  },
  {
    check: 'Clinical logic has evidence tier annotation',
    required: true,
    category: 'clinical',
  },
  {
    check: 'No deprecated terms (check project architecture lock)',
    required: false,
    category: 'compliance',
  },
];

/* ------------------------------------------------------------------ */
/*  Safety / compliance checks                                         */
/* ------------------------------------------------------------------ */

const SAFETY_CHECKS: ChecklistItem[] = [
  {
    check: 'Regulatory footer present on all clinical outputs',
    required: true,
    category: 'compliance',
  },
  {
    check: 'T-01 output restrictions verified (W5-1 to W5-7)',
    required: true,
    category: 'compliance',
  },
  {
    check: 'W5-3/W5-4 PERMANENT + BUILT constraints upheld',
    required: true,
    category: 'compliance',
  },
  {
    check: `Platform descriptor is "${VM_BRAND.platform.descriptor}" only — never "clinical AI platform"`,
    required: true,
    category: 'compliance',
  },
  {
    check: 'SA Override (Class I) rules checked if applicable',
    required: false,
    category: 'compliance',
  },
  {
    check: `Audience is ${VM_BRAND.platform.audience} — B2B only, never patient-facing`,
    required: true,
    category: 'clinical',
  },
];

/* ------------------------------------------------------------------ */
/*  Connections checks                                                 */
/* ------------------------------------------------------------------ */

const CONNECTIONS_CHECKS: ChecklistItem[] = [
  {
    check: 'Connection names match W26 authoritative list',
    required: true,
    category: 'architecture',
  },
  {
    check: 'Dimension mappings are correct per connection spec',
    required: true,
    category: 'architecture',
  },
  {
    check: 'Evidence tier tagged on clinical claims within connections',
    required: true,
    category: 'clinical',
  },
  {
    check: 'No cross-zone leakage — connection stays within declared zones',
    required: true,
    category: 'architecture',
  },
];

/* ------------------------------------------------------------------ */
/*  Intake feature checks                                              */
/* ------------------------------------------------------------------ */

const INTAKE_CHECKS: ChecklistItem[] = [
  {
    check: 'Clinical: INTAKE feature spec matches v3.5 analysis (180 features, 16 angles)',
    required: true,
    category: 'clinical',
  },
  {
    check: 'D-193 age gate logic verified',
    required: false,
    category: 'clinical',
  },
  {
    check: 'T-01 clinical output check — no raw scores exposed to practitioner',
    required: true,
    category: 'clinical',
  },
  {
    check: 'Feature has corresponding test coverage',
    required: true,
    category: 'testing',
  },
  {
    check: 'Form validation logic matches 502-item intake specification',
    required: false,
    category: 'clinical',
  },
];

/* ------------------------------------------------------------------ */
/*  Test file checks                                                   */
/* ------------------------------------------------------------------ */

const TEST_CHECKS: ChecklistItem[] = [
  {
    check: 'Test coverage: new/modified code has adequate test coverage',
    required: true,
    category: 'testing',
  },
  {
    check: 'No test-only workarounds that mask production issues',
    required: true,
    category: 'testing',
  },
  {
    check: 'Test assertions match D-series decision thresholds',
    required: false,
    category: 'testing',
  },
  {
    check: 'Edge cases covered: boundary values, null/undefined, empty arrays',
    required: false,
    category: 'testing',
  },
];

/* ------------------------------------------------------------------ */
/*  STRIDE checks                                                      */
/* ------------------------------------------------------------------ */

const STRIDE_CHECKS: ChecklistItem[] = [
  {
    check: 'STRIDE: 30 rules (TS01–TS30, D-232) intact',
    required: true,
    category: 'architecture',
  },
  {
    check: 'TS13 is internal-only — not exposed externally',
    required: true,
    category: 'compliance',
  },
  {
    check: 'RIL 4 states (D-233a) correctly referenced',
    required: true,
    category: 'architecture',
  },
];

/* ------------------------------------------------------------------ */
/*  File classification                                                */
/* ------------------------------------------------------------------ */

/**
 * Determines which checklist groups apply to a given file path.
 *
 * @param filePath - Relative or absolute file path
 * @returns Set of applicable check group names
 */
function classifyFile(filePath: string): Set<string> {
  const lower = filePath.toLowerCase().replace(/\\/g, '/');
  const groups: Set<string> = new Set();

  if (/\/l[1-9]-/.test(lower) || /^l[1-9]-/.test(lower)) groups.add('engine');
  if (lower.includes('safety/') || lower.includes('/safety/')) groups.add('safety');
  if (lower.includes('connections/') || lower.includes('/connections/')) groups.add('connections');
  if (lower.includes('intake-features/') || lower.includes('/intake-features/')) groups.add('intake');
  if (lower.includes('stride/') || lower.includes('/stride/')) groups.add('stride');
  if (lower.includes('.test.') || lower.includes('.spec.') || lower.includes('__test') || lower.includes('/test/')) {
    groups.add('test');
  }

  return groups;
}

/* ------------------------------------------------------------------ */
/*  Public functions                                                   */
/* ------------------------------------------------------------------ */

/**
 * Generates a review checklist for a single file based on its path
 * and (optionally) its content.
 *
 * The checklist always includes universal checks. Additional checks are
 * added based on the file's location within the engine architecture:
 *
 * - **l1–l9**: architecture + clinical + engine-specific checks
 * - **safety/**: compliance + regulatory checks
 * - **connections/**: architecture + evidence checks
 * - **intake-features/**: clinical + testing checks
 * - **stride/**: STRIDE rule integrity checks
 * - **test files**: coverage + assertion quality checks
 *
 * @param filePath - Path to the file being reviewed
 * @param content - File content (used for additional context scanning)
 * @returns FileChecklist with all applicable items
 */
export function generateChecklist(filePath: string, content: string): FileChecklist {
  const groups = classifyFile(filePath);
  const items: ChecklistItem[] = [...UNIVERSAL_CHECKS];

  if (groups.has('engine')) items.push(...ENGINE_CHECKS);
  if (groups.has('safety')) items.push(...SAFETY_CHECKS);
  if (groups.has('connections')) items.push(...CONNECTIONS_CHECKS);
  if (groups.has('intake')) items.push(...INTAKE_CHECKS);
  if (groups.has('stride')) items.push(...STRIDE_CHECKS);
  if (groups.has('test')) items.push(...TEST_CHECKS);

  // Content-aware additional checks
  if (content) {
    const lower = content.toLowerCase();

    if (lower.includes('dampening') || lower.includes('dampen')) {
      const hasDampeningCheck = items.some(i => i.check.includes('dampening'));
      if (!hasDampeningCheck) {
        items.push({
          check: 'N6 dampening factor is 0.7 — verify value in this file',
          required: true,
          category: 'architecture',
        });
      }
    }

    if (lower.includes('evidence') || lower.includes('tier')) {
      const hasEvidenceCheck = items.some(i => i.check.includes('Evidence tier'));
      if (!hasEvidenceCheck) {
        items.push({
          check: 'Evidence tier correctly applied (must be one of: Established, Emerging, Theoretical, Observed in Practice, Contested)',
          required: true,
          category: 'clinical',
        });
      }
    }

    if (lower.includes('regulatoryfooter') || lower.includes('regulatory_footer') || lower.includes('clinical output')) {
      items.push({
        check: `Regulatory footer text matches: "${VM_BRAND.regulatoryFooter}"`,
        required: true,
        category: 'compliance',
      });
    }

    if (/\bmd\b/.test(content) && !content.includes('MBBS')) {
      items.push({
        check: 'Possible credential error: "MD" found — must be MBBS, FAAMFM only (K7)',
        required: true,
        category: 'compliance',
      });
    }
  }

  // Deduplicate by check text
  const seen = new Set<string>();
  const deduped: ChecklistItem[] = [];
  for (const item of items) {
    if (!seen.has(item.check)) {
      seen.add(item.check);
      deduped.push(item);
    }
  }

  return { file: filePath, items: deduped };
}

/**
 * Generates a combined review checklist for multiple files.
 *
 * Each file gets its own checklist section. A summary of unique required
 * checks across all files is prepended.
 *
 * @param files - Array of {path, content} pairs to review
 * @returns Array of per-file checklists
 */
export function generateBatchChecklist(
  files: { path: string; content: string }[],
): FileChecklist[] {
  return files.map(f => generateChecklist(f.path, f.content));
}

/**
 * Renders a batch checklist as markdown for review documentation.
 *
 * @param checklists - Array of file checklists
 * @returns Markdown-formatted review document
 */
export function renderChecklistMarkdown(checklists: FileChecklist[]): string {
  const now = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push('# VitalMatrix Code Review Checklist');
  lines.push('');
  lines.push(`**Generated:** ${now}`);
  lines.push(`**Platform:** ${VM_BRAND.platform.descriptor}`);
  lines.push(`**Reviewer:** ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`);
  lines.push(`**Files reviewed:** ${checklists.length}`);
  lines.push('');

  // Global required checks summary
  const allRequired = new Set<string>();
  for (const cl of checklists) {
    for (const item of cl.items.filter(i => i.required)) {
      allRequired.add(item.check);
    }
  }

  lines.push('## Required Checks Summary');
  lines.push('');
  for (const check of allRequired) {
    lines.push(`- [ ] ${check}`);
  }
  lines.push('');

  // Per-file checklists
  for (const cl of checklists) {
    lines.push(`## ${cl.file}`);
    lines.push('');

    // Group by category
    const byCategory: Record<string, ChecklistItem[]> = {};
    for (const item of cl.items) {
      if (!byCategory[item.category]) byCategory[item.category] = [];
      byCategory[item.category].push(item);
    }

    for (const [category, items] of Object.entries(byCategory).sort()) {
      lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
      lines.push('');
      for (const item of items) {
        const marker = item.required ? '[REQUIRED]' : '[recommended]';
        lines.push(`- [ ] ${marker} ${item.check}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);
  lines.push('');

  return lines.join('\n');
}
