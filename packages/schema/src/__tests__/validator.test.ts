import { describe, it, expect } from "vitest";
import { SchemaValidator } from "../validator.js";
import type { CollectionDefinition, GlobalDefinition, ComponentDefinition, FieldDefinition } from "@blazing-cms/types";

const validator = new SchemaValidator();

describe("SchemaValidator", () => {
  describe("validateCollection", () => {
    it("passes for valid collection", () => {
      const c: CollectionDefinition = {
        slug: "posts",
        labels: { singular: "Post", plural: "Posts" },
        fields: [{ name: "title", type: "text" }],
      };
      expect(validator.validateCollection(c)).toEqual([]);
    });

    it("fails when slug is missing", () => {
      const c = { slug: "", labels: { singular: "x", plural: "y" }, fields: [{ name: "t", type: "text" as const }] };
      const errors = validator.validateCollection(c);
      expect(errors.some((e) => e.path === "slug")).toBe(true);
    });

    it("fails when singular label is missing", () => {
      const c = { slug: "x", labels: { singular: "", plural: "y" }, fields: [{ name: "t", type: "text" as const }] };
      const errors = validator.validateCollection(c);
      expect(errors.some((e) => e.message.includes("Singular"))).toBe(true);
    });

    it("fails when plural label is missing", () => {
      const c = { slug: "x", labels: { singular: "x", plural: "" }, fields: [{ name: "t", type: "text" as const }] };
      const errors = validator.validateCollection(c);
      expect(errors.some((e) => e.message.includes("Plural"))).toBe(true);
    });

    it("fails with no fields", () => {
      const c: CollectionDefinition = { slug: "x", labels: { singular: "X", plural: "Xs" }, fields: [] };
      const errors = validator.validateCollection(c);
      expect(errors.some((e) => e.message.includes("At least one field"))).toBe(true);
    });

    it("fails when select field has no options", () => {
      const c: CollectionDefinition = {
        slug: "x",
        labels: { singular: "X", plural: "Xs" },
        fields: [{ name: "color", type: "select", options: [] }],
      };
      const errors = validator.validateCollection(c);
      expect(errors.some((e) => e.path.includes("options"))).toBe(true);
    });

    it("fails when relation field has no target", () => {
      const c: CollectionDefinition = {
        slug: "x",
        labels: { singular: "X", plural: "Xs" },
        fields: [{ name: "rel", type: "relation", to: "" }],
      };
      const errors = validator.validateCollection(c);
      expect(errors.some((e) => e.path.includes("to"))).toBe(true);
    });

    it("fails when component field has no component slug", () => {
      const c: CollectionDefinition = {
        slug: "x",
        labels: { singular: "X", plural: "Xs" },
        fields: [{ name: "c", type: "component", component: "" }],
      };
      const errors = validator.validateCollection(c);
      expect(errors.some((e) => e.path.includes("component"))).toBe(true);
    });
  });

  describe("validateGlobal", () => {
    it("passes for valid global", () => {
      const g: GlobalDefinition = {
        slug: "homepage",
        label: "Homepage",
        fields: [{ name: "title", type: "text" }],
      };
      expect(validator.validateGlobal(g)).toEqual([]);
    });

    it("fails when slug is empty", () => {
      const g: GlobalDefinition = { slug: "", label: "X", fields: [] };
      expect(validator.validateGlobal(g).some((e) => e.path === "slug")).toBe(true);
    });

    it("fails when label is empty", () => {
      const g: GlobalDefinition = { slug: "x", label: "", fields: [] };
      expect(validator.validateGlobal(g).some((e) => e.message.includes("Label"))).toBe(true);
    });
  });

  describe("validateComponent", () => {
    it("passes for valid component", () => {
      const c: ComponentDefinition = {
        slug: "hero",
        label: "Hero",
        fields: [{ name: "heading", type: "text" }],
      };
      expect(validator.validateComponent(c)).toEqual([]);
    });

    it("fails when slug is empty", () => {
      const c: ComponentDefinition = { slug: "", label: "X", fields: [] };
      expect(validator.validateComponent(c).some((e) => e.path === "slug")).toBe(true);
    });
  });

  describe("validateField edge cases", () => {
    it("fails when field name is empty", () => {
      const c: CollectionDefinition = {
        slug: "x",
        labels: { singular: "X", plural: "Xs" },
        fields: [{ name: "", type: "text" }],
      };
      expect(validator.validateCollection(c).some((e) => e.message.includes("Field name"))).toBe(true);
    });
  });
});
