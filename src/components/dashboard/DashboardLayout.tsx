import { Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard, Brain, ShieldCheck, HeartPulse, TrendingUp, LineChart,
  Camera, Calculator, Utensils, Apple, BookOpen, MessageCircle, Trophy,
  Flame, Zap, Play, Settings, Bell, Search, Menu, X
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDynamicTheme } from "@/hooks/use-dynamic-theme";
import { logout } from "@/lib/auth";

const userSettingsKey = "rfs-user-settings";

function getInitialFromStorage() {
  if (typeof window === "undefined") return "A";
  const saved = localStorage.getItem(userSettingsKey);
  if (!saved) return "A";

  try {
    const parsed = JSON.parse(saved);
    const name = parsed?.profile?.name;
    return (typeof name === "string" && name.trim().length > 0)
      ? name.trim()[0].toUpperCase()
      : "A";
  } catch {
    return "A";
  }
}

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/workout-planner", label: "AI Planner", icon: Brain },
  { to: "/dashboard/injury-safe", label: "Injury Safe", icon: ShieldCheck },
  { to: "/dashboard/recovery", label: "Recovery", icon: HeartPulse },
  { to: "/dashboard/strength", label: "Strength", icon: TrendingUp },
  { to: "/dashboard/health-tracker", label: "Health Tracker", icon: LineChart },
  { to: "/dashboard/transformation", label: "Transformation", icon: Camera },
  { to: "/dashboard/meal-planner", label: "Meal Planner", icon: Utensils },
  { to: "/dashboard/exercises", label: "Exercises", icon: BookOpen },
  { to: "/dashboard/coach", label: "AI Coach", icon: MessageCircle },
  { to: "/dashboard/gamification", label: "Levels & XP", icon: Trophy },
  { to: "/dashboard/challenges", label: "Challenges", icon: Zap },
  { to: "/dashboard/live", label: "Live Workout", icon: Play },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

const bottomNav = nav.slice(0, 5);

export function DashboardLayout() {
  const loc = useLocation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userInitial, setUserInitial] = useState("A");
  useDynamicTheme();

  useEffect(() => {
    setUserInitial(getInitialFromStorage());

    const handleUserSettingsUpdated = () => {
      setUserInitial(getInitialFromStorage());
    };

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === userSettingsKey) {
        handleUserSettingsUpdated();
      }
    };

    window.addEventListener("rfs-user-settings-updated", handleUserSettingsUpdated);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("rfs-user-settings-updated", handleUserSettingsUpdated);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface/40 backdrop-blur-xl sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-border">
          <span className="size-9 rounded-xl gradient-neon grid place-items-center text-neon-foreground"><Flame className="size-5" /></span>
          <span className="font-display font-bold">RFS <span className="neon-text">AKHADA</span></span>
        </Link>
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${active ? "bg-neon/10 text-neon" : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"}`}>
                <Icon className="size-4" />
                <span>{label}</span>
                {active && <span className="ml-auto size-1.5 rounded-full bg-neon" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setOpen(false)}>
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full bg-surface border-r border-border flex flex-col">
              <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                <span className="font-display font-bold">RFS <span className="neon-text">AKHADA</span></span>
                <button onClick={() => setOpen(false)}><X className="size-5" /></button>
              </div>
              <nav className="flex-1 overflow-y-auto py-3 px-2">
                {nav.map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${loc.pathname === to ? "bg-neon/10 text-neon" : "text-muted-foreground"}`}>
                    <Icon className="size-4" /> {label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-40 glass-strong h-16 flex items-center px-4 sm:px-6 gap-3">
          <button className="lg:hidden p-2" onClick={() => setOpen(true)}><Menu className="size-5" /></button>
          <div className="flex-1 flex items-center gap-2 max-w-md">
            <div className="relative w-full">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search exercises, plans..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-elevated text-sm border border-border focus:outline-none focus:border-neon/50" />
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-surface-elevated relative">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-neon" />
          </button>
            <button
              onClick={() => {
                logout();
                router.navigate({ to: "/public" });
              }}
              className="hidden sm:inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-elevated"
            >
              Logout
            </button>
          <div className="size-9 rounded-full gradient-neon grid place-items-center text-neon-foreground font-bold text-sm">{userInitial}</div>
        </header>

        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6"><Outlet /></main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-border">
          <div className="grid grid-cols-5">
            {bottomNav.map(({ to, label, icon: Icon }) => {
              const active = loc.pathname === to;
              return (
                <Link key={to} to={to} className={`flex flex-col items-center py-2.5 gap-1 text-[10px] ${active ? "text-neon" : "text-muted-foreground"}`}>
                  <Icon className="size-5" />
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
