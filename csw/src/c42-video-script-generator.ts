/**
 * Component 42: Video Script Generator
 *
 * Generates timed video scripts with visual cues, on-screen text,
 * and narration. Supports 5 video types with pre-built templates.
 * Outputs teleprompter text and production shot lists.
 *
 * Video types: platform-demo (3 min), zone-explainer (90s/zone),
 * onboarding-walkthrough (5 min), feature-highlight, testimonial-format.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Supported video content types */
export type VideoType =
  | 'platform-demo'
  | 'zone-explainer'
  | 'onboarding-walkthrough'
  | 'feature-highlight'
  | 'testimonial-format';

/** A single timed segment within a video script */
export interface ScriptSegment {
  timestamp: string;
  duration: number;
  narration: string;
  visualCue: string;
  onScreenText?: string;
}

/** Complete video script with metadata */
export interface VideoScript {
  title: string;
  type: VideoType;
  totalDuration: number;
  segments: ScriptSegment[];
  thumbnail: string;
  description: string;
}

// --- Constants ---

/** Node labels for platform demo narration */
const NODE_LABELS: string[] = [
  'N1: Metabolic and Endocrine',
  'N2: Immune and Inflammatory',
  'N3: Neurological and Cognitive',
  'N4: Cardiovascular and Circulatory',
  'N5: Gastrointestinal and Hepatic',
  'N6: Musculoskeletal and Structural',
  'N7: Psycho-Emotional and Behavioural',
];

/** Zone labels for zone explainer narration */
const ZONE_LABELS: Record<string, { name: string; description: string }> = {
  Z1: { name: 'Terrain Foundation', description: 'Baseline biochemistry and foundational markers that underpin system stability.' },
  Z2: { name: 'Functional Load', description: 'Metabolic burden, detoxification capacity, and cumulative physiological stress.' },
  Z3: { name: 'Regulatory Coherence', description: 'Neuro-immune-endocrine axis balance and inter-system communication fidelity.' },
  Z4: { name: 'Adaptive Capacity', description: 'Resilience reserves, recovery dynamics, and allostatic flexibility.' },
  Z5: { name: 'Expression and Output', description: 'Phenotypic manifestation, symptom clustering, and clinical presentation patterns.' },
};

// --- Helper Functions ---

/**
 * Formats seconds into MM:SS timestamp string.
 *
 * @param seconds - Total seconds from start
 * @returns Formatted timestamp
 */
function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Builds the platform demo template (3 minutes).
 * Structure: intro, 7 nodes, 5 zones, cascade detection,
 * output walkthrough, CTA.
 *
 * @param title - Video title
 * @returns Complete video script
 */
