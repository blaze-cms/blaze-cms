import { config } from "dotenv";
config();

export interface BlazeUserConfig {
  firebase: {
    projectId: string;
    clientEmail?: string;
    privateKey?: string;
    storageBucket?: string;
  };
  server?: {
    port?: number;
    host?: string;
  };
}

export function defineConfig(config: BlazeUserConfig): BlazeUserConfig {
  return config;
}

function printHelp(): void {
  console.warn(`
Usage: blaze <command> [options]

Commands:
  dev         Start dev server with file watching
  start       Start production server
  build       Build for production
  generate    Run code generation
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
        }),
      );
      break;
    }
    case "start": {
      void import("./commands/start.js").then((m) =>
        m.start({
          port: getFlag(args, "--port") ? Number(getFlag(args, "--port")) : undefined,
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
