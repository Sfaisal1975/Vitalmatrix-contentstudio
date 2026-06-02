# VitalMatrix Content Studio Dev — Master Specifications
## Version 3.0 | 2 June 2026

> RETROSPECTIVE SPECIFICATION: Components built under rapid prototyping (1-2 June 2026).
> Spec documentation follows component implementation. W06 TYPE 3 specs pending.

### Purpose
Developer productivity toolkit for W05 Claude Code build sessions.
Never deployed externally. Stays on the Lenovo.

### Target Outcome
Reduce session overhead, prevent architectural violations, automate repetitive tasks.

---

## Component Register (30 Components)

### Tier 1: Critical (built 1 June 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C6 | T-01 Output Template Generator | Auto-applies all 7 T-01 restrictions to clinical output | BUILT |
| C7 | Compliance Scanner | 22 rules: kill list, credentials, deprecated terms, MHRA/ASA/GDPR | BUILT |
| C8 | Session Report Generator | Auto-generates Notion session wraps from git commits | BUILT |

### Tier 2: High-Yield (built 1 June 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C9 | D-Series Decision Registry | Searchable registry, conflict detection, dependency graph, supersession chains | BUILT |
| C10 | Architecture Guard | ALB v1.4 code validation: N8, Z6+, S7+, S4 Theoretical, S6 Unidirectional, dampening, pipeline order | BUILT |
| C11 | Multi-Window Briefing Generator | Auto-generates briefings for W04/W06/W08/W26/SA from session data | BUILT |

### Tier 3: Gold Standard (built 1 June 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C12 | Context Window Optimizer | 11 task profiles, task-aware context slicing, 40-70% token reduction | BUILT |
| C13 | Test Data Factory | Synthetic patients with valid scoring, 9 presets, batch generation | BUILT |
| C14 | Intelligent Changelog Engine | Architecture-aware diffs, impact classification, D-series linking | BUILT |
| C15 | Pre-Commit Quality Gate | Combined C7+C10+C6+C9 in single pass, PASS/FAIL with commit blocking | BUILT |

### Tier 4: Force Multipliers (built 2 June 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C16d | Spec-to-Code Scaffolder | TYPE 3 spec → TypeScript skeleton + test file + interfaces | BUILT |
| C17d | Test Coverage Mapper | Maps test files to architecture elements, shows gaps | BUILT |
| C18d | Commit Message Generator | Analyzes staged changes → architecture-aware commit messages | BUILT |
| C19d | Cross-File Dependency Mapper | Import/export mapping, circular dep detection, impact analysis | BUILT |
| C20d | Migration Script Generator | TypeScript interfaces → PostgreSQL migration scripts (vm_ prefix) | BUILT |
| C21d | Code Duplication Detector | Finds duplicate logic across 77+ files, consolidation suggestions | BUILT |
| C22d | Feature Phase Guard | Hard gate: VECTOR blocked, HHW/Performance Code blocked, Phase 2 blocked | BUILT |
| C23d | Regression Risk Scorer | Scores file change risk based on dependencies and engine criticality | BUILT |
| C24d | Session Resume Engine | Generates minimal "where you left off" context (<500 tokens) | BUILT |
| C25d | Notion Sync Engine | Formats session wraps, decisions, gates for Notion API | BUILT |

### Tier 5: Meta-Productivity (built 2 June 2026)

| # | Component | Purpose | Status |
|---|-----------|---------|--------|
| C26d | Codebase Health Dashboard | Aggregated health: tests, coverage, duplication, compliance, deps → A-F grade | BUILT |
| C27d | PR Description Generator | Auto-generates PR descriptions with impact, decisions, reviewer checklist | BUILT |
| C28d | Smart TODO Manager | Cross-references TODO.md with git/decisions/gates, auto-prunes | BUILT |
| C29d | Error Pattern Analyzer | Categorizes test failures, 14 patterns, architecture-aware fix suggestions | BUILT |
| C30d | Code Review Checklist | Per-file review checklist: architecture, compliance, clinical, testing | BUILT |
| C31d | Refactoring Impact Analyzer | Shows what breaks before refactoring: affected files, tests, decisions, effort | BUILT |
| C32d | Knowledge Graph Builder | Queryable architecture graph: nodes→zones→stacks→engines→mnemonics | BUILT |
| C33d | Session Cost Tracker | API token usage tracking, cost estimation, savings suggestions | BUILT |
| C34d | Auto-Documentation Generator | Generates README, API docs, architecture diagrams from source | BUILT |
| C35d | File Naming Enforcer | Validates kebab-case, directory placement, prefix conventions | BUILT |

---

## Architecture Rules

- All components are W05-internal. Never deployed to Replit or externally.
- TypeScript ONLY. No Java.
- Engine repo: C:\Users\Lenovo\Downloads\vitalmatrix-mvil-engines-20260320\vitalmatrix
- npx ts-node for execution (module resolution workaround)
- brand-config.ts shared with CSW (identical copy)

## Dependencies

### Tier 1-3
- C6, C8, C9, C11, C12, C13, C14: depend on brand-config only
- C7: standalone (shared with CSW)
- C10: standalone (canonical architecture constants)
- C15: depends on C6, C7, C9, C10

### Tier 4
- C16d: standalone (spec parsing)
- C17d: standalone (test file parsing)
- C18d: standalone (diff analysis)
- C19d: standalone (import/export parsing)
- C20d: standalone (type-to-SQL mapping)
- C21d: standalone (code comparison)
- C22d: standalone (phase constants)
- C23d: depends on C19d (dependency graph)
- C24d: standalone (git/memory parsing)
- C25d: standalone (Notion formatting)

## Deployment

- **Local only:** `csd` (cd) or `ccsd` (cd + Claude Code)
- **GitHub:** Private repo, Sfaisal1975/Vitalmatrix-content-studio-dev
- **Never:** deployed to Replit, Hostinger, or any external environment

## Stats

- **Components:** 30
- **Shortcut:** `ccsd`

---
VitalMatrix Ltd | ICO ZC101813 | Internal development tooling | 2026
