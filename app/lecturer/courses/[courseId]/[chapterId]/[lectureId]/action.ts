"use server";

import { assertCourseOwnership } from "@/lib/AssertCourseOwnerShip.";
import { prisma } from "@/lib/prisma";
import { requireLecturer } from "@/lib/requireLecturer";
import { ApiResponse } from "@/lib/types";
import { LectureSchema, LectureSchemaType } from "@/lib/zodSchema";

export async function updateLecture(
  values: LectureSchemaType,
  lectureId: string,
): Promise<ApiResponse> {
  const user = await requireLecturer();
  try {
    const result = LectureSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: result.data.chapterId,
      },
      select: {
        courseId: true,
      },
    });

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    await assertCourseOwnership(chapter.courseId, user.id);

    await prisma.lecture.update({
      where: {
        id: lectureId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
        pdfKey: result.data.pdfKey,
      },
    });

    return {
      status: "success",
      message: "Lecture updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update lecture",
    };
  }
}
