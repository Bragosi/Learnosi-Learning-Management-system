import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HomeClient from "@/components/HomeClient";
import { GetMyProfile } from "../data/user/GetMyProfile";
import { isProfileComplete } from "@/lib/profileStatus";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <HomeClient session={session} />;
  }

  const data = await GetMyProfile();

  // 1. ROLE-BASED REDIRECT FIRST (highest priority)
  if (data.status === "ADMIN") {
    redirect("/admin");
  }

  if (data.status === "LECTURER") {
    redirect("/lecturer");
  }

  // 2. PROFILE COMPLETION ONLY FOR STUDENTS
  if (!isProfileComplete(data)) {
    redirect("/complete-profile");
  }

  return <HomeClient session={session} />;
}