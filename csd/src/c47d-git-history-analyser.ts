/**
 * Component 47D: Git History Analyser
 * DEV PACKAGE — Internal tooling only
 *
 * Analyses git history for patterns: commit frequency, file churn, hot files,
 * contributor patterns. Identifies risky large commits and suggests
 * improvements based on observed patterns.
 *
 * Input is raw git log output (string). No child_process calls — the caller
 * runs `git log` and passes the output in.
 *
 * @module c47d-git-history-analyser
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A parsed git commit entry. */
export interface ParsedCommit {
  /** Commit hash (short or full). */
  hash: string;
  /** Commit message (first line). */
  message: string;
  /** Author name. */
  author: string;
  /** Commit date as ISO string. */
  date: string;
  /** List of files changed in this commit. */
  filesChanged: string[];
}

/** Analysis result from git history parsing. */
export interface GitAnalysis {
  /** Period covered (e.g. '2026-05-01 to 2026-06-02'). */
  period: string;
  /** Total number of commits in the analysed log. */
  totalCommits: number;
  /** Average commits per day over the period. */
  avgCommitsPerDay: number;
  /** Files changed most frequently, sorted descending. */
  hotFiles: Array<{ path: string; changeCount: number }>;
  /** Commit count grouped by category (build, fix, refactor, etc.). */
  commitsByCategory: Record<string, number>;
  /** Commits with the most files changed. */
  largestCommits: Array<{ hash: string; message: string; filesChanged: number }>;
  /** Streak information. */
  streaks: { longestStreak: number; currentStreak: number };
}

/** A suggested improvement based on analysis. */
export interface Improvement {
  /** Category of improvement. */
  category: 'commit-size' | 'hot-file' | 'frequency' | 'naming';
  /** Human-readable suggestion. */
  suggestion: string;
  /** Severity: info, warning, or action. */
  severity: 'info' | 'warning' | 'action';
}

// --- Constants ---

/** Category keywords for commit classification. */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  build: ['build', 'feat', 'feature', 'implement', 'add', 'create'],
  fix: ['fix', 'bug', 'patch', 'hotfix', 'resolve'],
  refactor: ['refactor', 'clean', 'restructure', 'reorganise', 'simplify'],
  test: ['test', 'spec', 'coverage', 'assert'],
  docs: ['doc', 'readme', 'comment', 'jsdoc'],
  chore: ['chore', 'config', 'ci', 'lint', 'format', 'merge', 'bump'],
  audit: ['audit', 'review', 'scan', 'check', 'guard'],
};

// --- Parsing ---

/**
 * Parses raw git log output into structured commit data.
 *
 * Expected format (use `git log --pretty=format:"%H|%an|%aI|%s" --name-only`):
 * ```
 * abc123|Author Name|2026-05-15T10:00:00+01:00|commit message
 * path/to/file1.ts
 * path/to/file2.ts
 *
 * def456|Author Name|2026-05-14T09:00:00+01:00|another commit
 * path/to/file3.ts
 * ```
 *
 * @param gitLogOutput - Raw output from git log command.
 * @returns Array of parsed commit objects.
 */
export function parseGitLog(gitLogOutput: string): ParsedCommit[] {
  if (!gitLogOutput || gitLogOutput.trim().length === 0) return [];

  const commits: ParsedCommit[] = [];
  const blocks = gitLogOutput.trim().split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split('\n').filter((l) => l.length > 0);
    if (lines.length === 0) continue;

    const headerLine = lines[0];
    const parts = headerLine.split('|');
    if (parts.length < 4) continue;

    const hash = parts[0].trim();
    const author = parts[1].trim();
    const date = parts[2].trim();
    const message = parts.slice(3).join('|').trim();

    const filesChanged = lines.slice(1).map((l) => l.trim()).filter((l) => l.length > 0);

    commits.push({ hash, message, author, date, filesChanged });
  }

  return commits;
}

/**
 * Categorises a commit message into a build category.
 *
 * @param message - The commit message to categorise.
 * @returns The matched category, or 'other'.
 */
function categoriseCommit(message: string): string {
  const lower = message.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'other';
}

/**
 * Calculates the number of days between two date strings.
 */
