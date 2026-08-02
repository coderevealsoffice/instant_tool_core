"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar"
import { WorkspaceHeader } from "@/components/workspace/workspace-header"
import { AudioTrimCanvas } from "@/components/workspace/tools/audio-trim-canvas"
import { VideoTrimCanvas } from "@/components/workspace/tools/video-trim-canvas"
import { ImageConvertCanvas } from "@/components/workspace/tools/image-convert-canvas"
import { QrCanvas } from "@/components/workspace/tools/qr-canvas"
import { AiCanvas } from "@/components/workspace/tools/ai-canvas"
import { PdfMergeCanvas } from "@/components/workspace/tools/pdf-merge-canvas"
import { CompressPdfCanvas } from "@/components/workspace/tools/compress-pdf-canvas"
import { SplitPdfCanvas } from "@/components/workspace/tools/split-pdf-canvas"
import { RotatePdfCanvas } from "@/components/workspace/tools/rotate-pdf-canvas"
import { PdfToImageCanvas } from "@/components/workspace/tools/pdf-to-image-canvas"
import { ImageToPdfCanvas } from "@/components/workspace/tools/image-to-pdf-canvas"
import { AudioConverterCanvas } from "@/components/workspace/tools/audio-converter-canvas"
import { AudioEnhancerCanvas } from "@/components/workspace/tools/audio-enhancer-canvas"
import { ExtractAudioCanvas } from "@/components/workspace/tools/extract-audio-canvas"
import { ChangeVideoSpeedCanvas } from "@/components/workspace/tools/change-video-speed-canvas"
import { ChangeVolumeCanvas } from "@/components/workspace/tools/change-volume-canvas"
import { ChangeAudioSpeedCanvas } from "@/components/workspace/tools/change-audio-speed-canvas"
import { RotateVideoCanvas } from "@/components/workspace/tools/rotate-video-canvas"
import { FlipVideoCanvas } from "@/components/workspace/tools/flip-video-canvas"
import { CropVideoCanvas } from "@/components/workspace/tools/crop-video-canvas"
import { VideoEditorCanvas } from "@/components/workspace/canvases/VideoEditorCanvas"
import { GenericWorkspaceCanvas } from "@/components/workspace/canvases/GenericWorkspaceCanvas"

