"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal, MessageSquare, Phone, Mail, MapPin, Trash2, Pencil, Calculator } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/app/actions/leads";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { statusColors } from '@/lib/constants';
import type { Lead } from "@/types/lead";
import { LeadForm } from "./lead-form";
import { QuoteForm } from "../quotes/quote-form";
import { getBusinessSettings } from "@/app/actions/settings";

interface LeadManagementTableProps {
  leads: Lead[];
}

export function LeadManagementTable({ leads }: LeadManagementTableProps) {
  const router = useRouter();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [settings, setSettings] = useState<Awaited<ReturnType<typeof getBusinessSettings>> | null>(null);
  const [, formAction] = useFormState(updateLeadStatus, { message: "" });

  useEffect(() => {
    if (isQuoteOpen && selectedLead && !settings) {
      getBusinessSettings().then(setSettings);
    }
  }, [isQuoteOpen, selectedLead, settings]);

  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    const formData = new FormData();
    formData.append("id", leadId);
    formData.append("status", newStatus);
    formAction(formData);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteLead(id);
    if (result.message === 'Lead deleted successfully') {
      setIsDeleteOpen(false);
      router.refresh();
    }
  };

  const dropdownContent = (lead: Lead) => (
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        onClick={() => {
          setSelectedLead(lead);
          setIsEditOpen(true);
        }}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Edit Lead
      </DropdownMenuItem>
      {Object.keys(statusColors).map((status) => (
        <DropdownMenuItem
          key={status}
          onClick={() => handleStatusChange(lead.id, status as Lead["status"])}
        >
          Mark as {status}
        </DropdownMenuItem>
      ))}
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => {
          setSelectedLead(lead);
          setIsDeleteOpen(true);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Lead
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setSelectedLead(lead);
          setIsQuoteOpen(true);
        }}
      >
        <Calculator className="mr-2 h-4 w-4" />
        Generate Quote
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => {
                setSelectedLead(lead);
                setIsDetailsOpen(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-2 h-4 w-4" />
                      {lead.email}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-4 w-4" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {lead.installAddress}
                    </div>
                  </div>
                </div>
                <Badge variant={statusColors[lead.status]}>
                  {lead.status}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsNotesOpen(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {dropdownContent(lead)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="hidden xl:table-cell">Install Address</TableHead>
                <TableHead className="hidden 2xl:table-cell">Ramp Length</TableHead>
                <TableHead className="hidden 2xl:table-cell">Rental Duration</TableHead>
                <TableHead className="hidden xl:table-cell">Install Timeframe</TableHead>
                <TableHead className="hidden xl:table-cell">Mobility Aids</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden xl:table-cell">Date</TableHead>
                <TableHead className="hidden xl:table-cell">Notes</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow 
                  key={lead.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsDetailsOpen(true);
                  }}
                >
                  <TableCell className="font-medium">
                    {lead.firstName} {lead.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{lead.email}</span>
                      <span className="text-sm text-muted-foreground">
                        {lead.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">{lead.installAddress}</TableCell>
                  <TableCell className="hidden 2xl:table-cell">
                    {lead.knowRampLength ? (
                      lead.rampLength ? 
                        `${lead.rampLength}ft` : 
                        "Not specified"
                    ) : (
                      "Unknown"
                    )}
                  </TableCell>
                  <TableCell className="hidden 2xl:table-cell">
                    {lead.knowRentalDuration ? (
                      lead.rentalDuration ? 
                        `${lead.rentalDuration} days` : 
                        "Not specified"
                    ) : (
                      "Unknown"
                    )}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">{lead.installTimeframe}</TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex flex-col gap-1">
                      {lead.mobilityAids.map((aid) => (
                        <Badge key={aid} variant="secondary">
                          {aid}
                        </Badge>
                      ))}
                      {lead.otherAid && (
                        <span className="text-sm text-muted-foreground">
                          Other: {lead.otherAid}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[lead.status]}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                        setIsNotesOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      {dropdownContent(lead)}
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lead Notes</DialogTitle>
            <DialogDescription>
              {selectedLead?.firstName} {selectedLead?.lastName} - {selectedLead?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="No notes available"
              value={selectedLead?.notes || ""}
              className="min-h-[150px]"
              readOnly
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
              {selectedLead && (
                <div className="mt-2 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedLead.firstName} {selectedLead.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedLead.email}
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
              onClick={() => selectedLead && handleDelete(selectedLead.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add the Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update the lead information below.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <LeadForm
              lead={selectedLead}
              onSuccess={() => {
                setIsEditOpen(false);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Full information about the lead
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{selectedLead.firstName} {selectedLead.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={statusColors[selectedLead.status]}>
                      {selectedLead.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedLead.phone}</p>
                  </div>
                </div>
              </div>

              {/* Installation Details */}
              <div className="space-y-2">
                <h3 className="font-semibold">Installation Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>{selectedLead.installAddress}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ramp Length</p>
                      <p>
                        {selectedLead.knowRampLength
                          ? selectedLead.rampLength
                            ? `${selectedLead.rampLength}ft`
                            : "Not specified"
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rental Duration</p>
                      <p>
                        {selectedLead.knowRentalDuration
                          ? selectedLead.rentalDuration
                            ? `${selectedLead.rentalDuration} days`
                            : "Not specified"
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Install Timeframe</p>
                      <p>{selectedLead.installTimeframe}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p>{selectedLead.source}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobility Aids */}
              <div className="space-y-2">
                <h3 className="font-semibold">Mobility Aids</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.mobilityAids.map((aid) => (
                    <Badge key={aid} variant="secondary">
                      {aid}
                    </Badge>
                  ))}
                  {selectedLead.otherAid && (
                    <span className="text-sm text-muted-foreground">
                      Other: {selectedLead.otherAid}
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <h3 className="font-semibold">Notes</h3>
                <p className="text-sm whitespace-pre-wrap">
                  {selectedLead.notes || "No notes available"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setSelectedLead(selectedLead);
                    setIsEditOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Lead
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setSelectedLead(selectedLead);
                    setIsQuoteOpen(true);
                  }}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Generate Quote
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setSelectedLead(selectedLead);
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Lead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quote Dialog */}
      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedLead && settings ? (
            <QuoteForm
              lead={selectedLead}
              settings={settings}
              onSuccess={() => {
                setIsQuoteOpen(false);
                router.refresh();
              }}
            />
          ) : (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 