"use client"

import Script from "next/script"
import { useCallback } from "react"

export function GoogleMapsScript() {
  const handleLoad = useCallback(() => {
    console.log('Google Maps script loaded')
  }, [])

  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  )
} 