import { createFileRoute } from "@tanstack/react-router";
import { Camera, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard/transformation")({
  head: () => ({ meta: [{ title: "Transformation Timeline" }] }),
  component: Transformation,
});

const timeline = [
  { date: "Week 1", weight: "85.2 kg", note: "Starting point" },
  { date: "Week 4", weight: "82.8 kg", note: "Conditioning kicking in" },
  { date: "Week 8", weight: "80.1 kg", note: "Visible abs returning" },
  { date: "Week 12", weight: "78.4 kg", note: "Cut complete — clean physique" },
];

function Transformation() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">TRANSFORMATION</p>
        <h1 className="text-3xl font-display font-bold">Your Journey</h1>
      </div>
      <div className="glass rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
        <div className="aspect-square rounded-xl bg-surface-elevated grid place-items-center text-muted-foreground border border-dashed border-border">
          <div className="text-center"><Camera className="size-8 mx-auto mb-2" /><div className="text-sm">Before</div></div>
        </div>
        <div className="aspect-square rounded-xl bg-surface-elevated grid place-items-center text-muted-foreground border border-dashed border-border">
          <div className="text-center"><Camera className="size-8 mx-auto mb-2" /><div className="text-sm">After</div></div>
        </div>
        <button className="sm:col-span-2 px-4 py-3 rounded-xl bg-neon text-neon-foreground font-semibold flex items-center justify-center gap-2"><Plus className="size-4" /> Upload Progress Photo</button>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-bold mb-4">Timeline</h3>
        <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
          {timeline.map((t, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-5 top-1.5 size-3 rounded-full bg-neon neon-glow" />
              <div className="text-xs neon-text font-bold">{t.date}</div>
              <div className="text-lg font-semibold">{t.weight}</div>
              <div className="text-xs text-muted-foreground">{t.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
