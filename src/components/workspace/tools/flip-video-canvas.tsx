"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FlipHorizontal, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const FLIPS = [
  { label: "Horizontal Flip (Mirror)", value: "hflip", desc: "Flip left-right like a mirror" },
  { label: "Vertical Flip (Upside Down)", value: "vflip", desc: "Flip top-bottom" },
  { label: "Both (Rotate 180°)", value: "hflip,vflip", desc: "Flip on both axes" },
]

export function FlipVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [flip, setFlip] = useState(FLIPS[0].value)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <FlipHorizontal className="w-12 h-12 mb-4 opacity-50" />
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
      await ffmpeg.exec(["-i", "input.mp4", "-vf", flip, "-c:a", "copy", "output.mp4"])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `flipped-${activeFile.name}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e) {
      console.error(e)
      toast.error("Processing failed.")
    } finally {
      setIsProcessing(false)
    }
  }

  const customSettings = (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Flip Direction</label>
      <div className="space-y-3">
        {FLIPS.map(f => (
          <button
            key={f.value}
            onClick={() => setFlip(f.value)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${flip === f.value ? "bg-purple-500 border-purple-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-purple-400"}`}
          >
            <div className="font-semibold">{f.label}</div>
            <div className="text-xs opacity-70 mt-0.5">{f.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Flip Video"
      description="Mirror or flip your video horizontally, vertically, or both."
      icon={<FlipHorizontal className="w-6 h-6 text-purple-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Flip & Download"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
