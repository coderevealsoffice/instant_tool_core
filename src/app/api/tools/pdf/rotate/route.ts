import { NextResponse } from "next/server"
import { PDFDocument, degrees } from "pdf-lib"
import { auth } from "@/auth"
import { deductCredits } from "@/lib/credits"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const angleStr = formData.get("angle") as string || "90"
    const angle = parseInt(angleStr)
    
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    
    const pages = pdfDoc.getPages()
    pages.forEach(page => {
      const currentRotation = page.getRotation().angle
      page.setRotation(degrees(currentRotation + angle))
    })
    
    const pdfBytes = await pdfDoc.save()
    const processedFile = new File([pdfBytes as any], `rotated_${file.name}`, { type: "application/pdf" })

    // Deduct credits (Rotate PDF costs 2 credits based on standard PDF tools)
    const creditSuccess = await deductCredits(session.user.id as string, 2)
    if (!creditSuccess) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const base64Pdf = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString("base64")}`
    const uploadResult = await uploadToCloudinary(base64Pdf, "pdf", "raw")
    
    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url 
    })

  } catch (error: any) {
    console.error("Rotate PDF error:", error)
    return NextResponse.json({ error: error.message || "Failed to rotate PDF" }, { status: 500 })
  }
}
