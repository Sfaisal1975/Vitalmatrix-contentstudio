/**
 * Component 29: Content Calendar
 * EXTREMELY HIGH-YIELD
 *
 * Auto-schedules content across a 90-day window with zone rotation
 * (Z1 through Z5). Mixes content types, spaces newsletters monthly,
 * and provides week/overdue/upcoming views. Exports as Markdown for
 * easy sharing in Notion, Slack, or email.
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export type ContentZone = 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

export type CalendarContentType =
  | 'blog'
  | 'newsletter'
  | 'email'
  | 'linkedin'
  | 'landing-page';

export type CalendarStatus = 'planned' | 'drafted' | 'published';

export interface CalendarEntry {
  date: string; // ISO date (YYYY-MM-DD)
  type: CalendarContentType;
  title: string;
  zone: ContentZone;
  status: CalendarStatus;
  assignedTo: string;
}

// --- Zone Metadata ---

const ZONE_NAMES: Record<ContentZone, string> = {
  Z1: 'Gut and Microbiome',
  Z2: 'Metabolic and Hormonal',
  Z3: 'Neuro and Cognitive',
  Z4: 'Immune and Inflammatory',
  Z5: 'Structural and Movement',
};

const ZONE_ROTATION: ContentZone[] = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'];

// --- Content Mix Pattern ---

/**
 * Weekly content pattern. Each week produces a mix of content types.
 * Newsletters are placed in week 1 of each month only.
 */
const WEEKLY_PATTERN: CalendarContentType[][] = [
  // Week 1 (newsletter week)
  ['blog', 'newsletter', 'linkedin', 'email'],
  // Week 2
  ['blog', 'linkedin', 'email'],
  // Week 3
  ['blog', 'linkedin', 'landing-page'],
  // Week 4
  ['blog', 'linkedin', 'email'],
];

// --- Title Templates ---

const TITLE_TEMPLATES: Record<CalendarContentType, (zone: ContentZone) => string> = {
  blog: (z) =>
    `${ZONE_NAMES[z]}: Clinical Insights for the Functional Medicine Practitioner`,
  newsletter: (z) =>
    `VitalMatrix Monthly: ${ZONE_NAMES[z]} Focus`,
  email: (z) =>
    `Practitioner Update: ${ZONE_NAMES[z]} Assessment Advances`,
  linkedin: (z) =>
    `Why ${ZONE_NAMES[z]} Assessment Matters in Clinical Practice`,
  'landing-page': (z) =>
    `VitalMatrix ${ZONE_NAMES[z]} Module: Features and Evidence`,
};

// --- Helpers ---

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function isSameWeek(a: Date, b: Date): boolean {
  const mondayA = getMonday(a);
  const mondayB = getMonday(b);
  return toIsoDate(mondayA) === toIsoDate(mondayB);
}

// --- Core Functions ---

/**
 * Generate a 90-day content calendar starting from the given date.
 * Rotates through Z1–Z5 zones, mixes content types per week,
 * and spaces newsletters to appear only once per month.
 */
