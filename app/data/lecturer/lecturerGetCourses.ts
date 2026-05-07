import "server-only"
import { Faculty } from "@/lib/facultyDepartments";
import { prisma } from "@/lib/prisma";
import { CourseLevel, CourseStatus } from "@prisma/client";

export type LecturerCourseType = {
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

export async function lecturerGetCourses(lecturerId : string): Promise<LecturerCourseType[]> {
  const data = await prisma.course.findMany({
    where:{
        userId : lecturerId
    },
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

  return data as LecturerCourseType[];
}