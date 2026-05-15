"use server";

import { RequireUser } from "@/app/data/user/requireUser";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { ProfileSchema, ProfileSchemaType } from "@/lib/zodSchema";

export async function EditProfile(
  data: ProfileSchemaType,
): Promise<ApiResponse> {
  const session = await RequireUser();

  try {
    if (!session?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }

    const result = ProfileSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // CHECK IF STUDENT IS APPROVED
    const approvedStudent = await prisma.approvedStudent.findUnique({
      where: {
        matricNumber: result.data.matricNumber,
      },
    });

    if (!approvedStudent) {
      return {
        status: "error",
        message:
          "Your matric number is not authorized. Contact the administrator.",
      };
    }

    // FIND PROFILE
    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.id,
      },
    });

    if (!profile) {
      return {
        status: "error",
        message: "Profile not found",
      };
    }

    // UPDATE PROFILE
    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: result.data,
    });

    return {
      status: "success",
      message: "Profile updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update profile",
    };
  }
}
