import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { topic, bookType, authorName } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock response for development if API key is missing
      return NextResponse.json({
        chapters: [
          { title: "Introduction", description: "Overview of the topic and what you will learn." },
          { title: "Core Concepts", description: "Deep dive into the fundamental principles." },
          { title: "Advanced Techniques", description: "Mastering complex scenarios and patterns." },
          { title: "Conclusion", description: "Summary and next steps for the reader." }
        ]
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert author and curriculum designer. 
The user wants to write a book titled or about: "${topic}".
Book Type/Genre: ${bookType || 'General'}
Author Name (if provided): ${authorName || 'Anonymous'}

Your task is to generate a comprehensive, highly logical Table of Contents (chapters) for this Ebook.
You must return a raw JSON array of objects. Each object should have a 'title' (string) and a 'description' (string) outlining what the chapter covers.
Do not include any markdown formatting (like \`\`\`json). Just the raw JSON string.

Example output:
[
  { "title": "Chapter 1: Getting Started", "description": "Setting up the environment and basic concepts." },
  { "title": "Chapter 2: Variables and Types", "description": "Understanding data types in the language." }
]
`;

    let textResult = "";
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
              { role: 'user', parts: [{ text: systemPrompt }] }
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
        messages: [{ role: "user", content: systemPrompt }],
        model: "llama-3.3-70b-versatile",
      });
      textResult = completion.choices[0]?.message?.content || "";
    }

    let rawJson = textResult || "[]";
    
    // Clean up if the model accidentally included markdown wrappers
    if (rawJson.startsWith("```json")) {
      rawJson = rawJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawJson.startsWith("```")) {
      rawJson = rawJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsedStructure = [];
    try {
      parsedStructure = JSON.parse(rawJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", rawJson);
      throw new Error("AI returned invalid JSON structure.");
    }

    return NextResponse.json({ chapters: parsedStructure });
  } catch (error: any) {
    console.error("AI Structure Generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate structure" }, { status: 500 });
  }
}
