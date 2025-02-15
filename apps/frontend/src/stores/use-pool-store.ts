import { create } from 'zustand'
import { PoolSeed } from '@/types'

interface PoolStore {
  poolSeeds: PoolSeed[]
  isLoading: boolean
  setPoolSeeds: (seeds: PoolSeed[]) => void
  setIsLoading: (loading: boolean) => void
}

export const usePoolStore = create<PoolStore>((set) => ({
  poolSeeds: [],
  isLoading: false,
  setPoolSeeds: (seeds) => set({ poolSeeds: seeds }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
