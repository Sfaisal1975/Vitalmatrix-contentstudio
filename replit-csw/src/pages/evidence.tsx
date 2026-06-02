import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/auth";

const GOLD = "#C9A84C";
const TEAL = "#4ECDC4";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";

interface ClaimRow {
  cells: string[];
}

function parseMarkdownTable(md: string): { headers: string[]; rows: ClaimRow[] } {
  const lines = md.split("\n").filter(l => l.trim().startsWith("|"));
  if (lines.length < 2) return { headers: [], rows: [] };

  const parseCells = (line: string) =>
    line.split("|").slice(1, -1).map(c => c.trim());

  const headers = parseCells(lines[0]);
  const rows: ClaimRow[] = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = parseCells(lines[i]);
    if (cells.length > 0 && cells.some(c => c !== "")) rows.push({ cells });
  }
  return { headers, rows };
}

const TIER_COLORS: Record<string, string> = {
  "Tier 1": "#4ECDC4",
  "T1": "#4ECDC4",
  "Tier 2": "#C9A84C",
  "T2": "#C9A84C",
  "Tier 3": "#F87171",
  "T3": "#F87171",
};

function tierColor(val: string): string {
  for (const [k, v] of Object.entries(TIER_COLORS)) {
    if (val.includes(k)) return v;
  }
  return MUTED;
}

export function EvidencePage() {
  const [rawContent, setRawContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch<{ path: string; content: string }>(`/admin/cs-files/file?path=${encodeURIComponent("21_Evidence-Register/Claims-Register.md")}`)
      .then(d => { setRawContent(d.content); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const { headers, rows } = parseMarkdownTable(rawContent);

  const filtered = search.trim()
    ? rows.filter(r => r.cells.some(c => c.toLowerCase().includes(search.toLowerCase())))
    : rows;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>Clinical</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Evidence Register</div>
        <div style={{ fontSize: 13, color: MUTED }}>Claims Register — 21_Evidence-Register</div>
      </div>

      <div style={{ marginBottom: 24, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter claims…"
          style={{ width: 320, padding: "9px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.06)", color: TEXT, fontSize: 13, fontFamily: "inherit", outline: "none" }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ padding: "9px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            Clear
          </button>
        )}
        {rows.length > 0 && (
          <span style={{ fontSize: 12, color: MUTED, marginLeft: 4 }}>
            {filtered.length} of {rows.length} claim{rows.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {error && <div style={{ color: "#F87171", fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {loading && <div style={{ color: MUTED, fontSize: 13 }}>Loading claims register…</div>}

      {!loading && !error && headers.length === 0 && (
        <div style={{ color: MUTED, fontSize: 13 }}>No table found in Claims Register. The file may use a different format — <a href="#raw" style={{ color: TEAL }}>view raw</a>.</div>
      )}

      {!loading && headers.length > 0 && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(0,0,0,0.2)" }}>
                  {headers.map((h, i) => (
                    <th key={i} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={headers.length} style={{ padding: "20px 16px", color: MUTED, textAlign: "center" }}>No matches</td></tr>
                ) : (
                  filtered.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                      {row.cells.map((cell, ci) => {
                        const color = ci === 1 || (headers[ci] && headers[ci].toLowerCase().includes("tier")) ? tierColor(cell) : TEXT;
                        return (
                          <td key={ci} style={{ padding: "9px 16px", color, lineHeight: 1.5, verticalAlign: "top" }}>{cell}</td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && rawContent && headers.length === 0 && (
        <div id="raw" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "20px 24px" }}>
          <pre style={{ margin: 0, fontSize: 12, color: TEXT, fontFamily: "monospace", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{rawContent}</pre>
        </div>
      )}
    </div>
  );
}
