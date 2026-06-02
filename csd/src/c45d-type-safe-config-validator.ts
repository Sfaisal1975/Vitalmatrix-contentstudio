/**
 * Component 45D: Type-Safe Config Validator
 * DEV PACKAGE — Internal tooling only
 *
 * Validates configuration objects against expected schemas at runtime.
 * Prevents silent config errors that could propagate through the pipeline.
 *
 * Pre-built schemas for: brand-config pricing, audience targeting,
 * zone score maps, node score maps, and pipeline order (D-233b).
 *
 * @module c45d-type-safe-config-validator
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Supported field types for validation. */
export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum';

/** A single validation rule for a configuration field. */
export interface ValidationRule {
  /** Dot-notation path to the field (e.g. 'pricing.currency'). */
  field: string;
  /** Expected type of the field value. */
  type: FieldType;
  /** Whether the field must be present. */
  required: boolean;
  /** Allowed values when type is 'enum'. */
  enumValues?: string[];
  /** Minimum value for numbers, minimum length for strings/arrays. */
  min?: number;
  /** Maximum value for numbers, maximum length for strings/arrays. */
  max?: number;
  /** Regular expression pattern the value must match (strings only). */
  pattern?: RegExp;
}

/** A named collection of validation rules forming a schema. */
export interface ConfigSchema {
  /** Human-readable schema name. */
  name: string;
  /** Ordered list of validation rules. */
  rules: ValidationRule[];
}

/** Result of running validation against a schema. */
export interface ValidationResult {
  /** Whether all rules passed without errors. */
  valid: boolean;
  /** List of error messages (rule failures). */
  errors: string[];
  /** List of warning messages (non-blocking observations). */
  warnings: string[];
}

// --- Canonical Pipeline Order (D-233b locked) ---

/** The locked pipeline order per D-233b. */
const CANONICAL_PIPELINE: readonly string[] = [
  'FLINT', 'APEX', 'STRIDE', 'RIL', 'CADENCE', 'CIL', 'VISTA',
] as const;

// --- Pre-built Schemas ---

/** Schema for brand-config pricing section. */
export const PRICING_SCHEMA: ConfigSchema = {
  name: 'Brand Config — Pricing',
  rules: [
    { field: 'foundingMonthly', type: 'number', required: true, min: 1 },
    { field: 'foundingFixedMonths', type: 'number', required: true, min: 1 },
    { field: 'standardRate', type: 'number', required: true, min: 1 },
    { field: 'currency', type: 'enum', required: true, enumValues: ['GBP'] },
    { field: 'guarantee', type: 'string', required: true },
  ],
};

/** Schema for audience targeting configuration. */
export const AUDIENCE_SCHEMA: ConfigSchema = {
  name: 'Brand Config — Audience Targeting',
  rules: [
    { field: 'geography', type: 'enum', required: true, enumValues: ['England'] },
    { field: 'excluded', type: 'array', required: true, min: 4 },
    { field: 'professions', type: 'array', required: true, min: 1 },
    { field: 'qualifier', type: 'string', required: true },
    { field: 'channels', type: 'array', required: true, min: 1 },
    { field: 'regulatory', type: 'enum', required: true, enumValues: ['MHRA'] },
  ],
};

/** Schema for zone score maps (Z1-Z5, values 0-100). */
export const ZONE_SCORE_SCHEMA: ConfigSchema = {
  name: 'Zone Score Map (Z1-Z5)',
  rules: [
    { field: 'Z1', type: 'number', required: true, min: 0, max: 100 },
    { field: 'Z2', type: 'number', required: true, min: 0, max: 100 },
    { field: 'Z3', type: 'number', required: true, min: 0, max: 100 },
    { field: 'Z4', type: 'number', required: true, min: 0, max: 100 },
    { field: 'Z5', type: 'number', required: true, min: 0, max: 100 },
  ],
};

/** Schema for node score maps (N1-N7, values 0-100). */
export const NODE_SCORE_SCHEMA: ConfigSchema = {
  name: 'Node Score Map (N1-N7)',
  rules: [
    { field: 'N1', type: 'number', required: true, min: 0, max: 100 },
    { field: 'N2', type: 'number', required: true, min: 0, max: 100 },
    { field: 'N3', type: 'number', required: true, min: 0, max: 100 },
    { field: 'N4', type: 'number', required: true, min: 0, max: 100 },
    { field: 'N5', type: 'number', required: true, min: 0, max: 100 },
    { field: 'N6', type: 'number', required: true, min: 0, max: 100 },
    { field: 'N7', type: 'number', required: true, min: 0, max: 100 },
  ],
};

/** Schema for pipeline order validation (D-233b). */
export const PIPELINE_SCHEMA: ConfigSchema = {
  name: 'Pipeline Order (D-233b)',
  rules: CANONICAL_PIPELINE.map((stage, i) => ({
    field: String(i),
    type: 'enum' as FieldType,
    required: true,
    enumValues: [stage],
  })),
};

