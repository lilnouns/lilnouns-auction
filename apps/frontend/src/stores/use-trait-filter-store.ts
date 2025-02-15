import { create } from 'zustand'

export type TraitFilter = {
  background?: string[]
  body?: string[]
  accessory?: string[]
  head?: string[]
  glasses?: string[]
}

interface TraitFilterState {
  traitFilter: TraitFilter
  setTraitFilter: (key: keyof TraitFilter, value: string[] | undefined) => void
}

export const useTraitFilterStore = create<TraitFilterState>((set) => ({
  traitFilter: {},
  setTraitFilter: (key, value) =>
    set((state) => ({
      traitFilter: {
        ...state.traitFilter,
        [key]: value,
      },
    })),
}))
