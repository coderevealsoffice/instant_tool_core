"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FastForward, Loader2, CheckCircle, Play, Music } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const SPEED_PRESETS = [
  { label: "0.5x", value: 0.5 },
  { label: "0.75x", value: 0.75 },
  { label: "1x (Original)", value: 1.0 },
  { label: "1.25x", value: 1.25 },
  { label: "1.5x", value: 1.5 },
  { label: "2x", value: 2.0 },
]

export function ChangeAudioSpeedCanvas() {
  const { files } = useWorkspaceStore()
  const [speed, setSpeed] = useState(1.5)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <FastForward className="w-14 h-14 opacity-40" />
        <p className="font-medium">Upload an audio file to change its speed.</p>
      </div>
    )
  }

  // FFmpeg atempo filter only accepts values in [0.5, 2.0]
  // For values outside this range, we chain multiple atempo filters
  const buildAtempoFilters = (s: number): string => {
    const filters: string[] = []
    let remaining = s
    while (remaining > 2.0) {
      filters.push("atempo=2.0")
      remaining /= 2.0
    }
    while (remaining < 0.5) {
      filters.push("atempo=0.5")
      remaining /= 0.5
    }
    filters.push(`atempo=${remaining.toFixed(4)}`)
    return filters.join(",")
  }

  const handleProcess = async () => {
    if (speed === 1.0) {
      toast.error("Speed is already 1x. Please choose a different speed.")
      return
    }
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      const ext = activeFile.name.split(".").pop() || "mp3"
      const inputName = `input.${ext}`
      await ffmpeg.writeFile(inputName, await fetchFile(activeFile))

      const atempoChain = buildAtempoFilters(speed)

      await ffmpeg.exec([
        "-i", inputName,
        "-af", atempoChain,
        "-c:a", "libmp3lame",
        "-q:a", "2",
        "output.mp3",
      ])

      const data = await ffmpeg.readFile("output.mp3")
      const blob = new Blob([data as any], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}-${speed}x.mp3`
      a.click()
      URL.revokeObjectURL(url)

      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Processing failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="Change Audio Speed"
      description="Change Audio Speed"
      icon={<FastForward className="w-6 h-6 text-blue-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Change Audio Speed"
      resultUrl={undefined}
      
    />
  )
}
