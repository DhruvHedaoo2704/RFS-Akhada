import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const defaultSettings = {
  profile: {
    name: "",
    email: "",
  },
  goals: {
    primaryGoal: "Muscle Gain",
    weeklyWorkouts: "5",
  },
  notifications: {
    workoutReminders: true,
    weeklyReports: false,
  }
};

const storageKey = "rfs-user-settings";

type Settings = typeof defaultSettings;

export const Route = createFileRoute("/_app/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: Settings,
});

function Settings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [savedWorkouts, setSavedWorkouts] = useState<Array<{ id: number; date: string }>>([]);
  const [healthTracker, setHealthTracker] = useState<{
    daily?: { water?: number; sleep?: number; workouts?: number };
    nutritionLogs?: any[];
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        setSettings(defaultSettings);
      }
    }

    const savedWorkoutData = localStorage.getItem("rfs-workouts");
    if (savedWorkoutData) {
      try {
        setSavedWorkouts(JSON.parse(savedWorkoutData));
      } catch {
        setSavedWorkouts([]);
      }
    }

    const savedHealth = localStorage.getItem("healthTracker");
    if (savedHealth) {
      try {
        setHealthTracker(JSON.parse(savedHealth));
      } catch {
        setHealthTracker(null);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    window.dispatchEvent(new Event("rfs-user-settings-updated"));
  }, [settings]);

  function updateField<Section extends keyof Settings, Key extends keyof Settings[Section]>(
    section: Section,
    key: Key,
    value: Settings[Section][Key]
  ) {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }

  const workoutStreak = useMemo(() => {
    if (!savedWorkouts.length) return 0;

    const dates = savedWorkouts
      .map((workout) => new Date(workout.date))
      .filter((date) => !Number.isNaN(date.getTime()))
      .map((date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let expected = new Date();
    expected.setHours(0, 0, 0, 0);

    for (const date of dates) {
      const diffDays = Math.round((expected.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (streak === 0) {
        if (diffDays === 0 || diffDays === 1) {
          streak = 1;
          expected.setDate(date.getDate() - 1);
        } else {
          break;
        }
      } else {
        if (diffDays === 0) {
          continue;
        }
        if (diffDays === 1) {
          streak += 1;
          expected.setDate(expected.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return streak;
  }, [savedWorkouts]);

  const nutritionLogs = healthTracker?.nutritionLogs?.length ?? 0;
  const sleepHours = healthTracker?.daily?.sleep ?? 0;
  const waterLiters = healthTracker?.daily?.water ?? 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(settings));
    window.dispatchEvent(new Event("rfs-user-settings-updated"));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">SETTINGS</p>
        <h1 className="text-3xl font-display font-bold">Account</h1>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-bold mb-4">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
            <input
              value={settings.profile.name}
              onChange={(event) => updateField("profile", "name", event.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-surface-elevated border border-border"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              value={settings.profile.email}
              onChange={(event) => updateField("profile", "email", event.target.value)}
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-surface-elevated border border-border"
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-bold mb-4">Goals</h2>
        <div className="space-y-3">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display font-bold mb-4">
              Goals
            </h2>

            <div className="space-y-4">
              {/* PRIMARY GOAL */}

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Primary Goal
                </label>

                <select
                  value={settings.goals.primaryGoal}
                  onChange={(event) =>
                    updateField(
                      "goals",
                      "primaryGoal",
                      event.target.value
                    )
                  }
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-surface-elevated border border-border"
                >
                  <option value="Fat Loss">
                    Fat Loss
                  </option>

                  <option value="Muscle Gain">
                    Muscle Gain
                  </option>

                  <option value="Maintenance">
                    Maintenance
                  </option>

                  <option value="Strength">
                    Strength
                  </option>

                  <option value="Powerlifting">
                    Powerlifting
                  </option>

                  <option value="Athletic Performance">
                    Athletic Performance
                  </option>
                </select>
              </div>

              {/* WEEKLY WORKOUTS */}

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Weekly Workouts
                </label>

                <select
                  value={settings.goals.weeklyWorkouts}
                  onChange={(event) =>
                    updateField(
                      "goals",
                      "weeklyWorkouts",
                      event.target.value
                    )
                  }
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-surface-elevated border border-border"
                >
                  <option value="2">
                    2 Days / Week
                  </option>

                  <option value="3">
                    3 Days / Week
                  </option>

                  <option value="4">
                    4 Days / Week
                  </option>

                  <option value="5">
                    5 Days / Week
                  </option>

                  <option value="6">
                    6 Days / Week
                  </option>

                  <option value="7">
                    7 Days / Week
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-bold mb-4">Streaks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Workout Streak</div>
            <div className="text-4xl font-display font-bold neon-text">{workoutStreak}</div>
            <div className="text-xs text-muted-foreground">consecutive days</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Nutrition Logs</div>
            <div className="text-4xl font-display font-bold neon-text">{nutritionLogs}</div>
            <div className="text-xs text-muted-foreground">entries recorded</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Sleep</div>
            <div className="text-4xl font-display font-bold neon-text">{sleepHours ? `${sleepHours}h` : "—"}</div>
            <div className="text-xs text-muted-foreground">last logged</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Water</div>
            <div className="text-4xl font-display font-bold neon-text">{waterLiters ? `${waterLiters}L` : "—"}</div>
            <div className="text-xs text-muted-foreground">daily hydration</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-10 gap-1.5">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded ${i < Math.min(workoutStreak, 30) ? "bg-neon" : "bg-surface-elevated"}`}
            />
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-bold mb-4">
          Notifications
        </h2>

        <div className="space-y-5">
          {/* WORKOUT REMINDERS */}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Workout Reminders
              </h3>

              <p className="text-sm text-muted-foreground">
                Receive workout notifications
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                updateField(
                  "notifications",
                  "workoutReminders",
                  !Boolean(
                    settings.notifications
                      .workoutReminders
                  )
                )
              }
              className={`w-14 h-8 rounded-full transition-all duration-300 flex items-center px-1 ${
                settings.notifications
                  .workoutReminders
                  ? "bg-neon"
                  : "bg-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-all duration-300 ${
                  settings.notifications
                    .workoutReminders
                    ? "translate-x-6"
                    : ""
                }`}
              />
            </button>
          </div>

          {/* WEEKLY REPORTS */}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Weekly Reports
              </h3>

              <p className="text-sm text-muted-foreground">
                Get weekly progress insights
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                updateField(
                  "notifications",
                  "weeklyReports",
                  !Boolean(
                    settings.notifications
                      .weeklyReports
                  )
                )
              }
              className={`w-14 h-8 rounded-full transition-all duration-300 flex items-center px-1 ${
                settings.notifications
                  .weeklyReports
                  ? "bg-neon"
                  : "bg-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-all duration-300 ${
                  settings.notifications
                    .weeklyReports
                    ? "translate-x-6"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="bg-neon text-neon-foreground hover:bg-neon/90">Save Changes</Button>
        <Button asChild variant="outline"><Link to="/">Sign Out</Link></Button>
      </div>
    </form>
  );
}
