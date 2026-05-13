"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { RemoveStudentAccess } from "../action";
import { tryCatch } from "@/hooks/try-catch";

import { ApprovedStudent } from "@prisma/client";

interface iAppProps {
  student: ApprovedStudent;
  onSuccess?: () => void;
}

export function RevokeUserAccess({ student, onSuccess }: iAppProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        RemoveStudentAccess(student.id)
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Revoke student access?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-primary">
              {student.firstName} {student.lastName}
            </span>{" "}
            ({student.matricNumber}) from approved access.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin size-4" />
                Revoking...
              </div>
            ) : (
              "Revoke Access"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}