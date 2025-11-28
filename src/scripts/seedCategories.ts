import configPromise from '@payload-config'
import { getPayload } from 'payload'

const SEED_CATEGORIES = [
  { title: 'Tacos', type: 'cuisine', emoji: '🌮' },
  { title: 'Burgers', type: 'cuisine', emoji: '🍔' },
  { title: 'Pizza', type: 'cuisine', emoji: '🍕' },
  { title: 'Sushi', type: 'cuisine', emoji: '🍣' },
  { title: 'Indian', type: 'cuisine', emoji: '🍛' },
  { title: 'Cafe', type: 'establishment', emoji: '☕' },
  { title: 'Bar', type: 'establishment', emoji: '🍸' },
  { title: 'Street Food', type: 'establishment', emoji: '🚚' },
  { title: 'Fine Dining', type: 'establishment', emoji: '🍽️' },
  { title: 'Date Night', type: 'vibe', emoji: '🕯️' },
  { title: 'Trending', type: 'vibe', emoji: '🔥' },
  { title: 'Laptop Friendly', type: 'vibe', emoji: '💻' },
]

async function seed() {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Seeding categories...')

  for (const cat of SEED_CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: {
        title: {
          equals: cat.title,
        },
      },
    })

    if (existing.docs.length === 0) {
        await payload.create({
            collection: 'categories',
            data: {
              ...cat,
              slug: cat.title.toLowerCase().replace(/ /g, '-'),
            } as any,
        })
        payload.logger.info(`Created category: ${cat.title}`)
    } else {
        payload.logger.info(`Category already exists: ${cat.title}`)
    }
  }

  payload.logger.info('Done seeding categories.')
  process.exit(0)
}

seed()
