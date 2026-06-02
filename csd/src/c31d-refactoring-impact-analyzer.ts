/**
 * Component 31D: Refactoring Impact Analyser
 * DEV PACKAGE — Internal tooling only
 *
 * Before refactoring, shows what breaks. Scans the codebase for all files
 * that import from a target file, identifies affected tests and D-series
 * decision references, and estimates the effort required.
 *
 * Pipeline context: FLINT > APEX > STRIDE > RIL > CADENCE > CIL > VISTA
 * Architecture: 7 nodes (N1–N7), 5 zones (Z1–Z5), 6 stacks (S1–S6)
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A file targeted for refactoring, plus the symbols being changed. */
export interface RefactorTarget {
  /** Absolute or relative path to the file being refactored. */
  file: string;
  /** Exported symbols that will be renamed, removed, or changed. */
  symbolsToChange: string[];
}

/** An individual file affected by the refactor. */
export interface AffectedFile {
  /** Path of the affected file. */
  path: string;
  /** Symbols it imports from the target. */
  importedSymbols: string[];
}

/** Full impact assessment for a refactoring target. */
export interface RefactorImpact {
  /** The file being refactored. */
  targetFile: string;
  /** All files that import from the target. */
  affectedFiles: AffectedFile[];
  /** Test files that reference the target. */
  affectedTests: string[];
  /** D-series decision identifiers found in the target file. */
  affectedDecisions: string[];
  /** Overall breaking risk. */
  breakingRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  /** Estimated effort to complete the refactor. */
  estimatedEffort: 'hours' | 'session' | 'multi-session';
}

/** Simple file descriptor for analysis. */
export interface FileDescriptor {
  /** File path. */
  path: string;
  /** File content. */
  content: string;
}

// --- Constants ---

/** Thresholds for risk classification based on affected file count. */
const RISK_THRESHOLDS = {
  HIGH: 10,
  MEDIUM: 4,
} as const;

/** Thresholds for effort estimation based on affected file count. */
const EFFORT_THRESHOLDS = {
  MULTI_SESSION: 15,
  SESSION: 5,
} as const;

// --- Core Functions ---

/**
 * Extract the module name from a file path for import matching.
 * Converts `/path/to/my-module.ts` to `./my-module` style patterns.
 *
 * @param filePath - Full file path.
 * @returns The bare module name without extension.
 */
function extractModuleName(filePath: string): string {
  const normalised = filePath.replace(/\\/g, '/');
  const withoutExt = normalised.replace(/\.(ts|js|tsx|jsx)$/, '');
  const parts = withoutExt.split('/');
  return parts[parts.length - 1];
}

/**
 * Parse import statements from file content and return imported symbols
 * if the import references the target module.
 *
 * @param content - Source file content.
 * @param targetModuleName - Module name to match against.
 * @returns Array of imported symbol names, empty if no match.
 */
function parseImportsFromTarget(content: string, targetModuleName: string): string[] {
  const symbols: string[] = [];

  // Match named imports: import { Foo, Bar } from './target'
  const namedImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = namedImportRegex.exec(content)) !== null) {
    const importPath = match[2];
    const importModule = extractModuleName(importPath);

    if (importModule === targetModuleName) {
      const names = match[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0].trim());
      symbols.push(...names.filter((n) => n.length > 0));
    }
  }

  // Match namespace/default imports: import * as X from './target'
  const namespaceRegex = /import\s+\*\s+as\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g;
  while ((match = namespaceRegex.exec(content)) !== null) {
    const importModule = extractModuleName(match[2]);
    if (importModule === targetModuleName) {
      symbols.push(`* as ${match[1]}`);
    }
  }

  // Match default imports: import X from './target'
  const defaultRegex = /import\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g;
  while ((match = defaultRegex.exec(content)) !== null) {
    const importModule = extractModuleName(match[2]);
    if (importModule === targetModuleName) {
      symbols.push(match[1]);
    }
  }

  return symbols;
}

