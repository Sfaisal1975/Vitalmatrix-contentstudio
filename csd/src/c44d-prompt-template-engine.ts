/**
 * Component 44D: Prompt Template Engine
 * DEV PACKAGE — Internal tooling only
 *
 * Pre-built prompt templates for common Claude Code tasks. Reduces prompt
 * engineering time by providing tested, optimised templates with variable
 * substitution and context-loading instructions.
 *
 * 15 pre-built templates across 8 categories: build, debug, audit, refactor,
 * test, document, analyse, stress-test.
 *
 * @module c44d-prompt-template-engine
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Template category for classification. */
export type TemplateCategory =
  | 'build'
  | 'debug'
  | 'audit'
  | 'refactor'
  | 'test'
  | 'document'
  | 'analyse'
  | 'stress-test';

/** A single prompt template definition. */
export interface PromptTemplate {
  /** Unique identifier (e.g. 'build-type3-spec'). */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Classification category. */
  category: TemplateCategory;
  /** Template body with {{variable}} placeholders. */
  template: string;
  /** List of variable names expected in the template. */
  variables: string[];
  /** Estimated token count for this template when rendered. */
  estimatedTokens: number;
}

/** Result of rendering a template with variables. */
export interface RenderedTemplate {
  /** The rendered template text. */
  text: string;
  /** Estimated token count. */
  estimatedTokens: number;
  /** Approximate cost in USD. */
  estimatedCostUsd: number;
}

// --- Constants ---

/** Approximate cost per 1K tokens (Opus input). */
const COST_PER_1K_INPUT = 0.015;

/** Approximate cost per 1K tokens (Opus output, estimated at 2x input ratio). */
const COST_PER_1K_OUTPUT = 0.075;

// --- Pre-built Templates ---

/**
 * All 15 pre-built prompt templates.
 * Each includes context-loading instructions referencing MasterContext sections.
 */
