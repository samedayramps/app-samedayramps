import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadManagementTable } from "@/components/leads/lead-management-table";
import { LeadStatsCard } from "@/components/leads/lead-stats-card";
import { fetchLeadStats } from "@/app/actions/leads";

export async function LeadsContent() {
  try {
    const { leads, stats } = await fetchLeadStats();

    return (
      <div className="grid gap-4">
        <LeadStatsCard stats={stats} />

        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription className="hidden sm:block">
              Manage and track all your leads in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <LeadManagementTable leads={leads} />
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
} 