/**
 * Component 59: Quiz Engine
 *
 * Interactive lead generation quizzes for website and social media.
 * Includes 3 pre-built quizzes: zone assessment, practice readiness,
 * and practitioner archetype. Generates self-contained HTML quiz pages
 * with VM styling, email capture, and social share functionality.
 *
 * All content is practitioner-facing (B2B). Never patient-facing.
 * K7/K8/K10 compliance enforced. Evidence tiers on clinical claims.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** A quiz option with scoring weights */
export interface QuizOption {
  text: string;
  scores: Record<string, number>;
}

/** A single quiz question */
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  nodeRelevance?: string[];
  zoneRelevance?: string[];
}

/** A quiz result category */
export interface QuizResult {
  id: string;
  category: string;
  title: string;
  description: string;
  zoneHighlight: string;
  recommendation: string;
  ctaText: string;
  ctaUrl: string;
  shareText: string;
}

/** A complete quiz definition */
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  resultCategories: QuizResult[];
  leadCaptureEnabled: boolean;
  shareableOnSocial: boolean;
}

/** A quiz submission record */
export interface QuizSubmission {
  quizId: string;
  answers: Record<string, string>;
  resultCategory: string;
  email?: string;
  capturedAt: string;
}

/** Quiz analytics report */
export interface QuizReport {
  quizId: string;
  totalSubmissions: number;
  completionRate: number;
  resultDistribution: Record<string, number>;
  emailCaptureRate: number;
  generatedAt: string;
}

// --- Pre-built Quizzes ---

