
import { NextRequest, NextResponse } from "next/server"
import { getOpenAI } from "@/lib/openai"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const prompt = `
You are an expert AI fitness coach.

Create a JSON response only:

{
  "workout": "<html template for exercise plan>",
  "diet": "<html template for diet plan>",
  "tips": "string tips"
}

User Info:
Name: ${body.name}
Age: ${body.age}
Gender: ${body.gender}
Height: ${body.height} cm
Weight: ${body.weight} kg
Fitness Goal: ${body.goal}
Level: ${body.level}
Location: ${body.location}
Diet Preference: ${body.diet}
`

    const openai = getOpenAI()
    if (!openai) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      )
    }

    const completion = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: "Return ONLY valid JSON. No explanation." },
        { role: "user", content: prompt },
      ],
      max_output_tokens: 800,
    }) // Responses API with small model. [web:24][web:59][web:66]

    const content = completion.output_text
    console.log("OPENAI_RAW:", content)

    if (!content || !content.trim().startsWith("{")) {
      return NextResponse.json(
        { error: "Model did not return JSON", raw: content },
        { status: 500 }
      )
    }

    const json = JSON.parse(content)

    // quick sanity check for fields your UI expects
    if (!json.workout || !json.diet) {
      return NextResponse.json(
        { error: "Missing fields in JSON", raw: json },
        { status: 500 }
      )
    }

    return NextResponse.json(json)
  } catch (error) {
    console.error("PLAN_API_ERROR:", error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
