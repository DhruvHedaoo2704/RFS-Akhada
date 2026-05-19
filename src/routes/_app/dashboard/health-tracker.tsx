import { createFileRoute } from "@tanstack/react-router";
import { foodDatabase } from "@/lib/food-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,} from "recharts";
import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_app/dashboard/health-tracker"
)({
  head: () => ({
    meta: [{ title: "Health Tracker" }],
  }),
  component: HealthTracker,
});

function HealthTracker() {
  // =========================
  // LOAD DATA
  // =========================

  const [healthData, setHealthData] = useState(() => {
    const saved = localStorage.getItem("healthTracker");

    return saved
      ? JSON.parse(saved)
      : {
          profile: {
            weight: 78,
            height: 178,
            age: 21,
            activity: 1.55,
            goal: "muscle gain",
          },

          daily: {
            water: 2.5,
            sleep: 7.5,
            workouts: 1,
          },

          nutritionLogs: [
            {
              food: "Whey Protein",
              kcal: 180,
              protein: 32,
              carbs: 6,
              fat: 3,
            },
          ],
        };
  });

  // =========================
  // SAVE TO LOCAL STORAGE
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "healthTracker",
      JSON.stringify(healthData)
    );
  }, [healthData]);

  // =========================
  // EDIT MODE
  // =========================

  const [editMode, setEditMode] = useState(false);

  // =========================
  // PROFILE
  // =========================

  const { profile, daily, nutritionLogs } =
    healthData;

  // =========================
  // CALCULATIONS
  // =========================

  const bmi =
    profile.weight /
    Math.pow(profile.height / 100, 2);

  const bmr =
    10 * profile.weight +
    6.25 * profile.height -
    5 * profile.age +
    5;

  const maintenanceCalories = Math.round(
    bmr * profile.activity
  );

  let targetCalories = maintenanceCalories;

  if (profile.goal === "fat loss") {
    targetCalories = maintenanceCalories - 500;
  }

  if (profile.goal === "muscle gain") {
    targetCalories = maintenanceCalories + 300;
  }

  if (profile.goal === "strength") {
    targetCalories = maintenanceCalories + 200;
  }

  if (profile.goal === "powerlifting") {
    targetCalories = maintenanceCalories + 400;
  }

  if (profile.goal === "athletic") {
    targetCalories = maintenanceCalories + 250;
  }

  let proteinMultiplier = 2;

  if (profile.goal === "fat loss") {
    proteinMultiplier = 2.2;
  }

  if (profile.goal === "muscle gain") {
    proteinMultiplier = 2;
  }

  if (profile.goal === "strength") {
    proteinMultiplier = 2.1;
  }

  const proteinGoal = Math.round(
    profile.weight * proteinMultiplier
  );

  const waterGoal = (
    profile.weight * 0.033
  ).toFixed(1);

  // =========================
  // NUTRITION TOTALS
  // =========================

  const totals = nutritionLogs.reduce(
    (acc: any, item: any) => ({
      kcal: acc.kcal + item.kcal,
      protein:
        acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );

  // =========================
  // FOOD INPUTS
  // =========================

  const [foodSearch, setFoodSearch] = useState("");
  const [selectedFood, setSelectedFood] =
    useState<any>(null);

  const [quantity, setQuantity] = useState(100);

  const [showCustomFood, setShowCustomFood] =
    useState(false);
    
  const [customFood, setCustomFood] =
    useState({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
    });

  const filteredFoods = foodDatabase.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(foodSearch.toLowerCase())
  );

  // =========================
  // ADD FOOD
  // =========================

  const addFood = () => {
    if (!selectedFood) return;

    const multiplier = quantity / 100;

    const newFood = {
      food: selectedFood.name,

      kcal: Math.round(
        selectedFood.calories * multiplier
      ),

      protein: Math.round(
        selectedFood.protein * multiplier
      ),

      carbs: Math.round(
        selectedFood.carbs * multiplier
      ),

      fat: Math.round(
        selectedFood.fat * multiplier
      ),

      fiber: Math.round(
        selectedFood.fiber * multiplier
      ),

      sugar: Math.round(
        selectedFood.sugar * multiplier
      ),

      sodium: Math.round(
        selectedFood.sodium * multiplier
      ),

      calcium: Math.round(
        selectedFood.calcium * multiplier
      ),

      iron: Math.round(
        selectedFood.iron * multiplier
      ),

      quantity,
    };

    setHealthData({
      ...healthData,

      nutritionLogs: [
        ...nutritionLogs,
        newFood,
      ],
    });

    // RESET UI AFTER ADDING

    setFoodSearch("");

    setSelectedFood(null);

    setQuantity(100);

    toast.success(
      `${selectedFood.name} added successfully`
    );
  };


  const addCustomFood = () => {
    if (!customFood.name) return;

    const newFood = {
      food: customFood.name,

      kcal: Number(customFood.calories),

      protein: Number(customFood.protein),

      carbs: Number(customFood.carbs),

      fat: Number(customFood.fat),

      fiber: Number(customFood.fiber),

      sugar: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,

      quantity: 100,
    };

    setHealthData({
      ...healthData,

      nutritionLogs: [
        ...nutritionLogs,
        newFood,
      ],
    });

    toast.success(
      `${customFood.name} added successfully`
    );

    // RESET FORM

    setCustomFood({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
    });

    setCustomFood({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
    });

    setShowCustomFood(false);

    setFoodSearch("");
  };


  // =========================
  // DELETE FOOD
  // =========================

  const deleteFood = (index: number) => {
    const updated =
      nutritionLogs.filter(
        (_: any, i: number) =>
          i !== index
      );

    setHealthData({
      ...healthData,
      nutritionLogs: updated,
    });
  };

  // =========================
  // PROFILE UPDATE
  // =========================

  const updateProfile = (
    field: string,
    value: any
  ) => {
    setHealthData({
      ...healthData,

      profile: {
        ...profile,
        [field]: Number(value),
      },
    });
  };

  // =========================
  // CHART DATA
  // =========================

  const weeklyData = [
    { day: "Mon", calories: 2200 },
    { day: "Tue", calories: 2400 },
    { day: "Wed", calories: 2100 },
    { day: "Thu", calories: 2600 },
    { day: "Fri", calories: 2300 },
    { day: "Sat", calories: 2500 },
    { day: "Sun", calories: 2250 },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs neon-text font-bold tracking-widest">
            HEALTH TRACKER
          </p>

          <h1 className="text-3xl font-display font-bold">
            Daily Fitness Intelligence
          </h1>
        </div>

        <button
          onClick={() =>
            setEditMode(!editMode)
          }
          className="bg-neon text-black px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
        >
          {editMode ? (
            <>
              <Save className="size-4" />
              Save
            </>
          ) : (
            <>
              <Pencil className="size-4" />
              Edit
            </>
          )}
        </button>
      </div>

      {/* PROFILE SECTION */}

      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-bold mb-4">
          Profile & Goals
        </h3>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              label: "Weight",
              field: "weight",
              value: profile.weight,
            },

            {
              label: "Height",
              field: "height",
              value: profile.height,
            },

            {
              label: "Age",
              field: "age",
              value: profile.age,
            },
          ].map((item) => (
            <div key={item.field}>
              <label className="text-xs uppercase text-muted-foreground">
                {item.label}
              </label>

              <input
                type="number"
                value={item.value}
                disabled={!editMode}
                onChange={(e) =>
                  updateProfile(
                    item.field,
                    e.target.value
                  )
                }
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10"
              />
            </div>
          ))}

          <div>
            <label className="text-xs uppercase text-muted-foreground">
              Activity
            </label>

            <select
              disabled={!editMode}
              value={profile.activity}
              onChange={(e) =>
                updateProfile(
                  "activity",
                  e.target.value
                )
              }
              className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10"
            >
              <option value={1.2}>
                Sedentary
              </option>

              <option value={1.375}>
                Light
              </option>

              <option value={1.55}>
                Moderate
              </option>

              <option value={1.725}>
                Active
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase text-muted-foreground">
              Goal
            </label>

            <select
              disabled={!editMode}
              value={profile.goal}
              onChange={(e) =>
                setHealthData({
                  ...healthData,

                  profile: {
                    ...profile,
                    goal: e.target.value,
                  },
                })
              }
              className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10"
            >
              <option value="fat loss">
                Fat Loss
              </option>

              <option value="muscle gain">
                Muscle Gain
              </option>

              <option value="maintenance">
                Maintenance
              </option>

              <option value="strength">
                Strength
              </option>

              <option value="powerlifting">
                Powerlifting
              </option>

              <option value="athletic">
                Athletic Performance
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* METRICS */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "BMI",
            value: bmi.toFixed(1),
          },

          {
            label: "Maintenance",
            value: `${targetCalories} kcal`,
          },

          {
            label: "Protein Goal",
            value: `${proteinGoal} g`,
          },

          {
            label: "Water Goal",
            value: `${waterGoal} L`,
          },

          {
            label: "Calories",
            value: `${totals.kcal} / ${targetCalories}`,
          },

          {
            label: "Protein",
            value: `${totals.protein} / ${proteinGoal}g`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="glass rounded-2xl p-5"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {card.label}
            </div>

            <div className="text-2xl font-display font-bold neon-text mt-2">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* FOOD LOGGER */}

      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-bold mb-4">
          Nutrition Tracker
        </h3>

        <div className="space-y-4">
          {/* SEARCH */}

          <div>
            <input
              type="text"
              value={foodSearch}
              onChange={(e) =>
                setFoodSearch(e.target.value)
              }
              placeholder="Search food..."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
            />
          </div>

          {/* SEARCH RESULTS */}

          {foodSearch && (
            <div className="glass rounded-xl p-2 max-h-52 overflow-y-auto">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedFood(item);
                      setFoodSearch(item.name);
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="font-semibold">
                      {item.name}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {item.calories} kcal ·{" "}
                      {item.protein}g protein
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3">
                  <p className="text-sm text-muted-foreground">
                    Food not found
                  </p>

                  <button
                    onClick={() =>
                      setShowCustomFood(true)
                    }
                    className="mt-2 text-neon text-sm font-semibold"
                  >
                    + Add Custom Food
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CUSTOM FOOD MODAL */}

            {showCustomFood && (
              <div className="glass rounded-2xl p-6 mt-4 border border-white/10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold">
                    Add Custom Food
                  </h3>

                  <button
                    onClick={() =>
                      setShowCustomFood(false)
                    }
                    className="text-red-400"
                  >
                    Close
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Food Name",
                      field: "name",
                    },

                    {
                      label: "Calories",
                      field: "calories",
                    },

                    {
                      label: "Protein",
                      field: "protein",
                    },

                    {
                      label: "Carbs",
                      field: "carbs",
                    },

                    {
                      label: "Fat",
                      field: "fat",
                    },

                    {
                      label: "Fiber",
                      field: "fiber",
                    },
                  ].map((item) => (
                    <div key={item.field}>
                      <label className="text-xs uppercase text-muted-foreground">
                        {item.label}
                      </label>

                      <input
                        type={
                          item.field === "name"
                            ? "text"
                            : "number"
                        }
                        value={
                          customFood[
                            item.field as keyof typeof customFood
                          ]
                        }
                        onChange={(e) =>
                          setCustomFood({
                            ...customFood,

                            [item.field]:
                              e.target.value,
                          })
                        }
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={addCustomFood}
                  className="mt-6 w-full bg-neon text-black py-3 rounded-xl font-semibold"
                >
                  Add Custom Food
                </button>
              </div>
            )}

          {/* SELECTED FOOD */}

          {selectedFood && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg">
                    {selectedFood.name}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Per 100g
                  </p>
                </div>

                <div>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={2000}
                    onChange={(e) =>
                      setQuantity(
                        Number(e.target.value)
                      )
                    }
                    className="w-28 px-4 py-2 rounded-lg bg-black/40 border border-white/10"
                  />

                  <p className="text-xs mt-1 text-center text-muted-foreground">
                    grams
                  </p>
                </div>
              </div>

              {/* MICRONUTRIENTS */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                {[
                  [
                    "Calories",
                    selectedFood.calories,
                  ],

                  [
                    "Protein",
                    selectedFood.protein,
                  ],

                  [
                    "Carbs",
                    selectedFood.carbs,
                  ],

                  ["Fat", selectedFood.fat],

                  ["Fiber", selectedFood.fiber],

                  ["Sugar", selectedFood.sugar],

                  ["Calcium", selectedFood.calcium],

                  ["Iron", selectedFood.iron],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-black/30 rounded-xl p-3"
                  >
                    <p className="text-xs text-muted-foreground uppercase">
                      {label}
                    </p>

                    <p className="text-lg font-bold mt-1">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* ADD BUTTON */}

              <button
                onClick={addFood}
                className="mt-5 w-full bg-neon text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="size-4" />
                Add Food
              </button>
            </div>
          )}
        </div>

        {/* FOOD LIST */}

        <div className="space-y-3 mt-6">
          {nutritionLogs.map(
            (item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated"
              >
                <div>
                  <div className="font-semibold">
                    {item.food}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {item.kcal} kcal ·{" "}
                    {item.protein}g protein
                  </div>
                </div>

                <button
                  onClick={() =>
                    deleteFood(index)
                  }
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* CHART */}

      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-bold mb-4">
          Weekly Calorie Trend
        </h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient
                id="g1"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="oklch(0.92 0.22 130)"
                  stopOpacity={0.5}
                />

                <stop
                  offset="100%"
                  stopColor="oklch(0.92 0.22 130)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(1 0 0 / 0.05)"
            />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="calories"
              stroke="oklch(0.92 0.22 130)"
              fill="url(#g1)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}