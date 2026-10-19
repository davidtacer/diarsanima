export const assets = {
  introBanner: "/images/introBanner.png",
  logoSmall: "/images/full_logo_small.png",
  logoBig: "/images/full_logo_big.png",
  tigerFull: "/images/tiger_full.png",
  tigerMobile: "/images/tigerMobile.png",
  artSidebar: "/images/artSidebar.png",
  // Portret na /home (WP: homeBanner.png, 1080×1559).
  // Ko ga shraniš v public/images/homeBanner.png, zamenjaj z "/images/homeBanner.png".
  homePortrait: "https://diarsanima.com/wp-content/uploads/2025/10/homeBanner.png",
  cursor: "/images/logoMouse.png",
  paintings: "/images/paintings.png",
  collages: "/images/collages.png",
  murals: "/images/murals.png",
};

export const nav = [
  { label: "Intro page", href: "/" },
  { label: "Artwork", href: "/artwork" },
  { label: "About Artist", href: "/about-artist" },
  { label: "Contact", href: "/contact" },
];

export const mainNav = [
  { label: "Home", href: "/home" },
  { label: "Artwork", href: "/artwork" },
  { label: "About Artist", href: "/about-artist" },
  { label: "Contact", href: "/contact" },
];

export const socials = {
  instagram: "https://www.instagram.com/diarsanima/",
  facebook: "https://www.facebook.com/DonnaDiArsanima",
};

// Na živi strani "EXPLORE?" na intro strani vodi na /artwork.
export const introExploreHref = "/home";

export const portfolio = [
  { slug: "paintings", title: "Paintings", image: assets.paintings },
  { slug: "digital-artwork", title: "Digital Artwork", image: assets.collages },
  { slug: "murals", title: "Murals", image: assets.murals },
];
