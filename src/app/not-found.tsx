import RenderPage from "@/components/RenderPage";
import { getBaseSite, getPage, makeContext } from "@/lib/content";
import { pageSchema } from "@/schema/page";
import fs from "node:fs";
import path from "node:path";

export default function NotFound() {
  const lang = getBaseSite().defaultLanguage;
  const page = getPage(lang, "404") ?? pageSchema.parse(JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/pages/404.json"), "utf8")));
  return <RenderPage page={page} ctx={makeContext(lang)} />;
}
