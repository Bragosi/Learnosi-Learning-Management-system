"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  await requireAdmin();
  try {
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    revalidatePath("/admin/courses");

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
