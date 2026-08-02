"use client"

import { GenericToolUploader } from "./GenericToolUploader"

export function VideoEditor() {
  return (
    <GenericToolUploader
      toolName="Video Editor"
      accept="video/*"
      toolSlug="editor"
      category="video-tools"
    />
  )
}
