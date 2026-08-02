"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Mic } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

const LEVELS = [
  { id: "light", label: "Light (Subtle)", desc: "Mild noise reduction" },
  { id: "medium", label: "Medium (Balanced)", desc: "Recommended for most files" },
  { id: "heavy", label: "Heavy (Aggressive)", desc: "Maximum enhancement" },
]

export function AudioEnhancerCanvas() {
  const { files } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [enhancementLevel, setEnhancementLevel] = useState("medium")

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-400">
        <Mic className="w-16 h-16 mb-4 opacity-50" />
        <p>Please upload an audio file to begin.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      const ext = activeFile.name.split('.').pop() || 'mp3'
      const inputName = `input.${ext}`

      await ffmpeg.writeFile(inputName, await fetchFile(activeFile))

      let filterStr = "highpass=f=80,lowpass=f=8000"
      if (enhancementLevel === "medium") {
        filterStr = "highpass=f=100,lowpass=f=8000,compand=attacks=0:points=-80/-80|-20/-10|0/-3:gain=2"
      } else if (enhancementLevel === "heavy") {
        filterStr = "highpass=f=150,lowpass=f=6000,compand=attacks=0:points=-80/-80|-30/-10|0/-3:gain=5"
      }

      await ffmpeg.exec(["-i", inputName, "-af", filterStr, "-c:a", "libmp3lame", "-q:a", "2", "output.mp3"])

      const data = await ffmpeg.readFile("output.mp3")
      const blob = new Blob([data as any], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `enhanced-${activeFile.name.replace(/\.[^/.]+$/, "")}.mp3`
      a.click()
      URL.revokeObjectURL(url)
      
      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to enhance audio. Please try a different file.")
    } finally {
      setIsProcessing(false)
    }
  }

  const customSettings = (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Enhancement Level</label>
      <div className="space-y-2">
        {LEVELS.map(lvl => (
          <button
            key={lvl.id}
            onClick={() => setEnhancementLevel(lvl.id)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${enhancementLevel === lvl.id ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-400"}`}
          >
            <div className="font-semibold">{lvl.label}</div>
            <div className="text-xs opacity-75 mt-0.5">{lvl.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <ToolSplitView
      title="Audio Enhancer"
      description="Improve audio quality by reducing noise and enhancing clarity."
      icon={<Mic className="w-6 h-6 text-emerald-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Enhance & Download"
      resultUrl={undefined}
      customSettings={customSettings}
    />
  )
}
