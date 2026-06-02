/**
 * C28D — Smart TODO Manager
 * VitalMatrix Content Studio Dev
 *
 * Intelligent TODO.md parser and manager. Parses TODO markdown, cross-
 * references items against git history, pending D-series decisions, and
 * gate statuses to automatically update item states. Generates prioritised
 * reports and prunes completed items past their retention window.
 *
 * @module c28d-smart-todo-manager
 */

import { VM_BRAND } from './brand-config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Priority levels in descending order of urgency. */
export type TodoPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

/** Item lifecycle states. */
export type TodoStatus = 'pending' | 'done' | 'blocked' | 'gated';

/** A single TODO item. */
export interface TodoItem {
  id: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  blockedBy?: string;
  gatedBy?: string;
  relatedDecision?: string;
  addedDate: string;       // ISO date string
  completedDate?: string;  // ISO date string
}

/** Aggregate report over a list of TODO items. */
export interface TodoReport {
  readonly total: number;
  readonly pending: number;
  readonly done: number;
  readonly blocked: number;
  readonly gated: number;
  readonly nextAction: TodoItem | null;
}

/** Gate status entry for cross-referencing. */
export interface GateStatus {
  readonly gate: string;
  readonly status: string;
}

/* ------------------------------------------------------------------ */
/*  Priority ordering                                                  */
/* ------------------------------------------------------------------ */

const PRIORITY_ORDER: Record<TodoPriority, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

/* ------------------------------------------------------------------ */
/*  Parsing                                                            */
/* ------------------------------------------------------------------ */

/**
 * Parses a TODO.md file into structured TodoItem objects.
 *
 * Expected markdown format per item:
 * ```
 * - [ ] [CRITICAL] Description text {D-38} @2026-05-01
 * - [x] [HIGH] Completed item {D-212} @2026-04-15 done:2026-05-10
 * - [b] [MEDIUM] Blocked by X {D-100} @2026-05-01 blocked:some-dependency
 * - [g] [LOW] Gated by Y {D-50} @2026-05-01 gated:gate-name
 * ```
 *
 * @param content - Raw TODO.md content
 * @returns Parsed array of TodoItem objects
 */
export function parseTodoMd(content: string): TodoItem[] {
  const items: TodoItem[] = [];
  const lines = content.split('\n');
  let autoId = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Match lines starting with - [ ], - [x], - [b], - [g]
    const match = trimmed.match(
      /^-\s+\[([xbg ])\]\s+\[(\w+)\]\s+(.+)$/i,
    );
    if (!match) continue;

    const statusChar = match[1].toLowerCase();
    const priority = match[2].toUpperCase() as TodoPriority;
    let remainder = match[3];

    // Extract decision reference
    const decisionMatch = remainder.match(/\{(D-\d+[a-z]?)\}/i);
    const relatedDecision = decisionMatch ? decisionMatch[1].toUpperCase() : undefined;
    if (decisionMatch) remainder = remainder.replace(decisionMatch[0], '').trim();

    // Extract added date
    const dateMatch = remainder.match(/@(\d{4}-\d{2}-\d{2})/);
    const addedDate = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10);
    if (dateMatch) remainder = remainder.replace(dateMatch[0], '').trim();

    // Extract completed date
    const completedMatch = remainder.match(/done:(\d{4}-\d{2}-\d{2})/);
    const completedDate = completedMatch ? completedMatch[1] : undefined;
    if (completedMatch) remainder = remainder.replace(completedMatch[0], '').trim();

    // Extract blocked-by
    const blockedMatch = remainder.match(/blocked:(\S+)/);
    const blockedBy = blockedMatch ? blockedMatch[1] : undefined;
    if (blockedMatch) remainder = remainder.replace(blockedMatch[0], '').trim();

    // Extract gated-by
    const gatedMatch = remainder.match(/gated:(\S+)/);
    const gatedBy = gatedMatch ? gatedMatch[1] : undefined;
    if (gatedMatch) remainder = remainder.replace(gatedMatch[0], '').trim();

    // Status
    let status: TodoStatus;
    switch (statusChar) {
      case 'x': status = 'done'; break;
      case 'b': status = 'blocked'; break;
      case 'g': status = 'gated'; break;
      default:  status = 'pending'; break;
    }

    autoId++;
    items.push({
      id: `TODO-${String(autoId).padStart(3, '0')}`,
      description: remainder.trim(),
      priority: PRIORITY_ORDER[priority] !== undefined ? priority : 'MEDIUM',
      status,
      blockedBy,
      gatedBy,
      relatedDecision,
      addedDate,
      completedDate,
    });
  }

  return items;
}

/* ------------------------------------------------------------------ */
/*  Cross-referencing                                                  */
/* ------------------------------------------------------------------ */

/**
 * Marks items as done if a commit message matches the item description
 * or its related decision.
 *
 * @param todos - Current TODO items
 * @param gitLog - Array of commit messages from git log
 * @returns Updated TODO items with matched items marked done
 */
export function crossReferenceWithGit(
  todos: TodoItem[],
  gitLog: string[],
): TodoItem[] {
  const logText = gitLog.join('\n').toLowerCase();
  const today = new Date().toISOString().slice(0, 10);

  return todos.map(item => {
    if (item.status === 'done') return item;

    // Check if the description keywords appear in git log
    const keywords = item.description
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3);
    const descriptionMatch = keywords.length > 0 &&
      keywords.filter(k => logText.includes(k)).length >= Math.ceil(keywords.length * 0.6);

    // Check if the related decision appears in git log
    const decisionMatch = item.relatedDecision &&
      logText.includes(item.relatedDecision.toLowerCase());

    if (descriptionMatch || decisionMatch) {
      return { ...item, status: 'done' as TodoStatus, completedDate: today };
    }
    return item;
  });
}

