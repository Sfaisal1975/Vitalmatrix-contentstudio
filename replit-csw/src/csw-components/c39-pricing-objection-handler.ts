/**
 * Component 39: Pricing Objection Handler
 *
 * Context-aware pricing objection responses for the VitalMatrix sales
 * process. 10 pre-built objections across 5 categories, with segment-
 * specific variants (IFM-trained vs non-IFM, solo vs group practice).
 *
 * Generates FAQ pages and a markdown sales playbook for Dr Faisal.
 * British English throughout.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Category of pricing objection. */
export type ObjectionCategory = 'cost' | 'value' | 'comparison' | 'timing' | 'trust' | 'technical';

/** A single pricing objection. */
export interface Objection {
  /** Unique objection identifier. */
  id: string;
  /** The objection as stated by the prospect. */
  objectionText: string;
  /** Classification category. */
  category: ObjectionCategory;
}

/** A complete objection response with segment variants. */
export interface ObjectionResponse {
  /** The original objection. */
  objection: Objection;
  /** The primary response text. */
  response: string;
  /** Supporting data point or statistic. */
  supportingData: string;
  /** Segment-specific response variants. */
  segmentVariant: Record<string, string>;
}

// --- Pre-Built Objections ---

const OBJECTIONS: Objection[] = [
  {
    id: 'OBJ-001',
    objectionText: 'It is too expensive.',
    category: 'cost',
  },
  {
    id: 'OBJ-002',
    objectionText: 'What is the ROI?',
    category: 'value',
  },
  {
    id: 'OBJ-003',
    objectionText: 'Can I try it first?',
    category: 'timing',
  },
  {
    id: 'OBJ-004',
    objectionText: 'What if I do not like it?',
    category: 'trust',
  },
  {
    id: 'OBJ-005',
    objectionText: 'There are cheaper alternatives.',
    category: 'comparison',
  },
  {
    id: 'OBJ-006',
    objectionText: 'I am not sure I need it yet.',
    category: 'timing',
  },
  {
    id: 'OBJ-007',
    objectionText: 'My practice is too small.',
    category: 'value',
  },
  {
    id: 'OBJ-008',
    objectionText: 'I do not trust AI.',
    category: 'trust',
  },
  {
    id: 'OBJ-009',
    objectionText: 'What about data security?',
    category: 'technical',
  },
  {
    id: 'OBJ-010',
    objectionText: 'Why should I be first?',
    category: 'timing',
  },
];

// --- Pre-Built Responses ---

