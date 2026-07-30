import type { Plugin } from "vite";

const SCHEMA_ROOT = "cms";

const VALID_DIRS = ["collections", "globals", "components"];

interface SaveSchemaBody {
  filename: unknown;
  content: unknown;
}

function send(res: import("http").ServerResponse, status: number, data: Record<string, unknown>) {
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

async function writeSchema(body: string, res: import("http").ServerResponse) {
  let parsed: SaveSchemaBody;
  try {
    parsed = JSON.parse(body) as SaveSchemaBody;
  } catch {
    send(res, 400, { error: "Invalid JSON" });
    return;
  }

  const { content, filename } = parsed;

  if (typeof filename !== "string" || typeof content !== "string") {
    send(res, 400, { error: "filename and content are required" });
    return;
  }

  const parts = filename.split("/");
  const dir = parts[0];
  if (!dir || !VALID_DIRS.includes(dir)) {
    send(res, 400, { error: `Invalid directory: ${dir}` });
    return;
  }

  if (filename.includes("..")) {
    send(res, 400, { error: "Path traversal not allowed" });
    return;
  }

  const { existsSync, mkdirSync, writeFileSync } = await import("fs");
  const { resolve } = await import("path");

  const fullPath = resolve(process.cwd(), SCHEMA_ROOT, filename);
  const parentDir = resolve(fullPath, "..");

  if (!existsSync(parentDir)) {
    mkdirSync(parentDir, { recursive: true });
  }

  writeFileSync(fullPath, content, "utf-8");

  send(res, 200, { ok: true, path: `cms/${filename}` });
}

export function schemaWriterPlugin(): Plugin {
  return {
    configureServer(server) {
      server.middlewares.use("/__dev-api/save-schema", (req, res) => {
        if (req.method !== "POST") {
          send(res, 405, { error: "Method not allowed" });
          return;
        }

        let body = "";
        req.on("data", (chunk: string) => {
          body += chunk;
        });
        req.on("end", () => {
          void writeSchema(body, res);
        });
      });
    },
    name: "schema-writer",
  };
}
