/**
 * Component 24D: Session Resume Engine
 * DEV PACKAGE — Internal tooling only
 *
 * Generates minimal "here is where you left off" context after a restart.
 * Replaces the need to re-read full MasterContext on every session start.
 *
 * Extracts from:
 *   - Last 3 git commits (hash, message, date)
 *   - Uncommitted changes (git status)
 *   - Pending items from TODO.md
 *   - Key pointers from memory files
 *
 * Target output: <500 tokens of context, optimised for Claude context window.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Full resume context after parsing git and project state. */
export interface ResumeContext {
  /** Date of the last session (from most recent commit). */
  lastSessionDate: string;
  /** Hash of the most recent commit. */
  lastCommitHash: string;
  /** Message of the most recent commit. */
  lastCommitMessage: string;
  /** Files with uncommitted changes. */
  uncommittedChanges: string[];
  /** Pending decisions awaiting resolution. */
  pendingDecisions: string[];
  /** Next tasks to pick up. */
  nextTasks: string[];
  /** Open blockers preventing progress. */
  openBlockers: string[];
  /** Summary of test suite status. */
  testStatus: string;
  /** Estimated token count of the formatted context. */
  tokenEstimate: number;
}

// --- Git Log Parsing ---

/**
 * Parse git log output into structured commit entries.
 * Expects format: `git log --oneline -n 3 --format="%h|%s|%ai"`
 * or standard `git log --oneline -n 3` output.
 *
 * @param gitLogOutput - Raw git log output.
 * @returns Array of parsed commit objects (newest first).
 */
function parseGitLog(gitLogOutput: string): Array<{ hash: string; message: string; date: string }> {
  const commits: Array<{ hash: string; message: string; date: string }> = [];

  const lines = gitLogOutput.trim().split('\n').filter(l => l.trim().length > 0);

  for (const line of lines) {
    // Try pipe-delimited format first: hash|message|date
    const pipeParts = line.split('|');
    if (pipeParts.length >= 3) {
      commits.push({
        hash: pipeParts[0].trim(),
        message: pipeParts[1].trim(),
        date: pipeParts[2].trim(),
      });
      continue;
    }

    // Fall back to oneline format: hash message
    const match = line.match(/^([a-f0-9]{7,40})\s+(.+)$/);
    if (match) {
      commits.push({
        hash: match[1],
        message: match[2].trim(),
        date: '',
      });
    }
  }

  return commits;
}

// --- Git Status Parsing ---

/**
 * Parse git status output into a list of changed file paths.
 * Expects `git status --porcelain` format.
 *
 * @param gitStatusOutput - Raw git status output.
 * @returns Array of changed file paths.
 */
function parseGitStatus(gitStatusOutput: string): string[] {
  const files: string[] = [];

  const lines = gitStatusOutput.trim().split('\n').filter(l => l.trim().length > 0);

  for (const line of lines) {
    // Porcelain format: XY filename or XY original -> renamed
    const match = line.match(/^.{2}\s+(.+?)(?:\s+->\s+(.+))?$/);
    if (match) {
      files.push(match[2] || match[1]);
    }
  }

  return files;
}

// --- TODO.md Parsing ---

/**
 * Extract pending items, next tasks, and blockers from TODO.md content.
 *
 * @param todoContent - Raw TODO.md file content.
 * @returns Object with pending, next, and blocker arrays.
 */
function parseTodoContent(todoContent: string): {
  pending: string[];
  next: string[];
  blockers: string[];
} {
  const pending: string[] = [];
  const next: string[] = [];
  const blockers: string[] = [];

  const lines = todoContent.split('\n');
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect section headers
    if (/^#+\s*(next|upcoming|queue)/i.test(trimmed)) {
      currentSection = 'next';
      continue;
    }
    if (/^#+\s*(block|obstacle|impediment)/i.test(trimmed)) {
      currentSection = 'blocker';
      continue;
    }
    if (/^#+\s*(pending|decision|open)/i.test(trimmed)) {
      currentSection = 'pending';
      continue;
    }
    if (/^#+/.test(trimmed)) {
      currentSection = '';
      continue;
    }

    // Extract list items
    const itemMatch = trimmed.match(/^[-*]\s+\[[ x]?\]\s*(.+)$/) ||
                      trimmed.match(/^[-*]\s+(.+)$/);
    if (!itemMatch) continue;

    const item = itemMatch[1].trim();
    if (item.length === 0) continue;

    // Unchecked checkbox items are always interesting
    const isUnchecked = /^[-*]\s+\[\s\]/.test(trimmed);

    if (currentSection === 'next' || /\bnext\b/i.test(item)) {
      next.push(item);
    } else if (currentSection === 'blocker' || /\bblock(er|ed|ing)?\b/i.test(item)) {
      blockers.push(item);
    } else if (currentSection === 'pending' || isUnchecked) {
      pending.push(item);
    }
  }

  return { pending, next, blockers };
}

