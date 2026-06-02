/**
 * Component 8: Session Report Generator
 * CRITICAL PRODUCTIVITY FEATURE
 *
 * Auto-generates Notion session wrap documents from git commits.
 * Eliminates manual session logging — saves 15-20 minutes per W05 session.
 *
 * Input: git log from current session
 * Output: structured session wrap ready for Notion
 *
 * Sections generated:
 *  1. Decisions Made (extracted from commit messages with D- prefixes)
 *  2. Files Delivered (from git diff --stat)
 *  3. Gate Status Changes (detected from commit messages)
 *  4. Git Commits (table)
 *  5. Test Results (from npm test output)
 *  6. Next Priorities (from TODO.md or manual input)
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface GitCommit {
  hash: string;
  message: string;
  date: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

export interface SessionDecision {
  number: number;
  description: string;
  dSeries?: string;    // D-nnn reference
  confirmedBy: string;
  status: 'LOCKED' | 'PENDING' | 'RESOLVED';
}

export interface FileDelivered {
  path: string;
  format: string;
  description: string;
  commit: string;
}

export interface TestResult {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}

export interface SessionReport {
  window: string;
  date: string;
  commits: GitCommit[];
  decisions: SessionDecision[];
  filesDelivered: FileDelivered[];
  testResult?: TestResult;
  nextPriorities: string[];
  totalLinesAdded: number;
  totalLinesRemoved: number;
}

// --- Git Log Parser ---

export function parseGitLog(gitLogOutput: string): GitCommit[] {
  // Expected format: git log --format="%h|%ai|%s" --stat
  const commits: GitCommit[] = [];
  const blocks = gitLogOutput.split('\n\n').filter(b => b.trim());

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    const firstLine = lines[0];
    const parts = firstLine.split('|');
    if (parts.length < 3) continue;

    const [hash, date, ...messageParts] = parts;
    const message = messageParts.join('|');

    // Parse stat line if present
    const statLine = lines[lines.length - 1];
    const statMatch = statLine.match(/(\d+)\s+file.*?(\d+)\s+insertion.*?(\d+)\s+deletion/);

    commits.push({
      hash: hash.trim(),
      message: message.trim(),
      date: date.trim(),
      filesChanged: statMatch ? parseInt(statMatch[1]) : 0,
      insertions: statMatch ? parseInt(statMatch[2]) : 0,
      deletions: statMatch ? parseInt(statMatch[3]) : 0,
    });
  }

  return commits;
}

// --- Decision Extractor ---

export function extractDecisions(commits: GitCommit[]): SessionDecision[] {
  const decisions: SessionDecision[] = [];
  let counter = 1;

  for (const commit of commits) {
    // Look for D-nnn references in commit messages
    const dMatches = commit.message.match(/D-(\d+[A-Za-z]?)/g);
    if (dMatches) {
      for (const dRef of dMatches) {
        decisions.push({
          number: counter++,
          description: commit.message,
          dSeries: dRef,
          confirmedBy: 'W05 (code implementation)',
          status: 'LOCKED',
        });
      }
    }

    // Look for gate-related commits
    if (/gate|PASSED|RESOLVED|PENDING/i.test(commit.message)) {
      if (!dMatches) {
        decisions.push({
          number: counter++,
          description: commit.message,
          confirmedBy: 'W05',
          status: commit.message.includes('PASSED') || commit.message.includes('RESOLVED') ? 'RESOLVED' : 'PENDING',
        });
      }
    }
  }

  return decisions;
}

// --- File Extractor ---

export function extractFilesDelivered(commits: GitCommit[], gitDiffOutput: string): FileDelivered[] {
  const files: FileDelivered[] = [];
  const seen = new Set<string>();

  // Parse git diff --stat output
  const lines = gitDiffOutput.split('\n').filter(l => l.includes('|'));

  for (const line of lines) {
    const match = line.match(/^\s*(.+?)\s*\|/);
    if (!match) continue;

    const path = match[1].trim();
    if (seen.has(path)) continue;
    seen.add(path);

    const ext = path.split('.').pop() || '';
    const format = ext === 'ts' ? 'TypeScript' : ext === 'html' ? 'HTML' : ext === 'md' ? 'Markdown' : ext.toUpperCase();

    // Find which commit last touched this file
    const relatedCommit = commits.find(c => c.message.toLowerCase().includes(path.split('/').pop()?.replace(`.${ext}`, '') || ''));

    files.push({
      path,
      format,
      description: relatedCommit?.message || 'Modified',
      commit: relatedCommit?.hash || commits[0]?.hash || 'unknown',
    });
  }

  return files;
}

// --- Test Result Parser ---

export function parseTestOutput(npmTestOutput: string): TestResult | undefined {
  // Parse Jest-style output: "Tests: X passed, Y failed, Z total"
  const match = npmTestOutput.match(/Tests?:\s*(\d+)\s*passed.*?(\d+)\s*(?:failed|total)/i);
  if (!match) {
    // Try alternative: "X/Y tests pass"
    const altMatch = npmTestOutput.match(/(\d+)\/(\d+)\s*tests?\s*pass/i);
    if (altMatch) {
      return {
        total: parseInt(altMatch[2]),
        passed: parseInt(altMatch[1]),
        failed: parseInt(altMatch[2]) - parseInt(altMatch[1]),
        skipped: 0,
      };
    }
    return undefined;
  }

  return {
    total: parseInt(match[2]) || parseInt(match[1]),
    passed: parseInt(match[1]),
    failed: parseInt(match[2]) - parseInt(match[1]),
    skipped: 0,
  };
}

// --- Report Generator ---

export function generateSessionReport(report: SessionReport): string {
  const lines: string[] = [];

  lines.push(`**Window:** ${report.window}`);
  lines.push(`**Date:** ${report.date}`);
  lines.push(`**Commits:** ${report.commits.length} | **Lines:** +${report.totalLinesAdded} / -${report.totalLinesRemoved}`);
  lines.push('---');

  // Section 1: Decisions
  if (report.decisions.length > 0) {
    lines.push('## Section 1 — Decisions Made');
    lines.push('| # | Decision | D-Series | Status |');
    lines.push('|---|----------|----------|--------|');
    for (const d of report.decisions) {
      lines.push(`| ${d.number} | ${d.description} | ${d.dSeries || '—'} | ${d.status} |`);
    }
    lines.push('');
  }

  // Section 2: Files Delivered
  if (report.filesDelivered.length > 0) {
    lines.push('## Section 2 — Files Delivered');
    lines.push('| File | Format | Description | Commit |');
    lines.push('|------|--------|-------------|--------|');
    for (const f of report.filesDelivered) {
      lines.push(`| \`${f.path}\` | ${f.format} | ${f.description} | \`${f.commit}\` |`);
    }
    lines.push('');
  }

  // Section 3: Git Commits
  lines.push('## Section 3 — Git Commits');
  lines.push('| # | Hash | Description |');
  lines.push('|---|------|-------------|');
  report.commits.forEach((c, i) => {
    lines.push(`| ${i + 1} | \`${c.hash}\` | ${c.message} |`);
  });
  lines.push('');

  // Section 4: Test Results
  if (report.testResult) {
    lines.push('## Section 4 — Test Results');
    lines.push(`**${report.testResult.passed}/${report.testResult.total} tests pass.**`);
    if (report.testResult.failed > 0) {
      lines.push(`**${report.testResult.failed} FAILED.**`);
    }
    lines.push('');
  }

  // Section 5: Next Priorities
  if (report.nextPriorities.length > 0) {
    lines.push('## Section 5 — Next Priorities');
    report.nextPriorities.forEach((p, i) => {
      lines.push(`${i + 1}. ${p}`);
    });
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push(`SESSION WRAP — ${report.date} — VMx ${report.window} — For Notion logging and next-session reconstruction.`);
  lines.push('DRAFT — W08 review required before any clinical content from this session is used externally.');

  return lines.join('\n');
}

// --- Git Commands (to be run via Bash) ---

export const GIT_COMMANDS = {
  /** Get commits since last session (adjust date or use tag) */
  logSinceDate: (date: string) =>
    `git log --since="${date}" --format="%h|%ai|%s" --stat`,

  /** Get commits since a specific commit */
  logSinceCommit: (hash: string) =>
    `git log ${hash}..HEAD --format="%h|%ai|%s" --stat`,

  /** Get diff stats for the session */
  diffStatSinceCommit: (hash: string) =>
    `git diff --stat ${hash}..HEAD`,

  /** Count total lines changed */
  diffNumstatSinceCommit: (hash: string) =>
    `git diff --numstat ${hash}..HEAD`,
};
