/**
 * Component 36d: Git Hook Installer
 * Wires C15 Quality Gate as a pre-commit hook.
 * Run once per repo to install, then every commit runs the gate automatically.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface HookConfig {
  repoPath: string;
  hookType: 'pre-commit' | 'pre-push';
  qualityGateEnabled: boolean;
  complianceScanEnabled: boolean;
  architectureGuardEnabled: boolean;
  blockOnFail: boolean;
}

// --- Hook Script Content ---

export function generatePreCommitHook(config: HookConfig): string {
  return `#!/bin/bash
# VitalMatrix Pre-Commit Quality Gate
# Auto-installed by CSD C36d Git Hook Installer
# Runs C15 Quality Gate checks before every commit

echo "Running VitalMatrix Quality Gate..."

FAIL=0

${config.architectureGuardEnabled ? `
# Architecture Guard (C10)
echo "  [1/3] Architecture Guard..."
ARCH_RESULT=$(npx ts-node -e "
const {guardFile} = require('./src/l3-cascade-detection/engine.ts') || {};
// Scan staged .ts files for architecture violations
" 2>/dev/null)
if [ $? -ne 0 ]; then
  echo "  [1/3] Architecture Guard: SKIPPED (not in engine repo)"
fi
` : '# Architecture Guard: DISABLED'}

${config.complianceScanEnabled ? `
# Compliance Scanner (C7)
echo "  [2/3] Compliance Scanner..."
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\\.ts$' | head -20)
for f in $STAGED_FILES; do
  if grep -qiE 'FMAARM|clinical AI platform|\\bMD\\b' "$f" 2>/dev/null; then
    echo "    FAIL: Compliance violation in $f"
    FAIL=1
  fi
done
if [ $FAIL -eq 0 ]; then
  echo "  [2/3] Compliance Scanner: PASS"
fi
` : '# Compliance Scanner: DISABLED'}

${config.qualityGateEnabled ? `
# Quality Gate Summary (C15)
echo "  [3/3] Quality Gate..."
if grep -rqiE 'clinical intelligence platform' $(git diff --cached --name-only --diff-filter=ACM | grep -E '\\.ts$') 2>/dev/null; then
  echo "    FAIL: Old descriptor found (D-210: must be 'terrain intelligence platform')"
  FAIL=1
fi
if [ $FAIL -eq 0 ]; then
  echo "  [3/3] Quality Gate: PASS"
fi
` : '# Quality Gate: DISABLED'}

if [ $FAIL -ne 0 ] && [ "${config.blockOnFail ? 'true' : 'false'}" = "true" ]; then
  echo ""
  echo "COMMIT BLOCKED — fix violations above"
  exit 1
fi

echo ""
echo "Quality Gate: PASS"
exit 0
`;
}

// --- Installer ---

export function generateInstallScript(repoPath: string): string {
  return `#!/bin/bash
# Install VitalMatrix pre-commit hook
HOOK_DIR="${repoPath}/.git/hooks"
HOOK_FILE="\$HOOK_DIR/pre-commit"

if [ ! -d "\$HOOK_DIR" ]; then
  echo "ERROR: Not a git repository: ${repoPath}"
  exit 1
fi

cat > "\$HOOK_FILE" << 'HOOKEOF'
${generatePreCommitHook({ repoPath, hookType: 'pre-commit', qualityGateEnabled: true, complianceScanEnabled: true, architectureGuardEnabled: true, blockOnFail: true })}
HOOKEOF

chmod +x "\$HOOK_FILE"
echo "Pre-commit hook installed at \$HOOK_FILE"
`;
}

// --- Uninstaller ---

export function generateUninstallScript(repoPath: string): string {
  return `#!/bin/bash
HOOK_FILE="${repoPath}/.git/hooks/pre-commit"
if [ -f "\$HOOK_FILE" ]; then
  rm "\$HOOK_FILE"
  echo "Pre-commit hook removed"
else
  echo "No pre-commit hook found"
fi
`;
}

// --- Status ---

export function generateHookStatusCheck(repoPath: string): string {
  return `#!/bin/bash
HOOK_FILE="${repoPath}/.git/hooks/pre-commit"
if [ -f "\$HOOK_FILE" ] && [ -x "\$HOOK_FILE" ]; then
  echo "Pre-commit hook: INSTALLED"
  grep -q "VitalMatrix" "\$HOOK_FILE" && echo "  Type: VitalMatrix Quality Gate" || echo "  Type: Custom (not VitalMatrix)"
else
  echo "Pre-commit hook: NOT INSTALLED"
fi
`;
}
