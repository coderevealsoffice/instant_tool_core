import { NextResponse } from "next/server"
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
      return NextResponse.json({ error: "No protected file provided" }, { status: 400 })
    }
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Deduct 1 credit
    const hasCredits = await deductCredits(session.user.id as string, 1, undefined, "Unlock PDF")
    if (!hasCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileBytes = new Uint8Array(fileBuffer)

    // Validate magic bytes "ITPD" (InstantTool Protected Document)
    const magic = [0x49, 0x54, 0x50, 0x44]
    if (
      fileBytes[0] !== magic[0] ||
      fileBytes[1] !== magic[1] ||
      fileBytes[2] !== magic[2] ||
      fileBytes[3] !== magic[3]
    ) {
      return NextResponse.json(
        { error: "This file was not protected by InstantTool. Please use a file encrypted with our Protect PDF tool." },
        { status: 400 }
      )
    }

    // Extract salt (16 bytes), iv (12 bytes), encrypted data
    const salt = fileBytes.slice(4, 20)
    const iv = fileBytes.slice(20, 32)
    const encryptedData = fileBytes.slice(32)

    const crypto = await import("crypto")
    const enc = new TextEncoder()

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
      ["decrypt"]
    )

    let decryptedData: ArrayBuffer
    try {
      decryptedData = await crypto.webcrypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedData
      )
    } catch {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 400 })
    }

    // Upload decrypted PDF to Cloudinary
    const base64Pdf = `data:application/pdf;base64,${Buffer.from(decryptedData).toString("base64")}`
    const uploadResult = await uploadToCloudinary(base64Pdf, "instant-tool-unlocked", "raw")

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
    })
  } catch (error: any) {
    console.error("Unlock PDF error:", error)
    return NextResponse.json({ error: error.message || "Failed to unlock PDF" }, { status: 500 })
  }
}
