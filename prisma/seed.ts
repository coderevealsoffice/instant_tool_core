import { ToolCategory } from "@prisma/client"
import prisma from "../src/lib/prisma/client"
import bcrypt from "bcryptjs"
import { BUILTIN_BLOG_POSTS } from "../src/lib/blogs-data"
import { DEFAULT_LEGAL_PAGES } from "../src/lib/legal-pages-data"

async function main() {
  console.log("🚀 Starting complete database seed...")

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
  console.log("✅ Upserted Super Admin:", superAdmin.email)

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
  console.log("✅ Upserted Subscription Plans")

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
  console.log("✅ Upserted Tool Definitions")

  // 4. Seed Legal Pages
  for (const [slug, page] of Object.entries(DEFAULT_LEGAL_PAGES)) {
    await prisma.legalPage.upsert({
      where: { slug },
      update: {
        title: page.title,
        content: page.content,
      },
      create: {
        slug,
        title: page.title,
        content: page.content,
      }
    })
  }
  console.log("✅ Upserted All Legal Pages (Privacy, Terms, Cookies, Refund, Disclaimer)")

  // 5. Seed Blog Categories & Posts
  const categoryNames = Array.from(new Set(BUILTIN_BLOG_POSTS.map(b => b.categoryName)))
  const categoryMap = new Map<string, string>()

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    const cat = await prisma.blogCategory.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    })
    categoryMap.set(name, cat.id)
  }
  console.log("✅ Upserted Blog Categories:", categoryNames.join(", "))

  for (const blog of BUILTIN_BLOG_POSTS) {
    const categoryId = categoryMap.get(blog.categoryName) || null
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        image: blog.image,
        metaTitle: blog.metaTitle,
        metaDesc: blog.metaDesc,
        isPublished: true,
        categoryId,
      },
      create: {
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        image: blog.image,
        metaTitle: blog.metaTitle,
        metaDesc: blog.metaDesc,
        isPublished: true,
        categoryId,
      }
    })
  }
  console.log(`✅ Upserted ${BUILTIN_BLOG_POSTS.length} Long-Form Blog Posts into Database`)

  console.log("🎉 Complete Database Seeding Successful!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
