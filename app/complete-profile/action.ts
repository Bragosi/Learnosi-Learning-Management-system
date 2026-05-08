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
        message: "Invalid Form Data",
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
  } catch(error) {
    console.log("Error creating profile:", error);
    return {
      status: "error",
      message: "Failed to Create Profile",
    };
  }
}
