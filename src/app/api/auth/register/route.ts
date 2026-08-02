import { NextResponse } from "next/server"
import prisma from "@/lib/prisma/client"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendVerificationEmail, notifySuperAdminOnNewUser } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (unverified by default)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // credits is set to 20 by default in the schema
      },
    })

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, token)
    
    // Notify Super Admin
    await notifySuperAdminOnNewUser(email, name)

    return NextResponse.json(
      { message: "User registered successfully. Please check your email to verify your account." },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[REGISTER_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
