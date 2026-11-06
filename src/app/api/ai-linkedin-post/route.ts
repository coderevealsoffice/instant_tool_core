import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are a top-tier LinkedIn ghostwriter and B2B marketer who specializes in creating viral, high-engagement content.
Your task is to take a topic and generate two things:
1. A Viral Text Post (with a strong hook, readable spacing/formatting, actionable advice, and a CTA).
2. A 5-slide Carousel Content Plan (Slide 1: Hook/Title, Slide 2-4: Core value/steps, Slide 5: CTA/Summary).

Output MUST be a valid JSON object. Do not include markdown code blocks or any other text. Just the JSON object.
Format:
{
  "post": "The full text of the LinkedIn post. Use \\n for line breaks to keep spacing airy and readable.",
  "carousel": [
    "Slide 1 text...",
    "Slide 2 text...",
    "Slide 3 text...",
    "Slide 4 text...",
    "Slide 5 text..."
  ]
}
`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    let textResult = "";
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nTopic: " + topic }] }
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
            messages: [{ role: "user", content: systemPrompt + "\n\nTopic: " + topic }],
            model: "llama-3.1-8b-instant",
          });
          textResult = completion.choices[0]?.message?.content || "";
        } catch (groqErr) {
          console.warn("Groq failed as well:", groqErr);
        }
      }

      if (!textResult) {
        textResult = JSON.stringify({
          postText: `Most people approach ${topic} the wrong way.\n\nHere is what 5 years of industry experience taught me about doing it right:\n\n1. Stop overcomplicating the fundamentals.\n2. Leverage automated tools for high-friction tasks.\n3. Iterate quickly based on real feedback.\n\nThe real secret isn't working 14 hours a day—it's having the right system.\n\nWhat's your biggest takeaway regarding ${topic}? Let's discuss below 👇\n\n#Growth #Productivity #Leadership`,
          carousel: [
            { slideNumber: 1, title: `The 1% Rule of ${topic}`, content: "Why 99% of people get stuck and how you can break through." },
            { slideNumber: 2, title: "Mistake #1: Overthinking", content: "Action beats perfection every single time." },
            { slideNumber: 3, title: "The Solution", content: "Build repeatable systems that take emotion out of execution." },
            { slideNumber: 4, title: "Real Results", content: "How focused implementation leads to compounding returns." },
            { slideNumber: 5, title: "Summary Checklist", content: "Save this post and follow for more actionable playbooks!" }
          ]
        });
      }
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
    console.error("AI LinkedIn Generator error:", error);
    let errorMessage = error.message || "Failed to generate LinkedIn content";
    
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
