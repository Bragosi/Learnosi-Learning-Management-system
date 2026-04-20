import z from "zod";

export const courseLevel = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"] as const;
export const courseStatus = ["Published", "Draft", "Archived"] as const;
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

  filekey: z.string().min(1, { message: "File is required" }),
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

