/**
 * Component 38: Referral Programme Engine
 *
 * Generates referral materials for the founding cohort programme:
 * personalised invite emails, landing page snippets, tracking codes,
 * referrer dashboard snippets, and 3-email drip sequences.
 *
 * Founding cohort: 10 spots, GBP 99/month (single founding rate for all).
 * British English throughout.
 *
 * VitalMatrix Content Studio — Web Package
 */

import { VM_BRAND } from './brand-config';

// --- Types ---

/** Configuration for a referring practitioner. */
export interface ReferralConfig {
  /** The referring practitioner's full name. */
  referrerName: string;
  /** The referring practitioner's speciality area. */
  referrerSpeciality: string;
  /** Unique referral tracking code. */
  referralCode: string;
  /** Reward tier based on cohort membership. */
  rewardTier: 'founding' | 'standard';
}

/** Generated referral materials kit. */
export interface ReferralKit {
  /** Personalised invitation email HTML. */
  inviteEmail: string;
  /** HTML snippet for referral landing page. */
  inviteLandingPageSnippet: string;
  /** Tracking code for attribution. */
  trackingCode: string;
  /** HTML snippet for referrer's own dashboard. */
  referrerDashboardSnippet: string;
}

/** Statistics for a referral code. */
export interface ReferralStats {
  /** The referral code. */
  code: string;
  /** Name of the referring practitioner. */
  referrerName: string;
  /** Total invitations sent. */
  invitesSent: number;
  /** Total sign-ups via this code. */
  conversions: number;
  /** Conversion rate as a percentage. */
  conversionRate: number;
}

// --- In-Memory Tracking ---

const referralTracker: Map<string, { referrerName: string; invitesSent: number; conversions: number }> = new Map();

// --- Helpers ---

/**
 * Maps a speciality to a personalised hook message explaining
 * why VitalMatrix suits that practitioner's practice area.
 */
function specialityHook(speciality: string): string {
  const lower = speciality.toLowerCase();

  if (lower.includes('nutritional') || lower.includes('nutrition')) {
    return 'VitalMatrix maps nutritional interventions across 7 clinical nodes, showing exactly how dietary changes ripple through the terrain. No more guessing which nutrient matters most.';
  }
  if (lower.includes('naturopath')) {
    return 'VitalMatrix bridges naturopathic clinical reasoning with structured terrain intelligence. Every botanical and nutrient intervention maps to a specific node and zone, making your clinical logic visible and shareable.';
  }
  if (lower.includes('functional medicine') || lower.includes('ifm')) {
    return 'Built on the functional medicine matrix model and extended to 7 nodes and 5 zones, VitalMatrix is the clinical intelligence layer that IFM training deserves. Your training finally has a platform that matches its depth.';
  }
  if (lower.includes('gp') || lower.includes('general pract')) {
    return 'VitalMatrix gives GPs with a functional medicine interest the structured assessment framework that NHS consultations cannot provide. Ten minutes with the INTAKE changes the clinical conversation entirely.';
  }
  if (lower.includes('osteopath') || lower.includes('chiropr')) {
    return 'Node 7 (Structural and Connective Tissue) is often invisible in other platforms. VitalMatrix treats structural terrain as a first-class clinical dimension, connecting it to inflammation, immune, and hormonal zones.';
  }
  return 'VitalMatrix provides the structured clinical intelligence framework that modern functional medicine practice demands. Seven nodes, five zones, and a pipeline that turns patient data into actionable terrain insights.';
}

// --- Core Functions ---

/**
 * Generates a unique referral code from a practitioner's name.
 *
 * Format: VM-{INITIALS}-{4-digit hash}-{tier suffix}
 *
 * @param practitionerName - Full name of the referring practitioner.
 * @param tier - Reward tier. Defaults to 'founding'.
 * @returns A unique referral code string.
 */
export function generateReferralCode(practitionerName: string, tier: 'founding' | 'standard' = 'founding'): string {
  const parts = practitionerName.trim().split(/\s+/);
  const initials = parts.map(p => p[0]?.toUpperCase() ?? '').join('');
  const hash = Array.from(practitionerName).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const code = `VM-${initials}-${String(hash % 10000).padStart(4, '0')}-${tier === 'founding' ? 'FC' : 'ST'}`;

  if (!referralTracker.has(code)) {
    referralTracker.set(code, { referrerName: practitionerName, invitesSent: 0, conversions: 0 });
  }

  return code;
}

