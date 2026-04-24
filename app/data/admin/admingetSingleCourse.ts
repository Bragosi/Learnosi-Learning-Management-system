import { Faculty } from "@/lib/facultyDepartments";
import { prisma } from "@/lib/prisma";
import { CourseLevel, CourseStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import "server-only";
export async function AdminGetSingleCourse(id: string) {
  const data = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      courseTitle: true,
      courseCode: true,
      description: true,
      fileKey: true,
      level: true,
      status: true,
      slug: true,
      faculty: true,
      department: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lectures: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              position: true,
              videoKey: true,
            },
          },
        },
      },
    },
  });
  if (!data) {
    notFound();
  }
   return {
    ...data,
    faculty: data.faculty as Faculty,
    level: data.level as CourseLevel,
    status: data.status as CourseStatus,
  };
}
export type AdminGetSingleCourseType = Awaited<
  ReturnType<typeof AdminGetSingleCourse>
>;
