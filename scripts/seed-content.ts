import { PrismaClient } from "@prisma/client"
import { GoogleGenAI } from "@google/genai"
import * as dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

// Initialize Google Gen AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const BLOG_TOPICS = [
  { title: "The Ultimate Guide to Managing PDFs in 2026", slug: "ultimate-guide-pdf-management-2026", cat: "PDF Tools" },
  { title: "How AI is Revolutionizing Image Editing and Background Removal", slug: "ai-revolutionizing-image-editing", cat: "AI Tools" },
  { title: "Top 10 Essential Web Utilities for Digital Creators", slug: "top-10-web-utilities-digital-creators", cat: "Business" },
  { title: "Why Cloud-Based Video Processing is the Future", slug: "cloud-based-video-processing-future", cat: "Video Tools" },
  { title: "Maximizing Productivity with All-in-One Online Tools", slug: "maximizing-productivity-online-tools", cat: "Business" },
  { title: "A Deep Dive into Document Security and PDF Password Protection", slug: "document-security-pdf-protection", cat: "PDF Tools" },
  { title: "The Rise of Free Online Utilities vs Expensive Desktop Software", slug: "free-online-utilities-vs-desktop", cat: "Business" },
  { title: "How to Optimize Images for Web Performance and SEO", slug: "optimize-images-web-performance-seo", cat: "Image Tools" },
  { title: "Understanding File Formats: When to use PNG, JPG, WebP, and AVIF", slug: "understanding-file-formats-png-jpg-webp", cat: "Image Tools" },
  { title: "The Role of AI Chatbots in PDF Document Analysis", slug: "ai-chatbots-pdf-document-analysis", cat: "AI Tools" }
]

const LEGAL_PAGES = [
  { title: "Privacy Policy", slug: "privacy-policy" },
  { title: "Terms of Service", slug: "terms-of-service" },
  { title: "Refund Policy", slug: "refund-policy" },
  { title: "Cookie Policy", slug: "cookie-policy" },
]

async function generateContent(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })
    let text = response.text || ""
    // Remove markdown codeblock wrappers if present
    text = text.replace(/^```html\n/, "").replace(/^```\n/, "").replace(/\n```$/, "")
    return text.trim()
  } catch (err) {
    console.error("AI Generation Error:", err)
    return "<p>Content generation failed.</p>"
  }
}

async function seed() {
  console.log("Starting content generation and seeding process...")

  // 1. Generate Legal Pages
  for (const page of LEGAL_PAGES) {
    console.log(`Generating Legal Page: ${page.title}...`)
    const prompt = `Write a comprehensive, legally sound, and highly detailed ${page.title} for a SaaS platform named "InstantTool" that provides online PDF, image, video, and AI utilities. 
    The policy should be standard, professional, and at least 800 words long. 
    Format the output strictly in HTML (using <h2>, <h3>, <p>, <ul>, <li>). Do NOT wrap the response in markdown code blocks. Just return the raw HTML.`
    
    const content = await generateContent(prompt)
    
    await prisma.legalPage.upsert({
      where: { slug: page.slug },
      update: { title: page.title, content },
      create: { slug: page.slug, title: page.title, content }
    })
    console.log(`✅ Saved ${page.title}`)
  }

  // 2. Generate Blog Categories
  const categories = await Promise.all(
    ["PDF Tools", "AI Tools", "Business", "Video Tools", "Image Tools"].map(async (name) => {
      return prisma.blogCategory.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') }
      })
    })
  )

  // 3. Generate Blog Posts
  for (const topic of BLOG_TOPICS) {
    console.log(`Generating Blog Post: ${topic.title}...`)
    const cat = categories.find(c => c.name === topic.cat)

    // Check if post exists to avoid re-generating
    const existing = await prisma.blogPost.findUnique({ where: { slug: topic.slug } })
    if (existing) {
      console.log(`⏭️ Blog post "${topic.title}" already exists, skipping.`)
      continue
    }

    const prompt = `You are an expert SEO content writer and humanizer. Write a highly detailed, comprehensive, and engaging blog post titled "${topic.title}".
    Requirements:
    - Length: Approximately 1500 words. Provide extreme detail, actionable advice, and deep analysis.
    - Tone: Humanized, conversational yet professional, avoiding robotic AI clichés (like "In conclusion", "Delve into").
    - SEO Friendly: Optimize for search intent. Include an engaging introduction, structured body paragraphs, and a strong conclusion.
    - Format: Output STRICTLY as clean HTML (use <h2>, <h3>, <p>, <ul>, <li>, <strong>).
    - Do NOT include the main <h1> title in the HTML (it will be rendered by the page).
    - Do NOT wrap the output in markdown code blocks. Return only the raw HTML.`

    const content = await generateContent(prompt)
    const excerpt = `Discover comprehensive insights and expert advice on ${topic.title.toLowerCase()}. Read our complete guide to master this topic.`

    await prisma.blogPost.create({
      data: {
        title: topic.title,
        slug: topic.slug,
        content: content,
        excerpt: excerpt,
        author: "Pradeep Yadav",
        isPublished: true,
        categoryId: cat?.id,
        metaTitle: topic.title,
        metaDesc: excerpt,
      }
    })
    console.log(`✅ Saved Blog Post: ${topic.title}`)
    
    // Add a slight delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log("🎉 Seeding completed successfully!")
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
