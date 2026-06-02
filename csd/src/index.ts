/**
 * VitalMatrix Content Studio — Dev Package
 * For Claude Code / W05 build sessions only. Never deployed externally.
 *
 * 30 Components across 5 Tiers:
 *
 * Tier 1 Critical: C6-C8
 * Tier 2 High-Yield: C9-C11
 * Tier 3 Gold Standard: C12-C15
 * Tier 4 Force Multipliers: C16d-C25d
 * Tier 5 Meta-Productivity: C26d-C35d
 */

export { VM_BRAND, type EvidenceTier } from './brand-config';

// --- Tier 1: Critical ---
export { T01_TITLE, T01_OPENING_LINE, T01_PROTECTIVE_HEADER, T01_PRACTITIONER_DECISION_SECTION, BORDERLINE_TOOLTIP, formatTerrainResilience, formatDrdDesignation, filterPharmaceutical, applyBorderlineTooltip, generateT01Output, validateT01Compliance } from './c6-t01-output-template';
export { type Violation, type ScanResult, type SeverityLevel, type ViolationCategory, scanContent, generateScanReport, scanFiles } from './c7-compliance-scanner';
export { type GitCommit, type SessionDecision, type FileDelivered, type TestResult, type SessionReport, parseGitLog, extractDecisions, extractFilesDelivered, parseTestOutput, generateSessionReport, GIT_COMMANDS } from './c8-session-report';

// --- Tier 2: High-Yield ---
export { type Decision, type DecisionStatus, DECISION_REGISTRY, searchDecisions, checkConflict, getDependencyChain, getSupersessionChain, exportForContext, getRegistryStats } from './c9-decision-registry';
export { type GuardViolation, type GuardSeverity, CANONICAL, guardFile, generateGuardReport } from './c10-architecture-guard';
export { type TargetWindow, type BriefingInput, type Briefing, generateBriefing, generateAllBriefings, formatBriefingForNotion } from './c11-window-briefing';

// --- Tier 3: Gold Standard ---
export { type TaskProfile, type ContextPayload, generateContext, compareContextSizes, quickContext } from './c12-context-optimizer';
export { type NodeScoreMap, type ZoneScoreMap, type SyntheticPatient, generatePatient, generateTestSuite, exportAsTestFixtures, PRESETS } from './c13-test-data-factory';
export { type ChangelogEntry, type Changelog, type ChangeImpact, type BreakingLevel, analyzeCommit, buildChangelog, formatForSA, formatForW08 } from './c14-changelog-engine';
export { type QualityGateResult, type GateStatus, runQualityGate, formatGateReport } from './c15-quality-gate';

// --- Tier 4: Force Multipliers ---
export { type SpecInput, type ScaffoldResult, scaffoldFromSpec, generateInterfaceFromSpec, generateTestFileFromSpec } from './c16d-spec-to-code-scaffolder';
export { type CoverageEntry, type CoverageReport, parseTestFile, buildCoverageMap, generateCoverageReport, getUncoveredElements } from './c17d-test-coverage-mapper';
export { type StagedChange, type CommitMessage, analyzeStagedChanges, generateCommitMessage, categorizeChange } from './c18d-commit-message-generator';
export { type FileNode, type ImportRef, type DependencyGraph, parseImports, parseExports, buildDependencyGraph, getImpactedFiles, generateDependencyReport } from './c19d-dependency-mapper';
export { type ColumnDef, type MigrationScript, tsTypeToPgType, parseInterfaceToColumns, generateCreateTable, generateMigration } from './c20d-migration-generator';
export { type DuplicateMatch, type DuplicationReport, normaliseCode, findDuplicateBlocks, calculateSimilarity, generateDuplicationReport } from './c21d-code-duplication-detector';
export { type PhaseGuardResult, type PhaseViolation, checkPhaseCompliance, generatePhaseGuardReport } from './c22d-feature-phase-guard';
export { type RiskScore, scoreFileRisk, scoreChangeset, getHighRiskFiles, generateRiskReport } from './c23d-regression-risk-scorer';
export { type ResumeContext, generateResumeContext, formatResumeForContext } from './c24d-session-resume-engine';
export { type NotionSessionWrap, type NotionSection, formatSessionWrap, formatDecisionUpdate, formatGateUpdate, generateNotionPagePayload } from './c25d-notion-sync-engine';

// --- Tier 5: Meta-Productivity ---
export { type HealthMetrics, type HealthGrade, calculateHealth, generateHealthDashboard } from './c26d-codebase-health-dashboard';
export { type PrInput, type PrDescription, generatePrDescription, suggestLabels } from './c27d-pr-description-generator';
export { type TodoItem, type TodoReport, parseTodoMd, crossReferenceWithGit, crossReferenceWithDecisions, crossReferenceWithGates, generateTodoReport, pruneCompleted, getNextAction } from './c28d-smart-todo-manager';
export { type ErrorPattern, type FailureAnalysis, parseTestOutput as parseTestFailures, categorizeError, suggestFix, generateFailureReport } from './c29d-error-pattern-analyzer';
export { type ChecklistItem, type FileChecklist, generateChecklist, generateBatchChecklist } from './c30d-code-review-checklist';
export { type RefactorTarget, type RefactorImpact, analyzeRefactorImpact, findAffectedTests, findRelatedDecisions, estimateEffort, generateImpactReport } from './c31d-refactoring-impact-analyzer';
export { type GraphNode, type GraphEdge, type KnowledgeGraph, buildGraph, query, queryPath, whatDependsOn, generateGraphReport } from './c32d-knowledge-graph-builder';
export { type TokenUsage, type SessionCost, trackUsage, getSessionCost, getMostExpensiveOperations, generateCostReport, resetSession } from './c33d-session-cost-tracker';
export { type DocEntry, type ExportDoc, type ModuleDocs, parseFileForDocs, generateModuleReadme, generateApiReference, generateArchitectureDiagram } from './c34d-auto-documentation-generator';
export { type NamingViolation, validateFileName, validateDirectory, generateNamingReport } from './c35d-file-naming-enforcer';
