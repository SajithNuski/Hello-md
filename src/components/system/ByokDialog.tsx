"use client";

import { useState, useEffect } from "react";
import { FiKey, FiLock, FiCheck, FiX, FiTrash2, FiExternalLink, FiEye, FiEyeOff } from "react-icons/fi";
import { SiGoogle, SiMeta } from "react-icons/si";
import { getByokConfig, setByokConfig, clearByokConfig, ClientByokConfig } from "@/lib/byokClient";

interface ByokDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (config: ClientByokConfig | null) => void;
}

export function ByokDialog({ isOpen, onClose, onSaved }: ByokDialogProps) {
  const [provider, setProvider] = useState<"groq" | "gemini">("groq");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const existing = getByokConfig();
      if (existing) {
        setProvider(existing.provider);
        setApiKey(existing.apiKey);
        setHasExisting(true);
      } else {
        setApiKey("");
        setHasExisting(false);
      }
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setStatusMsg("Please enter a valid API key.");
      return;
    }

    const config: ClientByokConfig = { provider, apiKey: cleanKey };
    setByokConfig(config);
    setHasExisting(true);
    setStatusMsg("API Key saved! Unmetered access activated.");
    onSaved?.(config);

    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    clearByokConfig();
    setApiKey("");
    setHasExisting(false);
    setStatusMsg("Custom API Key cleared. Standard quota restored.");
    onSaved?.(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#141611] border border-[#2A2E22] rounded-xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="byok-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#888C80] hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
          aria-label="Close dialog"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Dialog Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <FiKey className="w-4 h-4" />
          </div>
          <div>
            <h2 id="byok-title" className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <span>Bring Your Own Key</span>
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/40">
                Unmetered
              </span>
            </h2>
            <p className="text-xs text-[#95988D]">
              Bypass shared engine queues and daily generation quotas.
            </p>
          </div>
        </div>

        {/* Provider Selector Tabs */}
        <div className="mt-5 mb-4">
          <label className="text-xs font-mono uppercase tracking-wider text-[#7A7E72] block mb-2 font-medium">
            Select Provider
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0D0E0C] border border-[#24271D] rounded-lg">
            <button
              type="button"
              onClick={() => {
                setProvider("groq");
                setStatusMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                provider === "groq"
                  ? "bg-[#23271D] text-white border border-[#3A402D] shadow-xs"
                  : "text-[#888C80] hover:text-white hover:bg-white/5"
              }`}
            >
              <SiMeta className="w-3.5 h-3.5 text-[#C5F467]" />
              <span>Groq (Llama 3.3)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setProvider("gemini");
                setStatusMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                provider === "gemini"
                  ? "bg-[#23271D] text-white border border-[#3A402D] shadow-xs"
                  : "text-[#888C80] hover:text-white hover:bg-white/5"
              }`}
            >
              <SiGoogle className="w-3.5 h-3.5 text-[#C5F467]" />
              <span>Google Gemini</span>
            </button>
          </div>
        </div>

        {/* Key Input */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="byok-input" className="text-xs font-medium text-[#C0C3BA]">
              {provider === "groq" ? "Groq API Key" : "Gemini API Key"}
            </label>
            <a
              href={
                provider === "groq"
                  ? "https://console.groq.com/keys"
                  : "https://aistudio.google.com/app/apikey"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-accent hover:underline inline-flex items-center gap-1 font-mono"
            >
              <span>Get Free Key</span>
              <FiExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative flex items-center bg-[#0D0E0C] rounded-lg border border-[#2B2F23] focus-within:border-accent transition-colors">
            <input
              id="byok-input"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setStatusMsg(null);
              }}
              placeholder={provider === "groq" ? "gsk_..." : "AIzaSy..."}
              className="w-full bg-transparent px-3 py-2 text-xs font-mono text-white placeholder-[#505447] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="px-2.5 text-[#7A7E72] hover:text-white transition-colors"
              title={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Security & Privacy Notice */}
        <div className="p-3 bg-[#0D0E0C] border border-[#22251C] rounded-lg mb-5 flex items-start gap-2.5">
          <FiLock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#8E9285] leading-relaxed">
            <strong className="text-white font-medium">Zero-Storage Guarantee:</strong> Your key is stored
            strictly in your browser&apos;s LocalStorage and sent only over TLS request headers. It is never logged, stored in databases, or shared with third parties.
          </p>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="mb-4 text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded flex items-center gap-2">
            <FiCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#22251C]">
          <div>
            {hasExisting && (
              <button
                type="button"
                onClick={handleClear}
                className="h-8 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Remove Key</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3.5 bg-transparent hover:bg-white/5 text-[#888C80] hover:text-white rounded-md text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="h-8 px-4 bg-accent hover:bg-[#a8d94e] text-[#0D0E0C] font-semibold rounded-md text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <FiCheck className="w-3.5 h-3.5" />
              <span>Save &amp; Activate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
