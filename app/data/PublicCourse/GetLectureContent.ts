import "server-only";
import { RequireUser } from "../user/requireUser";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function GetLectureContent(lectureId: string) {
  const session = await RequireUser();

  const lecture = await prisma.lecture.findUnique({
    where: {
      id: lectureId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      pdfKey: true,
      position: true,
      lectureProgress: {
        where: {
          userId: session.id,
        },
        select: {
          completed: true,
          lectureId: true,
        },
      },
      chapter: {
        select: {
          courseId: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!lecture) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: lecture.chapter.courseId,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    return notFound();
  }

  return lecture;
}

export type LectureContentType = Awaited<ReturnType<typeof GetLectureContent>>;
