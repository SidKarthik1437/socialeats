import type { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { userIsOwnerOrAdmin } from '../access/userIsOwnerOrAdmin'
import { recalculateCredScore } from '../utilities/recalculateCredScore'

const setVerifiedTag: CollectionBeforeChangeHook = async ({ req, data }) => {
  if (data.user) {
    const user = await req.payload.findByID({
      collection: 'users',
      id: data.user,
    })
    if (user) {
      return { ...data, isVerifiedTag: user.isVerified ?? false }
    }
  }
  return { ...data, isVerifiedTag: false }
}

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

export const InfluencerTags: CollectionConfig = {
  slug: 'influencer-tags',
  access: {
    create: authenticated,
    read: anyone,
    update: userIsOwnerOrAdmin,
    delete: userIsOwnerOrAdmin,
  },
  hooks: {
    beforeChange: [setVerifiedTag],
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
    {
      name: 'isVerifiedTag',
      type: 'checkbox',
      admin: {
        hidden: true,
      },
    },
  ],
}
