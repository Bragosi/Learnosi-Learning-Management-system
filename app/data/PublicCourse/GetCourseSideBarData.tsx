import "server-only";
import { RequireUser } from "../user/requireUser";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function GetCourseSideBarData(slug: string) {
  const session = await RequireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug : slug
    },
    select: {
      id: true,
      courseCode: true,
      courseTitle: true,
      description: true,
      faculty: true,
      department: true,
      fileKey: true,
      level: true,
      status: true,
      slug : true,
      chapters: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          lectures: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lectureProgress :{
                where :{
                  userId : session.id
                },
                select:{
                  completed : true,
                  lectureId : true,
                  id : true,
                }
              }
            },
          },
        },
      },
    },
  });
  if (!course) return notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: course.id,
      },
    },
  });

  if (enrollment?.status !== "ACTIVE") {
    return notFound();
  }
return { course };
}

export type CourseSideBarDataType = Awaited<
  ReturnType<typeof GetCourseSideBarData>
>;
