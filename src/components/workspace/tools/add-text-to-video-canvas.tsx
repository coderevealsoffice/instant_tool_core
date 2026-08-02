"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Type, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function AddTextToVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [text, setText] = useState("Your text here")
  const [fontSize, setFontSize] = useState(48)
  const [color, setColor] = useState("white")
  const [posX, setPosX] = useState("(w-text_w)/2")
  const [posY, setPosY] = useState("(h-text_h)/2")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Type className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a video file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    if (!text.trim()) return toast.error("Please enter text to add.")
    setIsProcessing(true)
    setProgress(0)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      await ffmpeg.writeFile("input.mp4", await fetchFile(activeFile))

      const drawText = `drawtext=text='${text.replace(/'/g, "\\'")}':fontsize=${fontSize}:fontcolor=${color}:x=${posX}:y=${posY}:box=1:boxcolor=black@0.4:boxborderw=5`

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vf", drawText,
        "-c:a", "copy",
        "output.mp4"
      ])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `with-text-${activeFile.name}`
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
      title="Add Text to Video"
      description="Add Text to Video"
      icon={<Type className="w-6 h-6 text-blue-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Add Text & Download"
      resultUrl={undefined}
      customSettings={<><div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Text</label>
          <input
            type="text" value={text} onChange={e => setText(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Font Size</label>
            <input
              type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Text Color</label>
            <select
              value={color} onChange={e => setColor(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
            >
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">X Position</label>
            <select value={posX} onChange={e => setPosX(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white">
              <option value="(w-text_w)/2">Center</option>
              <option value="10">Left</option>
              <option value="w-text_w-10">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Y Position</label>
            <select value={posY} onChange={e => setPosY(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white">
              <option value="(h-text_h)/2">Middle</option>
              <option value="10">Top</option>
              <option value="h-text_h-10">Bottom</option>
            </select>
          </div>
        </div></>}
    />
  )
}
