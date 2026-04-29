"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, Tv2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { EnrollInCourseAction } from "../action";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


export default function EnrollButton({
  courseId,
  isEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const res = await EnrollInCourseAction(courseId);

      if (res.status === "error") {
        toast.error(res.message);
      } else {
        toast.success("Registration successful")
        router.push("/")
      }
    });
  }

    if (isEnrolled) {
    return (
    <Link href="/dashboard" className={cn(
      buttonVariants(),'w-full flex items-center'
    )} >
      <Tv2 className="size-4"/>
    Watch now
    </Link>
    );
  }
  if (isEnrolled) {
    return (
    <Link href="/dashboard" className={cn(
      buttonVariants(),'w-full flex items-center'
    )} >
      <Tv2 className="size-4"/>
    Watch now
    </Link>
    );
  }

  return (
    <Button onClick={handleClick} disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          Registering...
        </>
      ) : (
        "Register Now"
      )}
    </Button>
  );
}