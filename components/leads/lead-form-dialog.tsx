"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { LeadForm } from "./lead-form";
import { useRouter } from "next/navigation";

export function LeadFormDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new lead to the system.
          </DialogDescription>
        </DialogHeader>
        <LeadForm
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
} 