import type { FirebaseAuthService } from "./service.js";
import type { AuthUser } from "./types.js";

export interface AuthenticatedRequest {
  user?: AuthUser | undefined;
  headers: Record<string, string | undefined>;
}

export function createAuthMiddleware(authService: FirebaseAuthService) {
  return async (request: AuthenticatedRequest): Promise<boolean> => {
    const authHeader = request.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return false;
    }
    const token = authHeader.slice(7);
    try {
      const user = await authService.verifyToken(token);
      request.user = user;
      return true;
    } catch {
      return false;
    }
  };
}
