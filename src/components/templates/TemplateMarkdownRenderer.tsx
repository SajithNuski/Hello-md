"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { SafeMarkdownImage } from "./SafeMarkdownImage";

interface ExtraAttributes {
  align?: string;
  vAlign?: string;
  valign?: string;
  width?: string | number;
  height?: string | number;
  src?: string;
  alt?: string;
}

interface TemplateMarkdownRendererProps {
  markdown: string;
  mode?: "thumbnail" | "modal";
  theme?: "dark" | "light";
}

export function TemplateMarkdownRenderer({
  markdown,
  mode = "modal",
  theme = "dark",
}: TemplateMarkdownRendererProps) {
  const isDark = theme === "dark";
  const isThumbnail = mode === "thumbnail";

  return (
    <div
      className={`w-full ${
        isThumbnail
          ? "text-[10px] leading-tight select-none pointer-events-none"
          : "text-[13px] sm:text-[14px] leading-relaxed"
      } ${
        isDark ? "text-[#E6EDF3]" : "text-[#1F2328]"
      } markdown-body overflow-hidden transition-colors duration-200`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1
              className={`${
                isThumbnail
                  ? "text-xs font-bold pb-1 border-b my-1"
                  : "text-2xl sm:text-3xl font-semibold tracking-tight pb-2 border-b mt-2 mb-3 leading-[1.25]"
              } ${isDark ? "border-[#30363D]" : "border-[#D0D7DE]"}`}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={`${
                isThumbnail
                  ? "text-[11px] font-bold pb-0.5 border-b my-1.5"
                  : "text-xl sm:text-2xl font-semibold tracking-tight pb-2 border-b mt-5 mb-2.5"
              } ${isDark ? "border-[#30363D]/80" : "border-[#D0D7DE]"}`}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={`${
                isThumbnail ? "text-[10px] font-semibold my-1" : "text-base sm:text-lg font-semibold mt-4 mb-2"
              }`}
            >
              {children}
            </h3>
          ),
          p: (props) => {
            const { align, className, children, style } =
              props as React.HTMLAttributes<HTMLParagraphElement> & ExtraAttributes;
            const isCenter = align === "center";
            return (
              <p
                style={{
                  textAlign: isCenter ? "center" : (align as React.CSSProperties["textAlign"]),
                  ...style,
                }}
                className={`${isThumbnail ? "my-1" : "my-2 leading-[1.65]"} ${
                  isCenter ? "text-center" : ""
                } ${className || ""}`}
              >
                {children}
              </p>
            );
          },
          div: (props) => {
            const { align, className, children, style } =
              props as React.HTMLAttributes<HTMLDivElement> & ExtraAttributes;
            const isCenter = align === "center";
            return (
              <div
                style={{
                  textAlign: isCenter ? "center" : (align as React.CSSProperties["textAlign"]),
                  ...style,
                }}
                className={`${isThumbnail ? "my-1" : "my-2.5"} ${isCenter ? "text-center mx-auto" : ""} ${
                  className || ""
                }`}
              >
                {children}
              </div>
            );
          },
          img: (props) => {
            const { src, alt, width, height, className, style, align } =
              props as React.ImgHTMLAttributes<HTMLImageElement> & ExtraAttributes;
            return (
              <SafeMarkdownImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                style={style}
                align={align}
              />
            );
          },
          a: ({ href, children, className, ...props }) => (
            <a
              href={isThumbnail ? undefined : href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                isDark ? "text-[#58A6FF]" : "text-[#0969DA]"
              } hover:underline font-medium break-words ${className || ""}`}
              {...props}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={`border-l-4 px-3 py-1.5 rounded-r italic ${
                isThumbnail ? "my-1 text-[9px]" : "my-3 text-xs sm:text-sm"
              } ${
                isDark
                  ? "border-[#388BFD] bg-[#388BFD]/10 text-[#8B949E]"
                  : "border-[#0969DA] bg-[#F6F8FA] text-[#656D76]"
              }`}
            >
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className={`list-disc pl-4 ${isThumbnail ? "my-1 space-y-0.5" : "my-2 space-y-1.5"}`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal pl-4 ${isThumbnail ? "my-1 space-y-0.5" : "my-2 space-y-1.5"}`}>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            return (
              <code
                className={
                  isInline
                    ? `px-1.5 py-0.5 rounded font-mono ${isThumbnail ? "text-[9px]" : "text-xs"} border ${
                        isDark
                          ? "bg-[#161B22] text-[#E6EDF3] border-[#30363D]"
                          : "bg-[#F6F8FA] text-[#1F2328] border-[#D0D7DE]"
                      }`
                    : `font-mono ${isThumbnail ? "text-[9px]" : "text-xs"}`
                }
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre
              className={`border rounded-md ${
                isThumbnail ? "p-1.5 my-1 text-[9px]" : "p-3 sm:p-4 my-2.5 text-xs sm:text-sm"
              } font-mono leading-relaxed overflow-x-auto ${
                isDark
                  ? "bg-[#161B22] text-[#E6EDF3] border-[#30363D]"
                  : "bg-[#F6F8FA] text-[#1F2328] border-[#D0D7DE]"
              }`}
            >
              {children}
            </pre>
          ),
          hr: () => (
            <hr className={`my-3 border-t ${isDark ? "border-[#30363D]" : "border-[#D0D7DE]"}`} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
