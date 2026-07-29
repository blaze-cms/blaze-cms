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
  dev         Start dev server (Vite + Firebase Emulator)
  build       Build admin panel for production
  generate    Run code generation (types, SDK, schema registry, rules, indexes)
  deploy      Deploy admin panel to Firebase Hosting
  scaffold    Scaffold a new collection or global
  lint        Lint schema definitions
  doctor      Check project health

Options:
  --help      Show help
`);
}

function getFlag(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

export function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    printHelp();
    process.exit(0);
  }

  const cmd = args[0];

  switch (cmd) {
    case "dev": {
      void import("./commands/dev.js").then((m) =>
        m.dev({
          host: getFlag(args, "--host"),
          port: getFlag(args, "--port") ? Number(getFlag(args, "--port")) : undefined,
          emulator: args.includes("--emulator"),
        }),
      );
      break;
    }
    case "build": {
      void import("./commands/build.js").then((m) => m.build({}));
      break;
    }
    case "generate": {
      const type = args[1];
      void import("./commands/generate.js").then((m) =>
        m.generate({
          dir: getFlag(args, "--dir"),
          type,
        }),
      );
      break;
    }
    case "deploy": {
      void import("./commands/deploy.js").then((m) => m.deploy({}));
      break;
    }
    case "scaffold": {
      void import("./commands/scaffold.js").then((m) => m.scaffold({}));
      break;
    }
    case "lint": {
      void import("./commands/lint.js").then((m) => m.lint({ dir: getFlag(args, "--dir") }));
      break;
    }
    case "doctor": {
      void import("./commands/doctor.js").then((m) => m.doctor({ dir: getFlag(args, "--dir") }));
      break;
    }
    default:
      console.error(`Unknown command: ${cmd}`);
      printHelp();
      process.exit(1);
  }
}
