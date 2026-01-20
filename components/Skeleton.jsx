import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4">
        <Skeleton className="mb-2 h-4 w-1/3" />
        <Skeleton className="mb-2 h-6 w-2/3" />
        <Skeleton className="mb-4 h-4 w-1/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border">
      <div className="border-b bg-gray-50 p-4">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 px-2">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function ProductFormSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Form Content Skeleton */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg border bg-white p-6">
            <Skeleton className="mb-6 h-6 w-32" />
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Images Skeleton */}
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-6 flex justify-between items-center">
              <div className="space-y-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="flex justify-end gap-4 pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters Skeleton */}
      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-64" />
          <Skeleton className="h-10 w-full md:w-48" />
          <Skeleton className="h-10 w-full md:w-32" />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-2 pt-4">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}
