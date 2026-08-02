import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"
import sharp from "sharp"
import { auth } from "@/auth"
import { deductCredits } from "@/lib/credits/index"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 })
    }

    // Deduct 1 credit
    const hasCredits = await deductCredits(session.user.id as string, 1, undefined, "Image to PDF")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const pdfDoc = await PDFDocument.create()

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())

      // Convert any image format to PNG using sharp (handles JPEG, PNG, WebP, AVIF, TIFF, etc.)
      const { data: pngBuffer, info } = await sharp(buffer)
        .png()
        .toBuffer({ resolveWithObject: true })

      const pdfImage = await pdfDoc.embedPng(pngBuffer)
      const { width, height } = pdfImage

      // Fit image to A4 page size (595 x 842 pts) while preserving aspect ratio
      const A4_WIDTH = 595
      const A4_HEIGHT = 842
      const scale = Math.min(A4_WIDTH / width, A4_HEIGHT / height, 1)
      const scaledW = width * scale
      const scaledH = height * scale

      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
      page.drawImage(pdfImage, {
        x: (A4_WIDTH - scaledW) / 2,
        y: (A4_HEIGHT - scaledH) / 2,
        width: scaledW,
        height: scaledH,
      })
    }

    const pdfBytes = await pdfDoc.save()
    const base64Pdf = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString("base64")}`
    const result = await uploadToCloudinary(base64Pdf, "instant-tool-pdf")

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    })
  } catch (error: any) {
    console.error("Image to PDF error:", error)
    return NextResponse.json({ error: error.message || "Failed to convert images to PDF" }, { status: 500 })
  }
}
