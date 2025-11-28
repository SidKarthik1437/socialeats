import { DiscoveryFeed } from '@/components/DiscoveryFeed'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { Search } from 'lucide-react'

type Props = {
  params: Promise<{ city: string }>
}

export default async function DiscoveryPage({ params }: Props) {
  const { city: citySlug } = await params
  const payload = await getPayload({ config: configPromise })

  // Find the city to get its ID
  const cityResult = await payload.find({
    collection: 'cities',
    where: {
      slug: {
        equals: citySlug,
      },
    },
    limit: 1,
  })

  if (!cityResult.docs.length) {
    return notFound()
  }
  const city = cityResult.docs[0]

  // Fetch initial spots for the city
  const initialSpots = await payload.find({
    collection: 'spots',
    where: {
      city: {
        equals: city.id,
      },
    },
    limit: 10,
    sort: '-credScore',
    depth: 1,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Feed Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">
            {city.name}
        </h1>
        <button className="bg-zinc-900 p-2 rounded-full text-zinc-400 hover:text-white transition-colors">
            <Search size={20} />
        </button>
      </header>

      {/* Main Feed Content */}
      <div className="flex-1">
        <DiscoveryFeed initialSpots={initialSpots} city={city.id} />
      </div>

      {/* Bottom padding for Nav Bar */}
      <div className="h-20" />
    </div>
  )
}

// Generate static params for cities
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const cities = await payload.find({
    collection: 'cities',
    limit: 100,
  })

  return cities.docs.map(({ slug }) => ({
    city: slug,
  }))
}
