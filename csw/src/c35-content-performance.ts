/**
 * Component 35: Content Performance Scorer
 *
 * Scores every piece of content on 5 dimensions (SEO, compliance,
 * freshness, audience fit, conversion potential) and assigns a
 * letter grade. Generates markdown performance reports and identifies
 * content needing improvement.
 *
 * Grading: A = 90+, B = 70-89, C = 50-69, D = 30-49, F = <30.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type ContentGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface PerformanceScore {
  contentId: string;
  title: string;
  seoScore: number;          // 0-100
  complianceScore: number;   // 0-100
  freshnessScore: number;    // 0-100
  audienceFitScore: number;  // 0-100
  conversionPotential: number; // 0-100
  overallScore: number;      // 0-100
  grade: ContentGrade;
}

// --- Constants ---

/** K10 blocked terms for compliance checking */
const K10_BLOCKED: string[] = [
  'mark hyman', 'hyman', 'lavalle', 'metabolic code',
  'ultra wellness', 'ultrawellness',
];

/** K7 credential violations */
const K7_VIOLATIONS: string[] = ['MD', 'FMAARM'];

/** K8 style violations */
const K8_VIOLATIONS: RegExp[] = [
  /\u2014/g,  // em dash
];

/** SEO keywords relevant to VitalMatrix content */
const SEO_KEYWORDS: string[] = [
  'functional medicine', 'terrain', 'clinical intelligence',
  'practitioner', 'evidence-based', 'zone', 'cascade',
  'assessment', 'vitalmatrix',
];

/** Practitioner-audience signal words */
const PRACTITIONER_SIGNALS: string[] = [
  'practitioner', 'clinical', 'patient', 'assessment',
  'evidence', 'protocol', 'intervention', 'diagnostic',
  'therapeutic', 'consultation', 'practice',
];

/** Conversion-driving elements */
const CONVERSION_SIGNALS: string[] = [
  'discovery call', 'book', 'founding cohort', 'founding spot',
  `GBP ${VM_BRAND.pricing.foundingMonthly}`, 'price guarantee', 'limited',
  'sign up', 'subscribe', 'contact', 'demo', 'trial',
];

// --- Scoring Functions ---

/**
 * Calculates SEO score based on keyword presence, title length,
 * body length, and structure.
 */
