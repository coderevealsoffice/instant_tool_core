import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { deductCredits } from "@/lib/credits/index"
import { uploadToCloudinary } from "@/lib/cloudinary"
import sharp from "sharp"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const format = (formData.get("format") as string) || "jpeg"

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    // Deduct 1 credit
    const hasCredits = await deductCredits(session.user.id as string, 1, undefined, "PDF to Image")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdfBuffer = Buffer.from(arrayBuffer)

    // Use pdfjs-dist with canvas for server-side rendering
    // Dynamic import to avoid SSR issues with canvas binding
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js")
    const { createCanvas } = await import("canvas")

    // Disable worker for Node.js environment
    pdfjsLib.GlobalWorkerOptions.workerSrc = ""

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      disableWorker: true,
    } as any)
    const pdfDoc = await loadingTask.promise

    const numPages = pdfDoc.numPages
    const imageUrls: string[] = []

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i)
      const viewport = page.getViewport({ scale: 2.0 }) // 2x scale for high quality

      const canvas = createCanvas(viewport.width, viewport.height)
      const context = canvas.getContext("2d")

      await page.render({
        canvasContext: context as any,
        viewport,
      }).promise

      // Convert canvas to buffer via sharp for format control
      const rawBuffer = canvas.toBuffer("image/png")
      let outputBuffer: Buffer

      if (format === "jpeg" || format === "jpg") {
        outputBuffer = await sharp(rawBuffer).jpeg({ quality: 92 }).toBuffer()
      } else if (format === "webp") {
        outputBuffer = await sharp(rawBuffer).webp({ quality: 90 }).toBuffer()
      } else {
        outputBuffer = await sharp(rawBuffer).png().toBuffer()
      }

      const mimeType = format === "webp" ? "image/webp" : format === "png" ? "image/png" : "image/jpeg"
      const ext = format === "jpeg" ? "jpg" : format

      const base64Image = `data:${mimeType};base64,${outputBuffer.toString("base64")}`
      const uploadResult = await uploadToCloudinary(base64Image, "instant-tool-pdf-images")

      imageUrls.push(uploadResult.secure_url)
    }

    return NextResponse.json({
      success: true,
      images: imageUrls,
      pageCount: numPages,
    })
  } catch (error: any) {
    console.error("PDF to Image error:", error)
    return NextResponse.json({ error: error.message || "Failed to convert PDF to images" }, { status: 500 })
  }
}
