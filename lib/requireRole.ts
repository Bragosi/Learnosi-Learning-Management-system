import { auth } from "./auth";
import { prisma } from "./prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserStatus } from "@prisma/client";

export async function requireRole(allowedRoles: UserStatus[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, status: true },
  });

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(user.status)) {
    redirect("/not-admin");
  }

  return user;
}