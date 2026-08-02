"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Sliders, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function AudioEqualizerCanvas() {
  const { files } = useWorkspaceStore()
  
  // Basic 3-band EQ: Bass, Mid, Treble (gain in dB, from -20 to 20)
  const [bass, setBass] = useState(0)
  const [mid, setMid] = useState(0)
  const [treble, setTreble] = useState(0)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-400">
        <Sliders className="w-12 h-12 mb-4 opacity-50" />
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

      // FFmpeg equalizer filter syntax. We chain equalizer bands.
      // f=frequency, width_type=h (Hz), width=bandwidth in Hz, g=gain in dB
      const eqFilter = `equalizer=f=100:width_type=h:width=50:g=${bass},equalizer=f=1000:width_type=h:width=200:g=${mid},equalizer=f=10000:width_type=h:width=2000:g=${treble}`

      await ffmpeg.exec([
        "-i", "input.mp3",
        "-af", eqFilter,
        "output.mp3"
      ])

      const data = await ffmpeg.readFile("output.mp3")
      const blob = new Blob([data as any], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}-eq.mp3`
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
      title="Audio Equalizer"
      description="Audio Equalizer"
      icon={<Sliders className="w-6 h-6 text-cyan-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Apply EQ & Download"
      resultUrl={undefined}
      customSettings={<><div className="space-y-6">
          {[
            { label: "Bass (100 Hz)", val: bass, set: setBass, color: "accent-blue-500" },
            { label: "Mid (1 kHz)", val: mid, set: setMid, color: "accent-green-500" },
            { label: "Treble (10 kHz)", val: treble, set: setTreble, color: "accent-cyan-500" },
          ].map((band) => (
            <div key={band.label}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{band.label}</label>
                <span className="text-sm font-bold text-slate-500">{band.val > 0 ? `+${band.val}` : band.val} dB</span>
              </div>
              <input 
                type="range" 
                min={-20} max={20} step={1} 
                value={band.val} 
                onChange={e => band.set(Number(e.target.value))}
                className={`w-full ${band.color}`} 
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>-20 dB</span><span>0 dB</span><span>+20 dB</span>
              </div>
            </div>
          ))}
        </div></>}
    />
  )
}
