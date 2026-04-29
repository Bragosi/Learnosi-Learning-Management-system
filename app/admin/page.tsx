import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { requireRole } from "@/lib/requireRole";
import { UserStatus } from "@prisma/client";
import { TotalAppUsers } from "../data/admin/AdminGetAppInfo";
import { AdminGetEnrollmentStats } from "../data/admin/AdminGetEnrollmentStats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AdminGetRecentCourses } from "../data/admin/AdminGetRecentCourses";
import { EmptyState } from "@/components/general/EmptyState";
import { AdminCoursecard, AdminCourseCardSkeleton } from "./courses/_component/AdminCourseCard";
import { Suspense } from "react";


export default async function AdminIndexPage() {
  const enrollmentData = await AdminGetEnrollmentStats();
  const stats = await TotalAppUsers();
  await requireRole([UserStatus.LECTURER, UserStatus.ADMIN]);
  return (
    <>
      <SectionCards stats={stats} />
      <ChartAreaInteractive data={enrollmentData} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            View All Courses
          </Link>
        </div>
        <Suspense fallback={ <RenderRecentCoursesSkeletonLayout/> } >
          <RenderRecentCourses/>
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await AdminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        title="You do not have any courses"
        description="You do not have any courses. create some to see them here "
        buttonText="Create new course"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
      {data.map((course)=>(
        <AdminCoursecard key={course.id} data={course} />
      ))}
    </div>
  )
}


function RenderRecentCoursesSkeletonLayout(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
    {
      Array.from({length : 2}).map((_, index)=>(
        <AdminCourseCardSkeleton key={index}/>
      ))
    }
    </div>
  )
}