import type { FieldDefinition } from "@blaze-cms/types";

import { z } from "zod";

export function generateZodSchema(
  fields: FieldDefinition[],
): z.ZodObject<Record<string, z.ZodType>> {
  const shape: Record<string, z.ZodType> = {};

  for (const field of fields) {
    shape[field.name] = generateFieldSchema(field);
  }

  return z.object(shape);
}

function generateFieldSchema(field: FieldDefinition): z.ZodType {
  let schema = baseFieldSchema(field);

  if (field.validation) {
    if (field.validation.min !== undefined) {
      if (schema instanceof z.ZodNumber) {
        schema = (schema as z.ZodNumber).min(field.validation.min);
      }
    }
    if (field.validation.max !== undefined) {
      if (schema instanceof z.ZodNumber) {
        schema = (schema as z.ZodNumber).max(field.validation.max);
      }
    }
    if (field.validation.minLength !== undefined) {
      if (schema instanceof z.ZodString) {
        schema = (schema as z.ZodString).min(field.validation.minLength);
      }
    }
    if (field.validation.maxLength !== undefined) {
      if (schema instanceof z.ZodString) {
        schema = (schema as z.ZodString).max(field.validation.maxLength);
      }
    }
    if (field.validation.pattern) {
      if (schema instanceof z.ZodString) {
        schema = (schema as z.ZodString).regex(new RegExp(field.validation.pattern));
      }
    }
  }

  if (!field.validation?.required) {
    schema = schema.optional();
  }

  if (field.defaultValue !== undefined) {
    schema = schema.default(field.defaultValue);
  }

  return schema;
}

function baseFieldSchema(field: FieldDefinition): z.ZodType {
  switch (field.type) {
    case "text":
    case "textarea":
    case "email":
    case "url":
    case "password":
    case "slug":
    case "richText":
    case "markdown":
    case "code":
    case "color":
      return z.string();
    case "number":
      return z.number();
    case "boolean":
    case "checkbox":
      return z.boolean();
    case "date":
    case "datetime":
      return z.string();
    case "json":
      return z.unknown();
    case "select":
      return z.string();
    case "multiSelect":
      return z.array(z.string());
    case "radio":
      return z.string();
    case "media":
    case "upload":
      return field.type === "media" && field.multiple ? z.array(z.string()) : z.string();
    case "relation":
      return field.kind === "oneToMany" || field.kind === "manyToMany"
        ? z.array(z.string())
        : z.string();
    case "component":
      return field.repeatable
        ? z.array(z.record(z.string(), z.unknown()))
        : z.record(z.string(), z.unknown());
    case "dynamicZone":
      return z.array(z.object({ __component: z.string() }).catchall(z.unknown()));
    case "array":
      return z.array(generateZodSchema(field.fields));
    case "object":
    case "group":
      return generateZodSchema(field.fields);
    case "tabs":
      return z.object(
        Object.fromEntries(field.tabs.map((tab) => [tab.label, generateZodSchema(tab.fields)])),
      );
    case "repeater":
      return z.array(generateZodSchema(field.fields));
    default:
      return z.unknown();
  }
}
