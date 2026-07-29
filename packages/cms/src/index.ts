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
        type: args[1],
      });
      break;
    }
    case "deploy": {
      const m = await import("./commands/deploy.js");
      await m.deploy({});
      break;
    }
    case "scaffold": {
      const m = await import("./commands/scaffold.js");
      await m.scaffold({});
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
