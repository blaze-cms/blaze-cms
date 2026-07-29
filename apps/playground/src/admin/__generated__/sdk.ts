// Auto-generated Blaze CMS SDK — do not edit

import { createClient } from "@blaze-cms/sdk";

const api = createClient({ baseUrl: "/api" });

export const array = {
  create: (data: Record<string, unknown>) => api.create("array", data),
  delete: (id: string) => api.delete("array", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("array", params),
  findOne: (id: string) => api.findOne("array", id),
  update: (id: string, data: Record<string, unknown>) => api.update("array", id, data),
};

export const boolean = {
  create: (data: Record<string, unknown>) => api.create("boolean", data),
  delete: (id: string) => api.delete("boolean", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("boolean", params),
  findOne: (id: string) => api.findOne("boolean", id),
  update: (id: string, data: Record<string, unknown>) => api.update("boolean", id, data),
};

export const component = {
  create: (data: Record<string, unknown>) => api.create("component", data),
  delete: (id: string) => api.delete("component", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("component", params),
  findOne: (id: string) => api.findOne("component", id),
  update: (id: string, data: Record<string, unknown>) => api.update("component", id, data),
};

export const date = {
  create: (data: Record<string, unknown>) => api.create("date", data),
  delete: (id: string) => api.delete("date", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("date", params),
  findOne: (id: string) => api.findOne("date", id),
  update: (id: string, data: Record<string, unknown>) => api.update("date", id, data),
};

export const dynamicZone = {
  create: (data: Record<string, unknown>) => api.create("dynamic-zone", data),
  delete: (id: string) => api.delete("dynamic-zone", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("dynamic-zone", params),
  findOne: (id: string) => api.findOne("dynamic-zone", id),
  update: (id: string, data: Record<string, unknown>) => api.update("dynamic-zone", id, data),
};

export const group = {
  create: (data: Record<string, unknown>) => api.create("group", data),
  delete: (id: string) => api.delete("group", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("group", params),
  findOne: (id: string) => api.findOne("group", id),
  update: (id: string, data: Record<string, unknown>) => api.update("group", id, data),
};

export const mediaTest = {
  create: (data: Record<string, unknown>) => api.create("media-test", data),
  delete: (id: string) => api.delete("media-test", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("media-test", params),
  findOne: (id: string) => api.findOne("media-test", id),
  update: (id: string, data: Record<string, unknown>) => api.update("media-test", id, data),
};

export const number = {
  create: (data: Record<string, unknown>) => api.create("number", data),
  delete: (id: string) => api.delete("number", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("number", params),
  findOne: (id: string) => api.findOne("number", id),
  update: (id: string, data: Record<string, unknown>) => api.update("number", id, data),
};

export const posts = {
  create: (data: Record<string, unknown>) => api.create("posts", data),
  delete: (id: string) => api.delete("posts", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("posts", params),
  findOne: (id: string) => api.findOne("posts", id),
  update: (id: string, data: Record<string, unknown>) => api.update("posts", id, data),
};

export const relation = {
  create: (data: Record<string, unknown>) => api.create("relation", data),
  delete: (id: string) => api.delete("relation", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("relation", params),
  findOne: (id: string) => api.findOne("relation", id),
  update: (id: string, data: Record<string, unknown>) => api.update("relation", id, data),
};

export const repeater = {
  create: (data: Record<string, unknown>) => api.create("repeater", data),
  delete: (id: string) => api.delete("repeater", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("repeater", params),
  findOne: (id: string) => api.findOne("repeater", id),
  update: (id: string, data: Record<string, unknown>) => api.update("repeater", id, data),
};

export const richText = {
  create: (data: Record<string, unknown>) => api.create("rich-text", data),
  delete: (id: string) => api.delete("rich-text", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("rich-text", params),
  findOne: (id: string) => api.findOne("rich-text", id),
  update: (id: string, data: Record<string, unknown>) => api.update("rich-text", id, data),
};

export const select = {
  create: (data: Record<string, unknown>) => api.create("select", data),
  delete: (id: string) => api.delete("select", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("select", params),
  findOne: (id: string) => api.findOne("select", id),
  update: (id: string, data: Record<string, unknown>) => api.update("select", id, data),
};

export const text = {
  create: (data: Record<string, unknown>) => api.create("text", data),
  delete: (id: string) => api.delete("text", id),
  findMany: (params?: Record<string, unknown>) => api.findMany("text", params),
  findOne: (id: string) => api.findOne("text", id),
  update: (id: string, data: Record<string, unknown>) => api.update("text", id, data),
};

export const homepage = {
  get: () => api.findOne("globals_homepage", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_homepage", "default", data),
};

export const siteSettings = {
  get: () => api.findOne("globals_site-settings", "default"),
  update: (data: Record<string, unknown>) => api.update("globals_site-settings", "default", data),
};

