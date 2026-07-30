import { describe, it, expect, vi, beforeEach } from "vitest";

import { FirebaseAuthService } from "../service.js";

const mockVerifyIdToken = vi.fn();
const mockGetUser = vi.fn();
const mockCreateUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockDeleteUser = vi.fn();
const mockListUsers = vi.fn();
const mockSetCustomUserClaims = vi.fn();
const mockGeneratePasswordResetLink = vi.fn();

vi.mock("firebase-admin/auth", () => ({
  getAuth: () => ({
    createUser: mockCreateUser,
    deleteUser: mockDeleteUser,
    generatePasswordResetLink: mockGeneratePasswordResetLink,
    getUser: mockGetUser,
    listUsers: mockListUsers,
    setCustomUserClaims: mockSetCustomUserClaims,
    updateUser: mockUpdateUser,
    verifyIdToken: mockVerifyIdToken,
  }),
}));

const makeUserRecord = (overrides?: Record<string, unknown>) => ({
  customClaims: { role: "admin" },
  disabled: false,
  displayName: "Test User",
  email: "test@example.com",
  emailVerified: true,
  photoURL: "https://example.com/photo.jpg",
  toJSON: () => ({}),
  uid: "user-123",
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("FirebaseAuthService", () => {
  it("verifyToken resolves user from token", async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: "user-123" });
    mockGetUser.mockResolvedValue(makeUserRecord());
    const svc = new FirebaseAuthService();
    const user = await svc.verifyToken("valid-token");
    expect(user.uid).toBe("user-123");
    expect(user.email).toBe("test@example.com");
    expect(mockVerifyIdToken).toHaveBeenCalledWith("valid-token");
  });

  it("verifyToken throws when token is invalid", async () => {
    mockVerifyIdToken.mockRejectedValue(new Error("invalid token"));
    const svc = new FirebaseAuthService();
    await expect(svc.verifyToken("bad-token")).rejects.toThrow("invalid token");
  });

  it("getUser returns user for existing uid", async () => {
    mockGetUser.mockResolvedValue(makeUserRecord());
    const svc = new FirebaseAuthService();
    const user = await svc.getUser("user-123");
    expect(user).not.toBeNull();
    expect(user && user.uid).toBe("user-123");
  });

  it("getUser returns null for non-existing uid", async () => {
    mockGetUser.mockRejectedValue(new Error("not found"));
    const svc = new FirebaseAuthService();
    const user = await svc.getUser("nonexistent");
    expect(user).toBeNull();
  });

  it("createUser returns created user", async () => {
    mockCreateUser.mockResolvedValue(makeUserRecord());
    const svc = new FirebaseAuthService();
    const user = await svc.createUser({ email: "new@test.com", password: "secret123" });
    expect(user && user.uid).toBe("user-123");
    expect(mockCreateUser).toHaveBeenCalledWith({ email: "new@test.com", password: "secret123" });
  });

  it("createUser with displayName", async () => {
    mockCreateUser.mockResolvedValue(makeUserRecord({ displayName: "New User" }));
    const svc = new FirebaseAuthService();
    await svc.createUser({ displayName: "New User", email: "new@test.com", password: "secret123" });
    expect(mockCreateUser).toHaveBeenCalledWith({
      displayName: "New User",
      email: "new@test.com",
      password: "secret123",
    });
  });

  it("updateUser returns updated user", async () => {
    mockUpdateUser.mockResolvedValue(makeUserRecord({ displayName: "Updated" }));
    const svc = new FirebaseAuthService();
    const user = await svc.updateUser("user-123", { displayName: "Updated" });
    expect(user && user.displayName).toBe("Updated");
  });

  it("updateUser returns null on failure", async () => {
    mockUpdateUser.mockRejectedValue(new Error("not found"));
    const svc = new FirebaseAuthService();
    const user = await svc.updateUser("nonexistent", { displayName: "X" });
    expect(user).toBeNull();
  });

  it("deleteUser returns true on success", async () => {
    mockDeleteUser.mockResolvedValue(undefined);
    const svc = new FirebaseAuthService();
    const result = await svc.deleteUser("user-123");
    expect(result).toBe(true);
  });

  it("deleteUser returns false on failure", async () => {
    mockDeleteUser.mockRejectedValue(new Error("not found"));
    const svc = new FirebaseAuthService();
    const result = await svc.deleteUser("nonexistent");
    expect(result).toBe(false);
  });

  it("listUsers returns mapped users", async () => {
    mockListUsers.mockResolvedValue({
      pageToken: undefined,
      users: [makeUserRecord({ uid: "u1" }), makeUserRecord({ uid: "u2" })],
    });
    const svc = new FirebaseAuthService();
    const users = await svc.listUsers();
    expect(users).toHaveLength(2);
    expect(users[0] && users[0].uid).toBe("u1");
    expect(users[1] && users[1].uid).toBe("u2");
  });

  it("listUsers respects maxResults", async () => {
    mockListUsers.mockResolvedValue({ pageToken: undefined, users: [] });
    const svc = new FirebaseAuthService();
    await svc.listUsers(50);
    expect(mockListUsers).toHaveBeenCalledWith(50);
  });

  it("setCustomClaims delegates to Firebase", async () => {
    mockSetCustomUserClaims.mockResolvedValue(undefined);
    const svc = new FirebaseAuthService();
    await svc.setCustomClaims("user-123", { role: "editor" });
    expect(mockSetCustomUserClaims).toHaveBeenCalledWith("user-123", { role: "editor" });
  });

  it("generateResetLink returns link", async () => {
    mockGeneratePasswordResetLink.mockResolvedValue("https://reset-link");
    const svc = new FirebaseAuthService();
    const link = await svc.generateResetLink("user@test.com");
    expect(link).toBe("https://reset-link");
  });

  it("mapUser handles null displayName, email, photoURL", async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: "user-123" });
    mockGetUser.mockResolvedValue(
      makeUserRecord({
        displayName: null,
        email: null,
        photoURL: null,
      }),
    );
    const svc = new FirebaseAuthService();
    const user = await svc.verifyToken("token");
    expect(user.displayName).toBeUndefined();
    expect(user.email).toBeUndefined();
    expect(user.photoURL).toBeUndefined();
    expect(user.uid).toBe("user-123");
  });
});
