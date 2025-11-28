'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, MapPin, Loader2, CheckCircle2 } from 'lucide-react'

// Mock categories for now
const CATEGORIES = [
  { id: '1', title: 'Tacos', emoji: '🌮' },
  { id: '2', title: 'Cafe', emoji: '☕' },
  { id: '3', title: 'Date Night', emoji: '🕯️' },
]

export default function AddSpotPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    image: null as File | null,
    preview: '',
    placeName: '',
    location: '',
    mustTry: '',
    tags: [] as string[],
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file),
      })
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setStep(4) // Success state
    setTimeout(() => {
        router.push('/')
    }, 2000)
  }

  // Step 1: Photo Upload
  if (step === 1) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Add a New Spot</h1>
        <p className="text-zinc-400 mb-8">Start by snapping a photo of the food or vibe.</p>

        <Label
            htmlFor="photo-upload"
            className="w-full max-w-sm aspect-[4/5] bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors"
        >
            <Camera className="w-16 h-16 text-zinc-500 mb-4" />
            <span className="text-zinc-300 font-medium">Tap to Snap</span>
        </Label>
        <Input
            id="photo-upload"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageChange}
        />
      </div>
    )
  }

  // Step 2: Details Form
  if (step === 2) {
      return (
          <div className="min-h-screen bg-zinc-950 p-6 pb-24">
              <h1 className="text-2xl font-bold mb-6">Tell us about it</h1>

              <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="w-full h-48 rounded-xl overflow-hidden relative">
                      <img src={formData.preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setStep(1)}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                      >
                          ✕
                      </button>
                  </div>

                  {/* Place Name (Mock Autocomplete) */}
                  <div className="space-y-2">
                      <Label htmlFor="place">Place Name</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                        <Input
                            id="place"
                            className="pl-10 bg-zinc-900 border-zinc-800"
                            placeholder="e.g. Tacos el Gordo"
                            value={formData.placeName}
                            onChange={(e) => setFormData({...formData, placeName: e.target.value})}
                        />
                      </div>
                  </div>

                  {/* Must Try Item */}
                  <div className="space-y-2">
                      <Label htmlFor="mustTry">The &quot;Must Try&quot; Item</Label>
                      <Input
                            id="mustTry"
                            className="bg-zinc-900 border-zinc-800"
                            placeholder="e.g. Al Pastor Tacos"
                            value={formData.mustTry}
                            onChange={(e) => setFormData({...formData, mustTry: e.target.value})}
                        />
                  </div>

                  {/* Vibe Tags */}
                  <div className="space-y-2">
                      <Label>Vibe Check</Label>
                      <div className="flex flex-wrap gap-2">
                          {CATEGORIES.map(cat => (
                              <button
                                key={cat.id}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                    formData.tags.includes(cat.id)
                                    ? 'bg-orange-500 border-orange-500 text-white'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                }`}
                                onClick={() => {
                                    if (formData.tags.includes(cat.id)) {
                                        setFormData({...formData, tags: formData.tags.filter(t => t !== cat.id)})
                                    } else {
                                        setFormData({...formData, tags: [...formData.tags, cat.id]})
                                    }
                                }}
                              >
                                  {cat.emoji} {cat.title}
                              </button>
                          ))}
                      </div>
                  </div>

                  <Button
                    className="w-full h-12 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white mt-8"
                    onClick={handleSubmit}
                    disabled={loading || !formData.placeName || !formData.mustTry}
                  >
                      {loading ? <Loader2 className="animate-spin" /> : "Post Spot"}
                  </Button>
              </div>
          </div>
      )
  }

  // Success Step
  if (step === 4) {
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
            <h2 className="text-3xl font-bold mb-2">Spot Added!</h2>
            <p className="text-zinc-400">Your contribution is boosting the cred score.</p>
        </div>
      )
  }

  return null
}
