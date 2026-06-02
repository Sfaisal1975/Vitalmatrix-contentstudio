/**
 * Component 20D: Migration Generator
 *
 * Generates PostgreSQL migration scripts from TypeScript interfaces.
 * Maps TypeScript types to PostgreSQL column types and produces
 * versioned UP/DOWN migration scripts with the vm_ table prefix.
 *
 * Designed for the VitalMatrix data layer — all tables are prefixed
 * with vm_ (e.g. vm_clinical_citations, vm_patient_terrain).
 *
 * @module c20d-migration-generator
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A single column definition for a database table. */
export interface ColumnDef {
  /** Column name (snake_case) */
  name: string;
  /** Original TypeScript type */
  tsType: string;
  /** Mapped PostgreSQL type */
  pgType: string;
  /** Whether the column allows NULL values */
  nullable: boolean;
  /** Default value expression (SQL), or undefined */
  defaultValue?: string;
}

/** A complete versioned migration script with UP and DOWN SQL. */
export interface MigrationScript {
  /** Version identifier, e.g. "001", "002" */
  version: string;
  /** Human-readable description of the migration */
  description: string;
  /** SQL to apply the migration (CREATE, ALTER, etc.) */
  up: string;
  /** SQL to reverse the migration (DROP, etc.) */
  down: string;
}

// --- Constants ---

/** Table name prefix for all VitalMatrix tables. */
const TABLE_PREFIX = 'vm_';

/**
 * TypeScript-to-PostgreSQL type mapping.
 * Keys are normalised (lowercased, trimmed) TypeScript type strings.
 */
const TYPE_MAP: Record<string, string> = {
  'string': 'TEXT',
  'number': 'INTEGER',
  'boolean': 'BOOLEAN',
  'date': 'TIMESTAMP',
  'bigint': 'BIGINT',
  'string[]': 'TEXT[]',
  'number[]': 'INTEGER[]',
  'boolean[]': 'BOOLEAN[]',
  'date[]': 'TIMESTAMP[]',
  'record<string, string>': 'JSONB',
  'record<string, number>': 'JSONB',
  'record<string, any>': 'JSONB',
  'record<string, unknown>': 'JSONB',
  'object': 'JSONB',
  'any': 'JSONB',
  'unknown': 'JSONB',
  'json': 'JSONB',
  'buffer': 'BYTEA',
  'uuid': 'UUID',
  'float': 'DOUBLE PRECISION',
  'double': 'DOUBLE PRECISION',
  'decimal': 'NUMERIC',
};

// --- Core Functions ---

/**
 * Maps a TypeScript type string to its PostgreSQL equivalent.
 *
 * Handles primitives (string, number, boolean, Date), arrays (string[],
 * number[]), Record types (mapped to JSONB), and falls back to JSONB
 * for unrecognised complex types.
 *
 * @param tsType - The TypeScript type string.
 * @returns The corresponding PostgreSQL type string.
 */
export function tsTypeToPgType(tsType: string): string {
  const normalised = tsType.trim().toLowerCase();

  // Direct match
  if (TYPE_MAP[normalised]) {
    return TYPE_MAP[normalised];
  }

  // Optional types (e.g. "string | undefined", "number | null")
  const withoutOptional = normalised
    .replace(/\s*\|\s*undefined/g, '')
    .replace(/\s*\|\s*null/g, '')
    .trim();

  if (TYPE_MAP[withoutOptional]) {
    return TYPE_MAP[withoutOptional];
  }

  // Array types with generic syntax: Array<string>
  const arrayGeneric = normalised.match(/^array<(.+)>$/);
  if (arrayGeneric) {
    const innerType = tsTypeToPgType(arrayGeneric[1]);
    return `${innerType}[]`;
  }

  // Record/Map types -> JSONB
  if (normalised.startsWith('record<') || normalised.startsWith('map<')) {
    return 'JSONB';
  }

  // Enum-like union of string literals -> TEXT
  if (normalised.includes("'") || normalised.includes('"')) {
    return 'TEXT';
  }

  // Tuple types -> JSONB
  if (normalised.startsWith('[')) {
    return 'JSONB';
  }

  // Fallback for complex/custom types
  return 'JSONB';
}

/**
 * Parses a TypeScript interface definition and extracts column
 * definitions with name, type, nullability, and default values.
 *
 * Handles optional fields (marked with ?), JSDoc @default annotations,
 * and union types that include null/undefined.
 *
 * @param interfaceCode - The TypeScript interface source code string.
 * @returns Array of ColumnDef objects.
 */
