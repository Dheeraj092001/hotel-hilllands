/**
 * Sitemap generator — run with: pnpm --filter @hotel/web-tour run sitemap
 * Fetches published tours and destinations from the API and outputs sitemap.xml
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.VITE_SITE_URL ?? "https://fayulretreat.com";
const API = process.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

const STATIC_ROUTES = [
  { path: "/",               priority: "1.0", changefreq: "weekly" },
  { path: "/tours",          priority: "0.9", changefreq: "daily" },
  { path: "/destinations",   priority: "0.9", changefreq: "weekly" },
  { path: "/enquire",        priority: "0.7", changefreq: "monthly" },
  { path: "/journal",        priority: "0.6", changefreq: "weekly" },
];

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<Record<string, unknown>>;
}

async function generate() {
  console.log("🗺️  Generating sitemap...");

  let tourSlugs: string[] = [];
  let destSlugs: string[] = [];

  try {
    const [toursRes, destsRes] = await Promise.all([
      fetchJSON(`${API}/tours?limit=200`),
      fetchJSON(`${API}/destinations`),
    ]);
    tourSlugs = ((toursRes.data as { slug: string }[]) ?? []).map((t) => t.slug);
    destSlugs = ((destsRes.data as { slug: string }[]) ?? []).map((d) => d.slug);
  } catch (err) {
    console.warn("  ⚠️  Could not fetch API routes — using static routes only:", err);
  }

  const today = new Date().toISOString().split("T")[0];

  const urls: string[] = [
    ...STATIC_ROUTES.map(
      (r) => `  <url><loc>${BASE_URL}${r.path}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority><lastmod>${today}</lastmod></url>`
    ),
    ...tourSlugs.map(
      (s) => `  <url><loc>${BASE_URL}/tours/${s}</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>`
    ),
    ...destSlugs.map(
      (s) => `  <url><loc>${BASE_URL}/destinations/${s}</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  const outPath = path.join(__dirname, "../public/sitemap.xml");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, "utf-8");
  console.log(`✅ Sitemap written — ${urls.length} URLs → public/sitemap.xml`);
}

generate().catch((e) => { console.error(e); process.exit(1); });