/**
 * Component 64: Conversion Funnel Tracker
 *
 * End-to-end tracking from ad impression through to conversion.
 * Tracks: ad -> click -> quiz/lead magnet -> email capture -> nurture ->
 * discovery call -> conversion. Generates funnel reports, identifies
 * bottlenecks, and produces VM-styled HTML funnel visualisations.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** All possible funnel stages in order */
export type FunnelStage =
  | 'ad-impression'
  | 'ad-click'
  | 'landing-page-view'
  | 'quiz-started'
  | 'quiz-completed'
  | 'lead-magnet-downloaded'
  | 'email-captured'
  | 'nurture-started'
  | 'email-opened'
  | 'email-clicked'
  | 'discovery-call-booked'
  | 'discovery-call-completed'
  | 'proposal-sent'
  | 'converted'
  | 'lost';

/** Ordered funnel stages for progression tracking */
const FUNNEL_ORDER: FunnelStage[] = [
  'ad-impression',
  'ad-click',
  'landing-page-view',
  'quiz-started',
  'quiz-completed',
  'lead-magnet-downloaded',
  'email-captured',
  'nurture-started',
  'email-opened',
  'email-clicked',
  'discovery-call-booked',
  'discovery-call-completed',
  'proposal-sent',
  'converted',
];

/** A single event in the funnel */
export interface FunnelEvent {
  /** Event timestamp (ISO 8601) */
  timestamp: string;
  /** Contact email address */
  contactEmail: string;
  /** Funnel stage this event represents */
  stage: FunnelStage;
  /** Source channel (e.g. 'linkedin-ad', 'quiz', 'referral') */
  source: string;
  /** Additional metadata */
  metadata: Record<string, string>;
}

/** Metrics for a single funnel stage */
export interface FunnelMetrics {
  /** Stage name */
  stage: FunnelStage;
  /** Number of contacts who entered this stage */
  entries: number;
  /** Number of contacts who did not progress beyond this stage */
  exits: number;
  /** Conversion rate to the next stage (percentage) */
  conversionToNext: number;
  /** Average time spent in this stage (hours) */
  avgTimeInStage: number;
}

/** Drop-off point in the funnel */
export interface DropOffPoint {
  /** Stage where drop-off occurs */
  stage: FunnelStage;
  /** Drop-off rate (percentage of entries that do not progress) */
  rate: number;
}

/** Complete funnel report */
export interface FunnelReport {
  /** Total ad impressions */
  totalImpressions: number;
  /** Total conversions */
  totalConversions: number;
  /** Overall conversion rate (impressions to conversions) */
  overallConversionRate: number;
  /** Cost per conversion in GBP */
  costPerConversion: number;
  /** Per-stage metrics */
  stageMetrics: FunnelMetrics[];
  /** Stages with highest drop-off */
  dropOffPoints: DropOffPoint[];
  /** Best-performing source channel */
  bestChannel: string;
  /** Best-performing content piece */
  bestContent: string;
}

// --- State ---

/** All funnel events */
const events: FunnelEvent[] = [];

// --- Core Functions ---

/**
 * Logs a funnel event for a contact.
 * @param contactEmail - Contact email address
 * @param stage - The funnel stage reached
 * @param source - Source channel
 * @param metadata - Additional metadata (optional)
 * @returns The created FunnelEvent
 */
export function trackEvent(
  contactEmail: string,
  stage: FunnelStage,
  source: string,
  metadata?: Record<string, string>
): FunnelEvent {
  const event: FunnelEvent = {
    timestamp: new Date().toISOString(),
    contactEmail,
    stage,
    source,
    metadata: metadata || {},
  };
  events.push(event);
  return event;
}

/**
 * Returns the full journey timeline for a contact.
 * @param email - Contact email address
 * @returns Array of FunnelEvents sorted chronologically
 */
