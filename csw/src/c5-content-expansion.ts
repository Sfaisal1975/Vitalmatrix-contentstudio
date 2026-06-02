/**
 * Component 5: Email-to-Blog Content Expansion Engine
 * Source: HHW Prompt 5 (Email-to-Blog Conversion), partial extraction
 * Route: VM W2 (Website Content Production)
 * Gate: Blog live on Hostinger + post-Swidan meeting
 * Priority: Low
 *
 * Features:
 *  - Content expansion: short note/email -> full blog post (2x, 3-4x, 5-6x length options)
 *  - Expansion settings: clinical depth, research citations (PubMed via C1), actionable recommendations, FAQ
 *  - Tone options: professional educational (default), clinical, academic, conversational expert
 *  - Auto SEO integration: after expansion, run C4 SEO analyser, auto-generate meta description, suggest keywords
 *  - Blog-to-email condensing (reverse): blog post -> 300-500 word practitioner email with link
 *
 * VitalMatrix adaptations:
 *  - Terrain framing only (no pathogen language)
 *  - Evidence tier labels on all expanded clinical claims
 *  - No Phase 2/3 features presented as current
 *  - No competitor names (K10)
 *  - IFM amplification framing (never correct IFM, position as building upon)
 *  - British English throughout, no em dashes (K8)
 *  - Blog templates reframed for practitioner audience:
 *    - "Clinical Intelligence Briefing" (expand clinical insight -> educational article)
 *    - "Architecture Deep Dive" (expand FLINT concept -> detailed blog post)
 *    - "Evidence Review" (expand research finding -> practitioner-relevant analysis)
 *
 * Stripped (HHW-specific):
 *  - Lead magnet creation / email capture / conversion tracking
 *  - Exit intent popups
 *  - Email service integration (Mailchimp, ConvertKit, ActiveCampaign)
 *  - Analytics funnel tracking
 *  - Patient journey tone option
 *  - "About Dr Faisal" patient-facing bio
 *  - Discovery call CTAs for patients
 *  - Patient education content templates ("5 Tips", "Complete Guide", "Case Study")
 *  - All references to "lead magnet", "email capture", "nurture sequence", "conversion rate"
 */

import { VM_BRAND, EvidenceTier } from './brand-config';

// --- Types ---

export type ExpansionLength = '2x' | '3-4x' | '5-6x';
export type ToneOption = 'professional-educational' | 'clinical' | 'academic' | 'conversational-expert';
export type BlogTemplate = 'clinical-intelligence-briefing' | 'architecture-deep-dive' | 'evidence-review';

export interface ExpansionConfig {
  sourceText: string;
  targetLength: ExpansionLength;
  tone: ToneOption;
  template: BlogTemplate;
  addClinicalDepth: boolean;
  addResearchCitations: boolean;   // triggers C1 PubMed search
  addRecommendations: boolean;
  addFaq: boolean;
}

export interface ExpandedContent {
  title: string;
  body: string;
  wordCount: number;
  expansionRatio: number;
  evidenceTiersUsed: EvidenceTier[];
  template: BlogTemplate;
  tone: ToneOption;
  regulatoryFooter: string;
}

export interface CondensedEmail {
  subject: string;
  body: string;
  wordCount: number;
  blogLink: string;
}

// --- Template Descriptions ---

export const BLOG_TEMPLATES: Record<BlogTemplate, { name: string; description: string }> = {
  'clinical-intelligence-briefing': {
    name: 'Clinical Intelligence Briefing',
    description: 'Expand a clinical insight into a practitioner-facing educational article',
  },
  'architecture-deep-dive': {
    name: 'Architecture Deep Dive',
    description: 'Expand a FLINT\u2122 concept note into a detailed blog post',
  },
  'evidence-review': {
    name: 'Evidence Review',
    description: 'Expand a research finding into a practitioner-relevant analysis',
  },
};

// --- Expansion Multipliers ---

function getTargetWordCount(sourceWordCount: number, targetLength: ExpansionLength): number {
  switch (targetLength) {
    case '2x': return sourceWordCount * 2;
    case '3-4x': return sourceWordCount * 3.5;
    case '5-6x': return sourceWordCount * 5.5;
  }
}

// --- Content Guard ---

export function validateExpandedContent(content: string): string[] {
  const violations: string[] = [];

  // K7: Credential check
  if (/\bMD\b/.test(content) && !/\bMBBS\b/.test(content)) {
    violations.push('K7: Found "MD" without "MBBS" — must use MBBS, FAAMFM');
  }
  if (/FMAARM/i.test(content)) {
    violations.push('K7: Found "FMAARM" — must be FAAMFM');
  }

  // K8: British English / em dash check
  if (/\u2014/.test(content)) {
    violations.push('K8: Em dash found — use en dash or comma instead');
  }

  // K10: Competitor names
  const competitors = ['Mark Hyman', 'LaValle', 'Metabolic Code'];
  for (const name of competitors) {
    if (content.includes(name)) {
      violations.push(`K10: Competitor name "${name}" found — prohibited in VitalMatrix content`);
    }
  }

  // Phase check
  if (/Phase\s*[23]/i.test(content) && /currently|now available|live/i.test(content)) {
    violations.push('Phase 2/3 features presented as current — Phase 1 only');
  }

  // Platform descriptor check
  if (/clinical AI platform/i.test(content)) {
    violations.push('Wrong descriptor: "clinical AI platform" — must be "terrain intelligence platform"');
  }

  // Practitioner footer check
  if (!content.includes('practitioner use only')) {
    violations.push('Missing "For practitioner use only" footer on clinical content');
  }

  return violations;
}

// --- Blog-to-Email Condensing (Reverse) ---

export function condenseToPractitionerEmail(
  blogTitle: string,
  blogBody: string,
  blogSlug: string
): CondensedEmail {
  // Extract first 2-3 key points from the blog
  const paragraphs = blogBody.split('\n\n').filter(p => p.trim().length > 50);
  const keyPoints = paragraphs.slice(0, 3).map(p => p.slice(0, 150) + '...').join('\n\n');

  const body = `${blogTitle}\n\n${keyPoints}\n\nRead the full article: https://${VM_BRAND.platform.domain}/blog/${blogSlug}\n\n${VM_BRAND.regulatoryFooter}`;

  return {
    subject: blogTitle,
    body,
    wordCount: body.split(/\s+/).length,
    blogLink: `https://${VM_BRAND.platform.domain}/blog/${blogSlug}`,
  };
}
