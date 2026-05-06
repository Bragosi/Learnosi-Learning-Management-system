import { AdminGetLecturerBadgeRequestsType } from "@/app/data/admin/AdminGetLecturerBadgeRequests";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/useContructUrl";;
import {
  ArrowRight,
  BookOpen,
  IdCard,
  MoreVerticalIcon,
  School,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: AdminGetLecturerBadgeRequestsType[number];
}

export function LecturerRequestCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.profilePicture);

  return (
    <Card className="group mt-0 p-0 relative overflow-hidden border hover:shadow-xl transition-all duration-300 rounded-2xl">
      {/* Dropdown */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/badge-requests/${data.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 👤 User Info */}
      <div className="relative mt-0 aspect-video overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt="Profile Picture"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
        {/* Content */}
        <CardContent className="flex flex-col justify-between flex-1 p-5 space-y-5">
          {/* Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <User className="size-5 text-primary" />
            </div>
            <p className="font-semibold text-base leading-tight line-clamp-1">
              {data.firstName} {data.lastName}{" "}
              {data.otherName && data.otherName}
            </p>
          </div>

          {/* Info */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <IdCard className="size-4" />
              </div>
              <span className="truncate">{data.employeeId}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <School className="size-4" />
              </div>
              <span className="truncate">{data.faculty}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <BookOpen className="size-4" />
              </div>
              <span className="truncate">{data.department}</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/admin/badge-requests/${data.id}`}
            className={buttonVariants({
              className:
                "w-full mt-2 rounded-xl shadow-sm hover:shadow-md transition flex items-center justify-center gap-2",
            })}
          >
            Review Request
            <ArrowRight className="size-4" />
          </Link>
        </CardContent>
    </Card>
  );
}

export function LecturerRequestCardSkeleton() {
  return (
    <Card className="relative overflow-hidden py-0 gap-0 border-muted">
      {/* Top right menu */}
      <div className="absolute top-2 right-2 z-10">
        <Skeleton className="size-8 rounded-md" />
      </div>

      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <CardContent className="p-4">
        {/* Course Code (Title) */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-2/3" />
        </div>

        {/* Course Title */}
        <div className="mt-1 space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Meta Info */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
