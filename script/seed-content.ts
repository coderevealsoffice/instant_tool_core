import prisma from '../src/lib/prisma/client'

async function main() {
  console.log('Seeding Database with AI Blogs and FAQs...')

  // Insert FAQs
  const faqs = [
    { question: 'What is InstantTool?', answer: 'InstantTool is a platform offering various online utilities including PDF compression, Image conversion, and AI-powered content generation tools.', category: 'GENERAL', order: 1 },
    { question: 'How do credits work?', answer: 'Each tool execution consumes a specific amount of credits. You are given 20 free credits upon signup. You can purchase more credits in the Billing section.', category: 'BILLING', order: 2 },
    { question: 'Are my uploaded files secure?', answer: 'Yes, we take security very seriously. Uploaded files are processed securely and deleted automatically from our servers after 1 hour.', category: 'SECURITY', order: 3 },
    { question: 'Can I use InstantTool on mobile?', answer: 'Yes! InstantTool is fully responsive and can be used on any modern mobile browser without downloading an app.', category: 'GENERAL', order: 4 },
    { question: 'What happens if a tool fails to process?', answer: 'If a tool fails due to a server error, the credits deducted for that specific job will be automatically refunded to your account.', category: 'BILLING', order: 5 },
    { question: 'Do you offer bulk processing?', answer: 'Yes, certain tools support bulk processing (e.g. converting multiple images at once). Check the tool specific page for the batch processing option.', category: 'FEATURES', order: 6 },
    { question: 'Can I upgrade my subscription plan later?', answer: 'Absolutely. You can change your plan at any time from the Subscription settings in your dashboard.', category: 'BILLING', order: 7 },
    { question: 'How does the AI Content Generator work?', answer: 'We use advanced LLMs (like OpenAI GPT-4) to generate high-quality text based on your prompts. It is fully integrated into the platform.', category: 'AI_TOOLS', order: 8 },
    { question: 'Can I request a custom tool?', answer: 'We are always looking for feedback! Please open a Support Ticket and let us know what tool you would like us to build next.', category: 'SUPPORT', order: 9 },
    { question: 'Is there an API available?', answer: 'Currently, InstantTool is a web-based GUI platform. We plan to release a public REST API for developers in Q4 2026.', category: 'DEVELOPER', order: 10 },
  ]

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq })
  }
  console.log('✅ 10 FAQs inserted.')

  // Ensure an 'AI' Blog Category exists
  let aiCategory = await prisma.blogCategory.findUnique({ where: { slug: 'ai-tools' } })
  if (!aiCategory) {
    aiCategory = await prisma.blogCategory.create({
      data: { name: 'AI Tools', slug: 'ai-tools' }
    })
  }

  // Insert Blogs
  const blogs = [
    {
      title: 'Top 5 AI Tools to Supercharge Your Productivity in 2026',
      slug: 'top-5-ai-tools-productivity-2026',
      excerpt: 'Discover the best AI utilities that can save you hours of manual work every single day.',
      content: `<h2>The Rise of AI Utilities</h2><p>Artificial Intelligence has moved beyond hype and is now an essential part of daily workflows. In 2026, AI tools are faster, more integrated, and cheaper than ever.</p><h3>1. AI PDF Analyzers</h3><p>Gone are the days of reading 50-page reports. AI can now summarize PDFs in seconds, highlighting only the crucial metrics.</p><h3>2. Image Upscalers</h3><p>Using neural networks, you can now upscale low-res images to 4K without losing quality.</p><h3>Conclusion</h3><p>Adopting these tools is no longer optional if you want to stay competitive. Start exploring AI utilities on InstantTool today!</p>`,
      author: 'Admin',
      isPublished: true,
      metaTitle: 'Top 5 AI Productivity Tools in 2026 | InstantTool',
      metaDesc: 'Discover the ultimate list of AI tools for 2026 that will automate your workflow, summarize PDFs, and boost your daily productivity.',
      categoryId: aiCategory.id
    },
    {
      title: 'How Generative AI is Changing Content Creation',
      slug: 'how-generative-ai-changes-content',
      excerpt: 'Generative AI is revolutionizing how we write blogs, create marketing copy, and design graphics.',
      content: `<h2>Understanding Generative AI</h2><p>Generative AI models, such as GPT-4 and Midjourney, are capable of creating net-new text and images from simple text prompts.</p><h3>The Impact on Marketing</h3><p>Marketers can now generate hundreds of ad variations in minutes. This allows for rapid A/B testing and highly personalized campaigns.</p><h3>Ethical Considerations</h3><p>As with any powerful technology, we must ensure AI is used responsibly, avoiding plagiarism and maintaining human oversight.</p>`,
      author: 'Admin',
      isPublished: true,
      metaTitle: 'Generative AI for Content Creation | Complete Guide',
      metaDesc: 'Learn how generative AI is transforming marketing and content creation. Discover tips for using GPT models effectively.',
      categoryId: aiCategory.id
    },
    {
      title: 'Why You Need an AI PDF Summarizer',
      slug: 'why-you-need-ai-pdf-summarizer',
      excerpt: 'Stop wasting hours reading long documents. Learn how AI PDF summarizers extract key information instantly.',
      content: `<h2>The Problem with Long PDFs</h2><p>Legal documents, research papers, and technical manuals are notoriously difficult to digest. Finding specific information requires endless scrolling and Ctrl+F.</p><h3>The AI Solution</h3><p>By feeding a PDF into an AI summarizer, the model parses the text, understands the context, and answers specific questions about the document.</p><h3>Use Cases</h3><ul><li><strong>Students:</strong> Summarize lecture notes and research papers.</li><li><strong>Lawyers:</strong> Quickly review contracts for specific clauses.</li></ul>`,
      author: 'Admin',
      isPublished: true,
      metaTitle: 'AI PDF Summarizer Benefits and Use Cases',
      metaDesc: 'Save time reading long documents. Find out why an AI PDF summarizer is the ultimate tool for students, lawyers, and researchers.',
      categoryId: aiCategory.id
    },
    {
      title: 'Mastering AI Image Generation: Tips and Tricks',
      slug: 'mastering-ai-image-generation',
      excerpt: 'Learn the secrets to writing perfect prompts for AI image generators to get exactly what you want.',
      content: `<h2>The Art of Prompting</h2><p>Creating beautiful AI images isn't just about typing a word. It requires a structured prompt.</p><h3>Formula for Success</h3><p>Use this structure: <strong>[Subject] + [Environment] + [Lighting] + [Style]</strong>.</p><p>For example: <em>A futuristic city, rainy night, neon lighting, cyberpunk style, highly detailed.</em></p><h3>Iterative Design</h3><p>Don't expect perfection on the first try. Generate multiple variations and refine your prompt based on the results.</p>`,
      author: 'Admin',
      isPublished: true,
      metaTitle: 'AI Image Generation Prompts and Tips',
      metaDesc: 'Unlock the secrets of AI image generation. Learn how to structure prompts for Midjourney and DALL-E to get stunning results.',
      categoryId: aiCategory.id
    },
    {
      title: 'The Future of Web Utilities in the AI Era',
      slug: 'future-of-web-utilities-ai',
      excerpt: 'Explore how simple web tools like format converters are evolving into intelligent assistants.',
      content: `<h2>From Static to Smart</h2><p>Historically, web utilities were simple scripts: convert format A to format B. Today, they are intelligent.</p><h3>Context-Aware Tools</h3><p>Modern tools don't just compress an image; they analyze the image content to determine the optimal compression algorithm that preserves the most important details (like human faces).</p><h3>What's Next?</h3><p>We anticipate that all SaaS platforms will soon have a natural language interface, allowing users to simply type what they want done without navigating complex menus.</p>`,
      author: 'Admin',
      isPublished: true,
      metaTitle: 'Future of Web Utilities and AI SaaS',
      metaDesc: 'Read our analysis on how AI is transforming traditional web utilities into smart, context-aware digital assistants.',
      categoryId: aiCategory.id
    }
  ]

  for (const blog of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog
    })
  }
  console.log('✅ 5 AI Blog Posts inserted.')

  console.log('🎉 Seeding Complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
