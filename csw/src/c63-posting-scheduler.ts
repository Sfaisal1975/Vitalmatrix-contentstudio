/**
 * Component 63: Posting Scheduler
 *
 * Optimal posting schedule with auto-scheduling across platforms.
 * Manages post queues, optimal time selection for B2B practitioner audiences,
 * calendar generation, and schedule optimisation recommendations.
 * All times default to GMT/BST.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Supported social media platforms */
export type SocialPlatform = 'linkedin' | 'facebook' | 'instagram' | 'x';

/** Post status within the scheduling pipeline */
export type PostStatus = 'queued' | 'posted' | 'failed' | 'cancelled';

/** A single scheduled post */
export interface ScheduledPost {
  /** Unique post identifier */
  id: string;
  /** Target platform */
  platform: SocialPlatform;
  /** Post content text */
  content: string;
  /** Hashtags to include */
  hashtags: string[];
  /** Description of attached media (optional) */
  mediaDescription?: string;
  /** Scheduled date and time (ISO 8601) */
  scheduledTime: string;
  /** Timezone (default: 'Europe/London') */
  timezone: string;
  /** Current post status */
  status: PostStatus;
  /** Content type (e.g. 'article', 'carousel', 'video', 'image', 'poll') */
  postType: string;
  /** Associated campaign ID (optional) */
  campaignId?: string;
}

/** A weekly posting schedule */
export interface PostingSchedule {
  /** Posts in this schedule */
  posts: ScheduledPost[];
  /** Week start date (ISO date string) */
  weekStart: string;
  /** Week end date (ISO date string) */
  weekEnd: string;
}

/** Engagement data for a posted item */
export interface PostEngagement {
  postId: string;
  platform: SocialPlatform;
  postedAt: string;
  dayOfWeek: string;
  hourOfDay: number;
  impressions: number;
  engagement: number;
  engagementRate: number;
  clicks: number;
}

/** Day of week */
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// --- Optimal Times (B2B Practitioner Audience, GMT) ---

/** Optimal posting times per platform, keyed by day of week */
const OPTIMAL_TIMES: Record<SocialPlatform, Partial<Record<DayOfWeek, string[]>>> = {
  linkedin: {
    Tuesday: ['07:00', '08:00', '12:00', '17:00', '18:00'],
    Wednesday: ['07:00', '08:00', '12:00', '17:00', '18:00'],
    Thursday: ['07:00', '08:00', '12:00', '17:00', '18:00'],
  },
  facebook: {
    Wednesday: ['09:00', '10:00', '11:00', '12:00'],
    Thursday: ['09:00', '10:00', '11:00', '12:00'],
    Friday: ['09:00', '10:00', '11:00', '12:00'],
  },
  instagram: {
    Monday: ['11:00', '12:00', '13:00', '19:00', '20:00', '21:00'],
    Tuesday: ['11:00', '12:00', '13:00', '19:00', '20:00', '21:00'],
    Wednesday: ['11:00', '12:00', '13:00', '19:00', '20:00', '21:00'],
    Thursday: ['11:00', '12:00', '13:00', '19:00', '20:00', '21:00'],
    Friday: ['11:00', '12:00', '13:00', '19:00', '20:00', '21:00'],
  },
  x: {
    Monday: ['08:00', '09:00', '10:00', '12:00', '13:00'],
    Tuesday: ['08:00', '09:00', '10:00', '12:00', '13:00'],
    Wednesday: ['08:00', '09:00', '10:00', '12:00', '13:00'],
    Thursday: ['08:00', '09:00', '10:00', '12:00', '13:00'],
    Friday: ['08:00', '09:00', '10:00', '12:00', '13:00'],
  },
};

// --- State ---

/** All scheduled posts keyed by ID */
const posts: Map<string, ScheduledPost> = new Map();

/** Post engagement history */
const engagementHistory: PostEngagement[] = [];

/** Auto-incrementing post counter */
let postCounter = 0;

// --- Helpers ---

/** Generates a unique post ID */
function nextPostId(): string {
  postCounter += 1;
  return `post-${String(postCounter).padStart(5, '0')}`;
}

/** Returns the day of week name from an ISO date string */
function getDayOfWeek(isoDate: string): DayOfWeek {
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(isoDate).getDay()];
}

/** Returns the hour from an ISO date string */
function getHour(isoDate: string): number {
  return new Date(isoDate).getHours();
}

/** Adds days to a date string */
function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// --- Core Functions ---

/**
 * Schedules a post for a specific platform and time.
 * @param platform - Target platform
 * @param content - Post content
 * @param scheduledTime - ISO 8601 scheduled time
 * @param hashtags - Hashtags to include
 * @param postType - Content type
 * @param mediaDescription - Optional media description
 * @param campaignId - Optional campaign association
 * @returns The created ScheduledPost
 */
