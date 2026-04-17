"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function HomeClient({
  session,
}: {
  session: { user: { name: string } } | null;
}) {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Logged out successfully");
        },
      },
    });
    setIsLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl text-red-400">Hello world</h1>
      <ThemeToggle />

      {session ? (
        <div>
          <p>{session.user.name}</p>
          <Button disabled={isloading} onClick={handleLogout}>
            {isloading ? (
              <div>
                <Loader className="size-4 animate-spin" />
                <p>Logging out...</p>
              </div>
            ) : (
              "Logout"
            )}
          </Button>
        </div>
      ) : (
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Login
        </Link>
      )}
    </div>
  );
}
