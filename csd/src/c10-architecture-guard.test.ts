/**
 * Tests for Component 10: Architecture Guard
 * Validates every guard rule with positive, negative, and edge cases.
 */

import { guardFile, generateGuardReport, CANONICAL } from './c10-architecture-guard';

let passed = 0;
let failed = 0;
const failures: string[] = [];
function test(name: string, fn: () => void): void {
  try { fn(); passed++; } catch (e: any) { failed++; failures.push(`FAIL: ${name} — ${e.message}`); }
}
function assert(condition: boolean, msg: string): void {
  if (!condition) throw new Error(msg);
}

// ============================================================
// CANONICAL CONSTANTS TESTS
// ============================================================

test('CANONICAL has exactly 7 nodes', () => {
  assert(CANONICAL.nodes.length === 7, `Expected 7 nodes, got ${CANONICAL.nodes.length}`);
});

test('CANONICAL has exactly 5 zones', () => {
  assert(CANONICAL.zones.length === 5, `Expected 5 zones, got ${CANONICAL.zones.length}`);
});

test('CANONICAL has exactly 6 stacks', () => {
  assert(CANONICAL.stacks.length === 6, `Expected 6 stacks, got ${CANONICAL.stacks.length}`);
});

test('CANONICAL pipeline has 7 engines in correct order', () => {
  const expected = ['FLINT', 'APEX', 'STRIDE', 'RIL', 'CADENCE', 'CIL', 'VISTA'];
  assert(JSON.stringify([...CANONICAL.pipeline]) === JSON.stringify(expected),
    `Pipeline order mismatch: ${CANONICAL.pipeline}`);
});

test('CANONICAL S4 is Theoretical', () => {
  assert(CANONICAL.stackRules.S4.evidence === 'Theoretical', 'S4 must be Theoretical');
});

test('CANONICAL N6 dampening is 0.7', () => {
  assert(CANONICAL.scoring.n6DampeningFactor === 0.7, 'N6 dampening must be 0.7');
});

test('CANONICAL Z5 threshold is 32', () => {
  assert(CANONICAL.thresholds.Z5 === 32, `Z5 threshold expected 32, got ${CANONICAL.thresholds.Z5}`);
});

test('CANONICAL Z1-Z4 thresholds are 40', () => {
  for (const z of ['Z1', 'Z2', 'Z3', 'Z4'] as const) {
    assert(CANONICAL.thresholds[z] === 40, `${z} threshold expected 40, got ${CANONICAL.thresholds[z]}`);
  }
});

test('CANONICAL floor formula is MAX(dampened) - 10', () => {
  assert(CANONICAL.scoring.floorFormula === 'MAX(dampened) - 10', 'Floor formula mismatch');
});

// ============================================================
// ALB-N8: No 8th node
// ============================================================

test('ALB-N8: detects N8 reference', () => {
  const v = guardFile('const node = N8;');
  assert(v.length > 0, 'Should detect N8');
  assert(v[0].rule === 'ALB-N8', `Expected ALB-N8, got ${v[0].rule}`);
});

test('ALB-N8: clean N7 reference passes', () => {
  const v = guardFile('const node = N7;');
  const n8 = v.filter(x => x.rule === 'ALB-N8');
  assert(n8.length === 0, 'N7 should not trigger ALB-N8');
});

test('ALB-N8: N8 in string literal is still caught (strict guard)', () => {
  const v = guardFile("const msg = 'N8 is invalid';");
  const n8 = v.filter(x => x.rule === 'ALB-N8');
  assert(n8.length > 0, 'N8 should be caught even in strings — strict architecture guard');
});

test('ALB-N8: N8 in double-quoted string is allowed', () => {
  const v = guardFile('const msg = "N8";');
  const n8 = v.filter(x => x.rule === 'ALB-N8');
  assert(n8.length === 0, 'N8 in double quotes should be allowed');
});

// ============================================================
// ALB-Z6+: No zone 6 or higher
// ============================================================

test('ALB-Z6+: detects Z6 reference', () => {
  const v = guardFile('process zone Z6 data');
  assert(v.some(x => x.rule === 'ALB-Z6+'), 'Should detect Z6');
});

test('ALB-Z6+: detects Z9 reference', () => {
  const v = guardFile('const z = Z9;');
  assert(v.some(x => x.rule === 'ALB-Z6+'), 'Should detect Z9');
});

