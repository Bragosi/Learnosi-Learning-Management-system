"use server";

import { RequireUser } from "@/app/data/user/requireUser";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";

export async function EnrollInCourseAction(
  courseId: string,
): Promise<ApiResponse> {
  try {
    const user = await RequireUser();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        courseTitle: true,
        courseCode: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    // 🔍 Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      return {
        status: "error",
        message: "You are already enrolled in this course",
      };
    }

    // ✅ Create enrollment
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        status: "ACTIVE",
      },
    });

    return {
      status: "success",
      message: "Registration successful",
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: "Failed to enroll in course",
    };
  }
}
