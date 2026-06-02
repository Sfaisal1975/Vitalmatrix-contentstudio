import { Link, useLocation } from "wouter";
import { clearApiKey } from "@/lib/auth";

const NAVY = "#0D2B4E";
const NAVY2 = "#0a2240";
const GOLD = "#C9A84C";
const TEAL = "#4ECDC4";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: "⊞" },
  { href: "/components", label: "Components (66)", icon: "⬡" },
  { href: "/ncz-la", label: "NCZ™ Living Arch", icon: "◉" },
  { href: "/brand", label: "Brand Guide", icon: "◈" },
  { href: "/evidence", label: "Evidence", icon: "◎" },
  { href: "/launch", label: "Launch", icon: "▷" },
  { href: "/master-spec", label: "Master Spec", icon: "≡" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  function handleLogout() {
    clearApiKey();
    window.location.reload();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', 'Inter', sans-serif", background: NAVY }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: NAVY2, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0 }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>VitalMatrix</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Content Studio</div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const active = item.href === "/" ? location === "/" : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <a style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                  borderRadius: 7, marginBottom: 2, textDecoration: "none",
                  background: active ? `${TEAL}14` : "transparent",
                  border: active ? `1px solid ${TEAL}35` : "1px solid transparent",
                  color: active ? TEAL : MUTED,
                  fontWeight: active ? 700 : 400, fontSize: 13, cursor: "pointer",
                }}>
                  <span style={{ fontSize: 14, opacity: 0.8 }}>{item.icon}</span>
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={handleLogout}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 220, minHeight: "100vh", overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}

export const NAVY_C = NAVY;
export const GOLD_C = GOLD;
export const TEAL_C = TEAL;
export const TEXT_C = TEXT;
export const MUTED_C = MUTED;
export const BORDER_C = BORDER;
export const SURFACE_C = "#122d4e";
