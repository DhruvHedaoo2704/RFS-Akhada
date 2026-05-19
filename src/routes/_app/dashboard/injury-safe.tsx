import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

import { exercises } from "@/data/exercises";

export const Route = createFileRoute("/_app/dashboard/injury-safe")({
  head: () => ({
    meta: [{ title: "RFS Akhada | Injury Safe Mode" }],
  }),
  component: InjurySafe,
});

// ======================================================
// INJURY TYPES
// ======================================================

const injuries = [
  "Shoulder Pain",
  "Knee Pain",
  "Lower Back Pain",
  "Elbow Pain",
  "Wrist Pain",
  "Neck Pain",
  "Ankle Pain",
];

// ======================================================
// INJURY → RESTRICTED STRESS AREAS
// ======================================================

const injuryStressMap: Record<string, string[]> = {
  "Shoulder Pain": ["Shoulders"],
  "Knee Pain": ["Knees", "Ankles"],
  "Lower Back Pain": ["Lower Back", "Spine", "Hips"],
  "Elbow Pain": ["Elbows", "Forearms"],
  "Wrist Pain": ["Wrists", "Forearms"],
  "Neck Pain": ["Neck"],
  "Ankle Pain": ["Ankles", "Knees"],
};

// ======================================================
// SMART SAFE SWAPS
// ======================================================

const smartSwaps: Record<string, string[]> = {

  "Barbell Bench Press": [
    "Machine Chest Press",
    "Push-Up",
  ],

  "Incline Bench Press": [
    "Incline Push-Up",
    "Incline Dumbbell Press",
  ],

  "Chest Dips": [
    "Push-Up",
    "Machine Chest Press",
  ],

  "Deadlift": [
    "Rack Pull",
    "Lat Pulldown",
  ],

  "Barbell Row": [
    "Resistance Band Row",
    "Lat Pulldown",
  ],

  "Pull-Up": [
    "Lat Pulldown",
    "Resistance Band Row",
  ],

  "Overhead Press": [
    "Front Raise",
    "Lateral Raise",
  ],

  "Handstand Push-Up": [
    "Pike Push-Up",
  ],

  "Barbell Squat": [
    "Leg Press",
    "Wall Sit",
  ],

  "Walking Lunges": [
    "Glute Bridge",
    "Leg Press",
  ],

  "Skull Crusher": [
    "Tricep Pushdown",
    "Bench Dips",
  ],

  "Barbell Curl": [
    "Hammer Curl",
    "Resistance Band Curl",
  ],

  "Ab Wheel Rollout": [
    "Plank",
    "Crunches",
  ],

  "Burpees": [
    "Jump Rope",
    "Shadow Boxing",
  ],
};

// ======================================================
// COMPONENT
// ======================================================

