import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

// Maps route prefixes to a body theme class
const themeMap: Array<{ test: (p: string) => boolean; cls: string }> = [
  { test: (p) => p.startsWith("/dashboard/workout") || p.startsWith("/dashboard/live") || p.startsWith("/dashboard/exercises") || p.startsWith("/dashboard/strength") || p.startsWith("/dashboard/injury") || p.startsWith("/dashboard/challenges"), cls: "theme-orange" },
  { test: (p) => p.startsWith("/dashboard/progress") || p.startsWith("/dashboard/transformation") || p.startsWith("/dashboard/gamification") || p.startsWith("/dashboard/streaks"), cls: "theme-orange" },
  { test: (p) => p.startsWith("/dashboard/coach"), cls: "theme-mixed" },
];

export function useDynamicTheme() {
  const loc = useLocation();
  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-orange", "theme-mixed");
    const match = themeMap.find((t) => t.test(loc.pathname));
    if (match) body.classList.add(match.cls);
  }, [loc.pathname]);
}
