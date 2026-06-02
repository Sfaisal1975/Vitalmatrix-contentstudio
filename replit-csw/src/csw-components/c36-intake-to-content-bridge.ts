/**
 * Component 36: INTAKE-to-Content Bridge
 *
 * Converts INTAKE form questions into educational blog posts explaining
 * WHY each question matters clinically. Maps 10 pre-built intake questions
 * to nodes (N1-N7) and zones (Z1-Z5), generating practitioner-facing
 * content that demonstrates VitalMatrix's clinical depth.
 *
 * 7 nodes, 5 zones, 6 stacks. British English throughout.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';
import type { EvidenceTier } from './brand-config';

// --- Types ---

/** A single INTAKE form question with clinical mapping. */
export interface IntakeQuestion {
  /** Unique question identifier, e.g. 'IQ-001'. */
  id: string;
  /** The question text as presented to the patient. */
  question: string;
  /** Which nodes (N1-N7) this question informs. */
  nodeRelevance: string[];
  /** Which zones (Z1-Z5) this question informs. */
  zoneRelevance: string[];
  /** Clinical rationale explaining why this question matters. */
  clinicalRationale: string;
}

/** A generated content piece derived from an intake question. */
export interface ContentPiece {
  /** Blog post title. */
  title: string;
  /** Full body text in HTML. */
  body: string;
  /** Primary target node. */
  targetNode: string;
  /** Primary target zone. */
  targetZone: string;
  /** Evidence classification for clinical claims. */
  evidenceTier: EvidenceTier;
  /** URL-safe slug for SEO. */
  seoSlug: string;
}

// --- Pre-Built Intake Questions ---

