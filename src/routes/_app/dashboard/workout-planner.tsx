import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Brain, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Repeat, Save, Calendar, Trash2} from "lucide-react";
import { Button } from "@/components/ui/button";
import { exercises } from "@/data/exercises";

export const Route = createFileRoute("/_app/dashboard/workout-planner")({
  head: () => ({ meta: [{ title: "RFS Akhada | AI Workout Planner" }] }),
  component: Planner,
});

// --- CONSTANTS ---
const locations = ["Gym", "Home"];
const goals = ["Fat Loss", "Muscle Gain", "Strength", "Endurance", "Powerlifting"];
const splits = ["Push Pull Legs", "Arnold Split", "Upper Lower", "Full Body", "Custom"];
const bodyParts = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms", "Legs", "Abs"];
const levels = ["Beginner", "Intermediate", "Advanced"];

const pushParts = ["Chest", "Shoulders", "Triceps"];
const pullParts = ["Back", "Biceps", "Forearms"];
const legParts = ["Legs", "Calves"];
const upperParts = ["Chest", "Back", "Shoulders", "Biceps", "Triceps"];
const lowerParts = ["Legs", "Abs", "Calves"];

// --- TYPES & INTERFACES ---
interface PillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Pill({ active, onClick, children }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${active
        ? "bg-neon text-neon-foreground border-neon neon-glow shadow-[0_0_15px_rgba(var(--neon),0.4)]"
        : "border-border bg-surface-elevated hover:border-neon/40 text-muted-foreground hover:text-foreground"
        }`}
    >
      {children}
    </button>
  );
}

interface SavedWorkout {
  id: number;
  name: string;
  date: string;
  goal: string;
  split: string;
  exercises: any[];
}

function Planner() {
  // --- STATE MACHINE ---
  const [history, setHistory] = useState<string[]>(["LOCATION"]);
  const currentScreen = history[history.length - 1];

  // --- SELECTION STATES ---
  const [location, setLocation] = useState(locations[0]);
  const [goal, setGoal] = useState(goals[1]);
  const [split, setSplit] = useState(splits[0]);

  // Sub-selections based on path
  const [subSplit, setSubSplit] = useState(""); // For PPL (Push/Pull/Legs), UpperLower (Upper/Lower), etc.
  const [parts, setParts] = useState<string[]>([]); // For Arnold, Custom
  const [sbdFocus, setSbdFocus] = useState(""); // For Powerlifting
  const [cardioType, setCardioType] = useState(""); // For Endurance

  // Levels
  const [overallLevel, setOverallLevel] = useState("Intermediate");
  const [partLevels, setPartLevels] = useState<Record<string, string>>({});
  const [openAlternatives, setOpenAlternatives] = useState<Record<number, boolean>>({});

  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>(() => {
    const stored = localStorage.getItem("rfs-workouts");

    return stored ? JSON.parse(stored) : [];
  });

  const [saveSuccess, setSaveSuccess] = useState(false);


  // --- ROUTING LOGIC ---
  const handleNext = () => {
    let nextScreen = "";

    switch (currentScreen) {
      case "LOCATION":
        nextScreen = "GOAL";
        break;

      case "GOAL":
        if (goal === "Endurance") nextScreen = "CARDIO";
        else if (goal === "Powerlifting") nextScreen = "SBD";
        else nextScreen = "SPLIT";
        break;

      case "SPLIT":
        if (split === "Full Body") nextScreen = "LEVEL";
        else nextScreen = "SUB_SPLIT";
        break;

      case "CARDIO":
      case "SBD":
      case "SUB_SPLIT":
        nextScreen = "LEVEL";
        // Pre-fill partLevels if going to Upper Lower Level screen
        if (split === "Upper Lower") {
          const targetParts = subSplit === "Upper" ? upperParts : lowerParts;
          const initialLevels: Record<string, string> = {};
          targetParts.forEach((p) => (initialLevels[p] = "Intermediate"));
          setPartLevels(initialLevels);
        }
        break;

      case "LEVEL":
        nextScreen = "RESULTS";
        break;
    }

    if (nextScreen) {
      setHistory([...history, nextScreen]);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  // --- HELPER LOGIC ---
  const togglePart = (part: string) => {
    if (split === "Arnold Split") {
      // Arnold: Force single selection
      setParts([part]);
    } else {
      // Custom: Multi selection
      setParts((prev) =>
        prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
      );
    }
  };

  const updatePartLevel = (part: string, lvl: string) => {
    setPartLevels((prev) => ({ ...prev, [part]: lvl }));
  };

  const toggleAlternatives = (id: number) => {
    setOpenAlternatives((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const saveWorkout = () => {
    if (!generatedWorkout.length) return;

    const newWorkout: SavedWorkout = {
      id: Date.now(),
      name: `${goal} - ${split} - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      goal,
      split,
      exercises: generatedWorkout,
    };

    setSavedWorkouts((prev) => [newWorkout, ...prev]);

    localStorage.setItem("rfs-workouts", JSON.stringify([newWorkout, ...savedWorkouts]));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const deleteWorkout = (id: number) => {

    const updated = savedWorkouts.filter(
      (workout) => workout.id !== id
    );

    setSavedWorkouts(updated);

    localStorage.setItem(
      "rfs-workouts",
      JSON.stringify(updated)
    );
  };

  // ===========================
  // AI GENERATED WORKOUT LOGIC
  // ===========================
  const generatedWorkout = useMemo(() => {
    if (currentScreen !== "RESULTS") return [];

    let targetMuscles: string[] = [];

    // 1. RESOLVE TARGET MUSCLES BASED ON PATH
    if (goal === "Endurance") {
      targetMuscles = ["Cardio", "Full Body"];
    } else if (goal === "Powerlifting") {
      targetMuscles = sbdFocus === "All" ? ["Chest", "Legs", "Back"] : [sbdFocus];
    } else if (split === "Push Pull Legs") {
      if (subSplit === "Push") targetMuscles = pushParts;
      if (subSplit === "Pull") targetMuscles = pullParts;
      if (subSplit === "Legs") targetMuscles = legParts;
    } else if (split === "Arnold Split") {
      targetMuscles = parts; // Single part selected
    } else if (split === "Upper Lower") {
      targetMuscles = subSplit === "Upper" ? upperParts : lowerParts;
    } else if (split === "Full Body") {
      targetMuscles = bodyParts;
    } else if (split === "Custom") {
      targetMuscles = parts;
    }

    // 2. FILTER EXERCISES
    let filtered = exercises.filter((ex) => {
      // Filter by location (mock logic: if home, exclude 'machine'/'barbell' unless specified)
      if (location === "Home" && (ex.name.includes("Machine") || ex.name.includes("Cable"))) {
        return false;
      }

      // Filter by muscle
      const matchesMuscle = targetMuscles.some((m) =>
        ex.muscle.toLowerCase().includes(m.toLowerCase())
      );

      // Filter by level (If Upper/Lower, use specific part level. Else use overall)
      let requiredLevel = overallLevel;
      if (split === "Upper Lower" && partLevels[ex.muscle]) {
        requiredLevel = partLevels[ex.muscle];
      }

      // For simplicity in the mock, we slightly favor matching levels but don't strictly exclude
      return matchesMuscle;
    });

    // Fallback if filtering is too strict
    if (filtered.length === 0) {
      filtered = [...exercises].sort(() => Math.random() - 0.5).slice(0, 6);
    }

    // 3. SHUFFLE & LIMIT
    const unique = filtered.filter((ex, i, self) => i === self.findIndex((e) => e.id === ex.id));
    const selected = [...unique].sort(() => Math.random() - 0.5).slice(0, split === "Full Body" ? 8 : 6);

    // 4. MAP REPS/SETS BASED ON GOAL
    return selected.map((exercise) => {
      let sets = 3;
      let reps = "10-12";
      let rest = "60s";

      if (goal === "Fat Loss") { sets = 4; reps = "15-20"; rest = "45s"; }
      if (goal === "Muscle Gain") { sets = 4; reps = "8-12"; rest = "90s"; }
      if (goal === "Strength") { sets = 5; reps = "4-6"; rest = "120s"; }
      if (goal === "Endurance") { sets = 3; reps = "20+"; rest = "30s"; }
      if (goal === "Powerlifting") { sets = 5; reps = "1-5"; rest = "180s"; }

      return { ...exercise, sets, reps, rest };
    });
  }, [currentScreen, location, goal, split, subSplit, parts, sbdFocus, cardioType, overallLevel, partLevels]);

  // --- RENDER HELPERS ---
  const totalSteps = goal === "Endurance" || goal === "Powerlifting" || split === "Full Body" ? 5 : 6;
  const progressPercent = (history.length / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      {/* HEADER */}
      <div className="space-y-2">
        <p className="text-xs neon-text font-bold tracking-[0.2em] uppercase flex items-center gap-2">
          <Brain className="size-4" /> RFS Akhada AI Engine
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">
          Workout Generator
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl">
          Calibrate your training matrix. Our AI will formulate a customized blueprint based on your environment, objectives, and physiological level.
        </p>
      </div>

      {/* DYNAMIC PROGRESS BAR */}
      <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-neon transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--neon),0.8)]"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      {/* DYNAMIC VIEWPORT */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/5"
          >
            {/* SCREEN: LOCATION */}
            {currentScreen === "LOCATION" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">Training Environment</h2>
                  <p className="text-sm text-muted-foreground mt-1">Where will you be executing this workout?</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {locations.map((loc) => (
                    <Pill key={loc} active={location === loc} onClick={() => setLocation(loc)}>
                      {loc} Environment
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: GOAL */}
            {currentScreen === "GOAL" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">Primary Objective</h2>
                  <p className="text-sm text-muted-foreground mt-1">What is the main focus of your training block?</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {goals.map((g) => (
                    <Pill key={g} active={goal === g} onClick={() => setGoal(g)}>
                      {g}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: SPLIT */}
            {currentScreen === "SPLIT" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">Training Split</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select your preferred architectural setup.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {splits.map((s) => (
                    <Pill key={s} active={split === s} onClick={() => setSplit(s)}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: SUB_SPLIT (Dynamic based on Split) */}
            {currentScreen === "SUB_SPLIT" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">
                    {split === "Custom" ? "Target Muscles" : "Focus Selection"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {split === "Arnold Split" && "Select a single body part for today's Arnold block."}
                    {split === "Push Pull Legs" && "Select your PPL day."}
                    {split === "Upper Lower" && "Are we hitting Upper or Lower today?"}
                    {split === "Custom" && "Select all the muscles you want to obliterate."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {split === "Push Pull Legs" && ["Push", "Pull", "Legs"].map((s) => (
                    <Pill key={s} active={subSplit === s} onClick={() => setSubSplit(s)}>Day: {s}</Pill>
                  ))}

                  {split === "Upper Lower" && ["Upper", "Lower"].map((s) => (
                    <Pill key={s} active={subSplit === s} onClick={() => setSubSplit(s)}>{s} Body</Pill>
                  ))}

                  {(split === "Arnold Split" || split === "Custom") && bodyParts.map((part) => (
                    <Pill key={part} active={parts.includes(part)} onClick={() => togglePart(part)}>
                      {part}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: SBD (Powerlifting Path) */}
            {currentScreen === "SBD" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">Powerlifting Focus</h2>
                  <p className="text-sm text-muted-foreground mt-1">Which major lift are we prioritizing?</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["Squat", "Bench", "Deadlift", "All"].map((s) => (
                    <Pill key={s} active={sbdFocus === s} onClick={() => setSbdFocus(s)}>
                      {s === "All" ? "Full SBD Day" : `${s} Focus`}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: CARDIO (Endurance Path) */}
            {currentScreen === "CARDIO" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">Endurance Modality</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select your cardiovascular engine.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["HIIT", "LISS", "Sprint Intervals", "Athletic Conditioning"].map((c) => (
                    <Pill key={c} active={cardioType === c} onClick={() => setCardioType(c)}>
                      {c}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: LEVEL */}
            {currentScreen === "LEVEL" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">Physiological Level</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {split === "Upper Lower"
                      ? "Set the proficiency level for each specific muscle group."
                      : "Define your current overall proficiency."}
                  </p>
                </div>

                {split === "Upper Lower" ? (
                  <div className="space-y-4">
                    {(subSplit === "Upper" ? upperParts : lowerParts).map((part) => (
                      <div key={part} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-background/50 border border-white/5">
                        <span className="font-medium text-lg min-w-[120px]">{part}</span>
                        <div className="flex flex-wrap gap-2">
                          {levels.map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => updatePartLevel(part, lvl)}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${partLevels[part] === lvl
                                ? "bg-neon text-black font-semibold shadow-md"
                                : "bg-surface text-muted-foreground hover:bg-surface-elevated"
                                }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {levels.map((lvl) => (
                      <Pill key={lvl} active={overallLevel === lvl} onClick={() => setOverallLevel(lvl)}>
                        {lvl} Protocol
                      </Pill>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SCREEN: RESULTS */}
            {currentScreen === "RESULTS" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="p-3 bg-neon/10 rounded-xl">
                    <Brain className="size-8 text-neon" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Generated Matrix
                    </h2>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      {location} <span className="w-1 h-1 rounded-full bg-border" />
                      {goal} <span className="w-1 h-1 rounded-full bg-border" />
                      {goal === "Powerlifting" ? sbdFocus : goal === "Endurance" ? cardioType : split}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {generatedWorkout.map((exercise, index) => {
                    const alternativeExercises =
                      exercise.alternatives
                        ?.map((altId: number) =>
                          exercises.find((e) => e.id === altId)
                        )
                        .filter(Boolean) || [];

                    return (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-background/40 hover:bg-background/60 transition-colors border border-white/5 rounded-2xl p-5"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-surface-elevated border border-white/10 flex items-center justify-center font-display font-bold text-muted-foreground">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground text-lg">{exercise.name}</h3>
                              <p className="text-xs text-neon uppercase tracking-wider font-semibold">
                                {exercise.muscle} • {exercise.level}
                              </p>
                              {alternativeExercises.length > 0 && (
                                <button
                                  onClick={() => toggleAlternatives(exercise.id)}
                                  className="mt-3 flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300 transition-all"
                                >
                                  <Repeat className="size-3.5" />
                                  Alternative Exercises
                                  {openAlternatives[exercise.id]
                                    ? <ChevronUp className="size-3.5" />
                                    : <ChevronDown className="size-3.5" />
                                  }
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 bg-surface px-6 py-3 rounded-xl border border-white/5">
                            <div className="text-center">
                              <div className="font-black text-xl text-foreground">{exercise.sets}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Sets</div>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="text-center">
                              <div className="font-black text-xl text-foreground">{exercise.reps}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Reps</div>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="text-center">
                              <div className="font-black text-xl text-neon">{exercise.rest}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Rest</div>
                            </div>
                          </div>
                        </div>

                        {openAlternatives[exercise.id] &&
                          alternativeExercises.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-2"
                            >
                              {alternativeExercises.map((alt: any) => (
                                <div
                                  key={alt.id}
                                  className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <p className="font-semibold text-orange-300">
                                        {alt.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {alt.muscle} • {alt.level} • {alt.equipment}
                                      </p>
                                    </div>
                                    <Repeat className="size-4 text-orange-400" />
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER CONTROLS */}


      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          disabled={history.length === 1}
          className="w-32 bg-transparent"
        >
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>

        {currentScreen !== "RESULTS" ? (
          <Button
            size="lg"
            onClick={handleNext}
            className="w-40 bg-neon text-black hover:bg-neon/90 font-bold shadow-[0_0_20px_rgba(var(--neon),0.3)]"
          >
            {currentScreen === "LEVEL" ? (
              <>Generate <Brain className="ml-2 size-4" /></>
            ) : (
              <>Next <ArrowRight className="ml-2 size-4" /></>
            )}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={saveWorkout}
            className="w-48 bg-white text-black hover:bg-gray-200 font-bold"
          >
            {saveSuccess ? (
              <>
                <Check className="mr-2 size-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Workout
              </>
            )}
          </Button>
        )}
      </div>
            {/* SAVED WORKOUTS */}

        {savedWorkouts.length > 0 && (

          <div className="glass rounded-3xl p-6 space-y-5">

            <div className="flex items-center gap-3">

              <Calendar className="size-6 text-neon" />

              <div>

                <h2 className="text-2xl font-display font-bold">
                  Saved Workouts
                </h2>

                <p className="text-sm text-muted-foreground">
                  Your stored workout plans
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {savedWorkouts.map((workout) => (

                <div
                  key={workout.id}
                  className="rounded-2xl border border-white/5 bg-background/40 p-5"
                >

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div>

                      <h3 className="font-bold text-lg">
                        {workout.name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {workout.date}
                      </p>

                    </div>

                    <button
                      onClick={() => deleteWorkout(workout.id)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>

                  </div>

                  <div className="mt-4 grid gap-3">

                    {workout.exercises.map((exercise: any) => (

                      <div
                        key={exercise.id}
                        className="rounded-xl bg-surface px-4 py-3 border border-white/5"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <div>

                            <p className="font-semibold">
                              {exercise.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {exercise.muscle}
                            </p>

                          </div>

                          <div className="text-sm text-neon font-bold">
                            {exercise.sets} × {exercise.reps}
                          </div>

                        </div>

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
