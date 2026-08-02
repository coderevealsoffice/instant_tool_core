import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert YouTube strategist and thumbnail designer focusing on maximizing CTR (Click-Through Rate).
Your task is to generate exactly 3 highly engaging thumbnail concepts for the video topic provided.

Output MUST be a valid JSON array of objects. Do not include markdown code blocks or any other text. Just the JSON array.
Each object must have the following properties:
- "title": A catchy name for this thumbnail concept.
- "visuals": Detailed description of the main image, subject's facial expression, and composition.
- "text": The short, punchy text to write on the thumbnail (max 4 words). If no text, say "No text".
- "background": Description of the background and colors.
- "reasoning": Why this specific thumbnail will grab attention and get clicks (psychology/hook).

Example Output:
[
  {
    "title": "The Shock Factor",
    "visuals": "Close up of creator's face looking extremely shocked, holding the product.",
    "text": "DO NOT BUY THIS!",
    "background": "Dark blurred background with a bright red arrow pointing at the product.",
    "reasoning": "Creates high curiosity and a negative hook which drives higher CTR."
  }
]
`;

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
              { role: 'user', parts: [{ text: systemPrompt + "\n\nVideo Topic/Idea: " + topic }] }
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
        messages: [{ role: "user", content: systemPrompt + "\n\nVideo Topic/Idea: " + topic }],
        model: "llama-3.1-8b-instant", // Groq fallback model
      });
      textResult = completion.choices[0]?.message?.content || "";
    }

    // Clean JSON response (sometimes LLMs wrap in ```json ... ```)
    let jsonStr = textResult.trim();
    if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/```/g, "").trim();
    }

    let parsedIdeas = [];
    try {
        parsedIdeas = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON:", jsonStr);
        throw new Error("AI returned invalid JSON format.");
    }

    return NextResponse.json({ ideas: parsedIdeas });
  } catch (error: any) {
    console.error("AI Thumbnail Idea error:", error);
    let errorMessage = error.message || "Failed to generate thumbnail ideas";
    
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