export function schedulePost(
  platform: SocialPlatform,
  content: string,
  scheduledTime: string,
  hashtags: string[] = [],
  postType: string = 'article',
  mediaDescription?: string,
  campaignId?: string
): ScheduledPost {
  const post: ScheduledPost = {
    id: nextPostId(),
    platform,
    content,
    hashtags,
    mediaDescription,
    scheduledTime,
    timezone: 'Europe/London',
    status: 'queued',
    postType,
    campaignId,
  };
  posts.set(post.id, post);
  return post;
}

/**
 * Auto-schedules content across multiple platforms at optimal times.
 * Picks the next available optimal slot for each platform.
 * @param content - Post content
 * @param platforms - Platforms to schedule on
 * @param hashtags - Hashtags to include
 * @param postType - Content type
 * @returns Array of created ScheduledPosts
 */
export function autoSchedule(
  content: string,
  platforms: SocialPlatform[],
  hashtags: string[] = [],
  postType: string = 'article'
): ScheduledPost[] {
  const results: ScheduledPost[] = [];
  const now = new Date();

  for (const platform of platforms) {
    const optimalSlots = OPTIMAL_TIMES[platform];
    let scheduled = false;

    // Look ahead up to 7 days for an optimal slot
    for (let dayOffset = 0; dayOffset < 7 && !scheduled; dayOffset++) {
      const candidateDate = new Date(now);
      candidateDate.setDate(candidateDate.getDate() + dayOffset);
      const dayName = getDayOfWeek(candidateDate.toISOString());
      const slots = optimalSlots[dayName];

      if (slots && slots.length > 0) {
        // Pick the first available slot
        const time = slots[0];
        const [hours, minutes] = time.split(':').map(Number);
        candidateDate.setHours(hours, minutes, 0, 0);

        // Only schedule in the future
        if (candidateDate.getTime() > now.getTime()) {
          const post = schedulePost(
            platform,
            content,
            candidateDate.toISOString(),
            hashtags,
            postType
          );
          results.push(post);
          scheduled = true;
        }
      }
    }

    // Fallback: schedule tomorrow at 09:00 if no optimal slot found
    if (!scheduled) {
      const fallback = new Date(now);
      fallback.setDate(fallback.getDate() + 1);
      fallback.setHours(9, 0, 0, 0);
      const post = schedulePost(
        platform,
        content,
        fallback.toISOString(),
        hashtags,
        postType
      );
      results.push(post);
    }
  }

  return results;
}

/**
 * Generates a full weekly posting schedule by distributing content across optimal times.
 * @param contentPlan - Array of { content, platforms, hashtags, postType } items
 * @param weekStartDate - ISO date string for the week start (Monday)
 * @returns A PostingSchedule for the week
 */
export function generateWeeklySchedule(
  contentPlan: { content: string; platforms: SocialPlatform[]; hashtags?: string[]; postType?: string }[],
  weekStartDate: string
): PostingSchedule {
  const scheduledPosts: ScheduledPost[] = [];
  const weekStart = weekStartDate;
  const weekEnd = addDays(weekStartDate, 6);

  // Track used slots to avoid double-booking
  const usedSlots: Set<string> = new Set();

  for (const item of contentPlan) {
    for (const platform of item.platforms) {
      const optimalSlots = OPTIMAL_TIMES[platform];

      let scheduled = false;
      for (let dayOffset = 0; dayOffset < 7 && !scheduled; dayOffset++) {
        const dateStr = addDays(weekStartDate, dayOffset);
        const dayName = getDayOfWeek(dateStr + 'T12:00:00Z');
        const slots = optimalSlots[dayName];

        if (slots) {
          for (const time of slots) {
            const slotKey = `${platform}-${dateStr}-${time}`;
            if (!usedSlots.has(slotKey)) {
              usedSlots.add(slotKey);
              const [hours, minutes] = time.split(':').map(Number);
              const scheduledDate = new Date(dateStr);
              scheduledDate.setHours(hours, minutes, 0, 0);

              const post = schedulePost(
                platform,
                item.content,
                scheduledDate.toISOString(),
                item.hashtags || [],
                item.postType || 'article'
              );
              scheduledPosts.push(post);
              scheduled = true;
              break;
            }
          }
        }
      }
    }
  }

  return { posts: scheduledPosts, weekStart, weekEnd };
}

/**
 * Returns all queued posts, optionally filtered by platform.
 * @param platform - Optional platform filter
 */
export function getQueuedPosts(platform?: SocialPlatform): ScheduledPost[] {
  const all = Array.from(posts.values()).filter((p) => p.status === 'queued');
  return platform ? all.filter((p) => p.platform === platform) : all;
}

/**
 * Reschedules a post to a new time.
 * @param postId - The post to reschedule
 * @param newTime - New ISO 8601 time
 * @returns The updated post or undefined
 */
