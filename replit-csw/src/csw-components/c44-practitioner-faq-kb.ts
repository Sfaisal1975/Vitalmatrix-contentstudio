/**
 * Component 44: Practitioner FAQ Knowledge Base
 *
 * Searchable FAQ knowledge base with 30 pre-built entries across
 * 7 categories. Supports keyword search, category filtering,
 * view tracking, and generates VM-styled HTML FAQ pages with
 * JSON-LD FAQPage structured data for SEO.
 *
 * Categories: platform, clinical, pricing, regulatory, onboarding,
 * technical, data-privacy.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** FAQ categories */
export type FaqCategory =
  | 'platform'
  | 'clinical'
  | 'pricing'
  | 'regulatory'
  | 'onboarding'
  | 'technical'
  | 'data-privacy';

/** A single FAQ entry */
export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  tags: string[];
  relatedEntries: string[];
  lastUpdated: string;
  views: number;
}

/** Full FAQ knowledge base */
export interface FaqKnowledgeBase {
  entries: FaqEntry[];
  categories: FaqCategory[];
}

// --- Constants ---

/** All supported categories */
const ALL_CATEGORIES: FaqCategory[] = [
  'platform', 'clinical', 'pricing', 'regulatory',
  'onboarding', 'technical', 'data-privacy',
];

/** Category display labels */
const CATEGORY_LABELS: Record<FaqCategory, string> = {
  platform: 'Platform',
  clinical: 'Clinical',
  pricing: 'Pricing',
  regulatory: 'Regulatory',
  onboarding: 'Onboarding',
  technical: 'Technical',
  'data-privacy': 'Data Privacy',
};

// --- Pre-built FAQ Entries ---