export function getContactJourney(email: string): FunnelEvent[] {
  return events
    .filter((e) => e.contactEmail === email)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Calculates funnel metrics for a given time period.
 * @param startDate - Period start (ISO date string)
 * @param endDate - Period end (ISO date string)
 * @returns Array of FunnelMetrics per stage
 */
export function getFunnelMetrics(startDate: string, endDate: string): FunnelMetrics[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const periodEvents = events.filter((e) => {
    const t = new Date(e.timestamp).getTime();
    return t >= start && t <= end;
  });

  // Group events by contact and stage
  const contactStages: Map<string, Map<FunnelStage, FunnelEvent>> = new Map();
  for (const event of periodEvents) {
    if (!contactStages.has(event.contactEmail)) {
      contactStages.set(event.contactEmail, new Map());
    }
    const stages = contactStages.get(event.contactEmail)!;
    // Keep earliest event per stage
    if (!stages.has(event.stage)) {
      stages.set(event.stage, event);
    }
  }

  const metrics: FunnelMetrics[] = [];

  for (let i = 0; i < FUNNEL_ORDER.length; i++) {
    const stage = FUNNEL_ORDER[i];
    const nextStage = FUNNEL_ORDER[i + 1];

    let entries = 0;
    let progressed = 0;
    const timesInStage: number[] = [];

    for (const [, stages] of contactStages) {
      if (stages.has(stage)) {
        entries++;
        if (nextStage && stages.has(nextStage)) {
          progressed++;
          const stageTime = new Date(stages.get(stage)!.timestamp).getTime();
          const nextTime = new Date(stages.get(nextStage)!.timestamp).getTime();
          timesInStage.push((nextTime - stageTime) / (1000 * 60 * 60)); // hours
        }
      }
    }

    const exits = entries - progressed;
    const conversionToNext = entries > 0 ? (progressed / entries) * 100 : 0;
    const avgTimeInStage =
      timesInStage.length > 0
        ? timesInStage.reduce((s, t) => s + t, 0) / timesInStage.length
        : 0;

    metrics.push({ stage, entries, exits, conversionToNext, avgTimeInStage });
  }

  return metrics;
}

/**
 * Identifies the stages with the highest drop-off rates.
 * @param startDate - Optional period start
 * @param endDate - Optional period end
 * @returns Array of DropOffPoints sorted by rate (highest first)
 */
export function getDropOffPoints(startDate?: string, endDate?: string): DropOffPoint[] {
  const start = startDate || '2000-01-01';
  const end = endDate || '2099-12-31';
  const metrics = getFunnelMetrics(start, end);

  return metrics
    .filter((m) => m.entries > 0 && m.stage !== 'converted')
    .map((m) => ({
      stage: m.stage,
      rate: m.entries > 0 ? (m.exits / m.entries) * 100 : 0,
    }))
    .sort((a, b) => b.rate - a.rate);
}

/**
 * Calculates conversion rate between any two funnel stages.
 * @param fromStage - Starting stage
 * @param toStage - Ending stage
 * @returns Conversion rate as a percentage
 */
export function getConversionRate(fromStage: FunnelStage, toStage: FunnelStage): number {
  const contactStages: Map<string, Set<FunnelStage>> = new Map();
  for (const event of events) {
    if (!contactStages.has(event.contactEmail)) {
      contactStages.set(event.contactEmail, new Set());
    }
    contactStages.get(event.contactEmail)!.add(event.stage);
  }

  let fromCount = 0;
  let toCount = 0;

  for (const [, stages] of contactStages) {
    if (stages.has(fromStage)) {
      fromCount++;
      if (stages.has(toStage)) {
        toCount++;
      }
    }
  }

  return fromCount > 0 ? (toCount / fromCount) * 100 : 0;
}

/**
 * Calculates the average number of days from first touch to conversion.
 * @returns Average days to convert, or 0 if no conversions
 */
export function getAverageTimeToConvert(): number {
  const contactFirstTouch: Map<string, number> = new Map();
  const contactConversion: Map<string, number> = new Map();

  for (const event of events) {
    const t = new Date(event.timestamp).getTime();
    const current = contactFirstTouch.get(event.contactEmail);
    if (!current || t < current) {
      contactFirstTouch.set(event.contactEmail, t);
    }
    if (event.stage === 'converted') {
      const currentConv = contactConversion.get(event.contactEmail);
      if (!currentConv || t < currentConv) {
        contactConversion.set(event.contactEmail, t);
      }
    }
  }

  const durations: number[] = [];
  for (const [email, convTime] of contactConversion) {
    const firstTouch = contactFirstTouch.get(email);
    if (firstTouch) {
      durations.push((convTime - firstTouch) / (1000 * 60 * 60 * 24)); // days
    }
  }

  return durations.length > 0
    ? durations.reduce((s, d) => s + d, 0) / durations.length
    : 0;
}

/**
 * Returns all unique contacts in the funnel.
 */
export function getAllContacts(): string[] {
  return [...new Set(events.map((e) => e.contactEmail))];
}

/**
 * Generates a full markdown funnel report for a given period.
 * @param startDate - Period start (ISO date string)
 * @param endDate - Period end (ISO date string)
 * @returns Markdown-formatted report
 */
export function generateFunnelReport(startDate: string, endDate: string): string {
  const metrics = getFunnelMetrics(startDate, endDate);
  const dropOffs = getDropOffPoints(startDate, endDate);
  const avgConvertTime = getAverageTimeToConvert();

  const impressionMetric = metrics.find((m) => m.stage === 'ad-impression');
  const conversionMetric = metrics.find((m) => m.stage === 'converted');
  const totalImpressions = impressionMetric?.entries || 0;
  const totalConversions = conversionMetric?.entries || 0;
  const overallRate = totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;

  // Best channel analysis
  const channelConversions: Record<string, number> = {};
  for (const event of events) {
    if (event.stage === 'converted') {
      channelConversions[event.source] = (channelConversions[event.source] || 0) + 1;
    }
  }
  const bestChannel = Object.entries(channelConversions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const lines: string[] = [
    `# Conversion Funnel Report`,
    '',
    `**Period:** ${startDate} to ${endDate}`,
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Summary',
    '',
    `| Metric | Value |`,
    `|--------|------:|`,
    `| Total Impressions | ${totalImpressions.toLocaleString()} |`,
    `| Total Conversions | ${totalConversions} |`,
    `| Overall Conversion Rate | ${overallRate.toFixed(2)}% |`,
    `| Average Days to Convert | ${avgConvertTime.toFixed(1)} |`,
    `| Best Channel | ${bestChannel} |`,
    '',
    '## Stage-by-Stage Metrics',
    '',
    '| Stage | Entries | Exits | Conversion to Next | Avg Time (hrs) |',
    '|-------|-------:|------:|-------------------:|---------------:|',
  ];

  for (const m of metrics) {
    if (m.entries > 0) {
      lines.push(
        `| ${m.stage} | ${m.entries} | ${m.exits} | ${m.conversionToNext.toFixed(1)}% | ${m.avgTimeInStage.toFixed(1)} |`
      );
    }
  }

  lines.push('');
  lines.push('## Drop-Off Points');
  lines.push('');

  const topDropOffs = dropOffs.slice(0, 5);
  if (topDropOffs.length > 0) {
    lines.push('| Stage | Drop-Off Rate |');
    lines.push('|-------|-------------:|');
    for (const d of topDropOffs) {
      lines.push(`| ${d.stage} | ${d.rate.toFixed(1)}% |`);
    }
  } else {
    lines.push('*No significant drop-off points detected.*');
  }

  lines.push('');
  lines.push('## Recommendations');
  lines.push('');
  const improvements = suggestImprovements(topDropOffs);
  for (const imp of improvements) {
    lines.push(`- ${imp}`);
  }

  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generates a VM-styled HTML funnel visualisation with counts and conversion rates.
 * @returns HTML string for the funnel diagram
 */
export function generateFunnelVisualisationHtml(): string {
  const metrics = getFunnelMetrics('2000-01-01', '2099-12-31');
  const activeMetrics = metrics.filter((m) => m.entries > 0);
  const maxEntries = Math.max(...activeMetrics.map((m) => m.entries), 1);

  const stageRows = activeMetrics
    .map((m) => {
      const widthPct = Math.max(20, (m.entries / maxEntries) * 100);
      const barColour = m.stage === 'converted' ? VM_BRAND.colours.gold : VM_BRAND.colours.teal;
      return `
      <div style="margin-bottom:4px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:200px;text-align:right;font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:13px;color:${VM_BRAND.colours.white};">${m.stage}</div>
          <div style="flex:1;position:relative;">
            <div style="width:${widthPct}%;background:${barColour};height:32px;border-radius:4px;display:flex;align-items:center;padding:0 12px;">
              <span style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:12px;color:${VM_BRAND.colours.charcoal};font-weight:600;">${m.entries}</span>
            </div>
          </div>
          <div style="width:80px;text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;font-size:12px;color:${VM_BRAND.colours.gold};">${m.conversionToNext.toFixed(1)}%</div>
        </div>
      </div>`;
    })
    .join('\n');

  const impressions = activeMetrics.find((m) => m.stage === 'ad-impression')?.entries || 0;
  const conversions = activeMetrics.find((m) => m.stage === 'converted')?.entries || 0;
  const overallRate = impressions > 0 ? ((conversions / impressions) * 100).toFixed(2) : '0.00';

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>VitalMatrix Conversion Funnel</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;600&family=DM+Mono:wght@400&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:${VM_BRAND.colours.prussianBlue}; color:${VM_BRAND.colours.white}; font-family:'${VM_BRAND.fonts.body}',sans-serif; padding:40px; }
  </style>
</head>
<body>
  <div style="max-width:900px;margin:0 auto;">
    <h1 style="font-family:'${VM_BRAND.fonts.heading}',serif;font-size:28px;color:${VM_BRAND.colours.gold};margin-bottom:8px;">Conversion Funnel</h1>
    <p style="font-size:14px;color:${VM_BRAND.colours.white};opacity:0.7;margin-bottom:24px;">
      ${VM_BRAND.credentials.company} | Overall: ${impressions.toLocaleString()} impressions &rarr; ${conversions} conversions (${overallRate}%)
    </p>

    <div style="background:${VM_BRAND.colours.charcoal};border-radius:12px;padding:24px;border:1px solid ${VM_BRAND.colours.teal}33;">
      <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
        <span style="font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:12px;color:${VM_BRAND.colours.white};opacity:0.5;">STAGE</span>
        <span style="font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:12px;color:${VM_BRAND.colours.white};opacity:0.5;">CONV. RATE</span>
      </div>
      ${stageRows}
    </div>

    <p style="font-size:11px;color:${VM_BRAND.colours.white};opacity:0.4;margin-top:24px;text-align:centre;">
      ${VM_BRAND.regulatoryFooter}
    </p>
  </div>
</body>
</html>`;
}

/**
 * Identifies the funnel stages with worst conversion rates.
 * @param limit - Maximum number of bottlenecks to return (default: 3)
 * @returns Array of { stage, conversionToNext } objects
 */
export function identifyBottlenecks(
  limit: number = 3
): { stage: FunnelStage; conversionToNext: number }[] {
  const metrics = getFunnelMetrics('2000-01-01', '2099-12-31');

  return metrics
    .filter((m) => m.entries > 0 && m.stage !== 'converted' && m.stage !== 'lost')
    .sort((a, b) => a.conversionToNext - b.conversionToNext)
    .slice(0, limit)
    .map((m) => ({ stage: m.stage, conversionToNext: m.conversionToNext }));
}

/**
 * Suggests actionable improvements based on identified bottlenecks.
 * @param dropOffs - Drop-off points to address
 * @returns Array of recommendation strings
 */
export function suggestImprovements(dropOffs: DropOffPoint[]): string[] {
  const suggestions: string[] = [];

  const improvementMap: Record<string, string> = {
    'ad-impression': 'Review ad targeting — ensure audience is practitioner-focused B2B. Check creative relevance scores.',
    'ad-click': 'Improve ad creative — test stronger hooks and clearer value propositions. Consider A/B testing headlines.',
    'landing-page-view': 'Optimise landing page load time and above-the-fold content. Ensure clear next step is visible.',
    'quiz-started': 'Simplify quiz entry point — reduce friction, ensure the quiz loads quickly and the first question is engaging.',
    'quiz-completed': 'Review quiz length and question complexity. Consider reducing to 7-10 questions maximum.',
    'lead-magnet-downloaded': 'Ensure lead magnet delivers genuine clinical value. Test different formats (PDF, video, checklist).',
    'email-captured': 'Review form design — reduce fields to email + name only. Add social proof near the form.',
    'nurture-started': 'Check email deliverability. Ensure welcome email sends within 5 minutes of capture.',
    'email-opened': 'Test subject lines — personalise with quiz result or lead magnet topic. Keep under 50 characters.',
    'email-clicked': 'Improve email CTA placement and copy. Use a single, clear call-to-action per email.',
    'discovery-call-booked': 'Simplify booking process. Offer multiple time slots. Consider adding a "book in 30 seconds" flow.',
    'discovery-call-completed': 'Review call script and preparation materials. Ensure follow-up proposal is sent within 24 hours.',
    'proposal-sent': 'Review proposal content and pricing presentation. Address common objections proactively.',
  };

  for (const dropOff of dropOffs) {
    const suggestion = improvementMap[dropOff.stage];
    if (suggestion) {
      suggestions.push(`**${dropOff.stage}** (${dropOff.rate.toFixed(1)}% drop-off): ${suggestion}`);
    }
  }

  if (suggestions.length === 0) {
    suggestions.push('No significant bottlenecks detected. Continue monitoring funnel performance weekly.');
  }

  return suggestions;
}
