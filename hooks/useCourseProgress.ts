"use client"

import { CourseSideBarDataType } from "@/app/data/PublicCourse/GetCourseSideBarData";
import { useMemo } from "react";

interface iAppProps {
  courseData: CourseSideBarDataType["course"];
}

interface CourseProgressResult {
  totalLecture: number;
  completedLecture: number;
  progressPercentage: number;
}

export function useCourseProgress({
  courseData,
}: iAppProps): CourseProgressResult {
  return useMemo(() => {
    let totalLectures = 0;
    let completedLectures = 0;

    courseData.chapters.forEach((chapter) => {
      chapter.lectures.forEach((lecture) => {
        totalLectures++;

        const isCompleted = lecture.lectureProgress.some(
          (progress) =>
            progress.lectureId === lecture.id && progress.completed
        );

        if (isCompleted) {
          completedLectures++;
        }
      });
    });

    const progressPercentage =
      totalLectures > 0
        ? Math.round((completedLectures / totalLectures) * 100)
        : 0;

    return {
      totalLecture: totalLectures,
      completedLecture: completedLectures,
      progressPercentage,
    };
  }, [courseData]);
}