const RESPONSES: ObjectionResponse[] = [
  {
    objection: OBJECTIONS[0],
    response: `GBP ${VM_BRAND.pricing.foundingMonthly}/month is less than the cost of a single comprehensive functional medicine consultation. VitalMatrix replaces hours of manual assessment work per patient, covering 7 clinical nodes and 5 zones in a fraction of the time. The founding rate is fixed for ${VM_BRAND.pricing.foundingFixedMonths} months -- it will never increase during that period.`,
    supportingData: `Average functional medicine initial consultation: GBP 350-500. VitalMatrix cost per patient (at 15 patients/month): under GBP ${Math.ceil(VM_BRAND.pricing.foundingMonthly / 15)}.`,
    segmentVariant: {
      'ifm-trained': `As an IFM-trained practitioner, you already invest significantly in continuing education. VitalMatrix at GBP ${VM_BRAND.pricing.foundingMonthly}/month is the clinical tool that makes that education actionable across every patient encounter.`,
      'non-ifm': `At GBP ${VM_BRAND.pricing.foundingMonthly}/month, VitalMatrix provides the structured assessment framework that would otherwise require years of functional medicine training to develop manually.`,
      'solo-practice': `For a solo practitioner, GBP ${VM_BRAND.pricing.foundingMonthly}/month is a fixed overhead that scales with your patient volume. The more patients you assess, the lower the per-patient cost becomes.`,
      'group-practice': 'For group practices, a single VitalMatrix subscription can standardise assessment quality across all practitioners, ensuring consistent terrain mapping regardless of individual experience level.',
    },
  },
  {
    objection: OBJECTIONS[1],
    response: 'The ROI operates on three levels. First, time savings: the INTAKE-to-assessment pipeline reduces manual clinical reasoning time by approximately 60%. Second, patient retention: practitioners using structured terrain mapping report higher patient engagement and longer treatment relationships. Third, differentiation: VitalMatrix positions your practice as technologically advanced in a market where most functional medicine is still delivered on paper.',
    supportingData: 'Time saving estimate: 45 minutes per patient assessment. At 15 patients/month, that is over 11 hours reclaimed. At a conservative GBP 150/hour practitioner rate, that is GBP 1,650/month in recovered capacity.',
    segmentVariant: {
      'ifm-trained': 'Your IFM training already gives you the clinical framework. VitalMatrix removes the bottleneck between knowing what to assess and actually doing it systematically across 7 nodes.',
      'non-ifm': 'VitalMatrix provides the structured clinical intelligence that accelerates your functional medicine learning curve. The ROI includes the education embedded in the assessment framework itself.',
      'solo-practice': 'As a solo practitioner, your time is your most constrained resource. VitalMatrix gives you back over 11 hours per month at 15 patients -- that is nearly two full clinical days.',
      'group-practice': 'The ROI multiplies across your team. One subscription standardising assessment for 3 practitioners saves over 33 hours monthly.',
    },
  },
  {
    objection: OBJECTIONS[2],
    response: `VitalMatrix is a founding cohort programme, not a trial product. The founding rate of GBP ${VM_BRAND.pricing.foundingMonthly}/month reflects early adopter commitment, and in return you receive a ${VM_BRAND.pricing.guarantee} plus direct input into platform development. We do not offer free trials because the clinical value only becomes apparent after you have assessed at least 3-5 patients and can see terrain patterns emerging.`,
    supportingData: `Founding cohort: 10 spots only. GBP ${VM_BRAND.pricing.foundingMonthly}/month fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Standard pricing after founding period: GBP ${VM_BRAND.pricing.standardRate}/month.`,
    segmentVariant: {
      'ifm-trained': 'As an IFM-trained practitioner, you will recognise the clinical logic within minutes. The INTAKE maps directly to the functional medicine matrix you already know, extended to 7 nodes.',
      'non-ifm': 'Rather than a trial, we offer a discovery call where Dr Faisal walks through a live assessment using your own clinical scenarios. You see the platform working with real clinical logic before committing.',
      'solo-practice': 'We understand the caution. That is why the founding rate is the lowest VitalMatrix will ever be. The risk is minimal; the upside is a permanently locked rate on a platform that will only grow in capability.',
      'group-practice': 'For group practices considering a trial, we can arrange a live demonstration session for your entire team with Dr Faisal.',
    },
  },
  {
    objection: OBJECTIONS[3],
    response: 'Your founding cohort membership is month-to-month. There is no annual lock-in. If VitalMatrix does not transform your clinical assessment within the first 90 days, you can cancel with no penalty. However, if you cancel and wish to return later, the founding rate will no longer be available.',
    supportingData: 'No annual contract. Month-to-month billing. Cancel any time. Founding rate is forfeited upon cancellation and cannot be reinstated.',
    segmentVariant: {
      'ifm-trained': 'IFM-trained practitioners consistently find that the terrain mapping validates and extends their existing clinical reasoning. The question is rarely whether you like it, but how quickly it becomes indispensable.',
      'non-ifm': 'The 90-day window gives you time to assess at least 15-20 patients and see genuine terrain patterns. Most practitioners report a shift in clinical confidence within the first month.',
      'solo-practice': `Month-to-month means you control the commitment entirely. No risk beyond a single month at GBP ${VM_BRAND.pricing.foundingMonthly}.`,
      'group-practice': 'Month-to-month terms let you pilot with one practitioner before rolling out across the team.',
    },
  },
  {
    objection: OBJECTIONS[4],
    response: 'There is no direct alternative to VitalMatrix. Generic practice management software does not map clinical terrain across 7 nodes and 5 zones. EHR add-ons do not run the FLINT-to-VISTA pipeline. The platforms that appear cheaper are solving a fundamentally different problem -- they manage records, not clinical intelligence.',
    supportingData: 'VitalMatrix covers: 7 nodes, 5 zones, 6 stacks, structured INTAKE, DeltaScan, cascade mapping. No alternative provides this integrated clinical terrain framework.',
    segmentVariant: {
      'ifm-trained': 'You know from IFM training that the functional medicine matrix requires a systems-thinking tool. Spreadsheets and generic EHRs cannot model cascade interactions across nodes.',
      'non-ifm': 'The tools that appear cheaper -- practice management, basic EHR, symptom trackers -- solve operational problems. VitalMatrix solves the clinical reasoning problem.',
      'solo-practice': 'Cheaper tools save you money on administration. VitalMatrix saves you money on clinical decision-making time, which is far more valuable per hour.',
      'group-practice': 'For multi-practitioner settings, standardised clinical intelligence is worth far more than standardised record-keeping. The latter is commodity; the former is competitive advantage.',
    },
  },
  {
    objection: OBJECTIONS[5],
    response: `The founding cohort exists now and will not reopen. Every month you wait is a month where your patients do not benefit from structured terrain assessment, and a month closer to the cohort filling completely. The GBP ${VM_BRAND.pricing.foundingMonthly}/month rate is available only during this window.`,
    supportingData: `Founding cohort: limited to 10 practitioners. Once filled, standard pricing applies (GBP ${VM_BRAND.pricing.standardRate}/month). No backdated founding rates.`,
    segmentVariant: {
      'ifm-trained': 'If you are practising functional medicine, you need it now. Every patient you assess without structured terrain mapping is a missed opportunity for deeper clinical insight.',
      'non-ifm': `Waiting until you feel "ready" means paying GBP ${VM_BRAND.pricing.standardRate - VM_BRAND.pricing.foundingMonthly}/month more after the founding period. The platform itself accelerates your readiness through its structured assessment framework.`,
      'solo-practice': `Solo practitioners who delay often find that the founding cohort has closed. The financial difference over 12 months is GBP ${(VM_BRAND.pricing.standardRate - VM_BRAND.pricing.foundingMonthly) * 12}.`,
      'group-practice': 'Early adoption gives your practice a differentiation advantage over competitors who adopt later at a higher price point.',
    },
  },
  {
    objection: OBJECTIONS[6],
    response: 'VitalMatrix was designed for practitioners who see as few as 5 patients per month. The structured assessment framework actually matters more in small practices, where each patient encounter must deliver maximum clinical value. You cannot afford to waste assessment time -- VitalMatrix ensures you do not.',
    supportingData: 'Break-even: if VitalMatrix saves 45 minutes per patient and you see 5 patients/month, that is 3.75 hours recovered. At GBP 150/hour, the value exceeds the subscription cost.',
    segmentVariant: {
      'ifm-trained': 'Small practices with IFM training are precisely the audience VitalMatrix serves best. Your clinical depth deserves a platform that matches it, regardless of patient volume.',
      'non-ifm': 'A smaller practice means you need every competitive advantage available. VitalMatrix positions even a 5-patient-per-month practice as clinically sophisticated.',
      'solo-practice': 'Solo with low volume is exactly when you need the most structured clinical support. VitalMatrix acts as your clinical intelligence partner.',
      'group-practice': 'Even small group practices benefit from assessment standardisation. VitalMatrix ensures quality is consistent across practitioners regardless of practice size.',
    },
  },
  {
    objection: OBJECTIONS[7],
    response: 'VitalMatrix is not an AI that replaces clinical judgement. It is a ${descriptor} that structures and accelerates the clinical reasoning you already perform. The 7-node, 5-zone framework is based on established functional medicine principles, not black-box algorithms. Every connection, score, and recommendation is transparent and clinically traceable.',
    supportingData: 'VitalMatrix uses rule-based terrain mapping (FLINT-to-VISTA pipeline), not opaque machine learning. Every output can be traced to specific clinical inputs and evidence-tiered rationale.',
    segmentVariant: {
      'ifm-trained': 'The assessment logic mirrors and extends IFM clinical reasoning. You will recognise the framework immediately. This is your clinical thinking, structured and accelerated.',
      'non-ifm': 'Think of VitalMatrix as a structured clinical checklist, not artificial intelligence. It ensures you consider all 7 nodes systematically, based on evidence-tiered clinical logic.',
      'solo-practice': 'As a solo practitioner, you do not have colleagues to validate clinical reasoning against. VitalMatrix provides that structured second perspective.',
      'group-practice': 'For group practices, VitalMatrix standardises the clinical framework without removing individual clinical judgement. Each practitioner still interprets the terrain map.',
    },
  },
  {
    objection: OBJECTIONS[8],
    response: 'VitalMatrix is registered with the ICO (${ico}) and complies with UK GDPR. Patient data is encrypted at rest and in transit. We do not sell, share, or use patient data for any purpose beyond the practitioner-patient clinical relationship. Data residency is UK-based.',
    supportingData: `ICO registration: ${VM_BRAND.platform.ico}. UK GDPR compliant. AES-256 encryption. UK data residency. No third-party data sharing.`,
    segmentVariant: {
      'ifm-trained': 'Your IFM practice likely already handles sensitive patient data. VitalMatrix meets or exceeds the same regulatory standards with the added assurance of ICO registration.',
      'non-ifm': 'Data security is non-negotiable for clinical platforms. VitalMatrix is fully ICO-registered and UK GDPR compliant -- the same standards required of NHS-adjacent systems.',
      'solo-practice': 'As a solo practitioner, a data breach would be devastating. VitalMatrix handles the security infrastructure so you do not have to build it yourself.',
      'group-practice': 'For group practices with multiple data access points, VitalMatrix provides role-based access controls and full audit logging.',
    },
  },
  {
    objection: OBJECTIONS[9],
    response: `Being first means founding rate pricing fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. It means direct access to Dr Faisal and influence over platform development. It means your clinical feedback shapes the terrain mapping that every future practitioner will use. Early adopters in every technology platform gain disproportionate advantage -- and in clinical intelligence, that advantage compounds with every patient assessed.`,
    supportingData: `Founding cohort benefits: GBP ${VM_BRAND.pricing.foundingMonthly}/month fixed for ${VM_BRAND.pricing.foundingFixedMonths} months, direct development input, priority support, recognition as a founding practitioner in the VitalMatrix community.`,
    segmentVariant: {
      'ifm-trained': 'IFM-trained practitioners who adopt early will define how VitalMatrix maps terrain. Your clinical expertise directly shapes the platform.',
      'non-ifm': 'Being first gives you the structured framework before your competitors discover it. By the time others adopt, you will have months of clinical data and expertise.',
      'solo-practice': 'Solo practitioners who adopt first build the deepest patient datasets. Your terrain intelligence grows with every assessment.',
      'group-practice': 'First-mover group practices can establish VitalMatrix as a standard of care before competitors adopt, creating a genuine market differentiator.',
    },
  },
];

