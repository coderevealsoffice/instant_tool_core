"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import {
  Play, Pause, Download, Undo2, Redo2, Type, Film, Music,
  ZoomIn, ZoomOut, Scissors, MousePointer2, Plus, Trash2,
  Eye, EyeOff, Lock, Unlock, SkipBack, SkipForward,
  Loader2, Volume2, MonitorPlay, Image as ImageIcon
} from "lucide-react"
import { getFFmpeg } from "@/lib/ffmpeg/client"
import { fetchFile } from "@ffmpeg/util"
import { toast } from "sonner"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type TrackType = "video" | "audio" | "text" | "image"

export interface TrackItem {
  id: string
  type: TrackType
  layerId: string
  start: number
  duration: number
  file?: File
  url?: string
  x: number
  y: number
  w: number
  h: number
  rotation: number
  opacity: number
  trimStart: number
  volume: number
  text?: string
  fontSize?: number
  color?: string
  fontWeight?: string
  bgColor?: string
}

export interface Layer {
  id: string
  type: TrackType
  label: string
  visible: boolean
  locked: boolean
  order: number
}

export interface TimelineState {
  items: TrackItem[]
  layers: Layer[]
  duration: number
  canvasRatio: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Undo / Redo Hook
// ─────────────────────────────────────────────────────────────────────────────
function useUndoableState<T>(init: T) {
  const [state, setState] = useState<T>(init)
  const [past, setPast] = useState<T[]>([])
  const [future, setFuture] = useState<T[]>([])

  const set = useCallback((next: T | ((c: T) => T)) => {
    setState(curr => {
      const n = typeof next === "function" ? (next as (c: T) => T)(curr) : next
      setPast(p => [...p.slice(-40), curr])
      setFuture([])
      return n
    })
  }, [])

  const undo = useCallback(() => {
    if (!past.length) return
    const prev = past[past.length - 1]
    setPast(p => p.slice(0, -1))
    setFuture(f => [state, ...f])
    setState(prev)
  }, [past, state])

  const redo = useCallback(() => {
    if (!future.length) return
    const next = future[0]
    setFuture(f => f.slice(1))
    setPast(p => [...p, state])
    setState(next)
  }, [future, state])

  return [state, set, undo, redo, past.length > 0, future.length > 0] as const
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers & Constants
// ─────────────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9)

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  const f = Math.floor((s % 1) * 10)
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${f}`
}

const LAYER_COLORS: Record<TrackType, string> = {
  video: "#1d6dd4",
  audio: "#0d9668",
  text:  "#7c3aed",
  image: "#c2630a",
}

const LAYER_BG: Record<TrackType, string> = {
  video: "rgba(29,109,212,0.75)",
  audio: "rgba(13,150,104,0.75)",
  text:  "rgba(124,58,237,0.75)",
  image: "rgba(194,99,10,0.75)",
}

const LAYER_ORDER: Record<TrackType, number> = { video: 1, audio: 2, image: 3, text: 4 }
const LAYER_LABELS: Record<TrackType, string> = { video: "Video Layer", audio: "Audio Layer", image: "Image Layer", text: "Text Layer" }

const LayerIcon = ({ type, size = 14 }: { type: TrackType; size?: number }) => {
  const props = { style: { width: size, height: size } }
  if (type === "video") return <Film {...props} />
  if (type === "audio") return <Music {...props} />
  if (type === "image") return <ImageIcon {...props} />
  return <Type {...props} />
}

const generateVideoThumbnail = (file: File): Promise<string> =>
  new Promise(resolve => {
    const vid = document.createElement("video")
    vid.muted = true
    vid.preload = "metadata"
    vid.src = URL.createObjectURL(file)
    vid.currentTime = 0.5
    vid.onloadeddata = () => {
      const c = document.createElement("canvas")
      c.width = 160; c.height = 90
      c.getContext("2d")?.drawImage(vid, 0, 0, 160, 90)
      resolve(c.toDataURL("image/jpeg", 0.6))
    }
    vid.onerror = () => resolve("")
  })

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export function VideoEditorCanvas() {
  const { files: storeFiles } = useWorkspaceStore()
  const initialFile = storeFiles?.[0]?.file ?? null

  // ── Core state ─────────────────────────────────────────────────────────────
  const [tl, setTl, undo, redo, canUndo, canRedo] = useUndoableState<TimelineState>({
    items: [], layers: [], duration: 30, canvasRatio: "16:9",
  })

  interface BinItem { id: string; file: File; url: string; type: TrackType; name: string; thumb?: string }
  const [mediaBin, setMediaBin] = useState<BinItem[]>([])
  const [panel, setPanel] = useState<"media" | "props">("media")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [playhead, setPlayhead] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProg, setExportProg] = useState(0)

  // ── Refs ───────────────────────────────────────────────────────────────────
  const stageRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef(0)
  const mediaRefs = useRef<Record<string, HTMLMediaElement>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const ppsRef = useRef(60)  // pixels per second – kept in ref to avoid stale closures
  ppsRef.current = 60 * zoom

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedItem = tl.items.find(i => i.id === selectedId) ?? null
  const sortedLayers = [...tl.layers].sort((a, b) => a.order - b.order)

  // ── Seed from workspace store file ────────────────────────────────────────
  useEffect(() => {
    if (!initialFile || mediaBin.length > 0) return
    const type: TrackType = initialFile.type.startsWith("audio") ? "audio"
      : initialFile.type.startsWith("image") ? "image" : "video"
    const url = URL.createObjectURL(initialFile)

    if (type === "video") {
      generateVideoThumbnail(initialFile).then(thumb => {
        setMediaBin([{ id: uid(), file: initialFile, url, type, name: initialFile.name, thumb }])
      })
      const v = document.createElement("video")
      v.src = url
      v.onloadedmetadata = () => {
        const layerId = "video-main"
        setTl(() => ({
          canvasRatio: `${v.videoWidth}/${v.videoHeight}`,
          duration: Math.max(30, v.duration + 5),
          layers: [{ id: layerId, type: "video", label: "Video Layer", visible: true, locked: false, order: 1 }],
          items: [{
            id: uid(), type: "video", layerId,
            start: 0, duration: v.duration || 10,
            file: initialFile, url,
            x: 0, y: 0, w: 100, h: 100,
            rotation: 0, opacity: 1, trimStart: 0, volume: 100,
          }],
        }))
      }
    } else {
      setMediaBin([{ id: uid(), file: initialFile, url, type, name: initialFile.name }])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFile])

  // ── Playback engine ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now()
      const loop = (now: number) => {
        const dt = (now - lastTimeRef.current) / 1000
        lastTimeRef.current = now
        setPlayhead(p => {
          const next = p + dt
          if (next >= tl.duration) { setIsPlaying(false); return 0 }
          return next
        })
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isPlaying, tl.duration])

  // ── Media sync ─────────────────────────────────────────────────────────────
  useEffect(() => {
    tl.items.forEach(item => {
      if ((item.type === "video" || item.type === "audio") && mediaRefs.current[item.id]) {
        const m = mediaRefs.current[item.id]
        m.volume = Math.min(1, Math.max(0, item.volume / 100))
        if (playhead >= item.start && playhead < item.start + item.duration) {
          const target = item.trimStart + (playhead - item.start)
          if (Math.abs(m.currentTime - target) > 0.25) m.currentTime = target
          if (isPlaying && m.paused) m.play().catch(() => {})
          if (!isPlaying && !m.paused) m.pause()
        } else {
          if (!m.paused) m.pause()
        }
      }
    })
  }, [playhead, isPlaying, tl.items])

  // ── Item updates ───────────────────────────────────────────────────────────
  const updateItem = useCallback((id: string, patch: Partial<TrackItem>) => {
    setTl(curr => ({ ...curr, items: curr.items.map(i => i.id === id ? { ...i, ...patch } : i) }))
  }, [setTl])

  const deleteItem = (id: string) => {
    setTl(curr => {
      const newItems = curr.items.filter(i => i.id !== id)
      const usedLayers = new Set(newItems.map(i => i.layerId))
      return { ...curr, items: newItems, layers: curr.layers.filter(l => usedLayers.has(l.id)) }
    })
    setSelectedId(null)
  }

  const toggleLayer = (layerId: string, prop: "visible" | "locked") => {
    setTl(curr => ({
      ...curr,
      layers: curr.layers.map(l => l.id === layerId ? { ...l, [prop]: !l[prop] } : l),
    }))
  }

  // ── Add media from bin ─────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const bins = await Promise.all(Array.from(files).map(async f => {
      const type: TrackType = f.type.startsWith("audio") ? "audio"
        : f.type.startsWith("image") ? "image" : "video"
      const url = URL.createObjectURL(f)
      const thumb = type === "video" ? await generateVideoThumbnail(f) : undefined
      return { id: uid(), file: f, url, type, name: f.name, thumb }
    }))
    setMediaBin(curr => [...curr, ...bins])
  }

  const addToTimeline = (bin: BinItem) => {
    const { type } = bin
    // Use shared layer per type
    const existingLayer = tl.layers.find(l => l.type === type)
    const layerId = existingLayer?.id ?? `${type}-${uid()}`

    const doAdd = (dur: number) => {
      setTl(curr => {
        const hasLayer = curr.layers.some(l => l.id === layerId)
        return {
          ...curr,
          layers: hasLayer ? curr.layers : [
            ...curr.layers,
            { id: layerId, type, label: LAYER_LABELS[type], visible: true, locked: false, order: LAYER_ORDER[type] },
          ],
          items: [...curr.items, {
            id: uid(), type, layerId,
            start: playhead, duration: dur,
            file: bin.file, url: bin.url,
            x: 0, y: 0, w: 100, h: 100,
            rotation: 0, opacity: 1, trimStart: 0, volume: 100,
          }],
        }
      })
      toast.success(`${LAYER_LABELS[type]} added at ${fmtTime(playhead)}`)
    }

    if (type === "video" || type === "audio") {
      const el = document.createElement(type)
      el.src = bin.url
      el.onloadedmetadata = () => doAdd(el.duration || 5)
    } else {
      doAdd(5)
    }
  }

  const addTextLayer = () => {
    const layerId = `text-${uid()}`
    setTl(curr => ({
      ...curr,
      layers: [...curr.layers, { id: layerId, type: "text", label: "Text Layer", visible: true, locked: false, order: 4 }],
      items: [...curr.items, {
        id: uid(), type: "text", layerId,
        start: playhead, duration: 3,
        x: 15, y: 38, w: 70, h: 24,
        rotation: 0, opacity: 1, trimStart: 0, volume: 0,
        text: "Your text here", fontSize: 52, color: "#ffffff",
        fontWeight: "bold", bgColor: "transparent",
      }],
    }))
    setPanel("props")
    toast.success("Text layer added")
  }

  const splitAtPlayhead = () => {
    if (!selectedId) { toast.error("Select a clip to split"); return }
    const item = tl.items.find(i => i.id === selectedId)
    if (!item) return
    if (playhead <= item.start || playhead >= item.start + item.duration) {
      toast.error("Move playhead over the selected clip to split it"); return
    }
    const cut = playhead - item.start
    setTl(curr => ({
      ...curr,
      items: [
        ...curr.items.filter(i => i.id !== item.id),
        { ...item, duration: cut },
        { ...item, id: uid(), start: playhead, duration: item.duration - cut, trimStart: item.trimStart + cut },
      ],
    }))
    toast.success("Clip split")
  }

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  type DragType = "tl_move" | "tl_trim_l" | "tl_trim_r" | "stage_move" | "stage_resize" | "stage_rotate"
  const [drag, setDrag] = useState<{ type: DragType; id: string; sx: number; sy: number; orig: TrackItem } | null>(null)

  useEffect(() => {
    if (!drag) return
    const onMove = (e: MouseEvent) => {
      const { type, id, sx, sy, orig } = drag
      const dx = e.clientX - sx
      const dy = e.clientY - sy

      if (type === "tl_move") {
        updateItem(id, { start: Math.max(0, orig.start + dx / ppsRef.current) })
      } else if (type === "tl_trim_l") {
        const applied = Math.max(-orig.start, Math.min(orig.duration - 0.2, dx / ppsRef.current))
        updateItem(id, {
          start: orig.start + applied,
          duration: orig.duration - applied,
          trimStart: orig.trimStart + applied,
        })
      } else if (type === "tl_trim_r") {
        updateItem(id, { duration: Math.max(0.2, orig.duration + dx / ppsRef.current) })
      } else if (stageRef.current) {
        const r = stageRef.current.getBoundingClientRect()
        if (type === "stage_move") {
          updateItem(id, { x: orig.x + (dx / r.width) * 100, y: orig.y + (dy / r.height) * 100 })
        } else if (type === "stage_resize") {
          updateItem(id, {
            w: Math.max(5, orig.w + (dx / r.width) * 100),
            h: Math.max(5, orig.h + (dy / r.height) * 100),
          })
        } else if (type === "stage_rotate") {
          const cx = r.left + ((orig.x + orig.w / 2) / 100) * r.width
          const cy = r.top + ((orig.y + orig.h / 2) / 100) * r.height
          updateItem(id, { rotation: Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90 })
        }
      }
    }
    const onUp = () => setDrag(null)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [drag, updateItem])

  // ── FFmpeg Export ──────────────────────────────────────────────────────────
  const handleExport = async () => {
    const videoItems = tl.items.filter(i => i.type === "video" && i.file)
    if (!videoItems.length) { toast.error("Add a video clip first"); return }

    setIsExporting(true)
    setExportProg(0)

    try {
      const ff = await getFFmpeg()
      ff.on("progress", ({ progress }) => setExportProg(Math.round(progress * 100)))

      // Write video files
      const mainVid = videoItems[0]
      const vidExt = mainVid.file!.name.split(".").pop() ?? "mp4"
      await ff.writeFile(`vid_0.${vidExt}`, await fetchFile(mainVid.file!))

      // Write audio files
      const audioItems = tl.items.filter(i => i.type === "audio" && i.file)
      for (let idx = 0; idx < audioItems.length; idx++) {
        const ext = audioItems[idx].file!.name.split(".").pop() ?? "mp3"
        await ff.writeFile(`aud_${idx}.${ext}`, await fetchFile(audioItems[idx].file!))
      }

      // Determine output resolution (always even numbers)
      let resW = 1920, resH = 1080
      const ratio = tl.canvasRatio.includes("/") ? tl.canvasRatio : tl.canvasRatio.replace(":", "/")
      const [rw, rh] = ratio.split("/").map(Number)
      if (rw > 0 && rh > 0) {
        if (rw >= rh) { resW = 1920; resH = Math.round(1920 * rh / rw) }
        else { resH = 1920; resW = Math.round(1920 * rw / rh) }
        if (resW % 2 !== 0) resW -= 1
        if (resH % 2 !== 0) resH -= 1
      }

      // Build video filter chain
      let vf = `trim=start=${mainVid.trimStart}:duration=${mainVid.duration},setpts=PTS-STARTPTS`
      vf += `,scale=${resW}:${resH}:force_original_aspect_ratio=decrease`
      vf += `,pad=${resW}:${resH}:(ow-iw)/2:(oh-ih)/2`

      // Text overlays
      const textItems = tl.items.filter(i => i.type === "text" && i.text)
      for (const t of textItems) {
        const safeText = (t.text ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/:/g, "\\:")
        const hexColor = (t.color ?? "#ffffff").replace("#", "")
        const fx = `(w*${(t.x / 100).toFixed(4)})`
        const fy = `(h*${(t.y / 100).toFixed(4)})`
        const enableExpr = `between(t,${t.start.toFixed(2)},${(t.start + t.duration).toFixed(2)})`
        vf += `,drawtext=text='${safeText}':fontsize=${t.fontSize ?? 48}:fontcolor=0x${hexColor}:x=${fx}:y=${fy}:enable='${enableExpr}'`
        if (t.fontWeight === "bold" || t.fontWeight === "900") {
          // Add bold styling via drawtext options — ffmpeg doesn't have bold natively without a bold font file
          // We approximate by adding a subtle shadow
          vf += `:shadowcolor=black:shadowx=1:shadowy=1`
        }
      }

      // Build ffmpeg args
      const args: string[] = ["-i", `vid_0.${vidExt}`]

      if (audioItems.length > 0) {
        const audExt = audioItems[0].file!.name.split(".").pop() ?? "mp3"
        args.push("-i", `aud_0.${audExt}`)
      }

      args.push("-vf", vf)

      if (audioItems.length > 0) {
        // Mix video's audio with extra audio track
        args.push(
          "-filter_complex",
          `[0:a]volume=1.0[va];[1:a]volume=${(audioItems[0].volume / 100).toFixed(2)}[aa];[va][aa]amix=inputs=2:duration=first[aout]`,
          "-map", "0:v",
          "-map", "[aout]",
        )
      }

      args.push("-c:v", "libx264", "-preset", "fast", "-c:a", "aac", "-movflags", "+faststart", "output.mp4")

      await ff.exec(args)

      const data = await ff.readFile("output.mp4")
      const blob = new Blob([data as unknown as BlobPart], { type: "video/mp4" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url; a.download = "edited-video.mp4"; a.click()
      URL.revokeObjectURL(url)
      toast.success("🎬 Video exported successfully!")
    } catch (err: unknown) {
      console.error(err)
      toast.error((err as Error)?.message ?? "Export failed — see console for details")
    } finally {
      setIsExporting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  const PPS = ppsRef.current

  return (
    <div
      className="flex flex-col text-[#e4e4e7] select-none overflow-hidden"
      style={{ height: "100vh", background: "#111", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 44, background: "#1a1a1a", borderBottom: "1px solid #272727" }}
      >
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
              <Film style={{ width: 13, height: 13, color: "#fff" }} />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Video Editor</span>
          </div>

          <div style={{ width: 1, height: 16, background: "#2a2a2a" }} />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            {([
              { action: undo, enabled: canUndo, Icon: Undo2, label: "Undo" },
              { action: redo, enabled: canRedo, Icon: Redo2, label: "Redo" },
            ] as const).map(({ action, enabled, Icon, label }) => (
              <button
                key={label}
                onClick={action}
                disabled={!enabled}
                title={label}
                className="p-1.5 rounded transition-colors"
                style={{ color: enabled ? "#9ca3af" : "#3a3a3a" }}
                onMouseEnter={e => { if (enabled) (e.currentTarget as HTMLButtonElement).style.background = "#252525" }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
              >
                <Icon style={{ width: 14, height: 14 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Export */}
        <div className="flex items-center gap-3">
          {isExporting && (
            <div className="flex items-center gap-2 text-xs" style={{ color: "#60a5fa" }}>
              <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />
              Exporting {exportProg}%…
            </div>
          )}
          <button
            onClick={handleExport}
            disabled={isExporting || !tl.items.some(i => i.type === "video")}
            className="flex items-center gap-2 text-white text-sm font-semibold px-4 rounded-lg transition-all"
            style={{
              height: 32,
              background: isExporting || !tl.items.some(i => i.type === "video") ? "#2a2a2a" : "#2563eb",
              color: isExporting || !tl.items.some(i => i.type === "video") ? "#555" : "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            {isExporting
              ? <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />
              : <Download style={{ width: 13, height: 13 }} />}
            Export
          </button>
        </div>
      </header>

      {/* ══ WORKSPACE ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex min-h-0">

        {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
        <aside
          className="flex flex-col shrink-0"
          style={{ width: 256, background: "#1a1a1a", borderRight: "1px solid #242424" }}
        >
          {/* Tabs */}
          <div className="flex shrink-0" style={{ borderBottom: "1px solid #242424", background: "#161616" }}>
            {(["media", "props"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setPanel(tab)}
                className="flex-1 text-xs font-semibold capitalize py-2.5 transition-colors"
                style={{
                  color: panel === tab ? "#fff" : "#555",
                  borderBottom: panel === tab ? "2px solid #2563eb" : "2px solid transparent",
                  background: "transparent",
                }}
              >
                {tab === "media" ? "Media" : "Properties"}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarColor: "#2a2a2a #111" }}>

            {/* ─ Media Panel ─ */}
            {panel === "media" && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2 rounded-xl text-xs transition-all"
                  style={{ padding: "20px 0", border: "2px dashed #2a2a2a", background: "#1f1f1f", color: "#555" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563eb"
                    ;(e.currentTarget as HTMLButtonElement).style.color = "#60a5fa"
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"
                    ;(e.currentTarget as HTMLButtonElement).style.color = "#555"
                  }}
                >
                  <Plus style={{ width: 18, height: 18 }} />
                  Import Media
                </button>
                <input ref={fileInputRef} type="file" multiple className="hidden"
                  accept="video/*,image/*,audio/*" onChange={handleFileUpload} />

                {mediaBin.length === 0 && (
                  <p className="text-center pt-1" style={{ fontSize: 11, color: "#444" }}>
                    Upload video, audio, or image files
                  </p>
                )}

                <div className="space-y-1.5">
                  {mediaBin.map(bin => (
                    <div
                      key={bin.id}
                      className="flex items-center gap-3 rounded-lg cursor-pointer transition-colors"
                      style={{ padding: "8px 10px", background: "#202020", border: "1px solid #2a2a2a" }}
                      onClick={() => addToTimeline(bin)}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#272727"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#202020"}
                    >
                      {bin.thumb ? (
                        <img src={bin.thumb} alt="" className="rounded object-cover flex-shrink-0"
                          style={{ width: 48, height: 27 }} />
                      ) : (
                        <div className="rounded flex items-center justify-center flex-shrink-0"
                          style={{ width: 48, height: 27, background: LAYER_COLORS[bin.type] + "33" }}>
                          <span style={{ color: LAYER_COLORS[bin.type] }}>
                            <LayerIcon type={bin.type} size={13} />
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: 11, color: "#ccc" }}>{bin.name}</p>
                        <p className="capitalize" style={{ fontSize: 10, color: "#555" }}>{bin.type}</p>
                      </div>
                      <Plus style={{ width: 12, height: 12, color: "#444", flexShrink: 0 }} />
                    </div>
                  ))}
                </div>

                <div className="pt-1 space-y-1" style={{ borderTop: "1px solid #222" }}>
                  <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, paddingTop: 4 }}>
                    Quick Add
                  </p>
                  <button
                    onClick={addTextLayer}
                    className="w-full flex items-center gap-2.5 rounded-lg text-xs transition-colors"
                    style={{ padding: "8px 12px", background: "#1f1f1f", border: "1px solid #2a2a2a", color: "#aaa" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff"
                      ;(e.currentTarget as HTMLButtonElement).style.background = "#252525"
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#aaa"
                      ;(e.currentTarget as HTMLButtonElement).style.background = "#1f1f1f"
                    }}
                  >
                    <Type style={{ width: 14, height: 14, color: "#7c3aed" }} />
                    Add Text Layer
                  </button>
                </div>
              </>
            )}

            {/* ─ Properties Panel ─ */}
            {panel === "props" && (
              <>
                {selectedItem ? (
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ color: LAYER_COLORS[selectedItem.type] }}>
                          <LayerIcon type={selectedItem.type} size={14} />
                        </span>
                        <span className="text-xs font-bold text-white capitalize">{selectedItem.type} Layer</span>
                      </div>
                      <button
                        onClick={() => deleteItem(selectedItem.id)}
                        className="p-1 rounded transition-colors"
                        style={{ color: "#555" }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#f87171"
                          ;(e.currentTarget as HTMLButtonElement).style.background = "#2d1515"
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#555"
                          ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
                        }}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
                    </div>

                    {/* Timing */}
                    <PropSection label="Timing">
                      <div className="grid grid-cols-2 gap-2">
                        <PropInput label="Start (s)" type="number" step={0.1}
                          value={selectedItem.start.toFixed(1)}
                          onChange={v => updateItem(selectedItem.id, { start: +v })} />
                        <PropInput label="Duration (s)" type="number" step={0.1}
                          value={selectedItem.duration.toFixed(1)}
                          onChange={v => updateItem(selectedItem.id, { duration: Math.max(0.1, +v) })} />
                      </div>
                    </PropSection>

                    {/* Transform */}
                    <PropSection label="Transform">
                      <PropSlider label="Opacity" value={selectedItem.opacity} min={0} max={1} step={0.05}
                        display={`${Math.round(selectedItem.opacity * 100)}%`}
                        onChange={v => updateItem(selectedItem.id, { opacity: v })}
                        color="#2563eb" />
                      <PropSlider label="Rotation" value={selectedItem.rotation} min={-180} max={180} step={1}
                        display={`${Math.round(selectedItem.rotation)}°`}
                        onChange={v => updateItem(selectedItem.id, { rotation: v })}
                        color="#2563eb" />
                    </PropSection>

                    {/* Volume */}
                    {(selectedItem.type === "video" || selectedItem.type === "audio") && (
                      <PropSection label="Audio">
                        <PropSlider label="Volume" value={selectedItem.volume} min={0} max={200} step={5}
                          display={`${selectedItem.volume}%`}
                          onChange={v => updateItem(selectedItem.id, { volume: v })}
                          color="#0d9668" />
                      </PropSection>
                    )}

                    {/* Text controls */}
                    {selectedItem.type === "text" && (
                      <PropSection label="Text">
                        <textarea
                          value={selectedItem.text ?? ""}
                          onChange={e => updateItem(selectedItem.id, { text: e.target.value })}
                          className="w-full rounded-lg resize-none outline-none text-xs text-white"
                          style={{
                            minHeight: 64, padding: "8px 10px",
                            background: "#1e1e1e", border: "1px solid #2a2a2a",
                            lineHeight: 1.5,
                          }}
                          onFocus={e => (e.currentTarget as HTMLTextAreaElement).style.borderColor = "#2563eb"}
                          onBlur={e => (e.currentTarget as HTMLTextAreaElement).style.borderColor = "#2a2a2a"}
                        />

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <label style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 4 }}>Color</label>
                            <input type="color" value={selectedItem.color ?? "#ffffff"}
                              onChange={e => updateItem(selectedItem.id, { color: e.target.value })}
                              className="w-full rounded cursor-pointer"
                              style={{ height: 32, border: "1px solid #2a2a2a", background: "transparent" }} />
                          </div>
                          <PropInput label="Font Size" type="number"
                            value={String(selectedItem.fontSize ?? 48)}
                            onChange={v => updateItem(selectedItem.id, { fontSize: +v })} />
                        </div>

                        <div className="mt-2">
                          <label style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 4 }}>Weight</label>
                          <select value={selectedItem.fontWeight ?? "bold"}
                            onChange={e => updateItem(selectedItem.id, { fontWeight: e.target.value })}
                            className="w-full rounded-lg text-xs text-white outline-none"
                            style={{ padding: "6px 10px", background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                            <option value="900">Black</option>
                          </select>
                        </div>

                        <div className="mt-2">
                          <label style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 4 }}>Background</label>
                          <div className="flex gap-2">
                            <input type="color"
                              value={selectedItem.bgColor === "transparent" ? "#000000" : selectedItem.bgColor ?? "#000000"}
                              onChange={e => updateItem(selectedItem.id, { bgColor: e.target.value })}
                              className="rounded flex-shrink-0 cursor-pointer"
                              style={{ width: 36, height: 32, border: "1px solid #2a2a2a", background: "transparent" }} />
                            <button
                              onClick={() => updateItem(selectedItem.id, { bgColor: "transparent" })}
                              className="flex-1 text-xs rounded-lg transition-colors"
                              style={{
                                border: selectedItem.bgColor === "transparent" ? "1px solid #2563eb" : "1px solid #2a2a2a",
                                color: selectedItem.bgColor === "transparent" ? "#60a5fa" : "#555",
                                background: "transparent",
                              }}
                            >None</button>
                          </div>
                        </div>
                      </PropSection>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                    <MousePointer2 style={{ width: 32, height: 32, color: "#2a2a2a" }} />
                    <p style={{ fontSize: 11, color: "#444" }}>
                      Click a clip in the<br />timeline to edit properties
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* ── CENTER: PREVIEW + TIMELINE ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">

          {/* ── PREVIEW MONITOR ─────────────────────────────────────────── */}
          <div className="flex-[5] flex flex-col min-h-0" style={{ background: "#111" }}>

            {/* Monitor bar */}
            <div
              className="flex items-center justify-between px-4 shrink-0"
              style={{ height: 38, background: "#1a1a1a", borderBottom: "1px solid #222" }}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 11, color: "#444" }}>Preview</span>
                <select
                  value={tl.canvasRatio}
                  onChange={e => setTl(c => ({ ...c, canvasRatio: e.target.value }))}
                  className="text-xs rounded outline-none"
                  style={{
                    padding: "3px 8px", background: "#1e1e1e",
                    border: "1px solid #2a2a2a", color: "#888",
                  }}
                >
                  {!["16:9", "9:16", "1:1", "4:3"].includes(tl.canvasRatio) && (
                    <option value={tl.canvasRatio}>Source ({tl.canvasRatio})</option>
                  )}
                  <option value="16:9">16:9 — Landscape</option>
                  <option value="9:16">9:16 — Portrait / Reels</option>
                  <option value="1:1">1:1 — Square</option>
                  <option value="4:3">4:3 — Classic</option>
                </select>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: "#2563eb" }}>
                {fmtTime(playhead)}
              </span>
            </div>

            {/* Stage */}
            <div className="flex-1 flex items-center justify-center p-6 min-h-0" style={{ background: "#0a0a0a" }}>
              {tl.items.length === 0 ? (
                <div className="text-center">
                  <MonitorPlay style={{ width: 56, height: 56, color: "#1e1e1e", margin: "0 auto 16px" }} />
                  <p style={{ fontSize: 13, color: "#333" }}>Import media to start editing</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 text-xs transition-colors"
                    style={{ color: "#2563eb" }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#2563eb"}
                  >
                    Import Media →
                  </button>
                </div>
              ) : (
                <div
                  ref={stageRef}
                  className="relative overflow-hidden shadow-2xl"
                  style={{
                    background: "#000",
                    aspectRatio: tl.canvasRatio.replace(":", "/"),
                    maxWidth: "100%", maxHeight: "100%",
                    width: (() => { const [w, h] = tl.canvasRatio.replace(":", "/").split("/").map(Number); return w >= h ? "100%" : "auto" })(),
                    height: (() => { const [w, h] = tl.canvasRatio.replace(":", "/").split("/").map(Number); return w < h ? "100%" : "auto" })(),
                  }}
                  onClick={() => setSelectedId(null)}
                >
                  {/* Checkerboard (visible when nothing is there) */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: "repeating-conic-gradient(#555 0% 25%,transparent 0% 50%)", backgroundSize: "16px 16px" }} />

                  {/* Render items sorted by layer order */}
                  {[...tl.items]
                    .sort((a, b) => {
                      const oa = tl.layers.find(l => l.id === a.layerId)?.order ?? 99
                      const ob = tl.layers.find(l => l.id === b.layerId)?.order ?? 99
                      return oa - ob
                    })
                    .map(item => {
                      const layer = tl.layers.find(l => l.id === item.layerId)
                      if (!layer?.visible) return null

                      // Always keep audio in DOM so it can be controlled; hide others when out of range
                      const inRange = playhead >= item.start && playhead < item.start + item.duration
                      if (!inRange && item.type !== "audio") return null

                      const isSelected = selectedId === item.id

                      return (
                        <div
                          key={item.id}
                          style={{
                            position: "absolute",
                            left: `${item.x}%`, top: `${item.y}%`,
                            width: `${item.w}%`, height: `${item.h}%`,
                            transform: `rotate(${item.rotation}deg)`,
                            opacity: inRange ? item.opacity : 0,
                            cursor: isSelected && !layer.locked ? "move" : "pointer",
                            zIndex: item.type === "text" ? 50 : item.type === "image" ? 20 : 10,
                            pointerEvents: !inRange ? "none" : "auto",
                          }}
                          onMouseDown={e => {
                            e.stopPropagation()
                            setSelectedId(item.id)
                            setPanel("props")
                            if (!layer.locked) {
                              setDrag({ type: "stage_move", id: item.id, sx: e.clientX, sy: e.clientY, orig: { ...item } })
                            }
                          }}
                        >
                          {item.type === "video" && (
                            <video
                              ref={el => { if (el) mediaRefs.current[item.id] = el }}
                              src={item.url}
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          )}
                          {item.type === "image" && (
                            <img src={item.url} alt="" className="w-full h-full object-cover pointer-events-none" />
                          )}
                          {item.type === "audio" && (
                            // eslint-disable-next-line jsx-a11y/media-has-caption
                            <audio
                              ref={el => { if (el) mediaRefs.current[item.id] = el }}
                              src={item.url}
                              style={{ display: "none" }}
                            />
                          )}
                          {item.type === "text" && (
                            <div
                              className="w-full h-full flex items-center justify-center pointer-events-none"
                              style={{
                                color: item.color ?? "#fff",
                                fontSize: `${item.fontSize ?? 48}px`,
                                fontWeight: item.fontWeight ?? "bold",
                                backgroundColor: item.bgColor === "transparent" ? undefined : item.bgColor,
                                padding: item.bgColor !== "transparent" ? "4px 16px" : undefined,
                                borderRadius: item.bgColor !== "transparent" ? 6 : undefined,
                                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                                textAlign: "center",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                lineHeight: 1.2,
                              }}
                            >
                              {item.text}
                            </div>
                          )}

                          {/* Selection overlay */}
                          {isSelected && !layer.locked && (
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{ border: "2px solid #2563eb", zIndex: 60 }}
                            >
                              {/* Resize handle */}
                              <div
                                className="absolute pointer-events-auto"
                                style={{
                                  bottom: -5, right: -5, width: 12, height: 12,
                                  background: "#fff", border: "2px solid #2563eb",
                                  borderRadius: 3, cursor: "se-resize", zIndex: 61,
                                }}
                                onMouseDown={e => {
                                  e.stopPropagation()
                                  setDrag({ type: "stage_resize", id: item.id, sx: e.clientX, sy: e.clientY, orig: { ...item } })
                                }}
                              />
                              {/* Rotate handle */}
                              <div
                                className="absolute pointer-events-auto"
                                style={{
                                  top: -20, left: "50%", transform: "translateX(-50%)",
                                  width: 12, height: 12,
                                  background: "#fff", border: "2px solid #2563eb",
                                  borderRadius: "50%", cursor: "grab", zIndex: 61,
                                }}
                                onMouseDown={e => {
                                  e.stopPropagation()
                                  setDrag({ type: "stage_rotate", id: item.id, sx: e.clientX, sy: e.clientY, orig: { ...item } })
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {/* Transport Controls */}
            <div
              className="flex items-center justify-center gap-6 shrink-0"
              style={{ height: 52, background: "#1a1a1a", borderTop: "1px solid #222" }}
            >
              <button
                onClick={() => { setPlayhead(0); setIsPlaying(false) }}
                style={{ color: "#555" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#aaa"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#555"}
              >
                <SkipBack style={{ width: 16, height: 16 }} className="fill-current" />
              </button>

              <button
                onClick={() => setIsPlaying(p => !p)}
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: 38, height: 38,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#dbeafe"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#fff"}
              >
                {isPlaying
                  ? <Pause style={{ width: 15, height: 15, fill: "#111", color: "#111" }} />
                  : <Play style={{ width: 15, height: 15, fill: "#111", color: "#111", marginLeft: 2 }} />}
              </button>

              <button
                onClick={() => { setPlayhead(tl.duration); setIsPlaying(false) }}
                style={{ color: "#555" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#aaa"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#555"}
              >
                <SkipForward style={{ width: 16, height: 16 }} className="fill-current" />
              </button>
            </div>
          </div>

          {/* ── TIMELINE ────────────────────────────────────────────────── */}
          <div
            className="flex flex-col min-h-0"
            style={{ flex: "0 0 auto", height: 220, background: "#141414", borderTop: "1px solid #242424" }}
          >
            {/* Timeline toolbar */}
            <div
              className="flex items-center gap-4 px-4 shrink-0"
              style={{ height: 36, background: "#1a1a1a", borderBottom: "1px solid #222" }}
            >
              <div className="flex items-center gap-1">
                <button
                  title="Select"
                  className="p-1.5 rounded"
                  style={{ color: "#2563eb", background: "rgba(37,99,235,0.15)" }}
                >
                  <MousePointer2 style={{ width: 13, height: 13 }} />
                </button>
                <button
                  title="Split at playhead"
                  onClick={splitAtPlayhead}
                  className="p-1.5 rounded transition-colors"
                  style={{ color: "#555" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#aaa"
                    ;(e.currentTarget as HTMLButtonElement).style.background = "#222"
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#555"
                    ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
                  }}
                >
                  <Scissors style={{ width: 13, height: 13 }} />
                </button>
              </div>

              <div style={{ width: 1, height: 16, background: "#2a2a2a" }} />

              <div className="flex items-center gap-2" style={{ color: "#444" }}>
                <ZoomOut style={{ width: 13, height: 13 }} />
                <input type="range" min={0.25} max={8} step={0.05} value={zoom}
                  onChange={e => setZoom(+e.target.value)}
                  className="accent-blue-500"
                  style={{ width: 80, height: 3 }} />
                <ZoomIn style={{ width: 13, height: 13 }} />
                <span style={{ fontSize: 10, color: "#444", minWidth: 32 }}>{zoom.toFixed(1)}x</span>
              </div>

              <span className="ml-auto" style={{ fontSize: 10, color: "#333" }}>
                {fmtTime(tl.duration)} total
              </span>
            </div>

            {/* Track area */}
            <div className="flex-1 flex min-h-0 overflow-hidden">

              {/* Track headers */}
              <div
                className="flex flex-col shrink-0"
                style={{ width: 180, background: "#1a1a1a", borderRight: "1px solid #222", zIndex: 30 }}
              >
                {/* Ruler spacer */}
                <div
                  className="flex items-center px-3 shrink-0"
                  style={{ height: 24, background: "#1e1e1e", borderBottom: "1px solid #222" }}
                >
                  <span style={{ fontSize: 9, color: "#3a3a3a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Track
                  </span>
                </div>

                {/* Layer rows */}
                <div className="flex-1 overflow-y-hidden">
                  {sortedLayers.length === 0 ? (
                    <div className="flex items-center justify-center h-10" style={{ color: "#2a2a2a", fontSize: 11 }}>
                      No layers yet
                    </div>
                  ) : sortedLayers.map(layer => (
                    <div
                      key={layer.id}
                      className="flex items-center px-3 gap-2.5 group"
                      style={{
                        height: 52, borderBottom: "1px solid #1e1e1e",
                        background: "#1a1a1a",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#1e1e1e"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#1a1a1a"}
                    >
                      <span style={{ color: LAYER_COLORS[layer.type], flexShrink: 0 }}>
                        <LayerIcon type={layer.type} size={13} />
                      </span>
                      <span
                        className="flex-1 truncate font-semibold"
                        style={{ fontSize: 11, color: layer.visible ? "#aaa" : "#444" }}
                      >
                        {layer.label}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleLayer(layer.id, "visible")}
                          style={{ color: layer.visible ? "#555" : "#2563eb", padding: 2 }}
                          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#aaa"}
                          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = layer.visible ? "#555" : "#2563eb"}
                        >
                          {layer.visible
                            ? <Eye style={{ width: 11, height: 11 }} />
                            : <EyeOff style={{ width: 11, height: 11 }} />}
                        </button>
                        <button
                          onClick={() => toggleLayer(layer.id, "locked")}
                          style={{ color: layer.locked ? "#f59e0b" : "#555", padding: 2 }}
                          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#aaa"}
                          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = layer.locked ? "#f59e0b" : "#555"}
                        >
                          {layer.locked
                            ? <Lock style={{ width: 11, height: 11 }} />
                            : <Unlock style={{ width: 11, height: 11 }} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add audio row */}
                  <div
                    className="flex items-center px-3 gap-2 cursor-pointer transition-colors"
                    style={{ height: 28, color: "#2a2a2a" }}
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = "#444"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = "#2a2a2a"}
                  >
                    <Music style={{ width: 11, height: 11 }} />
                    <span style={{ fontSize: 10 }}>+ Add audio</span>
                  </div>
                </div>
              </div>

              {/* Scrollable timeline canvas */}
              <div className="flex-1 overflow-x-auto overflow-y-hidden relative"
                style={{ scrollbarColor: "#2a2a2a #111", scrollbarWidth: "thin" }}>

                <div style={{ width: Math.max(tl.duration * PPS + 200, 800), minHeight: "100%" }}>

                  {/* Time ruler */}
                  <div
                    className="sticky top-0 relative cursor-crosshair"
                    style={{
                      height: 24,
                      width: Math.max(tl.duration * PPS + 200, 800),
                      background: "#1e1e1e",
                      borderBottom: "1px solid #222",
                      zIndex: 20,
                    }}
                    onClick={e => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setPlayhead(Math.max(0, (e.clientX - rect.left) / PPS))
                    }}
                  >
                    {Array.from({ length: Math.ceil(tl.duration) + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 h-full"
                        style={{ left: i * PPS, borderLeft: "1px solid #2a2a2a" }}
                      >
                        <span style={{ fontSize: 9, color: "#3a3a3a", paddingLeft: 3, fontFamily: "monospace", lineHeight: "24px" }}>
                          {fmtTime(i)}
                        </span>
                      </div>
                    ))}
                    {/* Playhead on ruler */}
                    <div
                      className="absolute top-0 bottom-0 pointer-events-none"
                      style={{ left: playhead * PPS, zIndex: 30, width: 1, background: "#ef4444" }}
                    >
                      <div style={{
                        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%) rotate(45deg)",
                        width: 8, height: 8, background: "#ef4444", marginTop: -4,
                      }} />
                    </div>
                  </div>

                  {/* Track rows */}
                  {sortedLayers.map(layer => {
                    const items = tl.items.filter(i => i.layerId === layer.id)
                    const thumbForItem = (item: TrackItem) =>
                      mediaBin.find(b => b.url === item.url)?.thumb

                    return (
                      <div
                        key={layer.id}
                        className="relative"
                        style={{
                          height: 52,
                          borderBottom: "1px solid #1a1a1a",
                          background: "#141414",
                          width: Math.max(tl.duration * PPS + 200, 800),
                        }}
                      >
                        {/* Grid lines */}
                        {Array.from({ length: Math.ceil(tl.duration) + 1 }).map((_, i) => (
                          <div key={i} className="absolute top-0 bottom-0"
                            style={{ left: i * PPS, width: 1, background: "#1a1a1a" }} />
                        ))}

                        {items.map(item => {
                          const isSelected = selectedId === item.id
                          const leftPx = item.start * PPS
                          const widthPx = Math.max(6, item.duration * PPS)
                          const thumb = thumbForItem(item)

                          return (
                            <div
                              key={item.id}
                              className="absolute rounded-md overflow-hidden cursor-grab"
                              style={{
                                top: 4, bottom: 4,
                                left: leftPx,
                                width: widthPx,
                                background: LAYER_BG[item.type],
                                border: isSelected
                                  ? "1.5px solid #fff"
                                  : `1px solid ${LAYER_COLORS[item.type]}55`,
                                zIndex: isSelected ? 20 : 10,
                                outline: isSelected ? "1px solid #2563eb" : "none",
                                outlineOffset: 1,
                              }}
                              onMouseDown={e => {
                                e.stopPropagation()
                                setSelectedId(item.id)
                                setPanel("props")
                                if (!layer.locked) {
                                  setDrag({ type: "tl_move", id: item.id, sx: e.clientX, sy: e.clientY, orig: { ...item } })
                                }
                              }}
                            >
                              {/* Video: film-strip thumbnails */}
                              {item.type === "video" && thumb && widthPx > 20 && (
                                <div className="absolute inset-0 flex overflow-hidden opacity-35 pointer-events-none">
                                  {Array.from({ length: Math.ceil(widthPx / 42) + 1 }).map((_, fi) => (
                                    <div
                                      key={fi}
                                      className="flex-shrink-0 h-full bg-cover bg-center"
                                      style={{ width: 42, backgroundImage: `url(${thumb})` }}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Audio: waveform bars */}
                              {item.type === "audio" && widthPx > 20 && (
                                <div className="absolute inset-0 flex items-center px-1 overflow-hidden opacity-50 pointer-events-none gap-[1px]">
                                  {Array.from({ length: Math.floor(widthPx / 3) }).map((_, wi) => (
                                    <div
                                      key={wi}
                                      className="flex-shrink-0 rounded-full"
                                      style={{
                                        width: 2,
                                        height: `${18 + Math.sin(wi * 0.72) * 14 + Math.sin(wi * 0.31 + 1.4) * 10}%`,
                                        background: "#fff",
                                      }}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Clip label */}
                              {widthPx > 44 && (
                                <div className="absolute inset-0 flex items-center px-2 pointer-events-none">
                                  <span
                                    className="truncate font-semibold"
                                    style={{
                                      fontSize: 10,
                                      color: "rgba(255,255,255,0.9)",
                                      textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                    }}
                                  >
                                    {item.type === "text" ? (item.text ?? "Text") : layer.label}
                                  </span>
                                </div>
                              )}

                              {/* Left trim handle */}
                              <div
                                className="absolute left-0 top-0 bottom-0"
                                style={{ width: 8, cursor: "ew-resize", zIndex: 30, background: "transparent" }}
                                onMouseDown={e => {
                                  e.stopPropagation()
                                  if (!layer.locked) {
                                    setDrag({ type: "tl_trim_l", id: item.id, sx: e.clientX, sy: e.clientY, orig: { ...item } })
                                  }
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.2)"}
                                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                              />
                              {/* Right trim handle */}
                              <div
                                className="absolute right-0 top-0 bottom-0"
                                style={{ width: 8, cursor: "ew-resize", zIndex: 30, background: "transparent" }}
                                onMouseDown={e => {
                                  e.stopPropagation()
                                  if (!layer.locked) {
                                    setDrag({ type: "tl_trim_r", id: item.id, sx: e.clientX, sy: e.clientY, orig: { ...item } })
                                  }
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.2)"}
                                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}

                  {/* Playhead line over tracks */}
                  <div
                    className="absolute top-0 bottom-0 pointer-events-none"
                    style={{
                      left: playhead * PPS,
                      width: 1,
                      background: "rgba(239,68,68,0.7)",
                      zIndex: 40,
                      top: 0,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Small UI sub-components
// ─────────────────────────────────────────────────────────────────────────────
function PropSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5">
      <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
        {label}
      </p>
      {children}
    </section>
  )
}

function PropInput({ label, type, value, step, onChange }: {
  label: string; type: string; value: string; step?: number; onChange: (v: string) => void
}) {
  return (
    <div>
      <label style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        value={value}
        step={step}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg text-xs text-white outline-none"
        style={{ padding: "6px 10px", background: "#1e1e1e", border: "1px solid #2a2a2a" }}
        onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2563eb"}
        onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#2a2a2a"}
      />
    </div>
  )
}

function PropSlider({ label, value, min, max, step, display, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number
  display: string; onChange: (v: number) => void; color: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5" style={{ fontSize: 10, color: "#555" }}>
        <span>{label}</span>
        <span style={{ color: "#888" }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full"
        style={{ height: 3, accentColor: color }}
      />
    </div>
  )
}
