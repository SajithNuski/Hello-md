export interface ExtraSocialLink {
  label: string;
  url: string;
}

export interface SocialConfig {
  linkedin: string;
  x: string;
  portfolio: string;
  email: string;
  extra: ExtraSocialLink[];
}

export const DEFAULT_SOCIAL_CONFIG: SocialConfig = {
  linkedin: "",
  x: "",
  portfolio: "",
  email: "",
  extra: [],
};

export function getDefaultSocialConfig(): SocialConfig {
  return {
    linkedin: "",
    x: "",
    portfolio: "",
    email: "",
    extra: [],
  };
}

/**
 * Normalizes user input for social handles or URLs.
 * If user enters only a username/handle for LinkedIn or X, prepend the URL prefix.
 */
export function normalizeSocialUrl(
  type: "linkedin" | "x" | "portfolio" | "url",
  value: string
): string {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";

  if (type === "linkedin") {
    // If user already typed full URL
    if (/^https?:\/\/((www\.)?linkedin\.com\/in\/)/i.test(trimmed)) {
      return trimmed.replace(/^http:\/\//i, "https://");
    }
    if (/^(www\.)?linkedin\.com\/in\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    // Clean handle (remove leading @ or /)
    const cleanHandle = trimmed.replace(/^[@/]+/, "");
    return `https://linkedin.com/in/${cleanHandle}`;
  }

  if (type === "x") {
    // If user already typed full URL
    if (/^https?:\/\/((www\.)?(twitter|x)\.com\/)/i.test(trimmed)) {
      return trimmed
        .replace(/^http:\/\//i, "https://")
        .replace(/twitter\.com/i, "x.com");
    }
    if (/^(www\.)?(twitter|x)\.com\//i.test(trimmed)) {
      return `https://${trimmed.replace(/twitter\.com/i, "x.com")}`;
    }
    // Clean handle
    const cleanHandle = trimmed.replace(/^[@/]+/, "");
    return `https://x.com/${cleanHandle}`;
  }

  if (type === "portfolio" || type === "url") {
    if (/^http:\/\//i.test(trimmed)) {
      return trimmed.replace(/^http:\/\//i, "https://");
    }
    return trimmed;
  }

  return trimmed;
}

/**
 * Validates a social URL or email.
 */
export function validateSocialField(
  type: "url" | "email",
  value: string
): { isValid: boolean; error?: string } {
  const trimmed = (value || "").trim();
  if (!trimmed) {
    return { isValid: true };
  }

  if (type === "email") {
    if (!trimmed.includes("@")) {
      return { isValid: false, error: 'Email must contain "@"' };
    }
    return { isValid: true };
  }

  // URL must start with https://
  if (!trimmed.startsWith("https://")) {
    return { isValid: false, error: 'URL must start with "https://"' };
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") {
      return { isValid: false, error: 'URL must start with "https://"' };
    }
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }

  return { isValid: true };
}

/**
 * Escape shield label text according to shields.io rules.
 * Spaces become '%20', '-' becomes '--'.
 */
function escapeShieldLabel(label: string): string {
  return encodeURIComponent(label.replace(/-/g, "--").replace(/_/g, "__"));
}

/**
 * Format badge HTML according to task specifications:
 * <a href="{{URL}}"><img src="https://img.shields.io/badge/{{Label}}-{{HEX}}?style=for-the-badge&logo={{LOGO}}&logoColor=white" alt="{{Label}}" /></a>
 */
function formatBadge(label: string, hex: string, logo: string, href: string): string {
  const safeBadgeLabel = escapeShieldLabel(label);
  return `<a href="${href}"><img src="https://img.shields.io/badge/${safeBadgeLabel}-${hex}?style=for-the-badge&logo=${logo}&logoColor=white" alt="${label}" /></a>`;
}

export const SAMPLE_SOCIAL_OUTPUT = `## 🤝 Connect With Me

<!-- Replace with your own links -->
<div align="center">
  <a href="https://linkedin.com/in/your-username"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://x.com/your-handle"><img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>
  <a href="https://your-site.com"><img src="https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" /></a>
  <a href="mailto:you@example.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</div>`;

/**
 * Generates the deterministic Markdown/HTML for the Connect & Socials section.
 *
 * Rules:
 * - Heading: `## 🤝 Connect With Me`, centered in `<div align="center">`
 * - Fixed links order: LinkedIn, X, Portfolio, Email, then extra links in order
 * - One shields.io badge each, only if filled & valid
 * - URL-encode badge label (spaces become %20, - becomes --)
 * - Extra links badge: HEX 555555, logo = label lowercase no spaces
 * - Duplicate URLs excluded
 * - If all links are empty, output SAMPLE values with comment `<!-- Replace with your own links -->`
 */
export function generateContactMarkdown(config: SocialConfig): string {
  const seenUrls = new Set<string>();
  const badges: string[] = [];

  // 1. LinkedIn
  const linkedin = (config.linkedin || "").trim();
  if (linkedin && linkedin.startsWith("https://")) {
    if (!seenUrls.has(linkedin)) {
      seenUrls.add(linkedin);
      badges.push(formatBadge("LinkedIn", "0A66C2", "linkedin", linkedin));
    }
  }

  // 2. X (Twitter)
  const x = (config.x || "").trim();
  if (x && x.startsWith("https://")) {
    if (!seenUrls.has(x)) {
      seenUrls.add(x);
      badges.push(formatBadge("X", "000000", "x", x));
    }
  }

  // 3. Portfolio
  const portfolio = (config.portfolio || "").trim();
  if (portfolio && portfolio.startsWith("https://")) {
    if (!seenUrls.has(portfolio)) {
      seenUrls.add(portfolio);
      badges.push(formatBadge("Portfolio", "FF5722", "googlechrome", portfolio));
    }
  }

  // 4. Email
  const email = (config.email || "").trim();
  if (email && email.includes("@")) {
    const mailto = `mailto:${email}`;
    if (!seenUrls.has(mailto)) {
      seenUrls.add(mailto);
      badges.push(formatBadge("Email", "D14836", "gmail", mailto));
    }
  }

  // 5. Extra links (up to 8, in user order)
  const extras = (config.extra || []).slice(0, 8);
  for (const item of extras) {
    const label = (item.label || "").trim();
    const url = (item.url || "").trim();

    // Required label & valid https:// url
    if (!label || !url || !url.startsWith("https://")) {
      continue;
    }

    if (seenUrls.has(url)) {
      continue;
    }
    seenUrls.add(url);

    // logo = label lowercase no spaces
    const logoSlug = label.toLowerCase().replace(/\s+/g, "");
    badges.push(formatBadge(label, "555555", logoSlug, url));
  }

  const heading = "## 🤝 Connect With Me";

  // If all fields are empty, output SAMPLE values with the comment
  if (badges.length === 0) {
    return SAMPLE_SOCIAL_OUTPUT;
  }

  return `${heading}\n\n<div align="center">\n  ${badges.join("\n  ")}\n</div>`;
}

/**
 * Parses existing markdown to extract SocialConfig.
 */
export function parseContactMarkdown(markdown: string): Partial<SocialConfig> {
  if (!markdown) {
    return DEFAULT_SOCIAL_CONFIG;
  }

  if (markdown.includes("<!-- Replace with your own links -->")) {
    return {
      linkedin: "",
      x: "",
      portfolio: "",
      email: "",
      extra: [],
    };
  }

  const result: SocialConfig = {
    linkedin: "",
    x: "",
    portfolio: "",
    email: "",
    extra: [],
  };

  // Match: <a href="{{URL}}"><img src="https://img.shields.io/badge/{{LABEL}}-{{HEX}}?style=for-the-badge&logo={{LOGO}}&logoColor=white" alt="{{ALT}}" /></a>
  const badgeRegex = /<a\s+href="([^"]+)">\s*<img\s+src="https:\/\/img\.shields\.io\/badge\/([^?]+)\?style=for-the-badge&logo=([^&"]*)&logoColor=white"\s+alt="([^"]*)"\s*\/>\s*<\/a>/gi;

  let match: RegExpExecArray | null;
  while ((match = badgeRegex.exec(markdown)) !== null) {
    const href = match[1];
    const logo = (match[3] || "").toLowerCase();
    const alt = match[4] || "";

    if (logo === "linkedin" || alt === "LinkedIn") {
      result.linkedin = href;
    } else if (logo === "x" || alt === "X") {
      result.x = href;
    } else if (logo === "googlechrome" || alt === "Portfolio" || alt === "Website") {
      result.portfolio = href;
    } else if (logo === "gmail" || href.startsWith("mailto:") || alt === "Email") {
      result.email = href.replace(/^mailto:/i, "");
    } else {
      if (result.extra.length < 8 && !result.extra.some((e) => e.url === href)) {
        result.extra.push({
          label: alt || logo,
          url: href,
        });
      }
    }
  }

  return result;
}
