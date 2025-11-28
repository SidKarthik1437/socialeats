import type { CollectionConfig } from 'payload'
import type { AfterChangeHook, AfterDeleteHook } from 'payload/dist/collections/config/types'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { userIsOwnerOrAdmin } from '../access/userIsOwnerOrAdmin'
import { recalculateCredScore } from '../utilities/recalculateCredScore'

const recalculateSpotCredScore: AfterChangeHook = async ({ doc, req }) => {
  if (doc.spot) {
    await recalculateCredScore(doc.spot, req.payload)
  }
}

const recalculateSpotCredScoreAfterDelete: AfterDeleteHook = async ({ doc, req }) => {
  if (doc.spot) {
    await recalculateCredScore(doc.spot, req.payload)
  }
}

export const Saves: CollectionConfig = {
  slug: 'saves',
  access: {
    create: authenticated,
    read: anyone,
    update: userIsOwnerOrAdmin,
    delete: userIsOwnerOrAdmin,
  },
  hooks: {
    afterChange: [recalculateSpotCredScore],
    afterDelete: [recalculateSpotCredScoreAfterDelete],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: {
        readOnly: true,
      },
      defaultValue: ({ user }) => user.id,
    },
    {
      name: 'spot',
      type: 'relationship',
      relationTo: 'spots',
      required: true,
      index: true,
    },
    {
      name: 'listName',
      type: 'text',
      defaultValue: 'Favorites',
    },
  ],
}
