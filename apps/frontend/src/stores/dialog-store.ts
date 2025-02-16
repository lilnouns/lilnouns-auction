import { create } from 'zustand'

type DialogState = {
  openDialogs: Record<string, boolean>
  openDialog: (name: string) => void
  closeDialog: (name: string) => void
}

export const useDialogStore = create<DialogState>((set) => ({
  openDialogs: {},

  openDialog: (name) =>
    set((state) => ({
      openDialogs: { ...state.openDialogs, [name]: true },
    })),

  closeDialog: (name) =>
    set((state) => ({
      openDialogs: { ...state.openDialogs, [name]: false },
    })),
}))
