import React from "react"
import { 
  Video, Scissors, MonitorPlay, MessageSquare, PlusSquare, Image as ImageIcon, 
  Type, Eraser, Crop, RotateCw, FlipHorizontal, Maximize, Repeat, 
  Volume2, FastForward, Activity, Mic, Merge, MoveRight, Music, Sliders, AudioLines,
  FileText, Unlock, Lock, FilePlus2, FileDigit, ImageDown, ArrowRightLeft, FileArchive, BookOpen, Key,
  Palette, Pipette, Hash, ALargeSmall, Link2, Sparkles, Wand2, Bot, PenLine, FileBadge2, Braces,
  Code2, FileCode2, Droplets, Camera, Briefcase, Smartphone, ShieldCheck, Globe, FileCode, Search
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
  { label: "SEO Tools", href: "/seo-tools" },
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
    title: "SEO Tools",
    tools: [
      { name: "Plagiarism Checker", description: "Detect duplicate content, web clichés, and verify sentence-level uniqueness.", icon: <ShieldCheck className="w-5 h-5" />, href: "/seo-tools/plagiarism-checker" },
      { name: "AEO & GEO Content Auditor", description: "Optimize content to be cited by ChatGPT Search, Perplexity AI, and Google AI Overviews.", icon: <Bot className="w-5 h-5" />, href: "/seo-tools/geo-aeo-auditor" },
      { name: "SEO Meta Tag Generator", description: "Design meta tags with real-time Google search snippet and social card previews.", icon: <Globe className="w-5 h-5" />, href: "/seo-tools/meta-tag-generator" },
      { name: "Keyword Density Analyzer", description: "Analyze 1-word, 2-word, and 3-word phrase density and detect keyword stuffing.", icon: <Hash className="w-5 h-5" />, href: "/seo-tools/keyword-density-analyzer" },
      { name: "Schema Markup Generator", description: "Build structured JSON-LD data for Google Rich Snippets and FAQ dropdowns.", icon: <Code2 className="w-5 h-5" />, href: "/seo-tools/schema-generator" },
      { name: "Robots.txt & Sitemap Builder", description: "Generate and validate robots.txt rules for Googlebot, Bingbot, and AI crawlers.", icon: <FileCode className="w-5 h-5" />, href: "/seo-tools/robots-txt-generator" },
      { name: "Readability & SEO Score", description: "Calculate Flesch-Kincaid readability, Gunning Fog index, and sentence complexity.", icon: <BookOpen className="w-5 h-5" />, href: "/seo-tools/readability-checker" },
      { name: "AI Content Detector", description: "Copyleaks-grade AI detection for ChatGPT, Claude, Gemini, and DeepSeek.", icon: <Sparkles className="w-5 h-5" />, href: "/seo-tools/ai-detector" },
    ]
  },
  {
    title: "Video Tools",
    tools: [
      { name: "Video Editor", description: "Trim, splice, add music, and edit video clips with an intuitive browser timeline.", icon: <MonitorPlay className="w-5 h-5" />, href: "/video-tools/editor" },
      { name: "Screen Recorder", description: "Record your full screen, window, or Chrome tab with crystal-clear audio — no plugins needed.", icon: <Activity className="w-5 h-5" />, href: "/video-tools/screen-recorder" },
      { name: "Text to speech", description: "Convert scripts and articles into realistic, natural-sounding voiceovers in seconds.", icon: <MessageSquare className="w-5 h-5" />, href: "/video-tools/text-to-speech" },
      { name: "Merge Videos", description: "Combine multiple MP4, MOV, or WebM clips into a single seamless video.", icon: <PlusSquare className="w-5 h-5" />, href: "/video-tools/merge" },
      { name: "Trim Video", description: "Cut out unwanted pauses and scenes with millisecond-precision trimming controls.", icon: <Scissors className="w-5 h-5" />, href: "/video-tools/trim" },
      { name: "Add Audio to Video", description: "Layer background music, voiceovers, or sound effects onto any video file.", icon: <Music className="w-5 h-5" />, href: "/video-tools/add-audio" },
      { name: "Add Image to Video", description: "Place logos, watermarks, or photo overlays anywhere on your video timeline.", icon: <ImageIcon className="w-5 h-5" />, href: "/video-tools/add-image" },
      { name: "Add Text to Video", description: "Add dynamic captions, lower-thirds, or titles with custom fonts and colors.", icon: <Type className="w-5 h-5" />, href: "/video-tools/add-text" },
      { name: "Remove Logo from Video", description: "Erase watermarks, date stamps, or unwanted overlays cleanly.", icon: <Eraser className="w-5 h-5" />, href: "/video-tools/remove-logo" },
      { name: "Crop Video", description: "Reframe videos for Instagram Reels (9:16), YouTube (16:9), or square posts (1:1).", icon: <Crop className="w-5 h-5" />, href: "/video-tools/crop" },
      { name: "Rotate Video", description: "Fix sideways or upside-down mobile footage with 90°, 180°, and 270° rotation.", icon: <RotateCw className="w-5 h-5" />, href: "/video-tools/rotate" },
      { name: "Flip video", description: "Mirror video footage horizontally or vertically with one click.", icon: <FlipHorizontal className="w-5 h-5" />, href: "/video-tools/flip" },
      { name: "Resize Video", description: "Scale down video dimensions to reduce file size or match platform requirements.", icon: <Maximize className="w-5 h-5" />, href: "/video-tools/resize" },
      { name: "Loop Video", description: "Create endless repeating video loops for background banners and social media.", icon: <Repeat className="w-5 h-5" />, href: "/video-tools/loop" },
      { name: "Change Video Volume", description: "Boost quiet dialogue or normalize audio tracks up to 200% original volume.", icon: <Volume2 className="w-5 h-5" />, href: "/video-tools/volume" },
      { name: "Change Video Speed", description: "Speed up clips up to 4x for time-lapses or slow down for dramatic effect.", icon: <FastForward className="w-5 h-5" />, href: "/video-tools/speed" },
      { name: "Stabilize Video", description: "Smooth out shaky handheld camera movements automatically using gyro smoothing.", icon: <Activity className="w-5 h-5" />, href: "/video-tools/stabilize" },
      { name: "Video Recorder", description: "Capture high-definition video directly from your webcam with audio recording.", icon: <Video className="w-5 h-5" />, href: "/video-tools/recorder" },
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
      { name: "Trim Audio", description: "Cut MP3, WAV, and AAC audio files with sample-accurate waveforms.", icon: <Scissors className="w-5 h-5" />, href: "/audio-tools/trim" },
      { name: "Change Volume", description: "Amplify quiet audio recordings or reduce clipping distortion.", icon: <Volume2 className="w-5 h-5" />, href: "/audio-tools/volume" },
      { name: "Change Speed", description: "Speed up or slow down your audio or video files easily.", icon: <FastForward className="w-5 h-5" />, href: "/audio-tools/speed" },
      { name: "Change Pitch", description: "Transpose audio pitch up or down by semitones while preserving tempo.", icon: <AudioLines className="w-5 h-5" />, href: "/audio-tools/pitch" },
      { name: "Equalizer", description: "Fine-tune bass, mids, and treble frequencies with a multi-band audio EQ.", icon: <Sliders className="w-5 h-5" />, href: "/audio-tools/equalizer" },
      { name: "Reverse Audio", description: "Flip audio backwards for creative music production and sound design effects.", icon: <MoveRight className="w-5 h-5" />, href: "/audio-tools/reverse" },
      { name: "Voice Recorder", description: "Record high-fidelity voice memos and interviews right from your microphone.", icon: <Mic className="w-5 h-5" />, href: "/audio-tools/recorder" },
      { name: "Audio Joiner", description: "Merge multiple audio tracks into a single continuous MP3 or WAV file.", icon: <Merge className="w-5 h-5" />, href: "/audio-tools/joiner" },
    ]
  },
  {
    title: "PDF Tools",
    tools: [
      { name: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: <Scissors className="w-5 h-5" />, href: "/pdf-tools/split-pdf" },
      { name: "Merge PDF", description: "Combine PDFs in the order you want with the easiest PDF merger available.", icon: <PlusSquare className="w-5 h-5" />, href: "/pdf-tools/merge-pdf" },
      { name: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: <FileText className="w-5 h-5" />, href: "/pdf-tools/compress-pdf" },
      { name: "Sign PDF", description: "Draw, type, or upload your digital signature and place it securely on any contract.", icon: <PenLine className="w-5 h-5" />, href: "/pdf-tools/sign-pdf" },
      { name: "Unlock PDF", description: "Remove password restrictions and printing locks from PDF files you own.", icon: <Unlock className="w-5 h-5" />, href: "/pdf-tools/unlock-pdf" },
      { name: "Protect PDF", description: "Encrypt confidential documents with strong 256-bit AES password security.", icon: <Lock className="w-5 h-5" />, href: "/pdf-tools/protect-pdf" },
      { name: "Rotate PDF", description: "Permanently rotate individual or all pages to portrait or landscape orientation.", icon: <RotateCw className="w-5 h-5" />, href: "/pdf-tools/rotate-pdf" },
      { name: "Add Page Numbers", description: "Insert customizable headers, footers, and page numbers into multi-page PDFs.", icon: <FileDigit className="w-5 h-5" />, href: "/pdf-tools/add-page-numbers" },
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
      { name: "Audio Converter", description: "Convert between MP3, WAV, FLAC, AAC, OGG, and M4A formats instantly.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/audio" },
      { name: "Video Converter", description: "Transcode MP4, MKV, AVI, WebM, and MOV videos with customizable presets.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/video" },
      { name: "Image Converter", description: "Batch convert WebP, JPG, PNG, GIF, SVG, and AVIF images with zero quality loss.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/image" },
      { name: "Document Converter", description: "Convert between PDF, Word, EPUB, TXT, and RTF formats effortlessly.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/document" },
      { name: "Font Converter", description: "Convert web fonts between TTF, OTF, WOFF, and WOFF2 formats.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/font" },
      { name: "Archive Converter", description: "Convert ZIP, TAR, GZ, and 7Z archives without downloading third-party utilities.", icon: <ArrowRightLeft className="w-5 h-5" />, href: "/converters/archive" },
      { name: "Ebook Converter", description: "Convert EPUB, MOBI, AZW3, and PDF files for Kindle and e-readers.", icon: <BookOpen className="w-5 h-5" />, href: "/converters/ebook" },
      { name: "Archive Extractor", description: "Extract compressed ZIP, RAR, 7Z, and TAR archives directly in your browser.", icon: <FileArchive className="w-5 h-5" />, href: "/converters/extractor" },
      { name: "HEIC to JPG", description: "Convert modern iPhone HEIC photos to standard JPG format client-side with 100% privacy.", icon: <ImageIcon className="w-5 h-5" />, href: "/image-tools/heic-to-jpg" },
      { name: "Bulk Compressor", description: "Compress hundreds of images simultaneously with smart visual quality optimization.", icon: <ImageIcon className="w-5 h-5" />, href: "/image-tools/bulk-compressor" },
    ]
  },
  {
    title: "AI Tools",
    tools: [
      { name: "Remove Background", description: "Cut out image backgrounds automatically with hair-level edge precision.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/remove-background" },
      { name: "AI Image Generator", description: "Turn creative text prompts into photorealistic images and digital illustrations.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-image-generator" },
      { name: "AI Face Blur", description: "Detect and blur faces automatically in photos to safeguard privacy and identity.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-face-blur" },
      { name: "AI Image Upscaler", description: "Enlarge low-res photos up to 4x using deep learning super-resolution.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-image-upscaler" },
      { name: "AI Smart Crop", description: "Crop images intelligently focusing on subjects, faces, and points of interest.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-smart-crop" },
      { name: "AI Image Editor", description: "Enhance colors, adjust lighting, and apply creative filters powered by AI.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-image-editor" },
      { name: "AI Grammar Checker", description: "Fix grammar, typos, and improve sentence flow with real-time feedback.", icon: <Wand2 className="w-5 h-5" />, href: "/ai-tools/ai-grammar-checker" },
      { name: "AI PDF Chatbot", description: "Chat with your PDF documents, summarize key points, and find answers instantly.", icon: <Bot className="w-5 h-5" />, href: "/ai-tools/ai-pdf-chatbot" },
      { name: "AI Content Writer", description: "Draft blog posts, marketing copy, and email newsletters with human-like tone.", icon: <Type className="w-5 h-5" />, href: "/text-tools/ai-writer" },
      { name: "AI Ebook Generator", description: "Generate comprehensive ebook outlines, chapters, and introductions on any topic.", icon: <BookOpen className="w-5 h-5" />, href: "/ai-tools/ai-ebook-generator" },
      { name: "AI YouTube Summarizer", description: "Extract key takeaways, timestamps, and bullet points from any YouTube video.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-youtube-summarizer" },
      { name: "AI YouTube Keyword Generator", description: "Uncover high-volume, low-competition tags and video title keywords.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-youtube-keyword-generator" },
      { name: "AI Shorts Script Generator", description: "Write high-retention viral scripts for YouTube Shorts, Reels, and TikTok.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-shorts-script-generator" },
      { name: "AI Thumbnail Generator", description: "Brainstorm high-CTR thumbnail compositions with actionable visual prompts.", icon: <ImageIcon className="w-5 h-5" />, href: "/ai-tools/ai-thumbnail-generator" },
      { name: "AI LinkedIn Post Generator", description: "Create thought-leadership posts and 5-slide carousel breakdowns tailored for LinkedIn.", icon: <Briefcase className="w-5 h-5" />, href: "/ai-tools/ai-linkedin-post-generator" },
      { name: "AI Podcast Notes Generator", description: "Generate professional episode summaries, key quotes, and timestamped show notes.", icon: <Mic className="w-5 h-5" />, href: "/ai-tools/ai-podcast-notes-generator" },
      { name: "AI Viral Video Caption", description: "Generate scroll-stopping captions, punchy hooks, and trending hashtags.", icon: <Smartphone className="w-5 h-5" />, href: "/ai-tools/ai-video-caption-generator" },
      { name: "AI Text Humanizer", description: "Rewrite AI-generated drafts into natural, conversational, and authentic human text.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-text-humanizer" },
      { name: "AI Resume Builder", description: "Craft ATS-optimized resumes with tailored bullet points highlighting your achievements.", icon: <FileBadge2 className="w-5 h-5" />, href: "/ai-tools/ai-resume-builder" },
      { name: "AI Content Detector", description: "Copyleaks-grade AI detection for ChatGPT, Claude, Gemini, and DeepSeek.", icon: <Sparkles className="w-5 h-5" />, href: "/ai-tools/ai-detector" },
    ]
  },
  {
    title: "Dev Tools",
    tools: [
      { name: "JSON Formatter", description: "Optimize and clean up your JSON code for better performance and readability.", icon: <Braces className="w-5 h-5" />, href: "/dev-tools/json-formatter" },
      { name: "JS Minifier", description: "Optimize and clean up your JS code for better performance and readability.", icon: <FileCode2 className="w-5 h-5" />, href: "/dev-tools/minify-js" },
      { name: "CSS Minifier", description: "Optimize and clean up your CSS code for better performance and readability.", icon: <FileCode2 className="w-5 h-5" />, href: "/dev-tools/minify-css" },
      { name: "HTML Formatter", description: "Optimize and clean up your HTML code for better performance and readability.", icon: <Code2 className="w-5 h-5" />, href: "/dev-tools/format-html" },
      { name: "Code to Image", description: "Create beautiful, shareable screenshots of your code snippets with custom syntax themes.", icon: <Code2 className="w-5 h-5" />, href: "/dev-tools/code-to-image" },
    ]
  },
  {
    title: "Text Tools",
    tools: [
      { name: "Word Counter", description: "Count words, characters, sentences, reading time, and speaking time in real time.", icon: <Hash className="w-5 h-5" />, href: "/text-tools/word-counter" },
      { name: "Text Capitalizer", description: "Switch text between Title Case, UPPERCASE, lowercase, camelCase, and sentence case.", icon: <ALargeSmall className="w-5 h-5" />, href: "/text-tools/text-capitalizer" },
      { name: "Slug Generator", description: "Convert article titles and headlines into clean, SEO-friendly URL slugs.", icon: <Link2 className="w-5 h-5" />, href: "/text-tools/slug-generator" },
      { name: "Image to Text", description: "Extract text from photos, scans, and screenshots using optical character recognition (OCR).", icon: <FileText className="w-5 h-5" />, href: "/text-tools/text-extractor" },
    ]
  },
  {
    title: "Color Tools",
    tools: [
      { name: "Color Picker", description: "Inspect colors from the canvas, convert between HEX, RGB, HSL, and copy in one click.", icon: <Pipette className="w-5 h-5" />, href: "/color-tools/color-picker" },
      { name: "Color Palette", description: "Generate harmonious color palettes and export them for Tailwind CSS and design tokens.", icon: <Palette className="w-5 h-5" />, href: "/color-tools/color-palette" },
      { name: "Gradient Generator", description: "Design CSS linear and radial gradients with customizable color stops and code export.", icon: <Droplets className="w-5 h-5" />, href: "/color-tools/gradient-generator" },
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
    title: "SEO Tools",
    items: [
      { label: "Plagiarism Checker", href: "/seo-tools/plagiarism-checker" },
      { label: "AEO & GEO Auditor", href: "/seo-tools/geo-aeo-auditor" },
      { label: "Meta Tag Generator", href: "/seo-tools/meta-tag-generator" },
      { label: "Keyword Density", href: "/seo-tools/keyword-density-analyzer" },
      { label: "Schema Generator", href: "/seo-tools/schema-generator" },
      { label: "Robots.txt Builder", href: "/seo-tools/robots-txt-generator" },
      { label: "Readability Score", href: "/seo-tools/readability-checker" },
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
