"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ApiResponse } from "@/lib/types";
import { LectureSchema, LectureSchemaType } from "@/lib/zodSchema";

export async function updateLecture(
  values: LectureSchemaType,
  lectureId: string,
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = LectureSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.lecture.update({
      where: {
        id: lectureId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
        pdfKey: result.data.pdfKey
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