/**
 * Generates a personalised invitation email.
 *
 * The email is written from the referrer's perspective, with a
 * speciality-specific hook explaining why VitalMatrix suits the
 * recipient's practice area.
 *
 * @param config - Referral configuration with referrer details.
 * @returns HTML string for the invitation email.
 */
export function generateInviteEmail(config: ReferralConfig): string {
  const firstName = config.referrerName.split(' ')[0];
  const hook = specialityHook(config.referrerSpeciality);
  const discount = config.rewardTier === 'founding' ? `founding cohort rate of GBP ${VM_BRAND.pricing.foundingMonthly}/month` : `GBP ${VM_BRAND.pricing.foundingMonthly}/month`;

  const tracker = referralTracker.get(config.referralCode);
  if (tracker) {
    tracker.invitesSent++;
  }

  return `
<div style="font-family: ${VM_BRAND.fonts.body}; background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; padding: 2rem; border-radius: 8px; max-width: 600px;">
  <div style="text-align: center; padding-bottom: 1.5rem; border-bottom: 2px solid ${VM_BRAND.colours.gold};">
    <h1 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin: 0;">You Have Been Invited</h1>
    <p style="font-family: ${VM_BRAND.fonts.data}; color: ${VM_BRAND.colours.teal};">Personal invitation from ${config.referrerName}</p>
  </div>

  <div style="padding: 1.5rem 0;">
    <p>Dear Colleague,</p>
    <p>${firstName} has invited you to join VitalMatrix, the ${VM_BRAND.platform.descriptor} built for functional medicine practitioners.</p>

    <div style="background: ${VM_BRAND.colours.deepTeal}; padding: 1.25rem; border-radius: 6px; margin: 1rem 0;">
      <p style="margin: 0; font-style: italic;">"${hook}"</p>
      <p style="margin: 0.5rem 0 0 0; font-family: ${VM_BRAND.fonts.data}; font-size: 0.85rem; color: ${VM_BRAND.colours.gold};">-- ${config.referrerName}, ${config.referrerSpeciality}</p>
    </div>

    <p>As a referred practitioner, you are eligible for the ${discount}. This rate is fixed for ${VM_BRAND.pricing.foundingFixedMonths} months.</p>

    <div style="text-align: center; margin: 1.5rem 0;">
      <a href="https://${VM_BRAND.platform.domain}/join?ref=${config.referralCode}" style="display: inline-block; background: ${VM_BRAND.colours.gold}; color: ${VM_BRAND.colours.prussianBlue}; padding: 0.75rem 2rem; border-radius: 6px; text-decoration: none; font-family: ${VM_BRAND.fonts.heading}; font-size: 1.1rem;">
        Join VitalMatrix
      </a>
    </div>

    <p style="font-family: ${VM_BRAND.fonts.data}; font-size: 0.8rem; color: ${VM_BRAND.colours.teal};">Referral code: ${config.referralCode}</p>
  </div>

  <footer style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.7rem; font-family: ${VM_BRAND.fonts.data};">
    <p>${VM_BRAND.regulatoryFooter}</p>
    <p>${VM_BRAND.tmFooter}</p>
  </footer>
</div>`.trim();
}

/**
 * Generates an HTML landing page snippet for referral sign-up.
 *
 * Includes referrer testimonial placeholder, pricing with referral
 * discount, and sign-up call to action.
 *
 * @param config - Referral configuration.
 * @returns HTML snippet string.
 */
