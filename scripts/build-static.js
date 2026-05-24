/**
 * Copies static site files into dist/ for Vercel deployment.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "dist");

const HTML_FILES = [
  "index.html",
  "dashboard.html",
  "system-analysis.html",
  "menu.html",
  "owner-information.html",
  "validation-summary.html",
];

const COPY_DIRS = ["css", "js", "pictures", "assets"];

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

rmrf(OUT);
fs.mkdirSync(OUT, { recursive: true });

let copied = 0;
for (const file of HTML_FILES) {
  const src = path.join(ROOT, file);
  if (!fs.existsSync(src)) {
    console.warn("WARN: missing", file);
    continue;
  }
  fs.copyFileSync(src, path.join(OUT, file));
  copied++;
}

for (const dir of COPY_DIRS) {
  const src = path.join(ROOT, dir);
  if (fs.existsSync(src)) {
    copyDir(src, path.join(OUT, dir));
    console.log("Copied dir:", dir);
  }
}

if (copied === 0) {
  console.error("ERROR: No HTML files copied. Check project root.");
  process.exit(1);
}

console.log("OK: Built", copied, "HTML pages into dist/");
