"use client"

import { useState, useRef, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { MessageSquare, Play, Square, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
];

export function TextToSpeechCanvas() {
  const { addFiles } = useWorkspaceStore()
  const [text, setText] = useState("Hello! Welcome to our AI text to speech tool. Type anything here and we will convert it to a downloadable audio file.")
  const [lang, setLang] = useState<string>("en")
  const [isSlow, setIsSlow] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const handleGenerate = async () => {
    if (!text.trim()) return
    setIsGenerating(true)
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          lang,
          slow: isSlow,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate speech");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      // Auto play after generating
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
      
      toast.success("Audio generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const a = document.createElement("a")
    a.href = audioUrl
    a.download = `speech-${Date.now()}.mp3`
    a.click()
    
    fetch(audioUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `speech-${Date.now()}.mp3`, { type: "audio/mpeg" })
        addFiles([file])
        toast.success("Saved to workspace!")
      })
  }

  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col items-center justify-start h-full w-full space-y-6 pt-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center shadow-2xl">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Text to Speech</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Powered by Free AI Audio Engine</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full space-y-4">

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Text to Convert</label>
            <span className="text-xs text-slate-400">{wordCount} words · {charCount} chars</span>
          </div>
          <textarea
            rows={6}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste your text here (up to 5000 characters)..."
            className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm dark:bg-slate-700 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white">
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-center">
            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mt-6 cursor-pointer">
              <input type="checkbox" checked={isSlow} onChange={e => setIsSlow(e.target.checked)} className="w-4 h-4 accent-slate-700" />
              <span>Slow down speech rate</span>
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={handleGenerate} 
            disabled={!text.trim() || isGenerating}
            className="flex-1 bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Generate Speech"}
          </button>
          
          {audioUrl && (
            <button 
              onClick={handleDownload}
              className="px-6 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 py-3 rounded-lg font-bold hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download MP3
            </button>
          )}
        </div>
        
        {/* Hidden audio element to play the generated blob */}
        <audio 
          ref={audioRef} 
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          className="hidden" 
        />
        
        {audioUrl && (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700 mt-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
              </button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Generated Audio</span>
            </div>
            
            {/* HTML5 Native audio controls for seeking (if user wants native UI, we could expose it, but custom is cleaner) */}
            <audio controls src={audioUrl} className="h-8 max-w-[200px]" />
          </div>
        )}

      </div>
    </div>
  )
}
