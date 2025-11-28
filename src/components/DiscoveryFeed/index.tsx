'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Spot } from '@/payload-types'
import { useEffect } from 'react'
import { SpotCard } from '@/components/SpotCard'
import { useInView } from 'react-intersection-observer'

const fetchSpots = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, city] = queryKey
  const response = await fetch(`/api/spots?where[city][equals]=${city}&page=${pageParam}&limit=10&sort=-credScore&depth=1`)
  const data = await response.json()
  return data
}

export const DiscoveryFeed = ({ initialSpots, city }: { initialSpots: any, city: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['spots', city],
    queryFn: fetchSpots,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialData: { pages: [initialSpots], pageParams: [1] },
  })

  const spots = data?.pages.flatMap((page) => page.docs) || []

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-4">
       {/* Masonry Layout using CSS Columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        <AnimatePresence>
          {spots.map((spot: Spot) => (
            <motion.div
              key={spot.id}
              className="break-inside-avoid mb-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SpotCard spot={spot} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-20 w-full flex items-center justify-center text-zinc-500">
          {isFetchingNextPage && <span className="animate-pulse">Loading more spots...</span>}
      </div>
    </div>
  )
}
