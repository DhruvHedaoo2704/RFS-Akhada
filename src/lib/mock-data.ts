import strengthImg from "@/assets/program-strength.jpg";
import fatlossImg from "@/assets/program-fatloss.jpg";
import yogaImg from "@/assets/program-yoga.jpg";
import boxingImg from "@/assets/program-boxing.jpg";
import trainer1 from "@/assets/trainer-1.jpg";
import trainer2 from "@/assets/trainer-2.jpg";
import trainer3 from "@/assets/trainer-3.jpg";

export const programs = [
  { id: "desi-fat-loss", title: "Desi Fat Loss", desc: "Burn fat the Akhada way — lean, mean, ready.", image: fatlossImg, difficulty: "Intermediate", duration: "8 weeks" },
  { id: "muscle-gain", title: "Mass Badhao", desc: "Hypertrophy split built for the Indian physique.", image: strengthImg, difficulty: "Intermediate", duration: "12 weeks" },
  { id: "strength", title: "Pehlwani Strength", desc: "Raw power inspired by traditional Akhada training.", image: strengthImg, difficulty: "Advanced", duration: "10 weeks" },
  { id: "powerlifting", title: "Powerlifting Bharat", desc: "Squat, bench and deadlift mastery.", image: strengthImg, difficulty: "Advanced", duration: "16 weeks" },
  { id: "athletic", title: "Warrior Athletics", desc: "Speed, agility and explosive power.", image: boxingImg, difficulty: "Intermediate", duration: "8 weeks" },
  { id: "beginner", title: "Zero to Fit", desc: "Start strong with the fundamentals.", image: yogaImg, difficulty: "Beginner", duration: "6 weeks" },
];

export const trainers = [
  { id: "1", name: "Arjun Singh", spec: "Strength Coach", exp: "8+ years", rating: 4.9, image: trainer1 },
  { id: "2", name: "Priya Sharma", spec: "Yoga & Mobility", exp: "6+ years", rating: 4.8, image: trainer2 },
  { id: "3", name: "Kabir Chauhan", spec: "Hypertrophy", exp: "10+ years", rating: 5.0, image: trainer3 },
  { id: "4", name: "Rahul Verma", spec: "Powerlifting", exp: "9+ years", rating: 4.9, image: trainer1 },
  { id: "5", name: "Kavya Mehta", spec: "Nutrition Coach", exp: "5+ years", rating: 4.8, image: trainer2 },
  { id: "6", name: "Aman Yadav", spec: "Calisthenics", exp: "7+ years", rating: 4.7, image: trainer3 },
];

export const testimonials = [
  { name: "Rohan P.", role: "Lost 10 kg", text: "RFS Akhada ne meri training badal di. Recovery system zabardast hai." },
  { name: "Meera R.", role: "Powerlifter", text: "Best progressive overload tracker. Iss mahine 3 PRs hit kiye!" },
  { name: "Vikram K.", role: "Beginner", text: "Finally an app jo overwhelming nahi lagta. Streaks pyaar ho gaya." },
];

export const indianMeals = [
  { name: "Paneer Bhurji", protein: 22, carbs: 8, fat: 18, kcal: 290 },
  { name: "Dal Rice", protein: 14, carbs: 60, fat: 6, kcal: 360 },
  { name: "Roti Sabzi", protein: 10, carbs: 45, fat: 8, kcal: 290 },
  { name: "Poha", protein: 6, carbs: 40, fat: 5, kcal: 230 },
  { name: "Upma", protein: 7, carbs: 38, fat: 6, kcal: 240 },
  { name: "Idli Sambhar", protein: 8, carbs: 42, fat: 3, kcal: 230 },
  { name: "Chole Bhature", protein: 16, carbs: 60, fat: 22, kcal: 480 },
  { name: "Egg Bhurji", protein: 24, carbs: 4, fat: 18, kcal: 280 },
];

export const weeklyVolume = [
  { day: "Mon", volume: 4200, calories: 2100 },
  { day: "Tue", volume: 0, calories: 1800 },
  { day: "Wed", volume: 5100, calories: 2300 },
  { day: "Thu", volume: 3800, calories: 2050 },
  { day: "Fri", volume: 6200, calories: 2400 },
  { day: "Sat", volume: 2900, calories: 2200 },
  { day: "Sun", volume: 0, calories: 1900 },
];

export const strengthHistory = [
  { week: "W1", bench: 80, squat: 110, deadlift: 140 },
  { week: "W2", bench: 82.5, squat: 115, deadlift: 145 },
  { week: "W3", bench: 85, squat: 117.5, deadlift: 150 },
  { week: "W4", bench: 87.5, squat: 120, deadlift: 155 },
  { week: "W5", bench: 90, squat: 125, deadlift: 160 },
  { week: "W6", bench: 92.5, squat: 127.5, deadlift: 165 },
];



export const challenges = [
  { id: "1", name: "Akhada Strength Challenge", participants: 1240, days: 30, progress: 47 },
  { id: "2", name: "Desi Fat Loss Challenge", participants: 892, days: 21, progress: 62 },
  { id: "3", name: "Indian Warrior Transformation", participants: 511, days: 60, progress: 33 },
  { id: "4", name: "100 Dand Challenge", participants: 2104, days: 30, progress: 18 },
];

export const achievements = [
  { name: "Pehla Workout", unlocked: true, icon: "🔥" },
  { name: "7 Day Streak", unlocked: true, icon: "⚡" },
  { name: "30 Day Streak", unlocked: false, icon: "🏆" },
  { name: "First PR", unlocked: true, icon: "💪" },
  { name: "Beast Mode", unlocked: false, icon: "🦁" },
  { name: "Akhada Elite", unlocked: false, icon: "👑" },
];

export const exercises = [
  { name: "Push Up", muscle: "Chest", level: "Beginner", equipment: "Home" },
  { name: "Pull Up", muscle: "Back", level: "Intermediate", equipment: "Gym" },
  { name: "Squat", muscle: "Legs", level: "Beginner", equipment: "Home" },
  { name: "Deadlift", muscle: "Back", level: "Advanced", equipment: "Gym" },
  { name: "Bench Press", muscle: "Chest", level: "Intermediate", equipment: "Gym" },
];
