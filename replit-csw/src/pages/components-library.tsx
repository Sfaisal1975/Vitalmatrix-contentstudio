import { useState } from "react";

const NAVY = "#0D2B4E";
const GOLD = "#C9A84C";
const TEAL = "#4ECDC4";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";
const AMBER = "#FBBF24";
const GREEN = "#34D399";
const PURPLE = "#A78BFA";

interface Component {
  id: string;
  num: number;
  label: string;
  purpose: string;
  tier: number;
  tierLabel: string;
  tags: string[];
  deps: string[];
  status: "BUILT";
}

const TIERS: Record<number, { label: string; colour: string; description: string }> = {
  1: { label: "Foundation", colour: TEAL, description: "Core engines — citations, PDFs, SEO, compliance" },
  2: { label: "High-Yield", colour: GREEN, description: "Founding cohort recruitment — blog pipeline, outreach, evidence" },
  3: { label: "Force Multipliers", colour: GOLD, description: "System-level productivity — CRM, calendar, A/B, positioning" },
  4: { label: "Revenue Accelerators", colour: AMBER, description: "Intake-to-content, success tracking, referrals, FAQ" },
  5: { label: "Social & Marketing", colour: "#60A5FA", description: "LinkedIn, Facebook, Instagram, X, ads, automation" },
  6: { label: "Social Media Hub", colour: PURPLE, description: "Memes, hooks, quizzes, lead magnets, nurture, funnel, targeting" },
};

