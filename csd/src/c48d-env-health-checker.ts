/**
 * Component 48D: Environment Health Checker
 * DEV PACKAGE — Internal tooling only
 *
 * Checks the development environment is properly configured. Designed to
 * run on session start to catch configuration drift before it causes
 * build failures.
 *
 * 12 checks covering: Node.js, TypeScript, Git, Ollama, Qwen, PostgreSQL,
 * engine repo, bashrc aliases, memory files, GitHub CLI, Notion MCP, and
 * brand-config sync.
 *
 * Note: check functions return EnvCheck objects synchronously using
 * pre-captured command outputs. The caller is responsible for running
 * shell commands and passing results in.
 *
 * @module c48d-env-health-checker
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Status of a single environment check. */
export type CheckStatus = 'PASS' | 'FAIL' | 'WARNING';

/** Overall health status of the environment. */
export type OverallStatus = 'HEALTHY' | 'DEGRADED' | 'BROKEN';

/** Result of a single environment check. */
export interface EnvCheck {
  /** Human-readable check name. */
  name: string;
  /** Whether the check passed, failed, or produced a warning. */
  status: CheckStatus;
  /** Detail message explaining the result. */
  detail: string;
  /** Suggested fix command or instruction, if the check failed. */
  fix?: string;
}

/** Aggregated report from all environment checks. */
export interface EnvReport {
  /** All individual check results. */
  checks: EnvCheck[];
  /** Number of checks that passed. */
  passCount: number;
  /** Number of checks that failed. */
  failCount: number;
  /** Number of checks with warnings. */
  warningCount: number;
  /** Overall environment status. */
  overallStatus: OverallStatus;
}

/** Raw command outputs to feed into the checker. */
export interface EnvCommandOutputs {
  /** Output of `node --version`. */
  nodeVersion?: string;
  /** Output of `tsc --version` or empty if not installed. */
  tscVersion?: string;
  /** Output of `git config user.name` and `git config user.email`. */
  gitConfig?: { name?: string; email?: string };
  /** Output of `ollama list` or connection error. */
  ollamaList?: string;
  /** Output of `pg_isready` or connection test. */
  pgReady?: boolean;
  /** Whether the engine repo directory exists. */
  engineRepoExists?: boolean;
  /** Engine repo path. */
  engineRepoPath?: string;
  /** Whether .bashrc exists and contains vm- aliases. */
  bashrcLoaded?: boolean;
  /** Whether memory files directory is accessible. */
  memoryAccessible?: boolean;
  /** Memory directory path. */
  memoryPath?: string;
  /** Output of `gh auth status`. */
  ghAuthStatus?: string;
  /** Whether Notion MCP is available (responds to ping). */
  notionMcpAvailable?: boolean;
  /** Hash or content of brand-config from engine repo for sync check. */
  engineBrandConfigHash?: string;
  /** Hash or content of brand-config from content-studio for sync check. */
  studioBrandConfigHash?: string;
}

// --- Constants ---

/** Expected engine repo path. */
const ENGINE_REPO_PATH = 'C:\\Users\\Lenovo\\Downloads\\vitalmatrix-algorithms';

/** Expected memory files path. */
const MEMORY_PATH = 'C:\\Users\\Lenovo\\.claude\\projects\\C--WINDOWS-system32\\memory';

/** Minimum required Node.js major version. */
const MIN_NODE_MAJOR = 24;

// --- Individual Check Functions ---

/**
 * Check 1: Node.js version must be v24+.
 *
 * @param nodeVersion - Output of `node --version` (e.g. 'v24.0.0').
 * @returns Environment check result.
 */
export function checkNodeVersion(nodeVersion?: string): EnvCheck {
  if (!nodeVersion) {
    return {
      name: 'Node.js version',
      status: 'FAIL',
      detail: 'Node.js not found or version could not be determined.',
      fix: 'Install Node.js v24+ from https://nodejs.org/',
    };
  }

  const match = nodeVersion.trim().match(/v?(\d+)/);
  if (!match) {
    return {
      name: 'Node.js version',
      status: 'FAIL',
      detail: `Could not parse Node.js version from: ${nodeVersion}`,
      fix: 'Run `node --version` to verify installation.',
    };
  }

  const major = parseInt(match[1], 10);
  if (major >= MIN_NODE_MAJOR) {
    return {
      name: 'Node.js version',
      status: 'PASS',
      detail: `Node.js ${nodeVersion.trim()} (v${MIN_NODE_MAJOR}+ required).`,
    };
  }

  return {
    name: 'Node.js version',
    status: 'FAIL',
    detail: `Node.js ${nodeVersion.trim()} is below minimum v${MIN_NODE_MAJOR}.`,
    fix: `Upgrade Node.js: nvm install ${MIN_NODE_MAJOR}`,
  };
}

