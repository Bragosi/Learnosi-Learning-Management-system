import { buttonVariants } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";
import Link from "next/link";

export default function LecturerState() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full p-6 max-w-md rounded-2xl border border-dashed text-center animate-in fade-in-50">
        
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-10 text-primary" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold tracking-tight">
          Request Submitted
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your lecturer verification request has been submitted successfully.
          Our administration team will review your application shortly.
          Come back in the next 3 hours
        </p>

        <div className="mt-8">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            <Home className="mr-2 size-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}