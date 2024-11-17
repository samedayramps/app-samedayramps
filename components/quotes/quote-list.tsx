"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Quote, Lead } from "@prisma/client";
import { MoreHorizontal, Pencil, Trash2, Send } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteQuote, updateQuoteStatus } from "@/app/actions/quotes";
import { useToast } from "@/components/ui/use-toast";
import { sendQuoteEmail } from "@/lib/email";

interface QuoteListProps {
  quotes: (Quote & {
    lead: Lead;
  })[];
}

export function QuoteList({ quotes }: QuoteListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedQuote, setSelectedQuote] = useState<Quote & { lead: Lead } | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const result = await deleteQuote(id);
    if (result.message) {
      toast({
        title: "Success",
        description: result.message,
      });
      setIsDeleteOpen(false);
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleResend = async (quote: Quote & { lead: Lead }) => {
    try {
      const result = await sendQuoteEmail(quote);
      
      if (result.success) {
        await updateQuoteStatus(quote.id, "SENT");
        toast({
          title: "Success",
          description: "Quote resent successfully",
        });
        router.refresh();
      } else {
        throw new Error("Failed to send quote");
      }
    } catch (error) {
      console.error("Failed to resend quote:", error);
      toast({
        title: "Error",
        description: "Failed to resend quote",
        variant: "destructive",
      });
    }
  };

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/quotes/${quote.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {quote.status === "DRAFT" && (
                      <DropdownMenuItem onClick={() => handleResend(quote)}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Quote
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedQuote(quote);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Quote
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quote</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quote? This action cannot be undone.
              {selectedQuote && (
                <div className="mt-2 text-sm">
                  <p>
                    <strong>Customer:</strong> {selectedQuote.lead.firstName} {selectedQuote.lead.lastName}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${selectedQuote.price.toFixed(2)}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedQuote && handleDelete(selectedQuote.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 