export function reschedulePost(postId: string, newTime: string): ScheduledPost | undefined {
  const post = posts.get(postId);
  if (!post || post.status !== 'queued') return undefined;
  post.scheduledTime = newTime;
  posts.set(postId, post);
  return post;
}

/**
 * Cancels a queued post.
 * @param postId - The post to cancel
 * @returns The updated post or undefined
 */
export function cancelPost(postId: string): ScheduledPost | undefined {
  const post = posts.get(postId);
  if (!post || post.status !== 'queued') return undefined;
  post.status = 'cancelled';
  posts.set(postId, post);
  return post;
}

/**
 * Marks a queued post as successfully posted.
 * @param postId - The post to mark
 * @returns The updated post or undefined
 */
export function markAsPosted(postId: string): ScheduledPost | undefined {
  const post = posts.get(postId);
  if (!post) return undefined;
  post.status = 'posted';
  posts.set(postId, post);
  return post;
}

/**
 * Returns posting history for a date range.
 * @param startDate - ISO date string (inclusive)
 * @param endDate - ISO date string (inclusive)
 */
export function getPostingHistory(startDate: string, endDate: string): ScheduledPost[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return Array.from(posts.values()).filter((p) => {
    if (p.status !== 'posted') return false;
    const t = new Date(p.scheduledTime).getTime();
    return t >= start && t <= end;
  });
}

/**
 * Returns the best posting time for a platform on a given day.
 * @param platform - Target platform
 * @param dayOfWeek - Day of the week
 * @returns The optimal time string (HH:MM) or '09:00' as fallback
 */
export function getOptimalTime(platform: SocialPlatform, dayOfWeek: DayOfWeek): string {
  const slots = OPTIMAL_TIMES[platform][dayOfWeek];
  return slots && slots.length > 0 ? slots[0] : '09:00';
}

/**
 * Generates a markdown calendar view of a week's schedule.
 * @param schedule - The posting schedule to visualise
 * @returns Markdown-formatted calendar
 */
export function generateScheduleCalendar(schedule: PostingSchedule): string {
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const lines: string[] = [
    `# Posting Schedule: ${schedule.weekStart} to ${schedule.weekEnd}`,
    '',
    `**Total Posts:** ${schedule.posts.length}`,
    '',
  ];

  for (let i = 0; i < 7; i++) {
    const dateStr = addDays(schedule.weekStart, i);
    const dayName = days[i];
    const dayPosts = schedule.posts.filter((p) => {
      return p.scheduledTime.startsWith(dateStr);
    });

    lines.push(`## ${dayName} (${dateStr})`);
    lines.push('');

    if (dayPosts.length === 0) {
      lines.push('*No posts scheduled*');
    } else {
      lines.push('| Time | Platform | Type | Content Preview | Status |');
      lines.push('|------|----------|------|-----------------|--------|');
      for (const post of dayPosts.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))) {
        const time = post.scheduledTime.split('T')[1]?.substring(0, 5) || '—';
        const preview = post.content.substring(0, 40) + (post.content.length > 40 ? '...' : '');
        lines.push(`| ${time} | ${post.platform} | ${post.postType} | ${preview} | ${post.status} |`);
      }
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(`Generated by ${VM_BRAND.credentials.company} Content Studio`);

  return lines.join('\n');
}

/**
 * Logs engagement data for a posted item.
 * @param postId - The posted item
 * @param impressions - Impression count
 * @param engagement - Engagement count (likes, comments, shares)
 * @param clicks - Click count
 */
export function logEngagement(
  postId: string,
  impressions: number,
  engagement: number,
  clicks: number
): void {
  const post = posts.get(postId);
  if (!post) return;

  engagementHistory.push({
    postId,
    platform: post.platform,
    postedAt: post.scheduledTime,
    dayOfWeek: getDayOfWeek(post.scheduledTime),
    hourOfDay: getHour(post.scheduledTime),
    impressions,
    engagement,
    engagementRate: impressions > 0 ? (engagement / impressions) * 100 : 0,
    clicks,
  });
}

/**
 * Analyses posting history to identify which times and days get best engagement.
 * @param history - Engagement history to analyse (defaults to all history)
 * @returns Analysis object with best day, best hour, and per-platform breakdown
 */
