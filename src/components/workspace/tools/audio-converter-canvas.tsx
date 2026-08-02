"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Music, Loader2, CheckCircle, Play, ArrowRight } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

type OutputFormat = "mp3" | "wav" | "ogg" | "aac" | "flac" | "m4a"

const FORMAT_CONFIG: Record<OutputFormat, { codec: string; mimeType: string; label: string; description: string }> = {
  mp3:  { codec: "libmp3lame", mimeType: "audio/mpeg",   label: "MP3",  description: "Most compatible, smaller size" },
  wav:  { codec: "pcm_s16le",  mimeType: "audio/wav",    label: "WAV",  description: "Lossless, large files" },
  ogg:  { codec: "libvorbis",  mimeType: "audio/ogg",    label: "OGG",  description: "Open format, good quality" },
  aac:  { codec: "aac",        mimeType: "audio/aac",    label: "AAC",  description: "Great quality, small size" },
  flac: { codec: "flac",       mimeType: "audio/flac",   label: "FLAC", description: "Lossless, high quality" },
  m4a:  { codec: "aac",        mimeType: "audio/mp4",    label: "M4A",  description: "Apple compatible, efficient" },
}

export function AudioConverterCanvas() {
  const { files } = useWorkspaceStore()
  const [targetFormat, setTargetFormat] = useState<OutputFormat>("mp3")
  const [bitrate, setBitrate] = useState("192")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <Music className="w-14 h-14 opacity-40" />
        <p className="font-medium">Upload an audio file to convert it.</p>
      </div>
    )
  }

  const inputExt = activeFile.name.split(".").pop()?.toLowerCase() || "mp3"
  const config = FORMAT_CONFIG[targetFormat]

  const handleProcess = async () => {
    if (inputExt === targetFormat) {
      toast.error(`File is already in ${targetFormat.toUpperCase()} format. Please choose a different output format.`)
      return
    }
    setIsProcessing(true)
    setProgress(0)
    setIsDone(false)
    try {
      const ffmpeg = await getFFmpeg()
      ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)))

      const inputName = `input.${inputExt}`
      await ffmpeg.writeFile(inputName, await fetchFile(activeFile))

      const outputName = `output.${targetFormat}`
      const args = ["-i", inputName]

      // Apply bitrate only for lossy formats
      if (["mp3", "ogg", "aac", "m4a"].includes(targetFormat)) {
        args.push("-b:a", `${bitrate}k`)
      }

      args.push("-vn") // strip video streams if any
      args.push(outputName)

      await ffmpeg.exec(args)

      const data = await ffmpeg.readFile(outputName)
      const blob = new Blob([data as any], { type: config.mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}.${targetFormat}`
      a.click()
      URL.revokeObjectURL(url)

      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      toast.error(`Conversion failed: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const isLossy = ["mp3", "ogg", "aac", "m4a"].includes(targetFormat)

  return (
    <ToolSplitView
      title="Audio Converter"
      description="Audio Converter"
      icon={<Music className="w-6 h-6 text-violet-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={progress}
      isDone={isDone}
      onProcess={handleProcess}
      processButtonText="Convert Audio"
      resultUrl={undefined}
      
    />
  )
}
