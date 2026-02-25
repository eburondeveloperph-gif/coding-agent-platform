'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { Connector } from '@/lib/db/schema'
import { useAtomValue } from 'jotai'
import { sessionAtom, sessionInitializedAtom } from '@/lib/atoms/session'

interface ConnectorsContextType {
  connectors: Connector[]
  refreshConnectors: () => Promise<void>
  isLoading: boolean
}

const ConnectorsContext = createContext<ConnectorsContextType | undefined>(undefined)

export const useConnectors = () => {
  const context = useContext(ConnectorsContext)
  if (!context) {
    throw new Error('useConnectors must be used within ConnectorsProvider')
  }
  return context
}

interface ConnectorsProviderProps {
  children: React.ReactNode
}

export function ConnectorsProvider({ children }: ConnectorsProviderProps) {
  const session = useAtomValue(sessionAtom)
  const sessionInitialized = useAtomValue(sessionInitializedAtom)
  const [connectors, setConnectors] = useState<Connector[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchConnectors = useCallback(async () => {
    if (!sessionInitialized) {
      return
    }

    if (!session?.user?.id) {
      setConnectors([])
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/connectors')
      if (response.ok) {
        const data = await response.json()
        setConnectors(data.data || [])
      } else if (response.status === 401) {
        // Session expired - treat as signed out.
        setConnectors([])
      }
    } catch (error) {
      console.error('Error fetching connectors:', error)
    } finally {
      setIsLoading(false)
    }
  }, [sessionInitialized, session?.user?.id])

  useEffect(() => {
    fetchConnectors()
  }, [fetchConnectors])

  const refreshConnectors = useCallback(async () => {
    await fetchConnectors()
  }, [fetchConnectors])

  return (
    <ConnectorsContext.Provider
      value={{
        connectors,
        refreshConnectors,
        isLoading,
      }}
    >
      {children}
    </ConnectorsContext.Provider>
  )
}
