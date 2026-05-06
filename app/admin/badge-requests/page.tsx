
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
import { AdminGetLecturerBadgeRequests } from "@/app/data/admin/AdminGetLecturerBadgeRequests";
import { LecturerRequestCard, LecturerRequestCardSkeleton } from "./_components/LecturerRequestCard";

export default async function BadgeRequestsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lecturer Badge Requests
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage and monitor lecturer badge requests
          </p>
        </div>
      </div>
      <Suspense fallback={<LecturerBadgeRequestsSkeletonLayout />}>
        <RenderBadgeRequests />
      </Suspense>
    </div>
  );
}

async function RenderBadgeRequests() {
  const data = await AdminGetLecturerBadgeRequests();
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Badge Requests"
          description="There are no badge requests to display."
          buttonText="Back to Dashboard"
          href="/admin/dashboard"
        />
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((requests) => (
              <LecturerRequestCard key={requests.id} data={requests} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function LecturerBadgeRequestsSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <LecturerRequestCardSkeleton key={index} />
      ))}
    </div>
  );
}
