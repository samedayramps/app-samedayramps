export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <div className="h-8 w-32 animate-pulse bg-muted rounded"></div>
        <div className="h-4 w-64 animate-pulse bg-muted rounded mt-2"></div>
      </div>
      <div className="h-px bg-muted"></div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 animate-pulse bg-muted rounded"></div>
            ))}
          </div>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 