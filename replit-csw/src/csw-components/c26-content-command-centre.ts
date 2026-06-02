/**
 * Component 26: Content Command Centre
 * EXTREMELY HIGH-YIELD
 *
 * Central dashboard tracking all content across the VitalMatrix
 * content ecosystem. Monitors drafts, published pieces, stale content,
 * compliance scores, and SEO scores. Surfaces items needing attention
 * so nothing slips through the cracks.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type ContentStatus = 'draft' | 'published' | 'archived';

export type ContentType =
  | 'blog'
  | 'newsletter'
  | 'email'
  | 'linkedin'
  | 'landing-page'
  | 'case-study'
  | 'whitepaper'
  | 'pdf';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  complianceScore: number; // 0–100
  seoScore: number;        // 0–100
  lastModified: string;    // ISO date
  author: string;
  tags: string[];
}

export interface DashboardSummary {
  totalItems: number;
  counts: Record<ContentStatus, number>;
  averageComplianceScore: number;
  averageSeoScore: number;
  itemsNeedingAttention: ContentItem[];
  staleCount: number;
  lowComplianceCount: number;
  lowSeoCount: number;
}

// --- Store ---

const contentStore: ContentItem[] = [];

// --- Thresholds ---

const COMPLIANCE_THRESHOLD = 80;
const SEO_THRESHOLD = 60;
const STALE_DAYS = 90;

// --- Helpers ---

function generateId(): string {
  return `vm-content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function daysSince(isoDate: string): number {
  const then = new Date(isoDate);
  const now = new Date();
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function isStale(item: ContentItem): boolean {
  return item.status === 'published' && daysSince(item.lastModified) > STALE_DAYS;
}

function needsAttention(item: ContentItem): boolean {
  if (item.status === 'archived') return false;
  if (item.complianceScore < COMPLIANCE_THRESHOLD) return true;
  if (item.seoScore < SEO_THRESHOLD) return true;
  if (isStale(item)) return true;
  return false;
}

// --- Core Functions ---

/**
 * Add a new content item to the command centre.
 * Returns the generated ID.
 */
export function addContent(
  input: Omit<ContentItem, 'id'>
): ContentItem {
  const item: ContentItem = {
    ...input,
    id: generateId(),
  };
  contentStore.push(item);
  return item;
}

/**
 * Update the status of a content item by ID.
 * Returns the updated item or null if not found.
 */
export function updateStatus(
  id: string,
  newStatus: ContentStatus
): ContentItem | null {
  const item = contentStore.find((c) => c.id === id);
  if (!item) return null;
  item.status = newStatus;
  item.lastModified = new Date().toISOString();
  return item;
}

/**
 * Update the compliance and/or SEO score for a content item.
 */
export function updateScores(
  id: string,
  scores: { complianceScore?: number; seoScore?: number }
): ContentItem | null {
  const item = contentStore.find((c) => c.id === id);
  if (!item) return null;
  if (scores.complianceScore !== undefined) {
    item.complianceScore = Math.max(0, Math.min(100, scores.complianceScore));
  }
  if (scores.seoScore !== undefined) {
    item.seoScore = Math.max(0, Math.min(100, scores.seoScore));
  }
  item.lastModified = new Date().toISOString();
  return item;
}

/**
 * Retrieve all content items matching a given status.
 */
export function getByStatus(status: ContentStatus): ContentItem[] {
  return contentStore.filter((c) => c.status === status);
}

/**
 * Retrieve all content items matching a given type.
 */
export function getByType(type: ContentType): ContentItem[] {
  return contentStore.filter((c) => c.type === type);
}

/**
 * Get the full dashboard summary: counts, averages, items needing attention.
 */
export function getDashboardSummary(): DashboardSummary {
  const counts: Record<ContentStatus, number> = {
    draft: 0,
    published: 0,
    archived: 0,
  };

  let totalCompliance = 0;
  let totalSeo = 0;
  const attention: ContentItem[] = [];
  let staleCount = 0;
  let lowComplianceCount = 0;
  let lowSeoCount = 0;

  for (const item of contentStore) {
    counts[item.status]++;
    totalCompliance += item.complianceScore;
    totalSeo += item.seoScore;

    if (isStale(item)) staleCount++;
    if (item.complianceScore < COMPLIANCE_THRESHOLD) lowComplianceCount++;
    if (item.seoScore < SEO_THRESHOLD) lowSeoCount++;
    if (needsAttention(item)) attention.push(item);
  }

  const total = contentStore.length;

  return {
    totalItems: total,
    counts,
    averageComplianceScore: total > 0 ? Math.round(totalCompliance / total) : 0,
    averageSeoScore: total > 0 ? Math.round(totalSeo / total) : 0,
    itemsNeedingAttention: attention,
    staleCount,
    lowComplianceCount,
    lowSeoCount,
  };
}

/**
 * Generate a formatted dashboard report string.
 * Suitable for terminal output, Slack, or internal review.
 */
export function generateDashboardReport(): string {
  const summary = getDashboardSummary();
  const lines: string[] = [];

  lines.push('='.repeat(64));
  lines.push('  VITALMATRIX CONTENT COMMAND CENTRE');
  lines.push(`  ${VM_BRAND.platform.descriptor} | ${VM_BRAND.platform.domain}`);
  lines.push('='.repeat(64));
  lines.push('');
  lines.push('STATUS OVERVIEW');
  lines.push(`  Total items:   ${summary.totalItems}`);
  lines.push(`  Drafts:        ${summary.counts.draft}`);
  lines.push(`  Published:     ${summary.counts.published}`);
  lines.push(`  Archived:      ${summary.counts.archived}`);
  lines.push('');
  lines.push('QUALITY METRICS');
  lines.push(`  Avg compliance score:  ${summary.averageComplianceScore}/100`);
  lines.push(`  Avg SEO score:         ${summary.averageSeoScore}/100`);
  lines.push(`  Low compliance (<${COMPLIANCE_THRESHOLD}):  ${summary.lowComplianceCount}`);
  lines.push(`  Low SEO (<${SEO_THRESHOLD}):           ${summary.lowSeoCount}`);
  lines.push(`  Stale (>${STALE_DAYS} days):       ${summary.staleCount}`);
  lines.push('');

  if (summary.itemsNeedingAttention.length > 0) {
    lines.push('ITEMS NEEDING ATTENTION');
    for (const item of summary.itemsNeedingAttention) {
      const reasons: string[] = [];
      if (item.complianceScore < COMPLIANCE_THRESHOLD) reasons.push(`compliance ${item.complianceScore}`);
      if (item.seoScore < SEO_THRESHOLD) reasons.push(`SEO ${item.seoScore}`);
      if (isStale(item)) reasons.push(`stale ${daysSince(item.lastModified)}d`);
      lines.push(`  - [${item.status.toUpperCase()}] ${item.title} (${reasons.join(', ')})`);
    }
    lines.push('');
  }

  lines.push('-'.repeat(64));
  lines.push(`${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`);
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Clear all items from the store. Useful for testing.
 */
export function clearStore(): void {
  contentStore.length = 0;
}

/**
 * Get all items currently in the store.
 */
export function getAllContent(): ContentItem[] {
  return [...contentStore];
}
