import PageShell from "@/components/PageShell";
import { Lead } from "@/components/ui";

export const metadata = { title: "Contact – DiArsanima" };

// TODO: vpiši pravi e-naslov (na WP je skrit s Cloudflare zaščito)
const EMAIL = "info@diarsanima.com";

export default function ContactPage() {
  return (
    <PageShell title="Contact" active="/contact">
      <p className="font-display text-[clamp(32px,5vw,60px)] italic">Got a project? Let&apos;s talk!</p>
      <Lead className="mt-[2vh]">Start a Conversation</Lead>
      <a href={`mailto:${EMAIL}`} className="inline-block border-b border-current pb-1 text-lg tracking-[0.08em] text-char">
        {EMAIL}
      </a>
    </PageShell>
  );
}