/**
 * Marks pending items as blocked if their related decision is in the
 * pending decisions list.
 *
 * @param todos - Current TODO items
 * @param pendingDecisions - Array of pending D-series decision identifiers
 * @returns Updated TODO items with blocked status applied
 */
export function crossReferenceWithDecisions(
  todos: TodoItem[],
  pendingDecisions: string[],
): TodoItem[] {
  const pendingSet = new Set(pendingDecisions.map(d => d.toUpperCase()));

  return todos.map(item => {
    if (item.status !== 'pending') return item;
    if (item.relatedDecision && pendingSet.has(item.relatedDecision.toUpperCase())) {
      return {
        ...item,
        status: 'blocked' as TodoStatus,
        blockedBy: `Pending decision ${item.relatedDecision}`,
      };
    }
    return item;
  });
}

/**
 * Marks pending items as gated if their related gate is not yet passed.
 *
 * @param todos - Current TODO items
 * @param gateStatuses - Array of gate names and their statuses
 * @returns Updated TODO items with gated status applied
 */
export function crossReferenceWithGates(
  todos: TodoItem[],
  gateStatuses: GateStatus[],
): TodoItem[] {
  const blockedGates = new Set(
    gateStatuses
      .filter(g => g.status.toLowerCase() !== 'passed' && g.status.toLowerCase() !== 'pass')
      .map(g => g.gate.toLowerCase()),
  );

  return todos.map(item => {
    if (item.status !== 'pending') return item;
    if (item.gatedBy && blockedGates.has(item.gatedBy.toLowerCase())) {
      return { ...item, status: 'gated' as TodoStatus };
    }
    return item;
  });
}

/* ------------------------------------------------------------------ */
/*  Reporting                                                          */
/* ------------------------------------------------------------------ */

/**
 * Gets the highest priority non-blocked, non-gated pending item.
 *
 * @param todos - Current TODO items
 * @returns The next actionable item, or null if none remain
 */
export function getNextAction(todos: TodoItem[]): TodoItem | null {
  const actionable = todos
    .filter(t => t.status === 'pending')
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  return actionable[0] ?? null;
}

/**
 * Generates the aggregate TODO report.
 *
 * @param todos - Current TODO items
 * @returns Aggregate counts and next action
 */
export function generateTodoReport(todos: TodoItem[]): TodoReport {
  return {
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    done: todos.filter(t => t.status === 'done').length,
    blocked: todos.filter(t => t.status === 'blocked').length,
    gated: todos.filter(t => t.status === 'gated').length,
    nextAction: getNextAction(todos),
  };
}

/**
 * Generates a prioritised markdown report from the TODO items.
 *
 * @param todos - Current TODO items
 * @returns Markdown-formatted TODO report
 */
export function generateTodoReportMarkdown(todos: TodoItem[]): string {
  const report = generateTodoReport(todos);
  const now = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push('# VitalMatrix TODO Report');
  lines.push('');
  lines.push(`**Generated:** ${now}`);
  lines.push(`**Platform:** ${VM_BRAND.platform.descriptor}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Status | Count |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Total | ${report.total} |`);
  lines.push(`| Pending | ${report.pending} |`);
  lines.push(`| Done | ${report.done} |`);
  lines.push(`| Blocked | ${report.blocked} |`);
  lines.push(`| Gated | ${report.gated} |`);
  lines.push('');

  // Next action
  if (report.nextAction) {
    lines.push('## Next Action');
    lines.push('');
    lines.push(`**[${report.nextAction.priority}]** ${report.nextAction.description}`);
    if (report.nextAction.relatedDecision) {
      lines.push(`  Decision: ${report.nextAction.relatedDecision}`);
    }
    lines.push('');
  }

  // Grouped by priority
  for (const prio of ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as TodoPriority[]) {
    const items = todos.filter(t => t.priority === prio && t.status !== 'done');
    if (items.length === 0) continue;

    lines.push(`## ${prio}`);
    lines.push('');
    for (const item of items) {
      const statusTag = item.status === 'pending' ? '[ ]' :
        item.status === 'blocked' ? '[BLOCKED]' : '[GATED]';
      let line = `- ${statusTag} ${item.description}`;
      if (item.relatedDecision) line += ` {${item.relatedDecision}}`;
      if (item.blockedBy) line += ` (blocked by: ${item.blockedBy})`;
      if (item.gatedBy) line += ` (gated by: ${item.gatedBy})`;
      lines.push(line);
    }
    lines.push('');
  }

  // Done items
  const doneItems = todos.filter(t => t.status === 'done');
  if (doneItems.length > 0) {
    lines.push('## Completed');
    lines.push('');
    for (const item of doneItems) {
      lines.push(`- [x] ${item.description} (done: ${item.completedDate ?? 'unknown'})`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);
  lines.push('');

  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/*  Pruning                                                            */
/* ------------------------------------------------------------------ */

/**
 * Removes completed items older than 30 days.
 *
 * @param todos - Current TODO items
 * @returns Filtered array with old completed items removed
 */
export function pruneCompleted(todos: TodoItem[]): TodoItem[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return todos.filter(item => {
    if (item.status !== 'done') return true;
    if (!item.completedDate) return true;
    return item.completedDate >= cutoffStr;
  });
}
