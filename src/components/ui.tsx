import Link from "next/link";

export const Lead = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`mb-[6vh] max-w-[62ch] text-[17px] font-light leading-[1.75] text-char-soft ${className}`}>{children}</p>
);

export const Todo = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-dashed border-rule px-5 py-4 text-sm leading-relaxed text-char-soft">{children}</div>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-[2vh] font-display text-[clamp(28px,4vw,44px)] font-bold uppercase">{children}</h2>
);

export const CardGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-7">{children}</div>
);

export function Card({ title, image, href }: { title: string; image: string; href?: string }) {
  const body = (
    <>
      <div className="bg-paper-raised p-3 shadow-[0_24px_60px_rgba(40,30,20,0.18)]">
        <div className="overflow-hidden">
          <div
            className="aspect-[4/5] bg-cover bg-center transition-[scale] duration-700 ease-shatter group-hover:scale-103"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      </div>
      <h2 className="mt-4 font-display text-[26px] font-bold uppercase leading-none">{title}</h2>
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
