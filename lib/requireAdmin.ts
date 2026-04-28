import { auth } from "@/lib/auth"; // Better Auth instance
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. No session
  if (!session?.user) {
    throw new Error("Unauthorized");
  }


  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

if (user.status !== "ADMIN" && user.status !== "LECTURER") {
  redirect("/not-admin")
}
  return user;
}