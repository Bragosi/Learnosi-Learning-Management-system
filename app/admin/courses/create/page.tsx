import { requireRole } from "@/lib/requireRole";
import { UserStatus } from "@prisma/client";
import CreateCourseClient from "./CreateCourseClient";

export default async function CreateCoursePage() {
  await requireRole([UserStatus.LECTURER, UserStatus.ADMIN]);

  return <CreateCourseClient />;
}