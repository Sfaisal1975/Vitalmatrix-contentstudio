/**
 * Component 39D: Notion Decision Importer
 * DEV PACKAGE — Internal tooling only
 *
 * Imports D-series decisions from Notion markdown into the C9 Decision Registry.
 * Currently C9 has ~30 of 236+ decisions hardcoded. This component parses
 * Notion page content (markdown tables) and generates TypeScript code ready
 * to paste into c9-decision-registry.ts.
 *
 * Features:
 *  - Parse Notion markdown tables with columns: #, Decision, D-Series, Status
 *  - Validate decision format and required fields
 *  - Reconcile new imports against existing registry entries
 *  - Generate import reports with statistics
 *
 * @module c39d-notion-decision-importer
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Valid status values for a decision. */
export type NotionDecisionStatus = 'LOCKED' | 'PENDING' | 'RESCINDED' | 'SUPERSEDED';

/** A decision parsed from Notion content. */
export interface NotionDecision {
  /** Decision identifier, e.g. 'D-123'. */
  id: string;
  /** Decision title. */
  title: string;
  /** Brief summary of the decision. */
  summary: string;
  /** Current status. */
  status: NotionDecisionStatus;
  /** Date the decision was made (YYYY-MM-DD). */
  date: string;
  /** Who confirmed the decision (e.g. 'SA', 'Dr Faisal'). */
  confirmedBy: string;
  /** If superseded, the ID of the replacing decision. */
  supersededBy?: string;
  /** If this decision supersedes another, that ID. */
  supersedes?: string;
  /** IDs of decisions this one depends on. */
  dependencies: string[];
  /** Searchable tags. */
  tags: string[];
}

/** Result of an import operation. */
export interface ImportResult {
  /** Number of decisions successfully imported. */
  imported: number;
  /** Number of decisions skipped (duplicates or invalid). */
  skipped: number;
  /** Error messages encountered during import. */
  errors: string[];
  /** Generated TypeScript code for the registry. */
  generatedCode: string;
}

/** Reconciliation entry describing a single decision's import status. */
export interface ReconciliationEntry {
  /** Decision ID. */
  id: string;
  /** Whether this is new, updated, or conflicting. */
  action: 'NEW' | 'UPDATED' | 'CONFLICT';
  /** Description of what changed or why it conflicts. */
  detail: string;
}

// --- Constants ---

/** Valid D-series ID pattern: D-nnn or D-nnnA/B/C. */
const D_ID_PATTERN = /^D-\d{1,4}[A-Z]?$/;

/** Valid statuses for validation. */
const VALID_STATUSES: NotionDecisionStatus[] = ['LOCKED', 'PENDING', 'RESCINDED', 'SUPERSEDED'];

// --- Parsing ---

/**
 * Parses Notion markdown content containing a decision table.
 * Expects a markdown table with columns: #, Decision, D-Series, Status.
 * Additional columns (Date, Confirmed By, Dependencies, Tags) are parsed if present.
 *
 * @param notionContent - Raw markdown string from a Notion page.
 * @returns Array of parsed NotionDecision objects.
 */
