'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const settingsSchema = z.object({
  warehouseAddress: z.string().min(1),
  baseDeliveryFee: z.coerce.number().min(0),
  deliveryFeePerMile: z.coerce.number().min(0),
  baseInstallFee: z.coerce.number().min(0),
  installFeePerComponent: z.coerce.number().min(0),
  rentalRatePerFt: z.coerce.number().min(0),
})

export type BusinessSettings = z.infer<typeof settingsSchema>

const DEFAULT_SETTINGS: BusinessSettings = {
  warehouseAddress: "6008 Windridge Ln, Flower Mound, TX 75028, USA",
  baseDeliveryFee: 50,
  deliveryFeePerMile: 4,
  baseInstallFee: 50,
  installFeePerComponent: 50,
  rentalRatePerFt: 11,
}

export async function getBusinessSettings() {
  try {
    let settings = await prisma.businessSettings.findFirst()
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.businessSettings.create({
        data: {
          ...DEFAULT_SETTINGS,
          id: 1
        }
      })
    }
    
    return settings
  } catch (error) {
    console.error('Failed to get business settings:', error)
    return DEFAULT_SETTINGS
  }
}

export async function updateBusinessSettings(formData: FormData) {
  try {
    const validatedFields = settingsSchema.safeParse({
      warehouseAddress: formData.get('warehouseAddress'),
      baseDeliveryFee: formData.get('baseDeliveryFee'),
      deliveryFeePerMile: formData.get('deliveryFeePerMile'),
      baseInstallFee: formData.get('baseInstallFee'),
      installFeePerComponent: formData.get('installFeePerComponent'),
      rentalRatePerFt: formData.get('rentalRatePerFt'),
    })

    if (!validatedFields.success) {
      console.error('Validation error:', validatedFields.error)
      return { error: 'Invalid form data' }
    }

    await prisma.businessSettings.upsert({
      where: { id: 1 },
      update: validatedFields.data,
      create: {
        ...validatedFields.data,
        id: 1
      },
    })

    revalidatePath('/settings')
    return { message: 'Settings updated successfully' }
  } catch (error) {
    console.error('Failed to update settings:', error)
    return { error: 'Failed to update settings' }
  }
} 