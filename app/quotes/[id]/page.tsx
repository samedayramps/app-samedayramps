import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { QuoteDetails } from "@/components/quotes/quote-details";

interface QuotePageProps {
  params: {
    id: string;
  };
}

export default async function QuotePage({ params: { id } }: QuotePageProps) {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      lead: true,
    },
  });

  if (!quote) {
    notFound();
  }

  return <QuoteDetails quote={quote} />;
} 