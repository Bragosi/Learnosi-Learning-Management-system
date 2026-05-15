"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GetAdminProfile() {
  const session = await requireAdmin();

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },

    select: {
      id: true,
      status: true,

      adminProfile: {
        select: {
          id: true,

          firstName: true,
          lastName: true,
          otherName: true,

          profilePicture: true,

          bio: true,

          faculty: true,
          department: true,

          officeLocation: true,

          email: true,

          employeeId: true,

          verified: true,

          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export type GetAdminProfileType = Awaited<
  ReturnType<typeof GetAdminProfile>
>;