/**
 * Check 2: TypeScript must be installed.
 *
 * @param tscVersion - Output of `tsc --version`.
 * @returns Environment check result.
 */
export function checkTypeScript(tscVersion?: string): EnvCheck {
  if (!tscVersion || tscVersion.trim().length === 0) {
    return {
      name: 'TypeScript installed',
      status: 'FAIL',
      detail: 'TypeScript compiler not found.',
      fix: 'npm install -g typescript',
    };
  }

  return {
    name: 'TypeScript installed',
    status: 'PASS',
    detail: `TypeScript ${tscVersion.trim()}.`,
  };
}

/**
 * Check 3: Git must be configured with name and email.
 *
 * @param gitConfig - Git user configuration.
 * @returns Environment check result.
 */
export function checkGitConfig(gitConfig?: { name?: string; email?: string }): EnvCheck {
  if (!gitConfig || (!gitConfig.name && !gitConfig.email)) {
    return {
      name: 'Git configured',
      status: 'FAIL',
      detail: 'Git user name and email not configured.',
      fix: 'git config --global user.name "Your Name" && git config --global user.email "your@email.com"',
    };
  }

  const missing: string[] = [];
  if (!gitConfig.name) missing.push('user.name');
  if (!gitConfig.email) missing.push('user.email');

  if (missing.length > 0) {
    return {
      name: 'Git configured',
      status: 'WARNING',
      detail: `Git missing: ${missing.join(', ')}.`,
      fix: missing.map((m) => `git config --global ${m} "value"`).join(' && '),
    };
  }

  return {
    name: 'Git configured',
    status: 'PASS',
    detail: `Git: ${gitConfig.name} <${gitConfig.email}>.`,
  };
}

/**
 * Check 4: Ollama must be running.
 *
 * @param ollamaList - Output of `ollama list`, or undefined if not reachable.
 * @returns Environment check result.
 */
export function checkOllama(ollamaList?: string): EnvCheck {
  if (!ollamaList || ollamaList.trim().length === 0) {
    return {
      name: 'Ollama running',
      status: 'WARNING',
      detail: 'Ollama not running or not reachable.',
      fix: 'ollama serve',
    };
  }

  return {
    name: 'Ollama running',
    status: 'PASS',
    detail: 'Ollama is running and responding.',
  };
}

/**
 * Check 5: Qwen model must be available in Ollama.
 *
 * @param ollamaList - Output of `ollama list`.
 * @returns Environment check result.
 */
export function checkQwenModel(ollamaList?: string): EnvCheck {
  if (!ollamaList) {
    return {
      name: 'Qwen model available',
      status: 'WARNING',
      detail: 'Cannot check Qwen model — Ollama not running.',
      fix: 'ollama serve && ollama pull qwen3:4b',
    };
  }

  const hasQwen = ollamaList.toLowerCase().includes('qwen');
  if (hasQwen) {
    return {
      name: 'Qwen model available',
      status: 'PASS',
      detail: 'Qwen model found in Ollama.',
    };
  }

  return {
    name: 'Qwen model available',
    status: 'WARNING',
    detail: 'Qwen model not found in Ollama model list.',
    fix: 'ollama pull qwen3:4b',
  };
}

/**
 * Check 6: PostgreSQL must be accessible.
 *
 * @param pgReady - Whether PostgreSQL responds to connection test.
 * @returns Environment check result.
 */
export function checkPostgreSQL(pgReady?: boolean): EnvCheck {
  if (pgReady === true) {
    return {
      name: 'PostgreSQL accessible',
      status: 'PASS',
      detail: 'PostgreSQL is running and accepting connections.',
    };
  }

  return {
    name: 'PostgreSQL accessible',
    status: 'FAIL',
    detail: 'PostgreSQL is not accessible.',
    fix: 'Start PostgreSQL service: net start postgresql-x64-16',
  };
}

/**
 * Check 7: Engine repo must exist at expected path.
 *
 * @param exists - Whether the directory exists.
 * @param path - The path checked.
 * @returns Environment check result.
 */
export function checkEngineRepo(exists?: boolean, path?: string): EnvCheck {
  const repoPath = path || ENGINE_REPO_PATH;

  if (exists === true) {
    return {
      name: 'Engine repo exists',
      status: 'PASS',
      detail: `Engine repo found at ${repoPath}.`,
    };
  }

  return {
    name: 'Engine repo exists',
    status: 'FAIL',
    detail: `Engine repo not found at ${repoPath}.`,
    fix: `git clone <engine-repo-url> "${repoPath}"`,
  };
}

/**
 * Check 8: .bashrc aliases must be loaded.
 *
 * @param loaded - Whether .bashrc exists and contains vm- aliases.
 * @returns Environment check result.
 */