function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.max(1, Math.ceil(Math.abs(b - a) / (1000 * 60 * 60 * 24)));
}

/**
 * Calculates commit streaks (consecutive days with at least one commit).
 */
function calculateStreaks(commits: ParsedCommit[]): { longestStreak: number; currentStreak: number } {
  if (commits.length === 0) return { longestStreak: 0, currentStreak: 0 };

  // Get unique commit dates (YYYY-MM-DD)
  const dateSet = new Set<string>();
  for (const c of commits) {
    try {
      const d = new Date(c.date);
      dateSet.add(d.toISOString().split('T')[0]);
    } catch {
      // Skip invalid dates
    }
  }

  const dates = Array.from(dateSet).sort();
  if (dates.length === 0) return { longestStreak: 0, currentStreak: 0 };

  let longestStreak = 1;
  let currentStreak = 1;
  let streak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      streak = 1;
    }

    if (streak > longestStreak) longestStreak = streak;
  }

  // Current streak: count backwards from the last date
  currentStreak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { longestStreak, currentStreak };
}

// --- Core Analysis ---

/**
 * Performs full analysis on parsed git log output.
 *
 * @param gitLogOutput - Raw git log output string.
 * @returns Complete git analysis with hot files, categories, streaks, and velocity.
 */
export function parseGitLogForAnalysis(gitLogOutput: string): GitAnalysis {
  const commits = parseGitLog(gitLogOutput);

  if (commits.length === 0) {
    return {
      period: 'No commits found',
      totalCommits: 0,
      avgCommitsPerDay: 0,
      hotFiles: [],
      commitsByCategory: {},
      largestCommits: [],
      streaks: { longestStreak: 0, currentStreak: 0 },
    };
  }

  // Period
  const dates = commits
    .map((c) => c.date)
    .filter((d) => d.length > 0)
    .sort();
  const period = dates.length >= 2
    ? `${dates[0].split('T')[0]} to ${dates[dates.length - 1].split('T')[0]}`
    : dates.length === 1
    ? dates[0].split('T')[0]
    : 'Unknown';

  // Average commits per day
  const totalDays = dates.length >= 2 ? daysBetween(dates[0], dates[dates.length - 1]) : 1;
  const avgCommitsPerDay = Math.round((commits.length / totalDays) * 100) / 100;

  // Hot files
  const fileCount: Record<string, number> = {};
  for (const commit of commits) {
    for (const file of commit.filesChanged) {
      fileCount[file] = (fileCount[file] || 0) + 1;
    }
  }
  const hotFiles = Object.entries(fileCount)
    .map(([path, changeCount]) => ({ path, changeCount }))
    .sort((a, b) => b.changeCount - a.changeCount)
    .slice(0, 20);

  // Categories
  const commitsByCategory: Record<string, number> = {};
  for (const commit of commits) {
    const cat = categoriseCommit(commit.message);
    commitsByCategory[cat] = (commitsByCategory[cat] || 0) + 1;
  }

  // Largest commits
  const largestCommits = commits
    .map((c) => ({ hash: c.hash.substring(0, 8), message: c.message, filesChanged: c.filesChanged.length }))
    .sort((a, b) => b.filesChanged - a.filesChanged)
    .slice(0, 10);

  // Streaks
  const streaks = calculateStreaks(commits);

  return {
    period,
    totalCommits: commits.length,
    avgCommitsPerDay,
    hotFiles,
    commitsByCategory,
    largestCommits,
    streaks,
  };
}

/**
 * Identifies the most frequently changed files (likely to contain bugs).
 *
 * @param gitLogOutput - Raw git log output.
 * @returns Array of hot files sorted by change count descending.
 */
export function identifyHotFiles(gitLogOutput: string): Array<{ path: string; changeCount: number }> {
  const analysis = parseGitLogForAnalysis(gitLogOutput);
  return analysis.hotFiles;
}

/**
 * Identifies commits with 10 or more files changed. These are risky
 * and may need splitting in future.
 *
 * @param gitLogOutput - Raw git log output.
 * @returns Array of large commits with 10+ files changed.
 */
