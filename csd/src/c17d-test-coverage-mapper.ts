/**
 * Component 17D: Test Coverage Mapper
 *
 * Maps test files to VitalMatrix architecture elements. Scans test
 * descriptions for references to nodes (N1-N7), zones (Z1-Z5),
 * stacks (S1-S6), STRIDE rules (TS01-TS30), features (F1-F200),
 * and connections, then produces a coverage report with gaps.
 *
 * Designed for the 1041-element audit workflow — ensures every
 * architecture element has at least one test covering it.
 *
 * @module c17d-test-coverage-mapper
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Valid architecture element type categories. */
export type ElementType =
  | 'node'
  | 'zone'
  | 'stack'
  | 'stride-rule'
  | 'feature'
  | 'connection';

/** A single architecture element and its test coverage status. */
export interface CoverageEntry {
  /** Element identifier, e.g. "N1", "Z2", "S3", "TS15", "F42" */
  element: string;
  /** Category of the element */
  elementType: ElementType;
  /** Paths to test files that reference this element */
  testFiles: string[];
  /** Total number of test cases referencing this element */
  testCount: number;
  /** Whether the element has at least one test covering it */
  covered: boolean;
}

/** Aggregate coverage report across all known elements. */
export interface CoverageReport {
  /** Total number of known architecture elements */
  totalElements: number;
  /** Number of elements with at least one test */
  coveredElements: number;
  /** Number of elements with no tests */
  uncoveredElements: number;
  /** Coverage percentage (0-100) */
  coveragePercent: number;
  /** Uncovered and under-covered entries, sorted uncovered-first */
  gaps: CoverageEntry[];
  /** Full coverage map for all elements */
  allEntries: CoverageEntry[];
}

/** Input structure for test file content. */
export interface TestFileInput {
  /** Relative or absolute path to the test file */
  path: string;
  /** Full text content of the test file */
  content: string;
}

// --- Constants ---

/** Regex patterns for each architecture element type. */
const ELEMENT_PATTERNS: Record<ElementType, RegExp> = {
  node: /\bN([1-7])\b/g,
  zone: /\bZ([1-5])\b/g,
  stack: /\bS([1-6])\b/g,
  'stride-rule': /\bTS(0[1-9]|[12][0-9]|30)\b/g,
  feature: /\bF(\d{1,3})\b/g,
  connection: /\bC(\d{1,3})\b/g,
};

/**
 * Maximum valid ID for each element type.
 * Used to filter out false positives (e.g. "F999" is not a valid feature).
 */
const MAX_IDS: Record<ElementType, number> = {
  node: 7,
  zone: 5,
  stack: 6,
  'stride-rule': 30,
  feature: 200,
  connection: 200,
};

// --- Core Functions ---

/**
 * Parses a test file's content and extracts all architecture element
 * references found in test descriptions (describe/it/test blocks).
 *
 * @param content - The full text content of a test file.
 * @returns Array of unique element identifiers found (e.g. ["N1", "Z3", "TS15"]).
 */
export function parseTestFile(content: string): string[] {
  const found = new Set<string>();

  // Extract test description strings (describe, it, test, context blocks)
  const descriptionPattern = /(?:describe|it|test|context)\s*\(\s*['"`](.*?)['"`]/g;
  const descriptions: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = descriptionPattern.exec(content)) !== null) {
    descriptions.push(match[1]);
  }

  // Also scan comments for element references
  const commentPattern = /\/\/\s*(.*?)$/gm;
  while ((match = commentPattern.exec(content)) !== null) {
    descriptions.push(match[1]);
  }

  // Scan all gathered text for element references
  const fullText = descriptions.join(' ');

  for (const [elementType, pattern] of Object.entries(ELEMENT_PATTERNS) as [ElementType, RegExp][]) {
    const regex = new RegExp(pattern.source, 'g');
    let elemMatch: RegExpExecArray | null;

    while ((elemMatch = regex.exec(fullText)) !== null) {
      const id = parseInt(elemMatch[1], 10);
      if (id >= 1 && id <= MAX_IDS[elementType]) {
        // Reconstruct the canonical element identifier
        const prefix = getPrefix(elementType);
        const padded = elementType === 'stride-rule'
          ? String(id).padStart(2, '0')
          : String(id);
        found.add(`${prefix}${padded}`);
      }
    }
  }

  return Array.from(found).sort();
}

/**
 * Determines the element type for a given element identifier string.
 *
 * @param element - Element identifier, e.g. "N1", "TS15", "F42".
 * @returns The matching ElementType, or undefined if unrecognised.
 */
export function classifyElement(element: string): ElementType | undefined {
  if (/^N[1-7]$/.test(element)) return 'node';
  if (/^Z[1-5]$/.test(element)) return 'zone';
  if (/^S[1-6]$/.test(element)) return 'stack';
  if (/^TS(0[1-9]|[12][0-9]|30)$/.test(element)) return 'stride-rule';
  if (/^F\d{1,3}$/.test(element)) return 'feature';
  if (/^C\d{1,3}$/.test(element)) return 'connection';
  return undefined;
}

/**
 * Builds a complete coverage map from test file contents and a list
 * of known architecture elements.
 *
 * @param testFileContents - Array of test files with path and content.
 * @param knownElements - Array of all known element identifiers to track.
 * @returns CoverageReport with full coverage analysis.
 */
