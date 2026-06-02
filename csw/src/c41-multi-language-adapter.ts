/**
 * Component 41: Multi-Language Content Adapter
 *
 * Adapts content structure for international practitioners. Does NOT
 * auto-translate clinical text — instead generates translation
 * placeholders and briefs for human translators. Handles date formats,
 * currency conversion, regulatory body references, and data protection
 * law citations per locale.
 *
 * Supported locales: en-GB, en-US, de-DE, fr-FR, es-ES, pt-BR, ar-SA.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Supported locale codes */
export type Locale = 'en-GB' | 'en-US' | 'de-DE' | 'fr-FR' | 'es-ES' | 'pt-BR' | 'ar-SA';

/** Configuration for a single locale */
export interface LocaleConfig {
  locale: Locale;
  dateFormat: string;
  currencySymbol: string;
  currencyCode: string;
  regulatoryBody: string;
  dataProtectionLaw: string;
  practitionerTitle: string;
}

/** A placeholder entry for human translator */
export interface TranslationPlaceholder {
  key: string;
  originalText: string;
  context: string;
}

/** Fully adapted content for a target locale */
export interface ContentAdaptation {
  originalContent: string;
  locale: Locale;
  adaptedStructure: string;
  translationPlaceholders: TranslationPlaceholder[];
  regulatoryFootnote: string;
  dateFormatted: string;
}

// --- Locale Configurations ---

/** Pre-built locale configurations */
const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  'en-GB': {
    locale: 'en-GB',
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: '\u00a3',
    currencyCode: 'GBP',
    regulatoryBody: 'MHRA',
    dataProtectionLaw: 'UK GDPR',
    practitionerTitle: 'Practitioner',
  },
  'en-US': {
    locale: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    currencySymbol: '$',
    currencyCode: 'USD',
    regulatoryBody: 'FDA',
    dataProtectionLaw: 'HIPAA',
    practitionerTitle: 'Practitioner',
  },
  'de-DE': {
    locale: 'de-DE',
    dateFormat: 'DD.MM.YYYY',
    currencySymbol: '\u20ac',
    currencyCode: 'EUR',
    regulatoryBody: 'BfArM',
    dataProtectionLaw: 'EU-DSGVO',
    practitionerTitle: 'Heilpraktiker',
  },
  'fr-FR': {
    locale: 'fr-FR',
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: '\u20ac',
    currencyCode: 'EUR',
    regulatoryBody: 'ANSM',
    dataProtectionLaw: 'RGPD',
    practitionerTitle: 'Praticien',
  },
  'es-ES': {
    locale: 'es-ES',
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: '\u20ac',
    currencyCode: 'EUR',
    regulatoryBody: 'AEMPS',
    dataProtectionLaw: 'RGPD / LOPDGDD',
    practitionerTitle: 'Profesional sanitario',
  },
  'pt-BR': {
    locale: 'pt-BR',
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: 'R$',
    currencyCode: 'BRL',
    regulatoryBody: 'ANVISA',
    dataProtectionLaw: 'LGPD',
    practitionerTitle: 'Profissional de sa\u00fade',
  },
  'ar-SA': {
    locale: 'ar-SA',
    dateFormat: 'YYYY/MM/DD',
    currencySymbol: '\u0631.\u0633',
    currencyCode: 'SAR',
    regulatoryBody: 'SFDA',
    dataProtectionLaw: 'PDPL',
    practitionerTitle: '\u0645\u0645\u0627\u0631\u0633 \u0635\u062d\u064a',
  },
};

/** Approximate exchange rates from GBP (for structural adaptation only) */
const EXCHANGE_RATES: Record<string, number> = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.17,
  BRL: 6.35,
  SAR: 4.76,
};

// --- Functions ---

/**
 * Returns the pre-built locale configuration for the given locale.
 *
 * @param locale - Target locale code
 * @returns Full locale configuration
 */
export function getLocaleConfig(locale: Locale): LocaleConfig {
  return LOCALE_CONFIGS[locale];
}

/**
 * Formats a date string (ISO or DD/MM/YYYY) into the target locale format.
 *
 * @param dateStr - Source date string
 * @param targetFormat - Target date format pattern
 * @returns Formatted date string
 */
