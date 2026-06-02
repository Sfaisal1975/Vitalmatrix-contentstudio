/**
 * Component 43D: Memory File Manager
 * DEV PACKAGE — Internal tooling only
 *
 * Manages Claude Code memory files (.claude/projects/{root}/memory/).
 * Reads, validates, and reports on memory state. Checks for stale files,
 * orphaned references, and suggests pruning or consolidation.
 *
 * Memory files store persistent knowledge across sessions: project identity,
 * architecture decisions, build status, environment details, and more.
 *
 * @module c43d-memory-file-manager
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A single memory file with metadata. */
export interface MemoryFile {
  /** Absolute path to the file. */
  path: string;
  /** File name without path. */
  name: string;
  /** Description extracted from the MEMORY.md index. */
  description: string;
  /** Last updated date (ISO string YYYY-MM-DD). */
  lastUpdated: string;
  /** Number of lines in the file. */
  lineCount: number;
  /** Whether the file is considered stale. */
  stale: boolean;
}

/** The complete memory index state. */
export interface MemoryIndex {
  /** All discovered memory files. */
  files: MemoryFile[];
  /** Total line count across all files. */
  totalLines: number;
  /** Files flagged as stale. */
  staleFiles: MemoryFile[];
  /** Path to the MEMORY.md index file. */
  indexFile: string;
}

/** A section parsed from MEMORY.md. */
export interface MemorySection {
  /** Section heading (e.g. 'Project', 'Architecture'). */
  heading: string;
  /** Nesting level (2 = ##, 3 = ###). */
  level: number;
  /** File references found in this section. */
  fileReferences: MemoryFileReference[];
}

/** A single file reference parsed from MEMORY.md. */
export interface MemoryFileReference {
  /** The filename as referenced in the index. */
  fileName: string;
  /** The description text after the filename. */
  description: string;
  /** The raw markdown line. */
  rawLine: string;
}

/** Validation result for the MEMORY.md index. */
export interface IndexValidationResult {
  /** Whether the index is valid. */
  valid: boolean;
  /** Files referenced in the index but not found on disc. */
  missingFiles: string[];
  /** Files on disc but not referenced in the index. */
  orphanFiles: string[];
  /** Other validation messages. */
  messages: string[];
}

/** Pruning suggestion for a memory file. */
export interface PruningSuggestion {
  /** File name. */
  fileName: string;
  /** Suggested action. */
  action: 'CONSOLIDATE' | 'REMOVE' | 'ARCHIVE' | 'UPDATE';
  /** Reason for the suggestion. */
  reason: string;
}

// --- Constants ---

/** Default staleness threshold in days. */
const DEFAULT_STALE_DAYS = 14;

/** Maximum recommended lines per memory file. */
const MAX_RECOMMENDED_LINES = 100;

/** Maximum recommended total memory lines. */
const MAX_RECOMMENDED_TOTAL = 800;

// --- Core Functions ---

/**
 * Scans a memory directory and returns metadata for each file.
 * This function builds MemoryFile objects from file paths and content.
 * In production, file I/O would be performed externally; this function
 * accepts pre-read file data.
 *
 * @param files - Array of objects with path, content, and lastModified date.
 * @returns Array of MemoryFile objects with computed metadata.
 */
export function scanMemoryDirectory(
  files: Array<{ path: string; content: string; lastModified: string }>,
): MemoryFile[] {
  return files.map(f => {
    const name = extractFileName(f.path);
    const lineCount = f.content.split('\n').length;
    const stale = checkStaleness(f.lastModified, DEFAULT_STALE_DAYS);

    return {
      path: f.path,
      name,
      description: extractFirstComment(f.content),
      lastUpdated: f.lastModified,
      lineCount,
      stale,
    };
  });
}

/**
 * Checks whether a file is stale based on its last updated date.
 *
 * @param lastUpdated - ISO date string (YYYY-MM-DD) of the file's last update.
 * @param thresholdDays - Number of days after which a file is considered stale.
 * @returns True if the file has not been updated within the threshold.
 */
export function checkStaleness(lastUpdated: string, thresholdDays: number = DEFAULT_STALE_DAYS): boolean {
  const updated = new Date(lastUpdated);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > thresholdDays;
}

/**
 * Generates a markdown report of the memory index state.
 *
 * @param index - The MemoryIndex to report on.
 * @returns Markdown-formatted report string.
 */
