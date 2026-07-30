import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCreateInterface } = vi.hoisted(() => ({
  mockCreateInterface: vi.fn(),
}));

vi.mock("node:readline", () => ({
  createInterface: mockCreateInterface,
}));

import { prompt } from "../commands/utils/prompt.js";

describe("prompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("asks a question and returns the answer trimmed", async () => {
    const mockQuestion = vi.fn((_q: string, cb: (a: string) => void) => {
      cb("  my-answer  ");
    });
    const mockClose = vi.fn();
    mockCreateInterface.mockReturnValue({
      close: mockClose,
      question: mockQuestion,
    });

    const result = await prompt("Type? (collection/global/component): ");

    expect(result).toBe("my-answer");
    expect(mockQuestion).toHaveBeenCalledWith(
      "Type? (collection/global/component): ",
      expect.any(Function),
    );
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("returns empty string for empty input", async () => {
    mockCreateInterface.mockReturnValue({
      close: vi.fn(),
      question: (_q: string, cb: (a: string) => void) => cb(""),
    });

    const result = await prompt("Enter slug: ");
    expect(result).toBe("");
  });
});
