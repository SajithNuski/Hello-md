import { z } from "zod";

export const IntroSectionSchema = z.object({
  headline: z.string().max(80),
  tagline: z.string().max(140),
});
export type IntroSection = z.infer<typeof IntroSectionSchema>;

export const AboutSectionSchema = z.object({
  paragraphs: z.array(z.string().max(300)).min(1).max(2),
});
export type AboutSection = z.infer<typeof AboutSectionSchema>;

export const SkillGroupSchema = z.object({
  title: z.string().max(40),
  items: z.array(z.string().max(40)).max(12),
});
export type SkillGroup = z.infer<typeof SkillGroupSchema>;

export const SkillsSectionSchema = z.object({
  groups: z.array(SkillGroupSchema).max(5),
});
export type SkillsSection = z.infer<typeof SkillsSectionSchema>;

export const ProjectItemSchema = z.object({
  repo: z.string(),
  pitch: z.string().max(140),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const ProjectsSectionSchema = z.array(ProjectItemSchema).max(6);
export type ProjectsSection = z.infer<typeof ProjectsSectionSchema>;

export const ContactSectionSchema = z.object({
  closing: z.string().max(120),
});
export type ContactSection = z.infer<typeof ContactSectionSchema>;

/**
 * Batched full generation schema across all 5 sections
 */
export const SectionsSchema = z.object({
  intro: IntroSectionSchema,
  about: AboutSectionSchema,
  skills: SkillsSectionSchema,
  projects: ProjectsSectionSchema,
  contact: ContactSectionSchema,
});

export type SectionsOutput = z.infer<typeof SectionsSchema>;
