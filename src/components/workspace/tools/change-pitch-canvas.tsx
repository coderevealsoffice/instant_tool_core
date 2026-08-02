"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Music, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function ChangePitchCanvas() {
  const { files } = useWorkspaceStore()
  
  // Rubberband or simple atempo/asetrate trick.
  // A simple way to change pitch without changing tempo using standard FFmpeg is rubberband.
  // If rubberband isn't compiled, a simple asetrate changes pitch AND tempo, which we can correct with atempo.
  // asetrate=44100*pitch,atempo=1/pitch
  const [pitch, setPitch] = useState(1.0)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-400">
        <Music className="w-12 h-12 mb-4 opacity-50" />
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

      const tempoCorrection = 1 / pitch
      const filter = `asetrate=44100*${pitch},aresample=44100,atempo=${tempoCorrection}`

      await ffmpeg.exec([
        "-i", "input.mp3",
        "-af", filter,
        "output.mp3"
      ])

      const data = await ffmpeg.readFile("output.mp3")
      const blob = new Blob([data as any], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}-pitch.mp3`
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
      title="Change Pitch"
      description="Change Pitch"
      icon={<Music className="w-6 h-6 text-indigo-500" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Change Pitch & Download"
      resultUrl={undefined}
      customSettings={<><div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pitch Factor</label>
            <span className="text-sm font-bold text-indigo-500">{pitch.toFixed(2)}x</span>
          </div>
          <input 
            type="range" 
            min={0.5} max={2.0} step={0.1} 
            value={pitch} 
            onChange={e => setPitch(Number(e.target.value))}
            className="w-full accent-indigo-500" 
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Deeper (0.5x)</span><span>Original (1.0x)</span><span>Chipmunk (2.0x)</span>
          </div>
        </div></>}
    />
  )
}