export function checkBashrcAliases(loaded?: boolean): EnvCheck {
  if (loaded === true) {
    return {
      name: '.bashrc aliases loaded',
      status: 'PASS',
      detail: 'Bash aliases are loaded.',
    };
  }

  return {
    name: '.bashrc aliases loaded',
    status: 'WARNING',
    detail: '.bashrc aliases not detected.',
    fix: 'source ~/.bashrc',
  };
}

/**
 * Check 9: Memory files must be accessible.
 *
 * @param accessible - Whether the memory directory is readable.
 * @param path - The path checked.
 * @returns Environment check result.
 */
export function checkMemoryFiles(accessible?: boolean, path?: string): EnvCheck {
  const memPath = path || MEMORY_PATH;

  if (accessible === true) {
    return {
      name: 'Memory files accessible',
      status: 'PASS',
      detail: `Memory files accessible at ${memPath}.`,
    };
  }

  return {
    name: 'Memory files accessible',
    status: 'FAIL',
    detail: `Memory files not accessible at ${memPath}.`,
    fix: `mkdir -p "${memPath}"`,
  };
}

/**
 * Check 10: GitHub CLI must be authenticated.
 *
 * @param ghAuthStatus - Output of `gh auth status`.
 * @returns Environment check result.
 */
export function checkGitHubCli(ghAuthStatus?: string): EnvCheck {
  if (!ghAuthStatus || ghAuthStatus.trim().length === 0) {
    return {
      name: 'GitHub CLI authenticated',
      status: 'WARNING',
      detail: 'GitHub CLI not found or not authenticated.',
      fix: 'gh auth login',
    };
  }

  const isLoggedIn = ghAuthStatus.toLowerCase().includes('logged in');
  if (isLoggedIn) {
    return {
      name: 'GitHub CLI authenticated',
      status: 'PASS',
      detail: 'GitHub CLI is authenticated.',
    };
  }

  return {
    name: 'GitHub CLI authenticated',
    status: 'WARNING',
    detail: 'GitHub CLI found but not authenticated.',
    fix: 'gh auth login',
  };
}

/**
 * Check 11: Notion MCP must be available.
 *
 * @param available - Whether Notion MCP responds.
 * @returns Environment check result.
 */
export function checkNotionMcp(available?: boolean): EnvCheck {
  if (available === true) {
    return {
      name: 'Notion MCP available',
      status: 'PASS',
      detail: 'Notion MCP is responding.',
    };
  }

  return {
    name: 'Notion MCP available',
    status: 'WARNING',
    detail: 'Notion MCP not available. Notion sync features will be disabled.',
    fix: 'Check MCP configuration in Claude settings.',
  };
}

/**
 * Check 12: brand-config must be in sync across repos.
 *
 * @param engineHash - Hash of brand-config from engine repo.
 * @param studioHash - Hash of brand-config from content studio.
 * @returns Environment check result.
 */
export function checkBrandConfigSync(engineHash?: string, studioHash?: string): EnvCheck {
  if (!engineHash || !studioHash) {
    return {
      name: 'brand-config in sync',
      status: 'WARNING',
      detail: 'Cannot verify brand-config sync — one or both hashes unavailable.',
      fix: 'Run: diff <engine>/brand-config.ts <studio>/brand-config.ts',
    };
  }

  if (engineHash === studioHash) {
    return {
      name: 'brand-config in sync',
      status: 'PASS',
      detail: 'brand-config.ts is identical across engine and content-studio repos.',
    };
  }

  return {
    name: 'brand-config in sync',
    status: 'FAIL',
    detail: 'brand-config.ts differs between engine and content-studio repos.',
    fix: 'Sync brand-config.ts: cp <authoritative>/brand-config.ts <target>/brand-config.ts',
  };
}

// --- Aggregate Functions ---

/**
 * Runs all 12 environment checks using the provided command outputs.
 *
 * @param outputs - Pre-captured command outputs for all checks.
 * @returns Complete environment report.
 */
export function runAllChecks(outputs: EnvCommandOutputs): EnvReport {
  const checks: EnvCheck[] = [
    checkNodeVersion(outputs.nodeVersion),
    checkTypeScript(outputs.tscVersion),
    checkGitConfig(outputs.gitConfig),
    checkOllama(outputs.ollamaList),
    checkQwenModel(outputs.ollamaList),
    checkPostgreSQL(outputs.pgReady),
    checkEngineRepo(outputs.engineRepoExists, outputs.engineRepoPath),
    checkBashrcAliases(outputs.bashrcLoaded),
    checkMemoryFiles(outputs.memoryAccessible, outputs.memoryPath),
    checkGitHubCli(outputs.ghAuthStatus),
    checkNotionMcp(outputs.notionMcpAvailable),
    checkBrandConfigSync(outputs.engineBrandConfigHash, outputs.studioBrandConfigHash),
  ];

  const passCount = checks.filter((c) => c.status === 'PASS').length;
  const failCount = checks.filter((c) => c.status === 'FAIL').length;
  const warningCount = checks.filter((c) => c.status === 'WARNING').length;

  let overallStatus: OverallStatus;
  if (failCount === 0 && warningCount === 0) {
    overallStatus = 'HEALTHY';
  } else if (failCount === 0) {
    overallStatus = 'DEGRADED';
  } else {
    overallStatus = 'BROKEN';
  }

  return { checks, passCount, failCount, warningCount, overallStatus };
}

