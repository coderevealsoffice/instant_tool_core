import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Engineering Support | InstantTool",
  description: "Get in touch with the InstantTool and Techyfe engineering team for technical support, business partnerships, API inquiries, or data compliance requests.",
  alternates: {
    canonical: "https://devigo.cloud/contact",
  },
  keywords: [
    "Contact InstantTool", "Techyfe contact", "developer support", "api inquiries",
    "customer service", "data protection contact", "report a bug"
  ],
  openGraph: {
    title: "Contact Us & Engineering Support | InstantTool",
    description: "Get in touch with the InstantTool and Techyfe engineering team for technical support, business partnerships, API inquiries, or data compliance requests.",
    url: "https://devigo.cloud/contact",
    siteName: "InstantTool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us & Engineering Support | InstantTool",
    description: "Get in touch with the InstantTool and Techyfe engineering team for technical support, business partnerships, API inquiries, or data compliance requests.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
