import SmartLink from "@/components/SmartLink";

/** Pečat (logoMouse) z vrtečim se napisom. */
export default function Seal({
  text,
  label,
  href,
  image,
}: {
  text: string;
  label: string;
  href: string;
  image: string;
}) {
  return (
    <SmartLink
      href={href}
      className="group relative grid size-[170px] shrink-0 place-items-center"
      aria-label={label}
    >
      <svg
        viewBox="0 0 170 170"
        className="absolute inset-0 animate-seal"
        aria-hidden
      >
        <circle cx="85" cy="85" r="82" className="fill-none stroke-rule" />
        <defs>
          <path
            id="seal-path"
            d="M85,85 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0"
          />
        </defs>
        <text className="fill-gold font-sans text-[10px] tracking-[2px]">
          {/* textLength = obseg kroga (2π·70), da se napis natančno sklene */}
          <textPath href="#seal-path" textLength={438} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        width={84}
        height={84}
        className="w-[84px] opacity-80 invert transition-transform duration-700 ease-shatter group-hover:-rotate-12 group-hover:scale-105"
      />
    </SmartLink>
  );
}
