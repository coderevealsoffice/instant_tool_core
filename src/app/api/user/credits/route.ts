import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let user = null;
  try {
    if (typeof session.user.id === "string") {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
      })
    } else if (typeof session.user.email === "string") {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { credits: true }
      })
    }
  } catch (error) {
    console.error("Prisma error in credits API:", error);
  }

  return NextResponse.json({ credits: user?.credits || 0 })
}
