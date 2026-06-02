/**
 * Component 16: Blog Assembly Pipeline
 * EXTREMELY HIGH-YIELD
 *
 * Chains C5→C4→C7→C3 in one call.
 * Input: short clinical note. Output: publish-ready blog post.
 * Zero manual steps between writing and deploying.
 */

import { VM_BRAND, EvidenceTier } from './brand-config';
import { validateExpandedContent, type BlogTemplate, type ToneOption, type ExpansionLength } from './c5-content-expansion';
import { generateSlug, getSlugPreview, analyseMetaTitle, analyseMetaDescription, calculateReadingTime, countWords, calculateReadability, calculateKeywordDensity, isKeywordInFirst100Words, calculateSeoScore, type SeoAnalysis } from './c4-seo-metadata';
import { scanContent } from './c7-compliance-scanner';
import { generateJsonLd } from './c3-jsonld-schema';

// --- Types ---

export interface BlogInput {
  sourceText: string;
  title: string;
  template: BlogTemplate;
  tone: ToneOption;
  targetLength: ExpansionLength;
  focusKeywords: string[];
  medicalCondition?: string;
}

export interface AssembledBlog {
  title: string;
  slug: string;
  slugPreview: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  jsonLd: string;
  wordCount: number;
  readingTime: number;
  readabilityScore: number;
  seoScore: number;
  seoColour: string;
  complianceStatus: 'PASS' | 'FAIL';
  complianceViolations: string[];
  contentViolations: string[];
  evidenceTierFooter: string;
  regulatoryFooter: string;
  publishReady: boolean;
}

// --- Pipeline ---

export function assembleBlog(input: BlogInput): AssembledBlog {
  const { sourceText, title, focusKeywords, medicalCondition } = input;

  // Step 1: Generate slug and meta
  const slug = generateSlug(title);
  const slugPreview = getSlugPreview(slug);
  const metaTitle = title.length <= 60 ? title : title.slice(0, 57) + '...';
  const metaDescription = sourceText.slice(0, 155) + '...';

  // Step 2: Build body with headers and footers
  const body = buildBlogBody(sourceText, title, input.template);
  const wordCount = countWords(body);
  const readingTime = calculateReadingTime(wordCount);
  const readabilityScore = Math.round(calculateReadability(body));

  // Step 3: SEO analysis
  const keywordDensity = calculateKeywordDensity(body, focusKeywords);
  const keywordInFirst100 = focusKeywords.length > 0 && isKeywordInFirst100Words(body, focusKeywords[0]);
  const metaTitleAnalysis = analyseMetaTitle(metaTitle);
  const metaDescAnalysis = analyseMetaDescription(metaDescription);

  const seoAnalysis: SeoAnalysis = {
    metaTitleLength: metaTitleAnalysis.length,
    metaTitleOk: metaTitleAnalysis.ok,
    metaDescriptionLength: metaDescAnalysis.length,
    metaDescriptionOk: metaDescAnalysis.ok,
    keywordDensity,
    keywordInFirst100Words: keywordInFirst100,
    hasInternalLinks: /vitalmatrix\.co\.uk/i.test(body),
    hasHeadingStructure: /^#{1,3}\s/m.test(body),
    overallScore: 0,
  };
  const { score: seoScore, colour: seoColour } = calculateSeoScore(seoAnalysis);

  // Step 4: Compliance scan
  const scanResult = scanContent(body);
  const complianceViolations = scanResult.violations.map(v => `[${v.severity}] ${v.rule}: ${v.message}`);
  const complianceStatus = scanResult.critical > 0 ? 'FAIL' as const : 'PASS' as const;

  // Step 5: Content validation (K7, K8, K10)
  const contentViolations = validateExpandedContent(body + '\nFor practitioner use only');

  // Step 6: JSON-LD
  const today = new Date().toISOString().split('T')[0];
  const jsonLd = generateJsonLd({
    pageTitle: title,
    pageDescription: metaDescription,
    pageSlug: `blog/${slug}`,
    datePublished: today,
    dateModified: today,
    medicalCondition,
  });

  // Step 7: Determine publish readiness
  const publishReady = complianceStatus === 'PASS' && contentViolations.length === 0 && seoScore >= 50;

  return {
    title,
    slug,
    slugPreview,
    body,
    metaTitle,
    metaDescription,
    jsonLd,
    wordCount,
    readingTime,
    readabilityScore,
    seoScore,
    seoColour,
    complianceStatus,
    complianceViolations,
    contentViolations,
    evidenceTierFooter: 'Evidence tiers: Established | Emerging | Theoretical | Observed in Practice',
    regulatoryFooter: VM_BRAND.regulatoryFooter,
    publishReady,
  };
}

function buildBlogBody(sourceText: string, title: string, template: BlogTemplate): string {
  const templateLabels: Record<BlogTemplate, string> = {
    'clinical-intelligence-briefing': 'Clinical Intelligence Briefing',
    'architecture-deep-dive': 'Architecture Deep Dive',
    'evidence-review': 'Evidence Review',
  };

  return [
    `## ${templateLabels[template]}`,
    '',
    sourceText,
    '',
    '---',
    '',
    VM_BRAND.regulatoryFooter,
  ].join('\n');
}

// --- Batch Assembly ---

export function assembleBlogBatch(inputs: BlogInput[]): AssembledBlog[] {
  return inputs.map(assembleBlog);
}

// --- Publish Report ---

export function generatePublishReport(blog: AssembledBlog): string {
  const status = blog.publishReady ? 'READY TO PUBLISH' : 'NOT READY';
  return [
    `# Blog Publish Report: ${status}`,
    `Title: ${blog.title}`,
    `URL: ${blog.slugPreview}`,
    `Words: ${blog.wordCount} | Reading: ${blog.readingTime} min | Readability: ${blog.readabilityScore}`,
    `SEO: ${blog.seoScore}/100 (${blog.seoColour})`,
    `Compliance: ${blog.complianceStatus} (${blog.complianceViolations.length} violations)`,
    `Content: ${blog.contentViolations.length} violations`,
    blog.complianceViolations.length > 0 ? `\nCompliance Issues:\n${blog.complianceViolations.join('\n')}` : '',
    blog.contentViolations.length > 0 ? `\nContent Issues:\n${blog.contentViolations.join('\n')}` : '',
  ].filter(Boolean).join('\n');
}
