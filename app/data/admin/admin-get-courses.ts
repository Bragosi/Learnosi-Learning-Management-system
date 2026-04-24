import { Faculty } from "@/lib/facultyDepartments";
import { prisma } from "@/lib/prisma";
import { CourseLevel, CourseStatus } from "@prisma/client";
export async function adminGetCourses() {
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      courseTitle: true,
      courseCode: true,
      level: true,
      status: true,
      fileKey: true,
      slug: true,
      description: true,
      faculty: true,
      department: true,
    },
  });
  return data;
}

export type AdminCourseType = {
  id: string;
  courseTitle: string;
  courseCode: string;
  level: CourseLevel;
  status: CourseStatus;
  fileKey: string;
  slug: string;
  description: string;
  faculty: Faculty;
  department: string;
};
