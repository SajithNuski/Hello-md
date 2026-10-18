"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye } from "lucide-react";

interface MarkdownPreviewProps {
  markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  return (
    <div className="flex-1 bg-[#F0F0EC] flex flex-col overflow-hidden">
      {/* Header Tab */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-[#DEDFD8] bg-[#F0F0EC] select-none">
        <div className="flex items-center gap-2 text-[#65665F]">
          <Eye className="w-4 h-4 stroke-[1.5]" />
          <span className="text-xs font-medium text-[#171815]">Rendered Output</span>
          <span className="font-mono text-[10px] bg-[#E2E3DD] px-1.5 py-0.2 rounded text-[#65665F]">
            README.md
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#65665F]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>Live Synchronized</span>
        </div>
      </div>

      {/* Canvas Scroll Container */}
      <div className="flex-1 p-6 overflow-y-auto flex justify-center">
        {/* GitHub Style Card */}
        <div className="w-full max-w-[760px] bg-[#FAFAF8] rounded-[8px] p-8 border border-[#DEDFD8] shadow-sm flex flex-col gap-5 text-[#171815] leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <div className="flex flex-col pb-2 border-b border-[#DEDFD8] mt-2 mb-4">
                  <h1 className="text-2xl font-bold tracking-tight text-[#171815]">
                    {children}
                  </h1>
                </div>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold tracking-tight text-[#171815] pb-1.5 border-b border-[#DEDFD8]/60 mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold tracking-tight text-[#171815] mt-4 mb-2">
                  {children}
                </h3>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#C5F467] bg-[#F0F0EC] px-4 py-2.5 rounded-r-[6px] text-[#65665F] text-sm my-3 italic">
                  {children}
                </blockquote>
              ),
              p: ({ children }) => <p className="text-sm text-[#171815] my-2 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-sm">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-sm">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-[#171815]">{children}</li>,
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
                  className="inline-block mr-1.5 my-1 rounded-[2px]"
                />
              ),
              code: ({ children }) => (
                <code className="bg-[#E2E3DD] text-[#171815] px-1.5 py-0.5 rounded font-mono text-xs">
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