function formatDate(dateStr: string, targetFormat: string): string {
  let day: string;
  let month: string;
  let year: string;

  if (dateStr.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    // ISO format
    const parts = dateStr.substring(0, 10).split('-');
    year = parts[0];
    month = parts[1];
    day = parts[2];
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts[0].length === 4) {
      // YYYY/MM/DD
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else {
      // DD/MM/YYYY
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
  } else {
    return dateStr;
  }

  return targetFormat
    .replace('DD', day!)
    .replace('MM', month!)
    .replace('YYYY', year!);
}

/**
 * Converts a GBP amount to the target currency.
 *
 * @param gbpAmount - Amount in GBP
 * @param targetCode - Target currency code
 * @returns Converted amount rounded to nearest whole number
 */
function convertCurrency(gbpAmount: number, targetCode: string): number {
  const rate = EXCHANGE_RATES[targetCode] ?? 1;
  return Math.round(gbpAmount * rate);
}

/**
 * Extracts translatable segments from content and creates
 * placeholders with context annotations for a human translator.
 *
 * @param content - Original content text
 * @param locale - Target locale
 * @returns Array of translation placeholders
 */
function extractTranslationPlaceholders(content: string, locale: Locale): TranslationPlaceholder[] {
  const placeholders: TranslationPlaceholder[] = [];
  const config = LOCALE_CONFIGS[locale];

  // Split into sentences for translation units
  const sentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  let index = 0;

  for (const sentence of sentences) {
    index++;
    const key = `TU_${String(index).padStart(3, '0')}`;

    // Determine context based on content signals
    let context = 'General content.';
    const lower = sentence.toLowerCase();

    if (lower.includes('zone') || lower.includes('node') || lower.includes('cascade')) {
      context = 'Clinical terminology — VitalMatrix platform concept. Preserve technical terms unless locale has established equivalents.';
    } else if (lower.includes('gbp') || lower.includes('\u00a3') || lower.includes('price') || lower.includes('cost')) {
      context = `Pricing content. Convert currency to ${config.currencyCode}. Verify local pricing regulations.`;
    } else if (lower.includes('mhra') || lower.includes('regulatory') || lower.includes('compliance')) {
      context = `Regulatory content. Replace MHRA with ${config.regulatoryBody}. Verify local regulatory requirements.`;
    } else if (lower.includes('gdpr') || lower.includes('data protection') || lower.includes('privacy')) {
      context = `Data protection content. Reference ${config.dataProtectionLaw} instead of UK GDPR.`;
    } else if (lower.includes('practitioner') || lower.includes('clinical')) {
      context = `Clinical practitioner content. Use local title: "${config.practitionerTitle}".`;
    }

    placeholders.push({
      key,
      originalText: sentence.trim(),
      context,
    });
  }

  return placeholders;
}

/**
 * Adapts content structure for a target locale. Replaces dates,
 * currency references, regulatory body names, and data protection
 * law citations. Generates translation placeholders with context
 * for a human translator.
 *
 * @param content - Original content in en-GB
 * @param targetLocale - Target locale code
 * @returns Full content adaptation with placeholders
 */
export function adaptContent(content: string, targetLocale: Locale): ContentAdaptation {
  const config = LOCALE_CONFIGS[targetLocale];
  let adapted = content;

  // Replace date patterns (DD/MM/YYYY)
  adapted = adapted.replace(
    /(\d{2})\/(\d{2})\/(\d{4})/g,
    (_match, day, month, year) => formatDate(`${day}/${month}/${year}`, config.dateFormat),
  );

  // Replace ISO date patterns
  adapted = adapted.replace(
    /(\d{4})-(\d{2})-(\d{2})/g,
    (_match, year, month, day) => formatDate(`${year}-${month}-${day}`, config.dateFormat),
  );

  // Replace currency: GBP 99 -> EUR 350 etc.
  adapted = adapted.replace(
    /GBP\s*(\d+)/g,
    (_match, amount) => {
      const converted = convertCurrency(parseInt(amount, 10), config.currencyCode);
      return `${config.currencyCode} ${converted}`;
    },
  );

  // Replace pound symbol amounts
  adapted = adapted.replace(
    /\u00a3(\d+)/g,
    (_match, amount) => {
      const converted = convertCurrency(parseInt(amount, 10), config.currencyCode);
      return `${config.currencySymbol}${converted}`;
    },
  );

  // Replace regulatory body references
  adapted = adapted.replace(/\bMHRA\b/g, config.regulatoryBody);

  // Replace data protection law references
  adapted = adapted.replace(/\bUK GDPR\b/g, config.dataProtectionLaw);
  adapted = adapted.replace(/\bGDPR\b/g, config.dataProtectionLaw);

  // Replace practitioner title where appropriate
  if (targetLocale !== 'en-GB' && targetLocale !== 'en-US') {
    adapted = adapted.replace(/\bPractitioner\b/g, config.practitionerTitle);
  }

  // Format today's date in target locale
  const today = new Date();
  const todayIso = today.toISOString().substring(0, 10);
  const dateFormatted = formatDate(todayIso, config.dateFormat);

  // Generate regulatory footnote for target locale
  const regulatoryFootnote =
    `For ${config.practitionerTitle.toLowerCase()} use only. ` +
    `Not a diagnostic tool. Regulated under ${config.regulatoryBody}. ` +
    `Data protection: ${config.dataProtectionLaw}. ` +
    `${VM_BRAND.credentials.company} 2026.`;

  // Extract translation placeholders
  const translationPlaceholders = extractTranslationPlaceholders(content, targetLocale);

  return {
    originalContent: content,
    locale: targetLocale,
    adaptedStructure: adapted,
    translationPlaceholders,
    regulatoryFootnote,
    dateFormatted,
  };
}

/**
 * Generates a structured markdown translation brief for a human
 * translator. Includes locale context, terminology guidance,
 * regulatory notes, and all translation units with context.
 *
 * @param adaptation - The content adaptation to generate a brief for
 * @returns Markdown-formatted translation brief
 */
export function generateTranslationBrief(adaptation: ContentAdaptation): string {
  const config = LOCALE_CONFIGS[adaptation.locale];
  const lines: string[] = [];

  lines.push(`# Translation Brief`);
  lines.push('');
  lines.push(`**Target Locale:** ${adaptation.locale}`);
  lines.push(`**Date Generated:** ${adaptation.dateFormatted}`);
  lines.push(`**Source Language:** en-GB`);
  lines.push(`**Platform:** ${VM_BRAND.credentials.company} -- ${VM_BRAND.platform.descriptor}`);
  lines.push('');

  lines.push('## General Instructions');
  lines.push('');
  lines.push('- This content is for a B2B terrain intelligence platform aimed at functional medicine practitioners.');
  lines.push(`- Use formal, professional register appropriate for ${config.practitionerTitle.toLowerCase()} audiences.`);
  lines.push('- Preserve all VitalMatrix branded terms (marked with TM) without translation.');
  lines.push(`- Use ${config.currencyCode} (${config.currencySymbol}) for all monetary amounts.`);
  lines.push(`- Use ${config.dateFormat} date format.`);
  lines.push(`- Reference ${config.regulatoryBody} instead of MHRA for regulatory context.`);
  lines.push(`- Reference ${config.dataProtectionLaw} instead of UK GDPR for data protection.`);
  lines.push('- Do not translate node names (N1-N7), zone names (Z1-Z5), or stack identifiers (S1-S6).');
  lines.push('');

  lines.push('## Terminology Glossary');
  lines.push('');
  lines.push('| English Term | Note |');
  lines.push('|---|---|');
  lines.push('| Clinical intelligence platform | Core descriptor -- do not alter meaning |');
  lines.push('| Terrain | Functional medicine concept -- use established local term if available |');
  lines.push('| Cascade | System interaction pattern -- preserve or use closest clinical equivalent |');
  lines.push('| Zone (Z1-Z5) | Platform-specific grouping -- keep alphanumeric code |');
  lines.push('| Node (N1-N7) | Platform-specific element -- keep alphanumeric code |');
  lines.push('| Founding cohort | Limited early-access group -- translate concept, not brand term |');
  lines.push(`| Practitioner | Local equivalent: ${config.practitionerTitle} |`);
  lines.push('');

  lines.push('## Regulatory Footnote');
  lines.push('');
  lines.push(`> ${adaptation.regulatoryFootnote}`);
  lines.push('');

  lines.push('## Translation Units');
  lines.push('');
  lines.push(`Total units: ${adaptation.translationPlaceholders.length}`);
  lines.push('');

  for (const placeholder of adaptation.translationPlaceholders) {
    lines.push(`### ${placeholder.key}`);
    lines.push('');
    lines.push(`**Original:** ${placeholder.originalText}`);
    lines.push('');
    lines.push(`**Context:** ${placeholder.context}`);
    lines.push('');
    lines.push(`**Translation:**`);
    lines.push('');
    lines.push('```');
    lines.push('[TRANSLATOR: Enter translation here]');
    lines.push('```');
    lines.push('');
  }

  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
