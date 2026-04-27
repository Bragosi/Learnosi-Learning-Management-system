"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { LectureSchema, LectureSchemaType } from "@/lib/zodSchema";

export async function updateLecture(
  values: LectureSchemaType,
  lectureId: string,
): Promise<ApiResponse> {
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