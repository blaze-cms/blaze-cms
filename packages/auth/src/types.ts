export interface AuthUser {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  emailVerified: boolean;
  disabled: boolean;
  customClaims: Record<string, unknown> | undefined;
}

export interface AuthConfig {
  secret: string;
  expiresIn: string;
}
