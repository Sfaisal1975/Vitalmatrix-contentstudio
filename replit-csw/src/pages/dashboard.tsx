import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { apiFetch } from "@/lib/auth";

const NAVY = "#0D2B4E";
const GOLD = "#C9A84C";
const TEAL = "#4ECDC4";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";
const RED = "#F87171";
const AMBER = "#FBBF24";
const GREEN = "#34D399";

type FilterMode = "all" | "populated" | "empty" | "high-priority";
type SortMode = "priority" | "name" | "files";

interface CsSection {
  id: string;
  label: string;
  icon: string;
  priority: string;
  fileCount: number;
  totalFiles: number;
  populated: boolean;
}

interface SearchResult {
  file: string;
  excerpt: string;
  lineNumber: number;
}

function priorityNum(p: string) { return parseInt(p, 10) || 99; }

function priorityBand(p: number): { label: string; colour: string } {
  if (p <= 10) return { label: "High", colour: TEAL };
  if (p <= 25) return { label: "Medium", colour: AMBER };
  return { label: "Low", colour: MUTED };
}

function CompletionRing({ pct }: { pct: number }) {
  const r = 40, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={TEAL} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
    </svg>
  );
}

export function DashboardPage() {
  const [, setLocation] = useLocation();
  const [sections, setSections] = useState<CsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("priority");
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    apiFetch<{ sections: CsSection[] }>("/admin/cs-files/sections")
      .then(d => { setSections(d.sections); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQ.trim()) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const d = await apiFetch<{ results: SearchResult[] }>(`/admin/cs-files/search?q=${encodeURIComponent(searchQ)}`);
      setSearchResults(d.results);
    } catch { /* ignore */ }
    finally { setSearching(false); }
  }

  const real = sections.filter(s => s.id !== "_Templates");
  const populated = real.filter(s => s.populated);
  const empty = real.filter(s => !s.populated);
  const totalFiles = real.reduce((a, s) => a + s.fileCount, 0);
  const pct = real.length > 0 ? Math.round((populated.length / real.length) * 100) : 0;
  const highPriEmpty = empty
    .filter(s => priorityNum(s.priority) <= 15)
    .sort((a, b) => priorityNum(a.priority) - priorityNum(b.priority))
    .slice(0, 5);

  function filteredSorted(): CsSection[] {
    let list = real;
    if (filter === "populated") list = real.filter(s => s.populated);
    else if (filter === "empty") list = real.filter(s => !s.populated);
    else if (filter === "high-priority") list = real.filter(s => priorityNum(s.priority) <= 15);
    if (sort === "priority") list = [...list].sort((a, b) => priorityNum(a.priority) - priorityNum(b.priority));
    else if (sort === "name") list = [...list].sort((a, b) => a.label.localeCompare(b.label));
    else if (sort === "files") list = [...list].sort((a, b) => b.fileCount - a.fileCount);
    return list;
  }

  if (loading) return (
    <div style={{ padding: "40px", color: MUTED, fontSize: 13 }}>Loading overview…</div>
  );

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>
          Content Management Hub
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Overview</div>
        <div style={{ fontSize: 13, color: MUTED }}>
          {real.length} sections · {populated.length} populated · {totalFiles} files total
        </div>
      </div>

      {error && <div style={{ color: RED, fontSize: 13, marginBottom: 20 }}>{error}</div>}

      {/* ── Metrics strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr 1fr", gap: 16, marginBottom: 28, alignItems: "stretch" }}>
        {/* Ring */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
            <CompletionRing pct={pct} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: TEAL, lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 9, color: MUTED, letterSpacing: "0.08em", marginTop: 2 }}>DONE</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 4 }}>Overall Progress</div>
            <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
              {populated.length} of {real.length} sections<br />
              have content files
            </div>
          </div>
        </div>

        {/* Stat: Populated */}
        <StatCard value={populated.length} label="Sections Populated" colour={GREEN} sub={`${real.length - populated.length} remaining`} />
        {/* Stat: Files */}
        <StatCard value={totalFiles} label="Total Files" colour={GOLD} sub="across all sections" />
        {/* Stat: High-priority empty */}
        <StatCard value={highPriEmpty.length} label="High-Priority Gaps" colour={highPriEmpty.length > 0 ? AMBER : GREEN}
          sub={highPriEmpty.length > 0 ? "need attention" : "all covered ✓"} />
        {/* Stat: Empty */}
        <StatCard value={empty.length} label="Empty Sections" colour={empty.length > 20 ? RED : empty.length > 10 ? AMBER : GREEN}
          sub="no files yet" />
      </div>

      {/* ── Progress bar ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${TEAL}, #2DD4BF)`, borderRadius: 3, transition: "width 0.6s ease" }} />
        </div>
      </div>

      {/* ── Needs Attention ── */}
      {highPriEmpty.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER, flexShrink: 0 }} />
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: AMBER }}>
              Needs Attention — Top {highPriEmpty.length} High-Priority Gaps
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {highPriEmpty.map(s => {
              const band = priorityBand(priorityNum(s.priority));
              return (
                <div key={s.id} onClick={() => setLocation(`/sections/${s.id}`)}
                  style={{ background: "rgba(251,191,36,0.05)", border: `1px solid rgba(251,191,36,0.2)`, borderRadius: 9, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(251,191,36,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(251,191,36,0.05)")}
                >
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace" }}>Priority {s.priority} · No files yet</div>
                  </div>
                  <div style={{ fontSize: 10, padding: "2px 10px", borderRadius: 20, background: `${band.colour}20`, color: band.colour, fontWeight: 700, letterSpacing: "0.04em" }}>
                    {band.label}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED }}>Open →</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search ── */}
      <form onSubmit={handleSearch} style={{ marginBottom: 24, display: "flex", gap: 10 }}>
        <input
          value={searchQ}
          onChange={e => { setSearchQ(e.target.value); if (!e.target.value) setSearchResults(null); }}
          placeholder="Search across all content files…"
          style={{ flex: 1, maxWidth: 440, padding: "9px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.06)", color: TEXT, fontSize: 13, fontFamily: "inherit", outline: "none" }}
        />
        <button type="submit" disabled={searching}
          style={{ padding: "9px 20px", borderRadius: 7, border: "none", background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {searching ? "…" : "Search"}
        </button>
        {searchResults !== null && (
          <button type="button" onClick={() => { setSearchResults(null); setSearchQ(""); }}
            style={{ padding: "9px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            Clear
          </button>
        )}
      </form>

      {searchResults !== null && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, marginBottom: 12 }}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQ}"
          </div>
          {searchResults.length === 0
            ? <div style={{ color: MUTED, fontSize: 13 }}>No matches.</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {searchResults.map((r, i) => (
                <div key={i} onClick={() => setLocation(`/file?path=${encodeURIComponent(r.file)}`)}
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 16px", cursor: "pointer" }}>
                  <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, marginBottom: 3 }}>{r.file}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>Line {r.lineNumber}: <span style={{ color: TEXT }}>{r.excerpt}</span></div>
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {/* ── Filter + Sort controls ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all","populated","empty","high-priority"] as FilterMode[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${filter === f ? TEAL : BORDER}`, background: filter === f ? `${TEAL}18` : "transparent", color: filter === f ? TEAL : MUTED, fontSize: 11, fontWeight: filter === f ? 700 : 400, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em" }}>
              {f === "all" ? `All (${real.length})` : f === "populated" ? `Populated (${populated.length})` : f === "empty" ? `Empty (${empty.length})` : `High Priority`}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: MUTED }}>Sort:</span>
          {(["priority","name","files"] as SortMode[]).map(s => (
            <button key={s} onClick={() => setSort(s)}
              style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${sort === s ? GOLD : BORDER}`, background: sort === s ? `${GOLD}18` : "transparent", color: sort === s ? GOLD : MUTED, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              {s === "priority" ? "Priority" : s === "name" ? "Name" : "Files"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
        {filteredSorted().map(s => (
          <SectionCard key={s.id} section={s} onClick={() => setLocation(`/sections/${s.id}`)} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ value, label, colour, sub }: { value: number; label: string; colour: string; sub: string }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: colour, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: MUTED }}>{sub}</div>
      </div>
    </div>
  );
}

function SectionCard({ section, onClick }: { section: CsSection; onClick: () => void }) {
  const pNum = priorityNum(section.priority);
  const band = priorityBand(pNum);
  const filePct = section.totalFiles > 0 ? Math.round((section.fileCount / section.totalFiles) * 100) : 0;

  return (
    <div onClick={onClick}
      style={{ background: SURFACE, border: `1px solid ${section.populated ? "rgba(78,205,196,0.2)" : BORDER}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.15s, transform 0.1s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = section.populated ? "rgba(78,205,196,0.2)" : BORDER; e.currentTarget.style.transform = "none"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>{section.icon}</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {section.populated && (
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
          )}
          <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: `${band.colour}18`, color: band.colour, fontFamily: "monospace", fontWeight: 700 }}>
            P{section.priority}
          </div>
        </div>
      </div>

      {/* Name */}
      <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 8, lineHeight: 1.35 }}>{section.label}</div>

      {/* File count + mini bar */}
      <div style={{ fontSize: 10, color: MUTED, marginBottom: section.totalFiles > 0 ? 6 : 0 }}>
        {section.fileCount} file{section.fileCount !== 1 ? "s" : ""}
        {section.totalFiles > 0 && ` / ${section.totalFiles}`}
      </div>
      {section.totalFiles > 0 && (
        <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${filePct}%`, background: filePct === 100 ? TEAL : GOLD, borderRadius: 2, transition: "width 0.4s" }} />
        </div>
      )}
    </div>
  );
}
