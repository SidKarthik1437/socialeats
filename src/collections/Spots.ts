import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { ownerOrAdmin } from '../access/ownerOrAdmin'

export const Spots: CollectionConfig = {
  slug: 'spots',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: ownerOrAdmin,
    delete: ownerOrAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'heroMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'galleryMedia',
      type: 'array',
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'menuMedia',
      type: 'array',
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      required: true,
      index: true,
    },
    {
      name: 'location',
      type: 'point',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'mustTryItem',
      type: 'text',
      required: true,
    },
    {
      name: 'credScore',
      type: 'number',
      defaultValue: 0,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
      defaultValue: ({ user }) => user.id,
    },
    {
      name: 'status',
      type: 'select',
      options: ['published', 'draft', 'archived'],
      defaultValue: 'published',
    },
  ],
}
