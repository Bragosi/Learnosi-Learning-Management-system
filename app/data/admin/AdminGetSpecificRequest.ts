import { prisma } from "@/lib/prisma";

export async function AdminGetSpecificRequest(requestId: string) {
  const data = await prisma.lecturerRequest.findUnique({
    where: {
      id: requestId,
    },
    select: {
      id: true,
      profilePicture: true,
      firstName: true,
      lastName: true,
      otherName: true,
      faculty: true,
      department: true,
      email: true,
      employeeId: true,
      post: true,
      phone: true,
      professionalSummary: true,
      status: true,
      user: {
        select: {
            id: true,
            email: true,
          status: true,
        },
      },
    },     
  });
  return data;
}

export type AdminGetSpecificRequestType = Awaited<
  ReturnType<typeof AdminGetSpecificRequest>
>;
