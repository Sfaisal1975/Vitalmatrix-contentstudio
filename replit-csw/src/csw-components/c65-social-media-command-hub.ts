/**
 * Component 65: Social Media Command Hub
 *
 * Master dashboard connecting ALL social media components (C56-C65) into
 * one unified command centre. Aggregates content pipeline, social metrics,
 * ad performance, quiz/lead magnet conversions, nurture funnel, and cohort
 * progress. Generates HTML dashboards, daily briefs, weekly reports, and
 * monthly reviews for Dr Faisal.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Health status for the overall hub */
export type HealthStatus = 'GREEN' | 'AMBER' | 'RED';

/** Status for individual components */
export type ComponentActivity = 'active' | 'needs-attention' | 'critical';

/** Status of a single component in the hub */
export interface ComponentStatus {
  /** Component name */
  name: string;
  /** Current operational status */
  status: ComponentActivity;
  /** Key metric summary */
  metric: string;
  /** Last action taken */
  lastAction: string;
}

/** Overall hub status */
export interface CommandHubStatus {
  /** Last updated timestamp */
  lastUpdated: string;
  /** Status of each component */
  components: ComponentStatus[];
  /** Overall system health */
  overallHealth: HealthStatus;
}

/** Full hub dashboard data */
export interface HubDashboard {
  /** Reporting period description */
  period: string;
  /** Content pipeline counts */
  contentPipeline: {
    drafted: number;
    scheduled: number;
    posted: number;
    failed: number;
  };
  /** Aggregated social metrics */
  socialMetrics: {
    totalReach: number;
    totalEngagement: number;
    engagementRate: number;
    followers: Record<string, number>;
  };
  /** Ad campaign metrics */
  adMetrics: {
    totalSpend: number;
    totalConversions: number;
    roas: number;
    bestAd: string;
  };
  /** Quiz funnel metrics */
  quizMetrics: {
    started: number;
    completed: number;
    emailsCaptured: number;
    completionRate: number;
  };
  /** Lead magnet metrics */
  leadMagnetMetrics: {
    downloads: number;
    emailsCaptured: number;
    topMagnet: string;
  };
  /** Nurture sequence metrics */
  nurtureMetrics: {
    activeContacts: number;
    emailsSent: number;
    openRate: number;
    clickRate: number;
  };
  /** Conversion funnel metrics */
  funnelMetrics: {
    impressions: number;
    conversions: number;
    overallRate: number;
    costPerConversion: number;
  };
  /** Founding cohort progress */
  cohortProgress: {
    filled: number;
    target: 10;
    spotsRemaining: number;
  };
  /** Top priority actions */
  topActions: string[];
}

// --- State ---

/** Internal data store for component metrics */
const componentData: {
  contentPipeline: HubDashboard['contentPipeline'];
  socialMetrics: HubDashboard['socialMetrics'];
  adMetrics: HubDashboard['adMetrics'];
  quizMetrics: HubDashboard['quizMetrics'];
  leadMagnetMetrics: HubDashboard['leadMagnetMetrics'];
  nurtureMetrics: HubDashboard['nurtureMetrics'];
  funnelMetrics: HubDashboard['funnelMetrics'];
  cohortFilled: number;
  componentStatuses: ComponentStatus[];
} = {
  contentPipeline: { drafted: 0, scheduled: 0, posted: 0, failed: 0 },
  socialMetrics: { totalReach: 0, totalEngagement: 0, engagementRate: 0, followers: {} },
  adMetrics: { totalSpend: 0, totalConversions: 0, roas: 0, bestAd: 'N/A' },
  quizMetrics: { started: 0, completed: 0, emailsCaptured: 0, completionRate: 0 },
  leadMagnetMetrics: { downloads: 0, emailsCaptured: 0, topMagnet: 'N/A' },
  nurtureMetrics: { activeContacts: 0, emailsSent: 0, openRate: 0, clickRate: 0 },
  funnelMetrics: { impressions: 0, conversions: 0, overallRate: 0, costPerConversion: 0 },
  cohortFilled: 0,
  componentStatuses: [],
};

// --- Data Update Functions ---

/**
 * Updates content pipeline metrics.
 * @param data - Pipeline counts
 */
export function updateContentPipeline(data: HubDashboard['contentPipeline']): void {
  componentData.contentPipeline = { ...data };
}

/**
 * Updates social media metrics.
 * @param data - Social metrics
 */
export function updateSocialMetrics(data: HubDashboard['socialMetrics']): void {
  componentData.socialMetrics = { ...data };
}

/**
 * Updates ad campaign metrics.
 * @param data - Ad metrics
 */
export function updateAdMetrics(data: HubDashboard['adMetrics']): void {
  componentData.adMetrics = { ...data };
}

