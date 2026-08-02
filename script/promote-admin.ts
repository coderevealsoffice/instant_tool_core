import prisma from "../src/lib/prisma/client"

async function main() {
  const email = "ydvpradeep2@gmail.com"
  
  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "SUPER_ADMIN" }
    })
    console.log(`Successfully updated ${email} to SUPER_ADMIN role.`)
  } catch (error) {
    console.error("Error updating user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
