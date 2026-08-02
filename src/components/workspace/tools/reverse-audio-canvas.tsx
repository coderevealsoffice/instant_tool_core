"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ArrowLeftRight, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function ReverseAudioCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-400">
        <ArrowLeftRight className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload an audio file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      await ffmpeg.writeFile("input.mp3", await fetchFile(activeFile))

      await ffmpeg.exec([
        "-i", "input.mp3",
        "-af", "areverse",
        "output.mp3"
      ])

      const data = await ffmpeg.readFile("output.mp3")
      const blob = new Blob([data as any], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}-reversed.mp3`
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
      title="Reverse Audio"
      description="Reverse Audio"
      icon={<ArrowLeftRight className="w-6 h-6 text-purple-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Reverse & Download"
      resultUrl={undefined}
      customSettings={<><div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl text-sm text-purple-800 dark:text-purple-300">
          This will play the entire audio track backwards. Great for finding hidden messages or creating sound effects!
        </div></>}
    />
  )
}
