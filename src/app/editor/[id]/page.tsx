"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { SectionsManager } from "@/components/editor/SectionsManager";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";
import { ExportDialog } from "@/components/export/ExportDialog";
import { ByokDialog } from "@/components/system/ByokDialog";
import { SystemStateBanner, SystemStateType } from "@/components/system/SystemStateBanner";
import { SectionItem } from "@/lib/db/collections";
import { SectionKey, Tone } from "@/lib/config";
import { assemble } from "@/lib/assemble";
import { getByokHeaders } from "@/lib/byokClient";
import {
  IntroConfig,
  getDefaultIntroConfig,
  generateIntroMarkdown,
  parseIntroMarkdown,
} from "@/lib/introConfig";
import {
  AboutConfig,
  DEFAULT_ABOUT_CONFIG,
  getDefaultAboutConfig,
  generateAboutMarkdown,
} from "@/lib/aboutConfig";
import {
  StatsConfig,
  getDefaultStatsConfig,
  generateStatsMarkdown,
  parseStatsMarkdown,
} from "@/lib/statsConfig";
import {
  TechStackConfig,
  getDefaultSkillsConfig,
  generateSkillsMarkdown,
  parseSkillsMarkdown,
} from "@/lib/techStackConfig";
import {
  SocialConfig,
  getDefaultSocialConfig,
  generateContactMarkdown,
  parseContactMarkdown,
} from "@/lib/socialConfig";
import { FiLoader, FiAlertCircle, FiX } from "react-icons/fi";

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
  const [isByokOpen, setIsByokOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // System State Banner inside editor
  const [activeSystemState, setActiveSystemState] = useState<SystemStateType | null>(null);
  const [systemStatePayload, setSystemStatePayload] = useState<{
    retryAfterSeconds?: number;
    resetsAtFormatted?: string;
  }>({});

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial draft from API
  useEffect(() => {
    let mounted = true;

    async function loadDraft() {
      try {
        setLoading(true);
        const res = await fetch(`/api/readmes/${id}`);
        if (!res.ok) {
          throw new Error("Could not load README draft");
        }
        const data = await res.json();
        if (mounted && data.readme) {
          const doc = data.readme;
          setLogin(doc.login || "");
          setTheme(doc.theme || "minimal");
          setTone(doc.tone || "professional");
          const rawSections = (doc.sections || []) as SectionItem[];
          const userLogin = doc.login || "";
          const updatedSections = rawSections.map((s) => {
            if (s.key === "intro" && !s.config?.intro) {
              const parsed = s.markdown ? parseIntroMarkdown(s.markdown, userLogin) : null;
              const cfg = {
                ...getDefaultIntroConfig(userLogin),
                ...(parsed || {}),
              };
              return {
                ...s,
                config: {
                  ...(s.config || {}),
                  intro: cfg,
                },
              };
            }
            if (s.key === "about" && !s.config?.about) {
              const cfg = getDefaultAboutConfig(userLogin);
              return {
                ...s,
                markdown: s.markdown || generateAboutMarkdown(cfg),
                config: {
                  ...(s.config || {}),
                  about: cfg,
                },
              };
            }
            if (s.key === "stats" && !s.config?.stats) {
              const parsed = s.markdown ? parseStatsMarkdown(s.markdown) : null;
              const cfg = {
                ...getDefaultStatsConfig(userLogin),
                ...(parsed || {}),
              };
              return {
                ...s,
                markdown: s.markdown || generateStatsMarkdown(cfg, userLogin),
                config: {
                  ...(s.config || {}),
                  stats: cfg,
                },
              };
            }
            if (s.key === "skills" && !s.config?.skills) {
              const parsed = s.markdown ? parseSkillsMarkdown(s.markdown) : null;
              const cfg = {
                ...getDefaultSkillsConfig(),
                ...(parsed || {}),
              };
              return {
                ...s,
                markdown: s.markdown || generateSkillsMarkdown(cfg),
                config: {
                  ...(s.config || {}),
                  skills: cfg,
                },
              };
            }
            if (s.key === "contact" && !s.config?.contact && !s.config?.social) {
              const parsed = s.markdown ? parseContactMarkdown(s.markdown) : null;
              const cfg = {
                ...getDefaultSocialConfig(),
                ...(parsed || {}),
              };
              return {
                ...s,
                markdown: s.markdown || generateContactMarkdown(cfg),
                config: {
                  ...(s.config || {}),
                  contact: cfg,
                },
              };
            }
            return s;
          });
          setSections(updatedSections);
          if (updatedSections.length > 0) {
            setSelectedKey(updatedSections[0].key);
          }
          setLastSavedAt(new Date(doc.updatedAt || Date.now()));
        }
      } catch (err: unknown) {
        if (mounted) setError((err as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (id) {
      loadDraft();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  // Derive assembled full markdown string
  const fullMarkdown = useMemo(() => {
    return assemble(sections, theme);
  }, [sections, theme]);

  // Currently selected active section
  const currentSection = useMemo(() => {
    return sections.find((s) => s.key === selectedKey);
  }, [sections, selectedKey]);

  // Intro section & config
  const introSection = useMemo(() => {
    return sections.find((s) => s.key === "intro");
  }, [sections]);

  const introConfig: IntroConfig = useMemo(() => {
    if (introSection?.config?.intro) {
      return introSection.config.intro as IntroConfig;
    }
    const parsed = introSection ? parseIntroMarkdown(introSection.markdown, login) : null;
    return {
      ...getDefaultIntroConfig(login),
      ...(parsed || {}),
    };
  }, [introSection, login]);

  // About section & config
  const aboutSection = useMemo(() => {
    return sections.find((s) => s.key === "about");
  }, [sections]);

  const aboutConfig: AboutConfig = useMemo(() => {
    if (aboutSection?.config?.about) {
      return aboutSection.config.about as AboutConfig;
    }
    return getDefaultAboutConfig(login);
  }, [aboutSection, login]);

  // GitHub Analytics section & config
  const statsSection = useMemo(() => {
    return sections.find((s) => s.key === "stats");
  }, [sections]);

  const statsConfig: StatsConfig = useMemo(() => {
    if (statsSection?.config?.stats) {
      return statsSection.config.stats as StatsConfig;
    }
    const parsed = statsSection ? parseStatsMarkdown(statsSection.markdown) : null;
    return {
      ...getDefaultStatsConfig(login),
      ...(parsed || {}),
    };
  }, [statsSection, login]);

  // Tech Stack & Badges section & config
  const skillsSection = useMemo(() => {
    return sections.find((s) => s.key === "skills");
  }, [sections]);

  const techStackConfig: TechStackConfig = useMemo(() => {
    if (skillsSection?.config?.skills) {
      return skillsSection.config.skills as TechStackConfig;
    }
    const parsed = skillsSection ? parseSkillsMarkdown(skillsSection.markdown) : null;
    return {
      ...getDefaultSkillsConfig(),
      ...(parsed || {}),
    };
  }, [skillsSection]);

  // Connect & Social links section & config
  const contactSection = useMemo(() => {
    return sections.find((s) => s.key === "contact");
  }, [sections]);

  const socialConfig: SocialConfig = useMemo(() => {
    if (contactSection?.config?.contact) {
      return contactSection.config.contact as SocialConfig;
    }
    if (contactSection?.config?.social) {
      return contactSection.config.social as SocialConfig;
    }
    const parsed = contactSection ? parseContactMarkdown(contactSection.markdown) : null;
    return {
      ...getDefaultSocialConfig(),
      ...(parsed || {}),
    };
  }, [contactSection]);

  // Debounced auto-save triggers on edits
  const triggerAutoSave = useCallback(
    (newSections: SectionItem[]) => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }

      autosaveTimerRef.current = setTimeout(async () => {
        setIsSaving(true);
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
          const configUpdates: Record<string, unknown> = { ...(s.config || {}) };
          if (s.key === "skills") {
            const parsed = parseSkillsMarkdown(newText);
            configUpdates.skills = {
              ...getDefaultSkillsConfig(),
              ...(parsed || {}),
            };
          }
          if (s.key === "contact") {
            const parsed = parseContactMarkdown(newText);
            configUpdates.contact = {
              ...getDefaultSocialConfig(),
              ...(parsed || {}),
            };
          }
          return {
            ...s,
            markdown: newText,
            source: "user" as const, // Hand-edited by user
            config: configUpdates,
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

  // Handle intro section custom controls change
  const handleIntroConfigChange = useCallback(
    (newConfig: IntroConfig) => {
      const newMarkdown = generateIntroMarkdown(newConfig, login);
      setSections((prev) => {
        const updated = prev.map((s) => {
          if (s.key === "intro") {
            return {
              ...s,
              markdown: newMarkdown,
              source: "user" as const,
              config: {
                ...(s.config || {}),
                intro: newConfig,
              },
            };
          }
          return s;
        });
        triggerAutoSave(updated);
        return updated;
      });
    },
    [login, triggerAutoSave]
  );

  // Handle about section custom controls change
  const handleAboutConfigChange = useCallback(
    (newConfig: AboutConfig) => {
      const newMarkdown = generateAboutMarkdown(newConfig);
      setSections((prev) => {
        const updated = prev.map((s) => {
          if (s.key === "about") {
            return {
              ...s,
              markdown: newMarkdown,
              source: "user" as const,
              config: {
                ...(s.config || {}),
                about: newConfig,
              },
            };
          }
          return s;
        });
        triggerAutoSave(updated);
        return updated;
      });
    },
    [triggerAutoSave]
  );

  // Handle stats section custom controls change
  const handleStatsConfigChange = useCallback(
    (newConfig: StatsConfig) => {
      const newMarkdown = generateStatsMarkdown(newConfig, login);
      setSections((prev) => {
        const updated = prev.map((s) => {
          if (s.key === "stats") {
            return {
              ...s,
              markdown: newMarkdown,
              source: "user" as const,
              config: {
                ...(s.config || {}),
                stats: newConfig,
              },
            };
          }
          return s;
        });
        triggerAutoSave(updated);
        return updated;
      });
    },
    [login, triggerAutoSave]
  );

  // Handle tech stack section custom controls change
  const handleTechStackConfigChange = useCallback(
    (newConfig: TechStackConfig) => {
      const newMarkdown = generateSkillsMarkdown(newConfig);
      setSections((prev) => {
        const updated = prev.map((s) => {
          if (s.key === "skills") {
            return {
              ...s,
              markdown: newMarkdown,
              source: "user" as const,
              config: {
                ...(s.config || {}),
                skills: newConfig,
              },
            };
          }
          return s;
        });
        triggerAutoSave(updated);
        return updated;
      });
    },
    [triggerAutoSave]
  );

  // Handle contact section custom controls change
  const handleSocialConfigChange = useCallback(
    (newConfig: SocialConfig) => {
      const newMarkdown = generateContactMarkdown(newConfig);
      setSections((prev) => {
        const updated = prev.map((s) => {
          if (s.key === "contact") {
            return {
              ...s,
              markdown: newMarkdown,
              source: "user" as const,
              config: {
                ...(s.config || {}),
                contact: newConfig,
              },
            };
          }
          return s;
        });
        triggerAutoSave(updated);
        return updated;
      });
    },
    [triggerAutoSave]
  );

  // Handle reordering sections
  const handleMoveSection = useCallback(
    (key: SectionKey, direction: "up" | "down") => {
      setSections((prev) => {
        const index = prev.findIndex((s) => s.key === key);
        if (index === -1) return prev;
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= prev.length) return prev;

        const updated = [...prev];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);

        const reordered = updated.map((s, idx) => ({ ...s, order: idx }));
        triggerAutoSave(reordered);
        return reordered;
      });
    },
    [triggerAutoSave]
  );

  // Regenerate single section
  const handleRegenerateSection = async (key: SectionKey, targetTone: Tone) => {
    try {
      setIsRegenerating(true);
      setActiveSystemState(null);

      const byokHeaders = getByokHeaders();
      const res = await fetch(`/api/readmes/${id}/sections/${key}/regenerate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...byokHeaders,
        },
        body: JSON.stringify({ tone: targetTone }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const err = errJson?.error;

        if (res.status === 429 || err?.code === "QUOTA_EXCEEDED") {
          setActiveSystemState("quota");
          setSystemStatePayload({
            resetsAtFormatted: err?.resetTimeFormatted || "4h 12m",
          });
          return;
        }

        if (res.status === 503 || err?.code === "AI_BUSY") {
          setActiveSystemState("congestion");
          setSystemStatePayload({
            retryAfterSeconds: err?.retryAfter || 24,
          });
          return;
        }

        throw new Error(err?.message || "Regeneration failed");
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
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pt-16">
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
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-16 px-6">
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

      <main className="w-full pt-16 flex-1 flex flex-col overflow-hidden h-[calc(100vh)]">
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

        {/* System State Notice (if throttle/congestion occurred during single-section regen) */}
        {activeSystemState && (
          <div className="bg-[#141611] px-4 py-3 border-b border-[#2B2F23] relative z-20">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex-1">
                <SystemStateBanner
                  state={activeSystemState}
                  retryAfterSeconds={systemStatePayload.retryAfterSeconds}
                  resetsAtFormatted={systemStatePayload.resetsAtFormatted}
                  onOpenByok={() => setIsByokOpen(true)}
                  onDismiss={() => setActiveSystemState(null)}
                />
              </div>
              <button
                type="button"
                onClick={() => setActiveSystemState(null)}
                className="text-[#7A7E72] hover:text-white p-1 rounded hover:bg-white/5 transition-colors shrink-0"
                title="Dismiss"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 3-Column Workspace Canvas */}
        <div className="flex-1 flex overflow-hidden w-full">
          {/* Column 1: Sections Manager */}
          <SectionsManager
            sections={sections}
            selectedKey={selectedKey}
            onSelectSection={setSelectedKey}
            onToggleEnabled={handleToggleEnabled}
            onRegenerateSection={handleRegenerateSection}
            isRegenerating={isRegenerating}
            onMoveSection={handleMoveSection}
            introConfig={introConfig}
            onIntroConfigChange={handleIntroConfigChange}
            aboutConfig={aboutConfig}
            onAboutConfigChange={handleAboutConfigChange}
            statsConfig={statsConfig}
            onStatsConfigChange={handleStatsConfigChange}
            techStackConfig={techStackConfig}
            onTechStackConfigChange={handleTechStackConfigChange}
            socialConfig={socialConfig}
            onSocialConfigChange={handleSocialConfigChange}
            username={login}
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
            <MarkdownPreview markdown={fullMarkdown} username={login} />
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

      {/* BYOK Modal Dialog */}
      <ByokDialog
        isOpen={isByokOpen}
        onClose={() => setIsByokOpen(false)}
        onSaved={() => {
          setActiveSystemState(null);
        }}
      />
    </div>
  );
}