function buildPlatformDemo(title: string): VideoScript {
  const segments: ScriptSegment[] = [];
  let currentTime = 0;

  // Intro (15s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 15,
    narration: `Welcome to VitalMatrix -- the ${VM_BRAND.platform.descriptor} built for functional medicine practitioners. I am ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}, and in the next three minutes I will show you how VitalMatrix transforms complex clinical data into actionable intelligence.`,
    visualCue: 'VitalMatrix logo animation. Fade to presenter on camera with platform dashboard blurred behind.',
    onScreenText: `VitalMatrix -- ${VM_BRAND.platform.descriptor}`,
  });
  currentTime += 15;

  // 7 Nodes overview (10s each = 70s)
  for (const node of NODE_LABELS) {
    segments.push({
      timestamp: formatTimestamp(currentTime),
      duration: 10,
      narration: `${node}. Each node captures a distinct physiological domain, drawing from validated biomarkers, clinical observations, and patient-reported data.`,
      visualCue: `Highlight ${node.substring(0, 2)} on the node diagram. Animate connected markers flowing in.`,
      onScreenText: node,
    });
    currentTime += 10;
  }

  // 5 Zones overview (10s each = 50s)
  for (const [code, zone] of Object.entries(ZONE_LABELS)) {
    segments.push({
      timestamp: formatTimestamp(currentTime),
      duration: 10,
      narration: `${code}: ${zone.name}. ${zone.description}`,
      visualCue: `Zone diagram transitions to highlight ${code}. Colour-coded overlay shows zone boundaries.`,
      onScreenText: `${code}: ${zone.name}`,
    });
    currentTime += 10;
  }

  // Cascade detection (20s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 20,
    narration: 'CascadeIQ is where the platform truly differentiates. It detects cross-node interactions -- where dysfunction in one domain amplifies disturbance in another. This is terrain-level intelligence, not siloed symptom tracking.',
    visualCue: 'Animated cascade flow between nodes. Lines pulse between N2 and N5, then ripple outward to N3. Data overlay shows cascade scoring.',
    onScreenText: 'CascadeIQ -- Cross-Node Intelligence',
  });
  currentTime += 20;

  // Output walkthrough (15s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 15,
    narration: 'The clinical output consolidates everything into a prioritised action plan. You see terrain scores, zone states, cascade alerts, and evidence-tiered recommendations -- all in a single, practitioner-facing report.',
    visualCue: 'Screen recording: scroll through a sample clinical output PDF. Highlight terrain scores, zone badges, and recommendation cards.',
    onScreenText: 'Unified Clinical Output',
  });
  currentTime += 15;

  // CTA (10s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 10,
    narration: `VitalMatrix is currently open to a founding cohort of 10 practitioners. The founding rate is GBP ${VM_BRAND.pricing.foundingMonthly} per month, fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Visit ${VM_BRAND.platform.domain} to book your discovery call.`,
    visualCue: 'Pricing card animates in. Discovery call button pulses. URL displayed prominently.',
    onScreenText: `Founding Cohort -- GBP ${VM_BRAND.pricing.foundingMonthly}/month | ${VM_BRAND.platform.domain}`,
  });
  currentTime += 10;

  return {
    title,
    type: 'platform-demo',
    totalDuration: currentTime,
    segments,
    thumbnail: 'VitalMatrix dashboard screenshot with logo overlay, prussian blue background, gold accent border.',
    description: `A ${Math.round(currentTime / 60)}-minute overview of VitalMatrix, the ${VM_BRAND.platform.descriptor} for functional medicine. Covers 7 clinical nodes, 5 assessment zones, CascadeIQ cross-node detection, and unified clinical outputs. Presented by ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}.`,
  };
}

/**
 * Builds zone explainer template (90s per zone, ~7.5 min total).
 *
 * @param title - Video title
 * @returns Complete video script
 */
function buildZoneExplainer(title: string): VideoScript {
  const segments: ScriptSegment[] = [];
  let currentTime = 0;

  // Intro (15s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 15,
    narration: `VitalMatrix organises clinical intelligence across five zones. Each zone represents a layer of physiological assessment, from foundational terrain through to clinical expression. Let us walk through each one.`,
    visualCue: 'Five-zone stacked diagram fades in. All zones greyed out, ready to illuminate individually.',
    onScreenText: 'The 5 Clinical Zones',
  });
  currentTime += 15;

  // Each zone (90s each)
  for (const [code, zone] of Object.entries(ZONE_LABELS)) {
    // Part 1: Definition (30s)
    segments.push({
      timestamp: formatTimestamp(currentTime),
      duration: 30,
      narration: `${code}: ${zone.name}. ${zone.description} This zone captures the ${code === 'Z1' ? 'foundational' : code === 'Z5' ? 'output-level' : 'mid-layer'} dynamics that shape a patient's clinical picture.`,
      visualCue: `${code} illuminates on the zone diagram. Associated biomarkers animate inward from the edges.`,
      onScreenText: `${code}: ${zone.name}`,
    });
    currentTime += 30;

    // Part 2: Clinical relevance (30s)
    segments.push({
      timestamp: formatTimestamp(currentTime),
      duration: 30,
      narration: `In clinical practice, ${zone.name} gives you a structured lens for reading complexity. Rather than chasing individual markers, you see how systems interact within this zone, revealing patterns that isolated testing would miss.`,
      visualCue: `Split screen: traditional lab panel on left, VitalMatrix ${code} assessment on right. Highlight additional insights captured.`,
    });
    currentTime += 30;

    // Part 3: Cross-zone interactions (30s)
    segments.push({
      timestamp: formatTimestamp(currentTime),
      duration: 30,
      narration: `${zone.name} does not exist in isolation. CascadeIQ monitors how changes in ${code} propagate to adjacent zones, giving you early warning of cross-system disruption before it reaches clinical threshold.`,
      visualCue: `Animated arrows flow from ${code} to neighbouring zones. Cascade alert badge pulses.`,
      onScreenText: `${code} Cascade Interactions`,
    });
    currentTime += 30;
  }

  // Closing (15s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 15,
    narration: `Five zones. One integrated view. VitalMatrix gives you the terrain-level intelligence that modern functional medicine demands. Visit ${VM_BRAND.platform.domain} to learn more.`,
    visualCue: 'All five zones illuminate simultaneously. Logo and URL fade in.',
    onScreenText: VM_BRAND.platform.domain,
  });
  currentTime += 15;

  return {
    title,
    type: 'zone-explainer',
    totalDuration: currentTime,
    segments,
    thumbnail: 'Five stacked zone layers, each colour-coded, with zone codes visible. Prussian blue background.',
    description: `Deep dive into the 5 clinical assessment zones of VitalMatrix. 90 seconds per zone covering definition, clinical relevance, and cross-zone cascade interactions. ${VM_BRAND.regulatoryFooter}`,
  };
}

