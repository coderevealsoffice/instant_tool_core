import Razorpay from "razorpay"
import crypto from "crypto"

// Ensure credentials exist
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("Razorpay environment variables are missing.")
}

export const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export function verifyPaymentSignature(
  orderId: string, 
  paymentId: string, 
  signature: string, 
  secret: string
): boolean {
  const body = orderId + "|" + paymentId
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex")

  return expectedSignature === signature
}
