import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type Lead } from "@/types/lead";

const recentLeads: Lead[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    knowRampLength: true,
    rampLength: "10",
    knowRentalDuration: true,
    rentalDuration: "30",
    installTimeframe: "ASAP",
    mobilityAids: ["wheelchair"],
    otherAid: null,
    installAddress: "123 Main St, Anytown, USA",
    source: "Website Form",
    status: "NEW",
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: "",
  },
  // ... more mock leads
];

export function RecentLeads() {
  return (
    <div className="space-y-8">
      {recentLeads.map((lead) => (
        <div key={lead.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>
              {lead.firstName[0]}
              {lead.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {lead.firstName} {lead.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {lead.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {lead.installAddress}
            </p>
          </div>
          <div className="ml-auto">
            <Badge>{lead.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
} 