'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map as MapIcon, PlusSquare, Heart, User } from 'lucide-react'
import { cn } from '@/utilities/ui'

export const BottomNav = () => {
  const pathname = usePathname()

  // Hide bottom nav on specific pages if needed (e.g., login, landing if desired)
  if (pathname === '/') return null

  // Extract city from path if possible to keep context
  // Expected path format: /discovery/[city], /map/[city], /add, /saved, /profile
  const pathSegments = pathname.split('/')
  const currentCity = pathSegments[2] || 'san-francisco' // Fallback or handle context better

  const navItems = [
    {
      label: 'Discover',
      href: `/discovery/${currentCity}`,
      icon: Home,
      isActive: pathname.includes('/discovery'),
    },
    {
      label: 'Map',
      href: `/map/${currentCity}`,
      icon: MapIcon,
      isActive: pathname.includes('/map'),
    },
    {
      label: 'Add',
      href: '/add',
      icon: PlusSquare,
      isActive: pathname === '/add',
    },
    {
      label: 'Saved',
      href: '/saved',
      icon: Heart,
      isActive: pathname === '/saved',
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: User,
      isActive: pathname === '/profile',
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-50 safe-area-bottom pb-1">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.label} className="flex-1">
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full w-full gap-1 transition-colors",
                item.isActive ? "text-orange-500" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <item.icon size={24} strokeWidth={item.isActive ? 2.5 : 2} />
              {/* Optional: Hide labels on very small screens or keep them for clarity */}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
