/**
 * Component 34D: Auto-Documentation Generator
 * DEV PACKAGE — Internal tooling only
 *
 * Generates documentation from TypeScript source code. Parses exports,
 * JSDoc comments, and dependency imports to produce README files, API
 * reference documents, and text-based architecture diagrams.
 *
 * Pipeline context: FLINT > APEX > STRIDE > RIL > CADENCE > CIL > VISTA
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Export type classification. */
export type ExportKind = 'function' | 'interface' | 'type' | 'const';

/** Documentation for a single exported symbol. */
export interface ExportDoc {
  /** Exported symbol name. */
  name: string;
  /** Kind of export. */
  type: ExportKind;
  /** Full signature as it appears in the source. */
  signature: string;
  /** JSDoc comment if present, without the comment delimiters. */
  jsdoc?: string;
}

/** Documentation entry for a single file/module. */
export interface DocEntry {
  /** Absolute or relative file path. */
  filePath: string;
  /** Module name derived from the file name. */
  moduleName: string;
  /** Module description (first JSDoc block or header comment). */
  description: string;
  /** All exported symbols with their documentation. */
  exports: ExportDoc[];
  /** Modules this file imports from. */
  dependencies: string[];
}

/** Collection of documentation entries with a table of contents. */
export interface ModuleDocs {
  /** All documented modules. */
  entries: DocEntry[];
  /** Markdown table of contents. */
  tableOfContents: string;
}

// --- Parsing ---

/**
 * Extract the module name from a file path.
 *
 * @param filePath - File path to extract from.
 * @returns Module name without extension.
 */
function extractModuleName(filePath: string): string {
  const normalised = filePath.replace(/\\/g, '/');
  const fileName = normalised.split('/').pop() || filePath;
  return fileName.replace(/\.(ts|js|tsx|jsx)$/, '');
}

/**
 * Extract the file-level description from the first block comment.
 *
 * @param content - Source file content.
 * @returns Description text, or empty string if none found.
 */
function extractFileDescription(content: string): string {
  const blockCommentMatch = content.match(/^\/\*\*?\s*\n([\s\S]*?)\*\//);
  if (!blockCommentMatch) return '';

  const lines = blockCommentMatch[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line.length > 0);

  return lines.join(' ');
}

/**
 * Extract JSDoc comment immediately preceding a given line index.
 *
 * @param lines - All lines of the source file.
 * @param exportLineIndex - Line index of the export statement.
 * @returns JSDoc content without delimiters, or undefined.
 */
function extractPrecedingJsdoc(lines: string[], exportLineIndex: number): string | undefined {
  // Walk backwards to find a closing */
  let endIndex = -1;
  for (let i = exportLineIndex - 1; i >= 0; i--) {
    const trimmed = lines[i].trim();
    if (trimmed === '' || trimmed === '//') continue;
    if (trimmed.endsWith('*/')) {
      endIndex = i;
      break;
    }
    break;
  }

  if (endIndex === -1) return undefined;

  // Walk backwards to find the opening /**
  let startIndex = endIndex;
  for (let i = endIndex; i >= 0; i--) {
    if (lines[i].trim().startsWith('/**') || lines[i].trim().startsWith('/*')) {
      startIndex = i;
      break;
    }
  }

  const jsdocLines = lines
    .slice(startIndex, endIndex + 1)
    .map((line) => line.replace(/^\s*\/?\*\*?\s?/, '').replace(/\s*\*\/\s*$/, '').trim())
    .filter((line) => line.length > 0);

  return jsdocLines.length > 0 ? jsdocLines.join('\n') : undefined;
}

/**
 * Extract all dependencies (import sources) from file content.
 *
 * @param content - Source file content.
 * @returns Array of import source strings.
 */
function extractDependencies(content: string): string[] {
  const deps: string[] = [];
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    deps.push(match[1]);
  }

  return [...new Set(deps)];
}

/**
 * Parse a source file and extract documentation for all exports.
 *
 * Detects: exported functions, interfaces, types, and constants.
 * Extracts JSDoc comments preceding each export.
 *
 * @param filePath - Path of the file.
 * @param content - Source file content.
 * @returns Documentation entry for the file.
 */
