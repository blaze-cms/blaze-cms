import { SchemaValidator } from "@blaze-cms/schema";
import { describe, it, expect } from "vitest";

import arrayCollection from "../../cms/collections/array.js";
import booleanCollection from "../../cms/collections/boolean.js";
import componentCollection from "../../cms/collections/component.js";
import dateCollection from "../../cms/collections/date.js";
import dynamicZoneCollection from "../../cms/collections/dynamic-zone.js";
import groupCollection from "../../cms/collections/group.js";
import mediaCollection from "../../cms/collections/media.js";
import numberCollection from "../../cms/collections/number.js";
// Collection schemas
import postsCollection from "../../cms/collections/posts.js";
import relationCollection from "../../cms/collections/relation.js";
import repeaterCollection from "../../cms/collections/repeater.js";
import richTextCollection from "../../cms/collections/rich-text.js";
import selectCollection from "../../cms/collections/select.js";
import textCollection from "../../cms/collections/text.js";
import buttonComponent from "../../cms/components/button.js";
import ctaComponent from "../../cms/components/cta.js";
// Component schemas
import heroComponent from "../../cms/components/hero.js";
import mediaCardComponent from "../../cms/components/media-card.js";
import seoComponent from "../../cms/components/seo.js";
// Global schemas
import homepageGlobal from "../../cms/globals/homepage.js";
import siteSettingsGlobal from "../../cms/globals/site-settings.js";

const validator = new SchemaValidator();

describe("playground collection schemas", () => {
  const collections = [
    { name: "posts", schema: postsCollection },
    { name: "text", schema: textCollection },
    { name: "number", schema: numberCollection },
    { name: "boolean", schema: booleanCollection },
    { name: "date", schema: dateCollection },
    { name: "media-test", schema: mediaCollection },
    { name: "rich-text", schema: richTextCollection },
    { name: "select", schema: selectCollection },
    { name: "relation", schema: relationCollection },
    { name: "group", schema: groupCollection },
    { name: "repeater", schema: repeaterCollection },
    { name: "array", schema: arrayCollection },
    { name: "component", schema: componentCollection },
    { name: "dynamic-zone", schema: dynamicZoneCollection },
  ];

  for (const { name, schema } of collections) {
    it(`${name} passes validation`, () => {
      const errors = validator.validateCollection(schema);
      expect(errors).toEqual([]);
    });

    it(`${name} has a slug`, () => {
      expect(schema.slug).toBeTruthy();
    });

    it(`${name} has labels`, () => {
      expect(schema.labels.singular).toBeTruthy();
      expect(schema.labels.plural).toBeTruthy();
    });

    it(`${name} has at least one field`, () => {
      expect(schema.fields.length).toBeGreaterThan(0);
    });

    it(`${name} all fields have names`, () => {
      for (const field of schema.fields) {
        expect(field.name).toBeTruthy();
      }
    });
  }
});

describe("playground global schemas", () => {
  const globals = [
    { name: "homepage", schema: homepageGlobal },
    { name: "site-settings", schema: siteSettingsGlobal },
  ];

  for (const { name, schema } of globals) {
    it(`${name} passes validation`, () => {
      const errors = validator.validateGlobal(schema);
      expect(errors).toEqual([]);
    });

    it(`${name} has a slug`, () => {
      expect(schema.slug).toBeTruthy();
    });

    it(`${name} has a label`, () => {
      expect(schema.label).toBeTruthy();
    });

    it(`${name} all fields have names`, () => {
      for (const field of schema.fields) {
        expect(field.name).toBeTruthy();
      }
    });
  }
});

describe("playground component schemas", () => {
  const components = [
    { name: "hero", schema: heroComponent },
    { name: "button", schema: buttonComponent },
    { name: "cta", schema: ctaComponent },
    { name: "media-card", schema: mediaCardComponent },
    { name: "seo", schema: seoComponent },
  ];

  for (const { name, schema } of components) {
    it(`${name} passes validation`, () => {
      const errors = validator.validateComponent(schema);
      expect(errors).toEqual([]);
    });

    it(`${name} has a slug`, () => {
      expect(schema.slug).toBeTruthy();
    });

    it(`${name} has a label`, () => {
      expect(schema.label).toBeTruthy();
    });

    it(`${name} all fields have names`, () => {
      for (const field of schema.fields) {
        expect(field.name).toBeTruthy();
      }
    });
  }
});
