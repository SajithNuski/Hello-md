export interface IntroConfig {
  // 1. Profile Photo
  photoEnabled: boolean;
  photoUsername: string;
  photoSize: number;
  photoRounded: boolean;

  // 2. Main Title Animation
  animationEnabled: boolean;
  animationLines: string[];
  animationFont: string;
  animationWeight: number;
  animationSize: number;
  animationPause: number;
  animationWidth: number;
  animationCenter: boolean;
  animationVCenter: boolean;

  // 3. Color Option
  animationColor: string; // Hex without leading '#'
}

export const DEFAULT_INTRO_LINES = [
  "Building full-stack web applications",
  "Integrating AI into real-world apps",
  "Fiverr Level 2 Seller 🚀",
  "Cloud & AI Engineering in progress ☁️",
];

export const AVAILABLE_FONTS = [
  "Fira Code",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Inter",
  "Poppins",
  "Courier New",
  "Inconsolata",
  "Source Code Pro",
  "JetBrains Mono",
  "Cascadia Code",
  "Ubuntu",
];

export const AVAILABLE_WEIGHTS = [300, 400, 500, 600, 700, 800];

export function getDefaultIntroConfig(username: string = "sajithnuski"): IntroConfig {
  return {
    photoEnabled: false,
    photoUsername: username || "sajithnuski",
    photoSize: 150,
    photoRounded: true,

    animationEnabled: false,
    animationLines: [...DEFAULT_INTRO_LINES],
    animationFont: "Fira Code",
    animationWeight: 600,
    animationSize: 22,
    animationPause: 1000,
    animationWidth: 600,
    animationCenter: true,
    animationVCenter: true,
    animationColor: "A78BFA",
  };
}

/**
 * Validates a hex color string (3 or 6 hex characters, with or without leading '#').
 */
export function isValidHex(hex: string): boolean {
  if (!hex) return false;
  const clean = hex.replace(/^#/, "").trim();
  return /^[0-9A-Fa-f]{3}$/.test(clean) || /^[0-9A-Fa-f]{6}$/.test(clean);
}

/**
 * Normalizes hex string to 6 characters uppercase without '#'.
 * Falls back to default 'A78BFA' if invalid.
 */
export function normalizeHex(hex: string, fallback: string = "A78BFA"): string {
  if (!hex) return fallback;
  const clean = hex.replace(/^#/, "").trim();
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return clean.toUpperCase();
  }
  if (/^[0-9A-Fa-f]{3}$/.test(clean)) {
    return (clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]).toUpperCase();
  }
  return fallback;
}

/**
 * Encode a string for typing SVG:
 * - spaces become '+'
 * - special characters and emoji are percent-encoded
 */
export function encodeTypingText(text: string): string {
  return encodeURIComponent(text).replace(/%20/g, "+");
}

/**
 * Build the readme-typing-svg URL according to the exact specification:
 * https://readme-typing-svg.demolab.com?font={font}&weight={weight}&size={size}&pause={pause}&color={hex}&center=true&vCenter=true&width={width}&lines={lines}
 */
export function buildTypingSvgUrl(config: IntroConfig): string {
  const fontParam = encodeTypingText(config.animationFont || "Fira Code");
  const weightParam = config.animationWeight || 600;
  const sizeParam = config.animationSize || 22;
  const pauseParam = config.animationPause ?? 1000;
  const colorParam = normalizeHex(config.animationColor, "A78BFA");
  const widthParam = config.animationWidth || 600;

  const validLines = (config.animationLines && config.animationLines.length > 0)
    ? config.animationLines
    : DEFAULT_INTRO_LINES;

  const linesParam = validLines.map((line) => encodeTypingText(line)).join(";");

  const centerParam = config.animationCenter !== false ? "center=true" : "center=false";
  const vCenterParam = config.animationVCenter !== false ? "vCenter=true" : "vCenter=false";

  return `https://readme-typing-svg.demolab.com?font=${fontParam}&weight=${weightParam}&size=${sizeParam}&pause=${pauseParam}&color=${colorParam}&${centerParam}&${vCenterParam}&width=${widthParam}&lines=${linesParam}`;
}

