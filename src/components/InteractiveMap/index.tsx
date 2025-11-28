'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl, { LngLatBounds } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useSpotsByLocation } from '@/hooks/useSpotsByLocation'
import { Spot } from '@/payload-types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SpotCard } from '../SpotCard'
import { useQuery } from '@tanstack/react-query'

// IMPORTANT: You need to add your Mapbox access token to your .env file
// You can get one from https://www.mapbox.com/
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

export const InteractiveMap = ({ cityCoordinates }) => {
  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [bounds, setBounds] = useState<LngLatBounds | null>(null)
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null)

  const { data: spots } = useSpotsByLocation(bounds)
  const { data: selectedSpot } = useQuery({
    queryKey: ['spot', selectedSpotId],
    queryFn: () => fetchSpotById(selectedSpotId),
    enabled: !!selectedSpotId,
  })

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // dark mode style
      center: cityCoordinates,
      zoom: 12,
    })

    map.current.on('load', () => {
      setBounds(map.current.getBounds())

      map.current.addSource('spots', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // ... (layers)

      map.current.on('click', 'unclustered-point', (e) => {
        const feature = e.features && e.features[0]
        if (feature) {
          setSelectedSpotId(feature.properties.id)
        }
      })

      map.current.on('mouseenter', 'unclustered-point', () => {
        map.current.getCanvas().style.cursor = 'pointer'
      })

      map.current.on('mouseleave', 'unclustered-point', () => {
        map.current.getCanvas().style.cursor = ''
      })
    })

    map.current.on('moveend', () => {
      setBounds(map.current.getBounds())
    })

    // clean up on unmount
    return () => map.current.remove()
  }, [cityCoordinates])

  useEffect(() => {
    if (!map.current || !spots) return

    const source = map.current.getSource('spots') as mapboxgl.GeoJSONSource
    if (source) {
      const features = spots.map((spot: Spot) => ({
        type: 'Feature',
        properties: {
          id: spot.id,
          credScore: spot.credScore,
        },
        geometry: {
          type: 'Point',
          coordinates: spot.location.coordinates,
        },
      }))

      source.setData({
        type: 'FeatureCollection',
        features,
      })
    }
  }, [spots])

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      <Sheet open={!!selectedSpot} onOpenChange={() => setSelectedSpotId(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-zinc-900 border-zinc-800 text-zinc-50">
          <SheetHeader>
            <SheetTitle>{selectedSpot?.name}</SheetTitle>
          </SheetHeader>
          {selectedSpot && <SpotCard spot={selectedSpot} />}
        </SheetContent>
      </Sheet>
    </>
  )
}