/** 10 pre-mapped INTAKE questions covering the clinical terrain. */
const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    id: 'IQ-001',
    question: 'Describe your typical energy curve throughout the day.',
    nodeRelevance: ['N3', 'N6'],
    zoneRelevance: ['Z1', 'Z3'],
    clinicalRationale: 'Energy patterns reveal mitochondrial function (N3) and hormonal rhythm integrity (N6). A mid-afternoon crash may indicate cortisol dysregulation, whilst morning fatigue suggests adrenal or thyroid involvement. Mapping the energy curve across the day provides a non-invasive proxy for metabolic and endocrine health.',
  },
  {
    id: 'IQ-002',
    question: 'List any foods that cause bloating, discomfort, or visible reactions.',
    nodeRelevance: ['N1', 'N2'],
    zoneRelevance: ['Z1', 'Z2'],
    clinicalRationale: 'Food reactivity patterns illuminate gut barrier integrity (N1) and immune activation thresholds (N2). Repeated reactivity to FODMAP-containing foods may suggest small intestinal bacterial overgrowth, whilst histamine-rich food reactions point to mast cell dysregulation or DAO insufficiency.',
  },
  {
    id: 'IQ-003',
    question: 'How often do you experience blood sugar crashes, shakiness, or sugar cravings?',
    nodeRelevance: ['N6'],
    zoneRelevance: ['Z3', 'Z4'],
    clinicalRationale: 'Blood sugar instability reflects insulin signalling capacity and hepatic glucose regulation (N6). Frequent hypoglycaemic episodes correlate with HPA axis dysfunction and may precede metabolic syndrome by years. This question captures early terrain shifts before laboratory markers become abnormal.',
  },
  {
    id: 'IQ-004',
    question: 'Detail any history of significant infections, including childhood illnesses.',
    nodeRelevance: ['N2'],
    zoneRelevance: ['Z2', 'Z5'],
    clinicalRationale: 'Infection history reveals immune system training and potential latent reactivation patterns (N2). Epstein-Barr virus reactivation, for example, is implicated in chronic fatigue presentations. Understanding the infection timeline helps identify immune exhaustion and terrain vulnerability windows.',
  },
  {
    id: 'IQ-005',
    question: 'Which supplements have you tried, and which ones did you notice a response from?',
    nodeRelevance: ['N1', 'N3', 'N5', 'N6'],
    zoneRelevance: ['Z1', 'Z3', 'Z4'],
    clinicalRationale: 'Supplement response patterns are a functional biomarker. A dramatic response to magnesium suggests cellular depletion (N3), whilst B-vitamin sensitivity may indicate methylation polymorphisms (N5). Non-response to standard doses can reveal absorption issues (N1) or cofactor dependencies across multiple nodes.',
  },
  {
    id: 'IQ-006',
    question: 'Have you ever been told you have hypermobility, or do you bruise easily?',
    nodeRelevance: ['N7'],
    zoneRelevance: ['Z4', 'Z5'],
    clinicalRationale: 'Connective tissue integrity (N7) is an under-assessed terrain element. Hypermobility spectrum conditions affect collagen cross-linking and are associated with mast cell activation, dysautonomia, and cervical instability. This single question can redirect the entire clinical investigation.',
  },
  {
    id: 'IQ-007',
    question: 'How quickly do you recover from moderate exercise?',
    nodeRelevance: ['N3'],
    zoneRelevance: ['Z1', 'Z3'],
    clinicalRationale: 'Exercise recovery time is a proxy for mitochondrial reserve capacity (N3) and inflammatory clearance. Prolonged recovery beyond 48 hours suggests impaired oxidative phosphorylation or excessive reactive oxygen species production. This metric is more clinically useful than exercise tolerance alone.',
  },
  {
    id: 'IQ-008',
    question: 'If applicable, describe your menstrual cycle pattern and any phase-related symptoms.',
    nodeRelevance: ['N6'],
    zoneRelevance: ['Z3', 'Z5'],
    clinicalRationale: 'Menstrual cycle architecture reflects the interplay between hypothalamic signalling, ovarian function, and hepatic oestrogen metabolism (N6/Z5). Luteal phase symptoms indicate progesterone insufficiency, whilst follicular phase irregularities suggest FSH/LH axis disruption. Cycle mapping is a non-invasive endocrine assessment.',
  },
  {
    id: 'IQ-009',
    question: 'Describe your typical bowel habits, including frequency, consistency, and any changes.',
    nodeRelevance: ['N1'],
    zoneRelevance: ['Z1', 'Z2'],
    clinicalRationale: 'Bowel transit time and consistency (Bristol scale) reflect gut motility, microbiome composition, and vagal tone (N1). Alternating patterns suggest dysbiosis or food-driven inflammation. Transit time directly affects toxin reabsorption and enterohepatic oestrogen cycling, linking gut function to systemic terrain health.',
  },
  {
    id: 'IQ-010',
    question: 'Describe your sleep pattern: time to fall asleep, wake-ups, and how refreshed you feel.',
    nodeRelevance: ['N6', 'N3'],
    zoneRelevance: ['Z3', 'Z5'],
    clinicalRationale: 'Sleep architecture quality reflects melatonin synthesis, cortisol rhythm, and glymphatic clearance (N6/N3). Difficulty initiating sleep suggests cortisol elevation, whilst frequent waking implicates blood sugar dysregulation or histamine excess. Non-restorative sleep despite adequate duration points to mitochondrial insufficiency.',
  },
];

// --- Helpers ---

/**
 * Generates a URL-safe slug from a title string.
 * Uses British English conventions — no trailing hyphens.
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Maps a node code (e.g. 'N3') to a human-readable name.
 */
function nodeLabel(node: string): string {
  const labels: Record<string, string> = {
    N1: 'Gut and Digestion',
    N2: 'Immune and Inflammation',
    N3: 'Energy and Mitochondria',
    N4: 'Detoxification',
    N5: 'Methylation and Genetics',
    N6: 'Hormones and Endocrine',
    N7: 'Structural and Connective Tissue',
  };
  return labels[node] ?? node;
}

/**
 * Maps a zone code (e.g. 'Z1') to a human-readable name.
 */
