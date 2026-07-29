import { config } from "dotenv";
config();

export interface BlazeUserConfig {
  firebase: {
    projectId: string;
    apiKey?: string;
    authDomain?: string;
    storageBucket?: string;
    appId?: string;
  };
}

export function defineConfig(config: BlazeUserConfig): BlazeUserConfig {
  return config;
}

function printHelp(): void {
  console.warn(`
Usage: blaze <command> [options]

Commands:
  dev               Start dev server (Vite + Firebase Emulator)
  build             Build admin panel for production
  generate          Run code generation (types, SDK, schema registry, rules, indexes)
  deploy            Deploy admin panel to Firebase Hosting
  scaffold          Scaffold a new collection, global, or component
  lint              Lint schema definitions
  doctor            Check project health

Options:
  --help            Show help
  --sync            Sync schemas to Firestore after generation
                    Requires VITE_FIREBASE_PROJECT_ID and valid Firebase credentials.
                    You may set GOOGLE_APPLICATION_CREDENTIALS for a service account,
                    or omit it to use Application Default Credentials.
                    Writes to _schemas/collections/{slug}, _schemas/globals/{slug},
                    and _schemas/components/{slug}. Removed schemas are marked
                    deprecated: true rather than deleted. The admin panel reads
                    from these collections at runtime.
                    Use "firebase-admin" privileges only; the admin panel UI also
                    offers manual sync for authenticated admin users.
  --project <id>    Firebase project ID (for deploy)
  --dir <path>      Schema directory (default: cms/)
  --name <slug>     Schema slug (for scaffold)

Config:
  .env              Loaded via dotenv. Set VITE_FIREBASE_* variables for
                    project config and VITE_BACKEND_MODE (firebase|mock|server).
                    See .env.example for required vars.

Schema Sync Flow:
  TypeScript schema files (cms/collections/*.ts, cms/globals/*.ts, cms/components/*.ts)
  are the source of truth. Running "blaze generate --sync" regenerates local artifacts
  (types, validation, SDK, schema registry, Firestore rules/indexes) and writes schema
  definitions to Firestore under _schemas/. The admin panel introspects these at runtime.

  To sync manually from the admin UI (when using Firebase backend mode):
    1. Sign in with an admin user (has custom claim admin: true)
    2. Navigate to /schemas
    3. Click "Sync to Firestore"

  Security rules in firestore.rules protect _schemas/ (admin-only writes, all-auth reads)
  and generate per-collection content rules.
`);
}

function getFlag(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

export async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    printHelp();
    return;
  }

  const cmd = args[0];

  switch (cmd) {
    case "dev": {
      const m = await import("./commands/dev.js");
      await m.dev({
        emulator: args.includes("--emulator"),
        host: getFlag(args, "--host"),
        port: getFlag(args, "--port") ? Number(getFlag(args, "--port")) : undefined,
        sync: args.includes("--sync"),
      });
      break;
    }
    case "build": {
      const m = await import("./commands/build.js");
      await m.build({});
      break;
    }
    case "generate": {
      const m = await import("./commands/generate.js");
      await m.generate({
        dir: getFlag(args, "--dir"),
        sync: args.includes("--sync"),
        type: args[1],
      });
      break;
    }
    case "deploy": {
      const m = await import("./commands/deploy.js");
      await m.deploy({ project: getFlag(args, "--project") });
      break;
    }
    case "scaffold": {
      const m = await import("./commands/scaffold.js");
      await m.scaffold({ type: args[1], name: getFlag(args, "--name") });
      break;
    }
    case "lint": {
      const m = await import("./commands/lint.js");
      await m.lint({ dir: getFlag(args, "--dir") });
      break;
    }
    case "doctor": {
      const m = await import("./commands/doctor.js");
      await m.doctor({ dir: getFlag(args, "--dir") });
      break;
    }
    default:
      console.error(`Unknown command: ${cmd}`);
      printHelp();
  }
}
