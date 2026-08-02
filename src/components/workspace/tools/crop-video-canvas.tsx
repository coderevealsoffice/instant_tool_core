"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Crop, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const ASPECT_PRESETS = [
  { label: "16:9 (Widescreen)", value: "iw:iw*9/16" },
  { label: "9:16 (Portrait / TikTok)", value: "iw*9/16:ih" },
  { label: "1:1 (Square / Instagram)", value: "min(iw\\,ih):min(iw\\,ih)" },
  { label: "4:3 (Standard)", value: "iw:iw*3/4" },
  { label: "Custom", value: "custom" },
]

export function CropVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [preset, setPreset] = useState(ASPECT_PRESETS[0].value)
  const [customW, setCustomW] = useState(1280)
  const [customH, setCustomH] = useState(720)
  const [customX, setCustomX] = useState(0)
  const [customY, setCustomY] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Crop className="w-12 h-12 mb-4 opacity-50" />
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

      let cropFilter: string
      if (preset === "custom") {
        cropFilter = `crop=${customW}:${customH}:${customX}:${customY}`
      } else {
        // Center the crop
        cropFilter = `crop=${preset}:(iw-ow)/2:(ih-oh)/2`
      }

      await ffmpeg.exec(["-i", "input.mp4", "-vf", cropFilter, "-c:a", "copy", "output.mp4"])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cropped-${activeFile.name}`
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Crop Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-3">
          {ASPECT_PRESETS.map(p => (
            <button
              key={p.value}
              onClick={() => setPreset(p.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${preset === p.value ? "bg-teal-500 border-teal-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-teal-400"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      {preset === "custom" && (
        <div className="grid grid-cols-2 gap-3">
          {[{ label: "Width", value: customW, set: setCustomW }, { label: "Height", value: customH, set: setCustomH }, { label: "X Offset", value: customX, set: setCustomX }, { label: "Y Offset", value: customY, set: setCustomY }].map(f => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{f.label}</label>
              <input type="number" value={f.value} onChange={e => f.set(Number(e.target.value))} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-800 dark:text-white" />
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <ToolSplitView
      title="Crop Video"
      description="Crop your video to a specific aspect ratio or custom dimensions."
      icon={<Crop className="w-6 h-6 text-teal-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Crop & Download"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
