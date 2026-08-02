import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"
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
    const files = formData.getAll("files") as File[]

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "At least two files are required to merge" }, { status: 400 })
    }

    // Deduct 2 credits for merge PDF
    const hasCredits = await deductCredits(session.user.id, 2, "Merge PDF")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const buffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(buffer)
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()
    const mergedPdfBuffer = Buffer.from(mergedPdfBytes)
    
    // Convert to base64 for Cloudinary
    const base64Pdf = `data:application/pdf;base64,${mergedPdfBuffer.toString("base64")}`
    const result = await uploadToCloudinary(base64Pdf, "instant-tool-pdf", "raw")

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
    })

  } catch (error) {
    console.error("PDF merge error:", error)
    return NextResponse.json({ error: "Failed to merge PDFs" }, { status: 500 })
  }
}