export function buildCoverageMap(
  testFileContents: TestFileInput[],
  knownElements: string[],
): CoverageReport {
  // Initialise coverage entries for all known elements
  const entryMap = new Map<string, CoverageEntry>();

  for (const element of knownElements) {
    const elementType = classifyElement(element);
    entryMap.set(element, {
      element,
      elementType: elementType ?? 'feature',
      testFiles: [],
      testCount: 0,
      covered: false,
    });
  }

  // Parse each test file and map references to elements
  for (const testFile of testFileContents) {
    const referencedElements = parseTestFile(testFile.content);

    // Count test cases in this file
    const testCasePattern = /\b(?:it|test)\s*\(/g;
    let testCaseCount = 0;
    while (testCasePattern.exec(testFile.content) !== null) {
      testCaseCount++;
    }

    for (const ref of referencedElements) {
      const entry = entryMap.get(ref);
      if (entry) {
        if (!entry.testFiles.includes(testFile.path)) {
          entry.testFiles.push(testFile.path);
        }
        entry.testCount += testCaseCount;
        entry.covered = true;
      }
    }
  }

  // Build report
  const allEntries = Array.from(entryMap.values());
  const coveredEntries = allEntries.filter((e) => e.covered);
  const uncoveredEntries = allEntries.filter((e) => !e.covered);
  const totalElements = allEntries.length;
  const coveredCount = coveredEntries.length;
  const coveragePercent = totalElements > 0
    ? Math.round((coveredCount / totalElements) * 10000) / 100
    : 0;

  // Gaps: uncovered first, then sorted by element type and ID
  const gaps = [...uncoveredEntries, ...coveredEntries.filter((e) => e.testCount < 2)]
    .sort((a, b) => {
      if (a.covered !== b.covered) return a.covered ? 1 : -1;
      return a.element.localeCompare(b.element);
    });

  return {
    totalElements,
    coveredElements: coveredCount,
    uncoveredElements: totalElements - coveredCount,
    coveragePercent,
    gaps,
    allEntries,
  };
}

/**
 * Returns all uncovered elements from a coverage report.
 *
 * @param report - A CoverageReport produced by buildCoverageMap.
 * @returns Array of element identifiers that have zero test coverage.
 */
export function getUncoveredElements(report: CoverageReport): string[] {
  return report.allEntries
    .filter((e) => !e.covered)
    .map((e) => e.element)
    .sort();
}

/**
 * Generates a Markdown coverage report sorted with uncovered elements first.
 *
 * @param report - A CoverageReport produced by buildCoverageMap.
 * @returns Markdown-formatted report string.
 */
export function generateCoverageReport(report: CoverageReport): string {
  const lines: string[] = [];

  lines.push(`# VitalMatrix Test Coverage Report`);
  lines.push('');
  lines.push(`> Generated by ${VM_BRAND.credentials.company} Content Studio`);
  lines.push(`> ${VM_BRAND.regulatoryFooter}`);
  lines.push('');
  lines.push(`## Summary`);
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Total elements | ${report.totalElements} |`);
  lines.push(`| Covered | ${report.coveredElements} |`);
  lines.push(`| Uncovered | ${report.uncoveredElements} |`);
  lines.push(`| Coverage | ${report.coveragePercent}% |`);
  lines.push('');

  // Uncovered elements
  const uncovered = report.allEntries.filter((e) => !e.covered);
  if (uncovered.length > 0) {
    lines.push(`## Uncovered Elements (${uncovered.length})`);
    lines.push('');
    lines.push(`| Element | Type |`);
    lines.push(`| --- | --- |`);
    for (const entry of uncovered.sort((a, b) => a.element.localeCompare(b.element))) {
      lines.push(`| ${entry.element} | ${entry.elementType} |`);
    }
    lines.push('');
  }

  // Covered elements grouped by type
  const covered = report.allEntries.filter((e) => e.covered);
  if (covered.length > 0) {
    lines.push(`## Covered Elements (${covered.length})`);
    lines.push('');
    lines.push(`| Element | Type | Test Files | Test Count |`);
    lines.push(`| --- | --- | --- | --- |`);
    for (const entry of covered.sort((a, b) => a.element.localeCompare(b.element))) {
      const files = entry.testFiles.length > 3
        ? `${entry.testFiles.slice(0, 3).join(', ')} +${entry.testFiles.length - 3} more`
        : entry.testFiles.join(', ');
      lines.push(`| ${entry.element} | ${entry.elementType} | ${files} | ${entry.testCount} |`);
    }
    lines.push('');
  }

  // Coverage by type
  lines.push(`## Coverage by Element Type`);
  lines.push('');
  lines.push(`| Type | Total | Covered | Percent |`);
  lines.push(`| --- | --- | --- | --- |`);

  const typeGroups = new Map<ElementType, { total: number; covered: number }>();
  for (const entry of report.allEntries) {
    const group = typeGroups.get(entry.elementType) ?? { total: 0, covered: 0 };
    group.total++;
    if (entry.covered) group.covered++;
    typeGroups.set(entry.elementType, group);
  }

  for (const [type, group] of typeGroups) {
    const pct = group.total > 0
      ? Math.round((group.covered / group.total) * 100)
      : 0;
    lines.push(`| ${type} | ${group.total} | ${group.covered} | ${pct}% |`);
  }

  lines.push('');
  return lines.join('\n');
}

// --- Internal Helpers ---

/**
 * Returns the canonical prefix for an element type.
 */
function getPrefix(elementType: ElementType): string {
  switch (elementType) {
    case 'node': return 'N';
    case 'zone': return 'Z';
    case 'stack': return 'S';
    case 'stride-rule': return 'TS';
    case 'feature': return 'F';
    case 'connection': return 'C';
  }
}
