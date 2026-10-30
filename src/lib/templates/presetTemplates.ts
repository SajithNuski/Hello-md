import {
  PresetTemplate,
  TEMPLATES_CONFIG,
  renderTemplateMarkdown,
  TemplateTokens,
} from "./templatesConfig";

export type { PresetTemplate, TemplateTokens };
export { renderTemplateMarkdown };

/**
 * Re-export the 8 single-source-of-truth templates.
 * Every template contains previewMarkdown computed deterministically
 * via renderTemplateMarkdown(template).
 */
export const PRESET_TEMPLATES: PresetTemplate[] = TEMPLATES_CONFIG;
