/**
 * Component 21D: Code Duplication Detector
 * DEV PACKAGE — Internal tooling only
 *
 * Finds duplicate logic across the VitalMatrix engine codebase.
 * Primary focus: src/connections/ directory (17 files with similar patterns)
 * but works across any set of source files.
 *
 * Algorithm: normalise lines (strip whitespace, comments), then scan for
 * blocks of N+ identical/near-identical lines across file pairs using
 * Jaccard token similarity.
 *
 * Outputs markdown reports with file pairs, similarity percentages, and
 * consolidation suggestions.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A single duplicate match between two files. */
export interface DuplicateMatch {
  /** First file path. */
  file1: string;
  /** Second file path. */
  file2: string;
  /** Line range [start, end] in file1. */
  lines1: [number, number];
  /** Line range [start, end] in file2. */
  lines2: [number, number];
  /** Similarity score 0–100. */
  similarity: number;
  /** Representative code snippet from the match. */
  snippet: string;
}

/** Full duplication report for a scan. */
export interface DuplicationReport {
  /** Total number of duplicate matches found. */
  totalMatches: number;
  /** Matches with similarity > 80%. */
  highSimilarity: DuplicateMatch[];
  /** Human-readable consolidation opportunities. */
  consolidationOpportunities: string[];
}

/** Input file descriptor. */
export interface FileInput {
  path: string;
  content: string;
}

// --- Normalisation ---

/**
 * Normalise a single line for comparison.
 * Strips leading/trailing whitespace, inline comments, and
 * collapses internal whitespace to single spaces.
 *
 * @param line - Raw source line.
 * @returns Normalised line for comparison.
 */
