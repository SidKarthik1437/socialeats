'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl, { LngLatBounds, Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useSpotsByLocation } from '@/hooks/useSpotsByLocation'
import { Category, Spot } from '@/payload-types'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { SpotCard } from '../SpotCard'
import { useQuery } from '@tanstack/react-query'

if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  throw new Error('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set')
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const fetchSpotById = async (id: string) => {
  if (!id) return null
  const response = await fetch(`/api/spots/${id}?depth=1`)
  const data = await response.json()
  return data
}

export const InteractiveMap = ({ cityCoordinates }: { cityCoordinates: [number, number] }) => {
  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<{ [key: string]: Marker }>({})
  const [bounds, setBounds] = useState<LngLatBounds | null>(null)
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null)

  const { data: spots } = useSpotsByLocation(bounds)
  const { data: selectedSpot } = useQuery({
    queryKey: ['spot', selectedSpotId],
    queryFn: () => fetchSpotById(selectedSpotId as string),
    enabled: !!selectedSpotId,
  })

  useEffect(() => {
    if (map.current || !mapContainer.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // dark mode style
      center: cityCoordinates,
      zoom: 12,
    })

    map.current.on('load', () => {
      if (map.current) {
        setBounds(map.current.getBounds())
      }
    })

    map.current.on('moveend', () => {
      if (map.current) {
        setBounds(map.current.getBounds())
      }
    })

    // clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [cityCoordinates])

  // Update markers when spots change
  useEffect(() => {
    if (!map.current || !spots) return

    // Track which spots are currently on the map
    const activeSpotIds = new Set(spots.map((s: Spot) => s.id))

    // Remove markers that are no longer in the visible spots
    Object.keys(markersRef.current).forEach((id) => {
      if (!activeSpotIds.has(id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })

    // Add or update markers
    spots.forEach((spot: Spot) => {
      if (markersRef.current[spot.id]) return // already exists

      // Smart Category Logic
      let emoji = '📍' // Default
      if (spot.categories && Array.isArray(spot.categories) && spot.categories.length > 0) {
        // Filter out strings if mixed (shouldn't happen with depth=1 but good safety)
        const cats = spot.categories.filter((c): c is Category => typeof c !== 'string')

        // Sort by priority: Cuisine > Establishment > Vibe
        const sortedCats = cats.sort((a, b) => {
           const priority = { cuisine: 1, establishment: 2, vibe: 3 }
           const typeA = a.type || 'establishment'
           const typeB = b.type || 'establishment'
           return (priority[typeA] || 99) - (priority[typeB] || 99)
        })

        if (sortedCats.length > 0 && sortedCats[0].emoji) {
            emoji = sortedCats[0].emoji
        }
      }

      // Create Custom Marker Element
      const el = document.createElement('div')
      el.className = 'marker'
      el.innerHTML = `<div class="marker-emoji text-2xl">${emoji}</div>`

      // Dynamic Sizing & Pulsing based on Cred Score
      const credScore = spot.credScore || 0
      if (credScore > 80) {
          el.classList.add('hot-spot')
          el.style.fontSize = '2rem' // Larger for hot spots
          // Pulse animation via CSS (will add to global.css or inline style)
          el.innerHTML = `<div class="marker-emoji animate-pulse text-4xl shadow-orange-500 drop-shadow-lg">${emoji}</div>`
      } else {
          el.style.fontSize = '1.5rem'
      }

      el.style.cursor = 'pointer'
      el.addEventListener('click', () => {
        setSelectedSpotId(spot.id)
      })

      const marker = new mapboxgl.Marker(el)
        .setLngLat(spot.location)
        .addTo(map.current!)

      markersRef.current[spot.id] = marker
    })
  }, [spots])

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      <Sheet open={!!selectedSpot} onOpenChange={() => setSelectedSpotId(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-zinc-900 border-zinc-800 text-zinc-50 overflow-y-auto">
           {/* No Header here, SpotCard has its own structure, or we can wrap it */}
           {/* <SheetHeader>
            <SheetTitle>{selectedSpot?.name}</SheetTitle>
          </SheetHeader> */}
          {selectedSpot && <SpotCard spot={selectedSpot} />}
        </SheetContent>
      </Sheet>
    </>
  )
}
