"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { SectionsManager } from "@/components/editor/SectionsManager";
import { EditorPane } from "@/components/editor/EditorPane";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";
import { MobileBottomNav, EditorMobileTab } from "@/components/editor/MobileBottomNav";
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
import {
  ProjectCardItem,
} from "@/components/editor/ProjectsSectionControls";
import {
  getDefaultProjectsConfig,
  generateProjectsMarkdown,
  parseProjectsMarkdown,
} from "@/lib/projectsConfig";
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

  // View state: desktop view mode and mobile/tablet tab
  const [activeView, setActiveView] = useState<"split" | "editor" | "preview">("split");
  const [mobileTab, setMobileTab] = useState<EditorMobileTab>("editor");

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isByokOpen, setIsByokOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<SectionItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

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
            if (s.key === "projects" && !s.config?.projects) {
              const parsed = s.markdown ? parseProjectsMarkdown(s.markdown) : [];
              const cfg = parsed.length > 0 ? parsed : getDefaultProjectsConfig(userLogin);
              return {
                ...s,
                markdown: s.markdown || generateProjectsMarkdown(cfg, userLogin),
                config: {
                  ...(s.config || {}),
                  projects: cfg,
                },
              };
            }
            return s;
          });

          setSections(updatedSections);
          setHistory([updatedSections]);
          setHistoryIndex(0);

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

  // Stats section & config
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

  // Projects section & config
  const projectsSection = useMemo(() => {
    return sections.find((s) => s.key === "projects");
  }, [sections]);

  const projectsList: ProjectCardItem[] = useMemo(() => {
    if (projectsSection?.config?.projects && Array.isArray(projectsSection.config.projects)) {
      return projectsSection.config.projects as ProjectCardItem[];
    }
    const parsed = projectsSection ? parseProjectsMarkdown(projectsSection.markdown) : [];
    if (parsed.length > 0) return parsed;
    return getDefaultProjectsConfig(login);
  }, [projectsSection, login]);

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

  // Helper to update sections and record to undo/redo history
  const updateSectionsState = useCallback(
    (newSections: SectionItem[], pushToHistory = true) => {
      setSections(newSections);
      triggerAutoSave(newSections);

      if (pushToHistory) {
        setHistory((prevHistory) => {
          const trimmed = prevHistory.slice(0, historyIndex + 1);
          trimmed.push(newSections);
          if (trimmed.length > 40) trimmed.shift();
          return trimmed;
        });
        setHistoryIndex((prev) => Math.min(prev + 1, 39));
      }
    },
    [historyIndex, triggerAutoSave]
  );

  // Undo / Redo handlers
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevStep = history[historyIndex - 1];
      setHistoryIndex((idx) => idx - 1);
      setSections(prevStep);
      triggerAutoSave(prevStep);
    }
  }, [history, historyIndex, triggerAutoSave]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextStep = history[historyIndex + 1];
      setHistoryIndex((idx) => idx + 1);
      setSections(nextStep);
      triggerAutoSave(nextStep);
    }
  }, [history, historyIndex, triggerAutoSave]);

  // Global Undo / Redo keyboard shortcuts (Ctrl+Z, Ctrl+Y / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if inside CodeMirror (CodeMirror handles its own internal text undo)
      const target = e.target as HTMLElement;
      if (target?.closest?.(".cm-editor")) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Handle section selection (with mobile tab switch to editor)
  const handleSelectSection = useCallback((key: SectionKey) => {
    setSelectedKey(key);
    setMobileTab("editor");
  }, []);

  // Handle active section raw text edits
  const handleEditorChange = (newText: string) => {
    const updated = sections.map((s) => {
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
        if (s.key === "projects") {
          const parsed = parseProjectsMarkdown(newText);
          if (parsed.length > 0) {
            configUpdates.projects = parsed;
          }
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

    updateSectionsState(updated, false); // Debounce saves, avoid spamming history on each keystroke
  };

  // Toggle section enabled
  const handleToggleEnabled = (key: SectionKey) => {
    const updated = sections.map((s) => {
      if (s.key === key) {
        return {
          ...s,
          enabled: !s.enabled,
        };
      }
      return s;
    });
    updateSectionsState(updated);
  };

  // Handle intro section custom controls change
  const handleIntroConfigChange = useCallback(
    (newConfig: IntroConfig) => {
      const newMarkdown = generateIntroMarkdown(newConfig, login);
      const updated = sections.map((s) => {
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
      updateSectionsState(updated);
    },
    [login, sections, updateSectionsState]
  );

  // Handle about section custom controls change
  const handleAboutConfigChange = useCallback(
    (newConfig: AboutConfig) => {
      const newMarkdown = generateAboutMarkdown(newConfig);
      const updated = sections.map((s) => {
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
      updateSectionsState(updated);
    },
    [sections, updateSectionsState]
  );

  // Handle stats section custom controls change
  const handleStatsConfigChange = useCallback(
    (newConfig: StatsConfig) => {
      const newMarkdown = generateStatsMarkdown(newConfig, login);
      const updated = sections.map((s) => {
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
      updateSectionsState(updated);
    },
    [login, sections, updateSectionsState]
  );

  // Handle tech stack section custom controls change
  const handleTechStackConfigChange = useCallback(
    (newConfig: TechStackConfig) => {
      const newMarkdown = generateSkillsMarkdown(newConfig);
      const updated = sections.map((s) => {
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
      updateSectionsState(updated);
    },
    [sections, updateSectionsState]
  );

  // Handle contact section custom controls change
  const handleSocialConfigChange = useCallback(
    (newConfig: SocialConfig) => {
      const newMarkdown = generateContactMarkdown(newConfig);
      const updated = sections.map((s) => {
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
      updateSectionsState(updated);
    },
    [sections, updateSectionsState]
  );

  // Handle projects section custom controls change
  const handleProjectsListChange = useCallback(
    (newProjects: ProjectCardItem[]) => {
      const newMarkdown = generateProjectsMarkdown(newProjects, login);
      const updated = sections.map((s) => {
        if (s.key === "projects") {
          return {
            ...s,
            markdown: newMarkdown,
            source: "user" as const,
            config: {
              ...(s.config || {}),
              projects: newProjects,
            },
          };
        }
        return s;
      });
      updateSectionsState(updated);
    },
    [login, sections, updateSectionsState]
  );

  // Reset current section to its default configuration
  const handleResetSection = useCallback(() => {
    const updated = sections.map((s) => {
      if (s.key === selectedKey) {
        if (s.key === "intro") {
          const cfg = getDefaultIntroConfig(login);
          return {
            ...s,
            markdown: generateIntroMarkdown(cfg, login),
            source: "ai" as const,
            config: { ...(s.config || {}), intro: cfg },
          };
        }
        if (s.key === "about") {
          const cfg = getDefaultAboutConfig(login);
          return {
            ...s,
            markdown: generateAboutMarkdown(cfg),
            source: "ai" as const,
            config: { ...(s.config || {}), about: cfg },
          };
        }
        if (s.key === "skills") {
          const cfg = getDefaultSkillsConfig();
          return {
            ...s,
            markdown: generateSkillsMarkdown(cfg),
            source: "ai" as const,
            config: { ...(s.config || {}), skills: cfg },
          };
        }
        if (s.key === "stats") {
          const cfg = getDefaultStatsConfig(login);
          return {
            ...s,
            markdown: generateStatsMarkdown(cfg, login),
            source: "ai" as const,
            config: { ...(s.config || {}), stats: cfg },
          };
        }
        if (s.key === "contact") {
          const cfg = getDefaultSocialConfig();
          return {
            ...s,
            markdown: generateContactMarkdown(cfg),
            source: "ai" as const,
            config: { ...(s.config || {}), contact: cfg },
          };
        }
        if (s.key === "projects") {
          const cfg = getDefaultProjectsConfig(login);
          return {
            ...s,
            markdown: generateProjectsMarkdown(cfg, login),
            source: "ai" as const,
            config: { ...(s.config || {}), projects: cfg },
          };
        }
      }
      return s;
    });

    updateSectionsState(updated);
  }, [selectedKey, login, sections, updateSectionsState]);

  // Handle reordering sections
  const handleMoveSection = useCallback(
    (key: SectionKey, direction: "up" | "down") => {
      const index = sections.findIndex((s) => s.key === key);
      if (index === -1) return;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return;

      const updated = [...sections];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);

      const reordered = updated.map((s, idx) => ({ ...s, order: idx }));
      updateSectionsState(reordered);
    },
    [sections, updateSectionsState]
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
        const updated = sections.map((s) => (s.key === key ? data.section : s));
        updateSectionsState(updated);
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
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <FiLoader className="w-6 h-6 animate-spin text-[#171815]" />
          <span className="font-mono text-sm text-[#52534C]">
            Loading workspace draft...
          </span>
        </div>
      </div>
    );
  }

  if (error || !sections.length) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div className="p-4 bg-[#FEE2E2] border border-[#DC2626]/30 rounded-lg flex items-center gap-3 text-sm text-[#DC2626] max-w-md">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <span>{error || "Draft not found"}</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="h-10 px-5 bg-[#171815] text-[#FAFAF8] font-semibold text-sm rounded-lg hover:bg-[#31322E] transition-colors cursor-pointer"
          >
            Return to Generator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#FAFAF8] flex flex-col select-none">
      {/* 1. Slim Sticky Top Bar (52px) */}
      <EditorTopBar
        login={login}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        activeView={activeView}
        onViewChange={setActiveView}
        mobileTab={mobileTab}
        onMobileTabChange={setMobileTab}
        onExport={() => setIsExportOpen(true)}
        onCopy={handleCopy}
        copied={copied}
      />

      {/* System State Notice (if throttle/congestion occurred during single-section regen) */}
      {activeSystemState && (
        <div className="bg-[#141611] px-4 py-3 border-b border-[#2B2F23] relative z-20 shrink-0">
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
              className="text-[#7A7E72] hover:text-white p-1 rounded hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
              title="Dismiss"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. 3-Pane Workspace: Zero page scrolling, each pane scrolls independently */}
      <main className="flex-1 min-h-0 flex overflow-hidden relative w-full pb-14 sm:pb-0">
        {/* Pane 1: Sections List (260px fixed width on desktop, full width on mobile when selected) */}
        <div
          className={`h-full shrink-0 ${
            mobileTab === "sections" ? "flex flex-1 w-full" : "hidden"
          } lg:flex lg:w-[260px] lg:min-w-[260px] lg:max-w-[260px]`}
        >
          <SectionsManager
            sections={sections}
            selectedKey={selectedKey}
            onSelectSection={handleSelectSection}
            onToggleEnabled={handleToggleEnabled}
            onMoveSection={handleMoveSection}
          />
        </div>

        {/* Pane 2: Editor Pane (Visual Form / Markdown raw editor) */}
        <div
          className={`h-full min-w-0 ${
            mobileTab === "editor" ? "flex flex-1 w-full" : "hidden"
          } ${
            activeView === "split" || activeView === "editor"
              ? "lg:flex lg:flex-1"
              : "lg:hidden"
          }`}
        >
          {currentSection && (
            <EditorPane
              currentSection={currentSection}
              markdown={currentSection.markdown || ""}
              onMarkdownChange={handleEditorChange}
              introConfig={introConfig}
              onIntroConfigChange={handleIntroConfigChange}
              aboutConfig={aboutConfig}
              onAboutConfigChange={handleAboutConfigChange}
              techStackConfig={techStackConfig}
              onTechStackConfigChange={handleTechStackConfigChange}
              statsConfig={statsConfig}
              onStatsConfigChange={handleStatsConfigChange}
              socialConfig={socialConfig}
              onSocialConfigChange={handleSocialConfigChange}
              projectsList={projectsList}
              onProjectsListChange={handleProjectsListChange}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onResetSection={handleResetSection}
              onRegenerateSection={handleRegenerateSection}
              isRegenerating={isRegenerating}
              currentTone={tone}
              username={login}
            />
          )}
        </div>

        {/* Pane 3: Live Preview Pane */}
        <div
          className={`h-full min-w-0 ${
            mobileTab === "preview" ? "flex flex-1 w-full" : "hidden"
          } ${
            activeView === "split" || activeView === "preview"
              ? "lg:flex lg:flex-1"
              : "lg:hidden"
          }`}
        >
          <MarkdownPreview
            markdown={fullMarkdown}
            username={login}
            selectedKey={selectedKey}
            onSelectSection={handleSelectSection}
          />
        </div>
      </main>

      {/* 3. Mobile Bottom Tab Bar (< 640px) */}
      <MobileBottomNav
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        activeSectionsCount={sections.filter((s) => s.enabled).length}
        totalSectionsCount={sections.length}
      />

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
