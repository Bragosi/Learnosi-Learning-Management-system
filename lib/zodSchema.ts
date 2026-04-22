import { z } from "zod";

// 1. Change these to match your Prisma Enums EXACTLY
export const courseLevel = ["LEVEL_100", "LEVEL_200", "LEVEL_300", "LEVEL_400", "LEVEL_500"] as const;
export const courseStatus = ["PUBLISHED", "DRAFT", "ARCHIVED"] as const;

// 2. Create a Helper for your UI labels so you don't lose the "pretty" text
export const levelLabels: Record<typeof courseLevel[number], string> = {
  LEVEL_100: "100 Level",
  LEVEL_200: "200 Level",
  LEVEL_300: "300 Level",
  LEVEL_400: "400 Level",
  LEVEL_500: "500 Level",
};
export const courseCategory = [
  'Computing',
  'Engineering',
  'Agriculture',
  'Health',
  'Environmental',
  'Life Sciences',
  'Physical Sciences',
] as const;
export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),

fileKey: z.string().min(1, { message: "File is required" }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1$" }),

  duration: z.coerce
    .number()
    .min(1)
    .max(500, { message: "Duration must be between 1 and 500 hours" }),

  level: z.enum(courseLevel, { message: "Level is required" }),

  category: z.enum(courseCategory,{message :'Category is Required'}),

  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters long" })
    .max(200, {
      message: "Small description must be at most 200 characters long",
    }),

  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" }),

  status: z.enum(courseStatus, { message: "Status is required" }),
});