/** 30 pre-built FAQ entries across all categories */
const PREBUILT_FAQS: FaqEntry[] = [
  // Platform (5)
  {
    id: 'FAQ-001',
    question: 'What is VitalMatrix?',
    answer: `VitalMatrix is a ${VM_BRAND.platform.descriptor} designed for functional medicine practitioners. It organises clinical data across 7 physiological nodes (N1-N7), assesses patients through 5 clinical zones (Z1-Z5), and uses 6 analytical stacks (S1-S6) to deliver evidence-tiered recommendations.`,
    category: 'platform',
    tags: ['overview', 'introduction', 'what is'],
    relatedEntries: ['FAQ-002', 'FAQ-006'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-002',
    question: 'What are the 7 clinical nodes?',
    answer: 'The 7 nodes represent distinct physiological domains: N1 (Metabolic and Endocrine), N2 (Immune and Inflammatory), N3 (Neurological and Cognitive), N4 (Cardiovascular and Circulatory), N5 (Gastrointestinal and Hepatic), N6 (Musculoskeletal and Structural), and N7 (Psycho-Emotional and Behavioural). Each node captures validated biomarkers and clinical observations specific to its domain.',
    category: 'platform',
    tags: ['nodes', 'architecture', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'],
    relatedEntries: ['FAQ-001', 'FAQ-003'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-003',
    question: 'What are the 5 assessment zones?',
    answer: 'The 5 zones layer clinical assessment from foundation to expression: Z1 (Terrain Foundation), Z2 (Functional Load), Z3 (Regulatory Coherence), Z4 (Adaptive Capacity), and Z5 (Expression and Output). Each zone captures a distinct layer of physiological assessment.',
    category: 'platform',
    tags: ['zones', 'architecture', 'Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
    relatedEntries: ['FAQ-001', 'FAQ-002'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-004',
    question: 'How does CascadeIQ work?',
    answer: 'CascadeIQ detects cross-node interactions where dysfunction in one physiological domain amplifies disturbance in another. It monitors propagation patterns across all 7 nodes, alerting practitioners to cascade risks before they reach clinical threshold. This enables proactive, terrain-level intervention rather than reactive symptom management.',
    category: 'platform',
    tags: ['cascade', 'cascadeiq', 'cross-node', 'detection'],
    relatedEntries: ['FAQ-002', 'FAQ-003'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-005',
    question: 'What is the assessment pipeline?',
    answer: 'Patient data flows through 7 sequential engines: FLINT (initial scoring), APEX (pattern recognition), STRIDE (stratification), RIL (risk-level assignment), CADENCE (temporal analysis), CIL (clinical integration), and VISTA (output generation). The pipeline runs automatically after intake submission.',
    category: 'platform',
    tags: ['pipeline', 'engines', 'flint', 'apex', 'stride', 'ril', 'cadence', 'cil', 'vista'],
    relatedEntries: ['FAQ-001', 'FAQ-004'],
    lastUpdated: '2026-06-01',
    views: 0,
  },

  // Clinical (5)
  {
    id: 'FAQ-006',
    question: 'Is VitalMatrix a diagnostic tool?',
    answer: 'No. VitalMatrix is a terrain intelligence platform that organises, scores, and contextualises clinical data. It does not diagnose conditions. All outputs are decision-support aids designed to enhance practitioner clinical judgement, not replace it.',
    category: 'clinical',
    tags: ['diagnosis', 'clinical', 'decision support'],
    relatedEntries: ['FAQ-001', 'FAQ-016'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-007',
    question: 'What evidence tiers does VitalMatrix use?',
    answer: 'Every clinical recommendation is tagged with one of five evidence tiers: Established (robust evidence base), Emerging (promising but limited data), Theoretical (mechanistically plausible), Observed in Practice (clinical experience), or Contested (conflicting evidence). This transparency ensures practitioners understand the strength of each recommendation.',
    category: 'clinical',
    tags: ['evidence', 'tiers', 'established', 'emerging', 'theoretical'],
    relatedEntries: ['FAQ-006', 'FAQ-008'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-008',
    question: 'How many data points does the intake capture?',
    answer: 'The INTAKE form captures 502 data points across demographics, medical history, current symptoms, medications, supplements, lifestyle factors, and functional medicine markers. It includes age gating, unit validation, and supports partial saves.',
    category: 'clinical',
    tags: ['intake', 'data points', 'form', 'assessment'],
    relatedEntries: ['FAQ-005', 'FAQ-013'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-009',
    question: 'Can I use VitalMatrix for patient-facing communication?',
    answer: 'VitalMatrix outputs are designed for practitioner use only and are not intended for direct patient consumption. The platform is a B2B clinical intelligence tool. Practitioners may use the outputs to inform their own patient communications, but the raw outputs should not be shared with patients.',
    category: 'clinical',
    tags: ['patient', 'b2b', 'practitioner only', 'audience'],
    relatedEntries: ['FAQ-006', 'FAQ-016'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-010',
    question: 'What clinical frameworks does VitalMatrix align with?',
    answer: 'VitalMatrix is built on functional medicine principles, aligning with IFM (Institute for Functional Medicine) frameworks. The terrain-based approach reflects systems biology thinking, capturing multi-system interactions rather than isolated disease categories.',
    category: 'clinical',
    tags: ['ifm', 'functional medicine', 'framework', 'terrain'],
    relatedEntries: ['FAQ-001', 'FAQ-007'],
    lastUpdated: '2026-06-01',
    views: 0,
  },

  // Pricing (5)
  {
    id: 'FAQ-011',
    question: 'How much does VitalMatrix cost?',
    answer: `Founding cohort pricing: GBP ${VM_BRAND.pricing.foundingMonthly} per month for all practitioners. This founding rate is fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. The founding cohort is limited to 10 practitioners. Standard rate from month ${VM_BRAND.pricing.foundingFixedMonths + 1}: GBP ${VM_BRAND.pricing.standardRate} per month.`,
    category: 'pricing',
    tags: ['price', 'cost', 'monthly', 'subscription', 'gbp'],
    relatedEntries: ['FAQ-012', 'FAQ-013'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-012',
    question: 'Is there a different rate for IFM-trained practitioners?',
    answer: `No. The founding cohort rate is GBP ${VM_BRAND.pricing.foundingMonthly} per month for all practitioners, regardless of IFM certification status. IFM-trained practitioners will find the platform aligns naturally with their existing clinical framework, but the pricing is the same for everyone.`,
    category: 'pricing',
    tags: ['ifm', 'rate', 'founding cohort', 'single price'],
    relatedEntries: ['FAQ-011', 'FAQ-010'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-013',
    question: 'Is there a free trial or demo?',
    answer: 'We offer a guided discovery call rather than a self-serve trial. This ensures practitioners experience VitalMatrix with proper clinical context. The discovery call includes a live demonstration using sample patient data, a walkthrough of the 7-node architecture, and a personalised assessment of how VitalMatrix fits your practice.',
    category: 'pricing',
    tags: ['trial', 'demo', 'free', 'discovery call'],
    relatedEntries: ['FAQ-011', 'FAQ-021'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-014',
    question: 'What is included in the subscription?',
    answer: 'The monthly subscription includes: full platform access (all 7 nodes, 5 zones, 6 stacks), unlimited patient assessments, CascadeIQ cross-node detection, evidence-tiered clinical outputs, PDF export, onboarding support, and priority access to new features.',
    category: 'pricing',
    tags: ['subscription', 'included', 'features', 'access'],
    relatedEntries: ['FAQ-011', 'FAQ-015'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-015',
    question: 'Can I cancel my subscription?',
    answer: 'Yes. There is no long-term contract. You may cancel at any time with 30 days\' notice. However, the founding cohort price lock is only available during the initial enrolment period. If you cancel and later wish to re-subscribe, standard pricing will apply.',
    category: 'pricing',
    tags: ['cancel', 'contract', 'refund', 'commitment'],
    relatedEntries: ['FAQ-011', 'FAQ-014'],
    lastUpdated: '2026-06-01',
    views: 0,
  },

  // Regulatory (4)
  {
    id: 'FAQ-016',
    question: 'Is VitalMatrix regulated as a medical device?',
    answer: 'VitalMatrix is a clinical decision-support tool, not a medical device. It does not diagnose, treat, or prescribe. All outputs are intended to support practitioner judgement. The platform operates within MHRA guidance for clinical decision-support software.',
    category: 'regulatory',
    tags: ['mhra', 'medical device', 'regulation', 'compliance'],
    relatedEntries: ['FAQ-006', 'FAQ-017'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-017',
    question: 'What advertising standards does VitalMatrix follow?',
    answer: 'All VitalMatrix marketing materials comply with ASA (Advertising Standards Authority) and CAP Code requirements. We do not make diagnostic claims, guarantee outcomes, or use unsubstantiated clinical language. Every clinical claim is evidence-tiered.',
    category: 'regulatory',
    tags: ['asa', 'cap', 'advertising', 'claims', 'compliance'],
    relatedEntries: ['FAQ-016', 'FAQ-007'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-018',
    question: 'Who founded VitalMatrix?',
    answer: `VitalMatrix was founded by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}. Dr Faisal is the ${VM_BRAND.credentials.title} of ${VM_BRAND.credentials.company}.`,
    category: 'regulatory',
    tags: ['founder', 'credentials', 'company'],
    relatedEntries: ['FAQ-001'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-019',
    question: 'Is VitalMatrix registered with the ICO?',
    answer: `Yes. ${VM_BRAND.credentials.company} is registered with the Information Commissioner's Office under registration number ${VM_BRAND.platform.ico}. This covers all personal data processing activities conducted through the platform.`,
    category: 'regulatory',
    tags: ['ico', 'registration', 'data protection', 'information commissioner'],
    relatedEntries: ['FAQ-025', 'FAQ-026'],
    lastUpdated: '2026-06-01',
    views: 0,
  },

  // Onboarding (4)
  {
    id: 'FAQ-020',
    question: 'How long does onboarding take?',
    answer: 'The onboarding process typically takes 5-7 working days. It includes account setup, a guided platform walkthrough, your first supervised assessment, and a clinical output review session. Most practitioners run their first independent assessment within the first fortnight.',
    category: 'onboarding',
    tags: ['onboarding', 'timeline', 'setup', 'getting started'],
    relatedEntries: ['FAQ-021', 'FAQ-022'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-021',
    question: 'What happens in the discovery call?',
    answer: 'The discovery call is a 30-minute session covering: your current practice workflow, specific clinical challenges you face, a live VitalMatrix demonstration using sample data, pricing and cohort availability, and next steps for enrolment. No commitment required.',
    category: 'onboarding',
    tags: ['discovery call', 'meeting', 'demo', 'enrolment'],
    relatedEntries: ['FAQ-013', 'FAQ-020'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-022',
    question: 'Do I need special training to use VitalMatrix?',
    answer: 'No specialist technical training is required. If you are comfortable using web-based clinical tools, you will find VitalMatrix intuitive. IFM-credentialled practitioners will recognise familiar clinical concepts. Non-IFM practitioners receive additional onboarding support to align with the functional medicine framework.',
    category: 'onboarding',
    tags: ['training', 'learning curve', 'ifm', 'support'],
    relatedEntries: ['FAQ-020', 'FAQ-012'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-023',
    question: 'Can I import existing patient data?',
    answer: 'Data import is supported via structured CSV upload for demographics and lab results. Complex clinical histories are entered through the INTAKE form to ensure data quality and proper node/zone mapping. Our onboarding team assists with initial data migration.',
    category: 'onboarding',
    tags: ['import', 'data migration', 'csv', 'existing data'],
    relatedEntries: ['FAQ-008', 'FAQ-020'],
    lastUpdated: '2026-06-01',
    views: 0,
  },

  // Technical (3)
  {
    id: 'FAQ-024',
    question: 'What browsers and devices are supported?',
    answer: 'VitalMatrix runs in any modern web browser (Chrome, Firefox, Safari, Edge) on desktop and tablet. Mobile access is supported for output review but the full INTAKE form is optimised for desktop screens. No software installation is required.',
    category: 'technical',
    tags: ['browser', 'device', 'mobile', 'desktop', 'compatibility'],
    relatedEntries: ['FAQ-027'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-025',
    question: 'Where is my data stored?',
    answer: `All data is stored on UK-based servers compliant with UK GDPR requirements. ${VM_BRAND.credentials.company} is registered with the ICO (${VM_BRAND.platform.ico}). Data is encrypted at rest and in transit. No patient data is transferred outside the UK without explicit consent.`,
    category: 'technical',
    tags: ['data storage', 'servers', 'uk', 'encryption', 'location'],
    relatedEntries: ['FAQ-019', 'FAQ-026'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-026',
    question: 'What uptime and reliability can I expect?',
    answer: 'VitalMatrix targets 99.9% uptime. The platform runs on redundant infrastructure with automated failover. Scheduled maintenance windows are communicated 48 hours in advance and are conducted outside peak clinical hours (typically Sunday 02:00-06:00 GMT).',
    category: 'technical',
    tags: ['uptime', 'reliability', 'maintenance', 'sla'],
    relatedEntries: ['FAQ-024', 'FAQ-025'],
    lastUpdated: '2026-06-01',
    views: 0,
  },

  // Data Privacy (4)
  {
    id: 'FAQ-027',
    question: 'How does VitalMatrix handle patient consent?',
    answer: 'Practitioners are responsible for obtaining patient consent before entering data into VitalMatrix, in accordance with their own professional obligations. The platform provides a consent tracking feature that records when consent was obtained and for what purposes.',
    category: 'data-privacy',
    tags: ['consent', 'patient', 'gdpr', 'responsibility'],
    relatedEntries: ['FAQ-019', 'FAQ-028'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-028',
    question: 'Can I request deletion of all my data?',
    answer: 'Yes. Under UK GDPR, you have the right to request deletion of your account and all associated data. Submit a data deletion request through the platform settings or by contacting our data protection officer. Requests are processed within 30 days.',
    category: 'data-privacy',
    tags: ['deletion', 'right to erasure', 'gdpr', 'account'],
    relatedEntries: ['FAQ-027', 'FAQ-029'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-029',
    question: 'Does VitalMatrix share data with third parties?',
    answer: 'No patient or practitioner data is shared with third parties for marketing, analytics, or any other purpose. Data processing is limited to delivering the clinical intelligence service. Anonymised, aggregated data may be used for platform improvement, but this is never identifiable.',
    category: 'data-privacy',
    tags: ['third party', 'sharing', 'privacy', 'anonymised'],
    relatedEntries: ['FAQ-027', 'FAQ-028'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
  {
    id: 'FAQ-030',
    question: 'What happens to my data if I cancel my subscription?',
    answer: 'Upon cancellation, your data is retained for 90 days to allow for reactivation. After 90 days, all data is permanently deleted unless you request earlier deletion. You may export your data at any time before or during the retention period.',
    category: 'data-privacy',
    tags: ['cancellation', 'data retention', 'export', 'deletion'],
    relatedEntries: ['FAQ-015', 'FAQ-028'],
    lastUpdated: '2026-06-01',
    views: 0,
  },
];

// --- Store ---

/** In-memory FAQ store */
const faqStore: FaqKnowledgeBase = {
  entries: [...PREBUILT_FAQS],
  categories: ALL_CATEGORIES,
};

// --- Public Functions ---

/**
 * Searches FAQ entries by keyword across questions and tags.
 * Returns entries sorted by relevance (number of keyword matches).
 *
 * @param query - Search query string
 * @returns Matching FAQ entries sorted by relevance
 */
export function searchFaq(query: string): FaqEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  if (terms.length === 0) return [];

  const scored: { entry: FaqEntry; score: number }[] = [];

  for (const entry of faqStore.entries) {
    let score = 0;
    const questionLower = entry.question.toLowerCase();
    const answerLower = entry.answer.toLowerCase();
    const tagsJoined = entry.tags.join(' ').toLowerCase();

    for (const term of terms) {
      if (questionLower.includes(term)) score += 3;
      if (tagsJoined.includes(term)) score += 2;
      if (answerLower.includes(term)) score += 1;
    }

    if (score > 0) {
      entry.views++;
      scored.push({ entry, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.entry);
}

/**
 * Returns all FAQ entries in the specified category.
 *
 * @param category - FAQ category to filter by
 * @returns FAQ entries in that category
 */
export function getByCategory(category: FaqCategory): FaqEntry[] {
  return faqStore.entries.filter(e => e.category === category);
}

/**
 * Returns the most viewed FAQ entries.
 *
 * @param limit - Maximum number of results (default 10)
 * @returns Most viewed entries, descending
 */
export function getMostViewed(limit: number = 10): FaqEntry[] {
  return [...faqStore.entries]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/**
 * Adds a new FAQ entry to the knowledge base.
 *
 * @param entry - FAQ entry to add
 * @returns Updated knowledge base
 */
export function addEntry(entry: FaqEntry): FaqKnowledgeBase {
  faqStore.entries.push(entry);
  return { ...faqStore };
}

/**
 * Generates a VM-styled HTML FAQ page with category navigation,
 * search functionality, and accordion-style answers.
 *
 * @returns Complete HTML page string
 */
export function generateFaqPageHtml(): string {
  const categoryButtons = ALL_CATEGORIES.map(cat =>
    `<button onclick="filterCategory('${cat}')" style="padding:8px 16px;margin:4px;background:${VM_BRAND.colours.deepTeal};color:${VM_BRAND.colours.white};border:1px solid ${VM_BRAND.colours.teal};border-radius:4px;cursor:pointer;font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:13px;">${CATEGORY_LABELS[cat]}</button>`,
  ).join('\n          ');

  const faqItemsHtml = faqStore.entries.map(entry => `
      <div class="faq-item" data-category="${entry.category}" data-tags="${entry.tags.join(' ')}" data-question="${entry.question.toLowerCase()}" style="background:${VM_BRAND.colours.charcoal};border-radius:6px;margin-bottom:8px;overflow:hidden;">
        <button onclick="toggleFaq('${entry.id}')" style="width:100%;padding:16px 20px;background:none;border:none;color:${VM_BRAND.colours.white};font-family:'${VM_BRAND.fonts.heading}',serif;font-size:17px;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
          <span>${entry.question}</span>
          <span id="icon-${entry.id}" style="font-family:'${VM_BRAND.fonts.data}',monospace;color:${VM_BRAND.colours.gold};font-size:18px;">+</span>
        </button>
        <div id="answer-${entry.id}" style="display:none;padding:0 20px 16px;">
          <p style="color:${VM_BRAND.colours.white};opacity:0.85;font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:14px;line-height:1.6;">${entry.answer}</p>
          <div style="margin-top:8px;">
            <span style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:11px;color:${VM_BRAND.colours.teal};text-transform:uppercase;">${CATEGORY_LABELS[entry.category]}</span>
            ${entry.tags.map(t => `<span style="display:inline-block;margin-left:6px;padding:1px 8px;background:${VM_BRAND.colours.deepTeal};color:${VM_BRAND.colours.white};border-radius:3px;font-size:11px;font-family:'${VM_BRAND.fonts.data}',monospace;">${t}</span>`).join('')}
          </div>
        </div>
      </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FAQ | VitalMatrix</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; font-family: '${VM_BRAND.fonts.body}', sans-serif; }
    .faq-item button:hover { background: ${VM_BRAND.colours.deepTeal} !important; }
  </style>
</head>
<body>
  <div style="max-width:800px;margin:0 auto;padding:40px 20px;">
    <header style="text-align:centre;margin-bottom:32px;">
      <h1 style="font-family:'${VM_BRAND.fonts.heading}',serif;font-size:32px;color:${VM_BRAND.colours.gold};margin-bottom:8px;text-align:center;">Frequently Asked Questions</h1>
      <p style="font-size:15px;opacity:0.8;text-align:center;">Everything practitioners need to know about VitalMatrix.</p>
    </header>

    <div style="margin-bottom:24px;">
      <input id="faq-search" type="text" placeholder="Search FAQs..." oninput="searchFaqs(this.value)" style="width:100%;padding:12px 16px;background:${VM_BRAND.colours.charcoal};border:1px solid ${VM_BRAND.colours.teal};border-radius:6px;color:${VM_BRAND.colours.white};font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:15px;outline:none;" />
    </div>

    <div style="margin-bottom:24px;text-align:center;">
      <button onclick="filterCategory('all')" style="padding:8px 16px;margin:4px;background:${VM_BRAND.colours.gold};color:${VM_BRAND.colours.prussianBlue};border:none;border-radius:4px;cursor:pointer;font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:13px;font-weight:600;">All</button>
      ${categoryButtons}
    </div>

    <div id="faq-list">
      ${faqItemsHtml}
    </div>

    <footer style="text-align:center;padding-top:32px;margin-top:40px;border-top:1px solid ${VM_BRAND.colours.deepTeal};font-size:12px;opacity:0.6;">
      <p>${VM_BRAND.regulatoryFooter}</p>
      <p style="margin-top:4px;">${VM_BRAND.tmFooter}</p>
    </footer>
  </div>

  <script>
    function toggleFaq(id) {
      var answer = document.getElementById('answer-' + id);
      var icon = document.getElementById('icon-' + id);
      if (answer.style.display === 'none') {
        answer.style.display = 'block';
        icon.textContent = '-';
      } else {
        answer.style.display = 'none';
        icon.textContent = '+';
      }
    }

    function filterCategory(cat) {
      var items = document.querySelectorAll('.faq-item');
      items.forEach(function(item) {
        if (cat === 'all' || item.getAttribute('data-category') === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function searchFaqs(query) {
      var terms = query.toLowerCase().split(/\\s+/);
      var items = document.querySelectorAll('.faq-item');
      items.forEach(function(item) {
        var q = item.getAttribute('data-question');
        var tags = item.getAttribute('data-tags');
        var match = terms.every(function(t) {
          return t.length < 2 || q.indexOf(t) !== -1 || tags.indexOf(t) !== -1;
        });
        item.style.display = match ? 'block' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

/**
 * Generates JSON-LD FAQPage structured data for SEO.
 * Produces valid schema.org/FAQPage markup suitable for
 * Google rich results.
 *
 * @returns JSON-LD object
 */
export function generateFaqSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqStore.entries.map(entry => ({
      '@type': 'Question',
      'name': entry.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': entry.answer,
      },
    })),
  };
}
