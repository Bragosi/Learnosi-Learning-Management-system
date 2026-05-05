"use server";

import { ApiResponse } from "@/lib/types";
import {
  LecturerRequestSchema,
  LecturerRequestSchemaType,
} from "@/lib/zodSchema";
import { prisma } from "@/lib/prisma";
import { RequireUser } from "@/app/data/user/requireUser";

export async function CreateLecturerRequest(
  value: LecturerRequestSchemaType,
): Promise<ApiResponse> {
  const session = await RequireUser();
  try {
    if (!session?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }
    const validation = LecturerRequestSchema.safeParse(value);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }
    const existing = await prisma.lecturerRequest.findUnique({
      where: { userId: session.id },
    });

    if (existing) {
      return {
        status: "error",
        message: "You have already submitted a lecturer request",
      };
    }
    await prisma.lecturerRequest.create({
      data: { ...validation.data, userId: session.id },
    });
    return {
      status: "success",
      message: "Your Request has been created submitted successfully",
    };
  }catch (error) {
  console.error("Lecturer Request Error:", error);

  return {
    status: "error",
    message: "Failed to Submit Lecturer Request",
  };
}
}
