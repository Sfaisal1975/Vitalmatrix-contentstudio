/**
 * Component 42D: Build Session Planner
 * DEV PACKAGE — Internal tooling only
 *
 * Plans a build session before starting. Estimates scope, identifies
 * dependencies between tasks, flags risks, and generates a dependency-sorted
 * task sequence with natural commit points.
 *
 * Designed for VitalMatrix engine development sessions where tasks touch
 * scoring, clinical logic, architecture, and safety-critical code.
 *
 * @module c42d-build-session-planner
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Category of a build task. */
export type TaskCategory =
  | 'engine'
  | 'feature'
  | 'safety'
  | 'test'
  | 'connection'
  | 'documentation'
  | 'fix';

/** Risk level for a task. */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/** A single task within a build session plan. */
export interface BuildTask {
  /** Unique task identifier (e.g. 'BT-01'). */
  id: string;
  /** Human-readable description of the task. */
  description: string;
  /** Estimated time in minutes. */
  estimatedMinutes: number;
  /** Category of work. */
  category: TaskCategory;
  /** IDs of tasks this depends on (must complete first). */
  dependencies: string[];
  /** Risk level. */
  riskLevel: RiskLevel;
  /** Whether this task requires Opus-level reasoning. */
  requiresOpus: boolean;
}

/** A complete session plan with sorted tasks and analysis. */
export interface SessionPlan {
  /** All tasks in the plan. */
  tasks: BuildTask[];
  /** Total estimated time in minutes. */
  totalEstimatedMinutes: number;
  /** Estimated minutes requiring Opus. */
  opusMinutes: number;
  /** Estimated minutes that can run locally. */
  localMinutes: number;
  /** Summary of high-risk items. */
  riskySummary: string[];
  /** Tasks in dependency-sorted execution order. */
  suggestedOrder: BuildTask[];
}

/** A natural commit point in the task sequence. */
export interface CommitPoint {
  /** Index in the suggested order after which to commit. */
  afterTaskIndex: number;
  /** The task ID after which to commit. */
  afterTaskId: string;
  /** Suggested commit message. */
  message: string;
  /** Number of tasks completed at this point. */
  tasksCompleted: number;
}

// --- Constants ---

/** Approximate cost per Opus minute in USD (based on typical token rates). */
const OPUS_COST_PER_MINUTE_USD = 0.12;

/** Categories that inherently touch critical architecture. */
const HIGH_RISK_CATEGORIES: TaskCategory[] = ['engine', 'safety'];

/** Tags that elevate risk when found in task descriptions. */
const RISK_KEYWORDS = [
  'scoring', 'clinical', 'architecture', 'threshold', 'dampening',
  'terrainlock', 'floor formula', 'pipeline', 'cascade', 'safety',
];

// --- Core Functions ---

/**
 * Creates a session plan from a list of tasks.
 * Sorts tasks by dependencies (topological sort), calculates totals,
 * and identifies risks.
 *
 * @param tasks - Array of BuildTask objects to plan.
 * @returns A complete SessionPlan.
 */
export function createPlan(tasks: BuildTask[]): SessionPlan {
  const suggestedOrder = topologicalSort(tasks);
  const totalEstimatedMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const opusMinutes = tasks
    .filter(t => t.requiresOpus)
    .reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const localMinutes = totalEstimatedMinutes - opusMinutes;
  const riskySummary = identifyRisks({ tasks } as SessionPlan);

  return {
    tasks,
    totalEstimatedMinutes,
    opusMinutes,
    localMinutes,
    riskySummary,
    suggestedOrder,
  };
}

/**
 * Adds a task to an existing plan and recalculates.
 *
 * @param plan - The existing SessionPlan.
 * @param task - The new BuildTask to add.
 * @returns Updated SessionPlan.
 */
export function addTask(plan: SessionPlan, task: BuildTask): SessionPlan {
  return createPlan([...plan.tasks, task]);
}

/**
 * Estimates the API cost of a session plan based on Opus minutes.
 *
 * @param plan - The session plan to cost.
 * @returns Estimated cost in USD.
 */
export function estimateSessionCost(plan: SessionPlan): number {
  return plan.opusMinutes * OPUS_COST_PER_MINUTE_USD;
}

