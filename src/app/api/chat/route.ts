
import { type NextRequest, NextResponse } from "next/server"

const WEBHOOK_URL = process.env.N8N_URI || ""

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Sending request to webhook:", WEBHOOK_URL)
    console.log("Request payload:", { message, user: "Rayudu Bharani" })

    // Send request to your webhook
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Bharani-AI-Assistant/1.0",
      },
      body: JSON.stringify({
        message: message,
        user: "Rayudu Bharani",
        timestamp: new Date().toISOString(),
      }),
    })

    console.log("[v0] Webhook response status:", response.status)
    console.log("[v0] Webhook response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Webhook error response body:", errorText)

      if (response.status === 404) {
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.message && errorData.message.includes("not registered")) {
            return NextResponse.json(
              {
                error: "webhook_not_active",
                response:
                  "🔧 Your n8n webhook needs to be activated first!\n\n**To fix this:**\n1. Go to your n8n workflow\n2. Click the 'Execute workflow' button\n3. Then try sending your message again\n\n*Note: Test webhooks in n8n only work for one call after activation.*",
              },
              { status: 200 },
            ) // Return 200 so the UI can display the helpful message
          }
        } catch (parseError) {
          // If we can't parse the error, fall through to generic error
        }
      }

      throw new Error(`Webhook responded with status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Webhook response data:", data.output || data)

    let aiResponse = ""

    if (Array.isArray(data) && data.length > 0 && data[0].output) {
      // Handle array response with output field
      aiResponse = data[0].output
    } else if (data.output) {
      // Handle object response with output field
      aiResponse = data.output
    } else if (typeof data === "string") {
      aiResponse = data
    } else if (data.response) {
      aiResponse = data.response
    } else if (data.message) {
      aiResponse = data.message
    } else if (data.text) {
      aiResponse = data.text
    } else {
      // Fallback: stringify the response if structure is unknown
      aiResponse = JSON.stringify(data, null, 2)
    }

    const cleanResponse = aiResponse
      .replace(/[👋📧🗓️]/gu, "") // Remove common emojis
      .trim()

    return NextResponse.json({
      response: cleanResponse || "I received your message but couldn't generate a proper response.",
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: "Failed to process your request",
        response: "Sorry, I'm having trouble connecting to my AI service right now. Please try again later.",
      },
      { status: 500 },
    )
  }
}
