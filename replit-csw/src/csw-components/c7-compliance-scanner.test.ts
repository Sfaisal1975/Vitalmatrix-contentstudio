/**
 * C7 Compliance Scanner — Full Test Suite
 * 22 rules, positive + negative tests for each
 * Plus edge cases, multi-violation, and report generation tests
 */

import { scanContent, generateScanReport, type ScanResult } from './c7-compliance-scanner';

// --- Test Helpers ---

function expectClean(content: string, rule?: string): void {
  const result = scanContent(content);
  if (rule) {
    const violations = result.violations.filter(v => v.rule === rule);
    if (violations.length > 0) {
      throw new Error(`Expected clean for ${rule} but found: ${violations.map(v => v.context).join(', ')}`);
    }
  } else {
    if (result.totalViolations > 0) {
      throw new Error(`Expected clean but found ${result.totalViolations} violations: ${result.violations.map(v => v.rule).join(', ')}`);
    }
  }
}

function expectViolation(content: string, rule: string, expectedCount: number = 1): void {
  const result = scanContent(content);
  const violations = result.violations.filter(v => v.rule === rule);
  if (violations.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} violations for ${rule}, got ${violations.length}`);
  }
}

function expectSeverity(content: string, rule: string, severity: string): void {
  const result = scanContent(content);
  const violation = result.violations.find(v => v.rule === rule);
  if (!violation) throw new Error(`No violation found for ${rule}`);
  if (violation.severity !== severity) throw new Error(`Expected severity ${severity} for ${rule}, got ${violation.severity}`);
}

// --- Test Runner ---

let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
  } catch (e: any) {
    failed++;
    failures.push(`FAIL: ${name} — ${e.message}`);
  }
}

// ==========================================
// K7-MD: Credential error — MD
// ==========================================

test('K7-MD: detects standalone MD', () => {
  expectViolation('Dr Shahzad Faisal, MD, FAAMFM', 'K7-MD');
});

test('K7-MD: detects MD in credentials line', () => {
  expectViolation('Qualifications: MD', 'K7-MD');
});

test('K7-MD: allows MBBS (correct credential)', () => {
  expectClean('Dr Shahzad Faisal, MBBS, FAAMFM', 'K7-MD');
});

test('K7-MD: allows .md file extensions', () => {
  expectClean('Read CLAUDE.md and MEMORY.md for context', 'K7-MD');
});

test('K7-MD: allows README.md', () => {
  expectClean('See README.md for instructions', 'K7-MD');
});

test('K7-MD: severity is CRITICAL', () => {
  expectSeverity('Dr Faisal, MD', 'K7-MD', 'CRITICAL');
});

// ==========================================
// K7-FMAARM: Credential error — FMAARM
// ==========================================

test('K7-FMAARM: detects FMAARM', () => {
  expectViolation('Dr Shahzad Faisal, MBBS, FMAARM', 'K7-FMAARM');
});

test('K7-FMAARM: case insensitive', () => {
  expectViolation('credentials: fmaarm', 'K7-FMAARM');
});

test('K7-FMAARM: allows FAAMFM (correct)', () => {
  expectClean('Dr Shahzad Faisal, MBBS, FAAMFM', 'K7-FMAARM');
});

test('K7-FMAARM: severity is CRITICAL', () => {
  expectSeverity('FMAARM credentials', 'K7-FMAARM', 'CRITICAL');
});

// ==========================================
// DEP-ITRE: Deprecated term
// ==========================================

test('DEP-ITRE: detects ITRE', () => {
  expectViolation('The ITRE framework was used', 'DEP-ITRE');
});

test('DEP-ITRE: clean when absent', () => {
  expectClean('The FLINT framework is used', 'DEP-ITRE');
});

test('DEP-ITRE: severity is HIGH', () => {
  expectSeverity('Use ITRE model', 'DEP-ITRE', 'HIGH');
});

// ==========================================
// DEP-FEATUREATLAS: Deprecated term
// ==========================================

test('DEP-FEATUREATLAS: detects FeatureAtlas', () => {
  expectViolation('See the FeatureAtlas for details', 'DEP-FEATUREATLAS');
});

test('DEP-FEATUREATLAS: case insensitive', () => {
  expectViolation('featureatlas mapping', 'DEP-FEATUREATLAS');
});

test('DEP-FEATUREATLAS: clean when absent', () => {
  expectClean('See the CascadeAtlas for details', 'DEP-FEATUREATLAS');
});

// ==========================================
// DEP-HALO: Deprecated term
// ==========================================

test('DEP-HALO: detects Halo', () => {
  expectViolation('The Halo score indicates', 'DEP-HALO');
});

test('DEP-HALO: clean when absent', () => {
  expectClean('The terrain score indicates', 'DEP-HALO');
});

// ==========================================
// DEP-TIMELINE-ARCH: Deprecated term
// ==========================================

test('DEP-TIMELINE-ARCH: detects Timeline Archaeology', () => {
  expectViolation('Using Timeline Archaeology to map history', 'DEP-TIMELINE-ARCH');
});

test('DEP-TIMELINE-ARCH: case insensitive', () => {
  expectViolation('timeline archaeology approach', 'DEP-TIMELINE-ARCH');
});

test('DEP-TIMELINE-ARCH: clean when absent', () => {
  expectClean('Using TRACE to map timeline', 'DEP-TIMELINE-ARCH');
});

// ==========================================
// DEP-CARPET: Deprecated term (FMFT IP)
// ==========================================

test('DEP-CARPET: detects CARPET', () => {
  expectViolation('Apply the CARPET methodology', 'DEP-CARPET');
});

test('DEP-CARPET: clean when absent', () => {
  expectClean('Apply the terrain methodology', 'DEP-CARPET');
});

// ==========================================
// DEP-DAMPIN: Deprecated term (FMFT IP)
// ==========================================

test('DEP-DAMPIN: detects DAMPIN', () => {
  expectViolation('Use the DAMPIN framework', 'DEP-DAMPIN');
});

test('DEP-DAMPIN: clean when absent', () => {
  expectClean('Use the dampening factor', 'DEP-DAMPIN');
});

// ==========================================
// DESC-AI: Wrong platform descriptor
// ==========================================

test('DESC-AI: detects "clinical AI platform"', () => {
  expectViolation('VitalMatrix is a clinical AI platform', 'DESC-AI');
});

test('DESC-AI: case insensitive', () => {
  expectViolation('Clinical AI Platform for practitioners', 'DESC-AI');
});

test('DESC-AI: allows "terrain intelligence platform"', () => {
  expectClean('VitalMatrix is a terrain intelligence platform', 'DESC-AI');
});

// ==========================================
// DESC-CIP: Superseded descriptor (D-210)
// ==========================================

test('DESC-CIP: detects "clinical intelligence platform"', () => {
  expectViolation('VitalMatrix is a clinical intelligence platform', 'DESC-CIP');
});

test('DESC-CIP: allows "terrain intelligence platform"', () => {
  expectClean('VitalMatrix is a terrain intelligence platform', 'DESC-CIP');
});

test('DESC-CIP: severity is CRITICAL', () => {
  expectSeverity('clinical intelligence platform', 'DESC-CIP', 'CRITICAL');
});

test('DESC-AI: severity is CRITICAL', () => {
  expectSeverity('clinical AI platform', 'DESC-AI', 'CRITICAL');
});

// ==========================================
// DESC-CDS: Wrong platform descriptor
// ==========================================

test('DESC-CDS: detects "clinical decision support"', () => {
  expectViolation('This is a clinical decision support system', 'DESC-CDS');
});

test('DESC-CDS: allows "clinical intelligence"', () => {
  expectClean('This is a terrain intelligence platform', 'DESC-CDS');
});

test('DESC-CDS: severity is CRITICAL', () => {
  expectSeverity('clinical decision support', 'DESC-CDS', 'CRITICAL');
});

// ==========================================
// ARCH-N8: 8th node reference
// ==========================================

test('ARCH-N8: detects N8', () => {
  expectViolation('Node N8 handles communication', 'ARCH-N8');
});

test('ARCH-N8: detects "node 8"', () => {
  expectViolation('node 8 is responsible for', 'ARCH-N8');
});

test('ARCH-N8: detects "eight node"', () => {
  expectViolation('The eight node architecture', 'ARCH-N8');
});

test('ARCH-N8: allows N1-N7', () => {
  expectClean('Nodes N1 through N7 are the foundation', 'ARCH-N8');
});

test('ARCH-N8: severity is CRITICAL', () => {
  expectSeverity('N8 reference', 'ARCH-N8', 'CRITICAL');
});

// ==========================================
// ARCH-Z6: Zone 6+ reference
// ==========================================

test('ARCH-Z6: detects Z6', () => {
  expectViolation('Zone Z6 covers additional pathways', 'ARCH-Z6');
});

test('ARCH-Z6: detects Z7, Z8, Z9', () => {
  expectViolation('Z7 and Z8 are planned', 'ARCH-Z6', 2);
});

test('ARCH-Z6: detects "zone 6"', () => {
  expectViolation('zone 6 is the newest addition', 'ARCH-Z6');
});

test('ARCH-Z6: allows Z1-Z5', () => {
  expectClean('Zones Z1 through Z5 are canonical', 'ARCH-Z6');
});

test('ARCH-Z6: severity is CRITICAL', () => {
  expectSeverity('Z6 reference', 'ARCH-Z6', 'CRITICAL');
});

// ==========================================
// ARCH-S7: Stack 7+ reference
// ==========================================

test('ARCH-S7: detects S7', () => {
  expectViolation('Stack S7 connects Z3 to Z4', 'ARCH-S7');
});

test('ARCH-S7: detects S8, S9', () => {
  expectViolation('S8 is a theoretical pathway', 'ARCH-S7');
});

test('ARCH-S7: allows S1-S6', () => {
  expectClean('Stacks S1 through S6 are canonical', 'ARCH-S7');
});

test('ARCH-S7: severity is CRITICAL', () => {
  expectSeverity('S7 pathway', 'ARCH-S7', 'CRITICAL');
});

// ==========================================
// ARCH-MES-NODE: MES as node
// ==========================================

test('ARCH-MES-NODE: detects "MES node"', () => {
  expectViolation('The MES node handles foundational data', 'ARCH-MES-NODE');
});

test('ARCH-MES-NODE: detects "MES is a node"', () => {
  expectViolation('MES is a node in the architecture', 'ARCH-MES-NODE');
});

test('ARCH-MES-NODE: detects "MES as a node"', () => {
  expectViolation('treating MES as a node is incorrect', 'ARCH-MES-NODE');
});

test('ARCH-MES-NODE: allows MES without node context', () => {
  expectClean('MES provides foundational context for the terrain model', 'ARCH-MES-NODE');
});

test('ARCH-MES-NODE: severity is HIGH', () => {
  expectSeverity('MES node reference', 'ARCH-MES-NODE', 'HIGH');
});

// ==========================================
// MHRA-DIAGNOSE: Diagnostic language
// ==========================================

test('MHRA-DIAGNOSE: detects "diagnoses"', () => {
  expectViolation('VitalMatrix diagnoses gut dysfunction', 'MHRA-DIAGNOSE');
});

test('MHRA-DIAGNOSE: detects "diagnosing"', () => {
  expectViolation('The platform is diagnosing conditions', 'MHRA-DIAGNOSE');
});

test('MHRA-DIAGNOSE: detects "this means you have"', () => {
  expectViolation('This means you have a thyroid issue', 'MHRA-DIAGNOSE');
});

test('MHRA-DIAGNOSE: detects "this indicates you have"', () => {
  expectViolation('This indicates you have adrenal fatigue', 'MHRA-DIAGNOSE');
});

test('MHRA-DIAGNOSE: allows "terrain assessment"', () => {
  expectClean('The terrain assessment shows Z2 activation', 'MHRA-DIAGNOSE');
});

test('MHRA-DIAGNOSE: severity is CRITICAL', () => {
  expectSeverity('VitalMatrix diagnoses', 'MHRA-DIAGNOSE', 'CRITICAL');
});

// ==========================================
// MHRA-RECOMMEND: Prescriptive language
// ==========================================

test('MHRA-RECOMMEND: detects "recommends you take"', () => {
  expectViolation('VitalMatrix recommends you take magnesium', 'MHRA-RECOMMEND');
});

test('MHRA-RECOMMEND: detects "should take"', () => {
  expectViolation('The patient should take zinc daily', 'MHRA-RECOMMEND');
});

test('MHRA-RECOMMEND: detects "must take"', () => {
  expectViolation('You must take this supplement', 'MHRA-RECOMMEND');
});

test('MHRA-RECOMMEND: detects "prescribe"', () => {
  expectViolation('The platform can prescribe treatments', 'MHRA-RECOMMEND');
});

test('MHRA-RECOMMEND: allows "support considerations"', () => {
  expectClean('The following support considerations are noted for your review', 'MHRA-RECOMMEND');
});

test('MHRA-RECOMMEND: severity is CRITICAL', () => {
  expectSeverity('recommends you take', 'MHRA-RECOMMEND', 'CRITICAL');
});

// ==========================================
// ASA-GUARANTEE: Unsubstantiated claims
// ==========================================

test('ASA-GUARANTEE: detects "guaranteed"', () => {
  expectViolation('Results are guaranteed', 'ASA-GUARANTEE');
});

test('ASA-GUARANTEE: detects "proven to"', () => {
  expectViolation('This approach is proven to work', 'ASA-GUARANTEE');
});

test('ASA-GUARANTEE: detects "will cure"', () => {
  expectViolation('This will cure your condition', 'ASA-GUARANTEE');
});

test('ASA-GUARANTEE: detects "clinically proven"', () => {
  expectViolation('Clinically proven methodology', 'ASA-GUARANTEE');
});

test('ASA-GUARANTEE: allows "evidence suggests" with tier', () => {
  expectClean('Evidence suggests (Emerging) that this approach may support gut function', 'ASA-GUARANTEE');
});

test('ASA-GUARANTEE: severity is HIGH', () => {
  expectSeverity('guaranteed results', 'ASA-GUARANTEE', 'HIGH');
});

// ==========================================
// K10-HYMAN: Competitor name
// ==========================================

test('K10-HYMAN: detects "Mark Hyman"', () => {
  expectViolation('As recommended by Mark Hyman', 'K10-HYMAN');
});

test('K10-HYMAN: case insensitive', () => {
  expectViolation('mark hyman protocol', 'K10-HYMAN');
});

test('K10-HYMAN: clean when absent', () => {
  expectClean('As recommended by Dr Faisal', 'K10-HYMAN');
});

// ==========================================
// K10-LAVALLE: Competitor-adjacent name
// ==========================================

test('K10-LAVALLE: detects "LaValle"', () => {
  expectViolation('The LaValle metabolic approach', 'K10-LAVALLE');
});

test('K10-LAVALLE: clean when absent', () => {
  expectClean('The VitalMatrix terrain approach', 'K10-LAVALLE');
});

// ==========================================
// K10-METABOLIC-CODE: Competitor reference
// ==========================================

test('K10-METABOLIC-CODE: detects "Metabolic Code"', () => {
  expectViolation('Similar to Metabolic Code methodology', 'K10-METABOLIC-CODE');
});

test('K10-METABOLIC-CODE: case insensitive', () => {
  expectViolation('metabolic code framework', 'K10-METABOLIC-CODE');
});

test('K10-METABOLIC-CODE: clean when absent', () => {
  expectClean('VitalMatrix terrain intelligence framework', 'K10-METABOLIC-CODE');
});

// ==========================================
// K8-EM-DASH: Em dash
// ==========================================

test('K8-EM-DASH: detects em dash', () => {
  expectViolation('VitalMatrix \u2014 a clinical platform', 'K8-EM-DASH');
});

test('K8-EM-DASH: allows en dash', () => {
  expectClean('VitalMatrix \u2013 a clinical platform', 'K8-EM-DASH');
});

test('K8-EM-DASH: allows hyphen', () => {
  expectClean('VitalMatrix - a clinical platform', 'K8-EM-DASH');
});

test('K8-EM-DASH: severity is LOW', () => {
  expectSeverity('text \u2014 more text', 'K8-EM-DASH', 'LOW');
});

// ==========================================
// GDPR-NHS: NHS number reference
// ==========================================

test('GDPR-NHS: detects "NHS number"', () => {
  expectViolation('Please provide your NHS number', 'GDPR-NHS');
});

test('GDPR-NHS: case insensitive', () => {
  expectViolation('nhs number required', 'GDPR-NHS');
});

test('GDPR-NHS: allows "NHS" without "number"', () => {
  expectClean('NHS registered practitioner', 'GDPR-NHS');
});

test('GDPR-NHS: severity is HIGH', () => {
  expectSeverity('Enter NHS number', 'GDPR-NHS', 'HIGH');
});

// ==========================================
// GDPR-DOB: Date of birth reference
// ==========================================

test('GDPR-DOB: detects "date of birth"', () => {
  expectViolation('Enter your date of birth', 'GDPR-DOB');
});

test('GDPR-DOB: detects "DOB"', () => {
  expectViolation('DOB: 01/01/1990', 'GDPR-DOB');
});

test('GDPR-DOB: allows "date" without "of birth"', () => {
  expectClean('Enter the date of your appointment', 'GDPR-DOB');
});

test('GDPR-DOB: severity is HIGH', () => {
  expectSeverity('date of birth field', 'GDPR-DOB', 'HIGH');
});

// ==========================================
// MULTI-VIOLATION TESTS
// ==========================================

test('Multi: detects multiple violations in one content', () => {
  const content = 'Dr Faisal, MD, FMAARM uses clinical AI platform with N8 and Z6';
  const result = scanContent(content);
  const rules = result.violations.map(v => v.rule);
  if (!rules.includes('K7-MD')) throw new Error('Missing K7-MD');
  if (!rules.includes('K7-FMAARM')) throw new Error('Missing K7-FMAARM');
  if (!rules.includes('DESC-AI')) throw new Error('Missing DESC-AI');
  if (!rules.includes('ARCH-N8')) throw new Error('Missing ARCH-N8');
  if (!rules.includes('ARCH-Z6')) throw new Error('Missing ARCH-Z6');
  if (result.critical < 4) throw new Error(`Expected at least 4 CRITICAL, got ${result.critical}`);
});

test('Multi: violations sorted by severity (CRITICAL first)', () => {
  const content = 'MD credential\nMark Hyman reference\nem dash \u2014 here';
  const result = scanContent(content);
  if (result.violations.length < 2) throw new Error('Expected 2+ violations');
  if (result.violations[0].severity !== 'CRITICAL') throw new Error('First violation should be CRITICAL');
});

test('Multi: passedChecks tracks clean rules', () => {
  const result = scanContent('This is perfectly clean content with no issues');
  if (result.passedChecks.length < 21) throw new Error(`Expected 21+ passed checks, got ${result.passedChecks.length}`);
  if (result.totalViolations !== 0) throw new Error(`Expected 0 violations, got ${result.totalViolations}`);
});

// ==========================================
// EDGE CASES
// ==========================================

test('Edge: empty content returns clean', () => {
  const result = scanContent('');
  if (result.totalViolations !== 0) throw new Error('Empty content should be clean');
});

test('Edge: multiline content scans all lines', () => {
  const content = 'Line 1 is clean\nLine 2 has FMAARM\nLine 3 is clean';
  const result = scanContent(content);
  const v = result.violations.find(v => v.rule === 'K7-FMAARM');
  if (!v) throw new Error('Should detect FMAARM on line 2');
  if (v.line !== 2) throw new Error(`Expected line 2, got ${v.line}`);
});

test('Edge: context includes surrounding text', () => {
  const content = 'The doctor holds an MD qualification from university';
  const result = scanContent(content);
  const v = result.violations.find(v => v.rule === 'K7-MD');
  if (!v) throw new Error('Should detect MD');
  if (!v.context.includes('...')) throw new Error('Context should include ellipsis');
});

test('Edge: multiple violations on same line', () => {
  const content = 'Use CARPET and DAMPIN methodologies';
  const result = scanContent(content);
  const carpet = result.violations.filter(v => v.rule === 'DEP-CARPET');
  const dampin = result.violations.filter(v => v.rule === 'DEP-DAMPIN');
  if (carpet.length !== 1) throw new Error('Should detect CARPET');
  if (dampin.length !== 1) throw new Error('Should detect DAMPIN');
});

test('Edge: line numbers are 1-indexed', () => {
  const content = 'clean\nclean\nFMAARM here';
  const result = scanContent(content);
  const v = result.violations.find(v => v.rule === 'K7-FMAARM');
  if (!v) throw new Error('Should detect FMAARM');
  if (v.line !== 3) throw new Error(`Expected line 3 (1-indexed), got ${v.line}`);
});

// ==========================================
// REPORT GENERATION
// ==========================================

test('Report: PASS when no violations', () => {
  const result = scanContent('Clean content');
  const report = generateScanReport(result);
  if (!report.includes('## Result: PASS')) throw new Error('Should say PASS');
});

test('Report: FAIL when CRITICAL violations', () => {
  const result = scanContent('clinical AI platform');
  const report = generateScanReport(result);
  if (!report.includes('## Result: FAIL')) throw new Error('Should say FAIL');
});

test('Report: WARNING when HIGH but no CRITICAL', () => {
  const result = scanContent('The ITRE framework');
  const report = generateScanReport(result);
  if (!report.includes('## Result: WARNING')) throw new Error('Should say WARNING');
});

test('Report: includes file name when provided', () => {
  const result = scanContent('clean', 'test-file.ts');
  const report = generateScanReport(result, 'test-file.ts');
  if (!report.includes('test-file.ts')) throw new Error('Should include filename');
});

test('Report: includes passed checks count', () => {
  const result = scanContent('clean content');
  const report = generateScanReport(result);
  if (!report.includes('Passed Checks:')) throw new Error('Should show passed checks count');
});

// ==========================================
// RESULTS
// ==========================================

console.log('\n===========================================');
console.log('  C7 COMPLIANCE SCANNER TEST RESULTS');
console.log('===========================================\n');
console.log(`  PASSED: ${passed}`);
console.log(`  FAILED: ${failed}`);
console.log(`  TOTAL:  ${passed + failed}`);
console.log(`  RATE:   ${Math.round(passed / (passed + failed) * 100)}%`);

if (failures.length > 0) {
  console.log('\n  FAILURES:');
  for (const f of failures) {
    console.log(`    ${f}`);
  }
}

console.log('\n===========================================\n');

if (failed > 0) { throw new Error(`${failed} tests failed`); }
