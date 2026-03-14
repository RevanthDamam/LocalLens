export function ShopCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="flex aspect-video w-full animate-pulse items-center justify-center rounded-lg border bg-muted">
      <span className="text-muted-foreground">Loading map...</span>
    </div>
  );
}
