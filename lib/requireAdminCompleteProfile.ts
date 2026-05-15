import "server-only";

import { redirect } from "next/navigation";

import { prisma } from "./prisma";

import { requireAdmin } from "./requireAdmin";

export async function requireAdminCompleteProfile() {
  const session = await requireAdmin();

  if (!session?.id) {
    redirect("/login");
  }

  const profile = await prisma.adminProfile.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!profile) {
    redirect("/admin/complete-profile");
  }

  return {
    session,
    profile,
  };
}