export function generateMemoryReport(index: MemoryIndex): string {
  const lines: string[] = [
    `# Memory File Report`,
    '',
    `**Platform:** ${VM_BRAND.platform.descriptor}`,
    `**Date:** ${new Date().toISOString().slice(0, 10)}`,
    `**Company:** ${VM_BRAND.credentials.company}`,
    '',
    '## Summary',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total files | ${index.files.length} |`,
    `| Total lines | ${index.totalLines} |`,
    `| Stale files | ${index.staleFiles.length} |`,
    `| Index file | ${index.indexFile} |`,
    '',
  ];

  if (index.totalLines > MAX_RECOMMENDED_TOTAL) {
    lines.push(
      `> **Warning:** Total line count (${index.totalLines}) exceeds recommended maximum (${MAX_RECOMMENDED_TOTAL}). Consider pruning.`,
      '',
    );
  }

  lines.push(
    '## File Details',
    '',
    '| File | Lines | Last Updated | Stale? |',
    '|------|-------|-------------|--------|',
  );

  for (const f of index.files) {
    const staleFlag = f.stale ? 'YES' : '';
    const lineWarn = f.lineCount > MAX_RECOMMENDED_LINES ? ` (>${MAX_RECOMMENDED_LINES})` : '';
    lines.push(`| ${f.name} | ${f.lineCount}${lineWarn} | ${f.lastUpdated} | ${staleFlag} |`);
  }

  lines.push('');

  if (index.staleFiles.length > 0) {
    lines.push('## Stale Files', '');
    for (const f of index.staleFiles) {
      lines.push(`- **${f.name}** — last updated ${f.lastUpdated}: ${f.description}`);
    }
    lines.push('');
  }

  lines.push(`${VM_BRAND.regulatoryFooter}`);

  return lines.join('\n');
}

/**
 * Validates the MEMORY.md index file against the actual files present.
 * Identifies missing references and orphaned files.
 *
 * @param indexContent - Raw content of the MEMORY.md file.
 * @param actualFiles - Array of file names actually present in the directory.
 * @returns IndexValidationResult with missing and orphan lists.
 */
export function validateIndexFile(
  indexContent: string,
  actualFiles: string[],
): IndexValidationResult {
  const sections = parseMemoryMd(indexContent);
  const referencedFiles = new Set<string>();
  const messages: string[] = [];

  for (const section of sections) {
    for (const ref of section.fileReferences) {
      referencedFiles.add(ref.fileName);
    }
  }

  const actualSet = new Set(actualFiles);

  const missingFiles = [...referencedFiles].filter(f => !actualSet.has(f));
  const orphanFiles = actualFiles.filter(f =>
    f !== 'MEMORY.md' && !referencedFiles.has(f)
  );

  if (missingFiles.length > 0) {
    messages.push(`${missingFiles.length} file(s) referenced in MEMORY.md but not found on disc.`);
  }
  if (orphanFiles.length > 0) {
    messages.push(`${orphanFiles.length} file(s) on disc but not referenced in MEMORY.md.`);
  }
  if (missingFiles.length === 0 && orphanFiles.length === 0) {
    messages.push('Index is fully consistent with disc contents.');
  }

  return {
    valid: missingFiles.length === 0 && orphanFiles.length === 0,
    missingFiles,
    orphanFiles,
    messages,
  };
}

/**
 * Suggests pruning actions for memory files that are oversized,
 * stale, or could be consolidated.
 *
 * @param index - The MemoryIndex to analyse.
 * @returns Array of PruningSuggestion objects.
 */
export function suggestPruning(index: MemoryIndex): PruningSuggestion[] {
  const suggestions: PruningSuggestion[] = [];

  for (const file of index.files) {
    // Stale files should be updated or archived
    if (file.stale) {
      suggestions.push({
        fileName: file.name,
        action: 'UPDATE',
        reason: `Last updated ${file.lastUpdated} — exceeds ${DEFAULT_STALE_DAYS}-day threshold.`,
      });
    }

    // Oversized files should be split
    if (file.lineCount > MAX_RECOMMENDED_LINES) {
      suggestions.push({
        fileName: file.name,
        action: 'CONSOLIDATE',
        reason: `${file.lineCount} lines exceeds recommended maximum of ${MAX_RECOMMENDED_LINES}.`,
      });
    }
  }

  // Check for files that cover similar topics (name-based heuristic)
  const nameGroups = groupByPrefix(index.files.map(f => f.name));
  for (const [prefix, names] of Object.entries(nameGroups)) {
    if (names.length >= 3) {
      suggestions.push({
        fileName: `${prefix}*`,
        action: 'CONSOLIDATE',
        reason: `${names.length} files share prefix '${prefix}'. Consider merging: ${names.join(', ')}.`,
      });
    }
  }

  // Total size warning
  if (index.totalLines > MAX_RECOMMENDED_TOTAL) {
    suggestions.push({
      fileName: 'MEMORY.md',
      action: 'ARCHIVE',
      reason: `Total memory is ${index.totalLines} lines (recommended max: ${MAX_RECOMMENDED_TOTAL}). Archive completed build sessions.`,
    });
  }

  return suggestions;
}

/**
 * Generates an update checklist based on which files are stale or
 * may need refreshing after recent session activity.
 *
 * @param index - The MemoryIndex to analyse.
 * @returns Markdown-formatted checklist string.
 */
export function generateUpdateChecklist(index: MemoryIndex): string {
  const lines: string[] = [
    `# Memory Update Checklist`,
    '',
    `**Date:** ${new Date().toISOString().slice(0, 10)}`,
    '',
  ];

  const stale = index.staleFiles;
  const oversized = index.files.filter(f => f.lineCount > MAX_RECOMMENDED_LINES);

  if (stale.length === 0 && oversized.length === 0) {
    lines.push('All memory files are current. No updates required.');
  } else {
    if (stale.length > 0) {
      lines.push('## Stale Files (need review)', '');
      for (const f of stale) {
        lines.push(`- [ ] **${f.name}** — last updated ${f.lastUpdated}`);
      }
      lines.push('');
    }

    if (oversized.length > 0) {
      lines.push('## Oversized Files (consider splitting)', '');
      for (const f of oversized) {
        lines.push(`- [ ] **${f.name}** — ${f.lineCount} lines`);
      }
      lines.push('');
    }
  }

  lines.push(`${VM_BRAND.regulatoryFooter}`);

  return lines.join('\n');
}

