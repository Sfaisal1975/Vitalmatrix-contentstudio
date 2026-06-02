/**
 * Component 18D: Commit Message Generator
 *
 * Analyses staged git changes and generates structured commit messages
 * following the VitalMatrix project convention. Detects engine layers
 * (L1-L9), feature references, D-series decisions, and file categories
 * (connection/stride/safety/intake/test).
 *
 * All generated commits include the Co-Authored-By trailer for Claude
 * Opus 4.6 (1M context) as per project convention.
 *
 * @module c18d-commit-message-generator
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Status of a staged file change. */
export type ChangeStatus = 'added' | 'modified' | 'deleted';

/** Represents a single staged file change with its diff content. */
export interface StagedChange {
  /** File path relative to repository root */
  file: string;
  /** The type of change */
  status: ChangeStatus;
  /** The diff content (unified format) */
  diff: string;
}

/** A structured commit message with metadata. */
export interface CommitMessage {
  /** First line — category + short description (max 72 chars) */
  subject: string;
  /** Detailed body with changes, impacts, and context */
  body: string;
  /** D-series decision references found in the changes */
  dSeriesRefs: string[];
  /** Co-author attribution line */
  coAuthor: string;
}

/** Classification of a changed file into a project category. */
export type FileCategory =
  | 'connection'
  | 'stride'
  | 'safety'
  | 'intake'
  | 'engine'
  | 'test'
  | 'config'
  | 'type'
  | 'utility'
  | 'content-studio'
  | 'unknown';

/** Internal analysis result for a set of staged changes. */
export interface ChangeAnalysis {
  /** Engine layers touched (e.g. ["L1", "L3", "L7"]) */
  engineLayers: string[];
  /** Feature IDs referenced (e.g. ["F42", "F108"]) */
  features: string[];
  /** D-series decision references (e.g. ["D-193", "D-232"]) */
  dSeriesRefs: string[];
  /** File categories involved */
  categories: FileCategory[];
  /** Count of files by status */
  statusCounts: Record<ChangeStatus, number>;
  /** Total number of changed files */
  totalFiles: number;
  /** Node references found (e.g. ["N1", "N3"]) */
  nodeRefs: string[];
  /** STRIDE rule references (e.g. ["TS01", "TS15"]) */
  strideRefs: string[];
}

// --- Constants ---

const CO_AUTHOR = 'Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>';

