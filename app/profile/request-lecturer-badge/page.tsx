import { RequireUser } from "@/app/data/user/requireUser";
import { prisma } from "@/lib/prisma";
import LecturerRequestForm from "./LecturerRequestForm";
import { EmptyState } from "@/components/general/EmptyState";

export default async function Page() {
  const session = await RequireUser();

  if (!session?.id) {
    return (
      <EmptyState
        title="Unauthorized"
        description="Please login"
        buttonText="Go to Login page"
        href="/login"
      />
    );
  }

  const existingRequest = await prisma.lecturerRequest.findUnique({
    where: { userId: session.id },
  });

  if (existingRequest) {
    return (
      <EmptyState
        title="Request Already Submitted"
        description="You’ve already submitted a lecturer request. Please wait for approval."
        buttonText="Go to homepage"
        href="/"
      />
    );
  }

  return <LecturerRequestForm />;
}
