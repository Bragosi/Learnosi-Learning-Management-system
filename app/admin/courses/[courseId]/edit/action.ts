"use server";

import { ApiResponse } from "@/lib/types";
import { CourseSchemaType } from "../../create/action";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  LectureSchema,
} from "@/lib/zodSchema";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";

export async function EditCourse(
  data: CourseSchemaType,
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Course Update Successful",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to Edit Course",
    };
  }
}

export async function reOrderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons Provided for reordering",
      };
    }

    const updates = lessons.map((lessons) =>
      prisma.lecture.update({
        where: {
          id: lessons.id,
          chapterId: chapterId,
        },
        data: {
          position: lessons.position,
        },
      }),
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lessons Successfully Reordered",
    };
  } catch {
    return {
      status: "error",
      message: " Failed to reorder Lessons",
    };
  }
}

export async function reOrderChapters(
  courseId: string,
  chapters: { id: string; position: number }[],
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No lessons Provided for reordering",
      };
    }
    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: chapter.position,
        },
      }),
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapters Successfully Reordered",
    };
  } catch {
    return {
      status: "error",
      message: " Failed to reorder Lessons",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }
    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });
      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter Created Successfully",
    };
  } catch {
    return {
      status: "error",
      message: " Failed to Create Chapter",
    };
  }
}

export async function createLecture(
  values: ChapterSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = LectureSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }
    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lecture.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });
      await tx.lecture.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
          chapterId: result.data.chapterId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lecture Created Successfully",
    };
  } catch {
    return {
      status: "error",
      message: " Failed to Create Lecture",
    };
  }
}

export async function deleteLecture({
  chapterId,
  courseId,
  lectureId,
}: {
  chapterId: string;
  courseId: string;
  lectureId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const chapterWithLecture = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lectures: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!chapterWithLecture) {
      return {
        status: "error",
        message: "Chapter not Found",
      };
    }

    const lectures = chapterWithLecture.lectures;

    const lectureToDelete = lectures.find(
      (lecture) => lecture.id === lectureId,
    );

    if (!lectureToDelete) {
      return {
        status: "error",
        message: "Lecture Not found with Chapter",
      };
    }

    const remainingLectures = lectures.filter(
      (lecture) => lecture.id !== lectureId,
    );

    const updates = remainingLectures.map((lecture, index) =>
      prisma.lecture.update({
        where: { id: lecture.id },
        data: { position: index + 1 },
      }),
    );

    await prisma.$transaction([
      prisma.lecture.delete({
        where: {
          id: lectureId,
        },
      }),
      ...updates,
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lecture deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to Delete Lecture",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    const chapters = courseWithChapters.chapters;

    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId,
    );

    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not found in course",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId,
    );

    const updates = remainingChapters.map((chapter, index) =>
      prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 },
      }),
    );

    await prisma.$transaction([
      prisma.chapter.delete({
        where: {
          id: chapterId,
        },
      }),
      ...updates,
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}