import { ScreenRecorderCanvas } from "@/components/workspace/tools/screen-recorder-canvas"
import { TextToSpeechCanvas } from "@/components/workspace/tools/text-to-speech-canvas"
import { MergeVideoCanvas } from "@/components/workspace/tools/merge-video-canvas"
import { AddAudioToVideoCanvas } from "@/components/workspace/tools/add-audio-to-video-canvas"
import { AddImageToVideoCanvas } from "@/components/workspace/tools/add-image-to-video-canvas"
import { AddTextToVideoCanvas } from "@/components/workspace/tools/add-text-to-video-canvas"
import { RemoveLogoCanvas } from "@/components/workspace/tools/remove-logo-canvas"
import { ResizeVideoCanvas } from "@/components/workspace/tools/resize-video-canvas"
import { LoopVideoCanvas } from "@/components/workspace/tools/loop-video-canvas"
import { StabilizeVideoCanvas } from "@/components/workspace/tools/stabilize-video-canvas"
import { VideoRecorderCanvas } from "@/components/workspace/tools/video-recorder-canvas"
import { ChangePitchCanvas } from "@/components/workspace/tools/change-pitch-canvas"
import { AudioEqualizerCanvas } from "@/components/workspace/tools/audio-equalizer-canvas"
import { ReverseAudioCanvas } from "@/components/workspace/tools/reverse-audio-canvas"
import { VoiceRecorderCanvas } from "@/components/workspace/tools/voice-recorder-canvas"
import { AudioJoinerCanvas } from "@/components/workspace/tools/audio-joiner-canvas"
import { YoutubeDownloaderCanvas } from "@/components/workspace/tools/video/youtube-downloader-canvas"
import { InstagramDownloaderCanvas } from "@/components/workspace/tools/video/instagram-downloader-canvas"
import { UnlockPdfCanvas } from "@/components/workspace/tools/unlock-pdf-canvas"
import { ProtectPdfCanvas } from "@/components/workspace/tools/protect-pdf-canvas"
import { AddPageNumbersCanvas } from "@/components/workspace/tools/add-page-numbers-canvas"
import { PdfToWordCanvas } from "@/components/workspace/tools/pdf-to-word-canvas"
import { PdfToExcelCanvas } from "@/components/workspace/tools/pdf-to-excel-canvas"
import { PdfToJpgCanvas } from "@/components/workspace/tools/pdf-to-jpg-canvas"
import { PdfToPngCanvas } from "@/components/workspace/tools/pdf-to-png-canvas"
import { PdfToHtmlCanvas } from "@/components/workspace/tools/pdf-to-html-canvas"
import { WordToPdfCanvas } from "@/components/workspace/tools/word-to-pdf-canvas"
import { JpgToPdfCanvas } from "@/components/workspace/tools/jpg-to-pdf-canvas"
import { ExcelToPdfCanvas } from "@/components/workspace/tools/excel-to-pdf-canvas"
import { PptToPdfCanvas } from "@/components/workspace/tools/ppt-to-pdf-canvas"
import { PngToPdfCanvas } from "@/components/workspace/tools/png-to-pdf-canvas"
import { VideoConverterCanvas } from "@/components/workspace/tools/video-converter-canvas"
import { DocumentConverterCanvas } from "@/components/workspace/tools/document-converter-canvas"
import { FontConverterCanvas } from "@/components/workspace/tools/font-converter-canvas"
import { ArchiveConverterCanvas } from "@/components/workspace/tools/archive-converter-canvas"
import { EbookConverterCanvas } from "@/components/workspace/tools/ebook-converter-canvas"
import { ArchiveExtractorCanvas } from "@/components/workspace/tools/archive-extractor-canvas"
import { SignPdfCanvas } from "@/components/workspace/tools/sign-pdf-canvas"
import { EditPdfCanvas } from "@/components/workspace/tools/edit-pdf-canvas"
const AiFaceBlurCanvas = dynamic(() => import("@/components/workspace/tools/ai/ai-face-blur-canvas").then(mod => mod.AiFaceBlurCanvas), { ssr: false })
const AiImageUpscalerCanvas = dynamic(() => import("@/components/workspace/tools/ai/ai-image-upscaler-canvas").then(mod => mod.AiImageUpscalerCanvas), { ssr: false })
const AiSmartCropCanvas = dynamic(() => import("@/components/workspace/tools/ai/ai-smart-crop-canvas").then(mod => mod.AiSmartCropCanvas), { ssr: false })
import { AiImageEditorCanvas } from "@/components/workspace/tools/ai/ai-image-editor-canvas"
import { AiEbookGeneratorCanvas } from "@/components/workspace/tools/ai/ai-ebook-generator-canvas"
import { AiTextHumanizerCanvas } from "@/components/workspace/tools/ai/ai-text-humanizer-canvas"
import { AiResumeBuilderCanvas } from "@/components/workspace/tools/ai/ai-resume-builder-canvas"
import { AiYoutubeSummarizerCanvas } from "@/components/workspace/tools/ai/ai-youtube-summarizer-canvas"
import { AiYoutubeKeywordGeneratorCanvas } from "@/components/workspace/tools/ai/ai-youtube-keyword-generator-canvas"
import { AiShortsScriptGeneratorCanvas } from "@/components/workspace/tools/ai/ai-shorts-script-generator-canvas"
import { AiThumbnailGeneratorCanvas } from "@/components/workspace/tools/ai/ai-thumbnail-generator-canvas"
import { AiLinkedinPostGeneratorCanvas } from "@/components/workspace/tools/ai/ai-linkedin-post-generator-canvas"
import { AiPodcastNotesGeneratorCanvas } from "@/components/workspace/tools/ai/ai-podcast-notes-generator-canvas"
import { AiVideoCaptionGeneratorCanvas } from "@/components/workspace/tools/ai/ai-video-caption-generator-canvas"
import { JsonFormatterCanvas } from "@/components/workspace/tools/dev/json-formatter-canvas"
import { HeicToJpgCanvas } from "@/components/workspace/tools/converters/heic-to-jpg-canvas"
import { BulkImageCompressorCanvas } from "@/components/workspace/tools/image/bulk-compressor-canvas"
import { MinifyJsCanvas } from "@/components/workspace/tools/dev/minify-js-canvas"
import { MinifyCssCanvas } from "@/components/workspace/tools/dev/minify-css-canvas"
import { FormatHtmlCanvas } from "@/components/workspace/tools/dev/format-html-canvas"
import { CodeToImageCanvas } from "@/components/workspace/tools/dev/code-to-image-canvas"
import { ColorPaletteCanvas } from "@/components/workspace/tools/image/color-palette-canvas"

