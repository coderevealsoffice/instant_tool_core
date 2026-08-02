import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { rawDetails, jobTitle } = await req.json();

    if (!rawDetails) {
      return NextResponse.json({ error: "Details are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert Executive Resume Writer and Career Coach. 
The user is providing their raw, unformatted details (experience, education, skills) and the target Job Title: "${jobTitle || 'General Professional'}".

Your task is to parse, rewrite, and structure these details into a highly professional, ATS-friendly resume JSON object.
Rules:
1. Extract and infer a Name, Email, Phone if provided. If not, use placeholders like "John Doe" or "[Your Phone]".
2. Write a compelling, results-driven Professional Summary (3-4 sentences).
3. Enhance their work experience bullets to focus on achievements, metrics, and action verbs (e.g., "Spearheaded...", "Increased...").
4. Return ONLY a valid JSON object matching this structure exactly (do NOT wrap it in markdown block quotes like \`\`\`json):

{
  "name": "Full Name",
  "contact": "email@example.com | 123-456-7890 | LinkedIn URL",
  "title": "Target Job Title",
  "summary": "Professional summary paragraph...",
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Jan 2020 - Present",
      "bullets": ["Enhanced bullet 1", "Enhanced bullet 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "year": "Graduation Year"
    }
  ]
}
`;

    let textResult = "";
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
              { role: 'user', parts: [{ text: systemPrompt + "\n\nRaw Details from User:\n" + rawDetails }] }
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
        messages: [{ role: "user", content: systemPrompt + "\n\nRaw Details from User:\n" + rawDetails }],
        model: "llama-3.3-70b-versatile",
      });
      textResult = completion.choices[0]?.message?.content || "";
    }

    // Strip markdown formatting if the model still returns it
    let jsonString = textResult || "{}";
    jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

    const resumeData = JSON.parse(jsonString);

    return NextResponse.json({ resume: resumeData });
  } catch (error: any) {
    console.error("AI Resume error:", error);
    let errorMessage = error.message || "Failed to generate resume";
    try {
      if (errorMessage.includes("429")) errorMessage = "Google AI Quota exceeded. Please wait a minute and try again.";
      else if (errorMessage.startsWith("{")) errorMessage = JSON.parse(errorMessage).error?.message || errorMessage;
    } catch (e) {}
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
