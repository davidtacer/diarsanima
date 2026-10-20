import type { Work } from "@/blocks/Gallery/schema";
import type { WorkRef } from "@/schema/common";
import type { Site } from "@/schema/site";

export type BlockContext = {
  site: Site;
  lang: string;
  /** URL strani po slugu v trenutnem jeziku. */
  href: (page: string) => string;
  /** Delo iz galerije na drugi strani (sklic { page, work }). */
  work: (ref: WorkRef) => Work;
};

export type BlockProps<T> = { block: T; ctx: BlockContext };
