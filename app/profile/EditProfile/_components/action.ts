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
    const result = ProfileSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }
    const profile = await prisma.profile.findUnique({
      where: { userId: session.id },
    });

    if (!profile) {
      return {
        status: "error",
        message: "Profile not found",
      };
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: result.data,
    });
    return {
      status: "success",
      message: "Profile Update Successful",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update Profile",
    };
  }
}
