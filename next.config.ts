import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statični izvoz samo za build (brez API poti, strežniških funkcij in middleware).
  // V `yarn dev` ga ne vklopimo, ker Next sicer na poteh, ki niso strani
  // (npr. /.well-known/… iz Chroma, hot-update), javlja "missing param in generateStaticParams".
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
