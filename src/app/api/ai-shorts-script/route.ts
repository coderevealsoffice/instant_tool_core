import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { topic, tone } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const selectedTone = tone || "Energetic";

    const systemPrompt = `You are an expert short-form video scriptwriter for TikTok, Instagram Reels, and YouTube Shorts.
Your task is to generate a highly engaging, fast-paced 60-second video script based on the provided topic.

Formatting Requirements:
- Write the script in a clear, easy-to-read format.
- Break it down into 3 strict sections: [HOOK] (0-3 seconds), [BODY] (The main value/story), and [CTA] (Call to Action).
- Include brief [Visual/B-Roll Cues] in brackets before or alongside the spoken text so the creator knows what to show on screen.
- The tone should be: ${selectedTone}.
- Do NOT include any filler or conversational text (like "Here is your script:"). Just output the script.

Example Format:
[HOOK]
[Visual: Quick zoom in on your face looking shocked]
"Stop scrolling! You're doing [Topic] all wrong."

[BODY]
[Visual: Show example A vs example B]
"Here is the secret nobody tells you..."

[CTA]
[Visual: Pointing down to the subscribe/follow button]
"Follow me for more tips like this!"`;

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

    return NextResponse.json({ script: textResult.trim() });
  } catch (error: any) {
    console.error("AI Shorts Script Generator error:", error);
    let errorMessage = error.message || "Failed to generate script";
    
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
