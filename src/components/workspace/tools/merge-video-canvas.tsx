"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { FileVideo, Loader2, CheckCircle, Play, Plus, X } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function MergeVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [extraFiles, setExtraFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const primaryFile = files?.[0]?.file ?? null

  if (!primaryFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <FileVideo className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a primary video file to get started.</p>
      </div>
    )
  }

  const allFiles = [primaryFile, ...extraFiles]

  const handleProcess = async () => {
    if (allFiles.length < 2) return toast.error("Please add at least one more video to merge.")
    setIsProcessing(true)
    setProgress(0)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      let concatContent = ""
      for (let i = 0; i < allFiles.length; i++) {
        await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(allFiles[i]))
        concatContent += `file 'input${i}.mp4'\n`
      }
      await ffmpeg.writeFile("list.txt", concatContent)

      await ffmpeg.exec([
        "-f", "concat",
        "-safe", "0",
        "-i", "list.txt",
        "-c", "copy",
        "output.mp4"
      ])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `merged-video-${Date.now()}.mp4`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e) {
      console.error(e)
      toast.error("Merging failed. Ensure all videos have the same codec and resolution.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolSplitView
      title="Merge Videos"
      description="Merge Videos"
      icon={<FileVideo className="w-6 h-6 text-violet-600" />}
      originalFile={primaryFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Merge & Download"
      resultUrl={undefined}
      
    />
  )
}
