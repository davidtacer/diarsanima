import type { MetadataRoute } from "next";
import { isProduction, sitemapEntries } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Testna stran (dev) nima sitemapa.
  return isProduction() ? sitemapEntries() : [];
}
