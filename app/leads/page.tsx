import { Suspense } from 'react';
import { LeadsLoadingSkeleton } from "@/components/leads/leads-loading-skeleton";
import { LeadsContent } from "@/components/leads/leads-content";

export const metadata = {
  title: 'Lead Management',
  description: 'Manage and track all your leads in one place.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LeadManagementPage() {
  return (
    <Suspense fallback={<LeadsLoadingSkeleton />}>
      <LeadsContent />
    </Suspense>
  );
} 