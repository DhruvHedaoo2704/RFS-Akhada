import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/public", label: "Home" },
  { to: "/public/about", label: "About" },
  { to: "/public/programs", label: "Programs" },
  { to: "/public/trainers", label: "Trainers" },
] as const;

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="size-9 rounded-xl gradient-neon grid place-items-center text-neon-foreground">
              <Flame className="size-5" />
            </span>
            <span className="font-display font-bold text-lg tracking-tight">RFS<span className="neon-text"> AKHADA</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`px-3 py-2 text-sm rounded-md transition-colors hover:text-neon ${loc.pathname === l.to ? "text-neon" : "text-muted-foreground"}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign In</Link></Button>
            <Button asChild size="sm" className="bg-neon text-neon-foreground hover:bg-neon/90"><Link to="/signup">Enter Akhada</Link></Button>
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-border px-4 py-4 space-y-1 bg-surface">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-surface-elevated">{l.label}</Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1"><Link to="/login">Sign In</Link></Button>
              <Button asChild className="flex-1 bg-neon text-neon-foreground"><Link to="/signup">Join</Link></Button>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="size-8 rounded-lg gradient-neon grid place-items-center text-neon-foreground"><Flame className="size-4" /></span>
              <span className="font-display font-bold">RFS <span className="neon-text">AKHADA</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">Real Fitness System — India's AI-powered Akhada. Train smarter, recover faster, become a warrior.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/public/programs" className="hover:text-neon">Programs</Link></li>
              <li><Link to="/" className="hover:text-neon">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/public/about" className="hover:text-neon">About</Link></li>
              <li><Link to="/public/trainers" className="hover:text-neon">Trainers</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">© 2026 RFS Akhada. Forge your strongest self.</div>
      </footer>
    </div>
  );
}
