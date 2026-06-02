import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/auth";

const GOLD = "#C9A84C";
const TEAL = "#4ECDC4";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";

const BRAND_FILES = [
  { label: "Voice & Tone Guide", path: "06_Brand-Assets/Voice-and-Tone-Guide.md" },
  { label: "Messaging Framework", path: "06_Brand-Assets/Messaging-Framework.md" },
  { label: "Email Hooks Library", path: "06_Brand-Assets/Email-Hooks-Library.md" },
  { label: "Email Style Guide", path: "06_Brand-Assets/Email-Style-Guide.md" },
];

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

export function BrandGuidePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const path = BRAND_FILES[activeTab].path;
    if (contents[path] !== undefined) return;
    setLoading(l => ({ ...l, [path]: true }));
    apiFetch<{ path: string; content: string }>(`/admin/cs-files/file?path=${encodeURIComponent(path)}`)
      .then(d => {
        setContents(c => ({ ...c, [path]: d.content }));
        setLoading(l => ({ ...l, [path]: false }));
      })
      .catch(e => {
        setErrors(er => ({ ...er, [path]: e.message }));
        setLoading(l => ({ ...l, [path]: false }));
      });
  }, [activeTab]);

  const current = BRAND_FILES[activeTab];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1000 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 6 }}>Brand</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: TEXT }}>Brand Guide</div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: `1px solid ${BORDER}`, paddingBottom: 0 }}>
        {BRAND_FILES.map((f, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: "9px 18px", background: "none", border: "none", fontFamily: "inherit",
            fontSize: 13, fontWeight: i === activeTab ? 700 : 400,
            color: i === activeTab ? TEAL : MUTED,
            borderBottom: i === activeTab ? `2px solid ${TEAL}` : "2px solid transparent",
            marginBottom: -1, cursor: "pointer",
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "28px 32px" }}>
        {loading[current.path] && <div style={{ color: MUTED, fontSize: 13 }}>Loading…</div>}
        {errors[current.path] && <div style={{ color: "#F87171", fontSize: 13 }}>{errors[current.path]}</div>}
        {contents[current.path] && (
          <div dangerouslySetInnerHTML={{ __html: styledMd(renderMd(contents[current.path])) }} />
        )}
        {!loading[current.path] && !errors[current.path] && !contents[current.path] && (
          <div style={{ color: MUTED, fontSize: 13 }}>File not found or empty.</div>
        )}
      </div>
    </div>
  );
}

function styledMd(html: string) {
  const GOLD = "#C9A84C";
  const TEXT = "#F4F4F2";
  const MUTED = "rgba(244,244,242,0.55)";
  return `<style>
    .vm-brand h1{font-size:20px;font-weight:700;color:${TEXT};margin:0 0 16px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1)}
    .vm-brand h2{font-size:17px;font-weight:700;color:${GOLD};margin:26px 0 10px}
    .vm-brand h3{font-size:14px;font-weight:700;color:${TEXT};margin:18px 0 7px}
    .vm-brand h4{font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.07em;margin:14px 0 5px}
    .vm-brand p{font-size:14px;line-height:1.75;color:${TEXT};margin:0 0 12px}
    .vm-brand ul{margin:0 0 12px;padding-left:20px}
    .vm-brand li{font-size:14px;line-height:1.7;color:${TEXT};margin-bottom:4px}
    .vm-brand code{background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:3px;font-size:12px;font-family:monospace;color:${GOLD}}
    .vm-brand strong{font-weight:700;color:${TEXT}}
    .vm-brand hr{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:22px 0}
  </style><div class="vm-brand" style="font-family:'DM Sans','Inter',sans-serif">${html}</div>`;
}
