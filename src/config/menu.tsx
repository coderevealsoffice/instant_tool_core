import React from "react"
import { 
  Video, Scissors, MonitorPlay, MessageSquare, PlusSquare, Image as ImageIcon, 
  Type, Eraser, Crop, RotateCw, FlipHorizontal, Maximize, Repeat, 
  Volume2, FastForward, Activity, Mic, Merge, MoveRight, Music, Sliders, AudioLines,
  FileText, Unlock, Lock, FilePlus2, FileDigit, ImageDown, ArrowRightLeft, FileArchive, BookOpen, Key,
  Palette, Pipette, Hash, ALargeSmall, Link2, Sparkles, Wand2, Bot, PenLine, FileBadge2, Braces,
  Code2, FileCode2, Droplets, Camera, Briefcase, Smartphone
} from "lucide-react"

export type MenuItem = {
  label: string
  href: string
  isExternal?: boolean
  description?: string
}

export type FooterSection = {
  title: string
  items: MenuItem[]
}

export const MAIN_MENU: MenuItem[] = [
  { label: "Video Tools", href: "/#video-tools" },
  { label: "Audio Tools", href: "/#audio-tools" },
  { label: "PDF Tools", href: "/#pdf-tools" },
  { label: "Text Tools", href: "/#text-tools" },
  { label: "Color Tools", href: "/#color-tools" },
  { label: "Downloaders", href: "/#downloaders" },
  { label: "Converters", href: "/#converters" },
  { label: "Pricing", href: "/pricing" }
]

