"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/Learnosi Logo.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Loader } from "lucide-react";
import { UserDropDown } from "./UserDropDown";
const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function NavBar({
  session,
}: {
  session: { user: { name: string } } | null;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    try {
      setIsLoading(true);

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
          },
          onError: () => {
            toast.error("Logout failed");
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" width={50} height={50} />
          <span className="text-lg font-bold tracking-tight">LearnOSI</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-sm text-muted-foreground">
                Hi,{" "}
                {session.user.name.charAt(0).toUpperCase() +
                  session.user.name.slice(1)}
              </span>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isLoading ? (
                  <div className="flex">
                    <h1>Logging out...</h1>
                    <span>
                      <Loader className="animate-spin size-4" />
                    </span>
                  </div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "default" })}
            >
              Get Started
            </Link>
          )}
        </div>
        {/* Right side on mobile */}
        <div className="md:hidden">
          <div className="flex items-center gap-3">
          <ThemeToggle />

          {session ? (
            <UserDropDown session={session} onLogout={handleLogout} loading={isLoading} />
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "default" })}
            >
              Get Started
            </Link>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
