import Link from "next/link";

export const Lead = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`mb-[6vh] max-w-[62ch] font-light leading-[1.7] text-bone-muted ${className}`}>{children}</p>
);

export const Todo = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-dashed border-white/25 px-5 py-4 text-sm leading-relaxed text-bone-muted">{children}</div>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-[2vh] font-display text-[clamp(28px,4vw,44px)] uppercase">{children}</h2>
);

export const CardGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-7">{children}</div>
);

export function Card({ title, image, href }: { title: string; image: string; href?: string }) {
  const body = (
    <>
      <div className="overflow-hidden">
        <div
          className="aspect-[4/5] bg-cover bg-center brightness-85 grayscale-25 transition-[scale,filter] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-103 group-hover:brightness-100 group-hover:grayscale-0"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>
      <h2 className="mt-4 font-display text-[28px] uppercase">{title}</h2>
    </>
  );
  return href ? (
    <Link href={href} className="group block">
      {body}
    </Link>
  ) : (
    <div className="group">{body}</div>
  );
}