/** Quiz 1: Which Clinical Zone Needs Your Attention? */
const ZONE_QUIZ: Quiz = {
  id: 'quiz-zone-assessment',
  title: 'Which Clinical Zone Needs Your Attention?',
  description: 'Answer 10 questions to discover which of the 5 clinical zones is most relevant to your current caseload. For practitioners only.',
  leadCaptureEnabled: true,
  shareableOnSocial: true,
  questions: [
    {
      id: 'zq-01',
      question: 'Which patient presentations dominate your current caseload?',
      options: [
        { text: 'Fatigue, weight management, metabolic syndrome', scores: { Z1: 3, Z2: 1, Z3: 1, Z4: 0, Z5: 0 } },
        { text: 'IBS, food sensitivities, immune dysregulation', scores: { Z1: 0, Z2: 3, Z3: 1, Z4: 1, Z5: 0 } },
        { text: 'Anxiety, hormonal imbalances, sleep disorders', scores: { Z1: 1, Z2: 0, Z3: 3, Z4: 0, Z5: 1 } },
        { text: 'Chemical sensitivities, chronic pain, toxicity concerns', scores: { Z1: 0, Z2: 1, Z3: 0, Z4: 3, Z5: 1 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z4'],
    },
    {
      id: 'zq-02',
      question: 'Where do you spend most assessment time?',
      options: [
        { text: 'Blood sugar regulation and thyroid panels', scores: { Z1: 3, Z2: 0, Z3: 1, Z4: 0, Z5: 0 } },
        { text: 'Stool testing and immune markers', scores: { Z1: 0, Z2: 3, Z3: 0, Z4: 1, Z5: 0 } },
        { text: 'HPA axis testing and neurotransmitter profiles', scores: { Z1: 0, Z2: 0, Z3: 3, Z4: 0, Z5: 1 } },
        { text: 'Environmental toxin panels and liver function', scores: { Z1: 0, Z2: 0, Z3: 0, Z4: 3, Z5: 1 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z4'],
    },
    {
      id: 'zq-03',
      question: 'Which clinical area do you feel least confident assessing comprehensively?',
      options: [
        { text: 'Mitochondrial function and energy production', scores: { Z1: 3, Z2: 0, Z3: 0, Z4: 1, Z5: 1 } },
        { text: 'Microbiome-immune interactions', scores: { Z1: 0, Z2: 3, Z3: 0, Z4: 0, Z5: 1 } },
        { text: 'Neuroendocrine cascade effects', scores: { Z1: 0, Z2: 0, Z3: 3, Z4: 0, Z5: 2 } },
        { text: 'Phase I/II/III detoxification pathways', scores: { Z1: 0, Z2: 0, Z3: 0, Z4: 3, Z5: 1 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
    },
    {
      id: 'zq-04',
      question: 'Which cross-system interaction do you encounter most often?',
      options: [
        { text: 'Metabolic dysfunction driving hormonal imbalance', scores: { Z1: 2, Z2: 0, Z3: 2, Z4: 0, Z5: 2 } },
        { text: 'Gut permeability triggering immune activation', scores: { Z1: 0, Z2: 3, Z3: 0, Z4: 1, Z5: 2 } },
        { text: 'Stress response disrupting gut function', scores: { Z1: 0, Z2: 2, Z3: 2, Z4: 0, Z5: 2 } },
        { text: 'Toxin burden impacting neurological function', scores: { Z1: 0, Z2: 0, Z3: 1, Z4: 2, Z5: 3 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
    },
    {
      id: 'zq-05',
      question: 'What type of continuing education interests you most?',
      options: [
        { text: 'Metabolic flexibility and insulin signalling', scores: { Z1: 3, Z2: 0, Z3: 0, Z4: 0, Z5: 0 } },
        { text: 'Mucosal immunology and microbiome research', scores: { Z1: 0, Z2: 3, Z3: 0, Z4: 0, Z5: 0 } },
        { text: 'Psychoneuroimmunology and HPA axis', scores: { Z1: 0, Z2: 0, Z3: 3, Z4: 0, Z5: 0 } },
        { text: 'Environmental medicine and biotransformation', scores: { Z1: 0, Z2: 0, Z3: 0, Z4: 3, Z5: 0 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z4'],
    },
    {
      id: 'zq-06',
      question: 'How do you currently track treatment outcomes?',
      options: [
        { text: 'Lab values and metabolic markers', scores: { Z1: 3, Z2: 1, Z3: 0, Z4: 0, Z5: 0 } },
        { text: 'Symptom questionnaires and gut-specific scales', scores: { Z1: 0, Z2: 3, Z3: 0, Z4: 0, Z5: 0 } },
        { text: 'Mood and sleep diaries, hormone panels', scores: { Z1: 0, Z2: 0, Z3: 3, Z4: 0, Z5: 0 } },
        { text: 'I struggle to track systematically across systems', scores: { Z1: 1, Z2: 1, Z3: 1, Z4: 1, Z5: 3 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z5'],
    },
    {
      id: 'zq-07',
      question: 'Which supplement protocols do you prescribe most frequently?',
      options: [
        { text: 'CoQ10, B vitamins, chromium, alpha-lipoic acid', scores: { Z1: 3, Z2: 0, Z3: 0, Z4: 0, Z5: 0 } },
        { text: 'Probiotics, glutamine, zinc carnosine, immunoglobulins', scores: { Z1: 0, Z2: 3, Z3: 0, Z4: 0, Z5: 0 } },
        { text: 'Adaptogens, magnesium, GABA precursors, DIM', scores: { Z1: 0, Z2: 0, Z3: 3, Z4: 0, Z5: 0 } },
        { text: 'NAC, glutathione, milk thistle, activated charcoal', scores: { Z1: 0, Z2: 0, Z3: 0, Z4: 3, Z5: 0 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z4'],
    },
    {
      id: 'zq-08',
      question: 'What frustrates you most about current assessment approaches?',
      options: [
        { text: 'Metabolic complexity reduced to single markers', scores: { Z1: 3, Z2: 0, Z3: 0, Z4: 0, Z5: 1 } },
        { text: 'Gut and immune systems assessed in isolation', scores: { Z1: 0, Z2: 3, Z3: 0, Z4: 0, Z5: 1 } },
        { text: 'Neuroendocrine interactions are invisible', scores: { Z1: 0, Z2: 0, Z3: 3, Z4: 0, Z5: 1 } },
        { text: 'No way to see the whole terrain at once', scores: { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 3 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z5'],
    },
    {
      id: 'zq-09',
      question: 'How many clinical systems do you typically assess per patient?',
      options: [
        { text: '1-2 primary systems, focused approach', scores: { Z1: 1, Z2: 1, Z3: 1, Z4: 1, Z5: 0 } },
        { text: '3-4 systems with manual cross-referencing', scores: { Z1: 1, Z2: 1, Z3: 1, Z4: 1, Z5: 1 } },
        { text: '5+ systems but struggle to see interactions', scores: { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 3 } },
        { text: 'All systems ideally, but time prevents it', scores: { Z1: 1, Z2: 1, Z3: 1, Z4: 1, Z5: 2 } },
      ],
      zoneRelevance: ['Z5'],
    },
    {
      id: 'zq-10',
      question: 'If you could improve one aspect of your assessment, what would it be?',
      options: [
        { text: 'Deeper metabolic and energetic analysis', scores: { Z1: 3, Z2: 0, Z3: 0, Z4: 0, Z5: 0 } },
        { text: 'Better gut-immune integration', scores: { Z1: 0, Z2: 3, Z3: 0, Z4: 0, Z5: 0 } },
        { text: 'Clearer neuroendocrine mapping', scores: { Z1: 0, Z2: 0, Z3: 3, Z4: 0, Z5: 0 } },
        { text: 'Whole-system coherence and cascade detection', scores: { Z1: 0, Z2: 0, Z3: 0, Z4: 1, Z5: 3 } },
      ],
      zoneRelevance: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
    },
  ],
  resultCategories: [
    {
      id: 'result-z1',
      category: 'Z1',
      title: 'Your Focus Zone: Metabolic and Energetic Terrain',
      description: 'Your caseload and clinical focus centre on metabolic function, energy production, and the thyroid-adrenal axis. VitalMatrix Zone 1 maps N1 (Metabolic Core) and N2 (Thyroid and Adrenal Axis) with integrated scoring and cascade detection.',
      zoneHighlight: 'Z1',
      recommendation: 'Start with the VitalMatrix Zone 1 assessment to see how integrated metabolic scoring transforms your clinical workflow.',
      ctaText: 'Explore Zone 1 Assessment',
      ctaUrl: `https://${VM_BRAND.platform.domain}/zones/z1`,
      shareText: 'I just discovered my primary clinical focus is Zone 1: Metabolic and Energetic Terrain. Take the quiz to find yours.',
    },
    {
      id: 'result-z2',
      category: 'Z2',
      title: 'Your Focus Zone: Gut and Immune Terrain',
      description: 'Your practice centres on gut integrity and immune modulation. VitalMatrix Zone 2 maps N3 (Gut Integrity) and N4 (Immune Modulation) with cascade awareness linking mucosal immunity to systemic immune function.',
      zoneHighlight: 'Z2',
      recommendation: 'Explore how VitalMatrix Zone 2 assessment reveals gut-immune cascade interactions invisible to single-system analysis.',
      ctaText: 'Explore Zone 2 Assessment',
      ctaUrl: `https://${VM_BRAND.platform.domain}/zones/z2`,
      shareText: 'My primary clinical zone is Zone 2: Gut and Immune Terrain. Discover yours with this quick practitioner quiz.',
    },
    {
      id: 'result-z3',
      category: 'Z3',
      title: 'Your Focus Zone: Neurological and Hormonal Terrain',
      description: 'Your clinical strength lies in neuroendocrine balance. VitalMatrix Zone 3 maps N5 (Neuroendocrine Balance) with integrated HPA axis, neurotransmitter, and hormonal rhythm assessment.',
      zoneHighlight: 'Z3',
      recommendation: 'See how VitalMatrix Zone 3 integrates HPA axis function with neurotransmitter and hormonal assessment in one unified score.',
      ctaText: 'Explore Zone 3 Assessment',
      ctaUrl: `https://${VM_BRAND.platform.domain}/zones/z3`,
      shareText: 'Zone 3: Neurological and Hormonal Terrain is my primary clinical focus. What is yours?',
    },
    {
      id: 'result-z4',
      category: 'Z4',
      title: 'Your Focus Zone: Structural and Detox Terrain',
      description: 'Your practice emphasises detoxification pathways and structural integrity. VitalMatrix Zone 4 maps N6 (Detoxification Pathways) and N7 (Structural Integrity) with cross-zone cascade detection.',
      zoneHighlight: 'Z4',
      recommendation: 'Discover how VitalMatrix Zone 4 links biotransformation capacity to structural and inflammatory markers.',
      ctaText: 'Explore Zone 4 Assessment',
      ctaUrl: `https://${VM_BRAND.platform.domain}/zones/z4`,
      shareText: 'Zone 4: Structural and Detox Terrain is where my clinical focus lies. Take the quiz to find your zone.',
    },
    {
      id: 'result-z5',
      category: 'Z5',
      title: 'Your Focus: Whole-System Coherence',
      description: 'You think in systems. Your clinical approach spans multiple zones, and you are most frustrated by the inability to see cross-zone interactions. VitalMatrix Zone 5 provides whole-terrain coherence scoring and cascade detection.',
      zoneHighlight: 'Z5',
      recommendation: 'VitalMatrix Zone 5 coherence analysis is designed for practitioners like you who need to see the full terrain picture.',
      ctaText: 'Explore Whole-System Assessment',
      ctaUrl: `https://${VM_BRAND.platform.domain}/zones/z5`,
      shareText: 'I think in whole systems. Zone 5: Whole-System Coherence is my clinical focus. What is yours?',
    },
  ],
};

/** Quiz 2: Is Your Practice Ready for Clinical Intelligence? */
const READINESS_QUIZ: Quiz = {
  id: 'quiz-practice-readiness',
  title: 'Is Your Practice Ready for Clinical Intelligence?',
  description: 'Assess your current workflow and discover whether your practice is ready for the VitalMatrix terrain intelligence platform. 8 questions, 2 minutes.',
  leadCaptureEnabled: true,
  shareableOnSocial: true,
  questions: [
    {
      id: 'rq-01',
      question: 'How do you currently conduct terrain assessments?',
      options: [
        { text: 'Entirely manual with paper or basic notes', scores: { ready: 1, growing: 0, advanced: 0 } },
        { text: 'Spreadsheets and templates I have built myself', scores: { ready: 0, growing: 2, advanced: 0 } },
        { text: 'A mix of tools but nothing integrated', scores: { ready: 0, growing: 1, advanced: 1 } },
        { text: 'I use structured assessment frameworks consistently', scores: { ready: 0, growing: 0, advanced: 2 } },
      ],
    },
    {
      id: 'rq-02',
      question: 'How long does a typical terrain assessment take you?',
      options: [
        { text: 'Over 60 minutes per patient', scores: { ready: 2, growing: 0, advanced: 0 } },
        { text: '30-60 minutes per patient', scores: { ready: 1, growing: 1, advanced: 0 } },
        { text: '15-30 minutes per patient', scores: { ready: 0, growing: 2, advanced: 0 } },
        { text: 'Under 15 minutes per patient', scores: { ready: 0, growing: 0, advanced: 2 } },
      ],
    },
    {
      id: 'rq-03',
      question: 'How do you track treatment outcomes over time?',
      options: [
        { text: 'I rely on clinical memory and patient feedback', scores: { ready: 2, growing: 0, advanced: 0 } },
        { text: 'Basic notes compared manually between visits', scores: { ready: 1, growing: 1, advanced: 0 } },
        { text: 'Structured questionnaires readministered periodically', scores: { ready: 0, growing: 1, advanced: 1 } },
        { text: 'Quantified scoring with documented trends', scores: { ready: 0, growing: 0, advanced: 2 } },
      ],
    },
    {
      id: 'rq-04',
      question: 'Can you currently detect cross-zone cascade interactions?',
      options: [
        { text: 'I am not sure what that means', scores: { ready: 2, growing: 0, advanced: 0 } },
        { text: 'I notice them sometimes but cannot track them systematically', scores: { ready: 0, growing: 2, advanced: 0 } },
        { text: 'I look for them deliberately but lack tools', scores: { ready: 0, growing: 1, advanced: 1 } },
        { text: 'Yes, I have a structured approach to cascades', scores: { ready: 0, growing: 0, advanced: 2 } },
      ],
    },
    {
      id: 'rq-05',
      question: 'How many patients do you see per week?',
      options: [
        { text: 'Fewer than 10', scores: { ready: 1, growing: 1, advanced: 0 } },
        { text: '10-20', scores: { ready: 0, growing: 2, advanced: 0 } },
        { text: '20-30', scores: { ready: 0, growing: 1, advanced: 1 } },
        { text: 'More than 30', scores: { ready: 0, growing: 0, advanced: 2 } },
      ],
    },
    {
      id: 'rq-06',
      question: 'What is your biggest workflow frustration?',
      options: [
        { text: 'Assessment takes too long', scores: { ready: 2, growing: 0, advanced: 0 } },
        { text: 'Documentation and reporting', scores: { ready: 1, growing: 1, advanced: 0 } },
        { text: 'Inconsistency between assessments', scores: { ready: 0, growing: 2, advanced: 0 } },
        { text: 'Scaling my practice without losing clinical depth', scores: { ready: 0, growing: 0, advanced: 2 } },
      ],
    },
    {
      id: 'rq-07',
      question: 'How comfortable are you with digital clinical tools?',
      options: [
        { text: 'I prefer paper and minimal technology', scores: { ready: 2, growing: 0, advanced: 0 } },
        { text: 'I use basic digital tools (email, spreadsheets)', scores: { ready: 1, growing: 1, advanced: 0 } },
        { text: 'I actively seek better clinical technology', scores: { ready: 0, growing: 1, advanced: 1 } },
        { text: 'Technology is central to my practice workflow', scores: { ready: 0, growing: 0, advanced: 2 } },
      ],
    },
    {
      id: 'rq-08',
      question: 'What would make you consider a new clinical tool?',
      options: [
        { text: 'Significant time savings with no learning curve', scores: { ready: 2, growing: 0, advanced: 0 } },
        { text: 'Better clinical outcomes through structured assessment', scores: { ready: 0, growing: 2, advanced: 0 } },
        { text: 'Cascade detection and cross-zone insights', scores: { ready: 0, growing: 1, advanced: 1 } },
        { text: 'All of the above, plus practice scalability', scores: { ready: 0, growing: 0, advanced: 2 } },
      ],
    },
  ],
  resultCategories: [
    {
      id: 'result-ready',
      category: 'ready',
      title: 'Ready for Transformation',
      description: 'Your practice relies heavily on manual processes. VitalMatrix would deliver the most dramatic transformation to your workflow, saving hours per week and introducing structured terrain assessment from day one.',
      zoneHighlight: 'All zones',
      recommendation: 'Start with the VitalMatrix founding cohort to transform your assessment workflow from manual to structured clinical intelligence.',
      ctaText: 'Join the Founding Cohort',
      ctaUrl: `https://${VM_BRAND.platform.domain}/founding-cohort`,
      shareText: 'I just discovered my practice is ready for a clinical intelligence transformation. Is yours?',
    },
    {
      id: 'result-growing',
      category: 'growing',
      title: 'Growing Into Clinical Intelligence',
      description: 'You have already started structuring your assessment workflow. VitalMatrix would build on your existing foundation, adding automated scoring, cascade detection, and reproducible assessments.',
      zoneHighlight: 'All zones',
      recommendation: 'VitalMatrix will accelerate your journey from structured assessment to true clinical intelligence with automated scoring and cascade detection.',
      ctaText: 'See How VitalMatrix Builds on Your Foundation',
      ctaUrl: `https://${VM_BRAND.platform.domain}/discovery`,
      shareText: 'My practice is growing into clinical intelligence. Take this quiz to see where you stand.',
    },
    {
      id: 'result-advanced',
      category: 'advanced',
      title: 'Advanced Practice, Ready to Scale',
      description: 'Your practice already uses structured approaches. VitalMatrix would give you the scalability and cross-zone intelligence to take your practice to the next level without sacrificing clinical depth.',
      zoneHighlight: 'Z5',
      recommendation: 'As an advanced practitioner, you will benefit most from Zone 5 coherence analysis and the full cascade detection capability.',
      ctaText: 'Book a Discovery Call',
      ctaUrl: `https://${VM_BRAND.platform.domain}/discovery`,
      shareText: 'My practice is ready to scale with clinical intelligence. Find out your readiness level.',
    },
  ],
};

/** Quiz 3: What Type of Functional Medicine Practitioner Are You? */
const ARCHETYPE_QUIZ: Quiz = {
  id: 'quiz-practitioner-archetype',
  title: 'What Type of Functional Medicine Practitioner Are You?',
  description: 'Discover your practitioner archetype. 7 questions that reveal your clinical style and how VitalMatrix complements it. For practitioners only.',
  leadCaptureEnabled: true,
  shareableOnSocial: true,
  questions: [
    {
      id: 'aq-01',
      question: 'How do you approach a new complex patient?',
      options: [
        { text: 'I follow a structured protocol, step by step', scores: { systematic: 3, intuitive: 0, evidence: 1, holistic: 0 } },
        { text: 'I listen and let the patterns emerge', scores: { systematic: 0, intuitive: 3, evidence: 0, holistic: 1 } },
        { text: 'I review the latest research on their presentation', scores: { systematic: 0, intuitive: 0, evidence: 3, holistic: 1 } },
        { text: 'I assess every system before narrowing focus', scores: { systematic: 1, intuitive: 0, evidence: 0, holistic: 3 } },
      ],
    },
    {
      id: 'aq-02',
      question: 'What drives your clinical decisions most?',
      options: [
        { text: 'Reproducible frameworks and decision trees', scores: { systematic: 3, intuitive: 0, evidence: 1, holistic: 0 } },
        { text: 'Clinical experience and pattern recognition', scores: { systematic: 0, intuitive: 3, evidence: 0, holistic: 1 } },
        { text: 'Published evidence and clinical trials', scores: { systematic: 0, intuitive: 0, evidence: 3, holistic: 0 } },
        { text: 'The interconnection between all systems', scores: { systematic: 0, intuitive: 1, evidence: 0, holistic: 3 } },
      ],
    },
    {
      id: 'aq-03',
      question: 'How do you feel about clinical scoring systems?',
      options: [
        { text: 'Essential for consistency and quality', scores: { systematic: 3, intuitive: 0, evidence: 1, holistic: 0 } },
        { text: 'Useful but can miss nuance', scores: { systematic: 1, intuitive: 2, evidence: 0, holistic: 1 } },
        { text: 'Valuable when validated by research', scores: { systematic: 0, intuitive: 0, evidence: 3, holistic: 0 } },
        { text: 'Best when they capture whole-system dynamics', scores: { systematic: 0, intuitive: 0, evidence: 0, holistic: 3 } },
      ],
    },
    {
      id: 'aq-04',
      question: 'When a treatment is not working, what do you do first?',
      options: [
        { text: 'Revisit my protocol and check each step', scores: { systematic: 3, intuitive: 0, evidence: 0, holistic: 1 } },
        { text: 'Trust my gut and adjust based on clinical instinct', scores: { systematic: 0, intuitive: 3, evidence: 0, holistic: 0 } },
        { text: 'Search for new evidence or alternative approaches', scores: { systematic: 0, intuitive: 0, evidence: 3, holistic: 0 } },
        { text: 'Look for upstream drivers in other systems', scores: { systematic: 0, intuitive: 1, evidence: 0, holistic: 3 } },
      ],
    },
    {
      id: 'aq-05',
      question: 'How do you prefer to learn new clinical approaches?',
      options: [
        { text: 'Structured courses with clear frameworks', scores: { systematic: 3, intuitive: 0, evidence: 1, holistic: 0 } },
        { text: 'Mentorship and clinical observation', scores: { systematic: 0, intuitive: 3, evidence: 0, holistic: 1 } },
        { text: 'Research papers and systematic reviews', scores: { systematic: 0, intuitive: 0, evidence: 3, holistic: 0 } },
        { text: 'Conferences that connect multiple disciplines', scores: { systematic: 0, intuitive: 1, evidence: 0, holistic: 3 } },
      ],
    },
    {
      id: 'aq-06',
      question: 'What is your ideal patient documentation?',
      options: [
        { text: 'Structured templates with standardised fields', scores: { systematic: 3, intuitive: 0, evidence: 0, holistic: 0 } },
        { text: 'Narrative notes that capture the patient story', scores: { systematic: 0, intuitive: 3, evidence: 0, holistic: 1 } },
        { text: 'Evidence-linked records with reference citations', scores: { systematic: 0, intuitive: 0, evidence: 3, holistic: 0 } },
        { text: 'System maps showing interconnections', scores: { systematic: 0, intuitive: 0, evidence: 0, holistic: 3 } },
      ],
    },
    {
      id: 'aq-07',
      question: 'What excites you most about clinical intelligence tools?',
      options: [
        { text: 'Standardisation and reproducibility', scores: { systematic: 3, intuitive: 0, evidence: 1, holistic: 0 } },
        { text: 'Augmenting my clinical instinct with data', scores: { systematic: 0, intuitive: 3, evidence: 1, holistic: 0 } },
        { text: 'Evidence-tiered outputs and transparency', scores: { systematic: 0, intuitive: 0, evidence: 3, holistic: 0 } },
        { text: 'Seeing the whole terrain in one view', scores: { systematic: 0, intuitive: 0, evidence: 0, holistic: 3 } },
      ],
    },
  ],
  resultCategories: [
    {
      id: 'result-systematic',
      category: 'systematic',
      title: 'The Systematic Practitioner',
      description: 'You value structure, reproducibility, and clear clinical frameworks. You build protocols and follow them rigorously. VitalMatrix was designed for practitioners like you: 30 STRIDE rules, standardised scoring, and reproducible assessments.',
      zoneHighlight: 'All zones with structured scoring',
      recommendation: 'You will love VitalMatrix STRIDE rules and standardised node scoring. Your practice will benefit immediately from reproducible, structured terrain assessment.',
      ctaText: 'See Structured Assessment in Action',
      ctaUrl: `https://${VM_BRAND.platform.domain}/features/stride`,
      shareText: 'I am a Systematic Practitioner. Structure, reproducibility, and rigour define my clinical style. What is your archetype?',
    },
    {
      id: 'result-intuitive',
      category: 'intuitive',
      title: 'The Intuitive Practitioner',
      description: 'You trust clinical experience and pattern recognition. Your instinct guides your assessment. VitalMatrix augments your intuition with structured data, confirming patterns and revealing cascades your instinct suspects but cannot prove.',
      zoneHighlight: 'Z5 coherence analysis',
      recommendation: 'VitalMatrix will not replace your intuition. It will give it data. Cascade detection and zone scoring will confirm the patterns you already sense.',
      ctaText: 'Discover How Data Augments Intuition',
      ctaUrl: `https://${VM_BRAND.platform.domain}/discovery`,
      shareText: 'I am an Intuitive Practitioner. Pattern recognition and clinical experience guide my practice. Find your archetype.',
    },
    {
      id: 'result-evidence',
      category: 'evidence',
      title: 'The Evidence-Focused Practitioner',
      description: 'You demand evidence for every clinical decision. Research drives your practice. VitalMatrix applies evidence tiers (Established, Emerging, Theoretical, Observed in Practice, Contested) to every clinical element.',
      zoneHighlight: 'Evidence-tiered outputs across all zones',
      recommendation: 'VitalMatrix evidence tiers on every output will speak directly to your practice philosophy. Transparent, tiered, and reference-linked.',
      ctaText: 'Explore Evidence-Tiered Assessment',
      ctaUrl: `https://${VM_BRAND.platform.domain}/features/evidence-tiers`,
      shareText: 'I am an Evidence-Focused Practitioner. If it is not evidence-tiered, I do not use it. What is your archetype?',
    },
    {
      id: 'result-holistic',
      category: 'holistic',
      title: 'The Holistic Systems Practitioner',
      description: 'You see the whole patient. Every system connects to every other system. You are frustrated by tools that assess in silos. VitalMatrix Zone 5 coherence analysis and cascade detection were built for exactly this clinical philosophy.',
      zoneHighlight: 'Z5 whole-system coherence',
      recommendation: 'Zone 5 coherence analysis and the 6 cascade stacks will transform how you see cross-system interactions. This is whole-terrain thinking, quantified.',
      ctaText: 'See Whole-System Assessment',
      ctaUrl: `https://${VM_BRAND.platform.domain}/zones/z5`,
      shareText: 'I am a Holistic Systems Practitioner. I see every connection. VitalMatrix sees them too. Find your archetype.',
    },
  ],
};

/** All pre-built quizzes indexed by ID */
const QUIZ_REGISTRY: Record<string, Quiz> = {
  'quiz-zone-assessment': ZONE_QUIZ,
  'quiz-practice-readiness': READINESS_QUIZ,
  'quiz-practitioner-archetype': ARCHETYPE_QUIZ,
};

// --- State ---

/** Internal store for quiz submissions */
const submissionStore: QuizSubmission[] = [];

// --- Core Functions ---

/**
 * Retrieves a pre-built quiz by ID.
 * @param id - Quiz identifier
 * @returns Quiz definition or undefined if not found
 */
export function getQuiz(id: string): Quiz | undefined {
  return QUIZ_REGISTRY[id];
}

/**
 * Returns all available quiz IDs.
 * @returns Array of quiz identifiers
 */
export function listQuizzes(): string[] {
  return Object.keys(QUIZ_REGISTRY);
}

/**
 * Calculates the quiz result based on submitted answers.
 * @param quiz - The quiz definition
 * @param answers - Map of question ID to selected option text
 * @returns The winning QuizResult category
 */
export function calculateResult(
  quiz: Quiz,
  answers: Record<string, string>
): QuizResult {
  const totals: Record<string, number> = {};

  // Initialise all score categories from first question's first option
  for (const question of quiz.questions) {
    for (const option of question.options) {
      for (const key of Object.keys(option.scores)) {
        if (!(key in totals)) {
          totals[key] = 0;
        }
      }
    }
  }

  // Accumulate scores
  for (const question of quiz.questions) {
    const answer = answers[question.id];
    if (!answer) continue;

    const selectedOption = question.options.find(o => o.text === answer);
    if (!selectedOption) continue;

    for (const [key, value] of Object.entries(selectedOption.scores)) {
      totals[key] = (totals[key] || 0) + value;
    }
  }

  // Find highest scoring category
  let maxCategory = '';
  let maxScore = -1;
  for (const [category, score] of Object.entries(totals)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category;
    }
  }

  // Match to result
  const result = quiz.resultCategories.find(r => r.category === maxCategory);
  if (!result) {
    return quiz.resultCategories[0];
  }

  return result;
}

/**
 * Submits quiz answers, stores the submission, and returns the result.
 * @param quizId - Quiz identifier
 * @param answers - Map of question ID to selected option text
 * @param email - Optional email for lead capture
 * @returns QuizResult for the submission
 */
export function submitQuiz(
  quizId: string,
  answers: Record<string, string>,
  email?: string
): QuizResult {
  const quiz = QUIZ_REGISTRY[quizId];
  if (!quiz) {
    throw new Error(`Quiz not found: ${quizId}`);
  }

  const result = calculateResult(quiz, answers);

  const submission: QuizSubmission = {
    quizId,
    answers,
    resultCategory: result.category,
    email,
    capturedAt: new Date().toISOString(),
  };

  submissionStore.push(submission);
  return result;
}

/**
 * Generates a full self-contained HTML page for a quiz.
 * Includes VM styling, interactive quiz flow, result display,
 * email capture, and social share buttons.
 * @param quiz - The quiz definition
 * @returns Complete HTML string
 */
export function generateQuizHtml(quiz: Quiz): string {
  const { colours, fonts } = VM_BRAND;

  const questionsJson = JSON.stringify(quiz.questions);
  const resultsJson = JSON.stringify(quiz.resultCategories);

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${quiz.title} | VitalMatrix</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --vm-prussian-blue: ${colours.prussianBlue};
      --vm-charcoal: ${colours.charcoal};
      --vm-deep-teal: ${colours.deepTeal};
      --vm-gold: ${colours.gold};
      --vm-teal: ${colours.teal};
      --vm-purple: ${colours.purple};
      --vm-sage: ${colours.sage};
      --vm-white: ${colours.white};
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: '${fonts.body}', sans-serif;
      background: var(--vm-prussian-blue);
      color: var(--vm-white);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }

    .quiz-container {
      max-width: 680px;
      width: 100%;
    }

    h1 {
      font-family: '${fonts.heading}', serif;
      font-size: 2rem;
      color: var(--vm-gold);
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .description {
      text-align: center;
      opacity: 0.8;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: var(--vm-charcoal);
      border-radius: 2px;
      margin-bottom: 2rem;
    }

    .progress-fill {
      height: 100%;
      background: var(--vm-gold);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .question-card {
      background: var(--vm-charcoal);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      display: none;
    }

    .question-card.active { display: block; }

    .question-text {
      font-family: '${fonts.heading}', serif;
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
      color: var(--vm-white);
    }

    .question-number {
      font-family: '${fonts.data}', monospace;
      font-size: 0.8rem;
      color: var(--vm-gold);
      margin-bottom: 0.5rem;
    }

    .option {
      display: block;
      width: 100%;
      padding: 1rem;
      margin-bottom: 0.75rem;
      background: var(--vm-prussian-blue);
      border: 1px solid rgba(244, 241, 235, 0.15);
      border-radius: 8px;
      color: var(--vm-white);
      font-family: '${fonts.body}', sans-serif;
      font-size: 0.95rem;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }

    .option:hover {
      border-color: var(--vm-gold);
      background: rgba(201, 168, 76, 0.1);
    }

    .option.selected {
      border-color: var(--vm-gold);
      background: rgba(201, 168, 76, 0.2);
    }

    .result-card {
      background: var(--vm-charcoal);
      border-radius: 12px;
      padding: 2.5rem;
      text-align: center;
      display: none;
    }

    .result-card.active { display: block; }

    .result-title {
      font-family: '${fonts.heading}', serif;
      font-size: 1.6rem;
      color: var(--vm-gold);
      margin-bottom: 1rem;
    }

    .result-description {
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .result-recommendation {
      background: var(--vm-deep-teal);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      text-align: left;
    }

    .cta-button {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: var(--vm-gold);
      color: var(--vm-prussian-blue);
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 0.5rem;
      cursor: pointer;
      border: none;
      font-size: 1rem;
    }

    .email-capture {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: var(--vm-prussian-blue);
      border-radius: 8px;
    }

    .email-capture input {
      padding: 0.75rem 1rem;
      border: 1px solid rgba(244, 241, 235, 0.3);
      border-radius: 6px;
      background: var(--vm-charcoal);
      color: var(--vm-white);
      width: 100%;
      max-width: 300px;
      margin-bottom: 0.75rem;
      font-family: '${fonts.body}', sans-serif;
    }

    .share-buttons {
      margin-top: 1.5rem;
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .share-btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: 1px solid var(--vm-teal);
      background: transparent;
      color: var(--vm-teal);
      cursor: pointer;
      font-size: 0.85rem;
    }

    .footer {
      margin-top: 2rem;
      font-size: 0.75rem;
      opacity: 0.6;
      text-align: center;
    }

    .practitioner-notice {
      font-family: '${fonts.data}', monospace;
      font-size: 0.7rem;
      color: var(--vm-gold);
      text-align: center;
      margin-top: 1rem;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <h1>${quiz.title}</h1>
    <p class="description">${quiz.description}</p>

    <div class="progress-bar">
      <div class="progress-fill" id="progress" style="width: 0%"></div>
    </div>

    <div id="questions"></div>

    <div class="result-card" id="result">
      <h2 class="result-title" id="result-title"></h2>
      <p class="result-description" id="result-description"></p>
      <div class="result-recommendation" id="result-recommendation"></div>
      <a class="cta-button" id="result-cta" href="#">Explore VitalMatrix</a>

      ${quiz.leadCaptureEnabled ? `
      <div class="email-capture">
        <p style="margin-bottom: 0.75rem; font-size: 0.9rem;">Get your detailed results and a personalised assessment guide:</p>
        <input type="email" id="email-input" placeholder="your@email.com" />
        <br />
        <button class="cta-button" onclick="captureEmail()" style="font-size: 0.85rem; padding: 0.5rem 1.5rem;">Send My Results</button>
      </div>` : ''}

      ${quiz.shareableOnSocial ? `
      <div class="share-buttons">
        <button class="share-btn" onclick="shareResult('linkedin')">Share on LinkedIn</button>
        <button class="share-btn" onclick="shareResult('x')">Share on X</button>
        <button class="share-btn" onclick="shareResult('facebook')">Share on Facebook</button>
      </div>` : ''}
    </div>

    <p class="practitioner-notice">For practitioner use only. Not for patient distribution.</p>
    <p class="footer">${VM_BRAND.regulatoryFooter}</p>
  </div>

  <script>
    const questions = ${questionsJson};
    const resultCategories = ${resultsJson};
    let current = 0;
    const answers = {};

    function renderQuestions() {
      const container = document.getElementById('questions');
      questions.forEach(function(q, i) {
        const card = document.createElement('div');
        card.className = 'question-card' + (i === 0 ? ' active' : '');
        card.id = 'q-' + i;

        let html = '<p class="question-number">Question ' + (i + 1) + ' of ' + questions.length + '</p>';
        html += '<p class="question-text">' + q.question + '</p>';

        q.options.forEach(function(opt) {
          html += '<button class="option" onclick="selectOption(' + i + ', this, \\'' + opt.text.replace(/'/g, "\\\\'") + '\\')">' + opt.text + '</button>';
        });

        card.innerHTML = html;
        container.appendChild(card);
      });
    }

    function selectOption(qIndex, el, optionText) {
      const card = document.getElementById('q-' + qIndex);
      card.querySelectorAll('.option').forEach(function(b) { b.classList.remove('selected'); });
      el.classList.add('selected');

      answers[questions[qIndex].id] = optionText;

      setTimeout(function() {
        if (qIndex < questions.length - 1) {
          card.classList.remove('active');
          document.getElementById('q-' + (qIndex + 1)).classList.add('active');
          current = qIndex + 1;
          document.getElementById('progress').style.width = ((current + 1) / questions.length * 100) + '%';
        } else {
          showResult();
        }
      }, 300);
    }

    function showResult() {
      document.getElementById('q-' + current).classList.remove('active');
      document.getElementById('progress').style.width = '100%';

      var totals = {};
      resultCategories.forEach(function(r) { totals[r.category] = 0; });

      questions.forEach(function(q) {
        var answer = answers[q.id];
        if (!answer) return;
        var opt = q.options.find(function(o) { return o.text === answer; });
        if (!opt) return;
        Object.keys(opt.scores).forEach(function(k) {
          totals[k] = (totals[k] || 0) + opt.scores[k];
        });
      });

      var maxCat = '';
      var maxScore = -1;
      Object.keys(totals).forEach(function(k) {
        if (totals[k] > maxScore) { maxScore = totals[k]; maxCat = k; }
      });

      var result = resultCategories.find(function(r) { return r.category === maxCat; }) || resultCategories[0];

      document.getElementById('result-title').textContent = result.title;
      document.getElementById('result-description').textContent = result.description;
      document.getElementById('result-recommendation').textContent = result.recommendation;
      document.getElementById('result-cta').textContent = result.ctaText;
      document.getElementById('result-cta').href = result.ctaUrl;
      document.getElementById('result').classList.add('active');

      window.quizResult = result;
    }

    function captureEmail() {
      var email = document.getElementById('email-input').value;
      if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
      alert('Thank you! Your detailed results will be sent to ' + email);
    }

    function shareResult(platform) {
      var result = window.quizResult;
      if (!result) return;
      var text = encodeURIComponent(result.shareText + ' | VitalMatrix');
      var url = encodeURIComponent(result.ctaUrl);
      var shareUrl = '';
      if (platform === 'linkedin') shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
      else if (platform === 'x') shareUrl = 'https://x.com/intent/tweet?text=' + text + '&url=' + url;
      else if (platform === 'facebook') shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    renderQuestions();
  </script>
</body>
</html>`;
}

/**
 * Generates a shareable result card description for social media.
 * @param result - The quiz result to create a share card for
 * @returns Share card content object
 */
export function generateQuizShareCard(result: QuizResult): {
  title: string;
  description: string;
  imageDescription: string;
  shareText: string;
  url: string;
} {
  return {
    title: result.title,
    description: result.description,
    imageDescription: `Visual card: "${result.title}" on ${VM_BRAND.colours.prussianBlue} background. Gold accent text. VitalMatrix logo bottom-centre. Zone highlight: ${result.zoneHighlight}. Cormorant Garamond heading, Outfit body text. "For practitioner use only" watermark.`,
    shareText: result.shareText,
    url: result.ctaUrl,
  };
}

/**
 * Returns all submissions for a given quiz.
 * @param quizId - Quiz identifier
 * @returns Array of submissions
 */
export function getSubmissions(quizId: string): QuizSubmission[] {
  return submissionStore.filter(s => s.quizId === quizId);
}

/**
 * Generates an analytics report for a quiz.
 * @param quizId - Quiz identifier
 * @returns QuizReport with completion and conversion metrics
 */
export function generateQuizReport(quizId: string): QuizReport {
  const quiz = QUIZ_REGISTRY[quizId];
  if (!quiz) {
    throw new Error(`Quiz not found: ${quizId}`);
  }

  const submissions = submissionStore.filter(s => s.quizId === quizId);
  const withEmail = submissions.filter(s => s.email);

  const resultDistribution: Record<string, number> = {};
  for (const result of quiz.resultCategories) {
    resultDistribution[result.category] = submissions.filter(s => s.resultCategory === result.category).length;
  }

  return {
    quizId,
    totalSubmissions: submissions.length,
    completionRate: submissions.length > 0 ? 100 : 0,
    resultDistribution,
    emailCaptureRate: submissions.length > 0
      ? Math.round((withEmail.length / submissions.length) * 100)
      : 0,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Clears all quiz submissions.
 */
export function clearSubmissions(): void {
  submissionStore.length = 0;
}

/**
 * Returns all quiz submissions. Intended for reporting and export.
 */
export function getAllSubmissions(): QuizSubmission[] {
  return [...submissionStore];
}

/**
 * Exports all submissions as a JSON string.
 */
export function exportToJson(): string {
  return JSON.stringify(getAllSubmissions(), null, 2);
}

/**
 * Imports submissions from a JSON string, replacing the current store.
 */
export function importFromJson(json: string): void {
  const items: QuizSubmission[] = JSON.parse(json);
  clearSubmissions();
  for (const item of items) {
    submissionStore.push(item);
  }
}
