#!/usr/bin/env node
/**
 * Notion → Web sync (POC)
 *
 * For each page in `scripts/pages.js`:
 *   1. Fetch the page's block tree from the Notion API.
 *   2. Download every image to `assets/notion/<slug>/` so the web
 *      copy keeps working after Notion's signed URLs expire.
 *   3. Convert the block tree to HTML using the brand-book's
 *      content components (.about-banner / .content-cols / etc.)
 *      and write the result to the mapped path.
 *
 * Usage:
 *   node scripts/notion-sync.js           # sync every page
 *   node scripts/notion-sync.js logo      # sync one page by slug
 *
 * Requires:
 *   - NOTION_TOKEN in the environment (or in `.env`)
 *   - The integration owning that token must be shared on the
 *     parent page so the API can read every mapped child.
 */
import { Client } from "@notionhq/client";
import { config as loadEnv } from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

import { PAGES } from "./pages.js";

loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const NOTION_TOKEN = process.env.NOTION_TOKEN;

if (!NOTION_TOKEN) {
  console.error(
    "✗ NOTION_TOKEN is not set.\n" +
    "  Create one at https://www.notion.so/my-integrations\n" +
    "  and put it in .env (see .env.example)."
  );
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// ── Block tree fetch ─────────────────────────────────────────
async function fetchBlocks(blockId) {
  const all = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const block of res.results) {
      if (block.has_children) {
        block.children = await fetchBlocks(block.id);
      }
      all.push(block);
    }
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return all;
}

// ── Image download ───────────────────────────────────────────
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.open(dest, "w").then((handle) => handle.createWriteStream());
    file.then((stream) => {
      https
        .get(url, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            stream.close();
            downloadFile(res.headers.location, dest).then(resolve, reject);
            return;
          }
          if (res.statusCode !== 200) {
            stream.close();
            reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            return;
          }
          res.pipe(stream);
          stream.on("finish", () => stream.close(resolve));
        })
        .on("error", reject);
    });
  });
}

let imageCounter = 0;
async function persistImage(block, slug) {
  const file = block.image;
  if (!file) return null;
  const url = file.type === "external" ? file.external.url : file.file.url;
  // Pick an extension from the URL path, default to .png.
  const ext = (url.split("?")[0].match(/\.([a-z0-9]{2,5})$/i)?.[1] || "png").toLowerCase();
  const filename = `nb-${++imageCounter}.${ext}`;
  const destDir = path.join(ROOT, "assets", "notion", slug);
  await fs.mkdir(destDir, { recursive: true });
  const destPath = path.join(destDir, filename);
  try {
    await downloadFile(url, destPath);
  } catch (err) {
    console.warn(`  ! image download failed: ${err.message}`);
    return null;
  }
  // Web-relative path from the HTML file (HTML lives at <depth> levels deep).
  return { localFile: filename, slug };
}

