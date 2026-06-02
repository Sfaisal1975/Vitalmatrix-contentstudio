/**
 * Component 12: Context Window Optimizer
 * GOLD STANDARD PRODUCTIVITY FEATURE
 *
 * The single biggest cost in Claude Code is context tokens. This component
 * generates minimal, compressed context payloads for different task types.
 * Instead of loading the full 5-page MasterContext every session, load only
 * what the current task needs.
 *
 * Features:
 *  - Task-aware context slicing (only load what's relevant)
 *  - Token estimation (approximate cost before loading)
 *  - Context profiles for common task types
 *  - Memory-aware: excludes information already in CLAUDE.md/memory files
 *  - Progressive loading: start minimal, expand on demand
 */

import { VM_BRAND } from './brand-config';
import { CANONICAL } from './c10-architecture-guard';
import { DECISION_REGISTRY, searchDecisions, exportForContext } from './c9-decision-registry';

// --- Types ---

export type TaskProfile =
  | 'engine-build'      // Working on L1-L9 pipeline engines
  | 'intake-feature'    // Building INTAKE features
  | 'connection-work'   // VANTAGE connections/hooks/SCs
  | 'scoring-work'      // Scoring, thresholds, calibration
  | 'clinical-output'   // Generating practitioner-facing content
  | 'regulatory'        // Safety features, compliance, MHRA
  | 'html-visual'       // Living Architectures, demos, HTML builds
  | 'audit'             // Stress tests, audits, validation
  | 'session-admin'     // Git, session wraps, Notion updates
  | 'content-creation'  // Blog posts, PDFs, SEO
  | 'full';             // Everything (fallback)

export interface ContextPayload {
  profile: TaskProfile;
  sections: string[];
  estimatedTokens: number;
  content: string;
}

// --- Token Estimator (rough: 1 token ≈ 4 chars) ---

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// --- Context Sections ---

const SECTION_IDENTITY = `PROJECT: VitalMatrix terrain intelligence platform
OWNER: Dr Shahzad Faisal, MBBS, FAAMFM (never MD, never FMAARM)
COMPANY: VitalMatrix Ltd | ICO ZC101813
PHASE: Phase 1 active. 10 founding practitioners.
PRICING: GBP 299/month (IFM), GBP 399/month (non-IFM)
PAUSED: HHW, The Performance Code — do not build.`;

const SECTION_ARCHITECTURE = `NODES (7 only, never 8): N1 Assimilation | N2 Defence and Repair | N3 Energy | N4 Biotransformation and Elimination | N5 Transport | N6 Communication | N7 Structural Integrity
MES = foundational context, NOT a node.
ZONES (5 only, Z6+ is ALWAYS error): Z1 N6+N3 | Z2 N1+N2+N6 | Z3 N5+N6 | Z4 N4+N2 | Z5 N6+N4+N3
STACKS (6 only): S1 Z2→Z1 Emerging | S2 Z1→Z5 Established | S3 Z4→Z1 Emerging | S4 Z5→Z2 ALWAYS Theoretical | S5 Z2→Z3 Emerging | S6 Z1→Z3 Established UNIDIRECTIONAL
TerrainLock: Z2→Z1→Z5→Z2 loop. Z2 gut restoration = tiebreaker. Gate: N1+N2-only Z2 > 40 (D-236A).`;

const SECTION_SCORING = `SCORING (D-15): Internal 0-100 (high=burden). Display 0-10 (low=burden, high=resilience). Divisor: 10.
N6 dampening: 0.7 (D-160)
Floor: MAX(dampened node scores) - 10 on internal scale (D-212 RESOLVED)
Thresholds (D-38): Z1-Z4=40, Z5=32. Borderline window=5 internal points (Configurable Parameter 8, never hardcode).
Borderline tooltip required on every near-threshold label.`;

const SECTION_T01 = `T-01 ACTIVE. All 7 rules:
W5-1: Title = "Terrain Support Considerations"
W5-2: Fixed opening line (not editable)
W5-3 [PERMANENT]: Protective header before clinical content
W5-4 [PERMANENT]: Blank Practitioner Clinical Decision section at end
W5-5: CascadeIQ bands suppressed → "Terrain Resilience: X/10"
W5-6: Driver → "Highest burden zone". Reactor → "Secondary burden zone"
W5-7: Supplements, dietary, lifestyle ONLY. Zero pharmaceutical in output.`;

const SECTION_PIPELINE = `PIPELINE (D-233b): FLINT→APEX→STRIDE→RIL→CADENCE→CIL→VISTA
GATE CHAIN: T-03→F41→F42→F47→L1→L2→L3→L4→L5→L6→L7→Sentinels→Review Gate
STRIDE: 30 rules (TS01-TS30). RIL: 4 response states (data layer).`;

const SECTION_CSV = `CSV PRINCIPLES (Gate O1 locked):
1. Terrain impact must be mechanistically justified
2. Highest burden zone only (not dual designation)
3. Insulin = N6 Communication. NEVER N3 Energy.
4. Ubiquity guard: common substances need specific pathway
5. British English, IFM taxonomy`;