// --- Memory File Parsing ---

/**
 * Extract key pointers from memory file content (MEMORY.md or similar).
 * Looks for test status, recent decisions, and project state.
 *
 * @param memoryContent - Raw memory file content.
 * @returns Object with test status and decision pointers.
 */
function parseMemoryContent(memoryContent: string): {
  testStatus: string;
  recentDecisions: string[];
} {
  let testStatus = 'Unknown';
  const recentDecisions: string[] = [];

  // Look for test status indicators
  const testMatch = memoryContent.match(/(\d+)[/\\](\d+)\s*tests?\s*pass/i);
  if (testMatch) {
    testStatus = `${testMatch[1]}/${testMatch[2]} tests pass`;
  }

  // Look for BUILT/COMPLETE status
  const builtMatch = memoryContent.match(/(\d+)[/\\](\d+)\s*(?:BUILT|features?\s*BUILT)/i);
  if (builtMatch) {
    testStatus += ` | ${builtMatch[1]}/${builtMatch[2]} features BUILT`;
  }

  // Extract recent D-series decisions mentioned
  const dMatches = memoryContent.matchAll(/\b(D-\d{1,3})\b[^.]*?(?:LOCKED|RESOLVED|OPEN)[^.]*\./gi);
  for (const m of dMatches) {
    if (recentDecisions.length < 5) {
      recentDecisions.push(m[0].trim());
    }
  }

  return { testStatus, recentDecisions };
}

// --- Core ---

/**
 * Generate a resume context from git state and project files.
 *
 * @param gitLogOutput - Output from `git log --oneline -n 3 --format="%h|%s|%ai"`.
 * @param gitStatusOutput - Output from `git status --porcelain`.
 * @param todoContent - Optional TODO.md content.
 * @param memoryContent - Optional MEMORY.md content.
 * @returns ResumeContext with all extracted state.
 */
export function generateResumeContext(
  gitLogOutput: string,
  gitStatusOutput: string,
  todoContent?: string,
  memoryContent?: string
): ResumeContext {
  const commits = parseGitLog(gitLogOutput);
  const uncommitted = parseGitStatus(gitStatusOutput);

  const latestCommit = commits[0] || { hash: 'unknown', message: 'No commits found', date: '' };

  const todo = todoContent ? parseTodoContent(todoContent) : { pending: [], next: [], blockers: [] };
  const memory = memoryContent ? parseMemoryContent(memoryContent) : { testStatus: 'Unknown', recentDecisions: [] };

  const ctx: ResumeContext = {
    lastSessionDate: latestCommit.date || new Date().toISOString().split('T')[0],
    lastCommitHash: latestCommit.hash,
    lastCommitMessage: latestCommit.message,
    uncommittedChanges: uncommitted,
    pendingDecisions: [...todo.pending, ...memory.recentDecisions],
    nextTasks: todo.next,
    openBlockers: todo.blockers,
    testStatus: memory.testStatus,
    tokenEstimate: 0, // Will be calculated after formatting
  };

  // Calculate token estimate from the formatted output
  const formatted = formatResumeForContext(ctx);
  ctx.tokenEstimate = estimateTokens(formatted);

  return ctx;
}

/**
 * Estimate token count (rough: 1 token per 4 characters).
 *
 * @param text - Text to estimate.
 * @returns Approximate token count.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Format a ResumeContext into minimal text optimised for Claude context window.
 * Target: <500 tokens.
 *
 * @param ctx - ResumeContext to format.
 * @returns Compact text string for context injection.
 */
export function formatResumeForContext(ctx: ResumeContext): string {
  const lines: string[] = [
    `RESUME: ${VM_BRAND.credentials.company} | ${ctx.lastSessionDate}`,
    `Last commit: ${ctx.lastCommitHash} "${ctx.lastCommitMessage}"`,
  ];

  if (ctx.uncommittedChanges.length > 0) {
    const fileList = ctx.uncommittedChanges.length <= 5
      ? ctx.uncommittedChanges.join(', ')
      : `${ctx.uncommittedChanges.slice(0, 5).join(', ')} +${ctx.uncommittedChanges.length - 5} more`;
    lines.push(`Uncommitted: ${fileList}`);
  }

  if (ctx.testStatus !== 'Unknown') {
    lines.push(`Tests: ${ctx.testStatus}`);
  }

  if (ctx.nextTasks.length > 0) {
    const tasks = ctx.nextTasks.slice(0, 3);
    lines.push(`Next: ${tasks.join(' | ')}`);
  }

  if (ctx.openBlockers.length > 0) {
    const blockers = ctx.openBlockers.slice(0, 3);
    lines.push(`BLOCKERS: ${blockers.join(' | ')}`);
  }

  if (ctx.pendingDecisions.length > 0) {
    const decisions = ctx.pendingDecisions.slice(0, 3);
    lines.push(`Pending: ${decisions.join(' | ')}`);
  }

  return lines.join('\n');
}
