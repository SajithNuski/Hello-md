"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiEye } from "react-icons/fi";

interface MarkdownPreviewProps {
  markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  return (
    <div className="flex-1 bg-page flex flex-col overflow-hidden">
      {/* Header Tab */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-surface select-none">
        <div className="flex items-center gap-2 text-text-secondary">
          <FiEye className="w-4 h-4 stroke-[1.5]" />
          <span className="text-nav font-medium text-text-primary">Rendered Output</span>
          <span className="font-mono text-eyebrow bg-surface-raised px-1.5 py-0.2 rounded-sm border border-border text-text-secondary uppercase tracking-[0.04em]">
            README.md
          </span>
        </div>
        <div className="flex items-center gap-2 text-meta text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
          <span>Live Synchronized</span>
        </div>
      </div>

      {/* Canvas Scroll Container */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto flex justify-center">
        {/* GitHub Style Card */}
        <div className="w-full max-w-[760px] bg-surface-raised rounded-md p-8 sm:p-10 border border-border shadow-xs flex flex-col gap-6 text-text-primary leading-relaxed h-fit">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <div className="flex flex-col pb-3 border-b border-border mt-2 mb-4">
                  <h1 className="text-2xl sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.15] text-text-primary">
                    {children}
                  </h1>
                </div>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-text-primary pb-2 border-b border-border/70 mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-card font-medium tracking-[-0.02em] text-text-primary mt-4 mb-2">
                  {children}
                </h3>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-accent bg-surface px-4 py-3 rounded-r-sm text-text-secondary text-body my-3 italic leading-[1.65]">
                  {children}
                </blockquote>
              ),
              p: ({ children }) => (
                <p className="text-body leading-[1.65] text-text-primary my-2">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 my-2 space-y-1.5 text-body leading-[1.65]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 my-2 space-y-1.5 text-body leading-[1.65]">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="text-body text-text-primary">{children}</li>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0969DA] hover:underline font-medium inline-flex items-center gap-0.5"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt || "badge"}
                  className="inline-block mr-1.5 my-1 rounded-sm shadow-xs"
                />
              ),
              code: ({ children }) => (
                <code className="bg-surface text-text-primary px-1.5 py-0.5 rounded-sm font-mono text-meta border border-border">
                  {children}
                </code>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
