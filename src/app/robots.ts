import type { MetadataRoute } from "next";
import { getBaseSite } from "@/lib/content";
import { isProduction } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction()) return { rules: { userAgent: "*", disallow: "/" } };
  const site = getBaseSite();
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", site.url).toString() };
}
