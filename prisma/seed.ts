import { ToolCategory } from "@prisma/client"
import prisma from "../src/lib/prisma/client"
import bcrypt from "bcryptjs"

async function main() {
  console.log("Starting DB seeding...")

  // 1. Seed Super Admin
  const hashedPassword = await bcrypt.hash("admin123", 10)
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@instanttool.com" },
    update: {},
    create: {
      email: "admin@instanttool.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      credits: 999999
    }
  })
  console.log("Upserted Super Admin:", superAdmin.email)

  // 2. Seed Subscription Plans
  const plans = [
    { name: "Starter", priceMonthly: 9, priceYearly: 90, credits: 500, maxFileSizeMB: 100, features: ["Ad-free"] },
    { name: "Pro", priceMonthly: 19, priceYearly: 190, credits: 2000, maxFileSizeMB: 500, features: ["Ad-free", "Batch processing"] },
    { name: "Business", priceMonthly: 49, priceYearly: 490, credits: 10000, maxFileSizeMB: 2000, features: ["Ad-free", "Batch processing", "API access"] },
  ]

  for (const plan of plans) {
    const existing = await prisma.plan.findFirst({ where: { name: plan.name } })
    if (!existing) {
      await prisma.plan.create({ data: plan })
    }
  }
  console.log("Upserted Subscription Plans")

  // 3. Seed Tool Definitions
  const tools = [
    { name: "Compress PDF", slug: "compress-pdf", category: ToolCategory.PDF, description: "Reduce PDF file size", creditCost: 2 },
    { name: "Merge PDF", slug: "merge-pdf", category: ToolCategory.PDF, description: "Combine multiple PDFs", creditCost: 2 },
    { name: "Split PDF", slug: "split-pdf", category: ToolCategory.PDF, description: "Extract pages from PDF", creditCost: 2 },
    { name: "Compress Image", slug: "compress-image", category: ToolCategory.IMAGE, description: "Reduce Image file size", creditCost: 1 },
    { name: "Convert Image", slug: "convert-image", category: ToolCategory.IMAGE, description: "Convert Image format", creditCost: 1 },
    { name: "QR Generator", slug: "qr-generator", category: ToolCategory.QR, description: "Generate QR codes", creditCost: 1 },
  ]

  for (const tool of tools) {
    await prisma.toolDefinition.upsert({
      where: { slug: tool.slug },
      update: {},
      create: tool
    })
  }
  console.log("Upserted Tool Definitions")

  console.log("DB seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
