/**
 * Component 50: Analytics Tracker
 *
 * Content and marketing performance analytics for VitalMatrix.
 * Tracks events across website, social, email, ad, and referral channels.
 * Calculates content and campaign metrics, generates dashboard views,
 * weekly digests, and identifies underperforming content. All reports
 * are practitioner-facing (B2B) and include regulatory footers.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Source channel for an analytics event */
export type EventSource = 'website' | 'social' | 'email' | 'ad' | 'referral';

/** User action tracked by the system */
export type EventAction = 'view' | 'click' | 'signup' | 'discovery-call' | 'conversion';

/** A single tracked analytics event */
export interface AnalyticsEvent {
  timestamp: string;
  source: EventSource;
  action: EventAction;
  metadata: Record<string, string>;
}

/** Performance metrics for a single piece of content */
export interface ContentMetrics {
  contentId: string;
  views: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  costPerConversion?: number;
  platform: string;
}

/** Performance metrics for an advertising campaign */
export interface CampaignMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  spend: number;
  costPerClick: number;
  costPerConversion: number;
  roas: number;
}

/** Aggregated dashboard metrics for a given period */
export interface DashboardMetrics {
  period: string;
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  topContent: ContentMetrics[];
  topCampaigns: CampaignMetrics[];
  funnelConversion: Record<string, number>;
  channelBreakdown: Record<string, number>;
}

// --- In-memory stores ---

const events: AnalyticsEvent[] = [];
const contentStore: Map<string, AnalyticsEvent[]> = new Map();
const campaignStore: Map<string, AnalyticsEvent[]> = new Map();

// --- Core Functions ---

/**
 * Track an analytics event. Automatically indexes by contentId
 * and campaignId if present in metadata.
 *
 * @param event - The analytics event to record
 */
export function trackEvent(event: AnalyticsEvent): void {
  events.push(event);

  // Index by contentId if present
  if (event.metadata.contentId) {
    const existing = contentStore.get(event.metadata.contentId) ?? [];
    existing.push(event);
    contentStore.set(event.metadata.contentId, existing);
  }

  // Index by campaignId if present
  if (event.metadata.campaignId) {
    const existing = campaignStore.get(event.metadata.campaignId) ?? [];
    existing.push(event);
    campaignStore.set(event.metadata.campaignId, existing);
  }
}

/**
 * Calculate performance metrics for a specific piece of content.
 *
 * @param contentId - The content identifier
 * @returns ContentMetrics or undefined if no events found
 */
export function getContentMetrics(contentId: string): ContentMetrics | undefined {
  const contentEvents = contentStore.get(contentId);
  if (!contentEvents || contentEvents.length === 0) return undefined;

  const views = contentEvents.filter((e) => e.action === 'view').length;
  const clicks = contentEvents.filter((e) => e.action === 'click').length;
  const conversions = contentEvents.filter((e) => e.action === 'conversion').length;

  const platform = contentEvents[0]?.metadata.platform ?? 'unknown';
  const totalSpend = contentEvents.reduce((sum, e) => {
    return sum + (parseFloat(e.metadata.spend ?? '0') || 0);
  }, 0);

  return {
    contentId,
    views,
    clicks,
    ctr: views > 0 ? clicks / views : 0,
    conversions,
    conversionRate: clicks > 0 ? conversions / clicks : 0,
    costPerConversion: conversions > 0 ? totalSpend / conversions : undefined,
    platform,
  };
}

/**
 * Calculate performance metrics for an advertising campaign.
 *
 * @param campaignId - The campaign identifier
 * @returns CampaignMetrics or undefined if no events found
 */
export function getCampaignMetrics(campaignId: string): CampaignMetrics | undefined {
  const campaignEvents = campaignStore.get(campaignId);
  if (!campaignEvents || campaignEvents.length === 0) return undefined;

  const impressions = campaignEvents.filter((e) => e.action === 'view').length;
  const clicks = campaignEvents.filter((e) => e.action === 'click').length;
  const conversions = campaignEvents.filter((e) => e.action === 'conversion').length;

  const spend = campaignEvents.reduce((sum, e) => {
    return sum + (parseFloat(e.metadata.spend ?? '0') || 0);
  }, 0);

  const revenue = campaignEvents.reduce((sum, e) => {
    return sum + (parseFloat(e.metadata.revenue ?? '0') || 0);
  }, 0);

  return {
    campaignId,
    impressions,
    clicks,
    ctr: impressions > 0 ? clicks / impressions : 0,
    conversions,
    spend,
    costPerClick: clicks > 0 ? spend / clicks : 0,
    costPerConversion: conversions > 0 ? spend / conversions : 0,
    roas: spend > 0 ? revenue / spend : 0,
  };
}

