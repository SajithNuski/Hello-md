import { z } from "zod";

/**
 * Schema limits are deliberately LOOSER than the final limits.
 * Over-length model output used to fail the whole generation. Now the schema
 * accepts it and validate.ts clamps each field to its real limit (LIMITS).
 */

export const IntroSectionSchema = z.object({
  headline: z.string().max(200),
  tagline: z.string().max(400),
  roles: z.array(z.string().max(120)).max(6).default([]),
});
export type IntroSection = z.infer<typeof IntroSectionSchema>;

export const AboutSectionSchema = z.object({
  paragraphs: z.array(z.string().max(1200)).min(1).max(4),
  highlights: z.array(z.string().max(250)).max(8).default([]),
  areas: z.array(z.string().max(120)).max(8).default([]),
});
export type AboutSection = z.infer<typeof AboutSectionSchema>;

export const SkillGroupSchema = z.object({
  title: z.string().max(80),
  items: z.array(z.string().max(60)).max(20),
});
export type SkillGroup = z.infer<typeof SkillGroupSchema>;

export const SkillsSectionSchema = z.object({
  groups: z.array(SkillGroupSchema).max(8),
});
export type SkillsSection = z.infer<typeof SkillsSectionSchema>;

export const ProjectItemSchema = z.object({
  repo: z.string(),
  pitch: z.string().max(500),
  highlights: z.array(z.string().max(250)).max(4).default([]),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const ProjectsSectionSchema = z.array(ProjectItemSchema).max(4);
export type ProjectsSection = z.infer<typeof ProjectsSectionSchema>;

export const ContactSectionSchema = z.object({
  closing: z.string().max(400),
});
export type ContactSection = z.infer<typeof ContactSectionSchema>;

/**
 * Batched full generation schema across all 5 AI sections.
 * ("stats" is a code-only section and has no AI data.)
 */
export const SectionsSchema = z.object({
  intro: IntroSectionSchema,
  about: AboutSectionSchema,
  skills: SkillsSectionSchema,
  projects: ProjectsSectionSchema,
  contact: ContactSectionSchema,
});

export type SectionsOutput = z.infer<typeof SectionsSchema>;
