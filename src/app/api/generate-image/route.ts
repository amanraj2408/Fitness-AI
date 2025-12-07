import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

type ImageBody = {
  prompt: string
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN
    if (!token) {
      throw new Error("REPLICATE_API_TOKEN is not configured")
    }

    const { prompt } = (await req.json()) as ImageBody

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      )
    }

    const replicate = new Replicate({ auth: token })

    const finalPrompt = `High quality, realistic image of: ${prompt}. Fitness / food theme, well lit, professional look.`

    // Replace with exact model+version from your Replicate dashboard
    const output = (await replicate.run(
      "black-forest-labs/flux-1-schnell:PUT_VERSION_HASH_HERE",
      {
        input: { prompt: finalPrompt },
      },
    )) as string[] | string

    const imageUrl =
      Array.isArray(output) && output.length > 0 ? output[0] : String(output)

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error("IMAGE_API_ERROR", error)
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    )
  }
}
