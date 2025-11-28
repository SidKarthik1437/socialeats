import {create} from 'zustand'

type FormState = {
  step: number
  name: string
  city: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  } | null
  address: string
  mustTryItem: string
  heroMedia: File | null
  galleryMedia: File[]
  menuMedia: File[]
  setStep: (step: number) => void
  setData: (data: Partial<FormState>) => void
  reset: () => void
}

export const useAddSpotFormStore = create<FormState>((set) => ({
  step: 1,
  name: '',
  city: '',
  location: null,
  address: '',
  mustTryItem: '',
  heroMedia: null,
  galleryMedia: [],
  menuMedia: [],
  setStep: (step) => set({ step }),
  setData: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set({
    step: 1,
    name: '',
    city: '',
    location: null,
    address: '',
    mustTryItem: '',
    heroMedia: null,
    galleryMedia: [],
    menuMedia: [],
  }),
}))