test('ALB-Z6+: clean Z5 passes', () => {
  const v = guardFile('const zone = Z5;');
  assert(!v.some(x => x.rule === 'ALB-Z6+'), 'Z5 should not trigger Z6+ rule');
});

// ============================================================
// ALB-S7+: No stack 7 or higher
// ============================================================

test('ALB-S7+: detects S7 reference', () => {
  const v = guardFile('activate S7 pathway');
  assert(v.some(x => x.rule === 'ALB-S7+'), 'Should detect S7');
});

test('ALB-S7+: clean S6 passes', () => {
  const v = guardFile('const stack = S6;');
  assert(!v.some(x => x.rule === 'ALB-S7+'), 'S6 should not trigger S7+ rule');
});

test('ALB-S7+: S7 sentinel exception allowed', () => {
  const v = guardFile('S7 sentinel check');
  assert(!v.some(x => x.rule === 'ALB-S7+'), 'S7 sentinel should be allowed');
});

test('ALB-S7+: detects S8 reference', () => {
  const v = guardFile('register S8 cascade');
  assert(v.some(x => x.rule === 'ALB-S7+'), 'Should detect S8');
});

// ============================================================
// ALB-S4-THEORETICAL: S4 must always be Theoretical
// ============================================================

test('ALB-S4-THEORETICAL: S4 with Established triggers error', () => {
  const v = guardFile('S4 evidence: Established');
  assert(v.some(x => x.rule === 'ALB-S4-THEORETICAL'), 'S4 Established should be caught');
});

test('ALB-S4-THEORETICAL: S4 with Emerging triggers error', () => {
  const v = guardFile('S4 tier is Emerging');
  assert(v.some(x => x.rule === 'ALB-S4-THEORETICAL'), 'S4 Emerging should be caught');
});

test('ALB-S4-THEORETICAL: S4 with Theoretical passes', () => {
  const v = guardFile('S4 evidence: Theoretical');
  assert(!v.some(x => x.rule === 'ALB-S4-THEORETICAL'), 'S4 Theoretical should pass');
});

test('ALB-S4-THEORETICAL: S4 line with both Emerging and Theoretical passes', () => {
  const v = guardFile('S4 was Emerging, now Theoretical');
  assert(!v.some(x => x.rule === 'ALB-S4-THEORETICAL'), 'Line mentioning both should pass if Theoretical present');
});

// ============================================================
// ALB-S6-UNIDIR: S6 is unidirectional (Z1->Z3 only)
// ============================================================

test('ALB-S6-UNIDIR: S6 reverse direction Z3->Z1 triggers error', () => {
  const v = guardFile('S6 flows Z3 to Z1');
  assert(v.some(x => x.rule === 'ALB-S6-UNIDIR'), 'S6 reverse should be caught');
});

test('ALB-S6-UNIDIR: S6 bidirectional triggers error', () => {
  const v = guardFile('S6 is bidirectional');
  assert(v.some(x => x.rule === 'ALB-S6-UNIDIR'), 'S6 bidirectional should be caught');
});

test('ALB-S6-UNIDIR: S6 without reverse passes', () => {
  const v = guardFile('S6 pathway active');
  assert(!v.some(x => x.rule === 'ALB-S6-UNIDIR'), 'S6 without reverse should pass');
});

// ============================================================
// ALB-N6-DAMP: N6 dampening must be 0.7
// ============================================================

test('ALB-N6-DAMP: wrong dampening factor 0.5 triggers error', () => {
  const v = guardFile('dampening factor = 0.5');
  assert(v.some(x => x.rule === 'ALB-N6-DAMP'), 'dampening 0.5 should be caught');
});

test('ALB-N6-DAMP: wrong dampening factor 0.8 triggers error', () => {
  const v = guardFile('dampening = 0.8');
  assert(v.some(x => x.rule === 'ALB-N6-DAMP'), 'dampening 0.8 should be caught');
});

test('ALB-N6-DAMP: correct dampening 0.7 passes', () => {
  const v = guardFile('dampening factor = 0.7');
  assert(!v.some(x => x.rule === 'ALB-N6-DAMP'), 'dampening 0.7 should pass');
});

test('ALB-N6-DAMP: no dampening keyword passes', () => {
  const v = guardFile('const factor = 0.5;');
  assert(!v.some(x => x.rule === 'ALB-N6-DAMP'), 'No dampening keyword should pass');
});

