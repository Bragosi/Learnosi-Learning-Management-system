import { z } from "zod";
import { facultyDepartments, type Faculty } from "./facultyDepartments";
export const courseLevel = [
  "LEVEL_100",
  "LEVEL_200",
  "LEVEL_300",
  "LEVEL_400",
  "LEVEL_500",
] as const;
export const courseStatus = ["PUBLISHED", "DRAFT", "ARCHIVED"] as const;

export const levelLabels: Record<(typeof courseLevel)[number], string> = {
  LEVEL_100: "100 Level",
  LEVEL_200: "200 Level",
  LEVEL_300: "300 Level",
  LEVEL_400: "400 Level",
  LEVEL_500: "500 Level",
};
const faculties = Object.keys(facultyDepartments) as Faculty[];

export const courseSchema = z
  .object({
    courseCode: z
      .string()
      .min(3, { message: "courseCode must be at least 3 characters long" })
      .max(100, { message: "courseCode must be at most 100 characters long" }),

    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters long" }),

    fileKey: z.string().min(1, { message: "File is required" }),
    level: z.enum(courseLevel, { message: "Level is required" }),

    faculty: z.enum(faculties as [Faculty, ...Faculty[]]),

    department: z.string().min(1, { message: "Department is required" }),
    courseTitle: z
      .string()
      .min(3, { message: "Course Title must be at least 3 characters long" })
      .max(200, {
        message: "Course Title must be at most 200 characters long",
      }),
    slug: z
      .string()
      .min(3, { message: "Slug must be at least 3 characters long" }),

    status: z.enum(courseStatus, { message: "Status is required" }),
  })
  .superRefine((data, ctx) => {
    const departments = facultyDepartments[data.faculty];

    const isValid = departments?.some((dept) => dept === data.department);

    if (!isValid) {
      ctx.addIssue({
        code: "custom",
        path: ["department"],
        message: "Invalid department for selected faculty",
      });
    }
  });

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 character long" }),
  courseId: z.string().uuid({ message: "Invalid course Id" }),
});

export const LectureSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 character long" }),
  courseId: z.string().uuid({ message: "Invalid Lecture Id" }),
  chapterId: z.string().uuid({ message: "Invalid Lecture Id" }),
  description: z
    .string()
    .min(3, { message: "description must be at least 3 character long" })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
  pdfKey: z.string().optional(),
});

export const ProfileSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Name must not be less than 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Name must not be less than 3 characters" }),
  otherName: z
    .string()
    .min(3, { message: "Name must not be less than 3 characters" }),

  bio: z
    .string()
    .min(3, { message: "Your Bio must be 3 character Long" })
    .max(100, { message: "Your Bio must not exceed 100 characters" }),

  phone: z
    .string()
    .min(11, { message: "Your phone Number cannot be less than 11" })
    .max(11, { message: " Your phone number cannot exceed 11" }),

  faculty: z.enum(faculties as [Faculty, ...Faculty[]]),
  department: z.string().min(1, { message: "Department is required" }),
  level: z.enum(courseLevel, { message: "Your Level is required" }),
  avatarKey: z.string().min(1, { message: "Profile Picture is required" }),
  matricNumber: z
    .string()
    .min(9, { message: " Your Matric number is required" }),
});

export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LectureSchemaType = z.infer<typeof LectureSchema>;
export type ProfileSchemaType = z.infer<typeof ProfileSchema>;