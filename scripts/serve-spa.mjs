import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const port = parseInt(process.argv[3] || "3500", 10);

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

createServer((req, res) => {
  let filePath = resolve(root, "." + req.url);
  if (!existsSync(filePath)) {
    filePath = resolve(root, "index.html");
  }
  const ext = extname(filePath);
  const mime = MIME[ext] || "application/octet-stream";
  const content = readFileSync(filePath);
  res.writeHead(200, { "Content-Type": mime });
  res.end(content);
}).listen(port, () => {
  console.log(`SPA server listening on http://localhost:${port}`);
});
