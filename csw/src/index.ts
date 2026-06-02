/**
 * VitalMatrix Content Studio — Web Package
 * For Replit / website / content production (W02, W09)
 *
 * 47 Components:
 *  C1:  Citation and Evidence Engine      — PubMed search, Vancouver formatting, evidence tiers
 *  C2:  PDF Branding Engine               — Cover pages, TOC, headers/footers, 5 templates
 *  C3:  JSON-LD Schema Markup             — MedicalWebPage structured data
 *  C4:  SEO Metadata for Blog             — Meta titles, descriptions, keyword tracking, SEO score
 *  C5:  Email-to-Blog Content Expansion   — Short note -> full blog post, reverse condensing
 *  C7:  Compliance Scanner                — Kill list, credentials, MHRA/ASA/GDPR checks
 *  C16: Blog Assembly Pipeline            — C5→C4→C7→C3 chained. Input: note. Output: publish-ready.
 *  C17: Practitioner Outreach Kit         — 5-document recruitment pack per practitioner
 *  C18: Evidence Library Builder           — Pre-built citation bank by node/zone
 *  C19: Visual Content Generator          — Zone diagrams, pipeline flows, pricing tables, feature cards
 *  C20: Content Repurposing Engine        — One content → blog + email + LinkedIn + PDF
 *  C21: Landing Page Generator            — Segment-specific HTML landing pages
 *  C22: Clinical Newsletter Builder       — Monthly practitioner digest with PubMed findings
 *  C23: Discovery Call Prep Engine        — Personalised meeting briefings
 *  C24: Content Freshness Auditor         — Staleness, compliance drift, outdated pricing detection
 *  C25: Practitioner Onboarding Sequence  — 6-stage drip content for new subscribers
 *  C26: Content Command Centre            — Dashboard: drafts, published, stale, compliance/SEO scores
 *  C27: Practitioner CRM                  — Lead tracking, touchpoints, pipeline, overdue follow-ups
 *  C28: A/B Copy Variants                 — 3 headline/CTA/subject variants with psychological hooks
 *  C29: Content Calendar                  — 90-day auto-scheduler with Z1-Z5 zone rotation
 *  C30: Practitioner Persona Engine       — 8-segment persona profiles with personalised messaging
 *  C31: ROI Calculator                    — Interactive time/cost savings widget for practitioners
 *  C32: Competitive Positioning           — K10-compliant differentiation content, no competitor names
 *  C33: Webinar Content Pack              — Full event pack: slides, notes, handout, follow-up emails
 *  C34: Social Proof Aggregator           — Testimonials, cohort milestones, branded HTML blocks
 *  C35: Content Performance Scorer        — 5-dimension scoring, grading, markdown reports
 *  C36: INTAKE-to-Content Bridge         — Converts INTAKE questions into educational blog posts
 *  C37: Practitioner Success Tracker     — Milestones, celebrations, retention nudges, usage summaries
 *  C38: Referral Programme Engine        — Invite emails, landing snippets, drip sequences, tracking
 *  C39: Pricing Objection Handler        — 10 pre-built objections, segment-aware responses, playbook
 *  C40: A/B Test Tracker                 — Test results, winning patterns, hook recommendations
 *  C41: Multi-Language Adapter           — Locale configs, currency/date/regulatory adaptation, translation briefs
 *  C42: Video Script Generator           — Timed scripts, visual cues, teleprompter text, shot lists
 *  C43: Event Calendar Publisher         — ICS generation, VM-styled calendar page, reminder emails
 *  C44: Practitioner FAQ Knowledge Base  — 30 pre-built FAQs, search, categories, JSON-LD schema
 *  C45: Content Metrics Dashboard        — Executive dashboard, weekly email, prioritised action items
 *  Brand Config                           — Shared colours, fonts, credentials, TM footer
 */

export { VM_BRAND, type EvidenceTier } from './brand-config';

