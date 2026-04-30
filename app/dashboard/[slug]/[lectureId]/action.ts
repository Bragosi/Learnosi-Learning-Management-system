"use server";

import { RequireUser } from "@/app/data/user/requireUser";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function MarkLectureComplete(
  LectureId: string,
  slug: string
): Promise<ApiResponse> {
  try {
    const session = await RequireUser();

    await prisma.lectureProgress.upsert({
      where: {
        userId_lectureId: {
          userId: session.id,
          lectureId: LectureId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        lectureId: LectureId,
        userId: session.id,
        completed: true,
      },
    });

    revalidatePath(`/dashboard/${slug}`);

    return {
      status: "success",
      message: "progress updated",
    };
  }catch (error) {
  console.error("MarkLectureComplete ERROR:", error);

  return {
    status: "error",
    message: "failed to mark lecture complete",
  };
}
}