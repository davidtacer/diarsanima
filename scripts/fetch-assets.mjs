// Prenese slike z obstoječe WordPress strani v public/images.
// Zagon: npm run assets
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = "https://diarsanima.com/wp-content/uploads/";
const files = {
  "introBanner.png": "2025/10/introBanner.png",
  "full_logo_small.png": "2025/10/full_logo_small.png",
  "full_logo_big.png": "2025/10/full_logo_big.png",
  "tiger_full.png": "2025/10/tiger_full.png",
  "tigerMobile.png": "2026/05/tigerMobile.png",
  "artSidebar.png": "2025/10/artSidebar.png",
  "logoMouse.png": "2025/10/cropped-logoMouse-1-270x270.png",
  "paintings.png": "2025/10/paintings.png",
  "collages.png": "2022/10/collages.png",
  "murals.png": "2022/10/murals.png",
  "Babo.png": "2026/01/Babo.png",
  "zajec.png": "2026/01/zajec.png",
  "racmani.jpg": "2026/01/racmani.jpg",
  "dia-podpis.png": "2026/01/dia-podpis.png",
  "dia-portret-1.png": "2026/01/dia-portret-1.png",
  "homeBanner.png": "2025/10/homeBanner.png", // portret na /home
};

const out = path.join(process.cwd(), "public", "images");
await mkdir(out, { recursive: true });
for (const [name, rel] of Object.entries(files)) {
  try {
    const res = await fetch(base + rel);
    if (!res.ok) throw new Error(res.status);
    await writeFile(path.join(out, name), Buffer.from(await res.arrayBuffer()));
    console.log("✓", name);
  } catch (e) {
    console.warn("✗", name, e.message);
  }
}
