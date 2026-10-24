/**
 * Live site or test site (dev)? Same rule in the Next build and in scripts/postbuild.ts.
 * - SITE_ENV=dev (build variable of the Worker diarsanima-dev, CI on dev) → test site; any other SITE_ENV → live.
 * - Cloudflare Workers Builds: WORKERS_CI_BRANCH (main → live, otherwise test site).
 * - Old Cloudflare Pages builds: CF_PAGES_BRANCH (main → live).
 * - Locally: test site unless NEXT_PUBLIC_ENV=production.
 */
export function isLive(env: Record<string, string | undefined> = process.env): boolean {
  if (env.SITE_ENV) return env.SITE_ENV !== "dev";
  const branch = env.WORKERS_CI_BRANCH || env.CF_PAGES_BRANCH;
  if (branch) return branch === "main";
  return env.NEXT_PUBLIC_ENV === "production";
}
