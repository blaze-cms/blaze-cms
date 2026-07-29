// Auto-generated Blazing CMS SDK — do not edit

import { createClient } from "@blazing-cms/sdk";

const api = createClient({ baseUrl: "/api" });

export const array = {
  findMany: (params?: Record<string, unknown>) => api.findMany("array", params),
  findOne: (id: string) => api.findOne("array", id),
  create: (data: Record<string, unknown>) => api.create("array", data),
  update: (id: string, data: Record<string, unknown>) => api.update("array", id, data),
  delete: (id: string) => api.delete("array", id),
};

export const boolean = {
  findMany: (params?: Record<string, unknown>) => api.findMany("boolean", params),
  findOne: (id: string) => api.findOne("boolean", id),
  create: (data: Record<string, unknown>) => api.create("boolean", data),
  update: (id: string, data: Record<string, unknown>) => api.update("boolean", id, data),
  delete: (id: string) => api.delete("boolean", id),
};

export const component = {
  findMany: (params?: Record<string, unknown>) => api.findMany("component", params),
  findOne: (id: string) => api.findOne("component", id),
  create: (data: Record<string, unknown>) => api.create("component", data),
  update: (id: string, data: Record<string, unknown>) => api.update("component", id, data),
  delete: (id: string) => api.delete("component", id),
};

export const date = {
  findMany: (params?: Record<string, unknown>) => api.findMany("date", params),
  findOne: (id: string) => api.findOne("date", id),
  create: (data: Record<string, unknown>) => api.create("date", data),
  update: (id: string, data: Record<string, unknown>) => api.update("date", id, data),
  delete: (id: string) => api.delete("date", id),
};

export const dynamicZone = {
  findMany: (params?: Record<string, unknown>) => api.findMany("dynamic-zone", params),
  findOne: (id: string) => api.findOne("dynamic-zone", id),
  create: (data: Record<string, unknown>) => api.create("dynamic-zone", data),
  update: (id: string, data: Record<string, unknown>) => api.update("dynamic-zone", id, data),
  delete: (id: string) => api.delete("dynamic-zone", id),
};

export const group = {
  findMany: (params?: Record<string, unknown>) => api.findMany("group", params),
  findOne: (id: string) => api.findOne("group", id),
  create: (data: Record<string, unknown>) => api.create("group", data),
  update: (id: string, data: Record<string, unknown>) => api.update("group", id, data),
  delete: (id: string) => api.delete("group", id),
};

export const mediaTest = {
  findMany: (params?: Record<string, unknown>) => api.findMany("media-test", params),
  findOne: (id: string) => api.findOne("media-test", id),
  create: (data: Record<string, unknown>) => api.create("media-test", data),
  update: (id: string, data: Record<string, unknown>) => api.update("media-test", id, data),
  delete: (id: string) => api.delete("media-test", id),
};

export const number = {
  findMany: (params?: Record<string, unknown>) => api.findMany("number", params),
  findOne: (id: string) => api.findOne("number", id),
  create: (data: Record<string, unknown>) => api.create("number", data),
  update: (id: string, data: Record<string, unknown>) => api.update("number", id, data),
  delete: (id: string) => api.delete("number", id),
};

export const posts = {
  findMany: (params?: Record<string, unknown>) => api.findMany("posts", params),
  findOne: (id: string) => api.findOne("posts", id),
  create: (data: Record<string, unknown>) => api.create("posts", data),
  update: (id: string, data: Record<string, unknown>) => api.update("posts", id, data),
  delete: (id: string) => api.delete("posts", id),
};

export const relation = {
  findMany: (params?: Record<string, unknown>) => api.findMany("relation", params),
  findOne: (id: string) => api.findOne("relation", id),
  create: (data: Record<string, unknown>) => api.create("relation", data),
  update: (id: string, data: Record<string, unknown>) => api.update("relation", id, data),
  delete: (id: string) => api.delete("relation", id),
};

export const repeater = {
  findMany: (params?: Record<string, unknown>) => api.findMany("repeater", params),
  findOne: (id: string) => api.findOne("repeater", id),
  create: (data: Record<string, unknown>) => api.create("repeater", data),
  update: (id: string, data: Record<string, unknown>) => api.update("repeater", id, data),
  delete: (id: string) => api.delete("repeater", id),
};

export const richText = {
  findMany: (params?: Record<string, unknown>) => api.findMany("rich-text", params),
  findOne: (id: string) => api.findOne("rich-text", id),
  create: (data: Record<string, unknown>) => api.create("rich-text", data),
  update: (id: string, data: Record<string, unknown>) => api.update("rich-text", id, data),
  delete: (id: string) => api.delete("rich-text", id),
};

export const select = {
  findMany: (params?: Record<string, unknown>) => api.findMany("select", params),
  findOne: (id: string) => api.findOne("select", id),
  create: (data: Record<string, unknown>) => api.create("select", data),
  update: (id: string, data: Record<string, unknown>) => api.update("select", id, data),
  delete: (id: string) => api.delete("select", id),
};

export const text = {
  findMany: (params?: Record<string, unknown>) => api.findMany("text", params),
  findOne: (id: string) => api.findOne("text", id),
  create: (data: Record<string, unknown>) => api.create("text", data),
  update: (id: string, data: Record<string, unknown>) => api.update("text", id, data),
  delete: (id: string) => api.delete("text", id),
};

export const boolean = {
  get: () => api.findOne("globals_boolean", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_boolean", "default", data),
};

export const checkbox = {
  get: () => api.findOne("globals_checkbox", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_checkbox", "default", data),
};

export const code = {
  get: () => api.findOne("globals_code", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_code", "default", data),
};

export const color = {
  get: () => api.findOne("globals_color", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_color", "default", data),
};

export const date = {
  get: () => api.findOne("globals_date", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_date", "default", data),
};

export const datetime = {
  get: () => api.findOne("globals_datetime", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_datetime", "default", data),
};

export const email = {
  get: () => api.findOne("globals_email", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_email", "default", data),
};

export const homepage = {
  get: () => api.findOne("globals_homepage", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_homepage", "default", data),
};

export const json = {
  get: () => api.findOne("globals_json", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_json", "default", data),
};

export const markdown = {
  get: () => api.findOne("globals_markdown", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_markdown", "default", data),
};

export const mediaSettings = {
  get: () => api.findOne("globals_media-settings", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_media-settings", "default", data),
};

export const multiSelect = {
  get: () => api.findOne("globals_multi-select", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_multi-select", "default", data),
};

export const number = {
  get: () => api.findOne("globals_number", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_number", "default", data),
};

export const password = {
  get: () => api.findOne("globals_password", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_password", "default", data),
};

export const radio = {
  get: () => api.findOne("globals_radio", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_radio", "default", data),
};

export const richText = {
  get: () => api.findOne("globals_rich-text", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_rich-text", "default", data),
};

export const select = {
  get: () => api.findOne("globals_select", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_select", "default", data),
};

export const siteSettings = {
  get: () => api.findOne("globals_site-settings", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_site-settings", "default", data),
};

export const slug = {
  get: () => api.findOne("globals_slug", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_slug", "default", data),
};

export const text = {
  get: () => api.findOne("globals_text", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_text", "default", data),
};

export const textarea = {
  get: () => api.findOne("globals_textarea", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_textarea", "default", data),
};

export const url = {
  get: () => api.findOne("globals_url", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_url", "default", data),
};