export { type Citation, type PubMedSearchResult, type CitationSummary, searchPubMed, fetchPubMedDetails, formatVancouver, insertInlineCitation, generateSummary, CITATION_TABLE_SQL } from './c1-citation-engine';
export { type DocumentTier, type CoverPageConfig, type PdfTemplate, PDF_BRAND, PDF_TEMPLATES, generateCoverPageHtml, generateTocFromHeadings } from './c2-pdf-branding-engine';
export { type JsonLdPageConfig, generateJsonLd } from './c3-jsonld-schema';
export { type SeoMetadata, type SeoAnalysis, generateSlug, getSlugPreview, analyseMetaTitle, analyseMetaDescription, calculateReadingTime, countWords, calculateReadability, calculateKeywordDensity, isKeywordInFirst100Words, calculateSeoScore } from './c4-seo-metadata';
export { type ExpansionConfig, type ExpandedContent, type CondensedEmail, type BlogTemplate, BLOG_TEMPLATES, validateExpandedContent, condenseToPractitionerEmail } from './c5-content-expansion';
export { type Violation, type ScanResult, type SeverityLevel, type ViolationCategory, scanContent, generateScanReport, scanFiles } from './c7-compliance-scanner';
export { type BlogInput, type AssembledBlog, assembleBlog, assembleBlogBatch, generatePublishReport } from './c16-blog-assembly-pipeline';
export { type OutreachConfig, type OutreachKit, generateOutreachKit } from './c17-outreach-kit';
export { type EvidenceEntry, type EvidenceLibrary, NODE_SEARCH_TERMS, ZONE_SEARCH_TERMS, buildEmptyLibrary, addEntry, findByNode, findByZone, findByTier, findByTopic, formatForInsertion, formatReferenceList, generateCoverageReport } from './c18-evidence-library';
export { generateZoneDiagram, generatePipelineFlow, generateFeatureCard, generatePricingTable, generateTestimonialCard } from './c19-visual-content';
export { type RepurposeInput, type RepurposedContent, repurposeContent, repurposeBatch } from './c20-content-repurposer';
export { type PractitionerSegment, type LandingPageConfig, SEGMENT_DEFAULTS, generateLandingPage } from './c21-landing-page';
export { type NewsletterItem, type NewsletterConfig, generateNewsletter, generateNewsletterHtml } from './c22-newsletter-builder';
export { type PractitionerProfile, type CallPrep, generateCallPrep } from './c23-discovery-call-prep';
export { type ContentAuditResult, type AuditFinding, auditContent, generateAuditReport } from './c24-content-auditor';
export { type SequenceStage, type OnboardingEmail, type OnboardingConfig, generateOnboardingSequence, calculateSendDates } from './c25-onboarding-sequence';
export { type ContentItem, type ContentStatus, type ContentType, type DashboardSummary, addContent, updateStatus as updateContentStatus, updateScores, getByStatus as getContentByStatus, getByType, getDashboardSummary, generateDashboardReport, clearStore as clearContentStore, getAllContent } from './c26-content-command-centre';
export { type PractitionerLead, type PractitionerTier as CrmPractitionerTier, type LeadStatus, type Touchpoint, type TouchpointType, type PipelineSummary, addLead, updateStatus as updateLeadStatus, addTouchpoint, getByStatus as getLeadsByStatus, getByTier, getOverdueFollowUps, getPipelineSummary, generateCrmReport, clearStore as clearLeadStore, getAllLeads } from './c27-practitioner-crm';
export { type CopyVariant, type HookType, type ComplianceViolation, type VariantResult, generateHeadlineVariants, generateCtaVariants, generateSubjectLineVariants, generateBodyOpeningVariants, runComplianceCheck } from './c28-ab-copy-variants';
export { type CalendarEntry, type CalendarContentType, type CalendarStatus, type ContentZone, generate90DayCalendar, getThisWeek, getOverdue, getUpcoming, updateEntryStatus, exportAsMarkdown, getCalendarSummary } from './c29-content-calendar';
export { type PractitionerPersona, type PersonaSegment, type MessageType, getPersona, getPersonaForSpeciality, getAllSegments, generatePersonalisedMessage, generatePersonaSummary } from './c30-practitioner-persona';
export { type RoiInput, type RoiResult, calculateRoi, generateRoiWidgetHtml } from './c31-roi-calculator';
export { type DifferentiatorCategory, type Differentiator, getDifferentiators, getDifferentiatorsByCategory, generateComparisonContent, generateFaqDifferentiators } from './c32-competitive-positioning';
export { type WebinarConfig, type SlideOutline, type WebinarPack, generateWebinarPack, generateSlidesOutline, generateSpeakerNotes, generateHandout, generateFollowUpSequence } from './c33-webinar-content-pack';
export { type PractitionerFeedback, type CohortMilestone, addFeedback, getApprovedTestimonials, generateTestimonialHtml, generateMilestoneAnnouncement, generateSocialProofSection, getCohortProgress, recordMilestone } from './c34-social-proof';
export { type PerformanceScore, type ContentGrade, scoreContent, gradeContent, generatePerformanceReport, getContentNeedingImprovement } from './c35-content-performance';
export { type IntakeQuestion, type ContentPiece, generateContentFromQuestion, generateContentSeries, generateSeriesIndexPage, getPreBuiltQuestions } from './c36-intake-to-content-bridge';
export { type MilestoneType, type PractitionerMilestone, type SuccessContent, recordMilestone as recordSuccessMilestone, getMilestones, generateCelebrationEmail, generateRetentionNudge, generateUsageSummary, getCohortProgressSummary, clearMilestoneStore, getAllMilestones } from './c37-practitioner-success-tracker';
export { type ReferralConfig, type ReferralKit, type ReferralStats, generateReferralCode, generateInviteEmail, generateReferralLandingSnippet, generateReferralSequence, getReferralStats, recordReferralConversion, clearReferralTracker } from './c38-referral-programme-engine';
export { type ObjectionCategory, type Objection, type ObjectionResponse, getResponse, getAllResponses, generateObjectionFaq, generateSalesPlaybook } from './c39-pricing-objection-handler';
export { type TestContentType, type TestMetric, type VariantId, type AbTest, type WinningPattern, createTest, recordResult, getTestsByContent, getWinningPatterns, generateLearningsReport, suggestBestHook, clearTestStore, getAllTests } from './c40-ab-test-tracker';
export { type Locale, type LocaleConfig, type TranslationPlaceholder, type ContentAdaptation, getLocaleConfig, adaptContent, generateTranslationBrief } from './c41-multi-language-adapter';
export { type VideoType, type ScriptSegment, type VideoScript, generateScript, generateTeleprompterText, generateShotList } from './c42-video-script-generator';
export { type EventType, type CalendarEvent, type EventCalendar, addEvent, getUpcoming as getUpcomingEvents, getPast as getPastEvents, generateIcsFile, generateIcsCalendar, generateCalendarHtml, generateEventReminderEmail } from './c43-event-calendar-publisher';
export { type FaqCategory, type FaqEntry, type FaqKnowledgeBase, searchFaq, getByCategory as getFaqByCategory, getMostViewed, addEntry as addFaqEntry, generateFaqPageHtml, generateFaqSchema } from './c44-practitioner-faq-kb';
export { type ContentItemInput, type LeadInput, type CalendarEntryInput, type CohortProgressInput, type PerformanceScoreInput, type ContentMetrics, type CrmMetrics, type CalendarMetrics, type CohortMetrics, type TopContent, type ExecutiveDashboard, buildDashboard, generateDashboardHtml, generateDashboardEmail, generateActionItems } from './c45-content-metrics-dashboard';

