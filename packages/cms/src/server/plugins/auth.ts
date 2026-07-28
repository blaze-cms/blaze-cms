import { FirebaseAuthService } from "@blaze-cms/auth";

export function createAuthMiddleware() {
  const authService = new FirebaseAuthService();

  return async (request: { headers: Record<string, string | undefined> }): Promise<boolean> => {
    const authHeader = request.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return false;
    }
    const token = authHeader.slice(7);
    try {
      await authService.verifyToken(token);
      return true;
    } catch {
      return false;
    }
  };
}
