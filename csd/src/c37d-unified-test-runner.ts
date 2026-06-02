/**
 * Component 37d: Unified Test Runner
 * Runs all test suites in one command. Reports combined results.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface TestSuite {
  name: string;
  file: string;
  repo: string;
  command: string;
}

export interface TestRunResult {
  suite: string;
  passed: number;
  failed: number;
  total: number;
  duration: number;
  status: 'PASS' | 'FAIL' | 'ERROR';
  output: string;
}

export interface UnifiedTestReport {
  suites: TestRunResult[];
  totalPassed: number;
  totalFailed: number;
  totalTests: number;
  totalDuration: number;
  overallStatus: 'PASS' | 'FAIL';
  timestamp: string;
}

// --- Known Test Suites ---

export const TEST_SUITES: TestSuite[] = [
  {
    name: 'C7 Compliance Scanner',
    file: 'src/c7-compliance-scanner.test.ts',
    repo: 'C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-web',
    command: 'npx ts-node src/c7-compliance-scanner.test.ts',
  },
  {
    name: 'C10 Architecture Guard',
    file: 'src/c10-architecture-guard.test.ts',
    repo: 'C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-dev',
    command: 'npx ts-node src/c10-architecture-guard.test.ts',
  },
  {
    name: 'Engine Tests',
    file: 'npm test',
    repo: 'C:/Users/Lenovo/Downloads/vitalmatrix-mvil-engines-20260320/vitalmatrix',
    command: 'npm test',
  },
];

// --- Result Parser ---

export function parseTestOutput(output: string, suiteName: string): TestRunResult {
  const start = Date.now();

  // Pattern: "PASSED: X\nFAILED: Y\nTOTAL: Z"
  const passedMatch = output.match(/PASSED:\s*(\d+)/i);
  const failedMatch = output.match(/FAILED:\s*(\d+)/i);
  const totalMatch = output.match(/TOTAL:\s*(\d+)/i);

  // Alternative: "X/Y tests pass"
  const altMatch = output.match(/(\d+)\/(\d+)\s*tests?\s*pass/i);

  let passed = 0, failed = 0, total = 0;

  if (passedMatch && totalMatch) {
    passed = parseInt(passedMatch[1]);
    failed = failedMatch ? parseInt(failedMatch[1]) : 0;
    total = parseInt(totalMatch[1]);
  } else if (altMatch) {
    passed = parseInt(altMatch[1]);
    total = parseInt(altMatch[2]);
    failed = total - passed;
  }

  return {
    suite: suiteName,
    passed,
    failed,
    total,
    duration: Date.now() - start,
    status: failed > 0 ? 'FAIL' : total > 0 ? 'PASS' : 'ERROR',
    output,
  };
}

// --- Report ---

export function buildUnifiedReport(results: TestRunResult[]): UnifiedTestReport {
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  return {
    suites: results,
    totalPassed,
    totalFailed,
    totalTests,
    totalDuration,
    overallStatus: totalFailed > 0 ? 'FAIL' : 'PASS',
    timestamp: new Date().toISOString(),
  };
}

export function formatUnifiedReport(report: UnifiedTestReport): string {
  const lines = [
    '===========================================',
    '  VitalMatrix Unified Test Report',
    '===========================================',
    '',
  ];

  for (const suite of report.suites) {
    const icon = suite.status === 'PASS' ? 'PASS' : suite.status === 'FAIL' ? 'FAIL' : 'ERR ';
    lines.push(`  [${icon}] ${suite.suite}: ${suite.passed}/${suite.total} (${suite.duration}ms)`);
  }

  lines.push('');
  lines.push('-------------------------------------------');
  lines.push(`  TOTAL: ${report.totalPassed}/${report.totalTests} passed`);
  lines.push(`  STATUS: ${report.overallStatus}`);
  lines.push(`  DURATION: ${report.totalDuration}ms`);
  lines.push('===========================================');

  return lines.join('\n');
}

// --- Bash Script Generator ---

export function generateRunAllScript(): string {
  return `#!/bin/bash
# VitalMatrix Unified Test Runner
# Runs all test suites and reports combined results

echo "==========================================="
echo "  VitalMatrix Unified Test Runner"
echo "==========================================="
echo ""

TOTAL_PASS=0
TOTAL_FAIL=0

# C7 Compliance Scanner
echo "  Running C7 Compliance Scanner..."
cd "C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-web"
OUTPUT=$(npx ts-node src/c7-compliance-scanner.test.ts 2>&1)
PASS=$(echo "$OUTPUT" | grep -oP 'PASSED: \\K\\d+' || echo "0")
FAIL=$(echo "$OUTPUT" | grep -oP 'FAILED: \\K\\d+' || echo "0")
echo "  [C7] PASSED: $PASS | FAILED: $FAIL"
TOTAL_PASS=$((TOTAL_PASS + PASS))
TOTAL_FAIL=$((TOTAL_FAIL + FAIL))

# C10 Architecture Guard
echo "  Running C10 Architecture Guard..."
cd "C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-dev"
OUTPUT=$(npx ts-node src/c10-architecture-guard.test.ts 2>&1)
PASS=$(echo "$OUTPUT" | grep -oP 'PASSED: \\K\\d+' || echo "0")
FAIL=$(echo "$OUTPUT" | grep -oP 'FAILED: \\K\\d+' || echo "0")
echo "  [C10] PASSED: $PASS | FAILED: $FAIL"
TOTAL_PASS=$((TOTAL_PASS + PASS))
TOTAL_FAIL=$((TOTAL_FAIL + FAIL))

# Engine Tests
echo "  Running Engine Tests..."
cd "C:/Users/Lenovo/Downloads/vitalmatrix-mvil-engines-20260320/vitalmatrix"
OUTPUT=$(npm test 2>&1)
PASS=$(echo "$OUTPUT" | grep -oP '\\K\\d+(?= passing)' || echo "0")
FAIL=$(echo "$OUTPUT" | grep -oP '\\K\\d+(?= failing)' || echo "0")
echo "  [Engine] PASSED: $PASS | FAILED: $FAIL"
TOTAL_PASS=$((TOTAL_PASS + PASS))
TOTAL_FAIL=$((TOTAL_FAIL + FAIL))

echo ""
echo "==========================================="
echo "  TOTAL: $((TOTAL_PASS + TOTAL_FAIL)) tests"
echo "  PASSED: $TOTAL_PASS | FAILED: $TOTAL_FAIL"
if [ $TOTAL_FAIL -gt 0 ]; then
  echo "  STATUS: FAIL"
else
  echo "  STATUS: PASS"
fi
echo "==========================================="
`;
}
