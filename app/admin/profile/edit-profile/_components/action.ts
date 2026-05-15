"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ApiResponse } from "@/lib/types";

import {
    AdminProfileSchema,
    AdminProfileSchemaType,
  LecturerProfileSchema,
} from "@/lib/zodSchema";

export async function EditAdminProfile(
  data: AdminProfileSchemaType,
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    if (!session?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }

    const result = AdminProfileSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.adminProfile.update({
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