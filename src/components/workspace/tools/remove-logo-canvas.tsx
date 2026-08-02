"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Eraser, Loader2, CheckCircle, Play } from "lucide-react"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function RemoveLogoCanvas() {
  const { files } = useWorkspaceStore()
  const [x, setX] = useState(10)
  const [y, setY] = useState(10)
  const [w, setW] = useState(120)
  const [h, setH] = useState(60)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null
  const videoUrl = activeFile ? URL.createObjectURL(activeFile) : null
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [videoScale, setVideoScale] = useState({ x: 1, y: 1 })

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [videoUrl])

  const updateScale = () => {
    if (videoRef.current && containerRef.current) {
      const vid = videoRef.current
      // Compute actual rendered dimensions of the video inside the container (assuming object-fit: contain)
      // For simplicity, we make the video width 100% and height auto.
      const scaleX = vid.videoWidth / vid.clientWidth
      const scaleY = vid.videoHeight / vid.clientHeight
      setVideoScale({ x: scaleX, y: scaleY })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top
    setStartPos({ x: clientX, y: clientY })
    setX(Math.round(clientX * videoScale.x))
    setY(Math.round(clientY * videoScale.y))
    setW(0)
    setH(0)
    setIsDrawing(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top
    const newX = Math.min(startPos.x, currentX)
    const newY = Math.min(startPos.y, currentY)
    const newW = Math.abs(currentX - startPos.x)
    const newH = Math.abs(currentY - startPos.y)
    
    setX(Math.round(newX * videoScale.x))
    setY(Math.round(newY * videoScale.y))
    setW(Math.round(newW * videoScale.x))
    setH(Math.round(newH * videoScale.y))
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Eraser className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a video file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      await ffmpeg.writeFile("input.mp4", await fetchFile(activeFile))

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vf", `delogo=x=${x}:y=${y}:w=${w || 1}:h=${h || 1}:show=0`,
        "-c:a", "copy",
        "output.mp4"
      ])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `no-logo-${activeFile.name}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e) {
      console.error(e)
      toast.error("Processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-4 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center shadow-lg shrink-0">
          <Eraser className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Remove Logo from Video</h2>
          <p className="text-sm text-slate-500">Draw a box over the logo to remove it.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1 min-h-0">
        {/* Left Side: Video Preview */}
        <div className="bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner aspect-video">
          {videoUrl && (
            <div 
              ref={containerRef}
              className="relative w-full h-full flex items-center justify-center cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain pointer-events-none"
                autoPlay
                loop
                muted
                playsInline
                onLoadedMetadata={updateScale}
                onResize={updateScale}
              />
              {/* Selection Overlay */}
              <div 
                className="absolute border-2 border-dashed border-red-500 bg-red-500/20 pointer-events-none"
                style={{
                  left: `${x / (videoScale.x || 1)}px`,
                  top: `${y / (videoScale.y || 1)}px`,
                  width: `${w / (videoScale.x || 1)}px`,
                  height: `${h / (videoScale.y || 1)}px`,
                }}
              />
            </div>
          )}
        </div>

        {/* Right Side: Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Video File</label>
            <div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg truncate">{activeFile.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "X (left)", val: x, set: setX },
              { label: "Y (top)", val: y, set: setY },
              { label: "Width", val: w, set: setW },
              { label: "Height", val: h, set: setH },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
                <input
                  type="number" value={val} onChange={e => set(Number(e.target.value))}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
                />
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400 text-xs">
            Tip: You can visually select the logo area by drawing a box on the video preview.
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500"><span>Processing…</span><span>{progress}%</span></div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-slate-700 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {isDone && <div className="flex items-center space-x-2 text-emerald-600"><CheckCircle className="w-5 h-5" /><span className="font-semibold">Done! File downloaded.</span></div>}

          <button onClick={handleProcess} disabled={isProcessing || w === 0 || h === 0}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            <span>{isProcessing ? "Processing..." : "Remove Logo & Download"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
