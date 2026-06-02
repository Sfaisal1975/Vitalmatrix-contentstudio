/**
 * Component 45: Content Metrics Dashboard
 *
 * Executive dashboard aggregating all Content Studio Web data.
 * Combines content metrics, CRM pipeline, calendar status, cohort
 * progress, and performance scores into a single view. Generates
 * VM-styled HTML dashboards, weekly email summaries, and
 * prioritised action items.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Content item input (from C26) */
export interface ContentItemInput {
  id: string;
  title: string;
  status: 'draft' | 'review' | 'published' | 'stale';
  lastUpdated: string;
  score?: number;
}

/** Lead input (from C27) */
export interface LeadInput {
  id: string;
  name: string;
  status: 'new' | 'contacted' | 'discovery-call' | 'proposal' | 'converted' | 'lost';
}

/** Calendar entry input (from C29) */
export interface CalendarEntryInput {
  id: string;
  title: string;
  status: 'scheduled' | 'published' | 'overdue' | 'skipped';
  scheduledDate: string;
}

/** Cohort progress input (from C34) */
export interface CohortProgressInput {
  spotsFilled: number;
  spotsTotal: number;
  activeThisMonth: number;
}

/** Performance score input (from C35) */
export interface PerformanceScoreInput {
  contentId: string;
  title: string;
  overallScore: number;
}

/** Aggregated content metrics */
export interface ContentMetrics {
  total: number;
  published: number;
  drafts: number;
  stale: number;
  avgScore: number;
}

/** Aggregated CRM metrics */
export interface CrmMetrics {
  totalLeads: number;
  converted: number;
  conversionRate: number;
  pipeline: number;
}

/** Aggregated calendar metrics */
export interface CalendarMetrics {
  scheduledThisMonth: number;
  published: number;
  overdue: number;
}

/** Aggregated cohort metrics */
export interface CohortMetrics {
  spotsFilled: number;
  spotsRemaining: number;
  activeThisMonth: number;
}

/** Top performing content entry */
export interface TopContent {
  title: string;
  score: number;
}

/** Complete executive dashboard */
export interface ExecutiveDashboard {
  date: string;
  contentMetrics: ContentMetrics;
  crmMetrics: CrmMetrics;
  calendarMetrics: CalendarMetrics;
  cohortMetrics: CohortMetrics;
  topPerformingContent: TopContent[];
  actionItems: string[];
}

// --- Helper Functions ---

/**
 * Checks whether a date string falls within the current month.
 *
 * @param dateStr - ISO date string
 * @returns True if date is in the current month
 */
function isThisMonth(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

/**
 * Calculates the average of an array of numbers.
 *
 * @param values - Numeric values
 * @returns Average, or 0 if empty
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

// --- Public Functions ---

/**
 * Builds a complete executive dashboard from all Content Studio
 * Web data sources.
 *
 * @param contentItems - All content items (from C26)
 * @param leads - All leads (from C27)
 * @param calendarEntries - All calendar entries (from C29)
 * @param cohortProgress - Cohort progress (from C34)
 * @param performanceScores - Performance scores (from C35)
 * @returns Fully aggregated executive dashboard
 */
export function buildDashboard(
  contentItems: ContentItemInput[],
  leads: LeadInput[],
  calendarEntries: CalendarEntryInput[],
  cohortProgress: CohortProgressInput,
  performanceScores: PerformanceScoreInput[],
): ExecutiveDashboard {
  // Content metrics
  const scores = performanceScores.map(p => p.overallScore);
  const contentMetrics: ContentMetrics = {
    total: contentItems.length,
    published: contentItems.filter(c => c.status === 'published').length,
    drafts: contentItems.filter(c => c.status === 'draft').length,
    stale: contentItems.filter(c => c.status === 'stale').length,
    avgScore: average(scores),
  };

  // CRM metrics
  const converted = leads.filter(l => l.status === 'converted').length;
  const pipeline = leads.filter(l =>
    l.status === 'contacted' || l.status === 'discovery-call' || l.status === 'proposal',
  ).length;
  const crmMetrics: CrmMetrics = {
    totalLeads: leads.length,
    converted,
    conversionRate: leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0,
    pipeline,
  };

  // Calendar metrics
  const thisMonthEntries = calendarEntries.filter(e => isThisMonth(e.scheduledDate));
  const calendarMetrics: CalendarMetrics = {
    scheduledThisMonth: thisMonthEntries.length,
    published: thisMonthEntries.filter(e => e.status === 'published').length,
    overdue: calendarEntries.filter(e => e.status === 'overdue').length,
  };

  // Cohort metrics
  const cohortMetrics: CohortMetrics = {
    spotsFilled: cohortProgress.spotsFilled,
    spotsRemaining: cohortProgress.spotsTotal - cohortProgress.spotsFilled,
    activeThisMonth: cohortProgress.activeThisMonth,
  };

  // Top performing content
  const topPerformingContent: TopContent[] = [...performanceScores]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5)
    .map(p => ({ title: p.title, score: p.overallScore }));

  // Action items
  const actionItems = generateActionItems(
    contentMetrics, crmMetrics, calendarMetrics, cohortMetrics, performanceScores,
  );

  return {
    date: new Date().toISOString().substring(0, 10),
    contentMetrics,
    crmMetrics,
    calendarMetrics,
    cohortMetrics,
    topPerformingContent,
    actionItems,
  };
}

