/**
 * Component 9: D-Series Decision Registry
 * HIGH-YIELD PRODUCTIVITY FEATURE
 *
 * Searchable, queryable registry of all locked decisions (D-01 to D-236+).
 * Prevents architectural collisions that cost hours to resolve.
 *
 * Features:
 *  - Full D-series registry with status, date, dependencies
 *  - Conflict detection: check if a proposed change violates existing decisions
 *  - Dependency graph: which decisions depend on which
 *  - Quick lookup: "what's the rule for scoring?" -> D-15, D-37, D-212
 *  - Supersession tracking: D-22 superseded by D-29, etc.
 *  - Export for context loading (minimal token footprint)
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type DecisionStatus = 'LOCKED' | 'PENDING' | 'RESCINDED' | 'SUPERSEDED';

export interface Decision {
  id: string;           // D-01, D-38, D-236A
  title: string;
  summary: string;
  status: DecisionStatus;
  date: string;         // YYYY-MM-DD
  confirmedBy: string;  // SA, Dr Faisal, W05, etc.
  supersededBy?: string;
  supersedes?: string;
  dependencies: string[];  // other D-ids this depends on
  tags: string[];          // searchable tags: scoring, zones, T-01, etc.
}

// --- Registry ---

export const DECISION_REGISTRY: Decision[] = [
  // --- ARCHITECTURE ---
  { id: 'D-01', title: 'Zone-to-node mapping', summary: 'Z1-Z5 mapped to N1-N7. Canonical mapping locked.', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: [], tags: ['architecture', 'zones', 'nodes'] },
  { id: 'D-05', title: 'Evidence tier system', summary: '5 tiers: Established, Emerging, Theoretical, Observed in Practice, Contested.', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: [], tags: ['evidence', 'tiers', 'clinical'] },
  { id: 'D-06', title: 'S1 split label', summary: 'S1 evidence label confirmed.', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: [], tags: ['stacks', 'evidence'] },
  { id: 'D-08', title: 'S5 evidence label', summary: 'S5 evidence tier confirmed.', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: [], tags: ['stacks', 'evidence'] },
  { id: 'D-09', title: 'Mnemonic tiering', summary: '30 mnemonics tiered. HERALD/BEACON Tier 4 internal only.', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: [], tags: ['mnemonics', 'GENOME'] },
  { id: 'D-10', title: 'DRD driver designation threshold', summary: 'DRD driver designation threshold locked.', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: [], tags: ['DRD', 'scoring', 'thresholds'] },

  // --- SCORING ---
  { id: 'D-11', title: 'Node-to-zone score aggregation + floor formula', summary: 'Score aggregation method. Floor formula v2.1 candidate (MIN+1 on display scale).', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: ['D-15'], tags: ['scoring', 'floor'] },
  { id: 'D-15', title: 'Hybrid scoring', summary: '0-100 internal (high=burden), 0-10 display (low=burden, high=resilience). Translation divisor: 10.', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: [], tags: ['scoring', 'display', 'internal'] },
  { id: 'D-37', title: 'Floor formula scale', summary: 'Floor formula operates on internal 0-100 scale.', status: 'LOCKED', date: '2026-03-27', confirmedBy: 'SA', dependencies: ['D-15', 'D-11'], tags: ['scoring', 'floor'] },
  { id: 'D-212', title: 'Scoring floor RESOLVED', summary: 'Floor = MAX(dampened node scores) - 10, on internal 0-100 scale.', status: 'LOCKED', date: '2026-05-20', confirmedBy: 'SA / Dr Faisal', dependencies: ['D-15', 'D-37'], tags: ['scoring', 'floor', 'resolved'] },

  // --- THRESHOLDS ---
  { id: 'D-13', title: 'Near-threshold window (1 display point)', summary: 'RESCINDED. Replaced by D-38.', status: 'RESCINDED', date: '2026-03-15', confirmedBy: 'SA', supersededBy: 'D-38', dependencies: [], tags: ['thresholds'] },
  { id: 'D-38', title: 'Near-threshold window', summary: '5 points on internal 0-100 scale. Configurable Parameter 8. Z1-Z4=40, Z5=32. Borderline ranges: Z1-Z4=35-39, Z5=27-31.', status: 'LOCKED', date: '2026-03-27', confirmedBy: 'SA', supersedes: 'D-13', dependencies: ['D-15'], tags: ['thresholds', 'borderline', 'configurable'] },
  { id: 'D-160', title: 'N6 dampening coefficient', summary: 'N6 Communication dampening factor = 0.7. Unchanged.', status: 'LOCKED', date: '2026-05-30', confirmedBy: 'SA', dependencies: ['D-15'], tags: ['scoring', 'N6', 'dampening'] },

  // --- PIPELINE ---
  { id: 'D-16', title: 'Intake form design', summary: 'Single form with conditional branching.', status: 'LOCKED', date: '2026-03-15', confirmedBy: 'SA', dependencies: [], tags: ['INTAKE', 'form'] },
  { id: 'D-232', title: 'STRIDE 30 sequencing rules', summary: 'TS01-TS30 locked. Separate from VANTAGE namespace.', status: 'LOCKED', date: '2026-05-29', confirmedBy: 'SA', dependencies: [], tags: ['STRIDE', 'pipeline', 'sequencing'] },
  { id: 'D-233a', title: 'RIL 4 response states', summary: 'RIL response states: data layer only.', status: 'LOCKED', date: '2026-05-29', confirmedBy: 'SA', dependencies: ['D-232'], tags: ['RIL', 'pipeline'] },
  { id: 'D-233b', title: 'Pipeline order locked', summary: 'FLINT→APEX→STRIDE→RIL→CADENCE→CIL→VISTA.', status: 'LOCKED', date: '2026-05-29', confirmedBy: 'SA', dependencies: ['D-232', 'D-233a'], tags: ['pipeline', 'order'] },

  // --- MAPS ---
  { id: 'D-17', title: 'MAPS mnemonic lock', summary: 'Matrix Assisted Practitioner Synthesis. Documentation assistance only.', status: 'LOCKED', date: '2026-03-24', confirmedBy: 'SA', dependencies: [], tags: ['MAPS', 'mnemonics'] },
  { id: 'D-18', title: 'MAPS pipeline integration', summary: 'Option A: MAPS populates intake form, practitioner confirms, feeds FLINT.', status: 'LOCKED', date: '2026-03-24', confirmedBy: 'SA', dependencies: ['D-17'], tags: ['MAPS', 'pipeline', 'INTAKE'] },
  { id: 'D-19', title: 'MAPS tool execution', summary: '4-stage sequence: Safety gates, Patient context, Node/timeline extraction, Post-extraction.', status: 'LOCKED', date: '2026-03-24', confirmedBy: 'SA', dependencies: ['D-17'], tags: ['MAPS', 'execution'] },
  { id: 'D-20', title: 'MAPS conflict resolution', summary: '5-tier hierarchy: Safety > Tool 4 MES > Tools 38/44 lifestyle > ATM band > Node routing.', status: 'LOCKED', date: '2026-03-24', confirmedBy: 'SA', dependencies: ['D-17'], tags: ['MAPS', 'conflict'] },

  // --- MNEMONICS D-29 to D-36 ---
  { id: 'D-29', title: 'RECON for Lab Assist', summary: 'Resilience-Evaluated Cascade-Oriented Node-intelligence. Lab investigation intelligence.', status: 'LOCKED', date: '2026-03-25', confirmedBy: 'SA', supersedes: 'D-22', dependencies: [], tags: ['RECON', 'mnemonics'] },
  { id: 'D-30', title: 'COMPASS for Protocol Assist', summary: 'Cascade-Oriented Management Protocol Assembly and Support System. Protocol engine.', status: 'LOCKED', date: '2026-03-25', confirmedBy: 'SA', supersedes: 'D-23', dependencies: [], tags: ['COMPASS', 'mnemonics'] },
  { id: 'D-33', title: 'ANCHOR confidence layer', summary: 'Adaptive Node Confidence and Hierarchy Report.', status: 'LOCKED', date: '2026-03-25', confirmedBy: 'SA', dependencies: [], tags: ['ANCHOR', 'confidence', 'scoring'] },
  { id: 'D-34', title: 'AXIS 90-second narrative', summary: 'Adaptive Cross-zone Intelligence Summary.', status: 'LOCKED', date: '2026-03-25', confirmedBy: 'SA', dependencies: [], tags: ['AXIS', 'narrative'] },
  { id: 'D-35', title: 'INTAKE front door', summary: 'Intelligent Node Translation and Architectural Knowledge Engine.', status: 'LOCKED', date: '2026-03-25', confirmedBy: 'SA', dependencies: [], tags: ['INTAKE', 'mnemonics'] },
  { id: 'D-36', title: 'VECTOR reserved Phase 2', summary: 'Viable Evidence and Cascade Terrain Orientation Report. DO NOT BUILD.', status: 'LOCKED', date: '2026-03-25', confirmedBy: 'SA', dependencies: [], tags: ['VECTOR', 'Phase 2', 'reserved'] },

  // --- TERRAINLOCK ---
  { id: 'D-234', title: 'TerrainLock calibration steps 1-3 closed', summary: 'Options A (domain remap), B (CSV attenuation), C (coefficient reduction) all insufficient. Stack formally closed.', status: 'LOCKED', date: '2026-05-30', confirmedBy: 'SA / Dr Faisal', dependencies: ['D-160'], tags: ['TerrainLock', 'calibration'] },
  { id: 'D-236', title: 'TerrainLock root cause + corrections', summary: '60% wrong expected values, 40% TerrainLock artefact. Cases 3,6,8,9 corrected.', status: 'LOCKED', date: '2026-05-30', confirmedBy: 'Dr Faisal (D-220)', dependencies: ['D-234'], tags: ['TerrainLock', 'calibration'] },
  { id: 'D-236A', title: 'TerrainLock strict inequality gate', summary: 'N1+N2-only Z2 must exceed 40 (strict >) for TerrainLock to fire.', status: 'LOCKED', date: '2026-05-30', confirmedBy: 'SA / Dr Faisal', dependencies: ['D-236'], tags: ['TerrainLock', 'gate', 'scoring'] },
];

// --- Search ---

export function searchDecisions(query: string): Decision[] {
  const q = query.toLowerCase();
  return DECISION_REGISTRY.filter(d =>
    d.id.toLowerCase().includes(q) ||
    d.title.toLowerCase().includes(q) ||
    d.summary.toLowerCase().includes(q) ||
    d.tags.some(t => t.toLowerCase().includes(q))
  );
}

// --- Conflict Detection ---

export function checkConflict(proposedChange: string): Decision[] {
  const conflicts: Decision[] = [];
  const lower = proposedChange.toLowerCase();

  for (const d of DECISION_REGISTRY) {
    if (d.status !== 'LOCKED') continue;

    // Check if proposed change touches a locked decision's domain
    if (d.tags.some(tag => lower.includes(tag.toLowerCase()))) {
      conflicts.push(d);
    }
  }

  return conflicts;
}

// --- Dependency Graph ---

export function getDependencyChain(decisionId: string): Decision[] {
  const chain: Decision[] = [];
  const visited = new Set<string>();

  function walk(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const d = DECISION_REGISTRY.find(dec => dec.id === id);
    if (!d) return;

    chain.push(d);
    for (const dep of d.dependencies) {
      walk(dep);
    }
  }

  walk(decisionId);
  return chain;
}

// --- Supersession Chain ---

export function getSupersessionChain(decisionId: string): Decision[] {
  const chain: Decision[] = [];
  let current = DECISION_REGISTRY.find(d => d.id === decisionId);

  while (current) {
    chain.push(current);
    if (current.supersededBy) {
      current = DECISION_REGISTRY.find(d => d.id === current!.supersededBy);
    } else {
      break;
    }
  }

  return chain;
}

// --- Context Export (minimal tokens) ---

export function exportForContext(tags?: string[]): string {
  let decisions = DECISION_REGISTRY.filter(d => d.status === 'LOCKED');

  if (tags) {
    decisions = decisions.filter(d => d.tags.some(t => tags.includes(t)));
  }

  return decisions
    .map(d => `${d.id}: ${d.summary}`)
    .join('\n');
}

// --- Stats ---

export function getRegistryStats() {
  return {
    total: DECISION_REGISTRY.length,
    locked: DECISION_REGISTRY.filter(d => d.status === 'LOCKED').length,
    pending: DECISION_REGISTRY.filter(d => d.status === 'PENDING').length,
    rescinded: DECISION_REGISTRY.filter(d => d.status === 'RESCINDED').length,
    superseded: DECISION_REGISTRY.filter(d => d.status === 'SUPERSEDED').length,
    tags: [...new Set(DECISION_REGISTRY.flatMap(d => d.tags))].sort(),
  };
}
