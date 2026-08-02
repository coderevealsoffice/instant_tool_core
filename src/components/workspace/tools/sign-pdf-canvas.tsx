"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { toast } from "sonner"
import {
  PenTool, Type, Upload, X, Download, RotateCcw,
  CheckCircle, Loader2, Move, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, FileSignature, Trash2
} from "lucide-react"

// pdfjs-dist will be loaded dynamically to avoid SSR issues
let pdfjsLib: any = null

type SignatureMode = "draw" | "type" | "upload"
type SignatureItem = {
  id: string
  imageData: string
  x: number
  y: number
  width: number
  height: number
  page: number
}

export function SignPdfCanvas() {
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

  // Signature state
  const [signatures, setSignatures] = useState<SignatureItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [signatureMode, setSignatureMode] = useState<SignatureMode>("draw")
  const [typedName, setTypedName] = useState("")
  const [typedFont, setTypedFont] = useState("Dancing Script")
  const [selectedSigId, setSelectedSigId] = useState<string | null>(null)

  // Drawing state
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null)
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  // Drag state
  const dragging = useRef<{ id: string; startX: number; startY: number; sigX: number; sigY: number } | null>(null)

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
      setSignatures([])
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

  // ─── Drawing handlers ───────────────────────────────────────────────────────
  const startDraw = (e: React.MouseEvent) => {
    isDrawing.current = true
    const rect = drawingCanvasRef.current!.getBoundingClientRect()
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing.current || !drawingCanvasRef.current) return
    const rect = drawingCanvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = drawingCanvasRef.current.getContext("2d")!
    ctx.strokeStyle = "#1a1a2e"
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastPos.current = { x, y }
  }

  const stopDraw = () => { isDrawing.current = false }

  const clearDrawing = () => {
    if (!drawingCanvasRef.current) return
    const ctx = drawingCanvasRef.current.getContext("2d")!
    ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height)
  }

  // ─── Add Signature to PDF overlay ────────────────────────────────────────────
  const addSignatureFromDrawing = () => {
    if (!drawingCanvasRef.current) return
    const dataUrl = drawingCanvasRef.current.toDataURL("image/png")
    placeSignature(dataUrl)
  }

  const addSignatureFromType = () => {
    if (!typedName.trim()) return
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 120
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, 400, 120)
    ctx.font = `72px '${typedFont}', cursive`
    ctx.fillStyle = "#1a1a2e"
    ctx.textBaseline = "middle"
    ctx.fillText(typedName, 10, 60)
    placeSignature(canvas.toDataURL("image/png"))
  }

  const addSignatureFromUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => placeSignature(e.target!.result as string)
    reader.readAsDataURL(file)
  }

  const placeSignature = (imageData: string) => {
    const newSig: SignatureItem = {
      id: crypto.randomUUID(),
      imageData,
      x: 80,
      y: 80,
      width: 200,
      height: 80,
      page: currentPage,
    }
    setSignatures(prev => [...prev, newSig])
    setShowModal(false)
    setTypedName("")
    clearDrawing()
  }

  const deleteSig = (id: string) => {
    setSignatures(prev => prev.filter(s => s.id !== id))
    if (selectedSigId === id) setSelectedSigId(null)
  }

  // ─── Drag signatures ─────────────────────────────────────────────────────────
  const onMouseDownSig = (e: React.MouseEvent, sig: SignatureItem) => {
    e.stopPropagation()
    setSelectedSigId(sig.id)
    dragging.current = { id: sig.id, startX: e.clientX, startY: e.clientY, sigX: sig.x, sigY: sig.y }
  }

  const onMouseMoveSig = useCallback((e: MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - dragging.current.startX
    const dy = e.clientY - dragging.current.startY
    setSignatures(prev => prev.map(s => s.id === dragging.current!.id
      ? { ...s, x: Math.max(0, dragging.current!.sigX + dx), y: Math.max(0, dragging.current!.sigY + dy) }
      : s
    ))
  }, [])

  const onMouseUpSig = useCallback(() => { dragging.current = null }, [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMoveSig)
    window.addEventListener("mouseup", onMouseUpSig)
    return () => {
      window.removeEventListener("mousemove", onMouseMoveSig)
      window.removeEventListener("mouseup", onMouseUpSig)
    }
  }, [onMouseMoveSig, onMouseUpSig])

  // ─── Download signed PDF ──────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!activeFile || signatures.length === 0) return
    setIsDownloading(true)
    try {
      const { PDFDocument } = await import("pdf-lib")

      const existingPdfBytes = await activeFile.arrayBuffer()
      const pdfLibDoc = await PDFDocument.load(existingPdfBytes)

      for (const sig of signatures) {
        const pageIndex = sig.page - 1
        const page = pdfLibDoc.getPage(pageIndex)
        const { width: pageWidth, height: pageHeight } = page.getSize()

        // Embed the signature image
        const imgBytes = await fetch(sig.imageData).then(r => r.arrayBuffer())
        const pngImage = await pdfLibDoc.embedPng(imgBytes)

        // Convert pixel coords from preview to PDF coords
        // The PDF canvas was rendered at `scale`, so divide by scale to get pdf coords
        const pdfX = (sig.x / scale)
        // pdfjs Y is top-down, pdf-lib Y is bottom-up
        const pdfY = pageHeight - (sig.y / scale) - (sig.height / scale)
        const pdfW = sig.width / scale
        const pdfH = sig.height / scale

        page.drawImage(pngImage, {
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
        })
      }

      const signedBytes = await pdfLibDoc.save()
      const blob = new Blob([signedBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = activeFile.name.replace(".pdf", "-signed.pdf")
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate signed PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  // ─── No file state ────────────────────────────────────────────────────────────
  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
        <FileSignature className="w-14 h-14 opacity-40" />
        <p className="text-base font-medium">Upload a PDF file to sign it</p>
      </div>
    )
  }

  const sigsOnPage = signatures.filter(s => s.page === currentPage)

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

          {/* Add Signature button */}
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition">
            <PenTool className="w-4 h-4" /> Add Signature
          </button>
        </div>

        {/* PDF Canvas + Signature Overlays */}
        <div className="relative inline-block select-none" onClick={() => setSelectedSigId(null)}>
          {isLoadingPdf ? (
            <div className="flex items-center justify-center w-[600px] h-[800px] bg-white dark:bg-slate-800 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <canvas ref={pdfCanvasRef} className="rounded-lg shadow-xl block" />
          )}

          {/* Signature overlays for current page */}
          {sigsOnPage.map(sig => (
            <div
              key={sig.id}
              style={{ left: sig.x, top: sig.y, width: sig.width, height: sig.height }}
              className={`absolute cursor-move group border-2 rounded transition-all z-50 ${selectedSigId === sig.id ? "border-blue-500 shadow-lg ring-4 ring-blue-500/20 bg-blue-500/5" : "border-slate-300 dark:border-slate-600 hover:border-blue-400 bg-white/10"}`}
              onMouseDown={(e) => onMouseDownSig(e, sig)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sig.imageData} alt="signature" className="w-full h-full object-contain pointer-events-none drop-shadow-md" />
              {/* Resize handle */}
              <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-600 border-2 border-white rounded-full cursor-se-resize shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  const startX = e.clientX, startY = e.clientY
                  const startW = sig.width, startH = sig.height
                  const onMove = (ev: MouseEvent) => {
                    setSignatures(prev => prev.map(s => s.id === sig.id
                      ? { ...s, width: Math.max(60, startW + ev.clientX - startX), height: Math.max(24, startH + ev.clientY - startY) }
                      : s
                    ))
                  }
                  const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
                  window.addEventListener("mousemove", onMove)
                  window.addEventListener("mouseup", onUp)
                }}
              />
              {/* Delete button */}
              <button onClick={(e) => { e.stopPropagation(); deleteSig(sig.id) }}
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
            <FileSignature className="w-5 h-5 text-blue-500" /> Sign PDF
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Add your signature visually. Drag it into position, resize with the corner handle, then download.
          </p>
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-2"><Move className="w-3.5 h-3.5 text-blue-400" /> Drag to position</div>
            <div className="flex items-center gap-2"><span className="text-blue-400 font-bold text-[10px]">◢</span> Resize from corner</div>
            <div className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5 text-red-400" /> Hover to delete</div>
          </div>

          <button onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition">
            <PenTool className="w-4 h-4" /> Add Signature
          </button>
        </div>

        {/* Signatures list */}
        {signatures.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Placed ({signatures.length})
            </h4>
            {signatures.map((sig, i) => (
              <div key={sig.id} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                <span>Signature {i + 1} — Page {sig.page}</span>
                <button onClick={() => deleteSig(sig.id)} className="text-red-400 hover:text-red-600 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Download */}
        {signatures.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            {isDone && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-3 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4" /> Signed PDF Downloaded!
              </div>
            )}
            <button onClick={handleDownload} disabled={isDownloading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition">
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isDownloading ? "Processing..." : "Download Signed PDF"}
            </button>
          </div>
        )}
      </div>

      {/* ── Signature Creation Modal ───────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Signature</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {(["draw", "type", "upload"] as SignatureMode[]).map(mode => (
                <button key={mode} onClick={() => setSignatureMode(mode)}
                  className={`flex-1 py-3 text-sm font-semibold capitalize flex items-center justify-center gap-2 transition border-b-2 ${signatureMode === mode ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
                  {mode === "draw" && <PenTool className="w-4 h-4" />}
                  {mode === "type" && <Type className="w-4 h-4" />}
                  {mode === "upload" && <Upload className="w-4 h-4" />}
                  {mode}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-4">
              {/* Draw Mode */}
              {signatureMode === "draw" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Draw your signature below:</p>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                    <canvas
                      ref={drawingCanvasRef}
                      width={440} height={160}
                      className="w-full cursor-crosshair touch-none"
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={stopDraw}
                      onMouseLeave={stopDraw}
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-px bg-slate-300 dark:bg-slate-600 pointer-events-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={clearDrawing}
                      className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <RotateCcw className="w-4 h-4" /> Clear
                    </button>
                    <button onClick={addSignatureFromDrawing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition">
                      Use Signature
                    </button>
                  </div>
                </div>
              )}

              {/* Type Mode */}
              {signatureMode === "type" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="Type your name"
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Font Style</label>
                    <select value={typedFont} onChange={(e) => setTypedFont(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white">
                      <option value="Dancing Script">Dancing Script</option>
                      <option value="Pacifico">Pacifico</option>
                      <option value="Great Vibes">Great Vibes</option>
                      <option value="Satisfy">Satisfy</option>
                      <option value="Caveat">Caveat</option>
                    </select>
                  </div>
                  {/* Preview */}
                  {typedName && (
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 px-6 py-4 flex items-center justify-center min-h-[80px]">
                      <link href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(typedFont)}&display=swap`} rel="stylesheet" />
                      <span style={{ fontFamily: `'${typedFont}', cursive`, fontSize: "2.5rem", color: "#1a1a2e" }}>
                        {typedName}
                      </span>
                    </div>
                  )}
                  <button onClick={addSignatureFromType} disabled={!typedName.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition">
                    Use This Signature
                  </button>
                </div>
              )}

              {/* Upload Mode */}
              {signatureMode === "upload" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Upload a PNG image of your signature (transparent background works best):</p>
                  <label className="block border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition">
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">Click to upload signature image</span>
                    <span className="text-xs text-slate-400 block mt-1">PNG recommended (transparent background)</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) addSignatureFromUpload(file)
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