function zoneLabel(zone: string): string {
  const labels: Record<string, string> = {
    Z1: 'Foundational Terrain',
    Z2: 'Defence and Immune',
    Z3: 'Metabolic Core',
    Z4: 'Regulatory Systems',
    Z5: 'Integration and Expression',
  };
  return labels[zone] ?? zone;
}

/**
 * Determines evidence tier based on the clinical rationale content.
 */
function inferEvidenceTier(rationale: string): EvidenceTier {
  const lower = rationale.toLowerCase();
  if (lower.includes('established') || lower.includes('correlate') || lower.includes('implicated')) {
    return 'Emerging';
  }
  if (lower.includes('proxy') || lower.includes('non-invasive')) {
    return 'Observed in Practice';
  }
  if (lower.includes('spectrum') || lower.includes('polymorphism')) {
    return 'Emerging';
  }
  return 'Observed in Practice';
}

// --- Core Functions ---

/**
 * Generates a full educational content piece from a single intake question.
 *
 * The resulting blog post explains WHY the question is asked, which nodes
 * and zones it informs, and what clinical patterns emerge from the answers.
 *
 * @param question - The intake question to convert.
 * @returns A complete ContentPiece ready for publication.
 */
export function generateContentFromQuestion(question: IntakeQuestion): ContentPiece {
  const primaryNode = question.nodeRelevance[0] ?? 'N1';
  const primaryZone = question.zoneRelevance[0] ?? 'Z1';
  const tier = inferEvidenceTier(question.clinicalRationale);

  const title = `Why We Ask: "${question.question}"`;
  const seoSlug = slugify(`why-we-ask-${question.id}-${nodeLabel(primaryNode).split(' ')[0].toLowerCase()}`);

  const nodeListHtml = question.nodeRelevance
    .map(n => `<span class="vm-node-tag">${n}: ${nodeLabel(n)}</span>`)
    .join(' ');

  const zoneListHtml = question.zoneRelevance
    .map(z => `<span class="vm-zone-tag">${z}: ${zoneLabel(z)}</span>`)
    .join(' ');

  const body = `
<article class="vm-intake-explainer" style="font-family: ${VM_BRAND.fonts.body}; color: ${VM_BRAND.colours.white}; background: ${VM_BRAND.colours.prussianBlue}; padding: 2rem; border-radius: 8px;">
  <header>
    <h1 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold};">${title}</h1>
    <p class="vm-evidence-tier" style="color: ${VM_BRAND.colours.teal}; font-family: ${VM_BRAND.fonts.data};">Evidence Tier: ${tier}</p>
  </header>

  <section class="vm-question-display" style="background: ${VM_BRAND.colours.charcoal}; padding: 1.5rem; border-left: 4px solid ${VM_BRAND.colours.gold}; margin: 1.5rem 0;">
    <p style="font-size: 1.2rem; font-style: italic;">"${question.question}"</p>
    <p style="font-family: ${VM_BRAND.fonts.data}; font-size: 0.85rem; color: ${VM_BRAND.colours.teal};">INTAKE Question ${question.id}</p>
  </section>

  <section class="vm-clinical-mapping">
    <h2 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold};">Clinical Mapping</h2>
    <div class="vm-node-relevance" style="margin-bottom: 0.75rem;">
      <strong>Nodes:</strong> ${nodeListHtml}
    </div>
    <div class="vm-zone-relevance">
      <strong>Zones:</strong> ${zoneListHtml}
    </div>
  </section>

  <section class="vm-rationale" style="margin-top: 1.5rem;">
    <h2 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold};">Why This Question Matters</h2>
    <p>${question.clinicalRationale}</p>
  </section>

  <section class="vm-practitioner-insight" style="margin-top: 1.5rem; background: ${VM_BRAND.colours.deepTeal}; padding: 1.5rem; border-radius: 6px;">
    <h3 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold};">Practitioner Insight</h3>
    <p>When your patient answers this question, ${VM_BRAND.platform.descriptor} maps the response across ${question.nodeRelevance.length} node${question.nodeRelevance.length > 1 ? 's' : ''} and ${question.zoneRelevance.length} zone${question.zoneRelevance.length > 1 ? 's' : ''}, building a terrain picture that no single laboratory test can replicate. This is the power of structured clinical intelligence.</p>
  </section>

  <footer style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.8rem; font-family: ${VM_BRAND.fonts.data};">
    <p>${VM_BRAND.regulatoryFooter}</p>
    <p style="font-size: 0.7rem;">${VM_BRAND.tmFooter}</p>
  </footer>
</article>`.trim();

  return {
    title,
    body,
    targetNode: primaryNode,
    targetZone: primaryZone,
    evidenceTier: tier,
    seoSlug,
  };
}

