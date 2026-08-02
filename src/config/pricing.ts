export type CreditPack = {
  id: string
  title: string
  credits: number
  priceINR: number
  isPopular?: boolean
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "pack_starter",
    title: "Starter Pack",
    credits: 100,
    priceINR: 99,
  },
  {
    id: "pack_pro",
    title: "Pro Pack",
    credits: 500,
    priceINR: 299,
    isPopular: true
  },
  {
    id: "pack_ultra",
    title: "Ultra Pack",
    credits: 2000,
    priceINR: 999,
  }
]
