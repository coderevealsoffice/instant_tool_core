import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// ─── Types ───
interface DownloadResult {
  downloadUrl: string
  title: string
  thumbnail?: string
  duration?: string
  qualities?: { label: string; url: string }[]
  audioUrl?: string
  source: string
}

// ─── YouTube via yt-dlp (FREE, runs locally) ───
async function fetchYouTubeVideo(url: string): Promise<DownloadResult> {
  try {
    // Use yt-dlp to get video info as JSON (no download, just metadata + URLs)
    // Add extractor-args to spoof tv_embedded client (which provides full formats without bot blocks)
    const { stdout } = await execAsync(
      `yt-dlp --dump-json --ignore-no-formats-error --no-warnings --no-playlist --extractor-args "youtube:player_client=tv_embedded" "${url}"`,
      { timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
    )

    const data = JSON.parse(stdout)

    const title = data.title || "YouTube Video"
    const thumbnail = data.thumbnail || ""
    const duration = data.duration ? formatDuration(data.duration) : ""

    // Extract download formats
    const qualities: { label: string; url: string }[] = []
    let audioUrl = ""

    if (data.formats && Array.isArray(data.formats)) {
      // Get combined (video+audio) formats
      const combined = data.formats.filter(
        (f: any) => f.vcodec !== "none" && f.acodec !== "none" && f.url
      )

      // Deduplicate by resolution
      const seenResolutions = new Set<string>()
      for (const f of combined) {
        const label = f.format_note || (f.height ? `${f.height}p` : "")
        if (label && f.url && !seenResolutions.has(label)) {
          seenResolutions.add(label)
          qualities.push({ label, url: f.url })
        }
      }

      // Get best audio-only stream
      const audioFormats = data.formats.filter(
        (f: any) => f.vcodec === "none" && f.acodec !== "none" && f.url
      )
      if (audioFormats.length > 0) {
        // Sort by bitrate desc
        audioFormats.sort((a: any, b: any) => (b.abr || 0) - (a.abr || 0))
        audioUrl = audioFormats[0].url
      }
    }

    // Sort qualities highest first
    qualities.sort((a, b) => {
      const numA = parseInt(a.label) || 0
      const numB = parseInt(b.label) || 0
      return numB - numA
    })

    // Fallback: use the best URL from yt-dlp directly
    const bestUrl = qualities.length > 0 
      ? qualities[0].url 
      : data.url || ""

    if (!bestUrl && !audioUrl) {
      throw new Error("No download streams found for this video.")
    }

    return {
      downloadUrl: bestUrl || audioUrl,
      title,
      thumbnail,
      duration,
      qualities: qualities.length > 0 ? qualities : undefined,
      audioUrl: audioUrl || undefined,
      source: "youtube",
    }
  } catch (error: any) {
    // Check if yt-dlp is not installed
    if (error.message?.includes("not found") || error.message?.includes("ENOENT")) {
      throw new Error("yt-dlp is not installed on the server. Run: brew install yt-dlp")
    }
    // Re-throw with cleaner message
    const msg = error.stderr || error.message || "Failed to fetch video"
    throw new Error(msg.split("\n")[0])
  }
}

// ─── Instagram via yt-dlp (FREE, runs locally) ───
async function fetchInstagramMedia(url: string): Promise<DownloadResult> {
  try {
    const { stdout } = await execAsync(
      `yt-dlp --dump-json --no-warnings --no-playlist "${url}"`,
      { timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
    )

    const data = JSON.parse(stdout)

    const title = data.title || data.description?.substring(0, 80) || "Instagram Media"
    const thumbnail = data.thumbnail || ""

    // Get the best download URL
    let downloadUrl = ""
    if (data.formats && Array.isArray(data.formats)) {
      // Get best quality format with both video + audio
      const combined = data.formats.filter(
        (f: any) => f.url && f.vcodec !== "none"
      )
      if (combined.length > 0) {
        // Sort by quality
        combined.sort((a: any, b: any) => (b.height || 0) - (a.height || 0))
        downloadUrl = combined[0].url
      }
    }

    if (!downloadUrl) {
      downloadUrl = data.url || ""
    }

    if (!downloadUrl) {
      throw new Error("Could not extract download link from this Instagram post.")
    }

    return {
      downloadUrl,
      title,
      thumbnail,
      source: "instagram",
    }
  } catch (error: any) {
    if (error.message?.includes("not found") || error.message?.includes("ENOENT")) {
      throw new Error("yt-dlp is not installed on the server. Run: brew install yt-dlp")
    }
    
    const msg = error.stderr || error.message || "Failed to fetch media"
    
    // Check if Instagram blocked the request due to missing cookies
    if (msg.includes("empty media response") || msg.includes("login")) {
      throw new Error(
        "Instagram blocked this request because it requires authentication. As a free workaround, you can run yt-dlp locally with the --cookies-from-browser flag, or configure a RapidAPI key."
      )
    }

    const cleanMsg = msg.split("\n").find((line: string) => line.includes("ERROR")) || msg.split("\n")[0]
    throw new Error(cleanMsg.replace("ERROR: ", ""))
  }
}

// ─── Helpers ───
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  return `${mins}:${String(secs).padStart(2, "0")}`
}

function detectPlatform(url: string): "youtube" | "instagram" | "x" | "facebook" | "linkedin" | "generic" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("instagram.com")) return "instagram"
  if (url.includes("twitter.com") || url.includes("x.com")) return "x"
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "facebook"
  if (url.includes("linkedin.com")) return "linkedin"
  return "generic"
}

// ─── Main Handler ───
export async function POST(req: Request) {
  try {
    const { url, type } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const platform = type && type !== "youtube" ? type : detectPlatform(url)

    let result: DownloadResult

    switch (platform) {
      case "youtube":
      case "x":
      case "facebook":
      case "linkedin":
      case "generic":
        // fetchYouTubeVideo uses yt-dlp which works for all these platforms natively
        result = await fetchYouTubeVideo(url)
        break
      case "instagram":
        result = await fetchInstagramMedia(url)
        break
      default:
        // Even if unknown, let's try generic fetch
        result = await fetchYouTubeVideo(url)
        break
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Downloader API Error:", error.message)
    return NextResponse.json(
      { error: error.message || "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
