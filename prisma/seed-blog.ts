import prisma from '../src/lib/prisma/client'

async function main() {
  const category = await prisma.blogCategory.upsert({
    where: { slug: 'productivity' },
    update: {},
    create: {
      name: 'Productivity',
      slug: 'productivity',
    },
  })

  await prisma.blogPost.upsert({
    where: { slug: 'how-to-compress-pdf-files-without-losing-quality' },
    update: {},
    create: {
      title: 'How to Compress PDF Files Without Losing Quality',
      slug: 'how-to-compress-pdf-files-without-losing-quality',
      content: `<h2>The Ultimate Guide to PDF Compression</h2>
<p>In today's digital age, sharing documents is a daily necessity. However, large PDF files can be a nightmare to email or upload. In this guide, we will explore the best methods for compressing your PDFs without sacrificing image quality or text clarity.</p>
<h3>Why Compress PDFs?</h3>
<ul>
<li><strong>Faster Uploads:</strong> Smaller files transfer instantly.</li>
<li><strong>Email Limits:</strong> Bypass the dreaded 25MB attachment limit on Gmail and Outlook.</li>
<li><strong>Storage Space:</strong> Free up valuable space on your hard drive and cloud storage.</li>
</ul>
<h3>Using Instant Tool to Compress</h3>
<p>Our completely free online compressor uses advanced algorithms to balance file size reduction while preserving maximum visual fidelity. <a href="/pdf-tools/compress-pdf">Try it out here!</a></p>
`,
      excerpt: 'Learn the best methods for reducing the file size of your PDF documents without ruining the image quality or text clarity.',
      author: 'Instant Tool Team',
      isPublished: true,
      metaTitle: 'Compress PDF Files Free | No Quality Loss',
      metaDesc: 'A complete guide to compressing PDF files online for free while maintaining perfect visual quality.',
      categoryId: category.id,
    },
  })

  console.log('Blog seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
