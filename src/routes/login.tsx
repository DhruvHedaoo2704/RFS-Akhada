import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — RFS Akhada" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_50%_50%,oklch(0.92_0.22_130/0.2),transparent_60%)]" />
      <div className="w-full max-w-md glass-strong rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <span className="size-9 rounded-xl gradient-neon grid place-items-center text-neon-foreground"><Flame className="size-5" /></span>
          <span className="font-display font-bold">RFS <span className="neon-text">AKHADA</span></span>
        </Link>
        <h1 className="text-3xl font-display font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm mt-1">Sign in to continue your transformation.</p>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/dashboard"; }}>
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Email</label>
            <input type="email" required placeholder="rfs@gmail.com" className="w-full mt-1 px-4 py-2.5 rounded-lg bg-surface-elevated border border-border focus:border-neon/60 outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Password</label>
            <input type="password" required placeholder="Enter Password" className="w-full mt-1 px-4 py-2.5 rounded-lg bg-surface-elevated border border-border focus:border-neon/60 outline-none" />
          </div>
          <Button type="submit" className="w-full bg-neon text-neon-foreground hover:bg-neon/90">Sign In</Button>
        </form>
        <p className="mt-5 text-sm text-center text-muted-foreground">No account? <Link to="/signup" className="neon-text font-semibold">Create one</Link></p>
      </div>
    </div>
  );
}
