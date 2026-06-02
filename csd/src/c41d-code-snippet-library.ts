/**
 * Component 41D: Code Snippet Library
 * DEV PACKAGE — Internal tooling only
 *
 * Pre-built code snippets for common VitalMatrix patterns. Eliminates
 * re-typing boilerplate across the engine pipeline, connections, and
 * test files.
 *
 * 20 pre-built snippets covering: module headers, interfaces, scoring
 * formulae, test skeletons, safety checks, pipeline stages, and more.
 *
 * Variables in snippets use {{VARIABLE}} placeholders, replaced at render time.
 *
 * @module c41d-code-snippet-library
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Category of code snippet. */
export type SnippetCategory =
  | 'interface'
  | 'function'
  | 'test'
  | 'import'
  | 'guard'
  | 'type'
  | 'constant'
  | 'module-header';

/** A single reusable code snippet. */
export interface Snippet {
  /** Unique identifier, e.g. 'snip-01'. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Snippet category. */
  category: SnippetCategory;
  /** The code template with {{VARIABLE}} placeholders. */
  code: string;
  /** Description of what the snippet does. */
  description: string;
  /** List of variable names used in the template. */
  variables: string[];
}

/** The full snippet library. */
export interface SnippetLibrary {
  /** All available snippets. */
  snippets: Snippet[];
}

// --- Pre-built Snippets ---

