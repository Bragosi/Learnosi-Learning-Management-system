import "server-only";
import { RequireUser } from "./requireUser";
import { prisma } from "@/lib/prisma";
import { Faculty } from "@/lib/facultyDepartments";

export async function GetEnrolledCourses() {
  const user = await RequireUser();

  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "ACTIVE",
    },
    select: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
          description: true,
          faculty: true,
          department: true,
          slug: true,
          level: true,
          fileKey: true,
          chapters: {
            select: {
              id: true,
              lectures: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return data.map((item) => ({
    ...item.course,
    faculty: item.course.faculty as Faculty,
  }));
}
