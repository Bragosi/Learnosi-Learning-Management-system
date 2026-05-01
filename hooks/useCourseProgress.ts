"use client"
import { useMemo } from "react";

// 1. Define only the data structure this hook actually needs
interface CourseProgressData {
  chapters: {
    lectures: {
      id: string;
      lectureProgress?: { // Notice the '?' just in case it's undefined
        lectureId: string;
        completed: boolean;
      }[];
    }[];
  }[];
}

interface iAppProps {
  courseData: CourseProgressData;
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

        // 2. Add optional chaining (?.) here in case lectureProgress is missing
        const isCompleted = lecture.lectureProgress?.some(
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