/** The 20 pre-built VitalMatrix code snippets. */
const SNIPPETS: Snippet[] = [
  // 1. VM module header with JSDoc
  {
    id: 'snip-01',
    name: 'VM Module Header',
    category: 'module-header',
    description: 'Standard VitalMatrix module header with JSDoc, component number, and description.',
    variables: ['COMPONENT_ID', 'COMPONENT_NAME', 'DESCRIPTION'],
    code: `/**
 * Component {{COMPONENT_ID}}: {{COMPONENT_NAME}}
 * VitalMatrix ${VM_BRAND.platform.descriptor}
 *
 * {{DESCRIPTION}}
 *
 * @module {{COMPONENT_ID}}
 */

import { VM_BRAND } from './brand-config';`,
  },

  // 2. NodeScoreMap interface
  {
    id: 'snip-02',
    name: 'NodeScoreMap Interface',
    category: 'interface',
    description: 'Standard interface for mapping node scores (N1-N7) on 0-100 internal scale.',
    variables: [],
    code: `/** Maps node identifiers to their internal 0-100 scores. */
export interface NodeScoreMap {
  N1: number;  // Gut / Digestive
  N2: number;  // Immune / Inflammatory
  N3: number;  // Energy / Mitochondrial
  N4: number;  // Detox / Biotransformation
  N5: number;  // Hormonal / Endocrine
  N6: number;  // Communication / Neurological
  N7: number;  // Structural / Musculoskeletal
}`,
  },

  // 3. ZoneScoreMap interface
  {
    id: 'snip-03',
    name: 'ZoneScoreMap Interface',
    category: 'interface',
    description: 'Standard interface for mapping zone scores (Z1-Z5) on 0-100 internal scale.',
    variables: [],
    code: `/** Maps zone identifiers to their internal 0-100 scores. */
export interface ZoneScoreMap {
  Z1: number;  // Assimilation
  Z2: number;  // Defence
  Z3: number;  // Energy Production
  Z4: number;  // Biotransformation
  Z5: number;  // Communication
}`,
  },

  // 4. Evidence tier type
  {
    id: 'snip-04',
    name: 'Evidence Tier Type',
    category: 'type',
    description: 'Type alias for the 5 evidence tiers used on all clinical claims.',
    variables: [],
    code: `/** Evidence tier classification for clinical claims. */
export type EvidenceTier = 'Established' | 'Emerging' | 'Theoretical' | 'Observed in Practice' | 'Contested';`,
  },

  // 5. Zone status check function
  {
    id: 'snip-05',
    name: 'Zone Status Check',
    category: 'function',
    description: 'Determines zone status (elevated/borderline/within range) based on threshold (D-38).',
    variables: ['ZONE_ID'],
    code: `/**
 * Checks the status of zone {{ZONE_ID}} against D-38 thresholds.
 * Z1-Z4 threshold = 40, Z5 threshold = 32.
 * Borderline: Z1-Z4 = 35-39, Z5 = 27-31.
 */
export function checkZoneStatus(score: number, zone: '{{ZONE_ID}}'): 'elevated' | 'borderline' | 'within-range' {
  const threshold = zone === 'Z5' ? 32 : 40;
  const borderlineStart = zone === 'Z5' ? 27 : 35;

  if (score >= threshold) return 'elevated';
  if (score >= borderlineStart) return 'borderline';
  return 'within-range';
}`,
  },

  // 6. N6 dampening application
  {
    id: 'snip-06',
    name: 'N6 Dampening',
    category: 'function',
    description: 'Applies N6 Communication dampening coefficient (D-160). Factor = 0.7.',
    variables: [],
    code: `/**
 * Applies N6 dampening coefficient (D-160).
 * N6 Communication node is dampened by factor 0.7.
 *
 * @param rawN6Score - The raw N6 score on 0-100 internal scale.
 * @returns Dampened N6 score.
 */
export function applyN6Dampening(rawN6Score: number): number {
  const N6_DAMPENING_COEFFICIENT = 0.7; // D-160
  return rawN6Score * N6_DAMPENING_COEFFICIENT;
}`,
  },

  // 7. Floor formula calculation
  {
    id: 'snip-07',
    name: 'Floor Formula',
    category: 'function',
    description: 'Calculates the scoring floor per D-212: MAX(dampened node scores) - 10.',
    variables: [],
    code: `/**
 * Calculates the scoring floor (D-212).
 * Floor = MAX(dampened node scores) - 10, on internal 0-100 scale.
 *
 * @param dampenedScores - Array of dampened node scores.
 * @returns The floor value.
 */
export function calculateFloor(dampenedScores: number[]): number {
  if (dampenedScores.length === 0) return 0;
  const maxScore = Math.max(...dampenedScores);
  return Math.max(0, maxScore - 10); // D-212: MAX(dampened) - 10
}`,
  },

  // 8. Threshold check (D-38)
  {
    id: 'snip-08',
    name: 'Threshold Check (D-38)',
    category: 'guard',
    description: 'Near-threshold window check per D-38. 5 points on internal 0-100 scale.',
    variables: [],
    code: `/**
 * Checks whether a score falls within the near-threshold window (D-38).
 * Window = 5 points on internal 0-100 scale.
 * Z1-Z4 threshold = 40, borderline = 35-39.
 * Z5 threshold = 32, borderline = 27-31.
 */
export function isNearThreshold(score: number, zone: 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5'): boolean {
  const threshold = zone === 'Z5' ? 32 : 40;
  const windowStart = threshold - 5;
  return score >= windowStart && score < threshold;
}`,
  },

  // 9. TerrainLock check (D-236A)
  {
    id: 'snip-09',
    name: 'TerrainLock Gate (D-236A)',
    category: 'guard',
    description: 'TerrainLock strict inequality gate per D-236A. N1+N2-only Z2 must exceed 40.',
    variables: [],
    code: `/**
 * TerrainLock gate check (D-236A).
 * N1+N2-only Z2 must EXCEED 40 (strict >) for TerrainLock to fire.
 *
 * @param n1n2OnlyZ2Score - The Z2 score computed from N1 and N2 contributions only.
 * @returns Whether TerrainLock should activate.
 */
export function shouldTerrainLockFire(n1n2OnlyZ2Score: number): boolean {
  return n1n2OnlyZ2Score > 40; // D-236A: strict inequality
}`,
  },

  // 10. Compliance scan call
  {
    id: 'snip-10',
    name: 'Compliance Scan Call',
    category: 'function',
    description: 'Stub for invoking the C7 compliance scanner on generated content.',
    variables: ['CONTENT_VAR'],
    code: `/**
 * Runs compliance scan on content via C7 compliance scanner.
 * Checks brand rules, credential format, and evidence tier presence.
 */
function runComplianceScan({{CONTENT_VAR}}: string): { passed: boolean; violations: string[] } {
  const violations: string[] = [];

  // K7: Credential check
  if ({{CONTENT_VAR}}.includes('MD') && !{{CONTENT_VAR}}.includes('MBBS')) {
    violations.push('K7: Credential error — must be MBBS, FAAMFM. Never MD.');
  }

  // K8: British English
  if ({{CONTENT_VAR}}.includes('—')) {
    violations.push('K8: Em dash detected — use en dash or comma instead.');
  }

  return { passed: violations.length === 0, violations };
}`,
  },

  // 11. Test file skeleton
  {
    id: 'snip-11',
    name: 'Test File Skeleton',
    category: 'test',
    description: 'Complete test file skeleton with imports and describe block.',
    variables: ['MODULE_NAME', 'MODULE_PATH'],
    code: `/**
 * Tests for {{MODULE_NAME}}
 * VitalMatrix ${VM_BRAND.platform.descriptor}
 */

import { describe, test, expect } from 'vitest';
import { /* exports */ } from '{{MODULE_PATH}}';

describe('{{MODULE_NAME}}', () => {
  test('should exist and export expected functions', () => {
    // Verify module exports
    expect(true).toBe(true);
  });

  test.todo('add specific tests');
});`,
  },

  // 12. Describe block with test()
  {
    id: 'snip-12',
    name: 'Describe Block',
    category: 'test',
    description: 'A describe block with test stubs for adding to an existing test file.',
    variables: ['FEATURE_NAME'],
    code: `describe('{{FEATURE_NAME}}', () => {
  test('should handle valid input', () => {
    // Arrange
    // Act
    // Assert
    expect(true).toBe(true);
  });

  test('should handle edge cases', () => {
    // Arrange
    // Act
    // Assert
    expect(true).toBe(true);
  });

  test('should reject invalid input', () => {
    // Arrange
    // Act
    // Assert
    expect(true).toBe(true);
  });
});`,
  },

  // 13. Brand-config import
  {
    id: 'snip-13',
    name: 'Brand Config Import',
    category: 'import',
    description: 'Standard brand-config import line used in all VitalMatrix components.',
    variables: [],
    code: `import { VM_BRAND } from './brand-config';`,
  },

  // 14. Regulatory footer append
  {
    id: 'snip-14',
    name: 'Regulatory Footer',
    category: 'constant',
    description: 'Appends the mandatory regulatory footer to clinical output strings.',
    variables: ['OUTPUT_VAR'],
    code: `// Append mandatory regulatory footer to clinical output
{{OUTPUT_VAR}} += '\\n\\n' + VM_BRAND.regulatoryFooter;`,
  },

  // 15. Zone-to-node mapping lookup
  {
    id: 'snip-15',
    name: 'Zone-to-Node Mapping',
    category: 'constant',
    description: 'Canonical zone-to-node mapping per D-01.',
    variables: [],
    code: `/** Canonical zone-to-node mapping (D-01). */
const ZONE_TO_NODE_MAP: Record<string, string[]> = {
  Z1: ['N1', 'N2'],          // Assimilation
  Z2: ['N1', 'N2', 'N3'],    // Defence
  Z3: ['N3', 'N5'],          // Energy Production
  Z4: ['N4'],                // Biotransformation
  Z5: ['N5', 'N6', 'N7'],   // Communication
};`,
  },

  // 16. Cascade activation check
  {
    id: 'snip-16',
    name: 'Cascade Activation Check',
    category: 'guard',
    description: 'Checks whether a cascade activation condition is met across zones.',
    variables: ['ZONE_SCORES_VAR'],
    code: `/**
 * Checks whether cascade activation is triggered.
 * A cascade fires when 2+ zones are elevated simultaneously.
 */
export function isCascadeActive({{ZONE_SCORES_VAR}}: Record<string, number>): boolean {
  const thresholds: Record<string, number> = {
    Z1: 40, Z2: 40, Z3: 40, Z4: 40, Z5: 32,
  };

  const elevatedCount = Object.entries({{ZONE_SCORES_VAR}})
    .filter(([zone, score]) => score >= (thresholds[zone] || 40))
    .length;

  return elevatedCount >= 2;
}`,
  },

  // 17. Pipeline stage skeleton
  {
    id: 'snip-17',
    name: 'Pipeline Stage Skeleton',
    category: 'module-header',
    description: 'Skeleton for a pipeline engine stage (FLINT/APEX/STRIDE/RIL/CADENCE/CIL/VISTA).',
    variables: ['STAGE_NAME', 'STAGE_DESCRIPTION', 'INPUT_TYPE', 'OUTPUT_TYPE'],
    code: `/**
 * {{STAGE_NAME}} Pipeline Stage
 * VitalMatrix ${VM_BRAND.platform.descriptor}
 *
 * {{STAGE_DESCRIPTION}}
 * Pipeline: FLINT > APEX > STRIDE > RIL > CADENCE > CIL > VISTA (D-233b)
 *
 * @module {{STAGE_NAME}}
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface {{STAGE_NAME}}Input {
  {{INPUT_TYPE}}: unknown;
}

export interface {{STAGE_NAME}}Output {
  {{OUTPUT_TYPE}}: unknown;
  timestamp: string;
  stage: '{{STAGE_NAME}}';
}

// --- Core ---

export function process(input: {{STAGE_NAME}}Input): {{STAGE_NAME}}Output {
  // TODO: Implement {{STAGE_NAME}} logic
  return {
    {{OUTPUT_TYPE}}: null,
    timestamp: new Date().toISOString(),
    stage: '{{STAGE_NAME}}',
  };
}`,
  },

  // 18. INTAKE feature skeleton
  {
    id: 'snip-18',
    name: 'INTAKE Feature Skeleton',
    category: 'module-header',
    description: 'Skeleton for an INTAKE form feature with conditional branching (D-16).',
    variables: ['FEATURE_ID', 'FEATURE_NAME', 'SECTION'],
    code: `/**
 * INTAKE Feature {{FEATURE_ID}}: {{FEATURE_NAME}}
 * Section: {{SECTION}}
 *
 * Intelligent Node Translation and Architectural Knowledge Engine (D-35).
 * Single form with conditional branching (D-16).
 */

import { VM_BRAND } from './brand-config';

export interface {{FEATURE_ID}}Input {
  value: string | number | boolean;
  source: 'patient' | 'practitioner' | 'MAPS';
}

export interface {{FEATURE_ID}}Result {
  featureId: '{{FEATURE_ID}}';
  nodeContributions: Record<string, number>;
  evidenceTier: typeof VM_BRAND.evidenceTiers[number];
  flagged: boolean;
}

export function evaluate(input: {{FEATURE_ID}}Input): {{FEATURE_ID}}Result {
  return {
    featureId: '{{FEATURE_ID}}',
    nodeContributions: {},
    evidenceTier: 'Observed in Practice',
    flagged: false,
  };
}`,
  },

  // 19. Connection file skeleton
  {
    id: 'snip-19',
    name: 'Connection File Skeleton',
    category: 'module-header',
    description: 'Skeleton for a VANTAGE connection file linking two nodes.',
    variables: ['CONNECTION_NAME', 'NODE_A', 'NODE_B', 'DESCRIPTION'],
    code: `/**
 * Connection: {{CONNECTION_NAME}}
 * Links {{NODE_A}} to {{NODE_B}}
 *
 * {{DESCRIPTION}}
 */

import { VM_BRAND } from './brand-config';

export interface {{CONNECTION_NAME}}Config {
  sourceNode: '{{NODE_A}}';
  targetNode: '{{NODE_B}}';
  weight: number;
  bidirectional: boolean;
  evidenceTier: typeof VM_BRAND.evidenceTiers[number];
}

export const CONNECTION: {{CONNECTION_NAME}}Config = {
  sourceNode: '{{NODE_A}}',
  targetNode: '{{NODE_B}}',
  weight: 1.0,
  bidirectional: false,
  evidenceTier: 'Emerging',
};`,
  },

  // 20. Safety feature skeleton
  {
    id: 'snip-20',
    name: 'Safety Feature Skeleton',
    category: 'guard',
    description: 'Skeleton for a safety gate that blocks unsafe operations.',
    variables: ['GATE_NAME', 'GATE_DESCRIPTION'],
    code: `/**
 * Safety Gate: {{GATE_NAME}}
 *
 * {{GATE_DESCRIPTION}}
 * Safety gates take priority over all other processing (D-20 hierarchy).
 */

import { VM_BRAND } from './brand-config';

export interface {{GATE_NAME}}Check {
  passed: boolean;
  reason?: string;
  severity: 'BLOCK' | 'WARN' | 'INFO';
  gate: '{{GATE_NAME}}';
}

/**
 * Runs the {{GATE_NAME}} safety check.
 * Returns BLOCK if the operation must not proceed.
 */
export function check(input: unknown): {{GATE_NAME}}Check {
  // TODO: Implement safety logic
  return {
    passed: true,
    severity: 'INFO',
    gate: '{{GATE_NAME}}',
  };
}`,
  },
];

