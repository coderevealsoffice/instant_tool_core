const fs = require('fs');

const path = 'src/lib/tools-registry.tsx';
let content = fs.readFileSync(path, 'utf8');

// The botched replacement content
const botchedContent = `import { ImageBackgroundRemoverCanvas } from "@/components/workspace/tools/image-background-remover-canvas"

// AI Tools
import { AiImageGeneratorCanvas } from "@/components/workspace/tools/generators/AiImageGeneratorCanvas"
import { AiGrammarCheckerCanvas } from "@/components/workspace/tools/text/AiGrammarCheckerCanvas"
import { AiPdfChatbotCanvas } from "@/components/workspace/tools/pdf/AiPdfChatbotCanvas"

// Generic placeholder component for tools we haven't built logic for yet
export function ComingSoonUploader({ toolName }: { toolName: string }) {
  return (
    <div className="relative rounded-xl border-4 border-dashed border-emerald-200 p-8 md:p-16 text-center text-white bg-white/5">
      <UploadCloud className="w-16 h-16 mb-6 mx-auto opacity-80 text-emerald-500" />
      <h3 className="text-2xl font-bold mb-4">{toolName}</h3>
      <p className="text-white/80 mb-8">This tool is currently under development (Phase 2-4).</p>
      <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold shadow-xl opacity-50 cursor-not-allowed">
        Coming Soon
      </button>
    </div>
  )
}

export const toolsRegistry: Record<string, Record<string, ToolConfig>> = {
  "video-tools": {
// ...
// ... skipped matching everything because I'll use multi_replace for accuracy.
// Wait, I can't just inject this if I don't know the exact lines. Let's do multi_replace.
  return (
    <div className="relative rounded-xl border-4 border-dashed border-white/30 p-8 md:p-16 text-center text-white bg-white/5">`;

const correctContent = `import { ImageBackgroundRemoverCanvas } from "@/components/workspace/tools/image-background-remover-canvas"

// AI Tools
import { AiImageGeneratorCanvas } from "@/components/workspace/tools/generators/AiImageGeneratorCanvas"
import { AiGrammarCheckerCanvas } from "@/components/workspace/tools/text/AiGrammarCheckerCanvas"
import { AiPdfChatbotCanvas } from "@/components/workspace/tools/pdf/AiPdfChatbotCanvas"

// Generic placeholder component for tools we haven't built logic for yet
export function ComingSoonUploader({ toolName }: { toolName: string }) {
  return (
    <div className="relative rounded-xl border-4 border-dashed border-emerald-200 p-8 md:p-16 text-center text-white bg-white/5">`;

content = content.replace(botchedContent, correctContent);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed tools-registry.tsx');