/**
 * Generate aggregated dashboard metrics for a given date range.
 *
 * @param startDate - Start of period (ISO date string)
 * @param endDate - End of period (ISO date string)
 * @returns DashboardMetrics with aggregated data
 */
export function getDashboardMetrics(startDate: string, endDate: string): DashboardMetrics {
  const periodEvents = events.filter((e) => {
    const ts = e.timestamp.split('T')[0];
    return ts >= startDate && ts <= endDate;
  });

  const totalViews = periodEvents.filter((e) => e.action === 'view').length;
  const totalClicks = periodEvents.filter((e) => e.action === 'click').length;
  const totalConversions = periodEvents.filter((e) => e.action === 'conversion').length;

  // Channel breakdown
  const channelBreakdown: Record<string, number> = {};
  for (const event of periodEvents) {
    channelBreakdown[event.source] = (channelBreakdown[event.source] ?? 0) + 1;
  }

  // Funnel conversion rates
  const signups = periodEvents.filter((e) => e.action === 'signup').length;
  const discoveryCalls = periodEvents.filter((e) => e.action === 'discovery-call').length;

  const funnelConversion: Record<string, number> = {
    'view-to-click': totalViews > 0 ? totalClicks / totalViews : 0,
    'click-to-signup': totalClicks > 0 ? signups / totalClicks : 0,
    'signup-to-discovery': signups > 0 ? discoveryCalls / signups : 0,
    'discovery-to-conversion': discoveryCalls > 0 ? totalConversions / discoveryCalls : 0,
  };

  // Top content by views
  const contentIds = [...contentStore.keys()];
  const allContentMetrics: ContentMetrics[] = [];
  for (const id of contentIds) {
    const metrics = getContentMetrics(id);
    if (metrics) allContentMetrics.push(metrics);
  }
  const topContent = allContentMetrics
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top campaigns by conversions
  const campaignIds = [...campaignStore.keys()];
  const allCampaignMetrics: CampaignMetrics[] = [];
  for (const id of campaignIds) {
    const metrics = getCampaignMetrics(id);
    if (metrics) allCampaignMetrics.push(metrics);
  }
  const topCampaigns = allCampaignMetrics
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, 10);

  return {
    period: `${startDate} to ${endDate}`,
    totalViews,
    totalClicks,
    totalConversions,
    topContent,
    topCampaigns,
    funnelConversion,
    channelBreakdown,
  };
}

/**
 * Generate a comprehensive Markdown analytics report for a given period.
 * Includes top-performing content, best converting channels, campaign ROI,
 * funnel analysis, and actionable recommendations.
 *
 * @param period - Report period label (e.g., '2026-W22' or '2026-06')
 * @returns Markdown-formatted analytics report
 */
