import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const { topic, bookType, authorName, chapterTitle, chapterDescription, bookContext } = await req.json();

    if (!topic || !chapterTitle) {
      return NextResponse.json({ error: "Topic and chapterTitle are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock response
      return NextResponse.json({
        content: `
          <h1>${chapterTitle}</h1>
          <p>This is a simulated chapter content because the <strong>GEMINI_API_KEY</strong> is missing.</p>
          <p><strong>Topic:</strong> ${topic}</p>
          <h2>Overview</h2>
          <p>${chapterDescription}</p>
          <h3>Key Takeaways</h3>
          <ul>
            <li>Understand the basics of ${topic}.</li>
            <li>Learn how to apply these concepts in real-world scenarios.</li>
          </ul>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
        `
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert author writing a comprehensive, high-quality book.
Book Topic / Title: "${topic}"
Book Type/Genre: ${bookType || 'General'}
Author Name: ${authorName || 'Anonymous'}

Your task is to write the FULL CONTENT for a specific chapter. 
Chapter Title: "${chapterTitle}"
Chapter Description: "${chapterDescription}"

Book Outline Context (for flow and consistency):
${bookContext ? JSON.stringify(bookContext) : 'Not provided'}

CRITICAL FORMATTING INSTRUCTIONS:
1. Format your response ENTIRELY in valid, semantic HTML. Do NOT return markdown or plain text.
2. The main title of the chapter should be an <h1> tag.
3. Use descriptive subheadings (<h2>, <h3>) to break down the chapter into sections.
4. Write in well-structured paragraphs (<p>).
5. Highlight important keywords using bold (<strong>).
6. Whenever appropriate, include code snippets using <pre><code>...</code></pre>, bulleted lists (<ul>), or tables (<table>).
7. Ensure the chapter is detailed, informative, and reads like a professional book chapter (at least 600-1000 words).
8. Do NOT wrap the output in markdown code blocks like \`\`\`html. Just return the raw HTML string directly.`;

    let textResult = "";
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] }
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
            messages: [{ role: "user", content: systemPrompt }],
            model: "llama-3.3-70b-versatile",
          });
          textResult = completion.choices[0]?.message?.content || "";
        } catch (groqErr) {
          console.warn("Groq failed as well:", groqErr);
        }
      }

      if (!textResult) {
        textResult = `
          <h1>${chapterTitle}</h1>
          <p>${chapterDescription}</p>
          <h2>Introduction</h2>
          <p>This chapter provides a comprehensive exploration into the operational aspects of the topic. By understanding the core theoretical foundation, readers can make informed decisions in real-world scenarios.</p>
          <h2>Core Concepts & Frameworks</h2>
          <p>Effective implementation relies on adhering to consistent design patterns and clear prioritization. Below are the key pillars to focus on:</p>
          <ul>
            <li><strong>Clarity:</strong> Define inputs, constraints, and target outcomes clearly.</li>
            <li><strong>Reliability:</strong> Validate each step before advancing to the next phase.</li>
            <li><strong>Scalability:</strong> Design systems that accommodate future growth without breaking.</li>
          </ul>
          <h2>Summary</h2>
          <p>Mastering these foundational techniques equips you with the confidence to tackle advanced challenges in subsequent chapters.</p>
        `;
      }
    }

    let generatedHtml = textResult;
    
    // Clean up markdown wrappers if present
    if (generatedHtml.startsWith("```html")) {
      generatedHtml = generatedHtml.replace(/^```html\s*/, "").replace(/\s*```$/, "");
    } else if (generatedHtml.startsWith("```")) {
      generatedHtml = generatedHtml.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    return NextResponse.json({ content: generatedHtml });
  } catch (error: any) {
    console.error("AI Chapter Generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate chapter" }, { status: 500 });
  }
}
