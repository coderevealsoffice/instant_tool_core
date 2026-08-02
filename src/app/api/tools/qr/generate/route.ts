import { NextResponse } from "next/server"
import QRCode from "qrcode"
import { auth } from "@/auth"
import { deductCredits } from "@/lib/credits"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { data, type } = body // type: 'STATIC' | 'DYNAMIC'

    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 })
    }

    // Deduct 1 credit for QR code
    const hasCredits = await deductCredits(session.user.id, 1, "Generate QR Code")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // Generate QR Code as Data URI (base64 image/png)
    const qrDataUri = await QRCode.toDataURL(data, {
      width: 500,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff"
      }
    })

    // Upload to Cloudinary
    const result = await uploadToCloudinary(qrDataUri, "instant-tool-qr")

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
    })

  } catch (error) {
    console.error("QR generation error:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
