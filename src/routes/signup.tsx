import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Join — RFS Akhada" }] }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_50%_50%,oklch(0.92_0.22_130/0.2),transparent_60%)]" />
      <div className="w-full max-w-md glass-strong rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <span className="size-9 rounded-xl gradient-neon grid place-items-center text-neon-foreground"><Flame className="size-5" /></span>
          <span className="font-display font-bold">RFS <span className="neon-text">AKHADA</span></span>
        </Link>
        <h1 className="text-3xl font-display font-bold">Create account</h1>
        <p className="text-muted-foreground text-sm mt-1">Start your transformation in 30 seconds.</p>
        <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); window.location.href = "/dashboard"; }}>
          {[
            { l: "Name", t: "text",placeholder:"Enter name"},
            { l: "Email", t: "email",placeholder:"Enter Email" },
            { l: "Password", t: "password",placeholder:"Enter Password" },
          ].map(f => (
            <div key={f.l}>
              <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">{f.l}</label>
              <input type={f.t} required placeholder={f.placeholder} className="w-full mt-1 px-4 py-2.5 rounded-lg bg-surface-elevated border border-border focus:border-neon/60 outline-none" />
            </div>
          ))}
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Fitness Goal</label>
            <select className="w-full mt-1 px-4 py-2.5 rounded-lg bg-surface-elevated border border-border focus:border-neon/60 outline-none">
              <option>Fat Loss</option><option>Muscle Gain</option><option>Strength</option><option>Endurance</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Experience</label>
            <select className="w-full mt-1 px-4 py-2.5 rounded-lg bg-surface-elevated border border-border focus:border-neon/60 outline-none">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <Button type="submit" className="w-full bg-neon text-neon-foreground hover:bg-neon/90 mt-2">Create Account</Button>
        </form>
        <p className="mt-5 text-sm text-center text-muted-foreground">Have an account? <Link to="/login" className="neon-text font-semibold">Sign in</Link></p>
      </div>
    </div>
  );
}
