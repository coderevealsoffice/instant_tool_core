import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, aiMode } = await req.json()
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // 100% Free AI Tool usage for all users (No credit paywall)
    try {
      await prisma.aIUsageLog.create({
        data: {
          userId: session.user.id,
          feature: aiMode.toUpperCase(),
          promptTokens: Math.ceil(content.length / 4),
          completionTokens: 0
        }
      })
    } catch {
      // Non-blocking telemetry
    }

    // Generate AI response
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    
    let prompt = ""
    if (aiMode === "summary") {
      prompt = `Summarize the following text clearly and concisely:\n\n${content}`
    } else if (aiMode === "seo") {
      prompt = `Generate a highly optimized SEO Title (max 60 chars) and Meta Description (max 160 chars) for the following content. Return it in a clean format:\n\n${content}`
    } else if (aiMode === "grammar") {
      prompt = `Fix all grammatical errors and typos in the following text, making it sound professional and fluent. Only return the corrected text, nothing else:\n\n${content}`
    } else {
      prompt = `Process this text:\n\n${content}`
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    })

    return NextResponse.json({ result: response.text })
  } catch (error: any) {
    console.error("AI processing error:", error)
    return NextResponse.json({ error: "Failed to process content with AI" }, { status: 500 })
  }
}
