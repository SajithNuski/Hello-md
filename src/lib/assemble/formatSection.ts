import { Facts } from "@/lib/github/types";
import { SectionKey } from "@/lib/config";
import {
  IntroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ContactSection,
} from "../ai/schema";
import { buildBadgeMarkdown } from "./badges";

/**
 * Format a single section's validated data into deterministic Markdown
 */
export function formatSection(
  key: SectionKey,
  data: unknown,
  facts: Facts,
  theme: string = "minimal"
): string {
  switch (key) {
    case "intro": {
      const intro = data as IntroSection;
      const parts: string[] = [];
      parts.push(`# ${intro.headline}`);
      if (intro.tagline) {
        parts.push(`> ${intro.tagline}`);
      }
      return parts.join("\n\n");
    }

    case "about": {
      const about = data as AboutSection;
      const parts: string[] = ["## About Me"];
      if (about.paragraphs && about.paragraphs.length > 0) {
        parts.push(about.paragraphs.join("\n\n"));
      } else if (facts.bio) {
        parts.push(facts.bio);
      }
      return parts.join("\n\n");
    }

    case "skills": {
      const skills = data as SkillsSection;
      const parts: string[] = ["## Skills & Technologies"];

      if (skills.groups && skills.groups.length > 0) {
        for (const group of skills.groups) {
          if (group.items.length === 0) continue;
          parts.push(`### ${group.title}`);
          const badges = group.items.map((item) => buildBadgeMarkdown(item)).join(" ");
          parts.push(badges);
        }
      } else if (facts.topLanguages.length > 0) {
        parts.push("### Languages");
        const badges = facts.topLanguages
          .map((l) => buildBadgeMarkdown(l.name))
          .join(" ");
        parts.push(badges);
      }

      return parts.join("\n\n");
    }

    case "projects": {
      const projects = data as ProjectsSection;
      const parts: string[] = ["## Featured Projects"];

      const repoLookup = new Map<string, (typeof facts.topRepos)[0]>();
      facts.topRepos.forEach((r) => repoLookup.set(r.name.toLowerCase(), r));

      if (projects && projects.length > 0) {
        for (const proj of projects) {
          const repo = repoLookup.get(proj.repo.toLowerCase());
          const repoUrl = repo ? repo.url : `https://github.com/${facts.login}/${proj.repo}`;
          const repoName = repo ? repo.name : proj.repo;

          let projectBlock = `### [${repoName}](${repoUrl})\n${proj.pitch}`;

          if (repo) {
            const metaTokens: string[] = [];
            if (repo.language) metaTokens.push(`**Language:** ${repo.language}`);
            if (repo.stars > 0) metaTokens.push(`**Stars:** ${repo.stars}`);
            if (metaTokens.length > 0) {
              projectBlock += `\n\n${metaTokens.join(" · ")}`;
            }
          }

          parts.push(projectBlock);
        }
      } else if (facts.topRepos.length > 0) {
        for (const repo of facts.topRepos.slice(0, 4)) {
          let projectBlock = `### [${repo.name}](${repo.url})`;
          if (repo.description) {
            projectBlock += `\n${repo.description}`;
          }
          const metaTokens: string[] = [];
          if (repo.language) metaTokens.push(`**Language:** ${repo.language}`);
          if (repo.stars > 0) metaTokens.push(`**Stars:** ${repo.stars}`);
          if (metaTokens.length > 0) {
            projectBlock += `\n\n${metaTokens.join(" · ")}`;
          }
          parts.push(projectBlock);
        }
      }

      return parts.join("\n\n");
    }

    case "contact": {
      const contact = data as ContactSection;
      const parts: string[] = ["## Connect With Me"];

      if (contact.closing) {
        parts.push(contact.closing);
      }

      // Code-assembled links (AI never invents URLs)
      const links: string[] = [];
      links.push(`- **GitHub:** [${facts.login}](https://github.com/${facts.login})`);
      if (facts.websiteUrl) {
        const displayUrl = facts.websiteUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "");
        links.push(`- **Website:** [${displayUrl}](${facts.websiteUrl})`);
      }
      if (facts.location) {
        links.push(`- **Location:** ${facts.location}`);
      }

      if (links.length > 0) {
        parts.push(links.join("\n"));
      }

      return parts.join("\n\n");
    }

    default:
      return "";
  }
}