import { useWorkspaceStore } from "@/store/workspace-store"
import { mergePdfs } from "@/lib/pdf/merge"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { useState } from "react"
import { toast } from "sonner"

function WorkspaceRouter() {
  const searchParams = useSearchParams()
  const tool = searchParams.get("tool")
  const category = searchParams.get("category")
  const { hydrate, isHydrated, files, toolParams } = useWorkspaceStore()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const handleFinish = async () => {
    if (files.length === 0 && tool !== "generate-qr" && tool !== "generate-ai" && tool !== "screen-recorder" && tool !== "recorder" && tool !== "text-to-speech") return
    if (!tool) return
    setIsProcessing(true)
    try {
      if (tool === "merge-pdf") {
        // Attempt to deduct credits first
        const deductRes = await fetch('/api/tools/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: 'merge-pdf' })
        })

        if (!deductRes.ok && deductRes.status !== 401) {
          const data = await deductRes.json()
          toast.error(data.error || "Failed to deduct credits. Please check your balance.")
          setIsProcessing(false)
          return
        }

        // Extract File objects from the store
        const rawFiles = files.map(f => f.file)
        const mergedBlob = await mergePdfs(rawFiles)

        // Trigger download
        const url = URL.createObjectURL(mergedBlob)
        const a = document.createElement("a")
        a.href = url
        a.download = "merged-instant-tool.pdf"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success("PDFs merged successfully!")
      } else if (tool === "trim-audio") {
        const deductRes = await fetch('/api/tools/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: 'trim-audio' })
        })
        if (!deductRes.ok && deductRes.status !== 401) throw new Error("Failed to deduct credits.")

        const ffmpeg = await getFFmpeg()
        const inputFile = files[0].file
        const startTime = toolParams.startTime || "00:00:00"
        const endTime = toolParams.endTime || "00:00:10"
        const ext = inputFile.name.split('.').pop()
        const outName = `output.${ext}`

        await ffmpeg.writeFile(inputFile.name, await fetchFile(inputFile))
        await ffmpeg.exec(['-i', inputFile.name, '-ss', startTime, '-to', endTime, '-c', 'copy', outName])

        const fileData = await ffmpeg.readFile(outName)
        const data = new Uint8Array(fileData as unknown as ArrayBuffer)
        const url = URL.createObjectURL(new Blob([data.buffer as any], { type: inputFile.type }))

        const a = document.createElement("a")
        a.href = url
        a.download = `trimmed-${inputFile.name}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Audio trimmed successfully!")

      } else if (tool === "trim-video") {
        const deductRes = await fetch('/api/tools/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: 'trim-video' })
        })
        if (!deductRes.ok && deductRes.status !== 401) throw new Error("Failed to deduct credits.")

        const ffmpeg = await getFFmpeg()
        const inputFile = files[0].file
        const startTime = toolParams.startTime || "00:00:00"
        const endTime = toolParams.endTime || "00:00:10"
        const ext = inputFile.name.split('.').pop()
        const outName = `output.${ext}`

        await ffmpeg.writeFile(inputFile.name, await fetchFile(inputFile))
        await ffmpeg.exec(['-i', inputFile.name, '-ss', startTime, '-to', endTime, '-c', 'copy', outName])

        const fileData = await ffmpeg.readFile(outName)
        const data = new Uint8Array(fileData as unknown as ArrayBuffer)
        const url = URL.createObjectURL(new Blob([data.buffer as any], { type: inputFile.type }))

        const a = document.createElement("a")
        a.href = url
        a.download = `trimmed-${inputFile.name}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Video trimmed successfully!")

      } else if (tool === "convert-image") {
        const deductRes = await fetch('/api/tools/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: 'convert-image' })
        })
        if (!deductRes.ok && deductRes.status !== 401) throw new Error("Failed to deduct credits.")

        const ffmpeg = await getFFmpeg()
        const inputFile = files[0].file
        const targetFormat = toolParams.targetFormat || "webp"
        const outName = `output.${targetFormat}`

        await ffmpeg.writeFile(inputFile.name, await fetchFile(inputFile))
        await ffmpeg.exec(['-i', inputFile.name, outName])

        const fileData = await ffmpeg.readFile(outName)
        const data = new Uint8Array(fileData as unknown as ArrayBuffer)
        const url = URL.createObjectURL(new Blob([data.buffer as any], { type: `image/${targetFormat}` }))

        const a = document.createElement("a")
        a.href = url
        a.download = `converted-${inputFile.name.split('.')[0]}.${targetFormat}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Image converted successfully!")

      } else if (tool === "generate-qr") {
        const deductRes = await fetch('/api/tools/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: 'generate-qr' })
        })
        if (!deductRes.ok && deductRes.status !== 401) throw new Error("Failed to deduct credits.")

        const QRCode = (await import("qrcode")).default
        const content = toolParams.qrContent || "https://example.com"
        const fgColor = toolParams.qrFgColor || "#000000"
        const bgColor = toolParams.qrBgColor || "#ffffff"

        const url = await QRCode.toDataURL(content, {
          color: { dark: fgColor, light: bgColor },
          margin: 2,
          width: 1024 // High res download
        })

        const a = document.createElement("a")
        a.href = url
        a.download = `instant-qr-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success("QR Code generated successfully!")

      } else if (tool === "generate-ai") {
        const content = toolParams.aiContent
        if (!content) throw new Error("Please enter some text to process.")

        const res = await fetch('/api/tools/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            aiMode: toolParams.aiMode || "summary"
          })
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to process AI content.")
        }

        const data = await res.json()

        // Show result in a clean alert (for now) or update state to display in canvas
        // We'll just alert it and also download it as a text file for convenience
        const blob = new Blob([data.result as any], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ai-result-${Date.now()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("AI Processing complete! The result has been downloaded as a text file.")
      } else if (tool === "screen-recorder") {
        if (files.length === 0) {
          throw new Error("No recording found. Please record a video first.")
        }

        const deductRes = await fetch('/api/tools/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: tool })
        })
        if (!deductRes.ok && deductRes.status !== 401) throw new Error("Failed to deduct credits.")

        const inputFile = files[0].file
        const url = URL.createObjectURL(inputFile)
        const a = document.createElement("a")
        a.href = url
        a.download = inputFile.name || `Screen-Recording-${Date.now()}.webm`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Screen recording processed and downloaded successfully!")
      } else if (tool === "recorder") {
        if (files.length === 0) {
          throw new Error("No recording found. Please record first.")
        }

        const deductRes = await fetch('/api/tools/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: tool })
        })
        if (!deductRes.ok && deductRes.status !== 401) throw new Error("Failed to deduct credits.")

        const inputFile = files[0].file
        const url = URL.createObjectURL(inputFile)
        const a = document.createElement("a")
        a.href = url
        a.download = inputFile.name || `Recording-${Date.now()}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Recording processed and downloaded successfully!")
      } else {
        const deductRes = await fetch('/api/tools/deduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: tool })
        })
        if (!deductRes.ok && deductRes.status !== 401) throw new Error("Failed to deduct credits.")

        const inputFile = files[0].file
        const url = URL.createObjectURL(inputFile)
        const a = document.createElement("a")
        a.href = url
        a.download = `processed-${inputFile.name}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success(`${tool} processed successfully!`)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to process files.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Select the appropriate canvas based on the tool
  const renderCanvas = () => {
    switch (tool) {
      case "merge-pdf": return <PdfMergeCanvas />
      case "convert-image": return <ImageConvertCanvas />
      case "trim-audio": return <AudioTrimCanvas />
      case "trim-video": return <VideoTrimCanvas />
      case "ai-face-blur": return <AiFaceBlurCanvas />
      case "ai-image-upscaler": return <AiImageUpscalerCanvas />
      case "ai-smart-crop": return <AiSmartCropCanvas />
      case "ai-image-editor": return <AiImageEditorCanvas />
      case "ai-ebook-generator": return <AiEbookGeneratorCanvas />
      case "ai-text-humanizer": return <AiTextHumanizerCanvas />
      case "ai-resume-builder": return <AiResumeBuilderCanvas />
      case "ai-youtube-summarizer": return <AiYoutubeSummarizerCanvas />
      case "ai-youtube-keyword-generator": return <AiYoutubeKeywordGeneratorCanvas />
      case "ai-shorts-script-generator": return <AiShortsScriptGeneratorCanvas />
      case "ai-thumbnail-generator": return <AiThumbnailGeneratorCanvas />
      case "ai-linkedin-post-generator": return <AiLinkedinPostGeneratorCanvas />
      case "ai-podcast-notes-generator": return <AiPodcastNotesGeneratorCanvas />
      case "ai-video-caption-generator": return <AiVideoCaptionGeneratorCanvas />
      case "heic-to-jpg": return <HeicToJpgCanvas />
      case "bulk-compressor": return <BulkImageCompressorCanvas />
      case "json-formatter": return <JsonFormatterCanvas />
      case "generate-qr": return <QrCanvas />
      case "generate-ai": return <AiCanvas />
      case "compress-pdf": return <CompressPdfCanvas />
      case "split-pdf": return <SplitPdfCanvas />
      case "rotate-pdf": return <RotatePdfCanvas />
      case "pdf-to-image": return <PdfToImageCanvas />
      case "image-to-pdf": return <ImageToPdfCanvas />
      case "audio-converter": return <AudioConverterCanvas />
      case "audio-enhancer": return <AudioEnhancerCanvas />
      case "extract-audio": return <ExtractAudioCanvas />
      case "change-speed": return category === "video-tools" ? <ChangeVideoSpeedCanvas /> : <ChangeAudioSpeedCanvas />
      case "change-volume": return <ChangeVolumeCanvas />
      case "rotate": return <RotateVideoCanvas />
      case "flip": return <FlipVideoCanvas />
      case "crop": return <CropVideoCanvas />
      case "editor": return <VideoEditorCanvas />

      // New canvases
      case "screen-recorder": return <ScreenRecorderCanvas />
      case "text-to-speech": return <TextToSpeechCanvas />
      case "merge": return <MergeVideoCanvas />
      case "add-audio": return <AddAudioToVideoCanvas />
      case "add-image": return <AddImageToVideoCanvas />
      case "add-text": return <AddTextToVideoCanvas />
      case "remove-logo": return <RemoveLogoCanvas />
      case "resize": return <ResizeVideoCanvas />
      case "loop": return <LoopVideoCanvas />
      case "stabilize": return <StabilizeVideoCanvas />
      case "youtube-downloader": return <YoutubeDownloaderCanvas />
      case "instagram-downloader": return <InstagramDownloaderCanvas />
      case "recorder": return category === "video-tools" ?
        <VideoRecorderCanvas />
        : <VoiceRecorderCanvas />
      case "pitch": return <ChangePitchCanvas />
      case "equalizer": return <AudioEqualizerCanvas />
      case "reverse": return <ReverseAudioCanvas />
      case "joiner": return <AudioJoinerCanvas />

      case "unlock-pdf": return <UnlockPdfCanvas />
      case "protect-pdf": return <ProtectPdfCanvas />
      case "add-page-numbers": return <AddPageNumbersCanvas />
      case "pdf-to-word": return <PdfToWordCanvas />
      case "pdf-to-excel": return <PdfToExcelCanvas />
      case "pdf-to-jpg": return <PdfToJpgCanvas />
      case "pdf-to-png": return <PdfToPngCanvas />
      case "pdf-to-html": return <PdfToHtmlCanvas />
      case "word-to-pdf": return <WordToPdfCanvas />
      case "jpg-to-pdf": return <JpgToPdfCanvas />
      case "excel-to-pdf": return <ExcelToPdfCanvas />
      case "ppt-to-pdf": return <PptToPdfCanvas />
      case "png-to-pdf": return <PngToPdfCanvas />
      case "sign-pdf": return <SignPdfCanvas />
      case "edit-pdf": return <EditPdfCanvas />

      case "video": return <VideoConverterCanvas />
      case "document": return <DocumentConverterCanvas />
      case "font": return <FontConverterCanvas />
      case "archive": return <ArchiveConverterCanvas />
      case "ebook": return <EbookConverterCanvas />
      case "extractor": return <ArchiveExtractorCanvas />

      // Dev & Color Tools
      case "minify-js": return <MinifyJsCanvas />
      case "minify-css": return <MinifyCssCanvas />
      case "format-html": return <FormatHtmlCanvas />
      case "code-to-image": return <CodeToImageCanvas />
      case "color-palette": return <ColorPaletteCanvas />

      default:
        return <GenericWorkspaceCanvas />
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500 bg-slate-50 dark:bg-slate-950">
        Loading files...
      </div>
    )
  }

  return (
    <>
      <WorkspaceSidebar category={category || "pdf"} />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <WorkspaceHeader
          toolName={tool || "Workspace"}
          onFinish={handleFinish}
          isProcessing={isProcessing}
        />
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-4">
          {renderCanvas()}
        </div>
      </main>
    </>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div
      className="flex
h-screen items-center 
justify-center text-slate-500">
      Loading Workspace...
    </div>}>
      <WorkspaceRouter />
    </Suspense>
  )
}
 