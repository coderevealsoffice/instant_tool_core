"use client"

import { useEffect } from "react"
import { useWorkspaceStore } from "@/store/workspace-store"
import { Plus } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableFileItem } from "./sortable-file-item"
import { useRouter } from "next/navigation"

export function PdfMergeCanvas() {
  const { files, reorderFiles } = useWorkspaceStore()
  const router = useRouter()

  // If no files, redirect back to upload page
  useEffect(() => {
    if (files.length === 0) {
      router.push("/pdf-tools/merge-pdf")
    }
  }, [files, router])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((item) => item.id === active.id)
      const newIndex = files.findIndex((item) => item.id === over.id)
      reorderFiles(oldIndex, newIndex)
    }
  }

  if (files.length === 0) return null

  return (
    <div className="flex h-full flex-col w-full overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full h-full">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Merge PDF Files</h2>
              <p className="text-sm text-slate-500">Drag and drop to reorder the pages before merging</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-500">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium">Select all</span>
            </label>
          </div>
        </div>


      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={files.map(f => f.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-6 items-start">
            {files.map((file) => (
              <SortableFileItem key={file.id} file={file} />
            ))}

            {/* Add More Placeholder */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center -ml-2 z-10 shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <label className="w-48 h-64 border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center p-4">
                <div className="w-8 h-8 rounded-full border border-blue-400 text-blue-500 flex items-center justify-center mb-4">
                  <Plus className="w-4 h-4" />
                </div>
                <p className="text-sm text-blue-600 font-medium">
                  Add <span className="font-bold">PDF, image, Word, Excel,</span> and <span className="font-bold">PowerPoint</span> files
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  accept=".pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                       const { addFiles } = useWorkspaceStore.getState()
                       addFiles(Array.from(e.target.files))
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </SortableContext>
      </DndContext>
      </div>
    </div>
  )
}
