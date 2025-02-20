import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PoolSeed } from '@/types'

interface PoolStore {
  poolSeeds: PoolSeed[]
  isLoading: boolean
  setPoolSeeds: (seeds: PoolSeed[]) => void
  setIsLoading: (loading: boolean) => void
}

export const usePoolStore = create<PoolStore>()(
  persist(
    (set) => ({
      poolSeeds: [],
      isLoading: false,
      setPoolSeeds: (seeds) => set({ poolSeeds: seeds }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'pool-store', // Key in sessionStorage
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key)
          return value ? JSON.parse(value) : null
        },
        setItem: (key, value) =>
          sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    },
  ),
)