function calculateSeoScore(title: string, body: string): number {
  let score = 0;
  const lowerBody = body.toLowerCase();
  const lowerTitle = title.toLowerCase();

  // Title length: ideal 50-60 characters
  const titleLen = title.length;
  if (titleLen >= 50 && titleLen <= 60) score += 20;
  else if (titleLen >= 30 && titleLen <= 80) score += 12;
  else if (titleLen > 0) score += 5;

  // Body length: ideal 1000+ words
  const wordCount = body.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 1500) score += 20;
  else if (wordCount >= 1000) score += 16;
  else if (wordCount >= 500) score += 10;
  else if (wordCount >= 200) score += 5;

  // Keyword density (target keywords present)
  const keywordsFound = SEO_KEYWORDS.filter(kw => lowerBody.includes(kw)).length;
  const keywordRatio = keywordsFound / SEO_KEYWORDS.length;
  score += Math.round(keywordRatio * 25);

  // Keywords in title
  const titleKeywords = SEO_KEYWORDS.filter(kw => lowerTitle.includes(kw)).length;
  if (titleKeywords >= 2) score += 15;
  else if (titleKeywords >= 1) score += 10;

  // Heading structure (h2, h3, ##, ###)
  const headingCount = (body.match(/^#{2,3}\s/gm) || []).length +
    (body.match(/<h[23][^>]*>/gi) || []).length;
  if (headingCount >= 4) score += 10;
  else if (headingCount >= 2) score += 6;
  else if (headingCount >= 1) score += 3;

  // Internal linking signals
  if (lowerBody.includes(VM_BRAND.platform.domain)) score += 10;

  return Math.min(100, score);
}

/**
 * Calculates compliance score checking for K7, K8, K10 violations,
 * evidence tier presence, and regulatory footer.
 */
function calculateComplianceScore(body: string): number {
  let score = 100;
  const lowerBody = body.toLowerCase();

  // K10: competitor names (critical, -30 each)
  for (const term of K10_BLOCKED) {
    if (lowerBody.includes(term)) score -= 30;
  }

  // K7: credential errors (-20 each)
  for (const term of K7_VIOLATIONS) {
    // Check for standalone credential mentions (not part of other words)
    const pattern = new RegExp(`\\b${term}\\b`, 'g');
    if (pattern.test(body)) score -= 20;
  }

  // K8: em dashes (-5 each, capped)
  let emDashCount = 0;
  for (const pattern of K8_VIOLATIONS) {
    const matches = body.match(pattern);
    if (matches) emDashCount += matches.length;
  }
  score -= Math.min(15, emDashCount * 5);

  // Evidence tier labels present (+10 if found)
  const hasTierLabel = VM_BRAND.evidenceTiers.some(tier =>
    lowerBody.includes(tier.toLowerCase())
  );
  if (!hasTierLabel && body.length > 500) score -= 10;

  // Regulatory footer present
  if (!lowerBody.includes('not a diagnostic tool') &&
      !lowerBody.includes('practitioner use only')) {
    score -= 5;
  }

  // British English check (simple heuristic: "color" vs "colour")
  if (/\bcolor\b/i.test(body) && !/\bcolour\b/i.test(body)) score -= 5;
  if (/\borganize\b/i.test(body)) score -= 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates freshness score based on last modified date.
 * Content older than 90 days starts losing points.
 */
function calculateFreshnessScore(lastModified: Date): number {
  const now = new Date();
  const daysSinceModified = Math.floor(
    (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceModified <= 7) return 100;
  if (daysSinceModified <= 30) return 90;
  if (daysSinceModified <= 60) return 75;
  if (daysSinceModified <= 90) return 60;
  if (daysSinceModified <= 180) return 40;
  if (daysSinceModified <= 365) return 20;
  return 5;
}

/**
 * Calculates audience fit score. VitalMatrix content must target
 * practitioners (B2B), never patients.
 */
function calculateAudienceFitScore(body: string, targetAudience: string): number {
  let score = 0;
  const lowerBody = body.toLowerCase();

  // Practitioner signal words
  const signalsFound = PRACTITIONER_SIGNALS.filter(s => lowerBody.includes(s)).length;
  const signalRatio = signalsFound / PRACTITIONER_SIGNALS.length;
  score += Math.round(signalRatio * 40);

  // Target audience alignment
  if (targetAudience.toUpperCase() === VM_BRAND.platform.audience) {
    score += 20;
  }

  // Patient-facing language penalty
  const patientFacingTerms = ['buy now', 'self-diagnose', 'cure', 'heal yourself', 'miracle'];
  const patientTermsFound = patientFacingTerms.filter(t => lowerBody.includes(t)).length;
  score -= patientTermsFound * 10;

  // Professional tone indicators
  if (lowerBody.includes('evidence tier') || lowerBody.includes('evidence-based')) score += 10;
  if (lowerBody.includes('clinical') && lowerBody.includes('practitioner')) score += 10;
  if (lowerBody.includes('ifm') || lowerBody.includes('functional medicine')) score += 10;

  // VitalMatrix brand alignment
  if (lowerBody.includes('vitalmatrix') || lowerBody.includes('vital matrix')) score += 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates conversion potential based on call-to-action presence,
 * urgency signals, and value proposition clarity.
 */
function calculateConversionPotential(body: string): number {
  let score = 0;
  const lowerBody = body.toLowerCase();

  // CTA and conversion signals
  const ctaFound = CONVERSION_SIGNALS.filter(s => lowerBody.includes(s)).length;
  score += Math.min(40, ctaFound * 8);

  // Pricing transparency
  if (lowerBody.includes(String(VM_BRAND.pricing.foundingMonthly))) score += 15;

  // Urgency (founding cohort scarcity)
  if (lowerBody.includes('founding') && lowerBody.includes('spot')) score += 15;
  if (lowerBody.includes('limited')) score += 5;

  // Social proof signals
  if (lowerBody.includes('testimonial') || lowerBody.includes('practitioner feedback')) score += 10;

  // Clear value proposition
  if (lowerBody.includes('time saved') || lowerBody.includes('time saving')) score += 10;
  if (lowerBody.includes('cost per patient')) score += 5;

  return Math.max(0, Math.min(100, score));
}

// --- Grading ---

/**
 * Assigns a letter grade based on overall score.
 * A = 90+, B = 70-89, C = 50-69, D = 30-49, F = <30.
 */
export function gradeContent(overallScore: number): ContentGrade {
  if (overallScore >= 90) return 'A';
  if (overallScore >= 70) return 'B';
  if (overallScore >= 50) return 'C';
  if (overallScore >= 30) return 'D';
  return 'F';
}

// --- Main Scoring Function ---

/**
 * Scores a piece of content across all 5 dimensions and assigns
 * an overall score and letter grade.
 */
export function scoreContent(
  contentId: string,
  title: string,
  body: string,
  lastModified: Date,
  targetAudience: string,
): PerformanceScore {
  const seoScore = calculateSeoScore(title, body);
  const complianceScore = calculateComplianceScore(body);
  const freshnessScore = calculateFreshnessScore(lastModified);
  const audienceFitScore = calculateAudienceFitScore(body, targetAudience);
  const conversionPotential = calculateConversionPotential(body);

  // Weighted overall: compliance matters most, then audience fit
  const overallScore = Math.round(
    seoScore * 0.15 +
    complianceScore * 0.30 +
    freshnessScore * 0.15 +
    audienceFitScore * 0.25 +
    conversionPotential * 0.15
  );

  return {
    contentId,
    title,
    seoScore,
    complianceScore,
    freshnessScore,
    audienceFitScore,
    conversionPotential,
    overallScore,
    grade: gradeContent(overallScore),
  };
}

// --- Reporting ---

/**
 * Generates a markdown performance report from an array of scored content,
 * sorted by grade (best first).
 */
export function generatePerformanceReport(scores: PerformanceScore[]): string {
  const { credentials, platform } = VM_BRAND;

  // Sort by overall score descending
  const sorted = [...scores].sort((a, b) => b.overallScore - a.overallScore);

  // Grade distribution
  const distribution: Record<ContentGrade, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const s of sorted) {
    distribution[s.grade]++;
  }

  const avgScore = sorted.length > 0
    ? Math.round(sorted.reduce((sum, s) => sum + s.overallScore, 0) / sorted.length)
    : 0;

  const lines: string[] = [
    '# Content Performance Report',
    '',
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    `**Total items scored:** ${sorted.length}`,
    `**Average overall score:** ${avgScore}/100 (${gradeContent(avgScore)})`,
    '',
    '## Grade Distribution',
    '',
    `| Grade | Count | Percentage |`,
    `|-------|-------|------------|`,
  ];

  for (const grade of ['A', 'B', 'C', 'D', 'F'] as ContentGrade[]) {
    const count = distribution[grade];
    const pct = sorted.length > 0 ? Math.round((count / sorted.length) * 100) : 0;
    lines.push(`| ${grade} | ${count} | ${pct}% |`);
  }

  lines.push('');
  lines.push('## Detailed Scores');
  lines.push('');
  lines.push('| Grade | Overall | SEO | Compliance | Freshness | Audience | Conversion | Title |');
  lines.push('|-------|---------|-----|------------|-----------|----------|------------|-------|');

  for (const s of sorted) {
    lines.push(
      `| ${s.grade} | ${s.overallScore} | ${s.seoScore} | ${s.complianceScore} | ${s.freshnessScore} | ${s.audienceFitScore} | ${s.conversionPotential} | ${s.title} |`
    );
  }

  // Highlight items needing attention
  const needsWork = sorted.filter(s => s.overallScore < 50);
  if (needsWork.length > 0) {
    lines.push('');
    lines.push('## Items Needing Improvement');
    lines.push('');
    for (const s of needsWork) {
      const weakest = findWeakestDimension(s);
      lines.push(`- **${s.title}** (${s.contentId}): overall ${s.overallScore}/100 (${s.grade}). Weakest dimension: ${weakest}.`);
    }
  }

  // Compliance alerts
  const complianceAlerts = sorted.filter(s => s.complianceScore < 70);
  if (complianceAlerts.length > 0) {
    lines.push('');
    lines.push('## Compliance Alerts');
    lines.push('');
    for (const s of complianceAlerts) {
      lines.push(`- **${s.title}** (${s.contentId}): compliance score ${s.complianceScore}/100. Review for K7/K8/K10 violations.`);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`*${credentials.name}, ${credentials.qualifications} | ${credentials.company}*`);
  lines.push(`*${platform.descriptor} | ${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}

/**
 * Returns all content items scoring below the given threshold.
 */
export function getContentNeedingImprovement(
  scores: PerformanceScore[],
  threshold: number,
): PerformanceScore[] {
  return scores
    .filter(s => s.overallScore < threshold)
    .sort((a, b) => a.overallScore - b.overallScore);
}

// --- Helpers ---

/**
 * Identifies the weakest scoring dimension for a given content item.
 */
function findWeakestDimension(score: PerformanceScore): string {
  const dimensions: Array<{ name: string; value: number }> = [
    { name: 'SEO', value: score.seoScore },
    { name: 'Compliance', value: score.complianceScore },
    { name: 'Freshness', value: score.freshnessScore },
    { name: 'Audience fit', value: score.audienceFitScore },
    { name: 'Conversion potential', value: score.conversionPotential },
  ];

  dimensions.sort((a, b) => a.value - b.value);
  return `${dimensions[0].name} (${dimensions[0].value}/100)`;
}
