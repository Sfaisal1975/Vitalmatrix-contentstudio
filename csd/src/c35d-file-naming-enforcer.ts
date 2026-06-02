/**
 * Component 35D: File Naming Enforcer
 * DEV PACKAGE — Internal tooling only
 *
 * Validates file naming conventions across the VitalMatrix engine codebase.
 * Enforces kebab-case for source files, correct directory placement for
 * connections, engines, safety, and stride modules, and correct test
 * file suffixes.
 *
 * Convention reference:
 *   - Source files: kebab-case, .ts extension
 *   - Test files: .test.ts or .spec.ts suffix
 *   - Connection files: src/connections/ directory
 *   - Engine files: src/l1-l9/ with l[0-9]- prefix
 *   - Safety files: src/safety/ directory
 *   - Stride files: src/stride/ directory
 *
 * Pipeline context: FLINT > APEX > STRIDE > RIL > CADENCE > CIL > VISTA
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Severity of a naming violation. */
export type ViolationSeverity = 'ERROR' | 'WARNING';

/** A single file naming violation. */
export interface NamingViolation {
  /** File path that violates the convention. */
  file: string;
  /** Description of the violation. */
  violation: string;
  /** What the file name/path should be. */
  expected: string;
  /** Severity of the violation. */
  severity: ViolationSeverity;
}

// --- Constants ---

/** Pattern for valid kebab-case file names (without extension). */
const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Valid test file suffixes. */
const TEST_SUFFIXES = ['.test.ts', '.spec.ts', '.test.js', '.spec.js'];

/** Directory rules: files matching a content pattern must live in the right directory. */
const DIRECTORY_RULES: Array<{
  /** Directory path fragment to match. */
  directory: string;
  /** Human-readable rule name. */
  ruleName: string;
  /** File name prefix required within this directory. */
  requiredPrefix?: RegExp;
}> = [
  { directory: 'src/connections/', ruleName: 'connection files' },
  { directory: 'src/l1-l9/', ruleName: 'engine files', requiredPrefix: /^l[0-9]-/ },
  { directory: 'src/safety/', ruleName: 'safety files' },
  { directory: 'src/stride/', ruleName: 'stride files' },
];

// --- Helpers ---

/**
 * Normalise a file path to use forward slashes.
 *
 * @param filePath - Raw file path.
 * @returns Normalised path with forward slashes.
 */
function normalisePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

/**
 * Extract the file name without extension from a path.
 *
 * @param filePath - Normalised file path.
 * @returns File name stem (without extension).
 */
function extractStem(filePath: string): string {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1];

  // Remove known multi-part extensions first
  for (const suffix of TEST_SUFFIXES) {
    if (fileName.endsWith(suffix)) {
      return fileName.slice(0, -suffix.length);
    }
  }

  // Remove single extension
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
}

/**
 * Extract the file name (with extension) from a path.
 *
 * @param filePath - Normalised file path.
 * @returns File name with extension.
 */
function extractFileName(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1];
}

/**
 * Check whether a file path is a test file.
 *
 * @param filePath - Normalised file path.
 * @returns True if the file has a test suffix.
 */
function isTestFile(filePath: string): boolean {
  return TEST_SUFFIXES.some((suffix) => filePath.endsWith(suffix));
}

/**
 * Convert a string to kebab-case.
 *
 * @param input - Input string (camelCase, PascalCase, snake_case, etc.).
 * @returns Kebab-case string.
 */
function toKebabCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// --- Core Functions ---

/**
 * Validate a single file path against all naming conventions.
 *
 * Checks:
 *   - Kebab-case naming
 *   - Correct directory placement
 *   - Correct prefix for engine files
 *   - No spaces in file name
 *   - No uppercase characters in file name
 *   - Correct test file suffix
 *
 * @param filePath - File path to validate.
 * @returns Array of violations found (empty if valid).
 */
