import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HomeClient from "@/components/HomeClient";
import { GetMyProfile } from "../data/user/GetMyProfile";
import { isProfileComplete } from "@/lib/profileStatus";
import { redirect } from "next/dist/client/components/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    const data = await GetMyProfile();

    if (!isProfileComplete(data)) {
      redirect("/complete-profile");
    }
  }
  return <HomeClient session={session} />;
}
