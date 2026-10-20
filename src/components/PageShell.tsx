import PaperShell from "./paper/PaperShell";

/** Podstran z naslovom v slogu kataloga (tema Platno, vodni žig). */
export default function PageShell({
  title,
  active,
  children,
}: {
  title: string;
  active: string;
  children: React.ReactNode;
}) {
  return (
    <PaperShell active={active}>
      <main className="mx-auto w-full max-w-[1312px] animate-enter px-[clamp(16px,4.5vw,64px)] pb-[104px] pt-10">
        <h1 className="mb-[5vh] border-b border-char pb-6 font-display text-[clamp(56px,9vw,128px)] font-black leading-[0.82] tracking-[-0.03em]">
          {title}
        </h1>
        {children}
      </main>
    </PaperShell>
  );
}