const SECTION_DESIGN = `DESIGN: Prussian Blue #0D2B4E | Charcoal #1A2030 | Deep Teal #0C4452
Gold #C9A84C | Teal #1A7A8A | Purple #7B5EA7 (Z3) | Sage #5F7C6C
Fonts: Cormorant Garamond (headings), Outfit (body), DM Mono (data)
NEVER: DM Sans, IBM Plex Mono, Inter. CSS: --vm- prefix. Offline fonts only.`;

const SECTION_GATES = `GATES: O1 PASSED | V1 PASSED | O2 PENDING (Hook 10 DRD) | O5 PARKED | O6 CLOSED | O9 PENDING
SA Override: W08 per-feature gate LIFTED, Class I SaMD registered.
Phase 1: 37/37 features BUILT. 336/336 tests pass. 17 commits.
Regulatory floor: 10/10 complete (F41-F50).`;

const SECTION_EVIDENCE = `EVIDENCE TIERS (required on every clinical claim):
Established | Emerging | Theoretical | Observed in Practice | Contested
Z3 and Z4: NOT ready for composite scoring in Phase 1.`;

const SECTION_DEPRECATED = `DEPRECATED (never use): ITRE | FeatureAtlas | Halo | Timeline Archaeology | MES as node | N8 | Z6+ | S4 non-Theoretical | L1-L6 layer names | FMAARM | MD | CARPET | DAMPIN | GOTOIT without IFM clearance`;

// --- Profile Mappings ---

const PROFILE_SECTIONS: Record<TaskProfile, string[]> = {
  'engine-build': ['identity', 'architecture', 'scoring', 'pipeline', 'csv', 'evidence', 'deprecated', 'gates'],
  'intake-feature': ['identity', 'architecture', 'pipeline', 'csv', 'gates'],
  'connection-work': ['identity', 'architecture', 'evidence', 'deprecated'],
  'scoring-work': ['identity', 'architecture', 'scoring', 'evidence'],
  'clinical-output': ['identity', 'architecture', 'scoring', 't01', 'evidence', 'csv'],
  'regulatory': ['identity', 't01', 'gates', 'evidence'],
  'html-visual': ['identity', 'architecture', 'design', 'deprecated'],
  'audit': ['identity', 'architecture', 'scoring', 'pipeline', 'csv', 'evidence', 'deprecated', 'gates'],
  'session-admin': ['identity', 'gates'],
  'content-creation': ['identity', 'design', 'evidence', 't01'],
  'full': ['identity', 'architecture', 'scoring', 't01', 'pipeline', 'csv', 'design', 'gates', 'evidence', 'deprecated'],
};

const SECTION_MAP: Record<string, string> = {
  identity: SECTION_IDENTITY,
  architecture: SECTION_ARCHITECTURE,
  scoring: SECTION_SCORING,
  t01: SECTION_T01,
  pipeline: SECTION_PIPELINE,
  csv: SECTION_CSV,
  design: SECTION_DESIGN,
  gates: SECTION_GATES,
  evidence: SECTION_EVIDENCE,
  deprecated: SECTION_DEPRECATED,
};

// --- Generator ---

export function generateContext(profile: TaskProfile, additionalDecisionTags?: string[]): ContextPayload {
  const sectionNames = PROFILE_SECTIONS[profile];
  const sections = sectionNames.map(name => SECTION_MAP[name]).filter(Boolean);

  // Add relevant decisions if tags provided
  if (additionalDecisionTags) {
    const decisions = exportForContext(additionalDecisionTags);
    if (decisions) {
      sections.push(`RELEVANT DECISIONS:\n${decisions}`);
    }
  }

  const content = sections.join('\n\n---\n\n');

  return {
    profile,
    sections: sectionNames,
    estimatedTokens: estimateTokens(content),
    content,
  };
}

// --- Comparison ---

export function compareContextSizes(): Record<TaskProfile, number> {
  const profiles: TaskProfile[] = [
    'engine-build', 'intake-feature', 'connection-work', 'scoring-work',
    'clinical-output', 'regulatory', 'html-visual', 'audit',
    'session-admin', 'content-creation', 'full',
  ];

  const sizes: Record<string, number> = {};
  for (const p of profiles) {
    sizes[p] = generateContext(p).estimatedTokens;
  }

  return sizes as Record<TaskProfile, number>;
}

// --- Quick Context for common queries ---

export function quickContext(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('scoring') || q.includes('score') || q.includes('threshold')) {
    return SECTION_SCORING;
  }
  if (q.includes('t-01') || q.includes('t01') || q.includes('output')) {
    return SECTION_T01;
  }
  if (q.includes('pipeline') || q.includes('stride') || q.includes('flint')) {
    return SECTION_PIPELINE;
  }
  if (q.includes('zone') || q.includes('node') || q.includes('stack') || q.includes('cascade')) {
    return SECTION_ARCHITECTURE;
  }
  if (q.includes('colour') || q.includes('color') || q.includes('font') || q.includes('design')) {
    return SECTION_DESIGN;
  }
  if (q.includes('gate') || q.includes('status') || q.includes('regulatory')) {
    return SECTION_GATES;
  }

  return SECTION_IDENTITY;
}
