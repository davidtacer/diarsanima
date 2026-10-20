import type { BlockProps } from "@/lib/types";
import type { ContactBlock } from "./schema";

export default function Contact({ block, ctx }: BlockProps<ContactBlock>) {
  const c = ctx.site.contact;
  return (
    <section className="mb-[8vh]">
      <p className="font-display text-[clamp(32px,5vw,60px)] italic leading-tight break-words">{block.heading}</p>
      {block.sub && <p className="mb-[4vh] mt-[2vh] max-w-[62ch] text-[17px] font-light text-char-soft">{block.sub}</p>}
      <div className="flex flex-col items-start gap-3">
        <a href={`mailto:${c.email}`} className="inline-block break-all border-b border-current pb-1 text-lg tracking-[0.08em] text-char">
          {c.email}
        </a>
        {c.phone && (
          <a href={`tel:${c.phone.replace(/\s+/g, "")}`} className="text-lg tracking-[0.08em] text-char">
            {c.phone}
          </a>
        )}
        <p className="text-xs uppercase tracking-[0.24em] text-char-soft">
          {[c.address.street, [c.address.postalCode, c.address.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")}
        </p>
      </div>
    </section>
  );
}
