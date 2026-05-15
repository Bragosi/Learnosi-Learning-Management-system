"use server"; 
import { ApiResponse } from "@/lib/types";
import { AdminProfileSchema, AdminProfileSchemaType } from "@/lib/zodSchema";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function CreateAdminProfile(
  values: AdminProfileSchemaType,
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    if (!session?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }
    const validation = AdminProfileSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }
    await prisma.adminProfile.create({
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
