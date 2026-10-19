import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "DiArsanima – a showcase of mystical and human-inspired art.",
  description: "DiArsanima – a showcase of mystical and human-inspired art.",
  icons: { icon: "/images/logoMouse.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,700&family=Jost:wght@300;400;500&display=swap"
        />
      </head>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
