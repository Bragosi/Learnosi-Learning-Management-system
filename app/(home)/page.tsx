import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <HomeClient session={session} />;
}