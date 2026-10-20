import type { ReactNode } from "react";
import type { BlockContext } from "@/lib/types";
import SmartLink from "@/components/SmartLink";

/**
 * Izris omejenega Markdowna (odstavki, **krepko**, *ležeče*, povezave, alineje, oštevilčeni seznami).
 * Surovega HTML-ja ne izriše nikoli: vse je besedilo ali dovoljen element.
 */
function inline(text: string, ctx: BlockContext, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1] !== undefined)
      out.push(<strong key={k}>{inline(m[1], ctx, k)}</strong>);
    else if (m[2] !== undefined)
      out.push(<em key={k}>{inline(m[2], ctx, k)}</em>);
    else {
      const href = m[4];
      const label = inline(m[3], ctx, k);
      if (href.startsWith("page:"))
        out.push(
          <SmartLink
            key={k}
            href={ctx.href(href.slice(5))}
            className="underline underline-offset-4"
          >
            {label}
          </SmartLink>,
        );
      else
        out.push(
          <SmartLink
            key={k}
            href={href}
            className="underline underline-offset-4"
          >
            {label}
          </SmartLink>,
        );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function RichText({
  text,
  ctx,
  className = "",
}: {
  text: string;
  ctx: BlockContext;
  className?: string;
}) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((b, bi) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*-\s+/.test(l)))
          return (
            <ul key={bi} className="list-disc space-y-1 pl-5">
              {lines.map((l, li) => (
                <li key={li}>
                  {inline(l.replace(/^\s*-\s+/, ""), ctx, `${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\s*\d+\.\s+/.test(l)))
          return (
            <ol key={bi} className="list-decimal space-y-1 pl-5">
              {lines.map((l, li) => (
                <li key={li}>
                  {inline(l.replace(/^\s*\d+\.\s+/, ""), ctx, `${bi}-${li}`)}
                </li>
              ))}
            </ol>
          );
        return (
          <p key={bi}>
            {lines.flatMap((l, li) =>
              li
                ? [<br key={`br${li}`} />, ...inline(l, ctx, `${bi}-${li}`)]
                : inline(l, ctx, `${bi}-${li}`),
            )}
          </p>
        );
      })}
    </div>
  );
}
