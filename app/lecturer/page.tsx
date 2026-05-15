import { redirect } from "next/navigation";

import { isLecturerProfileComplete } from "@/lib/profileStatus";

import { GetLecturerProfile } from "../data/lecturer/GetLecturerProfile";
import { requireLecturer } from "@/lib/requireLecturer";

export default async function LecturerPage() {
  await requireLecturer()

  const data = await GetLecturerProfile();

  if (!isLecturerProfileComplete(data)) {
    redirect("/lecturer/complete-profile");
  } else{
    redirect("/lecturer/profile")
  }
}