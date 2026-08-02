import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert YouTube SEO and marketing specialist.
Your task is to generate highly relevant, high-search-volume YouTube keywords (tags) for a given video topic or title.

Requirements:
- Return ONLY a comma-separated list of keywords.
- Do NOT include numbering, bullet points, introductory text, or concluding remarks.
- Do NOT wrap the keywords in quotes.
- Provide around 15-25 highly relevant keywords.
- Include a mix of broad, specific, and long-tail keywords.

Example Output:
baking cake, chocolate cake recipe, how to bake, best chocolate cake, easy cake recipe, baking for beginners, chocolate dessert`;

    // Try Gemini First
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    let textResult = "";
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
              { role: 'user', parts: [{ text: systemPrompt + "\n\nVideo Topic/Title: " + topic }] }
          ],
      });
      textResult = response.text || "";
    } catch (geminiError: any) {
      console.error("Gemini failed:", geminiError);
      console.warn("Trying Groq fallback...");
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) throw geminiError;
      
      const groq = new Groq({ apiKey: groqApiKey });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: systemPrompt + "\n\nVideo Topic/Title: " + topic }],
        model: "llama-3.1-8b-instant", // Groq fallback model
      });
      textResult = completion.choices[0]?.message?.content || "";
    }

    // Clean up the output just in case the AI included unexpected formatting
    const cleanedResult = textResult
        .replace(/^["'\s]+|["'\s]+$/g, "") // Trim quotes and whitespace from ends
        .replace(/\n/g, ", ") // Replace newlines with commas
        .replace(/,,+/g, ",") // Remove multiple commas
        .trim();

    return NextResponse.json({ keywords: cleanedResult });
  } catch (error: any) {
    console.error("AI YouTube Keyword Generator error:", error);
    let errorMessage = error.message || "Failed to generate keywords";
    
    if (errorMessage.includes("429") || errorMessage.includes("limit") || errorMessage.includes("413")) {
        errorMessage = "Google Gemini & Groq APIs are both rejecting the request (Rate Limit Exceeded). Please check your API keys or wait a minute.";
    } else if (errorMessage.startsWith("{")) {
        try {
            errorMessage = JSON.parse(errorMessage).error?.message || errorMessage;
        } catch(e) {}
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
