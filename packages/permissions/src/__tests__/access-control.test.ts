import { describe, it, expect, vi } from "vitest";

import { AccessControl } from "../access-control.js";

describe("AccessControl", () => {
  function createAC() {
    const ac = new AccessControl();
    ac.registerRole({
      name: "admin",
      permissions: [{ action: "*" }],
    });
    ac.registerRole({
      name: "editor",
      permissions: [
        { action: ["create", "read", "update"], collection: "posts" },
        { action: "read", collection: "users" },
      ],
    });
    ac.registerRole({
      name: "viewer",
      permissions: [{ action: "read", collection: "*" }],
    });
    return ac;
  }

  describe("registerRole / getRole", () => {
    it("registers and retrieves a role", () => {
      const ac = new AccessControl();
      ac.registerRole({ name: "moderator", permissions: [] });
      const role = ac.getRole("moderator");
      expect(role).toBeDefined();
      expect(role?.name).toBe("moderator");
    });

    it("returns undefined for unknown role", () => {
      expect(new AccessControl().getRole("nobody")).toBeUndefined();
    });

    it("removeRole deletes a role", () => {
      const ac = new AccessControl();
      ac.registerRole({ name: "temp", permissions: [] });
      ac.removeRole("temp");
      expect(ac.getRole("temp")).toBeUndefined();
    });

    it("getAllRoles returns all registered roles", () => {
      const ac = createAC();
      expect(ac.getAllRoles()).toHaveLength(3);
    });
  });

  describe("can", () => {
    it("admin can do anything", () => {
      const ac = createAC();
      expect(ac.can("admin", "create", "any-collection").allowed).toBe(true);
      expect(ac.can("admin", "delete").allowed).toBe(true);
      expect(ac.can("admin", "publish").allowed).toBe(true);
    });

    it("editor can create/read/update posts", () => {
      const ac = createAC();
      expect(ac.can("editor", "create", "posts").allowed).toBe(true);
      expect(ac.can("editor", "read", "posts").allowed).toBe(true);
      expect(ac.can("editor", "update", "posts").allowed).toBe(true);
    });

    it("editor cannot delete posts", () => {
      const ac = createAC();
      const result = ac.can("editor", "delete", "posts");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("No permission");
    });

    it("editor can read users but not create them", () => {
      const ac = createAC();
      expect(ac.can("editor", "read", "users").allowed).toBe(true);
      expect(ac.can("editor", "create", "users").allowed).toBe(false);
    });

    it("viewer can read any collection", () => {
      const ac = createAC();
      expect(ac.can("viewer", "read", "anything").allowed).toBe(true);
    });

    it("viewer cannot create", () => {
      const ac = createAC();
      expect(ac.can("viewer", "create", "anything").allowed).toBe(false);
    });

    it("denies without collection uses wildcard in reason", () => {
      const ac = createAC();
      const result = ac.can("viewer", "create");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("*");
    });

    it("returns not-allowed for unknown role", () => {
      const ac = createAC();
      const result = ac.can("unknown", "read");
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("Role 'unknown' not found");
    });
  });

  describe("canAll", () => {
    it("admin passes all actions", () => {
      const ac = createAC();
      expect(ac.canAll("admin", ["create", "read", "update", "delete"]).allowed).toBe(true);
    });

    it("editor fails on delete+create across collections", () => {
      const ac = createAC();
      const result = ac.canAll("editor", ["create", "delete"], "posts");
      expect(result.allowed).toBe(false);
    });
  });

  describe("filterAllowedFields", () => {
    it("admin gets all fields", () => {
      const ac = createAC();
      const fields = ac.filterAllowedFields("admin", "update", "posts", ["title", "content"]);
      expect(fields).toEqual(["title", "content"]);
    });

    it("returns empty for unknown role", () => {
      const ac = createAC();
      expect(ac.filterAllowedFields("nobody", "read", "x", ["a"])).toEqual([]);
    });

    it("returns all fields when role has wildcard permission", () => {
      const ac = createAC();
      ac.registerRole({
        name: "wild",
        permissions: [{ action: "read", collection: "*" }],
      });
      expect(ac.filterAllowedFields("wild", "read", "anything", ["a", "b"])).toEqual(["a", "b"]);
    });

    it("returns all fields when role has field-level but matching permission", () => {
      const ac = new AccessControl();
      ac.registerRole({
        name: "restricted",
        permissions: [{ action: "update", collection: "posts", fields: ["title"] }],
      });
      const fields = ac.filterAllowedFields("restricted", "update", "posts", [
        "title",
        "content",
        "secret",
      ]);
      expect(fields).toEqual(["title", "content", "secret"]);
    });

    it("returns empty when no permission matches action", () => {
      const ac = new AccessControl();
      ac.registerRole({
        name: "restricted",
        permissions: [{ action: "update", collection: "posts", fields: ["title"] }],
      });
      const fields = ac.filterAllowedFields("restricted", "delete", "posts", ["title", "content"]);
      expect(fields).toEqual([]);
    });

    it("filters fields when field-level permission restricts access", () => {
      const ac = new AccessControl();
      ac.registerRole({
        name: "restricted",
        permissions: [{ action: "read", collection: "posts", fields: ["title"] }],
      });
      vi.spyOn(ac, "can").mockReturnValue({ allowed: false });
      const fields = ac.filterAllowedFields("restricted", "read", "posts", [
        "title",
        "content",
        "secret",
      ]);
      expect(fields).toEqual(["title"]);
    });
  });
});
