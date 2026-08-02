import { PDFDocument } from 'pdf-lib'

/**
 * Merges multiple PDF files into a single Blob.
 * 
 * @param files Array of PDF Files
 * @returns Blob of the merged PDF
 */
export async function mergePdfs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create()

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
    
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page)
    })
  }

  const mergedPdfBytes = await mergedPdf.save()
  return new Blob([mergedPdfBytes as any], { type: 'application/pdf' })
}