export function parseNotionDecisionPage(notionContent: string): NotionDecision[] {
  const decisions: NotionDecision[] = [];
  const lines = notionContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Find table header row
  const headerIndex = lines.findIndex(l =>
    l.startsWith('|') && l.toLowerCase().includes('decision')
  );

  if (headerIndex === -1) {
    return decisions;
  }

  const headerLine = lines[headerIndex];
  const headers = parseTableRow(headerLine).map(h => h.toLowerCase().trim());

  // Map column indices
  const colMap = {
    number: findColumnIndex(headers, ['#', 'number', 'no', 'no.']),
    decision: findColumnIndex(headers, ['decision', 'title', 'name']),
    dSeries: findColumnIndex(headers, ['d-series', 'dseries', 'd series', 'id', 'd-id']),
    status: findColumnIndex(headers, ['status']),
    date: findColumnIndex(headers, ['date', 'decided', 'confirmed date']),
    confirmedBy: findColumnIndex(headers, ['confirmed by', 'confirmedby', 'confirmed', 'by']),
    dependencies: findColumnIndex(headers, ['dependencies', 'deps', 'depends on']),
    tags: findColumnIndex(headers, ['tags', 'labels', 'categories']),
    summary: findColumnIndex(headers, ['summary', 'description', 'detail', 'details']),
    supersedes: findColumnIndex(headers, ['supersedes', 'replaces']),
    supersededBy: findColumnIndex(headers, ['superseded by', 'supersededby', 'replaced by']),
  };

  // Skip separator row (---|---|---)
  let dataStart = headerIndex + 1;
  if (dataStart < lines.length && lines[dataStart].match(/^\|[\s-|]+\|$/)) {
    dataStart++;
  }

  // Parse data rows
  for (let i = dataStart; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('|')) continue;

    const cells = parseTableRow(line);
    if (cells.length < 2) continue;

    const rawId = safeGet(cells, colMap.dSeries) || safeGet(cells, colMap.number) || '';
    const id = normaliseDecisionId(rawId);
    if (!id) continue;

    const title = safeGet(cells, colMap.decision) || '';
    const summary = safeGet(cells, colMap.summary) || title;
    const statusRaw = safeGet(cells, colMap.status) || 'PENDING';
    const status = normaliseStatus(statusRaw);
    const date = safeGet(cells, colMap.date) || new Date().toISOString().slice(0, 10);
    const confirmedBy = safeGet(cells, colMap.confirmedBy) || 'Unknown';
    const depsRaw = safeGet(cells, colMap.dependencies) || '';
    const tagsRaw = safeGet(cells, colMap.tags) || '';
    const supersedes = safeGet(cells, colMap.supersedes) || undefined;
    const supersededBy = safeGet(cells, colMap.supersededBy) || undefined;

    const dependencies = parseCsvList(depsRaw).filter(d => D_ID_PATTERN.test(d));
    const tags = parseCsvList(tagsRaw);

    decisions.push({
      id,
      title: title.trim(),
      summary: summary.trim(),
      status,
      date,
      confirmedBy: confirmedBy.trim(),
      ...(supersedes ? { supersedes: normaliseDecisionId(supersedes) || supersedes } : {}),
      ...(supersededBy ? { supersededBy: normaliseDecisionId(supersededBy) || supersededBy } : {}),
      dependencies,
      tags,
    });
  }

  return decisions;
}

// --- Code Generation ---

/**
 * Generates TypeScript code for the decision registry from parsed decisions.
 * Output is ready to paste into c9-decision-registry.ts.
 *
 * @param decisions - Array of validated NotionDecision objects.
 * @returns TypeScript source code string.
 */
export function generateRegistryCode(decisions: NotionDecision[]): string {
  const lines: string[] = [
    '// --- Generated by c39d-notion-decision-importer ---',
    `// ${decisions.length} decisions imported on ${new Date().toISOString().slice(0, 10)}`,
    `// Platform: ${VM_BRAND.platform.descriptor}`,
    '',
  ];

  for (const d of decisions) {
    const parts: string[] = [
      `id: '${escapeString(d.id)}'`,
      `title: '${escapeString(d.title)}'`,
      `summary: '${escapeString(d.summary)}'`,
      `status: '${d.status}'`,
      `date: '${d.date}'`,
      `confirmedBy: '${escapeString(d.confirmedBy)}'`,
    ];

    if (d.supersededBy) {
      parts.push(`supersededBy: '${escapeString(d.supersededBy)}'`);
    }
    if (d.supersedes) {
      parts.push(`supersedes: '${escapeString(d.supersedes)}'`);
    }

    parts.push(`dependencies: [${d.dependencies.map(dep => `'${dep}'`).join(', ')}]`);
    parts.push(`tags: [${d.tags.map(tag => `'${escapeString(tag)}'`).join(', ')}]`);

    lines.push(`  { ${parts.join(', ')} },`);
  }

  return lines.join('\n');
}

