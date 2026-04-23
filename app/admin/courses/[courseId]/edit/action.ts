"use server";

import { ApiResponse } from "@/lib/types";
import { CourseSchemaType } from "../../create/action";
import { courseSchema } from "@/lib/zodSchema";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
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
