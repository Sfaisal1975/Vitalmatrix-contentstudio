/**
 * Component 20: Content Repurposing Engine
 * EXTREMELY HIGH-YIELD
 *
 * One piece of content → 4 formats:
 * Blog post + practitioner email + LinkedIn post + branded PDF section.
 * Write once, deploy everywhere.
 */

import { VM_BRAND } from './brand-config';
import { generateSlug } from './c4-seo-metadata';

// --- Types ---

export interface RepurposeInput {
  title: string;
  body: string;
  author?: string;
  evidenceTiers?: string[];
}

export interface RepurposedContent {
  blogPost: string;
  practitionerEmail: string;
  linkedInPost: string;
  pdfSection: string;
}

// --- Repurposer ---

export function repurposeContent(input: RepurposeInput): RepurposedContent {
  return {
    blogPost: toBlogPost(input),
    practitionerEmail: toPractitionerEmail(input),
    linkedInPost: toLinkedInPost(input),
    pdfSection: toPdfSection(input),
  };
}

function toBlogPost(input: RepurposeInput): string {
  const slug = generateSlug(input.title);
  return [
    `# ${input.title}`,
    '',
    `*By ${input.author || VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}*`,
    `*${new Date().toISOString().split('T')[0]} | ${Math.ceil(input.body.split(/\s+/).length / 200)} min read*`,
    '',
    input.body,
    '',
    '---',
    '',
    input.evidenceTiers?.length ? `*Evidence tiers referenced: ${input.evidenceTiers.join(', ')}*` : '',
    '',
    VM_BRAND.regulatoryFooter,
    '',
    `*Published at: ${VM_BRAND.platform.domain}/blog/${slug}*`,
  ].filter(Boolean).join('\n');
}

function toPractitionerEmail(input: RepurposeInput): string {
  const paragraphs = input.body.split('\n\n').filter(p => p.trim().length > 30);
  const firstTwo = paragraphs.slice(0, 2).join('\n\n');
  const slug = generateSlug(input.title);

  return [
    `Subject: ${input.title}`,
    '',
    `Dear Colleague,`,
    '',
    firstTwo,
    '',
    `Read the full article: https://${VM_BRAND.platform.domain}/blog/${slug}`,
    '',
    'Kind regards,',
    '',
    `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
    `${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}`,
    '',
    VM_BRAND.regulatoryFooter,
  ].join('\n');
}

function toLinkedInPost(input: RepurposeInput): string {
  // LinkedIn: 3,000 chars max. Hook + insight + CTA.
  const firstParagraph = input.body.split('\n\n')[0] || input.body.slice(0, 200);
  const hook = firstParagraph.slice(0, 150);

  const post = [
    hook + '...',
    '',
    `This is what we are building at VitalMatrix\u2122 \u2014 a terrain intelligence platform for functional medicine practitioners.`,
    '',
    `Key insight from our latest analysis:`,
    '',
    firstParagraph,
    '',
    `Evidence tier: ${input.evidenceTiers?.[0] || 'Emerging'}`,
    '',
    `\u2014`,
    `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
    `Founder, ${VM_BRAND.credentials.company}`,
    '',
    '#FunctionalMedicine #ClinicalIntelligence #VitalMatrix #TerrainMedicine #IFM',
  ].join('\n');

  // Truncate to 3000 chars
  return post.slice(0, 3000);
}

function toPdfSection(input: RepurposeInput): string {
  return [
    `## ${input.title}`,
    '',
    `*${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}*`,
    '',
    input.body,
    '',
    '---',
    input.evidenceTiers?.length ? `Evidence tiers: ${input.evidenceTiers.join(', ')}` : '',
    VM_BRAND.regulatoryFooter,
  ].filter(Boolean).join('\n');
}

// --- Batch Repurpose ---

export function repurposeBatch(inputs: RepurposeInput[]): RepurposedContent[] {
  return inputs.map(repurposeContent);
}