export function normaliseCode(line: string): string {
  let normalised = line.trim();

  // Remove single-line comments (// ...) but not URLs (://)
  normalised = normalised.replace(/(?<![:'"])\/\/.*$/, '');

  // Remove block comment fragments
  normalised = normalised.replace(/\/\*.*?\*\//g, '');

  // Collapse whitespace
  normalised = normalised.replace(/\s+/g, ' ');

  return normalised.trim();
}

// --- Tokenisation ---

/**
 * Tokenise a block of normalised lines into a set of tokens.
 * Used for Jaccard similarity calculation.
 *
 * @param lines - Array of normalised lines.
 * @returns Set of unique tokens.
 */
function tokenise(lines: string[]): Set<string> {
  const tokens = new Set<string>();
  for (const line of lines) {
    // Split on non-alphanumeric boundaries
    const parts = line.split(/[^a-zA-Z0-9_$]+/).filter(t => t.length > 0);
    for (const part of parts) {
      tokens.add(part);
    }
  }
  return tokens;
}

// --- Similarity ---

/**
 * Calculate Jaccard similarity between two code blocks.
 * Jaccard = |intersection| / |union|, scaled to 0–100.
 *
 * @param block1 - First block of normalised lines.
 * @param block2 - Second block of normalised lines.
 * @returns Similarity score 0–100.
 */
export function calculateSimilarity(block1: string[], block2: string[]): number {
  const tokens1 = tokenise(block1);
  const tokens2 = tokenise(block2);

  if (tokens1.size === 0 && tokens2.size === 0) return 100;
  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersectionSize = 0;
  for (const token of tokens1) {
    if (tokens2.has(token)) {
      intersectionSize++;
    }
  }

  const unionSize = tokens1.size + tokens2.size - intersectionSize;
  if (unionSize === 0) return 100;

  return Math.round((intersectionSize / unionSize) * 100);
}

// --- Block Extraction ---

/**
 * Extract normalised line blocks from file content.
 *
 * @param content - Raw file content.
 * @returns Array of normalised lines (preserving line indices).
 */
function extractNormalisedLines(content: string): string[] {
  return content.split('\n').map(normaliseCode);
}

/**
 * Check whether a block is trivially uninteresting (all blank,
 * all braces, all imports).
 */
function isTrivialBlock(normalisedLines: string[]): boolean {
  const nonEmpty = normalisedLines.filter(l => l.length > 0);
  if (nonEmpty.length < 3) return true;

  // All lines are just braces/brackets
  if (nonEmpty.every(l => /^[{}()\[\];,]*$/.test(l))) return true;

  // All lines are import statements
  if (nonEmpty.every(l => l.startsWith('import '))) return true;

  return false;
}

// --- Duplicate Finder ---

/**
 * Find duplicate code blocks across a set of files.
 * Scans for blocks of `minBlockSize`+ identical or near-identical
 * normalised lines across file pairs.
 *
 * @param files - Array of file inputs (path + content).
 * @param minBlockSize - Minimum block size in lines (default 5).
 * @returns Array of duplicate matches.
 */
export function findDuplicateBlocks(
  files: FileInput[],
  minBlockSize: number = 5
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];

  // Pre-process all files
  const processed = files.map(f => ({
    path: f.path,
    rawLines: f.content.split('\n'),
    normalisedLines: extractNormalisedLines(f.content),
  }));

  // Compare every pair of files
  for (let i = 0; i < processed.length; i++) {
    for (let j = i + 1; j < processed.length; j++) {
      const fileA = processed[i];
      const fileB = processed[j];

      const pairMatches = findBlockMatches(
        fileA.path, fileA.rawLines, fileA.normalisedLines,
        fileB.path, fileB.rawLines, fileB.normalisedLines,
        minBlockSize
      );

      matches.push(...pairMatches);
    }
  }

  // Sort by similarity descending
  matches.sort((a, b) => b.similarity - a.similarity);

  return matches;
}

/**
 * Find matching blocks between two files using sliding window.
 */
function findBlockMatches(
  pathA: string, rawA: string[], normA: string[],
  pathB: string, rawB: string[], normB: string[],
  minBlockSize: number
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];
  const usedRangesB = new Set<string>();

  for (let startA = 0; startA <= normA.length - minBlockSize; startA++) {
    const blockA = normA.slice(startA, startA + minBlockSize);

    if (isTrivialBlock(blockA)) continue;

    for (let startB = 0; startB <= normB.length - minBlockSize; startB++) {
      const rangeKey = `${startA}-${startB}`;
      if (usedRangesB.has(rangeKey)) continue;

      const blockB = normB.slice(startB, startB + minBlockSize);

      if (isTrivialBlock(blockB)) continue;

      const similarity = calculateSimilarity(blockA, blockB);

      if (similarity >= 60) {
        // Extend the match as far as possible
        let endA = startA + minBlockSize;
        let endB = startB + minBlockSize;

        while (
          endA < normA.length && endB < normB.length &&
          calculateSimilarity([normA[endA]], [normB[endB]]) >= 70
        ) {
          endA++;
          endB++;
        }

        // Mark overlapping ranges as used
        for (let k = startA; k < endA; k++) {
          for (let l = startB; l < endB; l++) {
            usedRangesB.add(`${k}-${l}`);
          }
        }

        const snippet = rawA.slice(startA, Math.min(startA + 5, endA)).join('\n');

        matches.push({
          file1: pathA,
          file2: pathB,
          lines1: [startA + 1, endA],
          lines2: [startB + 1, endB],
          similarity,
          snippet,
        });

        // Skip ahead in B to avoid overlapping matches
        startB = endB - 1;
      }
    }
  }

  return matches;
}

// --- Consolidation Analysis ---

/**
 * Identify consolidation opportunities from duplicate matches.
 */
function identifyConsolidationOpportunities(matches: DuplicateMatch[]): string[] {
  const opportunities: string[] = [];
  const filePairCounts = new Map<string, number>();

  for (const match of matches) {
    const key = [match.file1, match.file2].sort().join(' <-> ');
    filePairCounts.set(key, (filePairCounts.get(key) || 0) + 1);
  }

  for (const [pair, count] of filePairCounts) {
    if (count >= 3) {
      opportunities.push(
        `${pair}: ${count} duplicate blocks detected. Consider extracting shared logic into a common utility module.`
      );
    } else if (count >= 1) {
      opportunities.push(
        `${pair}: ${count} duplicate block(s). Review for potential shared abstraction.`
      );
    }
  }

  // Connections-specific advice
  const connectionMatches = matches.filter(
    m => m.file1.includes('connections') || m.file2.includes('connections')
  );

  if (connectionMatches.length >= 5) {
    opportunities.push(
      'src/connections/ directory has significant duplication. ' +
      'Consider a base connection class or shared hook/SC pattern factory.'
    );
  }

  return opportunities;
}

// --- Report Generation ---

/**
 * Generate a full duplication report.
 *
 * @param files - Array of file inputs to scan.
 * @param minBlockSize - Minimum block size (default 5).
 * @returns DuplicationReport with matches and consolidation opportunities.
 */
export function generateDuplicationReport(
  files: FileInput[],
  minBlockSize: number = 5
): DuplicationReport {
  const matches = findDuplicateBlocks(files, minBlockSize);
  const highSimilarity = matches.filter(m => m.similarity > 80);
  const consolidationOpportunities = identifyConsolidationOpportunities(matches);

  return {
    totalMatches: matches.length,
    highSimilarity,
    consolidationOpportunities,
  };
}

/**
 * Format a DuplicationReport as markdown.
 *
 * @param report - The duplication report to format.
 * @returns Markdown string suitable for session wraps or Notion.
 */
export function formatDuplicationReportMarkdown(report: DuplicationReport): string {
  const lines: string[] = [
    `# Code Duplication Report`,
    `Generated by ${VM_BRAND.platform.descriptor} Content Studio`,
    '',
    `**Total matches:** ${report.totalMatches}`,
    `**High similarity (>80%):** ${report.highSimilarity.length}`,
    '',
  ];

  if (report.highSimilarity.length > 0) {
    lines.push('## High Similarity Matches');
    lines.push('');

    for (const match of report.highSimilarity) {
      lines.push(`### ${match.similarity}% — ${shortPath(match.file1)} <-> ${shortPath(match.file2)}`);
      lines.push(`- **File 1:** ${match.file1} (lines ${match.lines1[0]}–${match.lines1[1]})`);
      lines.push(`- **File 2:** ${match.file2} (lines ${match.lines2[0]}–${match.lines2[1]})`);
      lines.push('');
      lines.push('```typescript');
      lines.push(match.snippet);
      lines.push('```');
      lines.push('');
    }
  }

  if (report.consolidationOpportunities.length > 0) {
    lines.push('## Consolidation Opportunities');
    lines.push('');
    for (const opp of report.consolidationOpportunities) {
      lines.push(`- ${opp}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Extract short filename from full path for display.
 */
function shortPath(fullPath: string): string {
  const parts = fullPath.replace(/\\/g, '/').split('/');
  return parts.slice(-2).join('/');
}
