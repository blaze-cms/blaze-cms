import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";

const ROOT = join(process.argv[2] || ".");
const PORT = parseInt(process.argv[3] || "3500", 10);

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function serveFile(res, p) {
  res.writeHead(200, { "Content-Type": MIME[extname(p)] || "application/octet-stream" });
  res.end(readFileSync(p));
}

function findIndex(dir) {
  const p = join(ROOT, dir, "index.html");
  if (existsSync(p)) return p;
  if (dir === ".") return null;
  return findIndex(dirname(dir));
}

createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const fp = join(ROOT, pathname === "/" ? "index.html" : pathname);
  if (existsSync(fp) && statSync(fp).isFile()) {
    return serveFile(res, fp);
  }
  const index = findIndex("." + pathname);
  if (index) return serveFile(res, index);
  res.writeHead(404);
  res.end("Not found");
}).listen(PORT, () => {
  console.error(`SPA server ready on http://localhost:${PORT}`);
});
