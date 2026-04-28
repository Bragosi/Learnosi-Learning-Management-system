"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "./action";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { Loader, Trash2, AlertTriangle } from "lucide-react";

export default function DeleteCourseRoute() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [pending, startTransition] = useTransition();

  function onSubmit() {
    if (!courseId) {
      toast.error("Invalid course ID");
      return;
    }

    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else {
        toast.error(result?.message || "Failed to delete course");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md border-red-200 shadow-xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <CardTitle className="text-xl font-bold text-red-600">
            Delete Course
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this course? This action is
            <span className="font-semibold text-red-600"> permanent</span> and
            cannot be undone.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            ⚠️ All chapters, lectures, and related data will also be removed.
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/admin/courses"
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>

            <Button
              variant="destructive"
              onClick={onSubmit}
              disabled={pending}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}