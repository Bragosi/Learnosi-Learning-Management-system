import { prisma } from "@/lib/prisma";

export async function AdminGetApprovedStudents() {
  const data = await prisma.approvedStudent.findMany({
select: {
  id: true,
  firstName: true,
  lastName: true,
  otherName: true,
  faculty: true,
  department: true,
  matricNumber: true,
  createdAt: true,
  updatedAt: true,
  claimedByUserId: true,
},
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export type AdminGetApprovedStudentsType = Awaited<
  ReturnType<typeof AdminGetApprovedStudents>
>;