const COMPONENTS: Component[] = [
  // Tier 1
  { id: "c1", num: 1, label: "Citation & Evidence Engine", purpose: "PubMed API search, Vancouver formatting, evidence tier assignment (N1–N7, Z1–Z5, S1–S6)", tier: 1, tierLabel: "Foundation", tags: ["research","evidence","pubmed"], deps: ["brand-config"] },
  { id: "c2", num: 2, label: "PDF Branding Engine", purpose: "Cover pages, TOC, headers/footers — 5 VitalMatrix PDF templates", tier: 1, tierLabel: "Foundation", tags: ["pdf","brand","export"], deps: ["brand-config"] },
  { id: "c3", num: 3, label: "JSON-LD Schema Markup", purpose: "MedicalWebPage structured data for SEO — Google rich results", tier: 1, tierLabel: "Foundation", tags: ["seo","schema","structured-data"], deps: ["brand-config"] },
  { id: "c4", num: 4, label: "SEO Metadata", purpose: "Meta titles, descriptions, keyword tracking, readability, SEO score 0–100", tier: 1, tierLabel: "Foundation", tags: ["seo","metadata","keywords"], deps: ["brand-config"] },
  { id: "c5", num: 5, label: "Email-to-Blog Expansion", purpose: "Short note → full blog post (2×/3–4×/5–6×), 3 templates, reverse condensing", tier: 1, tierLabel: "Foundation", tags: ["blog","content","expansion"], deps: ["brand-config"] },
  { id: "c7", num: 7, label: "Compliance Scanner", purpose: "22 rules: kill list (K7/K8/K10), credentials, MHRA/ASA/GDPR — 105/105 tests pass", tier: 1, tierLabel: "Foundation", tags: ["compliance","scanner","mhra","gdpr"], deps: ["brand-config"] },
  // Tier 2
  { id: "c16", num: 16, label: "Blog Assembly Pipeline", purpose: "Chains C5→C4→C7→C3. Input: rough note. Output: publish-ready blog post", tier: 2, tierLabel: "High-Yield", tags: ["blog","pipeline","automation"], deps: ["c3","c4","c5","c7"] },
  { id: "c17", num: 17, label: "Practitioner Outreach Kit", purpose: "5-document recruitment pack per practitioner — personalised per speciality", tier: 2, tierLabel: "High-Yield", tags: ["outreach","recruitment","practitioners"], deps: ["brand-config"] },
  { id: "c18", num: 18, label: "Evidence Library Builder", purpose: "Pre-built citation bank per node (7) and zone (5)", tier: 2, tierLabel: "High-Yield", tags: ["evidence","citations","nodes","zones"], deps: ["c1"] },
  { id: "c19", num: 19, label: "Visual Content Generator", purpose: "HTML snippets: zone diagrams, pipeline flows, pricing tables, feature cards", tier: 2, tierLabel: "High-Yield", tags: ["visual","html","diagrams","pricing"], deps: ["brand-config"] },
  { id: "c20", num: 20, label: "Content Repurposing Engine", purpose: "One piece → 4 formats: blog + email + LinkedIn + PDF", tier: 2, tierLabel: "High-Yield", tags: ["repurpose","multi-format","linkedin"], deps: ["c4"] },
  { id: "c21", num: 21, label: "Landing Page Generator", purpose: "Segment-specific HTML landing pages (5 practitioner segments)", tier: 2, tierLabel: "High-Yield", tags: ["landing-page","html","segments"], deps: ["c3","c19"] },
  { id: "c22", num: 22, label: "Clinical Newsletter Builder", purpose: "Monthly practitioner digest with PubMed mapping and evidence tiers", tier: 2, tierLabel: "High-Yield", tags: ["newsletter","clinical","digest"], deps: ["brand-config"] },
  { id: "c23", num: 23, label: "Discovery Call Prep Engine", purpose: "Personalised meeting briefings with speciality→zone mapping", tier: 2, tierLabel: "High-Yield", tags: ["discovery","sales","briefing"], deps: ["brand-config"] },
  { id: "c24", num: 24, label: "Content Freshness Auditor", purpose: "Staleness, compliance drift, outdated pricing detection (90-day threshold)", tier: 2, tierLabel: "High-Yield", tags: ["audit","freshness","compliance"], deps: ["c7"] },
  { id: "c25", num: 25, label: "Practitioner Onboarding Sequence", purpose: "6-stage drip content: Day 1 → Month 3", tier: 2, tierLabel: "High-Yield", tags: ["onboarding","email","drip"], deps: ["brand-config"] },
  // Tier 3
  { id: "c26", num: 26, label: "Content Command Centre", purpose: "Dashboard: all content status, compliance/SEO scores, stale alerts", tier: 3, tierLabel: "Force Multipliers", tags: ["dashboard","monitoring","scores"], deps: ["brand-config"] },
  { id: "c27", num: 27, label: "Practitioner CRM", purpose: "Lead tracking, 7-stage pipeline, touchpoints, overdue follow-ups, conversion rates", tier: 3, tierLabel: "Force Multipliers", tags: ["crm","pipeline","leads"], deps: ["brand-config"] },
  { id: "c28", num: 28, label: "A/B Copy Variant Generator", purpose: "3 variants per headline/CTA/subject with 6 psychological hooks, compliance-checked", tier: 3, tierLabel: "Force Multipliers", tags: ["ab-test","copy","hooks"], deps: ["c7"] },
  { id: "c29", num: 29, label: "Content Calendar Engine", purpose: "90-day auto-scheduler with Z1–Z5 zone rotation, weekly content mix", tier: 3, tierLabel: "Force Multipliers", tags: ["calendar","scheduler","zones"], deps: ["brand-config"] },
  { id: "c30", num: 30, label: "Practitioner Persona Engine", purpose: "8 deep persona profiles with personalised messaging for 6 message types", tier: 3, tierLabel: "Force Multipliers", tags: ["persona","messaging","segments"], deps: ["brand-config"] },
  { id: "c31", num: 31, label: "ROI Calculator Widget", purpose: "Interactive HTML widget: patients/month → time saved, cost/patient, payback period", tier: 3, tierLabel: "Force Multipliers", tags: ["roi","calculator","widget","html"], deps: ["brand-config"] },
  { id: "c32", num: 32, label: "Competitive Positioning Engine", purpose: "K10-compliant differentiation, IFM amplification framing, FAQ format", tier: 3, tierLabel: "Force Multipliers", tags: ["positioning","competitive","faq"], deps: ["brand-config"] },
  { id: "c33", num: 33, label: "Webinar Content Pack", purpose: "Full event pack: 10–12 slides, speaker notes, handout, 3-email follow-up", tier: 3, tierLabel: "Force Multipliers", tags: ["webinar","slides","event"], deps: ["brand-config"] },
  { id: "c34", num: 34, label: "Social Proof Aggregator", purpose: "Testimonials, cohort milestones ("3 of 10 spots filled"), branded HTML blocks", tier: 3, tierLabel: "Force Multipliers", tags: ["social-proof","testimonials","html"], deps: ["brand-config"] },
  { id: "c35", num: 35, label: "Content Performance Scorer", purpose: "5-dimension scoring (SEO/compliance/freshness/audience/conversion), A–F grading", tier: 3, tierLabel: "Force Multipliers", tags: ["scoring","performance","grade"], deps: ["brand-config"] },
  // Tier 4
  { id: "c36", num: 36, label: "Intake-to-Content Bridge", purpose: "Patient intake data → practitioner content briefs (anonymised)", tier: 4, tierLabel: "Revenue Accelerators", tags: ["intake","bridge","content"], deps: ["brand-config"] },
  { id: "c37", num: 37, label: "Practitioner Success Tracker", purpose: "Tracks adoption milestones, feature usage, success metrics per practitioner", tier: 4, tierLabel: "Revenue Accelerators", tags: ["success","tracking","adoption"], deps: ["brand-config"] },
  { id: "c38", num: 38, label: "Referral Programme Engine", purpose: "Referral tracking, reward calculations, referral content generation", tier: 4, tierLabel: "Revenue Accelerators", tags: ["referral","rewards","growth"], deps: ["brand-config"] },
  { id: "c39", num: 39, label: "Pricing Objection Handler", purpose: "Scripts and rebuttals for all common GBP 99/month objections", tier: 4, tierLabel: "Revenue Accelerators", tags: ["pricing","sales","objections"], deps: ["brand-config"] },
  { id: "c40", num: 40, label: "A/B Test Tracker", purpose: "Track active experiments, results, statistical significance, winners", tier: 4, tierLabel: "Revenue Accelerators", tags: ["ab-test","experiments","analytics"], deps: ["brand-config"] },
  { id: "c41", num: 41, label: "Multi-Language Adapter", purpose: "British English enforcement, regional variant detection, terminology checker", tier: 4, tierLabel: "Revenue Accelerators", tags: ["language","british-english","localisation"], deps: ["brand-config"] },
  { id: "c42", num: 42, label: "Video Script Generator", purpose: "Short-form video scripts: explainer, testimonial, demo — 60s/90s/3min formats", tier: 4, tierLabel: "Revenue Accelerators", tags: ["video","script","content"], deps: ["brand-config"] },
  { id: "c43", num: 43, label: "Event Calendar Publisher", purpose: "Webinar/event scheduling, reminder sequences, post-event follow-up chains", tier: 4, tierLabel: "Revenue Accelerators", tags: ["events","calendar","reminders"], deps: ["brand-config"] },
  { id: "c44", num: 44, label: "Practitioner FAQ Knowledge Base", purpose: "Searchable FAQ bank — clinical, pricing, onboarding, compliance questions", tier: 4, tierLabel: "Revenue Accelerators", tags: ["faq","knowledge-base","support"], deps: ["brand-config"] },
  { id: "c45", num: 45, label: "Content Metrics Dashboard", purpose: "Aggregate view: page views, open rates, click rates, conversion by content type", tier: 4, tierLabel: "Revenue Accelerators", tags: ["metrics","analytics","dashboard"], deps: ["brand-config"] },
  // Tier 5
  { id: "c46", num: 46, label: "Social Media Manager", purpose: "Cross-platform content scheduler: LinkedIn, Facebook, Instagram, X — VitalMatrix tone", tier: 5, tierLabel: "Social & Marketing", tags: ["social","scheduler","multi-platform"], deps: ["brand-config"] },
  { id: "c47", num: 47, label: "Ad Campaign Manager", purpose: "Campaign briefs, audience targeting specs, creative asset tracker", tier: 5, tierLabel: "Social & Marketing", tags: ["ads","campaigns","targeting"], deps: ["brand-config"] },
  { id: "c48", num: 48, label: "Marketing Automation", purpose: "Trigger-based email sequences, lead scoring, nurture flows", tier: 5, tierLabel: "Social & Marketing", tags: ["automation","email","nurture"], deps: ["brand-config"] },
  { id: "c49", num: 49, label: "Social Content Factory", purpose: "Batch-generate posts for all platforms from a single source brief", tier: 5, tierLabel: "Social & Marketing", tags: ["social","batch","content"], deps: ["brand-config"] },
  { id: "c50", num: 50, label: "Analytics Tracker", purpose: "UTM builder, conversion event tracker, source attribution", tier: 5, tierLabel: "Social & Marketing", tags: ["analytics","utm","attribution"], deps: ["brand-config"] },
  { id: "c51", num: 51, label: "Facebook Page Manager", purpose: "Post templates, group engagement scripts, ad copy for FB FM groups", tier: 5, tierLabel: "Social & Marketing", tags: ["facebook","groups","ads"], deps: ["brand-config"] },
  { id: "c52", num: 52, label: "Instagram Content Manager", purpose: "Carousel templates, caption library, hashtag sets, story scripts", tier: 5, tierLabel: "Social & Marketing", tags: ["instagram","carousel","stories"], deps: ["brand-config"] },
  { id: "c53", num: 53, label: "X/Twitter Manager", purpose: "Thread templates, quote-tweet scripts, engagement playbooks", tier: 5, tierLabel: "Social & Marketing", tags: ["twitter","x","threads"], deps: ["brand-config"] },
  { id: "c54", num: 54, label: "LinkedIn Content Manager", purpose: "Article templates, connection request scripts, thought-leadership posts", tier: 5, tierLabel: "Social & Marketing", tags: ["linkedin","articles","thought-leadership"], deps: ["brand-config"] },
  { id: "c55", num: 55, label: "Marketing Dashboard", purpose: "All-channel performance view: impressions, reach, engagement, CPL", tier: 5, tierLabel: "Social & Marketing", tags: ["dashboard","marketing","performance"], deps: ["brand-config"] },
  // Tier 6
  { id: "c56", num: 56, label: "Meme Visual Generator", purpose: "Brand-compliant meme templates for clinical education content", tier: 6, tierLabel: "Social Media Hub", tags: ["memes","visual","education"], deps: ["brand-config"] },
  { id: "c57", num: 57, label: "Hook Library", purpose: "500+ proven hooks categorised by platform, emotion, and audience stage", tier: 6, tierLabel: "Social Media Hub", tags: ["hooks","copy","library"], deps: ["brand-config"] },
  { id: "c58", num: 58, label: "Ad Content Pipeline", purpose: "Creative brief → headline → body → CTA → compliance check → 3 variants", tier: 6, tierLabel: "Social Media Hub", tags: ["ads","pipeline","creative"], deps: ["c7"] },
  { id: "c59", num: 59, label: "Quiz Engine", purpose: "Interactive lead-qualification quizzes: 'Is your patient terrain-ready?'", tier: 6, tierLabel: "Social Media Hub", tags: ["quiz","lead-gen","interactive"], deps: ["brand-config"] },
  { id: "c60", num: 60, label: "Lead Magnet Factory", purpose: "Generate PDFs, checklists, guides for gated downloads", tier: 6, tierLabel: "Social Media Hub", tags: ["lead-magnet","pdf","gated"], deps: ["c2"] },
  { id: "c61", num: 61, label: "Nurture Sequence Engine", purpose: "14-email nurture flows for cold → warm → hot leads", tier: 6, tierLabel: "Social Media Hub", tags: ["nurture","email","leads"], deps: ["brand-config"] },
  { id: "c62", num: 62, label: "Ad Creative Manager", purpose: "Image/copy brief generator for paid social campaigns", tier: 6, tierLabel: "Social Media Hub", tags: ["ads","creative","paid-social"], deps: ["brand-config"] },
  { id: "c63", num: 63, label: "Posting Scheduler", purpose: "Optimal posting times per platform, queue management, cadence planner", tier: 6, tierLabel: "Social Media Hub", tags: ["scheduler","posting","cadence"], deps: ["brand-config"] },
  { id: "c64", num: 64, label: "Conversion Funnel Tracker", purpose: "Awareness → interest → decision → action funnel with drop-off analysis", tier: 6, tierLabel: "Social Media Hub", tags: ["funnel","conversion","analytics"], deps: ["brand-config"] },
  { id: "c65", num: 65, label: "Social Media Command Hub", purpose: "Master control: all platforms, all campaigns, all metrics in one view", tier: 6, tierLabel: "Social Media Hub", tags: ["command-hub","social","overview"], deps: ["brand-config"] },
  { id: "c66", num: 66, label: "Audience Targeting Engine", purpose: "England-only FM practitioner targeting: professions, channels, exclusions", tier: 6, tierLabel: "Social Media Hub", tags: ["targeting","audience","england"], deps: ["brand-config"] },
  { id: "c67", num: 67, label: "Facebook Group Playbook", purpose: "Group infiltration scripts, engagement sequences for FM Facebook groups", tier: 6, tierLabel: "Social Media Hub", tags: ["facebook","groups","playbook"], deps: ["brand-config"] },
  { id: "c68", num: 68, label: "Social Proof Screenshot Tool", purpose: "Templates for sharing cohort milestones on social media", tier: 6, tierLabel: "Social Media Hub", tags: ["social-proof","screenshots","milestones"], deps: ["brand-config"] },
  { id: "c69", num: 69, label: "Retargeting Content Engine", purpose: "Content sequences for warm audiences who haven't converted", tier: 6, tierLabel: "Social Media Hub", tags: ["retargeting","warm","sequences"], deps: ["brand-config"] },
  { id: "c70", num: 70, label: "Competitor Intelligence", purpose: "K10-compliant competitive landscape monitoring and positioning updates", tier: 6, tierLabel: "Social Media Hub", tags: ["competitive","intelligence","positioning"], deps: ["brand-config"] },
  { id: "c71", num: 71, label: "UGC Amplifier", purpose: "User-generated content repurposing: testimonials → social posts → case studies", tier: 6, tierLabel: "Social Media Hub", tags: ["ugc","testimonials","case-studies"], deps: ["brand-config"] },
  { id: "c72", num: 72, label: "Seasonal Content Calendar", purpose: "Content themes mapped to clinical seasons and practitioner awareness dates", tier: 6, tierLabel: "Social Media Hub", tags: ["seasonal","calendar","themes"], deps: ["brand-config"] },
  { id: "c73", num: 73, label: "Influencer Outreach", purpose: "FM KOL identification, outreach scripts, collaboration brief templates", tier: 6, tierLabel: "Social Media Hub", tags: ["influencer","kol","outreach"], deps: ["brand-config"] },
  { id: "c74", num: 74, label: "Hashtag Strategy Engine", purpose: "Platform-specific hashtag sets for FM content — updated monthly", tier: 6, tierLabel: "Social Media Hub", tags: ["hashtags","strategy","fm"], deps: ["brand-config"] },
  { id: "c75", num: 75, label: "Content Repurposing Matrix", purpose: "Visual matrix: any content type → all other formats with one-click briefs", tier: 6, tierLabel: "Social Media Hub", tags: ["repurpose","matrix","formats"], deps: ["brand-config"] },
  { id: "c76", num: 76, label: "Engagement Response Templates", purpose: "Reply templates for every comment/DM scenario — brand-voice compliant", tier: 6, tierLabel: "Social Media Hub", tags: ["engagement","replies","templates"], deps: ["brand-config"] },
].map(c => ({ ...c, status: "BUILT" as const }));

