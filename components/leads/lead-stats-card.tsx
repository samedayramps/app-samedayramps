import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusColors } from "@/lib/constants";
import type { LeadStatus } from "@/types/lead";

interface LeadStatsCardProps {
  stats: {
    totalLeads: number;
    statusCounts: Record<LeadStatus, number>;
  };
}

export function LeadStatsCard({ stats }: LeadStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Lead Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Leads */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Leads</span>
            <span className="text-2xl font-bold">{stats.totalLeads}</span>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(Object.keys(statusColors) as LeadStatus[]).map((status) => (
              <div
                key={status}
                className="flex flex-col items-center rounded-lg bg-muted p-3"
              >
                <Badge variant={statusColors[status]}>
                  {status}
                </Badge>
                <div className="text-lg sm:text-xl font-bold mt-2">
                  {stats.statusCounts[status] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 