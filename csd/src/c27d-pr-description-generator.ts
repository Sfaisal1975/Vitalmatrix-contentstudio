/**
 * C27D — PR Description Generator
 * VitalMatrix Content Studio Dev
 *
 * Auto-generates GitHub pull request descriptions from branch metadata,
 * commit history, and changed files. Extracts D-series decision references,
 * categorises changes by directory, and builds a reviewer checklist
 * tailored to the areas of the codebase that were touched.
 *
 * Architecture context: 7 nodes (N1–N7), 5 zones (Z1–Z5), 6 cascade
 * stacks (S1–S6). Pipeline: FLINT->APEX->STRIDE->RIL->CADENCE->CIL->VISTA.
 *
 * @module c27d-pr-description-generator
 */

import { VM_BRAND } from './brand-config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Single commit entry. */
export interface CommitEntry {
  readonly hash: string;
  readonly message: string;
}

/** Single changed file entry. */
export interface FileChange {
  readonly path: string;
  readonly status: 'A' | 'M' | 'D';
}

/** Diff statistics. */
export interface DiffStats {
  readonly insertions: number;
  readonly deletions: number;
}

/** Input data for PR generation. */
export interface PrInput {
  readonly branchName: string;
  readonly baseBranch: string;
  readonly commits: CommitEntry[];
  readonly filesChanged: FileChange[];
  readonly testResult: string;
  readonly diffStats: DiffStats;
}

/** Generated PR description. */
export interface PrDescription {
  readonly title: string;
  readonly body: string;
  readonly labels: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Known directory categories for grouping changes. */
const DIR_CATEGORIES: Record<string, string> = {
  'l1-': 'Engine Layer',
  'l2-': 'Engine Layer',
  'l3-': 'Engine Layer',
  'l4-': 'Engine Layer',
  'l5-': 'Engine Layer',
  'l6-': 'Engine Layer',
  'l7-': 'Engine Layer',
  'l8-': 'Engine Layer',
  'l9-': 'Engine Layer',
  'connections/': 'Connections',
  'stride/': 'STRIDE Engine',
  'safety/': 'Safety / Compliance',
  'intake-features/': 'Intake Features',
  'test': 'Tests',
  'spec': 'Specifications',
};

const STATUS_LABELS: Record<string, string> = {
  A: 'Added',
  M: 'Modified',
  D: 'Deleted',
};

/**
 * Extracts D-series decision references (e.g. D-38, D-233b) from text.
 *
 * @param text - Source text to scan
 * @returns Deduplicated array of decision identifiers
 */
function extractDecisions(text: string): string[] {
  const matches = text.match(/D-\d+[a-z]?/gi) ?? [];
  return [...new Set(matches.map(m => m.toUpperCase()))];
}

/**
 * Categorises a file path into one of the known directory groups.
 *
 * @param filePath - Relative file path
 * @returns Category label
 */
function categoriseFile(filePath: string): string {
  const lower = filePath.toLowerCase();
  for (const [prefix, label] of Object.entries(DIR_CATEGORIES)) {
    if (lower.includes(prefix)) return label;
  }
  return 'Other';
}

/**
 * Derives a human-readable PR title from the branch name.
 *
 * @param branchName - Git branch name (kebab-case expected)
 * @returns Formatted title
 */
function deriveTitle(branchName: string): string {
  const cleaned = branchName
    .replace(/^(feature|fix|hotfix|chore|refactor)\//i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return cleaned;
}

/* ------------------------------------------------------------------ */
/*  Label suggestion                                                   */
/* ------------------------------------------------------------------ */

/**
 * Suggests GitHub labels based on the PR input.
 *
 * Auto-tags:
 * - `engine` — changes in l1–l9 directories
 * - `safety` — changes in safety/
 * - `intake` — changes in intake-features/
 * - `architecture` — changes in connections/ or l1–l9
 * - `test` — changes in test files or test results present
 * - `stride` — changes in stride/
 * - `decision` — D-series references found in commits
 * - `breaking` — deletions outnumber insertions
 *
 * @param input - PR input data
 * @returns Array of suggested label strings
 */
export function suggestLabels(input: PrInput): string[] {
  const labels: Set<string> = new Set();
  const allPaths = input.filesChanged.map(f => f.path.toLowerCase());

  if (allPaths.some(p => /\/l[1-9]-/.test(p) || /^l[1-9]-/.test(p))) {
    labels.add('engine');
    labels.add('architecture');
  }
  if (allPaths.some(p => p.includes('safety/'))) labels.add('safety');
  if (allPaths.some(p => p.includes('intake-features/'))) labels.add('intake');
  if (allPaths.some(p => p.includes('connections/'))) labels.add('architecture');
  if (allPaths.some(p => p.includes('stride/'))) labels.add('stride');
  if (allPaths.some(p => p.includes('test') || p.includes('.spec.'))) labels.add('test');

  const allMessages = input.commits.map(c => c.message).join(' ');
  if (extractDecisions(allMessages).length > 0) labels.add('decision');

  if (input.diffStats.deletions > input.diffStats.insertions) labels.add('breaking');

  return [...labels].sort();
}

/* ------------------------------------------------------------------ */
/*  PR description generation                                          */
/* ------------------------------------------------------------------ */

/**
 * Generates a complete GitHub PR description.
 *
 * Sections:
 * 1. **Summary** — up to 3 bullets derived from commits
 * 2. **Changes** — categorised by directory
 * 3. **Decisions** — D-series references extracted from commit messages
 * 4. **Test Results** — pass/fail output
 * 5. **Reviewer Checklist** — auto-generated from changed file locations
 *
 * @param input - PR input data
 * @returns Structured PR description with title, body, and labels
 */
export function generatePrDescription(input: PrInput): PrDescription {
  const title = deriveTitle(input.branchName);
  const labels = suggestLabels(input);
  const sections: string[] = [];

  // ---- Summary ----
  sections.push('## Summary');
  sections.push('');
  const summaryCommits = input.commits.slice(0, 3);
  for (const c of summaryCommits) {
    sections.push(`- ${c.message}`);
  }
  sections.push('');

  // ---- Changes ----
  sections.push('## Changes');
  sections.push('');
  const grouped: Record<string, FileChange[]> = {};
  for (const f of input.filesChanged) {
    const cat = categoriseFile(f.path);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(f);
  }
  for (const [category, files] of Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))) {
    sections.push(`### ${category}`);
    sections.push('');
    for (const f of files) {
      sections.push(`- \`${f.path}\` (${STATUS_LABELS[f.status] ?? f.status})`);
    }
    sections.push('');
  }
  sections.push(`**Diff:** +${input.diffStats.insertions} / -${input.diffStats.deletions}`);
  sections.push('');