function InjurySafe() {

  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (injury: string) => {
    setSelected((prev) =>
      prev.includes(injury)
        ? prev.filter((x) => x !== injury)
        : [...prev, injury]
    );
  };

  // ======================================================
  // GENERATE SAFE RECOMMENDATIONS
  // ======================================================

  const recommendations = useMemo((): any[] => {

    if (selected.length === 0) return [];

    // ==================================================
    // GET RESTRICTED AREAS
    // ==================================================

    const restrictedAreas = selected.flatMap(
      (injury) => injuryStressMap[injury] || []
    );

    // ==================================================
    // FIND RISKY EXERCISES
    // ==================================================

    const riskyExercises = exercises.filter((exercise) => {

      if (!exercise.stressAreas) return false;

      return exercise.stressAreas.some((area: string) =>
        restrictedAreas.includes(area)
      );
    });

    // ==================================================
    // GENERATE SAFE SWAPS
    // ==================================================

    const generatedRecommendations = riskyExercises.map((exercise) => {

      let replacements: any[] = [];

      // ==============================================
      // STEP 1 → SMART MANUAL SWAPS
      // ==============================================

      if (smartSwaps[exercise.name]) {

        replacements = smartSwaps[exercise.name]
          .map((swapName) =>
            exercises.find((e) => e.name === swapName)
          )
          .filter(Boolean);
      }

      // ==============================================
      // STEP 2 → EXERCISE ALTERNATIVES
      // ==============================================

      if (replacements.length === 0) {

        replacements =
          exercise.alternatives
            ?.map((id: number) =>
              exercises.find((e) => e.id === id)
            )
            .filter(Boolean) || [];
      }

      // ==============================================
      // STEP 3 → AUTO SAFE SEARCH
      // ==============================================

      if (replacements.length === 0) {

        replacements = exercises.filter((e) => {

          // avoid same exercise

          if (e.id === exercise.id) return false;

          // prefer same level

          if (e.level !== exercise.level) return false;

          // prefer same equipment

          if (e.equipment !== exercise.equipment) return false;

          // safety check

          const unsafe = e.stressAreas?.some(
            (area: string) =>
              restrictedAreas.includes(area)
          );

          if (unsafe) return false;

          return true;
        });
      }

      // ==============================================
      // FINAL SAFETY FILTER
      // ==============================================

      const safeReplacements = replacements.filter((e) => {

        if (!e?.stressAreas) return true;

        return !e.stressAreas.some(
          (area: string) =>
            restrictedAreas.includes(area)
        );
      });

      // ==============================================
      // REMOVE DUPLICATES
      // ==============================================

      const uniqueReplacements = safeReplacements.filter(
        (exercise, index, self) =>
          index ===
          self.findIndex((e) => e.id === exercise.id)
      );

      const finalReplacements = uniqueReplacements
        .slice(0, 4)
        .map((e) => ({
          id: e.id,
          name: e.name,
          muscle: e.muscle,
          level: e.level,
          equipment: e.equipment,
        }));

      // DONT RETURN IF NO SAFE EXERCISE FOUND

      if (finalReplacements.length === 0) {
        return null;
      }

      return {
        injury: selected.join(", "),

        original: {
          name: exercise.name,
          muscle: exercise.muscle,
          level: exercise.level,
        },

        replacements: finalReplacements,
      };
    });

    return generatedRecommendations.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );
  }, [selected]);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}

      <div>

        <p className="text-xs neon-text font-bold tracking-widest">
          RFS AKHADA SAFE TRAINING SYSTEM
        </p>

        <h1 className="text-4xl font-display font-bold">
          Injury Safe Mode
        </h1>

        <p className="text-muted-foreground mt-2">
          AI-generated injury-safe exercise replacements.
        </p>

      </div>

      {/* SELECT INJURIES */}

      <div className="glass rounded-3xl p-6">

        <h2 className="font-display font-bold text-2xl mb-5">
          Select Your Injuries
        </h2>

        <div className="flex flex-wrap gap-3">

          {injuries.map((injury) => (

            <button
              key={injury}
              onClick={() => toggle(injury)}
              className={`px-5 py-2 rounded-full border transition-all ${
                selected.includes(injury)
                  ? "bg-neon text-black border-neon neon-glow"
                  : "bg-surface-elevated border-border"
              }`}
            >
              {injury}
            </button>

          ))}

        </div>
      </div>

      {/* RESULTS */}

      {recommendations.length > 0 && (

        <div className="glass rounded-3xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <ShieldCheck className="size-6 text-neon" />

            <div>

              <h2 className="font-display font-bold text-2xl">
                Safe Exercise Replacements
              </h2>

              <p className="text-sm text-muted-foreground">
                Exercises filtered according to your injuries
              </p>

            </div>
          </div>

          <div className="space-y-4">

            {recommendations.map((item, index) => (

              <div
                key={index}
                className="bg-surface-elevated rounded-2xl p-5"
              >

                {/* ORIGINAL */}

                <div className="flex items-center gap-2 mb-4">

                  <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-300">
                    {item.injury}
                  </span>

                  <span className="line-through text-muted-foreground">
                    {item.original.name}
                  </span>

                  <ArrowRight className="size-4 text-neon" />

                </div>

                {/* REPLACEMENTS */}

                <div className="flex flex-wrap gap-3">

                  {item.replacements.map((replacement: {
                    id: number;
                    name: string;
                    muscle: string;
                    level: string;
                    equipment: string;
                  }) => (

                    <div
                      key={replacement.id}
                      className="px-4 py-3 rounded-2xl bg-neon/10 border border-neon/20"
                    >

                      <p className="font-semibold neon-text">
                        {replacement.name}
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        {replacement.muscle} • {replacement.level} • {replacement.equipment}
                      </p>

                    </div>

                  ))}

                </div>
              </div>

            ))}

          </div>
        </div>

      )}
    </div>
  );
}