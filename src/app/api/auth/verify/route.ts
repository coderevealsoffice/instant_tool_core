import { NextResponse } from "next/server"
import prisma from "@/lib/prisma/client"

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json()

    if (!token || !email) {
      return NextResponse.json(
        { error: "Missing token or email" },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification token." },
        { status: 400 }
      )
    }

    if (new Date(verificationToken.expires) < new Date()) {
      return NextResponse.json(
        { error: "Verification token has expired. Please register again or request a new one." },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      )
    }

    // Update user's emailVerified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    })

    // Delete the token so it can't be used again
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    })

    return NextResponse.json({ success: true, message: "Email verified successfully." })
  } catch (error: any) {
    console.error("[VERIFY_EMAIL_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
