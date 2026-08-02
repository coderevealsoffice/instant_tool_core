"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { RotateCw, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const ROTATIONS = [
  { label: "90° Clockwise", value: "transpose=1" },
  { label: "90° Counter-Clockwise", value: "transpose=2" },
  { label: "180°", value: "transpose=2,transpose=2" },
]

export function RotateVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [rotation, setRotation] = useState(ROTATIONS[0].value)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <RotateCw className="w-12 h-12 mb-4 opacity-50" />
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
      await ffmpeg.exec(["-i", "input.mp4", "-vf", rotation, "-c:a", "copy", "output.mp4"])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rotated-${activeFile.name}`
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
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Rotation</label>
      <div className="grid grid-cols-1 gap-3">
        {ROTATIONS.map(r => (
          <button
            key={r.value}
            onClick={() => setRotation(r.value)}
            className={`py-3 rounded-xl border text-sm font-semibold transition-all ${rotation === r.value ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-orange-400"}`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Rotate Video"
      description="Rotate your video to the correct orientation quickly."
      icon={<RotateCw className="w-6 h-6 text-orange-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Rotate & Download"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
