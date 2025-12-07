import OpenAI from "openai"

/**
 * Returns an OpenAI client if OPENAI_API_KEY is configured,
 * otherwise null so the caller can return a clear error.
 */
export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return null
  }

  return new OpenAI({ apiKey })
}
