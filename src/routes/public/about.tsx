import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { trainers } from "@/lib/mock-data";

export const Route = createFileRoute("/public/about")({
  head: () => ({ meta: [{ title: "About — RFS Akhada" }, { name: "description", content: "Our mission, philosophy and team behind RFS Akhada." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="ABOUT US" title="FORGED BY ATHLETES" subtitle="We build training tools we wished existed when we started lifting." />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6 pb-20">
        {[
          { t: "Our Story", d: "RFS Akhada started in a garage gym with chalk-dusted notebooks. We wanted real progressive overload and recovery science accessible to everyone." },
          { t: "Mission", d: "To put a world-class strength coach in every athlete's pocket — adaptive, intelligent, and relentlessly results-driven." },
          { t: "Why Choose Us", d: "Built by lifters, for lifters. Our AI is trained on decades of evidence-based programming, not generic templates." },
          { t: "Philosophy", d: "Train hard. Recover smart. Track everything. Show up tomorrow." },
        ].map(s => (
          <div key={s.t} className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-xl">{s.t}</h3>
            <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-display font-bold mb-6">Meet the Team</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {trainers.map(t => (
            <div key={t.id} className="glass rounded-2xl overflow-hidden">
              <img src={t.image} alt={t.name} loading="lazy" className="w-full aspect-[4/5] object-cover" />
              <div className="p-4">
                <div className="font-display font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.spec}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
