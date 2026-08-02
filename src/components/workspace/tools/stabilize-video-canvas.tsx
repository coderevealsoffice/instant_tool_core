"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Activity, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function StabilizeVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [shakiness, setShakiness] = useState(5)
  const [smoothing, setSmoothing] = useState(10)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState<"idle" | "analyze" | "stabilize">("idle")

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Activity className="w-12 h-12 mb-4 opacity-50" />
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

      // Step 1: Analyze shakes and write transforms file
      setStep("analyze")
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vf", `vidstabdetect=shakiness=${shakiness}:accuracy=9:result=transforms.trf`,
        "-f", "null", "-"
      ])

      // Step 2: Apply stabilization using transforms
      setStep("stabilize")
      setProgress(0)
      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vf", `vidstabtransform=smoothing=${smoothing}:input=transforms.trf`,
        "-c:a", "copy",
        "output.mp4"
      ])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `stabilized-${activeFile.name}`
      a.click()
      URL.revokeObjectURL(url)
      setIsDone(true)
    } catch (e) {
      console.error(e)
      toast.error("Stabilization failed. Note: this uses vidstab which requires FFmpeg to be compiled with the plugin. If you see an error, the codec may not be available in this WebAssembly build.")
    } finally {
      setIsProcessing(false)
      setStep("idle")
    }
  }

  return (
    <ToolSplitView
      title="Stabilize Video"
      description="Stabilize Video"
      icon={<Activity className="w-6 h-6 text-rose-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Stabilize & Download"
      resultUrl={undefined}
      customSettings={<><div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Shake Detection Level: <span className="text-rose-600 font-bold">{shakiness}</span>
          </label>
          <input type="range" min={1} max={10} value={shakiness} onChange={e => setShakiness(Number(e.target.value))}
            className="w-full accent-rose-600" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Low</span><span>High</span></div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Smoothing Strength: <span className="text-rose-600 font-bold">{smoothing}</span>
          </label>
          <input type="range" min={1} max={30} value={smoothing} onChange={e => setSmoothing(Number(e.target.value))}
            className="w-full accent-rose-600" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Subtle</span><span>Aggressive</span></div>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-xs">
          ⚠️ Stabilization runs in 2 passes and may take a few minutes for longer videos.
        </div></>}
    />
  )
}
