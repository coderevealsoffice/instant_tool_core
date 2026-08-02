import { getAdSlots } from "./ads-actions"
import AdsClient from "./AdsClient"

export const metadata = {
  title: "Ad Placements - Admin"
}

export default async function AdsPage() {
  const slots = await getAdSlots()
  
  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
      <AdsClient initialSlots={slots} />
    </div>
  )
}
