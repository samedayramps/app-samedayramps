'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import type { Lead, LeadStatus } from '@/types/lead'
import { revalidatePath } from 'next/cache'

export type State = {
  errors?: {
    customerInfo?: string[]
    rampDetails?: string[]
    installAddress?: string[]
    source?: string[]
    notes?: string[]
  }
  message?: string
}

const leadSchema = z.object({
  customerInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  rampDetails: z.object({
    knowRampLength: z.boolean(),
    rampLength: z.string().optional(),
    knowRentalDuration: z.boolean(),
    rentalDuration: z.string().optional(),
    installTimeframe: z.string().min(1, "Install timeframe is required"),
    mobilityAids: z.array(z.string()).default([]),
    otherAid: z.string().optional(),
  }),
  installAddress: z.string().min(1, "Install address is required"),
  source: z.string(),
  notes: z.string().optional(),
})

export async function createLead(prevState: State, formData: FormData) {
  const validatedFields = leadSchema.safeParse({
    customerInfo: {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    },
    rampDetails: {
      knowRampLength: formData.get('knowRampLength') === 'true',
      rampLength: formData.get('rampLength') || undefined,
      knowRentalDuration: formData.get('knowRentalDuration') === 'true',
      rentalDuration: formData.get('rentalDuration') || undefined,
      installTimeframe: formData.get('installTimeframe'),
      mobilityAids: formData.getAll('mobilityAids').filter(Boolean),
      otherAid: formData.get('otherAid') || undefined,
    },
    installAddress: formData.get('installAddress'),
    source: formData.get('source') || 'Manual Entry',
    notes: formData.get('notes') || undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        firstName: validatedFields.data.customerInfo.firstName,
        lastName: validatedFields.data.customerInfo.lastName,
        email: validatedFields.data.customerInfo.email,
        phone: validatedFields.data.customerInfo.phone,
        knowRampLength: validatedFields.data.rampDetails.knowRampLength,
        rampLength: validatedFields.data.rampDetails.rampLength,
        knowRentalDuration: validatedFields.data.rampDetails.knowRentalDuration,
        rentalDuration: validatedFields.data.rampDetails.rentalDuration,
        installTimeframe: validatedFields.data.rampDetails.installTimeframe,
        mobilityAids: validatedFields.data.rampDetails.mobilityAids,
        otherAid: validatedFields.data.rampDetails.otherAid,
        installAddress: validatedFields.data.installAddress,
        source: validatedFields.data.source,
        notes: validatedFields.data.notes,
      },
    })
    
    // Revalidate the leads pages
    revalidatePath('/leads')
    revalidatePath('/dashboard')
    
    return { message: 'Lead created successfully', lead }
  } catch {
    return { message: 'Failed to create lead' }
  }
}

export async function updateLeadStatus(
  prevState: State,
  formData: FormData
) {
  const id = formData.get('id') as string
  const newStatus = formData.get('status') as LeadStatus

  if (!id || !newStatus) {
    return { message: 'Invalid request' }
  }

  try {
    await prisma.lead.update({
      where: { id },
      data: { status: newStatus }
    })
    
    return { message: 'Status updated successfully' }
  } catch {
    return { message: 'Failed to update status' }
  }
}

export async function fetchLeadsOverview() {
  const [recentLeads, leadCounts] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.lead.groupBy({
      by: ['status'],
      _count: true,
    })
  ]) as [Lead[], Array<{ status: LeadStatus; _count: number }>];

  const statusCounts = Object.fromEntries(
    leadCounts.map(({ status, _count }) => [status, _count])
  ) as Record<LeadStatus, number>;

  return { recentLeads, statusCounts };
}

export async function deleteLead(id: string) {
  if (!id) {
    return { message: 'Invalid request' }
  }

  try {
    await prisma.lead.delete({
      where: { id }
    })
    
    // Revalidate the leads pages
    revalidatePath('/leads')
    revalidatePath('/dashboard')
    
    return { message: 'Lead deleted successfully' }
  } catch {
    return { message: 'Failed to delete lead' }
  }
}

export async function updateLead(id: string, formData: FormData) {
  if (!id) {
    return { message: 'Invalid request' }
  }

  const validatedFields = leadSchema.safeParse({
    customerInfo: {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    },
    rampDetails: {
      knowRampLength: formData.get('knowRampLength') === 'true',
      rampLength: formData.get('rampLength') || undefined,
      knowRentalDuration: formData.get('knowRentalDuration') === 'true',
      rentalDuration: formData.get('rentalDuration') || undefined,
      installTimeframe: formData.get('installTimeframe'),
      mobilityAids: formData.getAll('mobilityAids').filter(Boolean),
      otherAid: formData.get('otherAid') || undefined,
    },
    installAddress: formData.get('installAddress'),
    source: formData.get('source') || 'Manual Entry',
    notes: formData.get('notes') || undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.lead.update({
      where: { id },
      data: {
        firstName: validatedFields.data.customerInfo.firstName,
        lastName: validatedFields.data.customerInfo.lastName,
        email: validatedFields.data.customerInfo.email,
        phone: validatedFields.data.customerInfo.phone,
        knowRampLength: validatedFields.data.rampDetails.knowRampLength,
        rampLength: validatedFields.data.rampDetails.rampLength,
        knowRentalDuration: validatedFields.data.rampDetails.knowRentalDuration,
        rentalDuration: validatedFields.data.rampDetails.rentalDuration,
        installTimeframe: validatedFields.data.rampDetails.installTimeframe,
        mobilityAids: validatedFields.data.rampDetails.mobilityAids,
        otherAid: validatedFields.data.rampDetails.otherAid,
        installAddress: validatedFields.data.installAddress,
        source: validatedFields.data.source,
        notes: validatedFields.data.notes,
      },
    })
    
    // Revalidate the leads pages
    revalidatePath('/leads')
    revalidatePath('/dashboard')
    
    return { message: 'Lead updated successfully' }
  } catch {
    return { message: 'Failed to update lead' }
  }
}

export async function fetchLeadStats() {
  const [leads, statusCounts] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.lead.groupBy({
      by: ['status'],
      _count: true,
    })
  ]);

  const totalLeads = leads.length;
  const stats = {
    totalLeads,
    statusCounts: Object.fromEntries(
      statusCounts.map(({ status, _count }) => [status, _count])
    ) as Record<LeadStatus, number>
  };

  return { leads, stats };
} 