import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
    }

    // Extract video ID from URL (handles different formats like youtu.be, youtube.com/watch?v=, shorts)
    let videoId = "";
    try {
      const url = new URL(videoUrl);
      if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.slice(1);
      } else if (url.hostname.includes("youtube.com")) {
        if (url.pathname.includes("/shorts/")) {
          videoId = url.pathname.split("/shorts/")[1];
        } else {
          videoId = url.searchParams.get("v") || "";
        }
      }
    } catch (e) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    if (!videoId) {
      return NextResponse.json({ error: "Could not extract Video ID from URL" }, { status: 400 });
    }

    // Fetch transcript
    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (error: any) {
      console.error("Transcript Error:", error.message);
      return NextResponse.json({ 
        error: "Could not fetch transcript for this video. It may not have captions enabled." 
      }, { status: 400 });
    }

    // Combine transcript pieces into one block of text (limit length to save tokens/costs)
    let fullText = transcriptItems.map((item) => item.text).join(" ");
    
    // Trim to ~15,000 chars max to guarantee it stays under Groq's token limits
    if (fullText.length > 15000) {
      fullText = fullText.slice(0, 15000) + "... [TRUNCATED]";
    }

    const systemPrompt = `You are an expert content summarizer. You will be provided with the auto-generated transcript of a YouTube video.
Your task is to provide a comprehensive, well-structured summary of the video.

Formatting requirements:
- Use markdown.
- Start with a brief 2-3 sentence overview.
- Use bullet points for the main takeaways or key topics discussed.
- Make it easy to scan and read.
- Ignore generic intro/outro filler text (e.g. "don't forget to subscribe").`;

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
              { role: 'user', parts: [{ text: systemPrompt + "\n\nVideo Transcript:\n" + fullText }] }
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
        messages: [{ role: "user", content: systemPrompt + "\n\nVideo Transcript:\n" + fullText }],
        model: "llama-3.1-8b-instant", // Groq fallback model (has higher free tier limits)
      });
      textResult = completion.choices[0]?.message?.content || "";
    }

    return NextResponse.json({ summary: textResult });
  } catch (error: any) {
    console.error("AI YouTube error (Groq/Fallback failed):", error);
    let errorMessage = error.message || "Failed to generate summary";
    
    // Check if it's a Groq limit error, and if so, append a note about Gemini
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
