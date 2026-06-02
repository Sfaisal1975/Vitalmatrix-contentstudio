/**
 * Component 14: Intelligent Changelog Engine
 * GOLD STANDARD PRODUCTIVITY FEATURE
 *
 * Transforms git diffs into architecture-aware changelogs that understand
 * what changed and WHY it matters to VitalMatrix. Not just "modified engine.ts"
 * but "TerrainLock gate now requires strict inequality (D-236A)".
 *
 * Features:
 *  - Architecture-aware diff analysis (knows what each file/function does)
 *  - Impact classification (clinical, regulatory, architectural, cosmetic)
 *  - Breaking change detection (scoring formula changes, threshold changes)
 *  - D-series decision linking (matches commits to decisions)
 *  - Multi-audience formatting (technical for W05, summary for SA, compliance for W08)
 *  - Cumulative changelog across sessions
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type ChangeImpact = 'CLINICAL' | 'REGULATORY' | 'ARCHITECTURAL' | 'FEATURE' | 'TEST' | 'COSMETIC' | 'INFRASTRUCTURE';
export type BreakingLevel = 'BREAKING' | 'SIGNIFICANT' | 'MINOR' | 'PATCH';

export interface ChangelogEntry {
  commit: string;
  date: string;
  summary: string;
  impact: ChangeImpact;
  breakingLevel: BreakingLevel;
  filesAffected: string[];
  decisions: string[];           // D-series references
  affectedEngines: string[];     // L1-L9 pipeline stages
  affectedZones: string[];       // Z1-Z5
  affectedNodes: string[];       // N1-N7
  testImpact: string;            // "336/336 pass" or "new tests added"
}

export interface Changelog {
  version: string;
  dateRange: { from: string; to: string };
  entries: ChangelogEntry[];
  summary: ChangelogSummary;
}

export interface ChangelogSummary {
  totalChanges: number;
  breaking: number;
  significant: number;
  minor: number;
  patch: number;
  impactBreakdown: Record<ChangeImpact, number>;
  decisionsImplemented: string[];
  enginesModified: string[];
}

// --- File-to-Domain Mapping ---

const FILE_DOMAIN_MAP: Record<string, { domain: string; impact: ChangeImpact; engines: string[] }> = {
  'l1-node-scoring': { domain: 'Node Scoring Engine', impact: 'CLINICAL', engines: ['L1'] },
  'l2-zone-logic': { domain: 'NCZ Zone Logic Engine', impact: 'CLINICAL', engines: ['L2'] },
  'l3-cascade-detection': { domain: 'CascadeIQ Stack Detection', impact: 'CLINICAL', engines: ['L3'] },
  'l4-drd': { domain: 'DRD Designation Engine', impact: 'CLINICAL', engines: ['L4'] },
  'l7-cascadecoach': { domain: 'CascadeCoach Visual', impact: 'FEATURE', engines: ['L7'] },
  'l9-deltascan': { domain: 'DeltaScan Engine', impact: 'CLINICAL', engines: ['L9'] },
  'connections': { domain: 'VANTAGE Connection Register', impact: 'ARCHITECTURAL', engines: [] },
  'stride': { domain: 'STRIDE Sequencing', impact: 'CLINICAL', engines: [] },
  'safety': { domain: 'Safety Module', impact: 'REGULATORY', engines: [] },
  'intake-features': { domain: 'INTAKE Features', impact: 'FEATURE', engines: [] },
  'test': { domain: 'Test Suite', impact: 'TEST', engines: [] },
};

// --- Commit Analyzer ---

export function analyzeCommit(hash: string, message: string, filesChanged: string[], date: string): ChangelogEntry {
  // Extract D-series references
  const decisions = (message.match(/D-\d+[A-Za-z]?/g) || []);

  // Determine impact from files
  let impact: ChangeImpact = 'COSMETIC';
  const affectedEngines: string[] = [];
  const affectedZones: string[] = [];
  const affectedNodes: string[] = [];

  for (const file of filesChanged) {
    for (const [pattern, mapping] of Object.entries(FILE_DOMAIN_MAP)) {
      if (file.includes(pattern)) {
        if (priorityOf(mapping.impact) > priorityOf(impact)) {
          impact = mapping.impact;
        }
        affectedEngines.push(...mapping.engines);
      }
    }
  }

  // Extract zone/node references from message
  const zoneMatches = message.match(/Z[1-5]/g);
  if (zoneMatches) affectedZones.push(...new Set(zoneMatches));

  const nodeMatches = message.match(/N[1-7]/g);
  if (nodeMatches) affectedNodes.push(...new Set(nodeMatches));

  // Determine breaking level
  let breakingLevel: BreakingLevel = 'PATCH';
  if (/scoring|threshold|floor|dampening|formula|calibration/i.test(message)) {
    breakingLevel = 'BREAKING';
  } else if (/gate|pipeline|STRIDE|RIL|safety|regulatory|consent/i.test(message)) {
    breakingLevel = 'SIGNIFICANT';
  } else if (/feature|engine|connection|hook/i.test(message)) {
    breakingLevel = 'MINOR';
  }

  // Detect test info
  let testImpact = '';
  const testMatch = message.match(/(\d+)\/(\d+)\s*tests?\s*(pass|passing)/i);
  if (testMatch) testImpact = `${testMatch[1]}/${testMatch[2]} pass`;
  const newTestMatch = message.match(/(\d+)\s*new\s*tests?/i);
  if (newTestMatch) testImpact = `${newTestMatch[1]} new tests added`;

  return {
    commit: hash,
    date,
    summary: message,
    impact,
    breakingLevel,
    filesAffected: filesChanged,
    decisions: [...new Set(decisions)],
    affectedEngines: [...new Set(affectedEngines)],
    affectedZones,
    affectedNodes,
    testImpact,
  };
}

function priorityOf(impact: ChangeImpact): number {
  const order: Record<ChangeImpact, number> = {
    CLINICAL: 6, REGULATORY: 5, ARCHITECTURAL: 4,
    FEATURE: 3, TEST: 2, INFRASTRUCTURE: 1, COSMETIC: 0,
  };
  return order[impact];
}

// --- Changelog Builder ---

export function buildChangelog(entries: ChangelogEntry[], version: string): Changelog {
  const dates = entries.map(e => e.date).sort();

  const impactBreakdown = {} as Record<ChangeImpact, number>;
  const impacts: ChangeImpact[] = ['CLINICAL', 'REGULATORY', 'ARCHITECTURAL', 'FEATURE', 'TEST', 'INFRASTRUCTURE', 'COSMETIC'];
  for (const i of impacts) impactBreakdown[i] = 0;
  for (const e of entries) impactBreakdown[e.impact]++;

  return {
    version,
    dateRange: { from: dates[0] || '', to: dates[dates.length - 1] || '' },
    entries: entries.sort((a, b) => priorityOf(b.impact) - priorityOf(a.impact)),
    summary: {
      totalChanges: entries.length,
      breaking: entries.filter(e => e.breakingLevel === 'BREAKING').length,
      significant: entries.filter(e => e.breakingLevel === 'SIGNIFICANT').length,
      minor: entries.filter(e => e.breakingLevel === 'MINOR').length,
      patch: entries.filter(e => e.breakingLevel === 'PATCH').length,
      impactBreakdown,
      decisionsImplemented: [...new Set(entries.flatMap(e => e.decisions))],
      enginesModified: [...new Set(entries.flatMap(e => e.affectedEngines))],
    },
  };
}

// --- Formatters ---

export function formatForSA(changelog: Changelog): string {
  const lines = [
    `# VitalMatrix Changelog — ${changelog.version}`,
    `Period: ${changelog.dateRange.from} to ${changelog.dateRange.to}`,
    `Changes: ${changelog.summary.totalChanges} | Breaking: ${changelog.summary.breaking} | Decisions: ${changelog.summary.decisionsImplemented.join(', ') || 'None'}`,
    '',
  ];

  if (changelog.summary.breaking > 0) {
    lines.push('## Breaking Changes');
    for (const e of changelog.entries.filter(e => e.breakingLevel === 'BREAKING')) {
      lines.push(`- **${e.decisions.join(', ') || e.commit}**: ${e.summary}`);
    }
    lines.push('');
  }

  lines.push('## All Changes');
  for (const e of changelog.entries) {
    lines.push(`- [${e.impact}] ${e.summary}${e.testImpact ? ` (${e.testImpact})` : ''}`);
  }

  return lines.join('\n');
}

export function formatForW08(changelog: Changelog): string {
  const regulatory = changelog.entries.filter(e => e.impact === 'REGULATORY' || e.impact === 'CLINICAL');

  const lines = [
    `# W08 Compliance Changelog — ${changelog.version}`,
    `Period: ${changelog.dateRange.from} to ${changelog.dateRange.to}`,
    '',
    `## Regulatory/Clinical Changes: ${regulatory.length}`,
  ];

  for (const e of regulatory) {
    lines.push(`- [${e.breakingLevel}] \`${e.commit}\`: ${e.summary}`);
    if (e.decisions.length) lines.push(`  Decisions: ${e.decisions.join(', ')}`);
  }

  return lines.join('\n');
}
