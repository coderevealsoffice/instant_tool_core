"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Scissors, Video, Clock, Loader2, CheckCircle } from "lucide-react"
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

export function VideoTrimCanvas() {
  const { files } = useWorkspaceStore()
  const [startTime, setStartTime] = useState("00:00:00")
  const [endTime, setEndTime] = useState("00:00:10")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rangeStart, setRangeStart] = useState(0)
  const [rangeEnd, setRangeEnd] = useState(10)
  const videoRef = useRef<HTMLVideoElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const activeFile = files?.[0]?.file ?? null

  useEffect(() => {
    if (!activeFile) return
    const url = URL.createObjectURL(activeFile)
    objectUrlRef.current = url
    const video = videoRef.current
    if (!video) return
    video.src = url
    video.onloadedmetadata = () => {
      const d = video.duration
      setDuration(d)
      setRangeEnd(d)
      setEndTime(formatTime(d))
    }
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [activeFile])

  useEffect(() => { setStartTime(formatTime(rangeStart)) }, [rangeStart])
  useEffect(() => { setEndTime(formatTime(rangeEnd)) }, [rangeEnd])

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <Video className="w-14 h-14 opacity-40" />
        <p className="font-medium">Upload a video file to trim it.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    const start = parseTime(startTime)
    const end = parseTime(endTime)
    if (end <= start) return toast.error("End time must be after start time.")

    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      const ext = activeFile.name.split(".").pop() || "mp4"
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
      const blob = new Blob([data as any], { type: activeFile.type || "video/mp4" })
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
    <div className="flex h-full gap-4">
      {/* Left: Video preview */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-xl overflow-hidden">
        <video ref={videoRef} controls className="w-full flex-1 object-contain" />
        {duration > 0 && (
          <div className="p-3 bg-slate-800 text-center text-slate-300 text-sm">
            Duration: <span className="font-mono font-bold text-white">{formatTime(duration)}</span>
          </div>
        )}
      </div>

      {/* Right: Controls */}
      <div className="w-72 flex flex-col gap-4 shrink-0">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Scissors className="w-5 h-5 text-red-500" /> Video Trimmer
          </h3>

          <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-700 px-3 py-2 rounded-lg truncate">
            {activeFile.name}
          </div>

          {/* Visual trim range */}
          {duration > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Selection: <span className="text-red-500">{formatTime(trimDuration)}</span>
              </label>
              <div className="relative h-6 flex items-center mb-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full relative">
                    <div className="absolute h-2 bg-red-500 rounded-full"
                      style={{ left: `${(rangeStart / duration) * 100}%`, right: `${100 - (rangeEnd / duration) * 100}%` }} />
                  </div>
                </div>
                <input type="range" min={0} max={duration} step={0.5} value={rangeStart}
                  onChange={e => setRangeStart(Math.min(Number(e.target.value), rangeEnd - 1))}
                  className="absolute w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow" />
                <input type="range" min={0} max={duration} step={0.5} value={rangeEnd}
                  onChange={e => setRangeEnd(Math.max(Number(e.target.value), rangeStart + 1))}
                  className="absolute w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow" />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>0:00</span><span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Manual inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Start</label>
              <input type="text" value={startTime}
                onChange={e => { setStartTime(e.target.value); setRangeStart(parseTime(e.target.value)) }}
                placeholder="00:00:00"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 dark:bg-slate-700 dark:text-white transition font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">End</label>
              <input type="text" value={endTime}
                onChange={e => { setEndTime(e.target.value); setRangeEnd(parseTime(e.target.value)) }}
                placeholder="00:00:10"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 dark:bg-slate-700 dark:text-white transition font-mono text-sm" />
            </div>
          </div>

          {/* Seek to start button */}
          {duration > 0 && videoRef.current && (
            <div className="flex gap-2">
              <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = rangeStart }}
                className="flex-1 text-xs py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium transition">
                ⏮ Preview Start
              </button>
              <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = rangeEnd - 3 }}
                className="flex-1 text-xs py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium transition">
                ⏭ Preview End
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500"><span>Trimming...</span><span>{progress}%</span></div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-red-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {isDone && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
              <CheckCircle className="w-4 h-4" /> Video downloaded!
            </div>
          )}

          <button onClick={handleProcess} disabled={isProcessing}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
            {isProcessing ? "Trimming..." : "Trim & Download"}
          </button>
        </div>
      </div>
    </div>
  )
}