export const TOOL_CATEGORIES = [
  {
    title: "Video Tools",
    tools: [
      { name: "Video Editor", description: "Edit your videos online with a powerful, easy-to-use timeline interface.", icon: <MonitorPlay className="w-5 h-5" />, href: "/video-tools/editor" },
      { name: "Screen Recorder", description: "Record your screen and audio directly from your browser without any software.", icon: <Activity className="w-5 h-5" />, href: "/video-tools/screen-recorder" },
      { name: "Text to speech", description: "Convert your written text into natural sounding spoken audio instantly.", icon: <MessageSquare className="w-5 h-5" />, href: "/video-tools/text-to-speech" },
      { name: "Merge Videos", description: "Quickly merge videos with our fast and secure online tool.", icon: <PlusSquare className="w-5 h-5" />, href: "/video-tools/merge" },
      { name: "Trim Video", description: "Cut out unwanted parts of a video to keep only the best moments.", icon: <Scissors className="w-5 h-5" />, href: "/video-tools/trim" },
      { name: "Add Audio to Video", description: "Quickly add audio to video with our fast and secure online tool.", icon: <Music className="w-5 h-5" />, href: "/video-tools/add-audio" },
      { name: "Add Image to Video", description: "Quickly add image to video with our fast and secure online tool.", icon: <ImageIcon className="w-5 h-5" />, href: "/video-tools/add-image" },
      { name: "Add Text to Video", description: "Quickly add text to video with our fast and secure online tool.", icon: <Type className="w-5 h-5" />, href: "/video-tools/add-text" },
      { name: "Remove Logo from Video", description: "Quickly remove logo from video with our fast and secure online tool.", icon: <Eraser className="w-5 h-5" />, href: "/video-tools/remove-logo" },
      { name: "Crop Video", description: "Quickly crop video with our fast and secure online tool.", icon: <Crop className="w-5 h-5" />, href: "/video-tools/crop" },
      { name: "Rotate Video", description: "Quickly rotate video with our fast and secure online tool.", icon: <RotateCw className="w-5 h-5" />, href: "/video-tools/rotate" },
      { name: "Flip video", description: "Quickly flip video with our fast and secure online tool.", icon: <FlipHorizontal className="w-5 h-5" />, href: "/video-tools/flip" },
      { name: "Resize Video", description: "Quickly resize video with our fast and secure online tool.", icon: <Maximize className="w-5 h-5" />, href: "/video-tools/resize" },
      { name: "Loop Video", description: "Quickly loop video with our fast and secure online tool.", icon: <Repeat className="w-5 h-5" />, href: "/video-tools/loop" },
      { name: "Change Video Volume", description: "Quickly change video volume with our fast and secure online tool.", icon: <Volume2 className="w-5 h-5" />, href: "/video-tools/volume" },
      { name: "Change Video Speed", description: "Quickly change video speed with our fast and secure online tool.", icon: <FastForward className="w-5 h-5" />, href: "/video-tools/speed" },
      { name: "Stabilize Video", description: "Quickly stabilize video with our fast and secure online tool.", icon: <Activity className="w-5 h-5" />, href: "/video-tools/stabilize" },
      { name: "Video Recorder", description: "Quickly video recorder with our fast and secure online tool.", icon: <Video className="w-5 h-5" />, href: "/video-tools/recorder" },
    ]
  },
  {
    title: "Downloaders",
    tools: [
      { name: "YouTube Downloader", description: "Download high-quality videos and media from YouTube instantly.", icon: <MonitorPlay className="w-5 h-5" />, href: "/video-tools/youtube-downloader" },
      { name: "Instagram Downloader", description: "Download high-quality videos and media from Instagram instantly.", icon: <Camera className="w-5 h-5" />, href: "/video-tools/instagram-downloader" },
      { name: "X Downloader", description: "Download high-quality videos and media from X instantly.", icon: <MonitorPlay className="w-5 h-5" />, href: "/video-tools/youtube-downloader" },
      { name: "Facebook Downloader", description: "Download high-quality videos and media from Facebook instantly.", icon: <MonitorPlay className="w-5 h-5" />, href: "/video-tools/youtube-downloader" },
      { name: "LinkedIn Downloader", description: "Download high-quality videos and media from LinkedIn instantly.", icon: <MonitorPlay className="w-5 h-5" />, href: "/video-tools/youtube-downloader" },
    ]
  },
  {
    title: "Audio Tools",
    tools: [
      { name: "Trim Audio", description: "Quickly trim audio with our fast and secure online tool.", icon: <Scissors className="w-5 h-5" />, href: "/audio-tools/trim" },
      { name: "Change Volume", description: "Quickly change volume with our fast and secure online tool.", icon: <Volume2 className="w-5 h-5" />, href: "/audio-tools/volume" },
      { name: "Change Speed", description: "Speed up or slow down your audio or video files easily.", icon: <FastForward className="w-5 h-5" />, href: "/audio-tools/speed" },
      { name: "Change Pitch", description: "Quickly change pitch with our fast and secure online tool.", icon: <AudioLines className="w-5 h-5" />, href: "/audio-tools/pitch" },
      { name: "Equalizer", description: "Quickly equalizer with our fast and secure online tool.", icon: <Sliders className="w-5 h-5" />, href: "/audio-tools/equalizer" },
      { name: "Reverse Audio", description: "Quickly reverse audio with our fast and secure online tool.", icon: <MoveRight className="w-5 h-5" />, href: "/audio-tools/reverse" },
      { name: "Voice Recorder", description: "Quickly voice recorder with our fast and secure online tool.", icon: <Mic className="w-5 h-5" />, href: "/audio-tools/recorder" },
      { name: "Audio Joiner", description: "Quickly audio joiner with our fast and secure online tool.", icon: <Merge className="w-5 h-5" />, href: "/audio-tools/joiner" },
    ]
  },
  {
    title: "PDF Tools",
    tools: [
      { name: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: <Scissors className="w-5 h-5" />, href: "/pdf-tools/split-pdf" },
      { name: "Merge PDF", description: "Combine PDFs in the order you want with the easiest PDF merger available.", icon: <PlusSquare className="w-5 h-5" />, href: "/pdf-tools/merge-pdf" },
      { name: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: <FileText className="w-5 h-5" />, href: "/pdf-tools/compress-pdf" },
      { name: "Sign PDF", description: "Quickly sign pdf with our fast and secure online tool.", icon: <PenLine className="w-5 h-5" />, href: "/pdf-tools/sign-pdf" },
      { name: "Unlock PDF", description: "Quickly unlock pdf with our fast and secure online tool.", icon: <Unlock className="w-5 h-5" />, href: "/pdf-tools/unlock-pdf" },
      { name: "Protect PDF", description: "Quickly protect pdf with our fast and secure online tool.", icon: <Lock className="w-5 h-5" />, href: "/pdf-tools/protect-pdf" },
      { name: "Rotate PDF", description: "Quickly rotate pdf with our fast and secure online tool.", icon: <RotateCw className="w-5 h-5" />, href: "/pdf-tools/rotate-pdf" },
      { name: "Add Page Numbers", description: "Quickly add page numbers with our fast and secure online tool.", icon: <FileDigit className="w-5 h-5" />, href: "/pdf-tools/add-page-numbers" },
      { name: "PDF to Word", description: "Convert your PDF to an editable Word document online.", icon: <FileText className="w-5 h-5" />, href: "/pdf-tools/pdf-to-word" },
      { name: "PDF to Excel", description: "Convert your PDF files to editable Excel format in seconds.", icon: <FileText className="w-5 h-5" />, href: "/pdf-tools/pdf-to-excel" },
      { name: "PDF to JPG", description: "Convert your PDF files to editable JPG format in seconds.", icon: <ImageDown className="w-5 h-5" />, href: "/pdf-tools/pdf-to-jpg" },
      { name: "PDF to PNG", description: "Convert your PDF files to editable PNG format in seconds.", icon: <ImageDown className="w-5 h-5" />, href: "/pdf-tools/pdf-to-png" },
      { name: "PDF to HTML", description: "Convert your PDF files to editable HTML format in seconds.", icon: <FileText className="w-5 h-5" />, href: "/pdf-tools/pdf-to-html" },
      { name: "Word to PDF", description: "Make DOC and DOCX files easy to read by converting them to PDF.", icon: <FileText className="w-5 h-5" />, href: "/pdf-tools/word-to-pdf" },
      { name: "JPG to PDF", description: "Easily convert your JPG files into high-quality PDF documents.", icon: <ImageDown className="w-5 h-5" />, href: "/pdf-tools/jpg-to-pdf" },
      { name: "Excel to PDF", description: "Easily convert your Excel files into high-quality PDF documents.", icon: <FileText className="w-5 h-5" />, href: "/pdf-tools/excel-to-pdf" },
      { name: "PPT to PDF", description: "Easily convert your PPT files into high-quality PDF documents.", icon: <FileText className="w-5 h-5" />, href: "/pdf-tools/ppt-to-pdf" },
      { name: "PNG to PDF", description: "Easily convert your PNG files into high-quality PDF documents.", icon: <ImageDown className="w-5 h-5" />, href: "/pdf-tools/png-to-pdf" },
    ]
  },
  {
    title: "Converters",
    tools: [
      { name: "Audio Converter", description: "Quickly audio converter with our fast and secure online tool.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/audio" },
      { name: "Video Converter", description: "Quickly video converter with our fast and secure online tool.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/video" },
      { name: "Image Converter", description: "Quickly image converter with our fast and secure online tool.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/image" },
      { name: "Document Converter", description: "Quickly document converter with our fast and secure online tool.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/document" },
      { name: "Font Converter", description: "Quickly font converter with our fast and secure online tool.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/font" },
      { name: "Archive Converter", description: "Quickly archive converter with our fast and secure online tool.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/archive" },
      { name: "Ebook Converter", description: "Quickly ebook converter with our fast and secure online tool.", icon: <BookOpen className="w-5 h-5" />, href: "/converters/ebook" },
      { name: "Archive Extractor", description: "Quickly archive extractor with our fast and secure online tool.", icon: <FileArchive className="w-5 h-5" />, href: "/converters/extractor" },
      { name: "HEIC to JPG", description: "Quickly heic to jpg with our fast and secure online tool.", icon: <ImageIcon className="w-5 h-5" />, href: "/image-tools/heic-to-jpg" },
      { name: "Bulk Compressor", description: "Quickly bulk compressor with our fast and secure online tool.", icon: <ImageIcon className="w-5 h-5" />, href: "/image-tools/bulk-compressor" },
    ]
  },
  {
    title: "AI Tools",
    tools: [
      { name: "Remove Background", description: "Instantly remove backgrounds from images using advanced AI algorithms.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/remove-background" },
      { name: "AI Image Generator", description: "Generate stunning images and art from text prompts using AI.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-image-generator" },
      { name: "AI Face Blur", description: "Leverage powerful AI to face blur automatically.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-face-blur" },
      { name: "AI Image Upscaler", description: "Leverage powerful AI to image upscaler automatically.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-image-upscaler" },
      { name: "AI Smart Crop", description: "Leverage powerful AI to smart crop automatically.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-smart-crop" },
      { name: "AI Image Editor", description: "Leverage powerful AI to image editor automatically.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-image-editor" },
      { name: "AI Grammar Checker", description: "Leverage powerful AI to grammar checker automatically.", icon: <Wand2 className="w-5 h-5" />, href: "/ai-tools/ai-grammar-checker" },
      { name: "AI PDF Chatbot", description: "Leverage powerful AI to pdf chatbot automatically.", icon: <Bot className="w-5 h-5" />, href: "/ai-tools/ai-pdf-chatbot" },
      { name: "AI Content Writer", description: "Leverage powerful AI to content writer automatically.", icon: <Type className="w-5 h-5" />, href: "/text-tools/ai-writer" },
      { name: "AI Ebook Generator", description: "Leverage powerful AI to ebook generator automatically.", icon: <BookOpen className="w-5 h-5" />, href: "/ai-tools/ai-ebook-generator" },
      { name: "AI YouTube Summarizer", description: "Leverage powerful AI to youtube summarizer automatically.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-youtube-summarizer" },
      { name: "AI YouTube Keyword Generator", description: "Generate SEO-optimized YouTube tags for your videos from a topic.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-youtube-keyword-generator" },
      { name: "AI Shorts Script Generator", description: "Generate viral, fast-paced scripts for YouTube Shorts and TikTok.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-shorts-script-generator" },
      { name: "AI Thumbnail Generator", description: "Generate high-CTR YouTube thumbnail concepts with visual descriptions.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-thumbnail-generator" },
      { name: "AI LinkedIn Post Generator", description: "Generate a viral LinkedIn text post and 5-slide carousel plan.", icon: <Briefcase className="w-5 h-5" />, href: "/ai-tools/ai-linkedin-post-generator" },
      { name: "AI Podcast Notes Generator", description: "Generate professional podcast show notes and timestamps.", icon: <Mic className="w-5 h-5" />, href: "/ai-tools/ai-podcast-notes-generator" },
      { name: "AI Viral Video Caption", description: "Generate viral captions and trending hashtags for Reels & TikTok.", icon: <Smartphone className="w-5 h-5" />, href: "/ai-tools/ai-video-caption-generator" },
      { name: "AI Text Humanizer", description: "Leverage powerful AI to text humanizer automatically.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-text-humanizer" },
      { name: "AI Resume Builder", description: "Leverage powerful AI to resume builder automatically.", icon: <FileBadge2 className="w-5 h-5" />, href: "/ai-tools/ai-resume-builder" },
    ]
  },
  {
    title: "Dev Tools",
    tools: [
      { name: "JSON Formatter", description: "Optimize and clean up your JSON code for better performance and readability.", icon: <Braces className="w-5 h-5" />, href: "/dev-tools/json-formatter" },
      { name: "JS Minifier", description: "Optimize and clean up your JS code for better performance and readability.", icon: <FileCode2 className="w-5 h-5" />, href: "/dev-tools/minify-js" },
      { name: "CSS Minifier", description: "Optimize and clean up your CSS code for better performance and readability.", icon: <FileCode2 className="w-5 h-5" />, href: "/dev-tools/minify-css" },
      { name: "HTML Formatter", description: "Optimize and clean up your HTML code for better performance and readability.", icon: <Code2 className="w-5 h-5" />, href: "/dev-tools/format-html" },
      { name: "Code to Image", description: "Quickly code to image with our fast and secure online tool.", icon: <Code2 className="w-5 h-5" />, href: "/dev-tools/code-to-image" },
    ]
  },
  {
    title: "Text Tools",
    tools: [
      { name: "Word Counter", description: "Quickly word counter with our fast and secure online tool.", icon: <Hash className="w-5 h-5" />, href: "/text-tools/word-counter" },
      { name: "Text Capitalizer", description: "Quickly text capitalizer with our fast and secure online tool.", icon: <ALargeSmall className="w-5 h-5" />, href: "/text-tools/text-capitalizer" },
      { name: "Slug Generator", description: "Quickly slug generator with our fast and secure online tool.", icon: <Link2 className="w-5 h-5" />, href: "/text-tools/slug-generator" },
      { name: "Image to Text", description: "Quickly image to text with our fast and secure online tool.", icon: <FileText className="w-5 h-5" />, href: "/text-tools/text-extractor" },
    ]
  },
  {
    title: "Color Tools",
    tools: [
      { name: "Color Picker", description: "Quickly color picker with our fast and secure online tool.", icon: <Pipette className="w-5 h-5" />, href: "/color-tools/color-picker" },
      { name: "Color Palette", description: "Quickly color palette with our fast and secure online tool.", icon: <Palette className="w-5 h-5" />, href: "/color-tools/color-palette" },
      { name: "Gradient Generator", description: "Quickly gradient generator with our fast and secure online tool.", icon: <Droplets className="w-5 h-5" />, href: "/color-tools/gradient-generator" },
    ]
  }
]


