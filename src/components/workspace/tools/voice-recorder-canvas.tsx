"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Mic, Square, Download, Activity, AudioLines } from "lucide-react"
import { toast } from "sonner"

export function VoiceRecorderCanvas() {
  const { addFiles } = useWorkspaceStore()
  
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Audio visualization
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      stopRecordingCleanup()
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const stopRecordingCleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close()
    }
  }

  const startRecording = async () => {
    try {
      setAudioUrl(null)
      setRecordingTime(0)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        const file = new File([blob], `Voice-Recording-${Date.now()}.webm`, { type: 'audio/webm' })
        addFiles([file])

        stopRecordingCleanup()
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(200)
      setIsRecording(true)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      setupVisualizer(stream)

    } catch (err) {
      console.error("Error accessing microphone:", err)
      toast.error("Could not access microphone. Please ensure you have granted permission.")
    }
  }

  const setupVisualizer = (stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = audioContext
    
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    analyserRef.current = analyser

    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)
    sourceRef.current = source

    drawVisualizer()
  }

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      // Keep checking if we are still recording to stop loop
      if (mediaRecorderRef.current?.state !== "recording") return 
      requestRef.current = requestAnimationFrame(draw)

      analyserRef.current?.getByteFrequencyData(dataArray)

      // Clear the canvas instead of painting a solid color for a clean overlay
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0
      
      const centerY = canvas.height / 2

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2
        
        // Create a nice gradient for the bars
        const gradient = canvasCtx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight)
        gradient.addColorStop(0, 'rgba(236, 72, 153, 1)') // pink-500
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 1)') // purple-500
        gradient.addColorStop(1, 'rgba(59, 130, 246, 1)') // blue-500

        canvasCtx.fillStyle = gradient
        
        // Draw centered symmetric bars
        canvasCtx.beginPath()
        canvasCtx.roundRect(x, centerY - barHeight, barWidth - 1, barHeight * 2, 4)
        canvasCtx.fill()

        x += barWidth
      }
    }
    
    draw()
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = `Voice-Recording-${Date.now()}.webm`
      a.click()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full max-w-4xl mx-auto space-y-10 py-10 px-4">
      
      {/* Main Display Area */}
      <div className="w-full bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] overflow-hidden aspect-[21/9] relative flex flex-col items-center justify-center border border-slate-800 shadow-2xl">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        
        {isRecording && (
          <>
            {/* Animated glowing orbs in background while recording */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </>
        )}
        
        {isRecording && (
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={200} 
            className="absolute inset-0 w-full h-full object-cover px-8"
          />
        )}

        <div className="z-10 flex flex-col items-center space-y-6">
          {/* Timer Display */}
          <div className={`text-6xl md:text-7xl font-mono font-bold tracking-widest transition-colors duration-500 ${isRecording ? 'text-white' : 'text-slate-400'}`}>
            {formatTime(recordingTime)}
          </div>

          {!isRecording && !audioUrl && (
            <div className="flex flex-col items-center mt-4">
              <AudioLines className="w-16 h-16 mb-4 text-slate-700 dark:text-slate-600 animate-pulse" />
              <p className="text-slate-500 text-lg font-medium">Tap the microphone to start recording</p>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center space-x-3 bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/5">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <span className="text-red-400 font-bold tracking-widest text-sm">RECORDING</span>
            </div>
          )}

          {audioUrl && !isRecording && (
            <div className="bg-black/40 p-4 rounded-full backdrop-blur-md border border-white/5 shadow-2xl mt-8">
              <audio 
                src={audioUrl} 
                controls 
                className="w-[300px] md:w-[400px] outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Controls Area */}
      <div className="flex items-center justify-center gap-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="group relative w-24 h-24 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 group-hover:opacity-40 blur-xl transition-opacity" />
            <div className="relative w-20 h-20 bg-gradient-to-tr from-red-600 to-pink-500 hover:from-red-500 hover:to-pink-400 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
              <Mic className="w-8 h-8 text-white drop-shadow-md" />
            </div>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="group relative w-24 h-24 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <div className="absolute inset-0 bg-slate-400 rounded-full opacity-20 blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center border border-slate-600 shadow-xl">
              <Square className="w-8 h-8 text-red-500 fill-current drop-shadow-md" />
            </div>
          </button>
        )}

        {audioUrl && !isRecording && (
          <button
            onClick={handleDownload}
            className="h-20 px-8 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-6 h-6" />
            <span className="text-lg">Save File</span>
          </button>
        )}
      </div>

      {audioUrl && !isRecording && (
        <div className="text-sm text-slate-500 bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          Recording saved. You can download it directly, or click <strong>Finish</strong>.
        </div>
      )}
    </div>
  )
}
