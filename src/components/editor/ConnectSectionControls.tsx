"use client";

import { useState } from "react";
import {
  SocialConfig,
  normalizeSocialUrl,
  validateSocialField,
} from "@/lib/socialConfig";
import {
  FiShare2,
  FiLinkedin,
  FiTwitter,
  FiGlobe,
  FiMail,
  FiPlus,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";

interface ConnectSectionControlsProps {
  config: SocialConfig;
  onChange: (updated: SocialConfig) => void;
}

export function ConnectSectionControls({
  config,
  onChange,
}: ConnectSectionControlsProps) {
  // Local blur states to trigger inline validation errors gracefully
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Fixed fields handlers
  const handleLinkedinChange = (val: string) => {
    onChange({ ...config, linkedin: val });
  };

  const handleLinkedinBlur = () => {
    markTouched("linkedin");
    if (config.linkedin) {
      const normalized = normalizeSocialUrl("linkedin", config.linkedin);
      if (normalized !== config.linkedin) {
        onChange({ ...config, linkedin: normalized });
      }
    }
  };

  const handleLinkedinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (pasted) {
      e.preventDefault();
      const normalized = normalizeSocialUrl("linkedin", pasted);
      onChange({ ...config, linkedin: normalized });
      markTouched("linkedin");
    }
  };

  const handleXChange = (val: string) => {
    onChange({ ...config, x: val });
  };

  const handleXBlur = () => {
    markTouched("x");
    if (config.x) {
      const normalized = normalizeSocialUrl("x", config.x);
      if (normalized !== config.x) {
        onChange({ ...config, x: normalized });
      }
    }
  };

  const handleXPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (pasted) {
      e.preventDefault();
      const normalized = normalizeSocialUrl("x", pasted);
      onChange({ ...config, x: normalized });
      markTouched("x");
    }
  };

  const handlePortfolioChange = (val: string) => {
    onChange({ ...config, portfolio: val });
  };

  const handlePortfolioBlur = () => {
    markTouched("portfolio");
  };

  const handleEmailChange = (val: string) => {
    onChange({ ...config, email: val });
  };

  const handleEmailBlur = () => {
    markTouched("email");
  };

  // Extra links handlers
  const handleAddExtra = () => {
    const current = config.extra || [];
    if (current.length >= 8) return;
    onChange({
      ...config,
      extra: [...current, { label: "", url: "" }],
    });
  };

  const handleExtraChange = (index: number, field: "label" | "url", val: string) => {
    const updated = (config.extra || []).map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onChange({ ...config, extra: updated });
  };

  const handleRemoveExtra = (index: number) => {
    const updated = (config.extra || []).filter((_, idx) => idx !== index);
    onChange({ ...config, extra: updated });
  };

  // Field validations
  const linkedinValidation = validateSocialField("url", config.linkedin);
  const xValidation = validateSocialField("url", config.x);
  const portfolioValidation = validateSocialField("url", config.portfolio);
  const emailValidation = validateSocialField("email", config.email);

  const extraCount = config.extra?.length || 0;
  const canAddExtra = extraCount < 8;

  return (
    <div className="flex flex-col gap-3.5 p-3 bg-surface-raised/40 border border-border/80 rounded-md text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiShare2 className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-eyebrow font-semibold uppercase text-text-primary">
            Connect & Social Links
          </span>
        </div>
      </div>

      {/* 4 Fixed Fields */}
      <div className="flex flex-col gap-2.5">
        {/* 1. LinkedIn */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FiLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
              LinkedIn
            </span>
            <span className="text-[10px] text-text-muted">Username or URL</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.linkedin || ""}
              onChange={(e) => handleLinkedinChange(e.target.value)}
              onBlur={handleLinkedinBlur}
              onPaste={handleLinkedinPaste}
              placeholder="https://linkedin.com/in/your-username"
              className={`w-full h-8 px-2.5 bg-surface border rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                touched.linkedin && !linkedinValidation.isValid && config.linkedin.trim()
                  ? "border-status-error focus:border-status-error"
                  : "border-border focus:border-border-hover"
              }`}
            />
          </div>
          {touched.linkedin && !linkedinValidation.isValid && config.linkedin.trim() && (
            <span className="text-[10px] text-status-error flex items-center gap-1">
              <FiAlertCircle className="w-2.5 h-2.5 shrink-0" />
              {linkedinValidation.error}
            </span>
          )}
        </div>

        {/* 2. X (Twitter) */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FiTwitter className="w-3.5 h-3.5 text-text-primary" />
              X (Twitter)
            </span>
            <span className="text-[10px] text-text-muted">Handle or URL</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.x || ""}
              onChange={(e) => handleXChange(e.target.value)}
              onBlur={handleXBlur}
              onPaste={handleXPaste}
              placeholder="https://x.com/your-handle"
              className={`w-full h-8 px-2.5 bg-surface border rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                touched.x && !xValidation.isValid && config.x.trim()
                  ? "border-status-error focus:border-status-error"
                  : "border-border focus:border-border-hover"
              }`}
            />
          </div>
          {touched.x && !xValidation.isValid && config.x.trim() && (
            <span className="text-[10px] text-status-error flex items-center gap-1">
              <FiAlertCircle className="w-2.5 h-2.5 shrink-0" />
              {xValidation.error}
            </span>
          )}
        </div>

        {/* 3. Portfolio / Website */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FiGlobe className="w-3.5 h-3.5 text-[#FF5722]" />
              Portfolio / Website
            </span>
            <span className="text-[10px] text-text-muted">Must start with https://</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.portfolio || ""}
              onChange={(e) => handlePortfolioChange(e.target.value)}
              onBlur={handlePortfolioBlur}
              placeholder="https://your-site.com"
              className={`w-full h-8 px-2.5 bg-surface border rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                touched.portfolio && !portfolioValidation.isValid && config.portfolio.trim()
                  ? "border-status-error focus:border-status-error"
                  : "border-border focus:border-border-hover"
              }`}
            />
          </div>
          {touched.portfolio && !portfolioValidation.isValid && config.portfolio.trim() && (
            <span className="text-[10px] text-status-error flex items-center gap-1">
              <FiAlertCircle className="w-2.5 h-2.5 shrink-0" />
              {portfolioValidation.error}
            </span>
          )}
        </div>

        {/* 4. Email */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-eyebrow text-text-secondary flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FiMail className="w-3.5 h-3.5 text-[#D14836]" />
              Email
            </span>
            <span className="text-[10px] text-text-muted">Must contain @</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={config.email || ""}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="you@example.com"
              className={`w-full h-8 px-2.5 bg-surface border rounded text-xs text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                touched.email && !emailValidation.isValid && config.email.trim()
                  ? "border-status-error focus:border-status-error"
                  : "border-border focus:border-border-hover"
              }`}
            />
          </div>
          {touched.email && !emailValidation.isValid && config.email.trim() && (
            <span className="text-[10px] text-status-error flex items-center gap-1">
              <FiAlertCircle className="w-2.5 h-2.5 shrink-0" />
              {emailValidation.error}
            </span>
          )}
        </div>
      </div>

      {/* Extra Links Area */}
      <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="font-mono text-eyebrow text-text-secondary uppercase">
            Extra Links ({extraCount}/8)
          </label>
        </div>

        {/* Compact Scrollable Extra Links List: max-height: 200px; overflow-y: auto */}
        {extraCount > 0 && (
          <div
            className="flex flex-col gap-2 max-h-[200px] overflow-y-auto thin-scrollbar p-1.5 bg-surface/40 border border-border/80 rounded"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {config.extra.map((item, index) => {
              const urlValidation = validateSocialField("url", item.url);
              const isLabelMissing = Boolean(item.url.trim()) && !item.label.trim();

              return (
                <div key={index} className="flex flex-col gap-1 p-1.5 bg-surface rounded border border-border/70">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleExtraChange(index, "label", e.target.value)}
                      onBlur={() => markTouched(`extra_label_${index}`)}
                      placeholder="Label (e.g. Behance)"
                      className={`w-28 shrink-0 h-7 px-2 bg-surface-raised border rounded text-[11px] text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                        touched[`extra_label_${index}`] && isLabelMissing
                          ? "border-status-error focus:border-status-error"
                          : "border-border focus:border-border-hover"
                      }`}
                    />

                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => handleExtraChange(index, "url", e.target.value)}
                      onBlur={() => markTouched(`extra_url_${index}`)}
                      placeholder="https://behance.net/your-username"
                      className={`flex-1 min-w-0 h-7 px-2 bg-surface-raised border rounded text-[11px] text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                        touched[`extra_url_${index}`] && !urlValidation.isValid && item.url.trim()
                          ? "border-status-error focus:border-status-error"
                          : "border-border focus:border-border-hover"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(index)}
                      className="w-6 h-7 flex items-center justify-center text-text-muted hover:text-status-error p-0.5 rounded hover:bg-surface-raised transition-colors shrink-0 cursor-pointer"
                      title="Remove extra link"
                      aria-label="Remove link"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Inline errors */}
                  {touched[`extra_url_${index}`] && !urlValidation.isValid && item.url.trim() && (
                    <span className="text-[10px] text-status-error flex items-center gap-1 pl-1">
                      <FiAlertCircle className="w-2.5 h-2.5 shrink-0" />
                      {urlValidation.error}
                    </span>
                  )}
                  {touched[`extra_label_${index}`] && isLabelMissing && (
                    <span className="text-[10px] text-status-error flex items-center gap-1 pl-1">
                      <FiAlertCircle className="w-2.5 h-2.5 shrink-0" />
                      Label is required
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Extra Link Button (Hidden when limit of 8 is reached) */}
        {canAddExtra && (
          <button
            type="button"
            onClick={handleAddExtra}
            className="h-8 px-3 rounded border border-dashed border-border hover:border-accent text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-mono"
          >
            <FiPlus className="w-3 h-3 text-accent" />
            <span>+ Add extra link</span>
          </button>
        )}

        {/* Hint when empty */}
        {!config.linkedin && !config.x && !config.portfolio && !config.email && extraCount === 0 && (
          <div className="p-2 rounded bg-surface/70 border border-border text-[11px] text-text-muted leading-tight mt-1">
            All fields empty. Sample links (LinkedIn, X, Portfolio, Email) will be generated as placeholders in README.
          </div>
        )}
      </div>
    </div>
  );
}
