import type { Metadata } from "next";
import ShatterHome from "@/components/ShatterHome";

export const metadata: Metadata = { title: "Home – DiArsanima" };

export default function HomePage() {
  return <ShatterHome />;
}