export const TEMPLATES: ReadonlyArray<PromptTemplate> = [
  {
    id: 'build-type3-spec',
    name: 'Build feature from TYPE 3 spec',
    category: 'build',
    template: `CONTEXT: Load MasterContext sections: Architecture (ALB v1.7, 7 nodes, 5 zones, 6 stacks), Pipeline (D-233b: FLINT>APEX>STRIDE>RIL>CADENCE>CIL>VISTA), Phase 1 feature list.
PLATFORM: ${VM_BRAND.platform.descriptor} | ${VM_BRAND.platform.ico}
TASK: Build feature {{featureId}} — {{featureName}} from TYPE 3 specification.
SPEC: {{specContent}}
CONSTRAINTS:
- British English throughout
- All files must use --vm- CSS prefix
- Evidence tier labels required on clinical claims
- Must pass architecture guard (c10) before commit
OUTPUT: TypeScript implementation file, test file, updated index exports.`,
    variables: ['featureId', 'featureName', 'specContent'],
    estimatedTokens: 2800,
  },
  {
    id: 'debug-failing-test',
    name: 'Debug failing test',
    category: 'debug',
    template: `CONTEXT: Load MasterContext sections: Test conventions, File naming rules, Architecture guard rules.
PLATFORM: ${VM_BRAND.platform.descriptor}
TASK: Debug failing test in {{testFile}}.
ERROR OUTPUT:
{{errorOutput}}
SOURCE FILE: {{sourceFile}}
INSTRUCTIONS:
1. Read the test file and source file.
2. Identify the root cause (type mismatch, missing mock, logic error, stale import).
3. Fix the source or test — prefer fixing source unless the test expectation is wrong.
4. Verify fix passes all related tests.
5. Check no regressions in adjacent tests.`,
    variables: ['testFile', 'errorOutput', 'sourceFile'],
    estimatedTokens: 1800,
  },
  {
    id: 'audit-architecture',
    name: 'Audit file for architecture violations',
    category: 'audit',
    template: `CONTEXT: Load MasterContext sections: ALB v1.7 (7 nodes, 5 zones, 6 stacks), Canonical file naming, Deprecated terms list, Kill list.
PLATFORM: ${VM_BRAND.platform.descriptor}
TASK: Audit {{filePath}} for architecture violations.
CHECK LIST:
1. File naming matches canonical pattern (kebab-case, correct prefix).
2. No deprecated terms (NCZ/DRD supersession, old platform descriptors).
3. Imports only from allowed modules (no circular deps).
4. British English used throughout (no -ize, no em dashes).
5. CSS variables use --vm- prefix only.
6. Evidence tiers present on clinical claims.
7. Credentials use MBBS, FAAMFM only (K7 kill list).
8. No competitor names (K10 kill list).
OUTPUT: List of violations with line numbers, severity, and fix instructions.`,
    variables: ['filePath'],
    estimatedTokens: 1500,
  },
  {
    id: 'refactor-duplication',
    name: 'Refactor to remove duplication',
    category: 'refactor',
    template: `CONTEXT: Load MasterContext sections: Architecture guard, Dependency map, Phase 1 feature list.
TASK: Refactor duplicated code between {{fileA}} and {{fileB}}.
DUPLICATION DETAILS: {{duplicationDetails}}
CONSTRAINTS:
- Extract shared logic into a common module.
- Maintain all existing exports (no breaking changes).
- Update all import paths.
- Run tests after refactoring.
- File naming must follow canonical conventions.
OUTPUT: New shared module, updated files, updated imports.`,
    variables: ['fileA', 'fileB', 'duplicationDetails'],
    estimatedTokens: 2000,
  },
  {
    id: 'write-tests',
    name: 'Write tests for module',
    category: 'test',
    template: `CONTEXT: Load MasterContext sections: Test conventions, Test data factory (c13), Architecture.
PLATFORM: ${VM_BRAND.platform.descriptor}
TASK: Write comprehensive tests for {{modulePath}}.
MODULE EXPORTS: {{exports}}
REQUIREMENTS:
1. Test every exported function.
2. Include edge cases: empty input, boundary values, invalid types.
3. Use test data factory (c13) for synthetic patients where applicable.
4. Test error paths, not just happy paths.
5. Minimum 3 tests per function.
6. Use descriptive test names: "should [expected behaviour] when [condition]".
OUTPUT: Test file named {{modulePath}}.test.ts`,
    variables: ['modulePath', 'exports'],
    estimatedTokens: 1600,
  },
  {
    id: 'generate-jsdoc',
    name: 'Generate JSDoc documentation',
    category: 'document',
    template: `CONTEXT: Load MasterContext sections: Documentation standards, British English rules.
TASK: Generate complete JSDoc documentation for {{filePath}}.
RULES:
1. Every exported type, interface, function, and constant must have JSDoc.
2. Use British English (analyse, behaviour, colour, organise).
3. Include @param, @returns, @throws, @example where appropriate.
4. Module-level JSDoc must include @module tag.
5. Reference D-series decisions where relevant.
6. Never expose internal architecture in external-tier docs.
OUTPUT: Updated file with complete JSDoc comments.`,
    variables: ['filePath'],
    estimatedTokens: 1400,
  },
  {
    id: 'analyse-dependencies',
    name: 'Analyse cross-file dependencies',
    category: 'analyse',
    template: `CONTEXT: Load MasterContext sections: Dependency mapper (c19d), Architecture guard, Pipeline order.
TASK: Analyse all dependencies for {{targetFile}}.
ANALYSIS REQUIRED:
1. Direct imports (what does this file import?).
2. Reverse dependencies (what imports this file?).
3. Transitive dependencies (full dependency tree).
4. Circular dependency detection.
5. Impact radius if this file changes.
6. Pipeline stage alignment (does it sit in the correct stage?).
OUTPUT: Dependency graph (text), impact analysis, recommendations.`,
    variables: ['targetFile'],
    estimatedTokens: 1700,
  },
  {
    id: 'stress-test-l3',
    name: 'Run L3 stress test on module',
    category: 'stress-test',
    template: `CONTEXT: Load MasterContext sections: Test data factory, Zone/Node scoring, Threshold values.
PLATFORM: ${VM_BRAND.platform.descriptor}
TASK: Run L3 stress test on {{modulePath}}.
STRESS PARAMETERS:
1. Generate 100 synthetic patients using c13 presets.
2. Include all boundary cases: scores at 0, 50, 100.
3. Include all 5 zones (Z1-Z5) and 7 nodes (N1-N7).
4. Test with missing data (partial node scores).
5. Test with contradictory data (high Z1 + low N1).
6. Measure execution time per patient.
7. Target: <50ms per patient, zero crashes.
OUTPUT: Stress test results, performance metrics, failure cases.`,
    variables: ['modulePath'],
    estimatedTokens: 2200,
  },
  {
    id: 'create-intake-feature',
    name: 'Create INTAKE feature',
    category: 'build',
    template: `CONTEXT: Load MasterContext sections: INTAKE form build (15 May 2026), 502 items, 157 tests, D-193 age gate, Feature list F1-F42.
PLATFORM: ${VM_BRAND.platform.descriptor}
TASK: Create INTAKE feature {{featureId}} — {{featureName}}.
SPEC: {{featureSpec}}
DEPENDENCIES: {{dependencies}}
REQUIREMENTS:
1. Must integrate with existing INTAKE form architecture.
2. Validate against D-193 age gate if age-related.
3. All form items must have validation rules.
4. Accessibility: ARIA labels, keyboard navigation.
5. Test file required with minimum 5 tests.
OUTPUT: Feature file, test file, updated INTAKE index.`,
    variables: ['featureId', 'featureName', 'featureSpec', 'dependencies'],
    estimatedTokens: 2500,
  },
  {
    id: 'create-connection',
    name: 'Create connection file',
    category: 'build',
    template: `CONTEXT: Load MasterContext sections: VANTAGE connection names (W26 authoritative), Dimension mappings, 630 coded elements.
PLATFORM: ${VM_BRAND.platform.descriptor}
TASK: Create connection file for {{connectionName}}.
DIMENSION: {{dimension}}
SOURCE NODE: {{sourceNode}} | TARGET NODE: {{targetNode}}
REQUIREMENTS:
1. Use W26 authoritative name, not HTML v1.1 build name.
2. Connection must map to correct dimension.
3. Include scoring formula with MAX(dampened)-10 (D-212 resolved).
4. Include threshold values.
5. Test with synthetic patients from c13.
OUTPUT: Connection TypeScript file, test file.`,
    variables: ['connectionName', 'dimension', 'sourceNode', 'targetNode'],
    estimatedTokens: 2400,
  },
  {
    id: 'create-safety-feature',
    name: 'Create safety feature',
    category: 'build',
    template: `CONTEXT: Load MasterContext sections: Safety module, Consent gate (F41), Kill list, Regulatory footer.
PLATFORM: ${VM_BRAND.platform.descriptor} | ${VM_BRAND.platform.ico}
TASK: Create safety feature {{featureId}} — {{featureName}}.
SAFETY CLASS: {{safetyClass}}
REQUIREMENTS:
1. Must integrate with consent gate (F41).
2. Regulatory footer required: "${VM_BRAND.regulatoryFooter}"
3. Evidence tier must be specified for all clinical claims.
4. Kill list checks must pass (K7, K8, K10).
5. SA Override (Class I) rules apply if applicable.
6. Full test coverage required — zero tolerance for safety gaps.
OUTPUT: Safety feature file, comprehensive test file, updated safety index.`,
    variables: ['featureId', 'featureName', 'safetyClass'],
    estimatedTokens: 2600,
  },
  {
    id: 'generate-session-wrap',
    name: 'Generate session wrap',
    category: 'document',
    template: `CONTEXT: Load MasterContext sections: Session report (c8), Notion sync (c25d), Decision registry (c9).
TASK: Generate session wrap for today's build session.
SESSION DATA:
- Commits: {{commitCount}}
- Files changed: {{filesChanged}}
- Tests: {{testResults}}
- Decisions made: {{decisions}}
- Gate status: {{gateStatus}}
REQUIREMENTS:
1. Format for Notion page using c25d formatSessionWrap.
2. Include all decisions with D-series numbers.
3. Include gate status updates.
4. Include next session priorities.
OUTPUT: Formatted session wrap ready for Notion.`,
    variables: ['commitCount', 'filesChanged', 'testResults', 'decisions', 'gateStatus'],
    estimatedTokens: 1800,
  },
  {
    id: 'review-pr',
    name: 'Review PR changes',
    category: 'audit',
    template: `CONTEXT: Load MasterContext sections: Architecture guard, Kill list, Code review checklist (c30d), British English rules.
TASK: Review PR #{{prNumber}} — {{prTitle}}.
DIFF: {{diff}}
REVIEW CHECKLIST:
1. Architecture violations (file naming, imports, deprecated terms).
2. British English compliance (no -ize, no em dashes).
3. Kill list violations (K7 credentials, K8 language, K10 competitors).
4. Test coverage (are new functions tested?).
5. CSS variable prefix (--vm- only).
6. Evidence tiers on clinical claims.
7. Breaking changes to existing exports.
8. Regression risk score (c23d).
OUTPUT: Review comments with line references, approval/rejection recommendation.`,
    variables: ['prNumber', 'prTitle', 'diff'],
    estimatedTokens: 2200,
  },
  {
    id: 'expand-decision-registry',
    name: 'Expand D-series decision registry',
    category: 'document',
    template: `CONTEXT: Load MasterContext sections: Decision registry (c9), all D-series decisions, supersession chains.
TASK: Add new decision to the D-series registry.
DECISION: {{decisionId}} — {{decisionTitle}}
DETAILS: {{decisionDetails}}
SUPERSEDES: {{supersedes}}
REQUIREMENTS:
1. Check for conflicts with existing decisions (c9 checkConflict).
2. Update supersession chains if applicable.
3. Add dependency links.
4. Update Notion decision page.
5. Verify no circular supersession.
OUTPUT: Updated decision registry entry, Notion update payload.`,
    variables: ['decisionId', 'decisionTitle', 'decisionDetails', 'supersedes'],
    estimatedTokens: 1600,
  },
  {
    id: 'create-migration',
    name: 'Create migration script from interface',
    category: 'build',
    template: `CONTEXT: Load MasterContext sections: Migration generator (c20d), PostgreSQL conventions, TypeScript interfaces.
TASK: Create database migration from TypeScript interface.
INTERFACE: {{interfaceCode}}
TABLE NAME: {{tableName}}
SCHEMA: {{schema}}
REQUIREMENTS:
1. Map TypeScript types to PostgreSQL types (c20d tsTypeToPgType).
2. Include created_at, updated_at timestamps.
3. Include primary key (UUID default).
4. Add indexes for frequently queried fields.
5. Generate both UP and DOWN migrations.
6. Include seed data if applicable.
OUTPUT: Migration SQL file, rollback SQL file, type verification test.`,
    variables: ['interfaceCode', 'tableName', 'schema'],
    estimatedTokens: 1900,
  },
] as const;

