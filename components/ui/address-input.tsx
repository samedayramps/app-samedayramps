"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useGoogleMaps } from "@/components/providers"

declare global {
  interface Window {
    google: typeof google
  }
}

interface AddressInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  onAddressSelect?: (address: google.maps.places.PlaceResult) => void
  value?: string
}

export const AddressInput = React.forwardRef<HTMLInputElement, AddressInputProps>(
  ({ className, onAddressSelect, value: propValue, onChange, ...props }, ref) => {
    const [predictions, setPredictions] = React.useState<google.maps.places.AutocompletePrediction[]>([])
    const [inputValue, setInputValue] = React.useState(propValue || "")
    const [showPredictions, setShowPredictions] = React.useState(false)
    const { isLoaded } = useGoogleMaps()
    const autocompleteService = React.useRef<google.maps.places.AutocompleteService | null>(null)
    const placesService = React.useRef<google.maps.places.PlacesService | null>(null)
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (isLoaded && containerRef.current) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
        placesService.current = new window.google.maps.places.PlacesService(containerRef.current)
      }
    }, [isLoaded])

    React.useEffect(() => {
      if (propValue !== undefined) {
        setInputValue(propValue)
      }
    }, [propValue])

    // Handle clicking outside
    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setShowPredictions(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    const handleInputChange = React.useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputValue(newValue)
        setShowPredictions(true)

        // Create a new event with the updated value
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: newValue }
        }
        onChange?.(syntheticEvent)

        if (!newValue || !autocompleteService.current) {
          setPredictions([])
          return
        }

        try {
          const response = await autocompleteService.current.getPlacePredictions({
            input: newValue,
            componentRestrictions: { country: "us" },
            types: ["address"],
          })

          if (response && response.predictions) {
            setPredictions(response.predictions)
          } else {
            setPredictions([])
          }
        } catch (error) {
          console.error("Error fetching address predictions:", error)
          setPredictions([])
        }
      },
      [onChange]
    )

    const handleAddressSelect = React.useCallback(
      (prediction: google.maps.places.AutocompletePrediction) => {
        if (!placesService.current) return

        placesService.current.getDetails(
          {
            placeId: prediction.place_id,
            fields: ["formatted_address", "address_components", "geometry"],
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              const newValue = place.formatted_address || prediction.description
              setInputValue(newValue)
              setShowPredictions(false)
              setPredictions([])

              // Create a synthetic event for the onChange handler
              const syntheticEvent = {
                target: { value: newValue }
              } as React.ChangeEvent<HTMLInputElement>
              onChange?.(syntheticEvent)

              // Call the onAddressSelect callback
              onAddressSelect?.(place)
            }
          }
        )
      },
      [onChange, onAddressSelect]
    )

    return (
      <div className="relative" ref={wrapperRef}>
        <div ref={containerRef} className="hidden" />
        <Input
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
          className={cn("w-full", className)}
          disabled={!isLoaded}
          {...props}
        />
        {showPredictions && predictions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md max-h-[200px] overflow-auto">
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                onClick={() => handleAddressSelect(prediction)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                {prediction.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

AddressInput.displayName = "AddressInput" 