/**
 * Updates quiz funnel metrics.
 * @param data - Quiz metrics
 */
export function updateQuizMetrics(data: HubDashboard['quizMetrics']): void {
  componentData.quizMetrics = { ...data };
}

/**
 * Updates lead magnet metrics.
 * @param data - Lead magnet metrics
 */
export function updateLeadMagnetMetrics(data: HubDashboard['leadMagnetMetrics']): void {
  componentData.leadMagnetMetrics = { ...data };
}

/**
 * Updates nurture sequence metrics.
 * @param data - Nurture metrics
 */
export function updateNurtureMetrics(data: HubDashboard['nurtureMetrics']): void {
  componentData.nurtureMetrics = { ...data };
}

/**
 * Updates conversion funnel metrics.
 * @param data - Funnel metrics
 */
export function updateFunnelMetrics(data: HubDashboard['funnelMetrics']): void {
  componentData.funnelMetrics = { ...data };
}

/**
 * Updates founding cohort filled count.
 * @param filled - Number of spots filled
 */
export function updateCohortProgress(filled: number): void {
  componentData.cohortFilled = Math.min(filled, 10);
}

/**
 * Updates a component's operational status.
 * @param name - Component name
 * @param status - Operational status
 * @param metric - Key metric string
 * @param lastAction - Last action description
 */
export function updateComponentStatus(
  name: string,
  status: ComponentActivity,
  metric: string,
  lastAction: string
): void {
  const existing = componentData.componentStatuses.findIndex((c) => c.name === name);
  const entry: ComponentStatus = { name, status, metric, lastAction };
  if (existing >= 0) {
    componentData.componentStatuses[existing] = entry;
  } else {
    componentData.componentStatuses.push(entry);
  }
}

// --- Core Functions ---

/**
 * Builds the full hub dashboard by aggregating data from all components.
 * @param period - Reporting period description (e.g. 'This Week', 'June 2026')
 * @returns Complete HubDashboard
 */
export function buildHubDashboard(period: string): HubDashboard {
  const cohortFilled = componentData.cohortFilled;
  const spotsRemaining = 10 - cohortFilled;

  const topActions = getTopActions(5);

  return {
    period,
    contentPipeline: { ...componentData.contentPipeline },
    socialMetrics: { ...componentData.socialMetrics },
    adMetrics: { ...componentData.adMetrics },
    quizMetrics: { ...componentData.quizMetrics },
    leadMagnetMetrics: { ...componentData.leadMagnetMetrics },
    nurtureMetrics: { ...componentData.nurtureMetrics },
    funnelMetrics: { ...componentData.funnelMetrics },
    cohortProgress: {
      filled: cohortFilled,
      target: 10,
      spotsRemaining,
    },
    topActions,
  };
}

/**
 * Checks each component for issues and returns overall hub health.
 * @returns CommandHubStatus with per-component statuses and overall health
 */
