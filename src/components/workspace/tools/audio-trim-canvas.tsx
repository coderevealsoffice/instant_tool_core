"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Scissors, Music, Clock, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":")
}

function parseTime(str: string): number {
  const parts = str.split(":").map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return parts[0] || 0
}

export function AudioTrimCanvas() {
  const { files } = useWorkspaceStore()
  const [startTime, setStartTime] = useState("00:00:00")
  const [endTime, setEndTime] = useState("00:00:10")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rangeStart, setRangeStart] = useState(0)
  const [rangeEnd, setRangeEnd] = useState(10)
  const audioRef = useRef<HTMLAudioElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const activeFile = files?.[0]?.file ?? null

  // Load audio to get duration and set up preview
  useEffect(() => {
    if (!activeFile) return
    const url = URL.createObjectURL(activeFile)
    objectUrlRef.current = url
    const audio = audioRef.current
    if (!audio) return
    audio.src = url
    audio.onloadedmetadata = () => {
      const d = audio.duration
      setDuration(d)
      setRangeEnd(d)
      setEndTime(formatTime(d))
    }
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [activeFile])

  // Sync range sliders → text inputs
  useEffect(() => { setStartTime(formatTime(rangeStart)) }, [rangeStart])
  useEffect(() => { setEndTime(formatTime(rangeEnd)) }, [rangeEnd])

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <Music className="w-14 h-14 opacity-40" />
        <p className="font-medium">Upload an audio file to trim it.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    const start = parseTime(startTime)
    const end = parseTime(endTime)
    if (end <= start) return toast.error("End time must be after start time.")
    if (start < 0 || (duration > 0 && end > duration)) return toast.error("Times are out of range.")

    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      const ext = activeFile.name.split(".").pop() || "mp3"
      const inputName = `input.${ext}`
      await ffmpeg.writeFile(inputName, await fetchFile(activeFile))

      await ffmpeg.exec([
        "-i", inputName,
        "-ss", startTime,
        "-to", endTime,
        "-c", "copy",
        `output.${ext}`,
      ])

      const data = await ffmpeg.readFile(`output.${ext}`)
      const blob = new Blob([data as any], { type: activeFile.type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `trimmed-${activeFile.name}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Trim failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const trimDuration = Math.max(0, parseTime(endTime) - parseTime(startTime))

  return (
    <ToolSplitView
      title="Audio Trimmer"
      description="Audio Trimmer"
      icon={<Scissors className="w-6 h-6 text-indigo-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Trim & Download"
      resultUrl={undefined}
      
    />
  )
}
