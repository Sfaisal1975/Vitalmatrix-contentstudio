/**
 * Component 19D: Dependency Mapper
 *
 * Maps imports and exports across all src/ files in the VitalMatrix
 * engine repository. Builds a full dependency graph with circular
 * dependency detection, orphan file identification, and transitive
 * impact analysis.
 *
 * Designed for the 77+ TypeScript file codebase spanning
 * src/l1-l9/, src/connections/, src/stride/, src/safety/,
 * and src/intake-features/.
 *
 * @module c19d-dependency-mapper
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A single import reference extracted from a file. */
export interface ImportRef {
  /** The module path in the import statement (e.g. './l3/apex-engine') */
  from: string;
  /** Imported names (e.g. ['computeAPEX', 'APEXResult']) */
  names: string[];
}

/** Represents a single file node in the dependency graph. */
export interface FileNode {
  /** File path (relative to project root) */
  path: string;
  /** All import references in this file */
  imports: ImportRef[];
  /** All exported names from this file */
  exports: string[];
  /** Paths of files this file depends on (imports from) */
  dependsOn: string[];
  /** Paths of files that depend on this file (import from it) */
  dependedOnBy: string[];
}

/** The complete dependency graph for a codebase. */
export interface DependencyGraph {
  /** All file nodes in the graph */
  files: FileNode[];
  /** Detected circular dependency chains (each chain is a list of file paths) */
  circularDeps: string[][];
  /** Files that are neither imported by nor import any other project file */
  orphanFiles: string[];
}

/** Input structure for a source file. */
export interface SourceFileInput {
  /** File path (relative to project root) */
  path: string;
  /** Full text content of the source file */
  content: string;
}

// --- Core Functions ---

/**
 * Parses all import statements from a TypeScript file's content.
 * Handles named imports, default imports, namespace imports, and
 * type-only imports.
 *
 * @param content - Full text content of a TypeScript file.
 * @returns Array of ImportRef objects.
 */
export function parseImports(content: string): ImportRef[] {
  const imports: ImportRef[] = [];

  // Named imports: import { Foo, Bar } from './module';
  // Also handles: import type { Foo } from './module';
  const namedPattern = /import\s+(?:type\s+)?{([^}]*)}\s+from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = namedPattern.exec(content)) !== null) {
    const names = match[1]
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => {
        // Handle aliased imports: Foo as Bar
        const parts = n.split(/\s+as\s+/);
        return parts[parts.length - 1].trim();
      })
      .filter((n) => n.length > 0 && !n.startsWith('type '));
    imports.push({ from: match[2], names });
  }

  // Default imports: import Foo from './module';
  const defaultPattern = /import\s+([A-Z_$][A-Za-z0-9_$]*)\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = defaultPattern.exec(content)) !== null) {
    // Avoid matching 'import type' which has already been handled above
    const preMatch = content.slice(Math.max(0, match.index - 5), match.index);
    if (!preMatch.includes('type')) {
      imports.push({ from: match[2], names: [match[1]] });
    }
  }

  // Namespace imports: import * as Foo from './module';
  const namespacePattern = /import\s+\*\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = namespacePattern.exec(content)) !== null) {
    imports.push({ from: match[2], names: [`* as ${match[1]}`] });
  }

  // Side-effect imports: import './module';
  const sideEffectPattern = /import\s+['"]([^'"]+)['"]\s*;/g;
  while ((match = sideEffectPattern.exec(content)) !== null) {
    imports.push({ from: match[1], names: [] });
  }

  return imports;
}

/**
 * Parses all export names from a TypeScript file's content.
 * Handles named exports, export declarations, default exports,
 * and re-exports.
 *
 * @param content - Full text content of a TypeScript file.
 * @returns Array of exported name strings.
 */
export function parseExports(content: string): string[] {
  const exports = new Set<string>();
  let match: RegExpExecArray | null;

  // export function/const/class/enum/interface/type declarations
  const declPattern = /export\s+(?:default\s+)?(?:async\s+)?(?:function|const|let|var|class|enum|interface|type)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
  while ((match = declPattern.exec(content)) !== null) {
    exports.add(match[1]);
  }

  // Named export blocks: export { Foo, Bar };
  const namedExportPattern = /export\s+{([^}]*)}/g;
  while ((match = namedExportPattern.exec(content)) !== null) {
    const names = match[1].split(',').map((n) => n.trim()).filter(Boolean);
    for (const name of names) {
      // Handle 'Foo as Bar' — export the alias
      const parts = name.split(/\s+as\s+/);
      const exportedName = parts[parts.length - 1].trim();
      if (exportedName && !exportedName.startsWith('type ')) {
        exports.add(exportedName);
      }
    }
  }

  // export default (anonymous)
  if (/export\s+default\s+/.test(content) && !exports.has('default')) {
    exports.add('default');
  }

  return Array.from(exports).sort();
}