/**
 * Generates a prioritised list of action items based on
 * current dashboard state.
 *
 * @param content - Content metrics
 * @param crm - CRM metrics
 * @param calendar - Calendar metrics
 * @param cohort - Cohort metrics
 * @param scores - Performance scores
 * @returns Prioritised action items array
 */
export function generateActionItems(
  content: ContentMetrics,
  crm: CrmMetrics,
  calendar: CalendarMetrics,
  cohort: CohortMetrics,
  scores: PerformanceScoreInput[],
): string[] {
  const items: { priority: number; text: string }[] = [];

  // Critical: overdue calendar items
  if (calendar.overdue > 0) {
    items.push({
      priority: 1,
      text: `URGENT: ${calendar.overdue} calendar ${calendar.overdue === 1 ? 'item is' : 'items are'} overdue. Review and publish or reschedule immediately.`,
    });
  }

  // Critical: stale content
  if (content.stale > 0) {
    items.push({
      priority: 2,
      text: `${content.stale} content ${content.stale === 1 ? 'item has' : 'items have'} gone stale. Refresh or archive to maintain content quality.`,
    });
  }

  // High: low conversion rate
  if (crm.totalLeads > 0 && crm.conversionRate < 20) {
    items.push({
      priority: 3,
      text: `Conversion rate is ${crm.conversionRate}% (target: 20%+). Review CRM pipeline and follow-up cadence.`,
    });
  }

  // High: pipeline leads needing attention
  if (crm.pipeline > 0) {
    items.push({
      priority: 4,
      text: `${crm.pipeline} ${crm.pipeline === 1 ? 'lead is' : 'leads are'} active in the pipeline. Ensure timely follow-ups.`,
    });
  }

  // Medium: low average content score
  if (content.avgScore > 0 && content.avgScore < 70) {
    items.push({
      priority: 5,
      text: `Average content score is ${content.avgScore}/100. Target 70+. Review lowest-scoring items for improvement.`,
    });
  }

  // Medium: underperforming content
  const lowScorers = scores.filter(s => s.overallScore < 50);
  if (lowScorers.length > 0) {
    items.push({
      priority: 6,
      text: `${lowScorers.length} content ${lowScorers.length === 1 ? 'item scores' : 'items score'} below 50. Consider rewriting: ${lowScorers.slice(0, 3).map(s => s.title).join(', ')}.`,
    });
  }

  // Medium: drafts pending review
  if (content.drafts > 3) {
    items.push({
      priority: 7,
      text: `${content.drafts} drafts pending. Review and publish to maintain content velocity.`,
    });
  }

  // Low: calendar publishing gap
  if (calendar.scheduledThisMonth > 0 && calendar.published < calendar.scheduledThisMonth / 2) {
    items.push({
      priority: 8,
      text: `Only ${calendar.published} of ${calendar.scheduledThisMonth} scheduled items published this month. Accelerate publishing.`,
    });
  }

  // Cohort: remaining spots
  if (cohort.spotsRemaining > 0 && cohort.spotsRemaining <= 3) {
    items.push({
      priority: 3,
      text: `Only ${cohort.spotsRemaining} founding cohort ${cohort.spotsRemaining === 1 ? 'spot remains' : 'spots remain'}. Intensify outreach to fill cohort.`,
    });
  }

  // Cohort: no active members this month
  if (cohort.spotsFilled > 0 && cohort.activeThisMonth === 0) {
    items.push({
      priority: 4,
      text: 'No cohort members active this month. Schedule engagement touchpoint.',
    });
  }

  return items
    .sort((a, b) => a.priority - b.priority)
    .map(i => i.text);
}