/**
 * Parses a MEMORY.md file into structured sections with file references.
 *
 * @param content - Raw markdown content of the MEMORY.md file.
 * @returns Array of MemorySection objects.
 */
export function parseMemoryMd(content: string): MemorySection[] {
  const lines = content.split('\n');
  const sections: MemorySection[] = [];
  let currentSection: MemorySection | null = null;

  for (const line of lines) {
    // Detect headings
    const headingMatch = line.match(/^(#{2,3})\s+(.+)/);
    if (headingMatch) {
      currentSection = {
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        fileReferences: [],
      };
      sections.push(currentSection);
      continue;
    }

    // Detect file references: - [filename.md](filename.md) — description
    const refMatch = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)\s*(?:—|--|-)\s*(.*)/);
    if (refMatch && currentSection) {
      currentSection.fileReferences.push({
        fileName: refMatch[1].trim(),
        description: refMatch[3].trim(),
        rawLine: line,
      });
      continue;
    }

    // Also match simpler format: - [filename.md](filename.md)
    const simpleRefMatch = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)/);
    if (simpleRefMatch && currentSection) {
      currentSection.fileReferences.push({
        fileName: simpleRefMatch[1].trim(),
        description: '',
        rawLine: line,
      });
    }
  }

  return sections;
}

/**
 * Builds a complete MemoryIndex from scanned files and the MEMORY.md content.
 *
 * @param files - Scanned MemoryFile objects.
 * @param indexFilePath - Path to the MEMORY.md file.
 * @returns A complete MemoryIndex.
 */
export function buildMemoryIndex(files: MemoryFile[], indexFilePath: string): MemoryIndex {
  const totalLines = files.reduce((sum, f) => sum + f.lineCount, 0);
  const staleFiles = files.filter(f => f.stale);

  return {
    files,
    totalLines,
    staleFiles,
    indexFile: indexFilePath,
  };
}

// --- Helpers ---

/**
 * Extracts the file name from a full path.
 */
function extractFileName(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] || filePath;
}

/**
 * Extracts the first comment or heading from file content as a description.
 */
function extractFirstComment(content: string): string {
  const lines = content.split('\n');

  // Try markdown heading
  for (const line of lines.slice(0, 5)) {
    const headingMatch = line.match(/^#+\s+(.+)/);
    if (headingMatch) return headingMatch[1].trim();
  }

  // Try first non-empty line
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && !trimmed.startsWith('#')) {
      return trimmed.slice(0, 100);
    }
  }

  return 'No description available';
}

/**
 * Groups file names by their common prefix (up to the first underscore).
 */
function groupByPrefix(names: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  for (const name of names) {
    const underscoreIdx = name.indexOf('_');
    if (underscoreIdx === -1) continue;

    const prefix = name.slice(0, underscoreIdx);
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(name);
  }

  return groups;
}
