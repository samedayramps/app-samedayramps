import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Quote, Lead } from "@prisma/client";

interface QuoteListProps {
  quotes: (Quote & {
    lead: Lead;
  })[];
}

export function QuoteList({ quotes }: QuoteListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Ramp Length</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell>
                {quote.lead.firstName} {quote.lead.lastName}
              </TableCell>
              <TableCell>{quote.rampLength} ft</TableCell>
              <TableCell>${quote.price.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    quote.status === "DRAFT"
                      ? "secondary"
                      : quote.status === "SENT"
                      ? "default"
                      : quote.status === "ACCEPTED"
                      ? "success"
                      : "destructive"
                  }
                >
                  {quote.status.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                {quote.expiresAt
                  ? formatDistanceToNow(new Date(quote.expiresAt), { addSuffix: true })
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" asChild>
                  <Link href={`/quotes/${quote.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {quotes.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No quotes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 