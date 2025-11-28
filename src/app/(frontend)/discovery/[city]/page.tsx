import { DiscoveryFeed } from '@/components/DiscoveryFeed'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

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
  })

  return <DiscoveryFeed initialSpots={initialSpots} city={city.id} />
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
