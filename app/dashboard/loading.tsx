export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="h-8 w-36 animate-pulse bg-muted rounded"></div>
        <div className="h-9 w-24 animate-pulse bg-muted rounded"></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse bg-muted rounded"></div>
        ))}
      </div>
    </div>
  );
} 