export const FOOTER_MENU: FooterSection[] = [
  {
    title: "Video Tools",
    items: [
      { label: "Trim Video", href: "/video-tools/trim" },
      { label: "Crop Video", href: "/video-tools/crop" },
      { label: "Change Speed", href: "/video-tools/speed" },
      { label: "Rotate Video", href: "/video-tools/rotate" },
      { label: "Add Text", href: "/video-tools/add-text" },
    ]
  },
  {
    title: "Downloaders",
    items: [
      { label: "YouTube Downloader", href: "/video-tools/youtube-downloader" },
      { label: "Instagram Downloader", href: "/video-tools/instagram-downloader" },
      { label: "X Downloader", href: "/video-tools/youtube-downloader" },
      { label: "Facebook Downloader", href: "/video-tools/youtube-downloader" },
      { label: "LinkedIn Downloader", href: "/video-tools/youtube-downloader" },
    ]
  },
  {
    title: "Audio Tools",
    items: [
      { label: "Trim Audio", href: "/audio-tools/trim" },
      { label: "Audio Joiner", href: "/audio-tools/joiner" },
      { label: "Change Pitch", href: "/audio-tools/pitch" },
      { label: "Audio Converter", href: "/converters/audio" },
    ]
  },
  {
    title: "PDF Tools",
    items: [
      { label: "Compress PDF", href: "/pdf-tools/compress-pdf" },
      { label: "Merge PDF", href: "/pdf-tools/merge-pdf" },
      { label: "Split PDF", href: "/pdf-tools/split-pdf" },
      { label: "Sign PDF", href: "/pdf-tools/sign-pdf" },
      { label: "Rotate PDF", href: "/pdf-tools/rotate-pdf" },
    ]
  },
  {
    title: "AI Tools",
    items: [
      { label: "Remove Background", href: "/ai-tools/remove-background" },
      { label: "AI Image Generator", href: "/ai-tools/ai-image-generator" },
      { label: "AI Image Editor", href: "/ai-tools/ai-image-editor" },
      { label: "AI Content Writer", href: "/text-tools/ai-writer" },
    ]
  },
  {
    title: "Resources",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "FAQs", href: "/faqs" },
      { label: "Help Center", href: "/help" },
    ]
  },
  {
    title: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Pricing", href: "/pricing" },
    ]
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms of Service", href: "/legal/terms-of-service" },
      { label: "Refund Policy", href: "/legal/refund-policy" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
      { label: "Disclaimer", href: "/legal/disclaimer" },
    ]
  },
]
