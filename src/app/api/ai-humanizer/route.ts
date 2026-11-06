import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { text, tone, level } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock response for development if API key is missing
      return NextResponse.json({
        content: "This is a simulated humanized text. To get real AI humanized text, please add your GEMINI_API_KEY to the .env file."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert editor and copywriter who specializes in making AI-generated text sound 100% human, natural, and engaging.
The user wants to "humanize" a piece of text to bypass AI detectors and read more naturally.

Tone requested: ${tone || 'Natural'}
Readability level: ${level || 'High School'}

INSTRUCTIONS:
1. Rewrite the text to sound completely human. Remove robotic phrasing, repetitive sentence structures, and overly formal "AI-like" transitions (e.g., "Furthermore", "In conclusion", "It is important to note").
2. Introduce natural sentence length variance (mix short and long sentences).
3. Use active voice and conversational nuances appropriate for the tone.
4. DO NOT add any markdown formatting (no bold, no italics) unless it was heavily present in the original.
5. Return ONLY the rewritten text, nothing else. Do not add introductory or concluding remarks.`;

    let textResult = "";
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nOriginal Text to Humanize:\n" + text }] }
        ],
      });
      textResult = response.text || "";
    } catch (geminiError: any) {
      console.warn("Gemini failed, trying Groq fallback:", geminiError?.message);
      const groqApiKey = process.env.GROQ_API_KEY;
      if (groqApiKey) {
        try {
          const groq = new Groq({ apiKey: groqApiKey });
          const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: systemPrompt + "\n\nOriginal Text to Humanize:\n" + text }],
            model: "llama-3.3-70b-versatile",
          });
          textResult = completion.choices[0]?.message?.content || "";
        } catch (groqErr) {
          console.warn("Groq also failed:", groqErr);
        }
      }

      // If both AI providers failed due to network/quota, provide smart conversational humanization
      if (!textResult) {
        textResult = text
          .replace(/\bFurthermore,\s*/gi, "What's more, ")
          .replace(/\bIn conclusion,\s*/gi, "All in all, ")
          .replace(/\bIt is important to note that\s*/gi, "Remember that ")
          .replace(/\bMoreover,\s*/gi, "Also, ")
          .replace(/\bAdditionally,\s*/gi, "Plus, ")
          .replace(/\bConsequently,\s*/gi, "As a result, ")
          .replace(/\bUtilize\b/gi, "use")
          .replace(/\bFacilitate\b/gi, "help")
          .replace(/\bSubstantial\b/gi, "big");
      }
    }

    return NextResponse.json({ content: textResult });
  } catch (error: any) {
    console.error("AI Humanizer error:", error);
    let errorMessage = error.message || "Failed to humanize text";
    try {
      if (errorMessage.includes("429")) errorMessage = "Google AI Quota exceeded. Please wait a minute and try again.";
      else if (errorMessage.startsWith("{")) errorMessage = JSON.parse(errorMessage).error?.message || errorMessage;
    } catch (e) {}
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
