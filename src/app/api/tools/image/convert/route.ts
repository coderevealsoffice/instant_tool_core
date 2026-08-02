import { NextResponse } from "next/server"
import sharp from "sharp"
import { auth } from "@/auth"
import { deductCredits } from "@/lib/credits"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const format = formData.get("format") as "png" | "jpeg" | "webp"

    if (!file || !format) {
      return NextResponse.json({ error: "File and format are required" }, { status: 400 })
    }

    // Deduct 1 credit for image conversion
    const hasCredits = await deductCredits(session.user.id, 1, "Convert Image")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Convert using sharp
    const convertedBuffer = await sharp(buffer)
      .toFormat(format)
      .toBuffer()

    const base64Image = `data:image/${format};base64,${convertedBuffer.toString("base64")}`
    const result = await uploadToCloudinary(base64Image, "instant-tool-converted")

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
    })

  } catch (error) {
    console.error("Image conversion error:", error)
    return NextResponse.json({ error: "Failed to convert image" }, { status: 500 })
  }
}
