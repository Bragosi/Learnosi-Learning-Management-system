import "server-only";

import { redirect } from "next/navigation";

import { prisma } from "./prisma";

import { requireLecturer } from "./requireLecturer";

export async function requireLectureCompleteProfile() {
  const session = await requireLecturer();

  if (!session?.id) {
    redirect("/login");
  }

  const profile = await prisma.lecturerProfile.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!profile) {
    redirect("/lecturer/complete-profile");
  }

  return {
    session,
    profile,
  };
}