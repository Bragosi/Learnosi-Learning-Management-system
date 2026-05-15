
"use client";

import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Mail,
  Building2,
  MapPin,
  BadgeCheck,
  User2,
  Edit,
  BookOpen,
} from "lucide-react";
import { EmptyState } from "@/components/general/EmptyState";
import { useConstructUrl } from "@/hooks/useContructUrl";
import { GetAdminProfileType } from "@/app/data/admin/GetAdminProfile";

interface iAppProps {
  data: GetAdminProfileType;
}

export default function AdminProfileClient({ data }: iAppProps) {
  const profile = data.adminProfile;
  const avartarKey = profile?.profilePicture || " ";
  const profilekey = useConstructUrl(avartarKey);

  if (!profile) {
    return (
      <EmptyState
        title="Lecturer Profile not found"
        description="The lecturer probably did not provide any information"
        buttonText="Back to home page"
        href="/"
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
                  {profile.profilePicture ? (
                    <Image
                      src={profilekey}
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

                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary">{profile.department}</Badge>

                    {profile.verified && (
                      <Badge className="flex items-center gap-1">
                        <BadgeCheck className="size-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* EDIT BUTTON */}
              <Link className={buttonVariants()} href="/admin/profile/edit-profile">
                <Edit />
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
              <h2 className="text-lg text-primary font-semibold">
                Personal Information
              </h2>
            </CardHeader>

            <CardContent className="space-y-4">
              <InfoRow label="Full Name">
                {profile.firstName} {profile.lastName} {profile.otherName}
              </InfoRow>

              <InfoRow label="Email">
                <Mail className="mr-2 size-4 text-primary" />
                {profile.email}
              </InfoRow>

              <InfoRow label="Employee ID">{profile.employeeId}</InfoRow>
            </CardContent>
          </Card>

          {/* ACADEMIC INFO */}
          <Card>
            <CardHeader>
              <h2 className="text-lg text-primary font-semibold">
                Academic Information
              </h2>
            </CardHeader>

            <CardContent className="space-y-4">
              <InfoRow label="Faculty">
                <Building2 className="mr-2 size-4 text-primary" />
                {profile.faculty}
              </InfoRow>

              <InfoRow label="Department">
                <BookOpen className="mr-2 size-4 text-primary" />
                {profile.department}
              </InfoRow>

              <InfoRow label="Office Location">
                <MapPin className="mr-2 size-4 text-primary" />
                {profile.officeLocation || "Not set"}
              </InfoRow>
            </CardContent>
          </Card>
        </div>

        {/* BIO */}
        <Card>
          <CardHeader>
            <h2 className="text-lg text-primary font-semibold">About</h2>
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
      <span className="text-xs text-muted-foreground">{label}</span>

      <div className="flex items-center text-sm font-medium">{children}</div>

      <Separator />
    </div>
  );
}
