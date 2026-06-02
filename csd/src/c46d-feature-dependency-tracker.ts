/**
 * Component 46D: Feature Dependency Tracker
 * DEV PACKAGE — Internal tooling only
 *
 * Tracks which INTAKE features depend on which engine components, connections,
 * and decisions. Prevents building features without their dependencies ready.
 *
 * Covers all 37 Phase 1 features (F1-F10, F11-F20, F21-F30, F31-F37,
 * F41, F42) with their engine, connection, decision, feature, and gate
 * dependencies.
 *
 * @module c46d-feature-dependency-tracker
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Type of dependency a feature can have. */
export type DependencyType = 'engine' | 'connection' | 'decision' | 'feature' | 'gate';

/** Status of a single dependency. */
export type DependencyStatus = 'built' | 'pending' | 'blocked';

/** Overall readiness status of a feature. */
export type FeatureReadiness = 'ready' | 'blocked' | 'partial';

/** A single dependency entry. */
export interface Dependency {
  /** Type of dependency. */
  type: DependencyType;
  /** Identifier (e.g. 'FLINT', 'D-212', 'F41', 'consent-gate'). */
  id: string;
  /** Current status of this dependency. */
  status: DependencyStatus;
  /** Reason for blocked status, if applicable. */
  blockReason?: string;
}

/** A feature and its full dependency chain. */
export interface FeatureDependency {
  /** Feature identifier (e.g. 'F1', 'F42'). */
  featureId: string;
  /** Human-readable feature name. */
  featureName: string;
  /** All dependencies this feature requires. */
  dependsOn: Dependency[];
  /** Overall readiness status. */
  status: FeatureReadiness;
}

// --- Pre-built Feature Dependency Map ---

/**
 * Master map of all 37 Phase 1 features to their dependencies.
 *
 * Status values are defaults; call updateDependencyStatus() to override
 * based on actual build state.
 */
