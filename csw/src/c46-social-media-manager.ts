/**
 * Component 46: Social Media Manager
 *
 * Multi-platform social media content management for LinkedIn,
 * Facebook, Instagram, and X. Validates posts against platform
 * constraints and compliance rules (K7/K8/K10). Generates cross-posts,
 * manages campaigns, tracks engagement, and builds posting calendars.
 *
 * B2B practitioner-facing only. Never patient-facing.
 *
 * VitalMatrix Content Studio -- Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Supported social media platforms */
export type SocialPlatform = 'linkedin' | 'facebook' | 'instagram' | 'x';

/** Media attachment type */
export type MediaType = 'text' | 'image' | 'carousel' | 'video';

/** Post lifecycle status */
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

/** Engagement metrics for a published post */
export interface Engagement {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
}

/** A single social media post */
export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  hashtags: string[];
  mediaType: MediaType;
  scheduledDate?: string;
  status: PostStatus;
  campaignId?: string;
  engagement?: Engagement;
}

/** Platform-specific content constraints */
export interface PostConstraints {
  maxChars: number;
  maxHashtags: number;
  mediaRequired: boolean;
  recommendedHashtags?: number;
}

/** Validation result returned by validatePost */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/** A single calendar entry in the posting schedule */
export interface CalendarEntry {
  date: string;
  platform: SocialPlatform;
  contentTheme: string;
  mediaType: MediaType;
}

// --- Constants ---

/** Character and hashtag limits per platform */
const PLATFORM_CONSTRAINTS: Record<SocialPlatform, PostConstraints> = {
  linkedin: { maxChars: 3000, maxHashtags: 30, mediaRequired: false },
  facebook: { maxChars: 63206, maxHashtags: 30, mediaRequired: false },
  instagram: { maxChars: 2200, maxHashtags: 30, mediaRequired: true },
  x: { maxChars: 280, maxHashtags: 280, mediaRequired: false, recommendedHashtags: 3 },
};

/** Kill-list patterns (K7, K8, K10) plus compliance terms */
const COMPLIANCE_PATTERNS: { pattern: RegExp; message: string }[] = [
  { pattern: /Mark\s+Hyman/i, message: 'K10 violation: competitor name (Mark Hyman) detected' },
  { pattern: /LaValle/i, message: 'K10 violation: competitor name (LaValle) detected' },
  { pattern: /Metabolic\s+Code/i, message: 'K10 violation: competitor-adjacent term (Metabolic Code) detected' },
  { pattern: /FMAARM/i, message: 'K7 violation: FMAARM credential used (must be FAAMFM)' },
  { pattern: /\bMD\b/, message: 'K7 violation: MD credential used (must be MBBS)' },
  { pattern: /\u2014/g, message: 'K8 violation: em dash detected (use en dash or hyphen)' },
  { pattern: /clinical\s+AI\s+platform/i, message: 'Descriptor violation: use "terrain intelligence platform" only' },
  { pattern: /diagnos(e|is|tic)\b/i, message: 'Compliance: diagnostic language detected -- not permitted in marketing content' },
  { pattern: /patient/i, message: 'Audience violation: patient-facing language detected -- B2B practitioner content only' },
];

/** Weekly content theme rotation */
const WEEKLY_THEMES: string[] = [
  'Clinical insights and evidence updates',
  'Platform feature spotlight',
  'Practitioner success and workflow tips',
  'Founding cohort and community',
  'Terrain medicine fundamentals',
  'Case-based learning (anonymised)',
  'VitalMatrix product updates',
];

// --- In-memory store ---

const posts: SocialPost[] = [];

// --- Utility ---

/** Generate a unique post identifier */
function generateId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Run compliance checks against content text.
 * Returns arrays of errors and warnings.
 */
function checkCompliance(content: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const { pattern, message } of COMPLIANCE_PATTERNS) {
    if (pattern.test(content)) {
      if (message.startsWith('K')) {
        errors.push(message);
      } else {
        warnings.push(message);
      }
    }
  }

  return { errors, warnings };
}

// --- Core Functions ---

