'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapCarousel } from 'react-snap-carousel'
import { Spot } from '@/payload-types'
import { useEffect } from 'react'
import { SpotCard } from '@/components/SpotCard'

const fetchSpots = async ({ pageParam = 1, queryKey }) => {
  const [_key, city] = queryKey
  // NOTE: This assumes you have an API endpoint for spots that supports pagination and filtering by city.
  // You might need to adjust the URL based on your actual API structure.
  const response = await fetch(`/api/spots?where[city][equals]=${city}&page=${pageParam}&limit=10&sort=-credScore`)
  const data = await response.json()
  return data
}

export const DiscoveryFeed = ({ initialSpots, city }) => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['spots', city],
    queryFn: fetchSpots,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialData: { pages: [initialSpots], pageParams: [1] },
  })

  const spots = data?.pages.flatMap((page) => page.docs) || []

  const { scrollRef, activePageIndex } = useSnapCarousel()

  // Fetch more spots when the user is near the end of the list
  useEffect(() => {
    if (activePageIndex >= spots.length - 3 && hasNextPage) {
      fetchNextPage()
    }
  }, [activePageIndex, hasNextPage, fetchNextPage, spots.length])

  return (
    <div className="relative h-screen w-full overflow-hidden snap-y snap-mandatory">
      <ul ref={scrollRef} className="h-full w-full">
        <AnimatePresence>
          {spots.map((spot: Spot) => (
            <motion.li
              key={spot.id}
              className="h-full w-full flex items-center justify-center snap-start"
              initial={{ opacity: 0, y: 300 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -300 }}
              transition={{ duration: 0.5 }}
            >
              <SpotCard spot={spot} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