/**
 * Builds the profile photo <img> tag according to specification:
 * <img margin-top="5px" align="center" width="150" height="150" style="border-radius:50%" src="https://github.com/sajithnuski.png"/>
 */
export function buildProfilePhotoTag(config: IntroConfig, defaultUsername: string = "sajithnuski"): string {
  const user = (config.photoUsername || defaultUsername || "sajithnuski").trim().replace(/^@/, "");
  const size = config.photoSize || 150;
  const styleAttr = config.photoRounded ? ' style="border-radius:50%"' : "";

  return `<img margin-top="5px" align="center" width="${size}" height="${size}"${styleAttr} src="https://github.com/${user}.png"/>`;
}

/**
 * Generates the full markdown for the intro section according to output rules:
 * - Both off: output nothing for this section ("")
 * - Only photo on: output the div with just the <img>
 * - Only animation on: output the div with just the Typing SVG
 * - Both on: output div with <img> and Typing SVG, with a blank line between them
 */
export function generateIntroMarkdown(config: IntroConfig, defaultUsername: string = "sajithnuski"): string {
  const parts: string[] = [];

  if (config.photoEnabled) {
    parts.push(buildProfilePhotoTag(config, defaultUsername));
  }

  if (config.animationEnabled) {
    const svgUrl = buildTypingSvgUrl(config);
    parts.push(`[![Typing SVG](${svgUrl})](https://git.io/typing-svg)`);
  }

  if (parts.length === 0) {
    return "";
  }

  return `<div align="center">\n\n${parts.join("\n\n")}\n\n</div>`;
}

/**
 * Optional parser to infer IntroConfig from existing markdown if config is not yet set.
 */
export function parseIntroMarkdown(markdown: string, defaultUsername: string = "sajithnuski"): Partial<IntroConfig> | null {
  if (!markdown || !markdown.includes("<div align=\"center\">")) {
    return null;
  }

  const result: Partial<IntroConfig> = {};

  // Check photo
  const photoMatch = markdown.match(/<img[^>]*src="https:\/\/github\.com\/([^/.]+)\.png"[^>]*>/i);
  if (photoMatch) {
    result.photoEnabled = true;
    result.photoUsername = photoMatch[1];

    const sizeMatch = photoMatch[0].match(/width="(\d+)"/i);
    if (sizeMatch) {
      result.photoSize = parseInt(sizeMatch[1], 10);
    }

    result.photoRounded = photoMatch[0].includes("border-radius:50%");
  }

  // Check typing svg
  const svgMatch = markdown.match(/https:\/\/readme-typing-svg\.demolab\.com\?([^)\s"]+)/i);
  if (svgMatch) {
    result.animationEnabled = true;
    const queryString = svgMatch[1];
    const searchParams = new URLSearchParams(queryString.replace(/\+/g, "%20"));

    const font = searchParams.get("font");
    if (font) result.animationFont = font;

    const weight = searchParams.get("weight");
    if (weight) result.animationWeight = parseInt(weight, 10);

    const size = searchParams.get("size");
    if (size) result.animationSize = parseInt(size, 10);

    const pause = searchParams.get("pause");
    if (pause) result.animationPause = parseInt(pause, 10);

    const width = searchParams.get("width");
    if (width) result.animationWidth = parseInt(width, 10);

    const color = searchParams.get("color");
    if (color) result.animationColor = color.replace(/^#/, "");

    const linesRaw = searchParams.get("lines");
    if (linesRaw) {
      result.animationLines = linesRaw.split(";").map((l) => l.trim()).filter(Boolean);
    }

    result.animationCenter = searchParams.get("center") !== "false";
    result.animationVCenter = searchParams.get("vCenter") !== "false";
  }

  return result;
}
