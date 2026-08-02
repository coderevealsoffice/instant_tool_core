"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Volume2 } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function ChangeVolumeCanvas() {
  const { files } = useWorkspaceStore()
  const [volume, setVolume] = useState(100)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Volume2 className="w-12 h-12 mb-4 opacity-50" />
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

      const volFactor = volume / 100
      await ffmpeg.exec(["-i", "input.mp4", "-af", `volume=${volFactor}`, "-c:v", "copy", "output.mp4"])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `vol${volume}pct-${activeFile.name}`
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
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Volume Level</label>
        <span className="text-2xl font-bold text-indigo-600">{volume}%</span>
      </div>
      <input 
        type="range" min={0} max={300} value={volume} 
        onChange={e => setVolume(Number(e.target.value))}
        className="w-full accent-indigo-600" 
      />
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        <span>0% (Mute)</span><span>100% (Original)</span><span>300% (3x)</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {[50, 100, 150, 200].map(v => (
          <button
            key={v}
            onClick={() => setVolume(v)}
            className={`py-2 rounded-xl border text-xs font-bold transition-all ${volume === v ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-400"}`}
          >
            {v}%
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Change Volume"
      description="Increase or decrease the audio volume of your video file."
      icon={<Volume2 className="w-6 h-6 text-indigo-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Apply & Download"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
