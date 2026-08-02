"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { toast } from "sonner"
import {
  Type, Upload, X, Download, 
  CheckCircle, Loader2, Move, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, FileEdit, Trash2, Edit3, Image as ImageIcon
} from "lucide-react"

// pdfjs-dist will be loaded dynamically to avoid SSR issues
let pdfjsLib: any = null

type TextItem = {
  id: string
  text: string
  fontFamily: string
  fontSize: number
  color: string
  x: number
  y: number
  width: number
  height: number
  page: number
}

type ImageItem = {
  id: string
  imageData: string // Data URL
  x: number
  y: number
  width: number
  height: number
  page: number
}

export function EditPdfCanvas() {
  const { files } = useWorkspaceStore()
  const activeFile = files?.[0]?.file ?? null

  // PDF rendering state
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.2)
  const [pdfWidth, setPdfWidth] = useState(0)
  const [pdfHeight, setPdfHeight] = useState(0)
  const [isLoadingPdf, setIsLoadingPdf] = useState(false)

  // Edit state
  const [texts, setTexts] = useState<TextItem[]>([])
  const [images, setImages] = useState<ImageItem[]>([])
  const [showTextModal, setShowTextModal] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [textFontSize, setTextFontSize] = useState(24)
  const [textFontFamily, setTextFontFamily] = useState("Helvetica")
  
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  // Drawing state
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null)

  // Drag state
  const dragging = useRef<{ id: string; type: "text" | "image"; startX: number; startY: number; elemX: number; elemY: number } | null>(null)

  // Download state
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  // Load pdfjs
  useEffect(() => {
    const load = async () => {
      if (!pdfjsLib) {
        const pdfjs = await import("pdfjs-dist")
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        pdfjsLib = pdfjs
      }
    }
    load()
  }, [])

  // Load PDF when file changes
  useEffect(() => {
    if (!activeFile) return
    const loadPdf = async () => {
      if (!pdfjsLib) {
        const pdfjs = await import("pdfjs-dist")
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        pdfjsLib = pdfjs
      }
      setIsLoadingPdf(true)
      const ab = await activeFile.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: ab }).promise
      setPdfDoc(doc)
      setTotalPages(doc.numPages)
      setCurrentPage(1)
      setTexts([])
      setImages([])
      setIsLoadingPdf(false)
    }
    loadPdf()
  }, [activeFile])

  const renderTaskRef = useRef<any>(null)

  // Render current PDF page
  useEffect(() => {
    if (!pdfDoc || !pdfCanvasRef.current) return
    let isCancelled = false

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage)
        if (isCancelled) return

        const viewport = page.getViewport({ scale })
        const canvas = pdfCanvasRef.current!
        
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel()
        }

        const ctx = canvas.getContext("2d")!
        canvas.width = viewport.width
        canvas.height = viewport.height
        setPdfWidth(viewport.width)
        setPdfHeight(viewport.height)
        
        const renderTask = page.render({ canvasContext: ctx, viewport })
        renderTaskRef.current = renderTask
        
        await renderTask.promise
      } catch (err: any) {
        if (err.name !== "RenderingCancelledException") {
          console.error("PDF render error:", err)
        }
      }
    }
    renderPage()

    return () => {
      isCancelled = true
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
        renderTaskRef.current = null
      }
    }
  }, [pdfDoc, currentPage, scale])

  // ─── Add Elements ────────────────────────────────────────────────────────────
  const addText = () => {
    if (!textInput.trim()) return
    const newText: TextItem = {
      id: crypto.randomUUID(),
      text: textInput,
      fontFamily: textFontFamily,
      fontSize: textFontSize,
      color: textColor,
      x: 80,
      y: 80,
      width: textInput.length * textFontSize * 0.6 + 20, // rough estimate
      height: textFontSize * 1.5,
      page: currentPage,
    }
    setTexts(prev => [...prev, newText])
    setShowTextModal(false)
    setTextInput("")
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // scale down large images
        let w = img.width
        let h = img.height
        const maxW = 300
        if (w > maxW) {
          h = (maxW / w) * h
          w = maxW
        }
        
        const newImg: ImageItem = {
          id: crypto.randomUUID(),
          imageData: e.target!.result as string,
          x: 80,
          y: 80,
          width: w,
          height: h,
          page: currentPage
        }
        setImages(prev => [...prev, newImg])
      }
      img.src = e.target!.result as string
    }
    reader.readAsDataURL(file)
  }

  const deleteElement = (id: string, type: "text" | "image") => {
    if (type === "text") {
      setTexts(prev => prev.filter(t => t.id !== id))
    } else {
      setImages(prev => prev.filter(i => i.id !== id))
    }
    if (selectedElementId === id) setSelectedElementId(null)
  }

  // ─── Drag Elements ─────────────────────────────────────────────────────────
  const onMouseDownElem = (e: React.MouseEvent, id: string, type: "text" | "image", x: number, y: number) => {
    e.stopPropagation()
    setSelectedElementId(id)
    dragging.current = { id, type, startX: e.clientX, startY: e.clientY, elemX: x, elemY: y }
  }

  const onMouseMoveElem = useCallback((e: MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - dragging.current.startX
    const dy = e.clientY - dragging.current.startY
    const { id, type, elemX, elemY } = dragging.current

    if (type === "text") {
      setTexts(prev => prev.map(t => t.id === id ? { ...t, x: Math.max(0, elemX + dx), y: Math.max(0, elemY + dy) } : t))
    } else {
      setImages(prev => prev.map(i => i.id === id ? { ...i, x: Math.max(0, elemX + dx), y: Math.max(0, elemY + dy) } : i))
    }
  }, [])

  const onMouseUpElem = useCallback(() => { dragging.current = null }, [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMoveElem)
    window.addEventListener("mouseup", onMouseUpElem)
    return () => {
      window.removeEventListener("mousemove", onMouseMoveElem)
      window.removeEventListener("mouseup", onMouseUpElem)
    }
  }, [onMouseMoveElem, onMouseUpElem])

  // Helper to convert hex color to RGB from 0-1
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    return { r, g, b }
  }

  // ─── Download Edited PDF ──────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!activeFile || (texts.length === 0 && images.length === 0)) return
    setIsDownloading(true)
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib")

      const existingPdfBytes = await activeFile.arrayBuffer()
      const pdfLibDoc = await PDFDocument.load(existingPdfBytes)

      // Embed fonts
      const fonts = {
        Helvetica: await pdfLibDoc.embedFont(StandardFonts.Helvetica),
        TimesRoman: await pdfLibDoc.embedFont(StandardFonts.TimesRoman),
        Courier: await pdfLibDoc.embedFont(StandardFonts.Courier),
      }

      // Add Texts
      for (const t of texts) {
        const pageIndex = t.page - 1
        const page = pdfLibDoc.getPage(pageIndex)
        const { height: pageHeight } = page.getSize()

        const pdfX = t.x / scale
        // pdfjs Y is top-down, pdf-lib Y is bottom-up. Also account for font ascender.
        const pdfY = pageHeight - (t.y / scale) - (t.fontSize / scale * 0.8)

        const color = hexToRgb(t.color)

        page.drawText(t.text, {
          x: pdfX,
          y: pdfY,
          size: t.fontSize / scale,
          font: fonts[t.fontFamily as keyof typeof fonts] || fonts.Helvetica,
          color: rgb(color.r, color.g, color.b),
        })
      }

      // Add Images
      for (const img of images) {
        const pageIndex = img.page - 1
        const page = pdfLibDoc.getPage(pageIndex)
        const { height: pageHeight } = page.getSize()

        const imgBytes = await fetch(img.imageData).then(r => r.arrayBuffer())
        
        let pdfImage;
        if (img.imageData.startsWith("data:image/png")) {
          pdfImage = await pdfLibDoc.embedPng(imgBytes)
        } else {
          pdfImage = await pdfLibDoc.embedJpg(imgBytes)
        }

        const pdfX = img.x / scale
        const pdfY = pageHeight - (img.y / scale) - (img.height / scale)
        const pdfW = img.width / scale
        const pdfH = img.height / scale

        page.drawImage(pdfImage, {
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
        })
      }

      const editedBytes = await pdfLibDoc.save()
      const blob = new Blob([editedBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = activeFile.name.replace(".pdf", "-edited.pdf")
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate edited PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  // ─── No file state ────────────────────────────────────────────────────────────
  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
        <FileEdit className="w-14 h-14 opacity-40" />
        <p className="text-base font-medium">Upload a PDF file to edit it</p>
      </div>
    )
  }

  const textsOnPage = texts.filter(t => t.page === currentPage)
  const imagesOnPage = images.filter(i => i.page === currentPage)

  return (
    <div className="flex h-full gap-4">
      {/* ── Left: PDF Preview Area ─────────────────────────── */}
      <div className="flex-1 flex flex-col items-center overflow-auto bg-slate-100 dark:bg-slate-900 rounded-xl p-4 relative">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-0 z-10 w-full justify-between flex-wrap gap-y-2">
          {/* Page navigation */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-500">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-500 w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3, s + 0.2))}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-500">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Add actions */}
          <div className="flex gap-2">
            <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer">
              <ImageIcon className="w-4 h-4" /> Add Image
              <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => {
                if (e.target.files?.[0]) handleImageUpload(e.target.files[0])
              }} />
            </label>
            <button onClick={() => setShowTextModal(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition">
              <Type className="w-4 h-4" /> Add Text
            </button>
          </div>
        </div>

        {/* PDF Canvas + Overlays */}
        <div className="relative inline-block select-none" onClick={() => setSelectedElementId(null)}>
          {isLoadingPdf ? (
            <div className="flex items-center justify-center w-[600px] h-[800px] bg-white dark:bg-slate-800 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : (
            <canvas ref={pdfCanvasRef} className="rounded-lg shadow-xl block" />
          )}

          {/* Texts on page */}
          {textsOnPage.map(t => (
            <div
              key={t.id}
              style={{ left: t.x, top: t.y, fontFamily: t.fontFamily, fontSize: `${t.fontSize}px`, color: t.color, whiteSpace: 'nowrap' }}
              className={`absolute cursor-move group border-2 rounded transition-all z-50 px-1 py-0.5 ${selectedElementId === t.id ? "border-blue-500 shadow-lg ring-4 ring-blue-500/20 bg-blue-500/5" : "border-transparent hover:border-slate-300 bg-transparent"}`}
              onMouseDown={(e) => onMouseDownElem(e, t.id, "text", t.x, t.y)}
            >
              {t.text}
              <button onClick={(e) => { e.stopPropagation(); deleteElement(t.id, "text") }}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Images on page */}
          {imagesOnPage.map(img => (
            <div
              key={img.id}
              style={{ left: img.x, top: img.y, width: img.width, height: img.height }}
              className={`absolute cursor-move group border-2 rounded transition-all z-50 ${selectedElementId === img.id ? "border-blue-500 shadow-lg ring-4 ring-blue-500/20 bg-blue-500/5" : "border-slate-300 dark:border-slate-600 hover:border-blue-400 bg-white/10"}`}
              onMouseDown={(e) => onMouseDownElem(e, img.id, "image", img.x, img.y)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageData} alt="added" className="w-full h-full object-contain pointer-events-none drop-shadow-md" />
              
              <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-600 border-2 border-white rounded-full cursor-se-resize shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  const startX = e.clientX, startY = e.clientY
                  const startW = img.width, startH = img.height
                  const onMove = (ev: MouseEvent) => {
                    setImages(prev => prev.map(i => i.id === img.id
                      ? { ...i, width: Math.max(30, startW + ev.clientX - startX), height: Math.max(30, startH + ev.clientY - startY) }
                      : i
                    ))
                  }
                  const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
                  window.addEventListener("mousemove", onMove)
                  window.addEventListener("mouseup", onUp)
                }}
              />
              <button onClick={(e) => { e.stopPropagation(); deleteElement(img.id, "image") }}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Actions Panel ───────────────────────────── */}
      <div className="w-64 flex flex-col gap-4 shrink-0">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-red-500" /> Edit PDF
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Add text annotations or insert images. Drag them into position, resize images with the corner handle, then download.
          </p>
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-2"><Move className="w-3.5 h-3.5 text-blue-400" /> Drag to position</div>
            <div className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5 text-red-400" /> Hover to delete</div>
          </div>

          <button onClick={() => setShowTextModal(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition">
            <Type className="w-4 h-4" /> Add Text
          </button>
        </div>

        {/* Elements list */}
        {(texts.length > 0 || images.length > 0) && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Added Elements
            </h4>
            {texts.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                <span className="truncate max-w-[120px]">T: {t.text} (Pg {t.page})</span>
                <button onClick={() => deleteElement(t.id, "text")} className="text-red-400 hover:text-red-600 transition shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {images.map((img, i) => (
              <div key={img.id} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                <span>Image (Pg {img.page})</span>
                <button onClick={() => deleteElement(img.id, "image")} className="text-red-400 hover:text-red-600 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Download */}
        {(texts.length > 0 || images.length > 0) && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            {isDone && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-3 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4" /> Edited PDF Downloaded!
              </div>
            )}
            <button onClick={handleDownload} disabled={isDownloading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition">
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isDownloading ? "Processing..." : "Download PDF"}
            </button>
          </div>
        )}
      </div>

      {/* ── Text Creation Modal ───────────────────────── */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Text</h2>
              <button onClick={() => setShowTextModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Text content</label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text..."
                  autoFocus
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Font Family</label>
                  <select value={textFontFamily} onChange={(e) => setTextFontFamily(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-slate-800 dark:text-white">
                    <option value="Helvetica">Helvetica</option>
                    <option value="TimesRoman">Times Roman</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Font Size</label>
                  <input type="number" min="8" max="72" value={textFontSize} onChange={(e) => setTextFontSize(Number(e.target.value))}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-slate-800 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
                  <span className="text-sm font-mono text-slate-500">{textColor}</span>
                </div>
              </div>

              <button onClick={addText} disabled={!textInput.trim()}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition mt-4">
                Add to PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
