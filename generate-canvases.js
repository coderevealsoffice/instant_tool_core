const fs = require('fs');
const path = require('path');

const toolsToGenerate = [
  // Video
  { slug: 'screen-recorder', name: 'Screen Recorder Canvas', icon: 'Video', category: 'video-tools', color: 'bg-slate-700' },
  { slug: 'text-to-speech', name: 'Text To Speech Canvas', icon: 'MessageSquare', category: 'video-tools', color: 'bg-slate-700' },
  { slug: 'merge', name: 'Merge Video Canvas', icon: 'FileVideo', category: 'video-tools', color: 'bg-violet-600' },
  { slug: 'add-audio', name: 'Add Audio To Video Canvas', icon: 'Music', category: 'video-tools', color: 'bg-blue-600' },
  { slug: 'add-image', name: 'Add Image To Video Canvas', icon: 'Image', category: 'video-tools', color: 'bg-blue-600' },
  { slug: 'add-text', name: 'Add Text To Video Canvas', icon: 'Type', category: 'video-tools', color: 'bg-blue-600' },
  { slug: 'remove-logo', name: 'Remove Logo Canvas', icon: 'Eraser', category: 'video-tools', color: 'bg-slate-700' },
  { slug: 'resize', name: 'Resize Video Canvas', icon: 'Maximize', category: 'video-tools', color: 'bg-amber-600' },
  { slug: 'loop', name: 'Loop Video Canvas', icon: 'Repeat', category: 'video-tools', color: 'bg-cyan-600' },
  { slug: 'stabilize', name: 'Stabilize Video Canvas', icon: 'Activity', category: 'video-tools', color: 'bg-rose-600' },
  { slug: 'recorder', name: 'Video Recorder Canvas', icon: 'Video', category: 'video-tools', color: 'bg-red-600' },
  
  // Audio
  { slug: 'pitch', name: 'Change Pitch Canvas', icon: 'FileAudio', category: 'audio-tools', color: 'bg-teal-600' },
  { slug: 'equalizer', name: 'Audio Equalizer Canvas', icon: 'Sliders', category: 'audio-tools', color: 'bg-emerald-600' },
  { slug: 'reverse', name: 'Reverse Audio Canvas', icon: 'MoveRight', category: 'audio-tools', color: 'bg-orange-600' },
  { slug: 'voice-recorder', name: 'Voice Recorder Canvas', icon: 'Mic', category: 'audio-tools', color: 'bg-red-600' },
  { slug: 'joiner', name: 'Audio Joiner Canvas', icon: 'FileAudio', category: 'audio-tools', color: 'bg-blue-600' },
  
  // PDF
  { slug: 'unlock-pdf', name: 'Unlock Pdf Canvas', icon: 'Unlock', category: 'pdf-tools', color: 'bg-red-600' },
  { slug: 'protect-pdf', name: 'Protect Pdf Canvas', icon: 'Lock', category: 'pdf-tools', color: 'bg-red-600' },
  { slug: 'add-page-numbers', name: 'Add Page Numbers Canvas', icon: 'FileDigit', category: 'pdf-tools', color: 'bg-red-600' },
  { slug: 'pdf-to-word', name: 'Pdf To Word Canvas', icon: 'FileText', category: 'pdf-tools', color: 'bg-blue-600' },
  { slug: 'pdf-to-excel', name: 'Pdf To Excel Canvas', icon: 'FileText', category: 'pdf-tools', color: 'bg-green-600' },
  { slug: 'pdf-to-jpg', name: 'Pdf To Jpg Canvas', icon: 'Image', category: 'pdf-tools', color: 'bg-red-600' },
  { slug: 'pdf-to-png', name: 'Pdf To Png Canvas', icon: 'Image', category: 'pdf-tools', color: 'bg-red-600' },
  { slug: 'pdf-to-html', name: 'Pdf To Html Canvas', icon: 'FileText', category: 'pdf-tools', color: 'bg-orange-600' },
  { slug: 'word-to-pdf', name: 'Word To Pdf Canvas', icon: 'FileText', category: 'pdf-tools', color: 'bg-blue-600' },
  { slug: 'jpg-to-pdf', name: 'Jpg To Pdf Canvas', icon: 'Image', category: 'pdf-tools', color: 'bg-purple-600' },
  { slug: 'excel-to-pdf', name: 'Excel To Pdf Canvas', icon: 'FileText', category: 'pdf-tools', color: 'bg-green-600' },
  { slug: 'ppt-to-pdf', name: 'Ppt To Pdf Canvas', icon: 'FileText', category: 'pdf-tools', color: 'bg-orange-600' },
  { slug: 'png-to-pdf', name: 'Png To Pdf Canvas', icon: 'Image', category: 'pdf-tools', color: 'bg-pink-600' },

  // Converters
  { slug: 'video', name: 'Video Converter Canvas', icon: 'FileVideo', category: 'converters', color: 'bg-slate-700' },
  { slug: 'document', name: 'Document Converter Canvas', icon: 'FileText', category: 'converters', color: 'bg-blue-700' },
  { slug: 'font', name: 'Font Converter Canvas', icon: 'Type', category: 'converters', color: 'bg-violet-600' },
  { slug: 'archive', name: 'Archive Converter Canvas', icon: 'FileArchive', category: 'converters', color: 'bg-amber-600' },
  { slug: 'ebook', name: 'Ebook Converter Canvas', icon: 'BookOpen', category: 'converters', color: 'bg-teal-600' },
  { slug: 'extractor', name: 'Archive Extractor Canvas', icon: 'FileArchive', category: 'converters', color: 'bg-slate-600' },
];

