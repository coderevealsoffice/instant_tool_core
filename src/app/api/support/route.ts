import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const role = (session.user as any).role
    
    // If Admin/SuperAdmin, fetch all tickets. Else, only user's tickets.
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      const tickets = await prisma.supportTicket.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true, name: true } } }
      })
      return NextResponse.json(tickets)
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })
    
    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Failed to fetch tickets:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, message } = await req.json()
    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 })
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        subject,
        message,
        status: "OPEN"
      }
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Failed to create ticket:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const role = (session.user as any).role
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { ticketId, status } = await req.json()
    if (!ticketId || !status) {
      return NextResponse.json({ error: "Ticket ID and status are required" }, { status: 400 })
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status }
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Failed to update ticket:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
