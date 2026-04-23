import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import "server-only";

export async function AdminGetSingleCourse(id: string) {
  const data = await prisma.course.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescription: true,
      category: true,
      chapter:{
        select:{
          id:true,
          title:true,
          position: true,
          lessons:{
            select:{
              id: true,
              title:true,
              description:true,
              thumbnailKey : true,
              position:true,
              videoKey:true
            }
          }

        }
      }
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminGetSingleCourseType = Awaited<ReturnType<typeof AdminGetSingleCourse>>;