export function getComponentHealth(): CommandHubStatus {
  const statuses = [...componentData.componentStatuses];

  // Auto-detect issues if no manual statuses set
  if (statuses.length === 0) {
    // Content pipeline
    const cp = componentData.contentPipeline;
    statuses.push({
      name: 'Content Pipeline',
      status: cp.failed > 0 ? 'needs-attention' : 'active',
      metric: `${cp.posted} posted, ${cp.scheduled} queued, ${cp.failed} failed`,
      lastAction: cp.failed > 0 ? 'Review failed posts' : 'Pipeline running',
    });

    // Social metrics
    const sm = componentData.socialMetrics;
    statuses.push({
      name: 'Social Metrics',
      status: sm.engagementRate < 1 ? 'needs-attention' : 'active',
      metric: `Reach: ${sm.totalReach.toLocaleString()} | Engagement: ${sm.engagementRate.toFixed(1)}%`,
      lastAction: 'Tracking active',
    });

    // Ad performance
    const am = componentData.adMetrics;
    statuses.push({
      name: 'Ad Performance',
      status: am.roas < 1 && am.totalSpend > 0 ? 'critical' : 'active',
      metric: `Spend: ${VM_BRAND.pricing.currency} ${am.totalSpend.toFixed(0)} | ROAS: ${am.roas.toFixed(1)}x`,
      lastAction: am.bestAd !== 'N/A' ? `Best ad: ${am.bestAd}` : 'No ads running',
    });

    // Quiz funnel
    const qm = componentData.quizMetrics;
    statuses.push({
      name: 'Quiz Funnel',
      status: qm.completionRate < 50 && qm.started > 10 ? 'needs-attention' : 'active',
      metric: `${qm.completed}/${qm.started} completed (${qm.completionRate.toFixed(0)}%)`,
      lastAction: `${qm.emailsCaptured} emails captured`,
    });

    // Lead magnets
    const lm = componentData.leadMagnetMetrics;
    statuses.push({
      name: 'Lead Magnets',
      status: lm.downloads === 0 ? 'needs-attention' : 'active',
      metric: `${lm.downloads} downloads | ${lm.emailsCaptured} emails`,
      lastAction: lm.topMagnet !== 'N/A' ? `Top: ${lm.topMagnet}` : 'No downloads yet',
    });

    // Nurture sequences
    const nm = componentData.nurtureMetrics;
    statuses.push({
      name: 'Nurture Sequences',
      status: nm.openRate < 20 && nm.emailsSent > 50 ? 'needs-attention' : 'active',
      metric: `${nm.activeContacts} active | Open: ${nm.openRate.toFixed(0)}% | Click: ${nm.clickRate.toFixed(0)}%`,
      lastAction: `${nm.emailsSent} emails sent`,
    });

    // Conversion funnel
    const fm = componentData.funnelMetrics;
    statuses.push({
      name: 'Conversion Funnel',
      status: fm.overallRate < 1 && fm.impressions > 1000 ? 'needs-attention' : 'active',
      metric: `${fm.impressions.toLocaleString()} -> ${fm.conversions} (${fm.overallRate.toFixed(2)}%)`,
      lastAction: fm.conversions > 0
        ? `CPC: ${VM_BRAND.pricing.currency} ${fm.costPerConversion.toFixed(0)}`
        : 'Awaiting first conversion',
    });

    // Cohort progress
    const cohort = componentData.cohortFilled;
    statuses.push({
      name: 'Founding Cohort',
      status: cohort >= 8 ? 'active' : cohort >= 5 ? 'active' : 'needs-attention',
      metric: `${cohort}/10 filled (${10 - cohort} remaining)`,
      lastAction: cohort >= 10 ? 'COHORT FULL' : `${10 - cohort} spots to fill`,
    });
  }

  const criticalCount = statuses.filter((s) => s.status === 'critical').length;
  const attentionCount = statuses.filter((s) => s.status === 'needs-attention').length;

  let overallHealth: HealthStatus = 'GREEN';
  if (criticalCount > 0) overallHealth = 'RED';
  else if (attentionCount >= 3) overallHealth = 'RED';
  else if (attentionCount > 0) overallHealth = 'AMBER';

  return {
    lastUpdated: new Date().toISOString(),
    components: statuses,
    overallHealth,
  };
}

/**
 * Returns a prioritised list of actions based on current metrics.
 * @param count - Maximum number of actions to return
 * @returns Array of action strings
 */
export function getTopActions(count: number = 5): string[] {
  const actions: { priority: number; text: string }[] = [];

  const cp = componentData.contentPipeline;
  if (cp.failed > 0) {
    actions.push({ priority: 1, text: `${cp.failed} post(s) failed -- review and reschedule immediately.` });
  }
  if (cp.scheduled === 0 && cp.drafted > 0) {
    actions.push({ priority: 2, text: `${cp.drafted} drafts awaiting scheduling -- schedule this week's content.` });
  }

  const am = componentData.adMetrics;
  if (am.roas < 1 && am.totalSpend > 50) {
    actions.push({ priority: 1, text: `Ad ROAS below 1.0x (${am.roas.toFixed(1)}x) -- pause underperforming creatives.` });
  }

  const qm = componentData.quizMetrics;
  if (qm.completionRate < 50 && qm.started > 10) {
    actions.push({ priority: 2, text: `Quiz completion rate ${qm.completionRate.toFixed(0)}% -- review question flow and reduce friction.` });
  }

  const nm = componentData.nurtureMetrics;
  if (nm.openRate < 20 && nm.emailsSent > 20) {
    actions.push({ priority: 2, text: `Nurture open rate ${nm.openRate.toFixed(0)}% -- test new subject lines.` });
  }
  if (nm.clickRate < 3 && nm.emailsSent > 20) {
    actions.push({ priority: 3, text: `Nurture click rate ${nm.clickRate.toFixed(1)}% -- improve CTA placement and copy.` });
  }

  const sm = componentData.socialMetrics;
  if (sm.engagementRate > 5) {
    actions.push({ priority: 3, text: `Engagement rate ${sm.engagementRate.toFixed(1)}% is strong -- increase posting frequency.` });
  }
  if (sm.engagementRate < 1 && sm.totalReach > 1000) {
    actions.push({ priority: 2, text: `Engagement rate below 1% -- review content mix and posting times.` });
  }

  const cohort = componentData.cohortFilled;
  if (cohort < 10 && cohort >= 7) {
    actions.push({ priority: 1, text: `Founding cohort ${cohort}/10 -- ${10 - cohort} spots left. Push discovery call bookings.` });
  }

  const fm = componentData.funnelMetrics;
  if (fm.conversions === 0 && fm.impressions > 500) {
    actions.push({ priority: 1, text: 'Zero conversions despite impressions -- review full funnel for bottlenecks.' });
  }

  const lm = componentData.leadMagnetMetrics;
  if (lm.downloads > 10 && lm.emailsCaptured < lm.downloads * 0.5) {
    actions.push({ priority: 2, text: `Lead magnet email capture rate low (${lm.emailsCaptured}/${lm.downloads}) -- review capture form.` });
  }

  // Sort by priority and take top N
  actions.sort((a, b) => a.priority - b.priority);
  return actions.slice(0, count).map((a) => a.text);
}

