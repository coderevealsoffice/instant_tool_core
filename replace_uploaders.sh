#!/bin/bash

# Define the components and their corresponding tool/category pairs
declare -A components
components=(
  ["SplitPdf.tsx"]="split-pdf pdf-tools"
  ["RotatePdf.tsx"]="rotate-pdf pdf-tools"
  ["PdfToImage.tsx"]="pdf-to-image pdf-tools"
  ["ImageToPdf.tsx"]="image-to-pdf pdf-tools"
  ["AudioConverter.tsx"]="audio-converter audio-tools"
  ["AudioEnhancer.tsx"]="audio-enhancer audio-tools"
  ["VideoTrimmer.tsx"]="trim-video video-tools"
  ["AudioTrimmer.tsx"]="trim-audio audio-tools"
  ["ImageConverterUploader.tsx"]="convert-image converters"
  ["ExtractAudio.tsx"]="extract-audio video-tools"
  ["ChangeVideoSpeed.tsx"]="change-speed video-tools"
  ["ChangeVolume.tsx"]="change-volume audio-tools"
  ["ChangeAudioSpeed.tsx"]="change-speed audio-tools"
  ["RotateVideo.tsx"]="rotate video-tools"
  ["FlipVideo.tsx"]="flip video-tools"
  ["CropVideo.tsx"]="crop video-tools"
)

cd src/components/tools/

for component in "${!components[@]}"; do
  if [ -f "$component" ]; then
    read -r tool category <<< "${components[$component]}"
    component_name="${component%.*}"
    
    cat << TEMPLATE > "$component"
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace-store"

export function $component_name() {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { addFiles, setContext } = useWorkspaceStore()

  const handleFiles = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setContext("$category", "$tool")
      addFiles(newFiles)
      router.push(\`/workspace?tool=$tool&category=$category\`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  return (
    <div 
      className={\`relative rounded-xl border-4 border-dashed transition-all p-8 md:p-16 text-center \${isDragging ? "border-white bg-white/20" : "border-white/30 hover:border-white/50"}\`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { 
        e.preventDefault(); 
        setIsDragging(false);
        if (e.dataTransfer.files) {
          handleFiles(Array.from(e.dataTransfer.files))
        }
      }}
    >
      <UploadCloud className="w-16 h-16 text-white mb-6 mx-auto opacity-80" />
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button 
        size="lg" 
        className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 h-14 mb-4 font-bold shadow-xl rounded-full"
        onClick={() => fileInputRef.current?.click()}
      >
        CHOOSE FILES
      </Button>
      <p className="text-white/80 text-sm mb-4">or drop files here</p>
    </div>
  )
}
TEMPLATE
    echo "Updated $component"
  fi
done
