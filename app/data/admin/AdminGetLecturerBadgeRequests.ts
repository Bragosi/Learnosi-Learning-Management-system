"use server";

import { prisma } from "@/lib/prisma";

export async function AdminGetLecturerBadgeRequests() {
  const data = await prisma.lecturerRequest.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      otherName: true,
      email: true,
      faculty: true,
      department: true,
      employeeId: true,
      post: true,
      phone: true,
      profilePicture: true,
      createdAt : true,
      professionalSummary: true,
    },
    orderBy :{
        createdAt : "desc"
    }
  });
  return data;
}

export type AdminGetLecturerBadgeRequestsType = Awaited<
  ReturnType<typeof AdminGetLecturerBadgeRequests>
>;
