import { NextRequest, NextResponse } from "next/server";
import * as googleTTS from "google-tts-api";

export async function POST(req: NextRequest) {
  try {
    const { text, lang = "en", slow = false } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: "Text is too long (max 5000 chars)" }, { status: 400 });
    }

    // Google TTS API splits text into 200 character chunks automatically
    const results = await googleTTS.getAllAudioBase64(text, {
      lang,
      slow,
      host: "https://translate.google.com",
      splitPunct: ",.?",
    });

    // Convert base64 chunks to buffers and concatenate them
    const buffers = results.map((result) => Buffer.from(result.base64, "base64"));
    const finalBuffer = Buffer.concat(buffers);

    return new NextResponse(finalBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="speech.mp3"',
      },
    });
  } catch (error: any) {
    console.error("TTS API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech", details: error.message },
      { status: 500 }
    );
  }
}
