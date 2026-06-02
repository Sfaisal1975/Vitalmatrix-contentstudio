/**
 * c72-seasonal-content-calendar.ts
 * VitalMatrix Content Studio — Seasonal Content Calendar
 *
 * Maps clinical topics to seasons and generates zone-relevant content
 * across blog, social, email, ad and quiz formats. Each topic is
 * linked to specific nodes and zones with an evidence tier.
 *
 * K7: credentials locked (MBBS, FAAMFM).
 * K8: British English throughout.
 * K10: ZERO competitor names.
 *
 * (c) VitalMatrix Ltd 2026. All rights reserved.
 */

import { VM_BRAND } from './brand-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Evidence tier re-export for clinical claim tagging. */
export type EvidenceTier = typeof VM_BRAND.evidenceTiers[number];

/** The four seasons. */
export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

/** A clinical topic mapped to a season, nodes and zones. */
export interface SeasonalTopic {
  /** Season this topic belongs to. */
  season: Season;
  /** Topic name. */
  topic: string;
  /** Relevant node identifiers (e.g. ["N6", "N1"]). */
  nodes: string[];
  /** Relevant zone identifiers (e.g. ["Z1"]). */
  zones: string[];
  /** Evidence tier for claims related to this topic. */
  evidenceTier: EvidenceTier;
  /** Angles from which content can be created. */
  contentAngles: string[];
}

/** A content format for seasonal content. */
export type SeasonalContentFormat = 'blog' | 'social' | 'email' | 'ad' | 'quiz';

/** A single piece of seasonal content. */
export interface SeasonalContent {
  /** The topic this content addresses. */
  topic: string;
  /** Content format. */
  format: SeasonalContentFormat;
  /** Content title / headline. */
  title: string;
  /** Brief describing what the content should cover. */
  brief: string;
}

/** A full seasonal plan for one season. */
export interface SeasonalPlan {
  /** The season. */
  season: Season;
  /** Months covered (e.g. ["December", "January", "February"]). */
  months: string[];
  /** Clinical topics for this season. */
  topics: SeasonalTopic[];
  /** Content pieces to produce. */
  contentPieces: SeasonalContent[];
}

// ---------------------------------------------------------------------------
// Season-month mapping
// ---------------------------------------------------------------------------

const SEASON_MONTHS: Record<Season, string[]> = {
  winter: ['December', 'January', 'February'],
  spring: ['March', 'April', 'May'],
  summer: ['June', 'July', 'August'],
  autumn: ['September', 'October', 'November'],
};

const MONTH_TO_SEASON: Record<number, Season> = {
  0: 'winter',   // January
  1: 'winter',   // February
  2: 'spring',   // March
  3: 'spring',   // April
  4: 'spring',   // May
  5: 'summer',   // June
  6: 'summer',   // July
  7: 'summer',   // August
  8: 'autumn',   // September
  9: 'autumn',   // October
  10: 'autumn',  // November
  11: 'winter',  // December
};

// ---------------------------------------------------------------------------
// Pre-built seasonal topic library
// ---------------------------------------------------------------------------

