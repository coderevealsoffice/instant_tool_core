"use client"

import { useState, useRef } from "react"
import { Send, Upload, FileText, Loader2, Bot, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Message = {
  role: "user" | "bot"
  content: string
}

export function AiPdfChatbotCanvas() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfContext, setPdfContext] = useState<string>("")
  const [isExtracting, setIsExtracting] = useState(false)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setIsExtracting(true)
    setMessages([])
    setPdfContext("")

    try {
      const pdfjsLib = await import("pdfjs-dist")
      // Use cdnjs as it is more reliable for worker loading
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      
      const arrayBuffer = await uploadedFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
      }).promise
      
      let fullText = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")
        fullText += pageText + "\n"
      }

      setPdfContext(fullText)
      setMessages([{ role: "bot", content: `I've successfully read "${uploadedFile.name}". Ask me anything about it!` }])
      
    } catch (err: any) {
      console.error("PDF Extraction Error:", err)
      alert(`Failed to read PDF: ${err.message || "Unknown error"}. Please try a different PDF file.`)
      setFile(null)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !pdfContext) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsTyping(true)

    try {
      const res = await fetch("/api/ai-chat-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: pdfContext,
          question: userMessage,
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setMessages(prev => [...prev, { role: "bot", content: data.answer }])
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "bot", content: `Error: ${err.message}` }])
    } finally {
      setIsTyping(false)
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const resetChat = () => {
    setFile(null)
    setPdfContext("")
    setMessages([])
  }

  return (
    <div className="max-w-4xl mx-auto h-[700px] bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-fuchsia-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-200">AI PDF Chatbot</h2>
            <p className="text-xs text-slate-500">
              {file ? file.name : "Upload a PDF to begin"}
            </p>
          </div>
        </div>
        {file && (
          <Button variant="ghost" size="sm" onClick={resetChat} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/20">
        
        {!file && !isExtracting && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload a PDF</h3>
            <p className="text-slate-500 mb-8 max-w-sm text-center">
              Our AI will read your document and let you ask questions, summarize content, or find specific information instantly.
            </p>
            <label className="cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-all flex items-center gap-2">
              <Upload className="w-5 h-5" /> Choose PDF File
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {isExtracting && (
          <div className="h-full flex flex-col items-center justify-center text-fuchsia-600">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-bold animate-pulse">Reading document...</p>
          </div>
        )}

        {file && !isExtracting && (
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-fuchsia-100 text-fuchsia-600"}`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`px-5 py-3 rounded-2xl max-w-[80%] shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm"}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-sm flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
            placeholder={file ? "Ask a question about your PDF..." : "Upload a PDF first"}
            disabled={!file || isExtracting || isTyping}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-4 pl-6 pr-14 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500 outline-none disabled:opacity-50"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || !file || isTyping}
            className="absolute right-2 w-10 h-10 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

    </div>
  )
}
