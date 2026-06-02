/**
 * Component 34: Social Proof Aggregator
 *
 * Manages practitioner feedback, testimonial approvals, cohort milestone
 * tracking, and generates VM-branded HTML blocks combining testimonials
 * with milestone announcements.
 *
 * Founding cohort: 10 spots total.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

export interface PractitionerFeedback {
  practitionerName: string;
  practitionerTitle: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  dateReceived: string;
  approved: boolean;
  category: 'platform' | 'clinical' | 'support' | 'value';
}

export interface CohortMilestone {
  spotsTotal: 10;
  spotsFilled: number;
  milestone: string;
  dateReached: string;
}

// --- In-Memory Store ---

const feedbackStore: PractitionerFeedback[] = [];
const milestoneStore: CohortMilestone[] = [];

// --- Feedback Functions ---

/**
 * Adds a new practitioner feedback entry to the store.
 * Returns the total number of feedback entries.
 */
export function addFeedback(feedback: PractitionerFeedback): number {
  feedbackStore.push({ ...feedback });
  return feedbackStore.length;
}

/**
 * Returns all approved testimonials, optionally filtered by category.
 */
export function getApprovedTestimonials(
  category?: PractitionerFeedback['category'],
): PractitionerFeedback[] {
  return feedbackStore.filter(f => {
    if (!f.approved) return false;
    if (category && f.category !== category) return false;
    return true;
  });
}

// --- Milestone Functions ---

/**
 * Returns current cohort progress.
 */
export function getCohortProgress(): CohortMilestone | null {
  if (milestoneStore.length === 0) return null;
  return { ...milestoneStore[milestoneStore.length - 1] };
}

/**
 * Records a cohort milestone (e.g., a new founding spot filled).
 */
export function recordMilestone(spotsFilled: number, milestone: string, dateReached: string): CohortMilestone {
  const entry: CohortMilestone = {
    spotsTotal: 10,
    spotsFilled,
    milestone,
    dateReached,
  };
  milestoneStore.push(entry);
  return entry;
}

// --- HTML Generation ---

/**
 * Generates a VM-styled testimonial card as an HTML string.
 * Uses Prussian Blue background, Gold accent, Cormorant Garamond heading,
 * Outfit body, and star rating display.
 */
export function generateTestimonialHtml(feedback: PractitionerFeedback): string {
  const { colours, fonts } = VM_BRAND;

  const stars = Array.from({ length: 5 }, (_, i) =>
    i < feedback.rating ? '&#9733;' : '&#9734;'
  ).join('');

  const categoryLabels: Record<PractitionerFeedback['category'], string> = {
    platform: 'Platform Experience',
    clinical: 'Clinical Value',
    support: 'Support Quality',
    value: 'Value for Money',
  };

  return `<div style="
    background-color: ${colours.charcoal};
    border: 1px solid ${colours.deepTeal};
    border-left: 4px solid ${colours.gold};
    border-radius: 8px;
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
    font-family: '${fonts.body}', sans-serif;
    color: ${colours.white};
  ">
    <div style="
      font-family: '${fonts.heading}', serif;
      font-size: 1rem;
      color: ${colours.gold};
      margin-bottom: 0.5rem;
    ">${categoryLabels[feedback.category]}</div>
    <div style="
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1rem;
      font-style: italic;
    ">"${feedback.quote}"</div>
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.5rem;
    ">
      <div>
        <strong style="color: ${colours.white};">${feedback.practitionerName}</strong>
        <span style="opacity: 0.7; margin-left: 0.5rem;">${feedback.practitionerTitle}</span>
      </div>
      <div style="
        color: ${colours.gold};
        font-size: 1.2rem;
        letter-spacing: 2px;
      ">${stars}</div>
    </div>
  </div>`;
}

/**
 * Generates a milestone announcement string.
 * E.g., "3 of 10 founding spots filled"
 */
export function generateMilestoneAnnouncement(milestone: CohortMilestone): string {
  const remaining = milestone.spotsTotal - milestone.spotsFilled;
  const urgency = remaining <= 3 ? ' Limited availability.' : '';

  return `${milestone.spotsFilled} of ${milestone.spotsTotal} founding spots filled. ${milestone.milestone}${urgency}`;
}

