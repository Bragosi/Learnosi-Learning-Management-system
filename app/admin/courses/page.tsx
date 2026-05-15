import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import {
  AdminCoursecard,
  AdminCourseCardSkeleton,
} from "./_component/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
export default async function CoursesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Courses</h1>
          <p className="text-muted-foreground text-sm">
            Manage and monitor created courses
          </p>
        </div>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="Create a new course to get started"
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((course) => (
            <AdminCoursecard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