/** Maps file path patterns to categories. */
const CATEGORY_PATTERNS: { pattern: RegExp; category: FileCategory }[] = [
  { pattern: /\/connections?\//i, category: 'connection' },
  { pattern: /\/stride\//i, category: 'stride' },
  { pattern: /\/safety\//i, category: 'safety' },
  { pattern: /\/intake/i, category: 'intake' },
  { pattern: /\/l[1-9]\//i, category: 'engine' },
  { pattern: /\.test\.|\.spec\.|__tests__/i, category: 'test' },
  { pattern: /tsconfig|package\.json|\.eslint|\.prettier/i, category: 'config' },
  { pattern: /\/types?\//i, category: 'type' },
  { pattern: /\/utils?\//i, category: 'utility' },
  { pattern: /content-studio/i, category: 'content-studio' },
];

/** Maps categories to commit message prefixes. */
const CATEGORY_PREFIXES: Record<FileCategory, string> = {
  connection: 'Connection',
  stride: 'STRIDE',
  safety: 'Safety',
  intake: 'INTAKE',
  engine: 'Engine',
  test: 'Test',
  config: 'Config',
  type: 'Types',
  utility: 'Util',
  'content-studio': 'Studio',
  unknown: 'Misc',
};

// --- Core Functions ---

/**
 * Categorises a file path into one of the project's file categories.
 *
 * @param file - The file path (relative or absolute).
 * @returns The matching FileCategory.
 */
export function categorizeChange(file: string): FileCategory {
  // Normalise path separators
  const normalised = file.replace(/\\/g, '/');

  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(normalised)) {
      return category;
    }
  }

  return 'unknown';
}

/**
 * Analyses a set of staged changes to extract metadata: engine layers,
 * features, D-series references, categories, and node/STRIDE references.
 *
 * @param changes - Array of staged file changes with diffs.
 * @returns ChangeAnalysis with all extracted metadata.
 */
export function analyzeStagedChanges(changes: StagedChange[]): ChangeAnalysis {
  const engineLayers = new Set<string>();
  const features = new Set<string>();
  const dSeriesRefs = new Set<string>();
  const categories = new Set<FileCategory>();
  const nodeRefs = new Set<string>();
  const strideRefs = new Set<string>();
  const statusCounts: Record<ChangeStatus, number> = { added: 0, modified: 0, deleted: 0 };

  for (const change of changes) {
    statusCounts[change.status]++;

    // Categorise the file
    const category = categorizeChange(change.file);
    categories.add(category);

    // Extract engine layer from path
    const layerMatch = change.file.match(/\/l([1-9])\//i);
    if (layerMatch) {
      engineLayers.add(`L${layerMatch[1]}`);
    }

    // Scan diff + file path for references
    const fullText = `${change.file}\n${change.diff}`;

    // Feature references (F1-F200)
    const featurePattern = /\bF(\d{1,3})\b/g;
    let match: RegExpExecArray | null;
    while ((match = featurePattern.exec(fullText)) !== null) {
      const id = parseInt(match[1], 10);
      if (id >= 1 && id <= 200) {
        features.add(`F${id}`);
      }
    }

    // D-series decision references (D-1 to D-999)
    const dSeriesPattern = /\bD-(\d{1,3})\b/g;
    while ((match = dSeriesPattern.exec(fullText)) !== null) {
      dSeriesRefs.add(`D-${match[1]}`);
    }

    // Node references (N1-N7)
    const nodePattern = /\bN([1-7])\b/g;
    while ((match = nodePattern.exec(fullText)) !== null) {
      nodeRefs.add(`N${match[1]}`);
    }

    // STRIDE rule references (TS01-TS30)
    const stridePattern = /\bTS(0[1-9]|[12][0-9]|30)\b/g;
    while ((match = stridePattern.exec(fullText)) !== null) {
      strideRefs.add(`TS${match[1]}`);
    }
  }

  return {
    engineLayers: Array.from(engineLayers).sort(),
    features: Array.from(features).sort(),
    dSeriesRefs: Array.from(dSeriesRefs).sort(),
    categories: Array.from(categories),
    statusCounts,
    totalFiles: changes.length,
    nodeRefs: Array.from(nodeRefs).sort(),
    strideRefs: Array.from(strideRefs).sort(),
  };
}

/**
 * Generates a structured commit message from staged changes, following
 * the VitalMatrix project convention:
 *
 *   Category: short description
 *
 *   Detailed body
 *
 *   Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
 *
 * @param changes - Array of staged file changes with diffs.
 * @returns CommitMessage with subject, body, D-series refs, and co-author.
 */
export function generateCommitMessage(changes: StagedChange[]): CommitMessage {
  const analysis = analyzeStagedChanges(changes);

  // Determine the primary category (most common, or most specific)
  const primaryCategory = determinePrimaryCategory(analysis.categories);
  const prefix = CATEGORY_PREFIXES[primaryCategory];

  // Build subject line
  const subject = buildSubject(prefix, analysis);

  // Build body
  const bodyLines: string[] = [];

  // File summary
  const fileSummary: string[] = [];
  if (analysis.statusCounts.added > 0) fileSummary.push(`${analysis.statusCounts.added} added`);
  if (analysis.statusCounts.modified > 0) fileSummary.push(`${analysis.statusCounts.modified} modified`);
  if (analysis.statusCounts.deleted > 0) fileSummary.push(`${analysis.statusCounts.deleted} deleted`);
  bodyLines.push(`Files: ${fileSummary.join(', ')} (${analysis.totalFiles} total)`);

  // Engine layers
  if (analysis.engineLayers.length > 0) {
    bodyLines.push(`Engine layers: ${analysis.engineLayers.join(', ')}`);
  }

  // Architecture references
  if (analysis.nodeRefs.length > 0) {
    bodyLines.push(`Nodes: ${analysis.nodeRefs.join(', ')}`);
  }
  if (analysis.strideRefs.length > 0) {
    bodyLines.push(`STRIDE rules: ${analysis.strideRefs.join(', ')}`);
  }
  if (analysis.features.length > 0) {
    bodyLines.push(`Features: ${analysis.features.join(', ')}`);
  }

  // D-series references
  if (analysis.dSeriesRefs.length > 0) {
    bodyLines.push(`D-series: ${analysis.dSeriesRefs.join(', ')}`);
  }

  // Categories touched
  if (analysis.categories.length > 1) {
    bodyLines.push(`Categories: ${analysis.categories.join(', ')}`);
  }

  // Changed files list (truncated if too many)
  bodyLines.push('');
  bodyLines.push('Changed files:');
  const fileLimit = 15;
  const fileList = changes.slice(0, fileLimit);
  for (const change of fileList) {
    const statusIcon = change.status === 'added' ? 'A' : change.status === 'deleted' ? 'D' : 'M';
    bodyLines.push(`  ${statusIcon} ${change.file}`);
  }
  if (changes.length > fileLimit) {
    bodyLines.push(`  ... and ${changes.length - fileLimit} more files`);
  }

  const body = bodyLines.join('\n');

  return {
    subject,
    body,
    dSeriesRefs: analysis.dSeriesRefs,
    coAuthor: CO_AUTHOR,
  };
}

/**
 * Formats a CommitMessage into the final string ready for git commit -m.
 *
 * @param msg - The CommitMessage to format.
 * @returns Full commit message string with subject, body, and co-author.
 */
export function formatCommitMessage(msg: CommitMessage): string {
  return `${msg.subject}\n\n${msg.body}\n\n${msg.coAuthor}`;
}

// --- Internal Helpers ---

/**
 * Determines the primary category from a set of file categories.
 * Prioritises more specific categories over generic ones.
 */
function determinePrimaryCategory(categories: FileCategory[]): FileCategory {
  // Priority order — most specific first
  const priority: FileCategory[] = [
    'stride',
    'safety',
    'intake',
    'connection',
    'engine',
    'content-studio',
    'type',
    'test',
    'utility',
    'config',
    'unknown',
  ];

  for (const cat of priority) {
    if (categories.includes(cat)) return cat;
  }

  return categories[0] ?? 'unknown';
}

/**
 * Builds the subject line from analysis results.
 * Keeps it under 72 characters.
 */
function buildSubject(prefix: string, analysis: ChangeAnalysis): string {
  const parts: string[] = [];

  // Action verb based on status distribution
  if (analysis.statusCounts.added > 0 && analysis.statusCounts.modified === 0 && analysis.statusCounts.deleted === 0) {
    parts.push('add');
  } else if (analysis.statusCounts.deleted > 0 && analysis.statusCounts.added === 0 && analysis.statusCounts.modified === 0) {
    parts.push('remove');
  } else if (analysis.statusCounts.modified > 0 && analysis.statusCounts.added === 0) {
    parts.push('update');
  } else {
    parts.push('update');
  }

  // Context from analysis
  if (analysis.features.length === 1) {
    parts.push(`${analysis.features[0]}`);
  } else if (analysis.features.length > 1) {
    parts.push(`${analysis.features.length} features`);
  }

  if (analysis.engineLayers.length === 1) {
    parts.push(`in ${analysis.engineLayers[0]}`);
  } else if (analysis.engineLayers.length > 1) {
    parts.push(`across ${analysis.engineLayers.join('/')}`);
  }

  if (analysis.strideRefs.length > 0 && analysis.strideRefs.length <= 3) {
    parts.push(`(${analysis.strideRefs.join(', ')})`);
  }

  const description = parts.join(' ');
  const subject = `${prefix}: ${description}`;

  // Truncate to 72 chars
  if (subject.length > 72) {
    return subject.slice(0, 69) + '...';
  }

  return subject;
}
