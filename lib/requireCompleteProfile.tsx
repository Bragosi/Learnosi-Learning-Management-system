import "server-only";

import { redirect } from "next/navigation";

import { prisma } from "./prisma";
import { RequireUser } from "@/app/data/user/requireUser";

export async function requireCompleteProfile() {
  const session = await RequireUser();

  if (!session?.id) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!profile) {
    redirect("/complete-profile");
  }

  return {
    session,
    profile,
  };
}