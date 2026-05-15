"use server";

import { prisma } from "@/lib/prisma";
import { requireLecturer } from "@/lib/requireLecturer";
import { ApiResponse } from "@/lib/types";

import {
  LecturerProfileSchema,
  LecturerProfileSchemaType,
} from "@/lib/zodSchema";

export async function EditLecturerProfile(
  data: LecturerProfileSchemaType,
): Promise<ApiResponse> {
  const session = await requireLecturer();

  try {
    if (!session?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }

    const result = LecturerProfileSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.lecturerProfile.update({
      where: {
        userId: session.id,
      },

      data: {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        otherName: result.data.otherName,
        bio: result.data.bio,
        faculty: result.data.faculty,
        department: result.data.department,
        profilePicture: result.data.profilePicture,
        employeeId: result.data.employeeId,
        email: result.data.email,
        officeLocation: result.data.officeLocation,
        title: result.data.title,
      },
    });

    return {
      status: "success",
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "Failed to update profile",
    };
  }
}