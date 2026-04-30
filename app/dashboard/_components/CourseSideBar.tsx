"use client";

import { CourseSideBarDataType } from "@/app/data/PublicCourse/GetCourseSideBarData";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import LectureItem from "./LectureItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/useCourseProgress";

interface iAppProps {
  course: CourseSideBarDataType["course"];
}

export function CourseSideBar({ course }: iAppProps) {
  const pathName = usePathname();
  const currentLectureId = pathName.split("/").pop();

  const { completedLecture, totalLecture, progressPercentage } =
    useCourseProgress({ courseData: course });

  return (
    <aside className="flex flex-col h-full bg-background border-r border-border">
      {/* HEADER */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm leading-tight truncate">
              {course.courseTitle}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {course.faculty}
            </p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              Progress
            </span>
            <span className="font-medium">
              {completedLecture}/{totalLecture} lectures
            </span>
          </div>

          <Progress value={progressPercentage} className="h-2" />

          <p className="text-xs text-muted-foreground">
            {progressPercentage}% completed
          </p>
        </div>
      </div>

      {/* CHAPTERS */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <div className="rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full p-3 h-auto flex items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronDown className="size-4 text-primary shrink-0" />
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {chapter.position}. {chapter.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {chapter.lectures.length} lectures
                      </p>
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="px-2 pb-3 space-y-1">
                {chapter.lectures.map((lecture) => (
                  <LectureItem
                    key={lecture.id}
                    lecture={lecture}
                    slug={course.slug}
                    isActive={currentLectureId === lecture.id}
                    completed={
                      lecture.lectureProgress?.some(
                        (progress) => progress.completed
                      ) || false
                    }
                  />
                ))}
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </aside>
  );
}