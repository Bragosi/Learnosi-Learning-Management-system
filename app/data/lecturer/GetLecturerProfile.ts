"use server";

import { prisma } from "@/lib/prisma";
import { requireLecturer } from "@/lib/requireLecturer";

export async function GetLecturerProfile() {
  const session = await requireLecturer();

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },

    select: {
      id: true,
      status: true,

      lecturerProfile: {
        select: {
          id: true,

          firstName: true,
          lastName: true,
          otherName: true,

          profilePicture: true,

          bio: true,

          faculty: true,
          department: true,

          title: true,

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

export type GetLecturerProfileType = Awaited<
  ReturnType<typeof GetLecturerProfile>
>;
