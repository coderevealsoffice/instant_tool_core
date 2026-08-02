import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"
import { auth } from "@/auth"
import { deductCredits } from "@/lib/credits"
import { uploadToCloudinary } from "@/lib/cloudinary"
import JSZip from "jszip"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const pageRanges = formData.get("ranges") as string // e.g. "1,3,5-7"

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Deduct 2 credits for split PDF
    const hasCredits = await deductCredits(session.user.id, 2, "Split PDF")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const buffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(buffer)
    const totalPages = pdfDoc.getPageCount()

    // Parse ranges
    const pagesToExtract = new Set<number>()
    if (pageRanges) {
      const parts = pageRanges.split(",")
      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number)
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages) pagesToExtract.add(i - 1)
          }
        } else {
          const num = Number(part)
          if (num > 0 && num <= totalPages) pagesToExtract.add(num - 1)
        }
      }
    } else {
      // Extract all pages if no range provided
      for (let i = 0; i < totalPages; i++) {
        pagesToExtract.add(i)
      }
    }

    const zip = new JSZip()
    const indices = Array.from(pagesToExtract).sort((a, b) => a - b)

    for (let i = 0; i < indices.length; i++) {
      const pageIndex = indices[i]
      const newPdf = await PDFDocument.create()
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex])
      newPdf.addPage(copiedPage)
      
      const pdfBytes = await newPdf.save()
      zip.file(`page_${pageIndex + 1}.pdf`, pdfBytes)
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" })
    
    // Cloudinary supports zip files via 'raw' resource type
    // However, for simplicity of return format, we can upload it directly.
    const base64Zip = `data:application/zip;base64,${zipBuffer.toString("base64")}`
    const result = await uploadToCloudinary(base64Zip, "instant-tool-zip", "raw")

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
    })

  } catch (error) {
    console.error("PDF split error:", error)
    return NextResponse.json({ error: "Failed to split PDF" }, { status: 500 })
  }
}