// --- Tier 5: Social Media, Marketing & Advertising ---
export { type SocialPlatform, type SocialPost, createPost, adaptContentForPlatform, generateCrossPost, validatePost, getPostsByPlatform, getPostsByCampaign, getScheduledPosts, updateEngagement, generatePostCalendar } from './c46-social-media-manager';
export { type AdPlatform, type AdCampaign, type Ad, type AudienceSegment, createCampaign, addAd, generateAdCopy, generateGoogleSearchAds, generateMetaAds, generateLinkedInAds, validateAdCompliance, estimateBudget, generateCampaignReport } from './c47-ad-campaign-manager';
export { type EmailSequence, type SequenceEmail, type MarketingFunnel, type FunnelStage, getSequence, customiseSequence, generateFunnelReport, generateEmailPreview } from './c48-marketing-automation';
export { type ContentSeed, type SocialContentPack, generateFromInsight, generateWeeklyContentPlan, generateHashtags, generateCarouselSlides, generateThreadFromBlog, generateLinkedInArticle } from './c49-social-content-factory';
export { type AnalyticsEvent, type ContentMetrics as AnalyticsContentMetrics, type CampaignMetrics as AnalyticsCampaignMetrics, type DashboardMetrics as AnalyticsDashboardMetrics, trackEvent, getContentMetrics, getCampaignMetrics, getDashboardMetrics, generateAnalyticsReport, generateWeeklyDigest, calculateRoas, identifyUnderperformers } from './c50-analytics-tracker';
export { type FacebookPostType, type FacebookPost, type FacebookPage, createFacebookPost, generateWeeklyFacebookPlan, generateFacebookEvent, generatePoll as generateFacebookPoll, generateLinkPost, generatePageInsightsReport } from './c51-facebook-page-manager';
export { type InstagramContentType, type InstagramPost, type CarouselSlide, type ReelScript, createFeedPost, generateCarousel, generateReelScript, generateStorySequence, generateHashtagSet, generateInstagramBio } from './c52-instagram-content-manager';
export { type TweetType, type Tweet, type Thread, createTweet, generateThread, generateDailyTweet, generateQuoteTweet, generateBioAndPinnedTweet } from './c53-x-twitter-manager';
export { type LinkedInContentType, type LinkedInPost, type LinkedInArticle, createLinkedInPost, generateLinkedInWeeklyPlan, generateDocumentPost, generateLinkedInPoll, generateCompanyPageContent, generateThoughtLeadership } from './c54-linkedin-content-manager';
export { type MarketingChannel, type ChannelMetrics, type MarketingDashboard, addChannelMetrics, buildMarketingDashboard, generateMarketingDashboardHtml, generateWeeklyMarketingEmail, compareChannels, identifyBestPerforming, generateBudgetRecommendation } from './c55-marketing-dashboard';

