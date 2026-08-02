"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Book, Loader2, CheckCircle, Play, ArrowRight, FileWarning } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import JSZip from "jszip"
import { toast } from "sonner"

export function EbookConverterCanvas() {
  const { files } = useWorkspaceStore()
  const [targetFormat, setTargetFormat] = useState<"epub" | "txt" | "html">("epub")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null
  const inputExt = activeFile?.name.split(".").pop()?.toLowerCase() || "unknown"

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <Book className="w-12 h-12 opacity-50" />
        <p>Upload an eBook or document file to convert.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")

      // Extract text content from the file
      let extractedText = ""

      if (inputExt === "pdf") {
        setProgress(15)
        const pdfjsLib = await import("pdfjs-dist")
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
        const arrayBuffer = await activeFile.arrayBuffer()
        const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
        const total = pdfDoc.numPages
        for (let i = 1; i <= total; i++) {
          const page = await pdfDoc.getPage(i)
          const content = await page.getTextContent()
          extractedText += content.items.map((item: any) => item.str).join(" ") + "\n\n"
          setProgress(15 + Math.round((i / total) * 50))
        }
      } else {
        // For EPUB (zip), TXT, HTML — try to extract text
        if (inputExt === "epub") {
          setProgress(20)
          const zip = new JSZip()
          const loaded = await zip.loadAsync(activeFile)
          const htmlFiles = Object.keys(loaded.files).filter(n => n.endsWith(".html") || n.endsWith(".xhtml") || n.endsWith(".htm"))
          let combined = ""
          for (const htmlFile of htmlFiles) {
            const content = await loaded.files[htmlFile].async("string")
            combined += content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ") + "\n\n"
          }
          extractedText = combined.trim()
        } else {
          extractedText = await activeFile.text()
        }
        setProgress(60)
      }

      if (!extractedText.trim()) throw new Error("Could not extract text content from this file.")

      setProgress(70)
      let outputBlob: Blob
      let outputExt = targetFormat

      if (targetFormat === "txt") {
        outputBlob = new Blob([extractedText], { type: "text/plain" })
      } else if (targetFormat === "html") {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${baseName}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.8; color: #333; }
    p { margin-bottom: 1.2em; }
  </style>
</head>
<body>
  ${extractedText.split("\n\n").map(p => p.trim() ? `<p>${p.trim()}</p>` : "").join("\n  ")}
</body>
</html>`
        outputBlob = new Blob([html], { type: "text/html" })
      } else {
        // EPUB: create minimal valid EPUB (zip-based)
        const zip = new JSZip()
        zip.file("mimetype", "application/epub+zip")
        zip.file("META-INF/container.xml", `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`)
        zip.file("OEBPS/content.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${baseName}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="uid">instant-tool-${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="chapter" href="chapter.html" media-type="application/xhtml+xml"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx"><itemref idref="chapter"/></spine>
</package>`)
        zip.file("OEBPS/chapter.html", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${baseName}</title></head>
<body>${extractedText.split("\n\n").map(p => `<p>${p.trim()}</p>`).join("")}</body>
</html>`)
        zip.file("OEBPS/toc.ncx", `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head><meta name="dtb:uid" content="instant-tool"/><meta name="dtb:depth" content="1"/></head>
  <docTitle><text>${baseName}</text></docTitle>
  <navMap><navPoint id="nav1" playOrder="1"><navLabel><text>Content</text></navLabel><content src="chapter.html"/></navPoint></navMap>
</ncx>`)
        outputBlob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" })
      }

      setProgress(95)
      const url = URL.createObjectURL(outputBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${baseName}.${outputExt}`
      a.click()
      URL.revokeObjectURL(url)

      setProgress(100)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Conversion failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="Ebook Converter"
      description="Ebook Converter"
      icon={<Book className="w-6 h-6 text-yellow-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert Ebook"
      resultUrl={undefined}
      
    />
  )
}
