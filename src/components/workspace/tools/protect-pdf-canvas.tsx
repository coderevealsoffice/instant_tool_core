"use client"

import { useState } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Lock, Loader2, CheckCircle, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react"
import { ToolSplitView } from "../canvases/tool-split-view"
import { PDFDocument } from "pdf-lib"

export function ProtectPdfCanvas() {
  const { files } = useWorkspaceStore()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [permissions, setPermissions] = useState({ printing: true, copying: false, editing: false })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeFile = files?.[0]?.file ?? null

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <Lock className="w-12 h-12 opacity-50" />
        <p>Upload a PDF file to password-protect it.</p>
      </div>
    )
  }

  const handleProcess = async () => {
    setError(null)
    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsProcessing(true)
    setIsDone(false)
    try {
      const arrayBuffer = await activeFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true } as any)

      // pdf-lib can set user/owner passwords and permissions
      const pdfBytes = await pdfDoc.save({
        userPassword: password,
        ownerPassword: `${password}_owner`,
        permissions: {
          printing: permissions.printing ? "highResolution" : "none",
          modifying: permissions.editing,
          copying: permissions.copying,
          annotating: false,
          fillingForms: false,
          contentAccessibility: true,
          documentAssembly: false,
        },
      } as any)

      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const baseName = activeFile.name.replace(/\.[^/.]+$/, "")
      a.download = `${baseName}-protected.pdf`
      a.click()
      URL.revokeObjectURL(url)

      setIsDone(true)
    } catch (e: any) {
      console.error(e)
      setError(`Failed to protect PDF: ${e.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthLabels = ["", "Weak", "Good", "Strong"]
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-emerald-500"]

  return (
    <ToolSplitView
      title="Protect PDF"
      description="Protect PDF"
      icon={<Lock className="w-6 h-6 text-red-600" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={0}
      isDone={isDone}
      onProcess={() => setShowPassword(v => !v)}
      processButtonText="Protect & Download"
      resultUrl={undefined}
      
    />
  )
}
