'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAddSpotFormStore } from '@/store/addSpotForm'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


const Step1 = () => <div>Step 1: Basic Info</div>
const Step2 = () => {
  const { location, address, setData, setStep } = useAddSpotFormStore()

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setData({
        location: {
          type: 'Point',
          coordinates: [position.coords.longitude, position.coords.latitude],
        },
      })
    })
  }

  const handleNext = () => {
    if (location) {
      setStep(3)
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">
          Address
        </Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setData({ address: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Location</Label>
        <div className="col-span-3 flex items-center gap-2">
          <Button variant="outline" onClick={handleGetLocation}>
            Get Current Location
          </Button>
          {location && (
            <span className="text-sm text-gray-500">
              {location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}
import imageCompression from 'browser-image-compression'

const ImageUpload = ({
  label,
  multiple,
  onChange,
}: {
  label: string
  multiple?: boolean
  onChange: (files: File[]) => void
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    const compressedFiles = await Promise.all(
      files.map((file) => imageCompression(file, options)),
    )

    onChange(compressedFiles)
  }

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={label} className="text-right">
        {label}
      </Label>
      <Input
        id={label}
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleFileChange}
        className="col-span-3"
      />
    </div>
  )
}

const Step3 = () => {
  const { setData, setStep, ...formData } = useAddSpotFormStore()

  const handleSubmit = async () => {
    // TODO: Implement the full submission logic
    // 1. Upload media files and get their IDs
    // 2. Create the spot with the media IDs
    console.log('Submitting:', formData)
    alert('Spot submitted! (Check console for data)')
    useAddSpotFormStore.getState().reset()
  }

  return (
    <div className="grid gap-4 py-4">
      <ImageUpload
        label="Hero Image"
        onChange={(files) => setData({ heroMedia: files[0] })}
      />
      <ImageUpload
        label="Gallery Images"
        multiple
        onChange={(files) => setData({ galleryMedia: files })}
      />
      <ImageUpload
        label="Menu Images"
        multiple
        onChange={(files) => setData({ menuMedia: files })}
      />
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  )
}

export const AddSpotForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { step, reset } = useAddSpotFormStore()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    setIsOpen(open)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />
      case 2:
        return <Step2 />
      case 3:
        return <Step3 />
      default:
        return <Step1 />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add a Spot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-zinc-50">
        <DialogHeader>
          <DialogTitle>Add a new spot</DialogTitle>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  )
}
