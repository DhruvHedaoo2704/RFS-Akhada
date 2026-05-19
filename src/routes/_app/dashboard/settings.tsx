import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

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
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        setSettings(defaultSettings);
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
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            logout();
            navigate({ to: "/public" });
          }}
        > 
          Sign Out
        </Button>
      </div>
    </form>
  );
}