const SEASONAL_TOPICS: SeasonalTopic[] = [
  // Winter (December - February)
  {
    season: 'winter',
    topic: 'SAD and energy resilience',
    nodes: ['N6', 'N3'],
    zones: ['Z1'],
    evidenceTier: 'Established',
    contentAngles: [
      'Neuroendocrine impact of reduced daylight',
      'Mitochondrial energy demands in winter',
      'Zone 1 activation patterns in seasonal affective states',
      'Terrain-specific support considerations for winter energy',
    ],
  },
  {
    season: 'winter',
    topic: 'Thyroid support in winter',
    nodes: ['N6'],
    zones: ['Z1'],
    evidenceTier: 'Established',
    contentAngles: [
      'Seasonal thyroid fluctuation patterns',
      'N6 scoring shifts in winter months',
      'Zone 1 cascade from thyroid to energy',
      'Evidence-based thyroid terrain considerations',
    ],
  },
  {
    season: 'winter',
    topic: 'Immune resilience',
    nodes: ['N2'],
    zones: ['Z2'],
    evidenceTier: 'Established',
    contentAngles: [
      'Winter immune demands on Zone 2',
      'N2 immune-inflammatory node in cold months',
      'Cascade patterns from immune challenge to other zones',
      'Terrain support for immune resilience',
    ],
  },
  {
    season: 'winter',
    topic: 'Post-holiday detox and biotransformation',
    nodes: ['N4'],
    zones: ['Z4'],
    evidenceTier: 'Emerging',
    contentAngles: [
      'January detox patterns in clinical practice',
      'N4 biotransformation load after festive period',
      'Zone 4 activation and cascade to Zone 2',
      'Evidence-tiered detox support considerations',
    ],
  },

  // Spring (March - May)
  {
    season: 'spring',
    topic: 'Allergies and immune modulation',
    nodes: ['N2'],
    zones: ['Z2'],
    evidenceTier: 'Established',
    contentAngles: [
      'Seasonal allergy patterns and N2 scoring',
      'Zone 2 immune-inflammatory activation in spring',
      'Gut-immune cascade in allergy season',
      'Terrain approach to seasonal reactivity',
    ],
  },
  {
    season: 'spring',
    topic: 'Gut reset and microbiome renewal',
    nodes: ['N1'],
    zones: ['Z2'],
    evidenceTier: 'Emerging',
    contentAngles: [
      'Spring gut renewal and N1 scoring',
      'Microbiome shifts from winter to spring diet',
      'N1 to N2 cascade patterns',
      'Zone 2 implications of gut terrain changes',
    ],
  },
  {
    season: 'spring',
    topic: 'Hormonal spring shift',
    nodes: ['N6'],
    zones: ['Z5'],
    evidenceTier: 'Observed in Practice',
    contentAngles: [
      'Hormonal recalibration in longer daylight',
      'N6 neuroendocrine response to spring',
      'Zone 5 hormonal-reproductive terrain shifts',
      'Cascade from N6 to N3 energy nodes',
    ],
  },
  {
    season: 'spring',
    topic: 'Energy renewal and mitochondrial function',
    nodes: ['N3'],
    zones: ['Z1'],
    evidenceTier: 'Established',
    contentAngles: [
      'Spring energy recovery after winter',
      'N3 mitochondrial scoring improvements in spring',
      'Zone 1 energy-neuroendocrine terrain mapping',
      'Lifestyle factors supporting spring energy renewal',
    ],
  },

  // Summer (June - August)
  {
    season: 'summer',
    topic: 'Energy optimisation',
    nodes: ['N3'],
    zones: ['Z1'],
    evidenceTier: 'Established',
    contentAngles: [
      'Peak energy season and N3 scoring',
      'Zone 1 terrain in optimal daylight conditions',
      'Exercise and mitochondrial capacity in summer',
      'Terrain support for sustained summer energy',
    ],
  },
  {
    season: 'summer',
    topic: 'Skin-gut axis',
    nodes: ['N2', 'N7'],
    zones: ['Z2'],
    evidenceTier: 'Emerging',
    contentAngles: [
      'Summer skin conditions and gut-immune connection',
      'N2 and N7 cross-node cascade patterns',
      'Zone 2 activation via skin-gut axis',
      'Evidence for gut-skin terrain interactions',
    ],
  },
  {
    season: 'summer',
    topic: 'Hydration and cardiovascular terrain',
    nodes: ['N5'],
    zones: ['Z3'],
    evidenceTier: 'Established',
    contentAngles: [
      'Summer heat and cardiovascular-metabolic load',
      'N5 scoring in dehydration scenarios',
      'Zone 3 terrain considerations in hot weather',
      'Electrolyte and hydration terrain support',
    ],
  },
  {
    season: 'summer',
    topic: 'Exercise recovery and musculoskeletal terrain',
    nodes: ['N3', 'N7'],
    zones: ['Z1'],
    evidenceTier: 'Observed in Practice',
    contentAngles: [
      'Increased summer activity and recovery demands',
      'N3 energy and N7 structural cascades',
      'Terrain scoring for exercise recovery patterns',
      'Mitochondrial and structural support considerations',
    ],
  },

  // Autumn (September - November)
  {
    season: 'autumn',
    topic: 'Immune preparation for winter',
    nodes: ['N2'],
    zones: ['Z2'],
    evidenceTier: 'Established',
    contentAngles: [
      'Autumn immune priming and N2 terrain',
      'Zone 2 preparatory assessment before winter',
      'Cascade patterns from autumn to winter immune load',
      'Proactive terrain support for immune resilience',
    ],
  },
  {
    season: 'autumn',
    topic: 'Stress resilience and adrenal terrain',
    nodes: ['N6'],
    zones: ['Z1'],
    evidenceTier: 'Established',
    contentAngles: [
      'Autumn stress patterns and neuroendocrine load',
      'N6 scoring shifts as daylight decreases',
      'Zone 1 energy-neuroendocrine cascade in autumn',
      'Terrain support for stress resilience before winter',
    ],
  },
  {
    season: 'autumn',
    topic: 'Cardiovascular preparation',
    nodes: ['N5'],
    zones: ['Z3'],
    evidenceTier: 'Established',
    contentAngles: [
      'Autumn cardiovascular risk patterns',
      'N5 scoring trends before winter',
      'Zone 3 terrain assessment for cardiovascular readiness',
      'Evidence-based cardiovascular terrain support',
    ],
  },
  {
    season: 'autumn',
    topic: 'Hormonal autumn shift',
    nodes: ['N6'],
    zones: ['Z5'],
    evidenceTier: 'Observed in Practice',
    contentAngles: [
      'Hormonal shifts as daylight shortens',
      'N6 neuroendocrine and Zone 5 hormonal interaction',
      'Cascade from hormonal terrain to energy terrain',
      'Terrain-specific support for autumn hormonal changes',
    ],
  },
];

