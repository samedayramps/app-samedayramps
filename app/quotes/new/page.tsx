import { getBusinessSettings } from "@/app/actions/settings";
import { QuoteForm } from "@/components/quotes/quote-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface NewQuotePageProps {
  params: {
    leadId: string;
  };
}

export default async function NewQuotePage({ params: { leadId } }: NewQuotePageProps) {
  const [settings, lead] = await Promise.all([
    getBusinessSettings(),
    prisma.lead.findUnique({
      where: { id: leadId }
    })
  ]);

  if (!lead) {
    notFound();
  }

  return (
    <QuoteForm 
      lead={lead}
      settings={settings}
      onSuccess={() => {
        // handle success
      }}
    />
  );
} 