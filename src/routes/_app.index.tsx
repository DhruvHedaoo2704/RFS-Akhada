import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Droplet, Beef, Moon, Trophy, Zap, ArrowRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { weeklyVolume } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Dashboard — RFS Akhada" }] }),
  component: DashboardHome,
});

function Ring({ value, label, color = "var(--neon)" }: { value: number; label: string; color?: string }) {
  const r = 38, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-24">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth="8" fill="none" />
          <motion.circle cx="50" cy="50" r={r} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"
            strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-display font-bold">{value}%</div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs neon-text font-bold tracking-widest">WELCOME BACK</p>
          <h1 className="text-3xl font-display font-bold">Let's crush today.</h1>
        </div>
        <Link to="/dashboard/live" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon text-neon-foreground font-semibold text-sm neon-glow">
          <Zap className="size-4" /> Start Workout
        </Link>
      </div>

      {/* Daily rings */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">Today's Goals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Ring value={72} label="Calories" />
          <Ring value={58} label="Water" />
          <Ring value={84} label="Protein" />
          <Ring value={100} label="Workout" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { i: Flame, l: "Streak", v: "12 days", c: "text-orange-400" },
          { i: Trophy, l: "XP Points", v: "2,450", c: "text-neon" },
          { i: Moon, l: "Sleep", v: "7.5 hrs", c: "text-blue-400" },
          { i: Beef, l: "Protein", v: "168g", c: "text-rose-400" },
        ].map(k => (
          <div key={k.l} className="glass rounded-2xl p-5">
            <k.i className={`size-5 ${k.c}`} />
            <div className="mt-3 text-2xl font-display font-bold">{k.v}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{k.l}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold mb-4">Weekly Volume (kg)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="day" stroke="oklch(0.68 0.015 240)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.015 240)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.17 0.012 240)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
              <Bar dataKey="volume" fill="oklch(0.92 0.22 130)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold mb-4">Calorie Intake</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyVolume}>
              <defs>
                <linearGradient id="cal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.92 0.22 130)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.92 0.22 130)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="day" stroke="oklch(0.68 0.015 240)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.015 240)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.17 0.012 240)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="calories" stroke="oklch(0.92 0.22 130)" fill="url(#cal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { to: "/dashboard/workout-planner", l: "AI Planner", d: "Build a plan" },
          { to: "/dashboard/recovery", l: "Recovery", d: "Today's readiness" },
          { to: "/dashboard/strength", l: "Strength", d: "Track PRs" },
          { to: "/dashboard/coach", l: "AI Coach", d: "Ask anything" },
        ].map(a => (
          <Link key={a.to} to={a.to} className="glass rounded-2xl p-5 hover:border-neon/40 transition-all group">
            <div className="font-display font-bold">{a.l}</div>
            <div className="text-xs text-muted-foreground">{a.d}</div>
            <ArrowRight className="size-4 mt-3 text-neon group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
