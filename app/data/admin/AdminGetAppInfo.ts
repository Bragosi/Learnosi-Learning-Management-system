import { prisma } from "@/lib/prisma";
import "server-only"
export async function TotalAppUsers() {
  const [totalUsers, totalStudents, totalLecturers, totalAdmins, totalCourses, totalLectures] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "STUDENT" } }),
      prisma.user.count({ where: { status: "LECTURER" } }),
      prisma.user.count({ where: { status: "ADMIN" } }),
      prisma.course.count(),
      prisma.lecture.count()
    ]);

  return {
    totalUsers,
    totalStudents,
    totalLecturers,
    totalAdmins,
    totalCourses,
    totalLectures
  };
}
