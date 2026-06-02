import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { apiFetch } from "@/lib/auth";

const GOLD = "#C9A84C";
const TEAL = "#4ECDC4";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html
    .replace(/^#{4} (.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3} (.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2} (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\s*---\s*$/gm, "<hr/>")
    .replace(/^\s*- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, "<oli>$1</oli>")
    .replace(/(<oli>.*<\/oli>\n?)+/g, (m) => `<ol>${m.replace(/<oli>/g, "<li>").replace(/<\/oli>/g, "</li>")}</ol>`)
    .replace(/^\|(.+)\|$/gm, (line) => {
      const cells = line.split("|").slice(1, -1);
      const isHeader = cells.some(c => c.includes("---"));
      if (isHeader) return "";
      const tag = "td";
      return `<tr>${cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join("")}</tr>`;
    })
    .replace(/(<tr>[\s\S]*?<\/tr>)/g, "<table>$1</table>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[huplto])(.+)$/gm, (line) => {
      if (line.trim() === "" || line.startsWith("<")) return line;
      return line;
    });

  return html;
}

export function FileViewerPage() {
  const searchStr = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(searchStr);
  const filePath = params.get("path") ?? "";

  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    if (!filePath) return;
    setLoading(true);
    apiFetch<{ path: string; content: string }>(`/admin/cs-files/file?path=${encodeURIComponent(filePath)}`)
      .then(d => { setContent(d.content); setEditContent(d.content); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [filePath]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      await apiFetch("/admin/cs-files/file", {
        method: "PUT",
        body: JSON.stringify({ path: filePath, content: editContent }),
      });
      setContent(editContent);
      setSaveMsg("Saved");
      setEditing(false);
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e: unknown) {
      setSaveMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];
  const sectionId = parts.length >= 2 ? parts[parts.length - 2] : null;

  return (
    <div style={{ padding: "32px 40px", maxWidth: 960 }}>
      {/* Back button */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => sectionId ? setLocation(`/sections/${sectionId}`) : setLocation("/")}
          style={{ background: "none", border: "none", color: MUTED, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}
        >
          ← {sectionId ? sectionId : "All sections"}
        </button>
      </div>

      {/* File header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{fileName}</div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace" }}>{filePath}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {saveMsg && <span style={{ fontSize: 12, color: saveMsg === "Saved" ? TEAL : "#F87171" }}>{saveMsg}</span>}
          {!editing ? (
            <button onClick={() => setEditing(true)} style={{ padding: "8px 18px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: TEXT, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Edit
            </button>
          ) : (
            <>
              <button onClick={() => { setEditing(false); setEditContent(content); }} style={{ padding: "8px 16px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "8px 18px", borderRadius: 7, border: "none", background: GOLD, color: "#0D2B4E", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div style={{ color: "#F87171", fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {loading && <div style={{ color: MUTED, fontSize: 13 }}>Loading file…</div>}

      {!loading && !error && (
        <>
          {editing ? (
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              style={{ width: "100%", minHeight: 500, padding: "18px", borderRadius: 10, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontSize: 13, fontFamily: "monospace", lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", outline: "none" }}
            />
          ) : (
            <div
              style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "28px 32px" }}
              dangerouslySetInnerHTML={{ __html: wrapMarkdownHtml(renderMarkdown(content)) }}
            />
          )}
        </>
      )}
    </div>
  );
}

function wrapMarkdownHtml(html: string): string {
  const NAVY = "#0D2B4E";
  const GOLD = "#C9A84C";
  const TEXT = "#F4F4F2";
  const MUTED = "rgba(244,244,242,0.55)";
  return `<div style="color:${TEXT};font-size:14px;line-height:1.75;font-family:'DM Sans','Inter',sans-serif">
    <style>
      .vm-md h1{font-size:22px;font-weight:700;color:${TEXT};margin:0 0 16px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:10px}
      .vm-md h2{font-size:18px;font-weight:700;color:${GOLD};margin:28px 0 12px}
      .vm-md h3{font-size:15px;font-weight:700;color:${TEXT};margin:20px 0 8px}
      .vm-md h4{font-size:13px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.07em;margin:16px 0 6px}
      .vm-md p{margin:0 0 14px}
      .vm-md ul,.vm-md ol{margin:0 0 14px;padding-left:22px}
      .vm-md li{margin-bottom:5px;color:${TEXT}}
      .vm-md code{background:rgba(0,0,0,0.3);padding:2px 7px;border-radius:4px;font-size:12px;font-family:monospace;color:${GOLD}}
      .vm-md hr{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:24px 0}
      .vm-md strong{color:${TEXT};font-weight:700}
      .vm-md table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px}
      .vm-md td{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.06);color:${TEXT}}
      .vm-md tr:first-child td{font-weight:700;color:${MUTED};text-transform:uppercase;font-size:10px;letter-spacing:.05em}
    </style>
    <div class="vm-md">${html}</div>
  </div>`;
}
