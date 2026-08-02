import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert podcast producer and copywriter.
Your task is to take a podcast topic, summary, or rough transcript excerpt, and generate professional, engaging show notes.

Output MUST be a valid JSON object. Do not include markdown code blocks or any other text. Just the JSON object.
Format:
{
  "title": "A catchy, click-worthy title for the episode",
  "summary": "A compelling 2-3 paragraph summary of what the episode covers.",
  "takeaways": [
    "Key takeaway 1...",
    "Key takeaway 2...",
    "Key takeaway 3..."
  ],
  "timestamps": [
    { "time": "00:00", "description": "Introduction and welcome" },
    { "time": "04:15", "description": "The main topic discussed" },
    { "time": "12:30", "description": "Key strategy revealed" }
  ]
}
Generate realistic, estimated timestamps based on standard podcast pacing. Make sure there are at least 5-6 timestamps.
`;

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
              { role: 'user', parts: [{ text: systemPrompt + "\n\nPodcast Topic/Transcript: " + topic }] }
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
        messages: [{ role: "user", content: systemPrompt + "\n\nPodcast Topic/Transcript: " + topic }],
        model: "llama-3.1-8b-instant",
      });
      textResult = completion.choices[0]?.message?.content || "";
    }

    let jsonStr = textResult.trim();
    if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/```/g, "").trim();
    }

    let parsedResult = null;
    try {
        parsedResult = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON:", jsonStr);
        throw new Error("AI returned invalid JSON format.");
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error("AI Podcast Notes error:", error);
    let errorMessage = error.message || "Failed to generate podcast show notes";
    
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
