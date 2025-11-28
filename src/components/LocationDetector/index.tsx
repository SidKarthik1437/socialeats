'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Loader2 } from 'lucide-react'
import { City } from '@/payload-types'

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const LocationDetector = ({ cities }: { cities: City[] }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDetect = () => {
    setLoading(true)
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        // Find nearest city
        let nearestCity: City | null = null
        let minDistance = Infinity

        cities.forEach(city => {
          if (city.coordinates && city.coordinates.length === 2) {
             // coordinates are [lng, lat] in Payload
             const dist = calculateDistance(latitude, longitude, city.coordinates[1], city.coordinates[0])
             if (dist < minDistance) {
                 minDistance = dist
                 nearestCity = city
             }
          }
        })

        if (nearestCity && minDistance < 100) { // e.g., within 100km
            router.push(`/discovery/${(nearestCity as City).slug}`)
        } else {
            alert("No supported cities found near you. Please select one manually.")
            setLoading(false)
        }
      },
      (error) => {
        console.error(error)
        alert("Unable to retrieve your location")
        setLoading(false)
      }
    )
  }

  return (
    <Button
        className="w-full h-14 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2"
        onClick={handleDetect}
        disabled={loading}
    >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
        {loading ? "Locating..." : "Use My Current Location"}
    </Button>
  )
}
