import { create } from 'zustand'

// Dynamic imports for idb-keyval to avoid SSR crashes
const setIDB = async (key: string, val: any) => {
  if (typeof window !== 'undefined') {
    const { set } = await import('idb-keyval')
    return set(key, val)
  }
}

const getIDB = async <T>(key: string): Promise<T | undefined> => {
  if (typeof window !== 'undefined') {
    const { get } = await import('idb-keyval')
    return get<T>(key)
  }
  return undefined
}

export interface WorkspaceFile {
  id: string
  file: File
  previewUrl?: string
  status: 'pending' | 'processing' | 'done' | 'error'
  pages?: number
}

interface WorkspaceState {
  category: string | null
  tool: string | null
  files: WorkspaceFile[]
  isHydrated: boolean
  toolParams: Record<string, any>
  
  setContext: (category: string, tool: string) => void
  addFiles: (newFiles: File[]) => void
  removeFile: (id: string) => void
  reorderFiles: (startIndex: number, endIndex: number) => void
  clearFiles: () => void
  updateFile: (id: string, updates: Partial<WorkspaceFile>) => void
  hydrate: () => Promise<void>
  setToolParam: (key: string, value: any) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set, getStore) => ({
  category: null,
  tool: null,
  files: [],
  isHydrated: false,
  toolParams: {},

  setToolParam: (key, value) => {
    set((state) => ({ toolParams: { ...state.toolParams, [key]: value } }))
  },

  setContext: (category, tool) => {
    set((state) => {
      // If we are switching to a completely different tool via sidebar navigation,
      // we should clear the old files so the user starts fresh.
      if (state.tool !== tool) {
        setIDB('workspace_files', [])
        return { category, tool, files: [], toolParams: {} }
      }
      return { category, tool }
    })
    setIDB('workspace_context', { category, tool })
  },
  
  addFiles: (newFiles) => {
    set((state) => {
      const workspaceFiles: WorkspaceFile[] = newFiles.map(file => ({
        id: Math.random().toString(36).substring(7) + Date.now(),
        file,
        status: 'pending'
      }))
      const newFilesArray = [...state.files, ...workspaceFiles]
      setIDB('workspace_files', newFilesArray)
      return { files: newFilesArray }
    })
  },

  removeFile: (id) => {
    set((state) => {
      const newFiles = state.files.filter(f => f.id !== id)
      setIDB('workspace_files', newFiles)
      return { files: newFiles }
    })
  },

  reorderFiles: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.files)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      setIDB('workspace_files', result)
      return { files: result }
    })
  },

  clearFiles: () => {
    set({ files: [] })
    setIDB('workspace_files', [])
  },

  updateFile: (id, updates) => {
    set((state) => {
      const newFiles = state.files.map(f => f.id === id ? { ...f, ...updates } : f)
      setIDB('workspace_files', newFiles)
      return { files: newFiles }
    })
  },

  hydrate: async () => {
    try {
      const savedFiles = await getIDB<WorkspaceFile[]>('workspace_files')
      const savedContext = await getIDB<{category: string, tool: string}>('workspace_context')
      
      set({ 
        files: savedFiles || [], 
        category: savedContext?.category || null,
        tool: savedContext?.tool || null,
        isHydrated: true 
      })
    } catch (e) {
      console.error("Failed to hydrate workspace from IndexedDB", e)
      set({ isHydrated: true })
    }
  }
}))
