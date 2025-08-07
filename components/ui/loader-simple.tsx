"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SimpleLoaderProps {
  onComplete?: () => void
  duration?: number // in milliseconds
}

export function SimpleLoader({ onComplete, duration = 3000 }: SimpleLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const startTime = Date.now()

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      
      setProgress(Math.floor(newProgress))

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress)
      } else {
        // Add a small delay before hiding the loader
        setTimeout(() => {
          setIsVisible(false)
          setTimeout(() => {
            onComplete?.()
          }, 500) // Wait for exit animation
        }, 200)
      }
    }

    requestAnimationFrame(updateProgress)
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 animate-fade-in">
      <div className="text-center">
        {/* Logo Container */}
        <div className="mb-8 animate-scale-in">
          <div className="relative w-32 h-32 mx-auto mb-6 animate-bounce-slow">
            <Image
              src="/images/homage-logo-01.png"
              alt="Homage Educational Publishers"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Company Name */}
          <h1 className="text-3xl font-bold text-white mb-2 animate-slide-up">
            HOMAGE PUBLISHERS
          </h1>
          
          <p className="text-white/80 text-lg animate-slide-up-delayed">
            Educational Excellence Delivered
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-4 animate-fade-in-delayed">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Progress Text */}
        <div className="text-white/90 font-medium animate-fade-in-delayed">
          Loading... {progress}%
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-1 mt-4 animate-fade-in-delayed">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-8 h-8 bg-red-500/20 rounded-full animate-float-1"></div>
          <div className="absolute bottom-20 right-10 w-6 h-6 bg-red-500/20 rounded-full animate-float-2"></div>
          <div className="absolute top-1/2 right-20 w-4 h-4 bg-red-500/20 rounded-full animate-float-3"></div>
        </div>
      </div>
    </div>
  )
}
