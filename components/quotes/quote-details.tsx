"use client";

import { Quote, Lead } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { sendQuoteEmail } from "@/lib/email";

interface QuoteDetailsProps {
  quote: Quote & {
    lead: Lead;
  };
}

export function QuoteDetails({ quote }: QuoteDetailsProps) {
  const { toast } = useToast();

  const handleResend = async () => {
    try {
      const result = await sendQuoteEmail(quote);
      
      if (result.success) {
        toast({
          title: "Quote Sent",
          description: "The quote has been resent successfully.",
        });
      } else {
        throw new Error("Failed to send quote");
      }
    } catch (error) {
      console.error("Failed to resend quote:", error);
      toast({
        title: "Error",
        description: "Failed to resend quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Quote Details</h2>
          <p className="text-muted-foreground">
            View and manage quote information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/quotes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quotes
            </Link>
          </Button>
          {quote.status === "SENT" && (
            <Button onClick={handleResend}>
              <Send className="mr-2 h-4 w-4" />
              Resend Quote
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quote Information */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Information</CardTitle>
            <CardDescription>Details about the quote</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
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
                  className="mt-1"
                >
                  {quote.status.toLowerCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="mt-1">${quote.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ramp Length
                </p>
                <p className="mt-1">{quote.rampLength} ft</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Platforms
                </p>
                <p className="mt-1">{quote.platforms}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created At
                </p>
                <p className="mt-1">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Expires At
                </p>
                <p className="mt-1">
                  {quote.expiresAt
                    ? new Date(quote.expiresAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            {quote.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-wrap">{quote.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Details about the customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="mt-1">
                {quote.lead.firstName} {quote.lead.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="mt-1">{quote.lead.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="mt-1">{quote.lead.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Install Address
              </p>
              <p className="mt-1">{quote.lead.installAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 