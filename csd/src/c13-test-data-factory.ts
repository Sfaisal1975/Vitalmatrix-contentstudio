/**
 * Component 13: Test Data Factory
 * GOLD STANDARD PRODUCTIVITY FEATURE
 *
 * Generates architecturally-valid synthetic test data for any VitalMatrix component.
 * Every test needs patient profiles, zone scores, node scores, cascade stacks.
 * Building these manually is slow and error-prone.
 *
 * Features:
 *  - Synthetic patient profiles (demographically varied, clinically realistic)
 *  - Valid ZoneScoreMaps (respect all thresholds, dampening, floor formula)
 *  - Valid NodeScoreMaps (7 nodes only, 0-100 internal scale)
 *  - Cascade stack activation data (with evidence tiers, S4 always Theoretical)
 *  - DRD designation data (highest burden zone, not dual)
 *  - Edge case generators (all zones borderline, all active, single zone, TerrainLock trigger)
 *  - Adversarial profiles (designed to break engines)
 */

import { CANONICAL } from './c10-architecture-guard';

// --- Types ---

export interface NodeScoreMap {
  N1: number; N2: number; N3: number; N4: number;
  N5: number; N6: number; N7: number;
}

export interface DampenedNodeScoreMap extends NodeScoreMap {
  N6_dampened: number;
}

export interface ZoneScoreMap {
  Z1: number; Z2: number; Z3: number; Z4: number; Z5: number;
}

export interface ZoneStatus {
  zone: string;
  score: number;
  status: 'Active' | 'Borderline (near threshold)' | 'Inactive';
}

export interface CascadeActivation {
  stack: string;
  from: string;
  to: string;
  active: boolean;
  evidenceTier: string;
  isUnidirectional: boolean;
}

export interface SyntheticPatient {
  id: string;
  age: number;
  sex: 'M' | 'F';
  label: string;
  nodeScores: NodeScoreMap;
  dampenedScores: DampenedNodeScoreMap;
  zoneScores: ZoneScoreMap;
  zoneStatuses: ZoneStatus[];
  cascades: CascadeActivation[];
  highestBurdenZone: string;
  terrainResilience: number;  // 0-10 display
  terrainLockActive: boolean;
  floorScore: number;
}

// --- Helpers ---

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyDampening(scores: NodeScoreMap): DampenedNodeScoreMap {
  return {
    ...scores,
    N6_dampened: Math.round(scores.N6 * CANONICAL.scoring.n6DampeningFactor),
  };
}