  // ---- Decisions ----
  const allMessages = input.commits.map(c => c.message).join('\n');
  const decisions = extractDecisions(allMessages);
  if (decisions.length > 0) {
    sections.push('## Decisions');
    sections.push('');
    for (const d of decisions) {
      sections.push(`- ${d}`);
    }
    sections.push('');
  }

  // ---- Test Results ----
  sections.push('## Test Results');
  sections.push('');
  sections.push('```');
  sections.push(input.testResult);
  sections.push('```');
  sections.push('');

  // ---- Reviewer Checklist ----
  sections.push('## Reviewer Checklist');
  sections.push('');
  const checklist = buildReviewerChecklist(input.filesChanged);
  for (const item of checklist) {
    sections.push(`- [ ] ${item}`);
  }
  sections.push('');

  // ---- Footer ----
  sections.push('---');
  sections.push(`*${VM_BRAND.platform.descriptor} — ${VM_BRAND.credentials.company}*`);

  return {
    title,
    body: sections.join('\n'),
    labels,
  };
}

/**
 * Builds a reviewer checklist tailored to the changed file areas.
 *
 * @param files - Array of changed files
 * @returns Array of checklist strings
 */
function buildReviewerChecklist(files: FileChange[]): string[] {
  const checks: Set<string> = new Set();
  const paths = files.map(f => f.path.toLowerCase());

  // Universal checks
  checks.add('No N8/Z6+/S7+ references — only N1–N7, Z1–Z5, S1–S6');
  checks.add(`Credentials are ${VM_BRAND.credentials.qualifications} only — never MD, never FMAARM`);
  checks.add('British English throughout — no em dashes');

  // Architecture checks for engine layers
  if (paths.some(p => /\/l[1-9]-/.test(p) || /^l[1-9]-/.test(p))) {
    checks.add('Architecture: layer boundaries respected (ALB v1.4)');
    checks.add('Scoring 0–100 internal, MAX(dampened)-10 rule (D-212)');
    checks.add('Pipeline order matches D-233b: FLINT->APEX->STRIDE->RIL->CADENCE->CIL->VISTA');
    checks.add('N6 dampening factor is 0.7');
  }

  // Compliance checks for safety/
  if (paths.some(p => p.includes('safety/'))) {
    checks.add('Compliance: regulatory footer present on clinical outputs');
    checks.add('Compliance: evidence tier specified on all clinical claims');
    checks.add('T-01 output restrictions verified (W5-1 to W5-7)');
  }

  // Architecture + evidence checks for connections/
  if (paths.some(p => p.includes('connections/'))) {
    checks.add('Architecture: connection names match W26 authoritative list');
    checks.add('Evidence tier tagged on clinical claims');
  }

  // Clinical + testing checks for intake-features/
  if (paths.some(p => p.includes('intake-features/'))) {
    checks.add('Clinical: INTAKE feature specs match v3.5 analysis');
    checks.add('Testing: feature has corresponding test coverage');
    checks.add('T-01 clinical output check');
  }

  // Test file checks
  if (paths.some(p => p.includes('test') || p.includes('.spec.'))) {
    checks.add('Test coverage: new/modified code has adequate test coverage');
    checks.add('No test-only workarounds that mask production issues');
  }

  // STRIDE checks
  if (paths.some(p => p.includes('stride/'))) {
    checks.add('STRIDE: 30 rules (TS01–TS30, D-232) intact');
    checks.add('TS13 is internal-only — not exposed externally');
  }

  return [...checks];
}
