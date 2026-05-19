import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { programs } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/public/programs")({
  head: () => ({ meta: [{ title: "Programs — RFS Akhada" }, { name: "description", content: "Pick from 6 premium training programs designed by coaches." }] }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <>
      <PageHeader eyebrow="PROGRAMS" title="TRAIN YOUR WAY" subtitle="Six progressive training tracks engineered for real results." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map(p => (
          <div key={p.id} className="glass rounded-2xl overflow-hidden group hover:border-neon/40 transition-all">
            <div className="aspect-video overflow-hidden">
              <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="flex gap-2 text-[10px] uppercase tracking-widest font-bold">
                <span className="px-2 py-0.5 rounded bg-neon/10 text-neon">{p.difficulty}</span>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-muted-foreground">{p.duration}</span>
              </div>
              <h3 className="font-display font-bold text-xl mt-3">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              <Button asChild className="w-full mt-4 bg-neon text-neon-foreground hover:bg-neon/90">
                <Link to="/signup">Start Program <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
