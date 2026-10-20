import UploadImage from "@/components/UploadImage";
import { srcOf } from "@/lib/images";
import type { BlockProps } from "@/lib/types";
import type { ContactBlock } from "./schema";

export default function Contact({ block, ctx }: BlockProps<ContactBlock>) {
  const c = ctx.site.contact;
  return (
    <section className="relative mb-[8vh] grid items-center gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="relative z-10 min-w-0">
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
      </div>
      {block.illustration && (
        <figure aria-hidden className="pointer-events-none min-w-0 max-lg:-mx-4">
          <div
            className={`animate-float ${
              block.illustrationMobile
                ? "max-md:mx-auto max-md:aspect-[1080/860] max-md:max-w-[420px] max-md:overflow-hidden max-md:[mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
                : ""
            }`}
          >
            <picture>
              {block.illustrationMobile && (
                <source media="(max-width: 767px)" srcSet={srcOf(block.illustrationMobile, 1280)} />
              )}
              <UploadImage
                image={block.illustration}
                decorative
                sizes="(max-width: 1023px) 100vw, 700px"
                className={`h-auto w-full opacity-80 invert ${block.illustrationMobile ? "max-md:h-full max-md:object-cover max-md:object-[50%_35%]" : ""}`}
              />
            </picture>
          </div>
        </figure>
      )}
    </section>
  );
}