export function generateAnalyticsReport(period: string): string {
  // Use all events for the report (in production, filter by period)
  const totalViews = events.filter((e) => e.action === 'view').length;
  const totalClicks = events.filter((e) => e.action === 'click').length;
  const totalConversions = events.filter((e) => e.action === 'conversion').length;
  const totalSignups = events.filter((e) => e.action === 'signup').length;
  const totalDiscoveryCalls = events.filter((e) => e.action === 'discovery-call').length;

  // Channel breakdown
  const channels: Record<string, number> = {};
  for (const event of events) {
    channels[event.source] = (channels[event.source] ?? 0) + 1;
  }

  // Top content
  const contentIds = [...contentStore.keys()];
  const contentMetricsList = contentIds
    .map((id) => getContentMetrics(id))
    .filter((m): m is ContentMetrics => m !== undefined)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Top campaigns
  const campaignIds = [...campaignStore.keys()];
  const campaignMetricsList = campaignIds
    .map((id) => getCampaignMetrics(id))
    .filter((m): m is CampaignMetrics => m !== undefined)
    .sort((a, b) => b.roas - a.roas)
    .slice(0, 5);

  const lines: string[] = [
    `# VitalMatrix Analytics Report`,
    '',
    `**Period:** ${period}`,
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Overview',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total views | ${totalViews.toLocaleString()} |`,
    `| Total clicks | ${totalClicks.toLocaleString()} |`,
    `| Total sign-ups | ${totalSignups.toLocaleString()} |`,
    `| Discovery calls | ${totalDiscoveryCalls.toLocaleString()} |`,
    `| Conversions | ${totalConversions.toLocaleString()} |`,
    `| Overall CTR | ${totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00'}% |`,
    '',
    '## Channel Breakdown',
    '',
    `| Channel | Events | Share |`,
    `|---------|--------|-------|`,
  ];

  const totalEvents = events.length || 1;
  for (const [channel, count] of Object.entries(channels).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${channel} | ${count} | ${((count / totalEvents) * 100).toFixed(1)}% |`);
  }

  lines.push('');
  lines.push('## Top Performing Content');
  lines.push('');

  if (contentMetricsList.length === 0) {
    lines.push('No content data available for this period.');
  } else {
    lines.push(`| Content ID | Views | Clicks | CTR | Conversions |`);
    lines.push(`|------------|-------|--------|-----|-------------|`);
    for (const m of contentMetricsList) {
      lines.push(`| ${m.contentId} | ${m.views} | ${m.clicks} | ${(m.ctr * 100).toFixed(2)}% | ${m.conversions} |`);
    }
  }

  lines.push('');
  lines.push('## Campaign ROI');
  lines.push('');

  if (campaignMetricsList.length === 0) {
    lines.push('No campaign data available for this period.');
  } else {
    lines.push(`| Campaign | Spend | Conversions | CPC | ROAS |`);
    lines.push(`|----------|-------|-------------|-----|------|`);
    for (const m of campaignMetricsList) {
      lines.push(
        `| ${m.campaignId} | ${VM_BRAND.pricing.currency} ${m.spend.toFixed(2)} | ${m.conversions} | ${VM_BRAND.pricing.currency} ${m.costPerClick.toFixed(2)} | ${m.roas.toFixed(2)}x |`,
      );
    }
  }

  lines.push('');
  lines.push('## Funnel Analysis');
  lines.push('');
  lines.push(`| Stage | Rate |`);
  lines.push(`|-------|------|`);
  lines.push(`| View to click | ${totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00'}% |`);
  lines.push(`| Click to sign-up | ${totalClicks > 0 ? ((totalSignups / totalClicks) * 100).toFixed(2) : '0.00'}% |`);
  lines.push(`| Sign-up to discovery call | ${totalSignups > 0 ? ((totalDiscoveryCalls / totalSignups) * 100).toFixed(2) : '0.00'}% |`);
  lines.push(`| Discovery call to conversion | ${totalDiscoveryCalls > 0 ? ((totalConversions / totalDiscoveryCalls) * 100).toFixed(2) : '0.00'}% |`);

  lines.push('');
  lines.push('## Recommendations');
  lines.push('');

  // Generate contextual recommendations
  if (totalViews > 0 && totalClicks / totalViews < 0.02) {
    lines.push('- **Improve CTR:** Overall click-through rate is below 2%. Consider A/B testing headlines and CTAs.');
  }
  if (totalSignups > 0 && totalDiscoveryCalls / totalSignups < 0.15) {
    lines.push('- **Boost discovery call bookings:** Sign-up to discovery call conversion is below 15%. Review the welcome email sequence timing and CTAs.');
  }
  if (totalDiscoveryCalls > 0 && totalConversions / totalDiscoveryCalls < 0.30) {
    lines.push('- **Optimise discovery call conversion:** Post-call conversion is below 30%. Consider enhancing the follow-up sequence.');
  }
  if (Object.keys(channels).length < 3) {
    lines.push('- **Diversify channels:** Fewer than 3 channels are active. Expand to additional platforms for broader reach.');
  }
  if (totalConversions === 0) {
    lines.push('- **Focus on conversion pathways:** No conversions recorded. Ensure tracking is correctly configured and CTAs are clear.');
  }

  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Generate an email-ready weekly digest for Dr Faisal.
 * Summarises key metrics, highlights, and action items.
 *
 * @returns Formatted weekly digest string
 */
export function generateWeeklyDigest(): string {
  const creds = VM_BRAND.credentials;
  const totalViews = events.filter((e) => e.action === 'view').length;
  const totalClicks = events.filter((e) => e.action === 'click').length;
  const totalConversions = events.filter((e) => e.action === 'conversion').length;
  const totalSignups = events.filter((e) => e.action === 'signup').length;
  const totalDiscoveryCalls = events.filter((e) => e.action === 'discovery-call').length;

  // Channel counts
  const channelCounts: Record<string, number> = {};
  for (const event of events) {
    channelCounts[event.source] = (channelCounts[event.source] ?? 0) + 1;
  }

  const bestChannel = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0];

  const lines: string[] = [
    `Subject: VitalMatrix Weekly Digest -- ${new Date().toISOString().split('T')[0]}`,
    '',
    `Dear ${creds.name},`,
    '',
    'Here is your weekly content and marketing performance summary.',
    '',
    '## Key Metrics',
    '',
    `- Views: ${totalViews.toLocaleString()}`,
    `- Clicks: ${totalClicks.toLocaleString()}`,
    `- Sign-ups: ${totalSignups.toLocaleString()}`,
    `- Discovery calls: ${totalDiscoveryCalls.toLocaleString()}`,
    `- Conversions: ${totalConversions.toLocaleString()}`,
    '',
  ];

  if (bestChannel) {
    lines.push(`**Best performing channel:** ${bestChannel[0]} (${bestChannel[1]} events)`);
    lines.push('');
  }

  // Top content highlight
  const contentIds = [...contentStore.keys()];
  const topContent = contentIds
    .map((id) => getContentMetrics(id))
    .filter((m): m is ContentMetrics => m !== undefined)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  if (topContent.length > 0) {
    lines.push('## Top Content This Week');
    lines.push('');
    for (const m of topContent) {
      lines.push(`- ${m.contentId}: ${m.views} views, ${m.clicks} clicks (CTR: ${(m.ctr * 100).toFixed(1)}%)`);
    }
    lines.push('');
  }

  // Action items
  lines.push('## Action Items');
  lines.push('');

  if (totalConversions === 0) {
    lines.push('- Review conversion pathways -- no conversions this period');
  }
  if (totalViews > 0 && totalClicks / totalViews < 0.02) {
    lines.push('- CTR below 2% -- consider headline/CTA optimisation');
  }
  if (totalDiscoveryCalls === 0 && totalSignups > 0) {
    lines.push('- Sign-ups but no discovery calls -- review welcome sequence');
  }
  if (totalViews === 0) {
    lines.push('- No tracked views -- verify analytics implementation');
  }

  lines.push('');
  lines.push('---');
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Calculate return on ad spend.
 *
 * @param spend - Total ad spend
 * @param revenue - Total revenue attributed to the ads
 * @returns ROAS ratio (revenue / spend)
 */
export function calculateRoas(spend: number, revenue: number): number {
  if (spend <= 0) return 0;
  return revenue / spend;
}

/**
 * Identify content and campaigns performing below a given threshold.
 * Returns items where CTR or conversion rate falls below the threshold.
 *
 * @param threshold - Minimum acceptable rate (e.g., 0.02 for 2%)
 * @returns Object with underperforming content and campaign arrays
 */
export function identifyUnderperformers(threshold: number): {
  content: ContentMetrics[];
  campaigns: CampaignMetrics[];
} {
  const contentIds = [...contentStore.keys()];
  const underperformingContent: ContentMetrics[] = [];

  for (const id of contentIds) {
    const metrics = getContentMetrics(id);
    if (metrics && metrics.ctr < threshold) {
      underperformingContent.push(metrics);
    }
  }

  const campaignIds = [...campaignStore.keys()];
  const underperformingCampaigns: CampaignMetrics[] = [];

  for (const id of campaignIds) {
    const metrics = getCampaignMetrics(id);
    if (metrics && metrics.ctr < threshold) {
      underperformingCampaigns.push(metrics);
    }
  }

  return {
    content: underperformingContent.sort((a, b) => a.ctr - b.ctr),
    campaigns: underperformingCampaigns.sort((a, b) => a.ctr - b.ctr),
  };
}
