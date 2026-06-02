import { useState } from "react";
import { setApiKey } from "@/lib/auth";

const NAVY = "#0D2B4E";
const GOLD = "#C9A84C";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) { setError("Admin key required"); return; }
    setLoading(true);
    setError("");
    try {
      const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
      const res = await fetch(`${base}/api/healthz`, {
        headers: { Authorization: "Basic " + btoa("admin:" + key.trim()) },
      });
      if (res.status === 401) { setError("Invalid admin key"); setLoading(false); return; }
      setApiKey(key.trim());
      onLogin();
    } catch {
      setError("Could not reach the API server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 380, padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 12 }}>VitalMatrix</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 6 }}>Content Studio</div>
          <div style={{ fontSize: 13, color: MUTED }}>Internal content management</div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "28px 28px" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: MUTED, marginBottom: 8 }}>Admin key</label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              autoFocus
              placeholder="Enter admin key"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.06)", color: TEXT, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
            />
          </div>
          {error && <div style={{ fontSize: 12, color: "#F87171", marginBottom: 14 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "10px", borderRadius: 7, border: "none", background: GOLD, color: NAVY, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Verifying…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