/**
 * Generates a VM-styled full-page HTML dashboard with metric cards
 * for content, CRM, calendar, cohort, top content, and action items.
 *
 * @param dashboard - Executive dashboard data
 * @returns Complete HTML page string
 */
export function generateDashboardHtml(dashboard: ExecutiveDashboard): string {
  const { contentMetrics, crmMetrics, calendarMetrics, cohortMetrics, topPerformingContent, actionItems } = dashboard;

  const metricCard = (label: string, value: string | number, colour: string, sublabel?: string): string => `
    <div style="background:${VM_BRAND.colours.charcoal};border-radius:8px;padding:20px;text-align:center;border-top:3px solid ${colour};">
      <div style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:32px;color:${colour};font-weight:700;">${value}</div>
      <div style="font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:14px;color:${VM_BRAND.colours.white};margin-top:4px;">${label}</div>
      ${sublabel ? `<div style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:11px;color:${VM_BRAND.colours.white};opacity:0.5;margin-top:4px;">${sublabel}</div>` : ''}
    </div>`;

  const sectionHeading = (text: string, colour: string): string =>
    `<h2 style="font-family:'${VM_BRAND.fonts.heading}',serif;font-size:22px;color:${colour};margin:32px 0 16px;border-bottom:1px solid ${VM_BRAND.colours.deepTeal};padding-bottom:8px;">${text}</h2>`;

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Executive Dashboard | VitalMatrix Content Studio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; font-family: '${VM_BRAND.fonts.body}', sans-serif; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  </style>
</head>
<body>
  <div style="max-width:960px;margin:0 auto;padding:40px 20px;">
    <header style="text-align:center;margin-bottom:32px;">
      <h1 style="font-family:'${VM_BRAND.fonts.heading}',serif;font-size:28px;color:${VM_BRAND.colours.gold};">Executive Dashboard</h1>
      <p style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:13px;opacity:0.6;margin-top:4px;">${dashboard.date} | ${VM_BRAND.credentials.company}</p>
    </header>

    ${sectionHeading('Content', VM_BRAND.colours.teal)}
    <div class="grid-4">
      ${metricCard('Total', contentMetrics.total, VM_BRAND.colours.teal)}
      ${metricCard('Published', contentMetrics.published, VM_BRAND.colours.sage)}
      ${metricCard('Drafts', contentMetrics.drafts, VM_BRAND.colours.gold)}
      ${metricCard('Stale', contentMetrics.stale, contentMetrics.stale > 0 ? '#E74C3C' : VM_BRAND.colours.sage)}
    </div>
    <div style="margin-top:12px;">
      ${metricCard('Avg Score', `${contentMetrics.avgScore}/100`, contentMetrics.avgScore >= 70 ? VM_BRAND.colours.sage : VM_BRAND.colours.gold)}
    </div>

    ${sectionHeading('CRM Pipeline', VM_BRAND.colours.gold)}
    <div class="grid-4">
      ${metricCard('Total Leads', crmMetrics.totalLeads, VM_BRAND.colours.teal)}
      ${metricCard('Converted', crmMetrics.converted, VM_BRAND.colours.sage)}
      ${metricCard('Conversion Rate', `${crmMetrics.conversionRate}%`, crmMetrics.conversionRate >= 20 ? VM_BRAND.colours.sage : VM_BRAND.colours.gold)}
      ${metricCard('In Pipeline', crmMetrics.pipeline, VM_BRAND.colours.teal)}
    </div>

    ${sectionHeading('Calendar', VM_BRAND.colours.sage)}
    <div class="grid-3">
      ${metricCard('Scheduled', calendarMetrics.scheduledThisMonth, VM_BRAND.colours.teal, 'this month')}
      ${metricCard('Published', calendarMetrics.published, VM_BRAND.colours.sage, 'this month')}
      ${metricCard('Overdue', calendarMetrics.overdue, calendarMetrics.overdue > 0 ? '#E74C3C' : VM_BRAND.colours.sage)}
    </div>

    ${sectionHeading('Founding Cohort', VM_BRAND.colours.purple)}
    <div class="grid-3">
      ${metricCard('Spots Filled', `${cohortMetrics.spotsFilled}/10`, VM_BRAND.colours.gold)}
      ${metricCard('Remaining', cohortMetrics.spotsRemaining, cohortMetrics.spotsRemaining <= 3 ? VM_BRAND.colours.gold : VM_BRAND.colours.teal)}
      ${metricCard('Active This Month', cohortMetrics.activeThisMonth, VM_BRAND.colours.sage)}
    </div>

    ${sectionHeading('Top Performing Content', VM_BRAND.colours.teal)}
    ${topPerformingContent.length > 0 ? `
    <div style="background:${VM_BRAND.colours.charcoal};border-radius:8px;overflow:hidden;">
      ${topPerformingContent.map((item, i) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 20px;${i < topPerformingContent.length - 1 ? `border-bottom:1px solid ${VM_BRAND.colours.deepTeal};` : ''}">
          <span style="font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:14px;color:${VM_BRAND.colours.white};">${i + 1}. ${item.title}</span>
          <span style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:14px;color:${item.score >= 70 ? VM_BRAND.colours.sage : VM_BRAND.colours.gold};font-weight:700;">${item.score}</span>
        </div>`).join('')}
    </div>` : '<p style="opacity:0.6;">No performance data available.</p>'}

    ${sectionHeading('Action Items', VM_BRAND.colours.gold)}
    ${actionItems.length > 0 ? `
    <div style="background:${VM_BRAND.colours.charcoal};border-radius:8px;padding:16px 20px;">
      <ol style="margin:0;padding-left:20px;">
        ${actionItems.map(item => `
          <li style="font-family:'${VM_BRAND.fonts.body}',sans-serif;font-size:14px;color:${VM_BRAND.colours.white};margin-bottom:10px;line-height:1.5;${item.startsWith('URGENT') ? `color:${VM_BRAND.colours.gold};font-weight:600;` : ''}">${item}</li>`).join('')}
      </ol>
    </div>` : '<p style="color:' + VM_BRAND.colours.sage + ';font-size:14px;">No action items. All metrics healthy.</p>'}

    <footer style="text-align:center;padding-top:32px;margin-top:40px;border-top:1px solid ${VM_BRAND.colours.deepTeal};font-size:12px;opacity:0.6;">
      <p>${VM_BRAND.regulatoryFooter}</p>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Generates a weekly email summary dashboard for Dr Faisal.
 * Concise HTML email with key metrics, alerts, and action items.
 *
 * @param dashboard - Executive dashboard data
 * @returns HTML email string
 */
export function generateDashboardEmail(dashboard: ExecutiveDashboard): string {
  const { contentMetrics, crmMetrics, calendarMetrics, cohortMetrics, topPerformingContent, actionItems } = dashboard;

  const urgentItems = actionItems.filter(i => i.startsWith('URGENT'));
  const normalItems = actionItems.filter(i => !i.startsWith('URGENT'));

  return `<!DOCTYPE html>
<html lang="en-GB">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:${VM_BRAND.colours.prussianBlue};font-family:'${VM_BRAND.fonts.body}',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-family:'${VM_BRAND.fonts.heading}',serif;color:${VM_BRAND.colours.gold};font-size:24px;margin:0;">Weekly Dashboard</h1>
      <p style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:12px;color:${VM_BRAND.colours.white};opacity:0.6;margin-top:4px;">Week of ${dashboard.date}</p>
    </div>

    ${urgentItems.length > 0 ? `
    <div style="background:#8B0000;border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="color:${VM_BRAND.colours.gold};font-family:'${VM_BRAND.fonts.heading}',serif;font-size:16px;margin:0 0 8px;">Requires Immediate Attention</h3>
      ${urgentItems.map(i => `<p style="color:${VM_BRAND.colours.white};font-size:13px;margin:4px 0;">${i}</p>`).join('')}
    </div>` : ''}

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr>
        <td style="background:${VM_BRAND.colours.charcoal};padding:16px;border-radius:6px 0 0 0;text-align:center;border-right:1px solid ${VM_BRAND.colours.prussianBlue};">
          <div style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:24px;color:${VM_BRAND.colours.teal};">${contentMetrics.published}</div>
          <div style="font-size:12px;color:${VM_BRAND.colours.white};opacity:0.7;">Published</div>
        </td>
        <td style="background:${VM_BRAND.colours.charcoal};padding:16px;text-align:center;border-right:1px solid ${VM_BRAND.colours.prussianBlue};">
          <div style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:24px;color:${VM_BRAND.colours.gold};">${crmMetrics.conversionRate}%</div>
          <div style="font-size:12px;color:${VM_BRAND.colours.white};opacity:0.7;">Conversion</div>
        </td>
        <td style="background:${VM_BRAND.colours.charcoal};padding:16px;text-align:center;border-right:1px solid ${VM_BRAND.colours.prussianBlue};">
          <div style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:24px;color:${VM_BRAND.colours.sage};">${cohortMetrics.spotsFilled}/10</div>
          <div style="font-size:12px;color:${VM_BRAND.colours.white};opacity:0.7;">Cohort</div>
        </td>
        <td style="background:${VM_BRAND.colours.charcoal};padding:16px;border-radius:0 6px 0 0;text-align:center;">
          <div style="font-family:'${VM_BRAND.fonts.data}',monospace;font-size:24px;color:${contentMetrics.avgScore >= 70 ? VM_BRAND.colours.sage : VM_BRAND.colours.gold};">${contentMetrics.avgScore}</div>
          <div style="font-size:12px;color:${VM_BRAND.colours.white};opacity:0.7;">Avg Score</div>
        </td>
      </tr>
    </table>

    <div style="background:${VM_BRAND.colours.charcoal};border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="color:${VM_BRAND.colours.teal};font-family:'${VM_BRAND.fonts.heading}',serif;font-size:16px;margin:0 0 12px;">Key Metrics</h3>
      <table style="width:100%;font-size:13px;color:${VM_BRAND.colours.white};">
        <tr><td style="padding:4px 0;">Content total</td><td style="text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;">${contentMetrics.total}</td></tr>
        <tr><td style="padding:4px 0;">Drafts pending</td><td style="text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;">${contentMetrics.drafts}</td></tr>
        <tr><td style="padding:4px 0;">Stale items</td><td style="text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;color:${contentMetrics.stale > 0 ? '#E74C3C' : VM_BRAND.colours.sage};">${contentMetrics.stale}</td></tr>
        <tr><td style="padding:4px 0;">Leads in pipeline</td><td style="text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;">${crmMetrics.pipeline}</td></tr>
        <tr><td style="padding:4px 0;">Calendar overdue</td><td style="text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;color:${calendarMetrics.overdue > 0 ? '#E74C3C' : VM_BRAND.colours.sage};">${calendarMetrics.overdue}</td></tr>
        <tr><td style="padding:4px 0;">Calendar published (month)</td><td style="text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;">${calendarMetrics.published}/${calendarMetrics.scheduledThisMonth}</td></tr>
        <tr><td style="padding:4px 0;">Cohort active (month)</td><td style="text-align:right;font-family:'${VM_BRAND.fonts.data}',monospace;">${cohortMetrics.activeThisMonth}</td></tr>
      </table>
    </div>

    ${topPerformingContent.length > 0 ? `
    <div style="background:${VM_BRAND.colours.charcoal};border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="color:${VM_BRAND.colours.sage};font-family:'${VM_BRAND.fonts.heading}',serif;font-size:16px;margin:0 0 12px;">Top Content</h3>
      ${topPerformingContent.slice(0, 3).map((item, i) => `
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:${VM_BRAND.colours.white};">
          <span>${i + 1}. ${item.title}</span>
          <span style="font-family:'${VM_BRAND.fonts.data}',monospace;color:${VM_BRAND.colours.sage};">${item.score}</span>
        </div>`).join('')}
    </div>` : ''}

    ${normalItems.length > 0 ? `
    <div style="background:${VM_BRAND.colours.charcoal};border-radius:6px;padding:16px;margin-bottom:20px;">
      <h3 style="color:${VM_BRAND.colours.gold};font-family:'${VM_BRAND.fonts.heading}',serif;font-size:16px;margin:0 0 12px;">Action Items</h3>
      <ol style="margin:0;padding-left:20px;font-size:13px;color:${VM_BRAND.colours.white};">
        ${normalItems.map(i => `<li style="margin-bottom:6px;">${i}</li>`).join('')}
      </ol>
    </div>` : ''}

    <div style="text-align:center;margin-top:24px;font-size:11px;color:${VM_BRAND.colours.white};opacity:0.5;">
      <p>${VM_BRAND.regulatoryFooter}</p>
      <p>${VM_BRAND.credentials.company} | ${VM_BRAND.platform.domain}</p>
    </div>
  </div>
</body>
</html>`;
}
