import { createFileRoute } from "@tanstack/react-router";
import { Users, Trophy } from "lucide-react";
import { challenges } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard/challenges")({
  head: () => ({ meta: [{ title: "Fitness Challenges" }] }),
  component: Challenges,
});

const leaderboard = [
  { rank: 1, name: "Alex P.", xp: 8420 },
  { rank: 2, name: "Maya R.", xp: 7980 },
  { rank: 3, name: "You", xp: 6450 },
  { rank: 4, name: "Jordan K.", xp: 5820 },
  { rank: 5, name: "Sam T.", xp: 5210 },
];

function Challenges() {
  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">CHALLENGES</p>
        <h1 className="text-3xl font-display font-bold">Compete & Win</h1>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {challenges.map(c => (
          <div key={c.id} className="glass rounded-2xl p-5">
            <Trophy className="size-5 text-neon" />
            <h3 className="font-display font-bold mt-3">{c.name}</h3>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Users className="size-3" /> {c.participants.toLocaleString()} joined</div>
            <div className="mt-3 h-1.5 rounded-full bg-surface-elevated"><div className="h-full bg-neon rounded-full" style={{width:`${c.progress}%`}}/></div>
            <div className="text-xs mt-2 flex justify-between"><span>{c.progress}%</span><span className="text-muted-foreground">{c.days}d total</span></div>
            <button className="w-full mt-4 py-2 rounded-lg bg-neon text-neon-foreground font-semibold text-sm">Join</button>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-bold mb-4">Leaderboard</h2>
        <div className="space-y-2">
          {leaderboard.map(l => (
            <div key={l.rank} className={`flex items-center justify-between p-3 rounded-lg ${l.name==="You" ? "bg-neon/10 border border-neon/30" : "bg-surface-elevated"}`}>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-surface grid place-items-center font-bold text-sm">{l.rank}</div>
                <span className="font-semibold">{l.name}</span>
              </div>
              <span className="neon-text font-bold">{l.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
