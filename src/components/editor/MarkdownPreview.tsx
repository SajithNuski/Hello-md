"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FiEye, FiBookOpen, FiMoon, FiSun } from "react-icons/fi";

import { SectionKey } from "@/lib/config";

interface MarkdownPreviewProps {
  markdown: string;
  username?: string;
  defaultTheme?: "dark" | "light";
  selectedKey?: SectionKey;
  onSelectSection?: (key: SectionKey) => void;
}

interface ExtraAttributes {
  align?: string;
  vAlign?: string;
  valign?: string;
  width?: string | number;
  height?: string | number;
  src?: string;
  alt?: string;
}

function extractText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (typeof node === "object" && node !== null && "props" in node) {
    return extractText((node as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}

function detectSectionKey(text: string): SectionKey | null {
  const t = text.toLowerCase();
  if (t.includes("about")) return "about";
  if (t.includes("tech") || t.includes("stack") || t.includes("skill")) return "skills";
  if (t.includes("project")) return "projects";
  if (t.includes("analytic") || t.includes("stat")) return "stats";
  if (t.includes("connect") || t.includes("social")) return "contact";
  return null;
}

export function MarkdownPreview({
  markdown,
  username = "profile",
  defaultTheme = "dark",
  selectedKey,
  onSelectSection,
}: MarkdownPreviewProps) {
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">(defaultTheme);

  const isDark = previewTheme === "dark";

  return (
    <div className="flex-1 bg-page flex flex-col overflow-hidden">
      {/* Top Header Tab Bar */}
      <div className="h-10 px-3.5 flex items-center justify-between border-b border-[#E2E3DC] bg-[#FAFAF8] select-none shrink-0">
        <div className="flex items-center gap-2">
          <FiEye className="w-3.5 h-3.5 text-[#52534C]" />
          <span className="text-xs font-semibold text-[#171815]">Rendered Output</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* GitHub Dark / Light preview toggle */}
          <button
            type="button"
            onClick={() => setPreviewTheme(isDark ? "light" : "dark")}
            className="h-7 px-2.5 flex items-center gap-1.5 text-[11px] font-mono rounded bg-[#FFFFFF] border border-[#E2E3DC] text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer shadow-xs"
            title={`Switch to GitHub ${isDark ? "Light" : "Dark"} mode`}
          >
            {isDark ? (
              <>
                <FiSun className="w-3 h-3 text-amber-500" />
                <span className="hidden sm:inline">GitHub Dark</span>
              </>
            ) : (
              <>
                <FiMoon className="w-3 h-3 text-indigo-500" />
                <span className="hidden sm:inline">GitHub Light</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#65665F]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">Live</span>
          </div>
        </div>
      </div>

      {/* Canvas Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto thin-scrollbar flex justify-center bg-[#FAFAF8]">
        {/* GitHub Profile README Container */}
        <div
          className={`w-full max-w-[820px] rounded-lg border shadow-sm flex flex-col h-fit transition-colors duration-200 ${
            isDark
              ? "bg-[#0D1117] text-[#E6EDF3] border-[#30363D]"
              : "bg-[#FFFFFF] text-[#1F2328] border-[#D0D7DE]"
          }`}
        >
          {/* GitHub README Card Header */}
          <div
            className={`flex items-center justify-between px-4 py-3 border-b text-xs font-mono select-none rounded-t-lg ${
              isDark
                ? "bg-[#161B22] border-[#30363D] text-[#8B949E]"
                : "bg-[#F6F8FA] border-[#D0D7DE] text-[#656D76]"
            }`}
          >
            <div className="flex items-center gap-2">
              <FiBookOpen className="w-4 h-4 opacity-80" />
              <span className={`font-semibold ${isDark ? "text-[#E6EDF3]" : "text-[#1F2328]"}`}>
                {username}
              </span>
              <span className="opacity-40">/</span>
              <span>README.md</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="uppercase tracking-wider font-semibold">Public</span>
            </div>
          </div>

          {/* GitHub Markdown Rendered Content */}
          <div className="p-6 sm:p-8 flex flex-col gap-4 text-inherit leading-relaxed overflow-x-auto text-[14px]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => {
                  const isSelected = selectedKey === "intro";
                  return (
                    <div
                      onClick={() => onSelectSection?.("intro")}
                      className={`flex flex-col pb-2.5 border-b mt-2 mb-3 rounded px-2 -mx-2 transition-all ${
                        isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
                      } ${
                        onSelectSection
                          ? "cursor-pointer hover:bg-[#C5F467]/15"
                          : ""
                      } ${isSelected ? "ring-1 ring-accent" : ""}`}
                      title={onSelectSection ? "Click to jump to Intro section in editor" : undefined}
                    >
                      <h1 className="text-2xl sm:text-[30px] font-semibold tracking-tight leading-[1.2] text-inherit">
                        {children}
                      </h1>
                    </div>
                  );
                },
                h2: ({ children }) => {
                  const text = extractText(children);
                  const matchedKey = detectSectionKey(text);
                  const isSelected = matchedKey && selectedKey === matchedKey;
                  return (
                    <h2
                      onClick={() => {
                        if (matchedKey && onSelectSection) {
                          onSelectSection(matchedKey);
                        }
                      }}
                      className={`text-xl sm:text-2xl font-semibold tracking-tight pb-2 border-b mt-6 mb-3 text-inherit flex items-center gap-2 rounded px-2 -mx-2 transition-all ${
                        isDark ? "border-[#30363D]/80" : "border-[#D0D7DE]"
                      } ${
                        matchedKey && onSelectSection
                          ? "cursor-pointer hover:bg-[#C5F467]/15"
                          : ""
                      } ${isSelected ? "ring-1 ring-accent" : ""}`}
                      title={
                        matchedKey && onSelectSection
                          ? `Click to jump to ${matchedKey} in editor`
                          : undefined
                      }
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => (
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-inherit mt-4 mb-2">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold text-inherit mt-3 mb-1">
                    {children}
                  </h4>
                ),
                p: (props) => {
                  const { align, className, children, style } = props as React.HTMLAttributes<HTMLParagraphElement> & ExtraAttributes;
                  const isCenter = align === "center";
                  return (
                    <p
                      style={{
                        textAlign: isCenter ? "center" : (align as React.CSSProperties["textAlign"]),
                        ...style,
                      }}
                      className={`leading-[1.65] my-2 ${isCenter ? "text-center" : ""} ${className || ""}`}
                    >
                      {children}
                    </p>
                  );
                },
                div: (props) => {
                  const { align, className, children, style } = props as React.HTMLAttributes<HTMLDivElement> & ExtraAttributes;
                  const isCenter = align === "center";
                  return (
                    <div
                      style={{
                        textAlign: isCenter ? "center" : (align as React.CSSProperties["textAlign"]),
                        ...style,
                      }}
                      className={`${isCenter ? "text-center my-3" : ""} ${className || ""}`}
                    >
                      {children}
                    </div>
                  );
                },
                table: (props) => {
                  const { className, style, children } = props as React.TableHTMLAttributes<HTMLTableElement>;
                  return (
                    <div className="w-full overflow-x-auto my-3">
                      <table
                        style={{ width: "100%", borderCollapse: "collapse", ...style }}
                        className={`w-full table-fixed border-collapse border ${
                          isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
                        } ${className || ""}`}
                      >
                        {children}
                      </table>
                    </div>
                  );
                },
                td: (props) => {
                  const { vAlign, valign, width, style, className, children } = props as React.TdHTMLAttributes<HTMLTableCellElement> & ExtraAttributes;
                  const verticalAlignment = vAlign || valign || "top";
                  return (
                    <td
                      style={{
                        verticalAlign: verticalAlignment as React.CSSProperties["verticalAlign"],
                        width: width || undefined,
                        ...style,
                      }}
                      className={`p-3.5 border align-top text-inherit text-sm leading-relaxed ${
                        isDark ? "border-[#30363D]" : "border-[#D0D7DE]"
                      } ${className || ""}`}
                    >
                      {children}
                    </td>
                  );
                },
                th: (props) => {
                  const { style, className, children } = props as React.ThHTMLAttributes<HTMLTableCellElement>;
                  return (
                    <th
                      style={style}
                      className={`p-3 border text-left font-semibold text-inherit text-sm ${
                        isDark ? "border-[#30363D] bg-[#161B22]" : "border-[#D0D7DE] bg-[#F6F8FA]"
                      } ${className || ""}`}
                    >
                      {children}
                    </th>
                  );
                },
                tr: (props) => {
                  const { className, children } = props as React.HTMLAttributes<HTMLTableRowElement>;
                  return (
                    <tr
                      className={`border-b ${isDark ? "border-[#30363D]" : "border-[#D0D7DE]"} ${className || ""}`}
                    >
                      {children}
                    </tr>
                  );
                },
                img: (props) => {
                  const { className, style, width, height, alt, src, align } = props as React.ImgHTMLAttributes<HTMLImageElement> & ExtraAttributes;
                  const isFull = width === "100%";
                  const isCenter = align === "center";
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={alt || ""}
                      width={width}
                      height={height}
                      style={{
                        ...(isFull ? { width: "100%" } : {}),
                        ...(height ? { height: `${height}px` } : {}),
                        ...style,
                      }}
                      className={`inline-block ${isFull ? "w-full my-2 block" : "mr-1.5 my-1"} ${
                        isCenter ? "mx-auto block" : ""
                      } max-w-full rounded-xs ${className || ""}`}
                      loading="lazy"
                    />
                  );
                },
                a: ({ href, children, className, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      isDark ? "text-[#58A6FF]" : "text-[#0969DA]"
                    } hover:underline font-medium inline-flex items-center gap-0.5 break-words ${className || ""}`}
                    {...props}
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className={`border-l-4 px-4 py-2.5 rounded-r italic my-3 leading-relaxed ${
                      isDark
                        ? "border-[#388BFD] bg-[#388BFD]/10 text-[#8B949E]"
                        : "border-[#0969DA] bg-[#F6F8FA] text-[#656D76]"
                    }`}
                  >
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 my-2.5 space-y-1.5 text-inherit leading-relaxed">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 my-2.5 space-y-1.5 text-inherit leading-relaxed">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="text-inherit leading-relaxed">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  return (
                    <code
                      className={
                        isInline
                          ? `px-1.5 py-0.5 rounded font-mono text-xs border ${
                              isDark
                                ? "bg-[#161B22] text-[#E6EDF3] border-[#30363D]"
                                : "bg-[#F6F8FA] text-[#1F2328] border-[#D0D7DE]"
                            }`
                          : "font-mono text-xs"
                      }
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre
                    className={`border rounded-md p-4 overflow-x-auto my-3 font-mono text-xs sm:text-sm leading-relaxed ${
                      isDark
                        ? "bg-[#161B22] text-[#E6EDF3] border-[#30363D]"
                        : "bg-[#F6F8FA] text-[#1F2328] border-[#D0D7DE]"
                    }`}
                  >
                    {children}
                  </pre>
                ),
                hr: () => (
                  <hr
                    className={`border-t my-6 ${isDark ? "border-[#30363D]" : "border-[#D0D7DE]"}`}
                  />
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
