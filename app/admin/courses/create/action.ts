"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ApiResponse } from "@/lib/types";
import { courseSchema } from "@/lib/zodSchema";
import { headers } from "next/headers";
import { z } from "zod";

// Define the type so the parameter knows what to expect
export type CourseSchemaType = z.infer<typeof courseSchema>;

export async function CreateCourse(
  values: CourseSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Ensure user is authenticated before proceeding
    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }

    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });
    return {
      status: "success",
      message: "Your Course has been Created Successfully",
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      status: "error",
      message: "Failed to Create Course",
    };
  }
}