/**
 * Generates a complete content series from an array of intake questions.
 *
 * Each question produces one educational blog post. The series maintains
 * consistent styling and cross-references between posts.
 *
 * @param questions - Array of intake questions. Defaults to the pre-built set.
 * @returns Array of ContentPiece objects forming the full series.
 */
export function generateContentSeries(questions: IntakeQuestion[] = INTAKE_QUESTIONS): ContentPiece[] {
  return questions.map(q => generateContentFromQuestion(q));
}

/**
 * Generates an HTML index page linking to all articles in the series.
 *
 * Provides a navigable overview of the "Why We Ask" content series,
 * organised by node and zone relevance.
 *
 * @param questions - Array of intake questions. Defaults to the pre-built set.
 * @returns Full HTML string for the index page.
 */
export function generateSeriesIndexPage(questions: IntakeQuestion[] = INTAKE_QUESTIONS): string {
  const series = generateContentSeries(questions);

  const articleLinks = series.map((piece, idx) => {
    const q = questions[idx];
    return `
    <li style="margin-bottom: 1rem; padding: 1rem; background: ${VM_BRAND.colours.charcoal}; border-radius: 6px;">
      <a href="/${piece.seoSlug}" style="color: ${VM_BRAND.colours.gold}; font-family: ${VM_BRAND.fonts.heading}; font-size: 1.1rem; text-decoration: none;">
        ${piece.title}
      </a>
      <div style="font-family: ${VM_BRAND.fonts.data}; font-size: 0.8rem; color: ${VM_BRAND.colours.teal}; margin-top: 0.25rem;">
        ${q.nodeRelevance.join(', ')} | ${q.zoneRelevance.join(', ')} | ${piece.evidenceTier}
      </div>
      <p style="font-size: 0.9rem; margin-top: 0.5rem;">${q.clinicalRationale.substring(0, 150)}...</p>
    </li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Why We Ask: The Science Behind the INTAKE | ${VM_BRAND.credentials.company}</title>
  <style>
    body { font-family: '${VM_BRAND.fonts.body}', sans-serif; background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; margin: 0; padding: 2rem; }
    h1 { font-family: '${VM_BRAND.fonts.heading}', serif; color: ${VM_BRAND.colours.gold}; }
    ul { list-style: none; padding: 0; }
  </style>
</head>
<body>
  <header style="text-align: centre; margin-bottom: 2rem;">
    <h1>Why We Ask: The Science Behind the INTAKE</h1>
    <p style="font-family: '${VM_BRAND.fonts.data}', monospace; color: ${VM_BRAND.colours.teal};">
      ${series.length} articles | 7 nodes | 5 zones | ${VM_BRAND.platform.descriptor}
    </p>
    <p>Every question in the VitalMatrix INTAKE serves a clinical purpose. This series explains the science behind each one.</p>
  </header>

  <main>
    <ul>
      ${articleLinks}
    </ul>
  </main>

  <footer style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.75rem; font-family: '${VM_BRAND.fonts.data}', monospace;">
    <p>${VM_BRAND.regulatoryFooter}</p>
    <p>${VM_BRAND.tmFooter}</p>
  </footer>
</body>
</html>`;
}

/**
 * Returns the pre-built set of 10 intake questions.
 * Useful for external consumers that need the raw question data.
 */
export function getPreBuiltQuestions(): IntakeQuestion[] {
  return [...INTAKE_QUESTIONS];
}
