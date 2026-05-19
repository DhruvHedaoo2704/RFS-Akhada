import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartPulse } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard/recovery")({
  head: () => ({ meta: [{ title: "Smart Recovery" }] }),
  component: Recovery,
});

const inputs = ["Soreness", "Fatigue", "Sleep quality", "Energy level", "Stress level"];

function Recovery() {
  const [vals, setVals] = useState<Record<string, number>>(Object.fromEntries(inputs.map(i => [i, 5])));
  const score = Math.round((vals["Sleep quality"] + vals["Energy level"] - vals["Soreness"] - vals["Fatigue"] - vals["Stress level"] + 30) / 5 * 10);
  const rec = score > 75 ? "Heavy day" : score > 55 ? "Moderate day" : score > 35 ? "Light day" : score > 20 ? "Active rest" : "Full deload";

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">SMART RECOVERY</p>
        <h1 className="text-3xl font-display font-bold">How are you feeling?</h1>
      </div>
      <div className="glass rounded-2xl p-6 space-y-5">
        {inputs.map(i => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2"><span>{i}</span><span className="neon-text font-bold">{vals[i]}/10</span></div>
            <input type="range" min="0" max="10" value={vals[i]} onChange={e => setVals({...vals, [i]: +e.target.value})}
              className="w-full accent-[oklch(0.92_0.22_130)]" />
          </div>
        ))}
      </div>
      <div className="glass-strong rounded-2xl p-8 text-center neon-glow">
        <HeartPulse className="size-10 text-neon mx-auto mb-3" />
        <div className="text-6xl font-display font-bold neon-text">{score}</div>
        <div className="text-sm uppercase tracking-widest text-muted-foreground mt-1">Recovery Score</div>
        <div className="mt-5 inline-block px-5 py-2 rounded-full bg-neon text-neon-foreground font-semibold">Today: {rec}</div>
      </div>
    </div>
  );
}
