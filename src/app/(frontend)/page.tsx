import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { LocationDetector } from '@/components/LocationDetector'

export default async function LandingPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch available cities
  const cities = await payload.find({
    collection: 'cities',
    sort: 'name',
    limit: 100,
  })

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 text-center">

      {/* Brand / Logo Area */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2">
          Social<span className="text-orange-500">Eats</span>
        </h1>
        <p className="text-zinc-400 text-lg">Where should we eat?</p>
      </div>

      {/* Main Action: Detect Location */}
      <div className="w-full max-w-sm space-y-4 mb-12">
         <LocationDetector cities={cities.docs} />
         <p className="text-zinc-500 text-sm">or choose a city below</p>
      </div>

      {/* City List */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-3">
        {cities.docs.map((city) => (
          <Link
            key={city.id}
            href={`/discovery/${city.slug}`}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <span className="text-2xl">🏙️</span>
            <span className="font-bold text-zinc-300 group-hover:text-white">{city.name}</span>
          </Link>
        ))}

        {/* Fallback if no cities seeded yet */}
        {cities.docs.length === 0 && (
             <Link
                href="/discovery/san-francisco"
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl p-4 transition-all col-span-2"
             >
                <span className="font-bold">San Francisco (Demo)</span>
             </Link>
        )}
      </div>

      <footer className="mt-auto pt-12 text-zinc-600 text-xs">
        © {new Date().getFullYear()} SocialEats. Street-Luxe Dining.
      </footer>
    </div>
  )
}