// --- Core Functions ---

/**
 * Retrieves a snippet by its unique ID.
 *
 * @param id - The snippet ID (e.g. 'snip-01').
 * @returns The matching Snippet, or undefined if not found.
 */
export function getSnippet(id: string): Snippet | undefined {
  return SNIPPETS.find(s => s.id === id);
}

/**
 * Retrieves all snippets in a given category.
 *
 * @param category - The snippet category to filter by.
 * @returns Array of matching Snippet objects.
 */
export function getSnippetsByCategory(category: SnippetCategory): Snippet[] {
  return SNIPPETS.filter(s => s.category === category);
}

/**
 * Searches snippets by a query string, matching against name, description,
 * and code content.
 *
 * @param query - Search query (case-insensitive).
 * @returns Array of matching Snippet objects.
 */
export function searchSnippets(query: string): Snippet[] {
  const q = query.toLowerCase();
  return SNIPPETS.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.code.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q)
  );
}

/**
 * Renders a snippet by replacing all {{VARIABLE}} placeholders with
 * provided values.
 *
 * @param id - The snippet ID to render.
 * @param variables - Key-value pairs for placeholder replacement.
 * @returns The rendered code string, or null if snippet not found.
 */
export function renderSnippet(id: string, variables: Record<string, string> = {}): string | null {
  const snippet = getSnippet(id);
  if (!snippet) return null;

  let rendered = snippet.code;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(placeholder, value);
  }

  return rendered;
}