/**
 * Identifies risky tasks within a plan. A task is considered risky if:
 * - Its category is engine or safety
 * - Its description contains scoring/clinical/architecture keywords
 * - It has a HIGH risk level
 *
 * @param plan - The session plan to analyse.
 * @returns Array of risk description strings.
 */
export function identifyRisks(plan: SessionPlan): string[] {
  const risks: string[] = [];

  for (const task of plan.tasks) {
    const reasons: string[] = [];

    if (task.riskLevel === 'HIGH') {
      reasons.push('marked HIGH risk');
    }

    if (HIGH_RISK_CATEGORIES.includes(task.category)) {
      reasons.push(`category '${task.category}' is safety-critical`);
    }

    const descLower = task.description.toLowerCase();
    const matchedKeywords = RISK_KEYWORDS.filter(kw => descLower.includes(kw));
    if (matchedKeywords.length > 0) {
      reasons.push(`touches: ${matchedKeywords.join(', ')}`);
    }

    if (reasons.length > 0) {
      risks.push(`${task.id}: ${task.description} [${reasons.join('; ')}]`);
    }
  }

  return risks;
}

/**
 * Suggests natural commit points in the task sequence. A commit point
 * is placed after:
 * - Every safety task
 * - After a group of related tasks completes
 * - Every 3-5 tasks as a minimum cadence
 *
 * @param plan - The session plan to analyse.
 * @returns Array of CommitPoint objects.
 */
export function suggestBreakpoints(plan: SessionPlan): CommitPoint[] {
  const points: CommitPoint[] = [];
  const order = plan.suggestedOrder;
  let lastCommitIndex = -1;

  for (let i = 0; i < order.length; i++) {
    const task = order[i];
    const gapSinceLastCommit = i - lastCommitIndex;
    let shouldCommit = false;
    let reason = '';

    // Always commit after safety tasks
    if (task.category === 'safety') {
      shouldCommit = true;
      reason = `safety task '${task.description}' completed`;
    }

    // Commit after test tasks (natural verification point)
    if (task.category === 'test' && gapSinceLastCommit >= 2) {
      shouldCommit = true;
      reason = `tests completed for preceding tasks`;
    }

    // Category change = natural boundary
    if (i > 0 && order[i].category !== order[i - 1].category && gapSinceLastCommit >= 3) {
      shouldCommit = true;
      reason = `category switch from ${order[i - 1].category} to ${task.category}`;
    }

    // Minimum cadence: every 5 tasks
    if (gapSinceLastCommit >= 5) {
      shouldCommit = true;
      reason = `${gapSinceLastCommit} tasks since last commit`;
    }

    if (shouldCommit) {
      points.push({
        afterTaskIndex: i,
        afterTaskId: task.id,
        message: generateCommitMessage(order.slice(lastCommitIndex + 1, i + 1)),
        tasksCompleted: i + 1,
      });
      lastCommitIndex = i;
    }
  }

  // Final commit if not already included
  if (order.length > 0 && lastCommitIndex < order.length - 1) {
    points.push({
      afterTaskIndex: order.length - 1,
      afterTaskId: order[order.length - 1].id,
      message: generateCommitMessage(order.slice(lastCommitIndex + 1)),
      tasksCompleted: order.length,
    });
  }

  return points;
}

/**
 * Generates a markdown plan report with task list, time estimates,
 * risk flags, and suggested commit points.
 *
 * @param plan - The session plan to report on.
 * @returns Markdown-formatted report string.
 */
