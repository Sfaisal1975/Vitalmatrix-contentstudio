/**
 * CSW Test Runner — Unified test infrastructure
 * Run: npx ts-node src/test-runner.ts
 *
 * Runs C7 compliance scanner tests + integration smoke tests
 * for critical pipeline chains.
 */

// --- Test Framework ---
let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void): void {
  try { fn(); passed++; } catch (e: any) { failed++; failures.push(`FAIL: ${name} — ${e.message}`); }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

// ==========================================
// INTEGRATION SMOKE TESTS
// ==========================================

// --- Brand Config ---
import { VM_BRAND } from './brand-config';

test('brand-config: descriptor is terrain intelligence platform', () => {
  assert(VM_BRAND.platform.descriptor === 'terrain intelligence platform', `Got: ${VM_BRAND.platform.descriptor}`);
});

test('brand-config: pricing is 99', () => {
  assert(VM_BRAND.pricing.foundingMonthly === 99, `Got: ${VM_BRAND.pricing.foundingMonthly}`);
});

test('brand-config: credentials MBBS FAAMFM', () => {
  assert(VM_BRAND.credentials.qualifications === 'MBBS, FAAMFM', `Got: ${VM_BRAND.credentials.qualifications}`);
});

test('brand-config: TM footer has STRIDE', () => {
  assert(VM_BRAND.tmFooter.includes('STRIDE'), 'STRIDE missing from TM footer');
});

test('brand-config: TM footer has VOS', () => {
  assert(VM_BRAND.tmFooter.includes('VOS'), 'VOS missing from TM footer');
});

test('brand-config: TM footer excludes COMPASS', () => {
  assert(!VM_BRAND.tmFooter.includes('COMPASS'), 'COMPASS should be excluded from practitioner footer');
});

test('brand-config: audience is England', () => {
  assert(VM_BRAND.targetAudience.geography === 'England', `Got: ${VM_BRAND.targetAudience.geography}`);
});

// --- C4 SEO ---
import { generateSlug, countWords, calculateReadingTime } from './c4-seo-metadata';

test('C4: generateSlug works', () => {
  assert(generateSlug('Hello World Test') === 'hello-world-test', 'Slug generation failed');
});

test('C4: countWords works', () => {
  assert(countWords('one two three four five') === 5, 'Word count failed');
});

test('C4: readingTime works', () => {
  assert(calculateReadingTime(400) === 2, 'Reading time failed');
});

// --- C3 JSON-LD ---
import { generateJsonLd } from './c3-jsonld-schema';

test('C3: generates valid JSON-LD', () => {
  const jsonLd = generateJsonLd({ pageTitle: 'Test', pageDescription: 'Desc', pageSlug: 'test', datePublished: '2026-06-02', dateModified: '2026-06-02' });
  assert(jsonLd.includes('application/ld+json'), 'Missing script tag');
  assert(jsonLd.includes('MedicalWebPage'), 'Missing MedicalWebPage type');
  assert(jsonLd.includes('MBBS'), 'Missing MBBS credential');
  assert(!jsonLd.includes('FMAARM'), 'Contains FMAARM — K7 violation');
});

// --- C7 Compliance Scanner ---
import { scanContent } from './c7-compliance-scanner';

test('C7: catches FMAARM', () => {
  const r = scanContent('Dr Faisal FMAARM');
  assert(r.critical > 0, 'Should catch FMAARM');
});

test('C7: catches old descriptor', () => {
  const r = scanContent('clinical intelligence platform');
  assert(r.critical > 0, 'Should catch old descriptor');
});

test('C7: passes clean content', () => {
  const r = scanContent('VitalMatrix is a terrain intelligence platform');
  assert(r.totalViolations === 0, `Expected clean, got ${r.totalViolations} violations`);
});

// --- C66 Audience Targeting ---
import { isInTargetGeography, isExcludedGeography } from './c66-audience-targeting';

test('C66: England is target', () => {
  assert(isInTargetGeography('England'), 'England should be target');
});

test('C66: Scotland is excluded', () => {
  assert(isExcludedGeography('Scotland'), 'Scotland should be excluded');
});

test('C66: USA is excluded', () => {
  assert(isExcludedGeography('USA'), 'USA should be excluded');
});

// ==========================================
// PIPELINE CHAIN SMOKE TEST
// ==========================================

test('Pipeline: C4→C7 (SEO then compliance)', () => {
  const slug = generateSlug('Terrain Medicine for FM Practitioners');
  assert(slug === 'terrain-medicine-for-fm-practitioners', 'Slug failed');
  const scan = scanContent(`Blog about ${slug} by Dr Faisal MBBS FAAMFM`);
  assert(scan.critical === 0, `Compliance failed on generated content: ${scan.violations.map(v => v.rule).join(',')}`);
});

test('Pipeline: C3→C7 (JSON-LD then compliance)', () => {
  const jsonLd = generateJsonLd({ pageTitle: 'Zone Assessment', pageDescription: 'Terrain analysis', pageSlug: 'zone', datePublished: '2026-06-02', dateModified: '2026-06-02' });
  const scan = scanContent(jsonLd);
  assert(scan.critical === 0, `JSON-LD failed compliance: ${scan.violations.map(v => v.rule).join(',')}`);
});

// ==========================================
// RESULTS
// ==========================================

console.log('\n===========================================');
console.log('  CSW TEST RUNNER');
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
