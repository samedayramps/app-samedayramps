import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LeadFormDialog } from "@/components/leads/lead-form-dialog";

export default async function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
        <div className="w-full sm:w-auto">
          <LeadFormDialog />
        </div>
      </div>
      {children}
    </div>
  );
} 