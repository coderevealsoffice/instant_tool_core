import prisma from '../src/lib/prisma/client'
import { DEFAULT_LEGAL_PAGES } from '../src/lib/legal-pages-data'

async function main() {
  console.log("🌱 Seeding comprehensive legal pages into database (Privacy, Terms, Cookies, Refund, Disclaimer)...")
  
  for (const [slug, page] of Object.entries(DEFAULT_LEGAL_PAGES)) {
    const updated = await prisma.legalPage.upsert({
      where: { slug },
      update: {
        title: page.title,
        content: page.content,
        updatedAt: new Date(),
      },
      create: {
        slug,
        title: page.title,
        content: page.content,
        updatedAt: new Date(),
      }
    })
    console.log(`✅ Upserted comprehensive legal document: ${updated.title} (slug: ${updated.slug})`)
  }

  console.log("🎉 All legal pages seeded successfully with 1500+ word compliance standards!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding legal pages:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
