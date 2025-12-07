import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN is not set in .env.local")
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: NextRequest) {
  try {
    const { prompt } = (await req.json()) as { prompt: string }

    const finalPrompt = `High quality, realistic image of: ${prompt}. Fitness / food theme, well lit, professional look.`

    const output = (await replicate.run(
      "black-forest-labs/flux-1-schnell:YOUR_VERSION_HASH_HERE",
      {
        input: {
          prompt: finalPrompt,
        },
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
