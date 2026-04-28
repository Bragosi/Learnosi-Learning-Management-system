import { adminGetLecture } from "@/app/data/admin/admin-get-lecture";
import { LectureForm } from "./_components/LectureForm";
import { requireRole } from "@/lib/requireRole";
import { UserStatus } from "@prisma/client";

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lectureId: string;
}>;

export default async function LectureIdPage({ params }: { params: Params }) {
  await requireRole([UserStatus.LECTURER, UserStatus.ADMIN]);
  const { chapterId, courseId, lectureId } = await params;
  const lecture = await adminGetLecture(lectureId);

  return (
    <LectureForm data={lecture} chapterId={chapterId} courseId={courseId} />
  );
}