// --- Core Functions ---

/**
 * Returns the response for a specific objection, optionally tailored
 * to a practitioner segment.
 *
 * @param objectionId - The objection identifier (e.g. 'OBJ-001').
 * @param segment - Optional segment key for variant response.
 * @returns The ObjectionResponse, or undefined if not found.
 */
export function getResponse(objectionId: string, segment?: string): ObjectionResponse | undefined {
  const response = RESPONSES.find(r => r.objection.id === objectionId);
  if (!response) return undefined;

  // Replace template variables in the response text
  const processedResponse = { ...response };
  processedResponse.response = processedResponse.response
    .replace('${descriptor}', VM_BRAND.platform.descriptor)
    .replace('${ico}', VM_BRAND.platform.ico);

  if (segment && processedResponse.segmentVariant[segment]) {
    return {
      ...processedResponse,
      response: processedResponse.segmentVariant[segment],
    };
  }

  return processedResponse;
}

/**
 * Returns the full library of objection responses.
 *
 * @returns Array of all ObjectionResponse objects.
 */
export function getAllResponses(): ObjectionResponse[] {
  return RESPONSES.map(r => ({
    ...r,
    response: r.response
      .replace('${descriptor}', VM_BRAND.platform.descriptor)
      .replace('${ico}', VM_BRAND.platform.ico),
  }));
}

