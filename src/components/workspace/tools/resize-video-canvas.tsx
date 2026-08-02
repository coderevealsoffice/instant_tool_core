"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Maximize, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const PRESETS = [
  { label: "1920×1080 (Full HD)", value: "1920:1080" },
  { label: "1280×720 (HD)", value: "1280:720" },
  { label: "854×480 (480p)", value: "854:480" },
  { label: "640×360 (360p)", value: "640:360" },
  { label: "3840×2160 (4K)", value: "3840:2160" },
  { label: "Custom", value: "custom" },
]

export function ResizeVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [preset, setPreset] = useState("1280:720")
  const [customW, setCustomW] = useState(1280)
  const [customH, setCustomH] = useState(720)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Maximize className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a video file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    const scale = preset === "custom" ? `${customW}:${customH}` : preset
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      await ffmpeg.writeFile("input.mp4", await fetchFile(activeFile))
      await ffmpeg.exec(["-i", "input.mp4", "-vf", `scale=${scale}`, "-c:a", "copy", "output.mp4"])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `resized-${activeFile.name}`
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

  return (
    <ToolSplitView
      title="Resize Video"
      description="Resize Video"
      icon={<Maximize className="w-6 h-6 text-amber-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Resize & Download"
      resultUrl={undefined}
      customSettings={<><div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Resolution</label>
          <select value={preset} onChange={e => setPreset(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white">
            {PRESETS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        {preset === "custom" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Width (px)</label>
              <input type="number" value={customW} onChange={e => setCustomW(Number(e.target.value))}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Height (px)</label>
              <input type="number" value={customH} onChange={e => setCustomH(Number(e.target.value))}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white" />
            </div>
          </div>
        )}</>}
    />
  )
}
