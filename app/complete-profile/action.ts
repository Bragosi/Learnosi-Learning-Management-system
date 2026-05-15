"use server";

import { ApiResponse } from "@/lib/types";
import { RequireUser } from "../data/user/requireUser";
import { ProfileSchema, ProfileSchemaType } from "@/lib/zodSchema";
import { prisma } from "@/lib/prisma";

export async function CreateProfile(
  values: ProfileSchemaType,
): Promise<ApiResponse> {
  const session = await RequireUser();

  try {
    if (!session?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }

    const validation = ProfileSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    // CHECK IF STUDENT IS APPROVED
    const approvedStudent = await prisma.approvedStudent.findUnique({
      where: {
        matricNumber: validation.data.matricNumber,
      },
    });

    if (!approvedStudent) {
      return {
        status: "error",
        message:
          "Your matric number is not authorized. Contact the administrator.",
      };
    }

    // CHECK IF PROFILE ALREADY EXISTS
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: session.id,
      },
    });

    if (existingProfile) {
      return {
        status: "error",
        message: "You already have a profile",
      };
    }

    await prisma.profile.create({
      data: {
        ...validation.data,
        userId: session.id,
      },
    });

    return {
      status: "success",
      message: "Your profile has been created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create profile",
    };
  }
}
