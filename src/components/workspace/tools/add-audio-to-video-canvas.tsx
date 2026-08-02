"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Music, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function AddAudioToVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Music className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a video file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    if (!audioFile) return toast.error("Please select an audio file to add.")
    setIsProcessing(true)
    setProgress(0)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      await ffmpeg.writeFile("input.mp4", await fetchFile(activeFile))
      await ffmpeg.writeFile("audio.mp3", await fetchFile(audioFile))

      // Mix audio with video (replace audio track)
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-i", "audio.mp3",
        "-c:v", "copy",
        "-c:a", "aac",
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-shortest",
        "output.mp4"
      ])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `with-audio-${activeFile.name}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e) {
      console.error(e)
      toast.error("Processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="Add Audio to Video"
      description="Add Audio to Video"
      icon={<Music className="w-6 h-6 text-blue-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Add Audio & Download"
      resultUrl={undefined}
      customSettings={<><div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Audio File to Add</label>
          <input
            type="file"
            accept="audio/*"
            onChange={e => setAudioFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div></>}
    />
  )
}
