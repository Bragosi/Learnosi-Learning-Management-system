import "server-only"
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function AdminGetEnrollmentStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const last30days: { date: string; enrollment: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    last30days.push({
      date: date.toISOString().split("T")[0],
      enrollment: 0,
    });
  }
  enrollments.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    const dayIndex = last30days.findIndex((day) => day.date === enrollmentDate);

    if (dayIndex !== -1) {
      last30days[dayIndex].enrollment++;
    }
  });
  return last30days;
}
