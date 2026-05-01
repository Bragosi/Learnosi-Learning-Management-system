import { Skeleton } from "@/components/ui/skeleton";

export function LectureSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background px-3 sm:px-4 lg:pl-6 space-y-4">
      
      {/* VIDEO SKELETON */}
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      {/* ACTION BAR SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b">
        
        {/* LEFT BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-40 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>

        {/* PDF BUTTON */}
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* CONTENT SKELETON */}
      <div className="space-y-4 pt-2 pb-10">
        
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}