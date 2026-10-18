"use client";

import { useMemo, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Link as LinkIcon,
  List,
} from "lucide-react";

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
      // Basic insert at end or wraps
      onChange(`${value}\n${prefix}${suffix}`);
    },
    [value, onChange]
  );

  return (
    <div className="flex-1 flex flex-col bg-[#FAFAF8] overflow-hidden border-r border-[#DEDFD8]">
      {/* Editor Toolbar */}
      <div className="h-10 px-3 flex items-center justify-between bg-[#F0F0EC] border-b border-[#DEDFD8] select-none">
        <div className="flex items-center gap-1 text-[#65665F]">
          <button
            type="button"
            onClick={() => insertFormatting("**", "**")}
            className="p-1.5 hover:text-[#171815] hover:bg-[#E2E3DD] rounded-[4px] transition-colors"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*")}
            className="p-1.5 hover:text-[#171815] hover:bg-[#E2E3DD] rounded-[4px] transition-colors"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("`", "`")}
            className="p-1.5 hover:text-[#171815] hover:bg-[#E2E3DD] rounded-[4px] transition-colors"
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-[#DEDFD8] mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting("# ")}
            className="p-1.5 hover:text-[#171815] hover:bg-[#E2E3DD] rounded-[4px] transition-colors"
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("## ")}
            className="p-1.5 hover:text-[#171815] hover:bg-[#E2E3DD] rounded-[4px] transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-[#DEDFD8] mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting("[", "](https://)")}
            className="p-1.5 hover:text-[#171815] hover:bg-[#E2E3DD] rounded-[4px] transition-colors"
            title="Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("- ")}
            className="p-1.5 hover:text-[#171815] hover:bg-[#E2E3DD] rounded-[4px] transition-colors"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#91928A]">
          {sectionTitle && (
            <span className="bg-[#E2E3DD] text-[#171815] px-1.5 py-0.5 rounded text-[10px]">
              {sectionTitle}
            </span>
          )}
          <span>README.md</span>
        </div>
      </div>

      {/* CodeMirror Surface */}
      <div className="flex-1 overflow-auto text-xs font-mono">
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
          className="h-full text-xs"
        />
      </div>

      {/* Status Bar Footer */}
      <div className="h-6 px-3 bg-[#F0F0EC] border-t border-[#DEDFD8] flex items-center justify-between text-[11px] font-mono text-[#65665F] select-none">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>Markdown</span>
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
