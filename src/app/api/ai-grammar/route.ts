import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { text, tone } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock mode if no API key is provided
      return NextResponse.json({
        corrected: `(Mocked Correction for ${tone} tone): ${text}`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a professional copyeditor. Your task is to fix grammar, spelling, and punctuation errors in the user's text. 
    You must also adapt the writing to match the requested tone: ${tone}. 
    Return ONLY the corrected text, with no additional commentary, conversational filler, or markdown formatting around the output.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\nText to correct: " + text }] }
      ]
    });

    const corrected = response.text || "";

    return NextResponse.json({ corrected });

  } catch (error: any) {
    console.error("AI Grammar Check error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process text" },
      { status: 500 }
    );
  }
}
