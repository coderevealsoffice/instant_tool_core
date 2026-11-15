"use client"

import dynamic from "next/dynamic"

export const ClientAiFaceBlurCanvas = dynamic(
  () => import("@/components/workspace/tools/ai/ai-face-blur-canvas").then((mod) => mod.AiFaceBlurCanvas),
  { ssr: false }
)

export const ClientAiImageUpscalerCanvas = dynamic(
  () => import("@/components/workspace/tools/ai/ai-image-upscaler-canvas").then((mod) => mod.AiImageUpscalerCanvas),
  { ssr: false }
)

export const ClientAiSmartCropCanvas = dynamic(
  () => import("@/components/workspace/tools/ai/ai-smart-crop-canvas").then((mod) => mod.AiSmartCropCanvas),
  { ssr: false }
)

export const ClientAiImageEditorCanvas = dynamic(
  () => import("@/components/workspace/tools/ai/ai-image-editor-canvas").then((mod) => mod.AiImageEditorCanvas),
  { ssr: false }
)
