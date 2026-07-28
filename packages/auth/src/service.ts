import { getAuth, type Auth, type UserRecord } from "firebase-admin/auth";

import type { AuthUser } from "./types.js";

export class FirebaseAuthService {
  private auth: Auth;

  constructor() {
    this.auth = getAuth();
  }

  async verifyToken(token: string): Promise<AuthUser> {
    const decoded = await this.auth.verifyIdToken(token);
    const user = await this.auth.getUser(decoded.uid);
    return this.mapUser(user);
  }

  async getUser(uid: string): Promise<AuthUser | null> {
    try {
      const user = await this.auth.getUser(uid);
      return this.mapUser(user);
    } catch {
      return null;
    }
  }

  async createUser(params: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<AuthUser> {
    const createRequest: { email: string; password: string; displayName?: string | null } = {
      email: params.email,
      password: params.password,
    };
    if (params.displayName !== undefined) {
      createRequest.displayName = params.displayName;
    }
    const user = await this.auth.createUser(createRequest);
    return this.mapUser(user);
  }

  async updateUser(
    uid: string,
    params: {
      email?: string;
      password?: string;
      displayName?: string;
      disabled?: boolean;
    },
  ): Promise<AuthUser | null> {
    try {
      const user = await this.auth.updateUser(uid, params);
      return this.mapUser(user);
    } catch {
      return null;
    }
  }

  async deleteUser(uid: string): Promise<boolean> {
    try {
      await this.auth.deleteUser(uid);
      return true;
    } catch {
      return false;
    }
  }

  async listUsers(maxResults = 100): Promise<AuthUser[]> {
    const result = await this.auth.listUsers(maxResults);
    return result.users.map(this.mapUser);
  }

  async setCustomClaims(uid: string, claims: Record<string, unknown>): Promise<void> {
    await this.auth.setCustomUserClaims(uid, claims);
  }

  async generateResetLink(email: string): Promise<string> {
    return this.auth.generatePasswordResetLink(email);
  }

  private mapUser(user: UserRecord): AuthUser {
    return {
      customClaims: user.customClaims,
      disabled: user.disabled,
      displayName: user.displayName ?? undefined,
      email: user.email ?? undefined,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL ?? undefined,
      uid: user.uid,
    };
  }
}
