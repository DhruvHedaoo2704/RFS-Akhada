import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard/live")({
  head: () => ({ meta: [{ title: "Live Workout" }] }),
  component: Live,
});

const storageKey = "rfs-workouts";

type SavedWorkout = {
  id: number;
  name: string;
  date: string;
  goal: string;
  split: string;
  exercises: Array<{ id: number; name: string; muscle: string; sets: number; reps: string; rest: number } | any>;
};

const defaultWorkout = [
  { name: "Incline DB Press", muscle: "Chest", sets: 4, reps: "10", rest: 90 },
  { name: "Flat Bench", muscle: "Chest", sets: 3, reps: "8", rest: 120 },
  { name: "Cable Crossover", muscle: "Chest", sets: 3, reps: "12", rest: 60 },
  { name: "Tricep Dips", muscle: "Triceps", sets: 3, reps: "AMRAP", rest: 60 },
];

function Live() {
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as SavedWorkout[];
    } catch {
      return [];
    }
  });
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    savedWorkouts.length > 0 ? savedWorkouts[0].id : null
  );

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      if (!event.newValue) return setSavedWorkouts([]);

      try {
        const parsed = JSON.parse(event.newValue) as SavedWorkout[];
        setSavedWorkouts(parsed);
      } catch {
        setSavedWorkouts([]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (savedWorkouts.length > 0 && selectedWorkoutId === null) {
      setSelectedWorkoutId(savedWorkouts[0].id);
    }
  }, [savedWorkouts, selectedWorkoutId]);

  useEffect(() => {
    setIdx(0);
    setTime(0);
  }, [selectedWorkoutId]);

  const selectedWorkout = savedWorkouts.find((workout) => workout.id === selectedWorkoutId) ?? null;
  const workout = selectedWorkout?.exercises ?? defaultWorkout;
  const current = workout[idx] ?? workout[0] ?? defaultWorkout[0];
  const min = Math.floor(time / 60).toString().padStart(2, "0");
  const sec = (time % 60).toString().padStart(2, "0");

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="text-center">
        <p className="text-xs neon-text font-bold tracking-widest">LIVE WORKOUT</p>
        <h1 className="text-3xl font-display font-bold">In Session</h1>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Live session source</p>
          {selectedWorkout ? (
            <p className="font-semibold">{selectedWorkout.name}</p>
          ) : (
            <p className="font-semibold">Default demo workout</p>
          )}
        </div>
        {savedWorkouts.length > 0 && (
          <label className="flex flex-col text-sm text-muted-foreground">
            Choose saved workout
            <select
              value={selectedWorkoutId ?? undefined}
              onChange={(event) => setSelectedWorkoutId(Number(event.target.value))}
              className="mt-2 rounded-lg border border-border bg-surface-elevated px-3 py-2"
            >
              {savedWorkouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="glass-strong rounded-3xl p-8 text-center neon-glow">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Now</div>
        <div className="text-3xl font-display font-bold mt-1">{current.name}</div>
        <div className="mt-2 text-sm text-muted-foreground">{current.sets} sets · {current.reps} reps · {current.rest}s rest</div>
        <div className="my-8 text-7xl font-display font-bold neon-text tabular-nums">{min}:{sec}</div>
        <div className="flex justify-center gap-3">
          <button onClick={() => setRunning(r=>!r)} className="size-16 rounded-full bg-neon text-neon-foreground grid place-items-center neon-glow">
            {running ? <Pause className="size-7" /> : <Play className="size-7" />}
          </button>
          <button onClick={() => { setIdx((idx+1) % workout.length); setTime(0); }} className="size-16 rounded-full bg-surface-elevated grid place-items-center"><SkipForward className="size-6" /></button>
          <button className="size-16 rounded-full bg-surface-elevated grid place-items-center"><Volume2 className="size-6" /></button>
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Up Next</div>
        <div className="space-y-2">
          {workout.map((w,i) => (
            <div key={w.id ?? w.name} className={`flex justify-between p-3 rounded-lg ${i===idx ? "bg-neon/10 border border-neon/30" : "bg-surface-elevated"}`}>
              <span>{i+1}. {w.name}</span>
              <span className="text-muted-foreground text-sm">{w.sets}x{w.reps}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