/**
 * Create a new social media post with automatic validation
 * against the target platform's constraints.
 *
 * @param platform - Target social platform
 * @param content - Post body text
 * @param hashtags - Array of hashtag strings (without # prefix)
 * @param mediaType - Attachment type
 * @returns The created SocialPost (status: 'draft')
 * @throws If content exceeds platform character limit or media rules are violated
 */
export function createPost(
  platform: SocialPlatform,
  content: string,
  hashtags: string[],
  mediaType: MediaType,
): SocialPost {
  const constraints = PLATFORM_CONSTRAINTS[platform];

  if (content.length > constraints.maxChars) {
    throw new Error(
      `Content exceeds ${platform} limit: ${content.length}/${constraints.maxChars} characters`,
    );
  }

  if (hashtags.length > constraints.maxHashtags) {
    throw new Error(
      `Too many hashtags for ${platform}: ${hashtags.length}/${constraints.maxHashtags}`,
    );
  }

  if (constraints.mediaRequired && mediaType === 'text') {
    throw new Error(`${platform} requires media -- text-only posts are not supported`);
  }

  const post: SocialPost = {
    id: generateId(),
    platform,
    content,
    hashtags,
    mediaType,
    status: 'draft',
  };

  posts.push(post);
  return post;
}

/**
 * Adapt content from one platform format to another.
 * Auto-truncates, adjusts hashtags, and adds platform-specific formatting.
 *
 * @param content - Original content text
 * @param targetPlatform - Platform to adapt content for
 * @returns Adapted content string
 */
export function adaptContentForPlatform(content: string, targetPlatform: SocialPlatform): string {
  const constraints = PLATFORM_CONSTRAINTS[targetPlatform];
  let adapted = content;

  switch (targetPlatform) {
    case 'linkedin': {
      // Add professional framing
      if (!adapted.startsWith('[')) {
        adapted = `${adapted}\n\n${VM_BRAND.regulatoryFooter}`;
      }
      break;
    }
    case 'facebook': {
      // Facebook supports long-form; add context line
      adapted = `${adapted}\n\nLearn more at ${VM_BRAND.platform.domain}`;
      break;
    }
    case 'instagram': {
      // Instagram: concise, visual-first. Trim if needed.
      if (adapted.length > 2000) {
        adapted = adapted.slice(0, 1997) + '...';
      }
      adapted = `${adapted}\n\nLink in bio`;
      break;
    }
    case 'x': {
      // X: hard truncate to fit 280
      const suffix = ` -- ${VM_BRAND.platform.domain}`;
      const maxBody = constraints.maxChars - suffix.length;
      if (adapted.length > maxBody) {
        adapted = adapted.slice(0, maxBody - 3) + '...' + suffix;
      } else {
        adapted = adapted + suffix;
      }
      break;
    }
  }

  // Final truncation safety net
  if (adapted.length > constraints.maxChars) {
    adapted = adapted.slice(0, constraints.maxChars - 3) + '...';
  }

  return adapted;
}

/**
 * Generate cross-platform posts from a single piece of content.
 * Creates adapted versions for all four supported platforms.
 *
 * @param content - Source content text
 * @returns Record mapping each platform to its adapted content string
 */
export function generateCrossPost(content: string): Record<SocialPlatform, string> {
  const platforms: SocialPlatform[] = ['linkedin', 'facebook', 'instagram', 'x'];
  const result = {} as Record<SocialPlatform, string>;

  for (const platform of platforms) {
    result[platform] = adaptContentForPlatform(content, platform);
  }

  return result;
}

/**
 * Validate a post against platform constraints and compliance rules.
 * Checks character limits, hashtag counts, media requirements,
 * and K7/K8/K10 kill-list patterns.
 *
 * @param post - The SocialPost to validate
 * @returns ValidationResult with valid flag, errors, and warnings
 */