/**
 * Generates a complete social proof HTML section combining approved
 * testimonials and the latest cohort milestone into a single
 * VM-branded block.
 */
export function generateSocialProofSection(): string {
  const { colours, fonts, credentials, regulatoryFooter } = VM_BRAND;

  const approved = getApprovedTestimonials();
  const latestMilestone = getCohortProgress();

  // Testimonial cards
  const testimonialCards = approved.length > 0
    ? approved.map(f => generateTestimonialHtml(f)).join('\n')
    : `<p style="opacity: 0.6; font-style: italic;">Testimonials from founding cohort practitioners will appear here.</p>`;

  // Milestone bar
  const milestoneHtml = latestMilestone
    ? (() => {
        const pct = Math.round((latestMilestone.spotsFilled / latestMilestone.spotsTotal) * 100);
        const announcement = generateMilestoneAnnouncement(latestMilestone);
        return `<div style="
          background-color: ${colours.charcoal};
          border: 1px solid ${colours.deepTeal};
          border-radius: 8px;
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
        ">
          <div style="
            font-family: '${fonts.heading}', serif;
            font-size: 1.3rem;
            color: ${colours.gold};
            margin-bottom: 0.75rem;
          ">Founding Cohort Progress</div>
          <div style="
            background-color: ${colours.prussianBlue};
            border-radius: 4px;
            height: 12px;
            margin-bottom: 0.75rem;
            overflow: hidden;
          ">
            <div style="
              background: linear-gradient(90deg, ${colours.gold}, ${colours.teal});
              height: 100%;
              width: ${pct}%;
              border-radius: 4px;
              transition: width 0.3s;
            "></div>
          </div>
          <div style="
            font-family: '${fonts.data}', monospace;
            font-size: 0.9rem;
            color: ${colours.white};
          ">${announcement}</div>
        </div>`;
      })()
    : '';

  return `<section style="
    background-color: ${colours.prussianBlue};
    padding: 3rem 2rem;
    font-family: '${fonts.body}', sans-serif;
    color: ${colours.white};
  ">
    <div style="max-width: 720px; margin: 0 auto;">
      <h2 style="
        font-family: '${fonts.heading}', serif;
        font-size: 2rem;
        color: ${colours.gold};
        margin-bottom: 0.5rem;
      ">What Practitioners Say</h2>
      <p style="
        opacity: 0.7;
        margin-bottom: 2rem;
      ">Feedback from practitioners using VitalMatrix in clinical practice.</p>

      ${milestoneHtml}

      ${testimonialCards}

      <div style="
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(201, 168, 76, 0.15);
        font-size: 0.75rem;
        opacity: 0.5;
      ">
        <p>${credentials.name}, ${credentials.qualifications} | ${credentials.title}, ${credentials.company}</p>
        <p>${regulatoryFooter}</p>
      </div>
    </div>
  </section>`;
}

// --- Persistence Helpers ---

/**
 * Get all feedback entries currently in the store.
 */
export function getAllFeedback(): PractitionerFeedback[] {
  return [...feedbackStore];
}

/**
 * Get all milestone entries currently in the store.
 */
export function getAllMilestones(): CohortMilestone[] {
  return [...milestoneStore];
}

/**
 * Clear all feedback and milestone data. Useful for testing.
 */
export function clearStores(): void {
  feedbackStore.length = 0;
  milestoneStore.length = 0;
}

/**
 * Export all feedback and milestone data to a JSON string for persistence.
 */
export function exportToJson(): string {
  return JSON.stringify({
    feedback: getAllFeedback(),
    milestones: getAllMilestones(),
  }, null, 2);
}

/**
 * Import feedback and milestone data from a JSON string, replacing the current stores.
 */
export function importFromJson(json: string): void {
  const data: { feedback: PractitionerFeedback[]; milestones: CohortMilestone[] } = JSON.parse(json);
  clearStores();
  for (const fb of (data.feedback || [])) {
    addFeedback(fb);
  }
  for (const ms of (data.milestones || [])) {
    recordMilestone(ms.spotsFilled, ms.milestone, ms.dateReached);
  }
}
