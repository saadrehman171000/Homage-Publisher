"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LoaderContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  hasLoadedOnce: boolean
}

const LoaderContext = createContext<LoaderContextType | null>(null)

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("homage-has-visited")
    
    if (!hasVisited) {
      // First time visitor - show loader
      setIsLoading(true)
      localStorage.setItem("homage-has-visited", "true")
    } else {
      // Returning visitor - skip loader
      setIsLoading(false)
      setHasLoadedOnce(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setHasLoadedOnce(true)
  }

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading, hasLoadedOnce }}>
      {children}
      {isLoading && <Loader onComplete={handleLoadingComplete} />}
    </LoaderContext.Provider>
  )
}

export function useLoader() {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return context
}

// Import the Loader component (using simple version for better compatibility)
import { SimpleLoader as Loader } from "@/components/ui/loader-simple"
