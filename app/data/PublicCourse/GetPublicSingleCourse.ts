import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import "server-only"

export async function GetPublicSingleCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      courseCode: true,
      courseTitle: true,
      description: true,
      fileKey: true,
      level: true,
      faculty: true,
      department: true,
      chapters: {
        select: {
          id: true,
          title: true,
          lectures: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return notFound();
  }
  return course;
}
