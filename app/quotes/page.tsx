import { Separator } from "@/components/ui/separator";
import { QuoteList } from "@/components/quotes/quote-list";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    include: {
      lead: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Quotes</h2>
          <p className="text-muted-foreground">
            View and manage all quotes
          </p>
        </div>
        <Button asChild>
          <Link href="/leads">
            <Plus className="mr-2 h-4 w-4" />
            New Quote
          </Link>
        </Button>
      </div>
      <Separator />
      <QuoteList quotes={quotes} />
    </div>
  );
} 