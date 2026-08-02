import { getFaqs } from "./faq-actions"
import FaqClient from "./FaqClient"

export const metadata = {
  title: "FAQs Management - Super Admin"
}

export default async function FAQsPage() {
  const faqs = await getFaqs()
  
  return (
    <div className="p-8 w-full">
      <FaqClient initialFaqs={faqs} />
    </div>
  )
}
