import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, } from "recharts";
import { useState, useEffect } from "react";
import { Trophy, TrendingUp, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard/strength")({
  head: () => ({ meta: [{ title: "Strength Tracker" }] }),
  component: Strength,
});

function Strength() {
  // STARTS FROM ZERO
  const [strengthHistory, setStrengthHistory] = useState(() => {
    const savedData = localStorage.getItem("strengthHistory");

    return savedData
      ? JSON.parse(savedData)
      : [{ week: "Week 0", bench: 0, squat: 0, deadlift: 0 }];
  });

  // Persist to localStorage whenever strengthHistory changes
  useEffect(() => {
    localStorage.setItem(
      "strengthHistory",
      JSON.stringify(strengthHistory));
  }, [strengthHistory]);

  // INPUT STATES
  const [bench, setBench] = useState("");
  const [squat, setSquat] = useState("");
  const [deadlift, setDeadlift] = useState("");
  const clearHistory = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all progress?"
    );

    if (!confirmDelete) return;

    localStorage.removeItem("strengthHistory");

    setStrengthHistory([
      { week: "Week 0", bench: 0, squat: 0, deadlift: 0 },
    ]);
  };

  // PERSONAL RECORDS
  const prs = [
    {
      lift: "Bench Press",
      w:
        strengthHistory[strengthHistory.length - 1]?.bench + " kg",
      up:
        "+" +
        (strengthHistory[strengthHistory.length - 1]?.bench || 0) +
        "kg",
    },
    {
      lift: "Squat",
      w:
        strengthHistory[strengthHistory.length - 1]?.squat + " kg",
      up:
        "+" +
        (strengthHistory[strengthHistory.length - 1]?.squat || 0) +
        "kg",
    },
    {
      lift: "Deadlift",
      w:
        strengthHistory[strengthHistory.length - 1]?.deadlift + " kg",
      up:
        "+" +
        (strengthHistory[strengthHistory.length - 1]?.deadlift || 0) +
        "kg",
    },
  ];



  // UPDATE WEEKLY ENTRY
  const handleUpdate = () => {
    const benchWeight = Number(bench);
    const squatWeight = Number(squat);
    const deadliftWeight = Number(deadlift);

    // VALIDATION
    const isValidWeight = (weight: number) =>
      weight >= 0 && weight <= 500;

    if (
      !isValidWeight(benchWeight) ||
      !isValidWeight(squatWeight) ||
      !isValidWeight(deadliftWeight)
    ) {
      alert("Weight must be between 0 and 500 kg");

      return;
    }

    const nextWeek = new Date().toLocaleDateString();

    const newEntry = {
      week: nextWeek,
      bench: benchWeight,
      squat: squatWeight,
      deadlift: deadliftWeight,
    };

    setStrengthHistory([...strengthHistory, newEntry]);

    // CLEAR INPUTS
    setBench("");
    setSquat("");
    setDeadlift("");
  };

  // AI RECOMMENDATIONS
  const lastBench =
    strengthHistory[strengthHistory.length - 1]?.bench || 0;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* HEADER */}
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">
          STRENGTH TRACKER
        </p>

        <h1 className="text-3xl font-display font-bold">
          Progressive Overload
        </h1>
      </div>

      {/* PR CARDS */}
      <div className="grid sm:grid-cols-3 gap-4">
        {prs.map((p) => (
          <div
            key={p.lift}
            className="glass rounded-2xl p-5 border border-white/5"
          >
            <Trophy className="size-5 text-neon" />

            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-3">
              {p.lift}
            </div>

            <div className="text-2xl font-display font-bold mt-1">
              {p.w}
            </div>

            <div className="text-xs neon-text font-bold mt-1">
              {p.up} progress
            </div>
          </div>
        ))}
      </div>

      {/* UPDATE SECTION */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-2 mb-5">
          <Plus className="size-5 text-neon" />

          <h3 className="font-display font-bold text-lg">
            Weekly Strength Update
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">
              Bench Press (kg)
            </label>

            <input
              type="number"
              value={bench}
              onChange={(e) => setBench(e.target.value)}
              placeholder="Enter bench weight"
              className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Squat (kg)
            </label>

            <input
              type="number"
              value={squat}
              onChange={(e) => setSquat(e.target.value)}
              placeholder="Enter squat weight"
              className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Deadlift (kg)
            </label>

            <input
              type="number"
              value={deadlift}
              onChange={(e) => setDeadlift(e.target.value)}
              placeholder="Enter deadlift weight"
              className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleUpdate}
            className="bg-neon text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Update Weekly Progress
          </button>

          <button
            onClick={clearHistory}
            className="bg-red-500/20 border border-red-500 text-red-400 font-semibold px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            Delete History
          </button>
        </div>
      </div>

      {/* CHART */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-display font-bold mb-4">
          Strength Progress Curve
        </h3>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={strengthHistory}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(1 0 0 / 0.05)"
            />

            <XAxis
              dataKey="week"
              stroke="oklch(0.68 0.015 240)"
            />

            {/* ALWAYS START FROM 0 */}
            <YAxis
              domain={[0, "auto"]}
              stroke="oklch(0.68 0.015 240)"
            />

            <Tooltip
              contentStyle={{
                background: "oklch(0.17 0.012 240)",
                border:
                  "1px solid oklch(1 0 0 / 0.1)",
                borderRadius: 12,
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="bench"
              stroke="oklch(0.92 0.22 130)"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="squat"
              stroke="oklch(0.7 0.18 200)"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="deadlift"
              stroke="oklch(0.75 0.18 290)"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI RECOMMENDATIONS */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="size-5 text-neon" />

          <h3 className="font-display font-bold">
            AI Recommendations
          </h3>
        </div>

        <ul className="space-y-2 text-sm">
          <li>
            • Increase bench press by{" "}
            <span className="neon-text font-semibold">
              2.5 kg
            </span>{" "}
            next session.
          </li>

          <li>
            • Your squat progression is improving steadily.
          </li>

          <li>
            • Deadlift recovery looks good this week.
          </li>

          <li>
            • Current bench PR:{" "}
            <span className="neon-text font-semibold">
              {lastBench} kg
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}