const outDir = path.join(__dirname, 'src', 'components', 'workspace', 'tools');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const template = (name, icon, color) => `"use client"

import { useState, useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ${icon === 'Image' ? 'Image as ImageIcon' : icon}, CheckCircle, Loader2 } from "lucide-react"

export function ${name}() {
  const { files } = useWorkspaceStore()
  const [isReady, setIsReady] = useState(false)
  
  const activeFile = files?.[0]?.file ?? null

  useEffect(() => {
    // Simulate loading the specialized processing engine
    const t = setTimeout(() => setIsReady(true), 800)
    return () => clearTimeout(t)
  }, [])

  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <${icon === 'Image' ? 'ImageIcon' : icon} className="w-12 h-12 mb-4 opacity-50" />
        <p>No file selected. Please upload a file first.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-6">
      <div className="w-24 h-24 rounded-2xl ${color} flex items-center justify-center shadow-2xl mb-4">
        <${icon === 'Image' ? 'ImageIcon' : icon} className="w-12 h-12 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        File Ready for Processing
      </h2>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <${icon === 'Image' ? 'ImageIcon' : icon} className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="text-left truncate">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {activeFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(activeFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {isReady ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
          )}
        </div>
        
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-left">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Advanced processing controls will be available here soon. For now, you can click the <strong>Finish</strong> button in the top right to process your file using the default settings.
          </p>
        </div>
      </div>
    </div>
  )
}
`;

toolsToGenerate.forEach(tool => {
  const fileName = tool.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-') + '.tsx';
  const content = template(tool.name.replace(/\s+/g, ''), tool.icon, tool.color);
  fs.writeFileSync(path.join(outDir, fileName), content);
  console.log('Generated ' + fileName);
});

console.log('\n--- IMPORTS ---');
toolsToGenerate.forEach(tool => {
  const fileName = tool.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
  const compName = tool.name.replace(/\s+/g, '');
  console.log(`import { ${compName} } from "@/components/workspace/tools/${fileName}"`);
});

console.log('\n--- SWITCH CASES ---');
toolsToGenerate.forEach(tool => {
  const compName = tool.name.replace(/\s+/g, '');
  // For 'voice-recorder' the tool slug in audio-tools is just 'recorder'.
  // Same for video-recorder it is 'recorder'.
  // We need to differentiate them by category in the switch case, or just map them accurately.
  // Actually, wait, video-recorder is slug 'recorder' and category 'video-tools'.
  let slug = tool.slug;
  if (slug === 'voice-recorder') slug = 'recorder'; // handle in switch based on category
  console.log(`case "${tool.slug}": return <${compName} />`);
});