export function parseInterfaceToColumns(interfaceCode: string): ColumnDef[] {
  const columns: ColumnDef[] = [];

  // Extract the body of the interface (between { and })
  const bodyMatch = interfaceCode.match(/\{([\s\S]*)\}/);
  if (!bodyMatch) return columns;

  const body = bodyMatch[1];

  // Match each field line: name?: type; or name: type;
  // Also capture preceding JSDoc comment for @default
  const fieldPattern = /(?:\/\*\*[\s\S]*?\*\/\s*)?(?:\/\/[^\n]*\n\s*)?(\w+)(\??)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;

  while ((match = fieldPattern.exec(body)) !== null) {
    const fieldName = match[1];
    const optional = match[2] === '?';
    const rawType = match[3].trim();

    // Convert camelCase field name to snake_case for SQL
    const columnName = camelToSnake(fieldName);

    // Determine nullability
    const isNullable = optional || rawType.includes('| null') || rawType.includes('| undefined');

    // Clean up the type for mapping
    const cleanType = rawType
      .replace(/\s*\|\s*undefined/g, '')
      .replace(/\s*\|\s*null/g, '')
      .trim();

    const pgType = tsTypeToPgType(cleanType);

    // Look for @default in preceding JSDoc
    const precedingText = body.slice(0, match.index);
    const lastComment = precedingText.match(/\/\*\*[\s\S]*?\*\/\s*$/);
    let defaultValue: string | undefined;

    if (lastComment) {
      const defaultMatch = lastComment[0].match(/@default\s+(.+)/);
      if (defaultMatch) {
        defaultValue = tsDefaultToPgDefault(defaultMatch[1].trim(), pgType);
      }
    }

    columns.push({
      name: columnName,
      tsType: rawType,
      pgType,
      nullable: isNullable,
      defaultValue,
    });
  }

  return columns;
}

/**
 * Generates a CREATE TABLE SQL statement from a table name and columns.
 * Always applies the vm_ prefix. Includes an auto-generated id column,
 * created_at and updated_at timestamps.
 *
 * @param tableName - The table name (without vm_ prefix — it will be added).
 * @param columns - Array of ColumnDef objects.
 * @returns SQL CREATE TABLE statement string.
 */
export function generateCreateTable(tableName: string, columns: ColumnDef[]): string {
  const fullName = ensurePrefix(tableName);
  const lines: string[] = [];

  lines.push(`CREATE TABLE ${fullName} (`);

  // Primary key
  lines.push(`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`);

  // User-defined columns
  for (const col of columns) {
    const parts: string[] = [`  ${col.name}`, col.pgType];

    if (!col.nullable) {
      parts.push('NOT NULL');
    }

    if (col.defaultValue !== undefined) {
      parts.push(`DEFAULT ${col.defaultValue}`);
    }

    lines.push(`${parts.join(' ')},`);
  }

  // Timestamps
  lines.push(`  created_at TIMESTAMP NOT NULL DEFAULT NOW(),`);
  lines.push(`  updated_at TIMESTAMP NOT NULL DEFAULT NOW()`);

  lines.push(`);`);
  lines.push('');

  // Updated_at trigger
  lines.push(`-- Auto-update updated_at on row modification`);
  lines.push(`CREATE OR REPLACE FUNCTION update_${fullName}_updated_at()`);
  lines.push(`RETURNS TRIGGER AS $$`);
  lines.push(`BEGIN`);
  lines.push(`  NEW.updated_at = NOW();`);
  lines.push(`  RETURN NEW;`);
  lines.push(`END;`);
  lines.push(`$$ LANGUAGE plpgsql;`);
  lines.push('');
  lines.push(`CREATE TRIGGER trg_${fullName}_updated_at`);
  lines.push(`  BEFORE UPDATE ON ${fullName}`);
  lines.push(`  FOR EACH ROW`);
  lines.push(`  EXECUTE FUNCTION update_${fullName}_updated_at();`);

  return lines.join('\n');
}

/**
 * Generates a complete versioned migration with UP and DOWN scripts
 * from a TypeScript interface definition.
 *
 * The UP script creates the table (with vm_ prefix, UUID primary key,
 * timestamps, and update trigger). The DOWN script drops the table
 * and its trigger function.
 *
 * @param version - Version string, e.g. "001".
 * @param description - Human-readable description of the migration.
 * @param interfaceCode - TypeScript interface source code to parse.
 * @param tableName - Table name (vm_ prefix added automatically if missing).
 * @returns MigrationScript with version, description, up, and down SQL.
 */
