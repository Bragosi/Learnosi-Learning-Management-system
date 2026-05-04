import { prisma } from "@/lib/prisma";
import { RequireUser } from "./requireUser";

export async function GetMyProfile() {
  const session = await RequireUser();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          otherName: true,
          avatarKey: true,
          bio: true,
          matricNumber: true,
          phone: true,
          faculty: true,
          department: true,
          level: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export type GetMyProfileType = Awaited<ReturnType<typeof GetMyProfile>>;