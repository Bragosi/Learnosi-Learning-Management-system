import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AdminCoursecard } from "./_component/AdminCourseCard";
import { PlusCircleIcon } from "lucide-react";

export default async function CoursesPage() {
  const data = await adminGetCourses();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Courses</h1>
          <p className="text-muted-foreground text-sm">
            Manage and monitor all your created courses
          </p>
        </div>

        <Link
          href="/admin/courses/create"
          className={buttonVariants({ className: "w-fit" })}
        >
          <PlusCircleIcon className="size-4" />
          Create Course
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((course) => (
          <AdminCoursecard key={course.id} data={course} />
        ))}
      </div>
    </div>
  );
}
