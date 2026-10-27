import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--bg-page)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        focus: "var(--focus-ring)",
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          error: "var(--status-error)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
        control: "var(--radius-sm)",
        panel: "var(--radius-md)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        lg: "var(--shadow-lg)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        code: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["64px", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" }],
        section: ["36px", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" }],
        card: ["22px", { lineHeight: "1.25", letterSpacing: "-0.03em", fontWeight: "550" }],
        body: ["16px", { lineHeight: "1.65", letterSpacing: "0", fontWeight: "400" }],
        nav: ["14px", { lineHeight: "20px", fontWeight: "500" }],
        eyebrow: ["12px", { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "500" }],
        meta: ["12px", { lineHeight: "16px" }],
      },
      spacing: {
        "1": "1px",
        "40": "40px",
        "64": "64px",
        "72": "72px",
        "80": "80px",
        "96": "96px",
        "102": "102px",
        "112": "112px",
        "274": "274px",
        "308": "308px",
      },
    },
  },
  plugins: [],
};
export default config;
