"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Repeat, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function LoopVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [loopCount, setLoopCount] = useState(3)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Repeat className="w-12 h-12 mb-4 opacity-50" />
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

      let concatContent = ""
      for (let i = 0; i < loopCount; i++) {
        concatContent += "file 'input.mp4'\n"
      }
      await ffmpeg.writeFile("list.txt", concatContent)

      await ffmpeg.exec(["-f", "concat", "-safe", "0", "-i", "list.txt", "-c", "copy", "output.mp4"])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `looped-${loopCount}x-${activeFile.name}`
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
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Number of Loops: <span className="text-cyan-600 font-bold">{loopCount}x</span>
      </label>
      <div className="flex items-center space-x-3">
        {[2, 3, 5, 10].map(n => (
          <button
            key={n}
            onClick={() => setLoopCount(n)}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${loopCount === n ? "bg-cyan-500 border-cyan-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-cyan-400"}`}
          >
            {n}x
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Loop Video"
      description="Repeat your video multiple times and combine them into one seamless file."
      icon={<Repeat className="w-6 h-6 text-cyan-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Loop & Download"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
