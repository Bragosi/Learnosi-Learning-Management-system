"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ApiResponse } from "@/lib/types";
import { UserStatus } from "@prisma/client";

export async function ChangeUserStatus(
  userId: string,
  status: UserStatus,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status,
      },
    });

    return {
      status: "success",
      message: "User status updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update user status",
    };
  }
}
