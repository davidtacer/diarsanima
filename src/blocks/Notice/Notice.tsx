import { isActiveNow } from "@/lib/validity";
import type { BlockProps } from "@/lib/types";
import type { NoticeBlock } from "./schema";
import SmartLink from "@/components/SmartLink";

const variants = {
  quiet: "border-rule text-char-soft",
  accent: "border-rose text-rose",
} as const;

export default function Notice({ block, ctx }: BlockProps<NoticeBlock>) {
  if (!isActiveNow(block.validFrom, block.validUntil)) return null;
  return (
    <aside
      data-valid-from={block.validFrom}
      data-valid-until={block.validUntil}
      className={`mb-[4vh] flex flex-wrap items-center gap-x-4 gap-y-1 border-y py-3 text-xs uppercase tracking-[0.2em] ${variants[block.variant]}`}
    >
      <span className="text-ochre" aria-hidden>
        ✦
      </span>
      <span className="min-w-0 flex-1 normal-case tracking-normal break-words font-display text-base italic">
        {block.text}
      </span>
      {block.link && (
        <SmartLink
          href={ctx.href(block.link.page)}
          className="border-b border-current"
        >
          {block.link.label}
        </SmartLink>
      )}
    </aside>
  );
}
