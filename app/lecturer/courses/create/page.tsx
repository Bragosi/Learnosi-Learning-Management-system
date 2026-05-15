import { requireLectureCompleteProfile } from "@/lib/requireLecturerCompleteProfile";
import CreateCourseClient from "./CreateCourseClient";

export default async function CreateCoursePage() {
  await requireLectureCompleteProfile()

  return <CreateCourseClient />;
}