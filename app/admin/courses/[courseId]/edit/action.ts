"use server";

import { ApiResponse } from "@/lib/types";
import { CourseSchemaType } from "../../create/action";
import { courseSchema } from "@/lib/zodSchema";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function EditCourse(
  data: CourseSchemaType,
  courseId: string,
): Promise<ApiResponse> {
  try {
    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Course Update Successful",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to Edit Course",
    };
  }
}

export async function reOrderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,
): Promise<ApiResponse> {
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons Provided for reordering",
      };
    }

    const updates = lessons.map((lessons) =>
      prisma.lecture.update({
        where: {
          id: lessons.id,
          chapterId: chapterId,
        },
        data: {
          position: lessons.position,
        },
      }),
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lessons Successfully Reordered",
    };
  } catch {
    return {
      status: "error",
      message: " Failed to reorder Lessons",
    };
  }
}

export async function reOrderChapters(
  courseId: string,
  chapters: { id: string; position: number }[],
): Promise<ApiResponse> {
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No lessons Provided for reordering",
      };
    }
    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      }),
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapters Successfully Reordered",
    };
  } catch {
    return {
      status: "error",
      message: " Failed to reorder Lessons",
    };
  }
}
