import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { trainers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const Route = createFileRoute("/public/trainers")({
  head: () => ({ meta: [{ title: "Trainers — RFS Akhada" }, { name: "description", content: "Meet our certified coaches." }] }),
  component: TrainersPage,
});

function TrainersPage() {
  return (
    <>
      <PageHeader eyebrow="TRAINERS" title="MEET OUR EXPERTS" subtitle="World-class coaches behind every plan we build." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainers.map(t => (
          <div key={t.id} className="glass rounded-2xl overflow-hidden group">
            <div className="aspect-[4/5] overflow-hidden"><img src={t.image} alt={t.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.spec} · {t.exp}</p>
                </div>
                <div className="flex items-center gap-1 text-neon"><Star className="size-4 fill-current" /><span className="text-sm font-bold">{t.rating}</span></div>
              </div>
              <Button className="w-full mt-4 bg-neon text-neon-foreground hover:bg-neon/90">Contact</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
