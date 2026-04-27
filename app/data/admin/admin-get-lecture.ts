import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";


export async function adminGetLecture(id: string) {
  const data = await prisma.lecture.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      videoKey: true,
      thumbnailKey: true,
      id: true,
      position: true,
      pdfKey: true,
      description : true
    },
  });

  if (!data) {
    return notFound(); 
  }

  return data;
}

export type AdminLectureType = Awaited<ReturnType<typeof adminGetLecture>>;