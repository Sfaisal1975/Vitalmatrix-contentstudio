import { useState } from "react";

const NAVY = "#0D2B4E";
const NAVY2 = "#0a2240";
const GOLD = "#C9A84C";
const TEAL = "#4ECDC4";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";
const BG_DEEP = "#0C4452";

const Z_COLOURS: Record<string, string> = {
  Z1: "#C9A84C",
  Z2: "#1A7A8A",
  Z3: "#7B5EA7",
  Z4: "#5F7C6C",
  Z5: "#2E6DB4",
};

const NODES = [
  { id: "N1", name: "Assimilation",                     sub: "Feeds Z2",            zones: ["Z2"],          dampened: false, phase2: false },
  { id: "N2", name: "Defence and Repair",                sub: "Feeds Z2, Z4",        zones: ["Z2","Z4"],     dampened: false, phase2: false },
  { id: "N3", name: "Energy",                            sub: "Feeds Z1, Z5",        zones: ["Z1","Z5"],     dampened: false, phase2: false },
  { id: "N4", name: "Biotransformation and Elimination", sub: "Feeds Z4, Z5",        zones: ["Z4","Z5"],     dampened: false, phase2: false },
  { id: "N5", name: "Transport",                         sub: "Feeds Z3",            zones: ["Z3"],          dampened: false, phase2: false },
  { id: "N6", name: "Communication",                     sub: "Feeds Z1, Z2, Z3, Z5", zones: ["Z1","Z2","Z3","Z5"], dampened: true, phase2: false },
  { id: "N7", name: "Structural Integrity",              sub: "No zone assignment",  zones: [],              dampened: false, phase2: true  },
];

const ZONES = [
  { id: "Z1", name: "Metabolic Energy Axis",    systems: "Adrenal · Thyroid · Pancreatic",          nodes: ["N3","N6"] },
  { id: "Z2", name: "Resilience Network",        systems: "Gut · Immune · Brain",                    nodes: ["N1","N2","N6"] },
  { id: "Z3", name: "Cardiovascular-Neural Axis",systems: "Cardiac · Pulmonary · Neurovascular",     nodes: ["N5","N6"] },
  { id: "Z4", name: "Detoxification Trident",    systems: "Hepatic · Lymphatic · Renal",             nodes: ["N2","N4"] },
  { id: "Z5", name: "Hormonal Terrain Axis",     systems: "Androgenic · Estrogenic · Progestogenic", nodes: ["N3","N4","N6"] },
];

