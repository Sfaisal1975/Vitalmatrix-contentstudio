/**
 * Component 40D: Session Timer
 * DEV PACKAGE — Internal tooling only
 *
 * Tracks time spent per task within a development session. Identifies which
 * activities consume the most Opus API time so they can be routed to the
 * local Qwen model instead.
 *
 * Categories classified as local-capable: scaffolding, git, file-ops, admin.
 * Categories requiring Opus: architecture, clinical, debugging.
 * Mixed categories: testing, research, documentation.
 *
 * @module c40d-session-timer
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Task category for routing classification. */
export type TimerCategory =
  | 'architecture'
  | 'clinical'
  | 'testing'
  | 'scaffolding'
  | 'git'
  | 'file-ops'
  | 'research'
  | 'debugging'
  | 'documentation'
  | 'admin';

/** Routing destination for a task. */
export type RoutingTarget = 'local' | 'opus' | 'mixed';

/** A single timed task entry. */
export interface TimerEntry {
  /** Unique identifier for this timer entry. */
  id: string;
  /** Description of the task being timed. */
  task: string;
  /** Category of work. */
  category: TimerCategory;
  /** Start time in milliseconds (Date.now()). */
  startTime: number;
  /** End time in milliseconds, undefined if still running. */
  endTime?: number;
  /** Duration in milliseconds, undefined if still running. */
  duration?: number;
  /** Whether this task could run on the local Qwen model. */
  couldBeLocal: boolean;
}

/** Aggregated session time report. */
export interface SessionTimeReport {
  /** Total session time in minutes. */
  totalMinutes: number;
  /** Time in minutes broken down by category. */
  byCategory: Record<string, number>;
  /** Entries that could have run locally on Qwen. */
  localCandidates: TimerEntry[];
  /** Entries that require Opus. */
  opusRequired: TimerEntry[];
  /** Estimated minutes that could be saved by routing to Qwen. */
  estimatedSavings: number;
}

// --- Constants ---

/** Categories that can run entirely on local Qwen. */
const LOCAL_CATEGORIES: TimerCategory[] = ['scaffolding', 'git', 'file-ops', 'admin'];

/** Categories that require Opus. */
const OPUS_CATEGORIES: TimerCategory[] = ['architecture', 'clinical', 'debugging'];

/** Categories that could go either way. */
const MIXED_CATEGORIES: TimerCategory[] = ['testing', 'research', 'documentation'];

// --- Session State ---

/** Internal log of all timer entries for the current session. */
let timerEntries: TimerEntry[] = [];

/** Counter for generating unique IDs. */
let nextId = 1;

// --- Core Functions ---

/**
 * Starts a new timer for a task.
 *
 * @param task - Description of the task.
 * @param category - Category of work being performed.
 * @returns The created TimerEntry with a running timer.
 */
export function startTimer(task: string, category: TimerCategory): TimerEntry {
  const entry: TimerEntry = {
    id: `T-${nextId++}`,
    task,
    category,
    startTime: Date.now(),
    couldBeLocal: LOCAL_CATEGORIES.includes(category),
  };

  timerEntries.push(entry);
  return entry;
}

/**
 * Stops a running timer by ID and calculates the duration.
 *
 * @param id - The timer entry ID to stop.
 * @returns The stopped TimerEntry with duration calculated, or null if not found.
 */
export function stopTimer(id: string): TimerEntry | null {
  const entry = timerEntries.find(e => e.id === id);
  if (!entry) return null;
  if (entry.endTime) return entry; // Already stopped

  entry.endTime = Date.now();
  entry.duration = entry.endTime - entry.startTime;
  return entry;
}

/**
 * Returns the currently active (running) timer, if any.
 *
 * @returns The active TimerEntry, or null if no timer is running.
 */
export function getCurrentTimer(): TimerEntry | null {
  return timerEntries.find(e => !e.endTime) || null;
}

/**
 * Returns all timer entries for the current session.
 *
 * @returns Array of all TimerEntry objects.
 */
export function getAllTimers(): TimerEntry[] {
  return [...timerEntries];
}

// --- Routing Classification ---

/**
 * Determines whether a task could run on the local Qwen model
 * or requires Opus.
 *
 * @param entry - The timer entry to classify.
 * @returns The routing target: 'local', 'opus', or 'mixed'.
 */
export function classifyForRouting(entry: TimerEntry): RoutingTarget {
  if (LOCAL_CATEGORIES.includes(entry.category)) return 'local';
  if (OPUS_CATEGORIES.includes(entry.category)) return 'opus';
  return 'mixed';
}

// --- Reporting ---

/**
 * Generates an aggregated session time report.
 *
 * @returns SessionTimeReport with time breakdown, routing analysis, and savings estimate.
 */
export function getSessionReport(): SessionTimeReport {
  const completed = timerEntries.filter(e => e.duration !== undefined);
  const byCategory: Record<string, number> = {};
  let totalMs = 0;

  for (const entry of completed) {
    const mins = (entry.duration || 0) / 60_000;
    totalMs += entry.duration || 0;
    byCategory[entry.category] = (byCategory[entry.category] || 0) + mins;
  }

  const localCandidates = completed.filter(e => classifyForRouting(e) === 'local');
  const opusRequired = completed.filter(e => classifyForRouting(e) === 'opus');

  const localMs = localCandidates.reduce((sum, e) => sum + (e.duration || 0), 0);
  const estimatedSavings = localMs / 60_000;

  return {
    totalMinutes: totalMs / 60_000,
    byCategory,
    localCandidates,
    opusRequired,
    estimatedSavings,
  };
}

/**
 * Generates a human-readable routing recommendation based on the session data.
 * Suggests which categories of work to move to Qwen for cost savings.
 *
 * @returns Markdown-formatted recommendation string.
 */
export function generateRoutingRecommendation(): string {
  const report = getSessionReport();
  const lines: string[] = [
    `# Session Routing Recommendation`,
    '',
    `**Platform:** ${VM_BRAND.platform.descriptor}`,
    `**Total session time:** ${report.totalMinutes.toFixed(1)} minutes`,
    '',
    '## Time by Category',
    '',
    '| Category | Minutes | Routing |',
    '|----------|---------|---------|',
  ];

  const sortedCategories = Object.entries(report.byCategory)
    .sort(([, a], [, b]) => b - a);

  for (const [category, minutes] of sortedCategories) {
    const routing = LOCAL_CATEGORIES.includes(category as TimerCategory)
      ? 'LOCAL (Qwen)'
      : OPUS_CATEGORIES.includes(category as TimerCategory)
        ? 'OPUS (required)'
        : 'MIXED';
    lines.push(`| ${category} | ${minutes.toFixed(1)} | ${routing} |`);
  }

  lines.push('');

  if (report.estimatedSavings > 0) {
    const localBreakdown = report.localCandidates
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + (e.duration || 0) / 60_000;
        return acc;
      }, {});

    const parts = Object.entries(localBreakdown)
      .map(([cat, mins]) => `${cat} (${mins.toFixed(0)} min)`)
      .join(' and ');

    lines.push(
      '## Recommendation',
      '',
      `Move ${parts} to Qwen = **${report.estimatedSavings.toFixed(0)} min saved**.`,
      '',
    );
  } else {
    lines.push(
      '## Recommendation',
      '',
      'No significant savings identified. All tasks required Opus-level reasoning.',
      '',
    );
  }

  lines.push(`${VM_BRAND.regulatoryFooter}`);

  return lines.join('\n');
}

/**
 * Resets the session, clearing all timer entries.
 */
export function resetSession(): void {
  timerEntries = [];
  nextId = 1;
}