export function validateFileName(filePath: string): NamingViolation[] {
  const violations: NamingViolation[] = [];
  const normalised = normalisePath(filePath);
  const fileName = extractFileName(normalised);
  const stem = extractStem(normalised);

  // Check for spaces
  if (fileName.includes(' ')) {
    violations.push({
      file: filePath,
      violation: 'File name contains spaces.',
      expected: fileName.replace(/\s+/g, '-'),
      severity: 'ERROR',
    });
  }

  // Check for uppercase characters in the file name (excluding path components)
  if (/[A-Z]/.test(fileName)) {
    violations.push({
      file: filePath,
      violation: 'File name contains uppercase characters.',
      expected: fileName.toLowerCase(),
      severity: 'ERROR',
    });
  }

  // Check kebab-case on the stem
  if (!KEBAB_CASE_REGEX.test(stem)) {
    const suggested = toKebabCase(stem);
    violations.push({
      file: filePath,
      violation: `File name stem "${stem}" is not valid kebab-case.`,
      expected: suggested + (isTestFile(normalised) ? '.test.ts' : '.ts'),
      severity: 'ERROR',
    });
  }

  // Check test file suffix
  if (
    (normalised.includes('/test') || normalised.includes('/__tests__') || stem.endsWith('test') || stem.endsWith('spec')) &&
    !isTestFile(normalised)
  ) {
    violations.push({
      file: filePath,
      violation: 'Test file does not use .test.ts or .spec.ts suffix.',
      expected: `${stem}.test.ts`,
      severity: 'WARNING',
    });
  }

  // Check directory-specific rules
  for (const rule of DIRECTORY_RULES) {
    if (normalised.includes(rule.directory)) {
      // Check required prefix
      if (rule.requiredPrefix && !rule.requiredPrefix.test(fileName)) {
        violations.push({
          file: filePath,
          violation: `File in ${rule.directory} must match prefix pattern ${rule.requiredPrefix.source}.`,
          expected: `${rule.directory}l[0-9]-${stem}.ts`,
          severity: 'ERROR',
        });
      }
    }
  }

  // Check for files that look like they belong in a specific directory but are not
  if (/^connection[-_]/.test(stem) && !normalised.includes('src/connections/')) {
    violations.push({
      file: filePath,
      violation: 'Connection file is not in the src/connections/ directory.',
      expected: `src/connections/${fileName}`,
      severity: 'WARNING',
    });
  }

  if (/^stride[-_]/.test(stem) && !normalised.includes('src/stride/')) {
    violations.push({
      file: filePath,
      violation: 'Stride file is not in the src/stride/ directory.',
      expected: `src/stride/${fileName}`,
      severity: 'WARNING',
    });
  }

  if (/^safety[-_]/.test(stem) && !normalised.includes('src/safety/')) {
    violations.push({
      file: filePath,
      violation: 'Safety file is not in the src/safety/ directory.',
      expected: `src/safety/${fileName}`,
      severity: 'WARNING',
    });
  }

  return violations;
}

/**
 * Validate an array of file paths in batch.
 *
 * @param files - Array of file paths to validate.
 * @returns Array of all violations across all files.
 */
export function validateDirectory(files: string[]): NamingViolation[] {
  const allViolations: NamingViolation[] = [];

  for (const file of files) {
    const violations = validateFileName(file);
    allViolations.push(...violations);
  }

  return allViolations;
}

/**
 * Generate a markdown report of naming violations.
 *
 * Groups violations by directory and lists suggested renames.
 *
 * @param violations - Array of naming violations.
 * @returns Markdown-formatted report.
 */
export function generateNamingReport(violations: NamingViolation[]): string {
  const lines: string[] = [];

  lines.push('# File Naming Convention Report');
  lines.push('');
  lines.push(`**${VM_BRAND.platform.descriptor}** -- ${VM_BRAND.credentials.company}`);
  lines.push('');

  if (violations.length === 0) {
    lines.push('All files follow naming conventions. No violations found.');
    lines.push('');
    lines.push('---');
    lines.push(`*${VM_BRAND.regulatoryFooter}*`);
    return lines.join('\n');
  }

  // Summary
  const errors = violations.filter((v) => v.severity === 'ERROR');
  const warnings = violations.filter((v) => v.severity === 'WARNING');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total violations:** ${violations.length}`);
  lines.push(`- **Errors:** ${errors.length}`);
  lines.push(`- **Warnings:** ${warnings.length}`);
  lines.push('');

  // Group by directory
  const grouped = new Map<string, NamingViolation[]>();

  for (const v of violations) {
    const normalised = normalisePath(v.file);
    const parts = normalised.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') + '/' : '(root)';

    if (!grouped.has(dir)) {
      grouped.set(dir, []);
    }
    grouped.get(dir)!.push(v);
  }

  lines.push('## Violations by Directory');
  lines.push('');

  for (const [dir, dirViolations] of grouped) {
    lines.push(`### \`${dir}\``);
    lines.push('');

    for (const v of dirViolations) {
      const icon = v.severity === 'ERROR' ? '[ERROR]' : '[WARNING]';
      lines.push(`- ${icon} \`${extractFileName(normalisePath(v.file))}\``);
      lines.push(`  - ${v.violation}`);
      lines.push(`  - Expected: \`${v.expected}\``);
    }
    lines.push('');
  }

  // Suggested renames
  lines.push('## Suggested Renames');
  lines.push('');
  lines.push('```');
  for (const v of violations) {
    if (v.severity === 'ERROR') {
      const currentName = extractFileName(normalisePath(v.file));
      lines.push(`${currentName} -> ${v.expected}`);
    }
  }
  lines.push('```');
  lines.push('');

  lines.push('---');
  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}
