"use client";

import { useMemo, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { FiBold, FiItalic, FiCode, FiLink, FiList } from "react-icons/fi";
import { LuHeading1, LuHeading2, LuQuote } from "react-icons/lu";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  sectionTitle?: string;
}

export function MarkdownEditor({ value, onChange, sectionTitle }: MarkdownEditorProps) {
  const extensions = useMemo(() => [markdown(), EditorView.lineWrapping], []);

  const wordCount = useMemo(() => {
    return value.trim() ? value.trim().split(/\s+/).length : 0;
  }, [value]);

  const insertFormatting = useCallback(
    (prefix: string, suffix: string = "") => {
      onChange(`${value}\n${prefix}${suffix}`);
    },
    [value, onChange]
  );

  return (
    <div className="flex-1 flex flex-col bg-[#FFFFFF] overflow-hidden">
      {/* Sticky Editor Formatting Toolbar */}
      <div className="sticky top-0 z-10 h-11 px-3 flex items-center justify-between bg-[#FAFAF8] border-b border-[#E2E3DC] select-none shrink-0">
        <div className="flex items-center gap-1 text-[#52534C]">
          <button
            type="button"
            onClick={() => insertFormatting("**", "**")}
            className="w-8 h-8 rounded-md hover:text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer flex items-center justify-center"
            title="Bold (**text**)"
          >
            <FiBold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*")}
            className="w-8 h-8 rounded-md hover:text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer flex items-center justify-center"
            title="Italic (*text*)"
          >
            <FiItalic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("`", "`")}
            className="w-8 h-8 rounded-md hover:text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer flex items-center justify-center"
            title="Inline Code (`code`)"
          >
            <FiCode className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-[#E2E3DC] mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting("# ")}
            className="w-8 h-8 rounded-md hover:text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer flex items-center justify-center"
            title="Heading 1 (# Title)"
          >
            <LuHeading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("## ")}
            className="w-8 h-8 rounded-md hover:text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer flex items-center justify-center"
            title="Heading 2 (## Section)"
          >
            <LuHeading2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-[#E2E3DC] mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting("> ")}
            className="w-8 h-8 rounded-md hover:text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer flex items-center justify-center"
            title="Blockquote (> quote)"
          >
            <LuQuote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("[", "](https://)")}
            className="w-8 h-8 rounded-md hover:text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer flex items-center justify-center"
            title="Insert Link ([label](url))"
          >
            <FiLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("- ")}
            className="w-8 h-8 rounded-md hover:text-[#171815] hover:bg-[#F0F1EA] transition-colors cursor-pointer flex items-center justify-center"
            title="Bullet List (- item)"
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#52534C]">
          {sectionTitle && (
            <span className="bg-[#F0F1EA] text-[#171815] px-2 py-0.5 rounded-md border border-[#E2E3DC] text-[11px] font-semibold uppercase tracking-wider">
              {sectionTitle}
            </span>
          )}
          <span>Raw Markdown</span>
        </div>
      </div>

      {/* CodeMirror Surface with Word Wrap & Line Numbers */}
      <div className="flex-1 overflow-auto text-sm font-mono leading-[1.65]">
        <CodeMirror
          value={value}
          height="100%"
          extensions={extensions}
          onChange={onChange}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: false,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            tabSize: 2,
          }}
          className="h-full"
        />
      </div>

      {/* Status Bar Footer */}
      <div className="h-8 px-4 bg-[#FAFAF8] border-t border-[#E2E3DC] flex items-center justify-between text-xs font-mono text-[#52534C] select-none shrink-0">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>CommonMark</span>
          <span>Wrap: On</span>
        </div>
        <div className="flex items-center gap-4 font-medium text-[#171815]">
          <span>{wordCount} words</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
}
