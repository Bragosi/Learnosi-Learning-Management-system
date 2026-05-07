"use server";

import { assertCourseOwnership } from "@/lib/AssertCourseOwnerShip.";
import { prisma } from "@/lib/prisma";
import { requireLecturer } from "@/lib/requireLecturer";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const user = await requireLecturer();
  try {
    await assertCourseOwnership(courseId, user.id);
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    revalidatePath("/lecturer/courses");

    return {
      status: "success",
      message: "Course Deleted Successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
}
