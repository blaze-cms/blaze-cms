import { describe, it, expect, vi } from "vitest";

import { scaffold } from "../index.js";

describe("scaffold", () => {
  it("calls process.exit(1) when directory already exists", async () => {
    const exitMock = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit");
    });
    const errorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(scaffold(".")).rejects.toThrow("exit");
    expect(exitMock).toHaveBeenCalledWith(1);
    expect(errorMock).toHaveBeenCalledWith(expect.stringContaining("already exists"));
    exitMock.mockRestore();
    errorMock.mockRestore();
  });
});
