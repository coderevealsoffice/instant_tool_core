"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WorkspaceFile } from '@/store/workspace-store'
import { GripVertical, X } from 'lucide-react'
import { useWorkspaceStore } from '@/store/workspace-store'

export function SortableFileItem({ file }: { file: WorkspaceFile }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id })

  const { removeFile } = useWorkspaceStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  // Truncate filename nicely
  const ext = file.file.name.split('.').pop()
  const name = file.file.name.replace(`.${ext}`, '')
  const truncatedName = name.length > 20 ? name.substring(0, 10) + "..." + name.slice(-5) : name

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group w-48 flex flex-col items-center ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white" />
      </div>
      
      <button 
        onClick={() => removeFile(file.id)}
        className="absolute top-[-8px] right-[-8px] z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:scale-110 shadow-sm"
      >
        <X className="w-3 h-3" />
      </button>

      <div 
        {...attributes} 
        {...listeners}
        className="w-full h-64 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center relative overflow-hidden group-hover:ring-2 group-hover:ring-blue-500/50"
      >
        {/* Placeholder for PDF Thumbnail */}
        <div className="flex-1 flex flex-col items-center justify-center w-full p-4 relative">
           <div className="w-full h-full border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner relative">
              {file.previewUrl ? (
                <img src={file.previewUrl} className="w-full h-full object-contain" alt="" />
              ) : (
                <span className="text-xs uppercase font-bold text-slate-400">PDF PREVIEW</span>
              )}
           </div>
           
           <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
              1 page
           </div>
        </div>
      </div>

      {/* File name badge at bottom like screenshot */}
      <div className="mt-[-10px] z-10 bg-red-100 text-red-800 text-[10px] font-bold px-3 py-1 rounded-full truncate max-w-full border border-white shadow-sm" title={file.file.name}>
        {truncatedName}.{ext}
      </div>
    </div>
  )
}
