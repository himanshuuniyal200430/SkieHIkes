// Generates public/sitemap.xml before every build.
// Static routes are hardcoded below; dynamic /packages/:slug routes
// are pulled live from the backend API.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = "https://matrikatoursandtravels.com";
const API_URL =
  process.env.VITE_API_URL || "https://trekking-backend-3za9.onrender.com/api";

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/packages", changefreq: "weekly", priority: "0.9" },
  { path: "/gallery", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/termsandconditions", changefreq: "yearly", priority: "0.3" },
];

async function getPackageSlugs() {
  try {
    // The API paginates (default limit=12), so request a high limit to make
    // sure every active package is included, not just the first page.
    const res = await fetch(`${API_URL}/packages?limit=1000`);
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const json = await res.json();

    // Real response shape: { success: true, data: [...], pagination: {...} }
    const list = Array.isArray(json) ? json : json.data || [];

    if (json.pagination && json.pagination.total > list.length) {
      console.warn(
        `⚠️  API reports ${json.pagination.total} total packages but only ${list.length} were returned — increase the limit in generate-sitemap.js`
      );
    }

    return list.map((pkg) => pkg.slug).filter(Boolean);
  } catch (err) {
    console.warn(
      "⚠️  Could not fetch packages for sitemap, continuing with static routes only:",
      err.message
    );
    return [];
  }
}

function buildXml(urls) {
  const today = new Date().toISOString().split("T")[0];
  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

async function main() {
  const slugs = await getPackageSlugs();
  const packageRoutes = slugs.map((slug) => ({
    path: `/packages/${slug}`,
    changefreq: "monthly",
    priority: "0.8",
  }));

  const allRoutes = [...staticRoutes, ...packageRoutes];
  const xml = buildXml(allRoutes);

  const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");

  console.log(`✅ sitemap.xml written with ${allRoutes.length} URLs -> ${outPath}`);
}

main();
