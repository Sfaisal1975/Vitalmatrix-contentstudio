/**
 * Component 55: Marketing Dashboard
 *
 * Unified marketing dashboard aggregating metrics across all channels.
 * Generates HTML dashboards, weekly email summaries, channel comparisons,
 * performance analysis, and budget allocation recommendations.
 * Tracks founding cohort progress (target: 10 practitioners).
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** All tracked marketing channels */
export type MarketingChannel =
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'email'
  | 'google-ads'
  | 'meta-ads'
  | 'linkedin-ads'
  | 'website'
  | 'referral';

/** Metrics for a single marketing channel */
export interface ChannelMetrics {
  channel: MarketingChannel;
  followers: number;
  postsThisPeriod: number;
  totalReach: number;
  totalEngagement: number;
  engagementRate: number;
  clickThroughRate: number;
  conversions: number;
  costPerConversion?: number;
}

/** Founding cohort progress */
export interface CohortProgress {
  filled: number;
  target: 10;
}

/** Full marketing dashboard state */
export interface MarketingDashboard {
  period: string;
  channels: ChannelMetrics[];
  totalReach: number;
  totalEngagement: number;
  totalConversions: number;
  totalSpend: number;
  overallRoas: number;
  bestChannel: string;
  worstChannel: string;
  cohortProgress: CohortProgress;
  actionItems: string[];
}

/** Channel performance ranking entry */
export interface ChannelRanking {
  channel: MarketingChannel;
  roi: number;
  reasoning: string;
}

/** Budget allocation recommendation */
export interface BudgetAllocation {
  channel: MarketingChannel;
  amount: number;
  percentage: number;
  reasoning: string;
}

// --- State ---

/** Internal store for channel metrics keyed by channel name */
const metricsStore: Map<MarketingChannel, ChannelMetrics> = new Map();

// --- Helpers ---

/**
 * Formats a number as GBP currency string.
 *
 * @param amount - The numeric amount
 * @returns Formatted string with currency symbol
 */
