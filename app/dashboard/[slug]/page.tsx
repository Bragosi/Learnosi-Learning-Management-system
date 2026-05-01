import { GetCourseSideBarData } from "@/app/data/PublicCourse/GetCourseSideBarData";
import { redirect } from "next/navigation";
import { AlertCircle, BookOpen } from "lucide-react";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;
  const course = await GetCourseSideBarData(slug);

  const firstChapter = course.course.chapters?.[0];
  const firstLecture = firstChapter?.lectures?.[0];

  if (firstLecture) {
    redirect(`/dashboard/${slug}/${firstLecture.id}`);
  }

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border bg-card shadow-sm">
        
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-muted">
            <BookOpen className="size-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            No Lecture Available
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This course does not have any lecture yet. Lectures will appear here
            once they are added by the instructor.
          </p>
        </div>

        {/* Hint box */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted text-left text-sm">
          <AlertCircle className="size-4 mt-0.5 text-muted-foreground" />
          <span className="text-muted-foreground">
            Please check back later or contact your course admin.
          </span>
        </div>

      </div>
    </div>
  );
}