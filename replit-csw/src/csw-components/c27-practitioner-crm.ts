/**
 * Component 27: Practitioner CRM
 * EXTREMELY HIGH-YIELD
 *
 * Tracks every practitioner touchpoint from first contact through
 * conversion. Pipeline visibility across lead, contacted, meeting,
 * demo, proposal, converted, and lost stages. Surfaces overdue
 * follow-ups so no prospect falls through the cracks.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type PractitionerTier = 'ifm' | 'non-ifm';

export type LeadStatus =
  | 'lead'
  | 'contacted'
  | 'meeting-booked'
  | 'demo-given'
  | 'proposal-sent'
  | 'converted'
  | 'lost';

export type TouchpointType =
  | 'email'
  | 'call'
  | 'meeting'
  | 'document-sent'
  | 'follow-up';

export interface Touchpoint {
  date: string; // ISO date
  type: TouchpointType;
  summary: string;
}

export interface PractitionerLead {
  id: string;
  name: string;
  email: string;
  speciality: string;
  tier: PractitionerTier;
  status: LeadStatus;
  touchpoints: Touchpoint[];
  nextAction: string;
  notes: string;
}

export interface PipelineSummary {
  totalLeads: number;
  counts: Record<LeadStatus, number>;
  conversionRate: number;   // converted / total (excl. lost)
  lossRate: number;         // lost / total
  ifmCount: number;
  nonIfmCount: number;
  averageTouchpoints: number;
  overdueFollowUps: PractitionerLead[];
}

// --- Store ---

const leadStore: PractitionerLead[] = [];

// --- Helpers ---

function generateId(): string {
  return `vm-lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function daysSince(isoDate: string): number {
  const then = new Date(isoDate);
  const now = new Date();
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

const FOLLOW_UP_THRESHOLD_DAYS = 7;

const STATUS_ORDER: LeadStatus[] = [
  'lead',
  'contacted',
  'meeting-booked',
  'demo-given',
  'proposal-sent',
  'converted',
  'lost',
];

// --- Core Functions ---

/**
 * Add a new practitioner lead to the CRM.
 * Returns the created lead with a generated ID.
 */
export function addLead(
  input: Omit<PractitionerLead, 'id' | 'touchpoints'> & { touchpoints?: Touchpoint[] }
): PractitionerLead {
  const lead: PractitionerLead = {
    ...input,
    id: generateId(),
    touchpoints: input.touchpoints ?? [],
  };
  leadStore.push(lead);
  return lead;
}

/**
 * Update a lead's pipeline status.
 * Returns the updated lead or null if not found.
 */
export function updateStatus(
  id: string,
  newStatus: LeadStatus
): PractitionerLead | null {
  const lead = leadStore.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = newStatus;
  return lead;
}

/**
 * Record a new touchpoint against a lead.
 * Returns the updated lead or null if not found.
 */
export function addTouchpoint(
  id: string,
  touchpoint: Touchpoint
): PractitionerLead | null {
  const lead = leadStore.find((l) => l.id === id);
  if (!lead) return null;
  lead.touchpoints.push(touchpoint);
  return lead;
}

/**
 * Get all leads matching a given status.
 */
export function getByStatus(status: LeadStatus): PractitionerLead[] {
  return leadStore.filter((l) => l.status === status);
}

/**
 * Get all leads matching a given tier.
 */
export function getByTier(tier: PractitionerTier): PractitionerLead[] {
  return leadStore.filter((l) => l.tier === tier);
}

/**
 * Get leads whose last touchpoint is older than the follow-up threshold
 * and who are not yet converted or lost.
 */
export function getOverdueFollowUps(): PractitionerLead[] {
  return leadStore.filter((lead) => {
    if (lead.status === 'converted' || lead.status === 'lost') return false;
    if (lead.touchpoints.length === 0) return true;

    const lastTouch = lead.touchpoints[lead.touchpoints.length - 1];
    return daysSince(lastTouch.date) > FOLLOW_UP_THRESHOLD_DAYS;
  });
}

/**
 * Get the full pipeline summary: counts per stage, conversion rates,
 * tier breakdown, and overdue follow-ups.
 */
