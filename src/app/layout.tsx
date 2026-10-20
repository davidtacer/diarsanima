import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import { getBaseSite } from "@/lib/content";
import { srcOf } from "@/lib/images";
import { bodoni, jost } from "@/themes/fonts";

export function generateMetadata(): Metadata {
  const site = getBaseSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: site.seo.titleTemplate },
    description: site.seo.defaultDescription,
    icons: { icon: srcOf(site.brand.seal, 320) },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getBaseSite();
  return (
    <html lang={site.defaultLanguage} className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <CustomCursor image={srcOf(site.brand.seal, 2400)} />
        {children}
      </body>
    </html>
  );
}
