import { describe, it, expect } from "vitest";
import { BlazeError, NotFoundError, ValidationError } from "../errors.js";

describe("BlazeError", () => {
  it("creates error with message and code", () => {
    const err = new BlazeError("Something went wrong", "UNKNOWN");
    expect(err.message).toBe("Something went wrong");
    expect(err.code).toBe("UNKNOWN");
    expect(err.name).toBe("BlazeError");
  });

  it("creates error without code", () => {
    const err = new BlazeError("Oops");
    expect(err.code).toBeUndefined();
  });
});

describe("NotFoundError", () => {
  it("creates error with resource and id", () => {
    const err = new NotFoundError("Post", "abc123");
    expect(err.message).toBe('Post "abc123" not found');
    expect(err.code).toBe("NOT_FOUND");
    expect(err.name).toBe("NotFoundError");
  });
});

describe("ValidationError", () => {
  it("creates error with message and fields", () => {
    const err = new ValidationError("Invalid data", { title: ["Required"] });
    expect(err.message).toBe("Invalid data");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.fields?.title).toEqual(["Required"]);
  });

  it("creates error without fields", () => {
    const err = new ValidationError("Bad input");
    expect(err.fields).toBeUndefined();
  });
});
