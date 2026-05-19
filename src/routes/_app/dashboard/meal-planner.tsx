import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Utensils } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard/meal-planner")({
  head: () => ({ meta: [{ title: "AI Meal Planner" }] }),
  component: MealPlanner,
});

const diets = ["Vegetarian", "Vegan", "Non-Veg", "Hostel Diet", "Budget"];
const goalsList = ["Fat Loss", "Maintenance", "Muscle Gain"];

const meals = [
  { meal: "Breakfast", food: "Oats, banana, peanut butter, whey", kcal: 540, p: 38, c: 62, f: 16 },
  { meal: "Lunch", food: "Grilled chicken, rice, mixed veg", kcal: 720, p: 52, c: 80, f: 18 },
  { meal: "Snack", food: "Greek yogurt, almonds, berries", kcal: 320, p: 22, c: 28, f: 12 },
  { meal: "Dinner", food: "Salmon, sweet potato, salad", kcal: 680, p: 48, c: 60, f: 22 },
];

function MealPlanner() {
  const [diet, setDiet] = useState(diets[2]);
  const [goal, setGoal] = useState(goalsList[2]);
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <p className="text-xs neon-text font-bold tracking-widest">AI MEAL PLANNER</p>
        <h1 className="text-3xl font-display font-bold">Today's Meals</h1>
      </div>
      <div className="glass rounded-2xl p-6 flex flex-wrap gap-4">
        <div>
          <label className="text-xs uppercase text-muted-foreground tracking-widest">Diet</label>
          <select value={diet} onChange={e=>setDiet(e.target.value)} className="block mt-1 px-4 py-2 rounded-lg bg-surface-elevated border border-border">{diets.map(d=><option key={d}>{d}</option>)}</select>
        </div>
        <div>
          <label className="text-xs uppercase text-muted-foreground tracking-widest">Goal</label>
          <select value={goal} onChange={e=>setGoal(e.target.value)} className="block mt-1 px-4 py-2 rounded-lg bg-surface-elevated border border-border">{goalsList.map(d=><option key={d}>{d}</option>)}</select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {meals.map(m => (
          <div key={m.meal} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2"><Utensils className="size-4 text-neon" /><h3 className="font-display font-bold">{m.meal}</h3></div>
            <p className="text-sm text-muted-foreground">{m.food}</p>
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              {[["kcal", m.kcal], ["P", `${m.p}g`], ["C", `${m.c}g`], ["F", `${m.f}g`]].map(([l,v]) => (
                <div key={l as string} className="rounded-lg bg-surface-elevated py-2">
                  <div className="text-xs text-muted-foreground">{l}</div>
                  <div className="font-bold neon-text">{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