export function NczLaPage() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);

  function handleNodeClick(id: string) {
    if (id === "N7") return;
    setActiveZone(null);
    setActiveNode(prev => prev === id ? null : id);
  }

  function handleZoneClick(id: string) {
    setActiveNode(null);
    setActiveZone(prev => prev === id ? null : id);
  }

  function nodeIsActive(id: string) {
    if (activeNode) return id === activeNode;
    if (activeZone) return ZONES.find(z => z.id === activeZone)?.nodes.includes(id) ?? false;
    return false;
  }

  function nodeDim(id: string) {
    if (!activeNode && !activeZone) return false;
    return !nodeIsActive(id);
  }

  function zoneIsActive(id: string) {
    if (activeZone) return id === activeZone;
    if (activeNode) return NODES.find(n => n.id === activeNode)?.zones.includes(id) ?? false;
    return false;
  }

  function zoneDim(id: string) {
    if (!activeNode && !activeZone) return false;
    return !zoneIsActive(id);
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>
          NCZ™ Framework
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: TEXT, marginBottom: 6 }}>
          NCZ™ Living Architecture
        </div>
        <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, maxWidth: 680 }}>
          Seven biological nodes converge into five terrain zones. The architecture maps the structural relationships between nodes and zones — click any node or zone to explore its connections.
        </div>
      </div>

      {/* Interactive architecture */}
      <div style={{
        background: BG_DEEP,
        borderRadius: 14,
        padding: "40px 36px",
        marginBottom: 28,
        border: `1px solid rgba(201,168,76,0.15)`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#1A7A8A", marginBottom: 10 }}>
            Node-Cascade Zone Architecture
          </div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>
            Seven Nodes. Five Zones. One Architecture.
          </div>
        </div>

        {(activeNode || activeZone) && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <button
              onClick={() => { setActiveNode(null); setActiveZone(null); }}
              style={{ padding: "6px 18px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em" }}
            >
              Clear selection ×
            </button>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 24,
          alignItems: "start",
        }}>
          {/* Nodes column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {NODES.map(n => {
              const active = nodeIsActive(n.id);
              const dim = nodeDim(n.id);
              return (
                <div
                  key={n.id}
                  onClick={() => handleNodeClick(n.id)}
                  style={{
                    padding: "13px 15px",
                    borderRadius: 10,
                    border: `1px solid ${active ? "#1A7A8A" : "rgba(255,255,255,0.11)"}`,
                    cursor: n.phase2 ? "default" : "pointer",
                    opacity: n.phase2 ? 0.4 : dim ? 0.22 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.2s",
                    background: active ? "rgba(26,122,138,0.14)" : "rgba(255,255,255,0.06)",
                  } as React.CSSProperties}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: active ? "rgba(26,122,138,0.25)" : "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "monospace", fontSize: 12, fontWeight: 500,
                    color: active ? "#1A7A8A" : TEXT,
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}>
                    {n.id}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{n.name}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginTop: 2, fontFamily: "monospace" }}>{n.sub}</div>
                  </div>
                  {n.dampened && (
                    <div style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "rgba(201,168,76,0.15)", color: GOLD, fontFamily: "monospace", flexShrink: 0 }}>
                      0.7×
                    </div>
                  )}
                  {n.phase2 && (
                    <div style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, border: `1px solid ${MUTED}`, color: MUTED, fontFamily: "monospace", flexShrink: 0 }}>
                      Phase 2
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Zones column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {ZONES.map(z => {
              const col = Z_COLOURS[z.id];
              const active = zoneIsActive(z.id);
              const dim = zoneDim(z.id);
              return (
                <div
                  key={z.id}
                  onClick={() => handleZoneClick(z.id)}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 12,
                    background: active ? `${col}14` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${active ? col : "rgba(255,255,255,0.11)"}`,
                    cursor: "pointer",
                    opacity: dim ? 0.2 : 1,
                    transition: "all 0.2s",
                    transform: active ? "translateY(-2px)" : "none",
                  } as React.CSSProperties}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: col, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: col }}>{z.id}</span>
                    <div>
                      <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, fontWeight: 600, color: TEXT, lineHeight: 1.2 }}>{z.name}</div>
                      <div style={{ fontSize: 10, color: MUTED, fontFamily: "monospace" }}>{z.systems}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, fontFamily: "monospace", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "5px 9px", lineHeight: 1.6 }}>
                    Nodes:{" "}
                    {z.nodes.map((nid, i) => {
                      const node = NODES.find(n => n.id === nid);
                      const highlight = !activeZone && activeNode ? activeNode === nid : false;
                      return (
                        <span key={nid}>
                          <span style={{ fontWeight: 600, color: highlight ? TEXT : TEXT }}>
                            {nid}
                          </span>
                          {" "}
                          <span style={{ color: MUTED }}>
                            ({node?.name})
                          </span>
                          {i < z.nodes.length - 1 && <span style={{ color: MUTED }}> · </span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full interactive document */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          overflow: "hidden",
        }}>
          <div
            style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" } as React.CSSProperties}
            onClick={() => setShowIframe(v => !v)}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>Living Architecture V3</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>Full Interactive Deep Dive</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                Five zone deep dives · Node connectivity map · Zone composition builder · N6 dominance · Overlap matrix · Assembly timeline
              </div>
            </div>
            <div style={{ fontSize: 18, color: MUTED, transition: "transform 0.2s", transform: showIframe ? "rotate(180deg)" : "none" }}>
              ⌄
            </div>
          </div>

          {showIframe && (
            <div>
              <div style={{ borderTop: `1px solid ${BORDER}` }}>
                <iframe
                  src="/la-files/NCZ_LivingArchitecture_V2_D53_2026-04-11_v3.html"
                  style={{ width: "100%", height: "80vh", border: "none", display: "block" }}
                  title="NCZ Living Architecture V3 Interactive"
                />
              </div>
              <div style={{ padding: "12px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 10 }}>
                <a
                  href="/la-files/NCZ_LivingArchitecture_V2_D53_2026-04-11_v3.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.08em", color: GOLD, textDecoration: "none", padding: "7px 18px", border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 5 }}
                >
                  Open Full Screen →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick-access links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          {
            label: "NCZ Architecture Page",
            desc: "Full NCZ framework with hero, zone explorer, and visualisations",
            href: "/NCZArchitecture_latest.html",
            colour: "#1A7A8A",
          },
          {
            label: "Living Architectures Hub",
            desc: "All 10 Living Architecture components in one page",
            href: "/LivingArchitectures_latest.html",
            colour: GOLD,
          },
          {
            label: "FLINT Clinical Architecture",
            desc: "NCZ FLINT cards — clinical reference",
            href: "/la-files/NCZ_FLINT_ClinicalArchitecture_Cards_D53_2026-04-11_v2.html",
            colour: "#7B5EA7",
          },
          {
            label: "NCZ Design Brief",
            desc: "Internal reference — design rationale and structure",
            href: "/la-files/NCZ_DesignBrief_InternalReference_D53_2026-04-11_v2.html",
            colour: "#5F7C6C",
          },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "16px 18px",
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = link.colour)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: link.colour, marginBottom: 5, letterSpacing: "0.04em" }}>↗</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{link.label}</div>
            <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{link.desc}</div>
          </a>
        ))}
      </div>

      {/* Version note */}
      <div style={{ fontSize: 11, color: MUTED, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
        NCZ™ Living Architecture V2 · D-53 · ALB v1.6 (D-62) · Phase 1 Active · N7 reserved for Phase 2
      </div>
    </div>
  );
}