function calculateZoneScore(zone: keyof typeof CANONICAL.zoneMappings, dampened: DampenedNodeScoreMap): number {
  const nodes = CANONICAL.zoneMappings[zone];
  const values = nodes.map(n => n === 'N6' ? dampened.N6_dampened : dampened[n as keyof NodeScoreMap]);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function calculateFloor(dampened: DampenedNodeScoreMap): number {
  const allDampened = [dampened.N1, dampened.N2, dampened.N3, dampened.N4, dampened.N5, dampened.N6_dampened, dampened.N7];
  return Math.max(...allDampened) - 10;  // D-212
}

function getZoneStatus(zone: string, score: number): 'Active' | 'Borderline (near threshold)' | 'Inactive' {
  const threshold = CANONICAL.thresholds[zone as keyof typeof CANONICAL.thresholds] || 40;
  const borderlineMin = threshold - CANONICAL.thresholds.borderlineWindow;

  if (score >= threshold) return 'Active';
  if (score >= borderlineMin) return 'Borderline (near threshold)';
  return 'Inactive';
}

function getHighestBurdenZone(zones: ZoneScoreMap): string {
  return Object.entries(zones).sort(([, a], [, b]) => b - a)[0][0];
}

function checkTerrainLock(zones: ZoneScoreMap, dampened: DampenedNodeScoreMap): boolean {
  // D-236A: N1+N2-only Z2 must exceed 40 (strict >)
  const n1n2OnlyZ2 = Math.round((dampened.N1 + dampened.N2) / 2);
  if (n1n2OnlyZ2 <= 40) return false;

  // Z2, Z1, Z5 must all be active
  return zones.Z2 >= 40 && zones.Z1 >= 40 && zones.Z5 >= 32;
}

function calculateCascades(zones: ZoneScoreMap): CascadeActivation[] {
  return Object.entries(CANONICAL.stackRules).map(([stack, rule]) => {
    const fromThreshold = CANONICAL.thresholds[rule.from as keyof typeof CANONICAL.thresholds] || 40;
    const toThreshold = CANONICAL.thresholds[rule.to as keyof typeof CANONICAL.thresholds] || 40;

    return {
      stack,
      from: rule.from,
      to: rule.to,
      active: zones[rule.from as keyof ZoneScoreMap] >= fromThreshold && zones[rule.to as keyof ZoneScoreMap] >= toThreshold,
      evidenceTier: rule.evidence,
      isUnidirectional: stack === 'S6',
    };
  });
}

// --- Patient Generator ---

export function generatePatient(label: string, nodeOverrides?: Partial<NodeScoreMap>): SyntheticPatient {
  const nodeScores: NodeScoreMap = {
    N1: rand(10, 90),
    N2: rand(10, 90),
    N3: rand(10, 90),
    N4: rand(10, 90),
    N5: rand(10, 90),
    N6: rand(10, 90),
    N7: rand(10, 90),
    ...nodeOverrides,
  };

  const dampened = applyDampening(nodeScores);

  const zoneScores: ZoneScoreMap = {
    Z1: calculateZoneScore('Z1', dampened),
    Z2: calculateZoneScore('Z2', dampened),
    Z3: calculateZoneScore('Z3', dampened),
    Z4: calculateZoneScore('Z4', dampened),
    Z5: calculateZoneScore('Z5', dampened),
  };

  const zoneStatuses = Object.entries(zoneScores).map(([zone, score]) => ({
    zone,
    score,
    status: getZoneStatus(zone, score),
  }));

  const maxZoneScore = Math.max(...Object.values(zoneScores));
  const displayScore = Math.round((100 - maxZoneScore) / 10);

  return {
    id: `SYN-${Date.now()}-${rand(100, 999)}`,
    age: rand(25, 75),
    sex: Math.random() > 0.5 ? 'M' : 'F',
    label,
    nodeScores,
    dampenedScores: dampened,
    zoneScores,
    zoneStatuses,
    cascades: calculateCascades(zoneScores),
    highestBurdenZone: getHighestBurdenZone(zoneScores),
    terrainResilience: Math.max(0, Math.min(10, displayScore)),
    terrainLockActive: checkTerrainLock(zoneScores, dampened),
    floorScore: calculateFloor(dampened),
  };
}

// --- Preset Profiles ---

export const PRESETS = {
  /** All zones well below threshold — healthy baseline */
  healthy: () => generatePatient('Healthy Baseline', { N1: 15, N2: 12, N3: 18, N4: 14, N5: 10, N6: 20, N7: 11 }),

  /** Z2 dominant — gut-driven burden */
  gutDriven: () => generatePatient('Gut-Driven Burden', { N1: 75, N2: 70, N6: 65, N3: 30, N4: 25, N5: 20, N7: 15 }),

  /** Z1 dominant — energy/metabolic burden */
  energyDriven: () => generatePatient('Energy-Driven Burden', { N6: 80, N3: 72, N1: 30, N2: 25, N4: 20, N5: 18, N7: 15 }),

  /** Z5 dominant — hormonal burden */
  hormonalDriven: () => generatePatient('Hormonal-Driven Burden', { N6: 70, N4: 65, N3: 60, N1: 20, N2: 22, N5: 18, N7: 12 }),

  /** TerrainLock trigger — Z2+Z1+Z5 all active */
  terrainLock: () => generatePatient('TerrainLock Trigger', { N1: 70, N2: 68, N6: 75, N3: 65, N4: 60, N5: 30, N7: 25 }),

  /** All zones borderline — stress test */
  allBorderline: () => generatePatient('All Borderline', { N1: 38, N2: 37, N3: 36, N4: 38, N5: 37, N6: 55, N7: 36 }),

  /** Single zone active, rest inactive */
  singleZone: (zone: string) => {
    const high = zone === 'Z5' ? { N6: 60, N4: 55, N3: 50 } : { N1: 70, N2: 65 };
    return generatePatient(`Single Zone ${zone}`, { N1: 15, N2: 12, N3: 14, N4: 10, N5: 11, N6: 20, N7: 13, ...high });
  },

  /** Maximum burden — all nodes high */
  maxBurden: () => generatePatient('Maximum Burden', { N1: 90, N2: 88, N3: 85, N4: 87, N5: 82, N6: 92, N7: 80 }),

  /** N6 dampening stress — very high N6, moderate others */
  n6Stress: () => generatePatient('N6 Dampening Stress', { N1: 40, N2: 38, N3: 42, N4: 35, N5: 30, N6: 95, N7: 28 }),
};

// --- Batch Generator ---

export function generateTestSuite(count: number = 20): SyntheticPatient[] {
  const patients: SyntheticPatient[] = [
    PRESETS.healthy(),
    PRESETS.gutDriven(),
    PRESETS.energyDriven(),
    PRESETS.hormonalDriven(),
    PRESETS.terrainLock(),
    PRESETS.allBorderline(),
    PRESETS.maxBurden(),
    PRESETS.n6Stress(),
  ];

  // Fill remaining with random profiles
  while (patients.length < count) {
    patients.push(generatePatient(`Random Profile ${patients.length + 1}`));
  }

  return patients;
}

// --- Export as Test Fixtures ---

export function exportAsTestFixtures(patients: SyntheticPatient[]): string {
  return `// Auto-generated test fixtures — ${new Date().toISOString()}
// Generated by VitalMatrix Content Studio C13 Test Data Factory

export const TEST_PATIENTS = ${JSON.stringify(patients, null, 2)} as const;
`;
}