export function identifyLargeCommits(
  gitLogOutput: string,
): Array<{ hash: string; message: string; filesChanged: number }> {
  const commits = parseGitLog(gitLogOutput);
  return commits
    .filter((c) => c.filesChanged.length >= 10)
    .map((c) => ({
      hash: c.hash.substring(0, 8),
      message: c.message,
      filesChanged: c.filesChanged.length,
    }))
    .sort((a, b) => b.filesChanged - a.filesChanged);
}

/**
 * Calculates commit velocity (commits per day) over a given number of days.
 *
 * @param gitLogOutput - Raw git log output.
 * @param days - Number of days to measure over.
 * @returns Commits per day over the specified period.
 */
export function calculateVelocity(gitLogOutput: string, days: number): number {
  const commits = parseGitLog(gitLogOutput);
  if (commits.length === 0 || days <= 0) return 0;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffTime = cutoff.getTime();

  const recentCommits = commits.filter((c) => {
    try {
      return new Date(c.date).getTime() >= cutoffTime;
    } catch {
      return false;
    }
  });

  return Math.round((recentCommits.length / days) * 100) / 100;
}

/**
 * Identifies patterns in the git history: busiest days, average files
 * per commit, most common categories.
 *
 * @param gitLogOutput - Raw git log output.
 * @returns Array of human-readable pattern descriptions.
 */
export function identifyPatterns(gitLogOutput: string): string[] {
  const commits = parseGitLog(gitLogOutput);
  if (commits.length === 0) return ['No commits to analyse.'];

  const patterns: string[] = [];

  // Day of week analysis
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCount: Record<string, number> = {};
  for (const c of commits) {
    try {
      const day = dayNames[new Date(c.date).getDay()];
      dayCount[day] = (dayCount[day] || 0) + 1;
    } catch {
      // Skip
    }
  }
  const busiestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1]);
  if (busiestDay.length > 0) {
    patterns.push(`Most commits on ${busiestDay[0][0]} (${busiestDay[0][1]} commits).`);
  }

  // Average files per commit
  const totalFiles = commits.reduce((sum, c) => sum + c.filesChanged.length, 0);
  const avgFiles = Math.round((totalFiles / commits.length) * 10) / 10;
  patterns.push(`Average ${avgFiles} files per commit.`);

  // Most common category
  const catCount: Record<string, number> = {};
  for (const c of commits) {
    const cat = categoriseCommit(c.message);
    catCount[cat] = (catCount[cat] || 0) + 1;
  }
  const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
  if (topCat.length > 0) {
    patterns.push(`Most common commit type: '${topCat[0][0]}' (${topCat[0][1]} commits, ${Math.round((topCat[0][1] / commits.length) * 100)}%).`);
  }

  // Hour of day analysis
  const hourCount: Record<number, number> = {};
  for (const c of commits) {
    try {
      const hour = new Date(c.date).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    } catch {
      // Skip
    }
  }
  const busiestHour = Object.entries(hourCount)
    .map(([h, count]) => ({ hour: parseInt(h, 10), count }))
    .sort((a, b) => b.count - a.count);
  if (busiestHour.length > 0) {
    const h = busiestHour[0].hour;
    patterns.push(`Most active hour: ${h.toString().padStart(2, '0')}:00-${(h + 1).toString().padStart(2, '0')}:00 (${busiestHour[0].count} commits).`);
  }

  // Single-file commits
  const singleFile = commits.filter((c) => c.filesChanged.length === 1).length;
  if (singleFile > 0) {
    patterns.push(`${singleFile} single-file commits (${Math.round((singleFile / commits.length) * 100)}% of total).`);
  }

  return patterns;
}

/**
 * Generates a comprehensive markdown report with text-based charts,
 * hot files, velocity metrics, and patterns.
 *
 * @param analysis - The GitAnalysis object to report on.
 * @returns Markdown-formatted report.
 */