/**
 * Generates an FAQ page from all objections and responses.
 *
 * Each objection becomes a question, and the primary response
 * becomes the answer. Suitable for website FAQ sections.
 *
 * @returns HTML string for the FAQ section.
 */
export function generateObjectionFaq(): string {
  const faqItems = RESPONSES.map(r => {
    const response = r.response
      .replace('${descriptor}', VM_BRAND.platform.descriptor)
      .replace('${ico}', VM_BRAND.platform.ico);

    return `
    <div class="vm-faq-item" style="margin-bottom: 1.5rem; padding: 1.5rem; background: ${VM_BRAND.colours.charcoal}; border-radius: 6px; border-left: 4px solid ${VM_BRAND.colours.gold};">
      <h3 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin: 0 0 0.75rem 0;">
        "${r.objection.objectionText}"
      </h3>
      <p style="margin: 0 0 0.75rem 0;">${response}</p>
      <p style="font-family: ${VM_BRAND.fonts.data}; font-size: 0.8rem; color: ${VM_BRAND.colours.teal}; margin: 0;">
        ${r.supportingData}
      </p>
    </div>`;
  }).join('\n');

  return `
<section class="vm-pricing-faq" style="font-family: ${VM_BRAND.fonts.body}; background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; padding: 3rem; border-radius: 8px;">
  <div style="text-align: center; margin-bottom: 2rem;">
    <h2 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; font-size: 2rem;">
      Common Questions About VitalMatrix Pricing
    </h2>
    <p style="color: ${VM_BRAND.colours.teal}; font-family: ${VM_BRAND.fonts.data};">
      ${VM_BRAND.platform.descriptor} | Founding Cohort: GBP ${VM_BRAND.pricing.foundingMonthly}/month
    </p>
  </div>

  ${faqItems}

  <footer style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.7rem; font-family: ${VM_BRAND.fonts.data};">
    <p>${VM_BRAND.regulatoryFooter}</p>
    <p>${VM_BRAND.tmFooter}</p>
  </footer>
</section>`.trim();
}