// --- Functions ---

/**
 * Retrieves a template by its unique identifier.
 *
 * @param id - The template identifier (e.g. 'build-type3-spec').
 * @returns The matching template, or undefined if not found.
 */
export function getTemplate(id: string): PromptTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * Retrieves all templates matching a given category.
 *
 * @param category - The category to filter by.
 * @returns Array of templates in the specified category.
 */
export function getTemplatesByCategory(category: TemplateCategory): PromptTemplate[] {
  return TEMPLATES.filter((t) => t.category === category);
}

/**
 * Renders a template by substituting all {{variable}} placeholders with
 * the provided values.
 *
 * @param id - The template identifier.
 * @param variables - Key-value pairs for variable substitution.
 * @returns The rendered template with cost estimate, or undefined if template not found.
 */
export function renderTemplate(
  id: string,
  variables: Record<string, string>,
): RenderedTemplate | undefined {
  const template = getTemplate(id);
  if (!template) return undefined;

  let text = template.template;
  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    text = text.replace(pattern, value);
  }

  // Check for unresolved variables
  const unresolved = text.match(/\{\{[a-zA-Z]+\}\}/g);
  if (unresolved) {
    text += `\n\n[WARNING: Unresolved variables: ${unresolved.join(', ')}]`;
  }

  // Estimate tokens based on character count (~4 chars per token)
  const estimatedTokens = Math.ceil(text.length / 4);
  const estimatedCostUsd = estimatePromptCost({ ...template, estimatedTokens });

  return { text, estimatedTokens, estimatedCostUsd };
}

