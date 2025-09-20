'use client'

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useIdle } from 'react-use'
import { useRouter } from 'next/navigation'

interface IdleContextValue {
  isIdle: boolean
}

const IdleContext = createContext<IdleContextValue>({
  isIdle: false,
})

const IDLE_TIMEOUT_MS = 2 * 60 * 1000

export function IdleProvider({ children }: PropsWithChildren) {
  const router = useRouter()
  const isIdle = useIdle(IDLE_TIMEOUT_MS)
  const wasIdleRef = useRef(false)

  useEffect(() => {
    if (isIdle) {
      wasIdleRef.current = true
      return
    }

    if (wasIdleRef.current) {
      router.refresh()
      wasIdleRef.current = false
    }
  }, [isIdle, router])

  const value = useMemo(() => ({ isIdle }), [isIdle])

  return <IdleContext.Provider value={value}>{children}</IdleContext.Provider>
}

export function useIdleState() {
  return useContext(IdleContext)
}
