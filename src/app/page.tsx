import { CheckCircle2, Terminal, ShieldCheck, Database, Layers, ArrowRight } from "lucide-react";
import { APP_CONFIG, SECTION_KEYS, TONES } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen bg-page text-text-primary p-6 md:p-12 max-w-5xl mx-auto flex flex-col gap-10">
      {/* Header bar */}
      <header className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-control bg-accent flex items-center justify-center font-mono font-bold text-text-primary text-14">
            #
          </div>
          <div>
            <h1 className="text-20 font-semibold tracking-tight">{APP_CONFIG.name}</h1>
            <p className="text-12 text-text-muted font-mono uppercase tracking-wider">
              Milestone 1: Foundation & Design System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-surface border border-border text-11 font-mono text-text-secondary uppercase">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            Milestone 1 Active
          </span>
        </div>
      </header>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-surface rounded-panel border border-border flex flex-col gap-2">
          <div className="flex items-center gap-2 text-text-secondary text-13 font-medium">
            <Layers className="w-4 h-4 text-text-primary" />
            <span>Architecture & Stack</span>
          </div>
          <div className="text-14 text-text-primary font-medium">Next.js 14 + React 18</div>
          <p className="text-12 text-text-muted">
            App Router with Tailwind CSS, Zod validation, and TypeScript.
          </p>
        </div>

        <div className="p-4 bg-surface rounded-panel border border-border flex flex-col gap-2">
          <div className="flex items-center gap-2 text-text-secondary text-13 font-medium">
            <Database className="w-4 h-4 text-text-primary" />
            <span>Database Layer</span>
          </div>
          <div className="text-14 text-text-primary font-medium">MongoDB Driver + Indexes</div>
          <p className="text-12 text-text-muted">
            7 collections defined with TTL caching, schema types, and CLI index runner.
          </p>
        </div>

        <div className="p-4 bg-surface rounded-panel border border-border flex flex-col gap-2">
          <div className="flex items-center gap-2 text-text-secondary text-13 font-medium">
            <ShieldCheck className="w-4 h-4 text-text-primary" />
            <span>Design Tokens</span>
          </div>
          <div className="text-14 text-text-primary font-medium">Developer Tool Precision</div>
          <p className="text-12 text-text-muted">
            Stitch-aligned 1px rules, electric lime accent, and Inter + JetBrains Mono.
          </p>
        </div>
      </section>

      {/* Design System Verification Playground */}
      <section className="p-6 bg-surface rounded-panel border border-border flex flex-col gap-6">
        <div>
          <h2 className="text-16 font-semibold">Design Tokens & Component Verification</h2>
          <p className="text-13 text-text-secondary mt-1">
            Verifying typography scales, button hierarchies, inputs, and accessible color contrast.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <label className="text-11 font-mono uppercase text-text-muted">Interactive Buttons (36px Height, 6px Radius)</label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="h-9 px-4 rounded-control bg-accent hover:bg-accent-hover text-text-primary font-medium text-13 transition-colors flex items-center gap-2 border border-transparent shadow-none"
            >
              <span>Primary Button</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="h-9 px-4 rounded-control bg-white hover:bg-surface text-text-primary font-medium text-13 transition-colors border border-border"
            >
              Secondary Button
            </button>

            <button
              type="button"
              className="h-9 px-4 rounded-control bg-transparent hover:bg-surface text-text-secondary hover:text-text-primary font-medium text-13 transition-colors"
            >
              Ghost Button
            </button>

            <button
              type="button"
              className="h-9 px-4 rounded-control bg-white text-status-error hover:bg-red-50 font-medium text-13 transition-colors border border-border"
            >
              Destructive
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-2">
          <label className="text-11 font-mono uppercase text-text-muted">Controls & Inputs</label>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <div className="flex items-center rounded-control border border-border bg-white overflow-hidden focus-within:border-focus focus-within:ring-2 focus-within:ring-accent/20 transition-all flex-1">
              <span className="px-3 text-text-muted font-mono text-13 border-r border-border bg-surface">
                @
              </span>
              <input
                type="text"
                placeholder="github_username"
                defaultValue="octocat"
                className="w-full px-3 py-2 text-13 font-mono text-text-primary placeholder:text-text-muted outline-none bg-transparent"
              />
            </div>
            <button
              type="button"
              className="h-9 px-4 rounded-control bg-accent hover:bg-accent-hover text-text-primary font-medium text-13 transition-colors shrink-0"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Badges & Chips */}
        <div className="flex flex-col gap-2">
          <label className="text-11 font-mono uppercase text-text-muted">Chips & Meta Tags</label>
          <div className="flex flex-wrap gap-2">
            {SECTION_KEYS.map((key) => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-0.5 rounded text-11 font-mono uppercase bg-white border border-border text-text-secondary"
              >
                {key}
              </span>
            ))}
            {TONES.map((tone) => (
              <span
                key={tone}
                className="inline-flex items-center px-2 py-0.5 rounded text-11 font-mono uppercase bg-accent/20 border border-accent text-text-primary font-medium"
              >
                {tone}
              </span>
            ))}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex flex-col gap-2">
          <label className="text-11 font-mono uppercase text-text-muted">Palette Swatches</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <div className="p-2.5 rounded-control bg-page border border-border text-11">
              <div className="font-mono font-medium">Page</div>
              <div className="text-text-muted font-mono">#FAFAF8</div>
            </div>
            <div className="p-2.5 rounded-control bg-surface border border-border text-11">
              <div className="font-mono font-medium">Surface</div>
              <div className="text-text-muted font-mono">#F0F0EC</div>
            </div>
            <div className="p-2.5 rounded-control bg-white border border-border text-11">
              <div className="font-mono font-medium">Raised</div>
              <div className="text-text-muted font-mono">#FFFFFF</div>
            </div>
            <div className="p-2.5 rounded-control bg-accent border border-accent-hover text-11 text-text-primary">
              <div className="font-mono font-medium">Accent</div>
              <div className="font-mono">#C5F467</div>
            </div>
            <div className="p-2.5 rounded-control bg-border text-11">
              <div className="font-mono font-medium text-text-primary">Border</div>
              <div className="text-text-secondary font-mono">#DEDFD8</div>
            </div>
            <div className="p-2.5 rounded-control bg-text-primary text-white text-11">
              <div className="font-mono font-medium">Dark Ink</div>
              <div className="text-gray-300 font-mono">#171815</div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Verification */}
      <footer className="p-4 bg-white rounded-panel border border-border flex items-center justify-between text-12 text-text-secondary">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-4 h-4 text-text-primary" />
          <span>npm run db:indexes to provision MongoDB Atlas indexes</span>
        </div>
        <div className="flex items-center gap-1.5 text-status-success font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Tokens Validated</span>
        </div>
      </footer>
    </main>
  );
}