/**
 * Estimates the approximate cost in USD for a given template.
 * Uses Opus pricing: $0.015/1K input tokens, $0.075/1K output tokens.
 * Assumes output is roughly 60% of input token count.
 *
 * @param template - The template to estimate cost for.
 * @returns Approximate cost in USD.
 */
export function estimatePromptCost(template: PromptTemplate): number {
  const inputCost = (template.estimatedTokens / 1000) * COST_PER_1K_INPUT;
  const estimatedOutputTokens = Math.ceil(template.estimatedTokens * 0.6);
  const outputCost = (estimatedOutputTokens / 1000) * COST_PER_1K_OUTPUT;
  return Math.round((inputCost + outputCost) * 10000) / 10000;
}

/**
 * Searches templates by query string. Matches against id, name, category,
 * template body, and variable names.
 *
 * @param query - Search query (case-insensitive).
 * @returns Array of matching templates, sorted by relevance.
 */
export function searchTemplates(query: string): PromptTemplate[] {
  const lower = query.toLowerCase();
  const scored: Array<{ template: PromptTemplate; score: number }> = [];

  for (const t of TEMPLATES) {
    let score = 0;
    if (t.id.toLowerCase().includes(lower)) score += 10;
    if (t.name.toLowerCase().includes(lower)) score += 8;
    if (t.category.toLowerCase().includes(lower)) score += 5;
    if (t.template.toLowerCase().includes(lower)) score += 3;
    if (t.variables.some((v) => v.toLowerCase().includes(lower))) score += 2;
    if (score > 0) scored.push({ template: t, score });
  }

  return scored.sort((a, b) => b.score - a.score).map((s) => s.template);
}

/**
 * Generates a markdown reference card listing all available templates,
 * grouped by category, with variable lists and estimated costs.
 *
 * @returns Markdown-formatted reference card.
 */
export function generateTemplateReference(): string {
  const lines: string[] = [
    `# ${VM_BRAND.credentials.company} — Prompt Template Reference`,
    `> ${VM_BRAND.platform.descriptor} | ${TEMPLATES.length} templates`,
    '',
  ];

  const categories: TemplateCategory[] = [
    'build', 'debug', 'audit', 'refactor', 'test', 'document', 'analyse', 'stress-test',
  ];

  for (const cat of categories) {
    const templates = getTemplatesByCategory(cat);
    if (templates.length === 0) continue;

    lines.push(`## ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
    lines.push('');

    for (const t of templates) {
      const cost = estimatePromptCost(t);
      lines.push(`### ${t.name}`);
      lines.push(`- **ID:** \`${t.id}\``);
      lines.push(`- **Variables:** ${t.variables.map((v) => `\`{{${v}}}\``).join(', ')}`);
      lines.push(`- **Estimated tokens:** ${t.estimatedTokens.toLocaleString()}`);
      lines.push(`- **Estimated cost:** $${cost.toFixed(4)}`);
      lines.push('');
    }
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
