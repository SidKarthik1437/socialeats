'use client'

import { Spot, Media as MediaType } from '@/payload-types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Media } from '@/components/Media'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { useSnapCarousel } from 'react-snap-carousel'
import { MapPin } from 'lucide-react'

// Simple Haversine distance hook/function
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

export const SpotCard = ({ spot }: { spot: Spot }) => {
  const { name, heroMedia, galleryMedia, credScore, createdBy, location } = spot
  const author = createdBy as { displayName: string; profileImage: any }

  // 1. Image Carousel Logic
  // Combine heroMedia and galleryMedia into one list
  const images = [
    heroMedia,
    ...(galleryMedia?.map(g => g.media).filter(Boolean) || [])
  ].filter((m): m is MediaType => typeof m === 'object' && m !== null)

  const { scrollRef, activePageIndex, goTo } = useSnapCarousel()

  // 2. Distance Logic
  const [distance, setDistance] = useState<string | null>(null)

  useEffect(() => {
    if ("geolocation" in navigator && location && location.length === 2) {
      navigator.geolocation.getCurrentPosition((position) => {
        const d = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          location[1], // Payload point is [lng, lat] usually?
          // Wait, GeoJSON is [lng, lat]. Let's verify.
          // Payload 'point' field stores as [lng, lat].
          // So location[1] is lat, location[0] is lng.
          location[0]
        )
        setDistance(d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`)
      }, (error) => {
          console.warn("Geolocation error:", error)
      })
    }
  }, [location])

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800 text-zinc-50 flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">

      {/* Header: Author Info */}
      <CardHeader className="p-3 flex-row items-center gap-3 border-b border-zinc-800/50">
        <Avatar className="h-8 w-8">
          <AvatarImage src={author?.profileImage?.url} alt={author?.displayName} />
          <AvatarFallback>{author?.displayName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-bold leading-none">{author?.displayName}</p>
        </div>
      </CardHeader>

      {/* Content: Image Carousel */}
      <CardContent className="p-0 relative aspect-[4/5] bg-zinc-950">
        <ul
          ref={scrollRef}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none' }} // Hide scrollbar Firefox
        >
          {images.map((img, i) => (
            <li key={img.id || i} className="flex-shrink-0 w-full h-full snap-start relative">
               <Media resource={img} className="w-full h-full object-cover" />
               {/* Gradient Overlay for text visibility if needed */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />
            </li>
          ))}
        </ul>

        {/* Carousel Indicators */}
        {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                    <button
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activePageIndex ? 'bg-white' : 'bg-white/40'}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>
        )}

        {/* Cred Score Badge (Overlaid on Image) */}
        <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-md px-2 py-1 rounded-md border border-orange-500/50">
             <span className="text-orange-500 font-bold text-lg">{credScore}</span>
             <span className="text-xs text-orange-200 ml-1">CRED</span>
        </div>
      </CardContent>

      {/* Footer: Details */}
      <CardFooter className="p-3 flex flex-col items-start gap-1">
        <div className="flex justify-between w-full items-center">
            <h3 className="text-lg font-bold truncate">{name}</h3>
            {distance && (
                <div className="flex items-center text-xs text-zinc-400 gap-1">
                    <MapPin size={12} />
                    <span>{distance}</span>
                </div>
            )}
        </div>

        {/* Vibe/Must Try info could go here */}
        {spot.mustTryItem && (
            <p className="text-xs text-zinc-400">
                <span className="text-orange-400">Must Try:</span> {spot.mustTryItem}
            </p>
        )}
      </CardFooter>
    </Card>
  )
}