/**
 * Returns all snippets in the library.
 *
 * @returns Array of all Snippet objects.
 */
export function getAllSnippets(): Snippet[] {
  return [...SNIPPETS];
}

/**
 * Generates a markdown reference card listing all available snippets
 * grouped by category.
 *
 * @returns Markdown-formatted reference string.
 */
export function generateSnippetReference(): string {
  const lines: string[] = [
    `# VitalMatrix Code Snippet Library`,
    '',
    `**Platform:** ${VM_BRAND.platform.descriptor}`,
    `**Total snippets:** ${SNIPPETS.length}`,
    `**Company:** ${VM_BRAND.credentials.company}`,
    '',
  ];

  const categories = [...new Set(SNIPPETS.map(s => s.category))].sort();

  for (const category of categories) {
    const categorySnippets = getSnippetsByCategory(category as SnippetCategory);
    lines.push(`## ${category}`, '');
    lines.push('| ID | Name | Variables | Description |');
    lines.push('|----|------|-----------|-------------|');

    for (const s of categorySnippets) {
      const vars = s.variables.length > 0 ? s.variables.join(', ') : 'none';
      lines.push(`| ${s.id} | ${s.name} | ${vars} | ${s.description} |`);
    }

    lines.push('');
  }

  lines.push(`${VM_BRAND.regulatoryFooter}`);

  return lines.join('\n');
}
