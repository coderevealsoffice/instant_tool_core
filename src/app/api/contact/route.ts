import { NextResponse } from "next/server"
import { sendContactEmail } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields (name, email, subject, message) are required." },
        { status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    const result = await sendContactEmail(name, email, subject, message)

    if (!result.success) {
      // Don't leak raw SMTP error to client, but acknowledge
      console.error("Contact form mail delivery failed:", result.error)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We have received your message and will reply within 24 hours.",
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Something went wrong while processing your request. Please try again later." },
      { status: 500 }
    )
  }
}

