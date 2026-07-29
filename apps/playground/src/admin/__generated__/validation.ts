import { z } from "zod";

export const ArraySchema = z.object({
  field: z.unknown().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type ArrayInput = z.infer<typeof ArraySchema>;

export const BooleanSchema = z.object({
  field: z.boolean().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type BooleanInput = z.infer<typeof BooleanSchema>;

export const ComponentSchema = z.object({
  field: z.unknown().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type ComponentInput = z.infer<typeof ComponentSchema>;

export const DateSchema = z.object({
  field: z.string().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type DateInput = z.infer<typeof DateSchema>;

export const DynamicZoneSchema = z.object({
  field: z.unknown().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type DynamicZoneInput = z.infer<typeof DynamicZoneSchema>;

export const GroupSchema = z.object({
  field: z.unknown().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type GroupInput = z.infer<typeof GroupSchema>;

export const MediaTestSchema = z.object({
  field: z.string().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type MediaTestInput = z.infer<typeof MediaTestSchema>;

export const NumberSchema = z.object({
  field: z.number().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type NumberInput = z.infer<typeof NumberSchema>;

export const PostsSchema = z.object({
  author: z.string().optional(),
  category: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  id: z.string().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().optional(),
  slug: z.string().optional(),
  title: z.string(),
});

export type PostsInput = z.infer<typeof PostsSchema>;

export const RelationSchema = z.object({
  field: z.string().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type RelationInput = z.infer<typeof RelationSchema>;

export const RepeaterSchema = z.object({
  field: z.unknown().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type RepeaterInput = z.infer<typeof RepeaterSchema>;

export const RichTextSchema = z.object({
  field: z.string().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type RichTextInput = z.infer<typeof RichTextSchema>;

export const SelectSchema = z.object({
  field: z.string().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type SelectInput = z.infer<typeof SelectSchema>;

export const TextSchema = z.object({
  field: z.string().optional(),
  id: z.string().optional(),
  title: z.string(),
});

export type TextInput = z.infer<typeof TextSchema>;

