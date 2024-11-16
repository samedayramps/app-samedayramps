import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeadsOverview } from "@/components/dashboard/leads-overview";
import { 
  ClipboardList, 
  DollarSign, 
  Package
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pb-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h2>
        </div>

        <LeadsOverview />

        {/* Stats Grid - Single column on mobile, two columns on larger screens */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Job Status Card */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Status</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["New", "Quoted", "Scheduled", "Installed", "Completed"].map((status, index) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{status}</span>
                    <span className="font-medium">{[5, 8, 3, 2, 4][index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payments Card */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">$12,234</div>
                  <p className="text-xs text-muted-foreground">Due</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-500">$45,678</div>
                  <p className="text-xs text-muted-foreground">Received this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Status Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Package className="h-5 w-5" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <div className="min-w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left text-sm font-medium">Item</th>
                    <th className="pb-2 text-left text-sm font-medium">Stock</th>
                    <th className="pb-2 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { item: "Aluminum Ramps", stock: "5/10", status: "Low", color: "text-red-500" },
                    { item: "Steel Brackets", stock: "15/20", status: "Warning", color: "text-yellow-500" },
                    { item: "Safety Rails", stock: "25/30", status: "Good", color: "text-green-500" }
                  ].map((row) => (
                    <tr key={row.item}>
                      <td className="py-3 text-sm">{row.item}</td>
                      <td className="py-3 text-sm">{row.stock}</td>
                      <td className={`py-3 text-sm font-medium ${row.color}`}>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 