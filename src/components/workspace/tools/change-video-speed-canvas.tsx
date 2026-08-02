"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FastForward } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const SPEED_PRESETS = [
  { label: "0.25x (Very Slow)", value: 0.25 },
  { label: "0.5x (Slow)", value: 0.5 },
  { label: "1.5x (Fast)", value: 1.5 },
  { label: "2x (2x Speed)", value: 2 },
  { label: "4x (4x Speed)", value: 4 },
]

export function ChangeVideoSpeedCanvas() {
  const { files } = useWorkspaceStore()
  const [speed, setSpeed] = useState(2)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <FastForward className="w-12 h-12 mb-4 opacity-50" />
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

      const ptsFactor = 1 / speed
      let audioFilter = ""
      if (speed <= 2 && speed >= 0.5) {
        audioFilter = `,atempo=${speed}`
      } else if (speed > 2) {
        audioFilter = `,atempo=2.0,atempo=${speed / 2}`
      } else if (speed < 0.5) {
        audioFilter = `,atempo=0.5,atempo=${speed * 2}`
      }

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-filter_complex",
        `[0:v]setpts=${ptsFactor}*PTS[v];[0:a]aresample=async=1${audioFilter}[a]`,
        "-map", "[v]",
        "-map", "[a]",
        "output.mp4"
      ])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${speed}x-${activeFile.name}`
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
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Select Speed</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SPEED_PRESETS.map(p => (
          <button
            key={p.value}
            onClick={() => setSpeed(p.value)}
            className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${speed === p.value ? "bg-yellow-500 border-yellow-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-yellow-400"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Change Video Speed"
      description="Speed up or slow down your video with a single click."
      icon={<FastForward className="w-6 h-6 text-yellow-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Change Speed & Download"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
