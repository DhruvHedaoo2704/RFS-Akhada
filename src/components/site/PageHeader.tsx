import { motion } from "framer-motion";

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
      {eyebrow && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold tracking-widest uppercase neon-text mb-3">{eyebrow}</motion.p>}
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="text-4xl md:text-6xl font-bold font-display">{title}</motion.h1>
      {subtitle && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-4 text-muted-foreground max-w-2xl mx-auto">{subtitle}</motion.p>}
    </div>
  );
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl px-5 py-4">
      <div className="text-2xl font-display font-bold neon-text">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}
