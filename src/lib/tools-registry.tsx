import React from "react"
import { UploadCloud, FileDown, Loader2, ShieldCheck, Star, Clock, BookOpen, FileBadge2, Braces, Sparkles } from "lucide-react"
import { ImageConverterUploader } from "@/components/tools/ImageConverterUploader"
import { VideoTrimmer } from "@/components/tools/VideoTrimmer"
import { AudioTrimmer } from "@/components/tools/AudioTrimmer"

import { ExtractAudio } from "@/components/tools/ExtractAudio"
import { ChangeVideoSpeed } from "@/components/tools/ChangeVideoSpeed"
import { ChangeVolume } from "@/components/tools/ChangeVolume"
import { ChangeAudioSpeed } from "@/components/tools/ChangeAudioSpeed"

import { RotateVideo } from "@/components/tools/RotateVideo"
import { FlipVideo } from "@/components/tools/FlipVideo"
import { CropVideo } from "@/components/tools/CropVideo"

import { ImageToPdf } from "@/components/tools/ImageToPdf"
import { PdfToImage } from "@/components/tools/PdfToImage"
import { CompressPdf } from "@/components/tools/CompressPdf"
import { MergePdf } from "@/components/tools/MergePdf"
import { RotatePdf } from "@/components/tools/RotatePdf"
import { SplitPdf } from "@/components/tools/SplitPdf"
import { AudioConverter } from "@/components/tools/AudioConverter"
import { AudioEnhancer } from "@/components/tools/AudioEnhancer"
import { VideoEditor } from "@/components/tools/VideoEditor"
import { SignPdf } from "@/components/tools/SignPdf"
import { GenericToolUploader } from "@/components/tools/GenericToolUploader"
import { NoFileToolStarter } from "@/components/tools/NoFileToolStarter"
import { MonitorPlay, Video, Mic, MessageSquare, Palette, Code2, FileCode2, Camera } from "lucide-react"

// Text Tools
import { WordCounterCanvas } from "@/components/workspace/tools/text/WordCounterCanvas"
import { TextCapitalizerCanvas } from "@/components/workspace/tools/text/TextCapitalizerCanvas"
import { AiEbookGeneratorCanvas } from "@/components/workspace/tools/ai/ai-ebook-generator-canvas"
import { CodeToImageCanvas } from "@/components/workspace/tools/dev/code-to-image-canvas"
import { MinifyJsCanvas } from "@/components/workspace/tools/dev/minify-js-canvas"
import { MinifyCssCanvas } from "@/components/workspace/tools/dev/minify-css-canvas"
import { FormatHtmlCanvas } from "@/components/workspace/tools/dev/format-html-canvas"
import { ColorPaletteCanvas } from "@/components/workspace/tools/image/color-palette-canvas"
import { SlugGeneratorCanvas } from "@/components/workspace/tools/text/SlugGeneratorCanvas"
import { TextExtractorCanvas } from "@/components/workspace/tools/text/TextExtractorCanvas"
import { AiContentWriterCanvas } from "@/components/workspace/tools/text/AiContentWriterCanvas"

// Color Tools
import { ColorPickerCanvas } from "@/components/workspace/tools/color/ColorPickerCanvas"
import { GradientGeneratorCanvas } from "@/components/workspace/tools/color/GradientGeneratorCanvas"

import { ImageBackgroundRemoverCanvas } from "@/components/workspace/tools/image-background-remover-canvas"

// AI Tools
import { AiImageGeneratorCanvas } from "@/components/workspace/tools/generators/AiImageGeneratorCanvas"
import { AiGrammarCheckerCanvas } from "@/components/workspace/tools/text/AiGrammarCheckerCanvas"
import { AiPdfChatbotCanvas } from "@/components/workspace/tools/pdf/AiPdfChatbotCanvas"
import { AiTextHumanizerCanvas } from "@/components/workspace/tools/ai/ai-text-humanizer-canvas"
import { AiYoutubeSummarizerCanvas } from "@/components/workspace/tools/ai/ai-youtube-summarizer-canvas"
import { AiResumeBuilderCanvas } from "@/components/workspace/tools/ai/ai-resume-builder-canvas"
import { AiYoutubeKeywordGeneratorCanvas } from "@/components/workspace/tools/ai/ai-youtube-keyword-generator-canvas"
import { AiShortsScriptGeneratorCanvas } from "@/components/workspace/tools/ai/ai-shorts-script-generator-canvas"
import { AiThumbnailGeneratorCanvas } from "@/components/workspace/tools/ai/ai-thumbnail-generator-canvas"
import { AiLinkedinPostGeneratorCanvas } from "@/components/workspace/tools/ai/ai-linkedin-post-generator-canvas"
import { AiPodcastNotesGeneratorCanvas } from "@/components/workspace/tools/ai/ai-podcast-notes-generator-canvas"
import { AiVideoCaptionGeneratorCanvas } from "@/components/workspace/tools/ai/ai-video-caption-generator-canvas"

// Image Tools
import { HeicToJpgCanvas } from "@/components/workspace/tools/converters/heic-to-jpg-canvas"
import { BulkImageCompressorCanvas } from "@/components/workspace/tools/image/bulk-compressor-canvas"

// Dev Tools
import { JsonFormatterCanvas } from "@/components/workspace/tools/dev/json-formatter-canvas"

// Generic placeholder component for tools we haven't built logic for yet
export function ComingSoonUploader({ toolName }: { toolName: string }) {
  return (
    <div className="relative rounded-xl border-4 border-dashed border-emerald-200 p-8 md:p-16 text-center text-white bg-white/5">
      <UploadCloud className="w-16 h-16 mb-6 mx-auto opacity-80" />
      <h3 className="text-2xl font-bold mb-4">{toolName}</h3>
      <p className="text-white/80 mb-8">This tool is currently under development (Phase 2-4).</p>
      <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold shadow-xl opacity-50 cursor-not-allowed">
        Coming Soon
      </button>
    </div>
  )
}

export type ToolConfig = {
  title: string
  description: string
  headerColorClass: string
  toolComponent: React.ReactNode
  topCheckmarks?: string[]
  zigZagFeatures?: any[]
  howToSteps?: string[]
  gridFeatures?: any[]
  faqs?: any[]
}