/**
 * Generates a single-line quick stats summary.
 * @returns Summary string
 */
export function quickStats(): string {
  const sm = componentData.socialMetrics;
  const fm = componentData.funnelMetrics;
  const nm = componentData.nurtureMetrics;
  const cohort = componentData.cohortFilled;

  const reachStr = sm.totalReach >= 1000
    ? `${(sm.totalReach / 1000).toFixed(1)}K`
    : String(sm.totalReach);

  return `Reach: ${reachStr} | Leads: ${nm.activeContacts} | Conversions: ${fm.conversions} | Spots: ${10 - cohort}/10 remaining`;
}

/**
 * Generates a 5-line daily brief for Dr Faisal.
 * @returns Daily brief string
 */
export function generateDailyBrief(): string {
  const today = new Date().toISOString().split('T')[0];
  const cp = componentData.contentPipeline;
  const sm = componentData.socialMetrics;
  const nm = componentData.nurtureMetrics;
  const fm = componentData.funnelMetrics;
  const cohort = componentData.cohortFilled;

  const lines = [
    `VitalMatrix Daily Brief -- ${today}`,
    `Content: ${cp.posted} posted today, ${cp.scheduled} queued, ${cp.failed} failed.`,
    `Social: ${sm.totalReach.toLocaleString()} reach, ${sm.engagementRate.toFixed(1)}% engagement.`,
    `Pipeline: ${nm.activeContacts} nurture contacts, ${fm.conversions} conversions (${fm.overallRate.toFixed(2)}%).`,
    `Cohort: ${cohort}/10 founding spots filled (${10 - cohort} remaining).`,
  ];

  return lines.join('\n');
}

/**
 * Generates a full weekly markdown report.
 * @param weekLabel - Week label (e.g. 'W23 2026')
 * @returns Markdown-formatted weekly report
 */
