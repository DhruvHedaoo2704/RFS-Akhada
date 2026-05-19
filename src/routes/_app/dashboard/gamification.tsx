import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { achievements } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard/gamification")({
  head: () => ({ meta: [{ title: "XP & Levels" }] }),
  component: Gamification,
});

function Gamification() {
  const xp = 2450, next = 3000;
  const pct = (xp / next) * 100;
  const levels = [
    { l: "Beginner", at: 0 }, { l: "Warrior", at: 1500 }, { l: "Beast", at: 3000 }, { l: "Elite", at: 6000 },
  ];
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">GAMIFICATION</p>
        <h1 className="text-3xl font-display font-bold">Level Up</h1>
      </div>
      <div className="glass-strong rounded-2xl p-6 neon-glow">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Current Level</div>
            <div className="text-4xl font-display font-bold neon-text">WARRIOR</div>
          </div>
          <div className="text-right text-sm">{xp} / {next} XP</div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-surface-elevated overflow-hidden">
          <div className="h-full gradient-neon" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="grid sm:grid-cols-4 gap-3">
        {levels.map(l => (
          <div key={l.l} className={`glass rounded-2xl p-4 text-center ${xp >= l.at ? "border-neon/60" : "opacity-60"}`}>
            <div className="text-2xl">🏆</div>
            <div className="font-display font-bold mt-1">{l.l}</div>
            <div className="text-xs text-muted-foreground">{l.at} XP</div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="font-display font-bold mb-3">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map(a => (
            <div key={a.name} className={`glass rounded-2xl p-4 ${a.unlocked ? "" : "opacity-40 grayscale"}`}>
              <div className="text-3xl">{a.icon}</div>
              <div className="font-semibold mt-2">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.unlocked ? "Unlocked" : "Locked"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
