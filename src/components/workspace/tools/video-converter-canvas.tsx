"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { MonitorPlay, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const FORMATS = [
  { label: "MP4", value: "mp4", mime: "video/mp4", ext: "mp4" },
  { label: "WEBM", value: "webm", mime: "video/webm", ext: "webm" },
  { label: "MKV", value: "mkv", mime: "video/x-matroska", ext: "mkv" },
  { label: "AVI", value: "avi", mime: "video/x-msvideo", ext: "avi" },
]

export function VideoConverterCanvas() {
  const { files } = useWorkspaceStore()
  const [format, setFormat] = useState(FORMATS[0])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <MonitorPlay className="w-12 h-12 mb-4 opacity-50" />
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

      await ffmpeg.writeFile("input.vid", await fetchFile(activeFile))

      const outputFile = `output.${format.ext}`
      await ffmpeg.exec(["-i", "input.vid", outputFile])

      const data = await ffmpeg.readFile(outputFile)
      const blob = new Blob([data as any], { type: format.mime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}.${format.ext}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e) {
      console.error(e)
      toast.error("Conversion failed.")
    } finally {
      setIsProcessing(false)
    }
  }

  const customSettings = (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Output Format</label>
      <div className="grid grid-cols-2 gap-3">
        {FORMATS.map(f => (
          <button
            key={f.value}
            onClick={() => setFormat(f)}
            className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${format.value === f.value ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-400"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Video Converter"
      description="Convert your video to any popular format quickly and easily."
      icon={<MonitorPlay className="w-6 h-6 text-indigo-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert Video"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
