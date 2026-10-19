import { socials } from "@/lib/site";

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-1.56 19.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57V12h2.78l-.44 2.89h-2.34v7A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export default function SiteFooter({ overlay = false }: { overlay?: boolean }) {
  return (
    <footer
      className={`flex items-center justify-between px-[clamp(16px,5vw,48px)] py-[18px] text-[11px] tracking-[0.06em] text-bone-muted ${
        overlay ? "fixed inset-x-0 bottom-0 z-20" : ""
      }`}
    >
      <div className="flex gap-[18px]">
        {[
          [socials.instagram, "Instagram", <InstagramIcon key="i" />],
          [socials.facebook, "Facebook", <FacebookIcon key="f" />],
        ].map(([href, label, icon]) => (
          <a
            key={label as string}
            href={href as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label as string}
            className="text-bone opacity-85 transition-opacity hover:opacity-100"
          >
            {icon}
          </a>
        ))}
      </div>
      <p>© {new Date().getFullYear()} DiArsanima</p>
    </footer>
  );
}
