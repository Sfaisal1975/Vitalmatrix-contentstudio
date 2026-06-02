import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/auth";

const GOLD = "#C9A84C";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";

function renderMd(md: string): string {
  let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
    .replace(/(<li>.*?<\/li>\n)+/gs, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n+/g, "\n</p>\n<p>\n");
  return `<p>${html}</p>`;
}

function styledMd(html: string) {
  const GOLD = "#C9A84C";
  const TEXT = "#F4F4F2";
  const MUTED = "rgba(244,244,242,0.55)";
  return `<style>
    .vm-spec h1{font-size:22px;font-weight:700;color:${TEXT};margin:0 0 18px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.12)}
    .vm-spec h2{font-size:18px;font-weight:700;color:${GOLD};margin:32px 0 12px}
    .vm-spec h3{font-size:15px;font-weight:700;color:${TEXT};margin:22px 0 8px}
    .vm-spec h4{font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.07em;margin:16px 0 6px}
    .vm-spec p{font-size:14px;line-height:1.8;color:${TEXT};margin:0 0 14px}
    .vm-spec ul{margin:0 0 14px;padding-left:22px}
    .vm-spec li{font-size:14px;line-height:1.7;color:${TEXT};margin-bottom:5px}
    .vm-spec code{background:rgba(0,0,0,0.3);padding:2px 7px;border-radius:4px;font-size:12px;font-family:monospace;color:${GOLD}}
    .vm-spec strong{font-weight:700;color:${TEXT}}
    .vm-spec hr{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:28px 0}
    .vm-spec em{color:${MUTED};font-style:italic}
  </style><div class="vm-spec" style="font-family:'DM Sans','Inter',sans-serif">${html}</div>`;
}

export function MasterSpecPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ content: string }>("/admin/cs-files/master-spec")
      .then(d => { setContent(d.content); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>Reference</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: TEXT }}>Master Specification</div>
      </div>

      {error && <div style={{ color: "#F87171", fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {loading && <div style={{ color: MUTED, fontSize: 13 }}>Loading master spec…</div>}

      {!loading && !error && content && (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "28px 36px" }}>
          <div dangerouslySetInnerHTML={{ __html: styledMd(renderMd(content)) }} />
        </div>
      )}

      {!loading && !error && !content && (
        <div style={{ color: MUTED, fontSize: 13 }}>Master spec not found.</div>
      )}
    </div>
  );
}
