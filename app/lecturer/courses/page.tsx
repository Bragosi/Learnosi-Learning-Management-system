import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
import { UserStatus } from "@prisma/client";
import { requireRole } from "@/lib/requireRole";
import {
  LecturerCoursecard,
  LecturerCourseCardSkeleton,
} from "./_components/LecturerCourseCard";
import { lecturerGetCourses } from "@/app/data/lecturer/lecturerGetCourses";

export default async function CoursesPage() {
  await requireRole([UserStatus.LECTURER]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Courses</h1>
          <p className="text-muted-foreground text-sm">
            Manage and monitor your created courses
          </p>
        </div>

        <Link
          href="/lecturer/courses/create"
          className={buttonVariants({ className: "w-fit" })}
        >
          <PlusCircleIcon className="size-4" />
          Create Course
        </Link>
      </div>

      <Suspense fallback={<LecturerCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const user = await requireRole([UserStatus.LECTURER]);

  const data = await lecturerGetCourses(user.id);
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
            <LecturerCoursecard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function LecturerCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <LecturerCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
