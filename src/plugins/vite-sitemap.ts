import { Plugin } from "vite";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://mervel-perfume.vercel.app";

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/categories", changefreq: "weekly", priority: "0.8" },
  { path: "/track-order", changefreq: "monthly", priority: "0.4" },
  { path: "/auth", changefreq: "monthly", priority: "0.3" },
];

const COLLECTIONS = ["dark-elegance", "golden-opulence"];

function buildSitemapXml(productIds: string[], blogSlugs: string[]): string {
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    ...STATIC_PAGES.map(
      (p) => `  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...COLLECTIONS.map(
      (id) => `  <url>
    <loc>${BASE_URL}/collection/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
    ...productIds.map(
      (id) => `  <url>
    <loc>${BASE_URL}/product/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
    // Blog list page
    `  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
    ...blogSlugs.map(
      (slug) => `  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export function sitemapPlugin(): Plugin {
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async generateBundle() {
      let productIds: string[] = [];

      try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data } = await supabase
            .from("products")
            .select("id")
            .eq("is_active", true);
          if (data) {
            productIds = data.map((p: { id: string }) => p.id);
          }
        }
      } catch (e) {
        console.warn("[sitemap] Could not fetch products, using static pages only:", e);
      }

      const xml = buildSitemapXml(productIds);

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: xml,
      });

      console.log(`[sitemap] Generated sitemap.xml with ${STATIC_PAGES.length + COLLECTIONS.length + productIds.length} URLs`);
    },
  };
}