// ── Rich text → inline HTML ──────────────────────────────────
function htmlEscape(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function richTextToHtml(richText = []) {
  return richText
    .map((rt) => {
      let html = htmlEscape(rt.plain_text);
      const a = rt.annotations || {};
      if (a.code) html = `<code>${html}</code>`;
      if (a.bold) html = `<strong>${html}</strong>`;
      if (a.italic) html = `<em>${html}</em>`;
      if (rt.href) html = `<a href="${htmlEscape(rt.href)}">${html}</a>`;
      return html;
    })
    .join("");
}

function richTextPlain(richText = []) {
  return richText.map((rt) => rt.plain_text).join("");
}

// ── Block → HTML ─────────────────────────────────────────────
// Some blocks need depth-aware paths to the persisted images.
// `relAsset(slug, file, depth)` returns an HTML-friendly relative
// URL from a page at `depth` levels deep.
function relAsset(slug, file, depth) {
  const prefix = "../".repeat(depth);
  return `${prefix}assets/notion/${slug}/${file}`;
}

// A paragraph whose ONLY content is a single link is rendered as
// a download button. Inline links inside body text keep <a>.
function paragraphIsStandaloneLink(rt) {
  if (!rt || rt.length === 0) return false;
  const linkParts = rt.filter((r) => r.href);
  const text = richTextPlain(rt).trim();
  return linkParts.length === 1 && richTextPlain(linkParts).trim() === text;
}

function blockToHtml(block, ctx) {
  switch (block.type) {
    case "heading_1":
      return `<h1>${richTextToHtml(block.heading_1.rich_text)}</h1>`;
    case "heading_2":
      return `<h2>${richTextToHtml(block.heading_2.rich_text)}</h2>`;
    case "heading_3":
      return `<h3>${richTextToHtml(block.heading_3.rich_text)}</h3>`;
    case "paragraph": {
      const rt = block.paragraph.rich_text;
      if (paragraphIsStandaloneLink(rt)) {
        const link = rt.find((r) => r.href);
        const href = htmlEscape(link.href);
        const label = richTextToHtml([{ ...link, href: null, annotations: link.annotations || {} }]);
        return `<a class="content-download" href="${href}">${label}</a>`;
      }
      const txt = richTextToHtml(rt);
      if (!txt.trim()) return ""; // empty paragraph: drop (Notion sprinkles them)
      return `<p>${txt}</p>`;
    }
    case "quote":
      // Quotes are used as editor notes ("매핑: …"); not part of the
      // published content.
      return "";
    case "callout":
      return "";
    case "divider":
      return `<hr class="content-divider">`;
    case "image": {
      const stored = ctx.imageMap.get(block.id);
      if (!stored) return `<figure class="about-banner"></figure>`;
      const src = relAsset(stored.slug, stored.localFile, ctx.depth);
      return `<figure class="about-banner"><img src="${src}" alt=""></figure>`;
    }
    case "column_list": {
      const cols = (block.children || [])
        .map((col) => {
          const inner = (col.children || [])
            .map((b) => blockToHtml(b, ctx))
            .filter(Boolean)
            .join("\n      ");
          // If a column contains image + button repeats it becomes
          // a `.content-card`; otherwise a bare wrapper div is fine.
          const isCard = (col.children || []).some(
            (b) =>
              b.type === "image" ||
              (b.type === "paragraph" && paragraphIsStandaloneLink(b.paragraph.rich_text))
          );
          const wrapper = isCard ? `<div class="content-card">` : `<div>`;
          return `    ${wrapper}\n      ${inner}\n    </div>`;
        })
        .join("\n");
      return `<div class="content-cols">\n${cols}\n  </div>`;
    }
    case "bulleted_list_item":
    case "numbered_list_item": {
      const tag = block.type === "bulleted_list_item" ? "ul" : "ol";
      const items = (block.children || []).map((b) => blockToHtml(b, ctx)).join("");
      return `<${tag}><li>${richTextToHtml(block[block.type].rich_text)}${items}</li></${tag}>`;
    }
    default:
      // Silently skip unsupported block types (toggle, code, etc.).
      return "";
  }
}

// ── Page shell ───────────────────────────────────────────────
function pageShell(page, body) {
  const cssHref = "../".repeat(page.depth) + "shared/shell.css";
  const jsHref = "../".repeat(page.depth) + "shared/shell.js";
  const faviconHref = "../".repeat(page.depth) + "favicon.svg";
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${htmlEscape(page.title)} · Ohouse Brand Book</title>
  <link rel="icon" type="image/svg+xml" href="${faviconHref}">
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
  <link rel="stylesheet" href="${cssHref}">
</head>
<body>
  <main data-page="${page.page}" data-depth="${page.depth}">
    <div class="shell-content">
${indent(body, 6)}
    </div>
  </main>
  <script type="module" src="${jsHref}"></script>
</body>
</html>
`;
}

function indent(text, n) {
  const pad = " ".repeat(n);
  return text
    .split("\n")
    .map((line) => (line.length ? pad + line : line))
    .join("\n");
}

// ── Per-page sync ────────────────────────────────────────────
async function syncPage(page) {
  console.log(`→ ${page.title}  (${page.path})`);

  imageCounter = 0; // reset per page so filenames are stable

  const blocks = await fetchBlocks(page.id);

  // Download every image block first; remember the result by block id.
  const imageMap = new Map();
  const walkImages = async (list) => {
    for (const b of list) {
      if (b.type === "image") {
        const stored = await persistImage(b, page.slug);
        if (stored) imageMap.set(b.id, stored);
      }
      if (b.children) await walkImages(b.children);
    }
  };
  await walkImages(blocks);

  // Render
  const ctx = { depth: page.depth, imageMap };
  const fragments = blocks.map((b) => blockToHtml(b, ctx)).filter(Boolean);
  const body = fragments.join("\n\n");
  const html = pageShell(page, body);

  const dest = path.join(ROOT, page.path);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, html, "utf-8");
  console.log(`  ✓ wrote ${page.path}`);
}

// ── Main ─────────────────────────────────────────────────────
const targetSlug = process.argv[2]; // optional filter
const targets = targetSlug
  ? PAGES.filter((p) => p.slug === targetSlug)
  : PAGES;

if (targets.length === 0) {
  console.error(`✗ No page matches slug "${targetSlug}".`);
  console.error("Known slugs:", PAGES.map((p) => p.slug).join(", "));
  process.exit(1);
}

let failed = 0;
for (const page of targets) {
  try {
    await syncPage(page);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${page.title}: ${err.message}`);
  }
}

console.log("");
console.log(failed === 0
  ? `Done. ${targets.length} page(s) synced.`
  : `Done with ${failed} failure(s).`);
process.exit(failed === 0 ? 0 : 1);
