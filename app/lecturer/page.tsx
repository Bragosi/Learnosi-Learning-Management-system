import { redirect } from "next/navigation";

import { UserStatus } from "@prisma/client";

import { requireRole } from "@/lib/requireRole";
import { isLecturerProfileComplete } from "@/lib/profileStatus";

import { GetLecturerProfile } from "./GetLecturerProfile";

export default async function LecturerPage() {
  await requireRole([UserStatus.LECTURER]);

  const data = await GetLecturerProfile();

  if (!isLecturerProfileComplete(data)) {
    redirect("/lecturer/complete-profile");
  } else{
    redirect("/lecturer/profile")
  }
}