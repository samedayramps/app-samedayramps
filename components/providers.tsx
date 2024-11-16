"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface GoogleMapsContextType {
  isLoaded: boolean
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
})

export function useGoogleMaps() {
  return useContext(GoogleMapsContext)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (typeof window !== "undefined" && window.google?.maps) {
        setIsGoogleMapsLoaded(true)
      }
    }

    // Check immediately
    checkGoogleMaps()

    // Set up an observer for script load
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          checkGoogleMaps()
        }
      })
    })

    observer.observe(document.head, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  return (
    <GoogleMapsContext.Provider value={{ isLoaded: isGoogleMapsLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  )
} 