/**
 * Builds onboarding walkthrough template (5 minutes).
 * Structure: login, intake, assessment, output review, next steps.
 *
 * @param title - Video title
 * @returns Complete video script
 */
function buildOnboardingWalkthrough(title: string): VideoScript {
  const segments: ScriptSegment[] = [];
  let currentTime = 0;

  // Login (45s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 45,
    narration: `Welcome to VitalMatrix. In this walkthrough, I will guide you through your first session on the platform. Let us start by logging in. Navigate to ${VM_BRAND.platform.domain} and enter your practitioner credentials. You will land on your dashboard, which shows your active cases, pending assessments, and recent clinical outputs.`,
    visualCue: 'Screen recording: browser navigates to login page. Credentials entered. Dashboard loads with sample data.',
    onScreenText: 'Step 1: Login and Dashboard',
  });
  currentTime += 45;

  // Intake (75s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 75,
    narration: 'Step two: patient intake. Click "New Assessment" to begin. The INTAKE form captures 502 data points across demographics, medical history, current symptoms, medications, supplements, lifestyle factors, and functional medicine markers. The form validates as you go -- age gating, unit checks, and required-field prompts are all built in. You do not need to complete everything in one sitting; partial saves are supported.',
    visualCue: 'Screen recording: click New Assessment. INTAKE form opens. Scroll through sections, filling sample data. Show validation messages and partial save.',
    onScreenText: 'Step 2: Patient Intake (502 Data Points)',
  });
  currentTime += 75;

  // Assessment (75s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 75,
    narration: 'Step three: automated assessment. Once intake is submitted, VitalMatrix runs the data through seven engine stages -- FLINT, APEX, STRIDE, RIL, CADENCE, CIL, and VISTA. Each engine scores, stratifies, and contextualises the data against its specific domain. You do not need to configure anything; the pipeline runs automatically and typically completes within seconds.',
    visualCue: 'Pipeline animation: data packet flows through 7 labelled engine blocks. Progress indicators fill. Final output badge appears.',
    onScreenText: 'Step 3: 7-Engine Assessment Pipeline',
  });
  currentTime += 75;

  // Output review (75s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 75,
    narration: 'Step four: reviewing your clinical output. The output report presents terrain scores per node, zone-level assessments, cascade alerts, and evidence-tiered recommendations. Each recommendation cites its evidence tier -- Established, Emerging, Theoretical, Observed in Practice, or Contested. You can drill into any node or zone for granular detail, export to PDF, or share with your clinical team.',
    visualCue: 'Screen recording: open output report. Click through terrain scores, zone panels, cascade alerts. Show evidence tier badges. Demonstrate PDF export.',
    onScreenText: 'Step 4: Clinical Output Review',
  });
  currentTime += 75;

  // Next steps (30s)
  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 30,
    narration: `That completes your first walkthrough. Your next steps: run your first real patient assessment, explore the cascade detection on a complex case, and book your onboarding call with our clinical support team. Welcome to VitalMatrix.`,
    visualCue: 'Checklist animates in with three items. Logo and support email fade in below.',
    onScreenText: 'Next Steps: First Assessment | Cascade Exploration | Onboarding Call',
  });
  currentTime += 30;

  return {
    title,
    type: 'onboarding-walkthrough',
    totalDuration: currentTime,
    segments,
    thumbnail: 'Split screen showing INTAKE form and clinical output, connected by pipeline arrow. VitalMatrix branding.',
    description: `5-minute onboarding walkthrough for new VitalMatrix practitioners. Covers login, intake (502 data points), 7-engine assessment pipeline, output review, and next steps. ${VM_BRAND.regulatoryFooter}`,
  };
}

