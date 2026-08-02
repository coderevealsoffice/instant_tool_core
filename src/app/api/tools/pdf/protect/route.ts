import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"
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
    const file = formData.get("file") as File
    const password = formData.get("password") as string

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }
    if (!password || password.length < 4) {
      return NextResponse.json({ error: "Password must be at least 4 characters" }, { status: 400 })
    }

    // Deduct 1 credit
    const hasCredits = await deductCredits(session.user.id as string, 1, undefined, "Protect PDF")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // Load and re-save the PDF (strips unused objects)
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pdfBytes = await pdfDoc.save()

    // AES-GCM encryption using Node.js crypto (same algorithm as frontend for cross-compatibility)
    const crypto = await import("crypto")
    const enc = new TextEncoder()

    const salt = crypto.webcrypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.webcrypto.getRandomValues(new Uint8Array(12))

    const keyMaterial = await crypto.webcrypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    )

    const key = await crypto.webcrypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    )

    const encryptedData = await crypto.webcrypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      pdfBytes.buffer as ArrayBuffer
    )

    // Pack: magic(4) + salt(16) + iv(12) + encrypted data
    // Magic = "ITPD" (InstantTool Protected Document)
    const magic = new Uint8Array([0x49, 0x54, 0x50, 0x44])
    const result = new Uint8Array(4 + 16 + 12 + encryptedData.byteLength)
    result.set(magic, 0)
    result.set(salt, 4)
    result.set(iv, 20)
    result.set(new Uint8Array(encryptedData), 32)

    // Upload encrypted file to Cloudinary as raw
    const base64Encrypted = `data:application/octet-stream;base64,${Buffer.from(result).toString("base64")}`
    const uploadResult = await uploadToCloudinary(base64Encrypted, "instant-tool-protected", "raw")

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
    })
  } catch (error: any) {
    console.error("Protect PDF error:", error)
    return NextResponse.json({ error: error.message || "Failed to protect PDF" }, { status: 500 })
  }
}