/**
 * Analyse the impact of refactoring a target file across the entire codebase.
 * Scans all provided files for imports of the target's exported symbols.
 *
 * @param target - The refactor target (file + symbols to change).
 * @param allFiles - All files in the codebase to scan.
 * @returns Full refactoring impact assessment.
 */
export function analyzeRefactorImpact(
  target: RefactorTarget,
  allFiles: FileDescriptor[],
): RefactorImpact {
  const targetModuleName = extractModuleName(target.file);
  const affectedFiles: AffectedFile[] = [];
  const affectedTests: string[] = [];

  // Find the target file content for decision scanning
  const targetFileDescriptor = allFiles.find(
    (f) => f.path === target.file || extractModuleName(f.path) === targetModuleName,
  );
  const affectedDecisions = targetFileDescriptor
    ? findRelatedDecisions(target, [targetFileDescriptor])
    : [];

  for (const file of allFiles) {
    // Skip self
    if (file.path === target.file) continue;

    const importedSymbols = parseImportsFromTarget(file.content, targetModuleName);

    if (importedSymbols.length === 0) continue;

    // Check if any of the imported symbols overlap with changed symbols
    const overlapping = importedSymbols.filter(
      (sym) => target.symbolsToChange.includes(sym) || target.symbolsToChange.length === 0,
    );

    if (overlapping.length > 0 || target.symbolsToChange.length === 0) {
      const affected: AffectedFile = {
        path: file.path,
        importedSymbols: overlapping.length > 0 ? overlapping : importedSymbols,
      };
      affectedFiles.push(affected);

      // Track test files separately
      if (isTestFile(file.path)) {
        affectedTests.push(file.path);
      }
    }
  }

  // Also find tests that aren't in allFiles but match by convention
  const testFiles = allFiles.filter((f) => isTestFile(f.path));
  const additionalTests = findAffectedTests(target, testFiles);
  for (const t of additionalTests) {
    if (!affectedTests.includes(t)) {
      affectedTests.push(t);
    }
  }

  const breakingRisk = classifyRisk(affectedFiles.length);
  const estimatedEffort = estimateEffort({
    targetFile: target.file,
    affectedFiles,
    affectedTests,
    affectedDecisions,
    breakingRisk,
    estimatedEffort: 'hours', // placeholder, will be replaced
  });

  return {
    targetFile: target.file,
    affectedFiles,
    affectedTests,
    affectedDecisions,
    breakingRisk,
    estimatedEffort,
  };
}

/**
 * Determine whether a file path represents a test file.
 *
 * @param path - File path to check.
 * @returns True if the file is a test file.
 */
function isTestFile(path: string): boolean {
  const normalised = path.replace(/\\/g, '/');
  return /\.(test|spec)\.(ts|js|tsx|jsx)$/.test(normalised);
}

/**
 * Find test files that import from or reference the refactor target.
 *
 * @param target - The refactor target.
 * @param testFiles - Array of test file descriptors.
 * @returns Paths of affected test files.
 */
export function findAffectedTests(
  target: RefactorTarget,
  testFiles: FileDescriptor[],
): string[] {
  const targetModuleName = extractModuleName(target.file);
  const affected: string[] = [];

  for (const testFile of testFiles) {
    const imported = parseImportsFromTarget(testFile.content, targetModuleName);
    if (imported.length > 0) {
      affected.push(testFile.path);
      continue;
    }

    // Also check for string references to the target file name
    if (testFile.content.includes(targetModuleName)) {
      affected.push(testFile.path);
    }
  }

  return affected;
}

/**
 * Find D-series decision references (D-01 through D-999) within files
 * related to the refactor target.
 *
 * @param target - The refactor target.
 * @param files - Files to scan for decision references.
 * @returns Array of unique D-series identifiers (e.g., ['D-193', 'D-232']).
 */
export function findRelatedDecisions(
  target: RefactorTarget,
  files: FileDescriptor[],
): string[] {
  const decisions = new Set<string>();
  const dSeriesRegex = /D-(\d{1,3})\b/g;

  for (const file of files) {
    let match: RegExpExecArray | null;
    while ((match = dSeriesRegex.exec(file.content)) !== null) {
      decisions.add(match[0]);
    }
  }

  return Array.from(decisions).sort((a, b) => {
    const numA = parseInt(a.replace('D-', ''), 10);
    const numB = parseInt(b.replace('D-', ''), 10);
    return numA - numB;
  });
}