function formatGBP(amount: number): string {
  return `${VM_BRAND.pricing.currency} ${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a percentage for display.
 *
 * @param value - The percentage value
 * @returns Formatted percentage string
 */
function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Returns a trend indicator arrow based on value.
 *
 * @param value - Positive for up, negative for down, zero for flat
 * @returns Text indicator string
 */
function trendIndicator(value: number): string {
  if (value > 0) return '[UP]';
  if (value < 0) return '[DOWN]';
  return '[FLAT]';
}

/**
 * Generates a display name for a marketing channel.
 *
 * @param channel - The channel identifier
 * @returns Human-readable channel name
 */
function channelDisplayName(channel: MarketingChannel): string {
  const names: Record<MarketingChannel, string> = {
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    instagram: 'Instagram',
    x: 'X (Twitter)',
    email: 'Email',
    'google-ads': 'Google Ads',
    'meta-ads': 'Meta Ads',
    'linkedin-ads': 'LinkedIn Ads',
    website: 'Website',
    referral: 'Referral',
  };
  return names[channel];
}

// --- Core Functions ---

/**
 * Adds or updates channel metrics in the internal store.
 *
 * @param channel - The marketing channel
 * @param metrics - The metrics to store
 */
export function addChannelMetrics(channel: MarketingChannel, metrics: Omit<ChannelMetrics, 'channel'>): void {
  metricsStore.set(channel, { channel, ...metrics });
}

/**
 * Clears all stored channel metrics. Useful for testing and period resets.
 */
export function clearMetrics(): void {
  metricsStore.clear();
}

/**
 * Builds a complete marketing dashboard for the given period.
 *
 * Aggregates metrics across all channels, identifies best and worst
 * performers, calculates overall ROAS, and generates action items.
 *
 * @param period - The reporting period label (e.g. "W/C 2 June 2026")
 * @param cohortFilled - Number of founding cohort spots filled
 * @returns A MarketingDashboard object
 */
export function buildDashboard(period: string, cohortFilled: number = 0): MarketingDashboard {
  const channels = Array.from(metricsStore.values());

  const totalReach = channels.reduce((sum, c) => sum + c.totalReach, 0);
  const totalEngagement = channels.reduce((sum, c) => sum + c.totalEngagement, 0);
  const totalConversions = channels.reduce((sum, c) => sum + c.conversions, 0);
  const totalSpend = channels.reduce((sum, c) => {
    if (c.costPerConversion !== undefined && c.conversions > 0) {
      return sum + c.costPerConversion * c.conversions;
    }
    return sum;
  }, 0);

  // ROAS: revenue from conversions / spend
  const revenuePerConversion = VM_BRAND.pricing.foundingMonthly * VM_BRAND.pricing.foundingFixedMonths;
  const totalRevenue = totalConversions * revenuePerConversion;
  const overallRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  // Best and worst by engagement rate (organic) or ROI (paid)
  const sorted = [...channels].sort((a, b) => b.engagementRate - a.engagementRate);
  const bestChannel = sorted.length > 0 ? channelDisplayName(sorted[0].channel) : 'None';
  const worstChannel = sorted.length > 0 ? channelDisplayName(sorted[sorted.length - 1].channel) : 'None';

  // Generate action items
  const actionItems: string[] = [];

  if (cohortFilled < 10) {
    actionItems.push(`Founding cohort: ${cohortFilled}/10 spots filled. ${10 - cohortFilled} remaining. Increase CTA frequency.`);
  }

  const lowEngagement = channels.filter((c) => c.engagementRate < 1.0);
  for (const c of lowEngagement) {
    actionItems.push(`${channelDisplayName(c.channel)}: engagement rate below 1%. Review content strategy.`);
  }

  const highPerformers = channels.filter((c) => c.engagementRate > 5.0);
  for (const c of highPerformers) {
    actionItems.push(`${channelDisplayName(c.channel)}: engagement rate above 5%. Consider increasing post frequency.`);
  }

  const noActivity = channels.filter((c) => c.postsThisPeriod === 0);
  for (const c of noActivity) {
    actionItems.push(`${channelDisplayName(c.channel)}: no posts this period. Resume content schedule.`);
  }

  if (totalConversions === 0 && channels.length > 0) {
    actionItems.push('Zero conversions this period. Review landing page and CTA alignment.');
  }

  if (actionItems.length === 0) {
    actionItems.push('All channels performing within expected ranges. Maintain current strategy.');
  }

  return {
    period,
    channels,
    totalReach,
    totalEngagement,
    totalConversions,
    totalSpend,
    overallRoas,
    bestChannel,
    worstChannel,
    cohortProgress: { filled: cohortFilled, target: 10 },
    actionItems,
  };
}

/**
 * Generates a full-page HTML marketing dashboard styled with VM brand colours.
 *
 * Includes per-channel cards, cohort progress bar, trend indicators,
 * and action items list.
 *
 * @param dashboard - The MarketingDashboard data
 * @returns A complete HTML string
 */
export function generateDashboardHtml(dashboard: MarketingDashboard): string {
  const { colours, fonts, credentials } = VM_BRAND;

  const cohortPct = Math.round((dashboard.cohortProgress.filled / dashboard.cohortProgress.target) * 100);

  const channelCards = dashboard.channels
    .map((c) => {
      const cpcText = c.costPerConversion !== undefined ? formatGBP(c.costPerConversion) : 'N/A';
      return `
      <div class="channel-card">
        <h3>${channelDisplayName(c.channel)}</h3>
        <div class="metric-row"><span class="label">Followers</span><span class="value">${c.followers.toLocaleString()}</span></div>
        <div class="metric-row"><span class="label">Posts</span><span class="value">${c.postsThisPeriod}</span></div>
        <div class="metric-row"><span class="label">Reach</span><span class="value">${c.totalReach.toLocaleString()}</span></div>
        <div class="metric-row"><span class="label">Engagement</span><span class="value">${c.totalEngagement.toLocaleString()}</span></div>
        <div class="metric-row"><span class="label">Engagement rate</span><span class="value">${formatPct(c.engagementRate)}</span></div>
        <div class="metric-row"><span class="label">CTR</span><span class="value">${formatPct(c.clickThroughRate)}</span></div>
        <div class="metric-row"><span class="label">Conversions</span><span class="value">${c.conversions}</span></div>
        <div class="metric-row"><span class="label">Cost/conversion</span><span class="value">${cpcText}</span></div>
      </div>`;
    })
    .join('\n');

  const actionItemsHtml = dashboard.actionItems
    .map((item) => `<li>${item}</li>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VitalMatrix Marketing Dashboard -- ${dashboard.period}</title>
  <style>
    :root {
      ${VM_BRAND.cssPrefix}prussian-blue: ${colours.prussianBlue};
      ${VM_BRAND.cssPrefix}charcoal: ${colours.charcoal};
      ${VM_BRAND.cssPrefix}deep-teal: ${colours.deepTeal};
      ${VM_BRAND.cssPrefix}gold: ${colours.gold};
      ${VM_BRAND.cssPrefix}teal: ${colours.teal};
      ${VM_BRAND.cssPrefix}white: ${colours.white};
      ${VM_BRAND.cssPrefix}sage: ${colours.sage};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: '${fonts.body}', sans-serif;
      background: var(${VM_BRAND.cssPrefix}charcoal);
      color: var(${VM_BRAND.cssPrefix}white);
      padding: 2rem;
    }
    h1, h2, h3 {
      font-family: '${fonts.heading}', serif;
    }
    h1 {
      font-size: 2rem;
      color: var(${VM_BRAND.cssPrefix}gold);
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-family: '${fonts.data}', monospace;
      color: var(${VM_BRAND.cssPrefix}teal);
      margin-bottom: 2rem;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background: var(${VM_BRAND.cssPrefix}prussian-blue);
      padding: 1.25rem;
      border-radius: 8px;
      border-left: 4px solid var(${VM_BRAND.cssPrefix}gold);
    }
    .summary-card .label {
      font-size: 0.85rem;
      opacity: 0.8;
      display: block;
      margin-bottom: 0.25rem;
    }
    .summary-card .value {
      font-family: '${fonts.data}', monospace;
      font-size: 1.5rem;
      color: var(${VM_BRAND.cssPrefix}gold);
    }
    .cohort-section {
      background: var(${VM_BRAND.cssPrefix}prussian-blue);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border-left: 4px solid var(${VM_BRAND.cssPrefix}teal);
    }
    .cohort-section h2 {
      color: var(${VM_BRAND.cssPrefix}teal);
      margin-bottom: 1rem;
    }
    .progress-bar {
      background: var(${VM_BRAND.cssPrefix}charcoal);
      border-radius: 4px;
      height: 2rem;
      overflow: hidden;
      position: relative;
    }
    .progress-fill {
      background: var(${VM_BRAND.cssPrefix}teal);
      height: 100%;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: centre;
      transition: width 0.3s ease;
    }
    .progress-label {
      position: absolute;
      width: 100%;
      text-align: center;
      line-height: 2rem;
      font-family: '${fonts.data}', monospace;
      font-weight: bold;
    }
    .channels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .channel-card {
      background: var(${VM_BRAND.cssPrefix}prussian-blue);
      padding: 1.25rem;
      border-radius: 8px;
      border-top: 3px solid var(${VM_BRAND.cssPrefix}gold);
    }
    .channel-card h3 {
      color: var(${VM_BRAND.cssPrefix}gold);
      margin-bottom: 0.75rem;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 0.25rem 0;
      border-bottom: 1px solid rgba(244, 241, 235, 0.1);
    }
    .metric-row .label { opacity: 0.8; font-size: 0.9rem; }
    .metric-row .value { font-family: '${fonts.data}', monospace; }
    .action-items {
      background: var(${VM_BRAND.cssPrefix}prussian-blue);
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid var(${VM_BRAND.cssPrefix}sage);
      margin-bottom: 2rem;
    }
    .action-items h2 {
      color: var(${VM_BRAND.cssPrefix}sage);
      margin-bottom: 1rem;
    }
    .action-items ul {
      list-style: none;
      padding: 0;
    }
    .action-items li {
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(244, 241, 235, 0.1);
      padding-left: 1rem;
      position: relative;
    }
    .action-items li::before {
      content: '>';
      position: absolute;
      left: 0;
      color: var(${VM_BRAND.cssPrefix}gold);
    }
    .footer {
      text-align: centre;
      opacity: 0.6;
      font-size: 0.8rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <h1>VitalMatrix Marketing Dashboard</h1>
  <div class="subtitle">Period: ${dashboard.period}</div>

  <div class="summary-grid">
    <div class="summary-card">
      <span class="label">Total reach</span>
      <span class="value">${dashboard.totalReach.toLocaleString()}</span>
    </div>
    <div class="summary-card">
      <span class="label">Total engagement</span>
      <span class="value">${dashboard.totalEngagement.toLocaleString()}</span>
    </div>
    <div class="summary-card">
      <span class="label">Conversions</span>
      <span class="value">${dashboard.totalConversions}</span>
    </div>
    <div class="summary-card">
      <span class="label">Total spend</span>
      <span class="value">${formatGBP(dashboard.totalSpend)}</span>
    </div>
    <div class="summary-card">
      <span class="label">Overall ROAS</span>
      <span class="value">${dashboard.overallRoas.toFixed(2)}x</span>
    </div>
    <div class="summary-card">
      <span class="label">Best channel</span>
      <span class="value">${dashboard.bestChannel}</span>
    </div>
  </div>

  <div class="cohort-section">
    <h2>Founding Cohort Progress</h2>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${cohortPct}%"></div>
      <span class="progress-label">${dashboard.cohortProgress.filled}/${dashboard.cohortProgress.target} spots filled</span>
    </div>
  </div>

  <h2 style="color: var(${VM_BRAND.cssPrefix}gold); margin-bottom: 1rem;">Channel Performance</h2>
  <div class="channels-grid">
    ${channelCards}
  </div>

  <div class="action-items">
    <h2>Action Items</h2>
    <ul>
      ${actionItemsHtml}
    </ul>
  </div>

  <div class="footer">
    <p>${VM_BRAND.regulatoryFooter}</p>
    <p>${credentials.company} | ${VM_BRAND.platform.domain} | ${VM_BRAND.platform.ico}</p>
  </div>
</body>
</html>`;
}

/**
 * Generates a weekly marketing email summary for Dr Faisal.
 *
 * Includes top metrics, channel highlights, cohort progress,
 * and recommended actions.
 *
 * @param dashboard - The MarketingDashboard data
 * @returns A plain-text email body
 */
export function generateWeeklyMarketingEmail(dashboard: MarketingDashboard): string {
  const sortedByEngagement = [...dashboard.channels].sort(
    (a, b) => b.engagementRate - a.engagementRate
  );

  const top3 = sortedByEngagement.slice(0, 3);
  const top3Text = top3
    .map(
      (c, i) =>
        `  ${i + 1}. ${channelDisplayName(c.channel)}: ${formatPct(c.engagementRate)} engagement, ` +
        `${c.totalReach.toLocaleString()} reach, ${c.conversions} conversions`
    )
    .join('\n');

  const channelSummary = dashboard.channels
    .map(
      (c) =>
        `  ${channelDisplayName(c.channel)}: ${c.postsThisPeriod} posts, ` +
        `${c.totalReach.toLocaleString()} reach, ${formatPct(c.engagementRate)} engagement, ` +
        `${c.conversions} conversions`
    )
    .join('\n');

  const actionText = dashboard.actionItems
    .map((item, i) => `  ${i + 1}. ${item}`)
    .join('\n');

  return [
    `Subject: VitalMatrix Marketing Summary -- ${dashboard.period}`,
    '',
    `Dr Faisal,`,
    '',
    `Here is your weekly marketing performance summary for ${dashboard.period}.`,
    '',
    `--- Overview ---`,
    `Total reach: ${dashboard.totalReach.toLocaleString()}`,
    `Total engagement: ${dashboard.totalEngagement.toLocaleString()}`,
    `Total conversions: ${dashboard.totalConversions}`,
    `Total spend: ${formatGBP(dashboard.totalSpend)}`,
    `Overall ROAS: ${dashboard.overallRoas.toFixed(2)}x`,
    '',
    `--- Founding Cohort ---`,
    `Progress: ${dashboard.cohortProgress.filled}/${dashboard.cohortProgress.target} spots filled`,
    `Remaining: ${dashboard.cohortProgress.target - dashboard.cohortProgress.filled} spots`,
    '',
    `--- Top 3 Channels (by Engagement Rate) ---`,
    top3Text,
    '',
    `--- All Channels ---`,
    channelSummary,
    '',
    `--- Recommended Actions ---`,
    actionText,
    '',
    `Best channel this period: ${dashboard.bestChannel}`,
    `Lowest performing: ${dashboard.worstChannel}`,
    '',
    `---`,
    VM_BRAND.regulatoryFooter,
    VM_BRAND.credentials.company,
  ].join('\n');
}

/**
 * Compares all channels and returns a ranked list by ROI.
 *
 * For organic channels (no cost data), ROI is calculated as
 * engagement rate. For paid channels, ROI is revenue per unit spent.
 *
 * @param dashboard - The MarketingDashboard data
 * @returns Array of ChannelRanking objects sorted by ROI descending
 */
export function compareChannels(dashboard: MarketingDashboard): ChannelRanking[] {
  const revenuePerConversion = VM_BRAND.pricing.foundingMonthly * VM_BRAND.pricing.foundingFixedMonths;

  return dashboard.channels
    .map((c) => {
      let roi: number;
      let reasoning: string;

      if (c.costPerConversion !== undefined && c.costPerConversion > 0) {
        // Paid channel: ROI = (revenue - cost) / cost
        const totalCost = c.costPerConversion * c.conversions;
        const totalRevenue = c.conversions * revenuePerConversion;
        roi = totalCost > 0 ? (totalRevenue - totalCost) / totalCost : 0;
        reasoning = `Paid channel. ${c.conversions} conversions at ${formatGBP(c.costPerConversion)} each. ` +
          `Revenue: ${formatGBP(totalRevenue)}. Cost: ${formatGBP(totalCost)}.`;
      } else {
        // Organic: use engagement rate as proxy
        roi = c.engagementRate;
        reasoning = `Organic channel. Engagement rate: ${formatPct(c.engagementRate)}. ` +
          `Reach: ${c.totalReach.toLocaleString()}. Conversions: ${c.conversions}.`;
      }

      return { channel: c.channel, roi, reasoning };
    })
    .sort((a, b) => b.roi - a.roi);
}

/**
 * Identifies the top 3 best-performing channels with reasoning.
 *
 * @param dashboard - The MarketingDashboard data
 * @returns Array of the top 3 ChannelRanking objects
 */
export function identifyBestPerforming(dashboard: MarketingDashboard): ChannelRanking[] {
  return compareChannels(dashboard).slice(0, 3);
}

/**
 * Generates a budget allocation recommendation across channels.
 *
 * Allocates budget proportionally based on channel performance.
 * Higher-performing channels receive a larger share. Organic-only
 * channels receive a content production budget.
 *
 * @param totalBudget - The total marketing budget in GBP
 * @param dashboard - The MarketingDashboard data
 * @returns Array of BudgetAllocation objects
 */
export function generateBudgetRecommendation(
  totalBudget: number,
  dashboard: MarketingDashboard
): BudgetAllocation[] {
  if (dashboard.channels.length === 0) {
    return [{
      channel: 'linkedin',
      amount: totalBudget,
      percentage: 100,
      reasoning: 'No channel data available. Defaulting full budget to LinkedIn as primary B2B channel.',
    }];
  }

  const rankings = compareChannels(dashboard);
  const totalRoi = rankings.reduce((sum, r) => sum + Math.max(r.roi, 0.1), 0);

  // Content production reserve (20% of budget for organic channels)
  const contentReserve = totalBudget * 0.2;
  const paidBudget = totalBudget * 0.8;

  const paidChannels = rankings.filter((r) => {
    const metrics = dashboard.channels.find((c) => c.channel === r.channel);
    return metrics?.costPerConversion !== undefined;
  });

  const organicChannels = rankings.filter((r) => {
    const metrics = dashboard.channels.find((c) => c.channel === r.channel);
    return metrics?.costPerConversion === undefined;
  });

  const allocations: BudgetAllocation[] = [];

  // Allocate paid budget
  if (paidChannels.length > 0) {
    const paidTotal = paidChannels.reduce((sum, r) => sum + Math.max(r.roi, 0.1), 0);
    for (const r of paidChannels) {
      const share = Math.max(r.roi, 0.1) / paidTotal;
      const amount = Math.round(paidBudget * share * 100) / 100;
      const percentage = Math.round(share * 80 * 100) / 100;
      allocations.push({
        channel: r.channel,
        amount,
        percentage,
        reasoning: `Paid channel with ROI ${r.roi.toFixed(2)}. Allocated proportionally from 80% paid budget.`,
      });
    }
  } else {
    // No paid channels: redistribute to top organic channels
    const topOrganic = organicChannels.slice(0, 3);
    const orgTotal = topOrganic.reduce((sum, r) => sum + Math.max(r.roi, 0.1), 0);
    for (const r of topOrganic) {
      const share = Math.max(r.roi, 0.1) / orgTotal;
      const amount = Math.round(paidBudget * share * 100) / 100;
      const percentage = Math.round(share * 80 * 100) / 100;
      allocations.push({
        channel: r.channel,
        amount,
        percentage,
        reasoning: `No paid channels active. Redirecting paid budget to top organic channel for promoted content.`,
      });
    }
  }

  // Allocate content production reserve across organic channels
  if (organicChannels.length > 0) {
    const perOrganic = Math.round((contentReserve / organicChannels.length) * 100) / 100;
    const perPct = Math.round((20 / organicChannels.length) * 100) / 100;
    for (const r of organicChannels) {
      const existing = allocations.find((a) => a.channel === r.channel);
      if (existing) {
        existing.amount += perOrganic;
        existing.percentage += perPct;
        existing.reasoning += ` Plus content production reserve.`;
      } else {
        allocations.push({
          channel: r.channel,
          amount: perOrganic,
          percentage: perPct,
          reasoning: `Organic channel. Content production budget from 20% reserve.`,
        });
      }
    }
  }

  return allocations.sort((a, b) => b.amount - a.amount);
}
