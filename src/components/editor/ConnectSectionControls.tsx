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
    <div className="flex flex-col gap-4 p-5 bg-[#FFFFFF] border border-[#E2E3DC] rounded-lg text-sm text-[#171815]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E3DC]">
        <div>
          <h3 className="text-base font-semibold text-[#171815] flex items-center gap-2">
            <FiShare2 className="w-4 h-4 text-accent" />
            Connect & Social Links
          </h3>
          <p className="text-xs text-[#52534C] mt-0.5">
            Configure social profile links and custom URLs rendered as badges.
          </p>
        </div>
      </div>

      {/* 4 Fixed Fields */}
      <div className="flex flex-col gap-3.5">
        {/* 1. LinkedIn */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#171815] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiLinkedin className="w-4 h-4 text-[#0A66C2]" />
              LinkedIn
            </span>
            <span className="text-xs text-[#52534C]">Username or full URL</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.linkedin || ""}
              onChange={(e) => handleLinkedinChange(e.target.value)}
              onBlur={handleLinkedinBlur}
              onPaste={handleLinkedinPaste}
              placeholder="https://linkedin.com/in/your-username"
              className={`w-full h-10 px-3 bg-[#FFFFFF] border rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none transition-colors ${
                touched.linkedin && !linkedinValidation.isValid && config.linkedin.trim()
                  ? "border-[#DC2626] focus:border-[#DC2626]"
                  : "border-[#DEDFD8] focus:border-[#171815]"
              }`}
            />
          </div>
          {touched.linkedin && !linkedinValidation.isValid && config.linkedin.trim() && (
            <span className="text-xs text-[#DC2626] flex items-center gap-1">
              <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
              {linkedinValidation.error}
            </span>
          )}
        </div>

        {/* 2. X (Twitter) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#171815] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiTwitter className="w-4 h-4 text-[#171815]" />
              X (Twitter)
            </span>
            <span className="text-xs text-[#52534C]">Handle or full URL</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.x || ""}
              onChange={(e) => handleXChange(e.target.value)}
              onBlur={handleXBlur}
              onPaste={handleXPaste}
              placeholder="https://x.com/your-handle"
              className={`w-full h-10 px-3 bg-[#FFFFFF] border rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none transition-colors ${
                touched.x && !xValidation.isValid && config.x.trim()
                  ? "border-[#DC2626] focus:border-[#DC2626]"
                  : "border-[#DEDFD8] focus:border-[#171815]"
              }`}
            />
          </div>
          {touched.x && !xValidation.isValid && config.x.trim() && (
            <span className="text-xs text-[#DC2626] flex items-center gap-1">
              <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
              {xValidation.error}
            </span>
          )}
        </div>

        {/* 3. Portfolio / Website */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#171815] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiGlobe className="w-4 h-4 text-[#FF5722]" />
              Portfolio / Website
            </span>
            <span className="text-xs text-[#52534C]">Must start with https://</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.portfolio || ""}
              onChange={(e) => handlePortfolioChange(e.target.value)}
              onBlur={handlePortfolioBlur}
              placeholder="https://your-site.com"
              className={`w-full h-10 px-3 bg-[#FFFFFF] border rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none transition-colors ${
                touched.portfolio && !portfolioValidation.isValid && config.portfolio.trim()
                  ? "border-[#DC2626] focus:border-[#DC2626]"
                  : "border-[#DEDFD8] focus:border-[#171815]"
              }`}
            />
          </div>
          {touched.portfolio && !portfolioValidation.isValid && config.portfolio.trim() && (
            <span className="text-xs text-[#DC2626] flex items-center gap-1">
              <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
              {portfolioValidation.error}
            </span>
          )}
        </div>

        {/* 4. Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#171815] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiMail className="w-4 h-4 text-[#D14836]" />
              Email
            </span>
            <span className="text-xs text-[#52534C]">Must be a valid email</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={config.email || ""}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="you@example.com"
              className={`w-full h-10 px-3 bg-[#FFFFFF] border rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none transition-colors ${
                touched.email && !emailValidation.isValid && config.email.trim()
                  ? "border-[#DC2626] focus:border-[#DC2626]"
                  : "border-[#DEDFD8] focus:border-[#171815]"
              }`}
            />
          </div>
          {touched.email && !emailValidation.isValid && config.email.trim() && (
            <span className="text-xs text-[#DC2626] flex items-center gap-1">
              <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
              {emailValidation.error}
            </span>
          )}
        </div>
      </div>

      {/* Extra Links Area */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#E2E3DC]">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#171815]">
            Extra Links ({extraCount} of 8 max)
          </label>
          <span className="text-xs text-[#52534C]">
            Custom badges for YouTube, Medium, Dev.to, etc.
          </span>
        </div>

        {/* Extra rows */}
        {extraCount > 0 && (
          <div className="flex flex-col gap-2.5">
            {config.extra.map((item, index) => {
              const urlValidation = validateSocialField("url", item.url);
              const isLabelMissing = !item.label.trim();

              return (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleExtraChange(index, "label", e.target.value)}
                      onBlur={() => markTouched(`extra_label_${index}`)}
                      placeholder="Label (e.g. Behance)"
                      className={`w-36 shrink-0 h-10 px-3 bg-[#FFFFFF] border rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none transition-colors ${
                        touched[`extra_label_${index}`] && isLabelMissing
                          ? "border-[#DC2626] focus:border-[#DC2626]"
                          : "border-[#DEDFD8] focus:border-[#171815]"
                      }`}
                    />

                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => handleExtraChange(index, "url", e.target.value)}
                      onBlur={() => markTouched(`extra_url_${index}`)}
                      placeholder="https://behance.net/your-username"
                      className={`flex-1 min-w-0 h-10 px-3 bg-[#FFFFFF] border rounded-lg text-sm text-[#171815] placeholder:text-[#91928A] focus:outline-none transition-colors ${
                        touched[`extra_url_${index}`] && !urlValidation.isValid && item.url.trim()
                          ? "border-[#DC2626] focus:border-[#DC2626]"
                          : "border-[#DEDFD8] focus:border-[#171815]"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(index)}
                      className="w-10 h-10 flex items-center justify-center text-[#52534C] hover:text-[#DC2626] rounded-lg hover:bg-[#FEE2E2] transition-colors shrink-0 cursor-pointer"
                      title="Remove extra link"
                      aria-label="Remove link"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Inline errors */}
                  {touched[`extra_url_${index}`] && !urlValidation.isValid && item.url.trim() && (
                    <span className="text-xs text-[#DC2626] flex items-center gap-1 pl-1">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {urlValidation.error}
                    </span>
                  )}
                  {touched[`extra_label_${index}`] && isLabelMissing && (
                    <span className="text-xs text-[#DC2626] flex items-center gap-1 pl-1">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
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
            className="h-10 px-4 rounded-lg border border-dashed border-[#DEDFD8] hover:border-[#171815] bg-[#FBFBFA] hover:bg-[#F0F1EA] text-[#171815] flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm font-medium"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add extra link ({extraCount}/8)</span>
          </button>
        )}

        {/* Hint when empty */}
        {!config.linkedin && !config.x && !config.portfolio && !config.email && extraCount === 0 && (
          <div className="p-3 rounded-lg bg-[#FBFBFA] border border-[#E2E3DC] text-xs text-[#52534C] leading-relaxed">
            All fields empty. Sample links (LinkedIn, X, Portfolio, Email) will be generated as placeholders in README.
          </div>
        )}
      </div>
    </div>
  );
}