// ============================================================
// ALB-MES-NODE: MES is not a node
// ============================================================

test('ALB-MES-NODE: MES as node triggers error', () => {
  const v = guardFile('MES is the 8th node');
  assert(v.some(x => x.rule === 'ALB-MES-NODE'), 'MES as node should be caught');
});

test('ALB-MES-NODE: MES node triggers error', () => {
  const v = guardFile('the MES node processes data');
  assert(v.some(x => x.rule === 'ALB-MES-NODE'), 'MES node should be caught');
});

test('ALB-MES-NODE: MES without node context passes', () => {
  const v = guardFile('MES provides foundational context');
  assert(!v.some(x => x.rule === 'ALB-MES-NODE'), 'MES without node should pass');
});

// ============================================================
// ALB-DEPRECATED-VAR: Deprecated variable names
// ============================================================

test('ALB-DEPRECATED-VAR: detects ITRE', () => {
  const v = guardFile('const score = ITRE.calculate();');
  assert(v.some(x => x.rule === 'ALB-DEPRECATED-VAR'), 'ITRE should be caught');
});

test('ALB-DEPRECATED-VAR: detects FeatureAtlas', () => {
  const v = guardFile('import FeatureAtlas from "./atlas";');
  assert(v.some(x => x.rule === 'ALB-DEPRECATED-VAR'), 'FeatureAtlas should be caught');
});

test('ALB-DEPRECATED-VAR: detects haloScore', () => {
  const v = guardFile('const x = haloScore * 2;');
  assert(v.some(x => x.rule === 'ALB-DEPRECATED-VAR'), 'haloScore should be caught');
});

test('ALB-DEPRECATED-VAR: detects CARPET', () => {
  const v = guardFile('CARPET algorithm runs here');
  assert(v.some(x => x.rule === 'ALB-DEPRECATED-VAR'), 'CARPET should be caught');
});

test('ALB-DEPRECATED-VAR: detects DAMPIN', () => {
  const v = guardFile('use DAMPIN factor');
  assert(v.some(x => x.rule === 'ALB-DEPRECATED-VAR'), 'DAMPIN should be caught');
});

test('ALB-DEPRECATED-VAR: clean code passes', () => {
  const v = guardFile('const score = calculateBurden();');
  assert(!v.some(x => x.rule === 'ALB-DEPRECATED-VAR'), 'Clean code should pass');
});

// ============================================================
// ALB-CP8-HARDCODE: No hardcoded Configurable Parameter 8
// ============================================================

test('ALB-CP8-HARDCODE: borderline = 5 triggers warning', () => {
  const v = guardFile('const borderline = 5;');
  assert(v.some(x => x.rule === 'ALB-CP8-HARDCODE'), 'Hardcoded borderline should be caught');
});

test('ALB-CP8-HARDCODE: NEAR_THRESHOLD = 5 triggers warning', () => {
  const v = guardFile('const NEAR_THRESHOLD = 5;');
  assert(v.some(x => x.rule === 'ALB-CP8-HARDCODE'), 'Hardcoded NEAR_THRESHOLD should be caught');
});

test('ALB-CP8-HARDCODE: configurable parameter reference passes', () => {
  const v = guardFile('const borderline = config.nearThreshold;');
  assert(!v.some(x => x.rule === 'ALB-CP8-HARDCODE'), 'Configurable param should pass');
});

// ============================================================
// ALB-PIPELINE-ORDER: Pipeline order must match D-233b
// ============================================================

test('ALB-PIPELINE-ORDER: STRIDE before APEX triggers error', () => {
  const v = guardFile('run STRIDE then APEX');
  assert(v.some(x => x.rule === 'ALB-PIPELINE-ORDER'), 'STRIDE before APEX should be caught');
});

test('ALB-PIPELINE-ORDER: correct order passes', () => {
  const v = guardFile('pipeline: FLINT, APEX, STRIDE, RIL, CADENCE, CIL, VISTA');
  assert(!v.some(x => x.rule === 'ALB-PIPELINE-ORDER'), 'Correct pipeline order should pass');
});

// ============================================================
// CSV-P3-INSULIN: Insulin routes to N6, not N3
// ============================================================

