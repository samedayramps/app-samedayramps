"use server";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { fetchLeadsOverview } from "@/app/actions/leads";
import { statusColors } from '@/lib/constants';
import type { Lead, LeadStatus } from "@/types/lead";

export async function LeadsOverview() {
  const { recentLeads, statusCounts } = await fetchLeadsOverview();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Summary Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentLeads.length}</div>
            <p className="text-xs text-muted-foreground">
              From quote requests
            </p>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lead Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
              {(Object.keys(statusColors) as LeadStatus[]).map((status) => (
                <div
                  key={status}
                  className="flex flex-col items-center rounded-lg bg-muted p-2"
                >
                  <div className="text-sm font-medium">{status}</div>
                  <div className="text-xl md:text-2xl font-bold">
                    {statusCounts[status] || 0}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quote Requests</CardTitle>
          <CardDescription>
            Latest incoming leads and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentLeads.map((lead: Lead) => (
              <div 
                key={lead.id} 
                className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:items-center md:justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {lead.firstName[0]}
                      {lead.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:space-x-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                  <Badge
                    className={`${statusColors[lead.status]} text-white ml-2`}
                    variant="secondary"
                  >
                    {lead.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 