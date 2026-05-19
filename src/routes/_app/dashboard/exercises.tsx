import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Play } from "lucide-react";
import { exercises } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard/exercises")({
  head: () => ({ meta: [{ title: "Exercise Library" }] }),
  component: ExerciseLib,
});

function ExerciseLib() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("All");
  const [eq, setEq] = useState("All");
  const list = exercises.filter(e =>
    e.name.toLowerCase().includes(q.toLowerCase()) &&
    (level === "All" || e.level === level) &&
    (eq === "All" || e.equipment === eq)
  );
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">EXERCISE LIBRARY</p>
        <h1 className="text-3xl font-display font-bold">Browse Exercises</h1>
      </div>
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-elevated border border-border" />
        </div>
        <select value={level} onChange={e=>setLevel(e.target.value)} className="px-3 py-2 rounded-lg bg-surface-elevated border border-border">
          {["All","Beginner","Intermediate","Advanced"].map(x=><option key={x}>{x}</option>)}
        </select>
        <select value={eq} onChange={e=>setEq(e.target.value)} className="px-3 py-2 rounded-lg bg-surface-elevated border border-border">
          {["All","Gym","Home"].map(x=><option key={x}>{x}</option>)}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(e => (
          <div key={e.name} className="glass rounded-2xl overflow-hidden">
            <div className="aspect-video bg-surface-elevated grid place-items-center"><Play className="size-10 text-neon" /></div>
            <div className="p-4">
              <h3 className="font-display font-bold">{e.name}</h3>
              <div className="flex gap-2 mt-2 text-[10px] uppercase tracking-widest">
                <span className="px-2 py-0.5 rounded bg-neon/10 text-neon">{e.muscle}</span>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-muted-foreground">{e.level}</span>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-muted-foreground">{e.equipment}</span>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12">No exercises found.</div>}
      </div>
    </div>
  );
}
