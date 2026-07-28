export interface ServerConfig {
  port: number;
  host: string;
  firebase: {
    projectId: string;
    clientEmail?: string;
    privateKey?: string;
    storageBucket?: string;
  };
  auth: {
    secret: string;
    expiresIn: string;
  };
  logger: {
    level: string;
  };
  cors: {
    origin: string;
  };
  rateLimit: {
    max: number;
    timeWindow: string;
  };
  swagger: {
    enabled: boolean;
  };
}

export function createServerConfig(): ServerConfig {
  return {
    auth: {
      expiresIn: process.env.AUTH_EXPIRES_IN ?? "7d",
      secret: process.env.AUTH_SECRET ?? "change-me",
    },
    cors: {
      origin: process.env.CORS_ORIGIN ?? "*",
    },
    firebase: {
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID ?? "",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    host: process.env.HOST ?? "0.0.0.0",
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
    },
    port: Number(process.env.PORT ?? "3000"),
    rateLimit: {
      max: Number(process.env.RATE_LIMIT_MAX ?? "100"),
      timeWindow: process.env.RATE_LIMIT_WINDOW ?? "1 minute",
    },
    swagger: {
      enabled: process.env.SWAGGER_ENABLED === "true",
    },
  };
}