/**
 * Resolves a relative import path against the importing file's path
 * to produce a normalised file path for graph matching.
 *
 * @param importFrom - The import path (e.g. './l3/apex-engine').
 * @param importerPath - The path of the file containing the import.
 * @returns Resolved path, or the original if it is a package import.
 */
export function resolveImportPath(importFrom: string, importerPath: string): string {
  // Skip non-relative imports (node_modules, built-ins)
  if (!importFrom.startsWith('.') && !importFrom.startsWith('/')) {
    return importFrom;
  }

  // Normalise separators
  const normImporter = importerPath.replace(/\\/g, '/');
  const importerDir = normImporter.substring(0, normImporter.lastIndexOf('/'));

  // Resolve relative path
  const parts = `${importerDir}/${importFrom}`.split('/');
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === '.' || part === '') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }

  let result = resolved.join('/');

  // Add .ts extension if not present
  if (!result.endsWith('.ts') && !result.endsWith('.tsx') && !result.endsWith('.js')) {
    result += '.ts';
  }

  return result;
}

/**
 * Builds a complete dependency graph from a set of source files.
 * Detects circular dependencies and orphan files.
 *
 * @param files - Array of source files with path and content.
 * @returns DependencyGraph with all nodes, circular deps, and orphans.
 */
export function buildDependencyGraph(files: SourceFileInput[]): DependencyGraph {
  // Build a path set for quick lookup
  const pathSet = new Set<string>(files.map((f) => normalise(f.path)));

  // Also build a set without extensions for matching imports without .ts
  const pathSetNoExt = new Map<string, string>();
  for (const f of files) {
    const norm = normalise(f.path);
    pathSetNoExt.set(norm, norm);
    // Also register without extension
    const noExt = norm.replace(/\.(ts|tsx|js|jsx)$/, '');
    pathSetNoExt.set(noExt, norm);
    // Register with /index for directory imports
    pathSetNoExt.set(`${noExt}/index`, norm);
  }

  // Parse each file
  const nodeMap = new Map<string, FileNode>();

  for (const file of files) {
    const norm = normalise(file.path);
    const imports = parseImports(file.content);
    const exports = parseExports(file.content);

    const dependsOn: string[] = [];

    for (const imp of imports) {
      const resolved = resolveImportPath(imp.from, norm);
      const resolvedNorm = normalise(resolved);

      // Try to match against known files
      const matchedPath =
        pathSetNoExt.get(resolvedNorm) ??
        pathSetNoExt.get(resolvedNorm.replace(/\.ts$/, '')) ??
        null;

      if (matchedPath && matchedPath !== norm) {
        if (!dependsOn.includes(matchedPath)) {
          dependsOn.push(matchedPath);
        }
      }
    }

    nodeMap.set(norm, {
      path: norm,
      imports,
      exports,
      dependsOn,
      dependedOnBy: [], // populated in second pass
    });
  }

  // Second pass: populate dependedOnBy
  for (const [path, node] of nodeMap) {
    for (const dep of node.dependsOn) {
      const depNode = nodeMap.get(dep);
      if (depNode && !depNode.dependedOnBy.includes(path)) {
        depNode.dependedOnBy.push(path);
      }
    }
  }

  // Detect circular dependencies
  const circularDeps = detectCircularDeps(nodeMap);

  // Find orphan files (no imports from project files, and nobody imports them)
  const orphanFiles = Array.from(nodeMap.values())
    .filter((node) => node.dependsOn.length === 0 && node.dependedOnBy.length === 0)
    .map((node) => node.path)
    .sort();

  return {
    files: Array.from(nodeMap.values()),
    circularDeps,
    orphanFiles,
  };
}

/**
 * Returns all files that transitively depend on the given file.
 * Useful for impact analysis — "if I change this file, what else breaks?"
 *
 * @param graph - The dependency graph.
 * @param changedFile - Path of the changed file.
 * @returns Array of file paths that transitively depend on changedFile.
 */
export function getImpactedFiles(graph: DependencyGraph, changedFile: string): string[] {
  const normChanged = normalise(changedFile);
  const visited = new Set<string>();
  const queue: string[] = [normChanged];

  while (queue.length > 0) {
    const current = queue.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const node = graph.files.find((f) => f.path === current);
    if (node) {
      for (const dependent of node.dependedOnBy) {
        if (!visited.has(dependent)) {
          queue.push(dependent);
        }
      }
    }
  }

  // Remove the original file from the impact set
  visited.delete(normChanged);
  return Array.from(visited).sort();
}

