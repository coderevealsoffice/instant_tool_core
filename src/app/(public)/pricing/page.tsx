import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { AdSlot } from "@/components/common/AdSlot"
import prisma from "@/lib/prisma/client"
import { safeDbQuery } from "@/lib/prisma/safe-query"

export const metadata = {
  title: "Pricing & Plans - Pro Subscriptions & Credits | InstantTool",
  description: "Simple, transparent pricing for creators and teams. Access high-capacity PDF processing, batch media conversion, and dedicated AI quotas with InstantTool.",
  alternates: {
    canonical: "https://devigo.cloud/pricing"
  },
  keywords: [
    "InstantTool pricing", "pro file tools", "batch pdf conversion", "ai tool credits",
    "unlimited pdf compressor", "business media tools", "instant tool plans"
  ],
  openGraph: {
    title: "Pricing & Plans - Pro Subscriptions & Credits | InstantTool",
    description: "Simple, transparent pricing for creators and teams. Access high-capacity PDF processing, batch media conversion, and dedicated AI quotas with InstantTool.",
    url: "https://devigo.cloud/pricing",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Plans - Pro Subscriptions & Credits | InstantTool",
    description: "Simple, transparent pricing for creators and teams. Access high-capacity PDF processing, batch media conversion, and dedicated AI quotas with InstantTool.",
  }
};

interface DisplayPlan {
  id: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  priceYearly?: number | null;
  credits: number;
  maxFileSizeMB: number;
  features: string[];
}

const FALLBACK_PLANS: DisplayPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for occasional use and quick daily tasks.",
    priceMonthly: 0,
    priceYearly: 0,
    credits: 50,
    maxFileSizeMB: 50,
    features: ["Access to 100+ basic tools", "Standard processing speed", "Daily credit refills", "Community support"]
  },
  {
    id: "starter",
    name: "Starter",
    description: "Great for freelancers and everyday content creators.",
    priceMonthly: 199,
    priceYearly: 1990,
    credits: 500,
    maxFileSizeMB: 200,
    features: ["Batch file processing", "Faster queue processing", "No watermarks", "Email support"]
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for high-volume creators, teams, and power users.",
    priceMonthly: 499,
    priceYearly: 4990,
    credits: 2000,
    maxFileSizeMB: 1024,
    features: ["High-speed priority queue", "Full AI suite unlocked", "Advanced SEO audit tools", "Priority 24/7 support"]
  },
  {
    id: "business",
    name: "Business",
    description: "Built for agencies and organizations needing scale.",
    priceMonthly: 999,
    priceYearly: 9990,
    credits: 10000,
    maxFileSizeMB: 2048,
    features: ["Unlimited priority queue", "Dedicated API access", "Team collaboration", "Dedicated account manager"]
  }
];

export default async function PricingPage() {
  const dbPlans = await safeDbQuery(
    () => prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' }
    }),
    []
  );

  const plans: DisplayPlan[] = (dbPlans && dbPlans.length > 0) ? dbPlans : FALLBACK_PLANS;

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
              <Card key={plan.id} className={`flex flex-col relative ${isPro ? 'border-emerald-300 dark:border-emerald-700 shadow-xl scale-105 z-10' : 'border-slate-200 dark:border-slate-800'}`}>
                {isPro && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D7FB8E] text-slate-950 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-black/10 shadow-xs">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className={isPro ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""}>{plan.name}</CardTitle>
                  {plan.description && <CardDescription>{plan.description}</CardDescription>}
                  <div className="mt-4 text-4xl font-bold">${plan.priceMonthly}<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={plan.priceMonthly === 0 ? "/auth/register" : "/dashboard/billing"} className="w-full">
                    <Button 
                      className={`w-full rounded-xl font-medium ${isPro ? 'bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 border border-black/10' : plan.priceMonthly === 0 ? 'bg-white dark:bg-slate-900 border border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50' : 'bg-slate-900 hover:bg-slate-800 text-white'}`} 
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