/**
 * Generates a markdown sales playbook for Dr Faisal.
 *
 * Structured as a conversation guide with objection text, recommended
 * response, supporting data, and segment-specific variations.
 *
 * @returns Markdown string for the complete sales playbook.
 */
export function generateSalesPlaybook(): string {
  const sections = RESPONSES.map(r => {
    const response = r.response
      .replace('${descriptor}', VM_BRAND.platform.descriptor)
      .replace('${ico}', VM_BRAND.platform.ico);

    const variants = Object.entries(r.segmentVariant)
      .map(([seg, text]) => `  - **${seg}**: ${text}`)
      .join('\n');

    return `
### ${r.objection.id}: "${r.objection.objectionText}"

**Category:** ${r.objection.category}

**Recommended Response:**

${response}

**Supporting Data:**

> ${r.supportingData}

**Segment Variants:**

${variants}

---`;
  }).join('\n');

  return `# VitalMatrix Sales Playbook
## Pricing Objection Handler

**Prepared for:** ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}
**Platform:** VitalMatrix -- ${VM_BRAND.platform.descriptor}
**Pricing:** GBP ${VM_BRAND.pricing.foundingMonthly}/month (founding cohort)
**Cohort:** 10 founding spots

---

## How to Use This Playbook

1. Identify the objection category (cost, value, comparison, timing, trust, technical).
2. Use the recommended response as a starting point.
3. Adapt using the segment variant that matches your prospect.
4. Reference the supporting data when the prospect needs concrete numbers.
5. Always close with a next-step invitation (discovery call or sign-up link).

---

## Objections and Responses

${sections}

## General Closing Statements

- "The founding cohort is limited to 10 practitioners. Would you like to secure your spot?"
- "Shall I send you a personalised assessment using your own clinical scenarios?"
- "The founding rate of GBP ${VM_BRAND.pricing.foundingMonthly}/month is fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. It will never be this price again."

---

${VM_BRAND.regulatoryFooter}
`.trim();
}