// --- Validation ---

/**
 * Validates a single decision, checking required fields and format constraints.
 *
 * @param decision - The decision to validate.
 * @returns Array of error messages (empty if valid).
 */
export function validateDecision(decision: NotionDecision): string[] {
  const errors: string[] = [];

  if (!decision.id || !D_ID_PATTERN.test(decision.id)) {
    errors.push(`Invalid D-series ID format: '${decision.id}'. Expected D-nnn or D-nnnA.`);
  }

  if (!decision.title || decision.title.trim().length === 0) {
    errors.push(`${decision.id}: Missing title.`);
  }

  if (!decision.summary || decision.summary.trim().length === 0) {
    errors.push(`${decision.id}: Missing summary.`);
  }

  if (!VALID_STATUSES.includes(decision.status)) {
    errors.push(`${decision.id}: Invalid status '${decision.status}'. Must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (!decision.date || !/^\d{4}-\d{2}-\d{2}$/.test(decision.date)) {
    errors.push(`${decision.id}: Invalid date format '${decision.date}'. Expected YYYY-MM-DD.`);
  }

  if (!decision.confirmedBy || decision.confirmedBy.trim().length === 0) {
    errors.push(`${decision.id}: Missing confirmedBy field.`);
  }

  if (decision.supersededBy && !D_ID_PATTERN.test(decision.supersededBy)) {
    errors.push(`${decision.id}: Invalid supersededBy ID '${decision.supersededBy}'.`);
  }

  if (decision.supersedes && !D_ID_PATTERN.test(decision.supersedes)) {
    errors.push(`${decision.id}: Invalid supersedes ID '${decision.supersedes}'.`);
  }

  for (const dep of decision.dependencies) {
    if (!D_ID_PATTERN.test(dep)) {
      errors.push(`${decision.id}: Invalid dependency ID '${dep}'.`);
    }
  }

  return errors;
}

// --- Reconciliation ---

/**
 * Reconciles newly imported decisions against existing registry entries.
 * Identifies which decisions are new, which update existing entries, and
 * which conflict.
 *
 * @param newDecisions - Decisions parsed from Notion.
 * @param existingIds - IDs already present in c9-decision-registry.ts.
 * @returns Array of reconciliation entries.
 */
export function reconcileWithExisting(
  newDecisions: NotionDecision[],
  existingIds: string[],
): ReconciliationEntry[] {
  const existingSet = new Set(existingIds);
  const entries: ReconciliationEntry[] = [];

  for (const d of newDecisions) {
    if (!existingSet.has(d.id)) {
      entries.push({
        id: d.id,
        action: 'NEW',
        detail: `New decision: ${d.title}`,
      });
    } else if (d.status === 'RESCINDED' || d.status === 'SUPERSEDED') {
      entries.push({
        id: d.id,
        action: 'UPDATED',
        detail: `Status changed to ${d.status}${d.supersededBy ? ` (by ${d.supersededBy})` : ''}`,
      });
    } else {
      entries.push({
        id: d.id,
        action: 'CONFLICT',
        detail: `Already exists in registry. Manual review required.`,
      });
    }
  }

  return entries;
}

// --- Reporting ---

/**
 * Generates a markdown import report from the import result.
 *
 * @param result - The completed import result.
 * @returns Markdown-formatted report string.
 */
export function generateImportReport(result: ImportResult): string {
  const lines: string[] = [
    `# Notion Decision Import Report`,
    '',
    `**Platform:** ${VM_BRAND.platform.descriptor}`,
    `**Date:** ${new Date().toISOString().slice(0, 10)}`,
    `**Company:** ${VM_BRAND.credentials.company}`,
    '',
    '## Summary',
    '',
    `| Metric | Count |`,
    `|--------|-------|`,
    `| Imported | ${result.imported} |`,
    `| Skipped | ${result.skipped} |`,
    `| Errors | ${result.errors.length} |`,
    '',
  ];

  if (result.errors.length > 0) {
    lines.push('## Errors', '');
    for (const err of result.errors) {
      lines.push(`- ${err}`);
    }
    lines.push('');
  }

  lines.push(
    '## Generated Code Preview',
    '',
    '```typescript',
    result.generatedCode.slice(0, 2000),
    result.generatedCode.length > 2000 ? '// ... truncated ...' : '',
    '```',
    '',
    `${VM_BRAND.regulatoryFooter}`,
  );

  return lines.join('\n');
}

// --- Full Import Pipeline ---

/**
 * Runs the full import pipeline: parse, validate, reconcile, generate.
 *
 * @param notionContent - Raw Notion markdown.
 * @param existingIds - IDs already in the registry.
 * @returns Complete import result.
 */
export function runImport(notionContent: string, existingIds: string[]): ImportResult {
  const parsed = parseNotionDecisionPage(notionContent);
  const allErrors: string[] = [];
  const valid: NotionDecision[] = [];

  for (const d of parsed) {
    const errs = validateDecision(d);
    if (errs.length > 0) {
      allErrors.push(...errs);
    } else {
      valid.push(d);
    }
  }

  const reconciliation = reconcileWithExisting(valid, existingIds);
  const newDecisions = valid.filter(d =>
    reconciliation.some(r => r.id === d.id && r.action === 'NEW')
  );
  const updatedDecisions = valid.filter(d =>
    reconciliation.some(r => r.id === d.id && r.action === 'UPDATED')
  );

  const toGenerate = [...newDecisions, ...updatedDecisions];
  const generatedCode = generateRegistryCode(toGenerate);

  const skipped = parsed.length - toGenerate.length;

  return {
    imported: toGenerate.length,
    skipped,
    errors: allErrors,
    generatedCode,
  };
}

// --- Helpers ---

/** Parses a markdown table row into cell values. */
function parseTableRow(row: string): string[] {
  return row
    .split('|')
    .slice(1, -1)
    .map(cell => cell.trim());
}

/** Finds a column index from a list of possible header names. */
function findColumnIndex(headers: string[], candidates: string[]): number {
  for (const candidate of candidates) {
    const idx = headers.findIndex(h => h === candidate || h.includes(candidate));
    if (idx !== -1) return idx;
  }
  return -1;
}

/** Safely gets a value from a cells array by index. */
function safeGet(cells: string[], index: number): string {
  if (index < 0 || index >= cells.length) return '';
  return cells[index].trim();
}

/** Normalises a raw string into a valid D-series ID, or returns null. */
function normaliseDecisionId(raw: string): string | null {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (D_ID_PATTERN.test(cleaned)) return cleaned;

  // Try extracting D-nnn from surrounding text
  const match = cleaned.match(/D-\d{1,4}[A-Z]?/);
  return match ? match[0] : null;
}

/** Normalises a status string to a valid NotionDecisionStatus. */
function normaliseStatus(raw: string): NotionDecisionStatus {
  const upper = raw.trim().toUpperCase();
  if (VALID_STATUSES.includes(upper as NotionDecisionStatus)) {
    return upper as NotionDecisionStatus;
  }
  // Handle common variants
  if (upper === 'DONE' || upper === 'CONFIRMED' || upper === 'ACTIVE') return 'LOCKED';
  if (upper === 'DRAFT' || upper === 'OPEN' || upper === 'TBD') return 'PENDING';
  if (upper === 'REPLACED' || upper === 'OBSOLETE') return 'SUPERSEDED';
  if (upper === 'CANCELLED' || upper === 'REVOKED') return 'RESCINDED';
  return 'PENDING';
}

/** Parses a comma-separated list into trimmed, non-empty strings. */
function parseCsvList(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/** Escapes single quotes for TypeScript string literals. */
function escapeString(s: string): string {
  return s.replace(/'/g, "\\'").replace(/\n/g, ' ');
}
