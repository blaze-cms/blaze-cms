import { describe, it, expect, vi } from "vitest";

import type { AuthenticatedRequest } from "../middleware.js";
import type { FirebaseAuthService } from "../service.js";

import { createAuthMiddleware } from "../middleware.js";

describe("createAuthMiddleware", () => {
  const mockVerify = vi.fn();
  const mockService = {
    verifyToken: mockVerify,
  } as unknown as FirebaseAuthService;

  it("returns false when no authorization header", async () => {
    const middleware = createAuthMiddleware(mockService);
    const request = { headers: {} } as AuthenticatedRequest;
    const result = await middleware(request);
    expect(result).toBe(false);
  });

  it("returns false when header does not start with Bearer", async () => {
    const middleware = createAuthMiddleware(mockService);
    const request = { headers: { authorization: "Basic token" } } as AuthenticatedRequest;
    const result = await middleware(request);
    expect(result).toBe(false);
  });

  it("returns true and sets user when token is valid", async () => {
    const user = { email: "test@test.com", uid: "user-123" };
    mockVerify.mockResolvedValue(user);
    const middleware = createAuthMiddleware(mockService);
    const request = { headers: { authorization: "Bearer valid-token" } } as AuthenticatedRequest;
    const result = await middleware(request);
    expect(result).toBe(true);
    expect(request.user).toEqual(user);
    expect(mockVerify).toHaveBeenCalledWith("valid-token");
  });

  it("returns false when token verification fails", async () => {
    mockVerify.mockRejectedValue(new Error("invalid"));
    const middleware = createAuthMiddleware(mockService);
    const request = { headers: { authorization: "Bearer bad-token" } } as AuthenticatedRequest;
    const result = await middleware(request);
    expect(result).toBe(false);
    expect(request.user).toBeUndefined();
  });
});
