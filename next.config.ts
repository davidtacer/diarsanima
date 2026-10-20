import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statični izvoz: brez API poti, strežniških funkcij in middleware.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
