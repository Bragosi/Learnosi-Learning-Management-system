import {
  BookOpen,
  ChevronDownIcon,
  Home,
  LayoutDashboardIcon,
  LogOutIcon,
  User2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type Props = {
  session: {
    user: {
      name?: string;
      email?: string;
      image?: string;
    };
  } | null;
  onLogout: () => void;
  loading?: boolean;
};

export function UserDropDown({ session, onLogout, loading }: Props) {
  if (!session || loading) return null;

  const name = session.user.name || "User";
  const email = session.user.email || "";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedName =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-1 hover:bg-accent"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              alt={name}
              src={session.user.image || "/origin/avatar.jpg"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <ChevronDownIcon className="opacity-60" size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <span className="truncate text-sm font-medium">{formattedName}</span>
          <span className="truncate text-xs text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2 w-full">
              <Home size={16} className="opacity-60" />
              Home
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/courses" className="flex items-center gap-2 w-full">
              <BookOpen size={16} className="opacity-60" />
              Courses
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2 w-full">
              <User2 size={16} className="opacity-60" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2 w-full">
              <LayoutDashboardIcon size={16} className="opacity-60" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center gap-2 text-red-500 focus:text-red-500"
        >
          <LogOutIcon size={16} className="opacity-60" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
