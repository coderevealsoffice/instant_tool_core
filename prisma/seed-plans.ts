import prisma from '../src/lib/prisma/client'

const plans = [
  {
    name: "Free",
    description: "Perfect to try out the tools.",
    priceMonthly: 0,
    priceYearly: 0,
    credits: 20, // 20 Signup Credits
    maxFileSizeMB: 25, // Up to 25MB file size
    features: [
      "20 Signup Credits",
      "Up to 25MB file size",
      "Access to basic tools"
    ],
    isActive: true,
  },
  {
    name: "Starter",
    description: "For light regular usage.",
    priceMonthly: 9,
    priceYearly: 90,
    credits: 500, // 500 Credits/mo
    maxFileSizeMB: 100, // Up to 100MB file size
    features: [
      "500 Credits/mo",
      "Up to 100MB file size",
      "Standard processing speed",
      "Ad-free experience"
    ],
    isActive: true,
  },
  {
    name: "Pro",
    description: "For professionals and freelancers.",
    priceMonthly: 19,
    priceYearly: 190,
    credits: 2000, // 2000 Credits/mo
    maxFileSizeMB: 500, // Up to 500MB file size
    features: [
      "2000 Credits/mo",
      "Up to 500MB file size",
      "Batch processing",
      "Priority processing"
    ],
    isActive: true,
  },
  {
    name: "Business",
    description: "For teams and heavy users.",
    priceMonthly: 49,
    priceYearly: 490,
    credits: 10000, // 10000 Credits/mo
    maxFileSizeMB: 2048, // Up to 2GB file size (2048 MB)
    features: [
      "10,000 Credits/mo",
      "Up to 2GB file size",
      "Advanced AI features",
      "API Access"
    ],
    isActive: true,
  }
]

async function main() {
  console.log('Seeding plans...')
  
  for (const plan of plans) {
    const existingPlan = await prisma.plan.findFirst({
      where: { name: plan.name }
    })
    
    if (existingPlan) {
      console.log(`Plan ${plan.name} already exists. Updating...`)
      await prisma.plan.update({
        where: { id: existingPlan.id },
        data: plan
      })
    } else {
      console.log(`Creating plan ${plan.name}...`)
      await prisma.plan.create({
        data: plan
      })
    }
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
