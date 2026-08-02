import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileDown, FilePlus, FileMinus, Key, FileSignature } from "lucide-react"
import { AdSlot } from "@/components/common/AdSlot"

const pdfTools = [
  { slug: "compress-pdf", title: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: <FileDown className="w-6 h-6" /> },
  { slug: "merge-pdf", title: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: <FilePlus className="w-6 h-6" /> },
  { slug: "split-pdf", title: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: <FileMinus className="w-6 h-6" /> },
  { slug: "protect-pdf", title: "Protect PDF", description: "Encrypt your PDF with a password to keep sensitive data confidential.", icon: <Key className="w-6 h-6" /> },
  { slug: "sign-pdf", title: "Sign PDF", description: "Add your signature to your PDF document easily.", icon: <FileSignature className="w-6 h-6" /> },
  { slug: "pdf-to-word", title: "PDF to Word", description: "Convert your PDF to an editable Word document (DOCX).", icon: <FileText className="w-6 h-6" /> },
]


export const metadata = {
  title: "Free Online PDF Tools - Merge, Split, Compress & Edit | InstantTool",
  description: "The ultimate suite of free online PDF tools. Easily merge, split, compress, convert, and edit your PDF documents securely in seconds.",
  alternates: {
    canonical: "https://devigo.cloud/pdf-tools"
  }
};

export default function PDFToolsCategoryPage() {
  return (
    <div className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            PDF Tools
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Make use of our collection of PDF tools to process digital documents and streamline your workflow seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {pdfTools.map((tool) => (
            <Link key={tool.slug} href={`/pdf-tools/${tool.slug}`}>
              <Card className="hover:shadow-lg transition-shadow border-slate-200 cursor-pointer h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                    {tool.icon}
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* AdSense Slot */}
        <div className="max-w-4xl mx-auto mb-20">
          <AdSlot slotId="pdf-category-middle-slot" />
        </div>

        {/* SEO Content Block */}
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h2>Everything You Need for PDF Management</h2>
          <p>
            Our comprehensive suite of PDF tools is designed to help professionals, students, and businesses handle documents efficiently. Whether you need to compress a large report to send via email, or merge several invoices into a single file, our tools perform these tasks in seconds.
          </p>
          <h3>How it Works</h3>
          <p>
            Simply select the tool you need from the grid above, upload your file securely, and let our powerful cloud servers do the heavy lifting. Once processing is complete, you can download your optimized file instantly.
          </p>
          <h3>Why Use Our PDF Tools?</h3>
          <ul>
            <li><strong>Security First:</strong> All files are encrypted during transfer and automatically deleted from our servers shortly after processing.</li>
            <li><strong>High Quality:</strong> Our compression and conversion algorithms ensure you get the best possible output quality.</li>
            <li><strong>Fast Processing:</strong> No more waiting. Our infrastructure is optimized for speed, even for large documents.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
