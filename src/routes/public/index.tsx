import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Play, Activity, Brain, Trophy, Zap, ShieldCheck, Star } from "lucide-react";
import heroImg from "@/assets/hero-athlete.jpg";
import { programs, testimonials } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/public/")({
  head: () => ({
    meta: [
      { title: "RFS Akhada — India's AI Fitness Akhada" },
      { name: "description", content: "Real Fitness System — premium AI-powered Indian fitness platform. Smart workouts, recovery, nutrition and progress." },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: Brain, title: "AI Workout Planner", desc: "Generates intelligent splits tailored to your goals." },
  { icon: ShieldCheck, title: "Injury Safe Mode", desc: "Auto-swaps risky lifts for safer alternatives." },
  { icon: Activity, title: "Smart Recovery", desc: "Adapts intensity to your readiness, daily." },
  { icon: Trophy, title: "Progressive Overload", desc: "AI tells you exactly when to add weight." },
];

function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-bold tracking-[0.25em] neon-text mb-4">STRONGER EVERYDAY</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[0.95]">
              BUILD YOUR<br /><span className="">BEST SELF</span>
            </h1>
            <p className="mt-5 text-muted-foreground max-w-md">
              Transform your body the Akhada way — RFS Akhada is your personal AI fitness coach, made for India.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-neon text-neon-foreground hover:bg-neon/90 neon-glow">
                <Link to="/signup">Start Training <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border">
                <Link to="/dashboard/workout-planner"><Play className="mr-2 size-4" /> Generate Workout</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "💪", t: "Expert Trainers", s: "Certified & Experienced" },
                { icon: "📋", t: "Personalized Plan", s: "Tailored to Your Goals" },
                { icon: "🏋️", t: "Modern Equipment", s: "High Quality & Safe" },
                { icon: "🏆", t: "Results Driven", s: "Track & Achieve More" },
              ].map((f) => (
                <div key={f.t} className="glass rounded-xl p-3">
                  <div className="text-xl">{f.icon}</div>
                  <div className="mt-1 text-xs font-semibold">{f.t}</div>
                  <div className="text-[10px] text-muted-foreground">{f.s}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative">
            <div className="absolute -inset-4 gradient-neon opacity-20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-border">
              <img src={heroImg} alt="Athletic man training with dumbbell" width={1280} height={1280} className="w-full h-[420px] sm:h-[520px] object-cover" />
            </div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 w-[260px] glass-strong rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-bold">5000+</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Happy Members</span>
              </div>
              <div className="flex -space-x-2 mt-2">
                {[1,2,3,4,5].map(i => <div key={i} className="size-7 rounded-full gradient-neon border-2 border-surface" />)}
              </div>
              <div className="mt-2 text-[11px] neon-text font-semibold">Join our community today!</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "5000+", l: "Active Members" },
            { v: "120+", l: "Workout Plans" },
            { v: "98%", l: "Achieve Goals" },
            { v: "24/7", l: "AI Coach" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold neon-text">{s.v}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest neon-text">OUR PROGRAMS</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-1">TRAIN YOUR WAY</h2>
          </div>
          <Button asChild variant="outline"><Link to="/public/programs">View All Programs <ArrowRight className="ml-2 size-4" /></Link></Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {programs.slice(0, 4).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group glass rounded-2xl overflow-hidden hover:border-neon/40 transition-all hover:-translate-y-1">
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute top-3 left-3 size-10 rounded-full gradient-neon grid place-items-center text-neon-foreground">
                  <Zap className="size-5" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold uppercase">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                <Link to="/public/programs" className="inline-flex items-center gap-1 mt-3 text-xs font-bold neon-text">LEARN MORE <ArrowRight className="size-3" /></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest neon-text">WHY RFS AKHADA</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-1">SMARTER. STRONGER. FASTER.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:border-neon/40 transition-all">
              <div className="size-12 rounded-xl bg-neon/10 grid place-items-center text-neon"><f.icon className="size-6" /></div>
              <h3 className="font-display font-bold mt-4">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest neon-text">TESTIMONIALS</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-1">REAL ATHLETES. REAL RESULTS.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6">
              <div className="flex gap-1 text-neon">{[...Array(5)].map((_,i) => <Star key={i} className="size-4 fill-current" />)}</div>
              <p className="mt-3 text-sm">"{t.text}"</p>
              <div className="mt-4">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-strong rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-neon opacity-10" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-display font-bold">READY TO ENTER THE AKHADA?</h2>
            <p className="mt-3 text-muted-foreground">Join thousands of Indian warriors forging their strongest selves with AI.</p>
            <Button asChild size="lg" className="mt-6 bg-neon text-neon-foreground hover:bg-neon/90"><Link to="/signup">Start Training Today</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