export function analysePostingPatterns(
  history?: PostEngagement[]
): {
  bestDay: string;
  bestHour: number;
  perPlatform: Record<string, { bestDay: string; bestHour: number; avgEngagement: number }>;
} {
  const data = history || engagementHistory;

  if (data.length === 0) {
    return {
      bestDay: 'Tuesday',
      bestHour: 8,
      perPlatform: {},
    };
  }

  // Aggregate by day
  const dayEngagement: Record<string, number[]> = {};
  const hourEngagement: Record<number, number[]> = {};
  const platformData: Record<string, PostEngagement[]> = {};

  for (const entry of data) {
    if (!dayEngagement[entry.dayOfWeek]) dayEngagement[entry.dayOfWeek] = [];
    dayEngagement[entry.dayOfWeek].push(entry.engagementRate);

    if (!hourEngagement[entry.hourOfDay]) hourEngagement[entry.hourOfDay] = [];
    hourEngagement[entry.hourOfDay].push(entry.engagementRate);

    if (!platformData[entry.platform]) platformData[entry.platform] = [];
    platformData[entry.platform].push(entry);
  }

  const avgByDay = Object.entries(dayEngagement).map(([day, rates]) => ({
    day,
    avg: rates.reduce((s, r) => s + r, 0) / rates.length,
  }));
  avgByDay.sort((a, b) => b.avg - a.avg);

  const avgByHour = Object.entries(hourEngagement).map(([hour, rates]) => ({
    hour: Number(hour),
    avg: rates.reduce((s, r) => s + r, 0) / rates.length,
  }));
  avgByHour.sort((a, b) => b.avg - a.avg);

  const perPlatform: Record<string, { bestDay: string; bestHour: number; avgEngagement: number }> = {};
  for (const [platform, entries] of Object.entries(platformData)) {
    const pDayEng: Record<string, number[]> = {};
    const pHourEng: Record<number, number[]> = {};
    let totalEng = 0;

    for (const e of entries) {
      if (!pDayEng[e.dayOfWeek]) pDayEng[e.dayOfWeek] = [];
      pDayEng[e.dayOfWeek].push(e.engagementRate);
      if (!pHourEng[e.hourOfDay]) pHourEng[e.hourOfDay] = [];
      pHourEng[e.hourOfDay].push(e.engagementRate);
      totalEng += e.engagementRate;
    }

    const pBestDay = Object.entries(pDayEng)
      .map(([d, r]) => ({ d, avg: r.reduce((s, v) => s + v, 0) / r.length }))
      .sort((a, b) => b.avg - a.avg)[0];

    const pBestHour = Object.entries(pHourEng)
      .map(([h, r]) => ({ h: Number(h), avg: r.reduce((s, v) => s + v, 0) / r.length }))
      .sort((a, b) => b.avg - a.avg)[0];

    perPlatform[platform] = {
      bestDay: pBestDay?.d || 'Tuesday',
      bestHour: pBestHour?.h || 8,
      avgEngagement: entries.length > 0 ? totalEng / entries.length : 0,
    };
  }

  return {
    bestDay: avgByDay[0]?.day || 'Tuesday',
    bestHour: avgByHour[0]?.hour || 8,
    perPlatform,
  };
}

/**
 * Suggests schedule optimisations based on engagement history.
 * @param history - Optional engagement history (defaults to all history)
 * @returns Array of actionable recommendation strings
 */
export function suggestScheduleOptimisation(history?: PostEngagement[]): string[] {
  const patterns = analysePostingPatterns(history);
  const recommendations: string[] = [];

  recommendations.push(
    `Best overall posting day: ${patterns.bestDay}. Consider increasing frequency on this day.`
  );
  recommendations.push(
    `Best overall posting hour: ${String(patterns.bestHour).padStart(2, '0')}:00 GMT. Schedule high-priority content at this time.`
  );

  for (const [platform, data] of Object.entries(patterns.perPlatform)) {
    recommendations.push(
      `${platform}: best performance on ${data.bestDay} at ${String(data.bestHour).padStart(2, '0')}:00 (avg engagement: ${data.avgEngagement.toFixed(2)}%).`
    );
  }

  // Check for weekend posting (B2B audience typically low)
  const data = history || engagementHistory;
  const weekendPosts = data.filter(
    (e) => e.dayOfWeek === 'Saturday' || e.dayOfWeek === 'Sunday'
  );
  if (weekendPosts.length > 0) {
    const weekendAvg =
      weekendPosts.reduce((s, e) => s + e.engagementRate, 0) / weekendPosts.length;
    const weekdayPosts = data.filter(
      (e) => e.dayOfWeek !== 'Saturday' && e.dayOfWeek !== 'Sunday'
    );
    const weekdayAvg =
      weekdayPosts.length > 0
        ? weekdayPosts.reduce((s, e) => s + e.engagementRate, 0) / weekdayPosts.length
        : 0;

    if (weekdayAvg > weekendAvg * 1.5) {
      recommendations.push(
        'Weekend engagement is significantly lower than weekday. Consider reducing or eliminating weekend posts for this B2B audience.'
      );
    }
  }

  recommendations.push(
    'Ensure all posts include relevant hashtags — aim for 3-5 per post on LinkedIn, 5-10 on Instagram.'
  );

  return recommendations;
}