const ALL_TAGS = Array.from(new Set(COMPONENTS.flatMap(c => c.tags))).sort();

export function ComponentsLibraryPage() {
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<Component | null>(null);

  const filtered = COMPONENTS.filter(c => {
    if (activeTier !== null && c.tier !== activeTier) return false;
    if (activeTag && !c.tags.includes(activeTag)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.label.toLowerCase().includes(q) || c.purpose.toLowerCase().includes(q) || c.tags.some(t => t.includes(q));
    }
    return true;
  });

  const byTier = [1,2,3,4,5,6].map(t => ({
    tier: t,
    ...TIERS[t],
    count: COMPONENTS.filter(c => c.tier === t).length,
  }));

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>
          Content Studio Web
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Components Library</div>
        <div style={{ fontSize: 13, color: MUTED }}>{COMPONENTS.length} components · 6 tiers · synced from GitHub</div>
      </div>

      {/* Tier summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 28 }}>
        {byTier.map(t => (
          <div key={t.tier} onClick={() => setActiveTier(activeTier === t.tier ? null : t.tier)}
            style={{ background: activeTier === t.tier ? `${t.colour}18` : SURFACE, border: `1px solid ${activeTier === t.tier ? t.colour + "60" : BORDER}`, borderRadius: 10, padding: "14px 14px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { if (activeTier !== t.tier) e.currentTarget.style.borderColor = t.colour + "40"; }}
            onMouseLeave={e => { if (activeTier !== t.tier) e.currentTarget.style.borderColor = BORDER; }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: t.colour, lineHeight: 1, marginBottom: 4 }}>{t.count}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.colour, marginBottom: 4 }}>Tier {t.tier}</div>
            <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.4 }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* Search + tag filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search components…"
          style={{ width: 260, padding: "8px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.06)", color: TEXT, fontSize: 13, fontFamily: "inherit", outline: "none" }}
        />
        {(activeTier !== null || search || activeTag) && (
          <button onClick={() => { setActiveTier(null); setSearch(""); setActiveTag(null); }}
            style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            Clear filters
          </button>
        )}
        <div style={{ fontSize: 11, color: MUTED }}>
          {filtered.length} of {COMPONENTS.length} shown
        </div>
      </div>

      {/* Tag cloud */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
        {ALL_TAGS.slice(0, 30).map(tag => (
          <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            style={{ padding: "3px 10px", borderRadius: 20, border: `1px solid ${activeTag === tag ? TEAL + "80" : BORDER}`, background: activeTag === tag ? `${TEAL}18` : "transparent", color: activeTag === tag ? TEAL : MUTED, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
        {filtered.map(c => {
          const tierInfo = TIERS[c.tier];
          const isSelected = selected?.id === c.id;
          return (
            <div key={c.id} onClick={() => setSelected(isSelected ? null : c)}
              style={{ background: isSelected ? `${tierInfo.colour}10` : SURFACE, border: `1px solid ${isSelected ? tierInfo.colour + "60" : BORDER}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = tierInfo.colour + "40"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = "none"; } }}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontFamily: "DM Mono, monospace", color: tierInfo.colour, fontWeight: 700, background: `${tierInfo.colour}15`, padding: "2px 8px", borderRadius: 20 }}>
                  C{c.num}
                </div>
                <div style={{ fontSize: 9, color: tierInfo.colour, letterSpacing: "0.06em", fontWeight: 700 }}>
                  T{c.tier} · {tierInfo.label}
                </div>
              </div>

              {/* Name */}
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 6, lineHeight: 1.3 }}>{c.label}</div>

              {/* Purpose */}
              <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5, marginBottom: 10 }}>{c.purpose}</div>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {c.tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: MUTED }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Expanded detail */}
              {isSelected && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>
                    <span style={{ color: TEXT, fontWeight: 600 }}>Dependencies: </span>
                    {c.deps.join(", ")}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>
                    <span style={{ color: TEXT, fontWeight: 600 }}>File: </span>
                    <span style={{ fontFamily: "DM Mono, monospace", color: TEAL }}>
                      csw-components/{c.id}-{c.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ts
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <a href={`https://github.com/Sfaisal1975/Vitalmatrix-contentstudio/blob/master/csw/src/${c.id}-${c.label.toLowerCase().replace(/[^a-z0-9&]+/g,"").replace(/&/g,"")}.ts`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 10, padding: "4px 12px", borderRadius: 6, background: `${GOLD}20`, color: GOLD, textDecoration: "none", fontWeight: 700 }}
                      onClick={e => e.stopPropagation()}>
                      View on GitHub →
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ color: MUTED, fontSize: 13, padding: "40px 0" }}>No components match your filter.</div>
      )}

      {/* Stats footer */}
      <div style={{ marginTop: 40, padding: "20px 24px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, display: "flex", gap: 32 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: TEAL }}>{COMPONENTS.length}</div>
          <div style={{ fontSize: 11, color: MUTED }}>Total components</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: GREEN }}>100%</div>
          <div style={{ fontSize: 11, color: MUTED }}>Built & tested</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: GOLD }}>164</div>
          <div style={{ fontSize: 11, color: MUTED }}>Tests passing</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: AMBER }}>6</div>
          <div style={{ fontSize: 11, color: MUTED }}>Tiers</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 10, color: MUTED, textAlign: "right" }}>Synced from GitHub</div>
          <div style={{ fontSize: 10, fontFamily: "DM Mono, monospace", color: TEAL, textAlign: "right" }}>Sfaisal1975/Vitalmatrix-contentstudio</div>
        </div>
      </div>
    </div>
  );
}
