"use client";

import { useMemo, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { FiBold, FiItalic, FiCode, FiLink, FiList } from "react-icons/fi";
import { LuHeading1, LuHeading2 } from "react-icons/lu";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  sectionTitle?: string;
}

export function MarkdownEditor({ value, onChange, sectionTitle }: MarkdownEditorProps) {
  const extensions = useMemo(() => [markdown()], []);

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
    <div className="flex-1 flex flex-col bg-surface-raised overflow-hidden border-r border-border">
      {/* Editor Toolbar */}
      <div className="h-10 px-3 flex items-center justify-between bg-surface border-b border-border select-none">
        <div className="flex items-center gap-1 text-text-secondary">
          <button
            type="button"
            onClick={() => insertFormatting("**", "**")}
            className="p-1.5 hover:text-text-primary hover:bg-surface-raised rounded-sm transition-colors cursor-pointer"
            title="Bold"
          >
            <FiBold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*")}
            className="p-1.5 hover:text-text-primary hover:bg-surface-raised rounded-sm transition-colors cursor-pointer"
            title="Italic"
          >
            <FiItalic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("`", "`")}
            className="p-1.5 hover:text-text-primary hover:bg-surface-raised rounded-sm transition-colors cursor-pointer"
            title="Inline Code"
          >
            <FiCode className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting("# ")}
            className="p-1.5 hover:text-text-primary hover:bg-surface-raised rounded-sm transition-colors cursor-pointer"
            title="Heading 1"
          >
            <LuHeading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("## ")}
            className="p-1.5 hover:text-text-primary hover:bg-surface-raised rounded-sm transition-colors cursor-pointer"
            title="Heading 2"
          >
            <LuHeading2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-border mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting("[", "](https://)")}
            className="p-1.5 hover:text-text-primary hover:bg-surface-raised rounded-sm transition-colors cursor-pointer"
            title="Link"
          >
            <FiLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("- ")}
            className="p-1.5 hover:text-text-primary hover:bg-surface-raised rounded-sm transition-colors cursor-pointer"
            title="Bullet List"
          >
            <FiList className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-meta text-text-muted">
          {sectionTitle && (
            <span className="bg-surface-raised text-text-primary px-1.5 py-0.5 rounded-sm border border-border text-eyebrow uppercase tracking-[0.04em]">
              {sectionTitle}
            </span>
          )}
          <span>README.md</span>
        </div>
      </div>

      {/* CodeMirror Surface */}
      <div className="flex-1 overflow-auto text-[13px] font-mono leading-[1.6]">
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
      <div className="h-6 px-3 bg-surface border-t border-border flex items-center justify-between text-eyebrow font-mono text-text-secondary select-none">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>CommonMark</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>{value.length} chars</span>
        </div>
      </div>
    </div>
  );
}
