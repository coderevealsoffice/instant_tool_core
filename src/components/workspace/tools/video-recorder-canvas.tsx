"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Video, Square, Download, Mic, MicOff } from "lucide-react"
import { toast } from "sonner"

export function VideoRecorderCanvas() {
  const { addFiles } = useWorkspaceStore()
  
  const [isRecording, setIsRecording] = useState(false)
  const [includeAudio, setIncludeAudio] = useState(true)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Start camera preview immediately when component mounts
    startCameraPreview()
    return () => {
      stopMediaTracks()
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [])

  useEffect(() => {
    // Toggle audio track based on state
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = includeAudio
      })
    }
  }, [includeAudio])

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true
      })
      
      stream.getAudioTracks().forEach(track => {
        track.enabled = includeAudio
      })

      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
      toast.error("Could not access webcam/microphone. Please ensure you have granted permission.")
    }
  }

  const startRecording = () => {
    if (!streamRef.current) return
    
    setVideoUrl(null)
    chunksRef.current = []

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm; codecs=vp9'
    })

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      
      const file = new File([blob], `Webcam-Recording-${Date.now()}.webm`, { type: 'video/webm' })
      addFiles([file])
      
      // Stop the stream so the camera light goes off
      stopMediaTracks()
      if (videoRef.current) videoRef.current.srcObject = null
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start(200)
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }

  const resetCamera = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    startCameraPreview()
  }

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `Webcam-Recording-${Date.now()}.webm`
      a.click()
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6">
      
      <div className="w-full bg-slate-900 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center border-4 border-slate-800 shadow-xl">
        
        {/* Live Preview or Recorded Video */}
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted={!videoUrl} // mute live preview to avoid feedback, unmute playback
          className={`w-full h-full object-cover ${!streamRef.current && !videoUrl ? 'hidden' : ''}`}
          src={videoUrl || undefined}
          controls={!!videoUrl}
        />
        
        {!streamRef.current && !videoUrl && (
          <div className="text-center text-slate-500 flex flex-col items-center">
            <Video className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">Waiting for camera access...</p>
          </div>
        )}
        
        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center animate-pulse shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-2" />
            REC
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIncludeAudio(!includeAudio)}
              disabled={isRecording || !!videoUrl}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                includeAudio 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              } ${(isRecording || videoUrl) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
            >
              {includeAudio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              <span className="font-medium">{includeAudio ? 'Mic On' : 'Mic Off'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {!isRecording && !videoUrl ? (
              <button
                onClick={startRecording}
                disabled={!streamRef.current}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-md"
              >
                <Video className="w-5 h-5" />
                <span>Start Recording</span>
              </button>
            ) : isRecording ? (
              <button
                onClick={stopRecording}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-md"
              >
                <Square className="w-5 h-5" />
                <span>Stop Recording</span>
              </button>
            ) : (
              <>
                <button
                  onClick={resetCamera}
                  className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
                >
                  <span>Record Another</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-md"
                >
                  <Download className="w-5 h-5" />
                  <span>Save Local</span>
                </button>
              </>
            )}
          </div>
        </div>

        {videoUrl && (
          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm flex items-start space-x-3">
            <Video className="w-5 h-5 shrink-0" />
            <p>
              Recording finished! You can download it locally or click <strong>Finish</strong> in the top right to complete the workflow.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
