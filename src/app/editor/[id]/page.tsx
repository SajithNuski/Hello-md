"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { SectionsManager } from "@/components/editor/SectionsManager";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";
import { ExportDialog } from "@/components/export/ExportDialog";
import { SectionItem } from "@/lib/db/collections";
import { SectionKey, Tone } from "@/lib/config";
import { assemble } from "@/lib/assemble";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [login, setLogin] = useState("");
  const [theme, setTheme] = useState("minimal");
  const [tone, setTone] = useState<Tone>("professional");
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<SectionKey>("intro");

  const [activeView, setActiveView] = useState<"split" | "editor" | "preview">("split");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch draft on mount
  useEffect(() => {
    async function loadDraft() {
      try {
        setLoading(true);
        const res = await fetch(`/api/readmes/${id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error?.message || "Could not load profile draft");
        }
        const data = await res.json();
        const r = data.readme;
        setLogin(r.login);
        setTheme(r.theme || "minimal");
        setTone(r.tone || "professional");
        setSections(r.sections || []);
        if (r.sections?.[0]?.key) {
          setSelectedKey(r.sections[0].key);
        }
        setLastSavedAt(new Date(r.updatedAt || Date.now()));
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadDraft();
    }
  }, [id]);

  // Active section data
  const currentSection = useMemo(() => {
    return sections.find((s) => s.key === selectedKey) || sections[0];
  }, [sections, selectedKey]);

  // Assembled full markdown for live preview and export
  const fullMarkdown = useMemo(() => {
    return assemble(sections, theme);
  }, [sections, theme]);

  // Save changes to backend with 800ms debounce
  const triggerAutoSave = useCallback(
    (newSections: SectionItem[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/readmes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sections: newSections,
              theme,
              tone,
            }),
          });
          if (res.ok) {
            setLastSavedAt(new Date());
          }
        } catch (err) {
          console.error("Autosave error:", err);
        } finally {
          setIsSaving(false);
        }
      }, 800);
    },
    [id, theme, tone]
  );

  // Handle active section text edits
  const handleEditorChange = (newText: string) => {
    setSections((prev) => {
      const updated = prev.map((s) => {
        if (s.key === selectedKey) {
          return {
            ...s,
            markdown: newText,
            source: "user" as const, // Hand-edited by user
          };
        }
        return s;
      });
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Toggle section enabled
  const handleToggleEnabled = (key: SectionKey) => {
    setSections((prev) => {
      const updated = prev.map((s) => {
        if (s.key === key) {
          return {
            ...s,
            enabled: !s.enabled,
          };
        }
        return s;
      });
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Regenerate single section
  const handleRegenerateSection = async (key: SectionKey, targetTone: Tone) => {
    try {
      setIsRegenerating(true);
      const res = await fetch(`/api/readmes/${id}/sections/${key}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone: targetTone }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || "Regeneration failed");
      }

      const data = await res.json();
      if (data.section) {
        setSections((prev) =>
          prev.map((s) => (s.key === key ? data.section : s))
        );
        setLastSavedAt(new Date());
      }
    } catch (err: unknown) {
      alert(`Could not regenerate section: ${(err as Error).message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Quick copy full markdown
  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pt-14">
          <FiLoader className="w-6 h-6 animate-spin text-[#171815]" />
          <span className="font-mono text-xs text-[#65665F]">
            Loading workspace draft...
          </span>
        </div>
      </div>
    );
  }

  if (error || !sections.length) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-14 px-6">
          <div className="p-4 bg-[#FEE2E2] border border-[#DC2626]/30 rounded-[8px] flex items-center gap-3 text-xs text-[#DC2626] max-w-md">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <span>{error || "Draft not found"}</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="h-9 px-4 bg-[#171815] text-[#C5F467] font-semibold text-xs rounded-[6px] hover:bg-[#31322E] transition-colors"
          >
            Return to Generator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Header />

      <main className="w-full pt-14 flex-1 flex flex-col overflow-hidden h-[calc(100vh)]">
        {/* Top 48px Sub-Header */}
        <EditorTopBar
          login={login}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          activeView={activeView}
          onViewChange={setActiveView}
          onExport={() => setIsExportOpen(true)}
          onCopy={handleCopy}
          copied={copied}
        />

        {/* 3-Column Workspace Canvas */}
        <div className="flex-1 flex overflow-hidden w-full">
          {/* Column 1: Sections Manager (280px) */}
          <SectionsManager
            sections={sections}
            selectedKey={selectedKey}
            onSelectSection={setSelectedKey}
            onToggleEnabled={handleToggleEnabled}
            onRegenerateSection={handleRegenerateSection}
            isRegenerating={isRegenerating}
          />

          {/* Column 2: Code Editor Pane */}
          {(activeView === "split" || activeView === "editor") && (
            <MarkdownEditor
              value={currentSection?.markdown || ""}
              onChange={handleEditorChange}
              sectionTitle={currentSection?.key}
            />
          )}

          {/* Column 3: Live Preview Pane */}
          {(activeView === "split" || activeView === "preview") && (
            <MarkdownPreview markdown={fullMarkdown} />
          )}
        </div>
      </main>

      {/* Export Modal Dialog */}
      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        markdown={fullMarkdown}
        login={login}
      />
    </div>
  );
}
