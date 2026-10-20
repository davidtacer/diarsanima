import PageShell from "@/components/PageShell";
import { Card, CardGrid, Lead, SectionTitle, Todo } from "@/components/ui";

export const metadata = { title: "About Artist – DiArsanima" };

const services = [
  { title: "Commission Work", image: "/images/Babo.png" },
  { title: "Courses, Workshops, Mentorship", image: "/images/zajec.png" },
  { title: "Digital Art, Graphic Design, Illustration", image: "/images/racmani.jpg" },
];

export default function AboutPage() {
  return (
    <PageShell title="About Artist" active="/about-artist">
      <Lead>Welcome to the artistic landscape of DiArsanima!</Lead>
      <Todo>TODO: prenesi besedilo, podpis (dia-podpis.png) in portret (dia-portret-1.png) iz WP.</Todo>

      <section className="mt-[8vh]">
        <SectionTitle>Services I Craft for My Clients</SectionTitle>
        <Lead>Turning Imagination into Masterpieces</Lead>
        <CardGrid>
          {services.map((s) => (
            <Card key={s.title} {...s} />
          ))}
        </CardGrid>
      </section>

      <section className="mt-[8vh]">
        <SectionTitle>Education</SectionTitle>
        <Todo>TODO: seznam izobraževanja in logotipi ustanov iz WP.</Todo>
      </section>
    </PageShell>
  );
}