export function validatePost(post: SocialPost): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const constraints = PLATFORM_CONSTRAINTS[post.platform];

  // Platform constraint checks
  if (post.content.length > constraints.maxChars) {
    errors.push(
      `Content exceeds ${post.platform} limit: ${post.content.length}/${constraints.maxChars} characters`,
    );
  }

  if (post.hashtags.length > constraints.maxHashtags) {
    errors.push(
      `Too many hashtags: ${post.hashtags.length}/${constraints.maxHashtags}`,
    );
  }

  if (constraints.mediaRequired && post.mediaType === 'text') {
    errors.push(`${post.platform} requires media attachment`);
  }

  if (
    constraints.recommendedHashtags &&
    post.hashtags.length > constraints.recommendedHashtags
  ) {
    warnings.push(
      `${post.platform} recommends ${constraints.recommendedHashtags} hashtags or fewer`,
    );
  }

  // Compliance checks (K7, K8, K10 + general)
  const compliance = checkCompliance(post.content);
  errors.push(...compliance.errors);
  warnings.push(...compliance.warnings);

  // Check hashtag text for compliance too
  const hashtagText = post.hashtags.join(' ');
  const hashtagCompliance = checkCompliance(hashtagText);
  errors.push(...hashtagCompliance.errors);
  warnings.push(...hashtagCompliance.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Retrieve all posts for a specific platform.
 *
 * @param platform - The platform to filter by
 * @returns Array of matching SocialPost objects
 */
export function getPostsByPlatform(platform: SocialPlatform): SocialPost[] {
  return posts.filter((p) => p.platform === platform);
}

/**
 * Retrieve all posts belonging to a specific campaign.
 *
 * @param campaignId - Campaign identifier
 * @returns Array of matching SocialPost objects
 */
export function getPostsByCampaign(campaignId: string): SocialPost[] {
  return posts.filter((p) => p.campaignId === campaignId);
}

/**
 * Retrieve all posts with 'scheduled' status, optionally filtered
 * to a date range.
 *
 * @returns Array of scheduled SocialPost objects sorted by date
 */
export function getScheduledPosts(): SocialPost[] {
  return posts
    .filter((p) => p.status === 'scheduled' && p.scheduledDate)
    .sort((a, b) => (a.scheduledDate! > b.scheduledDate! ? 1 : -1));
}

/**
 * Update engagement metrics for a published post.
 *
 * @param postId - The post identifier
 * @param engagement - New engagement metrics
 * @returns Updated SocialPost or undefined if not found
 */
export function updateEngagement(
  postId: string,
  engagement: Engagement,
): SocialPost | undefined {
  const post = posts.find((p) => p.id === postId);
  if (!post) return undefined;

  post.engagement = engagement;
  return post;
}

/**
 * Generate a weekly posting calendar rotating platforms and themes.
 *
 * @param startDate - ISO date string for the first day
 * @param weeks - Number of weeks to generate
 * @returns Array of CalendarEntry objects
 */
export function generatePostCalendar(startDate: string, weeks: number): CalendarEntry[] {
  const calendar: CalendarEntry[] = [];
  const platforms: SocialPlatform[] = ['linkedin', 'facebook', 'instagram', 'x'];
  const mediaTypes: MediaType[] = ['text', 'image', 'carousel', 'video'];

  const start = new Date(startDate);

  for (let week = 0; week < weeks; week++) {
    const themeIndex = week % WEEKLY_THEMES.length;
    const theme = WEEKLY_THEMES[themeIndex];

    for (let day = 0; day < 5; day++) {
      // Weekdays only (Mon-Fri)
      const postDate = new Date(start);
      postDate.setDate(start.getDate() + week * 7 + day);

      const platformIndex = (week * 5 + day) % platforms.length;
      const platform = platforms[platformIndex];

      // Instagram always gets image/carousel, X always text
      let mediaType: MediaType;
      if (platform === 'instagram') {
        mediaType = day % 2 === 0 ? 'image' : 'carousel';
      } else if (platform === 'x') {
        mediaType = 'text';
      } else {
        mediaType = mediaTypes[day % mediaTypes.length];
      }

      calendar.push({
        date: postDate.toISOString().split('T')[0],
        platform,
        contentTheme: theme,
        mediaType,
      });
    }
  }

  return calendar;
}
