/**
 * Component 38d: Brand Config Drift Detector
 * CI-style check that fails if CSW/CSD/SM brand-configs differ.
 * Run before any commit or as part of git-sync.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface DriftCheckResult {
  status: 'IN_SYNC' | 'DRIFTED';
  repos: RepoStatus[];
  driftDetails: DriftDetail[];
  timestamp: string;
}

export interface RepoStatus {
  name: string;
  path: string;
  exists: boolean;
  hash?: string;
}

export interface DriftDetail {
  repo1: string;
  repo2: string;
  lineNumber?: number;
  difference: string;
}

// --- Known brand-config locations ---

export const BRAND_CONFIG_LOCATIONS = [
  { name: 'CSW', path: 'C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-web/src/brand-config.ts' },
  { name: 'CSD', path: 'C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-dev/src/brand-config.ts' },
  { name: 'SM', path: 'C:/Users/Lenovo/Downloads/vitalmatrix-social-media/src/brand-config.ts' },
  { name: 'Combined-CSW', path: 'C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-combined/csw/src/brand-config.ts' },
  { name: 'Combined-CSD', path: 'C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-combined/csd/src/brand-config.ts' },
];

// --- Simple content comparison ---

export function compareContents(content1: string, content2: string): DriftDetail[] {
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');
  const drifts: DriftDetail[] = [];

  const maxLines = Math.max(lines1.length, lines2.length);
  for (let i = 0; i < maxLines; i++) {
    const l1 = lines1[i] || '';
    const l2 = lines2[i] || '';
    if (l1.trim() !== l2.trim()) {
      drifts.push({
        repo1: '', repo2: '',
        lineNumber: i + 1,
        difference: `Line ${i + 1}: "${l1.trim().slice(0, 80)}" vs "${l2.trim().slice(0, 80)}"`,
      });
    }
  }

  return drifts;
}

// --- Bash Script ---

export function generateDriftCheckScript(): string {
  return `#!/bin/bash
# VitalMatrix Brand Config Drift Detector
# Checks all repos have identical brand-config.ts

echo "==========================================="
echo "  Brand Config Drift Detector"
echo "==========================================="

SOURCE="C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-web/src/brand-config.ts"
TARGETS=(
  "C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-dev/src/brand-config.ts|CSD"
  "C:/Users/Lenovo/Downloads/vitalmatrix-social-media/src/brand-config.ts|SM"
  "C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-combined/csw/src/brand-config.ts|Combined-CSW"
  "C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-combined/csd/src/brand-config.ts|Combined-CSD"
)

DRIFT=0

for entry in "\${TARGETS[@]}"; do
  IFS='|' read -r path name <<< "\$entry"
  if [ ! -f "\$path" ]; then
    echo "  [\$name] FILE NOT FOUND"
    continue
  fi

  if diff -q "\$SOURCE" "\$path" > /dev/null 2>&1; then
    echo "  [\$name] IN SYNC"
  else
    echo "  [\$name] DRIFTED"
    diff --unified=0 "\$SOURCE" "\$path" | head -20
    DRIFT=1
  fi
done

echo ""
if [ \$DRIFT -eq 0 ]; then
  echo "  STATUS: ALL IN SYNC"
else
  echo "  STATUS: DRIFT DETECTED — run brand-sync to fix"
  echo "  Fix: cp \\"$SOURCE\\" to drifted targets"
fi
echo "==========================================="

exit \$DRIFT
`;
}

// --- Enhanced brand-sync that covers all repos ---

export function generateFullSyncScript(): string {
  return `#!/bin/bash
# VitalMatrix Full Brand Config Sync
# CSW is source of truth. Syncs to all other repos.

SOURCE="C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-web/src/brand-config.ts"

TARGETS=(
  "C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-dev/src/brand-config.ts"
  "C:/Users/Lenovo/Downloads/vitalmatrix-social-media/src/brand-config.ts"
  "C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-combined/csw/src/brand-config.ts"
  "C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-combined/csd/src/brand-config.ts"
)

echo "Syncing brand-config from CSW..."
for target in "\${TARGETS[@]}"; do
  if [ -f "\$target" ]; then
    cp "\$SOURCE" "\$target"
    echo "  Synced: \$target"
  fi
done
echo "Done. Remember to commit each repo."
`;
}