export function generateReferralLandingSnippet(config: ReferralConfig): string {
  const pricing = config.rewardTier === 'founding'
    ? { price: `GBP ${VM_BRAND.pricing.foundingMonthly}`, label: 'Founding Cohort Rate', note: `Fixed for ${VM_BRAND.pricing.foundingFixedMonths} months. Limited to 10 practitioners.` }
    : { price: `GBP ${VM_BRAND.pricing.foundingMonthly}`, label: 'Founding Cohort Rate', note: 'Full access to all 7 nodes, 5 zones, and the complete assessment pipeline.' };

  return `
<section class="vm-referral-landing" style="font-family: ${VM_BRAND.fonts.body}; background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; padding: 3rem; border-radius: 8px;">
  <div style="text-align: center; margin-bottom: 2rem;">
    <h2 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; font-size: 2rem;">
      ${config.referrerName} Thinks You Should Join VitalMatrix
    </h2>
    <p style="font-size: 1.1rem;">The ${VM_BRAND.platform.descriptor} built for practitioners who think in systems.</p>
  </div>

  <div style="background: ${VM_BRAND.colours.charcoal}; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
    <h3 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold};">What ${config.referrerName.split(' ')[0]} Says</h3>
    <blockquote style="border-left: 4px solid ${VM_BRAND.colours.gold}; padding-left: 1rem; font-style: italic;">
      <!-- Testimonial placeholder: replace with ${config.referrerName}'s actual quote -->
      "VitalMatrix has transformed how I approach clinical assessment. The terrain mapping gives me insights I could not get from any other platform."
    </blockquote>
    <p style="font-family: ${VM_BRAND.fonts.data}; color: ${VM_BRAND.colours.teal}; font-size: 0.85rem;">
      ${config.referrerName} | ${config.referrerSpeciality}
    </p>
  </div>

  <div style="background: ${VM_BRAND.colours.deepTeal}; padding: 2rem; border-radius: 8px; text-align: center; margin-bottom: 2rem;">
    <p style="font-family: ${VM_BRAND.fonts.data}; color: ${VM_BRAND.colours.teal}; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">${pricing.label}</p>
    <p style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; font-size: 2.5rem; margin: 0.5rem 0;">${pricing.price}<span style="font-size: 1rem;">/month</span></p>
    <p style="font-size: 0.9rem; margin: 0;">${pricing.note}</p>
  </div>

  <div style="text-align: center;">
    <a href="https://${VM_BRAND.platform.domain}/join?ref=${config.referralCode}" style="display: inline-block; background: ${VM_BRAND.colours.gold}; color: ${VM_BRAND.colours.prussianBlue}; padding: 1rem 3rem; border-radius: 6px; text-decoration: none; font-family: ${VM_BRAND.fonts.heading}; font-size: 1.2rem;">
      Claim Your Spot
    </a>
    <p style="font-family: ${VM_BRAND.fonts.data}; font-size: 0.8rem; color: ${VM_BRAND.colours.teal}; margin-top: 0.5rem;">
      Referral code: ${config.referralCode}
    </p>
  </div>

  <footer style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.7rem; font-family: ${VM_BRAND.fonts.data};">
    <p>${VM_BRAND.regulatoryFooter}</p>
  </footer>
</section>`.trim();
}

/**
 * Generates a 3-email drip sequence for referral follow-up.
 *
 * Sequence:
 * 1. Initial invitation (day 0)
 * 2. Reminder with social proof (day 3)
 * 3. Final call with urgency (day 7)
 *
 * @param config - Referral configuration.
 * @returns Array of 3 HTML email strings.
 */
