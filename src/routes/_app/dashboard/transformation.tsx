import { createFileRoute } from "@tanstack/react-router";
import { Camera, Plus } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard/transformation")({
  head: () => ({ meta: [{ title: "Transformation Timeline" }] }),
  component: Transformation,
});

type ProgressEntry = {
  id: string;
  date: string;
  weight: string;
  before?: string;
  after?: string;
  note: string;
};

const storageKey = "rfs-transformation-progress";

function Transformation() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed: ProgressEntry[] = JSON.parse(saved);
      if (parsed.length) {
        setEntries(parsed);
      }
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries]);

  const visibleEntries = showAll ? entries : entries.slice(0, 6);
  const workoutStreak = (() => {
    const dated = entries
      .map((entry) => ({ entry, timestamp: Date.parse(entry.date) }))
      .filter((item) => !Number.isNaN(item.timestamp))
      .sort((a, b) => b.timestamp - a.timestamp);

    if (!dated.length) return 0;

    let streak = 1;
    for (let i = 1; i < dated.length; i += 1) {
      const previous = dated[i - 1].timestamp;
      const current = dated[i].timestamp;
      const diffDays = Math.round((previous - current) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  })();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === "before") {
        setBeforePreview(result);
      } else {
        setAfterPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProgress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!weight.trim() || !beforePreview || !afterPreview || !description.trim()) return;

    const nextEntry: ProgressEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      weight: `${weight.trim()} kg`,
      before: beforePreview,
      after: afterPreview,
      note: description.trim(),
    };

    setEntries((current) => [nextEntry, ...current]);
    setWeight("");
    setDescription("");
    setBeforePreview(null);
    setAfterPreview(null);
    setShowAll(true);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">TRANSFORMATION</p>
        <h1 className="text-3xl font-display font-bold">Your Journey</h1>
      </div>

      <form onSubmit={handleAddProgress} className="rounded-3xl border border-slate-800 bg-slate-950/90 shadow-[0_25px_50px_-25px_rgba(15,23,42,0.85)] p-6 space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-semibold text-slate-100">Upload Progress Photos</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="group flex flex-col items-center justify-center rounded-3xl border border-slate-700 bg-slate-900/95 p-6 text-center cursor-pointer transition hover:border-neon/70">
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleFileChange(event, "before")} />
                  <Camera className="size-6 mb-3 text-slate-400" />
                  <span className="text-sm font-medium text-slate-100">Before image</span>
                </label>
                <label className="group flex flex-col items-center justify-center rounded-3xl border border-slate-700 bg-slate-900/95 p-6 text-center cursor-pointer transition hover:border-neon/70">
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleFileChange(event, "after")} />
                  <Camera className="size-6 mb-3 text-slate-400" />
                  <span className="text-sm font-medium text-slate-100">After image</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-slate-400">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a short workout note"
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-slate-100 placeholder:text-slate-500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-slate-400">Weight</label>
                <input
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  placeholder="Enter weight"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Streak</div>
                <div className="rounded-3xl bg-neon/10 px-4 py-3 text-center font-bold text-2xl neon-text">{workoutStreak}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-900/95 p-4 border border-slate-700">
              <div className="text-sm font-semibold mb-3 text-slate-100">Preview</div>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-slate-950/90 p-3">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Before</div>
                  {beforePreview ? (
                    <img src={beforePreview} alt="Before preview" className="h-40 w-full rounded-3xl object-cover" />
                  ) : (
                    <div className="aspect-square rounded-3xl bg-surface-elevated grid place-items-center text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-3">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">After</div>
                  {afterPreview ? (
                    <img src={afterPreview} alt="After preview" className="h-40 w-full rounded-3xl object-cover" />
                  ) : (
                    <div className="aspect-square rounded-3xl bg-slate-900/90 grid place-items-center text-slate-500">No image</div>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={!weight.trim() || !beforePreview || !afterPreview || !description.trim()}
              className="w-full bg-neon text-neon-foreground hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="size-4" /> Add Progress
            </Button>
          </div>
        </div>
      </form>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.9)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-100">Current Streak</h2>
            <p className="text-sm text-slate-400">Based on your workout progress, this is your active streak.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-4 text-center text-slate-950 shadow-md">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-900/70">days in a row</div>
            <div className="text-5xl font-display font-bold">{workoutStreak}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.9)]">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-slate-100">Timeline</h3>
            <p className="text-sm text-slate-400">Showing your latest progress updates.</p>
          </div>
          {entries.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="text-sm font-semibold neon-text"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        <div className={`relative pl-6 space-y-5 ${showAll ? "max-h-[420px] overflow-y-auto pr-4" : ""} before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border`}>
          {visibleEntries.length === 0 ? (
            <div className="rounded-3xl border border-slate-700 bg-slate-900/95 p-6 text-center text-sm text-slate-400">
              No progress entries yet. Upload your first before and after photos to start tracking.
            </div>
          ) : (
            visibleEntries.map((entry) => (
              <div key={entry.id} className="relative rounded-3xl bg-slate-900/95 p-5 border border-slate-700 shadow-sm">
                <div className="absolute -left-5 top-6 size-3 rounded-full bg-cyan-400/90 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)]" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs neon-text font-bold">{new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                        <div className="text-lg font-semibold">{entry.weight}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="rounded-full border border-red-400 px-3 py-1 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="text-sm text-muted-foreground">{entry.note}</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl overflow-hidden border border-border bg-background">
                      {entry.before ? (
                        <img src={entry.before} alt="Before" className="h-28 w-full object-cover" />
                      ) : (
                        <div className="h-28 grid place-items-center text-xs text-muted-foreground">No before image</div>
                      )}
                    </div>
                    <div className="rounded-3xl overflow-hidden border border-border bg-background">
                      {entry.after ? (
                        <img src={entry.after} alt="After" className="h-28 w-full object-cover" />
                      ) : (
                        <div className="h-28 grid place-items-center text-xs text-muted-foreground">No after image</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
