"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ImageIcon, Loader2, CheckCircle, Play } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

export function AddImageToVideoCanvas() {
  const { files } = useWorkspaceStore()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [position, setPosition] = useState("10:10")
  const [scale, setScale] = useState("200")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
        <p>Upload a video file to get started.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    if (!imageFile) return toast.error("Please select an image to overlay.")
    setIsProcessing(true)
    setProgress(0)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      await ffmpeg.writeFile("input.mp4", await fetchFile(activeFile))
      const imgExt = imageFile.name.split(".").pop() || "png"
      await ffmpeg.writeFile(`overlay.${imgExt}`, await fetchFile(imageFile))

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-i", `overlay.${imgExt}`,
        "-filter_complex",
        `[1:v]scale=${scale}:-1[img];[0:v][img]overlay=${position}`,
        "-c:a", "copy",
        "output.mp4"
      ])

      const data = await ffmpeg.readFile("output.mp4")
      const blob = new Blob([data as any], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `with-image-${activeFile.name}`
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
      title="Add Image to Video"
      description="Add Image to Video"
      icon={<ImageIcon className="w-6 h-6 text-blue-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Add Image & Download"
      resultUrl={undefined}
      customSettings={<><div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Image to Overlay</label>
          <input
            type="file" accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Position (x:y)</label>
            <input
              type="text" value={position} onChange={e => setPosition(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Image Width (px)</label>
            <input
              type="number" value={scale} onChange={e => setScale(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div></>}
    />
  )
}
