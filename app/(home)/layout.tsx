import { ReactNode } from "react";
import NavBar from "./_components/NavBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export default async function HomeLayout({children}: {children: ReactNode}) {
        const session = await auth.api.getSession({
      headers: await headers(),
        })
    return(
        <div>
        <NavBar session={session} />
        <main className="container mx-auto px-4 md:px-6 lg:px-8">{children}</main>
        </div>
    )
}