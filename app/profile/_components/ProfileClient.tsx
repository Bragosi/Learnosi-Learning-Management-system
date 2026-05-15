"use client";

import Image from "next/image";
import Link from "next/link";

import { GetMyProfileType } from "@/app/data/user/GetMyProfile";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  BookOpen,
  School,
  User2,
  Edit,
  Phone,
  GraduationCap,
} from "lucide-react";

import { EmptyState } from "@/components/general/EmptyState";
import { useConstructUrl } from "@/hooks/useContructUrl";
import { levelLabels } from "@/lib/zodSchema";

interface iAppProps {
  data: GetMyProfileType;
}

export default function ProfileClient({ data }: iAppProps) {
  const profile = data.profile;

  const avatarKey = profile?.avatarKey || "";
  const profileKey = useConstructUrl(avatarKey);

  if (!profile) {
    return (
      <EmptyState
        title="You do not have a profile yet"
        description="Create your profile to access all features of the app"
        buttonText="Create your profile"
        href="/complete-profile"
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* HEADER CARD */}
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="bg-background p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* PROFILE INFO */}
              <div className="flex items-center gap-4">
                <div className="relative size-20 overflow-hidden rounded-full border bg-muted">
                  {profile.avatarKey ? (
                    <Image
                      src={profileKey}
                      alt="profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User2 className="m-auto size-10 text-muted-foreground" />
                  )}
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </h1>

                  <p className="text-sm text-muted-foreground">
                    {profile.matricNumber}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-primary">
                      {profile.department}
                    </Badge>

                    <Badge variant="secondary">
                      {levelLabels[profile.level]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* EDIT BUTTON */}
              <Link
                className={buttonVariants()}
                href="/profile/EditProfile"
              >
                <Edit className="mr-2 size-4" />
                Edit Profile
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* DETAILS GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* PERSONAL INFO */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-primary">
                Personal Information
              </h2>
            </CardHeader>

            <CardContent className="space-y-4">
              <InfoRow label="Full Name">
                {profile.firstName} {profile.lastName}{" "}
                {profile.otherName || ""}
              </InfoRow>

              <InfoRow label="Matric Number">
                <GraduationCap className="mr-2 size-4 text-primary" />
                {profile.matricNumber}
              </InfoRow>

              <InfoRow label="Phone Number">
                <Phone className="mr-2 size-4 text-primary" />
                {profile.phone || "Not set"}
              </InfoRow>
            </CardContent>
          </Card>

          {/* ACADEMIC INFO */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-primary">
                Academic Information
              </h2>
            </CardHeader>

            <CardContent className="space-y-4">
              <InfoRow label="Faculty">
                <School className="mr-2 size-4 text-primary" />
                {profile.faculty}
              </InfoRow>

              <InfoRow label="Department">
                <BookOpen className="mr-2 size-4 text-primary" />
                {profile.department}
              </InfoRow>

              <InfoRow label="Level">
                <GraduationCap className="mr-2 size-4 text-primary" />
                {levelLabels[profile.level]}
              </InfoRow>
            </CardContent>
          </Card>
        </div>

        {/* BIO */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-primary">
              About
            </h2>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              {profile.bio || "No bio provided yet."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* Reusable Row Component */
function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <div className="flex items-center text-sm font-medium">
        {children}
      </div>

      <Separator />
    </div>
  );
}