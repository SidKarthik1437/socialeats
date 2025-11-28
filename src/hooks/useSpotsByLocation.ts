import { useQuery } from '@tanstack/react-query'
import { LngLatBounds } from 'mapbox-gl'

const fetchSpotsByLocation = async (bounds: LngLatBounds) => {
  if (!bounds) return null

  const response = await fetch(
    `/api/spots?where[location][within]=${JSON.stringify({
      type: 'Polygon',
      coordinates: [
        [
          bounds.getNorthWest().toArray(),
          bounds.getNorthEast().toArray(),
          bounds.getSouthEast().toArray(),
          bounds.getSouthWest().toArray(),
          bounds.getNorthWest().toArray(),
        ],
      ],
    })}&limit=1000&depth=1`, // Adjust limit as needed
  )
  const data = await response.json()
  return data.docs
}

export const useSpotsByLocation = (bounds: LngLatBounds | null) => {
  return useQuery({
    queryKey: ['spots', bounds?.toString()],
    queryFn: () => fetchSpotsByLocation(bounds as LngLatBounds),
    enabled: !!bounds,
  })
}