export function parseFileForDocs(filePath: string, content: string): DocEntry {
  const moduleName = extractModuleName(filePath);
  const description = extractFileDescription(content);
  const dependencies = extractDependencies(content);
  const exports: ExportDoc[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Exported function
    const funcMatch = trimmed.match(
      /^export\s+(?:async\s+)?function\s+(\w+)\s*(<[^>]*>)?\s*\(([^)]*)\)(?:\s*:\s*(.+?))?(?:\s*\{|$)/,
    );
    if (funcMatch) {
      const name = funcMatch[1];
      const generics = funcMatch[2] || '';
      const params = funcMatch[3] || '';
      const returnType = funcMatch[4] || 'void';
      const signature = `function ${name}${generics}(${params.trim()}): ${returnType.trim()}`;
      const jsdoc = extractPrecedingJsdoc(lines, i);
      exports.push({ name, type: 'function', signature, jsdoc });
      continue;
    }

    // Exported interface
    const ifaceMatch = trimmed.match(/^export\s+interface\s+(\w+)(?:\s*<[^>]*>)?\s*(?:extends\s+[^{]+)?\{?/);
    if (ifaceMatch) {
      const name = ifaceMatch[1];
      // Collect full interface body for signature
      let body = trimmed;
      if (!trimmed.includes('}')) {
        let braceCount = (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
        for (let j = i + 1; j < lines.length && braceCount > 0; j++) {
          body += '\n' + lines[j];
          braceCount += (lines[j].match(/\{/g) || []).length;
          braceCount -= (lines[j].match(/\}/g) || []).length;
        }
      }
      const jsdoc = extractPrecedingJsdoc(lines, i);
      exports.push({ name, type: 'interface', signature: body, jsdoc });
      continue;
    }

    // Exported type alias
    const typeMatch = trimmed.match(/^export\s+type\s+(\w+)(?:\s*<[^>]*>)?\s*=\s*(.*)/);
    if (typeMatch) {
      const name = typeMatch[1];
      // Collect multi-line type
      let typeDef = trimmed;
      if (!trimmed.endsWith(';')) {
        for (let j = i + 1; j < lines.length; j++) {
          typeDef += ' ' + lines[j].trim();
          if (lines[j].trim().endsWith(';')) break;
        }
      }
      const jsdoc = extractPrecedingJsdoc(lines, i);
      exports.push({ name, type: 'type', signature: typeDef, jsdoc });
      continue;
    }

    // Exported const
    const constMatch = trimmed.match(/^export\s+const\s+(\w+)(?:\s*:\s*([^=]+))?\s*=/);
    if (constMatch) {
      const name = constMatch[1];
      const typeAnnotation = constMatch[2] ? constMatch[2].trim() : 'inferred';
      const signature = `const ${name}: ${typeAnnotation}`;
      const jsdoc = extractPrecedingJsdoc(lines, i);
      exports.push({ name, type: 'const', signature, jsdoc });
      continue;
    }
  }

  return { filePath, moduleName, description, exports, dependencies };
}

/**
 * Generate a README-style markdown document for a set of module entries.
 *
 * Includes: module overview, API reference with all exports and types,
 * dependency list, and usage examples placeholder.
 *
 * @param entries - Array of documentation entries.
 * @returns Markdown string.
 */
export function generateModuleReadme(entries: DocEntry[]): string {
  const lines: string[] = [];

  lines.push('# VitalMatrix Module Documentation');
  lines.push('');
  lines.push(`**${VM_BRAND.platform.descriptor}** -- ${VM_BRAND.credentials.company}`);
  lines.push('');

  // Table of contents
  lines.push('## Table of Contents');
  lines.push('');
  for (const entry of entries) {
    lines.push(`- [${entry.moduleName}](#${entry.moduleName.replace(/[^a-z0-9-]/g, '-')})`);
  }
  lines.push('');

  // Module sections
  for (const entry of entries) {
    lines.push(`## ${entry.moduleName}`);
    lines.push('');
    lines.push(`**File:** \`${entry.filePath}\``);
    lines.push('');

    if (entry.description) {
      lines.push(entry.description);
      lines.push('');
    }

    // API Reference
    if (entry.exports.length > 0) {
      lines.push('### API Reference');
      lines.push('');

      // Group by type
      const grouped = groupExportsByType(entry.exports);

      for (const [kind, exps] of Object.entries(grouped)) {
        if (exps.length === 0) continue;
        lines.push(`#### ${capitalise(kind)}s`);
        lines.push('');

        for (const exp of exps) {
          lines.push(`**\`${exp.name}\`**`);
          lines.push('');
          if (exp.jsdoc) {
            lines.push(`> ${exp.jsdoc.split('\n')[0]}`);
            lines.push('');
          }
          lines.push('```typescript');
          lines.push(exp.signature);
          lines.push('```');
          lines.push('');
        }
      }
    }

    // Dependencies
    if (entry.dependencies.length > 0) {
      lines.push('### Dependencies');
      lines.push('');
      for (const dep of entry.dependencies) {
        lines.push(`- \`${dep}\``);
      }
      lines.push('');
    }

    // Usage placeholder
    lines.push('### Usage');
    lines.push('');
    lines.push('```typescript');
    const importables = entry.exports
      .filter((e) => e.type === 'function' || e.type === 'const')
      .map((e) => e.name)
      .slice(0, 3);
    if (importables.length > 0) {
      lines.push(`import { ${importables.join(', ')} } from './${entry.moduleName}';`);
    } else {
      lines.push(`import { /* exports */ } from './${entry.moduleName}';`);
    }
    lines.push('');
    lines.push('// Usage examples to be added');
    lines.push('```');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}

/**
 * Generate a detailed API reference document for all entries.
 *
 * @param entries - Array of documentation entries.
 * @returns Markdown-formatted API reference.
 */
export function generateApiReference(entries: DocEntry[]): string {
  const lines: string[] = [];

  lines.push('# API Reference');
  lines.push('');
  lines.push(`**${VM_BRAND.platform.descriptor}** -- ${VM_BRAND.credentials.company}`);
  lines.push('');

  let totalExports = 0;
  const typeCount: Record<string, number> = {};

  for (const entry of entries) {
    for (const exp of entry.exports) {
      totalExports++;
      typeCount[exp.type] = (typeCount[exp.type] || 0) + 1;
    }
  }

  lines.push('## Overview');
  lines.push('');
  lines.push(`- **Modules:** ${entries.length}`);
  lines.push(`- **Total exports:** ${totalExports}`);
  for (const [type, count] of Object.entries(typeCount)) {
    lines.push(`- ${capitalise(type)}s: ${count}`);
  }
  lines.push('');

  for (const entry of entries) {
    lines.push(`## ${entry.moduleName}`);
    lines.push('');
    lines.push(`\`${entry.filePath}\``);
    lines.push('');

    if (entry.description) {
      lines.push(entry.description);
      lines.push('');
    }

    for (const exp of entry.exports) {
      lines.push(`### ${exp.name}`);
      lines.push('');
      lines.push(`- **Type:** ${exp.type}`);
      lines.push(`- **Module:** ${entry.moduleName}`);
      lines.push('');

      if (exp.jsdoc) {
        for (const jsdocLine of exp.jsdoc.split('\n')) {
          if (jsdocLine.startsWith('@param')) {
            const paramMatch = jsdocLine.match(/@param\s+(\w+)\s*-?\s*(.*)/);
            if (paramMatch) {
              lines.push(`- **@param** \`${paramMatch[1]}\` -- ${paramMatch[2]}`);
            }
          } else if (jsdocLine.startsWith('@returns')) {
            lines.push(`- **@returns** ${jsdocLine.replace('@returns', '').trim()}`);
          } else {
            lines.push(jsdocLine);
          }
        }
        lines.push('');
      }

      lines.push('```typescript');
      lines.push(exp.signature);
      lines.push('```');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}

/**
 * Generate a text-based dependency diagram showing how modules
 * relate to each other.
 *
 * @param entries - Array of documentation entries.
 * @returns Text-based diagram string.
 */
export function generateArchitectureDiagram(entries: DocEntry[]): string {
  const lines: string[] = [];

  lines.push('# Module Dependency Diagram');
  lines.push('');
  lines.push(`**${VM_BRAND.platform.descriptor}** -- ${VM_BRAND.credentials.company}`);
  lines.push('');
  lines.push('```');

  // Build adjacency
  const moduleNames = new Set(entries.map((e) => e.moduleName));
  const depMap = new Map<string, string[]>();

  for (const entry of entries) {
    const internalDeps = entry.dependencies
      .map((d) => {
        const parts = d.replace(/\\/g, '/').split('/');
        return parts[parts.length - 1].replace(/\.(ts|js)$/, '');
      })
      .filter((d) => moduleNames.has(d));

    depMap.set(entry.moduleName, internalDeps);
  }

  // Render as text tree
  for (const entry of entries) {
    const deps = depMap.get(entry.moduleName) || [];
    const exportCount = entry.exports.length;

    lines.push(`[${entry.moduleName}] (${exportCount} exports)`);

    for (let i = 0; i < deps.length; i++) {
      const isLast = i === deps.length - 1;
      const connector = isLast ? '\\-- ' : '|-- ';
      lines.push(`  ${connector}depends on -> [${deps[i]}]`);
    }

    // Show reverse dependencies (what depends on this module)
    const dependents: string[] = [];
    for (const [mod, modDeps] of depMap) {
      if (modDeps.includes(entry.moduleName)) {
        dependents.push(mod);
      }
    }

    if (dependents.length > 0) {
      lines.push(`  <- depended on by: ${dependents.join(', ')}`);
    }

    lines.push('');
  }

  lines.push('```');
  lines.push('');
  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}

// --- Helpers ---

/**
 * Group exports by their type.
 *
 * @param exports - Array of export docs.
 * @returns Record keyed by export kind.
 */
function groupExportsByType(exports: ExportDoc[]): Record<ExportKind, ExportDoc[]> {
  const grouped: Record<ExportKind, ExportDoc[]> = {
    function: [],
    interface: [],
    type: [],
    const: [],
  };

  for (const exp of exports) {
    grouped[exp.type].push(exp);
  }

  return grouped;
}

/**
 * Capitalise the first letter of a string.
 *
 * @param s - Input string.
 * @returns Capitalised string.
 */
function capitalise(s: string): string {
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
