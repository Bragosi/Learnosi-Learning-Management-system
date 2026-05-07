"use client";

import { AdminGetSpecificRequestType } from "@/app/data/admin/AdminGetSpecificRequest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConstructUrl } from "@/hooks/useContructUrl";
import {
  BookOpen,
  School,
  Mail,
  Phone,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { UserStatus } from "@prisma/client";
import { tryCatch } from "@/hooks/try-catch";
import { ChangeUserStatus } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";

interface iAppProps {
  data: AdminGetSpecificRequestType | null;
}

export default function RequestChangeClient({ data }: iAppProps) {
  const [status, setStatus] = useState(data?.user.status ?? "STUDENT");
  const thumbnailUrl = useConstructUrl(data?.profilePicture ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Request not found or may have been deleted.
      </div>
    );
  }

  const userId = data.user.id;

  function OnSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        ChangeUserStatus(userId, status),
      );

      if (error) {
        console.error("Failed to change user status", error);
        return;
      }
      if (result?.status === "success") {
        toast.success(result.message);
        router.push("/admin/badge-requests");
      } else {
        toast.error(result?.message || "Failed to delete course");
      }
    });
  }
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card className="shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl md:text-2xl">
            <span className="text-primary font-semibold">{data.firstName}</span>{" "}
            requested a Lecturer Badge
          </CardTitle>

          <CardDescription className="text-sm md:text-base leading-relaxed">
            <span className="font-semibold text-destructive">Important:</span>{" "}
            Approving this request grants access to lecturer tools and academic
            resources. Ensure credentials and profile details are properly
            verified before approval.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profile + Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image */}
        <Card className="md:col-span-1 flex flex-col items-center justify-center p-6">
          <div className="relative mt-0 w-70 h-70 mx-auto overflow-hidden rounded-2xl border shadow-sm">
            <Image
              src={thumbnailUrl}
              alt="Profile Picture"
              width={200}
              height={20}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-center">
            {data.firstName} {data.lastName}
          </h2>

          <p className="text-sm text-muted-foreground text-center">
            {data.post}
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeCheck className="w-4 h-4 text-primary" />
            Lecturer Verification Request
          </div>
        </Card>

        {/* Details */}
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-sm uppercase">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {data.email}
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {data.phone}
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-sm uppercase">
                Academic Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{data.employeeId}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Faculty</p>
                  <p className="font-medium flex items-center gap-2">
                    <School className="w-4 h-4" />
                    {data.faculty}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {data.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-primary text-sm uppercase">
                Professional Summary
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {data.professionalSummary && (
                  <RenderDescription
                    json={JSON.parse(data.professionalSummary)}
                  />
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center"
              disabled
            >
              <h1>Learnosi Status :</h1>
              <span className="truncate">{data.user.status}</span>
            </Button>
            <div className="flex items-center justify-between">
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value as UserStatus);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Change User Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="LECTURER">Lecturer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={OnSubmit} disabled={pending}>
                {pending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin size-4" />
                    <p>Updating</p>
                  </div>
                ) : (
                  <p>Change Status</p>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
