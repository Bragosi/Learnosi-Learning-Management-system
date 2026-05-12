"use server"; 
import { ApiResponse } from "@/lib/types";
import { LecturerProfileSchema, LecturerProfileSchemaType } from "@/lib/zodSchema";
import { prisma } from "@/lib/prisma";
import { requireLecturer } from "@/lib/requireLecturer";

export async function CreateLecturerProfile(
  values: LecturerProfileSchemaType,
): Promise<ApiResponse> {
  const session = await requireLecturer();

  try {
    if (!session?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }
    const validation = LecturerProfileSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }
    await prisma.lecturerProfile.create({
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
