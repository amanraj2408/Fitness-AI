import { NextRequest, NextResponse } from "next/server"

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

if (!ELEVENLABS_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY is not set in .env.local")
}

type TtsBody = {
  text: string
  voiceId?: string
}

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = (await req.json()) as TtsBody

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 },
      )
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || DEFAULT_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      } as RequestInit,
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error("ELEVENLABS_ERROR", errText)
      return NextResponse.json(
        { error: "TTS request failed" },
        { status: 500 },
      )
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("TTS_API_ERROR", error)
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 },
    )
  }
}
