import { Faculty } from "@/lib/facultyDepartments";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import "server-only"

export async function AdminGetRecentCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    select: {
      id: true,
      courseCode: true,
      courseTitle: true,
      description: true,
      level: true,
      status: true,
      fileKey: true,
      slug: true,
      faculty: true,
      department: true,
    },
  });
  return data.map((course) => ({
    ...course,
    faculty: course.faculty as Faculty,
  }));
}