// --- Tier 6: Social Media Master Hub ---
export { type MemeTemplate, type MemeContent, generateMeme, generateStatMeme, generateComparisonMeme, generateZoneSpotlight, generateMythBuster, generatePainPointMeme, generateQuoteCard, generateMemeBatch } from './c56-meme-visual-generator';
export { type Hook, type HookLibrary, getHooksByType, getHooksForPlatform, getHooksForSegment, generateCustomHook, scoreHook, getTopPerformingHooks, generateHookVariants, generateAdHookSequence } from './c57-hook-library';
export { type ContentSource, type AdContent, type AdContentPipeline, generateAdFromInsight, generateAdFromPainPoint, generateAdFromFeature, generateAdFromPricing, generateAdSet, generateAdFunnel, validateAdContent, generateAdBrief } from './c58-ad-content-pipeline';
export { type Quiz, type QuizQuestion, type QuizResult, type QuizSubmission, getQuiz, calculateResult, submitQuiz, generateQuizHtml, generateQuizShareCard, getSubmissions, generateQuizReport } from './c59-quiz-engine';
export { type LeadMagnetType, type LeadMagnet, type LeadCapture, getLeadMagnet, generateLeadMagnetContent, generateLandingPage as generateLeadMagnetLandingPage, generateThankYouPage, captureEmail, getCapturesByMagnet, generateLeadMagnetReport } from './c60-lead-magnet-factory';
export { type NurtureSequence, type NurtureEmail, type NurtureContact, getSequence as getNurtureSequence, personaliseEmail, advanceContact, generateNurtureReport, generateContactTimeline } from './c61-nurture-sequence-engine';
export { type AdCreative, type CreativePerformance, type CreativeTest, createCreative, createABTest, updatePerformance, determineWinner, generateCreativeReport, generateCreativeBrief, archiveUnderperformers } from './c62-ad-creative-manager';
export { type ScheduledPost, type PostingSchedule, schedulePost, autoSchedule, generateWeeklySchedule, getQueuedPosts, reschedulePost, cancelPost, markAsPosted, generateScheduleCalendar, getOptimalTime, analysePostingPatterns, suggestScheduleOptimisation } from './c63-posting-scheduler';
export { type FunnelEvent, type FunnelStage, type FunnelMetrics, type FunnelReport, trackEvent as trackFunnelEvent, getContactJourney, getFunnelMetrics, getDropOffPoints, getConversionRate, getAverageTimeToConvert, generateFunnelReport, generateFunnelVisualisationHtml, identifyBottlenecks, suggestImprovements } from './c64-conversion-funnel-tracker';
export { type CommandHubStatus, type HubDashboard, buildHubDashboard, generateHubDashboardHtml, generateDailyBrief, generateWeeklyReport as generateHubWeeklyReport, generateMonthlyReview, getComponentHealth, getTopActions, quickStats } from './c65-social-media-command-hub';
export { type TargetGeography, type TargetProfession, type FacebookGroup, type AudienceSegment, type PlatformTargeting, TARGET_GEOGRAPHY, TARGET_PROFESSIONS, FACEBOOK_GROUPS, getTargetGeography, getTargetProfessions, getFacebookGroups, getAudienceSegments, getPlatformTargeting, isInTargetGeography, isExcludedGeography, generateTargetingBrief, generateFacebookGroupStrategy, generateAdTargetingExport, estimateTotalReach, validateTargeting } from './c66-audience-targeting';
export { type GroupEngagementAction, type EngagementPlaybook, generateWeeklyPlaybook, generateComment, generateInsightPost, generateDmTemplate, generateGroupReport, getDoNots as getGroupDoNots } from './c67-facebook-group-playbook';
export { type ScreenshotType, type SocialProofCard, generateScreenshotCard, generateBeforeAfterCard, generateFeatureShowcase, generatePlatformPreview, generateSocialProofBatch } from './c68-social-proof-screenshot';
export { type RetargetingTrigger, type RetargetingAd, type RetargetingSequence, generateRetargetingAd, generateRetargetingSequence, generateDynamicAd, getRetargetingByUrgency, generateRetargetingReport } from './c69-retargeting-content-engine';
export { type MarketGap, type CompetitorPattern, addGap, getGapsByCategory, generateGapAnalysis, generatePositioningFromGaps, generateGroupListeningGuide, monitorTrends, generateCompetitiveAdvantageReport } from './c70-competitor-intelligence';
export { type UgcItem, type AmplifiedContent, captureUgc, approveUgc, obtainConsent, amplifyUgc, generateUgcRoundup, generateUgcRequestTemplate, generateUgcGuidelines, generateUgcReport } from './c71-ugc-amplifier';
export { type Season, type SeasonalTopic, type SeasonalPlan, getSeasonalTopics, generateSeasonalPlan, generateSeasonalContentCalendar, getCurrentSeasonTopics, generateSeasonalPost, generateSeasonalEmailCampaign } from './c72-seasonal-content-calendar';
export { type Influencer, type CollaborationType, type OutreachTemplate, addInfluencer, generateOutreachEmail, generateFollowUpEmail as generateInfluencerFollowUp, generateCollaborationBrief, generateInfluencerReport, generateGiftingStrategy } from './c73-influencer-outreach';
export { type HashtagSet, type HashtagStrategy, getHashtagSet, generateOptimalSet, rotateWeekly, analyseHashtagPerformance, generateHashtagReport, suggestNewHashtags } from './c74-hashtag-strategy-engine';
export { type SourceContent, type RepurposedAsset, type RepurposingMatrix, generateFullMatrix, generateAsset, generatePublishingSchedule, getAssetsByPlatform, generateMatrixReport, calculateContentMultiplier } from './c75-content-repurposing-matrix';
export { type ResponseCategory, type ResponseTemplate, getResponse as getEngagementResponse, personaliseResponse, generateResponseForComment, getBatchResponses, generateResponsePlaybook, getDoNots as getResponseDoNots, trackResponseMetrics } from './c76-engagement-response-templates';