function generateSEOData(toolName: string, category: "video" | "audio" | "pdf" | "image" | "text" | string) {
  // Simple deterministic hash based on toolName to ensure consistency
  let hash = 0;
  for (let i = 0; i < toolName.length; i++) {
    hash = Math.imul(31, hash) + toolName.charCodeAt(i) | 0;
  }
  const seed = Math.abs(hash);

  // Helper to pick a random element deterministically
  const pick = <T,>(arr: T[], offset: number): T => arr[(seed + offset) % arr.length];
  
  // Helper to pick multiple unique elements
  const pickMultiple = <T,>(arr: T[], count: number, offset: number): T[] => {
    const result: T[] = [];
    const usedIndices = new Set<number>();
    let currentOffset = offset;
    while (result.length < count && result.length < arr.length) {
      const idx = (seed + currentOffset) % arr.length;
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        result.push(arr[idx]);
      }
      currentOffset += 13; // prime jump
    }
    return result;
  };

  const isVideo = category === 'video';
  const isAudio = category === 'audio';
  const isPdf = category === 'pdf';
  const isText = category === 'text';

  const categoryContext = isVideo ? "video media" : isAudio ? "audio tracks" : isPdf ? "document files" : isText ? "text content" : "image graphics";

  // SEO/GEO Checkmarks
  const checkmarkPool = [
    `Lightning-fast ${toolName} execution`,
    "100% Secure & Private",
    "No installation required",
    "Works in any browser",
    `Best-in-class ${categoryContext} algorithms`,
    "Free for basic usage",
    "Instant cloud processing",
    "Zero data retention",
    "High-quality output guaranteed",
    "Enterprise-grade encryption"
  ];

  // ZigZag Features Pool (GEO/AEO optimized)
  const zzTitlePool1 = [
    `The Ultimate ${toolName} Solution`,
    `Premium ${toolName} Online`,
    `Next-Gen ${toolName} Software`,
    `Simplify Your Workflow with ${toolName}`,
    `The Only ${toolName} Tool You Need`
  ];
  
  const zzDescPool1 = [
    `Experience the easiest way to process your files with our online ${toolName.toLowerCase()} utility. We've designed it to be lightning-fast, maintaining pristine quality so you never have to compromise. Just drag, drop, and you're done!`,
    `Stop struggling with complex desktop software. Our ${toolName.toLowerCase()} tool brings professional-grade ${categoryContext} processing directly to your browser. Perfectly optimized for both speed and uncompromising quality.`,
    `Whether you're a professional or a beginner, our intuitive ${toolName.toLowerCase()} interface makes handling ${categoryContext} effortless. Powered by advanced cloud algorithms, we deliver results in seconds.`,
    `Maximize your productivity with our industry-leading ${toolName.toLowerCase()} application. Built for performance, it guarantees exceptional output quality while keeping your workflow completely frictionless.`
  ];

  const zzTitlePool2 = [
    "Your Privacy is Our Priority",
    "Military-Grade File Security",
    "100% Safe & Confidential",
    "Strict Zero-Trust Processing",
    "Secure Cloud Infrastructure"
  ];

  const zzDescPool2 = [
    "We understand how important your data is. That's why your files are processed with top-tier security. Many of our tools work right inside your browser, and any cloud processing utilizes 256-bit encryption with automatic deletion after 2 hours.",
    "Data privacy isn't an afterthought—it's our foundation. Every file uploaded for our tools is secured via end-to-end TLS encryption. Once processed, our servers automatically and permanently purge your data.",
    "You retain full ownership of your files. Our platform acts merely as a secure processing conduit. We never analyze, store, or share your content. Everything is wiped completely clean shortly after you download the result.",
    "Trust our enterprise-level security protocols. Our servers are ISO certified and use military-grade AES-256 encryption. Your digital assets remain exclusively yours, guarded against any unauthorized access."
  ];

  // How-To Steps
  const howToStart = [
    `Start by selecting the file you want to process and dragging it into the ${toolName} upload area.`,
    `Click the upload button or drag and drop your ${categoryContext} directly into the workspace.`,
    `To begin, choose your file from your device, Google Drive, or Dropbox and drop it into the designated zone.`,
    `Simply upload the file you wish to modify by dropping it onto the ${toolName} interface.`
  ];
  const howToMid1 = [
    "Adjust the settings to your liking. We provide smart defaults so you can skip this if you're in a hurry.",
    "Customize the output parameters according to your specific requirements, or rely on our optimized auto-settings.",
    "Configure the tool options if needed. Our AI-driven defaults guarantee excellent results instantly.",
    "Tweak the processing options as desired. The interface provides real-time feedback for your changes."
  ];
  const howToMid2 = [
    "Hit the process button and let our powerful engines do the heavy lifting in seconds.",
    "Click 'Start' and our high-performance cloud servers will process your request immediately.",
    "Initiate the process and watch as our advanced algorithms complete the task in record time.",
    "Press the action button. Our system will securely and rapidly execute the requested modifications."
  ];
  const howToFinish = [
    "Your new file is ready! Download it instantly and enjoy your beautifully processed document or media.",
    "Success! Click download to save your newly processed file directly to your local device.",
    "The process is complete. You can now securely download your high-quality output file.",
    "All done! Save the result to your computer or instantly share it with your team."
  ];

  // Grid Features
  const gridTitles = ["Free to Use", "Cross Platform", "Lightning Fast", "High Quality", "No Watermarks", "Cloud Powered", "Batch Processing", "Secure Connection"];
  const gridDescs = [
    "Start using our premium tools completely free with our generous basic plan.",
    "Works flawlessly on Windows, Mac, Linux, iOS, and Android directly in your browser.",
    "Our optimized processing engines ensure you aren't left waiting.",
    "We use advanced algorithms to preserve the original quality of your files.",
    "Unlike competitors, we don't stamp our logo on your hard work.",
    "Offload the heavy computing to our powerful distributed server network.",
    "Process dozens of files simultaneously to save hours of manual work.",
    "All connections are secured with industry-standard TLS encryption."
  ];

  const gridIcons = [
    <Star className="w-8 h-8" />,
    <ShieldCheck className="w-8 h-8" />,
    <Clock className="w-8 h-8" />,
    <Sparkles className="w-8 h-8" />,
    <FileBadge2 className="w-8 h-8" />,
    <UploadCloud className="w-8 h-8" />,
    <Braces className="w-8 h-8" />,
    <BookOpen className="w-8 h-8" />
  ];

  // FAQs (AEO optimized)
  const faqPool = [
    {
      question: `Is it safe to use this ${toolName} tool?`,
      answer: "Absolutely! We prioritize your security above all else. All file transfers are secured with advanced 256-bit SSL encryption. If the tool uses client-side processing, your file never even leaves your device. For cloud-based tools, your files are automatically deleted from our servers after 2 hours."
    },
    {
      question: "Do I need to install any software?",
      answer: "Nope, InstantTool is 100% browser-based. You don't need to download, install, or update any applications to get your work done. Just open your browser, upload your file, and you're good to go!"
    },
    {
      question: "Does it work on my smartphone or tablet?",
      answer: "Yes! Our website is fully responsive and our processing engines are optimized to work beautifully on modern mobile browsers. You can process your files on iOS, Android, Windows, or Mac without any hassle."
    },
    {
      question: "Is there a file size limit for free users?",
      answer: "Yes, free users have a generous file size limit that covers most standard documents and media files. If you need to process larger files or do batch processing, consider upgrading to our affordable Pro plan for unrestricted access."
    },
    {
      question: "Will the quality of my file be affected?",
      answer: `We use state-of-the-art algorithms specifically designed for ${toolName} to ensure the highest possible quality is maintained. Unless you are specifically using compression, your file's resolution and clarity will remain untouched.`
    },
    {
      question: "How long does the processing take?",
      answer: "Our cloud infrastructure is built for speed. Most files are processed in just a few seconds. The exact time depends on your file size and your internet connection speed, but you won't be left waiting long."
    },
    {
      question: `Can I use the ${toolName} tool offline?`,
      answer: "Currently, InstantTool requires an active internet connection to load the application. However, many of our tools run entirely in your browser using WebAssembly, meaning once loaded, the processing happens locally on your machine."
    },
    {
      question: "Are my files used for AI training?",
      answer: "No. We have a strict zero-data-mining policy. Your uploaded files and generated outputs are completely private and are never used to train our AI models or shared with any third parties."
    },
    {
      question: `What is the best way to ${toolName.toLowerCase()} online?`,
      answer: `The most efficient way is using a dedicated, secure web application like InstantTool. Our ${toolName} interface is streamlined for both beginners and professionals, eliminating the need for bulky software installations.`
    },
    {
      question: `Why choose InstantTool for ${toolName.toLowerCase()}?`,
      answer: "InstantTool combines enterprise-level security, lightning-fast processing speeds, and a beautiful, ad-free interface. We focus on providing a frictionless user experience that respects your time and privacy."
    }
  ];

  return {
    topCheckmarks: pickMultiple(checkmarkPool, 3, 1),
    zigZagFeatures: [
      {
        title: pick(zzTitlePool1, 2),
        description: pick(zzDescPool1, 3),
        imageText: "", 
        color: isVideo ? "bg-blue-100" : isAudio ? "bg-emerald-100" : isPdf ? "bg-red-100" : isText ? "bg-yellow-100" : "bg-purple-100"
      },
      {
        title: pick(zzTitlePool2, 4),
        description: pick(zzDescPool2, 5),
        imageText: "",
        color: "bg-slate-100"
      }
    ],
    howToImage: "",
    howToSteps: [
      pick(howToStart, 6),
      pick(howToMid1, 7),
      pick(howToMid2, 8),
      pick(howToFinish, 9)
    ],
    gridFeatures: pickMultiple(gridTitles, 3, 10).map((title) => {
      const idx = gridTitles.indexOf(title);
      return {
        title,
        description: gridDescs[idx],
        icon: gridIcons[idx]
      };
    }),
    faqs: pickMultiple(faqPool, 5, 11)
  }
}