test('CSV-P3-INSULIN: insulin routed to N3 triggers error', () => {
  const v = guardFile('insulin processing in N3 energy');
  assert(v.some(x => x.rule === 'CSV-P3-INSULIN'), 'Insulin in N3 should be caught');
});

test('CSV-P3-INSULIN: insulin routed to N6 passes', () => {
  const v = guardFile('insulin signalling via N6 communication');
  assert(!v.some(x => x.rule === 'CSV-P3-INSULIN'), 'Insulin in N6 should pass');
});

test('CSV-P3-INSULIN: insulin with both N3 and N6 passes', () => {
  const v = guardFile('insulin mapped N3 but routed via N6');
  assert(!v.some(x => x.rule === 'CSV-P3-INSULIN'), 'Insulin with N6 present should pass');
});

test('CSV-P3-INSULIN: no insulin mention passes', () => {
  const v = guardFile('const energyScore = N3.calculate();');
  assert(!v.some(x => x.rule === 'CSV-P3-INSULIN'), 'No insulin keyword should pass');
});

// ============================================================
// guardFile integration tests
// ============================================================

test('guardFile: clean file returns empty violations', () => {
  const v = guardFile('const x = 1;\nconst y = N7;\nconst z = Z5;');
  assert(v.length === 0, `Expected 0 violations, got ${v.length}`);
});

test('guardFile: multiple violations on different lines', () => {
  const v = guardFile('use N8 here\nzone Z6 active\nstack S7 enabled');
  assert(v.length >= 3, `Expected at least 3 violations, got ${v.length}`);
});

test('guardFile: violations include file name when provided', () => {
  const v = guardFile('N8 reference', 'test.ts');
  assert(v[0].file === 'test.ts', 'File name should be attached');
});

test('guardFile: violations sorted by severity (ERROR before WARNING)', () => {
  const v = guardFile('use N8 here\nold ITRE variable');
  assert(v.length >= 2, 'Should have at least 2 violations');
  const firstError = v.findIndex(x => x.severity === 'ERROR');
  const firstWarning = v.findIndex(x => x.severity === 'WARNING');
  if (firstError >= 0 && firstWarning >= 0) {
    assert(firstError < firstWarning, 'ERRORs should come before WARNINGs');
  }
});

test('guardFile: line numbers are 1-based', () => {
  const v = guardFile('clean line\nN8 reference');
  const n8 = v.find(x => x.rule === 'ALB-N8');
  assert(n8 !== undefined, 'Should find N8 violation');
  assert(n8!.line === 2, `Expected line 2, got ${n8!.line}`);
});

// ============================================================
// generateGuardReport tests
// ============================================================

test('generateGuardReport: clean file shows PASS', () => {
  const report = generateGuardReport([], 'clean.ts');
  assert(report.includes('PASS'), 'Should say PASS');
  assert(report.includes('clean.ts'), 'Should include filename');
});

test('generateGuardReport: violations show FAIL', () => {
  const v = guardFile('N8 is wrong');
  const report = generateGuardReport(v);
  assert(report.includes('FAIL'), 'Should say FAIL for errors');
});

test('generateGuardReport: warnings only show WARNING not FAIL', () => {
  const v = guardFile('old ITRE code');
  const report = generateGuardReport(v);
  assert(report.includes('WARNING'), 'Should contain WARNING');
  // If only warnings, should not say FAIL
  const hasErrors = v.some(x => x.severity === 'ERROR');
  if (!hasErrors) {
    assert(!report.includes('FAIL'), 'Should not say FAIL for warnings-only');
  }
});

test('generateGuardReport: includes rule IDs', () => {
  const v = guardFile('N8 reference\nold ITRE code');
  const report = generateGuardReport(v);
  assert(report.includes('ALB-N8'), 'Report should include ALB-N8');
});

test('generateGuardReport: includes fix suggestions', () => {
  const v = guardFile('N8 reference');
  const report = generateGuardReport(v);
  assert(report.includes('Fix:'), 'Report should include fix suggestion');
});

// ============================================================
// Results
// ============================================================

console.log('');
console.log('='.repeat(50));
console.log(`C10 Architecture Guard Tests`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
if (failures.length > 0) {
  console.log('');
  for (const f of failures) console.log(f);
}
console.log('='.repeat(50));

if (failed > 0) {
  throw new Error(`${failed} tests failed`);
}
