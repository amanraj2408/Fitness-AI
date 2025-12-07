"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import { Loader2, Play, Download } from "lucide-react"

type Plan = {
  workout: string
  diet: string
  tips: string
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    level: "",
    location: "",
    diet: "",
  })

  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<Plan | null>(null)

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to generate plan")

      const data = (await res.json()) as Plan
      setPlan(data)
    } catch (err) {
      console.error(err)
      setPlan({
        workout: "<p>Something went wrong generating the workout plan.</p>",
        diet: "<p>Something went wrong generating the diet plan.</p>",
        tips: "Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid gap-8 md:grid-cols-[1.2fr,1.6fr] items-start">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-900/70 border-slate-800 shadow-2xl backdrop-blur">
            <CardHeader className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400">
                AI FITNESS COACH
              </p>
              <CardTitle className="text-3xl font-bold">
                Build your <span className="text-pink-400">smart plan</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Fill your details and let AI design a personalized workout &
                diet routine for you.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-slate-900 border-slate-700"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className="bg-slate-900 border-slate-700"
                  />
                  <Input
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    className="bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Weight (kg)"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    className="bg-slate-900 border-slate-700"
                  />

                  <Select
                    onValueChange={(v) => handleChange("gender", v)}
                    value={formData.gender}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select
                  onValueChange={(v) => handleChange("goal", v)}
                  value={formData.goal}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Fitness Goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="general-fitness">
                      General Fitness
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(v) => handleChange("level", v)}
                  value={formData.level}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Current Fitness Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(v) => handleChange("location", v)}
                  value={formData.location}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Workout Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(v) => handleChange("diet", v)}
                  value={formData.diet}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Dietary Preference" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="veg">Veg</SelectItem>
                    <SelectItem value="non-veg">Non‑Veg</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating your plan...
                    </>
                  ) : (
                    "🚀 Generate My Plan"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-slate-900/60 border-slate-800 shadow-2xl backdrop-blur min-h-[320px]">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-xl">Your AI Plan</CardTitle>
                <CardDescription className="text-slate-400">
                  Workout, diet & motivation generated just for you.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="border-slate-700 bg-slate-900"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-slate-700 bg-slate-900"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 max-h-[460px] overflow-y-auto">
              {plan ? (
                <>
                  <p className="text-sm text-pink-300">{plan.tips}</p>
                  <div
                    className="prose prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: plan.workout }}
                  />
                  <div
                    className="prose prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: plan.diet }}
                  />
                </>
              ) : (
                <p className="text-sm text-slate-400">
                  Fill your details on the left and click{" "}
                  <span className="text-pink-400 font-semibold">
                    “Generate My Plan”
                  </span>{" "}
                  to see your personalized routine here.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
