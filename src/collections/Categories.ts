import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Cuisine', value: 'cuisine' },
        { label: 'Establishment', value: 'establishment' },
        { label: 'Vibe', value: 'vibe' },
      ],
      required: true,
      defaultValue: 'establishment',
    },
    {
      name: 'emoji',
      type: 'text',
    },
    slugField({
      position: undefined,
    }),
  ],
}