export function generateGitReport(analysis: GitAnalysis): string {
  const lines: string[] = [
    `# ${VM_BRAND.credentials.company} — Git History Analysis`,
    `> ${VM_BRAND.platform.descriptor} | Period: ${analysis.period}`,
    '',
    '## Overview',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total commits | ${analysis.totalCommits} |`,
    `| Avg commits/day | ${analysis.avgCommitsPerDay} |`,
    `| Longest streak | ${analysis.streaks.longestStreak} days |`,
    `| Current streak | ${analysis.streaks.currentStreak} days |`,
    '',
  ];

  // Category breakdown (text bar chart)
  if (Object.keys(analysis.commitsByCategory).length > 0) {
    lines.push('## Commits by Category');
    lines.push('');
    lines.push('```');
    const maxCount = Math.max(...Object.values(analysis.commitsByCategory));
    const sorted = Object.entries(analysis.commitsByCategory).sort((a, b) => b[1] - a[1]);
    for (const [cat, count] of sorted) {
      const barLen = Math.max(1, Math.round((count / maxCount) * 40));
      const bar = '#'.repeat(barLen);
      lines.push(`  ${cat.padEnd(12)} ${bar} ${count}`);
    }
    lines.push('```');
    lines.push('');
  }

  // Hot files
  if (analysis.hotFiles.length > 0) {
    lines.push('## Hot Files (Most Frequently Changed)');
    lines.push('');
    lines.push('| # | File | Changes |');
    lines.push('|---|------|---------|');
    for (let i = 0; i < Math.min(analysis.hotFiles.length, 15); i++) {
      const f = analysis.hotFiles[i];
      lines.push(`| ${i + 1} | \`${f.path}\` | ${f.changeCount} |`);
    }
    lines.push('');
  }

  // Large commits
  if (analysis.largestCommits.length > 0) {
    const large = analysis.largestCommits.filter((c) => c.filesChanged >= 10);
    if (large.length > 0) {
      lines.push('## Large Commits (10+ files — review for splitting)');
      lines.push('');
      lines.push('| Hash | Files | Message |');
      lines.push('|------|-------|---------|');
      for (const c of large) {
        lines.push(`| \`${c.hash}\` | ${c.filesChanged} | ${c.message} |`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generates improvement suggestions based on the analysis results.
 *
 * @param analysis - The GitAnalysis object to evaluate.
 * @returns Array of improvement suggestions with severity ratings.
 */
export function suggestImprovements(analysis: GitAnalysis): Improvement[] {
  const improvements: Improvement[] = [];

  // Large commits
  const largeCount = analysis.largestCommits.filter((c) => c.filesChanged >= 10).length;
  if (largeCount > 0) {
    improvements.push({
      category: 'commit-size',
      suggestion: `${largeCount} commit(s) changed 10+ files. Consider splitting large commits into smaller, focused changes.`,
      severity: 'warning',
    });
  }

  // Very large commits (20+)
  const veryLarge = analysis.largestCommits.filter((c) => c.filesChanged >= 20);
  if (veryLarge.length > 0) {
    for (const c of veryLarge) {
      improvements.push({
        category: 'commit-size',
        suggestion: `Commit ${c.hash} changed ${c.filesChanged} files ("${c.message}"). This is risky — strongly consider splitting.`,
        severity: 'action',
      });
    }
  }

  // Hot files
  for (const f of analysis.hotFiles.slice(0, 5)) {
    if (f.changeCount >= 15) {
      improvements.push({
        category: 'hot-file',
        suggestion: `Hot file '${f.path}' has been changed ${f.changeCount} times. Consider refactoring to reduce churn.`,
        severity: 'warning',
      });
    } else if (f.changeCount >= 8) {
      improvements.push({
        category: 'hot-file',
        suggestion: `File '${f.path}' has been changed ${f.changeCount} times. Monitor for complexity growth.`,
        severity: 'info',
      });
    }
  }

  // Low velocity
  if (analysis.avgCommitsPerDay < 1 && analysis.totalCommits > 5) {
    improvements.push({
      category: 'frequency',
      suggestion: `Average velocity is ${analysis.avgCommitsPerDay} commits/day. Consider more frequent, smaller commits.`,
      severity: 'info',
    });
  }

  // No tests category
  if (!analysis.commitsByCategory['test'] || analysis.commitsByCategory['test'] === 0) {
    improvements.push({
      category: 'naming',
      suggestion: `No commits categorised as 'test'. Ensure test commits include 'test' in the message for traceability.`,
      severity: 'warning',
    });
  }

  return improvements;
}
