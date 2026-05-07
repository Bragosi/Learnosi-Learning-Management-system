import { prisma } from "./prisma";

export async function assertCourseOwnership(courseId: string, lecturerId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.userId !== lecturerId) {
    throw new Error("Forbidden: You do not own this course");
  }

  return course;
}