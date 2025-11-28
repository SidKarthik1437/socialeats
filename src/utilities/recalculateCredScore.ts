import { Payload } from 'payload'

export async function recalculateCredScore(spotId: string, payload: Payload): Promise<void> {
  try {
    // --- 1. Fetch all related documents ---
    const [likes, saves, comments, influencerTags] = await Promise.all([
      payload.find({
        collection: 'likes',
        where: { spot: { equals: spotId } },
        limit: 1000, // Adjust limit as needed
      }),
      payload.find({
        collection: 'saves',
        where: { spot: { equals: spotId } },
        limit: 1000, // Adjust limit as needed
      }),
      payload.find({
        collection: 'comments',
        where: { spot: { equals: spotId } },
        limit: 1000, // Adjust limit as needed
      }),
      payload.find({
        collection: 'influencer-tags',
        where: { spot: { equals: spotId } },
        limit: 1000, // Adjust limit as needed
      }),
    ])

    // --- 2. Calculate score components ---
    // recentLikes: Likes in the last 7 days.
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentLikes = likes.docs.filter(like => new Date(like.createdAt) > sevenDaysAgo).length

    const verifiedTags = influencerTags.docs.filter(tag => tag.isVerifiedTag).length
    const savesCount = saves.totalDocs
    const commentsCount = comments.totalDocs

    // --- 3. Calculate the final CredScore ---
    const credScore =
      verifiedTags * 50 + savesCount * 5 + recentLikes * 1 + commentsCount * 2

    // --- 4. Update the Spot document ---
    await payload.update({
      collection: 'spots',
      id: spotId,
      data: {
        credScore,
      },
    })

    payload.logger.info(`Successfully recalculated CredScore for Spot ID ${spotId}. New score: ${credScore}`)
  } catch (error: unknown) {
    payload.logger.error(`Error recalculating CredScore for Spot ID ${spotId}: ${(error as Error).message}`)
  }
}
