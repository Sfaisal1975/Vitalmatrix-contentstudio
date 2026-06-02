/**
 * Component 4: SEO Metadata for Blog
 * Source: HHW Prompt 1 (SEO Metadata and Optimisation Features), partial extraction
 * Route: VM W9 (Brand and Design) + VM W2 (Website Content Production)
 * Gate: Hostinger website deployment
 * Priority: Medium
 *
 * Features:
 *  - Meta title management (60-char limit, real-time counter, auto-suggest from blog title)
 *  - Meta description management (160-char limit, real-time counter, auto-suggest from first paragraph)
 *  - Focus keyword tracking (5-7 keywords, density analyser, first-100-words warning)
 *  - SEO slug generation (auto from title, lowercase, hyphens, editable)
 *  - Internal linking suggestions (scan published posts, suggest related)
 *  - Reading time estimator (200 words/minute)
 *  - Word count tracker
 *  - Readability score (Flesch-Kincaid Reading Ease)
 *  - SEO optimisation score (0-100, colour-coded)
 *
 * VitalMatrix adaptations:
 *  - Kill List (K1-K10) must pass before publication
 *  - Audience: PRACTITIONER throughout
 *  - Evidence tier labels on every clinical claim
 *  - "For practitioner use only" footer on clinical blog content
 *  - Phase 1 only: no Phase 2/3 features as current
 *  - Credentials: MBBS, FAAMFM (never FMAARM, never MD)
 *  - Platform descriptor: "terrain intelligence platform" in all metadata
 *  - IFM amplification framing: never correct IFM, always position as building upon
 *  - TM on first use of all 30 branded mnemonics per blog post
 *  - British English throughout (K8)
 *  - URL preview: vitalmatrix.co.uk/blog/[slug]
 *
 * Stripped (HHW-specific):
 *  - Open Graph / Twitter Card metadata
 *  - Canonical URL management
 *  - XML sitemap auto-update
 *  - Image optimisation checker
 *  - Mobile preview toggle
 *  - HHW colour palette and URL references
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  slug: string;
  readingTimeMinutes: number;
  wordCount: number;
  readabilityScore: number;
  seoScore: number;
  seoScoreColour: 'green' | 'amber' | 'orange' | 'red';
}

export interface SeoAnalysis {
  metaTitleLength: number;
  metaTitleOk: boolean;
  metaDescriptionLength: number;
  metaDescriptionOk: boolean;
  keywordDensity: Record<string, number>;
  keywordInFirst100Words: boolean;
  hasInternalLinks: boolean;
  hasHeadingStructure: boolean;
  overallScore: number;
}

// --- Slug Generation ---

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getSlugPreview(slug: string): string {
  return `${VM_BRAND.platform.domain}/blog/${slug}`;
}

// --- Meta Analysis ---

export function analyseMetaTitle(title: string): { length: number; ok: boolean } {
  return { length: title.length, ok: title.length <= 60 && title.length > 0 };
}

export function analyseMetaDescription(description: string): { length: number; ok: boolean } {
  return { length: description.length, ok: description.length <= 160 && description.length > 0 };
}

// --- Reading Metrics ---

export function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// --- Readability (Flesch-Kincaid) ---

export function calculateReadability(text: string): number {
  const words = countWords(text);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const syllables = estimateSyllables(text);

  if (words === 0 || sentences === 0) return 0;

  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

function estimateSyllables(text: string): number {
  return text.toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .split(/\s+/)
    .reduce((count, word) => {
      let syllables = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g);
      return count + (syllables ? syllables.length : 1);
    }, 0);
}

// --- Keyword Density ---

export function calculateKeywordDensity(text: string, keywords: string[]): Record<string, number> {
  const words = countWords(text);
  const lowerText = text.toLowerCase();
  const density: Record<string, number> = {};

  for (const keyword of keywords) {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = lowerText.match(regex);
    density[keyword] = matches ? (matches.length / words) * 100 : 0;
  }

  return density;
}

export function isKeywordInFirst100Words(text: string, keyword: string): boolean {
  const first100 = text.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
  return first100.includes(keyword.toLowerCase());
}

// --- SEO Score ---

export function calculateSeoScore(analysis: SeoAnalysis): { score: number; colour: 'green' | 'amber' | 'orange' | 'red' } {
  let score = 0;

  if (analysis.metaTitleOk) score += 20;
  if (analysis.metaDescriptionOk) score += 20;
  if (analysis.keywordInFirst100Words) score += 15;
  if (analysis.hasInternalLinks) score += 15;
  if (analysis.hasHeadingStructure) score += 15;

  // Keyword density 1-3% is ideal
  const densities = Object.values(analysis.keywordDensity);
  const avgDensity = densities.reduce((a, b) => a + b, 0) / (densities.length || 1);
  if (avgDensity >= 1 && avgDensity <= 3) score += 15;
  else if (avgDensity > 0) score += 7;

  let colour: 'green' | 'amber' | 'orange' | 'red';
  if (score >= 90) colour = 'green';
  else if (score >= 70) colour = 'amber';
  else if (score >= 50) colour = 'orange';
  else colour = 'red';

  return { score, colour };
}
