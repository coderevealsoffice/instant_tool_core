import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { context, question, history } = await req.json();

    if (!context || !question) {
      return NextResponse.json({ error: "Context and question are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock mode
      return NextResponse.json({
        answer: `(Mock Answer for testing) I see you asked: "${question}". Since the API key is not configured, this is a mock response based on your PDF context.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Limit context length if it's too large to prevent token explosion
    const truncatedContext = context.slice(0, 100000); // 100k characters is safe for 2.5-flash

    const systemPrompt = `You are an intelligent document assistant. You have been provided with the extracted text from a user's PDF document. 
Your goal is to accurately answer the user's questions based ONLY on the provided document context. If the answer is not contained within the document, say "I cannot find the answer to this in the provided document."

--- DOCUMENT CONTEXT START ---
${truncatedContext}
--- DOCUMENT CONTEXT END ---
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + question }] }
      ]
    });

    const answer = response.text || "";

    return NextResponse.json({ answer });

  } catch (error: any) {
    console.error("AI PDF Chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat" },
      { status: 500 }
    );
  }
}
