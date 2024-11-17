'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendQuoteEmail } from '@/lib/email'

const quoteSchema = z.object({
  leadId: z.string(),
  rampLength: z.coerce.number().positive(),
  platforms: z.coerce.number().min(0),
  distance: z.coerce.number().positive({
    message: "Failed to calculate delivery distance. Please try again or contact support."
  }),
  price: z.coerce.number().positive(),
  notes: z.string().optional(),
  action: z.enum(['save', 'send']),
});

export type State = {
  errors?: {
    rampLength?: string[]
    platforms?: string[]
    distance?: string[]
    notes?: string[]
  }
  message?: string
}

export async function createQuote(prevState: State, formData: FormData) {
  const validatedFields = quoteSchema.safeParse({
    leadId: formData.get('leadId'),
    rampLength: formData.get('rampLength'),
    platforms: formData.get('platforms'),
    distance: formData.get('distance'),
    price: formData.get('price'),
    notes: formData.get('notes'),
    action: formData.get('action'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data',
    }
  }

  const { action, ...quoteData } = validatedFields.data;

  try {
    const quote = await prisma.$transaction(async (tx) => {
      const newQuote = await tx.quote.create({
        data: {
          ...quoteData,
          status: action === 'send' ? 'SENT' : 'DRAFT',
          sentAt: action === 'send' ? new Date() : null,
          expiresAt: action === 'send' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null, // 30 days
        },
        include: {
          lead: true,
        },
      });
      return newQuote;
    });

    if (action === 'send' && process.env.NODE_ENV === 'production') {
      await sendQuoteEmail(quote);
    }

    revalidatePath('/leads');
    return { message: `Quote ${action === 'send' ? 'sent' : 'saved'} successfully` };
  } catch (error) {
    console.error('Failed to create quote:', error);
    return { message: 'Failed to create quote' };
  }
}

export async function deleteQuote(id: string) {
  try {
    await prisma.quote.delete({
      where: { id },
    });

    revalidatePath('/quotes');
    return { message: 'Quote deleted successfully' };
  } catch (error) {
    console.error('Failed to delete quote:', error);
    return { error: 'Failed to delete quote' };
  }
}

export async function updateQuoteStatus(id: string, status: string) {
  try {
    await prisma.quote.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/quotes');
    return { message: 'Quote status updated successfully' };
  } catch (error) {
    console.error('Failed to update quote status:', error);
    return { error: 'Failed to update quote status' };
  }
} 