// ---------------------------------------------------------------------------
// Content generation helpers
// ---------------------------------------------------------------------------

/**
 * Generates content pieces for a list of topics.
 */
function generateContentPiecesForTopics(topics: SeasonalTopic[]): SeasonalContent[] {
  const pieces: SeasonalContent[] = [];
  const formats: SeasonalContentFormat[] = ['blog', 'social', 'email', 'ad'];

  for (const topic of topics) {
    // Blog
    pieces.push({
      topic: topic.topic,
      format: 'blog',
      title: `${topic.topic}: A Terrain Perspective (${topic.zones.join(', ')})`,
      brief:
        `Write a 600-800 word blog post exploring ${topic.topic} through the lens of ` +
        `${topic.nodes.join(' and ')} terrain mapping. Reference ${topic.zones.join(' and ')} zone activation. ` +
        `Evidence tier: ${topic.evidenceTier}. Include regulatory footer. British English.`,
    });

    // Social (2 posts per topic)
    for (let i = 0; i < 2; i++) {
      const angle = topic.contentAngles[i % topic.contentAngles.length];
      pieces.push({
        topic: topic.topic,
        format: 'social',
        title: `${topic.topic} (${topic.zones.join('/')}) - Social ${i + 1}`,
        brief:
          `Create a social media post (150-200 words) on: "${angle}". ` +
          `Tag nodes ${topic.nodes.join(', ')} and zones ${topic.zones.join(', ')}. ` +
          `Evidence tier: ${topic.evidenceTier}. Regulatory footer.`,
      });
    }

    // Email
    pieces.push({
      topic: topic.topic,
      format: 'email',
      title: `Seasonal Terrain Insight: ${topic.topic}`,
      brief:
        `Draft a practitioner-facing email on ${topic.topic}. Open with a seasonal hook. ` +
        `Map to ${topic.nodes.join(', ')} and ${topic.zones.join(', ')}. ` +
        `Include one CTA to explore VitalMatrix. Evidence tier: ${topic.evidenceTier}.`,
    });

    // Ad (alternate formats)
    pieces.push({
      topic: topic.topic,
      format: 'ad',
      title: `${topic.topic} Ad`,
      brief:
        `Write a short ad (headline + 2-line body + CTA) on ${topic.topic}. ` +
        `Reference ${topic.zones.join('/')} zone terrain. ` +
        `Founding rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month. ` +
        `Evidence tier: ${topic.evidenceTier}.`,
    });
  }

  return pieces;
}

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Returns all seasonal topics for a given season.
 *
 * @param season - The season to query.
 * @returns An array of {@link SeasonalTopic} for that season.
 */
export function getSeasonalTopics(season: Season): SeasonalTopic[] {
  return SEASONAL_TOPICS.filter((t) => t.season === season);
}

/**
 * Generates a full seasonal content plan with 12-16 content pieces.
 *
 * @param season - The season to plan for.
 * @returns A {@link SeasonalPlan} with topics and content pieces.
 */
export function generateSeasonalPlan(season: Season): SeasonalPlan {
  const topics = getSeasonalTopics(season);
  const contentPieces = generateContentPiecesForTopics(topics);

  return {
    season,
    months: SEASON_MONTHS[season],
    topics,
    contentPieces,
  };
}

/**
 * Generates a full-year seasonal content calendar.
 *
 * @param year - The year to generate for (used in titles).
 * @returns An array of 4 {@link SeasonalPlan} objects, one per season.
 */
export function generateSeasonalContentCalendar(year: number): SeasonalPlan[] {
  const seasons: Season[] = ['winter', 'spring', 'summer', 'autumn'];
  return seasons.map((season) => {
    const plan = generateSeasonalPlan(season);
    // Prefix titles with the year
    plan.contentPieces = plan.contentPieces.map((piece) => ({
      ...piece,
      title: `[${year}] ${piece.title}`,
    }));
    return plan;
  });
}

