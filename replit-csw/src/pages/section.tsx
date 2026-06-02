import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { apiFetch } from "@/lib/auth";

const GOLD = "#C9A84C";
const TEAL = "#4ECDC4";
const TEXT = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const BORDER = "rgba(255,255,255,0.1)";
const SURFACE = "#122d4e";

interface CsFile {
  name: string;
  path: string;
  sizeBytes: number;
  isReadme: boolean;
}

interface CsSection {
  id: string;
  label: string;
  icon: string;
  fileCount: number;
  totalFiles: number;
  populated: boolean;
}

export function SectionPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [files, setFiles] = useState<CsFile[]>([]);
  const [section, setSection] = useState<CsSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [filesData, sectionsData] = await Promise.all([
          apiFetch<{ files: CsFile[] }>(`/admin/cs-files/sections/${params.id}/files`),
          apiFetch<{ sections: CsSection[] }>("/admin/cs-files/sections"),
        ]);
        setFiles(filesData.files);
        const found = sectionsData.sections.find(s => s.id === params.id);
        setSection(found ?? null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const mainFiles = files.filter(f => !f.isReadme);
  const readmeFiles = files.filter(f => f.isReadme);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 900 }}>
      {/* Back + breadcrumb */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", color: MUTED, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          ← All sections
        </button>
        {section && (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>{section.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>{section.label}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{section.id}</div>
            </div>
          </div>
        )}
      </div>

      {error && <div style={{ color: "#F87171", fontSize: 13, marginBottom: 20 }}>{error}</div>}
      {loading && <div style={{ color: MUTED, fontSize: 13 }}>Loading files…</div>}

      {!loading && files.length === 0 && (
        <div style={{ color: MUTED, fontSize: 13 }}>No files in this section yet.</div>
      )}

      {!loading && mainFiles.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: TEAL, marginBottom: 12 }}>Files — {mainFiles.length}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mainFiles.map(f => (
              <FileRow key={f.path} file={f} onClick={() => setLocation(`/file?path=${encodeURIComponent(f.path)}`)} />
            ))}
          </div>
        </div>
      )}

      {!loading && readmeFiles.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED, marginBottom: 12 }}>Readme / Index</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {readmeFiles.map(f => (
              <FileRow key={f.path} file={f} onClick={() => setLocation(`/file?path=${encodeURIComponent(f.path)}`)} dim />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FileRow({ file, onClick, dim }: { file: CsFile; onClick: () => void; dim?: boolean }) {
  const kb = (file.sizeBytes / 1024).toFixed(1);
  return (
    <div onClick={onClick} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "14px 18px", cursor: "pointer", opacity: dim ? 0.55 : 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = dim ? BORDER : GOLD)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{file.name}</div>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace" }}>{file.path}</div>
      </div>
      <div style={{ fontSize: 11, color: MUTED, flexShrink: 0, marginLeft: 20 }}>{kb} KB</div>
    </div>
  );
}
