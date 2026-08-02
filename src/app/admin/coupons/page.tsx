import { getCoupons } from "./coupon-actions"
import CouponClient from "./CouponClient"

export const metadata = {
  title: "Coupons Management - Admin"
}

export default async function CouponsPage() {
  const coupons = await getCoupons()
  
  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <CouponClient initialCoupons={coupons} />
    </div>
  )
}
