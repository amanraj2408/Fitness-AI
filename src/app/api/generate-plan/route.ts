import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"

type Plan = {
  workout: string
  diet: string
  tips: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name,
      age,
      gender,
      height,
      weight,
      goal,
      level,
      location,
      diet,
    } = body as {
      name: string
      age: string
      gender: string
      height: string
      weight: string
      goal: string
      level: string
      location: string
      diet: string
    }

    const userSummary = `
Name: ${name || "N/A"}
Age: ${age || "N/A"}
Gender: ${gender || "N/A"}
Height: ${height || "N/A"} cm
Weight: ${weight || "N/A"} kg
Goal: ${goal || "N/A"}
Level: ${level || "N/A"}
Location: ${location || "N/A"}
Diet: ${diet || "N/A"}
`.trim()

    const prompt = `
You are an expert fitness and nutrition coach.

User profile:
${userSummary}

Generate JSON ONLY with this exact shape (no extra text):

{
  "workout": "<html for workout>",
  "diet": "<html for diet>",
  "tips": "short motivational text"
}

- workout: 7-day workout plan in HTML (headings, bullet lists, sets, reps, rest).
- diet: 7-day diet plan in HTML (breakfast, lunch, dinner, snacks).
- tips: 2–3 motivational sentences.
`.trim()

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You output only valid JSON. No explanations." },
        { role: "user", content: prompt },
      ],
    })

    const content = completion.choices[0]?.message?.content ?? "{}"

    let plan: Plan
    try {
      plan = JSON.parse(content) as Plan
    } catch {
      // Fallback if model adds extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      plan = JSON.parse(jsonMatch?.[0] ?? "{}") as Plan
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("PLAN_API_ERROR", error)
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 },
    )
  }
}