export function generateWeeklyReport(weekLabel: string): string {
  const dashboard = buildHubDashboard(weekLabel);
  const health = getComponentHealth();
  const actions = getTopActions(5);

  const lines: string[] = [
    `# VitalMatrix Social Media Weekly Report`,
    '',
    `**Period:** ${weekLabel}`,
    `**Overall Health:** ${health.overallHealth}`,
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Founding Cohort Progress',
    '',
    `**${dashboard.cohortProgress.filled}/10** spots filled | **${dashboard.cohortProgress.spotsRemaining}** remaining`,
    `Rate: ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month (fixed ${VM_BRAND.pricing.foundingFixedMonths} months)`,
    '',
    '## Content Pipeline',
    '',
    `| Status | Count |`,
    `|--------|------:|`,
    `| Drafted | ${dashboard.contentPipeline.drafted} |`,
    `| Scheduled | ${dashboard.contentPipeline.scheduled} |`,
    `| Posted | ${dashboard.contentPipeline.posted} |`,
    `| Failed | ${dashboard.contentPipeline.failed} |`,
    '',
    '## Social Metrics',
    '',
    `| Metric | Value |`,
    `|--------|------:|`,
    `| Total Reach | ${dashboard.socialMetrics.totalReach.toLocaleString()} |`,
    `| Total Engagement | ${dashboard.socialMetrics.totalEngagement.toLocaleString()} |`,
    `| Engagement Rate | ${dashboard.socialMetrics.engagementRate.toFixed(1)}% |`,
  ];

  for (const [platform, count] of Object.entries(dashboard.socialMetrics.followers)) {
    lines.push(`| ${platform} Followers | ${count.toLocaleString()} |`);
  }

  lines.push('');
  lines.push('## Ad Performance');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|------:|`);
  lines.push(`| Total Spend | ${VM_BRAND.pricing.currency} ${dashboard.adMetrics.totalSpend.toFixed(0)} |`);
  lines.push(`| Conversions | ${dashboard.adMetrics.totalConversions} |`);
  lines.push(`| ROAS | ${dashboard.adMetrics.roas.toFixed(1)}x |`);
  lines.push(`| Best Ad | ${dashboard.adMetrics.bestAd} |`);

  lines.push('');
  lines.push('## Quiz and Lead Magnets');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|------:|`);
  lines.push(`| Quiz Started | ${dashboard.quizMetrics.started} |`);
  lines.push(`| Quiz Completed | ${dashboard.quizMetrics.completed} |`);
  lines.push(`| Quiz Completion Rate | ${dashboard.quizMetrics.completionRate.toFixed(0)}% |`);
  lines.push(`| Lead Magnet Downloads | ${dashboard.leadMagnetMetrics.downloads} |`);
  lines.push(`| Emails Captured | ${dashboard.quizMetrics.emailsCaptured + dashboard.leadMagnetMetrics.emailsCaptured} |`);

  lines.push('');
  lines.push('## Nurture Pipeline');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|------:|`);
  lines.push(`| Active Contacts | ${dashboard.nurtureMetrics.activeContacts} |`);
  lines.push(`| Emails Sent | ${dashboard.nurtureMetrics.emailsSent} |`);
  lines.push(`| Open Rate | ${dashboard.nurtureMetrics.openRate.toFixed(0)}% |`);
  lines.push(`| Click Rate | ${dashboard.nurtureMetrics.clickRate.toFixed(1)}% |`);

  lines.push('');
  lines.push('## Conversion Funnel');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|------:|`);
  lines.push(`| Impressions | ${dashboard.funnelMetrics.impressions.toLocaleString()} |`);
  lines.push(`| Conversions | ${dashboard.funnelMetrics.conversions} |`);
  lines.push(`| Overall Rate | ${dashboard.funnelMetrics.overallRate.toFixed(2)}% |`);
  lines.push(`| Cost per Conversion | ${VM_BRAND.pricing.currency} ${dashboard.funnelMetrics.costPerConversion.toFixed(0)} |`);

  lines.push('');
  lines.push('## Component Health');
  lines.push('');
  lines.push('| Component | Status | Key Metric |');
  lines.push('|-----------|--------|------------|');
  for (const comp of health.components) {
    const statusIndicator = comp.status === 'active' ? 'OK' : comp.status === 'needs-attention' ? 'ATTENTION' : 'CRITICAL';
    lines.push(`| ${comp.name} | ${statusIndicator} | ${comp.metric} |`);
  }

  lines.push('');
  lines.push('## Top Actions');
  lines.push('');
  for (let i = 0; i < actions.length; i++) {
    lines.push(`${i + 1}. ${actions[i]}`);
  }

  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generates a monthly performance review with trends.
 * @param monthLabel - Month label (e.g. 'June 2026')
 * @returns Markdown-formatted monthly review
 */