/**
 * Builds a feature highlight video (60s).
 *
 * @param title - Video title
 * @returns Complete video script
 */
function buildFeatureHighlight(title: string): VideoScript {
  const segments: ScriptSegment[] = [];
  let currentTime = 0;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 10,
    narration: `${title}. Let me show you how this feature works inside VitalMatrix.`,
    visualCue: 'Title card with feature name. VitalMatrix logo in corner. Prussian blue background.',
    onScreenText: title,
  });
  currentTime += 10;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 20,
    narration: '[PRESENTER: Describe the problem this feature solves. Reference a common clinical workflow pain point that practitioners encounter daily.]',
    visualCue: 'Before state: show the manual or fragmented workflow. Use split-screen or annotation overlay.',
    onScreenText: 'The Challenge',
  });
  currentTime += 20;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 20,
    narration: '[PRESENTER: Demonstrate the feature in action. Show the screen recording with narration explaining each step and what the platform is doing behind the scenes.]',
    visualCue: 'Screen recording of the feature. Cursor highlights, click animations, result display.',
    onScreenText: 'The Solution',
  });
  currentTime += 20;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 10,
    narration: `This is just one of the capabilities built into VitalMatrix. Visit ${VM_BRAND.platform.domain} to see the full platform.`,
    visualCue: 'Feature summary card. Fade to logo and URL.',
    onScreenText: VM_BRAND.platform.domain,
  });
  currentTime += 10;

  return {
    title,
    type: 'feature-highlight',
    totalDuration: currentTime,
    segments,
    thumbnail: `Feature name in gold on prussian blue. Small platform screenshot inset.`,
    description: `60-second feature highlight for VitalMatrix. ${VM_BRAND.regulatoryFooter}`,
  };
}

/**
 * Builds a testimonial format video template (90s).
 *
 * @param title - Video title
 * @returns Complete video script
 */
function buildTestimonialFormat(title: string): VideoScript {
  const segments: ScriptSegment[] = [];
  let currentTime = 0;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 10,
    narration: '[PRACTITIONER NAME and CREDENTIALS on screen. No narration -- ambient music only.]',
    visualCue: 'Name card with practitioner photo. VitalMatrix logo subtle in corner. Warm, clinical setting.',
    onScreenText: '[Practitioner Name], [Credentials]',
  });
  currentTime += 10;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 25,
    narration: '[PRACTITIONER: Describe your practice before VitalMatrix. What was the clinical workflow challenge you faced? How did you manage complex, multi-system patients?]',
    visualCue: 'Practitioner on camera. B-roll of clinical setting intercut.',
    onScreenText: 'Before VitalMatrix',
  });
  currentTime += 25;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 25,
    narration: '[PRACTITIONER: Describe the moment of discovery. What made you try VitalMatrix? What was your first assessment experience like?]',
    visualCue: 'Practitioner on camera. Brief screen capture of platform intercut.',
    onScreenText: 'The Discovery',
  });
  currentTime += 25;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 20,
    narration: '[PRACTITIONER: Share a specific outcome. How has VitalMatrix changed your clinical workflow? What results have you seen? Be specific but compliant -- no diagnostic claims.]',
    visualCue: 'Practitioner on camera. Animated stat cards intercut (time saved, cases managed, etc.).',
    onScreenText: 'The Impact',
  });
  currentTime += 20;

  segments.push({
    timestamp: formatTimestamp(currentTime),
    duration: 10,
    narration: `[PRACTITIONER: One-sentence recommendation.] VitalMatrix. The ${VM_BRAND.platform.descriptor} for functional medicine.`,
    visualCue: 'Practitioner delivers final line to camera. Fade to VitalMatrix logo and URL.',
    onScreenText: `${VM_BRAND.platform.domain} | Founding Cohort Open`,
  });
  currentTime += 10;

  return {
    title,
    type: 'testimonial-format',
    totalDuration: currentTime,
    segments,
    thumbnail: 'Practitioner photo with VitalMatrix logo overlay. Quote pull in gold text.',
    description: `Practitioner testimonial for VitalMatrix. 90-second format. ${VM_BRAND.regulatoryFooter}`,
  };
}