export function generateMigration(
  version: string,
  description: string,
  interfaceCode: string,
  tableName: string,
): MigrationScript {
  const columns = parseInterfaceToColumns(interfaceCode);
  const fullName = ensurePrefix(tableName);

  // Generate UP script
  const upLines: string[] = [];
  upLines.push(`-- Migration: ${version}`);
  upLines.push(`-- Description: ${description}`);
  upLines.push(`-- Generated by ${VM_BRAND.credentials.company} Content Studio`);
  upLines.push(`-- ${VM_BRAND.regulatoryFooter}`);
  upLines.push('');
  upLines.push(`BEGIN;`);
  upLines.push('');
  upLines.push(generateCreateTable(tableName, columns));
  upLines.push('');

  // Add indexes for common column patterns
  const indexableColumns = columns.filter((col) =>
    col.name.endsWith('_id') ||
    col.name === 'status' ||
    col.name === 'type' ||
    col.name === 'node_id' ||
    col.name === 'zone_id' ||
    col.name === 'feature_id',
  );

  for (const col of indexableColumns) {
    upLines.push(`CREATE INDEX idx_${fullName}_${col.name} ON ${fullName} (${col.name});`);
  }

  if (indexableColumns.length > 0) {
    upLines.push('');
  }

  // Add comment on table
  upLines.push(`COMMENT ON TABLE ${fullName} IS '${description.replace(/'/g, "''")}';`);
  upLines.push('');
  upLines.push(`COMMIT;`);

  // Generate DOWN script
  const downLines: string[] = [];
  downLines.push(`-- Rollback migration: ${version}`);
  downLines.push(`-- Description: ${description}`);
  downLines.push('');
  downLines.push(`BEGIN;`);
  downLines.push('');
  downLines.push(`DROP TRIGGER IF EXISTS trg_${fullName}_updated_at ON ${fullName};`);
  downLines.push(`DROP FUNCTION IF EXISTS update_${fullName}_updated_at();`);
  downLines.push(`DROP TABLE IF EXISTS ${fullName} CASCADE;`);
  downLines.push('');
  downLines.push(`COMMIT;`);

  return {
    version,
    description,
    up: upLines.join('\n'),
    down: downLines.join('\n'),
  };
}

/**
 * Formats a MigrationScript into a single string suitable for
 * writing to a .sql file. Includes both UP and DOWN sections
 * separated by a clear delimiter.
 *
 * @param migration - The MigrationScript to format.
 * @returns Formatted SQL string with both UP and DOWN sections.
 */
export function formatMigrationFile(migration: MigrationScript): string {
  const lines: string[] = [];

  lines.push(`-- =============================================`);
  lines.push(`-- Migration ${migration.version}: ${migration.description}`);
  lines.push(`-- =============================================`);
  lines.push('');
  lines.push(`-- ========== UP ==========`);
  lines.push('');
  lines.push(migration.up);
  lines.push('');
  lines.push(`-- ========== DOWN ==========`);
  lines.push('');
  lines.push(migration.down);
  lines.push('');

  return lines.join('\n');
}

// --- Internal Helpers ---

/**
 * Converts a camelCase string to snake_case for SQL column naming.
 */
function camelToSnake(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Ensures the table name has the vm_ prefix.
 */
function ensurePrefix(tableName: string): string {
  const name = tableName.trim().toLowerCase();
  if (name.startsWith(TABLE_PREFIX)) return name;
  return `${TABLE_PREFIX}${name}`;
}

/**
 * Converts a TypeScript default value to a PostgreSQL default expression.
 */
function tsDefaultToPgDefault(tsDefault: string, pgType: string): string {
  // Boolean
  if (tsDefault === 'true' || tsDefault === 'false') {
    return tsDefault.toUpperCase();
  }

  // Number
  if (/^\d+(\.\d+)?$/.test(tsDefault)) {
    return tsDefault;
  }

  // String literal
  if (tsDefault.startsWith("'") || tsDefault.startsWith('"')) {
    const inner = tsDefault.slice(1, -1);
    return `'${inner.replace(/'/g, "''")}'`;
  }

  // null
  if (tsDefault === 'null') {
    return 'NULL';
  }

  // Empty array
  if (tsDefault === '[]') {
    if (pgType.endsWith('[]')) return "'{}'";
    return "'[]'::JSONB";
  }

  // Empty object
  if (tsDefault === '{}') {
    return "'{}'::JSONB";
  }

  // new Date()
  if (tsDefault === 'new Date()' || tsDefault === 'Date.now()') {
    return 'NOW()';
  }

  // Fallback — wrap as string
  return `'${tsDefault.replace(/'/g, "''")}'`;
}
