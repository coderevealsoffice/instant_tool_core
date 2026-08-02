"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileAudio, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const FORMATS = [
  { label: "MP3", value: "mp3", mime: "audio/mpeg", ext: "mp3" },
  { label: "AAC", value: "aac", mime: "audio/aac", ext: "aac" },
  { label: "WAV", value: "wav", mime: "audio/wav", ext: "wav" },
  { label: "OGG", value: "ogg", mime: "audio/ogg", ext: "ogg" },
]

export function ExtractAudioCanvas() {
  const { files } = useWorkspaceStore()
  const [format, setFormat] = useState(FORMATS[0])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <FileAudio className="w-12 h-12 mb-4 opacity-50" />
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

      const outputFile = `output.${format.ext}`
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vn",
        "-acodec", format.value === "mp3" ? "libmp3lame" : format.value,
        outputFile
      ])

      const data = await ffmpeg.readFile(outputFile)
      const blob = new Blob([data as any], { type: format.mime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}-audio.${format.ext}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e) {
      console.error(e)
      toast.error("Audio extraction failed.")
    } finally {
      setIsProcessing(false)
    }
  }

  const customSettings = (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Output Audio Format</label>
      <div className="grid grid-cols-2 gap-3">
        {FORMATS.map(f => (
          <button
            key={f.value}
            onClick={() => setFormat(f)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${format.value === f.value ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-emerald-400"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Extract Audio"
      description="Extract audio track from any video file in your preferred format."
      icon={<FileAudio className="w-6 h-6 text-emerald-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Extract Audio"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
