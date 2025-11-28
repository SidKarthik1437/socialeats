import { Spot } from '@/payload-types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Media } from '@/components/Media'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const SpotCard = ({ spot }: { spot: Spot }) => {
  const { name, heroMedia, credScore, createdBy } = spot

  // Assuming createdBy is populated with user data
  const author = createdBy as { displayName: string; profileImage: any }

  return (
    <Card className="w-full h-full bg-zinc-900 border-zinc-800 text-zinc-50 flex flex-col">
      <CardHeader className="p-4 flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={author?.profileImage?.url} alt={author?.displayName} />
          <AvatarFallback>{author?.displayName?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold">{author?.displayName}</p>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative flex-grow">
        {typeof heroMedia === 'object' && heroMedia !== null && (
            <Media
              resource={heroMedia}
              className="w-full h-full object-cover"
            />
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold">{name}</h3>
        <div className="text-lg font-bold text-orange-600">
          {credScore}
        </div>
      </CardFooter>
    </Card>
  )
}