/**
 * Generates a Markdown dependency report with file count, circular
 * dependencies, orphan files, and the most-depended-on files.
 *
 * @param graph - The dependency graph.
 * @returns Markdown-formatted report string.
 */
export function generateDependencyReport(graph: DependencyGraph): string {
  const lines: string[] = [];

  lines.push(`# VitalMatrix Dependency Report`);
  lines.push('');
  lines.push(`> Generated by ${VM_BRAND.credentials.company} Content Studio`);
  lines.push('');

  // Summary
  lines.push(`## Summary`);
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Total files | ${graph.files.length} |`);
  lines.push(`| Circular dependency chains | ${graph.circularDeps.length} |`);
  lines.push(`| Orphan files | ${graph.orphanFiles.length} |`);
  lines.push('');

  // Circular dependencies
  if (graph.circularDeps.length > 0) {
    lines.push(`## Circular Dependencies (${graph.circularDeps.length})`);
    lines.push('');
    for (let i = 0; i < graph.circularDeps.length; i++) {
      const chain = graph.circularDeps[i];
      lines.push(`${i + 1}. ${chain.join(' -> ')}`);
    }
    lines.push('');
  }

  // Orphan files
  if (graph.orphanFiles.length > 0) {
    lines.push(`## Orphan Files (${graph.orphanFiles.length})`);
    lines.push('');
    lines.push('Files with no project-internal imports or dependents:');
    lines.push('');
    for (const orphan of graph.orphanFiles) {
      lines.push(`- ${orphan}`);
    }
    lines.push('');
  }

  // Most depended-on files (top 20)
  const sorted = [...graph.files]
    .filter((f) => f.dependedOnBy.length > 0)
    .sort((a, b) => b.dependedOnBy.length - a.dependedOnBy.length)
    .slice(0, 20);

  if (sorted.length > 0) {
    lines.push(`## Most Depended-On Files (Top ${sorted.length})`);
    lines.push('');
    lines.push(`| File | Dependents | Exports |`);
    lines.push(`| --- | --- | --- |`);
    for (const node of sorted) {
      lines.push(`| ${node.path} | ${node.dependedOnBy.length} | ${node.exports.length} |`);
    }
    lines.push('');
  }

  // Files with most dependencies (most complex)
  const complex = [...graph.files]
    .filter((f) => f.dependsOn.length > 0)
    .sort((a, b) => b.dependsOn.length - a.dependsOn.length)
    .slice(0, 20);

  if (complex.length > 0) {
    lines.push(`## Most Complex Files (Top ${complex.length} by dependency count)`);
    lines.push('');
    lines.push(`| File | Dependencies | Imports |`);
    lines.push(`| --- | --- | --- |`);
    for (const node of complex) {
      const importCount = node.imports.reduce((sum, imp) => sum + imp.names.length, 0);
      lines.push(`| ${node.path} | ${node.dependsOn.length} | ${importCount} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// --- Internal Helpers ---

/**
 * Normalises a file path for consistent comparison.
 */
function normalise(path: string): string {
  return path.replace(/\\/g, '/');
}

/**
 * Detects circular dependencies in the file node map using DFS.
 * Returns an array of circular chains.
 */
function detectCircularDeps(nodeMap: Map<string, FileNode>): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const pathStack: string[] = [];

  function dfs(path: string): void {
    if (inStack.has(path)) {
      // Found a cycle — extract it from the stack
      const cycleStart = pathStack.indexOf(path);
      if (cycleStart >= 0) {
        const cycle = [...pathStack.slice(cycleStart), path];
        // Avoid duplicate cycles (normalise by starting from the smallest element)
        const minIdx = cycle.indexOf(
          cycle.reduce((min, cur) => (cur < min ? cur : min), cycle[0]),
        );
        const normalised = [...cycle.slice(minIdx), ...cycle.slice(0, minIdx), cycle[minIdx]];

        // Check for duplicates
        const key = normalised.join('|');
        const existingKeys = cycles.map((c) => c.join('|'));
        if (!existingKeys.includes(key)) {
          cycles.push(normalised);
        }
      }
      return;
    }

    if (visited.has(path)) return;

    visited.add(path);
    inStack.add(path);
    pathStack.push(path);

    const node = nodeMap.get(path);
    if (node) {
      for (const dep of node.dependsOn) {
        dfs(dep);
      }
    }

    pathStack.pop();
    inStack.delete(path);
  }

  for (const path of nodeMap.keys()) {
    dfs(path);
  }

  return cycles;
}