export function getPipelineSummary(): PipelineSummary {
  const counts: Record<LeadStatus, number> = {
    lead: 0,
    contacted: 0,
    'meeting-booked': 0,
    'demo-given': 0,
    'proposal-sent': 0,
    converted: 0,
    lost: 0,
  };

  let ifmCount = 0;
  let nonIfmCount = 0;
  let totalTouchpoints = 0;

  for (const lead of leadStore) {
    counts[lead.status]++;
    if (lead.tier === 'ifm') ifmCount++;
    else nonIfmCount++;
    totalTouchpoints += lead.touchpoints.length;
  }

  const total = leadStore.length;
  const activeTotal = total - counts.lost;
  const conversionRate = activeTotal > 0
    ? Math.round((counts.converted / activeTotal) * 100)
    : 0;
  const lossRate = total > 0
    ? Math.round((counts.lost / total) * 100)
    : 0;

  return {
    totalLeads: total,
    counts,
    conversionRate,
    lossRate,
    ifmCount,
    nonIfmCount,
    averageTouchpoints: total > 0 ? Math.round((totalTouchpoints / total) * 10) / 10 : 0,
    overdueFollowUps: getOverdueFollowUps(),
  };
}

/**
 * Generate a formatted CRM pipeline report.
 */
export function generateCrmReport(): string {
  const summary = getPipelineSummary();
  const lines: string[] = [];

  lines.push('='.repeat(64));
  lines.push('  VITALMATRIX PRACTITIONER CRM');
  lines.push(`  ${VM_BRAND.platform.descriptor} | ${VM_BRAND.platform.domain}`);
  lines.push('='.repeat(64));
  lines.push('');
  lines.push('PIPELINE OVERVIEW');
  lines.push(`  Total leads:       ${summary.totalLeads}`);

  for (const status of STATUS_ORDER) {
    const label = status.replace(/-/g, ' ').toUpperCase().padEnd(18);
    lines.push(`  ${label} ${summary.counts[status]}`);
  }

  lines.push('');
  lines.push('METRICS');
  lines.push(`  Conversion rate:     ${summary.conversionRate}%`);
  lines.push(`  Loss rate:           ${summary.lossRate}%`);
  lines.push(`  IFM practitioners:   ${summary.ifmCount}`);
  lines.push(`  Non-IFM:             ${summary.nonIfmCount}`);
  lines.push(`  Avg touchpoints:     ${summary.averageTouchpoints}`);
  lines.push('');

  if (summary.overdueFollowUps.length > 0) {
    lines.push('OVERDUE FOLLOW-UPS');
    for (const lead of summary.overdueFollowUps) {
      const lastDate = lead.touchpoints.length > 0
        ? lead.touchpoints[lead.touchpoints.length - 1].date
        : 'no touchpoints';
      lines.push(`  - ${lead.name} (${lead.tier.toUpperCase()}) [${lead.status}] last: ${lastDate}`);
      lines.push(`    Next action: ${lead.nextAction}`);
    }
    lines.push('');
  }

  lines.push('-'.repeat(64));
  lines.push(`${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}`);
  lines.push(VM_BRAND.regulatoryFooter);

  return lines.join('\n');
}

/**
 * Clear all leads from the store. Useful for testing.
 */
export function clearStore(): void {
  leadStore.length = 0;
}

/**
 * Get all leads currently in the store.
 */
export function getAllLeads(): PractitionerLead[] {
  return [...leadStore];
}

/**
 * Export all leads to a JSON string for persistence.
 */
export function exportToJson(): string {
  return JSON.stringify(getAllLeads(), null, 2);
}

/**
 * Import leads from a JSON string, replacing the current store.
 */
export function importFromJson(json: string): void {
  const leads: PractitionerLead[] = JSON.parse(json);
  clearStore();
  for (const lead of leads) {
    const restored = addLead({
      name: lead.name,
      email: lead.email || '',
      speciality: lead.speciality || '',
      tier: lead.tier || 'non-ifm',
      status: lead.status || 'lead',
      nextAction: lead.nextAction || '',
      notes: lead.notes || '',
      touchpoints: lead.touchpoints || [],
    });
    // Restore original touchpoints (addLead already handles this via the spread)
  }
}
