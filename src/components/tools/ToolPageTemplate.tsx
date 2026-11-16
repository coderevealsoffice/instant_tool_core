"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, ArrowUpRight, UploadCloud, FileText, Link2 } from "lucide-react"
import { SupportDonationCTA } from "./SupportDonationCTA"
import { AdSlot } from "@/components/common/AdSlot"
import { BUILTIN_BLOG_POSTS } from "@/lib/blogs-data"

export interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

export interface ZigZagFeature {
  title: string
  description: string
  imageText: string
  color: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Tutorial {
  title: string
  description: string
  link: string
  color: string
}

export interface ToolMockupData {
  feat1: {
    sourceIcon: string
    sourceName: string
    badgeText: string
    cols: Array<{
      tag: string
      label: string
      status: string
      statusColor?: string
    }>
    statusBarText: string
    statusExecution: string
    checkmarks: [string, string]
  }
  feat2: {
    protocolTitle: string
    badgeText: string
    rows: Array<{
      label: string
      value: string
      valueColor?: string
    }>
    footerText: string
    checkmarks: [string, string]
  }
  feat3: {
    title: string
    badgeText: string
    devices: string[]
    footerText: string
    checkmarks: [string, string]
  }
}

export function getToolMockupData(slug: string, title: string, category: string): ToolMockupData {
  const cat = (category || "").toLowerCase()
  const s = (slug || "").toLowerCase()
  const t = (title || "").toLowerCase()

  // ==========================================
  // 1. VIDEO TOOLS (video-tools) - NEVER SHOW PDF!
  // ==========================================
  if (cat === "video-tools" || (!cat.includes("pdf") && !cat.includes("audio") && t.includes("video"))) {
    // 1A. Video Downloaders
    if (s.includes("downloader") || t.includes("downloader")) {
      return {
        feat1: {
          sourceIcon: "🎬",
          sourceName: "Source: 4K_HDR_Video_Stream.mp4",
          badgeText: "MAX BITRATE • AVAILABLE",
          cols: [
            { tag: "4K ULTRA HD", label: "2160p @ 60fps", status: "✓ HDR MP4 Stream", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "FULL HD", label: "1080p @ 60fps", status: "✓ Universal Playback", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "AUDIO MASTER", label: "MP3 @ 320kbps", status: "✓ Lossless Stereo", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "High-speed video stream extracted & ready for download",
          statusExecution: "Latency: 14ms",
          checkmarks: [
            "Download crystal-clear 4K, 1080p, and 60fps videos without re-encoding quality loss",
            "Unlimited daily downloads with zero watermarks, ads, or account requirements"
          ]
        },
        feat2: {
          protocolTitle: "Direct Anonymous Stream Gateway",
          badgeText: "ACTIVE",
          rows: [
            { label: "User Identification", value: "100% Anonymous (No Logins)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Download Pipeline", value: "Official High-Speed CDN Tunnel", valueColor: "text-slate-900 dark:text-white" },
            { label: "Rate Limiting", value: "Uncapped Multi-Thread Buffer", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ 100% Anonymous & Secure Media Streaming",
          checkmarks: [
            "We never record your IP, download history, or personal browsing data",
            "Zero adware, bloatware, or tracking cookies: direct stream delivery only"
          ]
        },
        feat3: {
          title: `Universal ${title} on Any Device`,
          badgeText: "MULTI-PLATFORM",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 1B. Add Audio to Video
    if (s.includes("add-audio") || (t.includes("add") && t.includes("audio"))) {
      return {
        feat1: {
          sourceIcon: "🎬",
          sourceName: "Source: Project_Footage_1080p.mp4",
          badgeText: "AV-MUX • 42 MB",
          cols: [
            { tag: "VIDEO TRACK", label: "1080p 60fps Video", status: "✓ H.264 Stream Kept", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "AUDIO TRACK", label: "Soundtrack.mp3", status: "⚡ 320kbps Aligned", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "MUXED OUTPUT", label: "Rendered_Video.mp4", status: "✓ Perfect Sync", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Audio track muxed and synchronized losslessly",
          statusExecution: "Bitrate: 18 Mbps",
          checkmarks: [
            "Add, replace, or overlay audio tracks with zero video compression loss",
            "Synchronize audio and video streams with millisecond frame accuracy"
          ]
        },
        feat2: {
          protocolTitle: "Hardware-Accelerated AV Muxing Sandbox",
          badgeText: "ACTIVE",
          rows: [
            { label: "Video Re-encoding", value: "Zero Loss (Direct Stream Copy)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Processing Environment", value: "Client WebCodecs / Local GPU", valueColor: "text-slate-900 dark:text-white" },
            { label: "Cloud Server Storage", value: "0 MB (Local In-Memory Muxing)", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ 100% Private On-Device Video Processing",
          checkmarks: [
            "Video and audio streams are processed in local GPU memory with zero cloud uploads",
            "Immediate memory purge upon file export with 100% privacy guarantee"
          ]
        },
        feat3: {
          title: "Universal Video & Audio Muxer on Any Device",
          badgeText: "WEBCODECS",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 1C. Add Text or Image / Watermark to Video
    if (s.includes("add-text") || s.includes("add-image") || t.includes("watermark") || t.includes("logo")) {
      return {
        feat1: {
          sourceIcon: "🎬",
          sourceName: "Source: Master_Video_Edit.mp4",
          badgeText: "OVERLAY • 58 MB",
          cols: [
            { tag: "SOURCE VIDEO", label: "1080p 60fps", status: "✓ Frame Sync Active", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "OVERLAY LAYER", label: "Graphic / Typography", status: "⚡ Alpha Transparency", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "COMPOSITE", label: "Exported_Video.mp4", status: "✓ Anti-Aliased", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Video overlay composite rendered successfully",
          statusExecution: "Execution: 0.34s",
          checkmarks: [
            "Overlay logos, watermarks, and custom text with pixel-precise position and timing",
            "Hardware-accelerated compositing maintains pristine video color and frame rates"
          ]
        },
        feat2: {
          protocolTitle: "GPU-Accelerated Video Composition Pipeline",
          badgeText: "ACTIVE",
          rows: [
            { label: "Alpha Blending", value: "Hardware-Accelerated GPU Shaders", valueColor: "text-slate-900 dark:text-white" },
            { label: "Cloud Storage", value: "0 MB (Never Uploaded to Cloud)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Color Accuracy", value: "Rec.709 sRGB Preserved", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ Private On-Device Video Rendering",
          checkmarks: [
            "Your video assets never leave your computer: all blending runs in browser GPU",
            "Zero watermarks or compression artifacts added to your final video"
          ]
        },
        feat3: {
          title: `Universal ${title} on Any Device`,
          badgeText: "GPU SHADERS",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 1D. Merge Videos
    if (s.includes("merge") || t.includes("merge")) {
      return {
        feat1: {
          sourceIcon: "🎬",
          sourceName: "Source: 3 Video Clips Selected",
          badgeText: "COMBINED • 142 MB",
          cols: [
            { tag: "CLIP 1", label: "Intro_Scene.mp4", status: "✓ 00:15 (1080p)", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "CLIP 2", label: "Main_Content.mp4", status: "✓ 02:40 (1080p)", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "CLIP 3", label: "Outro.mp4", status: "✓ 00:20 (1080p)", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "3 Video clips concatenated into single stream",
          statusExecution: "Execution: 0.52s",
          checkmarks: [
            "Join multiple video clips into one continuous video without re-encoding quality loss",
            "Rearrange video order with simple drag-and-drop and instant playback preview"
          ]
        },
        feat2: {
          protocolTitle: "Seamless Video Concatenation Engine",
          badgeText: "ACTIVE",
          rows: [
            { label: "Codec Normalization", value: "Auto-Aligned Framerate & Aspect", valueColor: "text-slate-900 dark:text-white" },
            { label: "Storage Footprint", value: "0 MB (Rendered Locally in Browser)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Audio-Video Drift", value: "0ms Lip-Sync Maintained", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ Lossless Concatenation & Data Privacy",
          checkmarks: [
            "All clips are processed in local browser memory and merged seamlessly",
            "Zero cloud uploads: your personal and business videos remain completely private"
          ]
        },
        feat3: {
          title: "Universal Video Merger on Any Device",
          badgeText: "MULTI-FORMAT",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 1E. Extract Audio from Video
    if (s.includes("extract-audio") || (t.includes("extract") && t.includes("audio"))) {
      return {
        feat1: {
          sourceIcon: "🎵",
          sourceName: "Source: Video_Interview.mp4",
          badgeText: "AUDIO DEMUX • 65 MB",
          cols: [
            { tag: "INPUT VIDEO", label: "1080p Video File", status: "✓ AAC / MP3 Stream", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "DEMUX ENGINE", label: "Direct Stream Extract", status: "⚡ No Re-encoding", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "OUTPUT AUDIO", label: "Extracted_Sound.mp3", status: "✓ 320kbps Lossless", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "High-fidelity audio stream extracted from video",
          statusExecution: "Execution: 0.12s",
          checkmarks: [
            "Extract crystal-clear MP3, WAV, or AAC audio tracks from any video format",
            "Lossless extraction preserves full dynamic range without re-compression"
          ]
        },
        feat2: {
          protocolTitle: "Direct Stream Demuxing Engine",
          badgeText: "ACTIVE",
          rows: [
            { label: "Re-encoding Loss", value: "Zero Loss (Direct Stream Copy)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Cloud Retention", value: "0 MB (Extracted in Client RAM)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Audio Channels", value: "Stereo 48kHz Preserved", valueColor: "text-slate-900 dark:text-white" }
          ],
          footerText: "🛡️ 100% Private Media Demuxing",
          checkmarks: [
            "Extract audio tracks in milliseconds directly on your device",
            "Zero logs, zero cloud storage: extracted audio is downloaded directly"
          ]
        },
        feat3: {
          title: "Universal Audio Extractor on Any Device",
          badgeText: "WASM DEMUXER",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 1F. All Other Video Tools (trim, crop, rotate, flip, change-speed, editor, loop, volume, stabilize, etc.)
    return {
      feat1: {
        sourceIcon: "🎥",
        sourceName: "Source: Raw_Footage_4K.mp4",
        badgeText: "60 FPS • 420 MB",
        cols: [
          { tag: "TIMELINE", label: "Keyframe Selection", status: "✓ Frame Accurate", statusColor: "text-emerald-600 dark:text-emerald-400" },
          { tag: "CODEC", label: "Hardware WebCodecs", status: "⚡ GPU Accelerated", statusColor: "text-sky-600 dark:text-sky-400" },
          { tag: "EXPORT", label: "Processed_Video.mp4", status: "✓ Pristine Color", statusColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        statusBarText: "Hardware-accelerated video rendering complete",
        statusExecution: "Bitrate: 24 Mbps",
        checkmarks: [
          "Frame-accurate editing with zero re-encoding generational loss",
          "Hardware-accelerated rendering in your browser using modern WebCodecs APIs"
        ]
      },
      feat2: {
        protocolTitle: "Hardware-Accelerated Video Pipeline",
        badgeText: "ACTIVE",
        rows: [
          { label: "Processing Engine", value: "Browser WebCodecs / Local GPU", valueColor: "text-slate-900 dark:text-white" },
          { label: "Cloud Upload Footprint", value: "0 MB (Processed Locally)", valueColor: "text-emerald-600 dark:text-emerald-400" },
          { label: "Color Fidelity", value: "Rec.709 / sRGB Unaltered", valueColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        footerText: "🛡️ 100% On-Device Browser Video Processing",
        checkmarks: [
          "Video data stays inside your device's GPU memory — never uploaded to external servers",
          "No file size limits or bandwidth throttling on local browser processing"
        ]
      },
      feat3: {
        title: `Universal ${title} on Any Device`,
        badgeText: "WEBCODECS",
        devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
        footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
        checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
      }
    }
  }

  // ==========================================
  // 2. AUDIO TOOLS (audio-tools) - NEVER SHOW PDF!
  // ==========================================
  if (cat === "audio-tools" || (!cat.includes("pdf") && !cat.includes("video") && t.includes("audio"))) {
    // 2A. Audio Enhancer
    if (s.includes("enhanc") || t.includes("enhanc")) {
      return {
        feat1: {
          sourceIcon: "🎙️",
          sourceName: "Source: Vocal_Recording_Draft.wav",
          badgeText: "AI NOISE REMOVAL • 38 MB",
          cols: [
            { tag: "SPECTRAL CLEAN", label: "De-Noise & De-Reverb", status: "✓ -28dB Room Echo", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "CLARITY DSP", label: "Vocal Presence EQ", status: "⚡ Crisp Harmonic Boost", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "MASTER EXPORT", label: "Enhanced_Master.mp3", status: "✓ Studio Quality", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Background hiss and room reverb eliminated losslessly",
          statusExecution: "THD: 0.0001%",
          checkmarks: [
            "Remove background noise, hums, and room reverberation with neural speech clarity",
            "Studio-grade output optimized for podcasts, voiceovers, and musical vocals"
          ]
        },
        feat2: {
          protocolTitle: "Studio DSP Speech Isolation Sandbox",
          badgeText: "ACTIVE",
          rows: [
            { label: "Processing Engine", value: "Client Web Audio API / Local DSP", valueColor: "text-slate-900 dark:text-white" },
            { label: "Cloud Upload", value: "0 MB (Runs Locally in Browser)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Dynamic Range", value: "Full 24-bit Depth Preserved", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ Studio Master Quality & Complete Audio Privacy",
          checkmarks: [
            "Your audio never leaves your machine: all DSP occurs in local client memory",
            "Lightning-fast real-time waveform visualization and zero upload delays"
          ]
        },
        feat3: {
          title: "Universal Audio Enhancer on Any Device",
          badgeText: "WEB AUDIO DSP",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 2B. Trim Audio
    if (s.includes("trim") || t.includes("trim")) {
      return {
        feat1: {
          sourceIcon: "✂️",
          sourceName: "Source: Song_Track_Master.mp3",
          badgeText: "320KBPS • 9.4 MB",
          cols: [
            { tag: "START POINT", label: "00:14.20", status: "✓ Snap to Zero-Crossing", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "END POINT", label: "02:45.00", status: "✓ Clean Fade-Out Added", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "OUTPUT FILE", label: "Trimmed_Audio.mp3", status: "✓ Lossless Cut", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Sample-accurate audio cut complete",
          statusExecution: "Latency: 4ms",
          checkmarks: [
            "Cut, trim, and split audio tracks with sample-accurate waveform precision",
            "Apply smooth fade-in and fade-out envelopes to prevent clipping clicks"
          ]
        },
        feat2: {
          protocolTitle: "Sample-Accurate Web Audio Sandbox",
          badgeText: "ACTIVE",
          rows: [
            { label: "Cut Precision", value: "Zero-Crossing Sample Level", valueColor: "text-slate-900 dark:text-white" },
            { label: "Cloud Storage", value: "0 MB (Memory Buffer Only)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Bitrate Retention", value: "Original 320kbps Lossless", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ 100% Private In-Browser Audio Editing",
          checkmarks: [
            "Audio cuts happen directly on your machine in real time with zero latency",
            "Zero cloud uploads: your original audio file stays 100% private"
          ]
        },
        feat3: {
          title: "Universal Audio Trimmer on Any Device",
          badgeText: "WEB AUDIO API",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 2C. All Other Audio Tools (volume, speed, pitch, equalizer, joiner, reverse, etc.)
    return {
      feat1: {
        sourceIcon: "🎵",
        sourceName: "Source: Master_Recording.wav",
        badgeText: "24-BIT 96KHZ • 48 MB",
        cols: [
          { tag: "CHANNELS", label: "Stereo L/R", status: "✓ Phase Aligned", statusColor: "text-emerald-600 dark:text-emerald-400" },
          { tag: "DSP BUFFER", label: "32-Bit Float Engine", status: "⚡ Sub-ms Latency", statusColor: "text-sky-600 dark:text-sky-400" },
          { tag: "EXPORT", label: "Master_Output.mp3", status: "✓ 320kbps Hi-Fi", statusColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        statusBarText: "Digital signal processing complete",
        statusExecution: "THD: 0.0001%",
        checkmarks: [
          "Studio-grade 32-bit floating-point audio processing with zero dithering noise",
          "Preserves wide dynamic range, stereo staging, and pristine frequency response"
        ]
      },
      feat2: {
        protocolTitle: "Web Audio API DSP Sandbox",
        badgeText: "ACTIVE",
        rows: [
          { label: "Processing Node", value: "Client Web Audio Context", valueColor: "text-slate-900 dark:text-white" },
          { label: "Upload Bandwidth", value: "0 MB (Runs Locally in Browser)", valueColor: "text-emerald-600 dark:text-emerald-400" },
          { label: "Dynamic Range", value: "Full 24-bit Depth Preserved", valueColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        footerText: "🛡️ Studio Master Quality & Complete Privacy",
        checkmarks: [
          "Your audio never leaves your machine: all DSP occurs in local client memory",
          "Lightning-fast real-time waveform visualization and zero upload delays"
        ]
      },
      feat3: {
        title: `Universal ${title} on Any Device`,
        badgeText: "WEB AUDIO API",
        devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
        footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
        checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
      }
    }
  }

  // ==========================================
  // 3. IMAGE TOOLS (image-tools) - NEVER SHOW PDF!
  // ==========================================
  if (cat === "image-tools" || (!cat.includes("pdf") && (t.includes("image") || t.includes("heic") || t.includes("photo")))) {
    return {
      feat1: {
        sourceIcon: "🖼️",
        sourceName: "Source: IMG_9042_AppleProRAW.heic",
        badgeText: "APPLE HEIF • 14.2 MB",
        cols: [
          { tag: "SOURCE", label: "High-Efficiency HEIC", status: "Display P3 Gamut", statusColor: "text-amber-600 dark:text-amber-400" },
          { tag: "WASM ENGINE", label: "Color Space Remap", status: "⚡ Lossless sRGB Map", statusColor: "text-sky-600 dark:text-sky-400" },
          { tag: "OUTPUT", label: "IMG_9042.jpg", status: "✓ 1.8 MB (Universal)", statusColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        statusBarText: "Lossless image conversion complete",
        statusExecution: "Execution: 0.11s",
        checkmarks: [
          "Convert iPhone HEIC and next-gen image formats to universal high-res JPG/PNG",
          "Preserves full color profile fidelity and high-contrast dynamic details"
        ]
      },
      feat2: {
        protocolTitle: "Client-Side Canvas Sandbox",
        badgeText: "ACTIVE",
        rows: [
          { label: "Processing Engine", value: "HTML5 Canvas / WebAssembly", valueColor: "text-slate-900 dark:text-white" },
          { label: "Photo Privacy", value: "0 MB Uploaded to Cloud", valueColor: "text-emerald-600 dark:text-emerald-400" },
          { label: "EXIF Scrubbing", value: "GPS & Metadata Cleaned", valueColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        footerText: "🛡️ Private On-Device Photo Processing",
        checkmarks: [
          "Photos are converted locally on your hardware with 0 bytes sent to external servers",
          "Optional GPS location and camera EXIF metadata scrubbing for private sharing"
        ]
      },
      feat3: {
        title: `Universal ${title} on Any Device`,
        badgeText: "CANVAS WASM",
        devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
        footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
        checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
      }
    }
  }

  // ==========================================
  // 4. SEO & AI TOOLS (seo-tools, ai-tools)
  // ==========================================
  if (cat === "seo-tools" || cat === "ai-tools" || t.includes("seo") || t.includes("aeo") || t.includes("geo") || t.includes("plagiarism")) {
    return {
      feat1: {
        sourceIcon: "🔍",
        sourceName: "Source: Article_Draft_GEO.docx",
        badgeText: "2,140 WORDS • 99% SCORE",
        cols: [
          { tag: "ORIGINALITY", label: "Humanized Perplexity", status: "✓ 99.4% Authentic", statusColor: "text-emerald-600 dark:text-emerald-400" },
          { tag: "GEO CITATIONS", label: "Perplexity & SearchGPT", status: "⚡ Direct Answer Ready", statusColor: "text-sky-600 dark:text-sky-400" },
          { tag: "DUPLICATION", label: "Global Web Index", status: "✓ 0.0% Match Detected", statusColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        statusBarText: "Content audit complete • Search & AI Ready",
        statusExecution: "Score: 99/100",
        checkmarks: [
          "Audit sentence-level uniqueness, burstiness, and natural human conversational style",
          "Optimized for AI generative citation engines like ChatGPT Search and Perplexity"
        ]
      },
      feat2: {
        protocolTitle: "Zero-Retention Content Privacy Sandbox",
        badgeText: "ACTIVE",
        rows: [
          { label: "AI Training Protection", value: "Zero Training / No Data Mining", valueColor: "text-emerald-600 dark:text-emerald-400" },
          { label: "Search Index Exclusion", value: "No-Index Sandbox Protocol", valueColor: "text-slate-900 dark:text-white" },
          { label: "Intellectual Property", value: "100% Owned by Creator", valueColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        footerText: "🛡️ 100% Confidential Intellectual Property Retained",
        checkmarks: [
          "Your proprietary draft text is never logged, indexed, or used to train AI models",
          "Immediate memory wipe once audit report and recommendations are generated"
        ]
      },
      feat3: {
        title: `Universal ${title} on Any Device`,
        badgeText: "ZERO-DATA-MINING",
        devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
        footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
        checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
      }
    }
  }

  // ==========================================
  // 5. PDF TOOLS (pdf-tools) - ONLY when category is pdf-tools or title explicitly mentions PDF
  // ==========================================
  if (cat === "pdf-tools" || t.includes("pdf")) {
    // 5A. Unlock PDF
    if (s.includes("unlock") || t.includes("unlock")) {
      return {
        feat1: {
          sourceIcon: "🔒",
          sourceName: "Source: Protected_Document.pdf",
          badgeText: "PASSWORD PROTECTED • 3.2 MB",
          cols: [
            { tag: "SECURITY", label: "AES-256 Lock", status: "🔒 Key Required", statusColor: "text-amber-600 dark:text-amber-400" },
            { tag: "DECRYPTION", label: "In-RAM Engine", status: "⚡ Verified 0.08s", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "OUTPUT", label: "Unlocked_Document.pdf", status: "✓ Full Access Granted", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Password restrictions removed (Print, Edit & Copy Enabled)",
          statusExecution: "Execution: 0.18s",
          checkmarks: [
            "Instant removal of owner and user passwords with 100% layout fidelity",
            "Client-side in-RAM decryption: your passwords are never saved or stored"
          ]
        },
        feat2: {
          protocolTitle: "Zero-Knowledge Decryption Protocol",
          badgeText: "ACTIVE",
          rows: [
            { label: "Password Storage", value: "0 ms (Never Cached or Logged)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Decryption Cipher", value: "Client-Side AES-256 / RC4", valueColor: "text-slate-900 dark:text-white" },
            { label: "Cloud Server Retention", value: "0 MB (Processed in Client RAM)", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ Verified Zero-Knowledge Client-Side Decryption",
          checkmarks: [
            "Passwords are decrypted locally in your browser and never sent to servers",
            "Instant cryptographic purge immediately upon session completion"
          ]
        },
        feat3: {
          title: "Universal Unlock PDF on Any Device",
          badgeText: "WEBASSEMBLY",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 5B. Protect PDF
    if (s.includes("protect") || t.includes("protect")) {
      return {
        feat1: {
          sourceIcon: "📄",
          sourceName: "Source: Confidential_Agreement.pdf",
          badgeText: "UNRESTRICTED • 2.6 MB",
          cols: [
            { tag: "INPUT", label: "Plain Document", status: "🔓 Unprotected", statusColor: "text-amber-600 dark:text-amber-400" },
            { tag: "CIPHER", label: "AES-256 Encryption", status: "🛡️ Salted SHA-256", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "TARGET", label: "Protected_Agreement.pdf", status: "✓ Password Locked", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Military-grade AES-256 encryption applied",
          statusExecution: "Execution: 0.22s",
          checkmarks: [
            "Bank-grade AES-256 encryption restricts unauthorized reading, printing, and copying",
            "Compatible with all standard PDF readers (Adobe Acrobat, Apple Preview, Chrome)"
          ]
        },
        feat2: {
          protocolTitle: "Cryptographic Armor Protocol",
          badgeText: "ACTIVE",
          rows: [
            { label: "Encryption Standard", value: "AES-256-CBC / SHA-256", valueColor: "text-slate-900 dark:text-white" },
            { label: "Access Permissions", value: "Print, Copy & Edit Locked", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Key Custody", value: "Zero-Knowledge (User Only)", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ Bank-Grade AES-256 Document Confidentiality",
          checkmarks: [
            "Strict zero-knowledge architecture: only you possess the unlocking credentials",
            "End-to-end client cryptographic generation with zero external exposure"
          ]
        },
        feat3: {
          title: "Universal Protect PDF on Any Device",
          badgeText: "WEBASSEMBLY",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 5C. Merge PDF
    if (s.includes("merge") || t.includes("merge")) {
      return {
        feat1: {
          sourceIcon: "📑",
          sourceName: "Source: 3 Documents Selected",
          badgeText: "9 TOTAL PAGES • 5.8 MB",
          cols: [
            { tag: "DOC 1", label: "Sales_Q1.pdf", status: "✓ 4 Pages", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "DOC 2", label: "Sales_Q2.pdf", status: "✓ 3 Pages", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "DOC 3", label: "Summary.pdf", status: "✓ 2 Pages", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "3 Documents fused into Unified_Report.pdf",
          statusExecution: "Execution: 0.42s",
          checkmarks: [
            "Combine multiple PDF files into one continuous, structured document",
            "Drag to reorder pages and preserve bookmarks, outlines, and hyperlinks"
          ]
        },
        feat2: {
          protocolTitle: "Document Fusion Security Protocol",
          badgeText: "ACTIVE",
          rows: [
            { label: "Sequence Integrity", value: "Exact Page Order Verified", valueColor: "text-slate-900 dark:text-white" },
            { label: "In-Transit Encryption", value: "TLS 1.3 / AES-256", valueColor: "text-slate-900 dark:text-white" },
            { label: "Server Retention", value: "0 MB (Purged Upon Download)", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ Zero-Retention Document Fusion Guarantee",
          checkmarks: [
            "All source documents and merged outputs are permanently wiped after download",
            "Zero metadata or proprietary content leakage across combined files"
          ]
        },
        feat3: {
          title: "Universal Merge PDF on Any Device",
          badgeText: "WEBASSEMBLY",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 5D. Compress PDF
    if (s.includes("compress") || t.includes("compress")) {
      return {
        feat1: {
          sourceIcon: "🗜️",
          sourceName: "Source: Presentation_Deck.pdf",
          badgeText: "ORIGINAL: 28.4 MB",
          cols: [
            { tag: "BEFORE", label: "Original PDF", status: "28.4 MB (Heavy)", statusColor: "text-amber-600 dark:text-amber-400" },
            { tag: "OPTIMIZATION", label: "Vector & Stream Cleaned", status: "⚡ Lossless DPI Preserved", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "AFTER", label: "Compressed_File.pdf", status: "✓ 2.3 MB (-92%)", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Size reduced by 92% • Saved 26.1 MB",
          statusExecution: "Execution: 0.28s",
          checkmarks: [
            "Shrink PDF file size up to 90% without compromising visual clarity or typography",
            "Optimized for email attachments, web uploads, and lightning-fast sharing"
          ]
        },
        feat2: {
          protocolTitle: "Lossless Compression Sandbox",
          badgeText: "ACTIVE",
          rows: [
            { label: "Visual Integrity", value: "300 DPI Sharpness Retained", valueColor: "text-slate-900 dark:text-white" },
            { label: "Metadata Stripping", value: "EXIF & Tracking Tags Removed", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Cloud Purge Timer", value: "Auto-Purged on Download", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ Lossless Security & Data Protection Guarantee",
          checkmarks: [
            "Files are processed in an isolated in-memory container and wiped immediately",
            "Preserves font embeddings and high-resolution assets losslessly"
          ]
        },
        feat3: {
          title: "Universal Compress PDF on Any Device",
          badgeText: "WEBASSEMBLY",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 5E. Split PDF
    if (s.includes("split") || t.includes("split")) {
      return {
        feat1: {
          sourceIcon: "📄",
          sourceName: "Source: Annual_Financial_Report.pdf",
          badgeText: "12 PAGES • 4.8 MB",
          cols: [
            { tag: "PART 1", label: "Pages 1–4", status: "✓ 1.2 MB", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "PART 2", label: "Pages 5–8", status: "✓ 1.4 MB", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "PART 3", label: "Pages 9–12", status: "✓ 1.6 MB", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Document separation complete",
          statusExecution: "Execution: 0.38s",
          checkmarks: [
            "Extract individual pages or custom ranges with lossless visual fidelity",
            "Preserves fonts, vector drawings, annotations, and form fields intact"
          ]
        },
        feat2: {
          protocolTitle: "Document Segmentation Sandbox",
          badgeText: "ACTIVE",
          rows: [
            { label: "In-Transit Encryption", value: "TLS 1.3 / AES-256", valueColor: "text-slate-900 dark:text-white" },
            { label: "Permanent Disk Storage", value: "0 MB (In-RAM Only)", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Automatic Purge Timer", value: "2h 00m Auto-Delete", valueColor: "text-slate-900 dark:text-white" }
          ],
          footerText: "🛡️ Verified GDPR & ISO 27001 Data Confidentiality",
          checkmarks: [
            "Zero cloud retention: files auto-purged from server memory after processing",
            "Bank-grade 256-bit TLS client-side encryption standard on all document operations"
          ]
        },
        feat3: {
          title: "Universal Split PDF on Any Device",
          badgeText: "WEBASSEMBLY",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 5F. Sign PDF
    if (s.includes("sign") || t.includes("sign")) {
      return {
        feat1: {
          sourceIcon: "✍️",
          sourceName: "Source: Executive_NDA_Agreement.pdf",
          badgeText: "4 PAGES • 1.9 MB",
          cols: [
            { tag: "SIGNATURE", label: "Vector Signature", status: "✓ Anti-Aliased", statusColor: "text-emerald-600 dark:text-emerald-400" },
            { tag: "STAMP", label: "Position Placed", status: "✓ Verified Coordinates", statusColor: "text-sky-600 dark:text-sky-400" },
            { tag: "OUTPUT", label: "Signed_NDA.pdf", status: "✓ Legally Binding", statusColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          statusBarText: "Digital signature embedded into PDF streams",
          statusExecution: "Execution: 0.15s",
          checkmarks: [
            "Place smooth digital signatures, dates, and custom text stamps with pixel precision",
            "Export legally binding documents compliant with eIDAS and ESIGN standards"
          ]
        },
        feat2: {
          protocolTitle: "Digital Signature Security Engine",
          badgeText: "ACTIVE",
          rows: [
            { label: "Audit Checksum", value: "SHA-256 Hash Verified", valueColor: "text-slate-900 dark:text-white" },
            { label: "Signature Privacy", value: "Rendered Locally in Browser", valueColor: "text-emerald-600 dark:text-emerald-400" },
            { label: "Tamper Protection", value: "Standard ISO Flattening", valueColor: "text-emerald-600 dark:text-emerald-400" }
          ],
          footerText: "🛡️ eIDAS & ESIGN Compliant Browser Security",
          checkmarks: [
            "Signatures are created and rendered entirely on your device for absolute privacy",
            "Zero document storage: signed PDFs are encrypted in RAM and wiped on export"
          ]
        },
        feat3: {
          title: "Universal Sign PDF on Any Device",
          badgeText: "WEBASSEMBLY",
          devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
          footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
          checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
        }
      }
    }

    // 5G. PDF Converters (pdf-to-word, pdf-to-excel, word-to-pdf, etc.)
    return {
      feat1: {
        sourceIcon: "🔄",
        sourceName: "Source: Document_Report.pdf",
        badgeText: "OCR & VECTOR • 3.8 MB",
        cols: [
          { tag: "INPUT", label: "PDF Streams", status: "Vector & Text Maps", statusColor: "text-amber-600 dark:text-amber-400" },
          { tag: "PARSING", label: "Layout Reconstruction", status: "⚡ Tables & Columns Kept", statusColor: "text-sky-600 dark:text-sky-400" },
          { tag: "OUTPUT", label: "Target Document", status: "✓ 100% Editable", statusColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        statusBarText: "Document conversion complete with zero layout drift",
        statusExecution: "Execution: 0.45s",
        checkmarks: [
          "Preserves precise fonts, margins, tables, and images with zero drift",
          "High-speed client and cloud rendering for instant editable downloads"
        ]
      },
      feat2: {
        protocolTitle: "Format Conversion Sandbox",
        badgeText: "ACTIVE",
        rows: [
          { label: "Font & Style Mapping", value: "TrueType / OpenType Retained", valueColor: "text-slate-900 dark:text-white" },
          { label: "In-Transit Encryption", value: "TLS 1.3 / AES-256", valueColor: "text-slate-900 dark:text-white" },
          { label: "Server Retention", value: "0 MB (Purged Upon Download)", valueColor: "text-emerald-600 dark:text-emerald-400" }
        ],
        footerText: "🛡️ Confidential Enterprise Document Conversion",
        checkmarks: [
          "Proprietary fonts and embedded assets remain completely private and unaltered",
          "Automatic server memory flush immediately after file conversion completes"
        ]
      },
      feat3: {
        title: `Universal ${title} on Any Device`,
        badgeText: "WEBASSEMBLY",
        devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
        footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
        checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
      }
    }
  }

  // ==========================================
  // 6. DEFAULT FALLBACK (for Dev, Text, Color Tools, etc.)
  // ==========================================
  return {
    feat1: {
      sourceIcon: "⚡",
      sourceName: `Source: ${title.replace(/\s+/g, '_')}_Input`,
      badgeText: "OPTIMIZED • READY",
      cols: [
        { tag: "INPUT", label: "Source Asset", status: "✓ Validated", statusColor: "text-emerald-600 dark:text-emerald-400" },
        { tag: "ENGINE", label: `${title} Engine`, status: "⚡ High-Speed Processing", statusColor: "text-sky-600 dark:text-sky-400" },
        { tag: "OUTPUT", label: "Optimized File", status: "✓ Ready to Download", statusColor: "text-emerald-600 dark:text-emerald-400" }
      ],
      statusBarText: `${title} processing complete`,
      statusExecution: "Execution: 0.16s",
      checkmarks: [
        "Lossless quality retention with zero compression artifacts",
        "Unlimited daily tasks with zero watermarks or registration"
      ]
    },
    feat2: {
      protocolTitle: "Sandbox Security Protocol",
      badgeText: "ACTIVE",
      rows: [
        { label: "In-Transit Encryption", value: "TLS 1.3 / AES-256", valueColor: "text-slate-900 dark:text-white" },
        { label: "Permanent Disk Storage", value: "0 MB (In-RAM Only)", valueColor: "text-emerald-600 dark:text-emerald-400" },
        { label: "Automatic Purge Timer", value: "2h 00m Auto-Delete", valueColor: "text-slate-900 dark:text-white" }
      ],
      footerText: "🛡️ Verified GDPR & ISO 27001 Data Confidentiality",
      checkmarks: [
        "Zero cloud retention: files auto-purged from server memory",
        "Bank-grade 256-bit TLS client-side encryption standard"
      ]
    },
    feat3: {
      title: `Universal ${title} on Any Device`,
      badgeText: "WEBASSEMBLY",
      devices: ["macOS Safari & Chrome", "Windows 11 & Edge", "iOS & iPadOS Safari", "Android Mobile Chrome"],
      footerText: "Zero RAM hogging • No installer • High-efficiency client execution",
      checkmarks: ["Works on Chrome, Safari, Edge, Firefox, iOS & Android", "No desktop software or browser extension installation needed"]
    }
  }
}

interface ToolPageTemplateProps {
  title: string
  description?: string
  headerColorClass: string
  toolComponent: React.ReactNode
  category?: string
  slug?: string
  
  topCheckmarks?: string[]
  
  zigZagFeatures?: ZigZagFeature[]
  
  howToTitle?: string
  howToSteps?: string[]
  
  gridTitle?: string
  gridFeatures?: Feature[]
  
  faqTitle?: string
  faqs?: FAQ[]
  
  tutorialsTitle?: string
  tutorials?: Tutorial[]
}

export function ToolPageTemplate({
  title,
  description,
  headerColorClass,
  toolComponent,
  category = "pdf-tools",
  slug = "split-pdf",
  topCheckmarks = ["Fast and easy to use", "Secure connection", "Free to use for basic tasks"],
  zigZagFeatures = [],
  howToTitle = `How to use ${title}`,
  howToSteps = [],
  gridTitle = `Everything you need in a ${title} tool`,
  gridFeatures = [],
  faqTitle = `${title} FAQs`,
  faqs = [],
  tutorialsTitle = `Tutorials on ${title}`,
  tutorials = []
}: ToolPageTemplateProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [heroUrl, setHeroUrl] = useState("")
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { addFiles, setContext } = useWorkspaceStore()

  const handleFiles = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setContext(category, slug)
      addFiles(newFiles)
      router.push(`/workspace?tool=${slug}&category=${category}`)
    }
  }

  const handleChooseFilesClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  // Safe sanitized props to avoid null pointer exceptions during SSR or client hydration
  const safeCategory = (category || "").toLowerCase()
  const safeTitle = title || "Tool"
  const safeSlug = (slug || "").toLowerCase()

  // Clean title to avoid long messy compound titles like "Plagiarism Checker - 100% Free..."
  const cleanTitle = (safeTitle || "").split(" - ")[0].split(" | ")[0].trim()

  // Dynamic category and format helpers tailored to each page
  const categoryLabel = (category || "TOOLS").replace(/-/g, ' ').toUpperCase()
  const isPdf = safeCategory === "pdf-tools" || cleanTitle.toLowerCase().includes("pdf")
  const isVideo = safeCategory === "video-tools" || cleanTitle.toLowerCase().includes("video")
  const isAudio = safeCategory === "audio-tools" || cleanTitle.toLowerCase().includes("audio")
  const isImage = safeCategory === "image-tools" || cleanTitle.toLowerCase().includes("image")
  const isSeo = safeCategory === "seo-tools" || safeCategory === "ai-tools" || cleanTitle.toLowerCase().includes("seo") || cleanTitle.toLowerCase().includes("aeo") || cleanTitle.toLowerCase().includes("geo")
  const isDownloader = safeSlug.includes("downloader") || cleanTitle.toLowerCase().includes("downloader")

  const mockupData = getToolMockupData(safeSlug, cleanTitle, safeCategory)

  // Select top 3 relevant articles for internal linking and depth
  const relevantBlogs = (BUILTIN_BLOG_POSTS || []).filter(b => {
    if (safeCategory.includes("pdf") && b.categoryName === "PDF Tools") return true
    if (safeCategory.includes("video") && b.categoryName === "Video Tools") return true
    if (safeCategory.includes("audio") && (b.categoryName === "Video Tools" || b.categoryName === "Technology")) return true
    if (safeCategory.includes("image") && b.categoryName === "Image Tools") return true
    if (safeCategory.includes("seo") && (b.categoryName === "Creators" || b.categoryName === "Technology")) return true
    if (safeCategory.includes("ai") && (b.categoryName === "Creators" || b.categoryName === "Technology")) return true
    return false
  }).slice(0, 3)

  const displayBlogs = relevantBlogs.length >= 3 ? relevantBlogs : (BUILTIN_BLOG_POSTS || []).slice(0, 3)

  const displayHeadline = isPdf
    ? `${cleanTitle} Online`
    : isDownloader
    ? `${cleanTitle} Online Free`
    : cleanTitle.toLowerCase().includes("online") || cleanTitle.toLowerCase().includes("free")
    ? cleanTitle
    : `${cleanTitle} Online Free`

  const displaySubtitle = description || (
    isDownloader
      ? `Paste any video or audio link to download instantly in full HD or MP3 with high-speed direct extraction.`
      : isPdf 
      ? `Extract pages, convert formats, or separate your PDF with high precision. 100% free, private in your browser with zero data retention.`
      : `Fast, secure, and private browser-based tool. 100% free with zero watermarks or data retention.`
  )

  const previewTiles = (() => {
    const s = safeSlug
    const t = safeTitle.toLowerCase()
    if (isDownloader || s.includes("downloader") || t.includes("downloader")) {
      return ["4K UHD", "1080p HD", "720p HD", "MP3 Audio", "320kbps", "No Watermark"]
    }
    if (s.includes("unlock") || t.includes("unlock")) {
      return ["Protected", "Key Check", "Decrypted", "Print ✓", "Copy ✓", "Edit ✓"]
    }
    if (s.includes("protect") || t.includes("protect")) {
      return ["AES-256", "Encrypted", "Password", "Secure ✓", "Private ✓", "Locked ✓"]
    }
    if (s.includes("merge") || t.includes("merge")) {
      return ["Doc 1", "Doc 2", "Doc 3", "Merged ✓", "In Order", "Unified"]
    }
    if (s.includes("compress") || t.includes("compress")) {
      return ["-90% Size", "2.3 MB", "Vector OK", "300 DPI", "Lossless", "Fast ✓"]
    }
    if (s.includes("sign") || t.includes("sign")) {
      return ["Vector", "Stamp", "Placed", "Legal ✓", "Flattened", "Signed ✓"]
    }
    if (s.includes("split") || t.includes("split")) {
      return ["Pages 1–2", "Pages 3–4", "Pages 5–6", "Pages 7–8", "Pages 9–10", "Pages 11–12"]
    }
    if (s.includes("to-word") || t.includes("to word")) {
      return ["Header", "Paragraph", "Table", "Images", "Styles", ".DOCX ✓"]
    }
    if (s.includes("to-excel") || t.includes("to excel")) {
      return ["Sheet 1", "Formulas", "Columns", "Data Map", "Cells", ".XLSX ✓"]
    }
    if (isVideo) {
      return ["0:00", "0:15", "0:30", "0:45", "1:00", "1:15"]
    }
    if (isAudio) {
      return ["Track 1", "320kbps", "Hi-Fi", "Stereo", "Lossless", "Master"]
    }
    if (isImage) {
      return ["PNG", "JPG", "WEBP", "SVG", "AVIF", "Lossless"]
    }
    if (isSeo) {
      return ["99% Unique", "Humanized", "GEO Ready", "Zero Risk", "AEO Citations", "Verified"]
    }
    return ["Verified", "Private", "Fast", "Lossless", "100% Free", "Secure"]
  })()

  const fileAcceptType = isPdf 
    ? ".pdf,application/pdf" 
    : isVideo 
    ? "video/*" 
    : isAudio 
    ? "audio/*" 
    : isImage 
    ? "image/*" 
    : "*"

  const formatBadgeText = isDownloader
    ? "YouTube, X, FB & Instagram URLs"
    : isPdf 
    ? ".PDF files up to 100MB" 
    : isVideo 
    ? ".MP4, .MOV, .MKV up to 500MB" 
    : isAudio 
    ? ".MP3, .WAV, .M4A lossless" 
    : "All standard file formats"

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Sona-Style Hero Section with Full Drag-and-Drop Dropzone */}
      <section className="pt-8 sm:pt-12 pb-12 px-4 bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div 
            onDragEnter={!isDownloader ? handleDragEnter : undefined}
            onDragOver={!isDownloader ? handleDragOver : undefined}
            onDragLeave={!isDownloader ? handleDragLeave : undefined}
            onDrop={!isDownloader ? handleDrop : undefined}
            className={`rounded-[2.5rem] bg-[#FAFAFA] dark:bg-slate-900/60 border transition-all p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xs ${
              isDragging && !isDownloader
                ? "border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20" 
                : "border-slate-200/90 dark:border-slate-800"
            }`}
          >
            {/* Full-Card Drag & Drop Overlay */}
            {isDragging && !isDownloader && (
              <div className="absolute inset-0 bg-[#D7FB8E]/95 dark:bg-slate-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center border-4 border-dashed border-emerald-600 dark:border-emerald-400 rounded-[2.5rem] p-8 text-center animate-in fade-in-50 duration-150 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 animate-bounce shadow-xl">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mb-2 tracking-tight">
                  Drop your {cleanTitle} files right here!
                </h3>
                <p className="text-slate-800 dark:text-slate-300 font-semibold text-sm sm:text-base">
                  Release anywhere in this card to begin processing immediately in your browser
                </p>
              </div>
            )}
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#D7FB8E]/15 dark:bg-[#D7FB8E]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
              
              {/* Left Column: Tool Specific Headline, Description & Primary Action Button */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                {/* Top Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black tracking-wider uppercase mb-5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ◆ {isDownloader ? "100% Free Video & Audio Downloader" : "100% Free & Private Tools"}
                </div>

                {/* Tool Headline - Sized nicely and cleanly */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                  {displayHeadline}
                </h1>

                {/* Subheadline */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed mb-6">
                  {displaySubtitle}
                </p>

                {/* Primary Action Button or Direct URL Input for Downloaders */}
                {isDownloader ? (
                  <div className="w-full max-w-xl mb-4">
                    <div className="flex flex-col gap-2 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          <Link2 className="w-3.5 h-3.5" /> Direct Video URL
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">YouTube, X, FB, Instagram</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={heroUrl}
                          onChange={(e) => setHeroUrl(e.target.value)}
                          placeholder="Paste video link here (YouTube, X, FB, Instagram)..."
                          className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const container = document.getElementById("tool-canvas-container")
                            if (container) {
                              container.scrollIntoView({ behavior: "smooth" })
                              const canvasInput = container.querySelector('input[type="text"]') as HTMLInputElement
                              if (canvasInput) {
                                if (heroUrl) {
                                  canvasInput.value = heroUrl
                                  canvasInput.dispatchEvent(new Event("input", { bubbles: true }))
                                }
                                const fetchBtn = container.querySelector('button.bg-\\[\\#D7FB8E\\], button:has(svg.lucide-sparkles)') as HTMLButtonElement
                                if (fetchBtn && heroUrl) fetchBtn.click()
                              }
                            }
                          }}
                          className="px-6 py-3 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-bold text-sm tracking-tight transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] border border-black/10 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                        >
                          <span>Download Video</span>
                          <ArrowRight className="w-4 h-4 text-slate-950" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 w-full sm:w-auto mb-4">
                    <button
                      onClick={handleChooseFilesClick}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#D7FB8E] hover:bg-[#cbf777] text-slate-950 font-semibold text-sm sm:text-base tracking-tight transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] border border-black/10 cursor-pointer text-center"
                    >
                      <span>Choose {cleanTitle} Files</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-950" />
                    </button>
                  </div>
                )}

              </div>

              {/* Right Column: Sona.ai Overlapping Interactive Cards (Tailored to Current Tool) */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] sm:min-h-[380px] w-full py-4 sm:py-6 overflow-hidden sm:overflow-visible max-w-[340px] sm:max-w-none mx-auto">
                
                {/* 1. Sona.ai Back Lime Card (Dynamic per Category) */}
                <div className="w-[250px] sm:w-[310px] rounded-3xl bg-[#D7FB8E] p-5 sm:p-6 text-slate-950 shadow-md border border-black/5 flex flex-col justify-between absolute right-1 sm:right-4 top-0 transform translate-x-0">
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-700 mb-1.5">
                      {isDownloader ? "STREAM EXTRACTOR" : categoryLabel}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/10 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                      <span>◆</span> {isDownloader ? "FAST CDN" : "INSTANT ENGINE"}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
                      {isDownloader ? `${cleanTitle} High Speed` : `${cleanTitle} Auto-Processed`}
                    </h4>

                    {/* 6 Feature / Part Preview Tiles */}
                    <div className="grid grid-cols-3 gap-2 my-3.5">
                      {previewTiles.map((tile, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-[#cbf777] border border-black/5 flex flex-col items-center justify-center text-slate-950 shadow-2xs p-1">
                          <span className="text-[9px] font-mono font-bold text-slate-700 truncate max-w-full">{tile}</span>
                          <span className="text-xs font-black">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between pt-1">
                    <span>100% Quality Preserved</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. Sona.ai Front Sky Blue Card (Active Dropzone) */}
                <div
                  onClick={() => {
                    if (isDownloader) {
                      document.getElementById("tool-canvas-container")?.scrollIntoView({ behavior: "smooth" })
                    } else {
                      handleChooseFilesClick()
                    }
                  }}
                  className="w-[250px] sm:w-[310px] rounded-3xl bg-[#BAE6FD] dark:bg-sky-950 p-5 sm:p-6 shadow-2xl border border-sky-300 dark:border-sky-800 hover:scale-[1.02] transition-all cursor-pointer relative z-20 transform -translate-x-4 sm:-translate-x-12 translate-y-12 sm:translate-y-20"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-sky-900 dark:text-sky-300 mb-1.5">
                      {isDownloader ? "URL LINK PROCESSOR" : "CLIENT SANDBOX"}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-200/80 dark:bg-sky-900/80 text-sky-950 dark:text-sky-200 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                      <span>◆</span> {isDownloader ? "NO FILE UPLOAD" : "ZERO DATA RETENTION"}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {isDownloader ? "Paste Video Link to Download" : `Drop ${cleanTitle} files here`}
                    </h4>

                    {/* Modern Drag and Drop Graphic */}
                    <div className="my-3.5 p-3.5 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-sky-200/80 dark:border-sky-800 flex flex-col items-center justify-center text-center shadow-2xs">
                      {isDownloader ? (
                        <Link2 className="w-8 h-8 text-sky-600 dark:text-sky-400 mb-1 animate-pulse" />
                      ) : (
                        <UploadCloud className="w-8 h-8 text-sky-600 dark:text-sky-400 mb-1 animate-pulse" />
                      )}
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {isDownloader ? "Paste link from any video" : "Drag & drop files here"}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        {formatBadgeText}
                      </p>
                    </div>
                  </div>

                  {/* Sona.ai Cyan Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isDownloader) {
                        document.getElementById("tool-canvas-container")?.scrollIntoView({ behavior: "smooth" })
                      } else {
                        handleChooseFilesClick()
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <span>{isDownloader ? "Paste Video Link" : `Select ${cleanTitle} Files`}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Interactive In-Page Tool Canvas (rendered for tools with interactive editors like Plagiarism Checker, AI Detector, Word Counter) */}
          {toolComponent && (
            <div id="tool-canvas-container" className="mt-10 max-w-5xl mx-auto w-full">
              {toolComponent}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            multiple
            accept={fileAcceptType}
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(Array.from(e.target.files))
              }
            }}
          />

          {/* Checkmarks under tool */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
            {topCheckmarks.map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {text}
              </div>
            ))}
          </div>

          {/* AdSense In-Content Placement */}
          <div className="mt-10 max-w-4xl mx-auto">
            <AdSlot slotId="tool-inline-banner" className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800" />
          </div>
        </div>
      </section>

      {/* 2. Sona-Style Zig-Zag Content Features (Tailored Dynamic Mockups per Tool) */}
      {zigZagFeatures.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-slate-950 overflow-hidden font-sans border-t border-slate-100 dark:border-slate-800/80">
          <div className="container mx-auto max-w-6xl space-y-24">
            {zigZagFeatures.map((feature, idx) => {
              const currentCheckmarks = 
                idx === 0 ? mockupData.feat1.checkmarks :
                idx === 1 ? mockupData.feat2.checkmarks :
                mockupData.feat3.checkmarks

              return (
              <div key={idx} className="grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Text Column */}
                <div className={`md:col-span-6 ${idx % 2 === 1 ? 'md:order-2 md:pl-4' : 'md:pr-4'}`}>
                  {/* Category Pill Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200 dark:border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D7FB8E]"></span>
                    {idx === 0 ? "◆ High-Speed Engine" : idx === 1 ? "◆ Enterprise Security" : "◆ Multi-Platform"}
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight leading-snug">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                    {feature.description}
                  </p>

                  <div className="space-y-2.5 pt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#D7FB8E] text-slate-950 flex items-center justify-center text-xs font-black shadow-2xs">✓</div>
                      <span>{currentCheckmarks[0]}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#D7FB8E] text-slate-950 flex items-center justify-center text-xs font-black shadow-2xs">✓</div>
                      <span>{currentCheckmarks[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Visual Product Mockup Card (Sona.ai Clean Widget Design - Dynamic per Tool) */}
                <div className={`md:col-span-6 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="rounded-[2rem] bg-[#FAFAFA] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
                    
                    {/* Background Soft Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D7FB8E]/15 rounded-full blur-3xl pointer-events-none" />
                    
                    {idx === 0 ? (
                      /* Visual 1: Core Processing Widget (Dynamic per Tool) */
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate pr-2">
                            <span>{mockupData.feat1.sourceIcon}</span>
                            <span className="truncate">{mockupData.feat1.sourceName}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D7FB8E] text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                            {mockupData.feat1.badgeText}
                          </span>
                        </div>

                        {/* 3 Step / Column Cards */}
                        <div className="grid grid-cols-3 gap-2.5 pt-2">
                          {mockupData.feat1.cols.map((col, cIdx) => (
                            <div key={cIdx} className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center shadow-2xs space-y-1.5">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{col.tag}</div>
                              <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{col.label}</div>
                              <div className={`inline-flex items-center gap-1 text-[10px] font-bold ${col.statusColor || "text-emerald-600 dark:text-emerald-400"}`}>
                                {col.status}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Status bar */}
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs font-medium text-emerald-800 dark:text-emerald-300">
                          <span className="flex items-center gap-1.5 truncate pr-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                            <span className="truncate">{mockupData.feat1.statusBarText}</span>
                          </span>
                          <span className="font-mono font-bold text-[11px] shrink-0">{mockupData.feat1.statusExecution}</span>
                        </div>
                      </div>
                    ) : idx === 1 ? (
                      /* Visual 2: Security & Privacy Status Widget (Dynamic per Tool) */
                      <div className="space-y-3.5 relative z-10">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate pr-2">
                            <span>🔒</span>
                            <span className="truncate">{mockupData.feat2.protocolTitle}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                            {mockupData.feat2.badgeText}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {mockupData.feat2.rows.map((row, rIdx) => (
                            <div key={rIdx} className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">{row.label}</span>
                              <span className={`font-mono font-bold ${row.valueColor || "text-slate-900 dark:text-white"}`}>{row.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                          {mockupData.feat2.footerText}
                        </div>
                      </div>
                    ) : (
                      /* Visual 3: Universal Browser & Device Compatibility */
                      <div className="space-y-3.5 relative z-10">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate pr-2">
                            <span>💻</span>
                            <span className="truncate">{mockupData.feat3.title}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D7FB8E] text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                            {mockupData.feat3.badgeText}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                          {mockupData.feat3.devices.map((device, dIdx) => (
                            <div key={dIdx} className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                              <span className="text-emerald-500 font-bold">✓</span> {device}
                            </div>
                          ))}
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-xs font-medium text-slate-600 dark:text-slate-400">
                          {mockupData.feat3.footerText}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 3. How-To Block (Sona-Harmonized Step Timeline) */}
      {howToSteps.length > 0 && (
        <section className="py-20 px-4 font-sans bg-slate-50/60 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800/80" id="how-to-steps">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-[2.5rem] p-8 md:p-14 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-12">
              
              {/* Left Timeline Card */}
              <div className="w-full md:w-2/5 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl bg-[#FAFAFA] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>Workflow Steps</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Free</span>
                  </div>

                  {howToSteps.map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                      <div className="w-7 h-7 rounded-xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center font-black text-xs border border-black/10">
                        {idx + 1}
                      </div>
                      <span className="truncate">Step {idx + 1}: {idx === 0 ? "Select & upload files" : idx === 1 ? "Configure preferences" : "Download output"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Steps Text */}
              <div className="w-full md:w-3/5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <span>◆ Step-by-Step Guide</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
                  {howToTitle}
                </h2>
                <ol className="space-y-4">
                  {howToSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                      <div className="w-8 h-8 rounded-xl bg-[#D7FB8E] text-slate-950 flex items-center justify-center font-black text-sm shrink-0 border border-black/10 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 4. Grid Features */}
      {gridFeatures.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white text-center mb-12 tracking-tight">{gridTitle}</h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {gridFeatures.map((feat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-[#FAFAFA] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-[#D7FB8E]/30 dark:bg-[#D7FB8E]/20 text-slate-950 dark:text-[#D7FB8E] rounded-2xl shadow-2xs border border-black/5 dark:border-white/5">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FAQs */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">{faqTitle}</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-200">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none"
                  >
                    {faq.question}
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed border-t dark:border-slate-800 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Technical Specifications & Standards */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 font-sans">
        <div className="container mx-auto max-w-5xl">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200 dark:border-slate-700">
              <span>◆ Technical Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Technical Specifications &amp; Compatibility
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Built with client-side WebAssembly, high-throughput memory buffers, and zero server storage retention.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden bg-[#FAFAFA] dark:bg-slate-900/40 shadow-xs mb-16">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
                    <th className="py-4 px-6">Specification</th>
                    <th className="py-4 px-6">Standard Supported</th>
                    <th className="py-4 px-6">Privacy &amp; Security Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                  <tr>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">Execution Engine</td>
                    <td className="py-4 px-6 font-mono text-emerald-600 dark:text-emerald-400 font-bold">Client-Side WebAssembly (WASM)</td>
                    <td className="py-4 px-6">Executes locally inside your browser sandbox; no unencrypted network transit</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">Format Compatibility</td>
                    <td className="py-4 px-6 font-mono">{isPdf ? "PDF 1.4 – 2.0, PDF/A, ISO 32000" : isVideo ? "MP4, MOV, MKV, WebM, AVI" : isAudio ? "MP3, WAV, AAC, M4A, FLAC" : isImage ? "PNG, JPG, WebP, SVG, AVIF, HEIC" : "Universal Web & Media Standards"}</td>
                    <td className="py-4 px-6">Full backward and forward compliance with desktop and mobile viewers</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">Encryption Channel</td>
                    <td className="py-4 px-6 font-mono text-slate-900 dark:text-white font-semibold">TLS 1.3 / 256-Bit SSL</td>
                    <td className="py-4 px-6">Cryptographic validation prevents man-in-the-middle inspection or eavesdropping</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">Data Retention Policy</td>
                    <td className="py-4 px-6 font-mono text-emerald-600 dark:text-emerald-400 font-bold">0 MB Disk Storage (In-RAM Only)</td>
                    <td className="py-4 px-6">Working memory is wiped permanently as soon as your session or download completes</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">Supported Platforms</td>
                    <td className="py-4 px-6">macOS, Windows 11, iOS, Android, Linux, ChromeOS</td>
                    <td className="py-4 px-6">Zero executable software, plugins, or browser extensions to install</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Architecture Comparison Table */}
          <div className="rounded-[2.5rem] p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight text-center">
              Why Use InstantTool Instead of Legacy Cloud Converters?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm uppercase tracking-wider">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>InstantTool Modern Architecture</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li>• <strong>Local Browser Processing:</strong> Fast client-side execution with zero upload latency.</li>
                  <li>• <strong>Zero Document Logging:</strong> Sensitive contracts and files are never stored on server disks.</li>
                  <li>• <strong>100% Free Core Tools:</strong> No mandatory credit card registration or surprise payment blocks.</li>
                  <li>• <strong>Zero Watermarks:</strong> Clean, pristine downloads ready for professional use.</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-extrabold text-sm uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-black">✕</span>
                  <span>Legacy Cloud Converter Sites</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <li>• Uploads confidential documents across the public internet to third-party cloud servers.</li>
                  <li>• Stores files on disk for hours or days, creating vulnerability honeypots.</li>
                  <li>• Enforces strict 2-file daily caps and demands recurring monthly subscriptions.</li>
                  <li>• Degrades image/video quality or stamps watermarks to force paid upgrades.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Relevant Educational Guides & Tutorials (Internal Linking) */}
      <section className="py-20 px-4 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80 font-sans">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 dark:border-emerald-800">
                <span>◆ Knowledge Base &amp; Tutorials</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recommended Guides &amp; Deep Dives
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              View all 12+ guides →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {displayBlogs.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`} 
                className="group flex flex-col p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="text-emerald-600 dark:text-emerald-400">{post.categoryName}</span>
                  <span className="text-slate-400 font-normal">{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
                  Read guide →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom Sections */}
      <section className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
         <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-900 dark:text-white mb-8">
               <span>Rate this tool</span>
               <div className="flex text-yellow-400 gap-1 text-lg">
                  ★★★★★
               </div>
               <span className="text-slate-500 ml-2">4.8 / 5</span>
            </div>
         </div>
         <SupportDonationCTA />
      </section>
    </div>
  )
}
