import type { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { userIsOwnerOrAdmin } from '../access/userIsOwnerOrAdmin'
import { recalculateCredScore } from '../utilities/recalculateCredScore'

const recalculateSpotCredScore: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (doc.spot) {
    await recalculateCredScore(doc.spot, req.payload)
  }
}

const recalculateSpotCredScoreAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (doc.spot) {
    await recalculateCredScore(doc.spot, req.payload)
  }
}

export const Likes: CollectionConfig = {
  slug: 'likes',
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
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'spot',
      type: 'relationship',
      relationTo: 'spots',
      required: true,
      index: true,
    },
  ],
}
