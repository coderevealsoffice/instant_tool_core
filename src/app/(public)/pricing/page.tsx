import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { AdSlot } from "@/components/common/AdSlot"
import prisma from "@/lib/prisma/client"

export const metadata = {
  title: "Pricing & Plans - Affordable Premium File Tools | InstantTool",
  description: "Choose the perfect plan for your needs. Use credits for flexible usage or subscribe for unlimited batch processing with InstantTool.",
  alternates: {
    canonical: "https://instant-tool.vercel.app/pricing"
  }
};

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceMonthly: 'asc' }
  })

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "InstantTool Pricing",
    "description": "Affordable Premium File Tools. Choose the perfect plan for your needs.",
    "mainEntity": {
      "@type": "OfferCatalog",
      "name": "InstantTool Plans",
      "itemListElement": plans.map((plan, index) => ({
        "@type": "OfferCatalog",
        "name": plan.name,
        "position": index + 1,
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": plan.name,
              "description": plan.description || ""
            },
            "price": plan.priceMonthly,
            "priceCurrency": "USD"
          }
        ]
      }))
    }
  }

  return (
    <div className="py-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. Pay with credits for flexible usage, or subscribe for heavy, unlimited batch processing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans.map((plan) => {
            const isPro = plan.name.toLowerCase() === 'pro'
            
            return (
              <Card key={plan.id} className={`flex flex-col relative ${isPro ? 'border-blue-200 shadow-xl scale-105 z-10' : 'border-slate-200'}`}>
                {isPro && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className={isPro ? "text-blue-600" : ""}>{plan.name}</CardTitle>
                  {plan.description && <CardDescription>{plan.description}</CardDescription>}
                  <div className="mt-4 text-4xl font-bold">${plan.priceMonthly}<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm text-slate-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0" /> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={plan.priceMonthly === 0 ? "/auth/register" : "/dashboard/billing"} className="w-full">
                    <Button 
                      className={`w-full ${isPro ? 'bg-blue-600 hover:bg-blue-700 text-white' : plan.priceMonthly === 0 ? '' : 'bg-slate-900 hover:bg-slate-800 text-white'}`} 
                      variant={plan.priceMonthly === 0 ? "outline" : "default"}
                    >
                      {plan.priceMonthly === 0 ? "Sign Up Free" : `Choose ${plan.name}`}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* AdSense Slot */}
        <div className="max-w-3xl mx-auto mb-20">
          <AdSlot slotId="pricing-middle-slot" />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h2 className="text-center">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-semibold text-lg">How do credits work?</h3>
              <p className="text-slate-600 mt-2">Every time you use a tool, a specific number of credits is deducted from your balance. For example, compressing a PDF costs 2 credits, while converting a video might cost 10 credits. If a job fails, your credits are fully refunded.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Can I buy credits without a subscription?</h3>
              <p className="text-slate-600 mt-2">Yes! We offer Pay-As-You-Go credit packs that you can purchase anytime from your dashboard. These credits never expire.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">What happens to my files after processing?</h3>
              <p className="text-slate-600 mt-2">All uploaded and processed files are securely encrypted and automatically deleted from our servers after 2 hours to ensure your privacy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
