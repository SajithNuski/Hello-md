import { Facts } from "@/lib/github/types";
import { SectionKey } from "@/lib/config";

export interface AssembleSection {
  key: SectionKey;
  markdown: string;
  source?: "ai" | "user";
  enabled: boolean;
  order: number;
  config?: Record<string, unknown>;
}

/**
 * Pure and deterministic assemble function.
 * Importable from both server and client.
 */
export function assemble(
  sections: AssembleSection[],
  theme: string = "minimal",
  facts?: Facts
): string {
  void theme;
  void facts;
  // 1. Filter enabled and non-empty sections
  const activeSections = sections
    .filter((s) => s.enabled && s.markdown.trim().length > 0)
    // 2. Sort deterministically by order
    .sort((a, b) => a.order - b.order);

  // 3. Assemble sections separated by clean double newlines
  const output = activeSections
    .map((s) => s.markdown.trim())
    .join("\n\n");

  return output.trim();
}

export * from "./badges";
export * from "./formatSection";
export * from "./themes";