/**
 * Classify breaking risk based on the number of affected files.
 *
 * @param affectedCount - Number of files affected.
 * @returns Risk classification.
 */
function classifyRisk(affectedCount: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (affectedCount >= RISK_THRESHOLDS.HIGH) return 'HIGH';
  if (affectedCount >= RISK_THRESHOLDS.MEDIUM) return 'MEDIUM';
  return 'LOW';
}

/**
 * Estimate the effort required to complete a refactor based on its impact.
 *
 * @param impact - The refactoring impact assessment.
 * @returns Effort classification.
 */
export function estimateEffort(impact: RefactorImpact): 'hours' | 'session' | 'multi-session' {
  const totalAffected = impact.affectedFiles.length + impact.affectedTests.length;

  if (totalAffected >= EFFORT_THRESHOLDS.MULTI_SESSION) return 'multi-session';
  if (totalAffected >= EFFORT_THRESHOLDS.SESSION) return 'session';
  return 'hours';
}

/**
 * Generate a human-readable markdown impact report for a refactor.
 *
 * Includes: risk level, affected files list, test updates needed,
 * decision references, and estimated effort.
 *
 * @param impact - The refactoring impact assessment.
 * @returns Markdown-formatted report string.
 */
export function generateImpactReport(impact: RefactorImpact): string {
  const lines: string[] = [];

  lines.push(`# Refactoring Impact Report`);
  lines.push('');
  lines.push(`**${VM_BRAND.platform.descriptor}** -- ${VM_BRAND.credentials.company}`);
  lines.push('');
  lines.push(`## Target`);
  lines.push('');
  lines.push(`- **File:** \`${impact.targetFile}\``);
  lines.push(`- **Risk Level:** ${impact.breakingRisk}`);
  lines.push(`- **Estimated Effort:** ${impact.estimatedEffort}`);
  lines.push('');

  // Affected files
  lines.push(`## Affected Files (${impact.affectedFiles.length})`);
  lines.push('');
  if (impact.affectedFiles.length === 0) {
    lines.push('No files affected -- safe to refactor.');
  } else {
    for (const af of impact.affectedFiles) {
      lines.push(`- \`${af.path}\``);
      lines.push(`  - Imports: ${af.importedSymbols.map((s) => `\`${s}\``).join(', ')}`);
    }
  }
  lines.push('');

  // Test updates
  lines.push(`## Test Updates Required (${impact.affectedTests.length})`);
  lines.push('');
  if (impact.affectedTests.length === 0) {
    lines.push('No test files affected.');
  } else {
    for (const t of impact.affectedTests) {
      lines.push(`- \`${t}\``);
    }
  }
  lines.push('');

  // Decision references
  lines.push(`## D-Series Decision References (${impact.affectedDecisions.length})`);
  lines.push('');
  if (impact.affectedDecisions.length === 0) {
    lines.push('No decision references found in target file.');
  } else {
    lines.push('The following decisions are referenced and may need review:');
    lines.push('');
    for (const d of impact.affectedDecisions) {
      lines.push(`- ${d}`);
    }
  }
  lines.push('');

  // Effort summary
  lines.push(`## Effort Estimate`);
  lines.push('');
  switch (impact.estimatedEffort) {
    case 'hours':
      lines.push('This refactor can be completed within a few hours.');
      break;
    case 'session':
      lines.push('This refactor requires a full session to complete safely.');
      break;
    case 'multi-session':
      lines.push('This refactor spans multiple sessions. Consider breaking it into phases.');
      break;
  }
  lines.push('');

  // Risk guidance
  if (impact.breakingRisk === 'HIGH') {
    lines.push('> **WARNING:** High breaking risk. Run full test suite after each change.');
    lines.push('> Consider incremental refactoring with intermediate commits.');
    lines.push('');
  }

  lines.push('---');
  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}
