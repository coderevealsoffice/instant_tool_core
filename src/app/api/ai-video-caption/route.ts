import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { topic, tone = "engaging" } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are a viral social media manager specializing in Instagram Reels, TikTok, and YouTube Shorts.
Your task is to write a highly engaging, viral caption based on the user's topic and chosen tone.
Tone: ${tone}

Output MUST be a valid JSON object. Do not include markdown code blocks or any other text. Just the JSON object.
Format:
{
  "caption": "The full caption text. Start with a strong hook. Include emojis. End with a Call To Action (e.g., 'Save this for later', 'What do you think? Let me know below').",
  "hashtags": ["#viral", "#trending", "#yourniche"]
}
Make sure you provide exactly 5 to 10 highly relevant and trending hashtags. Include the # symbol in each hashtag.
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
              { role: 'user', parts: [{ text: systemPrompt + "\n\nTopic/Video Idea: " + topic }] }
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
        messages: [{ role: "user", content: systemPrompt + "\n\nTopic/Video Idea: " + topic }],
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
    console.error("AI Video Caption error:", error);
    let errorMessage = error.message || "Failed to generate video caption";
    
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