// --- Public Functions ---

/**
 * Generates a complete video script for the given type with
 * pre-built template content, timed segments, and visual cues.
 *
 * @param title - Video title
 * @param type - Video type (determines template)
 * @param _targetDuration - Target duration in seconds (used for future custom pacing)
 * @returns Complete video script
 */
export function generateScript(title: string, type: VideoType, _targetDuration: number): VideoScript {
  switch (type) {
    case 'platform-demo':
      return buildPlatformDemo(title);
    case 'zone-explainer':
      return buildZoneExplainer(title);
    case 'onboarding-walkthrough':
      return buildOnboardingWalkthrough(title);
    case 'feature-highlight':
      return buildFeatureHighlight(title);
    case 'testimonial-format':
      return buildTestimonialFormat(title);
  }
}

/**
 * Extracts clean narration-only text for teleprompter use.
 * Strips visual cues and on-screen text, preserving only
 * spoken narration with segment breaks.
 *
 * @param script - Video script to extract from
 * @returns Clean teleprompter text
 */
export function generateTeleprompterText(script: VideoScript): string {
  const lines: string[] = [];

  lines.push(`TELEPROMPTER: ${script.title}`);
  lines.push(`Total Duration: ${Math.round(script.totalDuration / 60)} min ${script.totalDuration % 60}s`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const segment of script.segments) {
    lines.push(`[${segment.timestamp}] (${segment.duration}s)`);
    lines.push('');
    lines.push(segment.narration);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generates a production shot list / checklist from a video script.
 * Lists each segment with its visual requirements, equipment notes,
 * and on-screen text needs.
 *
 * @param script - Video script to create shot list from
 * @returns Markdown-formatted production checklist
 */
export function generateShotList(script: VideoScript): string {
  const lines: string[] = [];

  lines.push(`# Production Shot List: ${script.title}`);
  lines.push('');
  lines.push(`**Type:** ${script.type}`);
  lines.push(`**Total Duration:** ${Math.round(script.totalDuration / 60)} min ${script.totalDuration % 60}s`);
  lines.push(`**Total Segments:** ${script.segments.length}`);
  lines.push('');
  lines.push(`**Thumbnail Brief:** ${script.thumbnail}`);
  lines.push('');

  lines.push('## Pre-Production Checklist');
  lines.push('');
  lines.push('- [ ] Presenter briefed and script reviewed');
  lines.push('- [ ] Screen recordings captured for all demo segments');
  lines.push('- [ ] VitalMatrix brand assets available (logo, colour palette, fonts)');
  lines.push(`- [ ] Prussian blue background (${VM_BRAND.colours.prussianBlue}) prepared`);
  lines.push(`- [ ] Gold accent elements (${VM_BRAND.colours.gold}) prepared`);
  lines.push('- [ ] Teleprompter loaded');
  lines.push('- [ ] Audio levels tested');
  lines.push('');

  lines.push('## Shot List');
  lines.push('');

  let shotNumber = 0;
  for (const segment of script.segments) {
    shotNumber++;
    lines.push(`### Shot ${shotNumber} -- ${segment.timestamp} (${segment.duration}s)`);
    lines.push('');
    lines.push(`**Visual:** ${segment.visualCue}`);
    lines.push('');
    if (segment.onScreenText) {
      lines.push(`**On-Screen Text:** ${segment.onScreenText}`);
      lines.push('');
      lines.push(`- [ ] Text overlay prepared (${VM_BRAND.fonts.heading} heading, ${VM_BRAND.fonts.body} body)`);
    }
    lines.push(`- [ ] Shot captured`);
    lines.push(`- [ ] Audio synced`);
    lines.push('');
  }

  lines.push('## Post-Production');
  lines.push('');
  lines.push('- [ ] Colour grading applied (VitalMatrix palette)');
  lines.push('- [ ] Lower thirds and text overlays added');
  lines.push('- [ ] Logo watermark positioned');
  lines.push('- [ ] Regulatory footer included in description');
  lines.push('- [ ] Thumbnail generated');
  lines.push('- [ ] Final review by Dr Faisal');
  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}