/**
 * Auto-detects the current month and returns relevant seasonal topics.
 *
 * @returns An array of {@link SeasonalTopic} for the current season.
 */
export function getCurrentSeasonTopics(): SeasonalTopic[] {
  const month = new Date().getMonth();
  const season = MONTH_TO_SEASON[month];
  return getSeasonalTopics(season);
}

/**
 * Generates a platform-specific seasonal post for a given topic.
 *
 * @param topic    - The seasonal topic name (must match a pre-built topic).
 * @param platform - Target platform ("linkedin", "facebook", "instagram", "x").
 * @returns A ready-to-post string, or a fallback if the topic is not found.
 */
export function generateSeasonalPost(topic: string, platform: string): string {
  const found = SEASONAL_TOPICS.find(
    (t) => t.topic.toLowerCase() === topic.toLowerCase(),
  );

  if (!found) {
    return `Topic "${topic}" not found in seasonal library. Available topics: ${SEASONAL_TOPICS.map((t) => t.topic).join(', ')}.`;
  }

  const angle = found.contentAngles[0];
  const nodesStr = found.nodes.join(', ');
  const zonesStr = found.zones.join(', ');

  const core =
    `${found.topic}: a terrain perspective.\n\n` +
    `${angle}\n\n` +
    `In VitalMatrix, this maps to ${nodesStr} (nodes) and ${zonesStr} (zones). ` +
    `Systematic terrain assessment helps practitioners identify these patterns early.\n\n` +
    `[Evidence tier: ${found.evidenceTier}]`;

  switch (platform.toLowerCase()) {
    case 'linkedin':
      return (
        `${core}\n\n` +
        `VitalMatrix is a ${VM_BRAND.platform.descriptor} for FM practitioners in England. ` +
        `Founding rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month.\n\n` +
        `${VM_BRAND.regulatoryFooter}`
      );

    case 'facebook':
      return (
        `${core}\n\n` +
        `Have you noticed this pattern in your practice? Let us know in the comments.\n\n` +
        `${VM_BRAND.regulatoryFooter}`
      );

    case 'instagram':
      return (
        `${core}\n\n` +
        `#VitalMatrix #FunctionalMedicine #TerrainAssessment #${found.zones[0]} ` +
        `#${found.nodes[0]} #ClinicalIntelligence\n\n` +
        `${VM_BRAND.regulatoryFooter}`
      );

    case 'x':
      return (
        `${found.topic}: ${angle} ` +
        `[${found.evidenceTier}] ${nodesStr} / ${zonesStr}. ` +
        `#VitalMatrix #FunctionalMedicine\n\n` +
        `${VM_BRAND.regulatoryFooter}`
      );

    default:
      return `${core}\n\n${VM_BRAND.regulatoryFooter}`;
  }
}

/**
 * Generates a 4-email seasonal campaign series.
 *
 * @param season - The season to build the campaign for.
 * @returns An array of 4 email objects with subject, body and CTA.
 */
export function generateSeasonalEmailCampaign(
  season: Season,
): Array<{ emailNumber: number; subject: string; body: string; cta: string }> {
  const topics = getSeasonalTopics(season);
  const months = SEASON_MONTHS[season];

  return topics.slice(0, 4).map((topic, index) => {
    const emailNumber = index + 1;
    const month = months[Math.min(index, months.length - 1)];

    return {
      emailNumber,
      subject: `[${month}] ${topic.topic}: What Your Terrain Assessment Reveals`,
      body:
        `Dear colleague,\n\n` +
        `As we move through ${month}, ${topic.topic.toLowerCase()} becomes increasingly relevant ` +
        `in clinical practice.\n\n` +
        `From a terrain perspective, this maps to ${topic.nodes.join(' and ')} (nodes) and ` +
        `${topic.zones.join(' and ')} (zones). Practitioners using VitalMatrix can track ` +
        `these patterns systematically, identifying cascades before they compound.\n\n` +
        `Key angle: ${topic.contentAngles[0]}.\n\n` +
        `[Evidence tier: ${topic.evidenceTier}]\n\n` +
        `If you are exploring how terrain assessment could support your ${season} caseload, ` +
        `we would welcome a 15-minute conversation.\n\n` +
        `Best,\n` +
        `${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}\n` +
        `${VM_BRAND.credentials.title}, ${VM_BRAND.credentials.company}\n\n` +
        `${VM_BRAND.regulatoryFooter}`,
      cta: emailNumber < 4
        ? 'Read the full terrain insight'
        : `Book a discovery call (${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month founding rate)`,
    };
  });
}