// --- Helper: resolve dot-notation field ---

/**
 * Resolves a dot-notation path against an object.
 *
 * @param obj - The object to resolve against.
 * @param path - Dot-notation path (e.g. 'pricing.currency').
 * @returns The resolved value, or undefined if not found.
 */
function resolveField(obj: unknown, path: string): unknown {
  if (obj === null || obj === undefined) return undefined;
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

// --- Core Validation ---

/**
 * Validates a data object against a configuration schema.
 *
 * @param data - The configuration data to validate (unknown type for safety).
 * @param schema - The schema to validate against.
 * @returns Validation result with errors and warnings.
 */
export function validateConfig(data: unknown, schema: ConfigSchema): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (data === null || data === undefined) {
    return { valid: false, errors: [`[${schema.name}] Data is null or undefined.`], warnings };
  }

  if (typeof data !== 'object') {
    return { valid: false, errors: [`[${schema.name}] Data must be an object, got ${typeof data}.`], warnings };
  }

  for (const rule of schema.rules) {
    const value = resolveField(data, rule.field);
    const prefix = `[${schema.name}] Field '${rule.field}'`;

    // Required check
    if (value === undefined || value === null) {
      if (rule.required) {
        errors.push(`${prefix}: required but missing.`);
      }
      continue;
    }

    // Type checks
    switch (rule.type) {
      case 'string': {
        if (typeof value !== 'string') {
          errors.push(`${prefix}: expected string, got ${typeof value}.`);
          continue;
        }
        if (rule.min !== undefined && value.length < rule.min) {
          errors.push(`${prefix}: string length ${value.length} below minimum ${rule.min}.`);
        }
        if (rule.max !== undefined && value.length > rule.max) {
          errors.push(`${prefix}: string length ${value.length} exceeds maximum ${rule.max}.`);
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${prefix}: does not match required pattern ${rule.pattern}.`);
        }
        break;
      }

      case 'number': {
        if (typeof value !== 'number' || Number.isNaN(value)) {
          errors.push(`${prefix}: expected number, got ${typeof value}.`);
          continue;
        }
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`${prefix}: value ${value} below minimum ${rule.min}.`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`${prefix}: value ${value} exceeds maximum ${rule.max}.`);
        }
        break;
      }

      case 'boolean': {
        if (typeof value !== 'boolean') {
          errors.push(`${prefix}: expected boolean, got ${typeof value}.`);
        }
        break;
      }

      case 'array': {
        if (!Array.isArray(value)) {
          errors.push(`${prefix}: expected array, got ${typeof value}.`);
          continue;
        }
        if (rule.min !== undefined && value.length < rule.min) {
          errors.push(`${prefix}: array length ${value.length} below minimum ${rule.min}.`);
        }
        if (rule.max !== undefined && value.length > rule.max) {
          errors.push(`${prefix}: array length ${value.length} exceeds maximum ${rule.max}.`);
        }
        break;
      }

      case 'object': {
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push(`${prefix}: expected object, got ${Array.isArray(value) ? 'array' : typeof value}.`);
        }
        break;
      }

      case 'enum': {
        if (!rule.enumValues || rule.enumValues.length === 0) {
          warnings.push(`${prefix}: enum rule has no enumValues defined.`);
          continue;
        }
        const strValue = String(value);
        if (!rule.enumValues.includes(strValue)) {
          errors.push(`${prefix}: value '${strValue}' not in allowed values [${rule.enumValues.join(', ')}].`);
        }
        break;
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// --- Specialised Validators ---

/**
 * Validates the full brand-config object against all known sections.
 *
 * @param config - The brand configuration object.
 * @returns Validation result covering pricing, audience, platform fields.
 */
export function validateBrandConfig(config: unknown): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  if (config === null || config === undefined || typeof config !== 'object') {
    return { valid: false, errors: ['Brand config is null, undefined, or not an object.'], warnings: [] };
  }

  const obj = config as Record<string, unknown>;

  // Validate pricing
  const pricingResult = validateConfig(obj.pricing, PRICING_SCHEMA);
  allErrors.push(...pricingResult.errors);
  allWarnings.push(...pricingResult.warnings);

  // Validate audience
  const audienceResult = validateConfig(obj.targetAudience, AUDIENCE_SCHEMA);
  allErrors.push(...audienceResult.errors);
  allWarnings.push(...audienceResult.warnings);

  // Validate excluded regions contain required entries
  if (obj.targetAudience && typeof obj.targetAudience === 'object') {
    const audience = obj.targetAudience as Record<string, unknown>;
    if (Array.isArray(audience.excluded)) {
      const excluded = audience.excluded as string[];
      const required = ['Scotland', 'Wales', 'Northern Ireland'];
      for (const region of required) {
        if (!excluded.includes(region)) {
          allErrors.push(`[Audience] Excluded regions must contain '${region}'.`);
        }
      }
    }
  }

  // Validate credentials
  if (obj.credentials && typeof obj.credentials === 'object') {
    const creds = obj.credentials as Record<string, unknown>;
    if (typeof creds.qualifications === 'string') {
      if (creds.qualifications !== 'MBBS, FAAMFM') {
        allErrors.push(`[Credentials] Qualifications must be 'MBBS, FAAMFM', got '${creds.qualifications}'. (K7 kill list)`);
      }
    }
  }

  // Validate platform descriptor
  if (obj.platform && typeof obj.platform === 'object') {
    const platform = obj.platform as Record<string, unknown>;
    if (typeof platform.descriptor === 'string') {
      if (platform.descriptor !== 'terrain intelligence platform') {
        allErrors.push(`[Platform] Descriptor must be 'terrain intelligence platform' (D-210), got '${platform.descriptor}'.`);
      }
    }
  }

  return { valid: allErrors.length === 0, errors: allErrors, warnings: allWarnings };
}

/**
 * Validates zone scores (Z1-Z5) are numbers within 0-100.
 *
 * @param scores - Object with Z1-Z5 keys and numeric values.
 * @returns Validation result.
 */
export function validateZoneScores(scores: unknown): ValidationResult {
  return validateConfig(scores, ZONE_SCORE_SCHEMA);
}

/**
 * Validates node scores (N1-N7) are numbers within 0-100.
 *
 * @param scores - Object with N1-N7 keys and numeric values.
 * @returns Validation result.
 */
export function validateNodeScores(scores: unknown): ValidationResult {
  return validateConfig(scores, NODE_SCORE_SCHEMA);
}

/**
 * Validates that a pipeline stage array matches the canonical order
 * locked by D-233b: FLINT > APEX > STRIDE > RIL > CADENCE > CIL > VISTA.
 *
 * @param stages - Array of pipeline stage names.
 * @returns Validation result.
 */
export function validatePipelineOrder(stages: string[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(stages)) {
    return { valid: false, errors: ['Pipeline stages must be an array.'], warnings };
  }

  if (stages.length !== CANONICAL_PIPELINE.length) {
    errors.push(
      `Pipeline must have exactly ${CANONICAL_PIPELINE.length} stages, got ${stages.length}. ` +
      `Expected: ${CANONICAL_PIPELINE.join(' > ')}.`,
    );
  }

  const minLen = Math.min(stages.length, CANONICAL_PIPELINE.length);
  for (let i = 0; i < minLen; i++) {
    if (stages[i] !== CANONICAL_PIPELINE[i]) {
      errors.push(
        `Pipeline stage ${i + 1}: expected '${CANONICAL_PIPELINE[i]}', got '${stages[i]}'. ` +
        `D-233b order is locked.`,
      );
    }
  }

  // Check for unknown stages
  for (const stage of stages) {
    if (!CANONICAL_PIPELINE.includes(stage)) {
      errors.push(`Unknown pipeline stage '${stage}'. Valid stages: ${CANONICAL_PIPELINE.join(', ')}.`);
    }
  }

  // Check for duplicates
  const seen = new Set<string>();
  for (const stage of stages) {
    if (seen.has(stage)) {
      errors.push(`Duplicate pipeline stage '${stage}'.`);
    }
    seen.add(stage);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Generates a markdown validation report from multiple validation results.
 *
 * @param results - Array of validation results to include in the report.
 * @returns Markdown-formatted report.
 */
export function generateValidationReport(results: ValidationResult[]): string {
  const lines: string[] = [
    `# ${VM_BRAND.credentials.company} — Configuration Validation Report`,
    `> ${VM_BRAND.platform.descriptor}`,
    '',
  ];

  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const allValid = results.every((r) => r.valid);

  lines.push(`## Summary`);
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Schemas validated | ${results.length} |`);
  lines.push(`| Total errors | ${totalErrors} |`);
  lines.push(`| Total warnings | ${totalWarnings} |`);
  lines.push(`| Overall status | ${allValid ? 'PASS' : 'FAIL'} |`);
  lines.push('');

  results.forEach((result, index) => {
    lines.push(`## Schema ${index + 1}: ${result.valid ? 'PASS' : 'FAIL'}`);
    lines.push('');

    if (result.errors.length > 0) {
      lines.push('### Errors');
      for (const err of result.errors) {
        lines.push(`- ${err}`);
      }
      lines.push('');
    }

    if (result.warnings.length > 0) {
      lines.push('### Warnings');
      for (const warn of result.warnings) {
        lines.push(`- ${warn}`);
      }
      lines.push('');
    }

    if (result.errors.length === 0 && result.warnings.length === 0) {
      lines.push('All checks passed.');
      lines.push('');
    }
  });

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