const FEATURE_MAP: FeatureDependency[] = [
  // F1-F10: Core scoring features — depend on L1 node scoring
  {
    featureId: 'F1', featureName: 'Node score calculation (N1)',
    dependsOn: [
      { type: 'engine', id: 'FLINT', status: 'built' },
      { type: 'decision', id: 'D-212', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F2', featureName: 'Node score calculation (N2)',
    dependsOn: [
      { type: 'engine', id: 'FLINT', status: 'built' },
      { type: 'decision', id: 'D-212', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F3', featureName: 'Node score calculation (N3)',
    dependsOn: [
      { type: 'engine', id: 'FLINT', status: 'built' },
      { type: 'decision', id: 'D-212', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F4', featureName: 'Node score calculation (N4)',
    dependsOn: [
      { type: 'engine', id: 'FLINT', status: 'built' },
      { type: 'decision', id: 'D-212', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F5', featureName: 'Node score calculation (N5)',
    dependsOn: [
      { type: 'engine', id: 'FLINT', status: 'built' },
      { type: 'decision', id: 'D-212', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F6', featureName: 'Node score calculation (N6)',
    dependsOn: [
      { type: 'engine', id: 'FLINT', status: 'built' },
      { type: 'decision', id: 'D-212', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F7', featureName: 'Node score calculation (N7)',
    dependsOn: [
      { type: 'engine', id: 'FLINT', status: 'built' },
      { type: 'decision', id: 'D-212', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F8', featureName: 'Zone aggregation (Z1-Z5)',
    dependsOn: [
      { type: 'engine', id: 'APEX', status: 'built' },
      { type: 'feature', id: 'F1', status: 'built' },
      { type: 'feature', id: 'F2', status: 'built' },
      { type: 'feature', id: 'F3', status: 'built' },
      { type: 'feature', id: 'F4', status: 'built' },
      { type: 'feature', id: 'F5', status: 'built' },
      { type: 'feature', id: 'F6', status: 'built' },
      { type: 'feature', id: 'F7', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F9', featureName: 'Terrain resilience score',
    dependsOn: [
      { type: 'engine', id: 'APEX', status: 'built' },
      { type: 'feature', id: 'F8', status: 'built' },
      { type: 'decision', id: 'D-212', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F10', featureName: 'DRD designation',
    dependsOn: [
      { type: 'engine', id: 'APEX', status: 'built' },
      { type: 'feature', id: 'F9', status: 'built' },
    ],
    status: 'ready',
  },
  // F11-F20: STRIDE and threshold features
  {
    featureId: 'F11', featureName: 'STRIDE rule evaluation (TS01-TS10)',
    dependsOn: [
      { type: 'engine', id: 'STRIDE', status: 'built' },
      { type: 'decision', id: 'D-232', status: 'built' },
      { type: 'feature', id: 'F8', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F12', featureName: 'STRIDE rule evaluation (TS11-TS20)',
    dependsOn: [
      { type: 'engine', id: 'STRIDE', status: 'built' },
      { type: 'decision', id: 'D-232', status: 'built' },
      { type: 'feature', id: 'F8', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F13', featureName: 'STRIDE rule evaluation (TS21-TS30)',
    dependsOn: [
      { type: 'engine', id: 'STRIDE', status: 'built' },
      { type: 'decision', id: 'D-232', status: 'built' },
      { type: 'feature', id: 'F8', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F14', featureName: 'RIL state classification',
    dependsOn: [
      { type: 'engine', id: 'RIL', status: 'built' },
      { type: 'decision', id: 'D-233a', status: 'built' },
      { type: 'feature', id: 'F11', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F15', featureName: 'Threshold breach detection',
    dependsOn: [
      { type: 'engine', id: 'STRIDE', status: 'built' },
      { type: 'feature', id: 'F11', status: 'built' },
      { type: 'feature', id: 'F12', status: 'built' },
      { type: 'feature', id: 'F13', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F16', featureName: 'Priority ranking engine',
    dependsOn: [
      { type: 'engine', id: 'CADENCE', status: 'built' },
      { type: 'feature', id: 'F14', status: 'built' },
      { type: 'feature', id: 'F15', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F17', featureName: 'Connection strength calculation',
    dependsOn: [
      { type: 'engine', id: 'CIL', status: 'built' },
      { type: 'connection', id: 'VANTAGE-connections', status: 'built' },
      { type: 'feature', id: 'F8', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F18', featureName: 'Cascade path detection',
    dependsOn: [
      { type: 'engine', id: 'CIL', status: 'built' },
      { type: 'feature', id: 'F17', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F19', featureName: 'Intervention impact prediction',
    dependsOn: [
      { type: 'engine', id: 'CADENCE', status: 'built' },
      { type: 'feature', id: 'F18', status: 'built' },
      { type: 'feature', id: 'F16', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F20', featureName: 'VISTA terrain summary',
    dependsOn: [
      { type: 'engine', id: 'VISTA', status: 'built' },
      { type: 'feature', id: 'F9', status: 'built' },
      { type: 'feature', id: 'F14', status: 'built' },
      { type: 'feature', id: 'F16', status: 'built' },
    ],
    status: 'ready',
  },
  // F21-F30: INTAKE and data collection features
  {
    featureId: 'F21', featureName: 'INTAKE form — demographics section',
    dependsOn: [
      { type: 'decision', id: 'D-193', status: 'built' },
      { type: 'gate', id: 'age-gate', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F22', featureName: 'INTAKE form — symptom questionnaire',
    dependsOn: [
      { type: 'feature', id: 'F21', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F23', featureName: 'INTAKE form — medical history',
    dependsOn: [
      { type: 'feature', id: 'F21', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F24', featureName: 'INTAKE form — lifestyle assessment',
    dependsOn: [
      { type: 'feature', id: 'F21', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F25', featureName: 'INTAKE form — laboratory data input',
    dependsOn: [
      { type: 'feature', id: 'F21', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F26', featureName: 'INTAKE form — functional markers',
    dependsOn: [
      { type: 'feature', id: 'F25', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F27', featureName: 'INTAKE form — dietary assessment',
    dependsOn: [
      { type: 'feature', id: 'F24', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F28', featureName: 'INTAKE form — environmental exposure',
    dependsOn: [
      { type: 'feature', id: 'F21', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F29', featureName: 'INTAKE form — psychological profile',
    dependsOn: [
      { type: 'feature', id: 'F21', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F30', featureName: 'INTAKE form — validation and submission',
    dependsOn: [
      { type: 'feature', id: 'F21', status: 'built' },
      { type: 'feature', id: 'F22', status: 'built' },
      { type: 'feature', id: 'F23', status: 'built' },
      { type: 'feature', id: 'F24', status: 'built' },
      { type: 'feature', id: 'F25', status: 'built' },
      { type: 'gate', id: 'consent-gate', status: 'built' },
    ],
    status: 'ready',
  },
  // F31-F37: Output and reporting features
  {
    featureId: 'F31', featureName: 'T-01 output generation',
    dependsOn: [
      { type: 'engine', id: 'VISTA', status: 'built' },
      { type: 'feature', id: 'F20', status: 'built' },
      { type: 'feature', id: 'F10', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F32', featureName: 'Practitioner decision summary',
    dependsOn: [
      { type: 'feature', id: 'F31', status: 'built' },
      { type: 'feature', id: 'F16', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F33', featureName: 'Evidence tier annotation',
    dependsOn: [
      { type: 'feature', id: 'F31', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F34', featureName: 'PDF export',
    dependsOn: [
      { type: 'feature', id: 'F31', status: 'built' },
      { type: 'feature', id: 'F33', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F35', featureName: 'Session history tracking',
    dependsOn: [
      { type: 'feature', id: 'F30', status: 'built' },
      { type: 'feature', id: 'F31', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F36', featureName: 'Progress comparison (longitudinal)',
    dependsOn: [
      { type: 'feature', id: 'F35', status: 'built' },
      { type: 'feature', id: 'F9', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F37', featureName: 'Practitioner dashboard overview',
    dependsOn: [
      { type: 'feature', id: 'F20', status: 'built' },
      { type: 'feature', id: 'F35', status: 'built' },
    ],
    status: 'ready',
  },
  // F41-F42: Safety and consent features
  {
    featureId: 'F41', featureName: 'Consent gate',
    dependsOn: [
      { type: 'gate', id: 'consent-gate', status: 'built' },
      { type: 'decision', id: 'D-193', status: 'built' },
    ],
    status: 'ready',
  },
  {
    featureId: 'F42', featureName: 'Safety module',
    dependsOn: [
      { type: 'gate', id: 'safety-gate', status: 'built' },
      { type: 'feature', id: 'F41', status: 'built' },
      { type: 'engine', id: 'STRIDE', status: 'built' },
    ],
    status: 'ready',
  },
];

// --- Mutable state for runtime status updates ---

/** Deep clone of the feature map for runtime mutation. */
let runtimeMap: FeatureDependency[] = JSON.parse(JSON.stringify(FEATURE_MAP));

/**
 * Resets the runtime feature map to defaults.
 * Useful for testing.
 */
export function resetFeatureMap(): void {
  runtimeMap = JSON.parse(JSON.stringify(FEATURE_MAP));
}

/**
 * Updates the status of a specific dependency across all features.
 *
 * @param type - The dependency type to update.
 * @param id - The dependency identifier.
 * @param status - The new status.
 * @param blockReason - Optional reason if status is 'blocked'.
 */
export function updateDependencyStatus(
  type: DependencyType,
  id: string,
  status: DependencyStatus,
  blockReason?: string,
): void {
  for (const feature of runtimeMap) {
    for (const dep of feature.dependsOn) {
      if (dep.type === type && dep.id === id) {
        dep.status = status;
        dep.blockReason = blockReason;
      }
    }
    // Recalculate feature status
    feature.status = calculateFeatureStatus(feature);
  }
}

/**
 * Calculates the overall readiness status of a feature based on its dependencies.
 */
function calculateFeatureStatus(feature: FeatureDependency): FeatureReadiness {
  if (feature.dependsOn.length === 0) return 'ready';
  const allBuilt = feature.dependsOn.every((d) => d.status === 'built');
  if (allBuilt) return 'ready';
  const anyBlocked = feature.dependsOn.some((d) => d.status === 'blocked');
  if (anyBlocked) return 'blocked';
  return 'partial';
}

// --- Public Functions ---

/**
 * Checks whether a feature is ready to build (all dependencies met).
 *
 * @param featureId - The feature identifier (e.g. 'F1', 'F42').
 * @returns True if all dependencies are built, false otherwise.
 */
export function checkFeatureReady(featureId: string): boolean {
  const feature = runtimeMap.find((f) => f.featureId === featureId);
  if (!feature) return false;
  return feature.dependsOn.every((d) => d.status === 'built');
}

/**
 * Retrieves all dependencies for a given feature, with their current status.
 *
 * @param featureId - The feature identifier.
 * @returns The feature dependency object, or undefined if not found.
 */
export function getDependencies(featureId: string): FeatureDependency | undefined {
  return runtimeMap.find((f) => f.featureId === featureId);
}

/**
 * Returns all features that are currently blocked (have at least one
 * blocked or pending dependency).
 *
 * @returns Array of blocked feature dependency objects.
 */
export function getBlockedFeatures(): FeatureDependency[] {
  return runtimeMap.filter((f) => f.status === 'blocked' || f.status === 'partial');
}

/**
 * Returns all features that are ready to build (all dependencies met).
 *
 * @returns Array of ready feature dependency objects.
 */
export function getReadyFeatures(): FeatureDependency[] {
  return runtimeMap.filter((f) => f.status === 'ready');
}

/**
 * Generates a text-based dependency graph for a single feature,
 * showing its dependency tree with status indicators.
 *
 * @param featureId - The feature identifier.
 * @returns Text-based dependency graph, or error message if not found.
 */
export function generateDependencyGraph(featureId: string): string {
  const feature = runtimeMap.find((f) => f.featureId === featureId);
  if (!feature) return `Feature '${featureId}' not found.`;

  const statusIcon = (s: DependencyStatus): string => {
    switch (s) {
      case 'built': return '[BUILT]';
      case 'pending': return '[PENDING]';
      case 'blocked': return '[BLOCKED]';
    }
  };

  const lines: string[] = [
    `${feature.featureId}: ${feature.featureName} (${feature.status.toUpperCase()})`,
  ];

  if (feature.dependsOn.length === 0) {
    lines.push('  (no dependencies)');
  } else {
    for (let i = 0; i < feature.dependsOn.length; i++) {
      const dep = feature.dependsOn[i];
      const isLast = i === feature.dependsOn.length - 1;
      const connector = isLast ? '  +--' : '  |--';
      let line = `${connector} ${dep.type}:${dep.id} ${statusIcon(dep.status)}`;
      if (dep.blockReason) {
        line += ` — ${dep.blockReason}`;
      }

      // If dependency is a feature, show its sub-dependencies
      if (dep.type === 'feature') {
        const subFeature = runtimeMap.find((f) => f.featureId === dep.id);
        if (subFeature && subFeature.dependsOn.length > 0) {
          lines.push(line);
          const subPrefix = isLast ? '      ' : '  |   ';
          for (let j = 0; j < subFeature.dependsOn.length; j++) {
            const subDep = subFeature.dependsOn[j];
            const subIsLast = j === subFeature.dependsOn.length - 1;
            const subConnector = subIsLast ? '+--' : '|--';
            let subLine = `${subPrefix}${subConnector} ${subDep.type}:${subDep.id} ${statusIcon(subDep.status)}`;
            if (subDep.blockReason) {
              subLine += ` — ${subDep.blockReason}`;
            }
            lines.push(subLine);
          }
          continue;
        }
      }
      lines.push(line);
    }
  }

  return lines.join('\n');
}

/**
 * Generates a comprehensive dependency report covering all 37 Phase 1
 * features with their status and dependency details.
 *
 * @returns Markdown-formatted dependency report.
 */
export function generateDependencyReport(): string {
  const ready = getReadyFeatures();
  const blocked = getBlockedFeatures();

  const lines: string[] = [
    `# ${VM_BRAND.credentials.company} — Feature Dependency Report`,
    `> ${VM_BRAND.platform.descriptor} | Phase 1: ${runtimeMap.length} features`,
    '',
    '## Summary',
    '',
    `| Status | Count |`,
    `|--------|-------|`,
    `| Ready to build | ${ready.length} |`,
    `| Blocked/Partial | ${blocked.length} |`,
    `| Total features | ${runtimeMap.length} |`,
    '',
  ];

  if (ready.length > 0) {
    lines.push('## Ready Features');
    lines.push('');
    for (const f of ready) {
      lines.push(`- **${f.featureId}**: ${f.featureName} (${f.dependsOn.length} deps, all built)`);
    }
    lines.push('');
  }

  if (blocked.length > 0) {
    lines.push('## Blocked/Partial Features');
    lines.push('');
    for (const f of blocked) {
      const pendingDeps = f.dependsOn.filter((d) => d.status !== 'built');
      lines.push(`### ${f.featureId}: ${f.featureName} [${f.status.toUpperCase()}]`);
      lines.push('');
      for (const dep of pendingDeps) {
        let line = `- ${dep.type}:${dep.id} — ${dep.status.toUpperCase()}`;
        if (dep.blockReason) line += ` (${dep.blockReason})`;
        lines.push(line);
      }
      lines.push('');
    }
  }

  // Dependency graph for blocked features
  if (blocked.length > 0) {
    lines.push('## Dependency Graphs (Blocked Features)');
    lines.push('');
    lines.push('```');
    for (const f of blocked) {
      lines.push(generateDependencyGraph(f.featureId));
      lines.push('');
    }
    lines.push('```');
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