export function generateReferralSequence(config: ReferralConfig): string[] {
  const firstName = config.referrerName.split(' ')[0];
  const joinUrl = `https://${VM_BRAND.platform.domain}/join?ref=${config.referralCode}`;

  const wrapEmail = (subject: string, bodyContent: string, dayLabel: string): string => `
<div style="font-family: ${VM_BRAND.fonts.body}; background: ${VM_BRAND.colours.prussianBlue}; color: ${VM_BRAND.colours.white}; padding: 2rem; border-radius: 8px; max-width: 600px;">
  <div style="padding-bottom: 1rem; border-bottom: 1px solid ${VM_BRAND.colours.teal}; margin-bottom: 1.5rem;">
    <p style="font-family: ${VM_BRAND.fonts.data}; color: ${VM_BRAND.colours.teal}; font-size: 0.75rem; margin: 0;">${dayLabel} | Referral from ${config.referrerName}</p>
    <h2 style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin: 0.5rem 0 0 0;">${subject}</h2>
  </div>
  ${bodyContent}
  <div style="text-align: center; margin: 1.5rem 0;">
    <a href="${joinUrl}" style="display: inline-block; background: ${VM_BRAND.colours.gold}; color: ${VM_BRAND.colours.prussianBlue}; padding: 0.75rem 2rem; border-radius: 6px; text-decoration: none; font-family: ${VM_BRAND.fonts.heading};">Join VitalMatrix</a>
  </div>
  <footer style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid ${VM_BRAND.colours.teal}; font-size: 0.7rem; font-family: ${VM_BRAND.fonts.data};">
    <p>${VM_BRAND.regulatoryFooter}</p>
  </footer>
</div>`.trim();

  // Email 1: Initial invite
  const email1 = wrapEmail(
    `${firstName} Invited You to Join VitalMatrix`,
    `<p>Dear Colleague,</p>
    <p>${config.referrerName} believes VitalMatrix would be valuable for your practice. As a ${config.referrerSpeciality} practitioner, ${firstName} has experienced first-hand how the ${VM_BRAND.platform.descriptor} changes clinical assessment.</p>
    <p>${specialityHook(config.referrerSpeciality)}</p>
    <p>The founding cohort is limited to 10 practitioners. Your referral code <strong>${config.referralCode}</strong> secures your priority access.</p>`,
    'Email 1 of 3 -- Day 0'
  );

  // Email 2: Reminder with social proof
  const email2 = wrapEmail(
    'Still Thinking About VitalMatrix?',
    `<p>Dear Colleague,</p>
    <p>A few days ago, ${firstName} invited you to join VitalMatrix. We wanted to share what practitioners are saying:</p>
    <div style="background: ${VM_BRAND.colours.charcoal}; padding: 1rem; border-radius: 6px; margin: 1rem 0; border-left: 4px solid ${VM_BRAND.colours.gold};">
      <p style="font-style: italic; margin: 0;">"The terrain mapping changed how I communicate findings to patients. I can now show them exactly where their imbalances sit across 7 clinical nodes."</p>
      <p style="font-family: ${VM_BRAND.fonts.data}; font-size: 0.8rem; color: ${VM_BRAND.colours.teal}; margin: 0.5rem 0 0 0;">-- Founding cohort practitioner</p>
    </div>
    <p>Your referral code <strong>${config.referralCode}</strong> is still active. The founding rate will not last indefinitely.</p>`,
    'Email 2 of 3 -- Day 3'
  );

  // Email 3: Final call
  const email3 = wrapEmail(
    'Final Invitation: Your VitalMatrix Referral Expires Soon',
    `<p>Dear Colleague,</p>
    <p>This is the final reminder about your VitalMatrix invitation from ${config.referrerName}.</p>
    <p>The founding cohort is approaching capacity. Once all 10 spots are filled, the GBP ${VM_BRAND.pricing.foundingMonthly}/month founding rate closes permanently. Standard pricing will be GBP ${VM_BRAND.pricing.standardRate}/month.</p>
    <div style="background: ${VM_BRAND.colours.deepTeal}; padding: 1.25rem; border-radius: 6px; margin: 1rem 0;">
      <p style="font-family: ${VM_BRAND.fonts.heading}; color: ${VM_BRAND.colours.gold}; margin: 0;">What you get:</p>
      <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
        <li>Full access to 7 nodes, 5 zones, 6 stacks</li>
        <li>INTAKE, DeltaScan, and the complete assessment pipeline</li>
        <li>Lifetime founding rate -- never increases</li>
        <li>Direct input into platform development</li>
      </ul>
    </div>
    <p>If you have questions, reply directly to this email. ${VM_BRAND.credentials.name} responds personally to every founding cohort enquiry.</p>`,
    'Email 3 of 3 -- Day 7 (Final)'
  );

  return [email1, email2, email3];
}

/**
 * Returns referral statistics for an array of referral codes.
 *
 * Aggregates invites sent and conversions per code, calculating
 * conversion rate as a percentage.
 *
 * @param codes - Array of referral codes to report on.
 * @returns Array of ReferralStats objects.
 */
export function getReferralStats(codes: string[]): ReferralStats[] {
  return codes.map(code => {
    const data = referralTracker.get(code);
    if (!data) {
      return {
        code,
        referrerName: 'Unknown',
        invitesSent: 0,
        conversions: 0,
        conversionRate: 0,
      };
    }
    return {
      code,
      referrerName: data.referrerName,
      invitesSent: data.invitesSent,
      conversions: data.conversions,
      conversionRate: data.invitesSent > 0 ? Math.round((data.conversions / data.invitesSent) * 100) : 0,
    };
  });
}

/**
 * Records a conversion (sign-up) against a referral code.
 * Used when a referred practitioner completes registration.
 *
 * @param code - The referral code that generated the conversion.
 * @returns Updated conversion count, or -1 if code not found.
 */
export function recordReferralConversion(code: string): number {
  const data = referralTracker.get(code);
  if (!data) return -1;
  data.conversions++;
  return data.conversions;
}

/**
 * Clears the referral tracker. Intended for testing only.
 */
export function clearReferralTracker(): void {
  referralTracker.clear();
}
