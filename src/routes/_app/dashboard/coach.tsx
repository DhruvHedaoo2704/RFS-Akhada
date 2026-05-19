import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/dashboard/coach")({
  head: () => ({ meta: [{ title: "AI Coach" }] }),
  component: Coach,
});

const suggestions = ["How to grow rear delts?", "Best lower chest exercises?", "Why no chest pump?", "Fix my squat depth"];

type Msg = { role: "user"|"ai"; text: string };

function Coach() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hey athlete 👋 I'm your AI coach. Ask me anything about training, recovery, or nutrition." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { role: "ai", text: `Great question. For "${text}" — focus on progressive overload, prioritize the weak link with a high-frequency stimulus, and recover hard. Try 3 sets of cable face pulls + reverse pec deck twice a week.` }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="max-w-3xl flex flex-col h-[calc(100vh-10rem)]">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">AI COACH</p>
        <h1 className="text-3xl font-display font-bold mb-4">Ask Anything</h1>
      </div>
      <div className="flex-1 glass rounded-2xl p-4 overflow-y-auto scrollbar-thin space-y-3">
        {msgs.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${m.role === "ai" ? "bg-surface-elevated rounded-bl-sm" : "ml-auto bg-neon text-neon-foreground rounded-br-sm"}`}>
            {m.text}
          </motion.div>
        ))}
        {typing && <div className="text-xs text-muted-foreground flex gap-1 items-center"><Sparkles className="size-3" /> Coach is typing...</div>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map(s => <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-surface-elevated border border-border hover:border-neon/40">{s}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask your coach..." className="flex-1 px-4 py-3 rounded-xl bg-surface-elevated border border-border focus:border-neon/60 outline-none" />
        <button className="px-4 py-3 rounded-xl bg-neon text-neon-foreground"><Send className="size-4" /></button>
      </form>
    </div>
  );
}