/**
 * Runs a single named check.
 *
 * @param name - The check name to run (case-insensitive partial match).
 * @param outputs - Pre-captured command outputs.
 * @returns The matching check result, or a FAIL if name not found.
 */
export function runCheck(name: string, outputs: EnvCommandOutputs): EnvCheck {
  const report = runAllChecks(outputs);
  const lower = name.toLowerCase();
  const match = report.checks.find((c) => c.name.toLowerCase().includes(lower));
  if (match) return match;
  return { name, status: 'FAIL', detail: `Check '${name}' not found.` };
}

/**
 * Generates a markdown report from an environment check report.
 *
 * @param report - The environment report to format.
 * @returns Markdown-formatted report.
 */
export function generateEnvReport(report: EnvReport): string {
  const lines: string[] = [
    `# ${VM_BRAND.credentials.company} — Environment Health Report`,
    `> ${VM_BRAND.platform.descriptor}`,
    '',
    `## Status: ${report.overallStatus}`,
    '',
    `| Metric | Count |`,
    `|--------|-------|`,
    `| Passed | ${report.passCount} |`,
    `| Failed | ${report.failCount} |`,
    `| Warnings | ${report.warningCount} |`,
    `| Total checks | ${report.checks.length} |`,
    '',
    '## Check Results',
    '',
  ];

  for (const check of report.checks) {
    const icon = check.status === 'PASS' ? '[PASS]' : check.status === 'FAIL' ? '[FAIL]' : '[WARN]';
    lines.push(`### ${icon} ${check.name}`);
    lines.push(`${check.detail}`);
    if (check.fix) {
      lines.push(`**Fix:** \`${check.fix}\``);
    }
    lines.push('');
  }

  // Failed checks summary
  const failed = report.checks.filter((c) => c.status === 'FAIL');
  if (failed.length > 0) {
    lines.push('## Fix Script');
    lines.push('');
    lines.push('```bash');
    lines.push('#!/bin/bash');
    lines.push(`# ${VM_BRAND.credentials.company} environment fix script`);
    lines.push('# Generated by c48d-env-health-checker');
    lines.push('');
    for (const check of failed) {
      if (check.fix) {
        lines.push(`# Fix: ${check.name}`);
        lines.push(check.fix);
        lines.push('');
      }
    }
    lines.push('```');
    lines.push('');
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generates a bash script that attempts to fix all failed checks.
 *
 * @param failedChecks - Array of failed environment checks.
 * @returns Bash script content as a string.
 */
export function generateFixScript(failedChecks: EnvCheck[]): string {
  const lines: string[] = [
    '#!/bin/bash',
    `# ${VM_BRAND.credentials.company} — Environment Fix Script`,
    `# Generated by c48d-env-health-checker`,
    '# Review before running — some fixes may need manual adjustment.',
    '',
    'set -e',
    '',
  ];

  const fixable = failedChecks.filter((c) => c.fix);
  if (fixable.length === 0) {
    lines.push('echo "No automatic fixes available. Check the report for manual instructions."');
    return lines.join('\n');
  }

  for (const check of fixable) {
    lines.push(`echo "Fixing: ${check.name}..."`);
    lines.push(check.fix!);
    lines.push('');
  }

  lines.push('echo "All fixes applied. Run environment health check again to verify."');

  return lines.join('\n');
}

/**
 * Quick boolean check: is the environment healthy?
 *
 * @param outputs - Pre-captured command outputs.
 * @returns True if no FAILs and no WARNINGs.
 */
export function isHealthy(outputs: EnvCommandOutputs): boolean {
  const report = runAllChecks(outputs);
  return report.overallStatus === 'HEALTHY';
}

/**
 * Returns a one-line summary of environment status.
 *
 * @param outputs - Pre-captured command outputs.
 * @returns Summary string (e.g. "ENV: 11/12 PASS (Ollama not running)").
 */
export function getQuickStatus(outputs: EnvCommandOutputs): string {
  const report = runAllChecks(outputs);

  if (report.overallStatus === 'HEALTHY') {
    return `ENV: ${report.passCount}/${report.checks.length} PASS (all clear)`;
  }

  const issues = report.checks
    .filter((c) => c.status !== 'PASS')
    .map((c) => c.name)
    .join(', ');

  return `ENV: ${report.passCount}/${report.checks.length} PASS (${issues})`;
}
