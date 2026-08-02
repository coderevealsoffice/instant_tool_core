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
    const quality = parseInt(formData.get("quality") as string || "80")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Deduct 1 credit for image compression
    const hasCredits = await deductCredits(session.user.id, 1, "Compress Image")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Compress using sharp
    const compressedBuffer = await sharp(buffer)
      .jpeg({ quality })
      .toBuffer()

    // Upload to cloudinary
    // Cloudinary expects base64 or file path for direct upload
    const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`
    const result = await uploadToCloudinary(base64Image, "instant-tool-compressed")

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
      originalSize: buffer.length,
      compressedSize: compressedBuffer.length
    })

  } catch (error) {
    console.error("Image compression error:", error)
    return NextResponse.json({ error: "Failed to compress image" }, { status: 500 })
  }
}