export const toolsRegistry: Record<string, Record<string, ToolConfig>> = {
  "image-tools": {
    "heic-to-jpg": {
      title: "HEIC to JPG",
      description: "Convert iPhone HEIC photos to standard JPG format client-side.",
      headerColorClass: "bg-blue-600",
      toolComponent: <HeicToJpgCanvas />,
      ...generateSEOData("HEIC to JPG", "image")
    },
    "bulk-compressor": {
      title: "Bulk Image Compressor",
      description: "Compress multiple JPG, PNG, and WebP images at once.",
      headerColorClass: "bg-emerald-600",
      toolComponent: <BulkImageCompressorCanvas />,
      ...generateSEOData("Bulk Image Compressor", "image")
    }
  },
  "video-tools": {
    "editor": {
      title: "Video Editor",
      description: "Edit your videos online quickly and easily.",
      headerColorClass: "bg-slate-800",
      toolComponent: <VideoEditor />,
      ...generateSEOData("Video Editor", "video")
    },
    "trim": {
      title: "Trim Video",
      description: "Cut and trim your video files online.",
      headerColorClass: "bg-slate-800",
      toolComponent: <VideoTrimmer />,
      ...generateSEOData("Trim Video", "video")
    },
    "extract-audio": {
      title: "Extract Audio",
      description: "Extract audio from video files online.",
      headerColorClass: "bg-slate-800",
      toolComponent: <ExtractAudio />,
      ...generateSEOData("Extract Audio", "video")
    },
    "change-speed": {
      title: "Change Video Speed",
      description: "Speed up or slow down a video.",
      headerColorClass: "bg-slate-800",
      toolComponent: <ChangeVideoSpeed />,
      ...generateSEOData("Change Video Speed", "video")
    },
    "rotate": {
      title: "Rotate Video",
      description: "Rotate your videos online.",
      headerColorClass: "bg-slate-800",
      toolComponent: <RotateVideo />,
      ...generateSEOData("Rotate Video", "video")
    },
    "flip": {
      title: "Flip Video",
      description: "Flip your videos horizontally or vertically.",
      headerColorClass: "bg-slate-800",
      toolComponent: <FlipVideo />,
      ...generateSEOData("Flip Video", "video")
    },
    "crop": {
      title: "Crop Video",
      description: "Crop your videos to different aspect ratios.",
      headerColorClass: "bg-slate-800",
      toolComponent: <CropVideo />,
      ...generateSEOData("Crop Video", "video")
    },
    "screen-recorder": {
      title: "Screen Recorder",
      description: "Record your screen directly in the browser.",
      headerColorClass: "bg-slate-800",
      toolComponent: (
        <NoFileToolStarter 
          toolName="Screen Recorder" 
          toolSlug="screen-recorder" 
          category="video-tools" 
          icon={<MonitorPlay className="w-12 h-12" />} 
          buttonText="Start Recording" 
        />
      ),
      ...generateSEOData("Screen Recorder", "video")
    },
    "text-to-speech": {
      title: "Text to Speech",
      description: "Convert text to realistic speech online.",
      headerColorClass: "bg-slate-800",
      toolComponent: (
        <NoFileToolStarter 
          toolName="Text to Speech" 
          toolSlug="text-to-speech" 
          category="video-tools" 
          icon={<MessageSquare className="w-12 h-12" />} 
          buttonText="Open Editor" 
        />
      ),
      ...generateSEOData("Text to Speech", "video")
    },
    "merge": {
      title: "Merge Videos",
      description: "Combine multiple video files into one.",
      headerColorClass: "bg-violet-700",
      toolComponent: <GenericToolUploader toolName="Merge Videos" toolSlug="merge" category="video-tools" accept="video/*" />,
      ...generateSEOData("Merge Videos", "video")
    },
    "add-audio": {
      title: "Add Audio to Video",
      description: "Overlay or replace the audio track of your video.",
      headerColorClass: "bg-blue-700",
      toolComponent: <GenericToolUploader toolName="Add Audio to Video" toolSlug="add-audio" category="video-tools" accept="video/*" />,
      ...generateSEOData("Add Audio to Video", "video")
    },
    "add-image": {
      title: "Add Image to Video",
      description: "Overlay an image on top of your video.",
      headerColorClass: "bg-blue-700",
      toolComponent: <GenericToolUploader toolName="Add Image to Video" toolSlug="add-image" category="video-tools" accept="video/*" />,
      ...generateSEOData("Add Image to Video", "video")
    },
    "add-text": {
      title: "Add Text to Video",
      description: "Add subtitles or text overlays to your video.",
      headerColorClass: "bg-blue-700",
      toolComponent: <GenericToolUploader toolName="Add Text to Video" toolSlug="add-text" category="video-tools" accept="video/*" />,
      ...generateSEOData("Add Text to Video", "video")
    },
    "remove-logo": {
      title: "Remove Logo from Video",
      description: "Remove watermarks and logos from video files.",
      headerColorClass: "bg-slate-700",
      toolComponent: <GenericToolUploader toolName="Remove Logo from Video" toolSlug="remove-logo" category="video-tools" accept="video/*" />,
      ...generateSEOData("Remove Logo from Video", "video")
    },
    "resize": {
      title: "Resize Video",
      description: "Change the resolution or aspect ratio of your video.",
      headerColorClass: "bg-amber-700",
      toolComponent: <GenericToolUploader toolName="Resize Video" toolSlug="resize" category="video-tools" accept="video/*" />,
      ...generateSEOData("Resize Video", "video")
    },
    "loop": {
      title: "Loop Video",
      description: "Create a seamlessly looping version of your video.",
      headerColorClass: "bg-cyan-700",
      toolComponent: <GenericToolUploader toolName="Loop Video" toolSlug="loop" category="video-tools" accept="video/*" />,
      ...generateSEOData("Loop Video", "video")
    },
    "volume": {
      title: "Change Video Volume",
      description: "Increase or decrease the volume of your video file.",
      headerColorClass: "bg-indigo-700",
      toolComponent: <GenericToolUploader toolName="Change Video Volume" toolSlug="volume" category="video-tools" accept="video/*" />,
      ...generateSEOData("Change Video Volume", "video")
    },
    "speed": {
      title: "Change Video Speed",
      description: "Speed up or slow down your video file.",
      headerColorClass: "bg-green-700",
      toolComponent: <GenericToolUploader toolName="Change Video Speed" toolSlug="speed" category="video-tools" accept="video/*" />,
      ...generateSEOData("Change Video Speed", "video")
    },
    "stabilize": {
      title: "Stabilize Video",
      description: "Remove shakiness and stabilize your video footage.",
      headerColorClass: "bg-rose-700",
      toolComponent: <GenericToolUploader toolName="Stabilize Video" toolSlug="stabilize" category="video-tools" accept="video/*" />,
      ...generateSEOData("Stabilize Video", "video")
    },
    "youtube-downloader": {
      title: "YouTube Downloader",
      description: "Download YouTube videos easily.",
      headerColorClass: "bg-red-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="YouTube Downloader" 
          toolSlug="youtube-downloader" 
          description="Click to start downloading YouTube videos"
          icon={<MonitorPlay className="w-16 h-16 mb-4 text-red-500" />}
        />
      ),
      ...generateSEOData("YouTube Downloader", "video")
    },
    "instagram-downloader": {
      title: "Instagram Downloader",
      description: "Download Instagram Reels and Videos.",
      headerColorClass: "bg-pink-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="Instagram Downloader" 
          toolSlug="instagram-downloader" 
          description="Click to start downloading Instagram videos"
          icon={<Camera className="w-16 h-16 mb-4 text-pink-500" />}
        />
      ),
      ...generateSEOData("Instagram Downloader", "video")
    },
    "recorder": {
      title: "Video Recorder",
      description: "Record video directly from your webcam.",
      headerColorClass: "bg-slate-800",
      toolComponent: (
        <NoFileToolStarter 
          toolName="Video Recorder" 
          toolSlug="recorder" 
          category="video-tools" 
          icon={<Video className="w-12 h-12" />} 
          buttonText="Start Webcam" 
        />
      ),
      ...generateSEOData("Video Recorder", "video")
    },
  },
  "audio-tools": {
    "enhancer": {
      title: "Audio Enhancer",
      description: "Remove background noise and enhance speech clarity.",
      headerColorClass: "bg-blue-600",
      toolComponent: <AudioEnhancer />,
      ...generateSEOData("Audio Enhancer", "audio")
    },
    "trim": {
      title: "Trim Audio",
      description: "Cut your audio files online for free.",
      headerColorClass: "bg-blue-600",
      toolComponent: <AudioTrimmer />,
      ...generateSEOData("Trim Audio", "audio")
    },
    "change-volume": {
      title: "Change Audio Volume",
      description: "Increase or decrease the volume of your audio files.",
      headerColorClass: "bg-blue-600",
      toolComponent: <ChangeVolume />,
      ...generateSEOData("Change Audio Volume", "audio")
    },
    "change-speed": {
      title: "Change Audio Speed",
      description: "Speed up or slow down an audio file.",
      headerColorClass: "bg-blue-600",
      toolComponent: <ChangeAudioSpeed />,
      ...generateSEOData("Change Audio Speed", "audio")
    },
    "pitch": {
      title: "Change Pitch",
      description: "Shift the pitch of your audio up or down.",
      headerColorClass: "bg-teal-600",
      toolComponent: <GenericToolUploader toolName="Change Pitch" toolSlug="pitch" category="audio-tools" accept="audio/*" />,
      ...generateSEOData("Change Pitch", "audio")
    },
    "equalizer": {
      title: "Audio Equalizer",
      description: "Fine-tune the frequency balance of your audio.",
      headerColorClass: "bg-emerald-600",
      toolComponent: <GenericToolUploader toolName="Audio Equalizer" toolSlug="equalizer" category="audio-tools" accept="audio/*" />,
      ...generateSEOData("Audio Equalizer", "audio")
    },
    "reverse": {
      title: "Reverse Audio",
      description: "Play your audio file in reverse.",
      headerColorClass: "bg-orange-600",
      toolComponent: <GenericToolUploader toolName="Reverse Audio" toolSlug="reverse" category="audio-tools" accept="audio/*" />,
      ...generateSEOData("Reverse Audio", "audio")
    },
    "recorder": {
      title: "Voice Recorder",
      description: "Record audio online directly from your microphone.",
      headerColorClass: "bg-blue-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="Voice Recorder" 
          toolSlug="recorder" 
          category="audio-tools" 
          icon={<Mic className="w-12 h-12" />} 
          buttonText="Start Microphone" 
        />
      ),
      ...generateSEOData("Voice Recorder", "audio")
    },
    "joiner": {
      title: "Audio Joiner",
      description: "Merge multiple audio tracks into a single file.",
      headerColorClass: "bg-blue-600",
      toolComponent: <GenericToolUploader toolName="Audio Joiner" toolSlug="joiner" category="audio-tools" accept="audio/*" />,
      ...generateSEOData("Audio Joiner", "audio")
    },
  },
  "pdf-tools": {
    "image-to-pdf": {
      title: "Image to PDF",
      description: "Convert your JPG and PNG images into a PDF document.",
      headerColorClass: "bg-red-600",
      toolComponent: <ImageToPdf />,
      ...generateSEOData("Image to PDF", "pdf")
    },
    "pdf-to-image": {
      title: "PDF to Image",
      description: "Extract high-quality JPG images from your PDF pages.",
      headerColorClass: "bg-red-600",
      toolComponent: <PdfToImage />,
      ...generateSEOData("PDF to Image", "pdf")
    },
    "compress-pdf": {
      title: "Compress PDF",
      description: "Reduce file size while optimizing for maximal PDF quality.",
      headerColorClass: "bg-red-600",
      toolComponent: <CompressPdf />,
      topCheckmarks: ["Maintain high PDF quality", "Fast compression", "Secure and private processing"],
      zigZagFeatures: [
        {
          title: "Compress PDF online",
          description: "A simple and easy-to-use PDF compressor that helps you reduce the size of your documents quickly. No need to install any additional software.",
          imageText: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=800&q=80",
          color: "bg-red-100"
        },
        {
          title: "The best PDF compressor",
          description: "We strive to provide the best quality and file size reduction for your documents. Our system intelligently analyzes your PDF to choose the best compression method.",
          imageText: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
          color: "bg-amber-100"
        },
        {
          title: "Secure PDF compression",
          description: "All files uploaded to InstantTool are encrypted using 256-bit encryption. Files are deleted automatically from our servers after a short period to ensure your privacy.",
          imageText: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
          color: "bg-blue-100"
        }
      ],
      howToSteps: [
        "Select your PDF file and upload it to the compression tool.",
        "Wait a few seconds while our cloud servers optimize your document.",
        "Click 'Download Compressed PDF' to save your new, smaller file.",
        "Share your optimized document via email or web easily."
      ],
      gridFeatures: [
        {
          title: "Batch Processing",
          description: "Compress multiple files at once. Our Pro plans unlock limitless batch processing to save you countless hours.",
          icon: <ShieldCheck className="w-8 h-8" />
        },
        {
          title: "Mac, Windows, Mobile",
          description: "Our online compressor works flawlessly in your web browser, meaning you don't have to install any software on your devices.",
          icon: <Clock className="w-8 h-8" />
        },
        {
          title: "Share with Ease",
          description: "Easily bypass email attachment size limits and ensure your clients or colleagues can download your files instantly.",
          icon: <Star className="w-8 h-8" />
        }
      ],
      faqs: [
        {
          question: "How much will my file be compressed?",
          answer: "The exact compression ratio depends on the contents of your PDF. Documents with large unoptimized images will see massive size reductions (up to 90%), while text-only PDFs may see smaller reductions."
        },
        {
          question: "Will the quality of my images be ruined?",
          answer: "No. InstantTool uses intelligent optimization algorithms to ensure images remain sharp and text remains perfectly clear, even at significantly reduced file sizes."
        },
        {
          question: "Is this tool safe for business documents?",
          answer: "Yes, completely safe. We use end-to-end encryption for all uploads and downloads. All files are purged from our cloud servers automatically after 2 hours."
        }
      ]
    },
    "merge-pdf": {
      title: "Merge PDF",
      description: "Combine PDFs in the order you want with the easiest PDF merger available.",
      headerColorClass: "bg-purple-600",
      toolComponent: <MergePdf />,
      topCheckmarks: ["Secure file merging", "256-bit TLS encryption", "Files deleted in 2 hours"],
      zigZagFeatures: [
        {
          title: "Simple online tool to combine PDFs",
          description: "Our PDF merger allows you to quickly combine multiple PDF files into one single PDF document, in just a few clicks. No sign up is needed to use this online tool.",
          imageText: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80",
          color: "bg-purple-100"
        },
        {
          title: "Secure PDF merging online",
          description: "All the files you upload, as well as the file generated on our server, will be deleted permanently within a few hours. Read our Privacy Policy below for more details.",
          imageText: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
          color: "bg-blue-100"
        },
        {
          title: "Works on Windows, Mac, & Linux",
          description: "Our PDF combiner is browser-based. It works for all platforms including Mac, Windows, and Linux.",
          imageText: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
          color: "bg-green-100"
        }
      ],
      howToSteps: [
        "Select your PDFs and upload them to our secure merge tool.",
        "Rearrange the files into the correct order if necessary.",
        "Click the 'Merge PDFs' button to combine your documents.",
        "Download your newly merged PDF file instantly."
      ],
      gridFeatures: [
        {
          title: "Reliable Service",
          description: "To merge PDFs or just to add a page to a PDF you usually have to buy expensive software. This online service is safe and secure.",
          icon: <ShieldCheck className="w-8 h-8" />
        },
        {
          title: "Processing in the Cloud",
          description: "Our servers in the cloud will handle the pdf creation for you once you have combined your files. So, it won't drain any capacity from your computer.",
          icon: <Clock className="w-8 h-8" />
        },
        {
          title: "Premium Quality",
          description: "InstantTool ensures the highest quality PDF merging without losing formatting or data. Your PDFs remain exactly as they were.",
          icon: <Star className="w-8 h-8" />
        }
      ],
      faqs: [
        {
          question: "Is it safe to merge PDF files?",
          answer: "Yes! InstantTool uses advanced TLS encryption to ensure your files are completely secure during transfer. We also automatically delete your files from our servers within 2 hours of processing."
        },
        {
          question: "How many files can I merge at once?",
          answer: "With a free account, you can merge up to 5 files at a time. Upgrading to a Pro account allows you to merge up to 100 files simultaneously with unlimited processing."
        },
        {
          question: "Will merging PDFs affect their quality?",
          answer: "No, our PDF merging tool simply combines the pages of your documents without compressing or altering the original contents, so there is zero quality loss."
        }
      ]
    },
    "rotate-pdf": {
      title: "Rotate PDF",
      description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
      headerColorClass: "bg-blue-600",
      toolComponent: <RotatePdf />,
      topCheckmarks: ["Rotate left or right", "Fast and free", "Secure and private processing"],
      zigZagFeatures: [
        {
          title: "Rotate PDF pages instantly",
          description: "Sometimes a scanned document comes out upside down or sideways. With our PDF rotator tool, you can permanently flip all pages in your document with a single click.",
          imageText: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=800&q=80",
          color: "bg-blue-100"
        },
        {
          title: "Permanent Rotation",
          description: "Unlike simple PDF viewers that only temporarily rotate the view, our tool actually modifies the file so that it will open correctly for anyone you send it to.",
          imageText: "https://images.unsplash.com/photo-1544396821-4dd40b938883?auto=format&fit=crop&w=800&q=80",
          color: "bg-indigo-100"
        },
        {
          title: "Total Privacy",
          description: "We use 256-bit encryption for all file transfers. Your files are automatically and permanently deleted from our servers within a few hours.",
          imageText: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
          color: "bg-emerald-100"
        }
      ],
      howToSteps: [
        "Select your PDF file and upload it to the rotation tool.",
        "Choose whether you want to rotate the document 90 degrees to the left or right.",
        "Click 'Rotate PDF Now' and wait a few seconds.",
        "Download your permanently rotated PDF."
      ],
      gridFeatures: [
        {
          title: "Works on Any Device",
          description: "Since InstantTool is a cloud-based application, you can rotate PDFs directly from your Mac, Windows, iOS or Android device.",
          icon: <ShieldCheck className="w-8 h-8" />
        },
        {
          title: "Lightning Fast",
          description: "Our dedicated servers can process and rotate even large PDF documents in just a few milliseconds.",
          icon: <Clock className="w-8 h-8" />
        },
        {
          title: "Perfect Quality",
          description: "Rotating a PDF document does not affect the text or images. The quality of your document will remain 100% untouched.",
          icon: <Star className="w-8 h-8" />
        }
      ],
      faqs: [
        {
          question: "Will the rotation be permanent?",
          answer: "Yes! Our tool edits the internal metadata of the PDF so that the rotation is permanent. Anyone who opens the downloaded file will see the correct orientation."
        },
        {
          question: "Can I rotate multiple documents at once?",
          answer: "Our Pro plan supports batch processing, meaning you can select multiple PDFs and rotate them all simultaneously."
        },
        {
          question: "Is this tool safe for business documents?",
          answer: "Yes, completely safe. We use end-to-end encryption for all uploads and downloads. All files are purged from our cloud servers automatically after 2 hours."
        }
      ]
    },
    "split-pdf": {
      title: "Split PDF",
      description: "Extract pages from your PDF or save each page as a separate PDF.",
      headerColorClass: "bg-red-500",
      toolComponent: <SplitPdf />,
      topCheckmarks: ["Extract specific pages", "Secure cloud processing", "High speed execution"],
      zigZagFeatures: [
        {
          title: "Split PDF files instantly",
          description: "Our online PDF splitter allows you to quickly and safely separate pages of a PDF document or extract specific pages to form a new PDF.",
          imageText: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
          color: "bg-red-100"
        },
        {
          title: "Secure PDF splitting online",
          description: "All files uploaded and generated are permanently deleted from our servers within a few hours to ensure your complete privacy.",
          imageText: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
          color: "bg-blue-100"
        },
        {
          title: "Use on any device",
          description: "You don't need to install any software to split PDF files. InstantTool works directly in your browser on Mac, Windows, Linux, Android, and iOS.",
          imageText: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
          color: "bg-orange-100"
        }
      ],
      howToSteps: [
        "Select your PDF document and upload it to the tool.",
        "Specify the exact page ranges you want to extract (e.g., 1, 3, 5-10).",
        "Click the 'Split PDF Now' button.",
        "Download your newly split PDF files (packaged as a convenient ZIP archive)."
      ],
      gridFeatures: [
        {
          title: "Easy to Use",
          description: "You don't need to be a technical expert to split a PDF. Our simple interface makes extracting pages effortless.",
          icon: <ShieldCheck className="w-8 h-8" />
        },
        {
          title: "Cloud Processing",
          description: "We handle the heavy lifting on our powerful cloud servers, meaning the extraction process won't slow down your computer.",
          icon: <Clock className="w-8 h-8" />
        },
        {
          title: "Maintains Quality",
          description: "We guarantee that the split PDF pages will have the exact same formatting, fonts, and images as the original file.",
          icon: <Star className="w-8 h-8" />
        }
      ],
      faqs: [
        {
          question: "How do I extract a single page from a PDF?",
          answer: "Upload your PDF to our tool, and simply enter the page number you want to extract into the 'Page Ranges' input box. We will instantly extract just that page for you."
        },
        {
          question: "Can I split a PDF into multiple separate files?",
          answer: "Yes! If you leave the 'Page Ranges' box blank, our tool will automatically split your document so that every single page becomes its own separate PDF file, packaged in a ZIP."
        },
        {
          question: "Is this tool safe for confidential documents?",
          answer: "Absolutely. InstantTool uses advanced TLS encryption for file transfers, and we strictly delete all uploaded and processed files from our servers within 2 hours."
        }
      ]
    },
    "edit-pdf": {
      title: "Edit PDF",
      description: "Add text, shapes, and images to your PDF directly in the browser.",
      headerColorClass: "bg-red-600",
      toolComponent: <GenericToolUploader toolName="Edit PDF" toolSlug="edit-pdf" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("Edit PDF", "pdf")
    },
    "unlock-pdf": {
      title: "Unlock PDF",
      description: "Remove password protection from your PDF files.",
      headerColorClass: "bg-red-600",
      toolComponent: <GenericToolUploader toolName="Unlock PDF" toolSlug="unlock-pdf" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("Unlock PDF", "pdf")
    },
    "protect-pdf": {
      title: "Protect PDF",
      description: "Add password protection to your PDF files.",
      headerColorClass: "bg-red-600",
      toolComponent: <GenericToolUploader toolName="Protect PDF" toolSlug="protect-pdf" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("Protect PDF", "pdf")
    },
    "sign-pdf": {
      title: "Sign PDF",
      description: "Add your signature to your PDF document easily.",
      headerColorClass: "bg-red-600",
      toolComponent: <SignPdf />,
      ...generateSEOData("Sign PDF", "pdf")
    },
    "add-page-numbers": {
      title: "Add Page Numbers",
      description: "Add page numbers to your PDF document.",
      headerColorClass: "bg-red-600",
      toolComponent: <GenericToolUploader toolName="Add Page Numbers" toolSlug="add-page-numbers" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("Add Page Numbers", "pdf")
    },
    "pdf-to-word": {
      title: "PDF to Word",
      description: "Convert your PDF files to editable Word documents.",
      headerColorClass: "bg-blue-700",
      toolComponent: <GenericToolUploader toolName="PDF to Word" toolSlug="pdf-to-word" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("PDF to Word", "pdf")
    },
    "pdf-to-excel": {
      title: "PDF to Excel",
      description: "Convert PDF tables to editable Excel spreadsheets.",
      headerColorClass: "bg-green-700",
      toolComponent: <GenericToolUploader toolName="PDF to Excel" toolSlug="pdf-to-excel" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("PDF to Excel", "pdf")
    },
    "pdf-to-jpg": {
      title: "PDF to JPG",
      description: "Convert each page of your PDF to high-quality JPG images.",
      headerColorClass: "bg-red-600",
      toolComponent: <GenericToolUploader toolName="PDF to JPG" toolSlug="pdf-to-jpg" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("PDF to JPG", "pdf")
    },
    "pdf-to-png": {
      title: "PDF to PNG",
      description: "Convert each page of your PDF to high-quality PNG images.",
      headerColorClass: "bg-red-600",
      toolComponent: <GenericToolUploader toolName="PDF to PNG" toolSlug="pdf-to-png" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("PDF to PNG", "pdf")
    },
    "pdf-to-html": {
      title: "PDF to HTML",
      description: "Convert PDF documents to HTML web pages.",
      headerColorClass: "bg-orange-600",
      toolComponent: <GenericToolUploader toolName="PDF to HTML" toolSlug="pdf-to-html" category="pdf-tools" accept="application/pdf" />,
      ...generateSEOData("PDF to HTML", "pdf")
    },
    "word-to-pdf": {
      title: "Word to PDF",
      description: "Convert Word documents to PDF format.",
      headerColorClass: "bg-blue-700",
      toolComponent: <GenericToolUploader toolName="Word to PDF" toolSlug="word-to-pdf" category="pdf-tools" accept=".doc,.docx" />,
      ...generateSEOData("Word to PDF", "pdf")
    },
    "jpg-to-pdf": {
      title: "JPG to PDF",
      description: "Convert JPG images to PDF documents.",
      headerColorClass: "bg-purple-600",
      toolComponent: <GenericToolUploader toolName="JPG to PDF" toolSlug="jpg-to-pdf" category="pdf-tools" accept="image/jpeg,image/jpg" />,
      ...generateSEOData("JPG to PDF", "pdf")
    },
    "excel-to-pdf": {
      title: "Excel to PDF",
      description: "Convert Excel spreadsheets to PDF format.",
      headerColorClass: "bg-green-700",
      toolComponent: <GenericToolUploader toolName="Excel to PDF" toolSlug="excel-to-pdf" category="pdf-tools" accept=".xls,.xlsx" />,
      ...generateSEOData("Excel to PDF", "pdf")
    },
    "ppt-to-pdf": {
      title: "PPT to PDF",
      description: "Convert PowerPoint presentations to PDF format.",
      headerColorClass: "bg-orange-600",
      toolComponent: <GenericToolUploader toolName="PPT to PDF" toolSlug="ppt-to-pdf" category="pdf-tools" accept=".ppt,.pptx" />,
      ...generateSEOData("PPT to PDF", "pdf")
    },
    "png-to-pdf": {
      title: "PNG to PDF",
      description: "Convert PNG images to PDF documents.",
      headerColorClass: "bg-pink-600",
      toolComponent: <GenericToolUploader toolName="PNG to PDF" toolSlug="png-to-pdf" category="pdf-tools" accept="image/png" />,
      ...generateSEOData("PNG to PDF", "pdf")
    },
  },
  "converters": {
    "image": {
      title: "Image Converter",
      description: "Convert images to different formats.",
      headerColorClass: "bg-purple-600",
      toolComponent: <ImageConverterUploader />
    },
    "audio": {
      title: "Audio Converter",
      description: "Convert audio files to different formats instantly.",
      headerColorClass: "bg-emerald-600",
      toolComponent: <AudioConverter />,
      topCheckmarks: ["Convert to MP3, WAV, OGG, AAC", "100% Secure Client-Side Conversion", "Files never leave your browser"],
      zigZagFeatures: [
        {
          title: "Instant Audio Conversion",
          description: "Convert your audio files between MP3, WAV, AAC, FLAC, and more in seconds.",
          imageText: "https://images.unsplash.com/photo-1516280440502-8618e404be1b?auto=format&fit=crop&w=800&q=80",
          color: "bg-emerald-100"
        },
        {
          title: "Secure & Local Processing",
          description: "Whenever possible, your audio is processed locally right in your browser, so your files never leave your device.",
          imageText: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
          color: "bg-blue-100"
        },
        {
          title: "High Quality Output",
          description: "We use advanced encoders to ensure your converted audio sounds just as good as the original, without quality loss.",
          imageText: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
          color: "bg-purple-100"
        }
      ],
      howToSteps: [
        "Select your audio file from your device.",
        "Choose your desired output format (MP3, WAV, OGG, or AAC).",
        "Click 'Convert Audio Now'. The conversion happens instantly in your browser.",
        "Click the download button to save your converted file."
      ],
      gridFeatures: [
        {
          title: "No Size Limits",
          description: "Because conversions happen locally, you can convert large audio files without worrying about upload limits.",
          icon: <ShieldCheck className="w-8 h-8" />
        },
        {
          title: "Works Offline",
          description: "Once the converter engine is loaded in your browser, you can convert as many files as you want without an internet connection.",
          icon: <Clock className="w-8 h-8" />
        },
        {
          title: "Multiple Formats",
          description: "Seamlessly convert between all popular audio formats with a single click.",
          icon: <Star className="w-8 h-8" />
        }
      ],
      faqs: [
        {
          question: "Is my audio uploaded to your servers?",
          answer: "No. The entire conversion process happens directly within your web browser using WebAssembly. Your files are never uploaded to the cloud, ensuring total privacy."
        },
        {
          question: "What audio formats are supported?",
          answer: "We currently support converting any valid audio input into MP3, WAV, OGG, and AAC formats."
        },
        {
          question: "Is there a file size limit?",
          answer: "Since the conversion happens locally on your machine, there are no artificial file size limits. However, processing very large files depends on your device's memory."
        }
      ]
    },
    "video": {
      title: "Video Converter",
      description: "Convert video files between different formats.",
      headerColorClass: "bg-slate-700",
      toolComponent: <GenericToolUploader toolName="Video Converter" toolSlug="video" category="converters" accept="video/*" />,
      ...generateSEOData("Video Converter", "video")
    },
    "document": {
      title: "Document Converter",
      description: "Convert between document formats seamlessly.",
      headerColorClass: "bg-blue-700",
      toolComponent: <GenericToolUploader toolName="Document Converter" toolSlug="document" category="converters" accept="*" />,
      ...generateSEOData("Document Converter", "pdf")
    },
    "font": {
      title: "Font Converter",
      description: "Convert font files between different formats.",
      headerColorClass: "bg-violet-600",
      toolComponent: <GenericToolUploader toolName="Font Converter" toolSlug="font" category="converters" accept=".ttf,.otf,.woff,.woff2" />,
      ...generateSEOData("Font Converter", "image")
    },
    "archive": {
      title: "Archive Converter",
      description: "Convert between archive formats like ZIP, RAR, and 7z.",
      headerColorClass: "bg-amber-700",
      toolComponent: <GenericToolUploader toolName="Archive Converter" toolSlug="archive" category="converters" accept=".zip,.rar,.7z,.tar" />,
      ...generateSEOData("Archive Converter", "pdf")
    },
    "ebook": {
      title: "Ebook Converter",
      description: "Convert ebooks between different formats.",
      headerColorClass: "bg-teal-600",
      toolComponent: <GenericToolUploader toolName="Ebook Converter" toolSlug="ebook" category="converters" accept=".epub,.mobi,.pdf" />,
      ...generateSEOData("Ebook Converter", "pdf")
    },
    "extractor": {
      title: "Archive Extractor",
      description: "Extract files from ZIP, RAR, 7z, and other archives.",
      headerColorClass: "bg-slate-600",
      toolComponent: <GenericToolUploader toolName="Archive Extractor" toolSlug="extractor" category="converters" accept=".zip,.rar,.7z,.tar" />,
      ...generateSEOData("Archive Extractor", "pdf")
    },
  },
  "text-tools": {
    "word-counter": {
      title: "Word Counter",
      description: "Count words, characters, and paragraphs in real-time.",
      headerColorClass: "bg-indigo-600",
      toolComponent: <WordCounterCanvas />,
      ...generateSEOData("Word Counter", "image")
    },
    "text-capitalizer": {
      title: "Text Capitalizer",
      description: "Convert text to UPPERCASE, lowercase, Title Case, etc.",
      headerColorClass: "bg-fuchsia-600",
      toolComponent: <TextCapitalizerCanvas />,
      ...generateSEOData("Text Capitalizer", "image")
    },
    "slug-generator": {
      title: "URL Slug Generator",
      description: "Convert any title or text into an SEO-friendly URL slug.",
      headerColorClass: "bg-teal-600",
      toolComponent: <SlugGeneratorCanvas />,
      ...generateSEOData("URL Slug Generator", "image")
    },
    "text-extractor": {
      title: "Image to Text (OCR)",
      description: "Extract text from any image instantly using AI OCR.",
      headerColorClass: "bg-orange-600",
      toolComponent: <TextExtractorCanvas />,
      ...generateSEOData("Image to Text", "image")
    },
    "ai-writer": {
      title: "AI Content Writer",
      description: "Generate high-quality blog posts, emails, and articles instantly.",
      headerColorClass: "bg-indigo-600",
      toolComponent: <AiContentWriterCanvas />,
      ...generateSEOData("AI Content Writer", "image")
    }
  },
  "color-tools": {
    "color-picker": {
      title: "Color Picker",
      description: "Pick colors and get HEX, RGB, and HSL codes easily.",
      headerColorClass: "bg-pink-600",
      toolComponent: <ColorPickerCanvas />,
      ...generateSEOData("Color Picker", "image")
    },
    "color-palette": {
      title: "Color Palette Generator",
      description: "Generate and customize beautiful color schemes instantly.",
      headerColorClass: "bg-amber-600",
      toolComponent: <ColorPaletteCanvas />,
      ...generateSEOData("Color Palette Generator", "image")
    },
    "gradient-generator": {
      title: "Gradient Generator",
      description: "Create beautiful CSS linear and radial gradients easily.",
      headerColorClass: "bg-cyan-600",
      toolComponent: <GradientGeneratorCanvas />,
      ...generateSEOData("Gradient Generator", "image")
    },
    "color-palette-extractor": {
      title: "Color Palette Generator",
      description: "Extract dominant colors and palettes from images instantly.",
      headerColorClass: "bg-purple-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="Color Palette Generator" 
          toolSlug="color-palette" 
          description="Click to start generating color palettes"
          icon={<Palette className="w-16 h-16 mb-4 text-purple-500" />}
        />
      ),
      ...generateSEOData("Color Palette Generator", "image")
    }
  },
  "ai-tools": {
    "remove-background": {
      title: "AI Background Remover",
      description: "Remove the background from any image instantly using on-device AI. 100% Free and Private.",
      headerColorClass: "bg-fuchsia-600",
      toolComponent: <ImageBackgroundRemoverCanvas />,
      ...generateSEOData("AI Background Remover", "image")
    },
    "ai-image-generator": {
      title: "AI Image Generator",
      description: "Generate stunning AI images from text instantly without registration.",
      headerColorClass: "bg-fuchsia-600",
      toolComponent: <AiImageGeneratorCanvas />,
      ...generateSEOData("AI Image Generator", "image")
    },
    "ai-grammar-checker": {
      title: "AI Grammar Checker",
      description: "Fix grammar, spelling, and tone of your writing using advanced AI.",
      headerColorClass: "bg-indigo-600",
      toolComponent: <AiGrammarCheckerCanvas />,
      ...generateSEOData("AI Grammar Checker", "image")
    },
    "ai-pdf-chatbot": {
      title: "AI PDF Chatbot",
      description: "Chat with your PDF documents. Extract text, summarize, and ask questions instantly.",
      headerColorClass: "bg-blue-600",
      toolComponent: <AiPdfChatbotCanvas />,
      ...generateSEOData("AI PDF Chatbot", "pdf")
    },
    "ai-face-blur": {
      title: "AI Face Blur",
      description: "Automatically detect and blur faces in photos for privacy.",
      headerColorClass: "bg-blue-600",
      toolComponent: <GenericToolUploader toolName="AI Face Blur" toolSlug="ai-face-blur" category="ai-tools" accept="image/*" />,
      ...generateSEOData("AI Face Blur", "image")
    },
    "ai-image-upscaler": {
      title: "AI Image Upscaler",
      description: "Enhance and enlarge your images without losing quality using AI.",
      headerColorClass: "bg-indigo-600",
      toolComponent: <GenericToolUploader toolName="AI Image Upscaler" toolSlug="ai-image-upscaler" category="ai-tools" accept="image/*" />,
      ...generateSEOData("AI Image Upscaler", "image")
    },
    "ai-youtube-keyword-generator": {
      title: "AI YouTube Keyword Generator",
      description: "Generate highly relevant, SEO-optimized YouTube tags for your videos from a simple topic or title.",
      headerColorClass: "bg-red-600",
      toolComponent: <AiYoutubeKeywordGeneratorCanvas />,
      ...generateSEOData("AI YouTube Keyword Generator", "text")
    },
    "ai-shorts-script-generator": {
      title: "AI Shorts & Reel Script Generator",
      description: "Generate viral, fast-paced scripts for YouTube Shorts, Instagram Reels, and TikTok with a hook, body, and CTA.",
      headerColorClass: "bg-purple-600",
      toolComponent: <AiShortsScriptGeneratorCanvas />,
      ...generateSEOData("AI Shorts & Reel Script Generator", "text")
    },
    "ai-thumbnail-generator": {
      title: "AI YouTube Thumbnail Idea Generator",
      description: "Generate high-CTR YouTube thumbnail concepts with visual descriptions and hook text.",
      headerColorClass: "bg-blue-600",
      toolComponent: <AiThumbnailGeneratorCanvas />,
      ...generateSEOData("AI YouTube Thumbnail Idea Generator", "image")
    },
    "ai-linkedin-post-generator": {
      title: "AI LinkedIn Viral Post & Carousel Generator",
      description: "Generate a highly engaging LinkedIn text post and 5-slide carousel plan to go viral.",
      headerColorClass: "bg-[#0077b5]",
      toolComponent: <AiLinkedinPostGeneratorCanvas />,
      ...generateSEOData("AI LinkedIn Viral Post & Carousel Generator", "text")
    },
    "ai-podcast-notes-generator": {
      title: "AI Podcast Show Notes Generator",
      description: "Generate professional podcast show notes with summaries, key takeaways, and timestamps.",
      headerColorClass: "bg-indigo-600",
      toolComponent: <AiPodcastNotesGeneratorCanvas />,
      ...generateSEOData("AI Podcast Show Notes Generator", "text")
    },
    "ai-video-caption-generator": {
      title: "AI Viral Video Caption Generator",
      description: "Generate viral captions and trending hashtags for Instagram Reels, TikTok, and YouTube Shorts.",
      headerColorClass: "bg-pink-600",
      toolComponent: <AiVideoCaptionGeneratorCanvas />,
      ...generateSEOData("AI Viral Video Caption Generator", "text")
    },
    "ai-smart-crop": {
      title: "AI Smart Crop",
      description: "Automatically find and crop the most interesting part of an image.",
      headerColorClass: "bg-orange-600",
      toolComponent: <GenericToolUploader toolName="AI Smart Crop" toolSlug="ai-smart-crop" category="ai-tools" accept="image/*" />,
      ...generateSEOData("AI Smart Crop", "image")
    },
    "ai-image-editor": {
      title: "AI Image Editor",
      description: "A powerful, free AI-powered image editor for your browser.",
      headerColorClass: "bg-purple-600",
      toolComponent: <GenericToolUploader toolName="AI Image Editor" toolSlug="ai-image-editor" category="ai-tools" accept="image/*" />,
      ...generateSEOData("AI Image Editor", "image")
    },
    "ai-ebook-generator": {
      title: "AI Ebook Generator",
      description: "Enter a topic and AI will write, structure, and format a complete ebook PDF for you.",
      headerColorClass: "bg-indigo-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="AI Ebook Generator" 
          toolSlug="ai-ebook-generator" 
          description="Click to start generating your ebook"
          icon={<BookOpen className="w-16 h-16 mb-4 text-indigo-500" />}
        />
      ),
      ...generateSEOData("AI Ebook Generator", "text")
    },
    "ai-text-humanizer": {
      title: "AI Text Humanizer",
      description: "Rewrite AI-generated text to sound 100% human and natural. Bypass AI detectors effortlessly.",
      headerColorClass: "bg-orange-600",
      toolComponent: <AiTextHumanizerCanvas />,
      ...generateSEOData("AI Text Humanizer", "text")
    },
    "ai-youtube-summarizer": {
      title: "AI YouTube Summarizer",
      description: "Summarize any YouTube video instantly from its transcript.",
      headerColorClass: "bg-red-600",
      toolComponent: <AiYoutubeSummarizerCanvas />,
      ...generateSEOData("AI YouTube Summarizer", "text")
    },
    "ai-resume-builder": {
      title: "AI Resume Builder",
      description: "Transform your raw details into a professional, ATS-friendly PDF resume in seconds.",
      headerColorClass: "bg-blue-600",
      toolComponent: <AiResumeBuilderCanvas />,
      ...generateSEOData("AI Resume Builder", "text")
    },
  },
  "dev-tools": {
    "json-formatter": {
      title: "JSON Formatter",
      description: "Validate, format, beautify, and minify your JSON data instantly on the client side.",
      headerColorClass: "bg-teal-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="JSON Formatter" 
          toolSlug="json-formatter" 
          description="Click to start formatting your JSON"
          icon={<Braces className="w-16 h-16 mb-4 text-teal-500" />}
        />
      ),
      ...generateSEOData("JSON Formatter", "text")
    },
    "minify-js": {
      title: "JS Minifier",
      description: "Compress your JavaScript code to reduce file size.",
      headerColorClass: "bg-yellow-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="JS Minifier" 
          toolSlug="minify-js" 
          description="Click to start minifying JavaScript"
          icon={<FileCode2 className="w-16 h-16 mb-4 text-yellow-500" />}
        />
      ),
      ...generateSEOData("JS Minifier", "text")
    },
    "minify-css": {
      title: "CSS Minifier",
      description: "Compress your CSS code to reduce file size.",
      headerColorClass: "bg-blue-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="CSS Minifier" 
          toolSlug="minify-css" 
          description="Click to start minifying CSS"
          icon={<FileCode2 className="w-16 h-16 mb-4 text-blue-500" />}
        />
      ),
      ...generateSEOData("CSS Minifier", "text")
    },
    "format-html": {
      title: "HTML Formatter",
      description: "Format and beautify your HTML code.",
      headerColorClass: "bg-orange-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="HTML Formatter" 
          toolSlug="format-html" 
          description="Click to start formatting HTML"
          icon={<Code2 className="w-16 h-16 mb-4 text-orange-500" />}
        />
      ),
      ...generateSEOData("HTML Formatter", "text")
    },
    "code-to-image": {
      title: "Code to Image",
      description: "Create beautiful, shareable screenshots of your source code.",
      headerColorClass: "bg-blue-600",
      toolComponent: (
        <NoFileToolStarter 
          toolName="Code to Image" 
          toolSlug="code-to-image" 
          description="Click to start creating code images"
          icon={<Code2 className="w-16 h-16 mb-4 text-blue-500" />}
        />
      ),
      ...generateSEOData("Code to Image", "text")
    }
  }
}

export function getToolConfig(category: string, slug: string): ToolConfig | null {
  if (toolsRegistry[category] && toolsRegistry[category][slug]) {
    return toolsRegistry[category][slug]
  }
  
  // Fallback for tools dynamically linked but not fully detailed in registry yet
  return {
    title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    description: `Online tool for ${slug.replace("-", " ")}.`,
    headerColorClass: category === "video-tools" ? "bg-slate-800" : category === "audio-tools" ? "bg-blue-600" : category === "pdf-tools" ? "bg-red-600" : "bg-emerald-600",
    toolComponent: <ComingSoonUploader toolName={slug} />
  }
}
