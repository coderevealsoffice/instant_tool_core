import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, tone, length } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return a simulated HTML output if no API key is present
      const mockHtml = `
        <h1>Mock AI Generated Content</h1>
        <p>This is a simulated response because the <strong>GEMINI_API_KEY</strong> is missing from your environment variables.</p>
        <p><strong>Prompt:</strong> ${prompt}</p>
        <p><strong>Tone:</strong> ${tone}</p>
        <p><strong>Length:</strong> ${length}</p>
        <h2>Why you are seeing this:</h2>
        <ul>
          <li>The application tried to call the Gemini API but no key was found.</li>
          <li>To make this fully functional, add <code>GEMINI_API_KEY=your_key_here</code> to your <code>.env</code> file.</li>
        </ul>
        <p>Once you add the key, this tool will connect directly to Google's Gemini models to write real, high-quality content formatted in HTML!</p>
      `;
      return NextResponse.json({ content: mockHtml });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert AI content writer and copywriter with a deep understanding of SEO (Search Engine Optimization).
Write a highly engaging, well-structured, and SEO-optimized article about the user's prompt.
Tone: ${tone}. 
Length: ${length} (short=~200 words, medium=~400 words, long=~700 words).

CRITICAL FORMATTING INSTRUCTIONS:
1. Format your response ENTIRELY in valid, semantic HTML. Do NOT return markdown or plain text.
2. Structure the content logically with a compelling main title (<h1>).
3. Use descriptive, keyword-rich subheadings (<h2>, <h3>) to break down the content.
4. Write in well-structured paragraphs (<p>).
5. Highlight important keywords or concepts using bold (<strong>) or italics (<em>).
6. Whenever appropriate, include bulleted (<ul>) or numbered (<ol>) lists for readability and SEO featured snippets.
7. Do NOT wrap the output in markdown code blocks like \`\`\`html. Just return the raw HTML string directly, ready to be injected via dangerouslySetInnerHTML.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: systemPrompt + "\\n\\nTopic: " + prompt }] }
        ],
    });

    let generatedHtml = response.text || "";
    // Clean up if the model accidentally included markdown wrappers
    if (generatedHtml.startsWith("```html")) {
      generatedHtml = generatedHtml.replace(/^```html\s*/, "").replace(/\s*```$/, "");
    } else if (generatedHtml.startsWith("```")) {
      generatedHtml = generatedHtml.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    return NextResponse.json({ content: generatedHtml });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
