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
      name: 'pool-store',
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key)
          if (!value) return null

          // Parse with BigInt support
          return JSON.parse(value, (_, value) => {
            if (typeof value === 'string' && /^\d+n$/.test(value)) {
              return BigInt(value.slice(0, -1))
            }
            return value
          })
        },
        setItem: (key, value) => {
          // Stringify with BigInt support
          const serialized = JSON.stringify(value, (_, value) => {
            if (typeof value === 'bigint') {
              return value.toString() + 'n'
            }
            return value
          })
          sessionStorage.setItem(key, serialized)
        },
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    },
  ),
)
