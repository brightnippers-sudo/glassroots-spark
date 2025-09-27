import { create } from 'zustand'

interface DialogStore {
  isOpen: boolean
  type: 'register' | 'learn-more' | null
  openDialog: (type: 'register' | 'learn-more') => void
  closeDialog: () => void
}

export const useDialog = create<DialogStore>((set) => ({
  isOpen: false,
  type: null,
  openDialog: (type) => set({ isOpen: true, type }),
  closeDialog: () => set({ isOpen: false, type: null })
}))