export function generate90DayCalendar(startDate: string): CalendarEntry[] {
  const entries: CalendarEntry[] = [];
  const start = new Date(startDate);
  const totalDays = 90;
  const totalWeeks = Math.ceil(totalDays / 7);

  let zoneIndex = 0;

  for (let week = 0; week < totalWeeks; week++) {
    const patternIndex = week % WEEKLY_PATTERN.length;
    const contentTypes = WEEKLY_PATTERN[patternIndex];
    const currentZone = ZONE_ROTATION[zoneIndex % ZONE_ROTATION.length];

    // Spread content across the week (Mon, Tue, Wed, Thu)
    const weekStart = addDays(start, week * 7);

    for (let i = 0; i < contentTypes.length; i++) {
      const entryDate = addDays(weekStart, i + 1); // Tue–Fri publishing
      const dayOffset = Math.floor(
        (entryDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Do not exceed 90 days
      if (dayOffset > totalDays) break;

      const type = contentTypes[i];
      const title = TITLE_TEMPLATES[type](currentZone);

      entries.push({
        date: toIsoDate(entryDate),
        type,
        title,
        zone: currentZone,
        status: 'planned',
        assignedTo: VM_BRAND.credentials.name,
      });
    }

    // Advance zone every 2 weeks for variety without chaos
    if (week % 2 === 1) {
      zoneIndex++;
    }
  }

  return entries;
}

/**
 * Get all calendar entries for the current week.
 */
export function getThisWeek(calendar: CalendarEntry[]): CalendarEntry[] {
  const now = new Date();
  return calendar.filter((entry) => isSameWeek(new Date(entry.date), now));
}

/**
 * Get all entries with dates in the past that are not yet published.
 */
export function getOverdue(calendar: CalendarEntry[]): CalendarEntry[] {
  const today = toIsoDate(new Date());
  return calendar.filter(
    (entry) => entry.date < today && entry.status !== 'published'
  );
}

/**
 * Get all entries within the next N days from today.
 */
export function getUpcoming(
  calendar: CalendarEntry[],
  days: number
): CalendarEntry[] {
  const today = new Date();
  const cutoff = toIsoDate(addDays(today, days));
  const todayStr = toIsoDate(today);
  return calendar.filter(
    (entry) => entry.date >= todayStr && entry.date <= cutoff
  );
}

/**
 * Update the status of a specific calendar entry by date and type.
 */
export function updateEntryStatus(
  calendar: CalendarEntry[],
  date: string,
  type: CalendarContentType,
  newStatus: CalendarStatus
): CalendarEntry | null {
  const entry = calendar.find(
    (e) => e.date === date && e.type === type
  );
  if (!entry) return null;
  entry.status = newStatus;
  return entry;
}

/**
 * Export the calendar as a formatted Markdown table.
 */
export function exportAsMarkdown(calendar: CalendarEntry[]): string {
  const lines: string[] = [];

  lines.push(`# VitalMatrix Content Calendar`);
  lines.push(`> ${VM_BRAND.platform.descriptor} | ${VM_BRAND.platform.domain}`);
  lines.push('');
  lines.push('| Date | Type | Zone | Title | Status | Assigned |');
  lines.push('|------|------|------|-------|--------|----------|');

  for (const entry of calendar) {
    const statusBadge =
      entry.status === 'published'
        ? 'PUBLISHED'
        : entry.status === 'drafted'
          ? 'DRAFTED'
          : 'PLANNED';
    lines.push(
      `| ${entry.date} | ${entry.type} | ${entry.zone} | ${entry.title} | ${statusBadge} | ${entry.assignedTo} |`
    );
  }

  lines.push('');
  lines.push('---');
  lines.push(`*${VM_BRAND.credentials.name}, ${VM_BRAND.credentials.qualifications}*`);
  lines.push(`*${VM_BRAND.regulatoryFooter}*`);

  return lines.join('\n');
}

/**
 * Generate a summary of the calendar for reporting.
 */
export function getCalendarSummary(calendar: CalendarEntry[]): {
  totalEntries: number;
  byType: Record<CalendarContentType, number>;
  byZone: Record<ContentZone, number>;
  byStatus: Record<CalendarStatus, number>;
  overdueCount: number;
} {
  const byType: Record<string, number> = {
    blog: 0,
    newsletter: 0,
    email: 0,
    linkedin: 0,
    'landing-page': 0,
  };
  const byZone: Record<string, number> = {
    Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0,
  };
  const byStatus: Record<string, number> = {
    planned: 0, drafted: 0, published: 0,
  };

  for (const entry of calendar) {
    byType[entry.type]++;
    byZone[entry.zone]++;
    byStatus[entry.status]++;
  }

  return {
    totalEntries: calendar.length,
    byType: byType as Record<CalendarContentType, number>,
    byZone: byZone as Record<ContentZone, number>,
    byStatus: byStatus as Record<CalendarStatus, number>,
    overdueCount: getOverdue(calendar).length,
  };
}
