"use client";

import { GetMyProfileType } from "@/app/data/user/GetMyProfile";
import { EmptyState } from "@/components/general/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/useContructUrl";
import Image from "next/image";
import {
  BookOpen,
  School,
  User,
  Edit,
  Phone,
  GraduationCap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { levelLabels } from "@/lib/zodSchema";
import { cn } from "@/lib/utils";

interface iAppProps {
  data: GetMyProfileType;
}

export default function ProfileClient({ data }: iAppProps) {
  const avatarKey = data.profile?.avatarKey || "";
  const constructedUrl = useConstructUrl(avatarKey);

  if (!data.profile) {
    return (
      <EmptyState
        title="You do not have a profile yet"
        description="Create your profile to access all features of the app"
        buttonText="Create your profile"
        href="/complete-profile"
      />
    );
  }

  const profile = data.profile;
  const thumbnailUrl = profile.avatarKey
    ? constructedUrl
    : "/avatar-placeholder.png";

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md min-h-screen sm:max-w-lg">
        {/* Main Profile Card */}
        <Card className="overflow-hidden flex items-center justify-center mt-8 border-none shadow-xl bg-card">
          {/* Decorative Header/Banner */}
          <div className="h-32 w-full bg-linear-to-r from-primary/80 to-primary" />

          <CardContent className="relative pt-0">
            {/* Avatar - Floating Half-way */}
            <div className="relative -mt-12 mb-4 flex justify-between items-end px-2 sm:px-6">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden border-4 border-card shadow-lg">
                <Image
                  src={thumbnailUrl}
                  alt="profile image"
                  fill
                  className="object-cover"
                />
              </div>

              <Link
                href="/profile/EditProfile"
                className={
                  buttonVariants({ variant: "outline", size: "sm" }) +
                  " mb-2 gap-2 shadow-sm"
                }
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Link>
            </div>

            {/* Profile Identity */}
            <div className="px-2 sm:px-6 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {profile.firstName} {profile.lastName} {profile.otherName}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {profile.matricNumber || "No matric number"}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  About
                </h3>
                <p className="text-muted-foreground mb-2 leading-relaxed">
                  {profile.bio || "This user hasn't added a bio yet."}
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Stats/Info Grid */}
            <div className="px-2 mt-6 sm:px-6 grid grid-cols-1 md:grid-cols-2  gap-6 pb-6">
              {/* Academic Info Group */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Current Level
                    </p>
                    <p className="text-sm font-semibold">
                      {levelLabels[profile.level] || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <School className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Faculty
                    </p>
                    <p className="text-sm font-semibold">
                      {profile.faculty || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact/Department Info Group */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Department
                    </p>
                    <p className="text-sm font-semibold">
                      {profile.department || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Contact Number
                    </p>
                    <p className="text-sm font-semibold">
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="mt-2 p-4">
            <Link className={cn(buttonVariants(), "w-full mb-2")} href="/">
              Back to Home page
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              href="/profile/request-lecturer-badge"
            >
              Not a student? Request Lecturer Badge
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