export function generatePlanReport(plan: SessionPlan): string {
  const breakpoints = suggestBreakpoints(plan);
  const cost = estimateSessionCost(plan);

  const lines: string[] = [
    `# Build Session Plan`,
    '',
    `**Platform:** ${VM_BRAND.platform.descriptor}`,
    `**Date:** ${new Date().toISOString().slice(0, 10)}`,
    `**Tasks:** ${plan.tasks.length}`,
    `**Estimated time:** ${plan.totalEstimatedMinutes} minutes`,
    `**Opus time:** ${plan.opusMinutes} min | **Local time:** ${plan.localMinutes} min`,
    `**Estimated API cost:** $${cost.toFixed(2)} USD`,
    '',
    '## Task Sequence',
    '',
    '| # | ID | Description | Est. (min) | Category | Risk | Opus? |',
    '|---|-----|-------------|-----------|----------|------|-------|',
  ];

  for (let i = 0; i < plan.suggestedOrder.length; i++) {
    const t = plan.suggestedOrder[i];
    lines.push(
      `| ${i + 1} | ${t.id} | ${t.description} | ${t.estimatedMinutes} | ${t.category} | ${t.riskLevel} | ${t.requiresOpus ? 'Yes' : 'No'} |`
    );

    // Insert commit point marker if applicable
    const bp = breakpoints.find(b => b.afterTaskIndex === i);
    if (bp) {
      lines.push(`| | | **COMMIT:** ${bp.message} | | | | |`);
    }
  }

  lines.push('');

  if (plan.riskySummary.length > 0) {
    lines.push('## Risk Flags', '');
    for (const risk of plan.riskySummary) {
      lines.push(`- ${risk}`);
    }
    lines.push('');
  }

  if (breakpoints.length > 0) {
    lines.push('## Commit Points', '');
    for (const bp of breakpoints) {
      lines.push(`- After task ${bp.afterTaskId} (#${bp.afterTaskIndex + 1}): \`${bp.message}\``);
    }
    lines.push('');
  }

  lines.push(`${VM_BRAND.regulatoryFooter}`);

  return lines.join('\n');
}

/**
 * Validates a plan against locked D-series decisions. Checks if any
 * task description references a locked decision's domain and flags
 * potential conflicts.
 *
 * @param plan - The session plan to validate.
 * @param lockedDecisions - Array of locked D-series IDs (e.g. ['D-15', 'D-38']).
 * @returns Array of conflict description strings (empty if no conflicts).
 */
export function validatePlanAgainstDecisions(
  plan: SessionPlan,
  lockedDecisions: string[],
): string[] {
  const conflicts: string[] = [];

  for (const task of plan.tasks) {
    const descLower = task.description.toLowerCase();

    for (const dId of lockedDecisions) {
      // Check if task description explicitly references a D-series decision
      if (descLower.includes(dId.toLowerCase())) {
        conflicts.push(
          `Task ${task.id} ('${task.description}') references locked decision ${dId}. ` +
          `Ensure changes do not violate this decision.`
        );
      }
    }

    // Flag tasks that mention 'change' or 'modify' alongside architecture keywords
    const modifyTerms = ['change', 'modify', 'alter', 'replace', 'rewrite', 'refactor'];
    const archTerms = ['scoring', 'pipeline', 'threshold', 'dampening', 'floor', 'terrainlock'];

    const hasModify = modifyTerms.some(t => descLower.includes(t));
    const hasArch = archTerms.some(t => descLower.includes(t));

    if (hasModify && hasArch) {
      conflicts.push(
        `Task ${task.id} ('${task.description}') may modify locked architecture. ` +
        `Review against D-series decisions before proceeding.`
      );
    }
  }

  return conflicts;
}

// --- Helpers ---

/**
 * Topological sort of tasks based on dependency order.
 * Tasks with no dependencies come first. Circular dependencies
 * are broken by placing the task at the end.
 */
function topologicalSort(tasks: BuildTask[]): BuildTask[] {
  const taskMap = new Map<string, BuildTask>();
  for (const t of tasks) {
    taskMap.set(t.id, t);
  }

  const sorted: BuildTask[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(id: string): void {
    if (visited.has(id)) return;
    if (visiting.has(id)) return; // Circular dependency — skip

    visiting.add(id);

    const task = taskMap.get(id);
    if (task) {
      for (const dep of task.dependencies) {
        if (taskMap.has(dep)) {
          visit(dep);
        }
      }
      sorted.push(task);
    }

    visiting.delete(id);
    visited.add(id);
  }

  for (const task of tasks) {
    visit(task.id);
  }

  return sorted;
}

/**
 * Generates a concise commit message from a group of completed tasks.
 */
function generateCommitMessage(tasks: BuildTask[]): string {
  if (tasks.length === 0) return 'chore: session checkpoint';
  if (tasks.length === 1) return `feat(${tasks[0].category}): ${tasks[0].description.slice(0, 60)}`;

  const categories = [...new Set(tasks.map(t => t.category))];
  const scope = categories.length === 1 ? categories[0] : 'multi';
  return `feat(${scope}): ${tasks.length} tasks — ${tasks[0].description.slice(0, 40)}...`;
}
