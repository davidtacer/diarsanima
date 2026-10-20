import UploadImage from "@/components/UploadImage";
import type { BlockProps } from "@/lib/types";
import type { LogosBlock } from "./schema";
import SmartLink from "@/components/SmartLink";

export default function Logos({ block }: BlockProps<LogosBlock>) {
  const hid = `${block.id}-heading`;
  return (
    <section
      aria-labelledby={block.heading ? hid : undefined}
      className="mb-[10vh] border-t border-rule pt-10"
    >
      {block.heading && (
        <h2
          id={hid}
          className="mb-8 text-xs uppercase tracking-[0.28em] text-gold"
        >
          {block.heading}
        </h2>
      )}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-center gap-x-10 gap-y-10">
        {block.items.map((item) => {
          const logo = (
            <UploadImage
              image={item.image}
              sizes="200px"
              className="mx-auto h-auto max-h-20 w-auto max-w-full opacity-70 mix-blend-multiply grayscale transition-[filter,opacity] duration-500 hover:opacity-100 hover:grayscale-0"
            />
          );
          return (
            <li
              key={item.id}
              className="flex min-w-0 items-center justify-center"
            >
              {item.url ? <SmartLink href={item.url}>{logo}</SmartLink> : logo}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