export function generateMonthlyReview(monthLabel: string): string {
  const dashboard = buildHubDashboard(monthLabel);
  const health = getComponentHealth();

  const lines: string[] = [
    `# VitalMatrix Monthly Performance Review`,
    '',
    `**Month:** ${monthLabel}`,
    `**Prepared for:** ${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`,
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Executive Summary',
    '',
    `Overall health: **${health.overallHealth}**`,
    '',
    `The VitalMatrix social media and marketing engine delivered ${dashboard.socialMetrics.totalReach.toLocaleString()} total reach across all channels with an engagement rate of ${dashboard.socialMetrics.engagementRate.toFixed(1)}%. The conversion funnel processed ${dashboard.funnelMetrics.impressions.toLocaleString()} impressions resulting in ${dashboard.funnelMetrics.conversions} conversion(s). The founding cohort stands at ${dashboard.cohortProgress.filled}/10 practitioners.`,
    '',
    '## Founding Cohort Status',
    '',
    `| Metric | Value |`,
    `|--------|------:|`,
    `| Spots Filled | ${dashboard.cohortProgress.filled}/10 |`,
    `| Spots Remaining | ${dashboard.cohortProgress.spotsRemaining} |`,
    `| Founding Rate | ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.foundingMonthly}/month |`,
    `| Rate Lock Period | ${VM_BRAND.pricing.foundingFixedMonths} months |`,
    `| Standard Rate | ${VM_BRAND.pricing.currency} ${VM_BRAND.pricing.standardRate}/month |`,
    '',
    '## Channel Performance',
    '',
    '### Content Output',
    '',
    `- ${dashboard.contentPipeline.posted} posts published`,
    `- ${dashboard.contentPipeline.failed} posts failed (${dashboard.contentPipeline.posted > 0 ? ((dashboard.contentPipeline.failed / (dashboard.contentPipeline.posted + dashboard.contentPipeline.failed)) * 100).toFixed(1) : '0.0'}% failure rate)`,
    `- ${dashboard.contentPipeline.drafted} drafts in pipeline`,
    '',
    '### Advertising',
    '',
    `- Total spend: ${VM_BRAND.pricing.currency} ${dashboard.adMetrics.totalSpend.toFixed(0)}`,
    `- Return on ad spend: ${dashboard.adMetrics.roas.toFixed(1)}x`,
    `- Best-performing ad: ${dashboard.adMetrics.bestAd}`,
    '',
    '### Lead Generation',
    '',
    `- Quiz completions: ${dashboard.quizMetrics.completed} (${dashboard.quizMetrics.completionRate.toFixed(0)}% completion rate)`,
    `- Lead magnet downloads: ${dashboard.leadMagnetMetrics.downloads}`,
    `- Total emails captured: ${dashboard.quizMetrics.emailsCaptured + dashboard.leadMagnetMetrics.emailsCaptured}`,
    '',
    '### Nurture Pipeline',
    '',
    `- Active contacts in nurture: ${dashboard.nurtureMetrics.activeContacts}`,
    `- Email open rate: ${dashboard.nurtureMetrics.openRate.toFixed(0)}%`,
    `- Email click rate: ${dashboard.nurtureMetrics.clickRate.toFixed(1)}%`,
    '',
    '## Key Learnings',
    '',
  ];

  // Generate learnings from the data
  if (dashboard.socialMetrics.engagementRate > 3) {
    lines.push('- Strong engagement rate indicates content resonance with practitioner audience.');
  }
  if (dashboard.quizMetrics.completionRate < 50 && dashboard.quizMetrics.started > 10) {
    lines.push('- Quiz completion rate below 50% suggests the quiz may be too long or complex. Consider streamlining.');
  }
  if (dashboard.adMetrics.roas > 2) {
    lines.push('- Ad ROAS above 2x indicates efficient ad spend. Consider scaling budget on top-performing creatives.');
  }
  if (dashboard.adMetrics.roas < 1 && dashboard.adMetrics.totalSpend > 0) {
    lines.push('- Ad ROAS below 1x requires immediate attention. Review targeting and creative performance.');
  }
  if (dashboard.nurtureMetrics.openRate > 30) {
    lines.push('- Nurture email open rates above 30% show strong subject line performance.');
  }
  if (dashboard.nurtureMetrics.openRate < 20 && dashboard.nurtureMetrics.emailsSent > 50) {
    lines.push('- Nurture email open rates below 20% suggest subject line or sender reputation issues.');
  }

  lines.push('');
  lines.push('## Next Month Priorities');
  lines.push('');
  const actions = getTopActions(5);
  for (let i = 0; i < actions.length; i++) {
    lines.push(`${i + 1}. ${actions[i]}`);
  }

  if (dashboard.cohortProgress.spotsRemaining > 0) {
    lines.push(`${actions.length + 1}. Fill remaining ${dashboard.cohortProgress.spotsRemaining} founding cohort spot(s).`);
  }

  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.tmFooter);

  return lines.join('\n');
}

/**
 * Generates a full-page VM-styled HTML command centre dashboard.
 * Includes cohort progress bar, content pipeline, social metrics, ad cards,
 * quiz/lead magnet rates, nurture funnel, and top actions.
 * @returns HTML string for the command centre
 */
