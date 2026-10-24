import { z } from "zod";

/** editor.config.json (repo root): how this site is connected to the Inženirji.si editor. Code, not content. */
export const editorConfigSchema = z
  .object({
    siteId: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    siteName: z.string().min(1),
    repo: z.string().regex(/^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/),
    branches: z.object({ dev: z.string().min(1), main: z.string().min(1) }).strict(),
    urls: z
      .object({
        live: z.string().regex(/^https:\/\/[a-z0-9.-]+$/, "https origin without a path or trailing slash"),
        dev: z.string().regex(/^https:\/\/dev\.[a-z0-9.-]+$/, "https://dev.<domain>"),
      })
      .strict(),
    editorUrl: z.string().regex(/^https:\/\/[a-z0-9.-]+$/),
    guideVersion: z.string().regex(/^\d+\.\d+$/),
    /** false → /uredi is a static "coming soon" page; true → /uredi embeds the editor. */
    enabled: z.boolean(),
  })
  .strict();

export type EditorConfig = z.infer<typeof editorConfigSchema>;