export function generateHubDashboardHtml(): string {
  const dashboard = buildHubDashboard('Current Period');
  const health = getComponentHealth();
  const actions = getTopActions(5);
  const stats = quickStats();

  const cohortPct = (dashboard.cohortProgress.filled / 10) * 100;

  const healthColour = health.overallHealth === 'GREEN'
    ? '#2ECC71'
    : health.overallHealth === 'AMBER'
      ? '#F39C12'
      : '#E74C3C';

  const componentRows = health.components
    .map((c) => {
      const statusColour = c.status === 'active'
        ? '#2ECC71'
        : c.status === 'needs-attention'
          ? '#F39C12'
          : '#E74C3C';
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid ${VM_BRAND.colours.prussianBlue}33;">${c.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid ${VM_BRAND.colours.prussianBlue}33;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${statusColour};margin-right:6px;"></span>${c.status}
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid ${VM_BRAND.colours.prussianBlue}33;font-family:'${VM_BRAND.fonts.data}',monospace;font-size:12px;">${c.metric}</td>
        </tr>`;
    })
    .join('');

  const actionItems = actions
    .map((a, i) => `<li style="margin-bottom:8px;font-size:14px;">${i + 1}. ${a}</li>`)
    .join('');

  const followerEntries = Object.entries(dashboard.socialMetrics.followers)
    .map(([p, c]) => `<div style="text-align:center;"><div style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:20px;color:${VM_BRAND.colours.gold};">${c.toLocaleString()}</div><div style="font-size:12px;opacity:0.6;">${p}</div></div>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>VitalMatrix Social Media Command Hub</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@300;400;600&family=DM+Mono:wght@400&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:${VM_BRAND.colours.prussianBlue}; color:${VM_BRAND.colours.white}; font-family:'${VM_BRAND.fonts.body}',sans-serif; }
    .card { background:${VM_BRAND.colours.charcoal}; border-radius:12px; padding:20px; border:1px solid ${VM_BRAND.colours.teal}22; }
    .metric-value { font-family:'${VM_BRAND.fonts.data}',monospace; font-size:24px; color:${VM_BRAND.colours.gold}; }
    .metric-label { font-size:12px; opacity:0.6; margin-top:4px; }
    h1,h2,h3 { font-family:'${VM_BRAND.fonts.heading}',serif; }
    .grid { display:grid; gap:16px; }
    .grid-2 { grid-template-columns:1fr 1fr; }
    .grid-3 { grid-template-columns:1fr 1fr 1fr; }
    .grid-4 { grid-template-columns:1fr 1fr 1fr 1fr; }
  </style>
</head>
<body>
  <div style="max-width:1200px;margin:0 auto;padding:32px;">

    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <div>
        <h1 style="font-size:32px;color:${VM_BRAND.colours.gold};">Social Media Command Hub</h1>
        <p style="font-size:14px;opacity:0.6;">${VM_BRAND.credentials.company} | ${stats}</p>
      </div>
      <div style="text-align:right;">
        <div style="display:inline-block;padding:8px 16px;border-radius:8px;background:${healthColour}20;border:1px solid ${healthColour};">
          <span style="color:${healthColour};font-weight:600;font-size:14px;">System: ${health.overallHealth}</span>
        </div>
      </div>
    </div>

    <!-- Cohort Progress -->
    <div class="card" style="margin-bottom:16px;">
      <h2 style="font-size:18px;color:${VM_BRAND.colours.gold};margin-bottom:12px;">Founding Cohort Progress</h2>
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="flex:1;background:${VM_BRAND.colours.prussianBlue};border-radius:8px;height:32px;overflow:hidden;">
          <div style="width:${cohortPct}%;height:100%;background:linear-gradient(90deg,${VM_BRAND.colours.teal},${VM_BRAND.colours.gold});border-radius:8px;display:flex;align-items:center;justify-content:center;">
            <span style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:13px;color:${VM_BRAND.colours.charcoal};font-weight:600;">${dashboard.cohortProgress.filled}/10</span>
          </div>
        </div>
        <div style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:14px;color:${VM_BRAND.colours.gold};">${dashboard.cohortProgress.spotsRemaining} spots remaining</div>
      </div>
    </div>

    <!-- Content Pipeline + Social Metrics -->
    <div class="grid grid-2" style="margin-bottom:16px;">
      <div class="card">
        <h3 style="font-size:16px;color:${VM_BRAND.colours.teal};margin-bottom:12px;">Content Pipeline</h3>
        <div class="grid grid-4">
          <div><div class="metric-value">${dashboard.contentPipeline.drafted}</div><div class="metric-label">Drafted</div></div>
          <div><div class="metric-value">${dashboard.contentPipeline.scheduled}</div><div class="metric-label">Scheduled</div></div>
          <div><div class="metric-value">${dashboard.contentPipeline.posted}</div><div class="metric-label">Posted</div></div>
          <div><div class="metric-value" style="color:${dashboard.contentPipeline.failed > 0 ? '#E74C3C' : VM_BRAND.colours.gold};">${dashboard.contentPipeline.failed}</div><div class="metric-label">Failed</div></div>
        </div>
      </div>
      <div class="card">
        <h3 style="font-size:16px;color:${VM_BRAND.colours.teal};margin-bottom:12px;">Social Metrics</h3>
        <div class="grid grid-3">
          <div><div class="metric-value">${dashboard.socialMetrics.totalReach >= 1000 ? (dashboard.socialMetrics.totalReach / 1000).toFixed(1) + 'K' : dashboard.socialMetrics.totalReach}</div><div class="metric-label">Reach</div></div>
          <div><div class="metric-value">${dashboard.socialMetrics.totalEngagement.toLocaleString()}</div><div class="metric-label">Engagement</div></div>
          <div><div class="metric-value">${dashboard.socialMetrics.engagementRate.toFixed(1)}%</div><div class="metric-label">Eng. Rate</div></div>
        </div>
        <div style="display:flex;gap:16px;margin-top:12px;justify-content:space-around;">
          ${followerEntries}
        </div>
      </div>
    </div>

    <!-- Ad Performance + Quiz/Lead Magnets -->
    <div class="grid grid-2" style="margin-bottom:16px;">
      <div class="card">
        <h3 style="font-size:16px;color:${VM_BRAND.colours.teal};margin-bottom:12px;">Ad Performance</h3>
        <div class="grid grid-3">
          <div><div class="metric-value">${VM_BRAND.pricing.currency} ${dashboard.adMetrics.totalSpend.toFixed(0)}</div><div class="metric-label">Spend</div></div>
          <div><div class="metric-value">${dashboard.adMetrics.totalConversions}</div><div class="metric-label">Conversions</div></div>
          <div><div class="metric-value">${dashboard.adMetrics.roas.toFixed(1)}x</div><div class="metric-label">ROAS</div></div>
        </div>
        <div style="margin-top:8px;font-size:12px;opacity:0.6;">Best: ${dashboard.adMetrics.bestAd}</div>
      </div>
      <div class="card">
        <h3 style="font-size:16px;color:${VM_BRAND.colours.teal};margin-bottom:12px;">Quiz and Lead Magnets</h3>
        <div class="grid grid-4">
          <div><div class="metric-value">${dashboard.quizMetrics.started}</div><div class="metric-label">Quiz Started</div></div>
          <div><div class="metric-value">${dashboard.quizMetrics.completed}</div><div class="metric-label">Completed</div></div>
          <div><div class="metric-value">${dashboard.quizMetrics.completionRate.toFixed(0)}%</div><div class="metric-label">Completion</div></div>
          <div><div class="metric-value">${dashboard.leadMagnetMetrics.downloads}</div><div class="metric-label">Downloads</div></div>
        </div>
      </div>
    </div>

    <!-- Nurture + Funnel -->
    <div class="grid grid-2" style="margin-bottom:16px;">
      <div class="card">
        <h3 style="font-size:16px;color:${VM_BRAND.colours.teal};margin-bottom:12px;">Nurture Pipeline</h3>
        <div class="grid grid-4">
          <div><div class="metric-value">${dashboard.nurtureMetrics.activeContacts}</div><div class="metric-label">Active</div></div>
          <div><div class="metric-value">${dashboard.nurtureMetrics.emailsSent}</div><div class="metric-label">Sent</div></div>
          <div><div class="metric-value">${dashboard.nurtureMetrics.openRate.toFixed(0)}%</div><div class="metric-label">Open Rate</div></div>
          <div><div class="metric-value">${dashboard.nurtureMetrics.clickRate.toFixed(1)}%</div><div class="metric-label">Click Rate</div></div>
        </div>
      </div>
      <div class="card">
        <h3 style="font-size:16px;color:${VM_BRAND.colours.teal};margin-bottom:12px;">Conversion Funnel</h3>
        <div class="grid grid-4">
          <div><div class="metric-value">${dashboard.funnelMetrics.impressions >= 1000 ? (dashboard.funnelMetrics.impressions / 1000).toFixed(1) + 'K' : dashboard.funnelMetrics.impressions}</div><div class="metric-label">Impressions</div></div>
          <div><div class="metric-value">${dashboard.funnelMetrics.conversions}</div><div class="metric-label">Conversions</div></div>
          <div><div class="metric-value">${dashboard.funnelMetrics.overallRate.toFixed(2)}%</div><div class="metric-label">Conv. Rate</div></div>
          <div><div class="metric-value">${VM_BRAND.pricing.currency} ${dashboard.funnelMetrics.costPerConversion.toFixed(0)}</div><div class="metric-label">Cost/Conv.</div></div>
        </div>
      </div>
    </div>

    <!-- Component Health -->
    <div class="card" style="margin-bottom:16px;">
      <h3 style="font-size:16px;color:${VM_BRAND.colours.teal};margin-bottom:12px;">Component Health</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="opacity:0.5;">
            <th style="text-align:left;padding:8px 12px;">Component</th>
            <th style="text-align:left;padding:8px 12px;">Status</th>
            <th style="text-align:left;padding:8px 12px;">Key Metric</th>
          </tr>
        </thead>
        <tbody>
          ${componentRows}
        </tbody>
      </table>
    </div>

    <!-- Top Actions -->
    <div class="card">
      <h3 style="font-size:16px;color:${VM_BRAND.colours.gold};margin-bottom:12px;">Top Actions</h3>
      <ol style="list-style:none;padding:0;">
        ${actionItems}
      </ol>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;text-align:center;font-size:11px;opacity:0.4;">
      <p>${VM_BRAND.regulatoryFooter}</p>
      <p style="margin-top:4px;">${VM_BRAND.tmFooter}</p>
    </div>
  </div>
</body>
</html>`;
}
